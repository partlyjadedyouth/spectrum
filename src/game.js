/*
 * game.js
 * - Functions that consist main
 */

/* showVideo: displays a video captured by camera */
function showVideo(dialogue, video, frame, isDistortionStarted) {
  imageMode(CENTER);
  image(frame, width / 2, height / 2, 1200, 675); // frame

  push(); // mirror mode
  translate(width, 0);
  scale(-1, 1);

  // display captured video
  camFrame.imageMode(CENTER);
  camFrame.background(0);
  camFrame.image(
    video,
    camFrame.width / 2,
    camFrame.height / 2,
    vidW * 1.2,
    (video.height * vidW * 1.2) / vidH,
  );
  image(camFrame, vidX, vidY);

  // display dialogue video
  if (dialogue != -1) {
    let dialogueVideo = dialogueVideos[dialogue];
    dialogueVideo.loop();
    dialogueFrame.imageMode(CENTER);
    dialogueFrame.background(255);
    dialogueFrame.image(
      dialogueVideo,
      dialogueFrame.width / 2,
      dialogueFrame.height / 2,
      vidW * 1.2,
      (dialogueVideo.height * vidW * 1.2) / vidH,
    );
    image(dialogueFrame, diaX, vidY);
  }

  // start distortion on video
  if (isDistortionStarted) {
    rectMode(CENTER);
    if (vidW > 1.1 * 400) {
      vidW *= random(0.9, 0.95);
    } else {
      vidW /= random(0.9, 0.95);
    }

    if (vidH > 1.1 * 450) {
      vidH *= random(0.9, 0.95);
    } else {
      vidH /= random(0.9, 0.95);
    }

    if (random(10) < 2) {
      fill(255, random(200, 255), random(200, 255));
      rect(vidX, vidY, 400, 450);
      rect(diaX, vidY, 400, 450);
    }
  }

  pop();
}

/* chooseDialogue: choose between 3 dialogues */
function chooseDialogue() {
  rectMode(CENTER);
  fill(0);
  rect(width / 2, height / 2, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text(
    "키보드의 숫자 키를 눌러주세요.\n1. 카페 주문\n2.오랜만에 만난 친구\n3.길 물어보는 아이",
    width / 2,
    height / 2,
  );
}

/* subtitle: displays the subtitle while questionnaire is playing */
function subtitle(dialogue, questionnaireStartedAt, ms, isSubtitleOn) {
  let startTimes, endTimes, questions;
  if (dialogue === 0) {
    // cafe
    startTimes = [3, 9, 14.83, 38, 45.83, 51.83];
    endTimes = [5, 10.83, 16.83, 41.83, 47.83, 57];
    questions = [
      "- 어떤 음료 주문하시겠어요?",
      "- 드시고 가세요?",
      "- 결제 어떻게 하시나요?",
      "- 전화번호 뒷자리 알려주시면 적립해드리겠습니다.",
      "- 영수증 어떻게 해드릴까요?",
      "- 음료가 준비되면 닉네임을 불러드리겠습니다. 닉네임이 어떻게 되실까요?",
    ];
  } else if (dialogue === 1) {
    // friend
    startTimes = [3, 9.83, 16, 40, 46, 51.83];
    endTimes = [5.83, 12, 18, 42, 47.83, 53];
    questions = [
      "- 반갑다 친구야! 우리 얼마만이지?",
      "- 우리가 몇 학년 때 같은 반이었지?",
      "- 요즘은 무슨 일 해?",
      "- 한 번 만나자 언제 시간 돼?",
      "- 만나서 뭐 할까?",
      "- 어디서 볼래?",
    ];
  } else if (dialogue === 2) {
    startTimes = [3, 12, 26, 52, 60, 66];
    endTimes = [8, 22, 30, 56, 62, 67];
    questions = [
      "- 안녕하세요! 혹시 서울대 학생이신가요?",
      "- 제가 오늘 여기 견학왔거든요! 여기가 학생회관인 것 같은데, IBK 커뮤니케이션 센터까지 어떻게 가는지 아시나요?",
      "- 혹시 거기까지 걸어서 얼마나 걸리나요?",
      "- 그 건물 학생증 없어도 들어가 볼 수 있어여?",
      "- 거기선 뭐 배워여?",
      "- 재밌어여?",
    ];
  }

  const x = 0.5 * width,
    y = 0.75 * height;

  if (isSubtitleOn) {
    // button
    imageMode(CENTER);
    image(
      ccOnButton,
      ccButtonCoords[0],
      ccButtonCoords[1],
      ccButtonCoords[2],
      ccButtonCoords[3],
    );
  }

  // subtitle text properties
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);

  for (let i = 0; i < questions.length; i++) {
    // display subtitles
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
    }
  }
}

/* timer: displays how much time is left */
function timer(dialogue, questionnaireStartedAt, ms) {
  let startTimes, endTimes;
  if (dialogue === 0) {
    startTimes = [5, 10.83, 16.83, 41.83, 47.83, 57];
    endTimes = [9, 14.83, 20.83, 45.83, 51.83, 61];
  } else if (dialogue === 1) {
    startTimes = [5.83, 12, 18, 42, 47.83, 53];
    endTimes = [9.83, 16, 22, 46, 51.83, 60];
  } else if (dialogue === 2) {
    startTimes = [8, 22, 30, 56, 62, 67];
    endTimes = [12, 26, 34, 60, 66];
  }

  const x = 0.91 * width,
    y = 0.2 * height;

  textAlign(CENTER, CENTER);
  textSize(40);
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
function distortionNotice(
  trigger,
  questionnaireStartedAt,
  ms,
  distortionStartsAt,
) {
  if (
    ms - questionnaireStartedAt >= distortionStartsAt - 17000 &&
    ms - questionnaireStartedAt <= distortionStartsAt
  ) {
    trigger.loop();
    imageMode(CENTER);
    image(trigger, width / 2, height / 2, width, height);
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
