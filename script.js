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
  const handleVert = document.querySelector('#vertical');
  let head = document.querySelector('#col' + col);
  let rect = head.getBoundingClientRect();
  const top = (rect.y - 3) + "px";
  handleVert.style.left = rect.left - 3 + "px";
  handleVert.style.top = top;
  handleVert.classList.remove('hidden');
  active_x = col;
  if (active_y != undefined && active_x != undefined) {
    document.querySelector('#row' + active_y).children[active_x + 1].classList.add('target');
  }
}

function scrollHorizontalTo(row) {
  document.querySelector('.target')?.classList.remove('target');
  const handleHorizontal = document.querySelector('#horizontal');
  let head = document.querySelector('#row' + row);
  let rect = head.getBoundingClientRect();
  handleHorizontal.style.left = rect.left - 1 + "px";
  handleHorizontal.style.top = rect.top - 1 + "px";
  handleHorizontal.classList.remove('hidden');
  head.classList.add('active');
  active_y = row;
  if (active_y != undefined && active_x != undefined) {
    document.querySelector('#row' + active_y).children[active_x + 1].classList.add('target');
  }
}

function showHandles() {
  document.querySelector('#vertical').classList.remove('shrunk');
  document.querySelector('#horizontal').classList.remove('shrunk');
}

function splitAndClean(target) {
  target.setAttribute('data-splitting', '');
  Splitting();
  setTimeout(() => target.classList.add('clean'), 1000);
}

function typewriter(parent, text, after) {
  for (let x = 0; x < text.length; x++) {
    setTimeout(() => parent.innerHTML += text.charAt(x), (x + 1) * 200);
  }
  setTimeout(after, text.length * 200 + 100);
}

function expandKey(plaintext, key, keystring) {
  let diff = plaintext.length - keystring.length;
  let keyphrase = keystring;
  for (let x = 0; x < diff; x++) {
    key.appendChild(createElement('span', ['char'], keystring.charAt(x % keystring.length), ''));
    keyphrase += keystring.charAt(x % keystring.length);
  }
  return keyphrase;
}

function encrypt(plaintextelement, key, plaintext, keyphrase) {
  let p = [], k = [];
  let ciphertextContainer = createElement('span', ['text-row'], '', '');
  document.querySelector('.text-container').appendChild(ciphertextContainer);
  ciphertextContainer.appendChild(createElement('pre', ['label'], 'ciphertext:', ''));
  let ciphertext = createElement('span', '', '', '');
  ciphertextContainer.appendChild(ciphertext);
  plaintextelement = plaintextelement.querySelectorAll('.char');
  key = key.querySelectorAll('.char');
  for (let x = 0; x < plaintextelement.length; x++) {
    let y = plaintextelement[x];
    if (y.classList.contains('space')) continue;
    else p.push(y);
  }
  console.debug(p);
  for (let x = 0; x < key.length; x++) {
    let y = key[x];
    if (y.classList.contains('space')) continue;
    else k.push(y);
  }
  for (let x = 0; x < plaintext.length; x++) {
    setTimeout(() => {
      if (x > 0) {
        p[x - 1].classList.remove('selected');
        k[x - 1].classList.remove('selected');
      }
      p[x].classList.add('selected');
      k[x].classList.add('selected');
      console.log(plaintext.toUpperCase().charCodeAt(x) - 65);
      console.log(keyphrase.toUpperCase().charCodeAt(x) - 65);
      scrollHorizontalTo(plaintext.toUpperCase().charCodeAt(x) - 65);
      scrollVerticalTo(keyphrase.toUpperCase().charCodeAt(x) - 65);
      ciphertext.innerHTML += document.querySelector('.target').innerHTML;
    }, (x + 1) * 1500);
  }
  setTimeout(() => splitAndClean(ciphertext), (plaintext.length + 0.5) * 1500);
}

function init() {
  const parent = document.querySelector("#text");
  createTable(parent);
  setTimeout(createHandles, 6000);
  setTimeout(showHandles, 6500);
  let textContainer = createElement('div', ['text-container'], '', '');
  document.body.appendChild(textContainer);
  let plaintextContainer = createElement('div', ['text-row'], '', '');
  let plaintext = createElement('span', ['plaintext'], '', '');
  plaintextContainer.appendChild(createElement('pre', ['label'], ' plaintext:', ''));
  plaintextContainer.appendChild(plaintext);
  textContainer.appendChild(plaintextContainer);
  let keyContainer = createElement('div', ['text-row'], '', '');
  let key = createElement('span', ['key'], '', '');
  keyContainer.appendChild(createElement('pre', ['label'], '       key:', ''));
  keyContainer.appendChild(key);
  textContainer.appendChild(keyContainer);
  typewriter(plaintext, 'some random text',
    () => {
      splitAndClean(plaintext);
      typewriter(key, 'roderik', () => splitAndClean(key));
    });
  let fullkey = '';
  setTimeout(() => fullkey = 
    expandKey('somerandomtext', key, 'roderik'), 10000);
  setTimeout(() => encrypt(plaintext, key, 'somerandomtext', fullkey), 12500);
}

init();
