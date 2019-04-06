"use strict"

class TableModifier {
  constructor(table) {
    this._table = table;
    this._headRow = table.querySelector('tr:first-child');
    this._rows = table.querySelectorAll('tr');
    this._dataRows = table.querySelectorAll('tr:not(:first-child)');

    this._getRidOfTbody(table, this._rows);
    this._initColDrag(this._table, this._headRow);
    this._initColSort(this._table, this._headRow, this._rows, this._dataRows);
  }

  static modify(table) {
    new TableModifier(table);
  }

  _initColSort(table, headRow, rows, dataRows) {

    for (let cell of headRow.children) {

      cell.addEventListener('mousedown', () => {
        cell.style.boxShadow = 'inset 0 0 1px 1px grey';
      });
      cell.addEventListener('mouseup', () => {
        cell.style.boxShadow = 'initial';
      });
      cell.addEventListener('dragstart', () => {
        cell.style.boxShadow = 'initial';
      });

      cell.addEventListener('click', () => {
        let index = this.getIndex(cell, headRow.children);
        this._sort(table, cell, index, headRow);
      });
    }
  }

  _sort(table, cell, index, headRow) {
    let dataRows = this._dataRows;
    let col = this.getCol(index);
    let colHTMLs = [];

    col.splice(0, 1);
    col.forEach((e,i,arr) => {
      colHTMLs.push(e.innerHTML);
    });

    if ( cell.classList.contains('sorted') ) {
      colHTMLs.sort().reverse();

      if ( cell.classList.contains('sorted-straight') ) {
        colHTMLs.sort().reverse();
        cell.classList.remove('sorted-straight');
        cell.classList.add('sorted-reverse');
      } else if ( cell.classList.contains('sorted-reverse') ) {
        colHTMLs.sort();
        cell.classList.add('sorted-straight');
        cell.classList.remove('sorted-reverse');
      }

    } else {
      colHTMLs.sort();
      this._clearClass(headRow.children, cell, 'sorted-straight');
      this._clearClass(headRow.children, cell, 'sorted-reverse');
      this._clearClass(headRow.children, cell, 'sorted');
      cell.classList.add('sorted');
      cell.classList.add('sorted-straight');
    }

    this.setRows(table.querySelectorAll('tr'));

    colHTMLs.forEach((html) => {
      for (let tr of dataRows) {
        if (tr.children[index].innerHTML == html) {
          table.appendChild(tr);
          break;
        }
      }
    });
  }

  _initColDrag(table, headRow) {
    let draggedElem;

    for (let i = 0; i < headRow.children.length; i++) {

      let cell = headRow.children[i];

      cell.draggable = 'true';

      cell.ondragstart = (e) => {
        draggedElem = cell;
        cell.style.opacity = '.7';
        this._markCol(cell, headRow, '#ddd');
      };

      cell.ondragend = (e) => {
        this._markCol(cell, headRow, 'initial');
      }

      cell.ondragover = (e) => {
        e.preventDefault();
      };

      cell.ondragenter = (e) => {
        let method = '';

        if (draggedElem.getBoundingClientRect().left < cell.getBoundingClientRect().left) {
          this._moveCol(cell, draggedElem, headRow, 'afterend');
        } else {
          if (draggedElem.getBoundingClientRect().left > cell.getBoundingClientRect().left) {
            this._moveCol(cell, draggedElem, headRow, 'beforebegin');
          };
        };
      }

      cell.ondragleave = (e) => {
        cell.style.opacity = '1';
      }

      cell.ondrop = (e) => {
        cell.style.opacity = '1';
      };
    }
  }

  _clearClass(col, elem, cssClass) {
    for (let el of col) {
      if (el.classList.contains(cssClass)){
        el.classList.remove(cssClass);
      }
    }
  }

  _moveCol(dropped, dragged, headRow, method) {
    let droppedCol = this.getCol(this.getIndex(dropped, headRow.children));
    let draggedCol = this.getCol(this.getIndex(dragged, headRow.children));

    for (let i = 0; i < draggedCol.length; i++) {
      droppedCol[i].insertAdjacentElement(method, draggedCol[i]);
    }
  }

  getIndex(cell, collection) {
    let index;
    for (let i = 0; i < collection.length; i++) {
      if ( collection[i] == cell ) {
        index = i;
        break;
      }
    };

    return index;
  }

  getCol(index) {
    let col = [];
    for (let i = 0; i < this._rows.length; i++) {
      col.push(this._rows[i].children[index]);
    }
    return col;
  }

  _markCol(cell, headRow, color) {
    let col = this.getCol(this.getIndex(cell, headRow.children));
    for (let i = 1; i < col.length; i++) {
      col[i].style.backgroundColor = color;
    }
  }

  getRows() {
    return this._dataRows;
  }

  setRows(rows) {
    this._rows = rows;
  }

  getRow(cell) {
    return cell.closest('tr');
  }

  _getRidOfTbody(table, rows) {
    let tb = table.querySelector('tbody');
    for (let row of rows) {
      table.insertBefore(row, tb);
    }
    table.removeChild(tb);
  }
}

TableModifier.modify(document.querySelector('table'));
