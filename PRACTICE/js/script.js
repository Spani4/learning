'use strict'


document.addEventListener('DOMContentLoaded', () => {
  let modal = new Modal();
  let header = new Header(document.querySelector('header .container'), modal);
  let navigation = new Navigation(document.querySelector('nav .container'), modal);
  let footer = new Footer(document.querySelector('footer .container'), navigation)
});


class Header {
  constructor(elem, modal) {
    this._clickDropDown = elem.querySelector('.click-drop-down');
    this._dropBtn = elem.querySelector('.drop-button');
    this._dropContent = elem.querySelector('.drop-content');
    this._phoneElem = elem.querySelector('.phone');
    this._orderButton = elem.querySelector('button');

    this._cities = [];
    this._currentCityIndex = 0;

    this._init(modal);
  }

  _init(modal) {
    this._currentCityIndex = this._getCityCookie();
    this._getCities(this._changeCity.bind(this));

    this._dropBtn.addEventListener('click', (e) => {
      this._showDropContent(e);
    });

    this._orderButton.addEventListener('click', () => {
      modal.showModalForm();
    });
  }

  _showDropContent(e) {
    if ( this._dropContent.classList.contains('hidden') ) {
      this._dropContent.classList.remove('hidden');
      e.stopPropagation();
      document.addEventListener('click', function hideDropContent() {
        this._dropContent.classList.add('hidden');
        document.removeEventListener('click', hideDropContent);
      }.bind(this));
    }
  }

  _createList() {
    let list = this._dropContent.querySelector('ul');
    for ( let i = 0; i < this._cities.length; i++ ) {
      let li = document.createElement('li');
      li.innerHTML = this._cities[i].city;
      li.addEventListener('click', this._chooseCity.bind(this, i));
      list.appendChild(li);
    }
  }

  _changeCity() {
    let citySpan = this._dropBtn.querySelector('span');
    citySpan.innerHTML = this._cities[this._currentCityIndex].city;
    this._phoneElem.children[0].innerHTML = this._cities[this._currentCityIndex].code;
    this._phoneElem.children[1].innerHTML = this._cities[this._currentCityIndex].phone;
  }

  _chooseCity(i) {
    if ( this._currentCityIndex != i) {
      this._currentCityIndex = i;
      this._changeCity();
      document.cookie = 'cityIndex=' + i + '; path=/';
    }
  }

  _getCities(callBack) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/cities.json', true);
    xhr.send();

    xhr.onreadystatechange = () => {

      if ( xhr.status != 200 ) {
        console.log('error ' + xhr.readyState);
      }

      if (xhr.readyState == 4) {
        this._cities = JSON.parse(xhr.responseText);
        this._createList();
        callBack();
      }
    }
  }

  _getCityCookie() {
    let cityInd = document.cookie.match(/cityIndex=(\d+)/);

    if ( cityInd ) return cityInd[1];

    return 0;
  }
}


class Navigation {
  constructor(elem, modal) {
    this._elem = elem;
    this._menuList = elem.querySelectorAll('li');
    this._links = elem.querySelectorAll('li a');
    this._orderButton = elem.querySelector('button');
    this._menuButton = elem.querySelector('.menu-button');

    this._init(modal);
  }

  _init(modal) {
    this._handleScrolling();
    this._highlightActive();

    document.addEventListener('scroll', () => {
      this._handleScrolling();
    });

    this._menuButton.addEventListener('click', () => {
      this._menuList.forEach( (elem) => {
        elem.classList.toggle('display-block');
      });
    });

    this._orderButton.addEventListener('click', () => {
      modal.showModalForm();
    });
  }

  _highlightActive() {
    if ( window.location.pathname == '/' ) {
      this._links[0].classList.add('active');
      return;
    }
    this._links.forEach( (link) => {
      if ( link.getAttribute('href') == window.location.pathname ) {
        link.classList.add('active');
      }
    });
  }
  _handleScrolling() {
    if ( this._elem.getBoundingClientRect().top == 0 ) {
        this._addShadow();
        this._showOrderButton();
    } else {
        this._removeShadow();
        this._hideOrderButton();
    }
  }

  _hasShadow() {
    return this._elem.classList.contains('shadow');
  }

  _addShadow() {
    this._elem.classList.add('shadow');
  }
  _removeShadow() {
    this._elem.classList.remove('shadow');
  }

  _hasOrderButton() {
    return !this._orderButton.classList.contains('rotated');
  }
  _showOrderButton() {
    this._orderButton.parentElement.classList.remove('hidden');
    setTimeout(() => {
      this._orderButton.classList.remove('rotated');
    }, 0);
  }
  _hideOrderButton() {
    this._orderButton.classList.add('rotated');
    setTimeout(() => {
      this._orderButton.parentElement.classList.add('hidden');
    }, 200);
  }

  get links() {
    return this._links;
  }

}


class Footer {
  constructor(elem, navigation) {
    this._prevPageLink = elem.querySelector('.prev-page a');
    this._nextPageLink = elem.querySelector('.next-page a');

    this._navLinks = Array.from(navigation.links);
    this._activeLinkIndex = 0;
    this._activeLink = undefined;
    this._prevLink = undefined;
    this._nextLink = undefined;

    this._init();
  }

  _init() {
    this._setActiveLink();
    this._setPrevLink();
    this._setNextLink();
    this._adjustFooterNav();
  }

  _setActiveLink() {
    this._activeLink = this._navLinks.forEach((link, i) => {
      if ( link.classList.contains('active') ) {
        this._activeLinkIndex = i;
      }
    });
  }

  _setPrevLink() {
    let prevLinkIndex = (this._activeLinkIndex > 0) ? (this._activeLinkIndex - 1) : (this._navLinks.length - 1);
    this._prevLink = this._navLinks[prevLinkIndex];
  }

