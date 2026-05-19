# Caixa Magica Frontend

Aplicacao React frontend-only da Caixa Magica, migrada para Vite.

Este repositorio nao contem backend local. Integracoes com API devem ser feitas somente quando a equipe responsavel pelo backend disponibilizar os contratos oficiais.

## Requisitos

- Node.js
- npm

## Instalar Dependencias

```bash
npm install
```

## Rodar em Desenvolvimento

```bash
npm run dev
```

Ou:

```bash
npm start
```

A aplicacao sobe em `http://localhost:3000`.

## Build de Producao

```bash
npm run build
```

O Vite gera os arquivos finais em `dist/`.

## Preview do Build

```bash
npm run preview
```

## Rotas Principais

- `/`
- `/produtos`
- `/produtos/:id`
- `/quem-somos`
- `/como-alugar`
- `/duvidas`
- `/contrato`
- `/login`

## Observacao

A tela de duvidas mantem temporariamente as perguntas enviadas apenas em memoria, sem persistencia, ate a integracao oficial com a API.
