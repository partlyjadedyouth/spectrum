/*
 * Sketch.js
 */

const introLogoTime = 2000; // An amount of time to display logo
const introMessageTime = 2000; // An amount of time to display intro message
let isStartButtonPressed = false; // Indicates if the start button is pressed or not

function preload() {
  logoImg = loadImage("assets/logo_negative.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  let ms = millis();
  if (ms < introLogoTime) {
    // show logo
    introLogo(logoImg);
  } else if (ms < introLogoTime + introMessageTime) {
    // show guide message
    introMessage();
  } else if (!isStartButtonPressed) {
    // start button
    introStartButton();
    if (
      0.35 * width <= mouseX <= 0.65 * width &&
      0.45 * height <= mouseY <= 0.55 * height &&
      mouseIsPressed
    ) {
      isStartButtonPressed = true;
    }
  } else {
    // button is pressed -> start game
    fill(255);
    text("GAME IS STARTED", width / 2, height / 2);
  }
}
