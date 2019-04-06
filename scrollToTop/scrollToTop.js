class ScrollToTop {
	constructor(cssClass = 'go-to-top') {
		this._elem = document.createElement('div');
		this._cssClass = cssClass;
		console.log( document.documentElement.clientHeight );
		console.log( document.documentElement.offsetHeight );
		console.log( screen.availHeight );
		this._init(this._elem);
	}

	static initiate(className) {
		new ScrollToTop(className);
	}

	_init(elem) {
		document.body.appendChild(elem);
		document.documentElement.style.scrollBehavior = 'smooth';
		elem.classList.add(this._cssClass);
		elem.innerHTML = '&#x21ea;';
		elem.style.display = 'none';

		elem.addEventListener('click', function() {
			document.documentElement.scrollTop = 0 + 'px';
		});

		document.addEventListener('scroll', function() {
			console.log(document.documentElement.scrollTop);
			if (document.documentElement.scrollTop > document.documentElement.clientHeight / 2) {
				elem.style.display = 'block';
			} else {
				elem.style.display = 'none';
			}
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

ScrollToTop.initiate();
