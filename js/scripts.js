document.addEventListener('DOMContentLoaded', () => {
    
    const url ='https://randomuser.me/api/?results=12&nat=us';
    const gallery = document.getElementById('gallery');
    let cards = document.querySelectorAll('.card');
    let modals = document.querySelectorAll('.modal-container');
    // List of states used by onvertStateToAbbr function
    const _MapFullNameAbbr = {"arizona":"AZ","alabama":"AL","alaska":"AK","arkansas":"AR","california":"CA","colorado":"CO","connecticut":"CT","districtofcolumbia":"DC","delaware":"DE","florida":"FL","georgia":"GA","hawaii":"HI","idaho":"ID","illinois":"IL","indiana":"IN","iowa":"IA","kansas":"KS","kentucky":"KY","louisiana":"LA","maine":"ME","maryland":"MD","massachusetts":"MA","michigan":"MI","minnesota":"MN","mississippi":"MS","missouri":"MO","montana":"MT","nebraska":"NE","nevada":"NV","newhampshire":"NH","newjersey":"NJ","newmexico":"NM","newyork":"NY","northcarolina":"NC","northdakota":"ND","ohio":"OH","oklahoma":"OK","oregon":"OR","pennsylvania":"PA","rhodeisland":"RI","southcarolina":"SC","southdakota":"SD","tennessee":"TN","texas":"TX","utah":"UT","vermont":"VT","virginia":"VA","washington":"WA","westvirginia":"WV","wisconsin":"WI","wyoming":"WY","alberta":"AB","britishcolumbia":"BC","manitoba":"MB","newbrunswick":"NB","newfoundland":"NF","northwestterritory":"NT","novascotia":"NS","nunavut":"NU","ontario":"ON","princeedwardisland":"PE","quebec":"QC","saskatchewan":"SK","yukon":"YT"};


    // API call fetch employees data and returns it in JSON.
    const data = fetch(url)
        .then(res => res.json())
        .then((data) => {
            return data.results;
        })
        .catch(() => {
            gallery.innerHTML = '<h2>Oops, there was a problem :(</h2>';
        });
    
    // Main function. Wait for data then calls all generator on the page.
    async function generateHTML() {
        // Saves employees list to a variable. 
        const employees = await data;
        
        generateList(employees);
        generateCards(employees);
        generateSearchBar(employees);
        generateModals(employees);
    
    }

    // Function used to save the initial state of the employees list. It will be used by the search bar. Accepts an array as params.
    let initialList = [];
    function generateList(employees) {
        employees.forEach((user) => {
            initialList.push(user);
        });
    }

    // **************************************************************  
    // Main function call to generate all the elements of the page. *
    // **************************************************************
    
    generateHTML();

    // ******************
    // Helper functions *
    // ******************

    // Generate each employees cards on the main page. Accepts an array as params.
    function generateCards(employees) {
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
                const userModal = document.getElementById(e.currentTarget.id.split('_')[0]+ '_modal');
                userModal.style.display = 'block';
            })
        })
    }

    // Function that generate all modals with buttons for each user. Accepts an array as params.
    function generateModals(employees) {
        employees.forEach((user, index) => {
            const modalHTML = `
            <div class="modal-container" id=${index}_modal>
                <div class="modal">
                    <button type="button" id="${index}-modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                        <p class="modal-text">${user.email}</p>
                        <p class="modal-text cap">${user.location.city}</p>
                        <hr>
                        <p class="modal-text">${formatPhone(user.cell)}</p>
                        <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${convertStateToAbbr(user.location.state)} ${user.location.postcode}</p>
                        <p class="modal-text">Birthday: ${formatDOB(user.dob.date)}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
            `
            document.getElementsByTagName('script')[0].insertAdjacentHTML('beforebegin', modalHTML);
        })

        disableModalBtns();

         // Selects and hide modals on load
         modals = document.querySelectorAll('.modal-container');
         modals.forEach( (modal) => {
            modal.style.display = 'none';
        });

        // Modals buttons selections
        const closeModalBtns = document.querySelectorAll('.modal-close-btn');
        const modalNextBtn = document.querySelectorAll('.modal-next');
        const modalPrevBtn = document.querySelectorAll('.modal-prev');

        // Add click listener on the modal 'close' button.
        closeModalBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const userModal = document.getElementById(e.currentTarget.id.split('-')[0] + '_modal');
                userModal.style.display = 'none';
            });
        });

        // Add click listener on the modal's 'next' button and add logic to show next modal on click.
        modalNextBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                modals = document.querySelectorAll('.modal-container');
                const currentModalID = document.getElementById(e.currentTarget.parentElement.parentElement.id).id.split('_')[0];
                if (+currentModalID === modals.length -1) {
                    btn.style.visibility = 'hidden';
                }
                if (+currentModalID < modals.length - 1) {
                    e.currentTarget.parentElement.parentElement.style.display = 'none';
                    e.currentTarget.parentElement.parentElement.nextElementSibling.style.display = 'block';
                }
            });
        });

        // Add click listener on the modal's 'previous' button and add logic to show previous modal on click.
        modalPrevBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const currentModalID = document.getElementById(e.currentTarget.parentElement.parentElement.id).id.split('_')[0];
                if (+currentModalID > 0) {
                    e.currentTarget.parentElement.parentElement.style.display = 'none';
                    e.currentTarget.parentElement.parentElement.previousElementSibling.style.display = 'block';
                } 
            });
        })
    }

    // Function that will disable 'previous' or 'next' button if first/last modal showed.
    function disableModalBtns() {
        modals = document.querySelectorAll('.modal-container');
        modals.forEach((modal, index) => {
            if (index === 0) {
                document.getElementById(`${index}_modal`).querySelector('.modal-prev').disabled = true;
            }
            
            if (index === modals.length - 1) {
                document.getElementById(`${index}_modal`).querySelector('.modal-next').disabled = true;
            }
        });
   }


     
    // Adds the searchbar html to the page. Accepts an array as params.
    function generateSearchBar(employees) {
        const searchContainer = document.querySelector('.search-container');
        const html = `
        <form id="search-form" action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
        searchContainer.insertAdjacentHTML('beforeend', html);

        // Selects the form and the input
        const searchForm = document.getElementById('search-form');
        const searchInput = document.getElementById('search-input');
        
        // Adds a listener on the form 'submit' event to filter the results.
        searchForm.addEventListener('submit', (e) => {
            cards = document.querySelectorAll('.card');
            e.preventDefault();
            let filteredList = [];
            // If search input is not empty, it filters and shows cards 
            if (searchInput.value) {
                removeCards();
                removeModals();
                employees.forEach((user) => {
                    const fullName = `${user.name.first} ${user.name.last}`;
                    if (fullName.toLowerCase().includes(searchInput.value.toLowerCase())) {
                        filteredList.push(user);
                    }
                });
                generateCards(filteredList);
                generateModals(filteredList);
            // If search input is empty, it loads the entire original unfiltered content.
            } else {
                removeCards();
                removeModals();
                generateCards(initialList);
                generateModals(initialList);
                cards.forEach((card) => {
                    card.style.display = 'inherit';
                });
            }
        });
    }

    // Helper function to remove all cards when needed.
    function removeCards() {
        cards = document.querySelectorAll('.card');
        cards.forEach((card) => {
            card.remove();
        });
    }

    // Helper function to remove all modals when needed.
    function removeModals() {
        modals = document.querySelectorAll('.modal-container');
        modals.forEach( (modal) => {
            modal.remove();
        });
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
});