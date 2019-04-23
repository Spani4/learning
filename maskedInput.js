"use strict"

class MaskedInput {
  constructor(input, mask) {
    this._input = input;
    this._mask = mask;
    this._digits = [];
    this._activeSymbol = 0;

    this._editableIndexes = this.getEditableIndexes(mask);
    this._activeEditableIndex = 0;

    this._init(input, this._mask, this._digits);
  }

  _init(input, mask, digits) {

    const l = mask.match(/9/g).length;

    for ( let i = 0; i < l; i++ ) {
      digits.push('_');
    }

    mask = mask.replace(/9/g, '_masked_');
    this.refreshInput(input, mask, digits, l);

    input.addEventListener('click', (e) => {
      this.setCursor();
    });

    input.addEventListener('keypress', (e) => {

      e.preventDefault();

      if ( e.key.match(/\d/) && this._activeSymbol <= l - 1 ) {
        digits[this._activeSymbol] = e.key;
        this._activeSymbol++;
        this._activeEditableIndex++;
      }

      this.refreshInput(input, mask, digits, l);
    });

    input.addEventListener('keydown', (e) => {

      input.readOnly = true;  //чтобы не прыгал курсор

      if ( e.key == 'Backspace' ) {
        e.preventDefault();

        if ( this._activeSymbol ) {
          this._activeSymbol--;
        }
        if ( this._activeEditableIndex ) {
          this._activeEditableIndex--;
        }

        digits[this._activeSymbol] = '_';
        this.refreshInput(input, mask, digits, l);
      }
    });

    input.addEventListener('keyup', (e) => {
      this.setCursor();
      input.readOnly = false; //чтобы не прыгал курсор
    });

  }

  refreshInput(input, mask, digits, l) {
    for ( let i = 0; i < l; i++ ) {
      mask = mask.replace(/_masked_/, digits[i]);
    }
    input.value = mask;
  }

  getEditableIndexes(mask) {
    let l = mask.match(/9/g).length;
    let arr = [];

    for ( let i = 0; i < l; i++ ) {
      arr.push(mask.indexOf('9'));
      mask = mask.replace(/9/, '_');
    }
    return arr;
  }

  setCursor() {
    this._input.selectionStart = this._editableIndexes[this._activeEditableIndex];
    this._input.selectionEnd = this._editableIndexes[this._activeEditableIndex];

    if ( this._activeEditableIndex ==  this._editableIndexes.length ) {
      this._input.selectionStart = -1;
      this._input.selectionEnd = -1;
    }
  }

  static init(input, mask) {
    new MaskedInput(input, mask);
  }
}

MaskedInput.init(document.querySelector('input'), '+7 (999) 999-99-99');
