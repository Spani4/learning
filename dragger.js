"use strict"

class Drag {
  constructor(elem) {
    this._elem = elem;
    this._handle = document.createElement('div');

    this._init(elem, this._handle);
  }

  _init(elem, handle) {
    this._prepareElems(elem, handle);

    handle.ondragstart = (e) => {
      return false;
    }

    handle.onmousedown = (e) => {
      let coords = elem.getBoundingClientRect();
      let dx = e.pageX - coords.left;
      let dy = e.pageY - coords.top;

      document.onmousemove = (e) => {
        elem.style.left = e.pageX - dx + 'px';
        elem.style.top = e.pageY - dy + 'px';

      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    };

    elem.addEventListener('mouseover', () => {
      handle.style.display = 'block';
      handle.style.opacity = '.7';
    });

    elem.addEventListener('mouseleave', () => {
      handle.style.display = 'none';
      handle.style.opacity = '0';
    });

  }

  _prepareElems(elem, handle) {
    elem.style.position = 'absolute';
    elem.appendChild(handle);

    handle.style.display = 'none';
    handle.style.position = 'absolute';
    handle.style.width = '90%';
    handle.style.height = '20px';
    handle.style.left = '5%';
    handle.style.top = '-20px';
    handle.style.margin = '0 auto';
    handle.style.padding = '0';
    handle.style.backgroundColor = '#555';
    handle.style.opacity = '0';
    handle.style.textAlign = 'center';
    handle.style.fontSize = '12px';
    handle.style.lineHeight = '25px';
    handle.style.cursor = 'default';
    handle.style.transition = 'opacity .5s';

    handle.innerHTML = 'DRAG';
  }

  static apply(elem) {
    new Drag(elem);
  }
}

Drag.apply(document.querySelector('div'));
