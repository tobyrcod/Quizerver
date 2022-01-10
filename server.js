const express = require('express');
const app = express();
const _ = require('lodash');
const fs = require('fs');

app.use(express.static('client'));

const questions = JSON.parse(fs.readFileSync('questions.json'));
const authors = JSON.parse(fs.readFileSync('authors.json'));
const ownerships = JSON.parse(fs.readFileSync('ownerships.json'));

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

// listen to requests
app.listen(3000);
