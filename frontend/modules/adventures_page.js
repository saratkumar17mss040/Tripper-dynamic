import config from "../conf/index.js";
import { displayLoader, hideLoader } from "../utils/utils.js";

const toastTrigger = document.getElementById('liveToastBtn')
// if (toastTrigger) {
//     toastTrigger.addEventListener('click', () => {
//         // const toast = new bootstrap.Toast(toastLiveExample)
//         // toast.show();
//     })
// }

//Implementation to extract city from query params
function getCityFromURL(search) {
    // TODO: MODULE_ADVENTURES
    // 1. Extract the city id from the URL's Query Param and return it
    const params = new URLSearchParams(search);
    const city = params.get("city");
    return city;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
    // TODO: MODULE_ADVENTURES
    // 1. Fetch adventures using the Backend API and return the data
    const loaderHTML = document.getElementById("loader");
    displayLoader(loaderHTML);
    try {
        const res = await fetch(
            `${config.backendEndpoint}/adventures?city=${city}`
        );
        const adventuresData = await res.json();
        return adventuresData;
    } catch (err) {
        return null;
    }
    finally {
        hideLoader(loaderHTML);
    }
}

async function postNewAdventure(city) {
    const toastLiveExample = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLiveExample);
    try {
        const postAdvenutreRes = await fetch(`${config.backendEndpoint}/adventures/new`, {
            method: "POST",
            body: JSON.stringify({ city }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const postAdventureData = await postAdvenutreRes.json();
        console.log(postAdventureData);
        if (postAdventureData.success) {
            toast.show();
            await fetchAdventures(city);
            // setTimeout(() => {
            //     // toastLiveExample.classList.remove('hide');
            //     toast.hide();
            // }, 3000);
        }
    } catch (err) {
        return null;
    }
    finally {
        // toast.hide();
    }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
    // TODO: MODULE_ADVENTURES
    // 1. Populate the Adventure Cards and insert those details into the DOM
    const adventureContainer = document.getElementById("data");
    let adventureCardsHTML = "";
    adventureContainer.innerHTML = "";
    adventures.forEach((adventure) => {
        adventureCardsHTML += `<div class="col-6 col-lg-3 pos-rel">
    <div class="category-banner">${adventure.category}</div>
    <a href="detail/?adventure=${adventure.id}" id="${adventure.id}">
    <div class="activity-card">
      <img src="${adventure.image}" alt="${adventure.name}-img"/>
                        <div class="d-flex w-75 justify-content-between mt-2">
                        <p>${adventure.name}</p>
                        <p>${adventure.costPerHead}${adventure.currency === "INR" ? "&#x20B9;" : "🤑"
            }</p>
                        </div>
                        <div class="d-flex w-75 justify-content-between">
                            <p>Duration</p>
                            <p>${adventure.duration} Hours</p>
                        </div>
                    </div>
                    </a>
                </div>`;
    });
    adventureContainer.innerHTML = adventureCardsHTML;
    // return adventureCardsHTML;
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
    // TODO: MODULE_FILTERS
    // 1. Filter adventures based on Duration and return filtered list
    const filteredList = list.filter(item => item.duration >= parseInt(low, 10) && item.duration <= parseInt(high, 10));
    return filteredList;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
    // TODO: MODULE_FILTERS
    // 1. Filter adventures based on their Category and return filtered list
    return list.filter((adventure) => categoryList.includes(adventure.category));
    // return filteredList;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
    // TODO: MODULE_FILTERS
    // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
    // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
    // Place holder for functionality to work in the Stubs
    if (filters.category.length > 0 && filters.duration) {
        const categoryFilteredList = filterByCategory(list, filters.category);
        const [low, high] = filters.duration.split("-");
        return filterByDuration(categoryFilteredList, low, high);
    } else if (filters.category.length > 0) {
        const categoryList = filters.category;
        return filterByCategory(list, categoryList);
    } else if (filters.duration) {
        const [low, high] = filters.duration.split("-");
        return filterByDuration(list, low, high);
    }
    return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
    // TODO: MODULE_FILTERS
    // 1. Store the filters as a String to localStorage
    localStorage.setItem("filters", JSON.stringify(filters));
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
    // TODO: MODULE_FILTERS
    // 1. Get the filters from localStorage and return String read as an object
    // Place holder for functionality to work in the Stubs
    return JSON.parse(localStorage.getItem("filters"));
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
    // TODO: MODULE_FILTERS
    // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
    const categoryPillsContainer = document.getElementById("category-list");
    let pillsHTML = '';
    filters.category.forEach(item => {
        pillsHTML += `<div class="category-filter">${item}<span class="close">&times;</span></div>`;
    });
    categoryPillsContainer.innerHTML = pillsHTML;
    addListenersForClosingPills(filters);
}

function addListenersForClosingPills(filters, adventures = []) {
    const selectedCategoryPills = document.getElementsByClassName('close');
    [...selectedCategoryPills].forEach(pills => {
        pills.addEventListener('click', function () {
            closePillFromDOM(filters, adventures);
        });
    });
}

function closePillFromDOM(filters, adventures) {
    const closedCategoryPillItem = event.target.parentElement.childNodes[0].data.trim();
    let categoryCopy = [...filters.category];
    categoryCopy = categoryCopy.filter(item => item !== closedCategoryPillItem);
    filters.category = categoryCopy;
    event.target.parentElement.remove();
    document.getElementById("data").textContent = "";
    const filteredCategories = filterFunction(adventures, filters);
    addAdventureToDOM(filteredCategories);
    saveFiltersToLocalStorage(filters);
}

export {
    getCityFromURL,
    fetchAdventures,
    postNewAdventure,
    addAdventureToDOM,
    filterByDuration,
    filterByCategory,
    filterFunction,
    saveFiltersToLocalStorage,
    getFiltersFromLocalStorage,
    generateFilterPillsAndUpdateDOM,
    addListenersForClosingPills
};
