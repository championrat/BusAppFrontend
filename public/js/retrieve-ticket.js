$(document).ready(function () {
    // Form submission handler
    $('#ticket-form').submit(function (event) {
        event.preventDefault();

        // Get input values from the form
        const ticketNo = $('#ticket-no').val();
        const passengerName = $('#passenger-name').val();

        // Clear previous error and ticket information
        $('#error-message').hide();
        $('#ticket-container').empty();

        // Send a POST request to retrieve the ticket
        $.ajax({
            url: `${API_URL}/api/retrieve-ticket/`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                ticket_no: ticketNo,
                passenger_name: passengerName
            }),
            success: function (response) {
                // On success, create a card to display ticket details
                const ticket = response.ticket;
                const cardHtml = `
                    <div class="card" id="ticket-${ticket.Ticket_No}">
                        <h3>Ticket No: ${ticket.Ticket_No}</h3>
                        <p><strong>Bus No:</strong> ${ticket.Bus_No}</p>
                        <p><strong>Passenger:</strong> ${ticket.Passenger_Name}</p>
                        <p><strong>Age:</strong> ${ticket.Passenger_Age}</p>
                        <p><strong>Account Name:</strong> ${ticket.Acct_Name}</p>
                        <button class="cancel-btn" onclick="cancelTicket(${ticket.Ticket_No})">Cancel Ticket</button>
                    </div>
                `;

                // Append the card to the container
                $('#ticket-container').html(cardHtml);
            },
            error: function (xhr, status, error) {
                // On error, show an error message
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "An error occurred while retrieving the ticket.";
                $('#error-message').text(errorMessage).show();
            }
        });
    });
});

// Function to handle ticket cancellation and redirection
function cancelTicket(ticketNo) {
    // Find the card element using ticketNo
    const ticketElement = document.querySelector(`#ticket-${ticketNo}`);
    
    // Ensure that ticketElement exists
    if (ticketElement) {
        // Retrieve ticket information
        const busNo = ticketElement.querySelector('p').textContent.split(':')[1].trim();  // Bus No
        const passengerName = ticketElement.querySelector('p').nextElementSibling.textContent.split(':')[1].trim();  // Passenger Name
        const passengerAge = ticketElement.querySelector('p').nextElementSibling.nextElementSibling.textContent.split(':')[1].trim();  // Age
        const acctName = ticketElement.querySelector('p').nextElementSibling.nextElementSibling.nextElementSibling.textContent.split(':')[1].trim();  // Account Name

        // Redirect to cancel-ticket.html with ticket info as query parameters
        const url = new URL('cancel-ticket.html', window.location.origin);
        url.searchParams.append('ticketNo', ticketNo);
        url.searchParams.append('busNo', busNo);
        url.searchParams.append('passengerName', passengerName);
        url.searchParams.append('passengerAge', passengerAge);
        url.searchParams.append('acctName', acctName);

        // Redirect to the cancel page with the ticket data in the query string
        window.location.href = url;
    }
}
