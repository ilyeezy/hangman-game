import {
  KEYBOARD_LETTERS_US,
  KEYBOARD_LETTERS_RU,
  THEMES_RU,
  THEMES_US,
} from "./consts";
import { translate } from "./selectLanguage";

const gameDiv = document.getElementById("game");
const logo = document.getElementById("logo");
let hash = window.location.hash.substring(1);
const THEMES = hash === "ru" ? THEMES_RU : THEMES_US;
const KEYBOARD_LETTERS =
  hash === "ru" ? KEYBOARD_LETTERS_RU : KEYBOARD_LETTERS_US;
let gameMode;
let triesLeft;
let winCount;

const createPlaceHoldersHtml = () => {
  const wordToGuess = sessionStorage.getItem("word");
  const lettersWordToGuess = Array.from(wordToGuess);

  const placeholderHtml = lettersWordToGuess.reduce(
    (acc, letter, i) => acc + ` <h1 id="letter-${i}" class="letter">_</h1>`,
    "",
  );

  return `<div id="placeholders" class="placeholder-body"> ${placeholderHtml}</div>`;
};

const createKeyBoard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyBoardHtml = KEYBOARD_LETTERS.reduce((acc, item) => {
    return (
      acc +
      `<button class="button-primary keyboard-button" id="${item}">${item}</button>`
    );
  }, "");
  keyboard.innerHTML = keyBoardHtml;
  return keyboard;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.id = "hangman-img";
  image.alt = "hangman image";
  image.classList.add("hangman-img");

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letter.toLowerCase();
  const letterKeyboard = document.getElementById(`${letter}`);
  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left");
    const hangmanImg = document.getElementById("hangman-img");
    triesLeft -= 1;
    triesCounter.innerHTML = triesLeft;
    letterKeyboard.disabled = true;
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    const lettersArray = Array.from(word);
    lettersArray.forEach((letter, i) => {
      if (letter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame("win");
          return;
        }
        letterKeyboard.classList.add("letter-guessed");
        letterKeyboard.disabled = true;

        document.getElementById(`letter-${i}`).innerText = inputLetter;
      }
    });
  }
};

const stopGame = (status) => {
  document.getElementById("placeholders")?.remove();
  document.getElementById("tries")?.remove();
  document.getElementById("keyboard")?.remove();
  document.getElementById("quit")?.remove();
  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById(
      "game",
    ).innerHTML += `<h2 class="result-header win mt-5 lang-win">You won!  </h2>`;
  } else if (status === "lose") {
    document.getElementById(
      "game",
    ).innerHTML += `<h2 class="lang-lose result-header lose mt-5">You lost  :( </h2>`;
  }

  document.getElementById(
    "game",
  ).innerHTML += `<p class="mt-5" ><span class="lang-wordWas">The word was:</span>   <span class="result-word">${word}</span> </p> 

   <button class="lang-playAgain button-primary px-5 py-2 mt-5" id="play-again">Play again</button>
  <button id="quit" class="lang-quit button-secondary px-2 py-2 mt-4">Quit </button>
  `;

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit");
    if (isSure) {
      returnToHomeScreen();
    }
  };

  if (gameMode === "Two players") {
    document.getElementById("play-again").onclick = twoPlayers;
  } else {
    document.getElementById("play-again").onclick = singleGame;
  }
  translate();
};

const createInputWord = () => {
  return `
  <h2 class="font-bold text-2xl mb-2 lang-inputWord">Enter a word</h2>
  <p class="mb-5 lang-description">Type a word below to have your friend try and guess it</p>
  <input type="text" id="inputWordToGuess" aria-describedby="helper-text-explanation" class="lang-inputWord bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
  <div class="flex flex-wrap gap-5 w-full p-2">
   <button id="startGame" class="mt-5 w-full button-primary lang-startGame">Start Game</button>
  <button id="quit" class="lang-quit button-secondary px-2 py-2 mt-4 w-full">Quit </button>
  </div>
 
  `;
};

const createThemes = () => {
  return THEMES.reduce(
    (acc, item) =>
      (acc += `
    <button class="button-primary theme-button" id="${item.theme}">${item.theme}</button>`),
    "",
  );
};

