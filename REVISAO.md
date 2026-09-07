# Revisão do curso de fluência em lógica

Data: 7 de setembro de 2026.

A estrutura geral permite aproveitar o curso, mas há erros que precisam ser corrigidos antes de confiar nos laboratórios e nos critérios de aprovação. Os problemas mais importantes estão nas restrições das regras quantificacionais, na avaliação automática de fórmulas, nas rubricas de tradução e na correspondência entre o livro adotado e o gabarito.

As correções e melhorias foram aplicadas após a aprovação do usuário. Os achados abaixo preservam o diagnóstico da versão original; as linhas e contagens dessa etapa são históricas. O registro de implementação e a verificação final estão ao fim deste documento.

## Escopo e referências

Foram examinadas as 15 páginas HTML: proposta, índice, seis módulos principais, os complementares 1A, 7 e 8, slides, atlas, provas e prompts. A revisão combinou leitura conceitual, confronto de passagens com os PDFs e execução de funções JavaScript do próprio curso.

O livro de Mortari é uma digitalização sem camada de texto útil. Foram conferidas visualmente a edição, o sumário e páginas selecionadas relevantes aos achados; não se trata de uma revisão integral das 527 páginas do livro. O PDF de Pagani tem problemas de codificação na extração, e as passagens decisivas também foram verificadas em imagem.

| Referência local | Uso na revisão |
| --- | --- |
| [Mortari, Introdução à lógica, 2ª ed., 2016](references/introducao%20a%20logica-cezar%20mortari%20-%20scan.pdf) | Terminologia inicial; sintaxe e semântica; tablôs; dedução natural e condições de substituição. Edição confirmada na p. 4 do PDF. |
| [Neves Filho e Rui, Elementos de lógica](references/elementos-de-logica.pdf) | Argumentos, silogística e falácias. A página do PDF está três posições à frente da paginação impressa nas passagens citadas abaixo. |
| [Sell, Lógica II](references/logica-2.pdf) | Apresentação das regras primitivas e derivadas; restrições quantificacionais. |
| [Morais et al., Introdução à lógica a partir de sua história filosófica](references/introducao-logica-filosofia.pdf) | Organização histórica e alcance da fonte; capítulos sobre Aristóteles, estoicos e medievais. |
| [Mortari, plano de ensino FIL 6021, 2023/1](references/fil6021-logica-I-cezar%20mortari.pdf) | Sequência curricular, carga horária e limites do programa institucional. |
| [Pagani, Respostas para exercícios](references/Respostas-exercicios-Introducao-logica-mortari.pdf) | Cobertura efetiva e compatibilidade da numeração dos exercícios com o livro adotado. |

P1 indica problema que pode ensinar um resultado falso, aprovar uma resposta inadequada ou comprometer a autocorreção. P2 indica correção conceitual, didática ou funcional relevante. As recomendações de ampliação aparecem ao final.

## Correções prioritárias — P1

### 1. Fórmulas atômicas recebem tratamento errado nos laboratórios

**Local:** `03-modulo-3.html:544` e `:574`; `06-modulo-6.html:533` e `:548–549`.

No módulo 3, inserir apenas `P` produz a classificação **contradição**, com zero valores V, embora a própria tabela apresente P verdadeira em uma linha e falsa na outra. No módulo 6, a mesma entrada marca todas as linhas como não designadas, inclusive `P = 1` e, em LP, `P = ½`.

O código remove as colunas atômicas da lista de subfórmulas e depois consulta a última coluna dessa lista. Quando a fórmula inteira é atômica, a lista fica vazia.

**Correção proposta:** calcular o valor da fórmula principal diretamente da árvore sintática, independentemente das colunas escolhidas para exibição, ou preservar explicitamente sua coluna. Para `P`, o módulo 3 deve informar contingência. No módulo 6, o número de linhas não designadas deve ser 1 na clássica, 2 em Ł₃, 2 em K₃, 1 em LP e 2 em Bochvar.

**Base:** Mortari, §6.4, pp. 133–136; definições e conjuntos de valores designados apresentados no próprio módulo 6. Erro reproduzido executando o JavaScript original.

### 2. A impressão das fórmulas altera o significado do bicondicional em Ł₃

**Local:** `06-modulo-6.html:463`.

A entrada `(P ↔ Q) ↔ (P ↔ Q)` é apresentada como `P ↔ Q ↔ P ↔ Q`. O analisador associa essa sequência à esquerda. Em Ł₃, com `P = ½` e `Q = 0`, a fórmula original vale 1, enquanto a fórmula impressa e reanalisada vale 0. Assim, o laboratório pode declarar uma tautologia e exibir uma expressão que não é tautológica.

**Correção proposta:** preservar parênteses de acordo com a árvore sintática. Não aplicar à impressão polivalente uma simplificação baseada na associatividade clássica de ↔. Conferir que analisar, imprimir e reanalisar conserva os valores da fórmula.

**Base:** cálculo direto pelas operações de Ł₃ implementadas e apresentadas no módulo. A reprodução verificou as duas avaliações, sem depender de interpretação do português.

### 3. As restrições das regras quantificacionais estão incompletas

