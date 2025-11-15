# Desafio Backend - API E-Commerce

![Status: Em Desenvolvimento](https://img.shields.io/badge/status-em_desenvolvimento-blue)

## 📜 Sobre o Projeto

Esta é uma API RESTful para um sistema de E-Commerce, desenvolvida como projeto da disciplina de Backend, utilizando Node.js, Express e MySQL.  
O sistema implementa um banco de dados relacional com quatro entidades principais: **Cliente**, **Produto**, **Compra** e **Compra_Produtos**, garantindo integridade referencial e suporte a operações transacionais.  

A API foi construída seguindo boas práticas de organização (camadas de *routes*, *controllers* e *models*), uso de variáveis de ambiente e padronização de respostas HTTP.  
O foco é oferecer um backend funcional para um e-commerce simples, com endpoints para gerenciamento de clientes, produtos, compras e itens das compras.  

---

## 🧠 Lógicas Implementadas

### Estrutura Geral da API

- API construída em **Node.js + Express**, expondo rotas sob o prefixo `/api`.  
- Organização em camadas:
  - `backend/models` – comunicação com o banco de dados usando `mysql2` e *pools* de conexão.  
  - `backend/controllers` – regras de negócio e validações básicas.  
  - `backend/routes` – definição das rotas HTTP e vinculação com os controllers.  
- Conexão com banco via `mysql2/promise`, utilizando um pool configurado em `backend/database.js`.  

### Entidades Principais

- **Cliente (`clientes`)**
  - Campos principais: `id`, `nome`, `email`, `telefone`, `endereco`, `created_at`, `updated_at`.  
  - Operações completas de CRUD via API.  

- **Produto (`produtos`)**
  - Campos principais: `id`, `nome`, `descricao`, `preco`, `estoque`, `created_at`, `updated_at`.  
  - CRUD completo para gerenciamento do catálogo de produtos.  

- **Compra (`compras`)**
  - Campos principais: `id`, `cliente_id`, `data`, `status`, `valor_total`, `created_at`, `updated_at`.  
  - Relacionada a um cliente e a vários itens de compra.  

- **Compra_Produtos (`compra_produtos`)**
  - Tabela de associação entre `compras` e `produtos`.  
  - Campos principais: `id`, `compra_id`, `produto_id`, `quantidade`, `preco_unitario`, `subtotal`.  

---

### Funcionalidades Principais

- **CRUD de Clientes**
  - Criar, listar, buscar por ID, atualizar e deletar clientes em `/api/clientes`.  
  - Validação básica de campos obrigatórios no controller (`cliente.controller.js`).  

- **CRUD de Produtos**
  - Endpoints para criação, listagem, busca, atualização e remoção de produtos em `/api/produtos`.  
  - Controle de campos como `preco` e `estoque` nas operações de criação/atualização.  

- **CRUD de Compras**
  - Rotas em `/api/compras` para:
    - Criar uma compra vinculada a um cliente.  
    - Listar todas as compras.  
    - Obter uma compra específica (com seus itens).  
    - Atualizar status e informações da compra.  
    - Deletar uma compra (e seus itens associados).  

- **Itens da Compra (`compra_produtos`)**
  - Rotas em `/api/compra-produtos` para:
    - Adicionar produtos a uma compra existente.  
    - Listar itens de compra.  
    - Atualizar quantidade e valores de itens.  
    - Remover itens de uma compra.  

- **Transações SQL (ACID) nas Compras**
  - Criação de compra e seus itens é feita de forma consistente:
    - Começa uma transação (`BEGIN`).  
    - Insere o registro da compra.  
    - Insere todos os itens em `compra_produtos`.  
    - Atualiza o `valor_total` da compra.  
    - Em caso de erro em qualquer etapa, executa `ROLLBACK`, evitando dados inconsistentes.  
    - Em sucesso, executa `COMMIT`.  

- **Autenticação (Estrutura preparada)**
  - Middleware `auth.middleware.js` preparado para validação de token JWT e autorização de rotas.  
  - Estrutura pensada para, futuramente, proteger rotas sensíveis com base em usuários e níveis de acesso.  

---

## 🛠️ Tecnologias e Justificativas

| Biblioteca / Ferramenta | Justificativa |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no backend, ideal para construir APIs leves e escaláveis. |
| **Express** | Framework web minimalista para criação de servidores HTTP, definição de rotas (`*.routes.js`) e middlewares. |
| **MySQL** | Banco de dados relacional para armazenar clientes, produtos, compras e itens de compras com integridade referencial. |
| **mysql2** | Driver moderno para MySQL com suporte a Promises, usado em `database.js` e nos models. |
| **dotenv** | Carrega variáveis de ambiente do arquivo `.env` para `process.env`, evitando expor credenciais no código. |
| **Jest** | Framework de testes utilizado para testar endpoints e regras de negócio da API. |
| **Supertest** | Biblioteca usada junto com o Jest para fazer requisições HTTP à API durante os testes automatizados. |
| **Docker** | Facilita a criação de ambientes padronizados, com containers para a API e para o banco de dados MySQL. |

---

## 📂 Estrutura de Pastas (Resumo)

Projeto-e-Commerce/
├─ index.js # Entrada principal da API (Express)
├─ package.json # Dependências e scripts
├─ docker-compose.yml # Orquestração de containers (API + MySQL)
├─ .env # Variáveis de ambiente (não versionar)
├─ backend/
│ ├─ database/
│ │ ├─ database.js # Configuração do pool MySQL
│ │ └─ setupDatabase.js # Script para criação e popular o banco
│ ├─ models/
│ │ ├─ cliente.model.js
│ │ ├─ produto.model.js
│ │ ├─ compra.model.js
│ │ └─ compra_produtos.model.js
│ ├─ controllers/
│ │ ├─ cliente.controller.js
│ │ ├─ produtos.controller.js
│ │ ├─ compra.controller.js
│ │ └─ compra_produtos.controller.js
│ ├─ routes/
│ │ ├─ cliente.routes.js
│ │ ├─ produtos.routes.js
│ │ ├─ compra.routes.js
│ │ └─ compra_produtos.routes.js
│ └─ middlewares/
│ └─ auth.middleware.js
└─ tests/
├─ cliente.test.js
├─ produtos.test.js
└─ compra.test.js


---

## ⚙️ Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com conteúdo semelhante:

Configs do Banco
DB_HOST=localhost # ou 'db' quando usar Docker
DB_USER=daniel
DB_PASS=daniel1
DB_NAME=eCommerce
DB_PORT=3306

(Opcional) Senha root caso use Docker
DB_PASS_ROOT=daniel

Chave Secreta do JWT (para futura autenticação)
JWT_SECRET=sua-chave-super-secreta-aqui


> Importante: **nunca** commitar o `.env` no repositório.  
> O projeto já possui `.gitignore` incluindo arquivos sensíveis.

---

## 🚀 Como Executar o Projeto

Você pode rodar o projeto de duas formas:

- **A. Com Docker** (ambiente padronizado – recomendado).  
- **B. Localmente (sem Docker)**, usando o MySQL instalado na sua máquina.

---

### ✅ Pré-requisitos

- Node.js (versão 16 ou superior).  
- MySQL instalado ou Docker + Docker Compose.  
- Um cliente HTTP (Insomnia, Postman, etc.).  
- Opcional: MySQL Workbench para visualizar o banco.  

---

## 🐳 A. Execução com Docker (Recomendado)

Este modo sobe dois containers:

- `api`: container com Node.js e a API.  
- `db`: container com MySQL.  

### 1. Clonar o repositório

git clone https://github.com/danielreissss/PROJETO-E-COMMERCE
cd seu-repositorio


### 2. Criar o arquivo `.env`

Na raiz do projeto:

Configs do Banco (para o Docker Compose)
DB_HOST=db
DB_USER=daniel
DB_PASS=daniel1
DB_NAME=eCommerce
DB_PORT=3306
DB_PASS_ROOT=daniel

Chave Secreta do JWT
JWT_SECRET=sua-chave-super-secreta-aqui


> Note que o `DB_HOST` é `db`, o nome do serviço definido em `docker-compose.yml`.

### 3. Verificar o `docker-compose.yml`

O arquivo já está pronto, semelhante a isto:

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


### 4. Subir os containers

docker-compose up --build

use -d para rodar em segundo plano:
docker-compose up --build -d


### 5. Executar o setup do banco (primeira vez)

Com os containers rodando:

Isso criará o banco, tabelas e inserirá dados iniciais (como produtos de exemplo).  

### 6. Acessar a API

- API disponível em: `http://localhost:3000`.  
- Banco MySQL acessível em: `localhost:3307` (via MySQL Workbench).

---

## 💻 B. Execução Local (Sem Docker)

### 1. Clonar o repositório

git clone https://github.com/danielreissss/PROJETO-E-COMMERCE
cd seu-repositorio


### 2. Instalar dependências

npm install


### 3. Configurar o MySQL

- Inicie seu servidor MySQL local (MariaDB/MySQL).  
- Crie um banco chamado `eCommerce` ou deixe que o script `setupDatabase.js` cuide disso.  
- Garanta que usuário, senha e porta batem com o `.env`.

### 4. Criar o arquivo `.env` para ambiente local

Configs do Banco (Local)
DB_HOST=localhost
DB_USER=daniel
DB_PASS=daniel1
DB_NAME=eCommerce
DB_PORT=3306

Chave Secreta do JWT
JWT_SECRET=sua-chave-super-secreta-aqui


### 5. Rodar o setup do banco

node backend/database/setupDatabase.js


### 6. Iniciar o servidor

npm start

ou

node index.js


A API estará disponível em: `http://localhost:3000`.  

---

## 🧪 Testes Automatizados

Os testes usam **Jest** + **Supertest** para validar os endpoints.  

### Scripts no `package.json`

"scripts": {
"start": "node index.js",
"test": "cross-env NODE_ENV=test jest --runInBand"
}


### Rodar os testes


npm test


Os testes cobrem, por exemplo:

- `tests/cliente.test.js` – CRUD de clientes.  
- `tests/produtos.test.js` – CRUD de produtos.  
- `tests/compra.test.js` – criação, listagem e manipulação de compras.  

> Em ambiente de teste, o `index.js` não sobe o servidor (usa apenas o `app` exportado) para que o Jest possa encerrar corretamente.

---

## 🗺️ Endpoints da API

### Clientes – `/api/clientes`

- `GET /api/clientes` – Lista todos os clientes.  
- `GET /api/clientes/:id` – Busca um cliente por ID.  
- `POST /api/clientes` – Cria um novo cliente.  
- `PUT /api/clientes/:id` – Atualiza um cliente existente.  
- `DELETE /api/clientes/:id` – Remove um cliente.  

### Produtos – `/api/produtos`

- `GET /api/produtos` – Lista todos os produtos.  
- `GET /api/produtos/:id` – Busca um produto por ID.  
- `POST /api/produtos` – Cria um novo produto.  
- `PUT /api/produtos/:id` – Atualiza um produto existente.  
- `DELETE /api/produtos/:id` – Remove um produto.  

### Compras – `/api/compras`

- `GET /api/compras` – Lista todas as compras.  
- `GET /api/compras/:id` – Busca uma compra específica (incluindo itens).  
- `POST /api/compras` – Cria uma nova compra (cliente + itens).  
- `PUT /api/compras/:id` – Atualiza dados da compra (ex.: status).  
- `DELETE /api/compras/:id` – Deleta a compra e seus itens relacionados.  

### Itens da Compra – `/api/compra-produtos`

- `GET /api/compra-produtos` – Lista todos os itens de todas as compras (ou filtrado por query).  
- `GET /api/compra-produtos/:id` – Busca um item específico.  
- `POST /api/compra-produtos` – Adiciona um produto a uma compra.  
- `PUT /api/compra-produtos/:id` – Atualiza um item de compra (ex.: quantidade).  
- `DELETE /api/compra-produtos/:id` – Remove um item de compra.  

---

## 🔐 Middleware de Autenticação (Estrutura)

O arquivo `backend/middlewares/auth.middleware.js` contém a estrutura para:

- Validar tokens JWT enviados no header `Authorization`.  
- Rejeitar requisições sem token ou com token inválido.  
- Permitir, futuramente, diferenciar níveis de usuários (como `admin` / `user`) para proteger rotas críticas.  

> No estado atual do projeto, o JWT ainda não está totalmente integrado a todas as rotas, mas o esqueleto está pronto para evolução.

---

## 🧾 Boas Práticas Adotadas

- Separação clara em camadas: `routes`, `controllers`, `models`, `database`.  
- Uso de `dotenv` para credenciais e configurações.  
- Pool de conexões MySQL com `mysql2/promise`.  
- Scripts de setup de banco automatizados (`setupDatabase.js`).  
- Testes automatizados com Jest + Supertest para endpoints principais.  

---

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  &nbsp;
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  &nbsp;
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
</p>