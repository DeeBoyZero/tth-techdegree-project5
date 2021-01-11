    
    const url ='https://randomuser.me/api/?results=12&nat=us';
    const gallery = document.getElementById('gallery');
    // List of states used by onvertStateToAbbr function
    const _MapFullNameAbbr = {"arizona":"AZ","alabama":"AL","alaska":"AK","arkansas":"AR","california":"CA","colorado":"CO","connecticut":"CT","districtofcolumbia":"DC","delaware":"DE","florida":"FL","georgia":"GA","hawaii":"HI","idaho":"ID","illinois":"IL","indiana":"IN","iowa":"IA","kansas":"KS","kentucky":"KY","louisiana":"LA","maine":"ME","maryland":"MD","massachusetts":"MA","michigan":"MI","minnesota":"MN","mississippi":"MS","missouri":"MO","montana":"MT","nebraska":"NE","nevada":"NV","newhampshire":"NH","newjersey":"NJ","newmexico":"NM","newyork":"NY","northcarolina":"NC","northdakota":"ND","ohio":"OH","oklahoma":"OK","oregon":"OR","pennsylvania":"PA","rhodeisland":"RI","southcarolina":"SC","southdakota":"SD","tennessee":"TN","texas":"TX","utah":"UT","vermont":"VT","virginia":"VA","washington":"WA","westvirginia":"WV","wisconsin":"WI","wyoming":"WY","alberta":"AB","britishcolumbia":"BC","manitoba":"MB","newbrunswick":"NB","newfoundland":"NF","northwestterritory":"NT","novascotia":"NS","nunavut":"NU","ontario":"ON","princeedwardisland":"PE","quebec":"QC","saskatchewan":"SK","yukon":"YT"};

    // **************************************************************  
    // Main function call to generate all the elements of the page. *
    // **************************************************************

    fetch(url)
    .then(res => checkStatus(res))
    .then(res => res.json())
    .then((res) => { 
        return res.results
    })
    .then(res => generateCards(res))
    .then(res => generateModal(res))
    .then(res => generateSearchBar(res))
    .catch((e) => {
        console.log('Looks like there was a problem:', e);
        gallery.innerHTML = '<h2>Oops, there was a problem :(</h2>';
    });
    
    // ******************
    // Main functions *
    // ******************
    function checkStatus(response) {
        if (response.ok) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error(response.statusText));
        }
    }

    function generateCards(employees) {
        removeCards();
        employees.forEach( (user, index) => {
            const html = `
            <div class="card" id=${index}_card>
                <div class="card-img-container">
                    <img class="card-img" src="${user.picture.medium}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>
            `;
            gallery.insertAdjacentHTML('beforeend', html);
        });
        
        // Adds a click listener on the entire card to open/show the user's modal.
        cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                const userID = e.currentTarget.id.split('_')[0];
                // if (document.querySelector('.modal-info-container')) {
                    removeModalData();
                    loadModalData(employees, employees[+userID]);
                    modalContainer = document.querySelector('.modal-container');
                    modalContainer.style.display = 'block';
                // } else {
                //     loadModalData(employees, employees[+userID]);
                //     modalContainer = document.querySelector('.modal-container');
                //     modalContainer.style.display = 'block';
                // }
            });
        });
        return employees;
    }

    function generateModal(employees) {
        removeModal();
            const modalHTML = `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container"></div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
            `
            document.getElementsByTagName('script')[0].insertAdjacentHTML('beforebegin', modalHTML);

        // Selects and hide modal on load
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.style.display = 'none';
    
        // Modals buttons selections
        const closeModalBtn = document.querySelector('.modal-close-btn');
        const modalNextBtn = document.querySelector('.modal-next');
        const modalPrevBtn = document.querySelector('.modal-prev');

        closeModalBtn.addEventListener('click', (e) => {
            modalContainer.style.display = 'none';
        });

        modalNextBtn.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (currentUser != employees.length - 1) {
                const nextUser = getNextUser();
                loadModalData(employees, employees[nextUser]);
            }
        });

        // Add click listener on the modal's 'previous' button and add logic to show previous modal on click.
        modalPrevBtn.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (currentUser != 0) {
                const prevUser = getPrevUser();
                loadModalData(employees, employees[prevUser]);
            }
        });

        return employees;
    }

    function loadModalData(employees, user) {
        const html = `
        <div class="modal-info-container" data-user-id="${employees.indexOf(user)}">
            <img class="modal-img" src="${user.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p>
            <hr>
            <p class="modal-text">${formatPhone(user.cell)}</p>
            <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${convertStateToAbbr(user.location.state)} ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${formatDOB(user.dob.date)}</p>
        </div>    
        `;
        if (document.querySelector('.modal-info-container')) {
            removeModalData();
        }
        const modal = document.querySelector('.modal');
        modal.insertAdjacentHTML('beforeend', html);

        disableModalBtns(employees);
    }

    // Adds the searchbar html to the page. Accepts an array as params.
    function generateSearchBar(employees) {
        const searchContainer = document.querySelector('.search-container');
        const html = `
        <form id="search-form" action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        <p id="error-msg"></p>
        `;
        searchContainer.insertAdjacentHTML('beforeend', html);

        // Selects the form and the input
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let filteredList = [];
            if (searchInput.value) {
                employees.forEach((user) => {
                    const fullName = `${user.name.first} ${user.name.last}`;
                    if (fullName.toLowerCase().includes(searchInput.value.toLowerCase())) {
                        // user.isFiltered = true;
                        filteredList.push(user);
                    }
                });
                if (filteredList.length === 0) {
                    document.getElementById('error-msg').innerText = 'Sorry, no result found.';
                    removeCards();
                } else {
                    generateCards(filteredList);
                    generateModal(filteredList);
                }

            } else {
                document.getElementById('error-msg').innerText = '';
                generateCards(employees);
                generateModal(employees);
            }
        });
    }

    // ******************
    // Helper functions *
    // ******************

    function getCurrentUser() {
        return parseInt(document.querySelector('.modal-info-container').getAttribute('data-user-id'));
    }

    function getNextUser() {
        const userIndex = parseInt(document.querySelector('.modal-info-container').getAttribute('data-user-id'));
        const nextUser = (userIndex + 1);
        return nextUser;
    }

    function getPrevUser() {
        const userIndex = parseInt(document.querySelector('.modal-info-container').getAttribute('data-user-id'));
        const prevUser = (userIndex - 1);
        return prevUser;
    }

    function removeModalData() {
        const modalInfoContainer = document.querySelector('.modal-info-container');
        modalInfoContainer.remove();
    }
 
    // Function that will disable 'previous' or 'next' button if first/last modal showed.
    function disableModalBtns(list) {
        const modalInfo = document.querySelector('.modal-info-container');
        const modalNextBtn = document.querySelector('.modal-next');
        if (+modalInfo.getAttribute('data-user-id') >= list.length - 1) {
            modalNextBtn.disabled = true;
        } else {
            modalNextBtn.disabled = false;
        }

        const modalPrevBtn = document.querySelector('.modal-prev');
        if (+modalInfo.getAttribute('data-user-id') === 0 ) {
            modalPrevBtn.disabled = true;
        } else {
            modalPrevBtn.disabled = false;
        }
    }
 
    // Helper function to remove all cards when needed.
    function removeCards() {
        cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.remove();
        });
    }

    function removeModal() {
        if (document.querySelector('.modal-container')) {
            document.querySelector('.modal-container').remove();
        }
    }

    // Helper function to format phone number. Used in modals.
    function formatPhone(number) {
        const regexPhone = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
        return number.replace(regexPhone, '($1) $2-$3');
    }

    // Helper function to format date of birth. Used in modals.
    function formatDOB(date) {
        const regexDOB = /^(\d{4})\D(\d{2})\D(\d{2}).+/;
        return date.replace(regexDOB, '$2/$3/$1');
    }

    // Function to abbreviate the state in the modal. Accepts a string.
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
