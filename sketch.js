/*
 * sketch.js
 */

/* Constants and Global Variables */
let ms; // millisecond timer
let bgmStartedAt; // time when the start button is pressed
const introRunningTime = 40000; // running time of intro video 40000
const distortionStartsAt = 85000; // Time when distortion is started 85000

let intro; // intro video
let video; // captured video
let pg; // to crop video
let frame, ccButton, exitButton; // buttons and frame of the video
let vidX, vidY, vidW, vidH; // center coordinates, width and height of the video

let bgm; // background music (narration)
let distorted, delayed, reverbed, noise; // distorted and delayed bgm

let isStartButtonPressed = false; // indicates if the start button is pressed or not
let isPlayButtonPressed = false; // indicates if the play button is pressed or not
let isStopButtonPressed = false; // indicates if the stop button is pressed or not
let isDistortionStarted = false; // indicates if the distortion is started or not
let isSubtitleOn = true; // subtitle will be shown when this is true

/* preload */
function preload() {
  bgm = loadSound("sounds/narration.mp3");
  frame = loadImage("assets/frame.png");
  ccButton = loadImage("assets/cc.png");
  exitButton = loadImage("assets/exit.png");
}

/* setup */
function setup() {
  createCanvas(1024, 576);

  // size of the video
  vidX = width / 2;
  vidY = height / 2.5;
  vidW = 512;
  vidH = 288;
  pg = createGraphics(vidW, vidH);

  // intro video
  intro = createVideo("assets/intro.mp4");
  intro.hide();

  // outro video
  outro = createVideo("assets/outro.mp4");
  outro.hide();

  // set distortions
  distorted = new p5.Distortion();
  delayed = new p5.Delay();
  reverbed = new p5.Reverb();
  noise = new p5.Noise();

  // capture video from camera
  video = createCapture(VIDEO);
  video.hide();
}

/* draw */
function draw() {
  ms = millis(); // timer
  if (ms < introRunningTime) {
    // 1. Play intro vid
    background(0);
    introVideo(intro);
  } else if (!isStartButtonPressed) {
    // 2. If intro vid is finished, pause the video
    intro.pause();
  } else {
    background(0);
    // 3. Show webcam and play button
    showVideo(video, frame, isDistortionStarted);
    if (!isPlayButtonPressed) {
      playMusicButton();
    } else {
      if (!isStopButtonPressed && bgm.isPlaying()) {
        // 4. Show subtitles
        subtitle(bgmStartedAt, ms, isSubtitleOn);
        // 5. Show timer
        timer(bgmStartedAt, ms);

        // 6. Distort bgm
        distortionNotice(bgmStartedAt, ms, distortionStartsAt);

        if (
          ms - bgmStartedAt >= distortionStartsAt &&
          ms - bgmStartedAt <= distortionStartsAt + 25
        ) {
          isDistortionStarted = true;
          isSubtitleOn = false;

          // distortion
          bgm.disconnect();
          distorted.process(bgm, 0.01);
          distorted.amp(1.0);
          distorted.set(0.5);

          // delay
          distorted.disconnect();
          delayed.process(distorted, 0.8, 0.85, 10000);

          // reverb
          delayed.disconnect();
          reverbed.process(delayed, 3, 2);
          reverbed.drywet(0.5);

          // pink noise
          noise.setType("pink");
          const hpFilter = new p5.HighPass();
          noise.disconnect();
          noise.connect(hpFilter);
          noise.start();
          noise.amp(0.1);
        }

        // if cc button is clicked, toggle subtitle
        if (
          isButtonClicked(916.5, 475 + 37 / 2, 65, 37) &&
          isDistortionStarted
        ) {
          isSubtitleOn = !isSubtitleOn;
        }

        if (isButtonClicked(75 + 65 / 2, 475 + 37 / 2, 65, 37)) {
          // 7. When stop button is pressed
          // toggle isStopButtonPressed
          isStopButtonPressed = true;
        }
      } else if (isStopButtonPressed) {
        // 8. Stop button is pressed -> stop music
        bgm.stop();
        reverbed.disconnect();
        noise.disconnect();
      }

      if (!bgm.isPlaying()) {
        reverbed.disconnect();
        noise.disconnect();

        // 9. Show ending credit
        background(0);
        outroVideo(outro);
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
  } else if (!isPlayButtonPressed && ms > introRunningTime) {
    if (isButtonClicked(916.5, 475 + 37 / 2, 65, 37)) {
      // when play button is pressed
      bgm.play(); // play music
      isPlayButtonPressed = true;
      bgmStartedAt = ms;
    }
  }
}
