import config from "../conf/index.js";
import { displayLoader, hideLoader } from "../utils/utils.js";

async function init() {
    //Fetches list of all cities along with their images and description
    let cities = await fetchCities();
    let heroInputSearchHTML = document.getElementById('hero-input-search');
    heroInputSearchHTML.addEventListener('input', () => renderCitiesToDomBasedOnSearch(event, cities));
    //Updates the DOM with the cities
    renderCitiesOnDOM(cities);
}

function renderCitiesOnDOM(cities) {
    if (cities.length === 0) {
        const cityRow = document.getElementById("data");
        let noSearchFoundHTML = '<div class="col-12 no-search">No Search found !</div>';
        cityRow.innerHTML = noSearchFoundHTML;
        console.log(cityRow);
        console.log("No search found !");
    }
    else {
        cities.forEach((key) => {
            addCityToDOM(key.id, key.city, key.description, key.image);
        });
    }
}

function renderCitiesToDomBasedOnSearch(event, cities) {
    console.log(event.target.value);
    const cityRow = document.getElementById("data");
    cityRow.innerHTML = '';
    const citySearchValue = event.target.value.toLowerCase().trim();
    if (citySearchValue && citySearchValue.length > 0) {
        cities = cities.filter(city => {
            if (city.city.toLowerCase().includes(citySearchValue)) {
                return city;
            }
        });
        renderCitiesOnDOM(cities)
    }
    // console.log("render all citites");
    else {
        renderCitiesOnDOM(cities);
    };
    // }
}

//Implementation of fetch call
async function fetchCities() {
    // TODO: MODULE_CITIES
    // 1. Fetch cities using the Backend API and return the data
    const loaderHTML = document.getElementById("loader");
    displayLoader(loaderHTML);
    try {
        const res = await fetch(`${config.backendEndpoint}/cities`);
        const data = await res.json();
        return data;
    } catch (err) {
        return null;
    }
    finally {
        hideLoader(loaderHTML);
    }
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
    // TODO: MODULE_CITIES
    // 1. Populate the City details and insert those details into the DOM
    const cityRow = document.getElementById("data");
    let cityHTML = `<div class="col-sm-6 col-lg-3 my-2">
  <a href="pages/adventures/?city=${id}" id="${id}">
          <div class="tile">
            <img src="${image}" />
            <div class="tile-text text-center">
              <h5>${city}</h5>
              <p>${description}</p>
            </div>
          </div>
        </a>
  </div>`;
    cityRow.innerHTML += cityHTML;
}

export { init, fetchCities, addCityToDOM };
