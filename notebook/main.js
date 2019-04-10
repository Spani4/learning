"use strict"

class Notebook {
  constructor(elem) {
    this._field = elem;

    this._btnAdd = elem.querySelector("button.add");
    this._btnSave = elem.querySelector("button.save");
    this._btnEdit = elem.querySelector("button.edit");
    this._btnDel = elem.querySelector("button.del");

    this._noteList = elem.querySelector('.list');
    this._editField = elem.querySelector('.edit-note');
    this._viewField = elem.querySelector('.view');
    this._textBlock = this._viewField.querySelector('.text');

    this._entries = [];

    this._init(this._field, this._noteList, this._editField, this._viewField, this._textBlock, this._btnAdd, this._btnSave, this._btnEdit, this._btnDel);
    }


    _init(field, noteList, editField, viewField, textBlock, btnAdd, btnSave, btnEdit, btnDel) {

      let input = editField.querySelector('input');
      let textarea = editField.querySelector('textarea');

      viewField.style.display = 'block';
      editField.style.display = 'none';

      btnAdd.addEventListener('click', () => {
        this._switchFields(editField, viewField);
        this._switchActive(null, noteList);
        input.focus();
        input.value = '';
        textarea.value = '';
        textBlock.innerHTML = '';
      });

      btnSave.addEventListener('click', () => {
        this._switchFields(editField, viewField);

        if ( this.getActiveNote() ) {
          let i = this.getActiveIndex();
          this._entries[i].caption = input.value;
          this._entries[i].text = textarea.value;
          noteList.children[i].innerHTML = input.value;
          textBlock.innerHTML = this._entries[i].text;
          this.saveNotes();

        } else {
          if ( input.value || textarea.value ) {
            let noteObj = {};
            noteObj.caption = input.value ;
            noteObj.text = textarea.value;
            this._entries.push(noteObj);

            this._createNote(noteList, textBlock, input.value, textarea.value, editField, viewField);
            this._clearEditFields();
            this.saveNotes();
          }
        }
      });

      btnEdit.addEventListener('click', () => {
        this._switchFields(editField, viewField);
        input.focus();
        let i = this.getActiveIndex();
        input.value = this._entries[i].caption;
        textarea.value = this._entries[i].text;
      });

      btnDel.addEventListener('click', () => {
        let i = this.getActiveIndex();
        this._deleteNote(i);
      });

      viewField.addEventListener('wheel', (e) => {
        viewField.scrollTop += e.deltaY;
      });

      window.addEventListener('load', () => {
        this.loadNotes(noteList, textBlock, editField, viewField);
      });

    }

    _createNote(noteList, textBlock, caption, text, editField, viewField) {

      let note = document.createElement('a');
      note.innerHTML = caption;
      note.classList.add('note');
      noteList.appendChild(note);

      note.addEventListener('click', () => {
        if ( viewField.style.display == 'none') {
          this._switchFields(viewField, editField);
        }

        if ( !note.classList.contains('active') ) {
          this._switchActive(note, noteList);
        }
        textBlock.innerHTML = this._entries[[...noteList.children].indexOf(note)].text;
      });
    }

    _switchActive(note, noteList) {
      for (let note of noteList.children) {
        note.classList.remove('active');
      };
      if ( note ) {
        note.classList.add('active');
      }
    }

    _clearEditFields() {
      this._editField.querySelector('input').value = '';
      this._editField.querySelector('textarea').value = '';
    }

    _switchFields() {

      if ( this._viewField.style.display == 'none' ) {
        this._viewField.style.display = 'block';
        this._btnEdit.style.display = 'block';
        this._btnDel.style.display = 'block';

        this._editField.style.display = 'none';
      } else {
        this._viewField.style.display = 'none';
        this._btnEdit.style.display = 'none';
        this._btnDel.style.display = 'none';

        this._editField.style.display = 'block';
      }


      console.log()
    }

    _deleteNote(i) {
      this._noteList.removeChild(this._noteList.children[i]);
      this._entries.splice(i, 1);
      this.saveNotes();
      this._textBlock.innerHTML = '';
    }

    saveNotes() {
      localStorage.setItem('notebook-notes', JSON.stringify(this._entries));
    }

    getEntries() {
      return this._entries;
    }

    getActiveNote() {
      for (let note of this._noteList.children) {
        if ( note.classList.contains('active') ) {
          return note;
        }
      }
      return false;
    }

    getActiveIndex() {
      return [...this._noteList.children].indexOf(this.getActiveNote());
    }

    loadNotes(noteList, textBlock, editField, viewField) {
      this._entries = JSON.parse(localStorage.getItem('notebook-notes'));

      let arr = this.getEntries();
      for (let i = 0; i < arr.length; i++) {
        this._createNote(noteList, textBlock, arr[i].caption, arr[i].text, editField, viewField);
      }
    }

    static init(elem) {
      new Notebook(elem);
    }
}

Notebook.init(document.querySelector('#notebook'));
