import config from "../conf/index.js";
import { displayLoader, hideLoader } from "../utils/utils.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
    const params = new URLSearchParams(search);
    const adventureId = params.get("adventure");
    return adventureId;
}

//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
    const loaderHTML = document.getElementById("loader");
    displayLoader(loaderHTML);
    try {
        const res = await fetch(
            `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`
        );
        const adventureDetailsData = await res.json();
        return adventureDetailsData;
    } catch (err) {
        return null;
    }
    finally {
        hideLoader(loaderHTML);
    }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
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
    const costPerHead = adventure.costPerHead;
    const reservationCostHTML = document.getElementById("reservation-cost");
    reservationCostHTML.textContent = costPerHead * persons;
}

//Implementation of reservation form submission
async function captureFormSubmit(adventure) {
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
    const postReservationData = {
        name,
        date,
        person,
        adventure: adventureId,
    };
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
    const reservedBanner = document.getElementById("reserved-banner");
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
