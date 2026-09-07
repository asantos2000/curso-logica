const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadLab(file, expose) {
  const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  const nodes = new Map(), buttons = new Map();
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {value:'P', innerHTML:'', textContent:'', selectionStart:0, selectionEnd:0,
      events:{}, dataset:{}, addEventListener(e, fn){this.events[e]=fn;}, setAttribute(){},
      querySelectorAll(){return [];}, focus(){}, click(){this.events.click?.();}});
    return nodes.get(id);
  }
  const document = {getElementById:node, querySelector(){return node('preset-inicial');}, querySelectorAll(selector){
    if (!buttons.has(selector)) buttons.set(selector, selector==='[data-ins]' ? [Object.assign(node('inserir'), {dataset:{ins:'¬'}})] : []);
    return buttons.get(selector);
  }};
  const context = {document};
  vm.createContext(context);
  const end = script.lastIndexOf('})();');
  vm.runInContext(script.slice(0,end)+`globalThis.lab={${expose}};\n`+script.slice(end), context);
  return {context, lab:context.lab, node, buttons};
}
function polyLab() {
  return loadLab('06-modulo-6.html', 'SIS,av,render,setSystem(s){sis=s}');
}
function modalLab() {
  return loadLab('08-modulo-8.html', 'AX,ev,frameValid,PROP,paint,setRelation(r){R=r},setValuation(v){V=v},countermodel(a){return typeof frameCountermodel === "function" ? frameCountermodel(a) : undefined}');
}

for (const [system, expected] of [['C',1],['L3',2],['K3',2],['LP',1],['B3',2]]) {
  test(`fórmula atômica P: ${expected} linhas não designadas em ${system}`, () => {
    const {lab,node} = polyLab();
    lab.setSystem(system); node('entrada').value='P'; lab.render();
    assert.equal((node('saida').innerHTML.match(/class="contra"/g)||[]).length, expected);
  });
}
test('impressão preserva a árvore e valores de bicondicionais em Ł3', () => {
  const {context:c,lab} = polyLab();
  for (const formula of ['P ↔ (Q ↔ R)', '(P ↔ Q) ↔ (P ↔ Q)', '(P → Q) → (R ↔ (Q ↔ P))']) {
    const original=c.parse(formula), printed=c.parse(c.show(original));
    assert.equal(JSON.stringify(printed),JSON.stringify(original));
    for (const P of [0,.5,1]) for (const Q of [0,.5,1]) for (const R of [0,.5,1]) {
      assert.equal(lab.av(original,{P,Q,R},lab.SIS.L3),lab.av(printed,{P,Q,R},lab.SIS.L3));
    }
  }
  const subs=c.sub(c.parse('(P ↔ (Q ↔ R)) ∧ ((P ↔ Q) ↔ R)'));
  assert.ok(subs.some(s=>s.s==='P ↔ (Q ↔ R)'));
  assert.ok(subs.some(s=>s.s==='P ↔ Q ↔ R'));
});
test('entrada sem fórmula e partes vazias produzem mensagem em vez de avaliação', () => {
  const {lab,node}=polyLab();
  for (const input of [';', 'P;;Q', 'P;']) {
    node('entrada').value=input;
    assert.doesNotThrow(()=>lab.render());
    assert.match(node('saida').innerHTML,/class="erro"/);
    assert.doesNotMatch(node('saida').innerHTML,/class="verdict/);
  }
});
test('paleta insere na posição zero e substitui a seleção', () => {
  const {node,buttons}=polyLab();
  const input=node('entrada'), button=buttons.get('[data-ins]')[0];
  input.value='P'; input.selectionStart=0; input.selectionEnd=0; button.events.click();
  assert.equal(input.value,'¬P'); assert.equal(input.selectionStart,1);
  input.value='¬P'; input.selectionStart=0; input.selectionEnd=1; button.events.click();
  assert.equal(input.value,'¬P');
});
test('correspondência modal confere em todas as 512 relações de três mundos', () => {
  const {lab}=modalLab();
  for (let mask=0;mask<512;mask++) {
    const relation=Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>!!(mask>>(3*i+j)&1)));
    lab.setRelation(relation);
    for (const ax of lab.AX) assert.equal(lab.frameValid(ax[2]),lab.PROP[ax[4]](),`${mask}: ${ax[0]}`);
  }
});
test('todo esquema que falha recebe mundo e valoração que realmente o refutam', () => {
  const {lab}=modalLab();
  for (let mask=0;mask<512;mask++) {
    const relation=Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>!!(mask>>(3*i+j)&1)));
    lab.setRelation(relation);
    for (const ax of lab.AX) {
      const witness=lab.countermodel(ax[2]);
      if (lab.PROP[ax[4]]()) assert.equal(witness,null);
      else {
        assert.ok(witness,`${mask}: falta contravaloração de ${ax[0]}`);
        assert.equal(lab.ev(ax[2],witness.w,witness.val),false);
      }
    }
  }
});
test('verdade no modelo atual muda com V; validade no frame e contravalorações não', () => {
  const {lab,node}=modalLab();
  lab.setRelation([[false,false,false],[false,false,false],[false,false,false]]);
  lab.setValuation({p:[false,false,false],q:[false,false,false]}); lab.paint();
  const before=node('modelo-atual').innerHTML, frame=node('axiomas').innerHTML;
  assert.match(before,/w₁/);
  assert.match(node('contramodelos').innerHTML,/Contravaloração/);
  lab.setValuation({p:[true,true,true],q:[false,false,false]}); lab.paint();
  assert.notEqual(node('modelo-atual').innerHTML,before);
  assert.equal(node('axiomas').innerHTML,frame);
});
