// const { header } = require("express/lib/request");

$(document).ready(function() {
    let allBuses = [];

    // Function to display buses as cards
    function displayBuses(buses) {
        let container = $('#bus-cards');
        container.empty(); // Clear previous cards

        if (buses.length === 0) {
            container.append('<p class="error">No buses available.</p>');
            return;
        }

        buses.forEach(bus => {
            // Parse the JSON string for Destinations
            let destinations = JSON.parse(bus.Destinations).join(', ');
            let seatsAvailable = bus.Seats_Available;

            container.append(`
                <div class="card">
                    <h3>Bus No: ${bus.Bus_No}</h3>
                    <p><strong>Departure Location:</strong> ${bus.Departure_Location}</p>
                    <p><strong>Departure Date:</strong> ${bus.Departure_Date}</p>
                    <p><strong>Departure Time:</strong> ${bus.Departure_Time}</p>
                    <p><strong>Destinations:</strong> ${destinations}</p>
                    <p><strong>Seats Available:</strong> ${seatsAvailable}</p>
                    <button class="book-btn" onclick="window.location.href='/book-ticket.html?bus_no=${bus.Bus_No}&destinations=${encodeURIComponent(destinations)}'">Book Ticket</button>
                </div>
            `);
        });
    }

    // Initially load all buses (GET request to /api/buses/)
    $.ajax({
        url: `${API_URL}/api/buses/`,
        type: 'GET',
        // header: {Authorization: 'Bearer ' + localStorage.getItem('access_token')},
        success: function(response) {
            if (response.buses) {
                allBuses = response.buses;
                populateDropdowns(allBuses);
                displayBuses(allBuses);
            } else {
                $('#message').html('<p class="error">Failed to load buses.</p>');
            }
        },
        error: function(xhr, status, error) {
            // Handle error responses
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

    // Function to populate dropdowns for departure location and destinations
    function populateDropdowns(buses) {
        let departureLocations = [];
        let destinations = new Set();

        // Collect unique departure locations and destinations
        buses.forEach(bus => {
            if (!departureLocations.includes(bus.Departure_Location)) {
                departureLocations.push(bus.Departure_Location);
            }
            JSON.parse(bus.Destinations).forEach(destination => {
                destinations.add(destination);
            });
        });

        // Populate the departure location dropdown
        departureLocations.forEach(location => {
            $('#dep_location').append(new Option(location, location));
        });

        // Populate the destination dropdown
        destinations.forEach(destination => {
            $('#dest').append(new Option(destination, destination));
        });
    }

    // POST request to /api/search-buses/
    $('#filter-btn').click(function() {
        let depLocation = $('#dep_location').val();
        let dest = $('#dest').val();

        // Clear previous messages
        $('#message').html('');

        $.ajax({
            url: `${API_URL}/api/search-buses/`,
            type: 'POST',
            contentType: 'application/json',
            header: {Authorization: 'Bearer ' + localStorage.getItem('access_token')},
            data: JSON.stringify({
                dep_location: depLocation,
                dest: dest
            }),
            success: function(response) {
                if (response.buses) {
                    displayBuses(response.buses);
                } else if (response.message) {
                    $('#message').html('<p class="error">' + response.message + '</p>');
                } else {
                    $('#message').html('<p class="error">An error occurred. Please try again.</p>');
                }
            },
            error: function(xhr, status, error) {
                // Handle error responses
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
