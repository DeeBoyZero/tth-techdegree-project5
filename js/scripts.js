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
        console.log('Looks like there was a problem:', e); //Not required but useful to have the exact error message somewhere.
        gallery.innerHTML = '<h2>Oops, there was a problem :(</h2>';
    });
    
    // ******************
    // Main functions *
    // ******************

    // Check the status of the fetch call and generate a reject promise if the call failed.
    function checkStatus(response) {
        if (response.ok) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error(response.statusText));
        }
    }

    // Generate a card for each employees present in the list passed as an argument.
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
        const cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.addEventListener('click', (e) => {
                const userID = e.currentTarget.id.split('_')[0];
                    removeModalData();
                    loadModalData(employees, employees[+userID]);
                    modalContainer = document.querySelector('.modal-container');
                    modalContainer.style.display = 'block';
            });
        });
        return employees;
    }

    // Insert a blank modal container with buttons and event Listeners and hide it on load.
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
        `;
        // Append the modal to body before script tags
        document.getElementsByTagName('script')[0].insertAdjacentHTML('beforebegin', modalHTML);

        // Selects and hide modal on load
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.style.display = 'none';
    
        // Modals buttons selections
        const closeModalBtn = document.querySelector('.modal-close-btn');
        const modalNextBtn = document.querySelector('.modal-next');
        const modalPrevBtn = document.querySelector('.modal-prev');

        // Add a listener to close the modal container on click
        closeModalBtn.addEventListener('click', (e) => {
            modalContainer.style.display = 'none';
        });

        // Add click listener on the modal's 'next' button and add logic to show next modal on click.
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

    // Load a modal with the informations of the user passed as an argument. Accepts a list first to find the index of the user.
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
        
        // Add a listener on the form 'submit' action. Generate cards and modal based on the search value.
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let filteredList = [];
            if (searchInput.value) {
                employees.forEach((user) => {
                    const fullName = `${user.name.first} ${user.name.last}`;
                    if (fullName.toLowerCase().includes(searchInput.value.toLowerCase())) {
                        filteredList.push(user);
                    }
                });
                if (filteredList.length === 0) {
                    // Show an error message if no user was found.
                    document.getElementById('error-msg').innerText = 'Sorry, no result found.';
                    removeCards();
                } else {
                    document.getElementById('error-msg').innerText = '';
                    generateCards(filteredList);
                    generateModal(filteredList);
                }
            } else {
                // If search value is blank, it regenerates the cards and modal.
                document.getElementById('error-msg').innerText = '';
                generateCards(employees);
                generateModal(employees);
            }
        });
    }

    // ******************
    // Helper functions *
    // ******************
  
    // Get the current user index
    function getCurrentUser() {
        return parseInt(document.querySelector('.modal-info-container').getAttribute('data-user-id'));
    }

    // Get the next user index
    function getNextUser() {
        const userIndex = getCurrentUser();
        const nextUser = (userIndex + 1);
        return nextUser;
    }

    // Get the previous user index
    function getPrevUser() {
        const userIndex = getCurrentUser();
        const prevUser = (userIndex - 1);
        return prevUser;
    }

    // Remove the modal data.
    function removeModalData() {
        const modalInfoContainer = document.querySelector('.modal-info-container');
        modalInfoContainer.remove();
    }
 
    // Will disable 'previous' or 'next' button if first/last modal showed.
    function disableModalBtns(list) {
        const modalNextBtn = document.querySelector('.modal-next');
        if (getCurrentUser() >= list.length - 1) {
            modalNextBtn.disabled = true;
        } else {
            modalNextBtn.disabled = false;
        }

        const modalPrevBtn = document.querySelector('.modal-prev');
        if (getCurrentUser() === 0 ) {
            modalPrevBtn.disabled = true;
        } else {
            modalPrevBtn.disabled = false;
        }
    }
 
    // Helper function to remove all cards when needed.
    function removeCards() {
        const currentCards = document.querySelectorAll('.card');
        currentCards.forEach((card) => {
            card.remove();
        });
    }

    // Remove the modal container.
    function removeModal() {
        if (document.querySelector('.modal-container')) {
            document.querySelector('.modal-container').remove();
        }
    }

    // Helper function to format phone number. Used in modal.
    function formatPhone(number) {
        const regexPhone = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/;
        return number.replace(regexPhone, '($1) $2-$3');
    }

    // Helper function to format date of birth. Used in modal.
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
