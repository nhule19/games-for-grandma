const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const messageText = document.getElementById("messageText");
const levelDisplay = document.getElementById("levelDisplay");
const pairsCounter = document.getElementById("pairsCounter");
const restartButton = document.getElementById("restartButton");
const nextLevelButton = document.getElementById("nextLevelButton");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const allPictures = [
    "🍎",
    "🐶",
    "🌸",
    "🚗",
    "🍌",
    "🐱",
    "☀️",
    "🍓"
];

const levels = [
    3,
    4,
    6,
    8
];

const MISMATCH_DELAY_MS = 2600;

let currentLevel = 0;
let firstCard = null;
let secondCard = null;
let boardLocked = false;
let matchesFound = 0;


/* -----------------------------
   SHUFFLE
----------------------------- */

function shuffle(array) {

    const copiedArray = [...array];

    for (
        let i = copiedArray.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [
            copiedArray[i],
            copiedArray[randomIndex]
        ] = [
            copiedArray[randomIndex],
            copiedArray[i]
        ];
    }

    return copiedArray;
}


/* -----------------------------
   MESSAGE
----------------------------- */

function setMessage(text, tone) {

    message.innerHTML = "";

    message.classList.remove(
        "message-success",
        "message-retry",
        "message-target"
    );

    const textElement =
        document.createElement("span");

    textElement.id = "messageText";
    textElement.textContent = text;

    message.appendChild(textElement);

    if (tone) {
        message.classList.add(tone);
    }
}

function showTargetMessage(picture) {

    message.innerHTML = "";

    message.classList.remove(
        "message-success",
        "message-retry"
    );

    message.classList.add(
        "message-target"
    );


    // Main instruction
    const title =
        document.createElement("span");

    title.classList.add(
        "target-title"
    );

    title.textContent =
        "Find another";


    // Large emoji
    const emoji =
        document.createElement("span");

    emoji.classList.add(
        "target-emoji"
    );

    emoji.textContent =
        picture;


    // Additional instruction
    const hint =
        document.createElement("span");

    hint.classList.add(
        "target-hint"
    );

    hint.textContent =
        "Choose the matching card";


    message.appendChild(title);
    message.appendChild(emoji);
    message.appendChild(hint);
}

/* -----------------------------
   PROGRESS
----------------------------- */

function updateProgress() {

    const totalPairs = levels[currentLevel];

    const percent =
        Math.round(
            (matchesFound / totalPairs) * 100
        );

    pairsCounter.textContent =
        `${matchesFound} of ${totalPairs}`;

    progressPercent.textContent =
        `${percent}%`;

    progressFill.style.width =
        `${percent}%`;

    progressBar.setAttribute(
        "aria-valuenow",
        percent
    );
}


/* -----------------------------
   CREATE GAME
----------------------------- */

function createGame() {

    gameBoard.innerHTML = "";

    firstCard = null;
    secondCard = null;

    boardLocked = false;

    matchesFound = 0;

    nextLevelButton.hidden = true;

    const numberOfPairs =
        levels[currentLevel];

    levelDisplay.textContent =
        `Level ${currentLevel + 1}`;

    updateProgress();

    setMessage(
        `Find all ${numberOfPairs} matching pairs!`
    );

    const selectedPictures =
        allPictures.slice(
            0,
            numberOfPairs
        );

    const cards = [
        ...selectedPictures,
        ...selectedPictures
    ];

    const shuffledCards =
        shuffle(cards);

    updateGrid(
        shuffledCards.length
    );

    shuffledCards.forEach(
        (picture) => {

            const card =
                document.createElement(
                    "button"
                );

            card.classList.add(
                "card"
            );

            card.dataset.picture =
                picture;

            card.setAttribute(
                "aria-label",
                "Hidden matching card"
            );

            card.innerHTML =
                `<span class="card-back">?</span>`;

            card.addEventListener(
                "click",
                () => flipCard(card)
            );

            gameBoard.appendChild(
                card
            );
        }
    );
}


/* -----------------------------
   GRID
----------------------------- */

function updateGrid(cardCount) {

    if (cardCount === 6) {

        gameBoard.style.gridTemplateColumns =
            "repeat(3, 1fr)";

    } else {

        gameBoard.style.gridTemplateColumns =
            "repeat(4, 1fr)";
    }
}


/* -----------------------------
   FLIP CARD
----------------------------- */

function flipCard(card) {

    if (boardLocked) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (
        card.classList.contains(
            "matched"
        )
    ) {
        return;
    }

    card.classList.add(
        "flipped"
    );

    card.textContent =
        card.dataset.picture;

    card.setAttribute(
        "aria-label",
        `Card showing ${card.dataset.picture}`
    );

    /*
       FIRST CARD SELECTED
    */

    if (firstCard === null) {

    firstCard = card;

    showTargetMessage(
        card.dataset.picture
    );

    return;
}

    /*
       SECOND CARD SELECTED
    */

    secondCard = card;

    checkForMatch();
}


