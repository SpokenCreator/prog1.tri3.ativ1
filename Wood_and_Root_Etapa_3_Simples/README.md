# Wood & Root - Etapa 2: Personalização de produtos

Esta etapa continua o projeto original e mantém Bun, TypeScript, HTML, JavaScript e SQLite.

## O que foi acrescentado
- Botão **Personalizar** em cada produto do catálogo.
- Formulário para escolher tipo de madeira, cor, design e dimensões.
- Cálculo do valor adicional conforme madeira e design.
- Salvamento da personalização no SQLite, relacionada ao usuário logado e ao produto.

## Valores adicionais demonstrativos
- Madeira Pinus: R$ 0,00; Carvalho: R$ 200,00; Imbuia: R$ 350,00.
- Design Simples: R$ 0,00; Trabalhado: R$ 150,00.

Esses valores são exemplos para implementar o cálculo da classe Personalização. Podem ser ajustados conforme as regras definidas para o projeto.

## Como executar
1. Instale o Bun, caso ainda não tenha: https://bun.sh
2. Abra o terminal na pasta do projeto.
3. Execute `bun install`.
4. Execute `bun run index.ts`.
5. Acesse `http://localhost:3000`.

A personalização fica salva na tabela `personalizations`. Nesta etapa ela ainda não é um pedido nem um item de carrinho; essa integração será feita nas próximas etapas, conforme as classes Carrinho e Pedido do diagrama.
