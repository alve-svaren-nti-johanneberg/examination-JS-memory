"use strict";

const gamePlan = document.querySelector("#game #plan");
const gameControls = document.querySelector("#game #controls");
const resetButton = document.querySelector("#game #controls #reset");
const attemptsText = document.querySelector("#game #controls #attempts");

const imageCount = 12;

let attempts = 0;

const shuffleArr = array => {
    for (var i = array.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
};

const updateAttempts = newAttempts => {
    attempts = newAttempts;
    attemptsText.innerHTML = attempts;
};

const checkPair = (first, second) => {
    return first.dataset.id === second.dataset.id && first !== second;
    // if () {
    //     first.classList.add("match");
    //     second.classList.add("match");
    // } else {
    //     updateAttempts(attempts + 1);
    // }
};

/** @type {HTMLImageElement} */
let current = null;
let other = null;

/** @param {MouseEvent} e */
const handleImageClick = e => {
    if (current && other) {
        current.classList.remove("active");
        other.classList.remove("active");
        current = null;
        other = null;
        return;
    }
    const target = e.currentTarget;
    if (target.classList.contains("match") || target.classList.contains("active")) {
        return;
    }
    if (!current) {
        current = target;
        current.classList.add("active");
    } else {
        other = target;
        if (checkPair(current, target)) {
            current.classList.add("match");
            other.classList.add("match");
            current.classList.remove("active");
            other = null;
            current = null;
        } else {
            other.classList.add("active");
            updateAttempts(attempts + 1);

        }
    }
};

const resetPictures = () => {
    const pictures = Array(imageCount * 2)
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
        });

    shuffleArr(pictures);
    console.log(pictures);

    gamePlan.innerHTML = "";
    pictures.forEach(picture => gamePlan.appendChild(picture));
};

resetPictures();

resetButton.addEventListener("click", () => {
    updateAttempts(0);
    resetPictures();
});
