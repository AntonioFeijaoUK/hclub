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
            const formattedWord = encodeURIComponent(randomWord.replace(/\s+/g, '_').replace(/_/g, ' '));
            const wikipediaUrl = `https://en.wikipedia.org/wiki/${formattedWord}`;
            resultElement.innerHTML = `<a href="${wikipediaUrl}" target="_blank">${randomWord}</a>`;
            fetchWikipediaIntro(randomWord);
        } else {
            const randomWord = words[currentSpin % words.length];
            const wordElement = document.createElement('div');
            wordElement.className = 'falling-word';
            wordElement.innerText = randomWord;
            document.body.appendChild(wordElement);
            
            // Remove the word element after animation ends
            wordElement.addEventListener('animationend', () => {
                wordElement.remove();
            });

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
    const apiKey = '9fc03636-a4ab-4a02-b501-a86a94061432'; // Yes, I know this key is visible. This key is locked to the URL that was registered for (maybe!).
    const apiUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(firstWord)}?key=${apiKey}`;
    //const apiUrl = `https://www.dictionaryapi.com/api/v3/references/learners/json/${encodeURIComponent(firstWord)}?key=${apiKey}`;
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
    document.body.classList.toggle('light-mode');
}

// Load words when the page is loaded
document.addEventListener('DOMContentLoaded', loadWords);
