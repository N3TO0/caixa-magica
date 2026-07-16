# Alteracoes De Backend

Relatorio pratico com as alteracoes feitas no backend durante este ciclo, considerando o estado final do projeto.

## 1. Perfil de usuario com novos campos

### Alteracao
Adicao de campos de perfil no usuario, principalmente `birthdate` e `profile_photo`.

### Objetivo
Permitir cadastro e edicao de dados pessoais mais completos.

### Porque
O frontend passou a trabalhar com perfil mais completo e precisava persistir esses dados no backend.

### Pontos alterados ou criados no back
- `backend/app/users/models.py`
- `backend/app/users/schemas.py`
- `backend/app/users/service.py`
- `backend/alembic/versions/9b1a2c3d4e5f_add_user_profile_fields.py`

## 2. Resposta de autenticacao com token e usuario

### Alteracao
Padronizacao das respostas de login e cadastro com token + dados do usuario.

### Objetivo
Facilitar o consumo pelo frontend sem chamadas extras logo apos autenticar.

### Porque
O frontend precisava receber os dados do usuario junto com o token logo apos autenticar.

### Pontos alterados ou criados no back
- `backend/app/users/schemas.py`
- `backend/app/users/router.py`

## 3. Cadastro de categoria no catalogo

### Alteracao
Criacao da rota administrativa para cadastrar categorias.

### Objetivo
Permitir ao admin criar categorias sem depender de insert manual no banco.

### Porque
O painel administrativo passou a precisar criar categorias durante o cadastro de produto.

### Pontos alterados ou criados no back
- `backend/app/catalog/schemas.py`
- `backend/app/catalog/service.py`
- `backend/app/catalog/router.py`

## 4. Upload e exposicao de imagem de produto

### Alteracao
Criacao do fluxo de upload de imagem e exposicao de arquivos salvos em `/uploads`.

### Objetivo
Permitir selecionar imagem do dispositivo no cadastro de produto.

### Porque
O formulario administrativo precisava suportar imagem local, nao apenas URL manual.

### Pontos alterados ou criados no back
- `backend/app/main.py`
- `backend/app/catalog/router.py`

## 5. Imagens no create/update de produto

### Alteracao
Suporte para receber e persistir imagens no cadastro e edicao de produto.

### Objetivo
Salvar imagens associadas ao produto no fluxo administrativo.

### Porque
O banco ja possuia `product_images`, mas o backend ainda nao usava esse recurso no CRUD de produto.

### Pontos alterados ou criados no back
- `backend/app/catalog/schemas.py`
- `backend/app/catalog/service.py`

## 6. Disponibilidade exposta no catalogo

### Alteracao
Calculo e exposicao de `available_units` nos produtos retornados pela API.

### Objetivo
Permitir ao frontend mostrar quantidade disponivel em listagem e detalhe.

### Porque
Antes a API devolvia apenas `total_units`, sem a quantidade realmente disponivel.

### Pontos alterados ou criados no back
- `backend/app/catalog/schemas.py`
- `backend/app/catalog/service.py`

## 7. Detalhe e CRUD administrativo de usuarios

### Alteracao
Criacao do detalhe admin de usuario e suporte para criar, editar e excluir usuario pela area administrativa.

### Objetivo
Permitir gestao completa de usuarios pelo admin.

### Porque
Antes o admin so conseguia listar usuarios; nao havia CRUD completo.

### Pontos alterados ou criados no back
- `backend/app/users/schemas.py`
- `backend/app/users/service.py`
- `backend/app/users/router.py`

## 8. Data de nascimento no cadastro publico

### Alteracao
Adicao de `birthdate` no schema de cadastro de usuario.

### Objetivo
Permitir que novos usuarios informem data de nascimento ja no registro.

### Porque
O frontend passou a exigir esse campo no formulario de cadastro.

### Pontos alterados ou criados no back
- `backend/app/users/schemas.py`
- `backend/app/users/service.py`

## 9. Produto do tipo venda com valor unico

### Alteracao
Adicao de `sale_price` em produtos e validacao especifica para `type = sale`.

### Objetivo
Permitir produto de venda com valor unico, sem usar preco por dias alugados.

### Porque
O tipo `sale` precisava de regra propria e nao podia continuar preso ao modelo de locacao.

### Pontos alterados ou criados no back
- `backend/app/catalog/models.py`
- `backend/app/catalog/schemas.py`
- `backend/app/catalog/service.py`
- `backend/alembic/versions/f1a2b3c4d5e6_add_sale_price_to_products.py`

## 10. Exclusao logica de produto

### Alteracao
Criacao da exclusao logica de produto com `deleted_at` e rota `DELETE` administrativa.

