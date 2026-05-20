# Planejamento Frontend — API Mockada e Funcionalidades Pendentes

## Objetivo

Evoluir o frontend atual da Caixa Mágica para atender o contrato técnico definido no arquivo `caixa-magica-contexto-tecnico-consolidado-ia.md`, usando os endpoints reais previstos pela API, mas com dados mockados temporariamente.

Quando a API do outro repositório estiver pronta, a troca deve acontecer principalmente dentro da camada de services, sem reescrever telas, hooks e componentes.

## Premissas

- Este planejamento é somente para o frontend.
- O backend está sendo desenvolvido em outro repositório.
- O projeto atual continuará como frontend standalone até a futura união em monorepo.
- A arquitetura atual `src/app`, `src/features`, `src/shared` será mantida.
- Os services devem usar os endpoints corretos da API desde agora.
- Enquanto a API não existir, os services retornarão mocks locais.
- O formato dos mocks deve seguir o contrato da API, não o formato antigo atual.
- O projeto deve continuar rodando com `npm run build` após cada bloco importante.

## Estrutura De Pastas Recomendada

```txt
src/
  app/
    App.jsx
    router.jsx
    providers.jsx

  shared/
    services/
      apiClient.js
      apiConfig.js
      mockDelay.js
    errors/
      ApiError.js
    utils/
      dateUtils.js
      moneyUtils.js
    components/
      Header/
      Footer/
      Hero/
      Button/
      Input/
      EmptyState/
      LoadingState/
      ErrorMessage/

  features/
    products/
      api/
        productsApi.js
        productsMock.js
      components/
        ProductCard/
        ProductFilters/
        ProductGrid/
        ProductPriceOptions/
      hooks/
        useProducts.js
        useProductDetail.js
        useCategories.js
      pages/
        ProductsPage.jsx
        ProductDetailPage.jsx
      mappers/
        productMapper.js
      styles/

    cart/
      context/
        CartContext.jsx
      hooks/
        useCart.js
      utils/
        cartTotals.js

    checkout/
      api/
        ordersApi.js
        ordersMock.js
      components/
        CheckoutForm/
        RentalDateSelector/
        DeliveryTypeSelector/
        PaymentTypeSelector/
        CheckoutSummary/
      hooks/
        useCheckout.js
      pages/
        CheckoutPage.jsx
        OrderSuccessPage.jsx
      utils/
        checkoutDates.js
        orderPayload.js
      styles/

    auth/
      api/
        authApi.js
        authMock.js
      context/
        AuthContext.jsx
      hooks/
        useAuth.js
      pages/
        LoginPage.jsx
        RegisterPage.jsx
      styles/

    account/
      api/
        accountApi.js
        accountMock.js
      hooks/
        useMyOrders.js
      pages/
        AccountPage.jsx
        MyOrdersPage.jsx
        OrderDetailPage.jsx
      styles/

    search/
      pages/
        SearchPage.jsx
      hooks/
        useSearchProducts.js

    institutional/
      pages/
      styles/
```

## Camada De API Mockável

Criar uma camada central que já conheça os endpoints reais.

```txt
src/shared/services/apiConfig.js
src/shared/services/apiClient.js
src/shared/services/mockDelay.js
```

Responsabilidades:

- definir `API_BASE_URL`;
- definir se o frontend usa mock ou API real;
- centralizar chamadas HTTP;
- padronizar tratamento de erro;
- permitir troca futura de mock para API real com impacto mínimo.

Configuração sugerida:

```js
export const API_BASE_URL = "/api/v1";
export const USE_MOCKS = true;
```

No futuro, usar variáveis de ambiente:

```txt
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCKS=true
```

## Endpoints Que Devem Existir No Frontend

Mesmo usando mock, os services devem ser desenhados em cima destes endpoints:

