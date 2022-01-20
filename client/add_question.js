const frmAddQuestion = document.querySelector('#add_question form');
const pMessage = document.querySelector('#add_question #message');
window.addEventListener('DOMContentLoaded', async function (event) {
  // Add the Genres to the Dropdown Selection
  const selectGenre = frmAddQuestion.querySelector('select');
  let addGenres = [];
  try {
    const responce = await fetch('/get-genres');
    if (responce.status !== 200) {
      throw new Error('Server Unresponsive');
    } else {
      const genresText = await responce.text();
      const genres = JSON.parse(genresText);
      addGenres = genres;
    }
  } catch (e) {
    // Default values if for some reason we
    // cannot access the server
    addGenres = [{ id: 'other', text: 'Other' }];
  }

  addGenres.forEach(genre => {
    selectGenre.innerHTML += `<option value="${genre.id}">${genre.text}</option>`;
  });
});
// Add Question Form
frmAddQuestion.addEventListener('submit', async function (event) {
  // POST method as seen in the Goats Example
  // https://github.com/stevenaeola/goats/blob/main/client/script.js

  // Stop the form from being submitted
  event.preventDefault();
  // Get the data from the form
  const data = new FormData(frmAddQuestion);
  // Get the parameters from the query
  const params = new URLSearchParams(data);

  // Make the POST request
  try {
    const responce = await fetch('/add-question?' + params, { method: 'POST' });
    if (responce.status === 200) {
      frmAddQuestion.reset();
      pMessage.innerHTML = 'Question Succesfully Added!';
      pMessage.classList.remove('hidden');
    } else {
      const json = await responce.json();
      pMessage.innerHTML = json.message;
      pMessage.classList.remove('hidden');
    }
  } catch (e) {
    const error = new Error('Could not reach the server, please try again later');
    pMessage.innerHTML = error.message;
    pMessage.classList.remove('hidden');
  }
});
