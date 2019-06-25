class Tetris {
  constructor(field) {
    this._field = field;
    this._pit = new Pit;
    this._pitWidth = 10;
    this._pitHeight = 20;
    this._speed = 700;

    this._activeFigure = null;
    this._nextFigure = Math.floor( Math.random() * 7 );
    this._isRun = false;
    this._insaneMode = false;
    this._isPaused = false;
    this._isHelping = false;

    this._score = 0;
    this._lines = 0;
    this._scoreIndicator = null;
    this._linesIndicator = null;
    this._startBtn = null;
    this._nextFigureIndicator = null;
    this._nextFigureIndicatorCells = [];
    this._pitElem = null;
    this._gameOverElem = null;
    this._insaneModeInput = null;
    this._pauseElem = null;
    this._helpBtnElem = null;
    this._helpElem = null;

    this._init(field);
  }

  _init(field) {

    this._fillField(field);

    this._fillPit(this._pitElem);

    this._startBtn.addEventListener('click', () => {
      this.startGame();
    });

    this._insaneModeInput.addEventListener('change', () => {
      this._insaneMode = this._insaneModeInput.checked;
    });

    this._helpBtnElem.addEventListener('click', () => {
      this._toggleHelp();
    });

    document.addEventListener('keydown', (e) => {
      // console.log(e.keyCode);
      if ( this._isRun ) {
        this._handleKeyDown(e.keyCode);
      }
    });
  }

  _fillField(field) {
    this._pitElem = this._addElem(field, 'div', 'pit');
    let dashboard = this._addElem(field, 'div', 'dashboard');

    let scorePanel = this._addElem(dashboard, 'div', 'score-panel');

    this._addElem(scorePanel, 'h1', false, 'Score:' )
    this._scoreIndicator = this._addElem(scorePanel, 'p', 'score', '0');
    this._addElem(scorePanel, 'h1', false, 'Lines:' )
    this._linesIndicator = this._addElem(scorePanel, 'p', 'lines', '0');

    let controls = this._addElem(scorePanel, 'div', 'controls');
    this._startBtn = this._addElem(controls, 'button', false, 'Start Game');
    let insaneModeLabel = this._addElem(controls, 'label', 'insane-mode');
    this._insaneModeInput = this._addElem(insaneModeLabel, 'input');
    this._insaneModeInput.type = 'checkbox';
    let insaneModeIndicator = this._addElem(insaneModeLabel, 'div', 'insane-mode-indicator');
    let insaneModeText = this._addElem(insaneModeLabel, 'div', 'insane-mode-text', ' Insane Mode');
    this._helpBtnElem = this._addElem(controls, 'button', 'help-button', 'Help');

    let nextFigurePanel = this._addElem(dashboard, 'div', 'next-figure-panel');
    this._addElem(nextFigurePanel, 'h1', false, 'Next:' )
    this._nextFigureIndicator = this._addElem(nextFigurePanel, 'div', 'next-figure-indicator');

    this._buildNextFigureIndicator();

    this._gameOverElem = this._addElem(this._pitElem, 'div', 'modal-game-over', 'Game <br/> Over')
    this._gameOverElem.classList.add('hidden');

    this._pauseElem = this._addElem(this._pitElem, 'div', 'modal-pause', 'Paused');
    this._pauseElem.classList.add('hidden');

    this._helpElem = this._addElem(this._pitElem, 'div', 'modal-help', 'Help');
    this._helpElem.appendChild(this._buildHelpTable());
    this._helpElem.classList.add('hidden');

  }

  _fillPit() {

    for ( let i = 0; i < this._pitHeight; i++ ) {

      let row = this._addElem(this._pitElem, 'div', 'row');

      for ( let j = 0; j < this._pitWidth; j++ ) {
        let cell = this._addElem(row, 'div', 'cell');

        this._pit.addCell(new Cell(cell, i, j));
      }
    }

    this._pit.setNeighbors();
  }
  _buildNextFigureIndicator() {
    for ( let i = 0; i < 2; i++ ) {
      let row = document.createElement('div');
      row.classList.add('row');
      this._nextFigureIndicator.appendChild(row)

      for ( let j = 0; j < 4; j++ ) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        this._nextFigureIndicatorCells.push(cell);
        row.appendChild(cell);
      }
    }
  }
  _buildHelpTable() {

    let controls = {
      actions: ['Move Left', 'Move Right', 'Move Down', 'Rotate', 'Quick Drop', 'Pause', 'Help'],
      keys: ['&larr;', '&rarr;', '&darr;', '&uarr;', 'Space', 'P/Pause', 'H'],
    };

    let table = this._addElem(this._helpElem, 'table');

    for ( let i = 0; i < controls.actions.length; i++ ) {
      let tr = this._addElem(table, 'tr');
      let td = this._addElem(tr, 'td', false, controls.actions[i]);
      td = this._addElem(tr, 'td', false, '-');
      td = this._addElem(tr, 'td', false, controls.keys[i]);
    }

    return table;

  }
  _addElem(parent, tagName, className, content = '') {
    let elem = document.createElement(tagName);
    if ( className ) elem.classList.add(className);
    elem.innerHTML = content;
    parent.appendChild(elem);

    return elem;
  }

  _handleKeyDown(key) {

    if ( !this._activeFigure ) return;

    if ( !this._isPaused ) {
      if ( key == 37 || key == 39 || key == 40 ) {
        let direction = '';
        switch ( key ) {
          case 37: direction = 'left';
            break;
          case 39: direction = 'right';
            break;
          case 40: direction = 'down';
        }
        this._activeFigure.move(direction);
        return;
      }
      if ( key == 38 ) {
        this._activeFigure.rotate();
      }
      if ( key == 32 ) {

        this._activeFigure.quickDrop();
      }
    }

    if ( key == 19 || key == 80) {
      if ( this._isPaused ) {
        this._continueGame();
      } else {
        this._pauseGame();
      }
    }

    if ( key == 72 ) {
      this._toggleHelp();
    }
  }
  _increaseSpeed() {
    this._speed = this._speed - 10;
  }
  _launchNewFigure() {

    // let num = Math.floor( Math.random() * 7 );
    switch ( this._nextFigure ) {
      case 0: this._activeFigure = new Square(this, this.pit);
        break;
      case 1: this._activeFigure = new Stick(this, this.pit);
        break;
      case 2: this._activeFigure = new Lfigure(this, this.pit);
        break;
      case 3: this._activeFigure = new Lmirror(this, this.pit);
        break;
      case 4: this._activeFigure = new Tfigure(this, this.pit);
        break;
      case 5: this._activeFigure = new Step(this, this.pit);
        break;
      case 6: this._activeFigure = new StepMirror(this, this.pit);
    }

    this._setNextFigure();
  }

  _setNextFigure() {
    this._nextFigure =  Math.floor( Math.random() * 7 );
    this._showNextFigure();
  }
  _showNextFigure() {

    let cells = this._nextFigureIndicatorCells;
    cells.forEach( cell => {
      cell.classList.remove('figure-cell');
    });
    let arr = [];

    switch ( this._nextFigure ) {
      case 0: arr.push( cells[1], cells[2], cells[5], cells[6] );
        break;
      case 1: arr.push( cells[0], cells[1], cells[2], cells[3] );
        break;
      case 2: arr.push( cells[0], cells[1], cells[2], cells[4] );
        break;
      case 3: arr.push( cells[0], cells[1], cells[2], cells[6] );
        break;
      case 4: arr.push( cells[1], cells[4], cells[5], cells[6] );
        break;
      case 5: arr.push( cells[1], cells[2], cells[4], cells[5] );
        break;
      case 6: arr.push( cells[0], cells[1], cells[5], cells[6] );
        break;
    }

    arr.forEach( (cell) => {
      cell.classList.add('figure-cell');
    });
  }

  handleLanding(figure) {

    this._activeFigure = null;

    let rowsForCheck = new Set( figure.cells.map( cell => {
      return this._pit.rows[cell.row]
    }) );

    let completedRows = this._checkRows(rowsForCheck);

    if ( completedRows.length ) {
      completedRows.sort( (a, b) => {
        return a[0].row - b[0].row;
      });

      this._clearNdrop(completedRows);
      this._calculateScore(completedRows.length);
      this._increaseSpeed();

    } else {
      this._launchNewFigure();
    }
  }
  _checkRows(rows) {

    let completedRows = [];

    for ( let row of rows ) {
      if ( this._checkRow(row) ) {
        completedRows.push(row);
      }
    }

    return completedRows;
  }
  _checkRow(row) {
    let isLineCompleted = row.every( cell => {
      return cell.isGround();
    });
    if ( isLineCompleted ) return true;
  }
  _clearNdrop(completedRows) {

    let clearNdropPromise = new Promise(resolve => {
      setTimeout( () => {
        resolve();
      }, 300 );
    });

    clearNdropPromise
      .then( () => {
        this._pit.clearRows(completedRows);

        return new Promise(resolve => {
          setTimeout( () => {
            resolve();
          }, 300 );
        })
      })

      .then( () => {
        this._pit.dropHangingRows(completedRows);
        this._launchNewFigure();
      });

    // setTimeout( () => { this._pit.clearRows(completedRows) }, 300 );
    // setTimeout( () => { this._pit.dropHangingRows(completedRows) }, 600 );
    // setTimeout( () => { this._launchNewFigure() }, 900 );
  }

  _calculateScore(lines) {
    this._lines += lines;

    switch (lines) {
      case 1: this._score += 10;
      break;
      case 2: this._score += 25;
      break;
      case 3: this._score += 40;
      break;
      case 4: this._score += 60;
    }
    this._refreshScore();
  }
  _refreshScore() {
    this._scoreIndicator.innerHTML = this._score;
    this._linesIndicator.innerHTML = this._lines;
  }

  _showGameOver() {
    this._gameOverElem.classList.remove('hidden');
    setTimeout( () => {
      this._gameOverElem.style.transform = 'scaleY(1)';
    }, 50);
  }
  _hideGameOver() {
    this._gameOverElem.style.transform = 'scaleY(0)';
    this._gameOverElem.classList.add('hidden');
  }

  _toggleHelp() {
    if ( this._isHelping ) {
      this._isHelping = false;
      this._helpElem.classList.add('hidden');
    } else {
      this._isHelping = true;
      this._helpElem.classList.remove('hidden');
    }
  }

  _pauseGame() {
    this._activeFigure.pause();
    this._isPaused = true;
    this._pauseElem.classList.remove('hidden');
  }
  _continueGame() {
    this._activeFigure.continue();
    this._isPaused = false;
    this._pauseElem.classList.add('hidden');
  }

  startGame() {
    this._hideGameOver();
    this._pit.totalClear();
    this._isRun = true;
    this._startBtn.disabled = true;
    this._insaneModeInput.disabled = true;
    this._score = 0;
    this._lines = 0;
    this._refreshScore();
    this._launchNewFigure();
  }
  endGame() {
    this._isRun = false;
    this._startBtn.disabled = false;
    this._insaneModeInput.disabled = false;
    this._showGameOver();
  }

  get field() {
    return this._field;
  }
  get pit() {
    return this._pit;
  }
  get speed() {
    return this._speed;
  }
  get insaneMode() {
    return this._insaneMode;
  }

}

