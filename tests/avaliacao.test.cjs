const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
function scripts(file) { return [...fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]); }
function banco() { return vm.runInNewContext(scripts('provas.html')[0]+'; MARCOS'); }
class Element {
  constructor(tag='div') { this.tag=tag;this.children=[];this.listeners={};this.value='';this._html='';this.textContent='';this.attributes={};this.style={}; }
  set innerHTML(s) { this._html=s;this.children=[]; }
  get innerHTML() { return this._html; }
  setAttribute(k,v) { this.attributes[k]=v; }
  append(...els) { this.children.push(...els); }
  appendChild(el) { this.children.push(el);return el; }
  addEventListener(k,f) { this.listeners[k]=f; }
}
function prompts(hash='') {
  const elements={picker:new Element(),pbox:new Element()};const events={};
  const context={document:{getElementById:id=>elements[id],createElement:tag=>new Element(tag)},location:{hash},window:{addEventListener:(k,f)=>events[k]=f}};
  vm.runInNewContext(scripts('prompts.html')[0],context);
  return {elements,events,context,field:()=>elements.pbox.children.find(c=>c.tag==='textarea')};
}
test('as posições corretas não permitem aprovar escolhendo sempre a mesma posição',()=>{
  for(const marco of banco()) {
    for(let position=0;position<4;position++) {
      const hits=marco.itens.filter(it=>it.t==='escolha'&&it.r===position).length;
      assert.ok(hits/marco.itens.length<.75,`${marco.id}: posição ${position} dá ${hits}/${marco.itens.length}`);
    }
  }
});
test('todo marco tem itens de aplicação e ao menos sete itens',()=>{
  for(const m of banco()) {assert.ok(m.itens.length>=7,m.id);assert.ok(m.itens.some(it=>it.id&&String(it.id).startsWith('aplicacao-')),m.id);}
});
test('trocar prompts e retornar conserva a produção de cada um',()=>{
  const p=prompts();p.field().value='Minha primeira resolução';p.field().listeners.input();
  p.elements.picker.children[1].listeners.click();p.field().value='Segunda resolução';p.field().listeners.input();
  p.elements.picker.children[0].listeners.click();assert.equal(p.field().value,'Minha primeira resolução');
  p.elements.picker.children[1].listeners.click();assert.equal(p.field().value,'Segunda resolução');
});
test('clicar no prompt ativo mantém o mesmo campo e texto',()=>{
  const p=prompts();const field=p.field();field.value='Sem perder o foco';p.elements.picker.children[0].listeners.click();
  assert.equal(p.field(),field);assert.equal(p.field().value,'Sem perder o foco');
});
test('rubricas C3 e C4 têm destinos próprios por fragmento',()=>{
  for(const [hash,term] of [['#p8','C3'],['#p9','C4']]) {
    const p=prompts(hash);assert.equal(p.elements.picker.children.length,9);
    assert.match(p.elements.pbox.children[0].innerHTML,new RegExp(term));
  }
});
test('navegar por fragmento preserva texto dos prompts',()=>{
  const p=prompts();p.field().value='Artefato com hipótese aberta';p.field().listeners.input();
  p.context.location.hash='#p8';p.events.hashchange();p.context.location.hash='#p1';p.events.hashchange();
  assert.equal(p.field().value,'Artefato com hipótese aberta');
});
function progresso(saved={}) {
  const elements={};const store={'curso-logica-provas-v1':JSON.stringify(saved)};
  const context={document:{getElementById:id=>elements[id]??=new Element()},location:{hash:''},window:{addEventListener(){}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v}};
  vm.createContext(context);vm.runInContext(scripts('provas.html')[0],context);
  let source=scripts('provas.html')[1];
  const end=source.lastIndexOf('  render();');assert.ok(end>=0);
  source=source.slice(0,end)+'globalThis.inspectProgress={scoreOf,key,marcos:MARCOS};\n})();';
  vm.runInContext(source,context);return context.inspectProgress;
}
test('aprovação exige responder todos os itens, mesmo quando a nota já alcançou 75%',()=>{
  const data=banco(),m=data[0],saved={};
  m.itens.slice(0,-1).forEach((it,i)=>saved['A1:'+(it.id??i)]={ok:true});
  const p=progresso(saved);assert.equal(p.scoreOf(p.marcos[0]).passed,false);
});
test('ampliar o banco mantém resultados antigos em itens semanticamente compatíveis',()=>{
  const p=progresso({'A1:0':{ok:true},'B1:2':{ok:false}});
  assert.equal(p.scoreOf(p.marcos[0]).ok,1);
  assert.equal(p.scoreOf(p.marcos[2]).done,1);
  assert.equal(p.key('A1',0),'A1:0');
});
test('itens com critério corrigido não reaproveitam o julgamento anterior',()=>{
  const p=progresso({'A1:2':{ok:true},'B2:3':{ok:true},'C1:5':{ok:true}});
  for(const n of [0,3,4])assert.equal(p.scoreOf(p.marcos[n]).done,0);
});
