"use strict"

class Resize {
  constructor(elem) {
    this.elem = elem;
    this.resizer = document.createElement('span');

    this._init(elem, this.resizer);
  }

  _init(elem, resizer) {
    this._prepareElems(elem, resizer);

    resizer.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    resizer.addEventListener('mousedown', (e) => {
      let w = elem.offsetWidth;
      let h = elem.offsetHeight;
      let dX = 0;
      let dY = 0;

      document.onmousemove = (event) => {
        dX += event.movementX;
        dY += event.movementY;
        this._resize(event, elem, dX, dY, w, h);
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _prepareElems(elem, resizer) {
    elem.style.position = 'relative';
    elem.appendChild(resizer);

    resizer.style.position = 'absolute';
    resizer.style.width = '15px';
    resizer.style.height = '15px';
    resizer.style.padding = '0';
    resizer.style.margin = '0';
    resizer.style.right = '0';
    resizer.style.bottom = '0';
    resizer.style.cursor = 'default';
    resizer.style.lineHeight = '15px';
    resizer.style.letterSpacing = '-2px';
    resizer.style.opacity = '.5';
    resizer.innerHTML = '&#x25e2;';
  }

  _resize(e, elem, dX, dY, w, h) {

    elem.style.width = w + dX + 'px';
    elem.style.height = h + dY + 'px';
  }

  static apply(e) {
    new Resize(e);
  }
}

// Resize.apply(document.querySelector('div'));