class Pit {
  constructor() {
    this._cells = [];
    this._rows = [];
  }

  addCell(cell) {

    this._cells.push(cell);

    if ( !this._rows[cell.row] ) this._rows[cell.row] = [];

    this._rows[cell.row].push(cell);
  }

  getCellByCoords(coords) {
    return this.cells.find(cell => {
      return ( cell.row == coords[0] && cell.col == coords[1] );
    });
  }

  setNeighbors() {
    for ( let cell of this._cells ) {
      let [row, col] = cell.coords;
      cell.neighbors = {
        up: this.getCellByCoords([row - 1, col]) || null,
        right: this.getCellByCoords([row, col + 1]) ||null,
        down: this.getCellByCoords([row + 1, col]) ||null,
        left: this.getCellByCoords([row, col - 1]) ||null
      };
    }
  }

  totalClear() {
    this._cells.forEach( cell => {
      cell.clear();
      cell.release();
    });
  }

  clearRows(rows) {
    this._setTransition(rows);
    for ( let row of rows ) {
      for ( let cell of row ) {
        cell.clear();
      }
    }
  }
  _setTransition(rows) {
    rows.forEach( (row) => {
      row.forEach( (cell) => {
        cell.setTransition();
      });
    });
  }

  dropHangingRows(completedRows) {

    completedRows.reverse();

    let rowsToDrop = this._rows.filter( row => {
      let someIsGround = row.some(cell => {return cell.isGround()});
      return (row[0].row < completedRows[0][0].row) && someIsGround;
    });

    rowsToDrop.reverse().forEach( (row) => {
      this._dropRow(row);
    });
  }
  _dropRow(row) {

    let rowInd = this._rows.indexOf(row);
    let lowerRow = this._rows[rowInd + 1];

    if ( lowerRow && isClearedRow(lowerRow) ) {
      row.forEach( (cell, i) => {
        if ( cell.isGround() ) {
          cell.clear();
          this._rows[rowInd + 1][i].becomeGround();
        }
      });

      this._dropRow(lowerRow);
    } else {
      return;
    }

    function isClearedRow(row) {
      return row.every( cell => {
        return !cell.isGround();
      });
    }
  }

