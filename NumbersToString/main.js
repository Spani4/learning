"use strict"

class NumbersToString {
  constructor(input, textField) {
    this._input = input;
    this._textField = textField;

    this._keywords = {
      hundreds: ['','сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','дявятьсот'],
      decades: ['','','двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'],
      secondDecade: ['десять','одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'],
      units: ['','один','два','три','четыре','пять','шесть','семь','восемь','девять'],
    }

    this._init(input, textField);
  }

  _init(input, textField) {

    let str = '';
    let inWords = '';

    this._adjustInput(input);

    input.addEventListener('keypress', (e) => {

      if ( input.value.length >= 3 ) {
        e.preventDefault();
      }
    });

    input.addEventListener('newvalue', (e) => {

      inWords = '';
      str = input.value;
      while ( str.length < 3) {
        str = '0' + str;
      }

      inWords += this._keywords.hundreds[str[0]] + ' ';

      if ( str[1] > 1 ) {
        inWords += this._keywords.decades[str[1]] + ' ' + this._keywords.units[str[2]];
      } else if ( str[1] == 1 ) {
        inWords += this._keywords.secondDecade[str[2]];
      } else {
        inWords += this._keywords.units[str[2]];
      }

      textField.innerHTML = inWords;
    })

    input.addEventListener('keyup', (e) => {
      input.dispatchEvent(new Event('newvalue'));
    });

    input.addEventListener('click', (e) => {
      input.dispatchEvent(new Event('newvalue'));
    });

  }

  _adjustInput(input) {
    input.type = 'number';
    input.min = 0;
    input.max = 999;
    input.maxLength = 3;
  }
}

new NumbersToString( document.querySelector('input'), document.querySelector('div') );
