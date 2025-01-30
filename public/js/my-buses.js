$(document).ready(function() {
    // Function to fetch buses for the logged-in admin user
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
                // Log the response to the console
                // console.log(response);
                
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
            let destinations = bus.destinations;
            if (typeof destinations === 'string') {
                try {
                    destinations = JSON.parse(destinations);  // Parse the JSON string into an array
                } catch (e) {
                    console.error('Error parsing destinations:', e);
                    destinations = [];  // If parsing fails, fallback to empty array
                }
            }
    
            // Ensure bus.ticket_costs is an array (it may also be a JSON string)
            let ticketCosts = bus.ticket_costs;
            if (typeof ticketCosts === 'string') {
                // If it's a string (JSON), try to parse it into an array
                try {
                    ticketCosts = JSON.parse(ticketCosts);  // Parse the JSON string into an array
                } catch (e) {
                    console.error('Error parsing ticket costs:', e);
                    ticketCosts = [];  // If parsing fails, fallback to empty array
                }
            }
    
            // Ensure destinations and ticketCosts are arrays before displaying
            if (Array.isArray(destinations) && Array.isArray(ticketCosts)) {
                busCards += `
                    <div class="card">
                        <h3>Bus No: ${bus.bus_no}</h3>
                        <p><strong>Departure Location:</strong> ${bus.departure_location}</p>
                        <p><strong>Departure Time:</strong> ${new Date(bus.departure_time).toLocaleString()}</p>
                        <p><strong>Destinations:</strong> ${destinations.join(', ')}</p>
                        <p><strong>Seats Available:</strong> ${bus.seats_available}</p>
                        <p><strong>Ticket Costs:</strong> ${ticketCosts.join(', ')}</p>
                        <p><strong>Status:</strong> ${bus.bus_status}</p>
                        <p><strong>Driver:</strong> ${bus.driver}</p>
                        <button class="view-details-btn" onclick="viewBusDetails(${bus.bus_no})">View Bus Details</button>
                    </div>
                `;
            } else {
                busCards += `
                    <div class="card">
                        <h3>Bus No: ${bus.bus_no}</h3>
                        <p><strong>Departure Location:</strong> ${bus.departure_location}</p>
                        <p><strong>Departure Time:</strong> ${new Date(bus.departure_time).toLocaleString()}</p>
                        <p><strong>Destinations:</strong> Invalid data</p>
                        <p><strong>Seats Available:</strong> ${bus.seats_available}</p>
                        <p><strong>Ticket Costs:</strong> Invalid data</p>
                        <button class="view-details-btn" onclick="viewBusDetails(${bus.bus_no})">View Bus Details</button>
                    </div>
                `;
            }
        });
    
        $('#bus-container').html(busCards);  // Insert the bus cards into the container
    }
    
    // Function to view bus details (this redirects to view-bus-details.html)
    window.viewBusDetails = function(busNo) {
        // Redirect to view-bus-details.html with bus number as query parameter
        window.location.href = `bus-details.html?bus_no=${busNo}`;
    };
    
    // Call the fetchUserBuses function when the page loads
    fetchUserBuses();
});
