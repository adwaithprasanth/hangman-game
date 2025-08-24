// --- DOM Elements ---
const wordDisplay = document.getElementById('word-display');
const keyboardDiv = document.getElementById('keyboard');
const figureParts = document.querySelectorAll('.figure-part');
const popupContainer = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const playAgainBtn = document.getElementById('play-again-btn');

// Setup Elements
const setupContainer = document.getElementById('setup-container');
const modeSelection = document.getElementById('mode-selection');
const wordInputContainer = document.getElementById('word-input-container');
const mainGameContainer = document.getElementById('main-game-container');

// Buttons & Inputs
const vsComputerBtn = document.getElementById('vs-computer-btn');
const challengeBtn = document.getElementById('challenge-btn');
const backBtn = document.getElementById('back-btn');
const customWordInput = document.getElementById('custom-word-input');
const startCustomGameBtn = document.getElementById('start-custom-game-btn');

// --- Game State ---
const words = ['javascript', 'programming', 'hangman', 'developer', 'interface'];
let selectedWord = '';
let correctLetters = [];
let wrongGuessCount = 0;

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

// --- Game Logic ---
function startGame(customWord = null) {
  correctLetters = [];
  wrongGuessCount = 0;

  selectedWord = customWord ? customWord.toLowerCase() : words[Math.floor(Math.random() * words.length)];

  setupContainer.classList.add('hidden');
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
  figureParts.forEach((part, index) => {
    part.style.display = index < wrongGuessCount ? 'block' : 'none';
  });

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
  setupContainer.classList.remove('hidden');
  modeSelection.classList.remove('hidden');
}

// --- Event Listeners ---
vsComputerBtn.addEventListener('click', () => startGame());
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
    startGame(word);
    customWordInput.value = '';
  } else {
    alert('Please enter a valid word (letters only).');
  }
});
playAgainBtn.addEventListener('click', showModeSelection);

// --- Init ---
showModeSelection();
