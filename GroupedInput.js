"use strict"

class GroupedInput {
  constructor(input) {
    this._input = input;
    this._string = '';

    this._init(input);
  }

  _init(input) {

    input.addEventListener('keypress', (e) => {
      e.preventDefault();

      if ( e.key.match(/\d/) ) {
        this._string += e.key;
        this.setInpValue();
      }
    });

    input.addEventListener('keydown', (e) => {

      if ( e.key == "Backspace" ) {
        e.preventDefault();
        this._string = this._string.slice(0, -1);
        this.setInpValue();
      }
    });
  }

  setInpValue() {
    let str = '';
    for ( let i = 0, j = 0; i < this._string.length; i++ ) {
      str += this._string[i];
      if ( !((i + 1) % 3) ) {
        str += ' ';
      }
    }
    this._input.value = str;
  }

  static init(input, mask) {
    new GroupedInput(input);
  }
}

GroupedInput.init(document.querySelector('input'));
