"use strict"

class Game2048menu {
  constructor(field) {
    this._field = field;
    this._sizes = [4, 5, 6, 7];
    this._selectedSize = 1;

    this.init();
  }

  init() {

    let field = this.field;
    let menu = document.createElement('div');
    menu.classList.add('menu');

    field.innerHTML = '';
    field.appendChild(menu);

    let startBtn = document.createElement('div');
    startBtn.classList.add('start-button');
    startBtn.innerHTML = 'Start game';
    menu.appendChild(startBtn);

    let options = document.createElement('div');
    options.classList.add('options');
    let prev = document.createElement('span');
    let size = document.createElement('span');
    let next = document.createElement('span');
    prev.innerHTML = '&larr;';
    this.showSize(size);
    next.innerHTML = '&rarr;';
    options.appendChild(prev);
    options.appendChild(size);
    options.appendChild(next);
    menu.appendChild(options);

    field.onselectstart = (e) => false;

    prev.addEventListener('click', () => {
      if ( this.selectedSize > 0 ) {
        this.selectedSize--;
        this.showSize(size);
      }
    });

    next.addEventListener('click', () => {
      if ( this.selectedSize < this.sizes.length - 1) {
        this.selectedSize++;
        this.showSize(size);
      }
    });

    startBtn.addEventListener('click', () => {
      field.innerHTML = '';
      new Game2048(this, field, this.size);
    });

  }

  showSize(elem) {
    elem.innerHTML =  this.sizes[this.selectedSize] + ' &times; ' + this.sizes[this.selectedSize];
  }

  get sizes() {
    return this._sizes;
  }

  get size() {
    return this.sizes[this.selectedSize];
  }

  get selectedSize() {
    return this._selectedSize;
  }
  set selectedSize(n) {
    this._selectedSize = n;
  }

  get field() {
    return this._field;
  }
}

class Game2048 {
  constructor(gameMenu, field, size) {
    this._gameMenu = gameMenu;
    this._field = field;
    this._size = size;
    this._cellSize = Math.floor( field.clientWidth / size );
    this._cells = [];
    this._cellRows = [];
    this._cellCols = [];
    this._isCoolDown = false;
    this._gameOver = false;

    this._init(field, size);
  }

  _init(field, size) {

    let gameField = document.createElement('div');
    gameField.classList.add('game-field');
    field.appendChild(gameField);

    this.createGrid(size, gameField);

    this.addBox();

    document.addEventListener('keydown', (e) => {

      if ( this.isCoolDown ) return;
      if ( this.gameOver ) return;

      this.isCoolDown = true;

      let key = e.keyCode;

      if ( key >= 37 && key <= 40 ) {
        e.preventDefault();
        this.handleArrowPress(key);
      }

      setTimeout( () => {

        gameField.querySelectorAll('.fake-box').forEach( fakeBox => {
          fakeBox.parentElement.removeChild(fakeBox);
        } );

        this.isCoolDown = false;
      }, 400 );

    });

    document.addEventListener('keyup', (e) => {
      this.revealHidden();
    });

    gameField.addEventListener('slideend', (e) => {
      this.revealHidden();
    });
  }

  handleArrowPress(key) {

    let lines;

    switch ( key ) {
      case 38:
        lines = this.cellCols;
        break;
      case 39:
        lines = this.cellRows.map( line => {
          return this.getReversedLine(line);
        });
        break;
      case 40:
        lines = this.cellCols.map( line => {
          return this.getReversedLine(line);
        });
        break;
      case 37:
        lines = this.cellRows
    }

    let isMoved = false;
    let isCollapsed = false;

    isMoved = this.shift(lines);

    setTimeout( () => {
      isCollapsed = this.collapse(lines, isCollapsed);
    }, 100 );

    setTimeout( () => {
      this.checkWinner();
      if ( isMoved || isCollapsed ) this.addBox();

      setTimeout( () => this.checkLoser(), 300);
    }, 200 );

  }

  collapse(lines, isCollapsed) {

    for ( let i = 0; i < lines.length; i++ ) {
      isCollapsed = this.collapseLine( lines[i], isCollapsed );
    }

    return isCollapsed;
  }
  collapseLine(line, isCollapsed) {

    for ( let i = 0; line[i+1] && line[i+1].firstChild && line[i].firstChild; i++ ) {
      let num1 = line[i].firstChild.innerHTML;
      let num2 = line[i+1].firstChild.innerHTML;

      if ( num1 == num2 ) {
        line[i].firstChild.innerHTML = num1 * 2;
        isCollapsed = true;

        this.animateCollapsing(line[i].firstChild, line[i+1].firstChild, line);

        i++;
      }
    }

    return isCollapsed;
  }
  animateCollapsing(growingBox, collapsingBox, line) {
    collapsingBox.style.transform = 'scale(0.1)';
    collapsingBox.addEventListener('transitionend', () => {
      collapsingBox.parentElement.removeChild(collapsingBox);
      this.revealHidden();
      this.shiftLine(line);
    });

    growingBox.style.transform = 'scale(1.1)';

    setTimeout(() => {
      growingBox.style.transform = '';
    }, 100);

    this.setBoxColor(growingBox);
  }
  setBoxColor(box) {
    let i = box.innerHTML * 1;
    let color = '';

    switch ( i ) {

      case 2:
      case 4: color = '#ffe6cc';
        break;
      case 8: color = '#ffdab3';
        break;
      case 16: color = '#ffce99';
        break;
      case 32: color = '#ffc180';
        break;
      case 64: color = '#ffb566';
        break;
      case 128: color = '#ffa94d';
        break;
      case 256: color = '#ff9c33';
        break;
      case 512: color = '#ff901a';
        break;
      case 1024: color = '#ff8400'
        break;
      case 2048: color = '#e67700'
    }

    box.style.backgroundColor = color;
  }

