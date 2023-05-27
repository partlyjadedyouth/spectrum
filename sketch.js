/*
 * sketch.js
 */

/* Constants and Global Variables */
const introLogoTime = 2000; // amount of time to display logo
const introMessageTime = 2000; // amount of time to display intro message
const playMusicTime = 2000; // music will be played after this amount of time

let video; // captured video
let bgm; // background music
let mic; // microphone input
let audioOut; // sound sent from the microphone to the speaker

let isStartButtonPressed = false; // indicates if the start button is pressed or not
let isPlayButtonPressed = false; // indicates if the play button is pressed or not
let isStopButtonPressed = false; // indicates if the stop button is pressed or not
let gameStartedAt; // time when isStartButtonPressed is turned to true

/* preload */
function preload() {
  logoImg = loadImage("assets/logo_negative.png");
  bgm = loadSound("sounds/sample2.mp3");
}

/* setup */
function setup() {
  createCanvas(windowWidth, windowHeight);

  // capture video from camera
  video = createCapture(VIDEO);
  video.hide();

  // suspend audio context
  getAudioContext().suspend();
  bgm.play();

  // get mic input
  mic = new p5.AudioIn();
  mic.start();
}

/* draw */
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

    if (isButtonClicked(width / 2, height / 2, 0.3 * width, 0.1 * height)) {
      // when start button is pressed
      isStartButtonPressed = true;
      gameStartedAt = ms;
    }
  } else {
    // start button is pressed -> start main
    showVideo(video);
    console.log(mic.getLevel());

    if (ms - gameStartedAt > playMusicTime && !isPlayButtonPressed) {
      // when start button is pressed and playMusicTime has passes,
      // display music play button
      playMusicButton();

      if (isButtonClicked(width / 2, height / 2, 0.3 * width, 0.1 * height)) {
        // when play button is pressed
        isPlayButtonPressed = true;
      }
    } else if (isPlayButtonPressed) {
      // when play button is pressed
      userStartAudio(); // enable audio context

      stopMusicButton();
      if (
        isButtonClicked(0.8 * width, 0.8 * height, 0.3 * width, 0.1 * height)
      ) {
        // when stop button is pressed
        isStopButtonPressed = true;
      }

      if (isStopButtonPressed) {
        bgm.stop();
      }

      if (!bgm.isPlaying()) {
        // when bgm is ended,
        endingCredit(); // display ending credit
      }
    }
  }
}

/* isButtonClicked
  : returns true if the button whose center is (x, y) with
    width of w and height of h is clicked
 */
function isButtonClicked(x, y, w, h) {
  if (
    x - w / 2 <= mouseX &&
    mouseX <= x + w / 2 &&
    y - h / 2 <= mouseY &&
    mouseY <= y + h / 2 &&
    mouseIsPressed
  ) {
    return true;
  } else {
    return false;
  }
}
