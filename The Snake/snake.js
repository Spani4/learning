class GameSnake {
  constructor(field) {
    this._field = field;
    this._easyMode = false;

    this._initGameMenu();
  }

  _initGameMenu() {

    let menu = document.createElement('div');
    menu.classList.add('game-menu', 'col');

    let header = document.createElement('h1');
    header.innerHTML = 'The Snake';

    let optionsWidth = document.createElement('div');
    let width = document.createElement('span');
    let inputWidth = document.createElement('input');
    let resultWidth = document.createElement('span');
    optionsWidth.classList.add('options', 'row');
    width.innerHTML = 'Width';
    this._adjustInput(inputWidth);
    resultWidth.innerHTML = inputWidth.value;
    optionsWidth.appendChild(width);
    optionsWidth.appendChild(inputWidth);
    optionsWidth.appendChild(resultWidth);

    let optionsHeight = document.createElement('div');
    let height = document.createElement('span');
    let inputHeight = document.createElement('input');
    let resultHeight = document.createElement('span');
    optionsHeight.classList.add('options', 'row');
    height.innerHTML = 'Height';
    this._adjustInput(inputHeight);
    resultHeight.innerHTML = inputHeight.value;
    optionsHeight.appendChild(height);
    optionsHeight.appendChild(inputHeight);
    optionsHeight.appendChild(resultHeight);

    let optionsEasyMode = document.createElement('div');
    let easyMode = document.createElement('span');
    let easyModeCheckbox = this._createCustomCheckbox();
    let resultEasyMode = document.createElement('span');
    optionsEasyMode.classList.add('options', 'row');
    easyMode.innerHTML = 'Easy mode';
    resultEasyMode.innerHTML = 'Off';
    optionsEasyMode.appendChild(easyMode);
    optionsEasyMode.appendChild(easyModeCheckbox);
    optionsEasyMode.appendChild(resultEasyMode);

    let playBtn = document.createElement('button');
    playBtn.innerHTML = 'Play';

    menu.appendChild(header);
    menu.appendChild(optionsWidth);
    menu.appendChild(optionsHeight);
    menu.appendChild(optionsEasyMode);
    menu.appendChild(playBtn);
    this.field.appendChild(menu);

    this._bindInputListener(inputWidth, resultWidth);
    this._bindInputListener(inputHeight, resultHeight);

    inputWidth.onchange = () => {
      resultWidth.innerHTML = inputWidth.value;
    };
    inputHeight.onchange = () => {
      resultHeight.innerHTML = inputHeight.value;
    };

    let input = easyModeCheckbox.querySelector('input');
    input.onchange = () => {
      if ( input.checked ) {
        resultEasyMode.innerHTML = 'On';
        this._easyMode = true;
      } else {
        resultEasyMode.innerHTML = 'Off';
        this._easyMode = false;
      }
    };

    playBtn.addEventListener('click', () => {
      this._initGame(this.field, menu, resultWidth.innerHTML * 1, resultHeight.innerHTML * 1);
    });

  }
  _initGame(field, menu, fieldWidth, fieldHeight) {

    let cellSize = this._calculateCellSize(menu, fieldWidth, fieldWidth);
    field.removeChild(menu);

    let gameField = document.createElement('div');
    gameField.classList.add('game-field');
    field.appendChild(gameField);

    this._gameField = gameField;
    this._scoreIndicator = this._createScoreTab(gameField);

    let cells = new Cells(this, fieldWidth - 1, fieldHeight - 1);
    this._fillField(gameField, fieldWidth, fieldHeight, cellSize, cells);
    cells.setNeighbors();

    let snake = this._createSnake(fieldHeight, cells);

    this._bindArrowHandler(snake);

  }
  _createGameOverWindow() {
    let w = this._gameField.offsetWidth;
    let h = this._gameField.offsetHeight;

    let gameOverModal = document.createElement('div');
    gameOverModal.classList.add('game-over', 'col');
    gameOverModal.style.width = 0.9 * w + 'px';
    gameOverModal.style.height = 0.9 * h + 'px';
    gameOverModal.style.left = 0.05 * w + 'px';
    gameOverModal.style.top = 0.05 * h + 'px';

    let loser = document.createElement('p');
    loser.innerHTML = 'Game Over';

    let score = document.createElement('p');
    score.innerHTML = 'Score: ' + this._scoreIndicator.innerHTML;

    let menuBtn = document.createElement('button');
    menuBtn.innerHTML = 'Menu';

    menuBtn.addEventListener('click', () => {
      this.field.innerHTML = '';
      this._initGameMenu();
    });

    gameOverModal.appendChild(loser);
    gameOverModal.appendChild(score);
    gameOverModal.appendChild(menuBtn);

    this._gameField.appendChild(gameOverModal);

  }
  _createScoreTab(gameField) {
    let scoreTab = document.createElement('div');
    let span = document.createElement('span');
    let score = document.createElement('span');

    span.innerHTML = 'Score: ';
    score.innerHTML = 0;

    scoreTab.appendChild(span);
    scoreTab.appendChild(score);

    score.classList.add('indicator');
    scoreTab.classList.add('score');
    gameField.appendChild(scoreTab);

    return score;
  }
  _bindArrowHandler(snake) {

    document.addEventListener('keydown', this._arrowHandler = (e) => {

      let key = e.keyCode;

      if ( key == 38 || key == 39 || key == 40 || key == 37) {

        e.preventDefault();

        switch ( key ) {
          case 38: if ( snake.direction != 'down' ) snake.direction = 'up';
            break;
          case 39: if ( snake.direction != 'left' ) snake.direction = 'right';
            break;
          case 40: if ( snake.direction != 'up' ) snake.direction = 'down';
            break;
          case 37: if ( snake.direction != 'right' ) snake.direction = 'left';
            break;
        }
      }
    });
  }
  _createSnake(fieldHeight, cells) {
    let halfHeight = parseInt(fieldHeight / 2);
    let [ head, tail ] = [
      cells.getCellByCoords([ halfHeight, 1]),
      cells.getCellByCoords([ halfHeight, 0]),
    ];

    return new Snake(this, head, tail, cells);
  }
  _fillField(gameField, fieldWidth, fieldHeight, cellSize, cells) {

    for ( let i = 0; i < fieldHeight; i++ ) {
      let row = document.createElement('div');
      row.classList.add('row');
      gameField.appendChild(row);

      for ( let j = 0; j < fieldWidth; j++ ) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.minWidth = cellSize + 'px';
        cell.style.minHeight = cellSize + 'px';
        row.appendChild(cell);

        cells.addCell( new Cell(cell, [i, j]) );
      }
    }
  }
  _calculateCellSize(menu, w, h) {

    return  parseInt( menu.offsetWidth / Math.max(w, h) );
  }
  _adjustInput(input) {
    input.type = 'range';
    input.min = 20;
    input.max = 40;
    input.step = 5;
    input.value = 20;
  }
  _createCustomCheckbox() {
    let label = document.createElement('label');
    let checkbox = document.createElement('div');
    let input = document.createElement('input');
    let switcher = document.createElement('div');

    input.setAttribute('type', 'checkbox');
    input.checked = false;

    label.classList.add('custom-checkbox');
    checkbox.classList.add('checkbox');
    switcher.classList.add('switcher');

    checkbox.appendChild(input);
    checkbox.appendChild(switcher)
    label.appendChild(checkbox);

    return label;
  }
  _bindInputListener(input, result) {
    input.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', listenInput);
    });
    input.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', listenInput);
    });

    function listenInput() {
      result.innerHTML = input.value;
    }
  }

  refreshScore(score) {
    this._scoreIndicator.innerHTML = score;
    this._scoreIndicator.style.opacity = '0.8';

    setTimeout( () => {
      this._scoreIndicator.style.opacity = '0.2';
    }, 700);
  }
  gameOver() {

    document.removeEventListener('keydown', this._arrowHandler);
    setTimeout( () => this._createGameOverWindow(), 1000);
  }

  get field() {
    return this._field;
  }
  get easyMode() {
    return this._easyMode;
  }
}

