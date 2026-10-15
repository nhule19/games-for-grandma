
/* ==========================================
   SIMPLE SUDOKU - SNOWFLAKE EDITION
   STAGE 1 + STAGE 2
========================================== */

const levels = [
  {
    name: "Beginner",
    size: 3,
    rules: 1,
    solution: [0, 1, 2],
    instructions:
      "Place exactly ONE snowflake in each row. " +
      "You can put snowflakes in any column!"
  },
  {
    name: "Easy",
    size: 4,
    rules: 2,
    solution: [1, 3, 0, 2],
    instructions:
      "Place ONE snowflake in each row AND ONE snowflake in each column."
  },
  {
    name: "Learning Colors",
    size: 4,
    rules: 3,
    solution: [1, 3, 0, 2],
    instructions:
      "Place ONE snowflake in each row, column, and colored region."
  },
  {
    name: "Learning Spacing",
    size: 4,
    rules: 4,
    solution: [1, 3, 0, 2],
    instructions:
      "Keep ONE snowflake in each row, column, and color. " +
      "Snowflakes cannot touch, even diagonally!"
  },
  {
    name: "Classic Snowflake Puzzle",
    size: 5,
    rules: 4,
    solution: [0, 2, 4, 1, 3],
    instructions:
      "Use all four rules! One snowflake per row, column, " +
      "and colored region. Snowflakes cannot touch each other."
  }
];

const regionColors = [
  "#F8DDE3",
  "#DCEBFA",
  "#E4DDF8",
  "#FFF0C9",
  "#DDF2DF"
];

/* ==========================================
   HTML ELEMENTS
========================================== */

const board = document.getElementById("catBoard");
const levelText = document.getElementById("catLevel");
const countText = document.getElementById("catCount");
const levelName = document.getElementById("catLevelName");
const rulesText = document.getElementById("catRules");
const message = document.getElementById("catMessage");

const nextButton = document.getElementById("catNext");
const catModeButton = document.getElementById("catMode");
const markModeButton = document.getElementById("markMode");

const progressSection =
  document.getElementById("levelProgress");

const recommendationSection =
  document.getElementById("levelRecommendation");

const recommendationTitle =
  document.getElementById("recommendationTitle");

const recommendationMessage =
  document.getElementById("recommendationMessage");

const recommendationLevel =
  document.getElementById("recommendationLevel");

const recommendationButton =
  document.getElementById("recommendationButton");

/* ==========================================
   GAME VARIABLES
========================================== */

let levelIndex = 0;
let cells = [];
let regions = [];
let mode = "cat";
let finished = false;

let levelStartTime = Date.now();
let hintsUsed = 0;
let mistakesMade = 0;
let sessionRecorded = false;

let suggestedLevel = 1;

/* ==========================================
   CURRENT LEVEL
========================================== */

function currentLevel() {
  return levels[levelIndex];
}

/* ==========================================
   GENERATE COLORED REGIONS
========================================== */

function makeRegions(level) {
  const n = level.size;

  const grid = Array.from(
    { length: n },
    () => Array(n).fill(-1)
  );

  const frontier = [];

  for (let r = 0; r < n; r++) {
    const c = level.solution[r];
    grid[r][c] = r;
    frontier.push([r, c, r]);
  }

  while (true) {
    const options = [];

    for (const [r, c, region] of frontier) {
      const neighbors = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1]
      ];

      for (const [nr, nc] of neighbors) {
        if (
          nr >= 0 &&
          nr < n &&
          nc >= 0 &&
          nc < n &&
          grid[nr][nc] === -1
        ) {
          options.push([nr, nc, region]);
        }
      }
    }

    if (options.length === 0) break;

    const choice = options[
      Math.floor(Math.random() * options.length)
    ];

    const [r, c, region] = choice;

    if (grid[r][c] !== -1) continue;

    grid[r][c] = region;
    frontier.push([r, c, region]);
  }

  return grid;
}

/* ==========================================
   START LEVEL
========================================== */

function startLevel() {
  const level = currentLevel();
  const n = level.size;

  cells = Array.from(
    { length: n },
    () => Array(n).fill("")
  );

  regions = makeRegions(level);

  finished = false;
  mode = "cat";

  levelStartTime = Date.now();
  hintsUsed = 0;
  mistakesMade = 0;
  sessionRecorded = false;

  levelText.textContent =
    `Level ${levelIndex + 1} of ${levels.length}`;

  levelName.textContent = level.name;
  rulesText.textContent = level.instructions;

  board.style.setProperty("--cat-size", n);

  nextButton.hidden = true;
  progressSection.hidden = true;
  recommendationSection.hidden = true;

  updateMode();
  setMessage("Tap a square to place a snowflake.");
  renderBoard();
}

