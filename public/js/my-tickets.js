// Function to fetch user tickets
async function fetchTickets() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("You are not logged in!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/user/tickets/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        displayTickets(data.tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }
}

// Function to display tickets as cards
function displayTickets(tickets) {
    const container = document.getElementById('tickets-container');
    container.innerHTML = ''; // Clear any existing content

    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = `ticket-${ticket.Ticket_No}`;  // Add an id to each card for easy selection

        card.innerHTML = `
            <h3>Ticket No: ${ticket.Ticket_No}</h3>
            <p><strong>Bus No:</strong> <span class="bus-no">${ticket.Bus_No}</span></p>
            <p><strong>Passenger:</strong> <span class="passenger-name">${ticket.Passenger_Name}</span></p>
            <p><strong>Age:</strong> <span class="passenger-age">${ticket.Passenger_Age}</span></p>
            <p><strong>Account:</strong> <span class="acct-name">${ticket.Acct_Name}</span></p>
            <p><strong>Status:</strong> ${ticket.TicketStatus}</p>
            <button class="cancel-btn" onclick="cancelTicket(${ticket.Ticket_No})">Cancel Ticket</button>
        `;

        container.appendChild(card);
    });
}


// Function to handle ticket cancellation
function cancelTicket(ticketNo) {
    const ticketElement = document.querySelector(`#ticket-${ticketNo}`);
    const busNo = ticketElement.querySelector('.bus-no').textContent;
    const passengerName = ticketElement.querySelector('.passenger-name').textContent;
    const passengerAge = ticketElement.querySelector('.passenger-age').textContent;
    const acctName = ticketElement.querySelector('.acct-name').textContent;

    // Redirect to cancel-ticket.html with ticket info as query parameters
    const url = new URL('cancel-ticket.html', window.location.origin);
    url.searchParams.append('ticketNo', ticketNo);
    url.searchParams.append('busNo', busNo);
    url.searchParams.append('passengerName', passengerName);
    url.searchParams.append('passengerAge', passengerAge);
    url.searchParams.append('acctName', acctName);

    window.location.href = url;  // Redirect to the cancel page
}


// Fetch the tickets on page load
document.addEventListener('DOMContentLoaded', fetchTickets);
