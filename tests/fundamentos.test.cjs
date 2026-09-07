const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

function keyboardEvent(key, control = '') {
  return { key, defaultPrevented: false,
    target: { closest: selector => selector.split(',').some(s => s.trim() === control) ? {} : null },
    preventDefault() { this.defaultPrevented = true; } };
}

function handlers() {
  const html = read('01a-slides-modulo-1.html');
  const globalCode = html.slice(html.indexOf('  document.addEventListener("keydown"'), html.indexOf('  const nb ='));
  const localCode = html.match(/s\.addEventListener\("keydown", e => \{[^\n]+/)[0];
  let globalHandler, localHandler, activations = 0, advances = 0;
  vm.runInNewContext(globalCode + localCode, {
    document: { addEventListener: (_, handler) => { globalHandler = handler; } },
    s: { addEventListener: (_, handler) => { localHandler = handler; } },
    go: () => { advances++; }, act: () => { activations++; }, i: 3
  });
  return { local: e => localHandler(e), global: e => globalHandler(e),
    result: () => ({ activations, advances }) };
}

test('Espaço ativa a classificação do período sem abandonar seu feedback', () => {
  const h = handlers(), e = keyboardEvent(' ');
  h.local(e); h.global(e);
  assert.deepEqual(h.result(), { activations: 1, advances: 0 });
});

test('Enter ativa a classificação e Espaço fora de controles continua navegando', () => {
  const h = handlers(), enter = keyboardEvent('Enter');
  h.local(enter); h.global(enter);
  assert.deepEqual(h.result(), { activations: 1, advances: 0 });
  h.global(keyboardEvent(' '));
  assert.deepEqual(h.result(), { activations: 1, advances: 1 });
  h.global(keyboardEvent(' ', 'button'));
  assert.deepEqual(h.result(), { activations: 1, advances: 1 });
});

test('Espaço no resumo de uma pista preserva a abertura nativa de details', () => {
  const h = handlers(), event = keyboardEvent(' ', 'summary');
  h.global(event);
  assert.deepEqual(h.result(), { activations: 0, advances: 0 });
  assert.equal(event.defaultPrevented, false);
});

function syllogisms() {
  const html = read('02-modulo-2.html');
  const source = html.slice(html.indexOf('  const N = 3,'), html.indexOf('  const FRASE ='));
  const context = {};
  vm.runInNewContext(source + '; this.follows = segue;', context);
  return context.follows;
}

// A region is an S/P/M membership type. Its multiplicity does not change A/E/I/O.
// This independent evaluator enumerates all possible occupied Venn regions.
function consequenceByRegions(major, minor, conclusion, figure, existentialImport) {
  const figures = { 1: [[4, 2], [1, 4]], 2: [[2, 4], [1, 4]],
    3: [[4, 2], [4, 1]], 4: [[2, 4], [4, 1]] };
  for (let occupied = 1; occupied < 256; occupied++) {
    const objects = Array.from({ length: 8 }, (_, i) => i).filter(i => occupied & (1 << i));
    if (existentialImport && [1, 2, 4].some(term => !objects.some(o => o & term))) continue;
    const truth = (kind, subject, predicate) => {
      const intersection = objects.some(o => (o & subject) && (o & predicate));
      const difference = objects.some(o => (o & subject) && !(o & predicate));
      return { A: !difference, E: !intersection, I: intersection, O: difference }[kind];
    };
    const [first, second] = figures[figure];
    if (truth(major, ...first) && truth(minor, ...second) && !truth(conclusion, 1, 2)) return false;
  }
  return true;
}

test('256 formas nas duas leituras coincidem com todos os padrões de regiões', () => {
  const follows = syllogisms();
  let modern = 0, traditional = 0;
  for (let figure = 1; figure <= 4; figure++) for (const a of 'AEIO')
    for (const b of 'AEIO') for (const c of 'AEIO') for (const imported of [false, true]) {
      const actual = follows(a, b, c, figure, imported);
      assert.equal(actual, consequenceByRegions(a, b, c, figure, imported), `${a}${b}${c}-${figure}, importe=${imported}`);
      if (actual) imported ? traditional++ : modern++;
    }
  assert.equal(modern, 15);
  assert.equal(traditional, 24);
  assert.equal(traditional - modern, 9);
});

test('quadrado propaga O verdadeira igualmente e A verdadeira diferentemente', () => {
  const html = read('02-modulo-2.html'), context = {};
  const source = html.slice(html.indexOf('  const TRAD ='), html.indexOf('  const svg ='));
  vm.runInNewContext(source + '; this.tables = { TRAD, MOD };', context);
  const { TRAD, MOD } = JSON.parse(JSON.stringify(context.tables));
  assert.deepEqual(TRAD['O:V'], { A: 'F', E: '?', I: '?', O: 'V' });
  assert.deepEqual(MOD['O:V'], TRAD['O:V']);
  assert.equal(TRAD['A:V'].I, 'V');
  assert.equal(MOD['A:V'].I, '?');
});

test('os scripts dos quatro módulos compilam', () => {
  for (const file of ['01-modulo-1.html', '01a-slides-modulo-1.html', '01b-modulo-1a.html', '02-modulo-2.html']) {
    for (const [, script] of read(file).matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => new vm.Script(script, { filename: file }));
    }
  }
});