  _setNextLink() {
    let nextLinkIndex = (this._activeLinkIndex < this._navLinks.length - 1) ? (this._activeLinkIndex + 1) : 0;
    this._nextLink = this._navLinks[nextLinkIndex];
  }

  _adjustFooterNav() {
    this._prevPageLink.setAttribute('href', this._prevLink.getAttribute('href'));
    this._nextPageLink.setAttribute('href', this._nextLink.getAttribute('href'));

    this._prevPageLink.innerHTML = this._prevLink.innerHTML;
    this._nextPageLink.innerHTML = this._nextLink.innerHTML;
  }
}


class Portfolio {
  constructor(elem) {
    this._elem = elem;
    this._clients = [];

    this._getClients();
  }

  _createPortfolio() {

    for ( let client of this._clients ) {

      let clientCard = document.createElement('div');
      clientCard.classList.add('client-card');

      let header = document.createElement('h4');
      let img = document.createElement('img');
      let description = document.createElement('p');
      let link = document.createElement('a');

      header.innerHTML = client.name;
      img.src = client.image;
      img.alt = client.name;
      description.innerHTML = client.description;
      link.href = client.link;
      link.innerHTML = 'Перейти на сайт клиента &rarr;';

      clientCard.appendChild(header);
      clientCard.appendChild(document.createElement('hr'));
      clientCard.appendChild(img);
      clientCard.appendChild(description);
      clientCard.appendChild(link);
      this._elem.appendChild(clientCard);
    }
  }

  _getClients() {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'clients.json');
    xhr.onload = () => {
      this._clients = JSON.parse(xhr.responseText);
      this._createPortfolio();
    }
    xhr.onerror = (err) => {
      console.log('error!');
    };
    xhr.send();
  }
}


class Slider {
  constructor(elem) {
    this._elem = elem;

    this._init(elem);
  }

  _init(elem) {
    this._scroll(this._elem.clientWidth/2);
  }

  _scroll(direction) {
    setTimeout(() => {
      this._elem.scrollLeft += direction;

      if ( this._elem.scrollLeft == (this._elem.scrollWidth) - this._elem.clientWidth) {
        direction = -this._elem.clientWidth/2;
      }
      if ( this._elem.scrollLeft == 0 ) {
        direction = this._elem.clientWidth/2;
      }
      this._scroll(direction);
    }, 3000);
  }
}


class Modal {
  constructor() {
    this._modalForm = this._createModalForm();
    this._modalMessage = this._createModalMessage();

    this._init();
  }

  _init() {
    this._initForms();
  }

  _initForms() {
    document.onsubmit = (e) => {
      console.log(e.target.name)
      if ( e.target.name = 'order-form') {
        this.hideModalForm();
        this.showModalMessage('Спасибо за обращение! Мы свяжемся в Вами в ближайшее время')
        return false;
      }
    };
  }

  _createModalForm() {
    let modal = document.createElement('div');
    modal.classList.add('modal', 'hidden');
    modal.onclick = (e) => {
      if ( e.target == modal ) this.hideModalForm();
    };

    let modalFrame = document.createElement('div');
    modalFrame.classList.add('order-form');

    let closerWrapper = document.createElement('div');
    closerWrapper.classList.add('closer-wrapper');

    let closer = document.createElement('button');
    closer.innerHTML = '&times;';
    closer.onclick = this.hideModalForm.bind(this);

    let form = document.createElement('form');
    form.setAttribute('name','order-form');

    let header = document.createElement('h1');
    header.innerHTML = 'ЗАКАЗАТЬ УСЛУГУ';

    let p = document.createElement('p');
    p.innerHTML = 'Заполните форму заказа и мы обязательно с вами свяжемся';

    let email = document.createElement('input');
    email.setAttribute('placeholder', 'E-mail');

    let name = document.createElement('input');
    name.setAttribute('placeholder', 'Ваше имя');

    let phone = document.createElement('input');
    phone.setAttribute('placeholder', 'Номер телефона');

    let comment = document.createElement('textarea');
    comment.setAttribute('placeholder', 'Комментарий');

    let sbmt = document.createElement('input');
    sbmt.setAttribute('type', 'submit');
    sbmt.value = 'Отправить';


    document.body.appendChild(modal).appendChild(modalFrame).appendChild(closerWrapper)
      .appendChild(closer);

    modalFrame.appendChild(form).appendChild(header)
      .parentElement.appendChild(p)
      .parentElement.appendChild(email)
      .parentElement.appendChild(name)
      .parentElement.appendChild(phone)
      .parentElement.appendChild(comment)
      .parentElement.appendChild(sbmt);

    return modal;
  }

  _createModalMessage() {
    let modal = document.createElement('div');
    modal.classList.add('modal', 'hidden');
    modal.onclick = (e) => {
      if ( e.target == modal ) this.hideModalMessage();
    };

    let frame = document.createElement('div');
    frame.classList.add('message-frame');

    let message = document.createElement('p');
    message.classList.add('message-text');

    let closer = document.createElement('button');
    closer.innerHTML = 'OK';

    closer.onclick = this.hideModalMessage.bind(this);

    document.body.appendChild(modal).appendChild(frame).appendChild(message)
      .parentElement.appendChild(closer);

    return modal;
  }

  showModalForm() {
    this._modalForm.classList.remove('hidden');
  }
  hideModalForm() {
    this._modalForm.classList.add('hidden');
  }

  showModalMessage(message) {
    this._modalMessage.querySelector('.message-text').innerHTML = message;
    this._modalMessage.classList.remove('hidden');
  }
  hideModalMessage() {
    this._modalMessage.querySelector('.message-text').innerHTML = '';
    this._modalMessage.classList.add('hidden');
  }
}
