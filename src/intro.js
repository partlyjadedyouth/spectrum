/*
 * intro.js
 * - Functions that consist intro page
 */

/* introVideo: plays video declared as 'intro' */
function introVideo(intro) {
  intro.loop();
  imageMode(CENTER);
  image(
    intro,
    width / 2,
    height / 2,
    width,
    (intro.height * width) / intro.width,
  );
}
