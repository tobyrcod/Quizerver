// Add Question Form
const addQuestionForm = document.querySelector('#add_question form');
addQuestionForm.addEventListener('submit', async function (event) {
  // POST method as seen in the Goats Example
  // https://github.com/stevenaeola/goats/blob/main/client/script.js

  // Stop the form from being submitted
  event.preventDefault();
  // Get the data from the form
  const data = new FormData(addQuestionForm);
  // Get the parameters from the query
  const params = new URLSearchParams(data);
  // Make the POST request
  try {
    const responce = await fetch('/add-question?' + params, { method: 'POST' });
    const json = await responce.json();
    console.log(json);
  } catch (e) {
    // TODO: Add visual indicator upload failed to the user
    console.log('Could not upload question to the server, please try again later');
  }
});
