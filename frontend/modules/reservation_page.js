import config from "../conf/index.js";
import { hideLoader, displayLoader } from "../utils/utils.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
    // TODO: MODULE_RESERVATIONS
    // 1. Fetch Reservations by invoking the REST API and return them
    // Place holder for functionality to work in the Stubs
    const loaderHTML = document.getElementById("loader");
    displayLoader(loaderHTML);
    try {
        const reservationRes = await fetch(
            `${config.backendEndpoint}/reservations`
        );
        const reservationData = await reservationRes.json();
        console.log(reservationData);
        return reservationData;
    } catch (err) {
        return null;
    }
    finally {
        hideLoader(loaderHTML);
    }
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
    // TODO: MODULE_RESERVATIONS
    // 1. Add the Reservations to the HTML DOM so that they show up in the table
    const noReservationBanner = document.getElementById('no-reservation-banner');
    const reservationTableBody = document.getElementById('reservation-table');
    const reservationTableParentDiv = document.getElementById('reservation-table-parent');

    if (reservations.length === 0) {
        noReservationBanner.style.display = "block";
        // reservationTableBody.style.display = "none";
        reservationTableParentDiv.style.display = "none";
    } else {
        noReservationBanner.style.display = "none";
        reservationTableParentDiv.style.display = "block";
        let tableRowDataHTML = "";
        reservations.forEach((adventure) => {
            let date = adventure.date;
            let dateInDDMMYY = new Date(date).toLocaleDateString("en-IN");
            console.log(dateInDDMMYY);
            let bookedDate = new Date(adventure.time).toLocaleString("en-IN", { dateStyle: 'long', timeStyle: 'medium' }).replace(" at", ",");
            let adventureDetailURL = window.location.href.slice(0, window.location.href.indexOf("reservations"));
            adventureDetailURL += `detail/?adventure=${adventure.adventure}`;

            tableRowDataHTML += `<tr>
        <td><strong>${adventure.id}</strong></td>
        <td>${adventure.name}</td>
        <td>${adventure.adventureName}</td>
        <td>${adventure.person}</td>
        <td>${dateInDDMMYY}</td>
        <td>${adventure.price}</td>
        <td>${bookedDate}</td>
        <td id="${adventure.id}"><a href=${adventureDetailURL} class="reservation-visit-button" role="button">Visit Adventure</a></td>
        <td class="text-center"><i data-adventure-id=${adventure.adventure} data-bs-toggle="modal" data-bs-target="#adventureModal" class="fa fa-trash delete-reservation mt-2" aria-hidden="true"></i></td>
      </tr>
      `;
        });
        reservationTableBody.innerHTML = tableRowDataHTML;
        addModalShownEventListener();
    }

    //Conditionally render the no-reservation-banner and reservation-table-parent

    /*
      Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
      The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page
  
      Note:
      1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
      2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
    */

    function addModalShownEventListener() {
        const modalHTML = document.getElementById("adventureModal");
        modalHTML.addEventListener('shown.bs.modal', displayModalEvents);
    }


    function displayModalEvents(event) {
        console.log(event);
        console.log(event.relatedTarget);
        const clickedDeleteIconHTML = event.relatedTarget;
        const modalYesBtn = document.getElementById("yes-modal-btn");
        modalYesBtn.addEventListener('click', () => deleteAdventure(event, clickedDeleteIconHTML));
    }

    async function deleteAdventure(event, clickedDeleteIconHTML) {
        console.log(event);
        console.log(event.target);
        console.log(clickedDeleteIconHTML);
        const adventureId = clickedDeleteIconHTML.dataset.adventureId;
        console.log(clickedDeleteIconHTML.parentElement.parentElement);
        console.log(adventureId);
        console.log(typeof adventureId);
        const tableRowToBeRemovedHTML = clickedDeleteIconHTML.parentElement.parentElement;
        const modalHTML = document.getElementById("adventureModal");
        const modal = bootstrap.Modal.getInstance(modalHTML);
        const toastLiveExample = document.getElementById('liveToastForAddNewAdventure');
        const toast = new bootstrap.Toast(toastLiveExample);
        const toastBody = document.querySelector('.toast-body');
        const toastBodyDiv = document.querySelector('.toast-body-div');
        modal.hide();
        // console.log(event.target);
        try {
            const deleteAdventureRes = await fetch(`${config.backendEndpoint}/reservations`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "adventureId" : adventureId })
            });
            console.log(deleteAdventureRes);
            const deleteAdventureData = await deleteAdventureRes.json();
            console.log(deleteAdventureData);
            if (deleteAdventureData.success) {
                toastBody.textContent = 'Success: Adventure deleted !';
                toastBodyDiv.classList.add('toast-success');
                toast.show();
                tableRowToBeRemovedHTML.remove();
                const reservationsData = await fetchReservations();
                addReservationToTable(reservationsData);
                setTimeout(() => {
                    toast.hide();
                    toastBodyDiv.classList.remove('toast-success');
                }, 2000);
            }
            else {
                toastBody.textContent = 'Failed: Failed to delete the adventure !';
                console.error(deleteAdventureData);
                toastBodyDiv.classList.add('toast-warning');
                toast.show();
                setTimeout(() => {
                    toast.hide();
                    toastBodyDiv.classList.remove('toast-warning');
                }, 2000);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
}



export { fetchReservations, addReservationToTable };
