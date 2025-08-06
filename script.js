// --- DOM Element Selection (with new elements) ---
const wordDisplay = document.getElementById('word-display');
const keyboardDiv = document.getElementById('keyboard');
const figureParts = document.querySelectorAll('.figure-part');
const popupContainer = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const playAgainBtn = document.getElementById('play-again-btn');

// New Setup Screen Elements
const setupContainer = document.getElementById('setup-container');
const modeSelection = document.getElementById('mode-selection');
const wordInputContainer = document.getElementById('word-input-container');
const mainGameContainer = document.getElementById('main-game-container');

// New Buttons and Inputs
const vsComputerBtn = document.getElementById('vs-computer-btn');
const challengeBtn = document.getElementById('challenge-btn');
const backBtn = document.getElementById('back-btn');
const customWordInput = document.getElementById('custom-word-input');
const startCustomGameBtn = document.getElementById('start-custom-game-btn');


// --- Game State Variables ---
const words = ['javascript', 'programming', 'hangman', 'developer', 'interface'];
let selectedWord = '';
let correctLetters = [];
let wrongGuessCount = 0;


// --- Functions ---

/**
 * Initializes the game. Can accept a custom word.
 * If no custom word, it picks a random one.
 */
function startGame(customWord = null) {
    // Reset game state
    correctLetters = [];
    wrongGuessCount = 0;
    
    // Use custom word or pick a random one
    selectedWord = customWord ? customWord.toLowerCase() : words[Math.floor(Math.random() * words.length)];

    // Hide setup and show game
    setupContainer.classList.add('hidden');
    mainGameContainer.classList.remove('hidden');

    // Reset UI
    popupContainer.style.display = 'none';
    updateWrongGuessesDisplay();
    displayWord();
    createKeyboard();
}

/**
 * Displays the word with underscores for missing letters.
 */
function displayWord() {
    wordDisplay.innerHTML = `
        ${selectedWord
            .split('')
            .map(
                letter => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : ''}
                    </span>
                `
            )
            .join('')}
    `;

    // Check for win condition
    const innerWord = wordDisplay.innerText.replace(/\n/g, '');
    if (innerWord === selectedWord) {
        finalMessage.innerText = '🎉 Congratulations! You Won! 🎉';
        popupContainer.style.display = 'flex';
    }
}

/**
 * Updates the hangman figure and checks for loss condition.
 */
function updateWrongGuessesDisplay() {
    figureParts.forEach((part, index) => {
        if (index < wrongGuessCount) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    if (wrongGuessCount === figureParts.length) {
        finalMessage.innerText = `😕 You Lost. The word was: "${selectedWord}"`;
        popupContainer.style.display = 'flex';
    }
}

/**
 * Creates and displays the on-screen keyboard.
 */
function createKeyboard() {
    keyboardDiv.innerHTML = '';
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.addEventListener('click', () => handleGuess(letter, key));
        keyboardDiv.appendChild(key);
    });
}

/**
 * Handles the logic when a user guesses a letter.
 */
function handleGuess(letter, keyElement) {
    keyElement.disabled = true;

    if (selectedWord.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
    } else {
        wrongGuessCount++;
        updateWrongGuessesDisplay();
    }
}

/**
 * Shows the initial mode selection screen.
 */
function showModeSelection() {
    mainGameContainer.classList.add('hidden');
    wordInputContainer.classList.add('hidden');
    setupContainer.classList.remove('hidden');
    modeSelection.classList.remove('hidden');
}


// --- Event Listeners ---

// Play vs. Computer button
vsComputerBtn.addEventListener('click', () => {
    startGame(); // Start game with a random word
});

// Challenge a Friend button
challengeBtn.addEventListener('click', () => {
    modeSelection.classList.add('hidden');
    wordInputContainer.classList.remove('hidden');
});

// Back button (from word input screen)
backBtn.addEventListener('click', () => {
    wordInputContainer.classList.add('hidden');
    modeSelection.classList.remove('hidden');
});

// Start Custom Game button
startCustomGameBtn.addEventListener('click', () => {
    const word = customWordInput.value.trim();
    // Simple validation: must not be empty and must only contain letters
    if (word && /^[a-zA-Z]+$/.test(word)) {
        startGame(word);
        customWordInput.value = ''; // Clear the input
    } else {
        alert('Please enter a valid word (letters only, no spaces or numbers).');
    }
});

// Play Again button (from win/loss popup)
playAgainBtn.addEventListener('click', showModeSelection);

// --- Initial App Start ---
showModeSelection(); // Show the mode selection on page load