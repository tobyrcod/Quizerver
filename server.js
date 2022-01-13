const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require('fs');

app.use(express.static('client'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const JSONpath = 'JSON/';
const info = JSON.parse(fs.readFileSync(JSONpath + 'info.json'));
const questions = JSON.parse(fs.readFileSync(JSONpath + 'questions.json'));
const authors = JSON.parse(fs.readFileSync(JSONpath + 'authors.json'));
const ownerships = JSON.parse(fs.readFileSync(JSONpath + 'ownerships.json'));

app.get('/get-question-set/', (req, res) => {
  const query = req.query;
  console.log(query);
  function matchQuery (question) {
    if (query.genre === 'all') return true;
    return question.genre === query.genre;
  };

  // TODO: user list.filter and a filter condition
  let questionSet = [...questions].filter(matchQuery);
  questionSet = Array.from(questionSet, q => q.question_id);

  // Randomise the order of the question set
  // Fisher–Yates shuffle
  // https://lodash.com/docs/4.17.15#shuffle
  questionSet = _.shuffle(questionSet);

  // Get first n elements of the questionSet,
  // where n is the number of questions requested
  // https://lodash.com/docs/4.17.15#slice
  questionSet = _.slice(questionSet, 0, query.count);

  // Return the question set to the user
  res.json(questionSet);
});

// TODO: add error trapping to this!
app.get('/qfqid/:id', (req, res) => {
  const params = req.params;
  const questionId = parseInt(params.id);
  const question = questions.find(question => question.question_id === questionId);
  res.json(question);
});

// TODO: add error trapping to this!
app.get('/afqid/:id', (req, res) => {
  const params = req.params;
  const questionId = parseInt(params.id);
  const ownership = ownerships.find(owner => owner.question_id === questionId);
  const authorId = parseInt(ownership.author_id);
  const author = authors.find(author => author.author_id === authorId);
  res.json(author);
});

app.post('/upvote', (req, res) => {
  const questionId = req.body.question_id;
  const questionIndex = questions.findIndex(question => question.question_id === questionId);
  questions[questionIndex].rating.likes += 1;
  fs.writeFileSync(JSONpath + 'questions.json', JSON.stringify(questions, null, 2));

  // Send a Responce to the POST request
  res.json({
    status: 'success',
    data: {
      likes: questions[questionIndex].rating.likes
    }
  });
});

app.post('/downvote', (req, res) => {
  const questionId = req.body.question_id;
  const questionIndex = questions.findIndex(question => question.question_id === questionId);
  questions[questionIndex].rating.dislikes += 1;
  fs.writeFileSync(JSONpath + 'questions.json', JSON.stringify(questions, null, 2));

  // Send a Responce to the POST request
  res.json({
    status: 'success',
    data: {
      dislikes: questions[questionIndex].rating.dislikes
    }
  });
});

// TODO: abstract file management methods to a
// 'Database' object
function MakeNewAuthor (authorName) {
  const authorId = info.author_info.counter;
  info.author_info.counter += 1;

  const newAuthor = {
    author_id: authorId,
    name: authorName
  };

  authors.push(newAuthor);
  fs.writeFileSync(JSONpath + 'authors.json', JSON.stringify(authors, null, 2));

  // Return the index of the new author
  return authors.length - 1;
}

// TODO: abstract file management methods to a
// 'Database' object
// TODO: dont allow questions that are empty to be added
function MakeNewQuestion (question, answer, genre, authorName) {
  const questionId = info.question_info.counter;
  info.question_info.counter += 1;

  const newQuestion = {
    question_id: questionId,
    question: question,
    answer: answer,
    genre: genre,
    rating: {
      likes: 0,
      dislikes: 0
    }
  };

  questions.push(newQuestion);

  // Get the index of the author from the name
  let authorIndex = authors.findIndex(author => author.name === authorName);
  // If they dont already exist
  if (authorIndex === -1) {
    // Make a new author with the given name
    authorIndex = MakeNewAuthor(authorName);
  }
  // Get the Id of the author at that index
  const authorId = authors[authorIndex].author_id;

  // Add a new ownership to the database
  MakeNewOwnership(questionId, authorId);

  fs.writeFileSync(JSONpath + 'ownerships.json', JSON.stringify(ownerships, null, 2));
  fs.writeFileSync(JSONpath + 'questions.json', JSON.stringify(questions, null, 2));
  fs.writeFileSync(JSONpath + 'info.json', JSON.stringify(info, null, 2));
}

// TODO: abstract file management methods to a
// 'Database' object
function MakeNewOwnership (questionId, authorId) {
  // Get a new unique ownershipID
  const ownershipId = info.ownership_info.counter;
  info.ownership_info.counter += 1;

  const newOwnership = {
    ownership_id: ownershipId,
    question_id: questionId,
    author_id: authorId
  };
  ownerships.push(newOwnership);
}

app.post('/add-question/', (req, res) => {
  const query = req.query;
  console.log(query);

  MakeNewQuestion(query.question, query.answer, query.genre, query.authorName);

  // Send a Responce to the POST request
  res.json({
    status: 'success'
  });
});

// 404 page
app.use((req, res) => {
  res.status(404).send('404');
});

// listen to requests
app.listen(3000);