  get cells() {
    return this._cells;
  }
  get rows() {
    return this._rows;
  }
  get width() {
    return this._rows[0].length;
  }
  get height() {
    return this._rows.length;
  }
}

class Cell {
  constructor(elem, row, col) {
    this._elem = elem;
    this._row = row;
    this._col = col;
    this._neighbors = {
      up: null,
      right: null,
      down: null,
      left: null
    }
  }

  occupy() {
    this._elem.classList.add('figure-cell');
  }
  release() {
    this._elem.classList.remove('figure-cell');
  }
  clear() {
    this._elem.classList.remove('ground');
  }
  becomeGround() {
    this._elem.classList.remove('figure-cell');
    this._elem.classList.add('ground');
  }
  isGround() {
    return this._elem.classList.contains('ground');
  }
  setTransition() {
    let self = this;
    this._elem.classList.add('transition');
    this._elem.addEventListener('transitionend', function removeTransition() {
      self._elem.classList.remove('transition');
      this.removeEventListener('transitionend', removeTransition);
    });
  }

  get col() {
    return this._col;
  }
  get row() {
    return this._row;
  }
  get coords() {
    return [ this._row, this._col ];
  }
  get neighbors() {
    return this._neighbors;
  }

  set neighbors(obj) {
    this._neighbors = obj;
  }
}

