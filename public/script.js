// Function to log in the user and store the JWT token
function loginUser(email, password) {
    console.log("Attempting to log in with email:", email);  // Debugging

    fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('jwtToken', data.token);  // Store the token
            document.getElementById('status').textContent = "Login successful!";
            console.log('JWT Token:', data.token);

            // Show the "Share My Location" button
            document.getElementById('sendLocation').style.display = "block";
        } else {
            document.getElementById('status').textContent = "Login failed. Please check your credentials.";
        }
    })
    .catch(error => {
        document.getElementById('status').textContent = "Error logging in.";
        console.error('Error:', error);
    });
}

// Attach the event listener to the form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form from reloading the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginUser(email, password);
});

// Check token on page load to show/hide the "Share My Location" button
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');

    // Ensure token exists and show the button if true
    if (token) {
        document.getElementById('sendLocation').style.display = "block";  // Only show if token exists
    } else {
        document.getElementById('sendLocation').style.display = "none";  // Hide if no token is found
    }
});