```txt
GET /health

GET /api/v1/produtos/
GET /api/v1/produtos/categorias
GET /api/v1/produtos/{product_id}

POST /api/v1/pedidos/

GET /api/v1/pedidos/disponibilidade/{product_id}
GET /api/v1/pedidos/{order_id}
PATCH /api/v1/pedidos/{order_id}/status

POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/usuarios/me
GET /api/v1/usuarios/me/pedidos
GET /api/v1/usuarios/me/enderecos
POST /api/v1/usuarios/me/enderecos
```

No M1, alguns endpoints podem retornar mock com comportamento de `"Em breve"`, especialmente disponibilidade, detalhe/status de pedido e autenticação real.

## Fase 1: Padronizar Dados De Produto

Hoje o mock usa formato legado:

```js
nome
descricao
categoria
precos
imagem
```

O contrato da API espera:

```js
id
name
slug
type
age_range
total_units
is_featured
pricing
images
categories
```

Tarefas:

- Criar `productsMock.js` com dados no formato da API.
- Substituir ou aposentar gradualmente `products.json` antigo.
- Criar `productMapper.js` se for necessário adaptar dados para os componentes.
- Atualizar `ProductCard`, `ProductsPage` e `ProductDetailPage` para usarem o formato da API.
- Remover a opção `1 dia`, porque o contrato aceita apenas `7`, `15`, `30`.

Critérios de aceite:

- Listagem usa `pricing`.
- Detalhe usa `images`.
- Filtros usam categorias do endpoint mockado.
- Nenhuma tela depende de `produto.precos["1dia"]`.

## Fase 2: Services De Catálogo

Criar:

```txt
src/features/products/api/productsApi.js
src/features/products/api/productsMock.js
```

Funções:

```js
getProducts()
getCategories()
getProductById(productId)
```

Comportamento esperado:

- Se mock ativo, retornar dados locais.
- Se mock desativado, chamar endpoints reais.

Endpoints:

```txt
GET /api/v1/produtos/
GET /api/v1/produtos/categorias
GET /api/v1/produtos/{product_id}
```

Tratamento:

- `404` no detalhe deve redirecionar para `/produtos`.
- Erro genérico deve mostrar mensagem amigável.

## Fase 3: Hooks De Catálogo

Criar:

```txt
src/features/products/hooks/useProducts.js
src/features/products/hooks/useCategories.js
src/features/products/hooks/useProductDetail.js
```

Responsabilidades:

- controlar `loading`;
- controlar `error`;
- guardar dados;
- chamar services;
- encapsular lógica das páginas.

Exemplo conceitual:

```js
const { products, loading, error } = useProducts();
```

Critérios de aceite:

- `ProductsPage` não chama mock direto.
- `ProductDetailPage` não importa JSON.
- Estados de loading e erro aparecem na UI.

## Fase 4: Busca E Filtros

Melhorar a funcionalidade atual.

Implementar:

- busca por nome;
- filtro por categoria;
- filtro por faixa etária, se vier da API;
- estado vazio quando não houver resultado;
- preservar termo pesquisado de `/pesquisa/:termo`.

Arquivos:

```txt
features/products/components/ProductFilters/
features/search/hooks/useSearchProducts.js
```

Critérios de aceite:

- `/produtos` filtra produtos localmente sobre resposta do service.
- `/pesquisa/:termo` reutiliza o mesmo service/hook.
- UI mostra `Nenhum produto encontrado` quando aplicável.

## Fase 5: Carrinho Alinhado Ao Contrato

Hoje o carrinho é básico. Ele precisa guardar dados necessários para criar pedido.

Novo item de carrinho:

```js
{
  product_id,
  name,
  image_url,
  days,
  start_date,
  end_date,
  price_snapshot
}
```

Melhorias:

- remover item;
- alterar período;
- alterar data inicial;
- calcular subtotal;
- validar `days` somente `7`, `15`, `30`;
- calcular `end_date = start_date + days`.

Criar:

```txt
features/cart/utils/cartTotals.js
shared/utils/dateUtils.js
```

Critérios de aceite:

- Carrinho já monta dados compatíveis com `POST /api/v1/pedidos/`.
- Não existe período inválido como `1dia`.

