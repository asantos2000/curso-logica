const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const modules = ['03-modulo-3.html', '04-modulo-4.html', '05-modulo-5.html'];
function script(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
}
function core(file) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(script(file).split('(function(){')[0], context);
  return context;
}
// The pages have no DOM package dependency. This stub records listeners and output;
// all parsing, evaluation and rendering below execute the original page code.
function element() {
  return {innerHTML: '', dataset: {}, value: '', events: {}, classList: {toggle() {}},
    appendChild() {}, setAttribute() {}, focus() {},
    addEventListener(name, fn) { this.events[name] = fn; },
    querySelectorAll() { return []; }, querySelector() { return element(); }};
}
function page(file, input) {
  const elements = {entrada: {...element(), value: input}, saida: element()};
  const insert = {...element(), dataset: {ins: '¬'}};
  const document = {
    getElementById: id => elements[id] || (elements[id] = element()),
    querySelectorAll: selector => selector === '[data-ins]' ? [insert] : [],
    createElement: () => element()
  };
  const context = {document};
  vm.createContext(context);
  vm.runInContext(script(file), context);
  return {elements, insert, context};
}
function model() {
  return {dom: [0, 1, 2], un: {P: new Set([0, 1]), Q: new Set([2])},
    bin: {R: new Set(['0,1', '1,2'])}, konst: {a: 0, b: 2}};
}

