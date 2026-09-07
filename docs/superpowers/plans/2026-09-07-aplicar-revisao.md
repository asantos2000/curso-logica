# Aplicação da revisão do curso

> Plano baseado nas correções e melhorias de `REVISAO.md`, aprovadas pelo usuário em “Pode aplicá-las”. Execução em frentes independentes, seguida de revisão cruzada e verificação integrada.

**Objetivo:** corrigir os 21 achados detalhados, os ajustes adicionais e oferecer os apoios didáticos recomendados.

**Arquitetura:** preservar páginas HTML estáticas e funcionamento local; regras e exemplos coerentes entre módulos. Testes em Node, sem dependências de produção. Guardar progresso existente quando compatível e identificar itens novos sem deslocar registros antigos.

**Tecnologias:** HTML, CSS, JavaScript, Node `node:test`; PDFs locais para confirmação bibliográfica.

## 1. Fundamentos e silogística

Arquivos: `01-modulo-1.html`, `01a-slides-modulo-1.html`, `01b-modulo-1a.html`, `02-modulo-2.html`, `tests/fundamentos.test.cjs`.

- [x] Reproduzir o conflito de Espaço e registrar teste de regressão.
- [x] Corrigir terminologia, reconstrução, importação existencial, funções e extensão de predicados.
- [x] Explicar Venn-Euler com exemplos válidos e inválidos; adicionar pistas e soluções dos exercícios autorais.
- [x] Executar `node --test tests/fundamentos.test.cjs`; comparar 256 formas em duas leituras.

## 2. Lógica proposicional e primeira ordem

Arquivos: `03-modulo-3.html`, `04-modulo-4.html`, `05-modulo-5.html`, `tests/formal.test.cjs`.

- [x] Testar primeiro: `P` deve ser contingente; `;` deve gerar mensagem; `∀aPa`, `Pab`, `Raaa`, `Sa`, `Pa∨Pc` devem ser rejeitadas na assinatura do laboratório.
- [x] Corrigir avaliação da raiz, impressão fiel, validação integral da assinatura, inserção na posição zero.
- [x] Completar regras quantificacionais e primeiro nome nos tablôs; unificar sistema Sell e quadro de comparação com Mortari.
- [x] Corrigir textos e exercícios; acrescentar pistas e soluções.
- [x] Executar `node --test tests/formal.test.cjs`, incluindo comparação dos tablôs com tabelas de verdade.

## 3. Metateoria e não clássicas

Arquivos: `06-modulo-6.html`, `07-modulo-7.html`, `08-modulo-8.html`, `tests/metateoria.test.cjs`.

- [x] Testar primeiro: contagens de não designados para `P` = 1/2/2/1/2; analisar/imprimir/reanalisar preserva valores em Ł₃.
- [x] Corrigir cálculos, semidecidibilidade, S5, conjuntos maximais e estatuto da lógica LP.
- [x] Manter E∨ direta na metaprova; ensinar pré-requisitos de indução; oferecer exemplos intuicionistas e contravalorações modais.
- [x] Acrescentar pistas e soluções e rubricas dos marcos complementares em coordenação com a frente 4.
- [x] Executar `node --test tests/metateoria.test.cjs`, incluindo 512 relações modais.

## 4. Avaliação, fontes e percurso

Arquivos: `provas.html`, `prompts.html`, `00-proposta.html`, `atlas.html`, `index.html`, `guia-estudo.html`, `README.md`, `tests/avaliacao.test.cjs`.

- [x] Testar primeiro preservação da produção ao trocar de prompt e posições das alternativas.
- [x] Distribuir alternativas, ampliar itens de aplicação e preservar a identificação dos itens antigos.
- [x] Separar aprovação do teste de domínio do marco; corrigir ambiguidade de RAA/MT.
- [x] Corrigir rubricas, admitir resultado inconclusivo e acrescentar rubricas C3/C4.
- [x] Criar guia por unidade com leituras e exercícios essenciais/opcionais; registrar correspondências de Pagani somente quando verificadas por enunciado.
- [x] Corrigir promessas de cobertura, links externos e descrições divergentes; ligar os novos apoios ao percurso.
- [x] Executar `node --test tests/avaliacao.test.cjs`.

## 5. Integração e entrega

- [x] Revisão cruzada dos diffs: matemática, critérios de avaliação e persistência.
- [x] Executar `node --test tests/*.test.cjs`, compilação de todos os scripts, validação dos links e `git diff --check`.
- [x] Conferir páginas e interações no navegador, inclusive largura estreita.
- [x] Atualizar `REVISAO.md` com status dos itens, evidências e qualquer limite bibliográfico restante.

**Conclusão:** implementação aplicada e verificada. Evidências, revisão cruzada, inspeção no Chrome e limites bibliográficos registrados em `REVISAO.md`. O mapa integral de Pagani não é presumido; as correspondências conferidas estão no guia.
