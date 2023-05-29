/*
 * sketch.js
 */

/* Constants and Global Variables */
let ms; // millisecond timer
let gameStartedAt; // time when the start button is pressed
const playMusicTime = 100; // music will be played after this amount of time
const introRunningTime = 3000; // running time of intro video

let intro; // intro video
let video; // captured video
let facemesh; // facemesh
let predictions = []; // facemesh predictions
let bgm; // background music (narration)
let mic; // microphone input
let recorder; // sound recorder
let soundFile; // sound file to save recorded voice

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

  // declare mic related variables
  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
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
    if (ms < introRunningTime) {
      // show intro
      introVideo(intro);
    } else {
      // finish intro
      intro.pause();

      // intro finished -> game start
      showVideo(video, predictions);

      if (
        ms - gameStartedAt > introRunningTime + playMusicTime &&
        !isPlayButtonPressed
      ) {
        // show play music button
        playMusicButton();
      } else if (isPlayButtonPressed) {
        if (!isStopButtonPressed) {
          // when play button is pressed
          stopMusicButton();

          // start recording
          recorder.record(soundFile);
          console.log(soundFile);
          console.log(mic.getLevel());

          if (
            isButtonClicked(
              0.8 * width,
              0.8 * height,
              0.3 * width,
              0.1 * height,
            )
          ) {
            // when stop button is pressed
            // toggle isStopButtonPressed
            isStopButtonPressed = true;
          }
        } else {
          // and stop bgm, mic and recorder
          bgm.stop();
          mic.stop();
          recorder.stop();
          if (soundFile) {
            console.log("HAHA");
            // when bgm is finished, show ending credit
            endingCredit();
            soundFile.play();
            save(soundFile, "mysound.wav");
          }
        }
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
  if (
    !isStartButtonPressed &&
    isButtonClicked(width / 2, height / 2, 0.3 * width, 0.1 * height)
  ) {
    // when start button is pressed
    console.log("Start MIC");
    bgm.play();
    bgm.stop(); // stop right after play
    isStartButtonPressed = true;
    gameStartedAt = ms;
  } else {
    if (
      ms - gameStartedAt > introRunningTime + playMusicTime &&
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
