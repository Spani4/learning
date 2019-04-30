"use strict"

class WithinEditor {
  constructor(field) {
    this._field = field;
    this._html = field.querySelector('.html');
    this._css = field.querySelector('.css');

    this._style = document.createElement('style');

    this._result = field.querySelector('.result');

    this._init(field, this._html, this._css, this._style, this._result);
  }

  _init(field, html, css, style, result) {

    document.head.appendChild(style);

    for (let elem of [html, css]) {
      elem.addEventListener('keydown', (e) => {
        if ( e.keyCode == 9 ) {
          e.preventDefault();
          this._insertTab(elem);
        }
      });

      elem.addEventListener('change', () => {
        this._refresh();
      });

      elem.addEventListener('keypress', (e) => {
        if ( e.keyCode == 62 ) {
          this._closeTag(elem, e);
        }
        if ( e.keyCode == 13 ) {
          e.preventDefault();
          this._indent(elem);
        }
      });
    }

  }

  _indent(elem) {
    let [ i, str, spaces ] = [ elem.selectionStart, elem.value, '' ];
    let text = str.substring(0, i);
    let k = text.lastIndexOf('\n');
    k++;

    while ( text[k] === ' ' )  {
      spaces += ' ';
      k++;
    }

    elem.value = str.substring(0, i) + '\n' + spaces + str.substring(i);
    elem.selectionStart = i + spaces.length + 1;
    elem.selectionEnd = i + spaces.length + 1;

  }

  _refresh() {
    this._result.innerHTML = this._html.value;
    this._style.innerHTML = this._css.value;
  }

  _insertTab(elem) {
    let [i, str] = [elem.selectionStart, elem.value];
    elem.value = str.substring(0, i) + '  ' + str.substring(i);
    elem.selectionStart = i + 2;
    elem.selectionEnd = i + 2;
  }

  _closeTag(elem, e) {
    let [i, str] = [elem.selectionStart, elem.value];
    let openTag = str.substring(0, i).lastIndexOf('<');
    let tagName;

    if ( openTag >= 0) {
      tagName = str.substring(openTag + 1, i);
    }

    if ( tagName && tagName[0] != '/') {
      elem.value = str.substring(0, i) + '></' + tagName + '>' + str.substring(i);
      elem.selectionStart = i + 1;
      elem.selectionEnd = i + 1;
      e.preventDefault();
    }
  }

}

new WithinEditor( document.querySelector('.editor') );
