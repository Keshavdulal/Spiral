const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/tweet'
    : 'https://tranquil-hamlet-17420.herokuapp.com/tweet';

const tweetForm = document.querySelector('form');
const loadingSpiral = document.querySelector('.loading');
const xpiralsElemDiv = document.querySelector('.xpirals-list');

loadingSpiral.style.display = '';

// get all xpirals from server
listAllXpirals();

tweetForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // 1. Extract data from Form
  const tweetFormData = new FormData(tweetForm);
  const name = tweetFormData.get('name');
  const tweet = tweetFormData.get('tweet');
  const tweetData = { name, tweet };
  // console.log('Sending frontend data 🌈 ', tweetData);

  // Update UI
  loadingSpiral.style.display = '';
  tweetForm.style.display = 'none';

  // send tweet to server
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(tweetData),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((resp) => resp.json())
    .then((createdXpiral) => {
      listAllXpirals();
      // console.log('🌈🌈', createdXpiral);
      // update UI Again & reset form data
      loadingSpiral.style.display = 'none';
      tweetForm.reset();

      // hide form for 10seconds
      setTimeout(() => {
        tweetForm.style.display = '';
      }, 5000);
    });
});

function listAllXpirals() {
  // reset feed
  xpiralsElemDiv.innerHTML = '';
  fetch(API_URL)
    .then((resp) => resp.json())
    .then((xpiralsData) => {
      console.log(xpiralsData);

      // update UI
      loadingSpiral.style.display = 'none';
      xpiralsData.reverse();
      xpiralsData.forEach((item) => {
        const div = document.createElement('div');
        const header = document.createElement('h3');
        const xpiralInfo = document.createElement('p');
        const xpiralDate = document.createElement('small');

        header.textContent = item.name;
        xpiralInfo.textContent = item.tweet;
        xpiralDate.textContent = new Date(item.created);

        div.appendChild(header);
        div.appendChild(xpiralDate);
        div.appendChild(xpiralInfo);
        xpiralsElemDiv.appendChild(div);
      });
    });
}