  shift(lines) {

    let isMoved = false;

    for ( let i = 0; i < lines.length; i++ ) {
      isMoved = this.shiftLine( lines[i], isMoved );
    }

    return isMoved;
  }
  shiftLine(line, isMoved) {

    let stuffed = 0;

    for ( let i = 0; i < line.length; i++ ) {

      let box = line[i].firstChild;

      if ( box ) {

        if ( !line[stuffed].firstChild ) {
          isMoved = true;
          this.animateShifting( box, line[i], line[stuffed] );
        }

        stuffed++;
      }
    }

    return isMoved;
  }
  animateShifting(box, cellFrom, cellTo){

    let [ left, top, width, height ] = [ box.offsetLeft, box.offsetTop, box.offsetWidth, box.offsetHeight ];
    let fakeBox = box.cloneNode(true);
    [ fakeBox.style.left, fakeBox.style.top, fakeBox.style.width, fakeBox.style.height ] =
      [ left + 'px', top + 'px', width + 'px', height + 'px'];

    let slideend = new CustomEvent('slideend', {
      bubbles: true,
    });

    fakeBox.addEventListener('transitionend', () => {
      fakeBox.dispatchEvent(slideend);
    });

    box.classList.add('hidden');
    cellTo.appendChild( box );
    fakeBox.classList.add('fake-box');
    this.gameField.appendChild(fakeBox);

    let shiftX = fakeBox.offsetLeft - box.offsetLeft;
    let shiftY = fakeBox.offsetTop - box.offsetTop;

    if ( shiftX != 0 ) {
      fakeBox.style.transform = 'translateX(' + -shiftX + 'px)';
    }
    if ( shiftY != 0 ) {
      fakeBox.style.transform = 'translateY(' + -shiftY + 'px)';
    }
  }

  revealHidden() {
    setTimeout( () => {
      this.gameField.querySelectorAll('.box:not(.fake-box)').forEach( box => {
        box.classList.remove('hidden');
      });
    }, 10 );
  }

  getReversedLine(line) {
    let newLine = [];

    for ( let i = 0; i < line.length; i++ ) {
      newLine.push( line[line.length - 1 - i] );
    }

    return newLine;
  }

  createGrid(size, gameField) {

    for ( let i = 0; i < size; i++ ) {
      this.createRow(size, gameField, this.cellSize);
    }
  }
  createRow(size, gameField, cellSize) {

    let row = document.createElement('div');
    row.classList.add('row');
    gameField.appendChild(row);

    for ( let j = 0; j < size; j++ ) {
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.width = cellSize + 'px';
      cell.style.height = cellSize + 'px';
      row.appendChild(cell);
      this.cells.push(cell);

      if ( !this.cellCols[j] ) this.cellCols.push([]);
      this.cellCols[j].push( cell );

    }

    this.cellRows.push( Array.from( row.children ) );
  }

  addBox() {

    let cell = this.getRandomEmptyCell();
    if ( cell ) {
      new Box( this, cell );
    }
  }
  getRandomEmptyCell() {

    let i = Math.floor( Math.random() * this.emptyCells.length );

    return this.emptyCells[i];
  }

  checkWinner() {
    let isWinner = this.boxes.some( box => {
      return box.innerHTML == '2048';
    });

    if ( isWinner ) {
      this.proclaim('WINNER');
      this.finishGame();
    }
  }
  checkLoser() {
    let isLoser = !this.getRandomEmptyCell();
    if ( isLoser ) {
      this.proclaim('LOSER');
      this.finishGame();
    }
  }

  proclaim(str) {

    let modal = document.createElement('div');
    let message = document.createElement('div');
    let menuBtn = document.createElement('span');

    modal.classList.add('proclaimation');
    message.classList.add('message');
    menuBtn.classList.add('go-to-menu');

    message.innerHTML = 'WE HAVE A ' + str + '!'
    menuBtn.innerHTML = 'Menu'

    modal.appendChild(message);
    modal.appendChild(menuBtn);

    menuBtn.addEventListener('click', () => {
      gameMenu.init();
    });

    setTimeout( () => {
      this.gameField.appendChild(modal);
    }, 200);

  }
  finishGame() {
    this._gameOver = true;
  }

  get gameMenu() {
    return this._gameMenu;
  }
  get field() {
    return this._field;
  }
  get gameField() {
    return this.field.querySelector('.game-field');
  }
  get size() {
    return this._size;
  }
  get cellSize() {
    return Math.floor( this.field.clientWidth / this.size );
  }
  get cells() {
    return this._cells;
  }
  get boxes() {
    return [...this.gameField.querySelectorAll('.box:not(.fake-box)')];
  }
  get emptyCells() {

    return this.cells.filter(cell => {
      return !cell.firstChild;
    });
  }
  get cellRows() {
    return this._cellRows;
  }
  get cellCols() {
    return this._cellCols;
  }

  get isCoolDown() {
    return this._isCoolDown;
  }
  set isCoolDown(isCoolDown) {
    this._isCoolDown = isCoolDown;
  }

  get gameOver() {
    return this._gameOver;
  }

}

class Box {
  constructor(game, cell) {
    this._elem = document.createElement('div');

    this._init(game, this.elem, cell)
  }

  _init(game, box, cell) {

    box.style.transform = 'scale(0.1)';
    setTimeout(() => box.style.transform = '', 0);

    box.classList.add('box');
    cell.appendChild(box);
    box.innerHTML = Math.ceil( Math.random() * 100 / 50 ) * 2;

    game.setBoxColor(box)
  }

  get elem() {
    return this._elem;
  }
}

let gameMenu = new Game2048menu(document.getElementById('game-2048'));
