"use strict"

// SELECT ELEMENTS
const mainContainerEl = document.querySelector(".main-container");
const playBtnEl = document.querySelector('.play.btn');
const playAgainBtnEl = document.querySelector(".play-again.btn")
const groundEl = document.querySelector('.ground');
const scoreEl = document.querySelector('.score');
const scoreElInPlyaingAgain = document.querySelector('.score-in-playing-again');

// VARIABLES

const eightLeftCells = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const eightRightCells = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
let cellsArr = [];
let cellEls = [];
let snakeIndexes = [];// first index is snake head
let snakeDirection;
let appleIndex;
let playing;
let score;
let moveToTopId;
let moveToRightId;
let moveToBottomId;
let moveToLeftId;
let allowedToMove; // this bocemes false when snake starts moving in a direction and after snake has moved a step then it becomes true again


// FUNCTIONS
const removeDirectionClasses = function (el) { // removes all classes (which has -d at the end of it) on the element
    el.classList.forEach(className => {
        if (className.endsWith('-d')) {
            el.classList.remove(className)
        }
    })
}
const move = function (direction, moveDistance) {

    if (direction === "top" && (snakeIndexes[0] - 10 < 0 || cellsArr[snakeIndexes[0] + moveDistance] === 0)) {
        stopPlaying();
    } else if (direction === "right" && (eightRightCells.includes(snakeIndexes[0]) || cellsArr[snakeIndexes[0] + moveDistance] === 0)) {

        stopPlaying();
    } else if (direction === 'bottom' && (snakeIndexes[0] + 6 > 99 || cellsArr[snakeIndexes[0] + moveDistance] === 0)) {
        stopPlaying();
    } else if (direction === "left" && (eightLeftCells.includes(snakeIndexes[0]) || cellsArr[snakeIndexes[0] + moveDistance] === 0)) {
        stopPlaying();
    } else {
        // remove snake head from previous place
        cellsArr[snakeIndexes[0]] = null;
        cellEls[snakeIndexes[0]].classList.remove(`${direction}-d`);
        cellEls[snakeIndexes[0]].classList.remove('snake-head')
        for (let i = 1; i < snakeIndexes.length; i++) {
            cellsArr[snakeIndexes[i]] = null;
            cellEls[snakeIndexes[i]].classList.remove('snake-body')
        }

        let currentVal = null;
        let nextVal = null;
        for (let i = 0; i < snakeIndexes.length; i++) {
            if (i === 0) {
                currentVal = snakeIndexes[i];
                nextVal = snakeIndexes[i] + moveDistance;
            } else {
                nextVal = currentVal;
                currentVal = snakeIndexes[i];
            }
            snakeIndexes[i] = nextVal;
        }

        // place snake at new position
        cellsArr[snakeIndexes[0]] = 0;
        cellEls[snakeIndexes[0]].classList.add('snake-head');
        // add direction class
        cellEls[snakeIndexes[0]].classList.add(`${direction}-d`);
        for (let i = 1; i < snakeIndexes.length; i++) {
            cellsArr[snakeIndexes[i]] = 0;
            cellEls[snakeIndexes[i]].classList.add('snake-body')
        }

        allowedToMove = true;
        if (appleIndex === snakeIndexes[0]) {
            scoreEl.textContent = ++score;
            snakeIndexes.push(snakeIndexes[snakeIndexes.length - 1] - 1)
            cellEls[appleIndex].classList.remove('apple-on');
            cellsArr[appleIndex] = null;
            do {
                appleIndex = Math.trunc(Math.random() * 100);
            } while (cellsArr[appleIndex] === 0);
            cellsArr[appleIndex] = 1;
            cellEls[appleIndex].classList.add('apple-on')
        }
    }

}
const stopMoving = function () {
    clearInterval(moveToTopId);
    clearInterval(moveToRightId);
    clearInterval(moveToBottomId);
    clearInterval(moveToLeftId);
}
const stopPlaying = function () {
    playing = false;
    stopMoving();
    scoreElInPlyaingAgain.textContent = score;
    mainContainerEl.classList.remove("playing");
    mainContainerEl.classList.add('playing-again')
}
const reset = function () {
    stopMoving();
    playing = true;
    groundEl.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        cellsArr[i] = null;
        groundEl.insertAdjacentHTML("beforeend", `<span class="cell"></span>`)
    }
    cellEls = document.querySelectorAll(".cell")
    // RESET THE SCORE
    score = 0;
    scoreEl.textContent = score;


    // PLACE APPPLE
    appleIndex = 48;
    cellsArr[appleIndex] = 1; // 1 means apple on cellsArr
    cellEls[appleIndex].classList.add('apple-on');
    // PLACE THE SNAEK
    snakeIndexes = [44, 43, 42];
    cellsArr[snakeIndexes[0]] = 0; // 0 means snake body or head in cellsArr 
    cellEls[snakeIndexes[0]].classList.add('snake-head')
    for (let i = 1; i < snakeIndexes.length; i++) {
        cellsArr[snakeIndexes[i]] = 0;
        cellEls[snakeIndexes[i]].classList.add('snake-body');
    }
    // determine snake direction
    snakeDirection = 2; // 0 , 1, 2, 3  === top , right , bottom , left
    cellEls[snakeIndexes[0]].classList.add('right-d');

    allowedToMove = true;

}