/* -----------------------------
   CHECK MATCH
----------------------------- */

function checkForMatch() {

    const firstPicture =
        firstCard.dataset.picture;

    const secondPicture =
        secondCard.dataset.picture;

    if (
        firstPicture ===
        secondPicture
    ) {

        handleMatch();

    } else {

        handleNoMatch();
    }
}


/* -----------------------------
   MATCH FOUND
----------------------------- */

function handleMatch() {

    const matchedPicture =
        firstCard.dataset.picture;

    firstCard.classList.add(
        "matched"
    );

    secondCard.classList.add(
        "matched"
    );

    firstCard.disabled = true;
    secondCard.disabled = true;

    matchesFound++;

    updateProgress();

    setMessage(
        `Great job! You matched the ${matchedPicture}!`,
        "message-success"
    );

    /*
       CONFETTI
    */

    createConfetti(firstCard);
    createConfetti(secondCard);

    resetTurn();

    if (
        matchesFound ===
        levels[currentLevel]
    ) {

        levelComplete();
    }
}


/* -----------------------------
   NO MATCH
----------------------------- */

function handleNoMatch() {

    boardLocked = true;

    setMessage(
        "So close! Let's look again.",
        "message-retry"
    );

    firstCard.classList.add(
        "mismatch"
    );

    secondCard.classList.add(
        "mismatch"
    );

    setTimeout(() => {

        firstCard.classList.remove(
            "flipped",
            "mismatch"
        );

        secondCard.classList.remove(
            "flipped",
            "mismatch"
        );

        firstCard.innerHTML =
            `<span class="card-back">?</span>`;

        secondCard.innerHTML =
            `<span class="card-back">?</span>`;

        firstCard.setAttribute(
            "aria-label",
            "Hidden matching card"
        );

        secondCard.setAttribute(
            "aria-label",
            "Hidden matching card"
        );

        resetTurn();

        setMessage(
            "Choose a card to continue."
        );

    }, MISMATCH_DELAY_MS);
}


/* -----------------------------
   CONFETTI
----------------------------- */

function createConfetti(card) {

    const rect =
        card.getBoundingClientRect();

    const colors = [
        "#4C6B57",
        "#B5654A",
        "#D9A441",
        "#7895B2",
        "#C58BB8"
    ];

    /*
       Keep the reward small so it
       doesn't become distracting.
    */

    for (let i = 0; i < 14; i++) {

        const confetti =
            document.createElement("span");

        confetti.classList.add(
            "confetti-piece"
        );

        confetti.style.left =
            `${rect.left + rect.width / 2}px`;

        confetti.style.top =
            `${rect.top + rect.height / 2}px`;

        confetti.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        const x =
            (Math.random() - 0.5) * 140;

        const y =
            -40 -
            Math.random() * 100;

        const rotation =
            Math.random() * 360;

        confetti.style.setProperty(
            "--x",
            `${x}px`
        );

        confetti.style.setProperty(
            "--y",
            `${y}px`
        );

        confetti.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );

        document.body.appendChild(
            confetti
        );

        setTimeout(() => {

            confetti.remove();

        }, 1000);
    }
}


/* -----------------------------
   LEVEL COMPLETE
----------------------------- */

function levelComplete() {

    boardLocked = true;

    gameBoard.classList.add(
        "game-won"
    );

    if (
        currentLevel <
        levels.length - 1
    ) {

        setMessage(
            `Wonderful! Level ${currentLevel + 1} complete!`,
            "message-success"
        );

        nextLevelButton.hidden =
            false;

    } else {

        setMessage(
            "Amazing! You completed every level!",
            "message-success"
        );

        nextLevelButton.hidden =
            true;
    }
}


/* -----------------------------
   RESET TURN
----------------------------- */

function resetTurn() {

    firstCard = null;
    secondCard = null;
    boardLocked = false;
}


/* -----------------------------
   NEXT LEVEL
----------------------------- */

nextLevelButton.addEventListener(
    "click",
    () => {

        if (
            currentLevel <
            levels.length - 1
        ) {

            currentLevel++;

            gameBoard.classList.remove(
                "game-won"
            );

            createGame();
        }
    }
);


/* -----------------------------
   START OVER
----------------------------- */

restartButton.addEventListener(
    "click",
    () => {

        currentLevel = 0;

        gameBoard.classList.remove(
            "game-won"
        );

        createGame();
    }
);


createGame();