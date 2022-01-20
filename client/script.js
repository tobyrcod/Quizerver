const contentAreas = {
  quiz: 'quiz',
  add: 'add',
  browse: 'browse'
};

const contentStates = {
  quiz: true,
  add: false,
  browse: false
};

const navbar = document.getElementById('navbar');
const btnQuiz = navbar.querySelector('#btnQuiz');
const btnAdd = navbar.querySelector('#btnAdd');
const btnBrowse = navbar.querySelector('#btnBrowse');

const divQuiz = document.getElementById('quiz');
const divAdd = document.getElementById('add_question');
const divBrowse = document.getElementById('browse');

const contentDivs = {
  quiz: divQuiz,
  add: divAdd,
  browse: divBrowse
};

window.addEventListener('DOMContentLoaded', async function (event) {
  btnQuiz.addEventListener('click', () => ShowContent(contentAreas.quiz));
  btnAdd.addEventListener('click', () => ShowContent(contentAreas.add));
  btnBrowse.addEventListener('click', () => ShowContent(contentAreas.browse));
  ShowContent(contentAreas.quiz);
});

function ShowContent (contentArea) {
  for (const key in contentStates) {
    contentStates[key] = false;
  }

  contentStates[contentArea] = true;

  for (const key in contentStates) {
    contentDivs[key].classList.toggle('hidden', !contentStates[key]);
  }
}
