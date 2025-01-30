document.addEventListener('DOMContentLoaded', function() {
    const usernameLinks = document.getElementById('username-links');
    const userLinks = document.getElementById('user-links');
    const usernameDisplay = document.getElementById('username');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    
    const adminLinks = document.getElementById('admin-links'); // Admin specific links (My Buses, Add Bus, etc.)
    const userLinksLeft = document.getElementById('user-links-left'); // User specific links (Bus Search, Book Tickets, etc.)
    const adminLinksLeft = document.getElementById('admin-links-left'); // Admin specific links (Admin Dashboard, Manage Users, etc.)
    const driverLinksLeft = document.getElementById('driver-links-left'); // Driver specific links (Driver Dashboard, KYC, Drive Bus, etc.)

    // Check if the user is logged in
    const userToken = localStorage.getItem('access_token');

    if (userToken) {
        // User is logged in, display username and profile link
        userLinks.style.display = 'none';
        usernameLinks.style.display = 'inline-block';

        // Get username from localStorage
        const user_name = localStorage.getItem('user-name');
        usernameDisplay.textContent = user_name; // Display username

        // Check if the user is an admin and show relevant links
        const isAdmin = localStorage.getItem('is_admin');
        const isDriver = localStorage.getItem('is_driver'); // Check if the user is a driver

        if (isAdmin === 'true') {
            // Show admin-related links
            if (adminLinks) {
                adminLinks.style.display = 'inline-block';
            }
            if (adminLinksLeft) {
                adminLinksLeft.style.display = 'inline-block';
            }
            if (userLinksLeft) {
                userLinksLeft.style.display = 'none'; // Hide regular user links for admins
            }
            if (driverLinksLeft) {
                driverLinksLeft.style.display = 'none'; // Hide driver links for admins
            }
        } else if (isDriver === 'true') {
            // Show driver-related links
            if (driverLinksLeft) {
                driverLinksLeft.style.display = 'inline-block';
            }
            if (userLinksLeft) {
                userLinksLeft.style.display = 'none'; // Hide user links for drivers
            }
            if (adminLinksLeft) {
                adminLinksLeft.style.display = 'none'; // Hide admin links for drivers
            }
        } else {
            // Regular user, show user-specific links
            if (userLinksLeft) {
                userLinksLeft.style.display = 'inline-block';
            }
            if (adminLinksLeft) {
                adminLinksLeft.style.display = 'none'; // Hide admin links for regular users
            }
            if (driverLinksLeft) {
                driverLinksLeft.style.display = 'none'; // Hide driver links for regular users
            }
        }
    } else {
        // User is not logged in, show login and signup links
        userLinks.style.display = 'inline-block';
        usernameLinks.style.display = 'none';
        if (userLinksLeft) {
            userLinksLeft.style.display = 'inline-block'; // Display user-specific links if not logged in
        }
        if (adminLinksLeft) {
            adminLinksLeft.style.display = 'none'; // Hide admin links if not logged in
        }
        if (driverLinksLeft) {
            driverLinksLeft.style.display = 'none'; // Hide driver links if not logged in
        }
    }
});
