let words = [];

async function loadWords() {
    try {
        const response = await fetch('words.json');
        const data = await response.json();
        words = data.words;
    } catch (error) {
        console.error('Error loading words:', error);
    }
}

function spinRoulette() {
    if (words.length === 0) {
        document.getElementById('result').innerText = 'Words are not loaded yet.';
        return;
    }
    const resultElement = document.getElementById('result');
    const paragraphElement = document.getElementById('paragraph');
    let spins = 30; // Number of words to show during the spin
    let currentSpin = 0;
    const spinInterval = setInterval(() => {
        if (currentSpin >= spins) {
            clearInterval(spinInterval);
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex];
            const formattedWord = encodeURIComponent(randomWord.replace(/\s+/g, '_'));
            const wikipediaUrl = `https://en.wikipedia.org/wiki/${formattedWord}`;
            resultElement.innerHTML = `<a href="${wikipediaUrl}" target="_blank">${randomWord}</a>`;
            fetchWikipediaIntro(randomWord);
        } else {
            const randomWord = words[currentSpin % words.length];
            resultElement.innerText = randomWord;
            currentSpin++;
        }
    }, 100);
}

async function fetchWikipediaIntro(word) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            const intro = data.extract;
            document.getElementById('paragraph').innerText = intro;
        } else {
            document.getElementById('paragraph').innerText = 'Introduction not available.';
        }
    } catch (error) {
        document.getElementById('paragraph').innerText = 'Error fetching introduction.';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Load words when the page is loaded
document.addEventListener('DOMContentLoaded', loadWords);