/* ==========================================
   MESSAGES AND TOOL MODE
========================================== */

function setMessage(text) {
  message.textContent = text;
}

function updateMode() {
  catModeButton.classList.toggle("active", mode === "cat");
  markModeButton.classList.toggle("active", mode === "mark");
}

/* ==========================================
   RENDER BOARD
========================================== */

function renderBoard() {
  const level = currentLevel();
  const n = level.size;

  board.innerHTML = "";

  let snowflakeCount = 0;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const value = cells[r][c];

      if (value === "cat") snowflakeCount++;

      const square = document.createElement("button");

      square.type = "button";
      square.className = "cat-square";

      if (level.rules >= 3) {
        square.style.backgroundColor =
          regionColors[regions[r][c]];
      } else {
        square.style.backgroundColor =
          (r + c) % 2 === 0 ? "#F2F6FC" : "#FFFFFF";
      }

      square.textContent =
        value === "cat" ? "❄️" :
        value === "mark" ? "×" : "";

      square.setAttribute(
        "aria-label",
        `Row ${r + 1}, column ${c + 1}, ` +
        (value === "cat"
          ? "snowflake"
          : value === "mark"
            ? "marked empty"
            : "empty")
      );

      square.addEventListener("click", () => selectSquare(r, c));

      board.appendChild(square);
    }
  }

  countText.textContent =
    `${snowflakeCount} / ${n} snowflakes`;
}

/* ==========================================
   GET PLACED SNOWFLAKES
========================================== */

function getCats() {
  const result = [];

  cells.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value === "cat") result.push({ r, c });
    });
  });

  return result;
}

/* ==========================================
   CHECK PUZZLE RULES
========================================== */

function findConflict() {
  const level = currentLevel();
  const snowflakes = getCats();

  for (let i = 0; i < snowflakes.length; i++) {
    for (let j = i + 1; j < snowflakes.length; j++) {
      const a = snowflakes[i];
      const b = snowflakes[j];

      if (a.r === b.r) {
        return "Only one snowflake is allowed in each row.";
      }

      if (level.rules >= 2 && a.c === b.c) {
        return "Only one snowflake is allowed in each column.";
      }

      if (
        level.rules >= 3 &&
        regions[a.r][a.c] === regions[b.r][b.c]
      ) {
        return "Only one snowflake is allowed in each color.";
      }

      if (
        level.rules >= 4 &&
        Math.abs(a.r - b.r) <= 1 &&
        Math.abs(a.c - b.c) <= 1
      ) {
        return "Snowflakes cannot touch each other.";
      }
    }
  }

  return null;
}

/* ==========================================
   SHOW PROGRESS SUMMARY
========================================== */

