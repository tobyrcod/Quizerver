// TODO: Comment everything to make peer review easier
const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require('fs');

app.use(express.static('client'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const JSONPath = 'JSON/';
const info = JSON.parse(fs.readFileSync(JSONPath + 'info.json'));
const questions = JSON.parse(fs.readFileSync(JSONPath + 'questions.json'));
const authors = JSON.parse(fs.readFileSync(JSONPath + 'authors.json'));
const ownerships = JSON.parse(fs.readFileSync(JSONPath + 'ownerships.json'));

// Gets the possible question genres
// Returns status: 200 or 404
app.get('/get-genres', (req, res) => {
  if (info.question_info.genres === undefined) {
    res.status(404).send();
  } else {
    res.header('Content-Type', 'application/json');
    res.status(200).json(info.question_info.genres);
  }
});

// Gets the authors
// Returns status: 200 or 404
app.get('/get-authors', (req, res) => {
  if (authors === undefined) {
    res.status(404).send();
  } else {
    res.header('Content-Type', 'application/json');
    res.status(200).json(authors);
  }
});

// Gets the possible question sorting methods
// Returns status: 200 or 404
app.get('/get-question-sorts', (req, res) => {
  if (info.question_info.sorts === undefined) {
    res.status(404).send();
  } else {
    res.header('Content-Type', 'application/json');
    res.status(200).json(info.question_info.sorts);
  }
});

// Gets the possible author sorting methods
// Returns status: 200 or 404
app.get('/get-author-sorts', (req, res) => {
  if (info.author_info.sorts === undefined) {
    res.status(404).send();
  } else {
    res.header('Content-Type', 'application/json');
    res.status(200).json(info.author_info.sorts);
  }
});

// Gets a list of information about all questions which match
// a given search query
// Returns status: 200 or 400
app.get('/get-question-info-set/', (req, res) => {
  // Get the data from the request via the query
  const query = req.query;
  // See if the request is valid
  try {
    // Test to make sure the query has an author
    if (query.authorId === undefined || query.authorId === '') {
      throw new Error('Author name cannot be empty');
    }

    // Test to make sure the querys authorId is valid
    if (query.authorId !== 'all') {
      if (isNaN(query.authorId)) {
        throw new Error('AuthorId must be a number or "all"');
      }

      // authorId is a number
      const authorId = Number(query.authorId);

      // If the author id isn't an integer
      if (!Number.isInteger(authorId)) {
        throw new Error('AuthorId must be an Integer or all');
      }

      // If author id isn't a positive Integer
      if (authorId < 0) {
        throw new Error('AuthorId must be a positive Integer');
      }
    }

    // Test to make sure the query has a question genre
    if (query.genre === undefined || query.genre === '') {
      throw new Error('Genre cannot be empty');
    }

    // Test to make sure the query has a sort method
    if (query.sort === undefined || query.sort === '') {
      throw new Error('Sort Method cannot be empty');
    }

    // Test to make sure the query has an order method
    if (query.order === undefined || query.order === '') {
      throw new Error('Order Method cannot be empty');
    }

    // The query is valid

    // Get all the JSON questions that match the query
    const questionSet = GetQuestionSet(query);

    // Sort the questions
    if (query.sort === 'alpha') {
      // Sort by alphabetical order
      questionSet.sort((a, b) => {
        return (a.question.toUpperCase() > b.question.toUpperCase()) ? 1 : -1;
      });
    } else if (query.sort === 'rating') {
      // This is just some arbitrary algorithm for
      // comparing two questions with some number of likes/dislikes
      // It doesn't really matter how this is done
      questionSet.sort((a, b) => {
        const comparisonScore = QuestionScore(a) - QuestionScore(b);
        // If question a has a higher score than b
        if (comparisonScore > 0) return 1;
        // If question b has a higher score than a
        if (comparisonScore < 0) return -1;
        // If both questions have the same score
        // Rank them based on the number of likes they have instead
        return (a.rating.likes > b.rating.likes) ? 1 : -1;
      });
    } else {
      throw new Error('Sort is invalid');
    }

    // Order the questions
    // By default, they are in ascending order, so only
    // need to check for desc as these are the only two options
    if (query.order === 'desc') {
      questionSet.reverse();
    } else if (query.order !== 'asc') {
      throw new Error('Order is invalid');
    }

    // Add the author of each question to the question info set

    // For every question
    for (let i = 0; i < questionSet.length; i++) {
      let authorName = '';
      try {
        // Try to get the author from the questionId
        const author = GetAuthorFromQuestionId(questionSet[i].question_id);
        // We have found the author of this question
        authorName = author.name;
      } catch (e) {
        // We coudn't find the author of the question
        // So just set the author to be empty
        authorName = '';
      }

      // Add this author to the questionInfoSet returned
      questionSet[i].authorName = authorName;
    }

    // Return the question set to the user
    res.header('Content-Type', 'application/json');
    res.status(200).json(questionSet);
  } catch (e) {
    // The query isn't valid to make a new question

    // We have a Bad Request
    // return the appropriate status error code and message
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// Gets a list of information about all authors which match
// a given search query
// Returns status: 200 or 400
app.get('/get-author-info-set/', (req, res) => {
  // Get the data from the request via the query
  const query = req.query;
  // See if the request is valid
  try {
    // Test to make sure the query has an author
    if (query.authorId === undefined || query.authorId === '') {
      throw new Error('AuthorId cannot be empty');
    }

    // Test to make sure the querys authorId is valid
    if (query.authorId !== 'all') {
      if (isNaN(query.authorId)) {
        throw new Error('AuthorId must be a number or "all"');
      }

      // authorId is a number
      const authorId = Number(query.authorId);

      // If the author id isn't an integer
      if (!Number.isInteger(authorId)) {
        throw new Error('AuthorId must be an Integer or all');
      }

      // If author id isn't a positive Integer
      if (authorId < 0) {
        throw new Error('AuthorId must be a positive Integer');
      }
    }

    // Test to make sure the query has a sort method
    if (query.sort === undefined || query.sort === '') {
      throw new Error('Sort Method cannot be empty');
    }

    // Test to make sure the query has an order method
    if (query.order === undefined || query.order === '') {
      throw new Error('Order Method cannot be empty');
    }

    // The query is valid

    // Get all the JSON authors that match the query
    const authorsSet = GetAuthorSet(query);
    // Perform the needed calculations on the authors
    // to work out the desired information so we can sort them
    const authorsInfoSet = [];
    for (let i = 0; i < authorsSet.length; i++) {
      const author = authorsSet[i];
      const authorInfo = author;
      // Get all the questions asked by the author
      const query = { genre: 'all', authorId: author.author_id };
      const questionsByAuthor = GetQuestionSet(query);
      // Calculate how many question this author has written
      authorInfo.question_count = questionsByAuthor.length;
      // Calculate the favourite genre of the author
      // The favourite genre of the author is the genre which most of
      // their questions have been asked in
      const authorGenreCounts = {};
      questionsByAuthor.forEach(question => {
        if (authorGenreCounts[question.genre] === undefined) {
          authorGenreCounts[question.genre] = 1;
        } else {
          authorGenreCounts[question.genre] += 1;
        }
      });
      let bestKey = { key: 'none', value: -Infinity };
      for (const key in authorGenreCounts) {
        if (authorGenreCounts[key] > bestKey.value) {
          bestKey = { key: key, value: authorGenreCounts[key] };
        }
      }
      if (bestKey.key === 'none') {
        authorInfo.favourite_genre = '';
      } else {
        const bestGenre = info.question_info.genres.find(genre => bestKey.key === genre.id);
        authorInfo.favourite_genre = bestGenre.text;
      }
      // Calculate the Ranking of each Author
      // The ranking of each author is the sum
      // of the score of each question that the author has made
      let authorScore = 0;
      questionsByAuthor.forEach(question => {
        authorScore += QuestionScore(question);
      });
      authorInfo.author_score = authorScore;
      // Save this new author Information
      authorsInfoSet.push(authorInfo);
    };

    // Sort the questions
    if (query.sort === 'alpha') {
      // Sort by alphabetical order
      authorsInfoSet.sort((a, b) => {
        return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1;
      });
    } else if (query.sort === 'rating') {
      // Sort the authors by score
      authorsInfoSet.sort((a, b) => {
        return (a.author_score > b.author_score) ? 1 : -1;
      });
    } else if (query.sort === 'count') {
      // Sort the authors by how many questions they have made
      authorsInfoSet.sort((a, b) => {
        return (a.question_count > b.question_count) ? 1 : -1;
      });
    } else {
      throw new Error('Sort is invalid');
    }

    // Order the questions
    // By default, they are in ascending order, so only
    // need to check for desc as these are the only two options
    if (query.order === 'desc') {
      authorsInfoSet.reverse();
    } else if (query.order !== 'asc') {
      throw new Error('Order is invalid');
    }

    // Return the question set to the user
    res.header('Content-Type', 'application/json');
    res.status(200).json(authorsInfoSet);
  } catch (e) {
    // The query isn't valid to make a new question
    // We have a Bad Request
    // return the appropriate status error code and message
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// Gets a list of the Ids of all questions which match
// a given search query
// Returns status: 200 or 400
app.get('/get-question-id-set/', (req, res) => {
  // Get all the JSON questions that match the query
  const query = req.query;
  // See if the request is valid
  try {
    // Test to make sure the query has a question genre
    if (query.genre === undefined || query.genre === '') {
      throw new Error('Genre cannot be empty');
    }

    // Test to make sure the query has a number of questions
    if (query.count === undefined || query.count === '') {
      throw new Error('Count cannot be empty');
    }

    // Test to make sure the querys count is valid
    if (isNaN(query.count)) {
      throw new Error('Count must be a number');
    }

    // authorId is a number
    const count = Number(query.count);

    // If the author id isn't an integer
    if (!Number.isInteger(count)) {
      throw new Error('Count must be an Integer');
    }

    // If author id isn't a positive Integer
    if (count < 0) {
      throw new Error('Count must be a positive Integer');
    }

    // Request is valid

    // If no author is specified, search for all of them
    if (query.authorId === undefined || query.authorId === '') {
      query.authorId = 'all';
    }
    // Get the set of questions that match the query
    const questionSet = GetQuestionSet(query);

    // Get the ids of the questions that match the query
    let questionIdSet = Array.from(questionSet, q => q.question_id);

    // Randomise the order of the question set
    // Fisher–Yates shuffle
    // https://lodash.com/docs/4.17.15#shuffle
    questionIdSet = _.shuffle(questionIdSet);

    // Get first n elements of the questionSet,
    // where n is the number of questions requested
    // https://lodash.com/docs/4.17.15#slice
    questionIdSet = _.slice(questionIdSet, 0, query.count);

    // Return the question set to the user
    res.header('Content-Type', 'application/json');
    res.status(200).json(questionIdSet);
  } catch (e) {
    // The query isn't valid to make a new question

    // We have a Bad Request
    // return the appropriate status error code and message
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// Gets a Question from a Question Id
// Returns status: 200, or 404
app.get('/qfqid/:id', (req, res) => {
  // Get the parameters from the request
  const params = req.params;

  try {
    // Test to make sure the question Id is valid
    if (isNaN(params.id)) {
      throw new Error('Question Id must be a number');
    }

    // authorId is a number
    const questionId = Number(params.id);

    // If the author id isn't an integer
    if (!Number.isInteger(questionId)) {
      throw new Error('Question Id must be an Integer');
    }

    // If author id isn't a positive Integer
    if (questionId < 0) {
      throw new Error('Question Id must be a positive Integer');
    }

    // We know the Id is a positive integer

    // Get the question from this Id
    const question = GetQuestionFromQuestionId(questionId);

    // return the question in JSON form
    res.header('Content-Type', 'application/json');
    res.status(200).json(question);
  } catch (e) {
    // Request is invalid or
    // We cannot find a question with this id
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// Gets an Author from a Question Id
// Returns status: 200, or 404
app.get('/afqid/:id', (req, res) => {
  // Get the parameters from the request
  const params = req.params;

  try {
    // Test to make sure the question Id is valid
    if (isNaN(params.id)) {
      throw new Error('Question Id must be a number');
    }

    // authorId is a number
    const questionId = Number(params.id);

    // If the author id isn't an integer
    if (!Number.isInteger(questionId)) {
      throw new Error('Question Id must be an Integer');
    }

    // If author id isn't a positive Integer
    if (questionId < 0) {
      throw new Error('Question Id must be a positive Integer');
    }

    // We know the Id is a positive integer

    // Get the author from the questionId
    const author = GetAuthorFromQuestionId(questionId);

    // We found the author of the question Id provided

    // Return the author as JSON
    res.header('Content-Type', 'application/json');
    res.status(200).json(author);
  } catch (e) {
    // Request is invalid or
    // We cannot find an author with of the question with this id
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// Adds one Upvote to the question with the given id
// Returns status: 200, or 404
app.post('/upvote/:id', (req, res) => {
  const params = req.params;

  try {
    // Test to make sure the question Id is valid
    if (isNaN(params.id)) {
      throw new Error('Question Id must be a number');
    }

    // authorId is a number
    const questionId = Number(params.id);

    // If the author id isn't an integer
    if (!Number.isInteger(questionId)) {
      throw new Error('Question Id must be an Integer');
    }

    // If author id isn't a positive Integer
    if (questionId < 0) {
      throw new Error('Question Id must be a positive Integer');
    }

    // We know the Id is a positive integer

    // Try to find the index of the question with that Id
    const questionIndex = questions.findIndex(question => question.question_id === questionId);
    // If there is no question with that Id
    if (questionIndex === -1) {
      // throw an appropriate error
      throw new Error('No Question found with this Id');
    }

    // We found the index of the question with that id

    // Increment that likes count of the question
    questions[questionIndex].rating.likes += 1;

    // Save this change to the questions JSON file
    fs.writeFileSync(JSONPath + 'questions.json', JSON.stringify(questions, null, 2));

    // Send a Responce to the POST request with the new likes count of the question
    res.header('Content-Type', 'application/json');
    res.status(200).json({
      likes: questions[questionIndex].rating.likes
    });
  } catch (e) {
    // Request is invalid or
    // We cannot find an question with this id
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// Adds one Downvote to the question with the given id
// Returns status: 200, or 404
app.post('/downvote/:id', (req, res) => {
  const params = req.params;

  try {
    // Test to make sure the question Id is valid
    if (isNaN(params.id)) {
      throw new Error('Question Id must be a number');
    }

    // authorId is a number
    const questionId = Number(params.id);

    // If the author id isn't an integer
    if (!Number.isInteger(questionId)) {
      throw new Error('Question Id must be an Integer');
    }

    // If author id isn't a positive Integer
    if (questionId < 0) {
      throw new Error('Question Id must be a positive Integer');
    }

    // We know the Id is a positive integer

    // Try to find the index of the question with that Id
    const questionIndex = questions.findIndex(question => question.question_id === questionId);
    // if there is no question with this Id
    if (questionIndex === -1) {
      // throw an appropriate error
      throw new Error('No Question found with this Id');
    }

    // We found the index of the question with that Id

    // Increment the dislikes count of the question
    questions[questionIndex].rating.dislikes += 1;

    // Save this change to the questions JSON file
    fs.writeFileSync(JSONPath + 'questions.json', JSON.stringify(questions, null, 2));

    // Send a Responce to the POST request
    res.header('Content-Type', 'application/json');
    res.status(200).json({
      dislikes: questions[questionIndex].rating.dislikes
    });
  } catch (e) {
    // Request was invalid or we cannot find a question with this Id
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// POST request handler for when the user is submitting a
// new question to be added to the 'database'
// also creates a new author if it doesn't alreaydy exist
// and ownership of the question
// Returns status: 200 or 400
app.post('/add-question/', (req, res) => {
  // Get the data sent via the form encoded in the query
  const query = req.query;
  // Test if the question is valid
  try {
    // If there is no question
    if (query.question === undefined || query.question === '') {
      // throw a new error with appropriate error message
      throw new Error('Question cannot be left empty');
    }
    // If there is no answer
    if (query.answer === undefined || query.answer === '') {
      // throw a new error with appropriate error message
      throw new Error('Answer cannot be left empty');
    }
    // If there is no genre
    if (query.genre === undefined || query.genre === '') {
      // throw a new error with appropriate error message
      throw new Error('Genre cannot be left empty');
    }

    // As author isn't required so if it wasnt specified
    // give a default value of 'unknown'
    let author = query.authorName;
    if (author === undefined || author === '') {
      author = 'unknown';
    }

    // Make the new Question and add it to the 'database'
    MakeNewQuestion(query.question, query.answer, query.genre, author);

    // Send a Responce to the POST request
    res.sendStatus(200);
  } catch (e) {
    // We have a Bad Request
    // return the appropriate status error code and message
    res.header('Content-Type', 'application/json');
    res.status(400).json({
      message: e.message
    });
  }
});

// USE 404 page
// If the server didn't catch the request at any of the above
// url's then it is not a valid request and we should send back
// a 404 page
app.use((req, res) => {
  res.header('Content-Type', 'text/html');
  res.status(404).send('<h1>404</h1>');
});

function GetQuestionFromQuestionId (questionId) {
  // Try to find the question with this Id
  const question = questions.find(question => question.question_id === questionId);
  // If no question with this Id was found
  if (question === undefined) {
    // There is no question with this Id
    // Throw an appropriate error
    throw new Error('No question found with this Id');
  }

  return question;
}

function GetAuthorFromQuestionId (questionId) {
  // Get the ownership information of this questionId
  const ownership = ownerships.find(owner => owner.question_id === questionId);
  // If there is no question with this Id
  if (ownership === undefined) {
    // throw an appropriate error
    throw new Error('No question found with this Id');
  }

  // We know there is a question and an ownership of that question

  // If the author Id of the ownership is not a number (should be impossible)
  if (isNaN(ownership.author_id)) {
    // throw an appropriate error
    throw new Error('Author Id of Ownership must be a number');
  }

  // We know the Author Id is a number

  // Get the AuthorId in integer form
  const authorId = parseInt(ownership.author_id);
  const author = GetAuthorFromAuthorId(authorId);

  return author;
}

function GetAuthorFromAuthorId (authorId) {
  // Get the author with this author Id
  const author = authors.find(author => author.author_id === authorId);
  // If no author exists with this Id
  if (author === undefined) {
    // throw an appropriate error
    throw new Error('No Author found with this Id');
  }

  return author;
}

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

  fs.writeFileSync(JSONPath + 'questions.json', JSON.stringify(questions, null, 2));
  fs.writeFileSync(JSONPath + 'info.json', JSON.stringify(info, null, 2));
}

function MakeNewAuthor (authorName) {
  const authorId = info.author_info.counter;
  info.author_info.counter += 1;

  const newAuthor = {
    author_id: authorId,
    name: authorName
  };

  authors.push(newAuthor);
  fs.writeFileSync(JSONPath + 'authors.json', JSON.stringify(authors, null, 2));

  // Return the index of the new author
  return authors.length - 1;
}

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
  fs.writeFileSync(JSONPath + 'ownerships.json', JSON.stringify(ownerships, null, 2));
}

function GetQuestionSet (query) {
  function matchGenreCheck (question) {
    // Match to genre
    if (query.genre === 'all') return true;
    return question.genre === query.genre;
  };

  function matchAuthorCheck (question) {
    // Math to author
    if (query.authorId === 'all') return true;
    // Get the author from the questionId
    try {
      const author = GetAuthorFromQuestionId(question.question_id);
      const queryAuthorId = parseInt(query.authorId);
      return author.author_id === queryAuthorId;
    } catch (e) {
      return false;
    }
  }

  const matchGenre = [...questions].filter(matchGenreCheck);
  return matchGenre.filter(matchAuthorCheck);
}

function GetAuthorSet (query) {
  try {
    // If we want every author, return all of them
    if (query.authorId === 'all') return authors;

    // We want a specific author

    // Get the author Id we want as an integer
    const queryAuthorId = parseInt(query.authorId);
    const author = GetAuthorFromAuthorId(queryAuthorId);
    return [author];
  } catch (e) {
    return [];
  }
}

function QuestionScore (question) {
  return question.rating.likes - question.rating.dislikes;
}

module.exports = app;
