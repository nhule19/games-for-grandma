const themeSelection =
    document.getElementById("themeSelection");

const sortingGame =
    document.getElementById("sortingGame");

const objectItems =
    document.getElementById("objectItems");

const objectBins =
    document.getElementById("objectBins");

const sortingMessage =
    document.getElementById("sortingMessage");

const sortingThemeDisplay =
    document.getElementById("sortingThemeDisplay");

const sortedCounter =
    document.getElementById("sortedCounter");

const sortingRestartButton =
    document.getElementById("sortingRestartButton");

const changeThemeButton =
    document.getElementById("changeThemeButton");


/* ========================================
   THEMES
======================================== */

const themes = {

    food: {

        name: "Food",

        categories: {

            fruit: {
                name: "Fruit",
                emoji: "🧺"
            },

            vegetable: {
                name: "Vegetables",
                emoji: "🥗"
            }

        },

        items: [

            {
                name: "Apple",
                emoji: "🍎",
                category: "fruit"
            },

            {
                name: "Banana",
                emoji: "🍌",
                category: "fruit"
            },

            {
                name: "Orange",
                emoji: "🍊",
                category: "fruit"
            },

            {
                name: "Carrot",
                emoji: "🥕",
                category: "vegetable"
            },

            {
                name: "Broccoli",
                emoji: "🥦",
                category: "vegetable"
            },

            {
                name: "Corn",
                emoji: "🌽",
                category: "vegetable"
            }

        ]

    },


    animals: {

        name: "Animals",

        categories: {

            pet: {
                name: "Pets",
                emoji: "🐶"
            },

            farm: {
                name: "Farm Animals",
                emoji: "🐄"
            }

        },

        items: [

            {
                name: "Dog",
                emoji: "🐶",
                category: "pet"
            },

            {
                name: "Cat",
                emoji: "🐱",
                category: "pet"
            },

            {
                name: "Rabbit",
                emoji: "🐰",
                category: "pet"
            },

            {
                name: "Cow",
                emoji: "🐄",
                category: "farm"
            },

            {
                name: "Pig",
                emoji: "🐷",
                category: "farm"
            },

            {
                name: "Chicken",
                emoji: "🐔",
                category: "farm"
            }

        ]

    },


    clothing: {

        name: "Clothing",

        categories: {

            top: {
                name: "Tops",
                emoji: "👕"
            },

            bottom: {
                name: "Bottoms",
                emoji: "👖"
            }

        },

        items: [

            {
                name: "T-Shirt",
                emoji: "👕",
                category: "top"
            },

            {
                name: "Coat",
                emoji: "🧥",
                category: "top"
            },

            {
                name: "Jeans",
                emoji: "👖",
                category: "bottom"
            },

            {
                name: "Shorts",
                emoji: "🩳",
                category: "bottom"
            }

        ]

    }

};


/* ========================================
   GAME VARIABLES
======================================== */

let currentTheme = null;

let selectedItem = null;

let sortedCount = 0;

let totalItems = 0;


/* ========================================
   SHUFFLE
======================================== */

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[randomIndex]
        ] = [
            copy[randomIndex],
            copy[i]
        ];

    }

    return copy;
}


/* ========================================
   MESSAGE
======================================== */

function setSortingMessage(text, tone) {

    sortingMessage.textContent = text;

    sortingMessage.classList.remove(
        "message-success",
        "message-retry"
    );

    if (tone) {

        sortingMessage.classList.add(
            tone
        );

    }

}


/* ========================================
   THEME BUTTONS
======================================== */

document
    .querySelectorAll(".theme-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                startTheme(
                    button.dataset.theme
                );

            }
        );

    });


function startTheme(themeName) {

    currentTheme = themeName;

    themeSelection.hidden = true;

    sortingGame.hidden = false;

    createSortingGame();

}


/* ========================================
   CREATE GAME
======================================== */

function createSortingGame() {

    objectItems.innerHTML = "";

    objectBins.innerHTML = "";

    selectedItem = null;

    sortedCount = 0;

    const theme =
        themes[currentTheme];

    sortingThemeDisplay.textContent =
        theme.name;

    totalItems =
        theme.items.length;

    sortedCounter.textContent =
        `0 of ${totalItems}`;

    setSortingMessage(
        "Choose an object."
    );


    /* Shuffle objects */

    const shuffledItems =
        shuffle(theme.items);


    shuffledItems.forEach(item => {

        createObjectItem(item);

    });


    /* Create category boxes */

    Object.entries(
        theme.categories
    ).forEach(([categoryName, category]) => {

        createObjectBin(
            categoryName,
            category
        );

    });

}


