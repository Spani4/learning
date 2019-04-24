"use strict"

class DateInterval {
  constructor(field, firstDay = 'mon', lang = 'en') {
    this._field = field;
    this._table = document.createElement('table');
    this._firstDayCorrection = this._getFirstDayCorrection(firstDay);
    this._dayNames = this._getDayNames(lang, this._firstDayCorrection);
    this._monthNames = this._getMonthNames(lang);
    this._today = this._getDdMmYyyy();
    this._startDate = '';
    this._endDate = '';

    this._results = {
      startDate: Date.now(),
      endDate: Date.now(),
      interval: '',
      tdFrom: {},
      tdTo: {},
      tdInterval: {},
    }

    this._calculateInterval();
    this._init(field, this._table);
  }

  _init(field, table) {

    let date = new Date();

    this._createNav(field, table, date);
    this._createTable(field, table, date)
    this._createResultsTable(field);

  }

  _createNav(field, table, date) {
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
      this._createTable(field, table, date);
    });

    nextMonthLink.addEventListener('click', () => {
      date.setMonth(date.getMonth() + 1);
      spanMonth.innerHTML = this._monthNames[date.getMonth()];
      table.innerHTML = '';
      this._createTable(field, table, date);
    });

    prevYearLink.addEventListener('click', () => {
      date.setYear(date.getFullYear() - 1);
      spanYear.innerHTML = date.getFullYear();
      table.innerHTML = '';
      this._createTable(field, table, date);
    });

    nextYearLink.addEventListener('click', () => {
      date.setYear(date.getFullYear() + 1);
      spanYear.innerHTML = date.getFullYear();
      table.innerHTML = '';
      this._createTable(field, table, date);
    });
  }

  _createTable(field, table, date) {
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
          monthCorrection = -1;
        } else if ( i > days ){
          k++;
          td.innerHTML = k;
          td.classList.add('half-opacity');
          monthCorrection = 1;
        } else {
          td.innerHTML = i;
          monthCorrection = 0;
        }
        if ( i == this._today.date &&  date.getMonth() == this._today.month && date.getFullYear() == this._today.year) {
          td.classList.add('today');
        }
        tr.appendChild(td);

        this._bindActions(field, td, currentMonth, monthCorrection);
      }
    }
  }

  _createResultsTable(field) {

    let table = document.createElement('table')
    table.classList.add('interval');
    field.appendChild(table);

    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let tdFrom = document.createElement('td');
    tdFrom.classList.add('from');
    tdFrom.title = 'click to clear';
    td.innerHTML = 'From:';
    table.appendChild(tr);
    tr.appendChild(td);
    tr.appendChild(tdFrom);

    tr = document.createElement('tr');
    td = document.createElement('td');
    let tdTo = document.createElement('td');
    tdTo.classList.add('to');
    tdTo.title = 'click to clear';
    td.innerHTML = 'To:';
    table.appendChild(tr);
    tr.appendChild(td);
    tr.appendChild(tdTo);

    tr = document.createElement('tr');
    td = document.createElement('td');
    let tdInterval = document.createElement('td');
    tdInterval.classList.add('interval');
    td.innerHTML = 'Interval:';
    table.appendChild(tr);
    tr.appendChild(td);
    tr.appendChild(tdInterval);

    for ( let cell of [tdFrom, tdTo] ) {
      cell.addEventListener('click', () => {
        cell.innerHTML = '';
        tdInterval.innerHTML = '';
      });
    }

    [this._results.tdFrom, this._results.tdTo, this._results.tdInterval] = [tdFrom, tdTo, tdInterval];
  }

  _bindActions(field, td, date, i) {

    td.addEventListener('click', (e) => {

      if ( !this._results.tdFrom.innerHTML ) {
        this._results.tdFrom.innerHTML = this._addZero(td.innerHTML) + '.' + this._addZero(date.getMonth() + i) + '.' + date.getFullYear();
        this._results.startDate = new Date(date.getFullYear(), date.getMonth() + i, td.innerHTML);
      } else {
        this._results.tdTo.innerHTML = this._addZero(td.innerHTML) + '.' + this._addZero(date.getMonth() + i) + '.' + date.getFullYear();
        this._results.endDate = new Date(date.getFullYear(), date.getMonth() + i, td.innerHTML);
      }

      if ( this._results.tdFrom.innerHTML && this._results.tdTo.innerHTML) {
        this._calculateInterval();
        this._results.tdInterval.innerHTML = this._results.interval;
      }
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

  _calculateInterval() {
    this._results.interval =  Math.abs( this._results.startDate - this._results.endDate )/60/60/24000;
  }

  _addZero(n) {
    if ( String(n).length < 2 ) {
      return '0' + n;
    } else {
      return n;
    }
  }

  static init(field, firstDay, lang) {
    new DateInterval(field, firstDay, lang);
  }
}

DateInterval.init(document.querySelector('#interval-calendar'), '', 'en');
