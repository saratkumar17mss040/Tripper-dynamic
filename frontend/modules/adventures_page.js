import config from '../conf/index.js';
import { displayLoader, hideLoader } from '../utils/utils.js';

//Implementation to extract city from query params
function getCityFromURL(search) {
	const params = new URLSearchParams(search);
	const city = params.get('city');
	return city;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
	const loaderHTML = document.getElementById('loader');
	displayLoader(loaderHTML);
	try {
		const res = await fetch(
			`${config.backendEndpoint}/adventures?city=${city}`
		);
		const adventuresData = await res.json();
		return adventuresData;
	} catch (err) {
		return null;
	} finally {
		hideLoader(loaderHTML);
	}
}

async function postNewAdventure(city) {
	const toastLiveExample = document.getElementById(
		'liveToastForAddNewAdventure'
	);
	const toast = new bootstrap.Toast(toastLiveExample);
	const toastBody = document.querySelector('.toast-body');
	const toastBodyDiv = document.querySelector('.toast-body-div');
	try {
		const postAdvenutreRes = await fetch(
			`${config.backendEndpoint}/adventures/new`,
			{
				method: 'POST',
				body: JSON.stringify({ city }),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const postAdventureData = await postAdvenutreRes.json();
		if (postAdventureData.success) {
			toastBody.textContent = 'Success: Random adventure added !';
			toastBodyDiv.classList.add('toast-success');
			toast.show();
			const adventuresData = await fetchAdventures(city);
			addAdventureToDOM(adventuresData);
			setTimeout(() => {
				toast.hide();
				toastBodyDiv.classList.remove('toast-success');
			}, 2000);
		} else {
			toastBody.textContent = 'Failed: Failed to add Random adventure !';
			toastBodyDiv.classList.add('toast-warning');
			toast.show();
			await fetchAdventures(city);
			setTimeout(() => {
				toast.hide();
				toastBodyDiv.classList.remove('toast-warning');
			}, 2000);
		}
	} catch (err) {
		console.error(err);
		return null;
	} finally {
		toast.hide();
	}
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
	const adventureContainer = document.getElementById('data');
	let adventureCardsHTML = '';
	adventureContainer.innerHTML = '';
	adventures.forEach((adventure) => {
		adventureCardsHTML += `<div class="col-6 col-lg-3 pos-rel">
    <div class="category-banner">${adventure.category}</div>
    <a href="detail/?adventure=${adventure.id}" id="${adventure.id}">
    <div class="activity-card">
      <img src="${adventure.image}" alt="${adventure.name}-img"/>
                        <div class="d-flex w-75 justify-content-between mt-2">
                        <p>${adventure.name}</p>
                        <p>${adventure.costPerHead}${
			adventure.currency === 'INR' ? '&#x20B9;' : '🤑'
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
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
	const filteredList = list.filter(
		(item) =>
			item.duration >= parseInt(low, 10) && item.duration <= parseInt(high, 10)
	);
	return filteredList;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
	return list.filter((adventure) => categoryList.includes(adventure.category));
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
	if (filters.category.length > 0 && filters.duration) {
		const categoryFilteredList = filterByCategory(list, filters.category);
		const [low, high] = filters.duration.split('-');
		return filterByDuration(categoryFilteredList, low, high);
	} else if (filters.category.length > 0) {
		const categoryList = filters.category;
		return filterByCategory(list, categoryList);
	} else if (filters.duration) {
		const [low, high] = filters.duration.split('-');
		return filterByDuration(list, low, high);
	}
	return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
	localStorage.setItem('filters', JSON.stringify(filters));
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
	return JSON.parse(localStorage.getItem('filters'));
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
	const categoryPillsContainer = document.getElementById('category-list');
	let pillsHTML = '';
	filters.category.forEach((item) => {
		pillsHTML += `<div class="category-filter">${item}<span class="close">&times;</span></div>`;
	});
	categoryPillsContainer.innerHTML = pillsHTML;
	addListenersForClosingPills(filters);
}

function addListenersForClosingPills(filters, adventures = []) {
	const selectedCategoryPills = document.getElementsByClassName('close');
	[...selectedCategoryPills].forEach((pills) => {
		pills.addEventListener('click', function () {
			closePillFromDOM(filters, adventures);
		});
	});
}

function closePillFromDOM(filters, adventures) {
	const closedCategoryPillItem =
		event.target.parentElement.childNodes[0].data.trim();
	let categoryCopy = [...filters.category];
	categoryCopy = categoryCopy.filter((item) => item !== closedCategoryPillItem);
	filters.category = categoryCopy;
	event.target.parentElement.remove();
	document.getElementById('data').textContent = '';
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
	addListenersForClosingPills,
};
