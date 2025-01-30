$(document).ready(function () {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const ticketNo = urlParams.get('ticketNo');
    const busNo = urlParams.get('busNo');
    const passengerName = urlParams.get('passengerName');
    const passengerAge = urlParams.get('passengerAge');
    const acctName = urlParams.get('acctName');

    // Populate the ticket details in the HTML
    $('#ticket-no').text(ticketNo);
    $('#bus-no').text(busNo);
    $('#passenger-name').text(passengerName);
    $('#passenger-age').text(passengerAge);
    $('#acct-name').text(acctName);

    // When the "Confirm Cancellation" button is clicked
    $('#confirm-cancel-btn').click(function () {
        // Get the access token from localStorage
        accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            $('#error-message').text("You must be logged in to cancel a ticket.").show();
            return;
        }

        // Send a POST request to cancel the ticket
        $.ajax({
            url: `${API_URL}/api/cancel-ticket/`,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            data: JSON.stringify({
                ticket_no: ticketNo
            }),
            success: function () {
                // Display success message and hide the ticket info
                $('#ticket-info').hide();
                $('#success-message').show();
            },
            error: function (xhr, status, error) {
                // Display error message
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "An error occurred while canceling the ticket.";
                $('#error-message').text(errorMessage).show();
            }
        });
    });

    // Redirect to home (index.html) when the "Go to Home" button is clicked
    $('#redirect-btn').click(function () {
        window.location.href = 'index.html';
    });
});
