const frmAddQuestion = document.querySelector('#add_question form');
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
  console.log(params);
  // Make the POST request
  try {
    const responce = await fetch('/add-question?' + params, { method: 'POST' });
    const json = await responce.json();
    if (json.status === 'success') {
      frmAddQuestion.reset();
    }
  } catch (e) {
    // TODO: Add visual indicator upload failed to the user
    console.log('Could not upload question to the server, please try again later');
  }
});
