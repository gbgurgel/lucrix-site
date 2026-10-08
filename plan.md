# Plano do Lucrix

## Objetivo e implementação

Construir um site web responsivo em português do Brasil para validar, antes de investir, a rentabilidade estimada de uma oferta. A aplicação é client-side: não terá autenticação nem persistência de dados; respostas e resultados permanecem na sessão do navegador. O fluxo começa por uma página de apresentação, conduz uma pergunta por vez (no máximo 15), adapta os campos ao tipo de oferta e termina em um resultado transparente com simulador. A pessoa poderá voltar, editar premissas e ver os resultados recalculados imediatamente.

O projeto usa o starter React/TypeScript/Vite já instalado, Tailwind e a dependência `framer-motion`. Nenhum novo serviço ou armazenamento é necessário; o servidor/ banco gerenciados permanecem desativados. A publicação é estática via `pnpm build:static` e `dist/public`. A tela de boas-vindas e o questionário ficam em uma experiência única; `/404` continua sendo uma rota de fallback explícita.

### Fluxo do produto

1. **Apresentação:** explicar a estimativa, benefícios, etapas, escopo por tipo e limitações, com início do diagnóstico.
2. **Configuração e perguntas:** selecionar produto físico, digital ou serviço; depois percorrer perguntas em cartões sequenciais. Mostrar barra e número atual/total; permitir voltar e continuar; validar valores antes de avançar; não ultrapassar 15 perguntas. Campos e custos não aplicáveis não aparecem para a categoria selecionada.
3. **Resultado:** apresentar margem de contribuição, ponto de equilíbrio em unidades e valor, resultado mensal estimado, premissas e fórmulas. Avisar que o cálculo não é previsão nem aconselhamento contábil.
4. **Cenários e simulador:** comparar cenários pessimista, base e otimista, indicando as hipóteses utilizadas; permitir ajustar preço, volume, CAC e custos e refletir as alterações no resultado mensal sem recarregar a página.

### Regras de cálculo e domínio

- **Produto físico:** incluir custo por unidade, embalagem, frete, comissão, taxa percentual e fixa de pagamento, impostos, CAC, devoluções/reembolsos, custos fixos e volume esperado.
- **Produto digital:** não incluir frete nem embalagem; considerar taxas de pagamento, reembolsos/garantia, CAC, custos variáveis aplicáveis e custos fixos; não modelar recorrência.
- **Serviço:** usar o custo de entrega informado por serviço; não converter horas, disponibilidade, agenda ou capacidade.
- Margem de contribuição unitária = preço unitário menos custos variáveis unitários aplicáveis, incluindo taxas percentuais sobre o preço, CAC e custo esperado de devolução/reembolso quando informados. Margem de contribuição percentual = margem unitária / preço. Ponto de equilíbrio em unidades = arredondamento para cima de custos fixos / margem unitária positiva; exibir indisponibilidade quando preço ou margem não permite cálculo. Resultado mensal estimado = margem unitária × volume mensal − custos fixos. Se informado investimento inicial, exibir retorno simples como investimento inicial / resultado mensal positivo, sem tratá-lo como capital de giro.
- Tratar campos opcionais vazios como zero, sempre nomear as premissas e formatar BRL, percentual e quantidades em pt-BR. Não apresentar valores negativos como promessa; explicar o caso de margem insuficiente.
- Destacar o que não é modelado: assinaturas recorrentes, capacidade de atendimento, vários produtos juntos, estoque e capital de giro (o investimento inicial entra apenas no cálculo de retorno), sazonalidade, recompra e regime tributário. Informar que o resultado não substitui um contador.

## Direção visual aprovada