class Cells {
  constructor(game, maxRow, maxCol) {
    this._cells = [];
    this._game = game;
    this._maxRow = maxRow;
    this._maxCol = maxCol;
  }

  setNeighbors() {

    this.cells.forEach( cell => {
      let row = cell.coords[0];
      let col = cell.coords[1];
      let upperNeighbor = this.getCellByCoords([ row - 1, col ]) || null;
      let rightNeighbor =  this.getCellByCoords([ row, col + 1 ]) || null;
      let lowerNeighbor =  this.getCellByCoords([ row + 1, col ]) || null;
      let leftNeighbor =  this.getCellByCoords([ row , col - 1 ]) || null;

      cell.neighbors = {
        up: upperNeighbor,
        right: rightNeighbor,
        down: lowerNeighbor,
        left: leftNeighbor,
      };
    });
  }

  addCell(cell) {
    this._cells.push(cell);
  }

  getCellByCoords(coords) {
    return this.cells.find( cell => {
      return cell.coords.join('-') == coords.join('-');
    });
  }

  getRandomEmptyCell() {
    let emptyCells = this.cells.filter( (cell) => {
      return cell.isEmpty;
    });

    if ( this._game.easyMode ) {
      emptyCells = emptyCells.filter( (cell) => {

        return cell.coords[0] != 0 && cell.coords[1] != 0 &&
          cell.coords[0] != this._maxRow && cell.coords[1] != this._maxCol;
      });
    }

    let i = Math.floor( Math.random() * emptyCells.length );

    return emptyCells[i];
  }

