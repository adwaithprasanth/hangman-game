// --- DOM Elements ---
const wordDisplay = document.getElementById('word-display');
const keyboardDiv = document.getElementById('keyboard');
const figureParts = document.querySelectorAll('.figure-part');
const popupContainer = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const playAgainBtn = document.getElementById('play-again-btn');
const hintBtn = document.getElementById('hint-btn');
const hintHeartsSpan = document.getElementById('hint-hearts');

// Setup Elements
const setupContainer = document.getElementById('setup-container');
const modeSelection = document.getElementById('mode-selection');
const wordInputContainer = document.getElementById('word-input-container');
const mainGameContainer = document.getElementById('main-game-container');
const passDeviceContainer = document.getElementById('pass-device-container');

// Buttons & Inputs
const vsComputerBtn = document.getElementById('vs-computer-btn');
const challengeBtn = document.getElementById('challenge-btn');
const backBtn = document.getElementById('back-btn');
const customWordInput = document.getElementById('custom-word-input');
const startCustomGameBtn = document.getElementById('start-custom-game-btn');
const readyBtn = document.getElementById('ready-btn');

// --- Game State ---
const words = ['javascript', 'programming', 'hangman', 'developer', 'interface'];
let selectedWord = '';
let correctLetters = [];
let wrongGuessCount = 0;
let hintsLeft = 3;
let customWordForFriend = '';

// --- Helper Functions ---
function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function triggerShake() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.classList.add("shake");
  setTimeout(() => gameContainer.classList.remove("shake"), 500);
}

function updateHintDisplay() {
    const redHearts = '❤️'.repeat(hintsLeft);
    const blackHearts = '🖤'.repeat(3 - hintsLeft);
    hintHeartsSpan.innerHTML = redHearts + blackHearts;

    if (hintsLeft === 0) {
        hintBtn.disabled = true;
    }
}

// --- Game Logic ---
function startGame(customWord = null) {
  correctLetters = [];
  wrongGuessCount = 0;
  hintsLeft = 3;
  
  figureParts.forEach(part => part.classList.remove('draw-in'));
  
  hintBtn.disabled = false;
  updateHintDisplay();

  selectedWord = customWord ? customWord.toLowerCase() : words[Math.floor(Math.random() * words.length)];

  mainGameContainer.classList.remove('hidden');

  popupContainer.style.display = 'none';
  updateWrongGuessesDisplay();
  displayWord();
  createKeyboard();
}

function displayWord() {
  wordDisplay.innerHTML = `
    ${selectedWord
      .split('')
      .map(letter => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ''}
        </span>
      `).join('')}
  `;

  const innerWord = wordDisplay.innerText.replace(/\n/g, '');
  if (innerWord === selectedWord) {
    finalMessage.innerText = '🎉 Congratulations! You Won! 🎉';
    popupContainer.style.display = 'flex';
    triggerConfetti();
  }
}

function updateWrongGuessesDisplay() {
  if (wrongGuessCount > 0 && wrongGuessCount <= figureParts.length) {
    const partToDraw = figureParts[wrongGuessCount - 1];
    partToDraw.classList.add('draw-in');
  }

  if (wrongGuessCount === figureParts.length) {
    finalMessage.innerText = `😕 You Lost. The word was: "${selectedWord}"`;
    popupContainer.style.display = 'flex';
    triggerShake();
  }
}

function createKeyboard() {
  keyboardDiv.innerHTML = '';
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
    const key = document.createElement('button');
    key.className = 'key';
    key.textContent = letter;
    key.dataset.key = letter;
    key.addEventListener('click', () => handleGuess(letter, key));
    keyboardDiv.appendChild(key);
  });
}

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

function showModeSelection() {
  mainGameContainer.classList.add('hidden');
  wordInputContainer.classList.add('hidden');
  passDeviceContainer.classList.add('hidden');
  setupContainer.classList.remove('hidden');
  modeSelection.classList.remove('hidden');
}

function giveHint() {
    const unguessedLetters = selectedWord
        .split('')
        .filter(letter => !correctLetters.includes(letter));

    if (hintsLeft > 0 && unguessedLetters.length > 0) {
        hintsLeft--;

        const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        correctLetters.push(hintLetter);

        const keyElement = keyboardDiv.querySelector(`[data-key='${hintLetter}']`);
        if (keyElement) {
            keyElement.disabled = true;
        }
        
        displayWord();
        updateHintDisplay();
    }
}

function handlePhysicalKeyboard(e) {
    if (e.repeat) return;
    const letter = e.key.toLowerCase();
    
    if (letter >= 'a' && letter <= 'z') {
        const keyElement = keyboardDiv.querySelector(`[data-key='${letter}']`);
        
        if (keyElement && !keyElement.disabled) {
            keyElement.classList.add('pressed');
            setTimeout(() => keyElement.classList.remove('pressed'), 200);
            keyElement.click();
        }
    }
}

// --- Event Listeners ---
vsComputerBtn.addEventListener('click', () => {
    setupContainer.classList.add('hidden');
    startGame();
});

challengeBtn.addEventListener('click', () => {
  modeSelection.classList.add('hidden');
  wordInputContainer.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
  wordInputContainer.classList.add('hidden');
  modeSelection.classList.remove('hidden');
});

startCustomGameBtn.addEventListener('click', () => {
  const word = customWordInput.value.trim();
  if (word && /^[a-zA-Z]+$/.test(word)) {
    customWordForFriend = word;
    customWordInput.value = '';
    
    setupContainer.classList.add('hidden');
    passDeviceContainer.classList.remove('hidden');
  } else {
    alert('Please enter a valid word (letters only).');
  }
});

readyBtn.addEventListener('click', () => {
    passDeviceContainer.classList.add('hidden');
    startGame(customWordForFriend);
});


playAgainBtn.addEventListener('click', showModeSelection);
hintBtn.addEventListener('click', giveHint);
window.addEventListener('keydown', handlePhysicalKeyboard);

// --- Init ---
showModeeSelection();