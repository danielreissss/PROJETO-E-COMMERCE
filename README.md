# Desafio Backend - API E-Commerce

![Status: Em Desenvolvimento](https://img.shields.io/badge/status-em_desenvolvimento-blue)

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
&nbsp;
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
&nbsp;
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
&nbsp;
<img src="https://img.shields.io/badge/JWT-DB4C37?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
</p>

---

## 📜 Sobre o Projeto

Esta é uma API RESTful para um sistema de E-Commerce, desenvolvida como parte de um desafio de backend.  
O projeto implementa um banco de dados relacional com três entidades principais (**Cliente**, **Produto**, **Compra**) e uma tabela de relação para itens de compra (`compra_produtos`), focando em **segurança**, **autenticação**, **boas práticas** e **transações ACID**.

---

## 🎬 Demonstração em vídeo
Assista à demonstração no YouTube:

(https://www.youtube.com/watch?v=k_6HdPaUzqE)

---

## 🧠 Visão Geral da Arquitetura

A aplicação segue uma arquitetura em camadas, separando responsabilidades:

| Camada        | Descrição |
| :------------ | :-------- |
| **Rotas (`.routes.js`)** | Definem os endpoints REST (clientes, produtos, compras, itens de compra). |
| **Controllers (`.controller.js`)** | Implementam as regras de negócio de cada recurso (validações, fluxos e respostas HTTP). |
| **Models (`.model.js`)** | Acessam o banco de dados MySQL usando `mysql2/promise` e o pool configurado em `database.js`. |
| **Middleware** | Autenticação/autorização (`auth.middleware.js`), validação de JWT e verificação de permissões. |
| **Scripts de Banco** | `backend/database/setupDatabase.js` cria o schema, as tabelas e popula dados iniciais (produtos). |

---

## 🧩 Modelo de Dados

### Entidades Principais

| Entidade          | Campos principais (conceitual) |
| :---------------- | :----------------------------- |
| **Cliente**       | `id`, `nome`, `email`, `senha_hash`, `cargo` (`padrao` / `administrador`), campos auxiliares para reset de senha (token/expiração). |
| **Produto**       | `id`, `nome`, `descricao`, `preco`, `estoque`, `categoria` (se houver), timestamps. |
| **Compra**        | `id`, `id_cliente`, `status`, `total`, `data_criacao`, `data_atualizacao`. |
| **compra_produtos** | `id`, `id_compra`, `id_produto`, `quantidade`, `preco_unitario_no_momento`. |

### Relações

- Um **Cliente** possui muitas **Compras**.  
- Uma **Compra** possui muitos **Produtos** via tabela `compra_produtos`.  
- Um **Produto** pode estar em muitas **Compras**.  

---

## ⚙️ Lógicas Implementadas

### 🔐 Autenticação e Autorização

- Registro de novos clientes com criptografia de senha (`bcryptjs`).  
- Login via e-mail e senha, retornando um **Token JWT** para autenticação.  
- Middleware de autenticação que protege rotas que exigem login (`verifyToken`).  

### 🧩 Controle de Acesso (Níveis de Usuário)

- Diferenciação de usuários `padrao` e `administrador`.  
- Rotas críticas (como deletar cliente) protegidas por middleware de autorização (`isAdmin` / `onlyAdmin`).  

### ✉️ Recuperação de Senha

Fluxo completo de [translate:"esqueci minha senha"]:

1. Usuário chama `POST /forgot-password` informando o e-mail.  
2. O sistema gera um token seguro (`crypto`), salva no banco com tempo de expiração.  
3. Um e-mail de recuperação é enviado com um link contendo o token (`nodemailer`).  
4. O usuário chama `POST /reset-password` com o token e a nova senha.  

### 📦 CRUDs Completos

- **Clientes:** CRUD completo (com `DELETE` restrito a administradores).  
- **Produtos:** CRUD completo para gerenciamento do catálogo.  
- **Compras:** CRUD completo para gerenciar pedidos.  

### 💾 Lógica de Transação (ACID)

Para garantir integridade dos dados:

- Ao **criar uma compra**:
  - Cria a compra principal.
  - Insere os itens na tabela `compra_produtos`.
  - Em caso de erro em qualquer etapa, executa `ROLLBACK`, evitando registros inconsistentes.  

- Ao **deletar uma compra**:
  - Primeiro remove os itens em `compra_produtos`.
  - Depois remove o registro principal da compra.  

---

## 🛠️ Tecnologias e Justificativas

| Biblioteca / Ferramenta | Justificativa |
| :---------------------- | :----------- |
| **Node.js** | Ambiente de execução JavaScript no backend, ideal para APIs REST. |
| **Express** | Framework minimalista para criação de servidor HTTP, rotas e middlewares. |
| **MySQL** | Banco de dados relacional utilizado para persistência de dados do e-commerce. |
| **mysql2** | Driver otimizado para MySQL com suporte a Promises e transações. |
| **Docker & Docker Compose** | Padronizam o ambiente (API + banco), facilitando setup, testes e deploy. |
| **jsonwebtoken (JWT)** | Implementa autenticação baseada em token para rotas protegidas. |
| **bcryptjs** | Realiza hash seguro de senhas antes de salvá-las no banco. |
| **dotenv** | Gerencia variáveis de ambiente de forma segura. |
| **nodemailer** | Envio de e-mails transacionais no fluxo de recuperação de senha. |
| **crypto** | Geração de tokens aleatórios e seguros para reset de senha. |
| **Jest + Supertest** | Testes automatizados de endpoints e regras de negócio. |

---

## 🧪 Testes Automatizados

A aplicação conta com testes automatizados para garantir o comportamento esperado:

| Arquivo de Teste      | Cenários testados |
| :-------------------- | :---------------- |
| `cliente.test.js`     | Registro, login, retorno do usuário autenticado, acesso a rotas protegidas. |
| `produtos.test.js`    | CRUD de produtos (criar, listar, atualizar, deletar, erros). |
| `compra.test.js`      | Criação de compra com itens, consulta do pedido, atualização de status. |

Os testes utilizam o app Express diretamente (sem subir servidor HTTP) por meio de Jest + Supertest.

---

## 🧱 Estrutura de Pastas (Simplificada)

.
├── index.js # Ponto de entrada da aplicação Express

├── backend

│ ├── routes # Definição dos endpoints (clientes, produtos, compras, itens)

│ ├── controller # Regras de negócio da API

│ ├── model # Acesso ao banco (MySQL)

│ ├── middleware # auth.middleware.js (JWT, controle de acesso)

│ └── database

│ └── setupDatabase.js # Script para criar/popular o banco

├── database.js # Configuração do pool MySQL (mysql2/promise)

├── docker-compose.yml # Orquestração de containers (API + MySQL)

├── package.json # Dependências e scripts (start, test, etc.)

└── .env # Configurações sensíveis (banco, JWT, e-mail)


---

## 🚀 Como Executar o Projeto

Você pode rodar o projeto de duas formas:

- **A. Com Docker (recomendado)** 🐳  
- **B. Localmente, sem Docker** 💻  

---

### ✅ Pré-requisitos

- Node.js (v16 ou superior)  
- Docker e Docker Compose  
- Cliente de API (Insomnia, Postman, etc.)  
- Cliente de banco (MySQL Workbench, opcional)  

---

## A. Execução com Docker (Recomendado) 🐳

Este método cria dois containers: **API Node.js** e **MySQL**.

### 1. Clone o repositório

git clone https://github.com/danielreissss/PROJETO-E-COMMERCE.git
cd PROJETO-E-COMMERCE


### 2. Crie o arquivo `.env`

Na raiz do projeto:

Configs do Banco (para o Docker Compose)

DB_HOST=db

DB_USER=daniel

DB_PASS=daniel1

DB_NAME=eCommerce

DB_PORT=3306

DB_PASS_ROOT=daniel

Chave Secreta do JWT:

JWT_SECRET=petronio-labubu-jwt-123!@

Configs do Nodemailer (Mailtrap, SendGrid, etc.):

EMAIL_HOST=smtp.example.com

EMAIL_PORT=587

EMAIL_SECURE=false

EMAIL_USER=seu-email@example.com

EMAIL_PASS=sua-senha-de-app


> 💡 **Importante:**  
> O `DB_HOST` deve ser `db`, que é o nome do serviço do banco definido no `docker-compose.yml`.

### 3. Dockerfile

Crie um arquivo `Dockerfile` na raiz (se ainda não existir):


FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]


### 4. Arquivo `docker-compose.yml`

version: '3.8'

services:
api:
build: .
ports:
- "3000:3000"
volumes:
- .:/app
- /app/node_modules
env_file: ./.env
depends_on:
- db
command: npm start

db:
image: mysql:8.0
restart: always
environment:
MYSQL_DATABASE: ${DB_NAME}
MYSQL_USER: ${DB_USER}
MYSQL_PASSWORD: ${DB_PASS}
MYSQL_ROOT_PASSWORD: ${DB_PASS_ROOT}
ports:
- "3307:3306"
volumes:
- mysql-data:/var/lib/mysql

volumes:
mysql-data:


### 5. Suba os containers

docker-compose up --build

ou em segundo plano:
docker-compose up --build -d


### 6. Execute o setup do banco (primeira vez)

docker-compose exec api node backend/database/setupDatabase.js


Pronto! 🎉  

- API: `http://localhost:3000`  
- Banco para Workbench: `localhost:3307`  

---

## B. Execução Local (Sem Docker) 💻

### 1. Clone o repositório

git clone https://github.com/danielreissss/PROJETO-E-COMMERCE.git
cd PROJETO-E-COMMERCE

### 2. Instale as dependências
npm install


### 3. Configure o banco de dados

- Inicie o servidor MySQL local.  
- Crie o database se necessário (ex.: `eCommerce`).  
- Garanta que usuário, senha e porta batem com o `.env`.  

### 4. Crie o arquivo `.env`

Configs do Banco (Local):

DB_HOST=localhost

DB_USER=daniel

DB_PASS=daniel1

DB_NAME=eCommerce

DB_PORT=3307

DB_PASS_ROOT=daniel

Chave Secreta do JWT:

JWT_SECRET=petronio-labubu-jwt-123!@

Configs do Nodemailer:

EMAIL_HOST=smtp.example.com

EMAIL_PORT=587

EMAIL_SECURE=false

EMAIL_USER=seu-email@example.com

EMAIL_PASS=sua-senha-de-app


### 5. Execute o setup do banco

node backend/database/setupDatabase.js


### 6. Inicie o servidor

npm start

ou
node index.js


A API ficará disponível em: `http://localhost:3000` 🚀

---

## 🗺️ Estrutura de Endpoints (API)

### 🔑 Autenticação (`/api/clientes`)

| Método | Rota              | Descrição |
| :----- | :---------------- | :-------- |
| `POST` | `/register`       | Registra um novo cliente. |
| `POST` | `/login`          | Realiza login e retorna um token JWT. |
| `POST` | `/forgot-password`| Inicia o processo de recuperação de senha (envia e-mail). |
| `POST` | `/reset-password` | Conclui o processo de reset de senha, usando o token enviado por e-mail. |

---

### 👤 Clientes (`/api/clientes`) – rotas protegidas por token

| Método   | Rota   | Descrição |
| :------- | :----- | :-------- |
| `GET`    | `/`    | Lista todos os clientes (sem dados sensíveis). |
| `GET`    | `/:id` | Busca um cliente específico. |
| `PUT`    | `/:id` | Atualiza um cliente. |
| `DELETE` | `/:id` | Deleta um cliente (**apenas administradores**). |

---

### 📦 Produtos (`/api/produtos`)

| Método   | Rota   | Descrição |
| :------- | :----- | :-------- |
| `GET`    | `/`    | Lista todos os produtos. |
| `GET`    | `/:id` | Busca um produto específico. |
| `POST`   | `/`    | Cria um novo produto. |
| `PUT`    | `/:id` | Atualiza um produto. |
| `DELETE` | `/:id` | Deleta um produto. |

---

### 🧾 Compras (`/api/compras`)

| Método   | Rota   | Descrição |
| :------- | :----- | :-------- |
| `GET`    | `/`    | Lista todas as compras. |
| `GET`    | `/:id` | Busca uma compra específica (com seus produtos). |
| `POST`   | `/`    | Cria uma nova compra (com seus produtos). |
| `PUT`    | `/:id` | Atualiza o status de uma compra. |
| `DELETE` | `/:id` | Deleta uma compra (e seus produtos associados). |

---

### 🧺 Itens da Compra (`/api/compras/:compraId/items`)

| Método   | Rota           | Descrição |
| :------- | :------------- | :-------- |
| `GET`    | `/`            | Lista todos os produtos de uma compra específica. |
| `POST`   | `/`            | Adiciona um novo produto a uma compra. |
| `PUT`    | `/:produtoId`  | Atualiza um item (por exemplo, quantidade) em uma compra. |
| `DELETE` | `/:produtoId`  | Remove um item de uma compra. |

---

## 💡 Dicas de Uso (Insomnia/Postman)

- Sempre enviar o header nas rotas protegidas:  
  - [translate:Authorization: Bearer <seu_token_jwt>]  
- Fluxo recomendado para começar a testar:
  1. `POST /api/clientes/register`  
  2. `POST /api/clientes/login` (copiar o token)  
  3. Criar/consultar produtos e compras autenticado.  

---


