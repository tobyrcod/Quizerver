const dBrowse = document.getElementById('browse');
const frmFilter = dBrowse.querySelector('form');
const txtMessage = dBrowse.querySelector('#message');
const tblBody = dBrowse.querySelector('table tbody');

window.addEventListener('DOMContentLoaded', async function (event) {
  // Add the Genres to the Dropdown Selection
  const selectGenre = frmFilter.querySelector('select#genre');
  let addGenres = [];
  try {
    const responce = await fetch('/get-genres');
    if (responce.status !== 200) {
      throw new Error('Server Unresponsive');
    } else {
      const genresText = await responce.text();
      const genres = JSON.parse(genresText);
      addGenres = [{ id: 'all', text: 'All' }].concat(genres);
    }
  } catch (e) {
    // Default values if for some reason we
    // cannot access the server
    addGenres = [{ id: 'all', text: 'All' }];
  }
  addGenres.forEach(genre => {
    selectGenre.innerHTML += `<option value="${genre.id}">${genre.text}</option>`;
  });

  // Add the sort options to the Dropdown Selection
  const selectSort = frmFilter.querySelector('select#sort');
  let addSortOrders = [];
  try {
    const responce = await fetch('/get-sorts');
    if (responce.status !== 200) {
      throw new Error('Server Unresponsive');
    } else {
      const sortsText = await responce.text();
      const sorts = JSON.parse(sortsText);
      addSortOrders = sorts;
    }
  } catch (e) {
    // Default values if for some reason we
    // cannot access the server
    addSortOrders = [{ id: 'alphDesc', text: 'Alphabet Decending' }];
  }
  addSortOrders.forEach(sort => {
    selectSort.innerHTML += `<option value="${sort.id}">${sort.text}</option>`;
  });
});

// Filter Questions Form
frmFilter.addEventListener('submit', async function (event) {
  // Stop the form from being submitted
  event.preventDefault();

  // Get the data from the form
  const data = new FormData(frmFilter);
  // Get the parameters from the query
  const params = new URLSearchParams(data);
  // Make the GET request. Get the question set
  const info = await GetQuestionSetInfo(params);
  if (info.error_message !== null) {
    txtMessage.innerHTML = info.error_message;
    txtMessage.classList.remove('hidden');
    tblBody.innerHTML = '';
  } else {
    // Display info in table
    // Open the table body
    const questionSet = info.questionSet;
    let tblHTML = '';
    for (let i = 0; i < questionSet.length; i++) {
      const questionInfo = questionSet[i];
      let qsHTML = '';
      qsHTML += '<tr>';
      qsHTML += `<th scope="row">${i}</th>`;
      qsHTML += `<td>${questionInfo.question}</td>`;
      qsHTML += `<td>${questionInfo.answer}</td>`;
      qsHTML += `<td>${questionInfo.rating.likes} ^</td>`;
      qsHTML += `<td>${questionInfo.rating.dislikes} v</td>`;
      qsHTML += '</tr>';
      tblHTML += qsHTML;
    };

    tblBody.innerHTML = tblHTML;

    // Handle the Message Box
    txtMessage.innerHTML = '';
    txtMessage.classList.add('hidden');
  }
});

async function GetQuestionSetInfo (params) {
  // Try to get all the questions that match this query
  try {
    const responce = await fetch('/get-question-info-set?' + params);
    if (responce.status === 404) {
      return { questionSet: null, error_message: '404 Error!' };
    }

    const questionSetText = await responce.text();
    const questionSet = JSON.parse(questionSetText);
    if (questionSet.length <= 0) {
      return { questionSet: null, error_message: 'No Questions Avaliable' };
    }

    return { questionSet: questionSet, error_message: null };
  } catch (e) {
    return { questionSet: null, error_message: 'Unable to Connect to Server, Please try again' };
  }
};