  get cells() {
    return this._cells;
  }

}

class Cell {
  constructor(elem, [row, col]) {
    this._elem = elem;
    this._coords = [row, col];
    this._neighbors = {};
  }

  enterCell() {
    this._elem.classList.add('snake', 'occupied');
  }
  leaveCell() {
    this._elem.classList.remove('snake', 'occupied');
  }
  throwMouse() {
    this._elem.classList.add('mouse', 'occupied');
  }
  eatMouse() {
    this._elem.classList.remove('mouse');
    this._elem.style.transform = 'scale(1.2)';
    setTimeout( () => { this._elem.style.transform = '' }, 200)
  }
  hit() {
    this._elem.classList.add('hit');
  }


  get coords() {
    return this._coords;
  }
  get neighbors() {
    return this._neighbors;
  }
  get isEmpty() {
    return (!this._elem.classList.contains('occupied'));
  }
  get isSnake() {
    return this._elem.classList.contains('snake');
  }
  get containsMouse() {
    return this._elem.classList.contains('mouse');
  }
  set neighbors(obj) {
    this._neighbors = obj;
  }
}

class Snake {
  constructor(game, head, tail, cells) {
    this._game = game;
    this._cells = cells;
    this._snakeBodyCells = [ head, tail ];
    this._interval = 250;
    this._direction = '';
    this._timer = null;
    this._coolDown = false;

    this._init([ head, tail ])
  }

  _init(snakeBodyCells) {
    snakeBodyCells.forEach( cell => {
      cell.enterCell();
    });

    this._timer = setInterval( () => {
      this.move()
    }, this.interval);

    this.feed();
  }

  move(){

    this._coolDown = false;

    if ( this.direction && this.head.neighbors[this.direction] ) {

      if ( this.head.neighbors[this.direction].isSnake ) {
        this.head.hit();
        this.stopMove();
        this.game.gameOver();
        return;
      }

      this.snakeBodyCells.unshift(this.head.neighbors[this.direction]);
      this.head.enterCell();

      if ( this.head.containsMouse ) {
        this.eat();
      } else {
        let oldTail = this.snakeBodyCells.pop();
        oldTail.leaveCell();
      }

    } else if ( this.direction ) {
      this.head.hit();
      this.stopMove()
      this.game.gameOver();
      return;
    }


  }
  eat() {
    this.head.eatMouse();
    this.game.refreshScore( this._snakeBodyCells.length - 2 );
    this.increaseSpeed();
    this.feed();
  }
  feed() {
    let cell = this._cells.getRandomEmptyCell();
    cell.throwMouse();
  }
  stopMove() {
    clearInterval(this._timer);
  }
  increaseSpeed() {
    this._interval = Math.floor(this._interval * 0.96);

    clearInterval(this._timer);
    this._timer = setInterval( () => {
      this.move();
    }, this.interval);
  }

  get snakeBodyCells() {
    return this._snakeBodyCells;
  }
  get cells() {
    return this._cells;
  }
  get head() {
    return this._snakeBodyCells[0];
  }
  get tail() {
    return this._cells[this._cells.length - 1];
  }
  get interval() {

    return this._interval;
  }
  get game() {
    return this._game;
  }
  get direction() {
    return this._direction;
  }
  set direction(direction) {
    if ( !this._coolDown ) {
      this._direction = direction;
      this._coolDown = true;
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  let game = new GameSnake(document.getElementById('snake-game'));
});
