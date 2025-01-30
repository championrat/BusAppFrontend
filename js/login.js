$(document).ready(function() {
    // Check if user is already logged in (optional - if session is available)
    const userToken = localStorage.getItem('access_token');
    const usernameLinks = document.getElementById('username-links');
    const userLinks = document.getElementById('user-links');
    const usernameDisplay = document.getElementById('user-name');

    if (userToken) {
        userLinks.style.display = 'none';
        usernameLinks.style.display = 'inline-block';
        const username = localStorage.getItem('user-name');
        usernameDisplay.textContent = username;
    } else {
        userLinks.style.display = 'inline-block';
        usernameLinks.style.display = 'none';
    }

    // Handle form submission
    $('#login-form').submit(function(e) {
        e.preventDefault();

        let username = $('#user-name').val();
        let password = $('#password').val();

        // Clear any previous messages
        $('#message').html('');

        $.ajax({
            url: `${API_URL}/api/login/`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function(response) {
                if (response.access_token) {
                    // Save the token and username locally
                    localStorage.setItem('access_token', response.access_token);
                    localStorage.setItem('refresh_token', response.refresh_token);
                    localStorage.setItem('user-name', username);

                    // Check if the user is part of the admin group
                    $.ajax({
                        url: `${API_URL}/api/user/info/`,
                        type: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + response.access_token
                        },
                        success: function(userInfoResponse) {
                            const userGroups = userInfoResponse.user_groups;
                            
                            // Check if the user belongs to the 'admin' group
                            if (userGroups.includes('admin')) {
                                localStorage.setItem('is_admin', true);
                                localStorage.setItem('is_driver', false);
                                window.location.href = 'admin-dashboard.html';  // Redirect to admin dashboard
                            } else if(userGroups.includes('driver')) {
                                localStorage.setItem('is_admin', false);
                                localStorage.setItem('is_driver', true);
                                window.location.href = 'driver-dashboard.html';
                            }
                            else {
                                localStorage.setItem('is_admin', false);
                                localStorage.setItem('is_driver', false);
                                window.location.href = 'index.html';  // Redirect to the normal homepage
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('Error fetching user groups:', error);
                            $('#message').html('<p class="error">Error checking user groups. Please try again.</p>');
                        }
                    });
                } else {
                    $('#message').html('<p class="error">Invalid credentials. Please try again.</p>');
                }
            },
            error: function(xhr, status, error) {
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

