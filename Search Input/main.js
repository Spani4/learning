"use strict"

class PageSearch {
  constructor(input) {
    this._input = input;

    // для начала решил попробовать реализовать поиск хотя бы в одном блоке,
    // а не по всей странице
    this._textField = document.querySelector('.text');

    this._init(input, this._textField);
  }

  _init(input, field) {
    // регулярки для оборачивания найденного в тэг <mark>
    let regLT = new RegExp('_openMarkFound_', 'g');
    let regGT = new RegExp('_closeMarkFound_', 'g');
    let regLTreverse = new RegExp('<mark class="found">', 'g');
    let regGTreverse = new RegExp('</mark>', 'g');



    let initialFieldHTML = field.innerHTML; //не пригодилось
    let fieldHTML = field.innerHTML; //не пригодилось
    let fieldHTMLmarked = ''; //не пригодилось


    // собрал в массив все текстовые узлы (nodeType == 3)
    // и массив их содержимого для хранения изначального содержимого каждого узла
    let pageTextNodes = [];
    let texts = [];

    this._collectNodes(field, pageTextNodes);
    texts = pageTextNodes.map((el, i, arr) => {
      return el.data;
    });



    input.addEventListener('keyup', (e) => {
      let str = input.value;

      if ( str ) {
        let reg = new RegExp('(' + str + ')', 'gi');

        for (let i = 0; i < texts.length; i++) {
          //оборачиваем найденное в текстовых узлах в самодельные метки, ибо знаки < и > он в теги не првращает
          pageTextNodes[i].data = texts[i].replace(reg, '_openMarkFound_$1_closeMarkFound_');
        }


        // самодельные теги меняем на нормальные ХТМЛ
        field.innerHTML = field.innerHTML.replace(regLT, '<mark class="found">').replace(regGT, '</mark>');
        // в итоге после первого нажатия найденное помечается фоном, а после второго - ничего
        // data внутри текстовых узлов меняется как надо, а innerHTML элемента остается прежним
        // логика здесь осталась для меня загадкой




        // альернатива предыдущей строке, была удобная для отладки:
        // fieldHTML = field.innerHTML;
        // fieldHTMLmarked = field.innerHTML.replace(regLT, '<mark class="found">').replace(regGT, '</mark>');
        // field.innerHTML = fieldHTMLmarked;
        // console.log(fieldHTML);
        // console.log(fieldHTMLmarked);

      }

    });
  }

  _collectNodes(elem, arr) {

    let nodes = elem.childNodes;
    for (let i = 0; i < nodes.length; i++)  {
      // если узел, собираем
      if ( (nodes[i].nodeType == 3) && (Boolean(nodes[i].data.trim())) ) {
        arr.push(nodes[i]);
      }
      // если ДОМ элемент, углябляемся с рекурсией
      if ( (nodes[i].nodeType == 1) ) {
        this._collectNodes(nodes[i], arr);
      }

    }
  }
}

let searchInput = new PageSearch(document.querySelector('input'));
