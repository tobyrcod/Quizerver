const frmAddQuestion = document.querySelector('#add_question form');
const pMessage = document.querySelector('#add_question #message');
window.addEventListener('DOMContentLoaded', async function (event) {
  // Add the Genres to the Dropdown Selection
  const selectGenre = frmAddQuestion.querySelector('select');
  let addGenres = [];
  try {
    // Try to get the possible question genres from the server
    const responce = await fetch('/get-genres');
    // If the genres data isnt avaliable
    if (responce.status === 404) {
      // Throw a 404 error
      throw new Error('404');
    } else {
      // The genres data was avalibale and returned as JSON
      const genresText = await responce.text();
      const genres = JSON.parse(genresText);
      // Save the genres we got so we can apply them to the
      // drop down menu
      addGenres = genres;
    }
  } catch (e) {
    // Default values if we cannot access the server
    // or the server didnt have what we asked for
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
    // Try to add the new question to the server
    const responce = await fetch('/add-question?' + params, { method: 'POST' });
    // If the new question was added succesfully
    if (responce.status === 200) {
      // Reset the form so it is empty and ready for a new question
      frmAddQuestion.reset();
      // Display that the question was uploaded successfully
      // to the user
      pMessage.innerHTML = 'Question Succesfully Added!';
      pMessage.classList.remove('hidden');
    } else {
      // The new question failed because it wasn't valid

      // Get the error message from the server
      const json = await responce.json();
      // Display the error to the user so they can make
      // appropriate chages to their code to fix it
      pMessage.innerHTML = json.message;
      pMessage.classList.remove('hidden');
    }
  } catch (e) {
    // If you failed to connect to the server

    // Tell the user they coudn't connect to the server
    const error = new Error('Could not reach the server, please try again later');
    pMessage.innerHTML = error.message;
    pMessage.classList.remove('hidden');
  }
});
