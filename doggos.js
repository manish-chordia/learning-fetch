const DOG_URL = "https://dog.ceo/api/breeds/image/random";
const DOG_BREEDS = "https://dog.ceo/api/breeds/list/all";
const FETCH_DOG_OF_PARTICULAR_BREED = "https://dog.ceo/api/breed/dog_breed/images/random";

const doggos = document.querySelector(".doggos");
const loader = document.querySelector("#loader");
const body = document.querySelector("body");
const addDoggoButton = document.querySelector(".add-doggo");

let listOfBreeds = null;
let breedToFetch = null;

function addDoggo() {
    startLoader()
    .then(() => {
        const urlToFetch = FETCH_DOG_OF_PARTICULAR_BREED.replace('dog_breed', breedToFetch);
        return fetch(urlToFetch);
    })
    .then(response => response.json())
    .then(processedResponse => {
        const img = document.createElement("img");
        img.src = processedResponse.message;
        img.alt = "Cute doggo";
        const childNode = doggos.childNodes[0];
        if(childNode) {
            doggos.replaceChild(img, childNode);
        } else {
            doggos.appendChild(img);
        }
    })
    .then(() => stopLoader());
}

function startLoader() {
    return new Promise((resolve, reject) => {
        loader.setAttribute("class", "loader");
        resolve();
    });
}

function stopLoader() {
    loader.removeAttribute("class");
}

function init() {
    return startLoader()
    .then(() => fetch(DOG_BREEDS))
    .then(response => response.json())
    .then(processedResponse => {
        listOfBreeds = processedResponse.message;
    })
    .then(() => stopLoader());
}

function breedChanged(e) {
    breedToFetch = e.target.value;
}

init()
.then(() => {
    const selectTag = document.createElement("select");
    for(breed in listOfBreeds) {
        if(listOfBreeds[breed].length === 0) {
            const optionTag = document.createElement("option");
            optionTag.setAttribute("value", breed);
            const textNode = document.createTextNode(breed);
            optionTag.appendChild(textNode);
            selectTag.appendChild(optionTag);

            if(breedToFetch === null) {
                breedToFetch = breed;
            }
        } else {
            for(let j=0; j<listOfBreeds[breed].length; j++) {
                const optionTag = document.createElement("option");
                optionTag.setAttribute("value", `${breed}/${listOfBreeds[breed][j]}`);
                const textNode = document.createTextNode(`${listOfBreeds[breed][j]} ${breed}`);
                optionTag.appendChild(textNode);
                selectTag.appendChild(optionTag);

                if(breedToFetch === null) {
                    breedToFetch = `${breed}/${listOfBreeds[breed][j]}`;
                }
            }
        }
    }
    selectTag.addEventListener('change', (e) => (breedChanged(e)));
    body.insertBefore(selectTag, addDoggoButton);
})

addDoggoButton.addEventListener('click', addDoggo);