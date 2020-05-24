document.addEventListener("DOMContentLoaded", () => {
  // line above adds an eventlitsener to everything inside this block.
  const grid = document.querySelector(".grid");
  // line above gets into the html and gets the class named "grid" and adds it to JS.
  let squares = Array.from(document.querySelectorAll(".grid div"));
  // this line above gets all the divs inside the grid div. AND pushes them into a Array i named squarse.
  const scoreDisplay = document.querySelector("#score");
  // this gets the score from html document, and since its an ID we use hastag sign to locate it.
  const startBtn = document.querySelector("#start-button");
  // pritty much the same as the above line.
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = ["orange", "red", "purple", "green"];

  // The Tetrominoes!
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    oTetromino,
    iTetromino,
    tTetromino,
  ];

  // Select randomly a tetromino and its first rotation.
  let random = Math.floor(Math.random() * theTetrominoes.length);
  console.log(random);
  let currentPostion = 4;
  let currentRotation = 0;
  let current = theTetrominoes[random][currentRotation];

  // draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPostion + index].classList.add("tetromino");
      squares[currentPostion + index].style.backgroundColor = colors[random];
    });
  }

  // undraw the Tetromino

  function unDraw() {
    current.forEach((index) => {
      squares[currentPostion + index].classList.remove("tetromino");
      squares[currentPostion + index].style.backgroundColor = "";
    });
  }

  // assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  function moveDown() {
    unDraw();
    currentPostion += width;
    draw();
    freeze();
  }

  // freez function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPostion + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPostion + index].classList.add("taken")
      );
      // start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPostion = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }
  // move the tetromino left, unless is at the edge or there is blocage

  function moveLeft() {
    unDraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPostion + index) % width === 0
    );

    if (!isAtLeftEdge) currentPostion -= 1;

    if (
      current.some((index) =>
        squares[currentPostion + index].classList.contains("taken")
      )
    ) {
      currentPostion += 1;
    }
    draw();
  }

  function moveRight() {
    unDraw();
    const isAtRightEdge = current.some(
      (index) => (currentPostion + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPostion += 1;

    if (
      current.some((index) =>
        squares[currentPostion + index].classList.contains("taken")
      )
    ) {
      currentPostion -= 1;
    }
    draw();
  }

  // rotate the tetromino
  function rotate() {
    unDraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // show up-next tetromino in mini-grid

  const displaySqures = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  // display the shape in the mini grid display

  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // add functionality to the button(start/pause)

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      // Make the tetromino move down every 0.5 sec.
      timerId = setInterval(moveDown, 500);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape;
    }
  });

  // adding score!

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // game over

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }
});
