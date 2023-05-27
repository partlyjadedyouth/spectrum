/*
 * sketch.js
 */

/* Constants and Global Variables */
let ms; // millisecond timer
let gameStartedAt; // time when the start button is pressed
const introLogoTime = 200; // amount of time to display logo
const introMessageTime = 200; // amount of time to display intro message
const playMusicTime = 200; // music will be played after this amount of time

let video; // captured video
let bgm; // background music
let mic; // microphone input

let isStartButtonPressed = false; // indicates if the start button is pressed or not
let isPlayButtonPressed = false; // indicates if the play button is pressed or not
let isStopButtonPressed = false; // indicates if the stop button is pressed or not

/* preload */
function preload() {
  logoImg = loadImage("assets/logo_negative.png");
  bgm = loadSound("sounds/sample1.mp3");
}

/* setup */
function setup() {
  createCanvas(windowWidth, windowHeight);

  // capture video from camera
  video = createCapture(VIDEO);
  video.hide();

  // get mic input
  mic = new p5.AudioIn();
}

/* draw */
function draw() {
  background(0);
  ms = millis(); // timer

  if (!isStartButtonPressed) {
    // start button
    // start button click event will be handled by mousePressed()
    startButton();
  } else {
    if (ms - gameStartedAt < introLogoTime) {
      // show logo
      introLogo(logoImg);
    } else if (ms - gameStartedAt < introLogoTime + introMessageTime) {
      // show guide message
      introMessage();
    } else {
      // logo and message gone -> game start
      showVideo(video);
      console.log(mic.getLevel());

      if (
        ms - gameStartedAt > introLogoTime + introMessageTime + playMusicTime &&
        !isPlayButtonPressed
      ) {
        // when start button is pressed and playMusicTime has passes,
        // display music play button
        playMusicButton();
      } else if (isPlayButtonPressed) {
        // when play button is pressed
        stopMusicButton();

        if (
          isButtonClicked(0.8 * width, 0.8 * height, 0.3 * width, 0.1 * height)
        ) {
          // when stop button is pressed
          // toggle isStopButtonPressed
          isStopButtonPressed = true;
        }

        if (isStopButtonPressed) {
          // and stop bgm and mic
          bgm.stop();
          mic.stop();
        }

        if (!bgm.isPlaying()) {
          endingCredit();
        }
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

/* mousePressed: handles mouse press events on startButton and playMusicButton */
function mousePressed() {
  if (
    !isStartButtonPressed &&
    isButtonClicked(width / 2, height / 2, 0.3 * width, 0.1 * height)
  ) {
    // when start button is pressed
    console.log("Start MIC");
    mic.start(); // start mic
    bgm.play();
    bgm.stop(); // stop right after play
    isStartButtonPressed = true;
    gameStartedAt = ms;
  } else {
    if (
      ms - gameStartedAt > introLogoTime + introMessageTime + playMusicTime &&
      !isPlayButtonPressed
    ) {
      if (isButtonClicked(width / 2, height / 2, 0.3 * width, 0.1 * height)) {
        // when play button is pressed
        bgm.play(); // play music
        isPlayButtonPressed = true;
      }
    }
  }
}
