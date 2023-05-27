/*
 * game.js
 * - Functions that consist main
 */

/* showVideo: displays a video captured by camera */
function showVideo(video) {
  imageMode(CENTER);
  push(); // mirror mode
  translate(width, 0);
  scale(-1, 1);

  // display captured video
  // width: full screen, height: proportionally resized
  image(
    video,
    width / 2,
    height / 2,
    width,
    (video.height * width) / video.width,
  );
  pop();
}

/* playMusicButton: displays a button to start music */
function playMusicButton() {
  const message = "Press this button\nto play music"; // button message
  const x = width / 2,
    y = height / 2,
    w = 0.3 * width,
    h = 0.1 * height;

  // button
  rectMode(CENTER);
  fill(150);
  rect(x, y, w, h);

  // button text
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(25);
  text(message, x, y, w, h);
}

/* stopMusicButton: displays a button to stop music */
function stopMusicButton() {
  const message = "Press this button\nto stop music"; // button message
  const x = 0.8 * width,
    y = 0.8 * height,
    w = 0.3 * width,
    h = 0.1 * height;

  // button
  rectMode(CENTER);
  fill(150);
  rect(x, y, w, h);

  // button text
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(25);
  text(message, x, y, w, h);
}

/* endingCredit: displays ending credit */
function endingCredit() {
  const message = "끝"; // message to display

  background(0);
  // text box
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text(message, width / 2, height / 2, 0.8 * width, 0.5 * height);
}
