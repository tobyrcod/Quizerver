const divQuiz = document.getElementById('quiz');
const divAddQuestion = document.getElementById('add_question');
document.getElementById('switch').addEventListener('click', (event) => {
  divQuiz.classList.toggle('hidden');
  divAddQuestion.classList.toggle('hidden');
  console.log('switch');
});
