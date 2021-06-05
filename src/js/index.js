const $screenStart = document.querySelector("#screen-start");
const $screenGame1 = document.querySelector("#screen-game-1");
let $currentScreen = $screenStart;

const $traffigLight = document.querySelector("#traffic-light");
let trafficLightTimer;
function switchTrafficLightTimer() {
  $traffigLight.classList.toggle("active");
}

document.querySelector("#btn-start").addEventListener("click", () => {
  $screenGame1.classList.add("active");
  $currentScreen.classList.remove("active");
  $currentScreen = $screenGame1;
  trafficLightTimer = setInterval(switchTrafficLightTimer, 5000);
});
