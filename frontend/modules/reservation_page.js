import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
    // TODO: MODULE_RESERVATIONS
    // 1. Fetch Reservations by invoking the REST API and return them
    // Place holder for functionality to work in the Stubs
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
        // reservationTableBody.style.display = "block";
        reservationTableParentDiv.style.display = "block";
        let tableRowDataHTML = "";
        reservations.forEach((adventure) => {
            let date = adventure.date;
            let [year, month, day] = date.split("-");
            // let dateInDDMMYY = [day, month, year].join(
            //   "/"
            // );
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
      </tr>`;
        });
        reservationTableBody.innerHTML = tableRowDataHTML;
    }

    //Conditionally render the no-reservation-banner and reservation-table-parent

    /*
      Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
      The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page
  
      Note:
      1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
      2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
    */
}


export { fetchReservations, addReservationToTable };
