"use strict"

class CodeHighlighter {
  constructor(field) {
    this._field = field;
    this._keywords = [
      'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
      'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
      'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch',
      'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
      'public', 'static', 'true', 'false', 'null', 'undefined'
      ];

      this._init(field);
  }

  _init(field) {
    this._highlightStrings(field);
    this._highlightKeywords(field);
    this._highlightNumbers(field);
    this._highlightComments(field);
    console.log(field);
  }

  _highlightKeywords(field) {
    let str = field.innerHTML;
    for ( let i = 0; i < this._keywords.length; i++ ) {
      let reg = new RegExp( '(\\s' + this._keywords[i] + '\\s)', 'g');
      str = str.replace(reg, '<span class="keyword">$1</span>');
      field.innerHTML = str;
    }
  }

  _highlightNumbers(field) {
    let str = field.innerHTML;
    let reg = new RegExp( '([^\\w])(\\d+)(\\.\\d+)?', 'g');
    str = str.replace(reg, '$1<span class="number">$2$3</span>');
    field.innerHTML = str;
  }

  _highlightStrings(field) {
    let str = field.innerHTML;
    let reg = RegExp( '(".+")', 'g');
    str = str.replace(reg, '<span class="string">$1</span>');

    reg = new RegExp( "('.+')", 'g');
    str = str.replace(reg, '<span class="string">$1</span>');

    field.innerHTML = str;
  }

  _highlightComments(field) {
    let str = field.innerHTML;
    let reg = new RegExp( '(//.+\\n)', 'g');
    str = str.replace(reg, '<span class="comment">$&</span>');

    reg = new RegExp( '(/\\*(.|\\n)+\\*/)', 'gm');
    str = str.replace(reg, '<span class="comment">$&</span>');
    field.innerHTML = str;

  }


}

new CodeHighlighter( document.querySelector('code') );

// function isReservedKeyword(wordToCheck) {
//     var reservedWord = false;
//     if (/^[a-z]+$/.test(wordToCheck)) {
//         try {
//             eval('var ' + wordToCheck + ' = 1');
//         } catch (error) {
//             reservedWord = true;
//         }
//     }
//     return reservedWord;
// }
