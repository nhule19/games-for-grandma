const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");

const levelDisplay =
    document.getElementById("levelDisplay");

const pairsCounter =
    document.getElementById("pairsCounter");

const restartButton =
    document.getElementById("restartButton");

const nextLevelButton =
    document.getElementById("nextLevelButton");


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


function setMessage(text, tone) {

    message.textContent = text;

    message.classList.remove(
        "message-success",
        "message-retry"
    );

    if (tone) {
        message.classList.add(tone);
    }
}


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


    pairsCounter.textContent =
        `0 of ${numberOfPairs}`;


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


function updateGrid(cardCount) {

    if (cardCount === 6) {

        gameBoard.style.gridTemplateColumns =
            "repeat(3, 1fr)";

    } else {

        gameBoard.style.gridTemplateColumns =
            "repeat(4, 1fr)";
    }
}


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


    if (firstCard === null) {

        firstCard = card;

        setMessage(
            "Now choose another card."
        );

        return;
    }


    secondCard = card;

    checkForMatch();
}


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


function handleMatch() {

    firstCard.classList.add(
        "matched"
    );

    secondCard.classList.add(
        "matched"
    );


    firstCard.disabled = true;
    secondCard.disabled = true;


    matchesFound++;


    pairsCounter.textContent =
        `${matchesFound} of ${levels[currentLevel]}`;


    setMessage(
        "Great job! You found a match.",
        "message-success"
    );


    resetTurn();


    if (
        matchesFound ===
        levels[currentLevel]
    ) {

        levelComplete();
    }
}


function handleNoMatch() {

    boardLocked = true;


    setMessage(
        "Not quite — let's look again.",
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
            "Choose another card."
        );

    }, MISMATCH_DELAY_MS);
}


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


function resetTurn() {

    firstCard = null;
    secondCard = null;

    boardLocked = false;
}


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