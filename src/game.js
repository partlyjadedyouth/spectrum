/*
 * game.js
 * - Functions that consist main
 */

// showVideo: displays a video captured by camera
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
