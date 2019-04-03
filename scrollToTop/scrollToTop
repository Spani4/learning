;class ScrollToTop {
	constructor(cssClass = 'go-to-top') {
		this._elem = document.createElement('div');
		this._cssClass = cssClass;
		console.log( this._cssClass );
		this._init();
	}

	static initiate(className) {
		new ScrollToTop(className);
	}

	_init() {
		document.documentElement.appendChild(this._elem);
		document.documentElement.style.scrollBehavior = 'smooth';
		this._elem.classList.add(this._cssClass);
		this._elem.innerHTML = '&#x21ea;';

		this._elem.addEventListener('click', function() {
			document.documentElement.scrollTop = 0 + 'px';
		});
	}

	getElem() {
		return this._elem;
	}
	getClass() {
		return this._cssClass;
	}
	addClass(name) {
		this._elem.classList.add(name);
	}
	removeClass(name) {
		this._elem.classList.remove(name);
	}
}

window.addEventListener('load', () => {
	ScrollToTop.initiate();
});
