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
    let spins = 10; // Number of words to show during the spin
    let currentSpin = 0;
    const spinInterval = setInterval(() => {
        if (currentSpin >= spins) {
            clearInterval(spinInterval);
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex];
            const formattedWord = encodeURIComponent(randomWord.replace(/\s+/g, '_').replace(/_/g, ' '));
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
            fetchMerriamWebsterDefinition(word);
        }
    } catch (error) {
        fetchMerriamWebsterDefinition(word);
    }
}

async function fetchMerriamWebsterDefinition(word) {
    // Replace underscores with spaces and extract the first word
    const firstWord = word.replace(/_/g, ' ').split(' ')[0];
    const apiKey = '7cb5578e-0372-4f10-b9bc-9cb4ff9ae5af'; // Replace with your actual API key. This key is locked to the URL that was registered for.
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(firstWord)}?key=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0 && data[0].shortdef) {
                const definition = data[0].shortdef[0];
                document.getElementById('paragraph').innerText = definition;
            } else {
                document.getElementById('paragraph').innerText = 'Definition not available.';
            }
        } else {
            document.getElementById('paragraph').innerText = 'Definition not available.';
        }
    } catch (error) {
        document.getElementById('paragraph').innerText = 'Error fetching definition.';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Load words when the page is loaded
document.addEventListener('DOMContentLoaded', loadWords);
