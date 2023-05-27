/*
 * intro.js
 * - Functions that consist intro page
 */

/* introLogo: displays a logo on intro */
function introLogo(logoImg) {
  imageMode(CENTER);
  image(logoImg, width / 2, height / 2);
}

/* introMessage: displays a guide message on intro */
function introMessage() {
  const message = // message to display
    "인트로 메시지입니다.\n자폐(自閉; autism)는 의사 소통의 어려움과 제한적이고 반복적인 행동을 특징으로 하는 발달 장애의 일종이다. 최근에는 자폐장애의 진단기준을 온전히 만족하지 않는 자폐 스펙트럼 장애(autism spectrum disorder, ASD)와의 구분에 대한 논의가 이어지고 있으며, 자폐증(自閉症), 자폐장애(自閉障碍), 자폐특성(自閉特性)이라고도 한다. 대부분의 자폐는 2~3세의 아동기부터 발견되며 성장기 동안 전반적 발달에 문제를 보인다. 자폐의 빈도는 대략 1,000명에 1~2명 꼴인 것으로 조사되며, 자폐 스펙트럼 장애(ASD)는 약 1% 내외의 아동에게 진단된다.[14] 발생 원인은 명확히 밝혀져 있지 않으나, 유전적·환경적 요소가 복합적으로 작용하는 것으로 추정된다.[15]";

  // text box
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text(message, width / 2, height / 2, 0.8 * width, 0.5 * height);
}

/* startButton: displays a button used to start the game */
function startButton() {
  const message = "Press this button\nto start"; // button message

  // button
  rectMode(CENTER);
  fill(150);
  rect(width / 2, height / 2, 0.3 * width, 0.1 * height);

  // button text
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(25);
  text(message, width / 2, height / 2, 0.3 * width, 0.1 * height);
}
