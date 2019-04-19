"use strict"
class DropMenu {
  constructor(elem) {
    this._elem = elem;
    this._button = elem.querySelector('.drop-button');
    this._dropContent = elem.querySelector('.drop-content');

    this._init(this._button, this._dropContent);
  }

  _init(btn, content) {
    console.log(content);
    btn.addEventListener('click', () => {
      this._toggleClass(content, 'hidden');
    });

  }

  _toggleClass(elem, cssClass) {
    if ( elem.classList.contains(cssClass) ) {
      elem.classList.remove(cssClass);
    } else {
      elem.classList.add(cssClass);
    }
  }

  static init(elem) {
    new DropMenu(elem)
  }

  static initAll(arr) {
    for (let i = 0; i < arr.length; i++) {
      new DropMenu(arr[i]);
    }
  }

}

DropMenu.initAll(document.querySelectorAll('.drop-menu'));
