import "../css/style.css";
import { singleGame, twoPlayers } from "./utils/game";
import { selectedLanguage } from "./utils/selectLanguage";
import { DarkModeHandle } from "./utils/toggleDarkMode";

DarkModeHandle();
selectedLanguage();

const singleGameButton = document.getElementById("singleGame");
const twoPlayersButton = document.getElementById("twoPlayers");
singleGameButton.onclick = singleGame;
twoPlayersButton.onclick = twoPlayers;
