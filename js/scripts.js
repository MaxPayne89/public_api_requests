//data used throughout the app
const personPromise = fetchData('https://fsjs-public-api-backup.herokuapp.com/api')
const classArr = ['card', 'card-img-container', 'card-img', 'card-info-container', 'card-name', 'cap', 'card-text'];

//resolve the promise to the gallery html
personPromise
    .then(persons => persons.map((person) => {
        return generateHTML(person);
    }).join(''))
    .then(html => insertHTML(html))
    .catch(error => console.log('There has been an issue', error));

//fetching the data
async function fetchData(url) {
    try {
        const listPromise = await fetch(url);
        const listJson = await listPromise.json()
        return listJson.results;
    } catch(err) {
        console.error(err);
        throw Error('Something went wrong. Probably a network issue.');
    }
}

//helper functions
function generateHTML(person) {
    const html = `
    <div class="card" id="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
        </div>
    </div>
    `
    return html;
}

function insertHTML(html) {
    const galleryDiv = document.querySelector('#gallery');
    galleryDiv.innerHTML = html;
}

function generateModalHtml(person) {
    const html = `
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${person.picture.medium}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
            <p class="modal-text">${person.email}</p>
            <p class="modal-text cap">${person.location.city}</p>
            <hr>
            <p class="modal-text">${person.phone}</p>
            <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.state} ${person.location.postcode}</p>
            <p class="modal-text">Birthday: ${person.dob.date}</p>
        </div>
    </div> 
    `
    return html;
}

const refineElement = (element) => {
    //if it is not one of the divs without the card class, one has to go up two levels. Otherwise, just one.
    if(element.tagName.toLowerCase() === 'div'){
        if(element.classList[0] !== 'card'){
            return element.parentElement;
        } else {
            return element;
        }
    }else {
        return element.parentElement.parentElement;
    }
}

function generateModal(element) {
    const elementRefined = refineElement(element)
    //find out which of the random users was clicked via the first and last name.
    const name = elementRefined.querySelector('#name').textContent.split(' ');
    const firstName = name[0];
    const lastName = name[1];
    personPromise
        .then( persons => {
            return persons.filter(person => {
                if (person.name.first === firstName && person.name.last === lastName){
                    return true;
                } else {
                    return false;
                }
            })
        })
        .then(person => generateModalHtml(person[0]))
        .then(html => insertModalHtml(html))
}

function insertModalHtml(html) {
    const body = document.querySelector('body')
    body.insertAdjacentHTML('beforeend', html)
}

//Event listeners
//open modal
document.querySelector('#gallery').addEventListener('click', (event) => {
    const elementClassList = Array.from(event.target.classList);
    elementClassList.filter(element => {
        if(classArr.includes(element)){
            return true;
        } else {
            return false;
        }
    })
    if(elementClassList.length > 0){
        generateModal(event.target)
    }
})
//close modal
document.querySelector('body').addEventListener('click', (event) => {
    if (event.target.matches('button.modal-close-btn') || event.target.tagName.toLowerCase() === 'strong'){
        const modal = document.querySelector('div.modal-container');
        modal.remove();
    }
})