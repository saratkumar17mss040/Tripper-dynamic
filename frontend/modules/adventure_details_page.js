import config from "../conf/index.js";
import { displayLoader, hideLoader } from "../utils/utils.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
    // TODO: MODULE_ADVENTURE_DETAILS
    // 1. Get the Adventure Id from the URL
    const params = new URLSearchParams(search);
    const adventureId = params.get("adventure");
    return adventureId;
    // Place holder for functionality to work in the Stubs
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
    // TODO: MODULE_ADVENTURE_DETAILS
    // 1. Fetch the details of the adventure by making an API call
    const loaderHTML = document.getElementById("loader");
    displayLoader(loaderHTML);
    try {
        const res = await fetch(
            `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`
        );
        const adventureDetailsData = await res.json();
        return adventureDetailsData;
    } catch (err) {
        // Place holder for functionality to work in the Stubs
        return null;
    }
    finally {
        hideLoader(loaderHTML);
    }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
    // TODO: MODULE_ADVENTURE_DETAILS
    // 1. Add the details of the adventure to the HTML DOM
    const adventureNameHTML = document.getElementById("adventure-name");
    const adventureSubtitleHTML = document.getElementById("adventure-subtitle");
    const adventureContentHTML = document.getElementById("adventure-content");
    adventureNameHTML.textContent = adventure.name;
    adventureSubtitleHTML.textContent = adventure.subtitle;
    adventureContentHTML.textContent = adventure.content;
    // This function is called as to satisfy both addAdventureToDOM() and addBootstrapPhotoGallery()
    // tests as well to set alt on images or else no need to call here - addBootstrapPhotoGallery() is
    // called in details/index.html file.
    addBootstrapPhotoGallery(adventure.images, adventure.name);
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images, adventureName = "adventure-name") {
    // TODO: MODULE_ADVENTURE_DETAILS
    // 1. Add the bootstrap carousel to show the Adventure images
    const photoGalleryHTML = document.getElementById("photo-gallery");
    let carouselContainerHTML = `<div id="photoGalleryIndicators" class="carousel slide" data-bs-ride="carousel">`;
    let carouselIndicatorHTML = `${carouselContainerHTML}
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#photoGalleryIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#photoGalleryIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#photoGalleryIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>`;

    let adventureImagesHTML = "";
    images.forEach((img, index) => {
        adventureImagesHTML += `<div class="carousel-item ${index === 0 ? "active" : ""
            }">
    <img class="d-block w-100 activity-card-image" src=${img} alt=${adventureName} />
    </div>`;
    });

    let carouselInnerHTML = `<div class="carousel-inner">
    ${adventureImagesHTML}
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#photoGalleryIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#photoGalleryIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
  </div>`;
    photoGalleryHTML.innerHTML = carouselIndicatorHTML + carouselInnerHTML;
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
    // TODO: MODULE_RESERVATIONS
    // 1. If the adventure is already reserved, display the sold-out message.
    const soldOutPanelHTML = document.getElementById(
        "reservation-panel-sold-out"
    );
    const reservationFormHTML = document.getElementById(
        "reservation-panel-available"
    );
    const reservationCostPerHeadHTML = document.getElementById(
        "reservation-person-cost"
    );

    if (adventure.available) {
        soldOutPanelHTML.style.display = "none";
        reservationFormHTML.style.display = "block";
        reservationCostPerHeadHTML.textContent = adventure.costPerHead;
    } else {
        soldOutPanelHTML.style.display = "block";
        reservationFormHTML.style.display = "none";
    }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
    // TODO: MODULE_RESERVATIONS
    // 1. Calculate the cost based on number of persons and update the reservation-cost field
    const costPerHead = adventure.costPerHead;
    const reservationCostHTML = document.getElementById("reservation-cost");
    reservationCostHTML.textContent = costPerHead * persons;
}

//Implementation of reservation form submission
async function captureFormSubmit(adventure) {
    // TODO: MODULE_RESERVATIONS
    // 1. Capture the query details and make a POST API call using fetch() to make the reservation
    // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
    const reservationForm = document.getElementById("myForm");
    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        postReservationFormData(adventure, reservationForm);
    });
}

async function postReservationFormData(adventure, reservationForm) {
    const adventureId = adventure.id;
    const name = reservationForm.elements["name"].value;
    const date = reservationForm.elements["date"].value;
    const person = reservationForm.elements["person"].value;
    console.log(adventure);
    console.log(name, date, person);
    const postReservationData = {
        name,
        date,
        person,
        adventure: adventureId,
    };
    console.log(postReservationData);
    try {
        const reservationRes = await fetch(
            `${config.backendEndpoint}/reservations/new`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postReservationData),
            }
        );
        const reservationData = await reservationRes.json();
        const alertTop = document.querySelector('.myAlert-top');
        const alertMsg = document.getElementById('alert-msg');
        const alertContainer = document.getElementById('alert-container');
        alertMsg.textContent = '';
        if (reservationData.success) {
            alertTop.style.display = 'flex';
            alertMsg.textContent = 'Success: Adventure reserved !';
            alertContainer.classList.add('alert-success');
            setTimeout(function () {
                alertContainer.classList.remove('alert-success');
                alertTop.style.display = 'none';
            }, 2000);
        }
        else {
            alertTop.style.display = 'flex';
            alertMsg.textContent = `Failed: ${reservationData.message} !`;
            alertContainer.classList.add('alert-warning');
            setTimeout(function () {
                alertContainer.classList.remove('alert-warning');
                alertTop.style.display = 'none';
            }, 2000);
        }
    } catch (err) {
        console.error(err);
    }
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
    // TODO: MODULE_RESERVATIONS
    // 1. If user has already reserved this adventure, show the reserved-banner, else don't
    const reservedBanner = document.getElementById("reserved-banner");
    console.log(adventure);
    if (adventure.reserved) {
        reservedBanner.style.display = "block";
    } else {
        reservedBanner.style.display = "none";
    }
}


export {
    getAdventureIdFromURL,
    fetchAdventureDetails,
    addAdventureDetailsToDOM,
    addBootstrapPhotoGallery,
    conditionalRenderingOfReservationPanel,
    captureFormSubmit,
    calculateReservationCostAndUpdateDOM,
    showBannerIfAlreadyReserved,
};