### Objetivo
Permitir excluir produto sem apagar historico do banco.

### Porque
O admin passou a precisar do botao de excluir na edicao de produto, e hard delete nao era a melhor opcao.

### Pontos alterados ou criados no back
- `backend/app/catalog/service.py`
- `backend/app/catalog/router.py`

## 11. Listagem admin de produtos com ativos e inativos

### Alteracao
Criacao de rota especifica para listar produtos no admin incluindo ativos e inativos.

### Objetivo
Permitir que o filtro do frontend admin realmente consiga mostrar produtos inativos.

### Porque
A tela admin estava usando a rota publica, que retornava apenas produtos ativos.

### Pontos alterados ou criados no back
- `backend/app/catalog/service.py`
- `backend/app/catalog/router.py`

## 12. Fluxo separado de compra para produtos sale

### Alteracao
Criacao de fluxo proprio de compra para produtos `sale`, separado do fluxo de aluguel.

### Objetivo
Permitir compra normal de produto de venda sem depender de `days`, `start_date` e `end_date`.

### Porque
O backend de pedidos original so entendia aluguel por periodo.

### Pontos alterados ou criados no back
- `backend/app/orders/models.py`
- `backend/app/orders/schemas.py`
- `backend/app/orders/service.py`
- `backend/app/orders/router.py`
- `backend/alembic/versions/a1b2c3d4e5f6_support_sale_order_items.py`

## 13. Detalhe de pedido adaptado para compra e aluguel

### Alteracao
Resposta do detalhe de pedido ajustada para devolver tambem `item_type` e `quantity`.

### Objetivo
Permitir ao frontend diferenciar item de compra e item de aluguel no historico e detalhe do pedido.

### Porque
Depois da criacao do fluxo de compra, o detalhe do pedido precisava suportar os dois tipos de item.

### Pontos alterados ou criados no back
- `backend/app/orders/router.py`
- `backend/app/orders/schemas.py`

## 14. Resumos simples no admin

### Alteracao
Criacao de rotas de resumo para pedidos, produtos e usuarios no admin.

### Objetivo
Permitir exibir cards com indicadores rapidos no topo das telas administrativas.

### Porque
O frontend admin passou a mostrar resumos operacionais e precisava receber esses numeros do backend.

### Pontos alterados ou criados no back
- `backend/app/orders/service.py`
- `backend/app/orders/router.py`
- `backend/app/catalog/service.py`
- `backend/app/catalog/router.py`
- `backend/app/users/service.py`
- `backend/app/users/router.py`

### Rotas adicionadas
- `GET /api/v1/pedidos/admin/resumo`
- `GET /api/v1/produtos/admin/resumo`
- `GET /api/v1/usuarios/admin/usuarios/resumo`

## 15. Remocao completa do fluxo de reset de senha

### Alteracao
Remocao total do fluxo de recuperacao e redefinicao de senha no frontend, backend e banco.

### Objetivo
Retirar uma funcionalidade que saiu do escopo final do projeto.

### Porque
O fluxo de reset de senha adicionava complexidade desnecessaria para a entrega estudantil.

### Pontos alterados ou criados no back
- `backend/app/core/security.py`
- `backend/app/users/models.py`
- `backend/app/users/schemas.py`
- `backend/app/users/router.py`
- `backend/app/users/service.py`
- `backend/app/config.py`
- `backend/requirements.txt`
- `backend/.env.example`
- `backend/alembic/versions/b1c2d3e4f5a6_remove_password_reset_tokens.py`

## 16. Ajuste do ambiente Docker para desenvolvimento

### Alteracao
Configuracao do container do backend para hot reload mais confiavel em ambiente Docker local.

### Objetivo
Permitir que alteracoes no codigo do backend sejam refletidas sem precisar recriar manualmente os containers a cada mudanca.

### Porque
No ambiente com Docker Desktop, o reload por observacao de arquivos pode falhar sem configuracao especifica de polling.

### Pontos alterados ou criados no back
- `docker-compose.yml`

### Ajustes aplicados
- manutencao do backend com `uvicorn ... --reload`
- adicao de `WATCHFILES_FORCE_POLLING=true` no servico `backend`

## Migrations Deste Ciclo

- `backend/alembic/versions/9b1a2c3d4e5f_add_user_profile_fields.py`
- `backend/alembic/versions/f1a2b3c4d5e6_add_sale_price_to_products.py`
- `backend/alembic/versions/a1b2c3d4e5f6_support_sale_order_items.py`
- `backend/alembic/versions/b1c2d3e4f5a6_remove_password_reset_tokens.py`
