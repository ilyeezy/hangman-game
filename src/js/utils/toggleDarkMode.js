export const DarkModeHandle = () => {
  const darkModeTogle = document.getElementById("toggleDarkMode");
  const html = document.documentElement;
  const themeName = document.getElementById("themeName");
  const modeTheme = localStorage.getItem("mode");
  themeName.textContent = `${modeTheme !== null ? modeTheme : "Light"} Mode`;

  if (modeTheme === "Dark") {
    html.classList.add("dark");
    darkModeTogle.checked = true;
  } else {
    html.classList.add("Light");
  }

  darkModeTogle.addEventListener("input", () => {
    html.classList.toggle("dark");

    if (html.classList.contains("dark")) {
      localStorage.setItem("mode", "Dark");
      themeName.textContent = `Dark Mode`;
    } else {
      localStorage.setItem("mode", "Light");
      themeName.textContent = `Light Mode`;
    }
  });
};