**Local:** `05-modulo-5.html:362–365`; acompanhar a revisão de `prompts.html:410–412`.

A tabela declara “Nenhuma” restrição para E∀ e I∃, omitindo a substituição livre de captura. Em I∀, proíbe a constante própria nas premissas e hipóteses abertas, mas não explicita que ela também não pode permanecer na conclusão generalizada.

Um exemplo mostra o problema: de `a = a`, que não depende de premissas, a regra escrita permite passar a `∀x(x = a)`, substituindo apenas uma ocorrência de `a`. A conclusão é falsa em qualquer domínio com dois objetos distintos. A forma correta de generalizar esse exemplo é `∀x(x = x)`.

**Correção proposta:** definir `α(x/t)` como substituição somente das ocorrências livres de x, exigir que t seja livre para x em α e explicitar a condição de parâmetro próprio de I∀. Em E∃, registrar também o descarregamento da hipótese temporária e a ausência do parâmetro nas demais hipóteses abertas e na conclusão.

**Base:** Mortari, §15.2, pp. 344 e 347–348, especialmente Definição 15.1 e o exemplo de captura; Sell, unidade 4, pp. 79–81. As condições foram conferidas visualmente.

### 4. O laboratório de primeira ordem avalia expressões fora da linguagem declarada

**Local:** `05-modulo-5.html:459–465` e `:486–494`.

O laboratório tem uma assinatura definida: P e Q unários, R binário e constantes a e b. Entretanto, aceita quantificar uma constante (`∀aPa`), admite aridades incorretas (`Pab`, `Raaa`) e trata predicados não interpretados como conjuntos vazios (`Sa`). Para predicados com três termos, o avaliador usa apenas os dois primeiros.

No modelo inicial, `∀aPa` é avaliada como verdadeira enquanto `∀xPx` é falsa. `Raaa ↔ Raa` recebe verdadeiro porque o terceiro argumento é ignorado. A entrada `Pa ∨ Pc` pode receber verdadeiro sem que c tenha interpretação, devido à avaliação abreviada da disjunção.

**Correção proposta:** validar toda a árvore antes de avaliar: variável após quantificador, aridade exata, símbolos pertencentes à assinatura e interpretação de todas as constantes. Expressões fora da linguagem do laboratório devem gerar explicação de erro, sem valor V/F.

**Base:** Mortari, definições 9.3–9.4, p. 190, e distinção entre linguagem e estrutura; assinatura anunciada no próprio laboratório. Casos reproduzidos com o avaliador original.

### 5. A primeira alternativa aprova todos os marcos

**Local:** `provas.html:164–307`, com renderização das alternativas a partir de `:412`.

As **25 questões de escolha simples têm `r:0`**. Não há embaralhamento. Mesmo errando todos os itens dos outros formatos, escolher sempre a primeira alternativa atinge o limiar em cada marco:

| Marco | Acertos apenas pela primeira alternativa | Nota |
| --- | ---: | ---: |
| A1 | 3 de 4 | 75% |
| A2 | 4 de 4 | 100% |
| B1 | 4 de 5 | 80% |
| B2 | 4 de 5 | 80% |
| C1 | 6 de 6 | 100% |
| C2 | 4 de 5 | 80% |

**Correção proposta:** distribuir as respostas corretas entre posições diferentes ou embaralhar alternativas preservando identificadores estáveis. Se houver embaralhamento, salvar também a resposta escolhida e a ordem, para que o feedback continue coerente após recarregar a página. Ampliar o banco para reduzir a memorização da posição e do enunciado.

**Base:** contagem programática dos 29 itens, inspeção da renderização e comparação com a finalidade avaliativa declarada na seção 6 da proposta.

### 6. Duas situações não bastam para validar uma tradução proposicional

**Local:** `prompts.html:302–305`.

O prompt 2 manda verificar uma situação verdadeira e uma falsa e conclui que, se ambas coincidirem, “a tradução passa”. Isso é insuficiente. Uma tradução errada de “P ou Q” por `P ∧ Q` passa nos casos V/V e F/F, mas falha em V/F e F/V.

**Correção proposta:** fixar a leitura pretendida e o dicionário, comparar todas as combinações relevantes ou demonstrar equivalência com uma formalização de referência. Dois exemplos servem para encontrar alguns erros, mas não certificam a tradução. Prever também sentenças tautológicas ou contraditórias, para as quais um dos dois tipos de situação nem sequer existe.

**Base:** Mortari, §§7.1 e 7.3; `03-modulo-3.html:351`, que define corretamente equivalência como concordância em toda valoração. Contraexemplo verificado por tabela completa.

### 7. A rubrica confunde traduções categóricas com regras gerais dos quantificadores

**Local:** `prompts.html:399–401`.

“Universais empregam condicional e existenciais empregam conjunção” só descreve os padrões usuais de determinadas proposições categóricas. Não é regra geral. `∀x(Px ∧ Qx)` pode traduzir corretamente “Todos têm as propriedades P e Q”. `∃x(Px → Qx)` também é uma fórmula legítima, embora não traduza “Algum P é Q”.

**Correção proposta:** limitar o critério às traduções de “Todo P é Q” e “Algum P é Q”. Nos demais casos, avaliar o significado da fórmula em relação ao enunciado. Substituir a reprovação automática dessas formas por uma pergunta sobre sua leitura.