class Figure {
  constructor(game, pit) {
    this._game = game;
    this._cells = [];
    this._pit = pit;
    this._axis = null;
    this._initialCell = pit.getCellByCoords([0, 4]);
    this._positionIndex = 0;
    this._timer = null;

    this._init();
  }

  _init() {
    this.cells = this._computeCells();

    if ( this.renderFigure() ) {
      this._timer = setInterval( () => {
        this.move('down');
      }, this._game.speed );
    }
  }

  _land() {
    for ( let cell of this.cells ) {
      cell.becomeGround();
    }
    clearInterval(this._timer);

    this._game.handleLanding(this);
  }

  _computeNewPosition() {

    return this._cells; //no rotation
  }

  _insaneModeComputeNewPosition() {

    let random =  Math.floor( Math.random() * 28 );
    let axis = this.axis;

    switch ( random ) {
      // stick
      case 0:
      case 1: return [
        this._pit.getCellByCoords([ axis.row + 2, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      ];
      case 2:
      case 3: return [
          this._pit.getCellByCoords([ axis.row, axis.col - 2 ]),
          this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
          this._pit.getCellByCoords([ axis.row, axis.col ]),
          this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
      // square
      case 4:
      case 5:
      case 6:
      case 7: return [
          this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
          this._pit.getCellByCoords([ axis.row, axis.col ]),
          this._pit.getCellByCoords([ axis.row + 1, axis.col - 1 ]),
          this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];
      // L Figure
      case 8: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1 , axis.col ]),
      ];

      case 9: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];

      case 10: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 11: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
      // L mirror
      case 12: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 13: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];

