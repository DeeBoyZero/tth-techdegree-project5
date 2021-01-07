document.addEventListener('DOMContentLoaded', () => {
    
    const url ='https://randomuser.me/api/?results=12&nat=us';
    const body = document.querySelector('body');
    const gallery = document.getElementById('gallery');
    const cards = document.getElementsByClassName('card');
    const closeModalBtns = document.getElementsByClassName('modal-close-btn');
    const modalNextBtn = document.getElementsByClassName('modal-next');
    const modalPrevBtn = document.getElementsByClassName('modal-prev');
    const _MapFullNameAbbr = {"arizona":"AZ","alabama":"AL","alaska":"AK","arkansas":"AR","california":"CA","colorado":"CO","connecticut":"CT","districtofcolumbia":"DC","delaware":"DE","florida":"FL","georgia":"GA","hawaii":"HI","idaho":"ID","illinois":"IL","indiana":"IN","iowa":"IA","kansas":"KS","kentucky":"KY","louisiana":"LA","maine":"ME","maryland":"MD","massachusetts":"MA","michigan":"MI","minnesota":"MN","mississippi":"MS","missouri":"MO","montana":"MT","nebraska":"NE","nevada":"NV","newhampshire":"NH","newjersey":"NJ","newmexico":"NM","newyork":"NY","northcarolina":"NC","northdakota":"ND","ohio":"OH","oklahoma":"OK","oregon":"OR","pennsylvania":"PA","rhodeisland":"RI","southcarolina":"SC","southdakota":"SD","tennessee":"TN","texas":"TX","utah":"UT","vermont":"VT","virginia":"VA","washington":"WA","westvirginia":"WV","wisconsin":"WI","wyoming":"WY","alberta":"AB","britishcolumbia":"BC","manitoba":"MB","newbrunswick":"NB","newfoundland":"NF","northwestterritory":"NT","novascotia":"NS","nunavut":"NU","ontario":"ON","princeedwardisland":"PE","quebec":"QC","saskatchewan":"SK","yukon":"YT"};
    

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
        // .then(res => console.log(res))
        .then(res => generateHTML(res))
        .then(res => generateModal(res))
        .then(createSearchBar)
        .then(createListener)
        .catch(error => {
            gallery.innerHTML = '<h2>Oops, there was a problem :(</h2>';
            console.log(error);
        })
    }

    function generateHTML(data) {
        const html = data.results.map( (user, index) => `
            <div class="card" id=${index}_card>
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
        return data.results;
    }


    function generateModal(data) {
        const regexPhone = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
        const regexDOB = /^(\d{4})\D(\d{2})\D(\d{2})/g;
        const modalHTML = data.map( (user, index) => `
        <div class="modal-container" id=${index}_modal>
            <div class="modal">
                <button type="button" id="${index}-modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.cell.replace(regexPhone,'($1) $2-$3')}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${convertStateToAbbr(user.location.state)} ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${user.dob.date.replace(regexDOB, '$2/$3/$1').split(/\T/)[0]}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>

        `).join(' ');

        body.insertAdjacentHTML('beforeend', modalHTML);
        const modals = document.getElementsByClassName('modal-container');
        Array.from(modals).forEach( (modal) => {
            modal.style.display = 'none';
        });
        
    }
    
    function createSearchBar() {
        const searchContainer = document.querySelector('.search-container');
        const html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
        searchContainer.insertAdjacentHTML('beforeend', html);
    }

    function createListener() {
            
        Array.from(cards).forEach((card) => {
            card.addEventListener('click', (e) => {
                const userModal = document.getElementById(e.currentTarget.id.split('_')[0]+ '_modal');
                userModal.style.display = 'block';
            })
        })

        Array.from(closeModalBtns).forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const userModal = document.getElementById(e.currentTarget.id.split('-')[0] + '_modal');
                userModal.style.display = 'none';
            });
        });

        Array.from(modalNextBtn).forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const currentModalID = document.getElementById(e.currentTarget.parentElement.parentElement.id).id.split('_')[0];
                if (+currentModalID < 11) {
                    e.currentTarget.parentElement.parentElement.style.display = 'none';
                    e.currentTarget.parentElement.parentElement.nextElementSibling.style.display = 'block';
                }
            });
        });

        Array.from(modalPrevBtn).forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const currentModalID = document.getElementById(e.currentTarget.parentElement.parentElement.id).id.split('_')[0];
                if (+currentModalID > 0) {
                    e.currentTarget.parentElement.parentElement.style.display = 'none';
                    e.currentTarget.parentElement.parentElement.previousElementSibling.style.display = 'block';
                }

            });
        })


    }


    // Function to abbriviate the state in the modal
    // Code by yblee85 at https://gist.github.com/calebgrove/c285a9510948b633aa47

    function convertStateToAbbr(input) {
        
        if(input === undefined) return input;
        var strInput = input.trim();
        if(strInput.length === 2) {
          // already abbr, check if it's valid
          var upStrInput = strInput.toUpperCase();
          return _MapAbbrFullName[upStrInput]?upStrInput :undefined;
        }
        var strStateToFind = strInput.toLowerCase().replace(/\ /g, '');
        var foundAbbr = _MapFullNameAbbr[strStateToFind];
        return foundAbbr;
      }
    


    getEmployees(url);



});