const colorItems =
    document.getElementById(
        "colorItems"
    );

const colorBins =
    document.getElementById(
        "colorBins"
    );

const sortingMessage =
    document.getElementById(
        "sortingMessage"
    );

const sortingLevelDisplay =
    document.getElementById(
        "sortingLevelDisplay"
    );

const sortedCounter =
    document.getElementById(
        "sortedCounter"
    );

const sortingNextButton =
    document.getElementById(
        "sortingNextButton"
    );

const sortingRestartButton =
    document.getElementById(
        "sortingRestartButton"
    );


const colors = {

    red: {
        label: "Red",
        hex: "#e85d5d"
    },

    blue: {
        label: "Blue",
        hex: "#5576e6"
    },

    yellow: {
        label: "Yellow",
        hex: "#f2c84b"
    },

    green: {
        label: "Green",
        hex: "#55a86b"
    }

};


const levels = [

    {
        colors: [
            "red",
            "blue"
        ],

        copies: 3
    },


    {
        colors: [
            "red",
            "blue",
            "yellow"
        ],

        copies: 3
    },


    {
        colors: [
            "red",
            "blue",
            "yellow",
            "green"
        ],

        copies: 3
    },


    {
        colors: [
            "red",
            "blue",
            "yellow",
            "green"
        ],

        copies: 4
    }

];


let currentLevel = 0;

let selectedItem = null;

let sortedCount = 0;

let totalItems = 0;


function shuffle(array) {

    const copy = [...array];


    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
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


function setSortingMessage(
    text,
    tone
) {

    sortingMessage.textContent =
        text;


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


function createSortingGame() {

    colorItems.innerHTML = "";

    colorBins.innerHTML = "";

    selectedItem = null;

    sortedCount = 0;

    sortingNextButton.hidden =
        true;


    const level =
        levels[currentLevel];


    sortingLevelDisplay.textContent =
        `Level ${currentLevel + 1}`;


    const items = [];


    level.colors.forEach(
        (colorName) => {

            for (
                let i = 0;
                i < level.copies;
                i++
            ) {

                items.push(
                    colorName
                );
            }
        }
    );


    totalItems =
        items.length;


    sortedCounter.textContent =
        `0 of ${totalItems}`;


    setSortingMessage(
        "Choose a color."
    );


    const shuffledItems =
        shuffle(items);


    shuffledItems.forEach(
        (colorName) => {

            createColorItem(
                colorName
            );
        }
    );


    level.colors.forEach(
        (colorName) => {

            createColorBin(
                colorName
            );
        }
    );
}


function createColorItem(colorName) {

    const button =
        document.createElement(
            "button"
        );


    button.classList.add(
        "color-item"
    );


    button.dataset.color =
        colorName;


    button.style.backgroundColor =
        colors[colorName].hex;


    button.setAttribute(
        "aria-label",
        `${colors[colorName].label} color`
    );


    button.addEventListener(
        "click",
        () => selectColor(button)
    );


    colorItems.appendChild(
        button
    );
}


function selectColor(button) {

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
        `${colors[button.dataset.color].label} selected. Choose the matching box.`
    );
}


function createColorBin(colorName) {

    const bin =
        document.createElement(
            "button"
        );


    bin.classList.add(
        "color-bin"
    );


    bin.dataset.color =
        colorName;


    bin.innerHTML = `
        <span
            class="bin-color"
            style="background-color: ${colors[colorName].hex}">
        </span>

        <span class="bin-name">
            ${colors[colorName].label}
        </span>
    `;


    bin.setAttribute(
        "aria-label",
        `${colors[colorName].label} sorting box`
    );


    bin.addEventListener(
        "click",
        () => sortItem(bin)
    );


    colorBins.appendChild(
        bin
    );
}


function sortItem(bin) {

    if (!selectedItem) {

        setSortingMessage(
            "Choose a color first.",
            "message-retry"
        );

        return;
    }


    const selectedColor =
        selectedItem.dataset.color;


    const binColor =
        bin.dataset.color;


    if (
        selectedColor ===
        binColor
    ) {

        handleCorrectSort(
            bin
        );

    } else {

        handleIncorrectSort(
            bin
        );
    }
}


function handleCorrectSort(bin) {

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
        "Great job! That's the right color.",
        "message-success"
    );


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


function handleIncorrectSort(bin) {

    bin.classList.add(
        "incorrect-bin"
    );


    setSortingMessage(
        "Not quite — try another box.",
        "message-retry"
    );


    setTimeout(() => {

        bin.classList.remove(
            "incorrect-bin"
        );

    }, 700);
}


function levelComplete() {

    if (
        currentLevel <
        levels.length - 1
    ) {

        setSortingMessage(
            `Wonderful! Level ${currentLevel + 1} complete!`,
            "message-success"
        );


        sortingNextButton.hidden =
            false;

    } else {

        setSortingMessage(
            "Amazing! You completed every color level!",
            "message-success"
        );


        sortingNextButton.hidden =
            true;
    }
}


sortingNextButton.addEventListener(
    "click",
    () => {

        if (
            currentLevel <
            levels.length - 1
        ) {

            currentLevel++;

            createSortingGame();
        }
    }
);


sortingRestartButton.addEventListener(
    "click",
    () => {

        currentLevel = 0;

        createSortingGame();
    }
);


createSortingGame();