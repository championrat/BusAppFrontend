// Check if the token is expired
function isTokenExpired(token) {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime >= payload.exp;
}

// Refresh the access token using the refresh token
async function refreshAccessToken(refreshToken) {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        return data.access_token;
    } else {
        console.error('Failed to refresh token');
        logout(); // Log out the user if refresh fails
        return null;
    }
}

// Check token expiration and refresh if necessary
function checkAndRefreshToken() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token'); // Assuming you store the refresh token

    if (!accessToken || !refreshToken) {
        logout();
        return;
    }

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // Refresh token if the access token is about to expire within the next 5 minutes (300 seconds)
    if (payload.exp - currentTime <= 300) {
        refreshAccessToken(refreshToken);
    }
}

// Handle logout by clearing tokens and redirecting to login
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'login.html'; // Redirect to login page
}

// Check token expiration on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAndRefreshToken();
    setInterval(checkAndRefreshToken, 60 * 1000); // Check every 60 seconds
});
