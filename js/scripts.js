const gallery = document.getElementById('gallery');
const cards = gallery.getElementsByClassName('card');


function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }


function getEmployees(url) {
    return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .then(res => generateHTML(res))
    .catch(error => {
        gallery.innerHTML = '<h2>Oops, there was a problem :(</h2>';
        console.log(error);
    })
}

function generateHTML(data) {
    const html = data.results.map( user => `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
    </div>
    `).join(' ');
    gallery.insertAdjacentHTML('beforeend', html);
}

getEmployees('https://randomuser.me/api/?results=12');


