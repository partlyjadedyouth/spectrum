/*
 * sketch.js
 */

/* Constants and Global Variables */
/* Time */
let ms; // millisecond timer
let gameStartedAt; // time when the play button is pressed
let questionnaireStartedAt; // time when the start button is pressed
let outroStartedAt; // time when the outro is started to play
const introRunningTime = 73000; // running time of intro video 73000
const distortionStartsAt = [38000, 40000, 52000]; // time when distortion is started [38000, 40000, 52000]
const outroRunningTime = 21000; // running time of outro video 21000

/* Image */
let startButton; // play button
let dialogueImage; // an image to use in chooseDialogue function
let frame, ccOnButton; // buttons and frame of the video
const stopButtonCoords = [100, 600, 80, 45]; // center coordinates, width and height of stop button
const ccButtonCoords = [1115, 595, 56.25, 47]; // center coordinates, width and height of cc button

/* Video */
let intro; // intro video
let video; // captured video
let dialogueVideos = []; // dialogue stock videos
let dialogue = -1; // kind of dialogue selected
let camFrame; // to crop video
let dialogueFrame; // to crop dialogue video
let trigger; // trigger video
let vidX, vidY, vidW, vidH, diaX; // center coordinates, width and height of the videos

/* Music */
let introSynth; // background music on intro
let triggerSynth; // trigger sound
let outroSynth; // background music on outro
let questionnaires = []; // questionnaire narrations
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
  questionnaires.push(loadSound("sounds/cafe_synth_with_trigger.mp3"));
  questionnaires.push(loadSound("sounds/friend_synth_with_trigger.mp3"));
  questionnaires.push(loadSound("sounds/boy_synth_with_trigger.mp3"));
  introSynth = loadSound("sounds/intro_synth.mp3");
  triggerSynth = loadSound("sounds/trigger.mp3");
  outroSynth = loadSound("sounds/outro_synth.mp3");

  // button
  startButton = loadImage("assets/play.png");
  frame = loadImage("assets/frame.png");
  ccOnButton = loadImage("assets/cc_on.png");
  dialogueImage = loadImage("assets/dialogue_image.png");
}

/* setup */
function setup() {
  createCanvas(1200, 675);

  // size of the video
  vidX = width / 2 - 200;
  vidY = height / 2;
  vidW = 400;
  vidH = 450;
  diaX = width / 2 + 200;
  camFrame = createGraphics(400, 450);

  // intro video
  intro = createVideo("assets/intro.mp4");
  intro.hide();

  // outro video
  outro = createVideo("assets/outro.mp4");
  outro.hide();

  // dialogue videos
  dialogueVideos.push(createVideo("assets/cafe.mp4"));
  dialogueVideos.push(createVideo("assets/friend.mp4"));
  dialogueVideos.push(createVideo("assets/boy.mp4"));
  for (let i = 0; i < dialogueVideos.length; i++) {
    dialogueVideos[i].hide();
  }
  dialogueFrame = createGraphics(400, 450);

  // trigger video
  trigger = createVideo("assets/trigger.mp4");
  trigger.hide();

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
      Intro is paused -> show webcam with a frame and
      make user to choose between 3 dialogues
    */
    background(0);
    showVideo(dialogue, video, frame, isDistortionStarted);
    if (!isPlayButtonPressed) {
      /* Let user to choose between dialogues */
      chooseDialogue(dialogueImage);
    } else {
      /* 
        Dialogue is chosen -> play dialogue video and questionnaire
      */
      if (!isStopButtonPressed && questionnaires[dialogue].isPlaying()) {
        // show subtitles
        subtitle(dialogue, questionnaireStartedAt, ms, isSubtitleOn);
        // with a timer
        timer(dialogue, questionnaireStartedAt, ms);
        // show a distortion notice before distorting sound
        distortionNotice(
          trigger,
          questionnaireStartedAt,
          ms,
          distortionStartsAt[dialogue],
        );
        // distort questionnaire
        if (
          ms - questionnaireStartedAt >= distortionStartsAt[dialogue] &&
          ms - questionnaireStartedAt <= distortionStartsAt[dialogue] + 25
        ) {
          isDistortionStarted = true;
          isSubtitleOn = false;

          // distortion
          questionnaires[dialogue].disconnect();
          distorted.process(questionnaires[dialogue], 0.01);
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

        if (
          isButtonClicked(
            stopButtonCoords[0],
            stopButtonCoords[1],
            stopButtonCoords[2],
            stopButtonCoords[3],
          )
        ) {
          /* 
            Stop button is pressed -> toggle isStopButtonPressed
          */
          isStopButtonPressed = true;
          outroStartedAt = ms;
        }
      } else if (!questionnaires[dialogue].isPlaying()) {
        /* 
          Questionnaire is finished -> toggle isStopButtonPressed
        */
        isStopButtonPressed = true;
        outroStartedAt = ms;
      }
    }
  } else {
    /* 
      isStopButtonPressed is true -> stop video, questionnaire, and distortions
    */
    if (questionnaires[dialogue].isPlaying()) {
      questionnaires[dialogue].stop();
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

/* mousePressed: handles mouse press events on buttons */
function mousePressed() {
  if (!isStartButtonPressed) {
    // when start button is pressed
    isStartButtonPressed = true;
    gameStartedAt = ms;
    introSynth.play();
  } else if (
    isPlayButtonPressed &&
    isDistortionStarted &&
    isButtonClicked(
      ccButtonCoords[0],
      ccButtonCoords[1],
      ccButtonCoords[2],
      ccButtonCoords[3],
    )
  ) {
    // if cc button is clicked, toggle subtitle only when the distortion has started
    isSubtitleOn = !isSubtitleOn;
  }
}

/* keyTyped: handles user choosing between dialogues */
function keyTyped() {
  if (isStartButtonPressed && !isIntroPlaying && !isPlayButtonPressed) {
    if (key === "1") {
      dialogue = 0;
      questionnaires[dialogue].play(); // play music
      isPlayButtonPressed = true;
      questionnaireStartedAt = ms;
    } else if (key === "2") {
      dialogue = 1;
      questionnaires[dialogue].play(); // play music
      isPlayButtonPressed = true;
      questionnaireStartedAt = ms;
    } else if (key === "3") {
      dialogue = 2;
      questionnaires[dialogue].play(); // play music
      isPlayButtonPressed = true;
      questionnaireStartedAt = ms;
    }
  }
}
