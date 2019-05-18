"use strict"

class GameDotSurrounding {
  constructor(field, dimensions ) {
    this._field = field;
    [this._fieldWidth, this._fieldHeight, this._cellSize] = dimensions;

    this._players = ['black', 'white'];
    this._currentPlayer = 0;
    this._maxScore = 0;

    this._spots = new Spots(this);

    this._init(field);
  }

  _init(field) {

    this._adjustField(field);
    this._buildVisibleGrid(field);
    this._buildDotSpotGrid(field);
    this._buildScorePanel(field);
  }

  _buildScorePanel(field, dotSpotGrid) {

    let panel = document.createElement('div');
    panel.classList.add('score-panel');

    let header = document.createElement('h1');
    header.innerHTML = 'Score:';
    panel.appendChild(header);

    let score = document.createElement('div');
    let scoreBlack = document.createElement('p');
    let scoreWhite = document.createElement('p');
    scoreBlack.classList.add('score-black');
    scoreWhite.classList.add('score-white');

    score.appendChild(scoreBlack);
    score.appendChild(scoreWhite);
    panel.appendChild(score);

    let newGame = document.createElement('a');
    newGame.classList.add('new-game-link');
    newGame.innerHTML = 'Start new game';
    panel.appendChild(newGame);

    newGame.addEventListener('click', () => {
      field.innerHTML = '';
      this._init(field);
    });

    field.appendChild(panel);

    this.refreshScore();

  }

  _buildDotSpotGrid(field) {

    let spotGrid = document.createElement('div');
    spotGrid.classList.add('dot-spot-grid');
    field.appendChild(spotGrid);

    for ( let i = 0; i <= this._fieldHeight; i++) {
      let row = document.createElement('div');
      row.classList.add('dot-spot-row');
      spotGrid.appendChild(row);

      for ( let j = 0; j <= this._fieldWidth; j++) {
        let cell = document.createElement('div');
        cell.classList.add('dot-spot-cell');
        cell.style.width = this._cellSize + 'px';
        cell.style.height = this._cellSize + 'px';
        cell.style.minWidth = this._cellSize + 'px';
        cell.style.minHeight = this._cellSize + 'px';

        row.appendChild(cell);
        new Spot(this, this._spots, cell, [i, j]);
      }
    }

    return spotGrid;
  }

  _buildVisibleGrid(field) {

    let visibleGrid = document.createElement('div');
    visibleGrid.classList.add('visible-grid');
    field.appendChild(visibleGrid);

    visibleGrid.style.left = this._cellSize/2 + 'px';
    visibleGrid.style.top = this._cellSize/2 + 'px';

    for ( let i = 0; i < this._fieldHeight; i++) {
      let row = document.createElement('div');
      visibleGrid.appendChild(row);
      row.classList.add('row');

      for ( let i = 0; i < this._fieldWidth; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = this._cellSize + 'px';
        cell.style.height = this._cellSize + 'px';
        cell.style.minWidth = this._cellSize + 'px';
        cell.style.minHeight = this._cellSize + 'px';

        row.appendChild(cell);
      }
    }
  }

  _adjustField(field) {

    if ( this._fieldWidth < 9 ) this._fieldWidth = 9;
    if ( this._fieldHeight < 9 ) this._fieldHeight = 9;

    this._maxScore = Math.floor( (this._fieldWidth * this._fieldHeight) / 10 );

    field.style.width = (1 + this._fieldWidth) * this._cellSize + 'px';
  }

  gameOver(winner) {

    if ( this.field.querySelector('.winner') ) return;

    let announcement = document.createElement('h2');
    announcement.classList.add('winner');
    announcement.innerHTML = winner + ' won !!!';
    this.field.querySelector('.score-panel').appendChild(announcement);

    for ( let spot of this.spots.getMap().values() ) {
      spot.elem.onclick = null;
      spot.elem.onmouseover = null;
      spot.elem.onmouseout = null;
    }
  }

