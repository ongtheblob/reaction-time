// ======================================
// SETTINGS
// ======================================

const TOTAL_TRIALS = 5;


// ======================================
// GET HTML ELEMENTS
// ======================================

const gameArea = document.getElementById("game-area");
const message = document.getElementById("message");
const startButton = document.getElementById("start-button");

const trialNumber = document.getElementById("trial-number");
const reactionTimeDisplay = document.getElementById("reaction-time");
const averageTimeDisplay = document.getElementById("average-time");


// ======================================
// GAME VARIABLES
// ======================================

let currentTrial = 0;

let reactionTimes = [];

let startTime = null;

let timeoutID = null;

let gameState = "start";


// ======================================
// START BUTTON
// ======================================

startButton.addEventListener("click", function(event) {

    // Prevent the click from being
    // interpreted as a reaction
    event.stopPropagation();

    startGame();

});


// ======================================
// GAME AREA CLICK
// ======================================

gameArea.addEventListener("click", function() {

    if (gameState === "waiting") {

        // Player clicked too early
        tooEarly();

    }

    else if (gameState === "ready") {

        // Player reacted
        recordReaction();

    }

});


// ======================================
// START GAME
// ======================================

function startGame() {

    currentTrial = 0;

    reactionTimes = [];

    reactionTimeDisplay.textContent = "-";
    averageTimeDisplay.textContent = "-";

    startButton.style.display = "none";

    startTrial();

}


// ======================================
// START A TRIAL
// ======================================

function startTrial() {

    currentTrial++;

    trialNumber.textContent = currentTrial;

    gameState = "waiting";

    gameArea.style.backgroundColor = "#b83232";

    message.textContent = "WAIT...";

    // Random delay between 2 and 5 seconds

    const randomDelay =
        Math.random() * 3000 + 2000;

    timeoutID = setTimeout(function() {

        gameState = "ready";

        gameArea.style.backgroundColor = "#2e9e50";

        message.textContent = "CLICK!";

        // Start measuring reaction time

        startTime = performance.now();

    }, randomDelay);

}


// ======================================
// TOO EARLY
// ======================================

function tooEarly() {

    // Cancel the timer

    clearTimeout(timeoutID);

    gameState = "result";

    gameArea.style.backgroundColor = "#8c4a2f";

    message.textContent = "TOO EARLY!";

    reactionTimeDisplay.textContent = "False start";

    setTimeout(function() {

        if (currentTrial < TOTAL_TRIALS) {

            startTrial();

        }

        else {

            finishGame();

        }

    }, 1500);

}


// ======================================
// RECORD REACTION
// ======================================

function recordReaction() {

    const endTime = performance.now();

    const reactionTime =
        endTime - startTime;

    reactionTimes.push(reactionTime);

    reactionTimeDisplay.textContent =
        Math.round(reactionTime) + " ms";

    gameState = "result";

    gameArea.style.backgroundColor = "#33334d";

    message.textContent =
        Math.round(reactionTime) + " ms";

    // Wait before next trial

    setTimeout(function() {

        if (currentTrial < TOTAL_TRIALS) {

            startTrial();

        }

        else {

            finishGame();

        }

    }, 1500);

}


// ======================================
// FINISH GAME
// ======================================

function finishGame() {

    gameState = "finished";

    const average =
        calculateAverage();

    averageTimeDisplay.textContent =
        Math.round(average) + " ms";

    message.textContent =
        "TEST COMPLETE!";

    gameArea.style.backgroundColor =
        "#33334d";

    startButton.style.display =
        "block";

    startButton.textContent =
        "PLAY AGAIN";

}


// ======================================
// CALCULATE AVERAGE
// ======================================

function calculateAverage() {

    if (reactionTimes.length === 0) {

        return 0;

    }

    const total =
        reactionTimes.reduce(
            (sum, time) => sum + time,
            0
        );

    return total / reactionTimes.length;

}