- **Movimento estético:** interface de exploração espacial digital, guiada pela captura de referência do usuário: questionário escuro em violeta profundo, filete de progresso luminoso, poeira estelar discreta, título branco amplo, subtítulo secundário com contraste acessível, campo de formulário largo e botões de navegação.
- **Princípios centrais:** clareza antes do ornamento; profundidade cósmica com contenção; movimento que comunica progresso; números e hipóteses sempre legíveis.
- **Filosofia de cor:** fundo quase preto com nuance índigo/violeta para reduzir fadiga; violeta luminoso como assinatura de foco e avanço; texto em marfim frio e lavanda secundária para hierarquia; verde/âmbar/vermelho reservados a sinais financeiros neutros, sem sugerir certeza.
- **Paradigma de layout:** apresentação editorial arejada com blocos alternados e assimétricos; no diagnóstico, painel de largura controlada em posição central com progresso alinhado no topo, ecoando exatamente a hierarquia da referência; resultado em trilha de leitura, com simulador ao lado em telas largas e empilhado em telas estreitas.
- **Motivos de assinatura:** linha de progresso com brilho orbital; campo estelar sutil em canvas; cartões e bordas translúcidas com halo violeta.
- **Filosofia de interação:** cada avanço confirma que os dados foram aceitos; movimentos curtos e consistentes conectam uma pergunta à seguinte; campos oferecem foco evidente e valores de exemplo; nenhum efeito deve mascarar conteúdo ou atrasar a interação.
- **Animação:** almejar reprodução suave de 60 fps ou taxa nativa do dispositivo. Usar `requestAnimationFrame` para o campo estelar com quantidade limitada de pontos e atualização eficiente; suspender animação quando a aba estiver oculta e reduzir intensidade/atividade quando houver `prefers-reduced-motion`. Para transições de conteúdo, priorizar `transform` e `opacity` e usar Framer Motion com springs discretos, duração aproximada de 240–420 ms e escalonamento breve. Animar entrada da página, brilho e preenchimento da barra, estados de hover/foco/pressionado, indicadores, surgimento de cartões, mudança de etapa, transição ao resultado e números do simulador. Não animar continuamente tudo ao mesmo tempo: reservar loop contínuo ao fundo estelar e halos suaves para preservar desempenho, legibilidade, bateria e acessibilidade. Desativar/parar loops e deslocamentos não essenciais em redução de movimento.
- **Sistema tipográfico:** Inter, com fallbacks de sistema, em toda a aplicação; títulos em peso 700–800, rótulos em 600, corpo em 400–500. Usar títulos responsivos e numerais/tabulares quando disponíveis para comparar valores sem trepidação.
- **Essência da marca:** “uma leitura clara dos números da sua oferta antes do primeiro investimento”; personalidade: lúcida, cuidadosa, exploratória.
- **Voz:** direta, acolhedora e sem promessas. Exemplos: “Veja o que precisa acontecer para a conta fechar.” / “Uma estimativa clara — com cada premissa à vista.”
- **Logotipo:** wordmark “Lucrix” em sans geométrica bold, acompanhado de um símbolo proprietário composto por três pontos orbitais que desenham um pequeno gráfico ascendente; evitar a marca default genérica.
- **Cor exclusiva da marca:** violeta elétrico `#9B5CFF`, usado para progresso e foco, dosado contra o fundo espacial.

## Estrutura principal do projeto

- `client/src/pages/Home.tsx`: reúne a landing, o questionário, os resultados, o simulador e os controles de reinício/edição, com subcomponentes de UI locais à página.
- `client/src/components/Starfield.tsx`: campo estrelado em canvas, com `requestAnimationFrame`, limite de pontos, pausa quando a aba fica oculta e suporte a movimento reduzido.
- `client/src/lib/questionnaire.ts`: modelo tipado de perguntas/visibilidade por categoria, validação e limites de etapas; troca de categoria limpa respostas cujo significado ou aplicabilidade muda, preservando as premissas comuns.
- `client/src/lib/profitability.ts`: funções puras de custos, margem, ponto de equilíbrio, resultado, cenários e normalização por categoria que exclui custos ocultos não aplicáveis; sem dependência de interface.
- `client/src/lib/profitability.test.ts`: testes unitários da matemática, limites e ramificações do questionário, limpeza ao trocar a categoria e normalização de respostas antigas.
- `client/src/index.css`: tokens, layouts, estados de foco e movimento, breakpoints e alternativa `prefers-reduced-motion`.
- `client/src/App.tsx`: tema escuro, redução de movimento para Framer Motion e rotas do site.
- `client/index.html`: idioma `pt-BR`, metadados e favicon.
- `client/public/favicon.svg`: símbolo orbital vetorial usado como favicon e logomark do projeto.
- `client/public/manus-routes.json`: declaração estática das rotas `/` e `/404`.
- `vitest.config.ts`: execução dos testes existentes do servidor e dos novos testes de domínio no cliente.
- `app.config.ts`: URL HTTPS literal do logomark para o checkpoint do projeto.
- `plan.md`: decisões de design e implementação aprovadas.
- `TODO.md`: critérios de produto completos enquanto não houver ToDo nativo disponível.

## Restrições e dependências

Sem autenticação, serviços externos, persistência, novas bibliotecas ou imagens decorativas. A imagem fornecida é guia visual e não será reproduzida como screenshot de fundo. Manter a linguagem pt-BR e a declaração de rotas atualizada. Os resultados exibem as premissas numéricas aplicáveis à categoria; a acessibilidade inclui navegação por teclado, foco visível, rótulos associados, contraste de ao menos 4,5:1 em textos normais sobre os fundos escuros declarados, barra de progresso semântica, anúncio/foco do título do resultado e respeito a movimento reduzido.