  checkWinner() {
    let [capturedBlack, capturedWhite] = [this.capturedBlacks, this.capturedWhites];

    if ( capturedBlack >= this.maxScore ) {
      this.gameOver('Whites');
      return;
    }
    if ( capturedWhite >= this.maxScore ) {
      this.gameOver('Blacks');
      return;
    }

    if ( this.field.querySelectorAll('.empty').length == 0 ) {

      if ( capturedBlack > capturedWhite ) this.gameOver('Whites');
      if ( capturedWhite > capturedBlack ) this.gameOver('Blacks');
      if ( capturedBlack == capturedWhite ) this.gameOver('No one');

    }

  }

  refreshScore() {

    let [scoreBlack, scoreWhite, capturedBlack, capturedWhite] = [
      this.field.querySelector('.score-black'),
      this.field.querySelector('.score-white'),
      this.capturedBlacks,
      this.capturedWhites
    ];
    let [capBl, capWh] = [0, 0];

    if ( capturedBlack ) { capBl = capturedBlack };
    if ( capturedWhite ) { capWh = capturedWhite };

    scoreBlack.innerHTML = 'Blacks: ' + capWh + ' (left ' + (this.maxScore - capWh) + ')';
    scoreWhite.innerHTML = 'Whites: ' + capBl + ' (left ' + (this.maxScore - capBl) + ')';
  }

  changePlayer() {
    this._currentPlayer++;
    if ( this.getCurrentPlayer() == this.getPlayers().length) {
      this._currentPlayer = 0;
    }
  }

  getCurrentPlayer() {
    return this._currentPlayer;
  }

  getOpponent() {
    let i = this.getCurrentPlayer() + 1;

    if ( i == this.getPlayers().length) {
      i = 0;
    }

    return i;
  }

  getPlayers(){
    return this._players;
  }

  getCurrentPlayerClass() {
    return game.getPlayers()[game.getCurrentPlayer()];
  }

  getOpponentClass() {
    return game.getPlayers()[game.getOpponent()];
  }

  get fieldHeight() {
    return this._fieldWidth;
  }

  get fieldWidth() {
    return this._fieldHeight;
  }

  get field() {
    return this._field;
  }

  get maxScore() {
    return this._maxScore
  }

  get capturedBlacks() {
    return this.field.querySelectorAll('.black.captured').length;
  }

  get capturedWhites() {
    return this.field.querySelectorAll('.white.captured').length;
  }

  get field() {
    return this._field;
  }

  get spots() {
    return this._spots;
  }

}

class Spot {
  constructor(game, spots, cell, coords) {
    this._game = game;
    this._cell = cell;
    this._elem = document.createElement('div');

    this._spots = spots;

    this._coords = coords;
    this._row = this.getRow();
    this._col = this.getCol();

    this._init(game, spots, cell, this._elem);
  }

  _init(game, spots, cell, elem) {

    spots.getMap().set(this._coords.join('x'), this);

    cell.appendChild(elem);
    elem.classList.add('spot');
    elem.classList.add('empty');

    elem.onclick = () => {
      elem.classList.remove('empty');
      elem.classList.add( game.getCurrentPlayerClass() );
      elem.classList.add('occupied');

      let surroundedSpots = spots.checkSurrounding(game, this) || [];

      if ( surroundedSpots.length > 0 ) {

        spots.capture( surroundedSpots );
        game.refreshScore();
        game.checkWinner();
      }

      if ( game.field.querySelectorAll('.empty').length == 0) {
        game.checkWinner();
      }

      game.changePlayer();

      elem.onclick = null;
      elem.onmouseover = null;
      elem.onmouseout = null;
    };

    elem.onmouseover = () => {
      if ( elem.classList.contains('empty') ) {
        elem.classList.add( game.getCurrentPlayerClass() );
      }
    };
    elem.onmouseout = () => {
      if ( elem.classList.contains('empty') ) {
        elem.classList.remove( game.getCurrentPlayerClass() );
      }
    };
  }

  getRow() {
    return this._coords[0];
  }
  getCol() {
    return this._coords[1];
  }
  getCoords() {
    return this._coords;
  }
  getClassList() {
    return this._elem.classList;
  }
  get elem() {
    return this._elem;
  }
}