      case 14: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col - 1]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      ];

      case 15: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];
      // T Figure()
      case 16: return [
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      ];

      case 17: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];

      case 18: return [
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 19: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
      // step
      case 20:
      case 21: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 22:
      case 23: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];
      // step mirror
      case 24:
      case 25: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 26:
      case 27: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
    }

  }

  _computeCells() {
    return;
  }

  _adjustPosition() {
    if ( this.axis.col < 2 && this.axis.row > 0 ) {
      this.move('right');
      this.rotate();
      return;
    }
    if ( this.axis.col > (this._pit.width - 2) && this.axis.row > 0 ) {
      this.move('left');
      this.rotate();
      return;
    }
    if ( this.axis.row == 0 ) {
      this.move('down');
      this.rotate();
      return;
    }
  }

  _increasePositionIndex() {
    if ( this._positionIndex < 3 ) {
      this._positionIndex++;
    } else {
      this._positionIndex = 0;
    }
  }

  rotate() {

    let newCells = [];

    if ( this._game.insaneMode ) {
      newCells = this._insaneModeComputeNewPosition();
    } else {
      newCells = this._computeNewPosition();
    }

    let isLostCell = newCells.some( cell => {
      return cell == null || cell.isGround();
    });

    if ( isLostCell ) {
      this._adjustPosition();

      return;
    }

    this.clearFigure();
    this.cells = newCells;
    this.renderFigure();
    this._increasePositionIndex();
  }

  move(direction) {
    let newCells = this.cells.map( cell => {

      return cell.neighbors[direction] || null;
    });

    let cantMove = newCells.some( cell => {
       return (cell == null) || cell.isGround();
     })

    if ( cantMove ) {
      if ( direction == 'down' ) {
        this._land();
      }
      return;
    }

    this.clearFigure();
    this.cells = newCells;
    this.renderFigure();
  }

  quickDrop() {
    clearInterval(this._timer);
    this._timer = setInterval( () => {
      this.move('down');
    }, 10 );
  }

  renderFigure() {

    let isGameOver = this.cells.some( cell => {
      return cell.isGround();
    });

    for ( let cell of this.cells ) {
      cell.occupy();
    }

    if ( isGameOver ) {
      this._game.endGame();
      return false;
    }

    return true;
  }

  clearFigure() {
    for ( let cell of this.cells ) {
      cell.release();
    }
  }

  pause() {
    clearInterval(this._timer);
  }
  continue() {
    this._timer = setInterval( () => {
      this.move('down');
    }, this._game.speed );
  }

  get cells() {
    return this._cells;
  }
  get pit() {
    return this._pit;
  }
  get axis() {
    if ( this.cells.length ) {
      return this.cells[2];
    }
  }
  get positionIndex() {
    return this._positionIndex;
  }

  set cells(cells) {
    this._cells = cells;
  }
}

class Square extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }
// ----02----
// ----13----

  _computeNewPosition() {

    return this._cells; //no rotation
  }

  _computeCells() {
    let axis = this._initialCell;
    return [
      this.pit.getCellByCoords([axis.row,  axis.col]),
      this.pit.getCellByCoords([axis.row + 1,  axis.col]),
      this.pit.getCellByCoords([axis.row,  axis.col + 1]),
      this.pit.getCellByCoords([axis.row + 1,  axis.col + 1]),
    ]
  }

}

class Stick extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }

