"use strict"

class InputCalendar {
  constructor(input, firstDay = 'mon', lang = 'en') {
    this._input = input;
    // this._width = input.offsetWidth;
    this._field = document.createElement('div');
    this._table = document.createElement('table');
    this._firstDayCorrection = this._getFirstDayCorrection(firstDay);
    this._dayNames = this._getDayNames(lang, this._firstDayCorrection);
    this._monthNames = this._getMonthNames(lang);
    this._today = this._getDdMmYyyy();

    this._init(input, this._field, this._table);
  }

  _init(input, field, table) {
    let date = new Date();
    let inputCoords = input.getBoundingClientRect();
    let display = 'none';

    document.body.appendChild(field);
    field.classList.add('input-calendar');
    field.style.width = inputCoords.width + 'px';
    field.style.left = inputCoords.left + 'px';
    field.style.top = inputCoords.bottom + 'px';

    this._createNav(input, field, table, date);
    this._createTable(input, field, table, date)

    input.addEventListener('click', (e) => {
      e.stopPropagation();
      if ( display == 'none' ) {
        display = 'block';
      } else {
        display = 'none';
      }
      field.style.display = display;
    });

    document.addEventListener('click', () => {
      display = 'none';
      field.style.display = display;
    });

  }

  _createNav(input, field, table, date) {
    let navYear = document.createElement('div')
    let navMonth = document.createElement('div')
    let prevYearLink = document.createElement('a');
    let prevMonthLink = document.createElement('a');
    let spanYear = document.createElement('span');
    let spanMonth = document.createElement('span');
    let nextMonthLink = document.createElement('a');
    let nextYearLink = document.createElement('a');

    navYear.classList.add('nav');
    navMonth.classList.add('nav');
    prevYearLink.classList.add('prev');
    nextYearLink.classList.add('next');
    prevMonthLink.classList.add('prev');
    nextMonthLink.classList.add('next');

    prevYearLink.innerHTML = '&#x276E';
    prevMonthLink.innerHTML = '&#x276E';
    spanYear.innerHTML = date.getFullYear();
    spanMonth.innerHTML = this._monthNames[date.getMonth()];
    nextYearLink.innerHTML = '&#x276F';
    nextMonthLink.innerHTML = '&#x276F';

    navYear.appendChild(prevYearLink);
    navYear.appendChild(spanYear);
    navYear.appendChild(nextYearLink);

    navMonth.appendChild(prevMonthLink);
    navMonth.appendChild(spanMonth);
    navMonth.appendChild(nextMonthLink);

    field.appendChild(navMonth);
    field.appendChild(table);
    field.appendChild(navYear);

    prevMonthLink.addEventListener('click', () => {
      date.setMonth(date.getMonth() - 1);
      spanMonth.innerHTML = this._monthNames[date.getMonth()];
      table.innerHTML = '';
      this._createTable(input, field, table, date);
    });

    nextMonthLink.addEventListener('click', () => {
      date.setMonth(date.getMonth() + 1);
      spanMonth.innerHTML = this._monthNames[date.getMonth()];
      table.innerHTML = '';
      this._createTable(input, field, table, date);
    });

    prevYearLink.addEventListener('click', () => {
      date.setYear(date.getFullYear() - 1);
      spanYear.innerHTML = date.getFullYear();
      table.innerHTML = '';
      this._createTable(input, field, table, date);
    });

    nextYearLink.addEventListener('click', () => {
      date.setYear(date.getFullYear() + 1);
      spanYear.innerHTML = date.getFullYear();
      table.innerHTML = '';
      this._createTable(input, field, table, date);
    });
  }

  _createTable(input, field, table, date) {
    // create head
    let tr = document.createElement('tr');
    let arr = this._dayNames;
    table.appendChild(tr);
    for (let i = 0; i < 7; i++) {
      let th = document.createElement('th');
      th.innerHTML = arr[i];
      tr.appendChild(th);
    }

    // create calendar grid
    let currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let days = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
    let prevMonthDdays = (new Date(date.getFullYear(), date.getMonth(), 0)).getDate();
    let monthCorrection;

    let i = this._firstDayCorrection - currentMonth.getDay();
    ( i > 1 )?  i -= 7  : {};
    while (i <= days) {
      let tr = document.createElement('tr');
      table.appendChild(tr);

      for (let j = 0, k = 0; j < 7; j++, i++) {
        let td = document.createElement('td');
        if ( i <= 0 ) {
          td.innerHTML = prevMonthDdays + i;
          td.classList.add('half-opacity');
          monthCorrection = 0;
        } else if ( i > days ){
          k++;
          td.innerHTML = k;
          td.classList.add('half-opacity');
          monthCorrection = 2;
        } else {
          td.innerHTML = i;
          monthCorrection = 1;
        }
        if ( i == this._today.date &&  date.getMonth() == this._today.month && date.getFullYear() == this._today.year) {
          td.classList.add('today');
        }
        tr.appendChild(td);

        this._bindActions(input, field, td, currentMonth, monthCorrection);
      }
    }
  }

  _bindActions(input, field, td, date, i) {

    field.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    td.addEventListener('click', (e) => {
      input.value = this._addZero(td.innerHTML) + '.' + this._addZero(date.getMonth() + i) + '.' + date.getFullYear();
    });

    td.addEventListener('dblclick', (e) => {
      input.value = this._addZero(td.innerHTML) + '.' + this._addZero(date.getMonth() + i) + '.' + date.getFullYear();
      field.style.display = 'none';
    });
  }

  _getFirstDayCorrection(str) {
    str = str.toLocaleLowerCase();
    if ( str == 'sun' || str == 'вс') {
      return 1;
    } else {
      return 2;
    }
  }

  _getDayNames(lang, i) {
    lang = lang.toLowerCase();
    let ru =[], en = [];
    if ( i == 2 ) {
      ru = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
      en = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    } else {
      ru = ['Вс', 'Пн','Вт','Ср','Чт','Пт','Сб'];
      en = ['Sun', 'Mon','Tue','Wed','Thu','Fri','Sat'];
    }
    if ( lang == 'ru' || lang =='рус') {
      return ru;
    } else {
      return en
    }
  }

  _getMonthNames(lang) {
    if ( lang == 'ru' || lang =='рус') {
      return ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    } else {
      return ['January','February','March','April','May','June','July','August','Semptember','October','November','December'];
    }
  }

  _getDdMmYyyy() {
    let date = new Date();
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    }
  }

  _addZero(n) {
    if ( String(n).length < 2 ) {
      return '0' + n;
    } else {
      return n;
    }
  }

  static init(input, firstDay, lang) {
    new InputCalendar(input, firstDay, lang);
  }
}

InputCalendar.init(document.querySelector('input.date'), '', 'en');
