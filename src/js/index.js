const screenStart = document.querySelector("#screen-start");
const screenGame1 = document.querySelector("#screen-game-1");
let currentScreen = screenStart;

document.querySelector("#btn-start").addEventListener("click", () => {
  screenGame1.classList.add("active");
  currentScreen.classList.remove("active");
  currentScreen = screenGame1;
});
