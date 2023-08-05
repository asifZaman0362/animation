let rows = [];
let active_cols = [];
let active_x = undefined;
let active_y = undefined;

function createElement(type, classes, text, id) {
  const element = document.createElement(type);
  element.innerHTML = text;
  if (classes) {
    classes.map(className => element.classList.add(className));
  }
  if (id) element.id = id;
  return element;
}

function createTable(parent) {
  const row = document.createElement("div");
  row.classList.add('row');
  row.appendChild(
    createElement(
      'span', 
      ['table-letter', 'table-letter-head', 'empty'], 
      '0', 
      null
    ));
  for (let i = 0; i < 26; i++) {
    let colHead = createElement(
      'span', 
      ['table-letter', 'table-letter-head'], 
      String.fromCharCode(i + 65), 
      'col' + i
    );
    colHead.onclick = () => scrollVerticalTo(i);
    row.appendChild(colHead);
  }
  parent.appendChild(row);
  for (let i = 0; i < 26; i++) {
    const row = document.createElement("div");
    row.id = "row" + i;
    row.classList.add('row');
    const letter = createElement(
      'span', 
      ['table-letter', 'table-letter-head'], 
      String.fromCharCode(i + 65),
      null);
    letter.onclick = () => scrollHorizontalTo(i);
    row.appendChild(letter);
    for (let j = 0; j < 26; j++) {
      const char = ((j + i) % 26) + 65;
      const letter = createElement(
        'span', 
        ['table-letter'], 
        String.fromCharCode(char),
        null);
      letter.setAttribute('style', '--char-index: ' + (i * 26 + j));
      row.appendChild(letter);
    }
    parent.appendChild(row);
    rows.push(row);
  }
}

function createHandles() {
  let head = document.querySelector('#col0');
  const handleVert = createElement('div', ['handle'], '', 'vertical');
  let rect = head.getBoundingClientRect();
  const top = (rect.y - 3) + "px";
  let computed = window.getComputedStyle(head);
  handleVert.style.width = rect.width + parseInt(computed.marginLeft) + parseInt(computed.marginRight) + "px";
  handleVert.style.height = ((rect.height + parseInt(computed.marginTop) 
    + parseInt(computed.marginBottom)) * 27) + "px";
  handleVert.style.top = top;
  handleVert.style.left = rect.left - 3 + "px";
  handleVert.classList.add('shrunk');
  document.body.appendChild(handleVert);
  let row = document.querySelector('#row0');
  rect = row.getBoundingClientRect();
  computed = window.getComputedStyle(row);
  const handleHorizontal = createElement('div', ['handle'], '', 'horizontal');
  handleHorizontal.style.width = rect.width + "px";
  handleHorizontal.style.height = rect.height + 1 + "px";
  handleHorizontal.style.left = rect.left - 1 + "px";
  handleHorizontal.style.top = rect.top - 1 + "px";
  handleHorizontal.classList.add('shrunk');
  document.body.appendChild(handleHorizontal);
}

function scrollVerticalTo(col) {
  document.querySelector('.target')?.classList.remove('target');
  for (let i = 0; i < active_cols.length; i++) {
    active_cols[i].classList.remove('active');
  }
  active_cols = [];
  const handleVert = document.querySelector('#vertical');
  let head = document.querySelector('#col' + col);
  let rect = head.getBoundingClientRect();
  const top = (rect.y - 3) + "px";
  handleVert.style.left = rect.left - 3 + "px";
  handleVert.style.top = top;
  handleVert.classList.remove('hidden');
  for (let i = 0; i < rows.length; i++) {
    rows[i].children[col + 1].classList.add('active');
    active_cols.push(rows[i].children[col + 1]);
  }
  active_x = col;
  if (active_y && active_x) {
    document.querySelector('#row' + active_y).children[active_x + 1].classList.add('target');
  }
}

function scrollHorizontalTo(row) {
  document.querySelector('.target')?.classList.remove('target');
  document.querySelector('.row.active')?.classList.remove('active');
  const handleHorizontal = document.querySelector('#horizontal');
  let head = document.querySelector('#row' + row);
  let rect = head.getBoundingClientRect();
  handleHorizontal.style.left = rect.left - 1 + "px";
  handleHorizontal.style.top = rect.top - 1 + "px";
  handleHorizontal.classList.remove('hidden');
  head.classList.add('active');
  active_y = row;
  if (active_y && active_x) {
    document.querySelector('#row' + active_y).children[active_x + 1].classList.add('target');
  }
}

function showHandles() {
  document.querySelector('#vertical').classList.remove('shrunk');
  document.querySelector('#horizontal').classList.remove('shrunk');
}

function splitAndClean(target) {
  Splitting();
  setTimeout(() => target.classList.add('clean'), 1000);
}

function init() {
  const parent = document.querySelector("#text");
  createTable(parent);
  setTimeout(createHandles, 6000);
  setTimeout(showHandles, 6500);
  let textContainer = createElement('div', ['text-container'], '', '');
  document.body.appendChild(textContainer);
  let text = createElement('span', ['plaintext'], '', '');
  text.setAttribute('data-splitting', '');
  textContainer.appendChild(text);
  const _text = "Some random text";
  for (let x = 0; x < _text.length; x++) {
    setTimeout(() => text.innerHTML += _text.charAt(x), (x + 1) * 200);
  }
  setTimeout(() => splitAndClean(text), _text.length * 200 + 200);
}

init();
