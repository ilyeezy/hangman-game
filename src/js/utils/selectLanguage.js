import { langArr } from "../lang";

const buttonDropdown = document.getElementById("language-dropdown-menu-button");
const dropdownMenu = document.getElementById("language-dropdown-menu");
const langMenuItems = document.querySelectorAll("#lang");
let lang = localStorage.getItem("lang");
const locationLang = lang
  ? "#" + lang.slice(lang.length - 3, lang.length - 1).toLowerCase()
  : "#us";

export const selectedLanguage = () => {
  if (lang === "English (US)" || !lang) {
    const usFlag = document.createElement("img");
    usFlag.src = "/images/us-flag.svg";
    usFlag.classList.add("us-flag");
    buttonDropdown.innerText = "English (US)";
    buttonDropdown.prepend(usFlag);
  } else if (lang === "Russian (RU)") {
    const ruFlag = document.createElement("img");
    ruFlag.src = "/images/ru-flag.svg";
    buttonDropdown.innerText = "Russian (RU)";
    ruFlag.classList.add("ru-flag");
    buttonDropdown.prepend(ruFlag);
  }

  dropdownMenu.addEventListener("click", (e) => {
    for (let i = 0; i < langMenuItems.length; i++) {
      if (e.composedPath().includes(langMenuItems[i])) {
        buttonDropdown.innerHTML = e.target.innerHTML;
        lang = e.target.innerText;
        localStorage.setItem("lang", lang);
        changeURL();
      }
    }
  });
};

function changeURL() {
  location.href = locationLang;
  location.reload();
}

export function translate() {
  let hash = window.location.hash.substring(1);
  for (let key in langArr) {
    let htmlElem = document.querySelector(".lang-" + key);

    if (htmlElem) {
      replaceText(htmlElem.textContent, langArr[key][hash], htmlElem);
    }
  }
}

function checkLocation() {
  let hash = window.location.hash.substring(1);

  if (!hash) {
    location.href = window.location.pathname + locationLang;
    location.reload();
  }

  if (!lang) {
    location.href = window.location.pathname + "#us";
  } else {
    location.href = window.location.pathname + locationLang;
  }

  translate();
}

function replaceText(oldText, newText, node) {
  node = node || document.body;

  let childs = node.childNodes,
    i = 0;

  while ((node = childs[i])) {
    if (node.nodeType == 3) {
      if (node.textContent) {
        node.textContent = node.textContent.replace(oldText, newText);
      } else {
        node.nodeValue = node.nodeValue.replace(oldText, newText);
      }
    } else {
      replaceText(oldText, newText, node);
    }
    i++;
  }
}

checkLocation();
