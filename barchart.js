const data = {
  a: 8.2,
  b: 1.5,
  c: 2.8,
  d: 4.3,
  e: 12.7,
  f: 2.2,
  g: 2.0,
  h: 6.1,
  i: 7.0,
  j: 0.15,
  k: 0.77,
  l: 4.0,
  m: 2.4,
  n: 6.7,
  o: 7.5,
  p: 1.9,
  q: 0.095,
  r: 6.0,
  s: 6.3,
  t: 9.1,
  u: 2.8,
  v: 0.98,
  w: 2.4,
  x: 0.15,
  y: 2.0,
  z: 0.074
};

const heights = [];
const h = [];

const keys = "abcdefghijklmnopqrstuvwxyz";

const graph = document.querySelector('graph');
const graphHeight = null;
const barMaxHeight = 400;

const bars = [];

const animSpeed = 1;

function createElement(type, text, parent, classes, id, children) {
  let elmt = document.createElement(type);
  if (text) elmt.innerHTML = text;
  if (children) {
    if (children.map) children.map(child => elmt.appendChild(child));
    else elmt.appendChild(children);
  }
  if (classes) {
    elmt.classList = classes;
  }
  if (parent) {
    parent.appendChild(elmt);
  }
  elmt.id = id;
  return elmt;
}

function getMax(d, k) {
  return k.reduce((max, val) => d[val] > max ? d[val] : max, 0);
}

function normalisedHeight(height, max) {
  return (height * 100 / max);
}

function init() {
  const barsrow = createElement('div', null, graph, 'row', 'bar_row', null);
  const labelsrow = createElement('div', null, graph, 'row', '', null);
  const max = getMax(data, keys.match(/[a-z]/g));
  let i = 0;
  for (let key of keys) {
    const rect = createElement('div', null, barsrow, 'bar', 'bar_' + key, null);
    rect.style.height = "0%";
    createElement('span', data[key], rect, 'value-label', '', null);
    bars.push(rect);
    setTimeout(() => rect.style.height = normalisedHeight(data[key], max) + "%", i * 50);
    const label = createElement('span', key, labelsrow, 'label', 'label_' + key, null);
    label.setAttribute('style', '--index: ' + i);
    i++;
  }
}

init();
