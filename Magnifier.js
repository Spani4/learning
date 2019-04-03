class Magnifier {
	constructor(img, magnifiedScale = 2, magnifiedClass) {
		this._img = {
			elem: img,
			w: img.offsetWidth,
			h: img.offsetHeight,
			l: img.offsetLeft,
			t: img.offsetTop,
		}

		this._magnifiedScale = magnifiedScale;
		this._class = magnifiedClass;

		this._mgFrame = document.createElement('div');
		this._zoomed = document.createElement('div');
		this._scales = [1,2,3,4,5,6,7,8];
		this._scaleIndex = 1;
		this._zoom = this._scales[this._scaleIndex];
		this._init(this._img, this._mgFrame, this._zoomed, this._zoom);
	}

	static initiate(img, magnifiedScale = 2, magnifiedClass) {
		let zoomable = new Magnifier(img, magnifiedScale, magnifiedClass);
	}

	_init(img, mgFrame, zoomed, zoom) {
		let w = this._img.w;
		let h = this._img.h;
		let l = this._img.l;
		let t = this._img.t;

		this._adjustImg(img.elem);
		this._adjustMgFrame(mgFrame, zoom, w, h, l, t);
		this._adjustZoomed(zoomed, w, h, l, t, this._img.elem.src, zoom);

		this._img.elem.onmouseover = (e) => {
			mgFrame.style.display = 'block';
			zoomed.style.display = 'block';
			this._moveFrame(e, mgFrame, w, h, l, t);
		}
		this._img.elem.onmousemove = (e) => {
			mgFrame.style.display = 'block';
			this._moveFrame(e, mgFrame, w, h, l, t);
		}

		mgFrame.onmouseover = (e) => {
			this._showZoom(e, mgFrame, zoomed, zoom, w, h, l, t);
			zoomed.style.display = 'block';
		}
		mgFrame.onmouseout = () => {
			mgFrame.style.display = 'none';
			zoomed.style.display = 'none';
		}
		mgFrame.onmousemove = (e) => {
			this._showZoom(e, mgFrame, zoomed, zoom, w, h, l, t);
		}
		mgFrame.onwheel = (e) => {
			e.preventDefault();
			zoomed.style.display = 'block';
			mgFrame.style.display = 'block';
			if (e.deltaY > 0) {
				this._setZoom(-1, e, {x: mgFrame.offsetLeft, y: mgFrame.offsetTop});
			}
			if (e.deltaY < 0) {
				this._setZoom(1, e, {x: mgFrame.offsetLeft, y: mgFrame.offsetTop});
			}
		}
	}

	_setZoom(i, e, coords) {
		if (this._scaleIndex + i >= 0 && this._scaleIndex + i < this._scales.length) {
			this._scaleIndex += i;
			this._zoom = this._scales[this._scaleIndex];
			this._init(this._img, this._mgFrame, this._zoomed, this._zoom);
		}

		this._showZoom(e, this._mgFrame, this._zoomed, this._zoom, this._img.w, this._img.h, this._img.l, this._img.t);
	}

	_showZoom(e, mgFrame, zoomed, zoom, w, h, l, t) {
		let coords = this._moveFrame(e, mgFrame, w, h, l, t);
		let xPercent = ((coords.x - l) / w );
		let yPercent = ((coords.y - t) / h );
		let xPx = xPercent * zoomed.offsetWidth;
		let yPx = yPercent * zoomed.offsetHeight;

		this._moveBackground(zoomed, xPx, yPx, zoom);
	}

	_moveFrame(e, mgFrame, w, h, l, t) {
		if ( e.pageX <= l + mgFrame.offsetWidth/2 ) {
			mgFrame.style.left = l + 'px';
		} else {
			if ( e.pageX >= l + w - mgFrame.offsetWidth/2 ) {
				mgFrame.style.left = l + w - mgFrame.offsetWidth + 'px';
			} else {
				mgFrame.style.left = e.pageX - mgFrame.offsetWidth/2 + 'px';
			}
		}
		if ( e.pageY <= t + mgFrame.offsetHeight/2 ) {
			mgFrame.style.top = t + 'px';
		} else {
			if ( e.pageY >= t + h - mgFrame.offsetHeight/2 ) {
				mgFrame.style.top = t + h - mgFrame.offsetHeight + 'px';
			} else {
				mgFrame.style.top = e.pageY - mgFrame.offsetHeight/2 + 'px';
			}
		}

		return {x: mgFrame.offsetLeft, y: mgFrame.offsetTop};
	}

	_moveBackground(zoomed, xPx, yPx, zoom) {
		zoomed.style.backgroundPosition = -xPx*zoom + 'px ' + (-yPx*zoom)  + 'px';
	}

	_adjustImg(img) {
		img.style.cursor = 'crosshair';
	}
	_adjustMgFrame(mgFrame, zoom, w, h, l, t) {
		mgFrame.style.display = 'none';
		mgFrame.style.position = 'absolute';
		mgFrame.style.border = '1px solid black';
		mgFrame.style.width = (1/zoom) * w + 'px';
		mgFrame.style.height = (1/zoom) * h + 'px';
		mgFrame.style.left = l + 'px';
		mgFrame.style.top = t + 'px';
		mgFrame.style.cursor = 'crosshair';
		document.body.appendChild(mgFrame);
	}
	_adjustZoomed(zoomed, w, h, l, t, image, zoom) {
		zoomed.style.display = 'none';
		zoomed.style.position = 'absolute';
		zoomed.style.width = w * this._magnifiedScale + 'px';
		zoomed.style.height = h * this._magnifiedScale + 'px';
		zoomed.style.left = l + w + 20 + 'px';
		zoomed.style.top = t + 'px';
		zoomed.style.background = 'url("' + image + '") no-repeat';
		zoomed.style.backgroundSize = zoom * 100 + '%';
		zoomed.style.backgroundOrigin = 'border-box';
		zoomed.style.backgroundClip = 'border-box';
		zoomed.style.transitionProperty = 'background-size';

		if (this._class) {
			zoomed.classList.add(this._class);
		}
		document.body.appendChild(zoomed);
	}
}

window.addEventListener('load', () => {
	//call: Magnifier.initiate(img-elem, scale (optional), class-name(optional));
	Magnifier.initiate(document.querySelector('img'), 2, 'class');
});
