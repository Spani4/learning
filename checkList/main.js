"use strict"

class CheckList {
  constructor(field) {
    this._field = field;
    this._taskFieldPrototype = field.querySelector('.prototype');
    this._tasks = this._loadTasks();

    this._init(field);
  }

  _init(field) {
    let addTextarea = field.querySelector('.new-task textarea');
    let addBtn = field.querySelector('.new-task button');

    this._displayTasks(field);

    addBtn.addEventListener('click', () => {
      let text = addTextarea.value;
      if ( text ) {
        this._tasks.push({text: addTextarea.value, done: false});
        this._saveTasks();
        this._displayTasks(field);
        addTextarea.value = '';
        console.log(this._tasks);
      }
    });
  }

  _displayTasks(field) {
    let taskList = field.querySelector('.task-list');
    taskList.innerHTML = '';

    for (let task of this._tasks) {

      let newTask = this._taskFieldPrototype.cloneNode(true);
      let doneBtn = newTask.querySelector('button');

      newTask.classList.remove('prototype');
      newTask.querySelector('p.text').innerHTML = task.text;
      taskList.appendChild(newTask);

      if ( task.done ) {
        newTask.classList.add('done');
      }

      doneBtn.addEventListener('click', () => {
        doneBtn.parentElement.classList.add('done');
        task.done = true;
        this._saveTasks();
      });
    }
  }

  _saveTasks() {
    localStorage.setItem('checklist-tasks', JSON.stringify(this._tasks));
  }

  _loadTasks() {
    return JSON.parse(localStorage.getItem('checklist-tasks')) || [];
  }

  static init(el) {
    new CheckList(el);
  }
}

CheckList.init(document.querySelector('#checklist'));
