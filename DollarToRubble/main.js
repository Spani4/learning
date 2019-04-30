"use strict"

class DollarToRubble {
  constructor(field, rate) {
    this._field = field;
    this._rate = rate;

    this._init(field, rate);
  }

  _init(field, rate) {

    let str = field.innerHTML;
    let reg = /\$(\d+(?:\.\d+)?)/i;

    while ( str.match(reg) ) {
      let newPrice = this._convert( str.match(reg)[1], rate );
      str = str.replace( reg, newPrice + ' руб.' );
    }

    field.innerHTML += '\n' + str;
  }

  _convert(str, rate) {
    return (Math.round(rate * str * 100) / 100).toFixed(2);
  }

}

new DollarToRubble( document.querySelector('body'), 63.80 );