function showLevelProgress(durationSeconds, saved) {
  const stats = ProgressTracker.getStats();

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  const formattedTime = minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds} seconds`;

  document.getElementById("progressTime").textContent =
    formattedTime;

  document.getElementById("progressHints").textContent =
    hintsUsed;

  document.getElementById("progressMistakes").textContent =
    mistakesMade;

  document.getElementById("progressTotal").textContent =
    stats.totalPuzzles;

  document.getElementById("progressSavedMessage").textContent =
    saved
      ? "✓ Progress saved!"
      : "Progress could not be saved in this browser.";

  progressSection.hidden = false;
}

/* ==========================================
   STAGE 2: SHOW RECOMMENDATION
========================================== */

function showLevelRecommendation() {
  const currentLevelNumber = levelIndex + 1;

  const recommendation =
    LevelRecommender.recommend(currentLevelNumber);

  suggestedLevel = recommendation.level;

  recommendationTitle.textContent =
    recommendation.title;

  recommendationMessage.textContent =
    recommendation.message;

  const suggestedLevelName =
    levels[suggestedLevel - 1].name;

  recommendationLevel.textContent =
    `Recommended: Level ${suggestedLevel} — ${suggestedLevelName}`;

  if (suggestedLevel > currentLevelNumber) {
    recommendationButton.textContent =
      "Try the Next Level →";
  } else if (suggestedLevel < currentLevelNumber) {
    recommendationButton.textContent =
      "Practice an Earlier Level →";
  } else {
    recommendationButton.textContent =
      "Practice This Level Again ↻";
  }

  recommendationSection.hidden = false;
}

/* ==========================================
   SAVE COMPLETED PUZZLE
========================================== */

function recordCompletedPuzzle() {
  if (sessionRecorded) return;

  sessionRecorded = true;

  const level = currentLevel();

  const durationSeconds = Math.round(
    (Date.now() - levelStartTime) / 1000
  );

  const saved = ProgressTracker.recordSession({
    level: levelIndex + 1,
    levelName: level.name,
    boardSize: level.size,
    completed: true,
    durationSeconds,
    hintsUsed,
    mistakes: mistakesMade
  });

  showLevelProgress(durationSeconds, saved);

  if (saved) {
    showLevelRecommendation();
    console.log("Progress saved!", ProgressTracker.getStats());
  } else {
    recommendationSection.hidden = true;
  }
}

/* ==========================================
   SELECT A SQUARE
========================================== */

function selectSquare(r, c) {
  if (finished) return;

  const newValue = mode === "cat" ? "cat" : "mark";

  cells[r][c] =
    cells[r][c] === newValue ? "" : newValue;

  renderBoard();

  const conflict = findConflict();

  if (conflict) {
    if (newValue === "cat" && cells[r][c] === "cat") {
      mistakesMade++;
    }

    setMessage(`Try another spot! ${conflict}`);
    return;
  }

  const level = currentLevel();
  const snowflakes = getCats();

  if (snowflakes.length === level.size) {
    finished = true;

    recordCompletedPuzzle();

    if (levelIndex < levels.length - 1) {
      setMessage(
        "🎉 Wonderful! Every snowflake has a cozy spot!"
      );
      nextButton.hidden = false;
    } else {
      setMessage(
        "🎉 Amazing! You completed every level!"
      );
    }
  } else {
    setMessage(
      "Great job! Keep finding spots for the snowflakes."
    );
  }
}

/* ==========================================
   HINT SYSTEM
========================================== */

function giveHint() {
  if (finished) return;

  hintsUsed++;

  const level = currentLevel();
  const snowflakes = getCats();

  const conflict = findConflict();

  if (conflict && snowflakes.length > 0) {
    const last = snowflakes[snowflakes.length - 1];

    cells[last.r][last.c] = "";

    renderBoard();

    setMessage(
      "💡 I removed one snowflake. Try a different spot!"
    );
    return;
  }

  for (let r = 0; r < level.size; r++) {
    const c = level.solution[r];

    if (cells[r][c] === "cat") continue;

    const previous = cells[r][c];
    cells[r][c] = "cat";

    if (!findConflict()) {
      renderBoard();

      setMessage(
        `💡 Try a snowflake in row ${r + 1}, column ${c + 1}.`
      );

      if (getCats().length === level.size) {
        finished = true;

        recordCompletedPuzzle();

        if (levelIndex < levels.length - 1) {
          setMessage("🎉 Wonderful! Puzzle completed!");
          nextButton.hidden = false;
        } else {
          setMessage(
            "🎉 Amazing! You completed every level!"
          );
        }
      }

      return;
    }

    cells[r][c] = previous;
  }

  setMessage(
    "💡 Try removing a snowflake and looking " +
    "for another arrangement."
  );
}

/* ==========================================
   BUTTON EVENTS
========================================== */

catModeButton.addEventListener("click", () => {
  mode = "cat";
  updateMode();
});

markModeButton.addEventListener("click", () => {
  mode = "mark";
  updateMode();
});

document.getElementById("catHint")
  .addEventListener("click", giveHint);

document.getElementById("catRestart")
  .addEventListener("click", startLevel);

nextButton.addEventListener("click", () => {
  if (!finished) return;

  if (levelIndex < levels.length - 1) {
    levelIndex++;
    startLevel();
  }
});

document.getElementById("catStartOver")
  .addEventListener("click", () => {
    levelIndex = 0;
    startLevel();
  });

/* ==========================================
   PLAY RECOMMENDED LEVEL
========================================== */

recommendationButton.addEventListener("click", () => {
  if (!finished) return;

  levelIndex = suggestedLevel - 1;
  startLevel();
});

/* ==========================================
   START GAME
========================================== */

startLevel();
