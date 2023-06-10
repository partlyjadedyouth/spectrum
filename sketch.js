/*
 * sketch.js
 */

/* Constants and Global Variables */
/* Time */
let ms; // millisecond timer
let gameStartedAt; // time when the play button is pressed
let questionnaireStartedAt; // time when the start button is pressed
let outroStartedAt; // time when the outro is started to play
const introRunningTime = 37500; // running time of intro video 37500
const distortionStartsAt = 67000; // time when distortion is started 67000
const outroRunningTime = 20000; // running time of outro video 20000

/* Image and video */
let startButton; // play button
let intro; // intro video
let video; // captured video
let pg; // to crop video
let frame, ccButton, exitButton; // buttons and frame of the video
let vidX, vidY, vidW, vidH; // center coordinates, width and height of the video

/* Music */
let introSynth; // background music on intro
let outroSynth; // background music on outro
let questionnaire; // questionnaire narration
let distorted, delayed, reverbed, noise; // distorted and delayed questionnaire

/* Boolean */
let isStartButtonPressed = false; // indicates if the start button is pressed or not
let isIntroPlaying = false; // indicates if intro is playing or not
let isPlayButtonPressed = false; // indicates if the play button is pressed or not
let isStopButtonPressed = false; // indicates if the stop button is pressed or not
let isDistortionStarted = false; // indicates if the distortion is started or not
let isSubtitleOn = true; // subtitle will be shown when this is true

/* preload */
function preload() {
  // music
  questionnaire = loadSound("sounds/questionnaire.mp3");
  introSynth = loadSound("sounds/intro_synth.mp3");
  outroSynth = loadSound("sounds/outro_synth.mp3");

  startButton = loadImage("assets/play.png");
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
  intro = createVideo("assets/intro_trimmed.mp4");
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
  if (!isStartButtonPressed) {
    /* 
      Initial state -> show start button
    */
    background(0);
    imageMode(CENTER);
    image(startButton, width / 2, height / 2);
  } else if (isStartButtonPressed && ms - gameStartedAt < introRunningTime) {
    /* 
      Start button is pressed -> play intro
    */
    introVideo(intro);
    isIntroPlaying = true;
  } else if (isIntroPlaying) {
    /* 
      Intro is finished -> pause intro
    */
    intro.pause();
    introSynth.stop();
    isIntroPlaying = false;
  } else if (!isStopButtonPressed) {
    /* 
      Intro is paused -> show webcam with a frame and play button
    */
    background(0);
    showVideo(video, frame, isDistortionStarted);
    if (!isPlayButtonPressed) {
      playMusicButton();
    } else {
      /* 
        Play button is pressed -> remove play button and play questionnaire
      */
      if (!isStopButtonPressed && questionnaire.isPlaying()) {
        // show subtitles
        subtitle(questionnaireStartedAt, ms, isSubtitleOn);
        // with a timer
        timer(questionnaireStartedAt, ms);
        // show a distortion notice before distorting sound
        distortionNotice(questionnaireStartedAt, ms, distortionStartsAt);
        // distort questionnaire
        if (
          ms - questionnaireStartedAt >= distortionStartsAt &&
          ms - questionnaireStartedAt <= distortionStartsAt + 25
        ) {
          isDistortionStarted = true;
          isSubtitleOn = false;

          // distortion
          questionnaire.disconnect();
          distorted.process(questionnaire, 0.01);
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

        // if cc button is clicked, toggle subtitle only when the distortion has started
        if (
          isButtonClicked(916.5, 475 + 37 / 2, 65, 37) &&
          isDistortionStarted
        ) {
          isSubtitleOn = !isSubtitleOn;
        }

        if (
          isButtonClicked(75 + 65 / 2, 475 + 37 / 2, 65, 37) ||
          !questionnaire.isPlaying()
        ) {
          /* 
            Stop button is pressed or questionnaire is finished -> toggle isStopButtonPressed
          */
          isStopButtonPressed = true;
          outroStartedAt = ms;
        }
      }
    }
  } else {
    /* 
      isStopButtonPressed is true -> stop video, questionnaire, and distortions
    */
    if (questionnaire.isPlaying()) {
      questionnaire.stop();
    } else {
      reverbed.disconnect();
      noise.disconnect();
    }

    /* 
      Webcam and music is stopped -> play outro
    */
    if (ms - outroStartedAt < outroRunningTime) {
      if (!outroSynth.isPlaying()) {
        outroSynth.play();
      }
      background(0);
      outroVideo(outro);
    } else {
      outroSynth.stop();
      outro.pause();
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
  if (!isStartButtonPressed) {
    // when start button is pressed
    isStartButtonPressed = true;
    gameStartedAt = ms;
    introSynth.play();
  } else if (!isPlayButtonPressed && ms - gameStartedAt > introRunningTime) {
    if (isButtonClicked(916.5, 475 + 37 / 2, 65, 37)) {
      // when play button is pressed
      questionnaire.play(); // play music
      isPlayButtonPressed = true;
      questionnaireStartedAt = ms;
    }
  }
}
