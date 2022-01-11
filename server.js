const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require('fs');

app.use(express.static('client'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const JSONpath = 'JSON/';
const questions = JSON.parse(fs.readFileSync(JSONpath + 'questions.json'));
const authors = JSON.parse(fs.readFileSync(JSONpath + 'authors.json'));
const ownerships = JSON.parse(fs.readFileSync(JSONpath + 'ownerships.json'));

app.get('/rq', (req, res) => {
  res.json(questions[_.random(0, questions.length - 1)]);
});

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

// 404 page
app.use((req, res) => {
  res.status(404).send('404');
});

// listen to requests
app.listen(3000);
