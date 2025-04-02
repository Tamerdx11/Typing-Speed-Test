// score history checking
var scoreBoard = document.querySelector(".best-score");
var wpmEle = document.querySelector(".wpm span");
var accEle = document.querySelector(".acc span");
var scoreEle = document.querySelector(".score-val span");
var finalResultEle = document.querySelector(".final-result");
finalResultEle.style.display = "none";
setScoreboard();

function setScoreboard(score) {
  if (localStorage.getItem("score")) {
    let historyScore = localStorage.getItem("score");
    let values = historyScore.split("-");
    wpmEle.innerHTML = values[0];
    accEle.innerHTML = values[1];
    scoreEle.innerHTML = values[2];
    scoreBoard.style.display = "flex";
  }
}

// ------------------ select level ------------------
var optLevels = document.querySelectorAll("input[type='radio']");
var article = document.querySelector("article");
var optSelectedLevel = localStorage.getItem("level") ?? 1;
optLevels[optSelectedLevel - 1].checked = true;

// level simple
const level1 = [
  "the sun was shining brightly in the sky. birds were chirping in the trees. the little boy ran across the green field.",
  "emma loves to bake cookies. she mixes the flour, sugar, and butter in a big bowl. then, she adds chocolate chips to make them sweet.",
  "tom woke up early in the morning. he brushed his teeth and ate his breakfast. after putting on his school uniform, he packed his bag.",
  "lily found a small kitten in her backyard. it was white with tiny black spots. she gave it some milk and named it Snowy.",
  "the beach was calm and peaceful. the waves gently touched the shore. children were building sandcastles near the water.",
];
// level medium
const level2 = [
  "Sarah loved to explore new places. One summer, she traveled to a small village in the mountains. The air was fresh, and the scenery was breathtaking. She met friendly villagers who shared stories about their traditions.",
  "Jason was excited to build his first treehouse. He gathered wood, nails, and a hammer. His father helped him cut the planks and secure them in place. After days of hard work, the treehouse was ready.",
  "The library was the favorite place for Alice . It was quiet and full of books from different genres. She enjoyed reading mystery novels and learning about history. The librarian, Mrs. Thompson.",
  "Aiden dreamed of becoming a great painter. He spent hours practicing with his brushes and colors. One day, he joined an art competition in his town. He painted a beautiful landscape of the countryside.",
  "Liam and his family went on a camping trip in the forest. They set up their tent near a clear, flowing river. At night, they roasted marshmallows over the fire and told spooky stories.",
];

// level hard
const level3 = [
  "The scientist carefully adjusted the microscope lens, peering intently at the tiny organism beneath the glass. It was fascinating to observe how it moved, responding to changes in temperature and light. Each adjustment of the lens revealed new details, exposing a complex structure invisible to the naked eye. This moment reminded her why she had chosen a career in biology—to uncover the mysteries of the microscopic world.",
  "In the heart of the ancient city, towering stone ruins stood as silent witnesses to a civilization long past. Carvings on the weathered walls depicted tales of heroes, battles, and lost traditions. Historians had spent decades deciphering these symbols, piecing together the culture that once flourished here. With every new discovery, the mystery of this forgotten world grew even more intriguing.",
  "Elena gripped the edge of the cliff, her heart pounding in her chest. The fierce wind roared in her ears as she reached for the next rock. One wrong move, and she would fall into the vast canyon below. But she had trained for this moment. Summoning all her strength, she pulled herself up, finally reaching the summit. The breathtaking view was worth every ounce of effort.",
  "The orchestra played with exquisite precision, filling the grand concert hall with a symphony of sound. The violinists moved their bows in perfect unison, while the fingers of pianist  danced across the keys. Every note carried deep emotion, resonating with the audience. As the final crescendo echoed through the room, the crowd erupted into applause, moved by the sheer brilliance of the performance.",
  "A sudden power outage plunged the entire city into darkness. Streetlights flickered and faded, and the hum of daily life was replaced by an eerie silence. People cautiously stepped outside, their flashlights casting long shadows on the empty roads. No one knew what had caused the blackout, but uncertainty filled the air. The night stretched on, leaving everyone to wonder when the city would shine again.",
];

const levels = [level1, level2, level3];
var selectedLevel = levels[optSelectedLevel - 1];
var randomSentence = selectedLevel[0];
var currentIndex = 0;
var correctLetters = 0;
var wrongLetters = 0;
var t = 1;
var timerInterval;
changeLevel(selectedLevel);
optLevels.forEach((level) => {
  level.addEventListener("click", () => {
    localStorage.setItem("level", level.value);
    if (optSelectedLevel == level.value - 1) return;
    optSelectedLevel = level.value - 1;
    selectedLevel = levels[optSelectedLevel];
    changeLevel(selectedLevel);
  });
});

function changeLevel(selectedArray) {
  // select random sentence
  randomSentence =
    selectedArray[
      Math.floor(Math.random() * selectedArray.length)
    ].toLowerCase();
  var finalSentence = randomSentence
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");
  article.innerHTML = finalSentence;
}

