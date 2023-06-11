/*
 * game.js
 * - Functions that consist main
 */

/* showVideo: displays a video captured by camera */
function showVideo(video, frame, isDistortionStarted) {
  imageMode(CENTER);
  image(frame, width / 2, height / 2, 960, 540); // frame

  push(); // mirror mode
  translate(width, 0);
  scale(-1, 1);

  // display captured video
  pg.imageMode(CENTER);
  pg.background(0);
  pg.image(video, pg.width / 2, pg.height / 2, vidW, vidH);
  image(pg, vidX, vidY);

  // start distortion on video
  if (isDistortionStarted) {
    rectMode(CENTER);
    if (vidW > 1.2 * 512) {
      vidW *= random(0.85, 0.9);
    } else {
      vidW /= random(0.85, 0.9);
    }

    if (vidH > 1.2 * 288) {
      vidH *= random(0.85, 0.9);
    } else {
      vidH /= random(0.85, 0.9);
    }

    if (random(10) < 1.5) {
      fill(255);
      rect(vidX, vidY, 512, 288);
    }
  }

  pop();
}

/* playMusicButton: displays a button to start music */
function playMusicButton() {
  const message = "PLAY"; // button message
  const x = 916.5,
    y = 477 + 37 / 2,
    w = 65,
    h = 37;

  // button
  rectMode(CENTER);
  stroke(255);
  fill(0);
  rect(x, y, w, h);

  // button text
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(NORMAL);
  fill(255);
  text(message, x, y, w, h);
}

/* subtitle: displays the subtitle while questionnaire is playing */
function subtitle(questionnaireStartedAt, ms, isSubtitleOn) {
  const startTimes = [5, 25, 46, 68, 91, 112];
  const endTimes = [8, 29, 51, 74, 95, 116];
  const questions = [
    "- 우선 자기소개를 해주세요.",
    "- 향후 어떤 진로로 진출하고자 하나요?",
    "- 해당 진로에서 귀하의 강점과 약점은 무엇입니까?",
    "- 희망하는 진로에서 성공하기 위해 도움이 될 기술이나 경험은 어떤 것이 있나요?",
    "- 희망 연봉 수준은 어느정도입니까?",
    "- 커리어에서 최종적인 목표가 무엇입니까?",
  ];
  const x = 0.5 * width,
    y = 0.75 * height;

  textAlign(CENTER, CENTER);
  textSize(25);
  fill(255);

  for (let i = 0; i < questions.length; i++) {
    if (
      ms - questionnaireStartedAt >= startTimes[i] * 1000 &&
      ms - questionnaireStartedAt <= endTimes[i] * 1000 &&
      isSubtitleOn
    ) {
      text(questions[i], x, y);
    } else if (
      ms - questionnaireStartedAt >=
      endTimes[endTimes.length - 1] * 1000 + 15000
    ) {
      text("수고하셨습니다.", x, y);
    } else if (!isSubtitleOn) {
      text("CC OFF", x, y);
    }
  }
}

/* timer: displays how much time is left */
function timer(questionnaireStartedAt, ms) {
  const startTimes = [9, 30, 52, 75, 96, 117];
  const endTimes = [24, 45, 67, 90, 111, 133];
  const x = 0.88 * width,
    y = 0.2 * height;

  textAlign(CENTER, CENTER);
  textSize(25);
  fill(255);

  for (let i = 0; i < startTimes.length; i++) {
    if (
      ms - questionnaireStartedAt >= startTimes[i] * 1000 &&
      ms - questionnaireStartedAt <= endTimes[i] * 1000
    ) {
      text(
        `${parseInt(endTimes[i] - (ms - questionnaireStartedAt) / 1000)}`,
        x,
        y,
      );
    }
  }
}

/* distortionNotice: displays a notice before distorting questionnaire */
function distortionNotice(questionnaireStartedAt, ms, distortionStartsAt) {
  const x = 0.5 * width,
    y = 0.5 * height;

  if (
    ms - questionnaireStartedAt >= distortionStartsAt - 5000 &&
    ms - questionnaireStartedAt <= distortionStartsAt
  ) {
    rectMode(CENTER);
    fill(0, 0, 0, 200);
    rect(width / 2, height / 2, width, height);
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text(
      "지금부터 당신은 자폐 스펙트럼 환자들이\n소음이나 방해 요인으로 둘러싸였을 때 빠지는\n혼란과 감각 과부하를 체험하게 됩니다.",
      x,
      y,
    );
  }
}

/* endingCredit: displays ending credit */
function outroVideo(outro) {
  outro.loop();
  imageMode(CENTER);
  image(
    outro,
    width / 2,
    height / 2,
    width,
    (outro.height * width) / outro.width,
  );
}
