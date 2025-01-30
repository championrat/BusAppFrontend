$(document).ready(function () {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const busNo = urlParams.get('bus_no');
    const destinationsParam = urlParams.get('destinations');

    // Populate fields from query parameters
    $('#busno').val(busNo || '');
    if (destinationsParam) {
        const destinations = destinationsParam.split(',');
        destinations.forEach(dest => {
            $('#destinations').append(new Option(dest, dest));
        });
    }

    let passengerCount = 0;

    // Add passenger details form
    $('#add-passenger').on('click', function () {
        passengerCount++;
        $('#passenger-count').val(passengerCount);

        const passengerGroup = `
            <div class="passenger-group" id="passenger-${passengerCount}">
                <label for="passenger_name_${passengerCount-1}">Passenger Name</label>
                <input type="text" id="passenger_name_${passengerCount-1}" name="passenger_name_${passengerCount-1}" required>
                
                <label for="passenger_age_${passengerCount-1}">Passenger Age</label>
                <input type="number" id="passenger_age_${passengerCount-1}" name="passenger_age_${passengerCount-1}" required>
            </div>`;
        $('#passenger-list').append(passengerGroup);
    });

    // Remove last passenger details form
    $('#remove-passenger').on('click', function () {
        if (passengerCount > 0) {
            $(`#passenger-${passengerCount}`).remove();
            passengerCount--;
            $('#passenger-count').val(passengerCount);
        }
    });

    // Submit form via AJAX
    $('#ticketForm').on('submit', function (e) {
        e.preventDefault();

        const formData = $(this).serializeArray();
        const data = {};

        formData.forEach(item => {
            data[item.name] = item.value;
        });

        $.ajax({
            url: `${API_URL}/api/book-ticket/`,
            method: 'POST',
            contentType: 'application/json',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
            data: JSON.stringify(data),
            success: function (response) {
                const { busno, dest, np, dtime, tcost, tamount, tickets } = response;
                const confirmation = `
                    <h2>Booking Confirmation</h2>
                    <p>Bus Number: ${busno}</p>
                    <p>Destination: ${dest}</p>
                    <p>Departure Time: ${dtime}</p>
                    <p>Total Cost: ₹${tamount} (${np} passengers at ₹${tcost} each)</p>
                    <h3>Tickets:</h3>
                    <ul>
                        ${tickets.map(t => `<li>${t.Passenger_Name} (Age: ${t.Passenger_Age}), Ticket No: ${t.Ticket_No}</li>`).join('')}
                    </ul>
                    <br><br>
                    <a href="/index.html">Go to home page</a>
                `;
                $('body').html(confirmation);
            },
            error: function (xhr, err) {
                const errMsg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'An error occurred. Please try again later.';
                alert('Error booking ticket. Please try again. ' + errMsg);
            }
        });
        
    });
});