/* ========================================
   CREATE OBJECT
======================================== */

function createObjectItem(item) {

    const button =
        document.createElement("button");

    button.classList.add(
        "object-item"
    );

    button.dataset.category =
        item.category;

    button.dataset.name =
        item.name;

    button.innerHTML = `
        <span class="object-emoji">
            ${item.emoji}
        </span>

        <span class="object-name">
            ${item.name}
        </span>
    `;

    button.setAttribute(
        "aria-label",
        item.name
    );

    button.addEventListener(
        "click",
        () => selectObject(button)
    );

    objectItems.appendChild(button);

}


/* ========================================
   SELECT OBJECT
======================================== */

function selectObject(button) {

    if (button.disabled) {
        return;
    }

    if (selectedItem) {

        selectedItem.classList.remove(
            "selected"
        );

    }

    selectedItem = button;

    button.classList.add(
        "selected"
    );

    setSortingMessage(
        `${button.dataset.name} selected. Where does it belong?`
    );

}


/* ========================================
   CREATE CATEGORY BOX
======================================== */

function createObjectBin(
    categoryName,
    category
) {

    const bin =
        document.createElement("button");

    bin.classList.add(
        "object-bin"
    );

    bin.dataset.category =
        categoryName;

    bin.innerHTML = `

        <span class="bin-emoji">
            ${category.emoji}
        </span>

        <span class="bin-name">
            ${category.name}
        </span>

    `;

    bin.setAttribute(
        "aria-label",
        `${category.name} category`
    );

    bin.addEventListener(
        "click",
        () => sortObject(bin)
    );

    objectBins.appendChild(bin);

}


/* ========================================
   SORT OBJECT
======================================== */

function sortObject(bin) {

    if (!selectedItem) {

        setSortingMessage(
            "Choose an object first.",
            "message-retry"
        );

        return;

    }

    const selectedCategory =
        selectedItem.dataset.category;

    const binCategory =
        bin.dataset.category;


    if (
        selectedCategory ===
        binCategory
    ) {

        handleCorrectSort(bin);

    } else {

        handleIncorrectSort(bin);

    }

}


/* ========================================
   CONFETTI
======================================== */

function launchConfetti(amount = 20) {

    const colors = [
        "#e85d5d",
        "#5576e6",
        "#f2c84b",
        "#55a86b",
        "#b565a7",
        "#f28c52"
    ];

    for (let i = 0; i < amount; i++) {

        const confetti =
            document.createElement("div");

        confetti.classList.add(
            "confetti-piece"
        );

        confetti.style.left = "50%";
        confetti.style.top = "50%";

        confetti.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        const x =
            (Math.random() - 0.5) * 500;

        const y =
            (Math.random() - 0.5) * 400;

        const rotation =
            Math.random() * 720;

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


/* ========================================
   CORRECT
======================================== */

function handleCorrectSort(bin) {

    const objectName =
        selectedItem.dataset.name;

    selectedItem.classList.add(
        "sorted"
    );

    selectedItem.disabled = true;

    selectedItem.classList.remove(
        "selected"
    );

    bin.classList.add(
        "correct-bin"
    );

    sortedCount++;

    sortedCounter.textContent =
        `${sortedCount} of ${totalItems}`;

    setSortingMessage(
        `Great job! ${objectName} belongs there.`,
        "message-success"
    );


    /* Small confetti celebration */

    launchConfetti(20);


    selectedItem = null;


    setTimeout(() => {

        bin.classList.remove(
            "correct-bin"
        );

    }, 500);


    if (
        sortedCount ===
        totalItems
    ) {

        levelComplete();

    }

}


/* ========================================
   INCORRECT
======================================== */

function handleIncorrectSort(bin) {

    bin.classList.add(
        "incorrect-bin"
    );

    setSortingMessage(
        "Not quite. Try the other group.",
        "message-retry"
    );


    setTimeout(() => {

        bin.classList.remove(
            "incorrect-bin"
        );

    }, 700);

}


/* ========================================
   COMPLETE
======================================== */

function levelComplete() {

    setSortingMessage(
        `Wonderful! You sorted all the ${themes[currentTheme].name.toLowerCase()}!`,
        "message-success"
    );


    /* Bigger celebration for finishing */

    setTimeout(() => {

        launchConfetti(45);

    }, 350);

}


/* ========================================
   START OVER
======================================== */

sortingRestartButton.addEventListener(
    "click",
    () => {

        createSortingGame();

    }
);


/* ========================================
   CHANGE THEME
======================================== */

changeThemeButton.addEventListener(
    "click",
    () => {

        sortingGame.hidden = true;

        themeSelection.hidden = false;

        currentTheme = null;

    }
);