export const singleGame = (e) => {
  gameMode = "Single game";
  logo.classList.add("logo-sm");
  gameDiv.innerHTML = `
  <h2 class="font-bold mb-5 text-xl lang-SelectTheme">Select Theme</h2>
  <div id="themesBoard" class="themesBoard">${createThemes()}</div>
  <button id="quit" class="lang-quit button-secondary px-2 py-2 mt-4">Quit </button>
  `;
  let wordToGuess = "";

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit");
    if (isSure) {
      returnToHomeScreen();
    }
  };

  document.getElementById("themesBoard").addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
      for (let i = 0; i < THEMES.length; i++) {
        if (e.target.id === THEMES[i].theme) {
          const randomIndex = Math.floor(
            Math.random() * THEMES[i].words.length,
          );
          wordToGuess = THEMES[i].words[randomIndex];
        }
      }
      startGame(e, wordToGuess);
    }
  });
  translate();
};

export const twoPlayers = () => {
  gameMode = "Two players";
  logo.classList.add("logo-sm");
  gameDiv.innerHTML = createInputWord();
  const keyboardDiv = createKeyBoard();
  gameDiv.appendChild(keyboardDiv);
  const inputWordToGuess = document.getElementById("inputWordToGuess");
  let wordToGuess = "";
  const startGameButton = document.getElementById("startGame");
  const regexUS = /^[a-zA-Z\s\-]*$/;
  const regexRU = /^[а-яА-Я\s\-]*$/;

  inputWordToGuess.addEventListener("input", (e) => {
    if (hash === "us" && !regexUS.test(e.target.value)) {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
    } else if (hash === "ru" && !regexRU.test(e.target.value)) {
      e.target.value = e.target.value.replace(/[^а-яА-Я\s\-]/g, "");
    } else {
      wordToGuess = e.target.value;
    }

    if (wordToGuess.length < 3) {
      startGameButton.disabled = true;
    } else {
      startGameButton.disabled = false;
    }
  });

  keyboardDiv.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
      inputWordToGuess.value += e.target.id.toLowerCase();
      wordToGuess = inputWordToGuess.value;
      if (inputWordToGuess.value.length < 3) {
        startGameButton.disabled = true;
      } else {
        startGameButton.disabled = false;
      }
    }
  });

  startGameButton.addEventListener("click", (e) => {
    startGame(e, wordToGuess);
  });

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit");
    if (isSure) {
      returnToHomeScreen();
    }
  };

  if (inputWordToGuess.value.length < 3) {
    startGameButton.disabled = true;
  }
  translate();
};

export const startGame = (e, word) => {
  triesLeft = 10;
  winCount = 0;
  logo.classList.add("logo-sm");
  const keyboardDiv = createKeyBoard();
  const hangmanImg = createHangmanImg();
  sessionStorage.setItem("word", word.toLowerCase());

  gameDiv.innerHTML = createPlaceHoldersHtml();

  const lettersWordToGuess = Array.from(sessionStorage.getItem("word"));

  for (let i = 0; i < lettersWordToGuess.length; i++) {
    const leeterbyIndex = document.getElementById(`letter-${i}`);

    if (/[\s-]/.test(lettersWordToGuess[i])) {
      leeterbyIndex.innerText = lettersWordToGuess[i];
      winCount++;
    }
  }

  gameDiv.innerHTML += `<p id="tries" class="mt-5"><span class="lang-tries">Tries left:</span> <span class="font-medium text-red-700" id="tries-left">${10}</span></p>`;
  gameDiv.appendChild(keyboardDiv);

  keyboardDiv.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
      checkLetter(e.target.id);
    }
  });

  gameDiv.prepend(hangmanImg);
  gameDiv.insertAdjacentHTML(
    "beforeend",
    `<button id="quit" class="lang-quit button-secondary px-2 py-2 mt-4">Quit </button>`,
  );

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure you want to quit and lose progress ?");
    if (isSure) {
      returnToHomeScreen();
    }
  };

  translate();
};

const returnToHomeScreen = () => {
  logo.classList.remove("logo-sm");
  gameMode = null;
  gameDiv.innerHTML = `<div class="flex gap-5">
  <button id="singleGame" class="lang-singleGame button-primary">Single game</button>
  <button id="twoPlayers" class="lang-twoPlayers button-primary">Two players</button>
  </div>`;

  document.getElementById("twoPlayers").onclick = twoPlayers;
  document.getElementById("singleGame").onclick = singleGame;
  translate();
};
