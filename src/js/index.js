// 심리테스트 결과
const testResults = [];

const $screenStart = document.querySelector("#screen-start");
let $currentScreen = $screenStart;

function switchScreen(nextScreen) {
  nextScreen.classList.add("active");
  $currentScreen.classList.remove("active");
  $currentScreen = nextScreen;
}

const $traffigLight = document.querySelector("#traffic-light");
let trafficLightTimer;
function switchTrafficLightTimer() {
  $traffigLight.classList.toggle("active");
}

const crosswalkRect = document
  .querySelector("#crosswalk")
  .getBoundingClientRect();
const otherSideRect = document
  .querySelector("#other-side")
  .getBoundingClientRect();

function isCollided(target, source) {
  return (
    source.x + source.width * 0.5 > target.x &&
    source.x - source.width * 0.5 < target.x + target.width * 0.5 &&
    source.y > target.y &&
    source.y < target.y + target.height * 0.5
  );
}

const $player = document.querySelector("#player");
// screen game 1에서 초기 위치 지정해야 순간이동해서 움직이는 현상이 나타나지 않음
$player.style.bottom = "50px";
$player.style.right = "100px";

let passedCrosswalk = false;
let allowKeydown = false;

document.querySelector("#btn-start").addEventListener("click", () => {
  switchScreen(document.querySelector("#screen-game-1"));
  trafficLightTimer = setInterval(switchTrafficLightTimer, 5000);
  allowKeydown = true;
});

// player 위치 이동
function walk(direction, factor) {
  const prevValue = $player.style[direction];
  $player.style[direction] = `${parseInt(prevValue) + factor}px`;

  // 충돌 체크 - 횡단보도
  if (isCollided(crosswalkRect, $player.getBoundingClientRect())) {
    passedCrosswalk = true;
  }
  // 충돌 체크 - 건너편
  if (isCollided(otherSideRect, $player.getBoundingClientRect())) {
    if (passedCrosswalk && $traffigLight.classList.contains("active")) {
      testResults.push("1-A");
    } else {
      testResults.push("1-B");
    }
    clearInterval(trafficLightTimer);
    allowKeydown = false;
    setTimeout(() => {
      switchScreen(document.querySelector("#screen-game-2"));
    }, 500);
  }
}

// player 조종키
window.addEventListener("keydown", (e) => {
  if (!allowKeydown) return;
  if (
    e.key !== "ArrowUp" &&
    e.key !== "ArrowDown" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight"
  ) {
    $player.classList.remove("walk");
    return;
  }

  $player.classList.add("walk");

  if (e.key === "ArrowUp") {
    walk("bottom", 2);
  } else if (e.key === "ArrowDown") {
    walk("bottom", -2);
  } else if (e.key === "ArrowRight") {
    $player.classList.add("left");
    walk("right", -2);
  } else if (e.key === "ArrowLeft") {
    $player.classList.remove("left");
    walk("right", 2);
  }
});
