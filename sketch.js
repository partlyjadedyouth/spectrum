/*
 * sketch.js
 */

/* Constants and Global Variables */
let ms; // millisecond timer
let bgmStartedAt; // time when the start button is pressed
const introRunningTime = 3000; // running time of intro video
const distortionStartsAt = 91000; // Time when distortion is started

let intro; // intro video
let video; // captured video
let facemesh; // facemesh
let predictions = []; // facemesh predictions
let bgm; // background music (narration)

let isStartButtonPressed = false; // indicates if the start button is pressed or not
let isPlayButtonPressed = false; // indicates if the play button is pressed or not
let isStopButtonPressed = false; // indicates if the stop button is pressed or not

/* preload */
function preload() {
  bgm = loadSound("sounds/narration.mp3");
}

/* setup */
function setup() {
  createCanvas(windowWidth, windowHeight);

  // intro video
  intro = createVideo("assets/intro.mp4");
  intro.hide();

  // capture video and facemesh from camera
  video = createCapture(VIDEO);
  facemesh = ml5.facemesh(video, () => {
    console.log("Model ready!");
  });
  facemesh.on("predict", (results) => {
    predictions = results;
  });
  video.hide();
}

/* draw */
function draw() {
  ms = millis(); // timer

  if (ms < introRunningTime) {
    // 1. Play intro vid
    introVideo(intro);
  } else if (!isStartButtonPressed) {
    // 2. If intro vid is finished, pause the video
    console.log("Intro vid finished");
    intro.pause();
  } else {
    background(0);
    // 3. Show webcam, facemesh, and play button
    showVideo(video, predictions);
    if (!isPlayButtonPressed) {
      playMusicButton();
    } else {
      if (!isStopButtonPressed && bgm.isPlaying()) {
        // 4. If music is started, show stop button
        stopMusicButton();

        // 5. Show subtitles
        subtitle(bgmStartedAt, ms);
        timer(bgmStartedAt, ms);

        if (
          isButtonClicked(0.2 * width, 0.2 * height, 0.3 * width, 0.1 * height)
        ) {
          // 6. When stop button is pressed
          // toggle isStopButtonPressed
          isStopButtonPressed = true;
        }
      } else if (isStopButtonPressed) {
        // 7. Stop button is pressed -> stop music
        bgm.stop();
      }

      if (!bgm.isPlaying()) {
        // 8. Show ending credit
        endingCredit();
      }
    }
  }
}

/* 
 * isButtonClicked
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
  if (!isStartButtonPressed && ms > introRunningTime) {
    // when start button is pressed
    bgm.play();
    bgm.stop(); // stop right after play
    isStartButtonPressed = true;
  } else if (!isPlayButtonPressed) {
    if (isButtonClicked(0.8 * width, 0.2 * height, 0.3 * width, 0.1 * height)) {
      // when play button is pressed
      bgm.play(); // play music
      isPlayButtonPressed = true;
      bgmStartedAt = ms;
    }
  }
}