## Fase 6: Seleção De Datas No Produto

Na página de detalhe do produto, adicionar seleção real de aluguel.

Campos:

- data inicial;
- prazo: `7`, `15`, `30`;
- data final calculada;
- preço conforme `pricing`.

Comportamento:

- usuário escolhe data inicial;
- escolhe prazo;
- frontend calcula `end_date`;
- adiciona ao carrinho com payload compatível.

Enquanto endpoint de disponibilidade estiver em desenvolvimento:

- botão `Verificar disponibilidade` pode ficar desabilitado;
- ou pode mostrar `Em breve`;
- ou pode simular disponibilidade positiva via mock.

Critérios de aceite:

- Produto só pode ser adicionado ao carrinho com data válida.
- `end_date` nunca é digitado manualmente.

## Fase 7: Checkout

Criar fluxo de finalização.

Páginas:

```txt
features/checkout/pages/CheckoutPage.jsx
features/checkout/pages/OrderSuccessPage.jsx
```

Componentes:

```txt
CheckoutForm
CheckoutSummary
DeliveryTypeSelector
PaymentTypeSelector
RentalDateSelector
```

Payload para `POST /api/v1/pedidos/`:

```js
{
  delivery_type: "delivery" | "pickup",
  payment_type: "on_delivery_cash" | "on_delivery_card" | "pending",
  items: [
    {
      product_id: 1,
      days: 7,
      start_date: "2026-05-20",
      end_date: "2026-05-27"
    }
  ],
  address_id,
  notes,
  baby_name,
  baby_birthdate,
  origin: "site"
}
```

Enquanto a API não existir, `ordersMock.js` deve retornar:

```js
{
  success: true,
  data: {
    id: 1,
    status: "pendente",
    total: 225
  }
}
```

Critérios de aceite:

- Checkout cria pedido mockado usando endpoint correto no service.
- Sucesso redireciona para `/pedido/sucesso/:id` ou `/pedidos/:id`.
- Carrinho é limpo após pedido criado com sucesso.

## Fase 8: Tratamento De Erros Da API

Criar padrão frontend para erros.

Arquivo:

```txt
src/shared/errors/ApiError.js
```

Comportamentos:

- `400` indisponibilidade: mostrar inline no checkout.
- `400` preço inválido: mostrar erro controlado e registrar como bug de fluxo.
- `404` produto: redirecionar `/produtos`.
- `501`: mostrar `Em breve` e desabilitar ação.
- erro de rede: mostrar mensagem amigável.

Critérios de aceite:

- Nenhum `alert()` para erro de API.
- Mensagens aparecem próximas ao formulário ou ação.

## Fase 9: Área Do Cliente

Criar estrutura inicial mesmo com mocks.

```txt
features/account/pages/AccountPage.jsx
features/account/pages/MyOrdersPage.jsx
features/account/pages/OrderDetailPage.jsx
features/account/api/accountApi.js
features/account/api/accountMock.js
```

Rotas:

```txt
/minha-conta
/meus-pedidos
/pedidos/:id
```

Mocks:

- lista de pedidos do usuário;
- detalhe do pedido;
- status `pendente`, `confirmado`, `em_uso`, `devolvido`, `finalizado`, `cancelado`, `atrasado`.

Endpoints planejados:

```txt
GET /api/v1/usuarios/me
GET /api/v1/usuarios/me/pedidos
GET /api/v1/pedidos/{order_id}
```

Critérios de aceite:

- Área existe visualmente.
- Dados vêm de service mockado.
- Preparada para API real.

## Fase 10: Auth Preparado Para Futuro

O login atual é fake e usa `localStorage`. O documento recomenda token futuro em Context.

Criar:

```txt
features/auth/context/AuthContext.jsx
features/auth/hooks/useAuth.js
features/auth/api/authApi.js
features/auth/api/authMock.js
```

Rotas:

```txt
/login
/cadastro
```

Comportamento M1:

