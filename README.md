# Curso de fluência em lógica

Este repositório reúne um curso autoinstrucional de lógica em português, organizado em módulos e materiais complementares em HTML estático. O conteúdo foi pensado para estudantes sem formação prévia, com foco em raciocínio, argumentação, validade, prova e leitura de lógica formal.

## Visão geral

O projeto funciona como uma trilha de estudo que parte de conceitos básicos de argumento e inferência e avança até temas mais formais, incluindo:

- argumento, premissas e conclusão
- validade e correção
- dedução e indução
- falácias informais
- lógica proposicional
- quantificadores e linguagem formal
- metateoria e lógicas não clássicas

A navegação principal é feita pelo arquivo [index.html](index.html), que funciona como índice geral do curso.

## Estrutura do repositório

- [index.html](index.html) — página inicial e índice do curso
- [00-proposta.html](00-proposta.html) — proposta curricular e organização do material
- [01-modulo-1.html](01-modulo-1.html) — módulo 1: argumento, inferência e validade
- [01a-slides-modulo-1.html](01a-slides-modulo-1.html) — aula/slides do módulo 1
- [01b-modulo-1a.html](01b-modulo-1a.html) — material complementar do módulo 1
- [02-modulo-2.html](02-modulo-2.html) — módulo 2
- [03-modulo-3.html](03-modulo-3.html) — módulo 3
- [04-modulo-4.html](04-modulo-4.html) — módulo 4
- [05-modulo-5.html](05-modulo-5.html) — módulo 5
- [06-modulo-6.html](06-modulo-6.html) — módulo 6
- [07-modulo-7.html](07-modulo-7.html) — módulo 7
- [08-modulo-8.html](08-modulo-8.html) — módulo 8
- [atlas.html](atlas.html) — atlas ou mapa de referências/conceitos
- [prompts.html](prompts.html) — prompts de apoio e correção de produções
- [provas.html](provas.html) — banco de provas / atividades avaliativas
- [guia-estudo.html](guia-estudo.html) — leituras por unidade, prática essencial, aprofundamento, notação e correspondências verificadas de Pagani
- [REVISAO.md](REVISAO.md) — achados da revisão, correções aplicadas e evidências de verificação

## Como usar

1. Abra o arquivo [index.html](index.html) em um navegador.
2. Navegue pelos módulos e materiais em ordem.
3. Consulte o guia de estudo e tente os exercícios antes de abrir as pistas e soluções comentadas.
4. Conclua todos os itens do teste do marco e obtenha pelo menos 75% de acerto. O banco reúne 47 questões.
5. Verifique também a produção escrita do marco, com os critérios do módulo e as nove rubricas de correção. A aprovação do teste sozinha não conclui o marco.

Como o projeto é estático em HTML, não há instalação de dependências nem build step. Basta abrir os arquivos diretamente no navegador ou servir a pasta localmente com um servidor simples.

As leituras usam os PDFs da pasta [references/](references/). A numeração do gabarito de Pagani não corresponde automaticamente à 2ª edição de Mortari; consulte a tabela de correspondências no guia. O texto inserido nos prompts é preservado ao alternar entre eles enquanto a página permanece aberta; salve uma cópia antes de recarregar ou fechar.

## Requisitos

- Navegador moderno
- Sistema de arquivos local ou servidor HTTP simples

## Verificação do material

Para executar os testes de regressão, use Node.js, sem instalar pacotes (verificado com a versão 24.12.0):

```powershell
node --test tests/*.test.cjs
```

A suíte contém 47 testes e cobre cálculos proposicionais e polivalentes, assinatura de primeira ordem, silogismos, relações modais, teclado, preservação de textos e critérios de aprovação. Node é necessário apenas para esses testes, não para estudar o curso.

## Observações

- O material é voltado ao estudo autônomo.
- A organização do curso prioriza progressão por domínio e marcos de aprendizagem, em vez de cronograma rígido.
- O repositório foi estruturado como um conjunto de páginas interligadas, com navegação entre módulos e recursos.

## Licença

Este projeto está licenciado sob a MIT License.
