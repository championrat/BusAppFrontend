$(document).ready(function() {
    // Fetches buses for the logged-in user
    function fetchUserBuses() {
        const userToken = localStorage.getItem('access_token');
        
        // Check if the user is logged in
        if (!userToken) {
            $('#message').html('You need to log in first.');
            return;
        }

        $.ajax({
            url: `${API_URL}/api/user/buses/`,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
            success: function(response) {
                // Parse the response JSON into the buses object
                const buses = response.buses || [];

                // Check if there are buses
                if (buses.length > 0) {
                    displayBuses(buses);  // Call function to display buses
                } else {
                    $('#bus-container').html('<p>No buses found for you.</p>');
                }
            },
            error: function(xhr, status, error) {
                let errorMsg = "An error occurred while fetching buses.";
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
    }

    // Function to display buses in card format
    function displayBuses(buses) {
        let busCards = '';
        buses.forEach(bus => {
            // Ensure bus.destinations is an array (it may be a JSON string)
            let destinations = bus.destinations;
            if (typeof destinations === 'string') {
                try {
                    destinations = JSON.parse(destinations);  // Parse the JSON string into an array
                } catch (e) {
                    console.error('Error parsing destinations:', e);
                    destinations = [];  // Fallback to empty array if parsing fails
                }
            }
    
            // Ensure bus.ticket_costs is an array (it may also be a JSON string)
            let ticketCosts = bus.ticket_costs;
            if (typeof ticketCosts === 'string') {
                try {
                    ticketCosts = JSON.parse(ticketCosts);  // Parse the JSON string into an array
                } catch (e) {
                    console.error('Error parsing ticket costs:', e);
                    ticketCosts = [];  // Fallback to empty array if parsing fails
                }
            }

            // Build the bus card with Cancel button
            busCards += `
                <div class="card">
                    <h3>Bus No: ${bus.bus_no}</h3>
                    <p><strong>Departure Location:</strong> ${bus.departure_location}</p>
                    <p><strong>Departure Time:</strong> ${new Date(bus.departure_time).toLocaleString()}</p>
                    <p><strong>Destinations:</strong> ${Array.isArray(destinations) ? destinations.join(', ') : 'Invalid data'}</p>
                    <p><strong>Seats Available:</strong> ${bus.seats_available}</p>
                    <p><strong>Ticket Costs:</strong> ${Array.isArray(ticketCosts) ? ticketCosts.join(', ') : 'Invalid data'}</p>
                    <button class="cancel-btn" onclick="confirmCancelBus(${bus.bus_no})">Cancel Bus</button>
                </div>
            `;
        });
    
        $('#bus-container').html(busCards);  // Insert the bus cards into the container
    }

    // Function to confirm and cancel the bus
    window.confirmCancelBus = function(busNo) {
        // Ask for confirmation before canceling the bus
        if (confirm("Are you sure you want to cancel this bus?")) {
            // If confirmed, call the delete API to delete the bus
            cancelBus(busNo);
        }
    };

    // Function to cancel the bus (calls the delete-bus API)
    function cancelBus(busNo) {
        const userToken = localStorage.getItem('access_token');
        
        $.ajax({
            url: `${API_URL}/api/delete-bus/`,
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ "bus_no": busNo }),
            success: function(response) {
                $('#message').html('<p>Bus canceled successfully!</p>');
                // Wait 5 seconds before redirecting
                setTimeout(function() {
                    window.location.href = 'my-buses.html';
                }, 5000);
            },
            error: function(xhr, status, error) {
                let errorMsg = "An error occurred while canceling the bus.";
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
    }

    // Call the fetchUserBuses function when the page loads
    fetchUserBuses();
});
