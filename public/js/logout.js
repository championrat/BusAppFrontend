$(document).ready(function () {
    // Send POST request to logout endpoint
    $.ajax({
        url: `${API_URL}/api/logout/`,
        method: 'POST',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
        success: function () {
            // Clear tokens and user details from localStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_name');

            // Redirect to the login page or confirmation page
            window.location.href = '/login.html';
        },
        error: function () {
            alert('Logout failed. Please try again.');
        }
    });
});