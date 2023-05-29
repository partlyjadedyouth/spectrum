/*
 * game.js
 * - Functions that consist main
 */

/* showVideo: displays a video captured by camera */
function showVideo(video, predictions) {
  imageMode(CENTER);
  push(); // mirror mode
  translate(width, 0);
  scale(-1, 1);

  // display captured video
  image(
    video,
    width / 2,
    height / 2,
    width,
    // (video.height * width) / video.width,
    height,
  );

  // draw facemesh
  for (let i = 0; i < predictions.length; i++) {
    const keypoints = predictions[i].scaledMesh;
    for (let j = 0; j < keypoints.length; j++) {
      const [x, y] = [
        (keypoints[j][0] / 640) * width,
        (keypoints[j][1] / 480) * height,
      ];
      fill(0, 0, 255);
      ellipse(x, y, 8);
    }
  }

  pop();
}

/* playMusicButton: displays a button to start music */
function playMusicButton() {
  const message = "재생"; // button message
  const x = 0.8 * width,
    y = 0.2 * height,
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
  const message = "중지"; // button message
  const x = 0.2 * width,
    y = 0.2 * height,
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

/* subtitle: displays the subtitle while bgm is playing */
function subtitle(bgmStartedAt, ms) {
  const startTimes = [0, 33, 57, 91, 129, 166];
  const endTimes = [3, 37, 63, 98, 135, 171];
  const questions = [
    "1. 우선 자기소개를 해주세요.",
    "2. 향후 어떤 진로로 진출하고자 하나요?",
    "3. 해당 진로에서 귀하의 강점과 약점은 무엇입니까?",
    "4. 희망하는 진로에서 성공하기 위해 도움이 될 기술이나 경험은 어떤 것이 있나요?",
    "5. 희망 연봉 수준은 어느정도입니까?",
    "6. 커리어에서 최종적인 목표가 무엇입니까?",
  ];
  const x = 0.5 * width,
    y = 0.9 * height;

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);

  for (let i = 0; i < questions.length; i++) {
    if (
      ms - bgmStartedAt >= startTimes[i] * 1000 &&
      ms - bgmStartedAt <= endTimes[i] * 1000
    ) {
      text(questions[i], x, y);
    } else if (
      ms - bgmStartedAt >=
      endTimes[endTimes.length - 1] * 1000 + 33000
    ) {
      text("수고하셨습니다.", x, y);
    }
  }
}

/* timer: displays how much time is left */
function timer(bgmStartedAt, ms) {
  const startTimes = [3, 37, 63, 98, 135, 171];
  const endTimes = [33, 57, 91, 129, 166, 201];
  const x = 0.5 * width,
    y = 0.9 * height;

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);

  for (let i = 0; i < startTimes.length; i++) {
    if (
      ms - bgmStartedAt >= startTimes[i] * 1000 &&
      ms - bgmStartedAt <= endTimes[i] * 1000
    ) {
      text(`${parseInt(endTimes[i] - (ms - bgmStartedAt) / 1000)}`, x, y);
    }
  }
}

/* distortionNotice: displays a notice before distorting bgm */
function distortionNotice(bgmStartedAt, ms, distortionStartsAt) {
  const x = 0.5 * width,
    y = 0.1 * height;

  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  if (
    ms - bgmStartedAt >= distortionStartsAt - 5000 &&
    ms - bgmStartedAt <= distortionStartsAt
  ) {
    text(
      "지금부터 당신은 자폐 스펙트럼 환자들이\n 소음이나 방해 요인으로 둘러싸였을 때 빠지는 혼란과 감각 과부하를 체험하게 됩니다.",
      x,
      y,
    );
  }
}

/* endingCredit: displays ending credit */
function endingCredit() {
  const message = "엔딩 크레딧"; // message to display

  background(0);
  // text box
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text(message, width / 2, height / 2, 0.8 * width, 0.5 * height);
}