// RESET
reset();

// SET STATE TO START PLAYING
mainContainerEl.classList.remove('playing');
mainContainerEl.classList.add('start-playing');

// EVENTS
playBtnEl.addEventListener("click", function () {
    mainContainerEl.classList.remove('start-playing');
    mainContainerEl.classList.add('playing');
    playing = true;
});

document.addEventListener('keydown', function (e) {
    if (playing) {
        if (e.key === 'ArrowUp' && snakeDirection !== 0 && snakeDirection !== 2 && allowedToMove) {
            // stop all intervals;
            stopMoving();
            // remove direction classes on the head
            removeDirectionClasses(cellEls[snakeIndexes[0]]);
            snakeDirection = 0; // change snake direction
            cellEls[snakeIndexes[0]].classList.add('top-d');
            allowedToMove = false;

            if (cellsArr[snakeIndexes[0] - 10] === 0 || snakeIndexes[0] - 10 < 0) {
                stopPlaying();
            } else {
                moveToTopId = setInterval(
                    move, 250, "top", -10
                );
            }



        } else if (e.key === 'ArrowRight' && snakeDirection !== 1 && snakeDirection !== 3 && allowedToMove) {
            // stop all intervals;
            stopMoving();
            // remove direction classes on the head
            removeDirectionClasses(cellEls[snakeIndexes[0]]);
            snakeDirection = 1; // change snake direction
            cellEls[snakeIndexes[0]].classList.add('right-d')
            allowedToMove = false;

            if (cellsArr[snakeIndexes[0] + 1] === 0 || eightRightCells.includes(snakeIndexes[0])) {
                stopPlaying();

            } else {
                moveToRightId = setInterval(
                    move, 250, "right", +1
                );
            }


        } else if (e.key === 'ArrowDown' && snakeDirection !== 2 && snakeDirection !== 0 && allowedToMove) {
            // stop all intervals;
            stopMoving();
            // remove direction classes on the head
            removeDirectionClasses(cellEls[snakeIndexes[0]]);
            snakeDirection = 2; // change snake direction
            cellEls[snakeIndexes[0]].classList.add('bottom-d')
            allowedToMove = false;

            if (cellsArr[snakeIndexes[0] + 10] === 0 || snakeIndexes[0] + 10 > 99) {
                stopPlaying();

            } else {
                moveToBottomId = setInterval(
                    move, 250, "bottom", +10
                );
            }


        } else if (e.key === 'ArrowLeft' && snakeDirection !== 3 && snakeDirection !== 1 && allowedToMove) {
            // stop all intervals;
            stopMoving();
            // remove direction classes on the head
            removeDirectionClasses(cellEls[snakeIndexes[0]]);
            snakeDirection = 3; // change snake direction
            cellEls[snakeIndexes[0]].classList.add('left-d')
            allowedToMove = false;

            if (cellsArr[snakeIndexes[0] - 1] === 0 || eightLeftCells.includes(snakeIndexes[0])) {
                stopPlaying();

            } else {
                moveToLeftId = setInterval(
                    move, 250, "left", -1
                );
            }


        }
    }
})

playAgainBtnEl.addEventListener('click', function () {
    reset();
    // CHANGE STATE TO PLAYING
    mainContainerEl.classList.remove('playing-again');
    mainContainerEl.classList.add('playing');
})


