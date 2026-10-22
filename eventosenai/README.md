# EventoSENAI

Agenda de eventos escolares: MySQL + API REST (Node/Express) + Front (Next.js).

## Como rodar
1. **Banco**: abra `database/script.sql` no MySQL Workbench e execute (recria o banco do zero com dados de teste).
2. **API**:
   ```bash
   cd api
   cp .env.example .env   # ajuste usuário/senha do MySQL
   npm install
   npm run dev            # http://localhost:3333
   ```
3. **Front**:
   ```bash
   cd front
   npm install
   npm run dev            # http://localhost:3000
   ```
   `front/.env.local` precisa de `NEXT_PUBLIC_API_URL=http://localhost:3333` (reinicie o `npm run dev` se mudar).

API e front devem estar no ar ao mesmo tempo.

## Rotas
| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| GET | /eventos (`?categoria=id`) | 200 | 500 |
| GET | /eventos/:id | 200 | 404 |
| POST | /eventos | 201 | 400 |
| PUT | /eventos/:id | 200 | 400, 404 |
| DELETE | /eventos/:id | 204 | 404 |
| GET | /participantes | 200 | 500 |
| POST | /participantes | 201 | 400, 409 |
| GET | /eventos/:id/inscritos | 200 | 404 |
| POST | /inscricoes | 201 | 400, 409 (duplicada / "Evento lotado") |
| DELETE | /inscricoes/:id | 204 | 404 |

Coleção para testes: `api/eventosenai.postman_collection.json` (importa no Thunder Client e no Postman).

## Estrutura
`database/` script.sql + DER.svg · `api/` Express + mysql2 (consultas com `?`) · `front/` Next.js (App Router)

## Caminho de um dado (apresentação)
`FormInscricao` → `handleInscrever` (page.js) → `inscrever()` (lib/api.js) → `POST /inscricoes` → transação: `SELECT ... FOR UPDATE` no evento, `COUNT` das inscrições, `INSERT INTO inscricoes` → linha gravada → `carregarEventos()` atualiza as vagas.
