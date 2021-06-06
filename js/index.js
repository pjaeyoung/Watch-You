import results from "./result.js";

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

const $drain = document.querySelector("#drain");
const $bricks = document.querySelector("#bricks");
const $flagPole = document.querySelector("#flag-pole");
const drainRect = $drain.getBoundingClientRect();
const bricksRect = $bricks.getBoundingClientRect();
const flagPoleRect = $flagPole.getBoundingClientRect();

function isCollidedX(target, source) {
  return (
    source.x + source.width * 0.5 > target.x &&
    source.x - source.width * 0.5 < target.x + target.width * 0.5
  );
}

function isCollidedY(target, source) {
  return source.y > target.y && source.y < target.y + target.height * 0.5;
}

function isCollided(target, source) {
  return isCollidedX(target, source) && isCollidedY(target, source);
}

const $player = document.querySelector("#player");
// screen game 1에서 초기 위치 지정해야 순간이동해서 움직이는 현상이 나타나지 않음
$player.style.bottom = "50px";
$player.style.right = "100px";

let passedCrosswalk = false;
let allowKeydown = false;
let interactive = null;

document.querySelector("#btn-start").addEventListener("click", () => {
  switchScreen(document.querySelector("#screen-game-1"));
  trafficLightTimer = setInterval(switchTrafficLightTimer, 5000);
  allowKeydown = true;
});

// player 위치 이동
function walk(direction, factor) {
  const prevValue = $player.style[direction];
  $player.style[direction] = `${parseInt(prevValue) + factor}px`;
  if (
    $currentScreen.id === "screen-game-3" &&
    isCollidedX(drainRect, $player.getBoundingClientRect())
  ) {
    $drain.classList.add("active");
    interactive = "3-C";
  } else if (
    $currentScreen.id === "screen-game-3" &&
    isCollidedX(bricksRect, $player.getBoundingClientRect())
  ) {
    $bricks.classList.add("active");
    interactive = "3-A";
  } else if (
    $currentScreen.id === "screen-game-3" &&
    isCollidedX(flagPoleRect, $player.getBoundingClientRect())
  ) {
    $flagPole.classList.add("active");
    interactive = "3-B";
  } else {
    $bricks.classList.remove("active");
    $drain.classList.remove("active");
    $flagPole.classList.remove("active");
    interactive = null;
  }

  // 충돌 체크 - 횡단보도
  if (
    $currentScreen.id === "screen-game-1" &&
    isCollided(crosswalkRect, $player.getBoundingClientRect())
  ) {
    passedCrosswalk = true;
  }
  // 충돌 체크 - 건너편
  else if (
    $currentScreen.id === "screen-game-1" &&
    isCollided(otherSideRect, $player.getBoundingClientRect())
  ) {
    if (passedCrosswalk && $traffigLight.classList.contains("active")) {
      testResults.push("1-A");
    } else {
      testResults.push("1-B");
    }
    clearInterval(trafficLightTimer);
    allowKeydown = false;
    setTimeout(() => {
      $player.style.bottom = "145px";
      $player.style.right = "170px";
      switchScreen(document.querySelector("#screen-game-2"));
    }, 500);
  }
}

function printTestResult() {
  document.querySelector("#result-msg").textContent = testResults
    .map((key) => results[key])
    .join("");
}

// player 조종키
window.addEventListener("keydown", (e) => {
  if (!allowKeydown) return;

  if ($currentScreen.id === "screen-game-3" && e.key === "q" && !!interactive) {
    testResults.push(interactive);
    switchScreen(document.querySelector("#screen-end"));
    printTestResult();
  }

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

  if ($currentScreen.id === "screen-game-1" && e.key === "ArrowUp") {
    walk("bottom", 2);
  } else if ($currentScreen.id === "screen-game-1" && e.key === "ArrowDown") {
    walk("bottom", -2);
  } else if (e.key === "ArrowRight") {
    $player.classList.add("left");
    walk("right", -2);
  } else if (e.key === "ArrowLeft") {
    $player.classList.remove("left");
    walk("right", 2);
  }
});

// 오디오 재생
const $audioCalm = document.querySelector("#audio-calm");
const $audioCreepy = document.querySelector("#audio-creepy");
const $cdPlayerCalm = document.querySelector("#cd-player-calm");
const $cdPlayerCreepy = document.querySelector("#cd-player-creepy");
const $boxCalm = document.querySelector("#box-calm");
const $boxCreepy = document.querySelector("#box-creepy");
const $screenGame2Directive = document.querySelector(
  "#screen-game-2 .directive"
);

let playedCalm = false;
let playedCreepy = false;

function makeCdPlayerClickable() {
  if (playedCreepy && playedCalm) {
    $boxCalm.classList.add("active");
    $boxCreepy.classList.add("active");
    $screenGame2Directive.textContent = "좋아하는 음악을 선택하세요";
  }
}

function stopMusic(audio, cdPlayer) {
  if (!audio.paused) {
    audio.pause();
    cdPlayer.classList.remove("active");
  }
}

function playOrStopMusic(audio, cdPlayer) {
  audio.currentTime = 0;
  audio.paused ? audio.play() : audio.pause();
  cdPlayer.classList.toggle("active");
}

document.querySelector("#pull-line-calm").addEventListener("click", () => {
  stopMusic($audioCreepy, $cdPlayerCreepy);
  playedCalm = true;
  makeCdPlayerClickable();
  playOrStopMusic($audioCalm, $cdPlayerCalm);
});

document.querySelector("#pull-line-creepy").addEventListener("click", () => {
  stopMusic($audioCalm, $cdPlayerCalm);
  playedCreepy = true;
  makeCdPlayerClickable();
  playOrStopMusic($audioCreepy, $cdPlayerCreepy);
});

function pauseMusicAll() {
  stopMusic($audioCreepy, $cdPlayerCreepy);
  stopMusic($audioCalm, $cdPlayerCalm);
}

function switchScreenGame3(cb) {
  if (playedCreepy && playedCalm) {
    pauseMusicAll();
    cb();
    switchScreen(document.querySelector("#screen-game-3"));
    allowKeydown = true;
  }
}

$boxCalm.addEventListener("click", () =>
  switchScreenGame3(() => {
    testResults.push("2-A");
  })
);
$boxCreepy.addEventListener("click", () => {
  switchScreenGame3(() => {
    testResults.push("2-B");
  });
});
