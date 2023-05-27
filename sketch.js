/*
 * sketch.js
 */

const introLogoTime = 1000; // amount of time to display logo
const introMessageTime = 1000; // amount of time to display intro message
let isStartButtonPressed = false; // indicates if the start button is pressed or not
let video; // captured video

function preload() {
  logoImg = loadImage("assets/logo_negative.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // capture video from camera
  video = createCapture(VIDEO);
  video.hide();
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
    // button is pressed -> start main
    showVideo(video);
  }
}
