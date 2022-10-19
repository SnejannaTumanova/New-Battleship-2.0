let view = {
  displayMessage: function (msg) {
    let messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayMiss: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
  displayHit: function (location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
};

let model = {
  boardSize: 7,
  numShips: 3,
  shipsLength: 3,
  shipsSunk: 0,
  ships: [
    { location: ["0", "0", "0"], hits: ["", "", ""] },
    { location: ["0", "0", "0"], hits: ["", "", ""] },
    { location: ["0", "0", "0"], hits: ["", "", ""] },
  ],
  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.location.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("ПОПАЛ!");
        if (this.isSunk(ship)) {
          view.displayMessage("Ты потопил мой линкор!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("К сожалению, это промах...");
    return false;
  },
  isSunk: function (ship) {
    for (let i = 0; i < this.shipsLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function () {
    let location;
    for (let i = 0; i < this.numShips; i++) {
      do {
        location = this.generateShip();
      } while (this.collision(location));
      this.ships[i].location = location;
    }
  },
  generateShip: function () {
    let direction = Math.floor(Math.random() * 2);
    let row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipsLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipsLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    let newShipLocations = [];
    for (let i = 0; i < this.shipsLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push(row + i + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function (location) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = model.ships[i];
      for (let j = 0; j < location.length; j++) {
        if (ship.location.indexOf(location[j]) >= 0) return true;
      }
    }
    return false;
  },
};

//model.fire("53");

//model.fire("06");
//model.fire("16");
//model.fire("26");

//model.fire("34");
//model.fire("24");
//model.fire("44");

//model.fire("12");
//model.fire("11");
//model.fire("10");

function parseGuess(guess) {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Упс, пожалуйста, введите одну букву и одну цифру на доске.");
  } else {
    firstChar = guess.charAt(0);
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Ой, наше поле явно других размеров, попробуй ещё раз.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Такой вариант даже не рассматриваем!");
    } else {
      return row + column;
    }
  }
  return null;
}

//console.log(parseGuess("A0"));
//console.log(parseGuess("B6"));
//console.log(parseGuess("G3"));
//console.log(parseGuess("H0"));
//console.log(parseGuess("A7"));

let controller = {
  guesses: 0,
  processGuess: function (guess) {
    let location = parseGuess(guess);

    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          `Ты потопил все мои линкоры с ${this.guesses} выстрелов!`
        );
      }
    }
  },
};

//controller.processGuess("A0");

//controller.processGuess("A6");
//controller.processGuess("B6");
//controller.processGuess("C6");

//controller.processGuess("C4");
//controller.processGuess("D4");
//controller.processGuess("E4");

//controller.processGuess("B0");
//controller.processGuess("B1");
//controller.processGuess("B2");

function init() {
  let fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  let guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}

function handleFireButton() {
  let guessInput = document.getElementById("guessInput");
  let firstguess = guessInput.value;
  let guess = firstguess.toUpperCase();
  controller.processGuess(guess);

  guessInput.value = "";
}

function handleKeyPress(e) {
  let fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;