class Spots {
  constructor(game) {
    this._game = game;
    this._spotMap = new Map();

  }

  checkSurrounding(game, spot) {

    let [ mateNeighbors, otherNeighbors ] = this.getNeighbors(game, spot);
    let spotNetworks = [];
    let surroundedSpots = [];

    if ( mateNeighbors.length > 1 ) {

      outer:
      for ( let i = 0; i < otherNeighbors.length; i++ ) {

        let neighbor;
        let spotNet;

        spotNet = [];
        neighbor = otherNeighbors[i];

        if ( !neighbor ) continue;

        this.expandNetwork(game, neighbor, spotNet);
        spotNetworks.push( spotNet );

        while ( true && i < otherNeighbors.length) {

          if ( spotNet.indexOf(otherNeighbors[i+1]) == -1 ) {
            continue outer;
          } else {
            i++;
          }
        }
      }

      surroundedSpots = this.checkNetworks(spotNetworks);
    }


    return surroundedSpots;
  }

  checkNetworks(spotNetworks) {

    let surroundedSpots = [];

    surroundedSpots = spotNetworks.filter( net => {
      return !net.some( spot => {
        return ( spot.getRow() == 0 || spot.getCol() == 0 ||
          spot.getRow() == game.fieldWidth || spot.getCol() == game.fieldHeight );
      });
    })[0];

    return surroundedSpots;
  }

  expandNetwork(game, spot, spotNet) {

    if ( spotNet.indexOf(spot) != -1 ) return;

    let coords = spot.getCoords();
    let escapeCoords = this.getEscapeCoords(coords);

    spotNet.push( spot );

    for ( let i = 0; i < escapeCoords.length; i++ ) {

      let neighbor = this.getSpotByCoords( escapeCoords[i] );
      let currentClass = game.getCurrentPlayerClass();

      if ( !neighbor ) {
        return;
      }

      if ( neighbor && (spotNet.indexOf(neighbor) == -1) &&
          (neighbor.getClassList().contains('captured') || !neighbor.getClassList().contains(currentClass))
        ) {
        this.expandNetwork(game, neighbor, spotNet);
      }

    }

  }

  capture(spots) {

    spots.forEach( spot => {
      spot.getClassList().add('captured');
    });
  }

  getNeighbors(game, spot) {
    let coords = spot.getCoords();
    let siblingCoords = this.getSiblingCoords(coords);
    let mateNeighbors = [], otherNeighbors = [];

    for ( let i = 0; i < siblingCoords.length; i++ ) {
      let neighbor = this.getSpotByCoords( siblingCoords[i] );
      let currentClass = game.getCurrentPlayerClass();

      if ( neighbor && neighbor.getClassList().contains(currentClass) ) {
        mateNeighbors.push( neighbor );
      } else {
        otherNeighbors.push( neighbor );
      }
    }

    return [ mateNeighbors, otherNeighbors ];
  }

  getEscapeCoords(coords) {
    let escapeCoords = [
      [coords[0] - 1, coords[1]],     //top
      [coords[0], coords[1] + 1],     // right
      [coords[0] + 1, coords[1]],     //bottom
      [coords[0], coords[1] - 1],     //left
    ];

    return escapeCoords;
  }

  getSiblingCoords(coords) {
    let siblingCoords = [
      [coords[0] - 1, coords[1] - 1], //left top
      [coords[0] - 1, coords[1]],     //top
      [coords[0] - 1, coords[1] + 1], //right top
      [coords[0], coords[1] + 1],     // right
      [coords[0] + 1, coords[1] + 1], // right bottom
      [coords[0] + 1, coords[1]],     //bottom
      [coords[0] + 1, coords[1] - 1], //left bottom
      [coords[0], coords[1] - 1],     //left
    ];

    return siblingCoords;
  }

  getSpotByCoords(coords) {
    if ( typeof coords == 'string' ) {
      return this.getMap().get(coords);
    } else {
      return this.getMap().get(coords.join('x'));
    }
  }

  getMap() {
    return this._spotMap;
  }
}

let game = new GameDotSurrounding(document.querySelector('.dot-surrounding-field'), [5, 5, 20]);
