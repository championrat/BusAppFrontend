document.addEventListener('DOMContentLoaded', function() {
    // Fetching bus data via GET request to /api/buses/
    // console.log(API_URL)
    $.ajax({
        url: `${API_URL}/api/buses/`,
        type: 'GET',
        success: function(response) {
            if (response.buses && response.buses.length > 0) {
                displayBuses(response.buses);
            } else {
                $('#message').html('<p class="error">No buses available.</p>');
            }
        },
        error: function(xhr, status, error) {
            let errorMsg = "An error occurred. Please try again later.";
            try {
                console.log(url)
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

    // Function to display buses as cards
    function displayBuses(buses) {
        let container = $('#bus-cards');
        container.empty(); // Clear previous cards

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
                    <p><strong>Status:</strong> ${bus.bus_status}</p>
                    <p><strong>Driver:</strong> ${bus.Driver}</p>
                </div>
            `);
        });
    }
});