document.addEventListener("keydown", (event) => {
  if (article.style.display != "none") {
    if (event.key != "F11") event.preventDefault();
    const textSpans = document.querySelectorAll("main span");
    if (currentIndex >= randomSentence.length - 1) {
      t--;
      console.log("correct: " + correctLetters);
      clearInterval(timerInterval);
      let minutes = t / 60;
      let correctWords = correctLetters / 5;
      let WPM = correctWords / minutes;
      let accuracy = (correctLetters / randomSentence.length) * 100;
      let score = WPM * (accuracy / 100);
      document.querySelector(
        ".f-wpm"
      ).innerText = `Words Per Minute(WPM) : ${WPM.toFixed(2)} w/m`;
      document.querySelector(
        ".f-acc"
      ).innerText = `Accuracy : ${accuracy.toFixed(2)} w/m`;
      document.querySelector(".f-score").innerText = `Score : ${score.toFixed(
        2
      )} w/m`;
      finalResultEle.style.display = "block";
      if (scoreEle.innerHTML < score) {
        localStorage.setItem(
          "score",
          `${WPM.toFixed(2)}-${accuracy.toFixed(2)}-${score.toFixed(2)}`
        );
        setScoreboard();
      }
      article.style.display = "none";
      return;
    }
    if (!event.key.match(/^[a-zA-Z0-9 .,!?]$/)) return;
    if (event.key === randomSentence[currentIndex]) {
      textSpans[currentIndex].style.color = "#00FF00";
      correctLetters++;
    } else {
      textSpans[currentIndex].style.color = "#FF3131";
      textSpans[currentIndex].style.textDecoration = "underline";
      wrongLetters++;
    }
    currentIndex++;
  }
});

// ------------------ switch mode ------------------
var toggle = document.querySelector(".toggle .mode");
const body = document.body;

// Check local storage for saved mode
var mode = localStorage.getItem("theme");
if (mode) {
  body.classList.add(`${mode}-mode`);
  toggle.classList.add(mode);
  document.documentElement.style.setProperty(
    "--toggle--border",
    mode == "dark" ? "black" : "gray"
  );
  if (mode == "dark") document.querySelector("header").classList.add("dark");
} else {
  body.classList.add("light-mode");
  toggle.classList.add("light");
  localStorage.setItem("theme", "light");
}

// Toggle Function
document.querySelector(".toggle").addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
  toggle.classList.toggle("dark");
  toggle.classList.toggle("light");
  document.querySelector("header").classList.toggle("dark");
  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
    document.documentElement.style.setProperty("--toggle--border", "gray");
  } else {
    localStorage.setItem("theme", "dark");
    document.documentElement.style.setProperty("--toggle--border", "black");
  }
});

// ------------------ start typing ------------------

var startBtn = document.querySelector(".start div");
var backArrow = document.querySelector(".back-arrow");
var levelSection = document.querySelector("main .level-selection");
var timerSection = document.querySelector(".timing-section");
var timer = document.querySelector(".timer");
var aboutEle = document.querySelector(".about-section");
var restart = document.querySelector(".restart");

startBtn.addEventListener("click", (e) => {
  if (!e.detail || e.detail == 1) startTyping();
  else return;
});
restart.addEventListener("click", (e) => {
  if (!e.detail || e.detail == 1) {
    clearInterval(timerInterval);
    changeLevel(selectedLevel);
    currentIndex = 0;
    correctLetters = 0;
    wrongLetters = 0;
    t = 1;
    startTyping();
  } else return;
});

function startTyping() {
  startBtn.innerHTML = "";
  startBtn.classList.add("active");
  restart.classList.add("active");
  setTimeout(() => {
    timer.innerHTML = "00";
    aboutEle.style.display = "none";
    finalResultEle.style.display = "none";
    startBtn.parentElement.style.display = "none";
    article.style.display = "block";
    levelSection.style.display = "none";
    timerSection.style.display = "block";
    backArrow.style.display = "block";
    startBtn.classList.remove("active");
    restart.classList.remove("active");
    timerInterval = setInterval(() => {
      timer.innerHTML = t.toString().padStart(2, "0");
      t++;
    }, 1000);
  }, 2000);
}

backArrow.addEventListener("click", () => {
  changeLevel(selectedLevel);
  currentIndex = 0;
  correctLetters = 0;
  wrongLetters = 0;
  t = 1;
  clearInterval(timerInterval);
  timer.innerHTML = "00";
  finalResultEle.style.display = "none";
  aboutEle.style.display = "flex";
  startBtn.parentElement.style.display = "flex";
  article.style.display = "none";
  levelSection.style.display = "flex";
  timerSection.style.display = "none";
  backArrow.style.display = "none";
  startBtn.innerHTML = "Start Typing Test";
  startBtn.classList.remove("active");
});