**Base:** Mortari, §9.2, pp. 197–200; o próprio exercício 3 do módulo 5, linha 401, explica uma condição de verdade legítima para `∃x(Px → Qx)`.

### 8. O gabarito de Pagani não corresponde diretamente à numeração adotada

**Local:** `00-proposta.html:207`, `:210`, `:386`; `prompts.html:230`.

O curso apresenta o gabarito como cobertura direta dos exercícios 1.1 a 12.6 de Mortari (2016). O PDF fornecido não acompanha a organização da 2ª edição: na p. 7 de Pagani, o exercício 5.1 trata de indivíduos e o 6.1 de constantes individuais e variáveis; na 2ª edição, os capítulos 5 e 6 tratam do cálculo proposicional e das interpretações proposicionais. Pagani também remete o exercício 1.1 à p. 3, enquanto a edição de 2016 começa seu capítulo 1 na p. 13.

Portanto, o material é aproveitável, mas não pode ser usado por correspondência automática de capítulo e número. A lista examinada também tem lacunas, como a ausência de respostas de capítulo 2; “cobre os capítulos 1 a 12” não deve sugerir cobertura integral.

**Correção proposta:** criar uma tabela de correspondência por enunciado: exercício na 2ª edição, página do livro, item/página de Pagani e status de conferência. Até isso existir, retirar a promessa de correspondência direta e a orientação de que o gabarito prevalece em qualquer divergência. Conferir a resolução e o enunciado antes de atribuir autoridade à resposta.

**Base:** comparação visual de Pagani, pp. 1, 7–8 e 90, com Mortari, ficha catalográfica p. 4 e sumário pp. 9–12. Não se presumiu uma edição específica para Pagani, que não a identifica nas passagens examinadas.

### 9. As regras de tablô não permitem iniciar certos ramos sem constantes

**Local:** `05-modulo-5.html:346–350`.

As regras de ∀ e ¬∃ permitem instanciar apenas um termo “já presente”. Para verificar `∀xPx ⊨ ∃xPx`, a raiz contém `∀xPx` e `¬∃xPx`, sem constantes. Seguindo literalmente a tabela, o aluno não consegue dar o primeiro passo e pode considerar o ramo saturado.

**Correção proposta:** explicar que, se o ramo ainda não contém um nome, se introduz uma constante inicial para representar um elemento do domínio não vazio. Nesse exemplo, instanciar ambas as fórmulas com a mesma constante produz `Pa` e `¬Pa` e fecha o ramo. Explicar também a reaplicação das universais a novos termos e a necessidade de uma estratégia que não deixe instâncias relevantes indefinidamente pendentes.

**Base:** Mortari, §12.5, p. 282. A semântica de domínio não vazio já é adotada pelo curso.

## Outras correções relevantes — P2

### 10. O exercício de semidecidibilidade pede demonstrar uma afirmação falsa

**Local:** `06-modulo-6.html:391`.

O exercício 2 diz que a semidecidibilidade é compatível com completude, “mas não com a decidibilidade”. Todo problema decidível também é semidecidível. A validade de primeira ordem é um caso semidecidível e indecidível; isso não torna as duas propriedades incompatíveis em geral.

**Redação sugerida:** “Explique por que a completude e a semidecidibilidade da validade em primeira ordem não implicam sua decidibilidade. Relacione a resposta com os tablôs da unidade 5.5.”

**Base:** distinções já enunciadas corretamente em `05-modulo-5.html:355` e `07-modulo-7.html:384`; um procedimento de decisão já satisfaz, em particular, o requisito de terminar nos casos positivos.

### 11. É preciso manter o mesmo sistema de dedução natural entre módulos

**Local:** `04-modulo-4.html:316`, `:363`, `:531`; `07-modulo-7.html:197`, `:221`, `:227`.

O módulo 4 adota Sell, com E∨ como regra direta aplicada a `α∨β`, `α→γ` e `β→γ`. O módulo 7 afirma provar a correção desse mesmo sistema, mas trata E∨ como regra por casos com duas subderivações e descarregamento. São apresentações equivalentes, porém a equivalência precisa ser demonstrada ou a escolha precisa ser mantida.

Além disso, o dilema construtivo da tabela de regras derivadas apenas repete a E∨ já básica. Em Sell, o esquema mais geral conclui `γ∨δ` a partir de `α∨β`, `α→γ` e `β→δ`. A afirmação de que Sell e Mortari diferem apenas na apresentação das “mesmas regras” também omite diferenças entre regras primitivas e derivadas: Mortari toma SD como primitiva e dupla negação como derivada.

**Correção proposta:** declarar uma apresentação oficial, ajustar a prova de correção a ela e inserir um quadro explícito de tradução entre os sistemas. Apresentar o dilema construtivo geral de Sell ou identificar a forma simplificada como repetição de E∨.

**Base:** Sell, unidade 1, pp. 24–25, e unidade 2, pp. 45–46; Mortari, p. 343. As divergências não invalidam a lógica clássica usada, mas quebram a correspondência anunciada entre as regras e a metaprova.