- login pode continuar mockado;
- token fake fica em Context;
- não usar `localStorage` para token;
- deixar claro que auth real ainda depende da API.

Endpoints planejados:

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/usuarios/me
```

Critérios de aceite:

- Login não grava mais `usuario` no `localStorage`.
- Contexto de auth existe.
- Tela de cadastro existe ou placeholder funcional.

## Fase 11: Rotas Novas

Atualizar `src/app/router.jsx`.

Rotas a manter:

```txt
/
/produtos
/produtos/:id
/quem-somos
/como-alugar
/duvidas
/contrato
/pesquisa/:termo
/login
```

Adicionar:

```txt
/cadastro
/checkout
/pedido/sucesso/:id
/minha-conta
/meus-pedidos
/pedidos/:id
```

Opcional para etapa posterior:

```txt
/admin
/admin/produtos
/admin/pedidos
```

## Fase 12: Estados Visuais Reutilizáveis

Criar componentes compartilhados:

```txt
shared/components/LoadingState
shared/components/ErrorMessage
shared/components/EmptyState
shared/components/Button
shared/components/Input
```

Uso esperado:

- listagem carregando;
- erro de produto;
- checkout com erro inline;
- lista vazia;
- pedidos vazios.

Critérios de aceite:

- Páginas não repetem markup de loading, erro e estado vazio.

## Fase 13: Preparação Para Monorepo Futuro

Não mover agora para `frontend/`, mas deixar preparado.

Ajustes recomendados:

- documentar que este repo é o frontend temporário;
- evitar caminhos absolutos fora de `src`;
- manter scripts simples;
- manter `@` apontando para `src`.

Quando unir em monorepo:

```txt
caixa-magica/
  backend/
  frontend/
    src/
    package.json
    vite.config.js
```

## Ordem Recomendada De Desenvolvimento

1. Padronizar mocks no formato da API.
2. Criar `apiClient`, config e services mockáveis.
3. Refatorar catálogo para usar services/hooks.
4. Corrigir produto/detalhe para `7`, `15`, `30` e datas.
5. Melhorar carrinho com dados compatíveis com pedido.
6. Criar checkout mockado com `POST /api/v1/pedidos/`.
7. Implementar tratamento de erros `400`, `404`, `501`.
8. Criar área do cliente mockada.
9. Criar auth context e remover `localStorage`.
10. Adicionar rotas novas.
11. Criar componentes compartilhados de loading, erro e vazio.
12. Revisar responsividade e build.

## Commits Sugeridos

```txt
refactor: align product mocks with api contract
feat: add mockable api service layer
refactor: load catalog through product hooks
feat: add rental date selection to product detail
refactor: align cart items with order payload
feat: add checkout flow with mocked order endpoint
feat: add api error handling states
feat: add mocked account order pages
feat: prepare auth context and register page
chore: add shared loading error and empty states
```

## Critérios De Pronto

- `npm run build` passa.
- Catálogo não importa JSON diretamente em página.
- Services usam nomes de endpoints reais.
- Mock tem o mesmo formato esperado pela API.
- Carrinho monta itens com `product_id`, `days`, `start_date`, `end_date`.
- Checkout monta payload compatível com `POST /api/v1/pedidos/`.
- Produto inexistente redireciona para `/produtos`.
- Erro `400` de indisponibilidade aparece inline.
- Erro `501` aparece como `Em breve`.
- Login não depende mais de `localStorage`.
- Rotas novas estão cadastradas.
- A troca de mock para API real fica concentrada nos arquivos `api`.

## Resumo Da Entrega Esperada

Ao final deste planejamento, o frontend ainda poderá funcionar sem backend, mas já estará estruturado como se consumisse a API real.

Quando o backend estiver pronto, a integração deve exigir principalmente:

- trocar `USE_MOCKS` para `false`;
- ajustar `VITE_API_BASE_URL`, se necessário;
- validar diferenças reais de payload;
- remover mocks gradualmente.

As telas, hooks e componentes principais devem permanecer praticamente intactos.