test('uma fórmula atômica é classificada pela própria valoração', () => {
  const {elements} = page(modules[0], 'P');
  assert.match(elements.saida.innerHTML, /contingência/);
  assert.match(elements.saida.innerHTML, /1 valor V em 2 linhas/);
});
test('separadores sem fórmulas recebem explicação sem interromper a página', () => {
  const {elements} = page(modules[0], ' ; ; ');
  assert.match(elements.saida.innerHTML, /Escreva ao menos uma fórmula/);
});
for (const file of modules) {
  test(`${file}: a paleta insere na posição zero e respeita a seleção`, () => {
    const {elements, insert} = page(file, file === modules[2] ? 'Pa' : 'P');
    elements.entrada.selectionStart = 0;
    elements.entrada.selectionEnd = 0;
    insert.events.click();
    assert.equal(elements.entrada.value, file === modules[2] ? '¬Pa' : '¬P');
    elements.entrada.selectionStart = 0;
    elements.entrada.selectionEnd = 1;
    insert.events.click();
    assert.equal(elements.entrada.value, file === modules[2] ? '¬Pa' : '¬P');
  });
  test(`${file}: imprimir e reanalisar preserva a árvore e seus escopos`, () => {
    const ctx = core(file), fo = file === modules[2];
    const parse = fo ? ctx.parseFO : ctx.parse, show = fo ? ctx.showFO : ctx.show;
    const samples = fo
      ? ['(Pa ↔ Qa) ↔ (Pa ↔ Qa)', 'Pa ∧ (Qa ∧ Raa)', '(Pa → Qa) → Raa', '∀x(Px → (Qx → Rxx))']
      : ['(P ↔ Q) ↔ (P ↔ Q)', 'P ∧ (Q ∧ R)', '(P → Q) → R', 'P → (Q → R)'];
    for (const input of samples) assert.equal(JSON.stringify(parse(show(parse(input)))), JSON.stringify(parse(input)), input);
  });
}
const fo = core(modules[2]);
for (const input of ['∀aPa', '∃bQb', 'Pab', 'Raaa', 'Sa', 'Pa ∨ Pc', '¬Pa ∧ Pc', 'Pc → Pa']) {
  test(`a assinatura inteira é validada antes de avaliar ${input}`, () => {
    assert.throws(() => fo.evalFO(fo.parseFO(input), model(), {}));
    const {elements} = page(modules[2], input);
    assert.match(elements.saida.innerHTML, /class="erro"/);
    assert.doesNotMatch(elements.saida.innerHTML, /class="verdict/);
  });
}
test('quantificação, identidade e sombreamento corretos continuam funcionando', () => {
  const m = model();
  for (const [input, expected] of [['Pa', true], ['∀xPx', false], ['∃xQx', true],
    ['∀x∃y(x = y)', true], ['∀x∃xQx', true], ['∀x(x = x)', true], ['a = b', false]]) {
    assert.equal(fo.evalFO(fo.parseFO(input), m, {}), expected, input);
  }
  assert.match(page(modules[2], 'Px').elements.saida.innerHTML, /variável livre/);
});
test('os exemplos declarados nos laboratórios são aceitos', () => {
  for (const file of modules) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const [, input] of html.matchAll(/data-ex="([^"]+)"/g)) {
      const {elements} = page(file, input);
      assert.doesNotMatch(elements.saida.innerHTML, /class="erro"/, `${file}: ${input}`);
    }
  }
});
test('os modelos das soluções distinguem ordem quantificacional e cardinalidade', () => {
  const m = model();
  m.dom = [0, 1]; m.konst = {a: 0, b: 1};
  m.bin.R = new Set(['0,0', '1,1']);
  assert.equal(fo.evalFO(fo.parseFO('∀x∃yRxy'), m, {}), true);
  assert.equal(fo.evalFO(fo.parseFO('∃y∀xRxy'), m, {}), false);
  m.un.P = new Set(); m.un.Q = new Set();
  assert.equal(fo.evalFO(fo.parseFO('∀x(Px → Qx)'), m, {}), true);
  assert.equal(fo.evalFO(fo.parseFO('∃x(Px ∧ Qx)'), m, {}), false);
  m.dom = [0, 1, 2];
  const exactlyTwo = fo.parseFO('∃x∃y(Px ∧ Py ∧ ¬(x = y) ∧ ∀z(Pz → (z = x ∨ z = y)))');
  for (let mask = 0; mask < 8; mask++) {
    m.un.P = new Set(m.dom.filter(d => mask & (1 << d)));
    assert.equal(fo.evalFO(exactlyTwo, m, {}), m.un.P.size === 2, `P mask ${mask}`);
  }
});
test('nenhuma das 16 + 512 relações finitas satisfaz as três condições do exercício 5.8', () => {
  const formula = fo.parseFO('∀x∃yRxy ∧ ∀x¬Rxx ∧ ∀x∀y∀z((Rxy ∧ Ryz) → Rxz)');
  for (const n of [2, 3]) {
    const m = model(); m.dom = Array.from({length: n}, (_, i) => i); m.konst = {a: 0, b: 1};
    for (let mask = 0; mask < 2 ** (n * n); mask++) {
      m.bin.R = new Set();
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if (mask & (1 << (i * n + j))) m.bin.R.add(`${i},${j}`);
      }
      assert.equal(fo.evalFO(formula, m, {}), false, `n=${n}, relação=${mask}`);
    }
  }
});
test('tablôs concordam com todas as valorações em 1200 argumentos', () => {
  const ctx = core(modules[1]);
  let seed = 1709;
  const rnd = n => (seed = (1664525 * seed + 1013904223) >>> 0) % n;
  function formula(depth) {
    if (!depth || rnd(4) === 0) return {op: 'at', nome: ['P', 'Q', 'R'][rnd(3)]};
    if (rnd(5) === 0) return {op: '¬', a: formula(depth - 1)};
    return {op: ['∧', '∨', '→', '↔'][rnd(4)], l: formula(depth - 1), r: formula(depth - 1)};
  }
  for (let i = 0; i < 1200; i++) {
    const premises = [formula(2), formula(2)], conclusion = formula(2);
    const tree = ctx.construir(premises.concat({op: '¬', a: conclusion}));
    let valid = true;
    for (let row = 0; row < 8; row++) {
      const v = {P: !!(row & 1), Q: !!(row & 2), R: !!(row & 4)};
      if (premises.every(p => ctx.evalf(p, v)) && !ctx.evalf(conclusion, v)) valid = false;
    }
    assert.equal(ctx.abertos(tree.arvore).length === 0, valid, `argumento ${i}`);
  }
});
