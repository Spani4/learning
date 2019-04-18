"use strict"

class PageSearch {
  constructor(input) {
    this._input = input;
    this._textField = document.querySelector('body');

    this._init(input, this._textField);
  }

  _init(input, field) {
    let searchElems = [];
    let texts = [];

    this._collectSearchElems(field, searchElems);
    texts = searchElems.map((el, i, arr) => {
      return el.innerHTML;
    });

    input.addEventListener('keyup', () => {
      let str = input.value.replace(/[^A-Za-zА-Яа-яЁё0-9 -]/gi, '');

      if ( str ) {
        let reg = new RegExp('(' + str + ')', 'gi');
        for (let i = 0; i < texts.length; i++) {
          searchElems[i].innerHTML = texts[i].replace(reg, '<mark class="found">$1</mark>');
        }
      } else {
        for (let i = 0; i < texts.length; i++) {
          searchElems[i].innerHTML = texts[i];
        }
      }
    });
  }

  _collectSearchElems(elem, arr) {

    let children = elem.children;

    for (let i = 0; i < children.length; i++)  {

      if ( children[i].dataset.searchable == 'true' ) {
        arr.push(children[i]);
      }
      if ( children[i].children.length ) {
        this._collectSearchElems(children[i], arr);
      }
    }
  }

  static init(input) {
    new PageSearch(input);
  }
}

PageSearch.init(document.querySelector('input'));
