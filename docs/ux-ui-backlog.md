# Backlog UX/UI

Backlog objetivo de melhorias de UX/UI priorizadas para o contexto da Caixa Magica, considerando padroes de mercado para locacao infantil e e-commerce orientado a conversao.

## Escala usada

- Impacto: alto, medio, baixo
- Esforco: alto, medio, baixo

## Status atual

- Concluido:
  - checkout em secoes mais claras
  - disponibilidade por periodo no detalhe do produto
  - hierarquia de CTA no detalhe do produto
  - resumo de locacao mais forte
  - cards de produto com mais contexto
  - barra de filtros mais completa
  - status de pedidos com identidade visual
  - meus pedidos como painel de acompanhamento
  - minha conta em secoes mais claras
  - empty states mais acionaveis em `Meus pedidos`, `Produtos` e `Checkout`
  - confirmacao e proximo passo em `Checkout` e `Detalhe do pedido`
  - home com proposta de valor mais forte
  - home com atalhos por faixa etaria e prova de confianca
- Fora do backlog original, mas entregue:
  - CRUD admin de usuarios
  - campo `data de nascimento` no cadastro publico
  - ajuste de acessos a `Meus pedidos` no header e perfil

## Prioridade 1

### Checkout em secoes mais claras
- Tela: `Checkout`
- Impacto: alto
- Esforco: medio
- Objetivo: reduzir friccao e deixar o fluxo mais parecido com um checkout maduro.
- Melhorias:
  - separar visualmente em blocos: resumo, recebimento, endereco, pagamento, observacoes, confirmacao
  - exibir endereco apenas quando `Entrega` estiver selecionado
  - reforcar no resumo lateral prazo, datas e total
  - melhorar estado vazio do carrinho com CTA de retorno para produtos

### Disponibilidade por periodo no detalhe do produto
- Tela: `Detalhe do produto`
- Impacto: alto
- Esforco: medio
- Objetivo: deixar claro se o item esta disponivel no periodo selecionado antes do checkout.
- Melhorias:
  - mostrar disponibilidade contextual apos selecionar data e prazo
  - exibir `X unidades livres para este periodo`
  - trocar erro seco por mensagem orientada a acao

## Prioridade 2

### Hierarquia de CTA no detalhe do produto
- Tela: `Detalhe do produto`
- Impacto: alto
- Esforco: baixo
- Objetivo: destacar a acao principal e reduzir competicao visual.
- Melhorias:
  - primario: `Adicionar ao carrinho`
  - secundario: `Alugar agora`
  - terciario: `Favoritar`

### Resumo de locacao mais forte
- Tela: `Detalhe do produto`
- Impacto: alto
- Esforco: medio
- Objetivo: consolidar as informacoes criticas de decisao em um bloco unico.
- Melhorias:
  - prazo escolhido
  - data inicial
  - devolucao prevista
  - valor
  - disponibilidade

### Cards de produto com mais contexto
- Tela: `Produtos`
- Impacto: medio
- Esforco: medio
- Objetivo: melhorar comparacao sem exigir clique.
- Melhorias:
  - exibir faixa etaria
  - exibir categoria principal
  - destacar disponibilidade com melhor leitura visual
  - avaliar CTA mais orientado: `Ver detalhes e alugar`

## Prioridade 3

### Barra de filtros mais completa
- Tela: `Produtos`
- Impacto: medio
- Esforco: medio
- Objetivo: reduzir tempo para encontrar o produto ideal.
- Melhorias:
  - separar busca, categoria e faixa etaria de forma mais clara
  - exibir contagem de resultados
  - preparar espaco para filtro futuro de disponibilidade

### Status de pedidos com identidade visual
- Tela: `Minha conta`, `Meus pedidos`, `Detalhe do pedido`, `Admin pedidos`
- Impacto: medio
- Esforco: medio
- Objetivo: facilitar leitura imediata do estado do pedido.
- Melhorias:
  - chips com cor por status
  - consistencia entre area do cliente e area admin

### Meus pedidos como painel de acompanhamento
- Tela: `Meus pedidos`
- Impacto: medio
- Esforco: medio
- Objetivo: transformar a lista em uma area de acompanhamento mais util.
- Melhorias:
  - resumo por quantidade de pedidos
  - pedidos em andamento destacados no topo
  - historico abaixo

## Prioridade 4

### Minha conta em secoes mais claras
- Tela: `Minha conta`
- Impacto: medio
- Esforco: medio
- Objetivo: reduzir sensacao de formulario longo e melhorar leitura.
- Melhorias:
  - dividir em dados pessoais, endereco, dados da crianca e acoes
  - padronizar nomes de campos mostrados ao usuario

### Empty states mais acionaveis
- Tela: `Meus pedidos`, `Produtos`, `Checkout`
- Impacto: medio
- Esforco: baixo
- Objetivo: sempre oferecer proximo passo claro.
- Melhorias:
  - `Voce ainda nao fez nenhum pedido` + botao `Explorar produtos`
  - `Carrinho vazio` + CTA forte para retornar ao catalogo

### Confirmacao e proximo passo no checkout e sucesso
- Tela: `Checkout`, `Sucesso do pedido`
- Impacto: medio
- Esforco: baixo
- Objetivo: reduzir ansiedade do usuario apos enviar uma solicitacao.
- Melhorias:
  - explicar o que acontece depois do envio
  - informar que a equipe fara confirmacao
  - reforcar retirada/entrega conforme o tipo selecionado

## Prioridade 5

### Home com proposta de valor mais forte
- Tela: `Home`
- Impacto: medio
- Esforco: medio
- Objetivo: melhorar entendimento imediato do servico.
- Melhorias:
  - bloco mais direto sobre locacao infantil
  - higienizacao, curadoria, retirada e entrega
  - CTA principal para catalogo e secundario para como alugar

### Home com atalhos por faixa etaria e prova de confianca
- Tela: `Home`
- Impacto: medio
- Esforco: medio
- Objetivo: acelerar descoberta e aumentar confianca.
- Melhorias:
  - atalhos por faixa etaria
  - bloco curto de confianca
  - banners mais orientados a acao

## Ordem recomendada de execucao

1. Checkout em secoes mais claras
2. Disponibilidade por periodo no detalhe do produto
3. Hierarquia de CTA e resumo de locacao no detalhe
4. Cards e filtros da pagina de produtos
5. Status visuais e melhoria de `Meus pedidos`
6. Reorganizacao de `Minha conta`
7. Empty states e mensagens de confirmacao
8. Home com reforco de proposta de valor e descoberta

## Entregas pequenas recomendadas

Para evitar mudancas grandes demais por vez:

1. Sprint 1
- checkout
- detalhe do produto

2. Sprint 2
- cards e filtros de produtos
- meus pedidos e status

3. Sprint 3
- minha conta
- home
