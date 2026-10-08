# ToDo do Lucrix

## Página de apresentação e escopo

- [x] Em português do Brasil, explicar que a pessoa informa preço, custos e volume esperado para receber margem de contribuição, ponto de equilíbrio e cenários, com premissas visíveis; esclarecer que é uma estimativa, não uma previsão.
- [x] Explicar que o fluxo tem até 15 perguntas, uma por vez; apresenta 3 cenários com hipóteses visíveis; explica o cálculo no resultado; as perguntas se adaptam ao tipo de oferta; e o simulador altera resultado mensal estimado ao ajustar preço, volume, CAC e custos.
- [x] Descrever as etapas: responder preço, custos, taxas, impostos, aquisição de clientes e volume esperado; calcular margem de contribuição com os custos variáveis informados, ponto de equilíbrio e resultado mensal estimado; testar cenários pessimista, base e otimista mais o simulador interativo.
- [x] Explicitar as coberturas e as limitações: produto físico considera custo, embalagem, frete, comissão, taxa de pagamento, taxa fixa, impostos, CAC, devoluções e custos fixos; digital não considera frete nem embalagem, considera taxas, reembolsos/garantia e CAC e não trata venda recorrente; serviço usa um custo de entrega por serviço informado e não modela horas, agenda ou capacidade de atendimento; não são tratados assinaturas recorrentes, capacidade de atendimento, vários produtos juntos, estoque, capital de giro (investimento inicial apenas no cálculo de retorno), sazonalidade, recompra nem regime tributário.
- [x] Informar que a estimativa não inclui capital de giro, sazonalidade nem recompra e não substitui um contador.

## Questionário guiado e adaptação por tipo

- [x] O questionário deve ter no máximo 15 perguntas, mostrar uma pergunta por vez, barra de progresso e contador de pergunta atual/total, usar campo de entrada amplo e oferecer controles Voltar e Continuar.
- [x] Incluir seleção de produto físico, produto digital ou serviço; adaptar perguntas e custos ao tipo escolhido e omitir frete/embalagem para digital. Para serviço, recolher o custo de entrega por serviço, sem pressupor horas, agenda ou capacidade.
- [x] Recolher preço, custos, taxas, impostos, aquisição de clientes/CAC e volume esperado; para físico incluir custos por unidade de produto, embalagem e frete, comissão, taxa percentual e fixa de pagamento, impostos, CAC e devoluções; para digital incluir taxas, reembolsos/garantia, CAC e custos aplicáveis; recolher custos fixos e permitir investimento inicial somente para cálculo de retorno.
- [x] Permitir voltar e alterar respostas sem perder os demais dados da sessão; validar entradas antes de avançar; sinalizar campos aplicáveis e opcionais de forma compreensível.

## Resultado e transparência dos cálculos

- [x] Exibir margem de contribuição, ponto de equilíbrio e resultado mensal estimado com as premissas visíveis e explicação clara das fórmulas utilizadas.
- [x] Calcular margem de contribuição com base nos custos variáveis informados; levar em conta os custos por tipo de oferta; mostrar margem percentual, ponto de equilíbrio em unidades e valores, resultado mensal estimado e, quando houver investimento inicial e resultado positivo, retorno simples com a premissa explícita.
- [x] Não exibir ponto de equilíbrio numérico enganoso quando o preço ou a margem não permitir calculá-lo; explicar margem nula ou insuficiente.
- [x] Formatar valores monetários, percentuais e quantidades conforme pt-BR; alterações no simulador devem atualizar o resultado mensal estimado sem recarregar a página.

## Cenários e simulador

- [x] Comparar três cenários identificados — pessimista, base e otimista — e mostrar as hipóteses de volume/preço/custos de cada cenário.
- [x] Oferecer simulador interativo para ajustar preço, volume, CAC e custos e ver imediatamente o resultado mensal estimado mudar.
- [x] Fazer os controles e valores simulados serem acessíveis, responsivos e associados a rótulos claros.

## Visual, animação, responsividade e acessibilidade

- [x] Usar a imagem de referência como guia: tema escuro em violeta profundo, brilho roxo, fundo espacial com estrelas sutis, progresso no topo, contador da pergunta, título grande, breve subtítulo, campo largo e botões Voltar/Continuar.
- [x] Deixar o projeto bastante animado, incluindo elementos e transições, mas com reprodução fluida e muitos frames; buscar 60 fps ou a taxa nativa do dispositivo, priorizando animações leves e transform/opacity. Animar transições entre perguntas, progresso, foco/hover/pressionado, surgimento de cartões, resultado e resposta visual do simulador.
- [x] Respeitar `prefers-reduced-motion`: reduzir ou suspender movimentos não essenciais, sem retirar informação nem bloquear uso. Pausar animação decorativa quando a aba estiver oculta.
- [x] Manter contraste, controles acessíveis por teclado, foco visível, rótulos associados aos campos e estados coerentes em telas pequenas e grandes.
