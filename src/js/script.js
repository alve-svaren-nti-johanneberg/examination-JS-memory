"use strict";

const gamePlan = document.querySelector("#game #plan");
const gameControls = document.querySelector("#game #controls");
const resetButton = document.querySelector("#game #controls #reset");
const attemptsText = document.querySelector("#game #controls #attempts");
const timeText = document.querySelector("#game #controls #time");

const imageCount = 12;

let attempts = 0;

const updateAttempts = newAttempts => {
    attempts = newAttempts;
    attemptsText.innerHTML = attempts;
};

const checkPair = (first, second) => {
    return first.dataset.id === second.dataset.id && first !== second;
};

/** @type {HTMLImageElement} */
let current = null;

/** @type {HTMLImageElement} */
let other = null;

/** @type {Date} */
let startTime = null;

/** @param {MouseEvent} e */
const handleImageClick = e => {
    if (!startTime) {
        startTime = new Date();
    }
    // If two images are already selected, deselect them and return
    if (current && other) {
        current.classList.remove("active");
        other.classList.remove("active");
        current = null;
        other = null;
        return;
    }
    const target = e.currentTarget;

    // If the clicked image is already selected or part of a pair, return
    if (target.classList.contains("match") || target.classList.contains("active")) {
        return;
    }

    // If no image is selected, select the clicked image
    if (!current) {
        current = target;
        current.classList.add("active");
    }
    // If an image is selected, select the clicked image too and check if it's a match
    else {
        other = target;
        // If matching, make both images match and reset the selection
        if (checkPair(current, target)) {
            current.classList.remove("active");
            current.classList.add("match");
            other.classList.add("match");
            current = null;
            other = null;
        }
        // If not matching, deselect both images and reset the selection
        else {
            other.classList.add("active");
            updateAttempts(attempts + 1);
        }
    }

    if (checkIfWon()) {
        alert(`You won in ${attempts} attempts and it took ${getTime()}!`);
        resetPictures();
    }
};

const checkIfWon = () => {
    const matches = gamePlan.querySelectorAll(".match");
    return matches.length === imageCount * 2;
};

const resetPictures = () => {
    // Generate array of image elements in random order
    let pictures = Array(imageCount * 2)
        .fill()
        .map((_, i) => {
            const picture = document.createElement("picture");
            picture.classList.add("item");

            const img = document.createElement("img");
            const num = (i % imageCount) + 1;
            img.src = `img/char-${num}.png`;
            picture.dataset.id = num;
            picture.appendChild(img);
            picture.addEventListener("click", handleImageClick);
            return picture;
        })
        .sort(() => Math.random() - 0.5);
    updateAttempts(0);
    startTime = null;

    // Display them in the game plan
    gamePlan.innerHTML = "";
    pictures.forEach(picture => gamePlan.appendChild(picture));
};

const zeroPad = num => {
    return num < 10 ? `0${num}` : num;
};

const getTime = () => {
    if (startTime) {
        const time = new Date(new Date().getTime() - startTime.getTime());
        return `${zeroPad(time.getMinutes())}:${zeroPad(time.getSeconds())}`;
    } else {
        return "00:00";
    }
};

resetPictures();

resetButton.addEventListener("click", () => {
    updateAttempts(0);
    resetPictures();
});

setInterval(() => (timeText.textContent = getTime()), 1000);