### 12. Uma questão de B2 admite a regra indicada como distrator

**Local:** `provas.html:245–248`.

A linha final `¬P`, diante de `P→Q` e `¬Q`, pode ser obtida diretamente por MT. A questão apresenta RAA como resposta única e MT como alternativa incorreta, embora o módulo 4 já tenha legitimado MT como regra derivada.

**Correção proposta:** perguntar especificamente “qual regra descarrega a hipótese da linha 3 e conclui a subderivação 3–5?”. Assim a resposta pretendida é inequivocamente RAA. Outra opção é pedir ao aluno duas derivações: com regras básicas e com MT.

**Base:** `04-modulo-4.html:348–355` e Sell, unidade 2. A distinção é entre a regra que encerra a subderivação mostrada e outra regra que também obtém a mesma conclusão das premissas.

### 13. Há uma negação invertida no feedback de tradução

**Local:** `03-modulo-3.html:496`.

Para A = “ele avisou” e C = “a reunião é cancelada”, `¬(A→C)` equivale a `A∧¬C`. O feedback afirma que a reunião foi cancelada.

**Correção proposta:** substituir por “ele avisou e a reunião não foi cancelada”.

**Base:** cláusula de verdade do condicional, Mortari, p. 136; regra de ¬(α→β) também ensinada no módulo 4.

### 14. O exemplo de apoio convergente tem premissas ligadas

**Local:** `01b-modulo-1a.html:220` e `:265`.

A premissa implícita sobre a tarifa exige conjuntamente participação pequena do combustível no custo e queda de seu preço. P1 ou P2 isoladamente, mesmo com essa premissa implícita, não autorizam a conclusão pela reconstrução oferecida. O texto, entretanto, chama o apoio de convergente.

**Correção proposta:** diagramar o apoio explicitado como `{P1, P2, P3} → C`. Para ensinar convergência, acrescentar outro exemplo em que cada razão ofereça apoio independente. Isso decorre da própria distinção entre apoio ligado e convergente apresentada no módulo.

### 15. A distinção inicial está atribuída incorretamente a Mortari

**Local:** `01-modulo-1.html:214`; `01a-slides-modulo-1.html:230`; alinhar também a descrição no atlas.

O curso atribui a Mortari uma oposição entre raciocínio como processo temporal e inferência como relação abstrata entre proposições. Na fonte, raciocínio e processo de inferência designam o processo mental.

**Correção proposta:** distinguir o processo de raciocínio/inferência da **relação de consequência lógica** entre premissas e conclusão. Preservar a distinção entre estudar psicologicamente um processo e avaliar logicamente seu resultado.

**Base:** Mortari, §1.2, pp. 16–17, conferidas em imagem.

### 16. Dois exercícios de silogística precisam de ajustes no enunciado

**Local:** `02-modulo-2.html:443–444`.

No exercício 5, O verdadeira determina A falsa e deixa E/I indeterminadas tanto na leitura tradicional quanto na moderna. Não aparece a diferença solicitada. Pedir “explique se há diferença neste caso” e acrescentar A verdadeira ou O falsa para evidenciar a importação existencial.

No exercício 6, são **nove** modos exclusivamente tradicionais na convenção implementada, considerando as quatro figuras, e não cinco: AAI-1, EAO-1, AEO-2, EAO-2, AAI-3, EAO-3, AAI-4, AEO-4 e EAO-4. Se a intenção era restringir tudo à figura 1, são dois. Especificar o alcance e a contagem ou pedir “cinco exemplos”.

**Base:** enumeração do verificador e comparação independente dos 256 modos em cada leitura; *Elementos de lógica*, cap. II, §4, p. impressa 40 / PDF 43, para os 24 modos tradicionais. O motor do curso produziu corretamente 15 modernos e 24 tradicionais.

### 17. S5 não exige acessibilidade universal entre todas as classes

**Local:** `08-modulo-8.html:263`.

Uma relação de equivalência pode ter várias classes. Dizer que em S5 “todos os mundos se enxergam mutuamente” e que a modalidade não depende do ponto de vista é correto apenas dentro da mesma classe, ou sob a escolha adicional de trabalhar com acessibilidade universal.

**Contraexemplo:** dois mundos, cada um acessível apenas a si mesmo, formam uma relação de equivalência. Se P é verdadeiro em um e falso no outro, □P também muda de valor entre eles.

**Correção proposta:** escrever “todos os mundos de uma mesma classe de equivalência se enxergam mutuamente; dentro dessa classe, as modalidades não dependem do mundo escolhido”. O colapso das modalidades iteradas continua correto.

**Base:** definições de equivalência e cláusulas semânticas do próprio laboratório modal; contramodelo explícito.

### 18. A explicação sobre conjuntos maximais intuicionistas é falsa

**Local:** `08-modulo-8.html:342`.

A ausência de eliminação da dupla negação não impede a existência de extensões maximais consistentes que decidam toda fórmula. O problema é que usá-las isoladamente fornece comportamento clássico e não contramodelos suficientes para a lógica intuicionista.

**Correção proposta:** explicar que a construção clássica baseada em negar a fórmula não derivável não se transfere diretamente. A semântica intuicionista precisa de teorias primas relacionadas por inclusão, permitindo estados que ainda não decidam P nem ¬P.

