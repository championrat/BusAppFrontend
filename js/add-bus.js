$(document).ready(function() {
    // Handle form submission
    $('#add-bus-form').submit(function(e) {
        e.preventDefault();

        // Collect input values from the form
        const busNo = $('#bus-no').val();
        const departureLocation = $('#departure-location').val();
        const departureTime = $('#departure-time').val();
        const formattedDepartureTime = new Date(departureTime).toISOString().slice(0, 19);
        const destinations = $('#destinations').val().split(',').map(item => item.trim()); // Split by comma and trim whitespace
        let seatsAvailable = $('#seats-available').val();
        const ticketCosts = $('#ticket-costs').val().split(',').map(item => parseInt(item.trim()));  // Convert to numbers

        // Parse seatsAvailable into a number and check if it is a non-negative integer
        seatsAvailable = parseInt(seatsAvailable);
        if (isNaN(seatsAvailable) || seatsAvailable < 0) {
            $('#message').html('<p class="error">Seats available must be a non-negative integer.</p>');
            return;  // Exit the function if the validation fails
        }

        // Prepare the data object
        const busData = {
            bus_no: busNo,
            departure_location: departureLocation,
            departure_time: formattedDepartureTime,
            destinations: destinations,
            seats_available: seatsAvailable,
            ticket_costs: ticketCosts
        };

        // Clear any previous message
        $('#message').html('');

        // Send POST request with the form data
        $.ajax({
            url: `${API_URL}/api/add-bus/`,
            type: 'POST',
            contentType: 'application/json',
            headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
            data: JSON.stringify(busData),
            success: function(response) {
                // On success, show a confirmation message
                $('#message').html('<p class="success">Bus added successfully!</p>');
            },
            error: function(xhr, status, error) {
                // On error, show the error message
                let errorMsg = "An error occurred. Please try again later.";
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        errorMsg = response.message;
                    }
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                $('#message').html('<p class="error">' + errorMsg + '</p>');
            }
        });
    });
});