// ---0123---

  _computeNewPosition() {

    let axis = this.axis;

    switch ( this.positionIndex ) {

      case 0:
      case 2: return [
        this._pit.getCellByCoords([ axis.row + 2, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      ];

      case 1:
      case 3: return [
          this._pit.getCellByCoords([ axis.row, axis.col - 2 ]),
          this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
          this._pit.getCellByCoords([ axis.row, axis.col ]),
          this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
    }

    return newCells;
  }

  _computeCells() {

    let axis = this.pit.getCellByCoords([this._initialCell.row,  this._initialCell.col + 1]);

    return [
      this._pit.getCellByCoords([ axis.row, axis.col - 2 ]),
      this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      this._pit.getCellByCoords([ axis.row, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
    ]
  }

}

class Lfigure extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }

// ----123---
// ----0-----

  _computeNewPosition() {

    let axis = this.axis;

    switch ( this.positionIndex ) {

      case 0: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1 , axis.col ]),
      ];

      case 1: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];

      case 2: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 3: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
    }

    return newCells;
  }

  _computeCells() {

    let axis = this.pit.getCellByCoords([this._initialCell.row,  this._initialCell.col + 1]);

    return [
      this._pit.getCellByCoords([ axis.row + 1, axis.col - 1 ]),
      this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      this._pit.getCellByCoords([ axis.row, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),    ]
  }
}

class Lmirror extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }

// ----321---
// ------0---

  _computeNewPosition() {

    let axis = this.axis;

    switch ( this.positionIndex ) {

      case 0: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 1: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];

      case 2: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col - 1]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      ];

      case 3: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];
    }

    return newCells;
  }

  _computeCells() {

    let axis = this.pit.getCellByCoords([this._initialCell.row,  this._initialCell.col + 1]);

    return [
      this._pit.getCellByCoords([ axis.row + 1, axis.col + 1 ]),
      this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      this._pit.getCellByCoords([ axis.row, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
    ]
  }
}

class Tfigure extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }

// -----0----
// ----123---

  _computeNewPosition() {

    let axis = this.axis;

    switch ( this.positionIndex ) {

      case 0: return [
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      ];

      case 1: return [
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];

      case 2: return [
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 3: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];
    }

    return newCells;
  }

  _computeCells() {

    let axis = this.pit.getCellByCoords([this._initialCell.row + 1,  this._initialCell.col + 1]);

    return [
      this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      this._pit.getCellByCoords([ axis.row, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
    ]
  }
}

class Step extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }

// -----10---
// ----32----

  _computeNewPosition() {

    let axis = this.axis;

    switch ( this.positionIndex ) {

      case 0:
      case 2: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 1:
      case 3: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
      ];

    }

    return newCells;
  }

  _computeCells() {

    let axis = this.pit.getCellByCoords([this._initialCell.row + 1,  this._initialCell.col + 1]);

    return [
      this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
      this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col - 1 ]),
    ]
  }
}

class StepMirror extends Figure {
  constructor(game, pit) {
    super(game, pit);
  }

// ----01----
// -----23---

  _computeNewPosition() {

    let axis = this.axis;

    switch ( this.positionIndex ) {

      case 0:
      case 2: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row + 1, axis.col ]),
      ];

      case 1:
      case 3: return [
        this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
        this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col ]),
        this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
      ];

    }

    return newCells;
  }

  _computeCells() {

    let axis = this.pit.getCellByCoords([this._initialCell.row + 1,  this._initialCell.col]);

    return [
      this._pit.getCellByCoords([ axis.row - 1, axis.col - 1 ]),
      this._pit.getCellByCoords([ axis.row - 1, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col ]),
      this._pit.getCellByCoords([ axis.row, axis.col + 1 ]),
    ]
  }
}


document.addEventListener('DOMContentLoaded', () => {
  let tetrisGame = new Tetris(document.getElementById('tetris-game'));
});

// FIGURES: 'square', 'stick', 'L-figure', 'L-mirror',
//         'T-figure', 'step', 'step-mirror'

// to do:
// - fix bug (clearNdrop)
