"use strict"

class ClickTooltip {
  constructor() {
    this._tooltip = document.createElement('span');

    this._init(this._tooltip);
  }

  _init(tooltip) {

    tooltip.classList.add('tooltip', 'hidden');
    document.body.appendChild(tooltip);

    document.documentElement.addEventListener('click', (e) => {

      if ( e.target != tooltip ) {
        tooltip.innerHTML = 'x: ' + e.pageX + ' y: ' + e.pageY;
        tooltip.classList.toggle('hidden');

        if ( !tooltip.classList.contains('hidden') ) {
          this._setPosition(tooltip, {x: e.pageX, y: e.pageY});
        }
      }

    });
  }

  _setPosition(tooltip, click) {
    let coords = tooltip.getBoundingClientRect();

    if ( click.x + coords.width > document.documentElement.clientWidth) {
      tooltip.style.left = click.x - coords.width + 'px';
    } else {
      tooltip.style.left = click.x + 'px';
    }

    if ( click.y - coords.height < document.documentElement.scrollTop ) {
      tooltip.style.top = click.y + 'px';
    } else {
      tooltip.style.top = click.y - coords.height + 'px';
    }
  }

  static init() {
    new ClickTooltip();
  }
}

ClickTooltip.init();
