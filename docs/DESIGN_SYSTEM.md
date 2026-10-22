# Design system

Identidade: Carbon `#15151D`, Deep Surface `#20212B`, Volt Green `#B6FF45`, Hyper Purple `#7957FF`, Rush Coral `#FF684A`, Flow Cyan `#32D9ED`, branco e cinza `#A5A6B3`. O fundo editorial utiliza `#101114`; superfícies e artes oficiais preservam a paleta.

Space Grotesk em títulos, números e estatísticas; Inter em texto/interface, servidas localmente por @fontsource. Títulos fluidos com `clamp`, CTAs de alto contraste, bordas discretas e espaços largos. Imagens em WebP via Next Image, hero prioritário e demais assets sob carregamento otimizado.

Grid máximo de 1320 px; desktop com margens de 64 px, notebook 35 px e móvel 22 px. Cards adaptam de quatro colunas para duas; modalidades passam a uma; ligas passam de oito para quatro. Formulário e FAQ empilham no móvel.

Botões exibem hover, foco visível e estados pressionados. O verde diferencia ação principal e seleção; não é o único indicador de seleção, que também possui borda, texto e estado ARIA. Motion introduz seções uma única vez. `prefers-reduced-motion` desativa animações e scroll suave.

Assets são recortes das referências fornecidas. Não houve recriação de logotipo, nomes de medalhas ou insígnias. Mockups e dados de evolução são explicitamente demonstrativos.

Animações adicionais: entrada escalonada no hero e nas etapas, flutuação inicial do smartphone e XP, barra de progresso de leitura, crescimento das barras ilustrativas ao entrar na tela, transição entre coleções, brilho nas medalhas ao passar o mouse, destaque das ligas e abertura suave do FAQ. Movimentos automáticos decorativos terminam em até cinco segundos. Interações priorizam transform e opacity, e o modo de redução de movimento exibe o conteúdo imediatamente. A galeria usa as imagens individuais oficiais recebidas posteriormente no ZIP.