**Base adicional:** [Osorio e Nieves, *Wₛ,꜀-Stable Semantics for propositional theories*](https://people.cs.umu.se/jcnieves/JCNieves-Publications/Conference/cic-logic1.pdf), §2.2, lema 6, p. 5 do PDF, afirma a existência de extensões intuicionistas completas e consistentes. A passagem foi conferida visualmente; essa fonte adicional esclarece uma extensão técnica do curso.

### 19. A interface declara domínio completo a partir apenas do teste

**Local:** `provas.html:148`, `:340–345`, `:367–369`; comparar com `00-proposta.html:384–388`.

A proposta exige prática, teste e produção escrita e afirma que nenhuma camada isolada autoriza progressão. A interface, porém, informa “marco vencido” e “o aluno pode passar ao módulo seguinte” apenas pela nota automática. O selo pode inclusive aparecer antes de todos os itens terem sido respondidos, embora o painel ainda diga “em andamento”.

**Correção proposta:** usar “teste do marco aprovado”; distinguir teste concluído e produção escrita verificada. Só declarar domínio completo segundo o critério efetivamente definido. Para os marcos complementares, oferecer rubricas próprias, em vez de apenas indicar o prompt genérico do trabalho integrador.

**Base:** inconsistência entre o critério curricular declarado e o estado que a interface calcula.

### 20. Trocar de prompt apaga a produção escrita

**Local:** `prompts.html:460`, `:469–487`.

Ao escolher outro prompt, `render()` remove a caixa inteira e cria um novo campo vazio. Voltar ao prompt anterior não recupera o texto. O problema ocorre até ao selecionar novamente o prompt já ativo.

**Correção proposta:** guardar o texto por prompt antes de redesenhar a interface e restaurá-lo ao retornar. Não redesenhar desnecessariamente o prompt já selecionado. Persistência entre recarregamentos pode ser uma melhoria posterior.

**Verificação:** execução dos manipuladores originais com DOM simulado: inserir “Minha resolução completa”, trocar de prompt e retornar resulta em campo vazio.

### 21. A tecla Espaço aciona a atividade e avança o slide ao mesmo tempo

**Local:** `01a-slides-modulo-1.html:398–400` e `:431`.

Os trechos clicáveis da reconstrução usam `span` com `role="button"`. Espaço ativa o trecho, mas o evento também chega à navegação global e avança o slide, escondendo o feedback.

**Correção proposta:** respeitar `event.defaultPrevented` no manipulador global ou ignorar controles interativos, inclusive `[role="button"]`. Conferir a atividade com Tab, Enter e Espaço.

**Verificação:** os manipuladores originais produziram uma ativação e um avanço para Espaço; Enter produziu apenas a ativação. A reprodução foi feita em JavaScript, sem inspeção visual no navegador.

## Ajustes adicionais de precisão

| Local | Problema e correção proposta | Fundamentação |
| --- | --- | --- |
| `02-modulo-2.html:442` | Função injetiva não sobrejetiva ou sobrejetiva não injetiva não é impossível apenas porque o domínio é finito. Exigir função de um conjunto finito nele mesmo, ou conjuntos finitos de mesma cardinalidade. | `{1} → {1,2}`, com 1 ↦ 1, e a função constante `{1,2} → {1}` são contraexemplos. |
| `02-modulo-2.html:322` | A interpretação de cada predicado não é sempre um subconjunto de D: isso vale para unários. Para aridade n, a extensão está em Dⁿ. | O módulo 5, linhas 274–276, já apresenta a definição correta. |
| `03-modulo-3.html:304` | Retirar “nem sempre P” da lista de sinônimos de ¬P, ou esclarecer que a proposição inteira negada é “sempre P”. | “Nem sempre chove” não equivale a “não chove”. Trata-se de diferença de escopo temporal, não de uma tabela de negação diferente. |
| `04-modulo-4.html:234` | “A tabela verifica; ela não demonstra” desconsidera demonstrações semânticas por exame exaustivo. | Distinguir demonstração semântica de derivação em um sistema dedutivo. |
| `05-modulo-5.html:250` | O exemplo `∀xPx ∧ Qx` não tem o “primeiro parêntese fechado” mencionado. | Escrever `(∀xPx) ∧ Qx` e explicitar o escopo. |
| `05-modulo-5.html:391` | “Todos, salvo a” pode indicar que a efetivamente não tem P, mas a fórmula publicada deixa Pa em aberto. | Declarar a leitura; para uma exceção efetiva, acrescentar ¬Pa. |
| `05-modulo-5.html:397` | O marco sugere que toda refutação pode usar estrutura finita. | Limitar os exercícios aos casos com contramodelo finito; a lógica de primeira ordem geral não tem essa garantia. |
| `06-modulo-6.html:276`; `08-modulo-8.html:239` | A classificação de toda lógica rival como sistema que invalida teoremas conflita com LP, que preserva as tautologias clássicas e altera a consequência com premissas. | Falar em revisão de princípios ou inferências clássicas. O próprio módulo 6, linhas 334–335, já explica a diferença no caso de LP. |
| `01-modulo-1.html:244–245`; slides `:264–265` | Acrescentar gramaticalidade à definição de sentença e contexto ao exemplo “Está chovendo” / “It is raining”. | Mortari, pp. 26–30, especialmente p. 27. A definição de enunciado como evento é compatível com a convenção da fonte. |
| `01-modulo-1.html:310`; `01b-modulo-1a.html:189` | Evitar chamar uma passagem de argumento inválido e, simultaneamente, dizer que não é argumento. Descrevê-la como argumento manifestamente sem apoio, sem a aparência enganosa relevante à discussão. | A inconsistência foi herdada de *Elementos de lógica*, p. impressa 76 / PDF 79; não é uma divergência de reprodução. |
| `01b-modulo-1a.html:285` | Retirar “quase nunca” na explicação sobre tamanho amostral e a comparação universal entre amostra pequena aleatória e grande enviesada. Avaliar conjuntamente tamanho e representatividade. | *Elementos de lógica*, p. impressa 85 / PDF 88, menciona observação insuficiente e falta de representatividade. |
| `01b-modulo-1a.html:278` | Distinguir suspender o assentimento de afirmar a tese contrária. Sustentar uma afirmação negativa também pode exigir razões. | Aplicação da distinção entre contestar o suporte de uma tese e apresentar uma nova tese; formular a regra de ônus da prova sem “quem apenas nega, não”. |
| `00-proposta.html:218` | “A semântica precede a sintaxe” não descreve a sequência efetiva: a unidade 3.1 ensina sintaxe antes das valorações. | Renomear para “A semântica precede os métodos de prova”. |
| `00-proposta.html:216`; `:268` | A promessa de nível A sem símbolos não corresponde às fórmulas antecipadas no módulo 2. | Tratar essas fórmulas como antecipações opcionais ou ajustar a promessa. |
| `00-proposta.html:395–434` | Doze cartões levam a artefatos externos, embora existam versões locais de todos esses materiais. Isso impede que esses caminhos cumpram a promessa de navegação offline. | Substituir por links para os HTMLs locais. Não foi verificada a disponibilidade dos artefatos remotos. |
| `prompts.html:259–266` | A saída permite “não verificado” nos critérios, mas força veredito binário sobre o marco. | Admitir “verificação inconclusiva” quando falta informação; distinguir artefato aprovado de marco completo. |
| `03-modulo-3.html:528` | Uma entrada formada apenas por `;` causa uma exceção sem explicação ao aluno. | Validar a lista vazia após separar as fórmulas. Erro reproduzido com o código original. |
| `03-modulo-3.html:605`; `04-modulo-4.html:619`; `05-modulo-5.html:653` | As paletas usam `selectionStart || value.length`: a posição zero é tratada como ausência, inserindo o símbolo no fim. | Testar ausência explicitamente, preservando zero como posição válida. |

## Melhorias didáticas recomendadas

1. **Criar uma trilha de leitura executável.** Para cada unidade, indicar páginas precisas, dois ou três exercícios essenciais, exercícios opcionais e a localização da solução. Começar pela correspondência de Pagani. Uma referência genérica ao capítulo inteiro não basta para orientar o iniciante sozinho.

2. **Ensinar o método exigido pelo Marco A2.** O marco pede decidir silogismos por Venn-Euler, mas faltam exemplos completos de marcação de regiões vazias e testemunhas em diagramas de três conjuntos. Incluir um silogismo válido e um inválido, antes de usar o verificador como conferência. Apoio: Mortari, apêndice A, especialmente §A.5.

3. **Oferecer soluções comentadas dos exercícios autorais.** Organizar a ajuda em tentativa, pista e solução. Priorizar derivações, contramodelos e restrições quantificacionais: o banco de reconhecimento e os prompts não substituem a conferência desses artefatos.

4. **Preparar melhor a transição para metateoria.** A proposta, linha 443, afirma que a indução matemática já foi fornecida na unidade 2.2, mas essa unidade apresenta conjuntos e enumerabilidade. Inserir uma introdução à indução simples e estrutural, provas por contradição, enumeração de fórmulas e dependência de hipóteses antes do módulo 7, com exercícios curtos.

5. **Alinhar avaliações às produções exigidas.** Quatro a seis questões por marco dão pouca cobertura. Acrescentar problemas novos de construção e diagnóstico de erros, sobretudo contraposição/afirmação do consequente, captura de variável, parâmetro próprio e extração de contramodelo. C3 e C4 precisam de rubricas adequadas a metaprovas e modelos modais.

6. **Distinguir alcance das fontes e ampliação autoral.** O plano FIL 6021, pp. 1–2, descreve lógica proposicional, metalógica introdutória e noções de lógicas não clássicas; não valida, por si só, todo o percurso de primeira ordem e os detalhes das extensões metateóricas. Identificar as leituras adicionais necessárias aos módulos 1A, 7 e 8.

7. **Refinar os prompts de reconstrução.** “A premissa mais fraca” precisa ser subordinada à fidelidade ao contexto: não se deve reparar qualquer argumento acrescentando uma ponte artificial. Permitir premissas implícitas explicitamente marcadas e justificadas no trabalho integrador, harmonizando os prompts 1 e 7. Evitar descartar automaticamente concessões ou contexto que sejam necessários à interpretação.

8. **Limitar a tarefa final a casos tratáveis.** Pedir a validade de qualquer argumento escolhido em primeira ordem pode levar a uma busca que não termina. Oferecer textos selecionados ou permitir resultado fundamentado de busca inconclusiva, com registro do método tentado, quando a avaliação não exigir uma decisão completa.

9. **Consolidar notação e mensagens de erro.** Acrescentar uma folha de consulta com assinatura, aridades, escopo, convenções de parênteses, ⊢/⊨ e regras primitivas/derivadas. Os laboratórios devem distinguir erro de sintaxe, símbolo não interpretado e fórmula falsa.

10. **Preservar e explicar os resultados já corretos.** O contraste entre as leituras silogísticas, a extração de contramodelos e a manipulação de relações modais são bons recursos para o curso. Acrescentar perguntas que peçam prever o resultado antes de clicar, seguidas de explicação do caso observado.

11. **Tornar concretas as diferenças entre as lógicas não clássicas.** Mostrar um modelo intuicionista com dois estados e aquisição de P no segundo, explicar o valor intermediário de LP como verdadeiro e falso e o de K₃ como nem verdadeiro nem falso, e distinguir verdade num mundo de validade em um modelo ou frame. No laboratório modal, fornecer uma valoração refutadora quando um esquema falhar.

## Verificação da versão original e limites

- Os **25 blocos JavaScript** das 15 páginas foram compilados sem erro de sintaxe.
- Foram conferidas **214 referências locais** em `href`/`src`, incluindo os destinos dinâmicos conhecidos de provas e prompts: nenhum arquivo ou fragmento ausente foi identificado nesse conjunto.
- O motor silogístico foi comparado com uma enumeração independente: **512 classificações**, correspondentes a 256 formas em duas leituras, sem divergências.
- O núcleo proposicional de tablôs foi comparado com tabelas de verdade em **1.200 argumentos gerados**, sem divergências nos casos examinados.
- O laboratório modal foi verificado nas **512 relações possíveis entre três mundos**, com os seis esquemas implementados, sem divergências entre validade e as propriedades correspondentes.
- Foram reproduzidos os erros de fórmulas atômicas, de impressão em Ł₃, de validação em primeira ordem, de perda de texto e de tratamento de Espaço nos slides.
- A contagem das posições corretas confirmou **25 de 25 questões de escolha simples na primeira alternativa**.

Essas verificações dão evidência sobre os casos e componentes citados; não equivalem a uma prova de correção de todos os programas. Não foi feita uma inspeção visual completa do site em navegador nem de responsividade. Os achados bibliográficos e matemáticos estão acompanhados das páginas ou dos contraexemplos que os sustentam.

## Ordem sugerida para aplicar a revisão

Primeiro, corrigir os resultados dos laboratórios e as regras de primeira ordem (itens 1–4 e 9). Em seguida, corrigir os critérios de autocorreção e organizar o gabarito (itens 5–8 e 19). Depois, ajustar as explicações, exercícios e consistência entre sistemas (itens 10–18). Finalizar com preservação de texto, teclado, links locais e complementação das práticas e soluções.


## Registro de aplicação

As 15 páginas existentes foram revisadas e foi criado [guia-estudo.html](guia-estudo.html), mantendo o curso em HTML estático. Os PDFs de referência foram preservados.

### Correções detalhadas

| Item do diagnóstico | Resultado aplicado |
| --- | --- |
| 1 | A avaliação da fórmula principal funciona também quando a raiz é atômica, nos módulos 3 e 6. |
| 2 | A impressão preserva a associação das fórmulas; analisar, imprimir e reanalisar mantém os valores em Ł₃. |
| 3 | As regras quantificacionais explicitam substituição sem captura, parâmetro próprio e descarga de hipóteses. |
| 4 | O laboratório de primeira ordem valida toda a assinatura antes da avaliação, incluindo trechos que poderiam ser omitidos por avaliação abreviada. |
| 5 | As alternativas corretas foram distribuídas estaticamente. O banco passou de 29 para 47 itens, com problemas de aplicação em todos os marcos. |
| 6 | A rubrica de tradução exige tabela completa ou demonstração de equivalência com uma leitura de referência justificada. |
| 7 | As orientações sobre ∀/→ e ∃/∧ foram delimitadas aos padrões categóricos pertinentes. |
| 8 | Retiradas as promessas de correspondência automática de Pagani. O guia registra três conjuntos de exercícios conferidos por enunciado, inclusive a permutação de itens de 3.2. |
| 9 | Os tablôs quantificados explicam o primeiro nome, retomada das universais e necessidade de estratégia justa. |
| 10 | Semidecidibilidade e decidibilidade foram distinguidas sem tratá-las como incompatíveis. |
| 11 | Mantida a E∨ direta de Sell com disjunção e dois condicionais, também na metaprova; DC apresenta o esquema geral. O módulo 4 compara as regras de Sell e Mortari. |
| 12 | A questão de RAA identifica a subderivação e a descarga solicitadas, eliminando a ambiguidade com MT. |
| 13 | Corrigido o feedback da negação de A→C. |
| 14 | Corrigida a classificação do apoio no argumento da tarifa. |
| 15 | Distintos o ato de inferir e a relação de consequência lógica, conforme a terminologia de Mortari. |
| 16 | Corrigidos os exercícios sobre O verdadeira e as nove formas silogísticas adicionais sob a convenção de termos não vazios. |
| 17 | S5 foi descrita por relações de equivalência; acessibilidade universal é um caso especial. |
| 18 | Corrigida a afirmação sobre maximais intuicionistas; explicadas teorias primas e o contramodelo de dois estados. |
| 19 | O teste só recebe aprovação após todos os itens respondidos e pelo menos 75% de acerto. O marco exige também a produção escrita verificada. |
| 20 | Cada prompt conserva seu texto ao alternar, retornar ou selecionar novamente o prompt ativo. |
| 21 | Espaço ativa a atividade dos slides sem avançar a lâmina e respeita os controles nativos de pistas. |

### Melhorias e precisão adicional

- Guia para as **33 unidades** principais, com duas atividades essenciais por unidade, retorno comentado, aprofundamento opcional, páginas das referências e folha de notação. Há orientação própria para os três complementares.
- Pistas, soluções comentadas ou critérios de avaliação nos exercícios autorais dos nove módulos, além dos comentários dos quizzes dos slides.
- Dois exemplos completos de Venn-Euler, com regiões vazias e testemunhas, antes da conferência pelo verificador.
- Preparação em indução e recursão no módulo 7, com exemplo resolvido e duas atividades curtas de complexidade de fórmulas e finitude das premissas.
- **Nove rubricas**, incluindo metaprovas (C3) e modelos/lógicas não clássicas (C4), com distinção de re/de dicto, condições de aplicação e veredito inconclusivo.
- Reconstrução fiel ao contexto, com premissas implícitas justificadas; trabalho integrador admite busca fundamentadamente inconclusiva ou escolha prévia de caso tratável.
- Laboratório modal exibe verdade no modelo atual por mundo e uma contravaloração concreta para cada esquema que falha no quadro.
- Corrigidos aridade, funções finitas, escopo, exceção efetiva, amostragem, ônus da prova, classificação de LP e limites de contramodelos finitos.
- Corrigidas entradas vazias e inserção de símbolos na posição zero das paletas; distinguidos erro sintático, assinatura incompleta e falsidade.
- Os 12 links para artefatos externos na proposta foram substituídos pelas páginas locais. Índice, proposta e atlas descrevem o alcance das fontes e das ampliações.
- Corrigida a largura mínima das grades em telas estreitas. A tabela do verificador silogístico agora rola dentro de seu bloco, sem cortar a página inteira.

### Evidências finais

Executado com Node.js 24.12.0:

```powershell
node --test tests/*.test.cjs
```

**Resultado: 47 testes, 47 aprovados, nenhuma falha.** A suíte inclui as regressões reproduzidas antes das correções, 1.200 argumentos de tablôs comparados com tabelas, 512 classificações silogísticas, as 512 relações modais de três mundos e a verificação das contravalorações geradas. Também verifica resultados antigos compatíveis e descarta julgamentos anteriores nos três itens cujos critérios foram corrigidos.

A verificação estrutural final encontrou **16 páginas HTML, 25 blocos JavaScript compiláveis e 401 referências locais em href/src sem destino ausente**, incluindo os fragmentos dinâmicos conhecidos. Não foram encontrados IDs duplicados; `git diff --check` também passou sem erros. A revisão cruzada conferiu os módulos formais e todos os gabaritos de provas, além das rubricas; os ajustes finais do guia e da metateoria passaram por conferência adicional.

No Chrome foram conferidos: abertura das pistas do guia, os dois diagramas de Venn-Euler, P contingente, designação de P em LP, bicondicionais em Ł₃, rejeição de ∀aPa e Pa∨Pc, contravaloração modal, alternância de textos entre C3/C4 e Espaço na reconstrução dos slides. No teste A1, 6/7 respostas corretas mantiveram o estado em andamento; 7/7 aprovaram o teste com orientação para a produção escrita, e o resultado persistiu após recarregar. As 15 páginas de leitura/instrumentos foram verificadas em viewport de 390 px; os cortes laterais encontrados foram corrigidos. A configuração de viewport foi restaurada após o teste.

### Limites que permanecem explícitos

A correspondência **integral** entre Pagani e a 2ª edição de Mortari não foi estabelecida. O guia oferece somente os pares conferidos: 1.1, 3.1(a–h) e 3.2(a–i), com sua mudança de ordem. Os demais exercícios adicionais do livro exigem comparação de enunciado antes de usar esse gabarito. As soluções autorais do curso não dependem de uma equivalência presumida entre edições.

A revisão consultou o sumário e passagens selecionadas dos PDFs, sem revisar integralmente as 527 páginas de Mortari. Os testes e a inspeção visual cobrem os componentes e os casos descritos; não constituem uma prova formal de todos os programas nem uma inspeção de cada combinação possível de interação. Os rascunhos dos prompts permanecem em memória durante a página aberta; não há persistência desses textos entre recarregamentos.
