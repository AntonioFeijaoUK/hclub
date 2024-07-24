// Toggle between light and dark mode
document.getElementById('modeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// Generate a simple math challenge
function generateChallenge() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    document.getElementById('challenge').textContent = `What is ${num1} + ${num2}?`;
    return num1 + num2;
}

let correctAnswer = generateChallenge();

// Save the username in a cookie
function saveName() {
    let username = document.getElementById('username').value.trim().toLowerCase();
    
    // Validate username: single word, max 30 characters, lowercase
    const validUsername = /^[a-z]{1,30}$/;
    if (!validUsername.test(username)) {
        alert('Invalid username. Please enter a single word with no more than 30 lowercase characters.');
        return;
    }

    // Validate CAPTCHA answer
    const userAnswer = document.getElementById('captchaAnswer').value.trim();
    if (parseInt(userAnswer) !== correctAnswer) {
        alert('Incorrect answer to the challenge. Please try again.');
        correctAnswer = generateChallenge();
        return;
    }

    document.cookie = `username=${username}; path=/`;
    greetUser();
}

// Clear the username cookie
function clearName() {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.getElementById('greeting').textContent = 'Welcome';
    document.getElementById('username').style.display = 'inline';
    document.querySelector('button[onclick="saveName()"]').style.display = 'inline';
    document.getElementById('logoutButton').style.display = 'none';
    document.getElementById('captchaAnswer').value = '';
    correctAnswer = generateChallenge();
}

// Greet the user if the cookie is set
function greetUser() {
    const cookies = document.cookie.split('; ');
    const usernameCookie = cookies.find(cookie => cookie.startsWith('username='));
    if (usernameCookie) {
        const username = usernameCookie.split('=')[1];
        document.getElementById('greeting').textContent = `Welcome, ${username}!`;
        document.getElementById('username').style.display = 'none';
        document.querySelector('button[onclick="saveName()"]').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'inline';
        document.getElementById('challenge').style.display = 'none';
        document.getElementById('captchaAnswer').style.display = 'none';
    } else {
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('challenge').style.display = 'block';
        document.getElementById('captchaAnswer').style.display = 'block';
    }
}

// Countdown timer
function countdown() {
    const eventDate = new Date('2024-12-31T23:59:59').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (difference < 0) {
        document.getElementById('countdown').textContent = "Event has started!";
    }
}

setInterval(countdown, 1000);

// Initial setups
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('dark-mode');
    greetUser();
    countdown();
});
