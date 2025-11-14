# Desafio Backend - API E-Commerce

`![Status: Em Desenvolvimento](https://img.shields.io/badge/status-em_desenvolvimento-blue)`

## 📜 Sobre o Projeto

Esta é uma API RESTful para um sistema de E-Commerce, desenvolvida como parte do desafio de backend. O projeto implementa um banco de dados relacional com três entidades principais (Cliente, Produto, Compra) e foca em segurança, autenticação e boas práticas de desenvolvimento.

### Lógicas Implementadas

O sistema possui as seguintes funcionalidades principais:

* **Autenticação e Autorização:**
    * Registro de novos clientes com criptografia de senha (`bcryptjs`).
    * Login via E-mail e Senha, retornando um **Token JWT** para autenticação.
    * Middleware de autenticação que protege rotas que exigem login (`verifyToken`).
* **Controle de Acesso (Níveis de Usuário):**
    * O sistema diferencia usuários `padrao` e `administrador`.
    * Rotas críticas (como deletar um cliente) são protegidas por um middleware que verifica se o usuário é um administrador (`isAdmin`).
* **Recuperação de Senha:**
    * Um fluxo completo de "esqueci minha senha" foi implementado.
    * O usuário solicita um reset via e-mail (`/forgot-password`).
    * O sistema gera um token seguro (`crypto`), salva no banco com tempo de expiração, e envia um link de reset para o e-mail do usuário (`nodemailer`).
    * O usuário usa o link para definir uma nova senha (`/reset-password`).
* **CRUDs Completos:**
    * **Clientes:** CRUD completo, com a rota de `DELETE` restrita a administradores.
    * **Produtos:** CRUD completo para gerenciamento de produtos no inventário.
    * **Compras:** CRUD completo para gerenciar pedidos.
* **Lógica de Transação (ACID):**
    * Para garantir a integridade dos dados, **transações SQL** são usadas nas operações de `Compra`.
    * Ao **criar uma compra**, a API primeiro insere a "casca" da compra e depois insere todos os produtos. Se qualquer item falhar, a transação inteira é desfeita (`ROLLBACK`), impedindo compras "órfãs".
    * Ao **deletar uma compra**, a transação garante que primeiro todos os itens em `compra_produtos` são removidos antes de deletar a `compra` principal.

---

## 🛠️ Tecnologias e Justificativas

| Biblioteca | Justificativa |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no lado do servidor, permitindo a construção da API. |
| **Express** | Framework web minimalista para Node.js. Usado para criar o servidor, definir rotas (`.routes.js`) e gerenciar middlewares. |
| **MySQL (Banco)** | Banco de dados relacional, conforme exigido pelo desafio. |
| **mysql2** | Driver otimizado para Node.js que se conecta ao banco de dados MySQL, com suporte a Promises e transações. |
| **Docker** | Plataforma de containerização. Usada para criar um ambiente de desenvolvimento e produção padronizado e isolado, facilitando o deploy. |
| **jsonwebtoken (JWT)** | Usado para implementar a autenticação baseada em token. Permite que a API verifique a identidade do usuário em rotas protegidas. |
| **bcryptjs** | Essencial para segurança. Usado para criptografar (hash) as senhas dos usuários antes de salvá-las no banco de dados. |
| **dotenv** | Carrega variáveis de ambiente (como senhas de banco e chaves secretas) do arquivo `.env` para `process.env`, mantendo dados sensíveis fora do código. |
| **nodemailer** | Usado na funcionalidade "Esqueci minha senha" para enviar e-mails transacionais (o link de recuperação) para os usuários. |
| **crypto** | Módulo nativo do Node.js. Usado para gerar tokens aleatórios e seguros para o processo de recuperação de senha. |

---

## 🚀 Como Executar o Projeto

Você pode rodar este projeto de duas formas: localmente (para desenvolvimento rápido) ou via Docker (o método recomendado para simular a produção).

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v16 ou superior)
* [Docker](https://www.docker.com/products/docker-desktop/) e [Docker Compose](https://docs.docker.com/compose/install/)
* Um cliente de API (como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/))
* Um cliente de Banco de Dados (como [MySQL Workbench](https://www.mysql.com/products/workbench/), já que você o utiliza)

---

### A. Execução com Docker (Recomendado)

Este método irá criar e orquestrar dois containers: um para a API Node.js e outro para o banco de dados MySQL.

**1. Clone o repositório**
```bash
git clone [https://github.com/danielreissss/PROJETO-E-COMMERCE]
cd seu-repositorio

2. Crie o arquivo .env Crie um arquivo chamado .env na raiz do projeto. Este arquivo é essencial para o Docker Compose.

Atenção: Note que o DB_HOST é db, que é o nome do serviço do banco de dados definido no docker-compose.yml.

# Configs do Banco (para o Docker Compose)
DB_HOST=db
DB_USER=daniel
DB_PASS=daniel1
DB_NAME=eCommerce
DB_PORT=3306
DB_PASS_ROOT=daniel

# Chave Secreta do JWT
JWT_SECRET=petronio-labubu-jwt-123!@

# Configs do Nodemailer (Preencha com um serviço como Mailtrap ou SendGrid)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@example.com
EMAIL_PASS=sua-senha-de-app

3. Crie o arquivo Dockerfile Crie um arquivo chamado Dockerfile (sem extensão) na raiz:

# Imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]

4. Crie o arquivo docker-compose.yml Crie um arquivo chamado docker-compose.yml na raiz:

version: '3.8'

services:
  # Serviço da API Node.js
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
    command: npm start # ou node index.js (depende do seu package.json)

  # Serviço do Banco de Dados MySQL
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
      MYSQL_ROOT_PASSWORD: ${DB_PASS_ROOT}
    ports:
      # Expõe na porta 3307 da sua máquina (para conectar o Workbench)
      - "3307:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:

  5. Suba os containers

  docker-compose up --build

  Aqui está o texto completo formatado em Markdown. Você pode copiar tudo o que está dentro do bloco de código abaixo e colar diretamente em seu arquivo README.md no VS Code ou no GitHub.

Markdown

# Desafio Backend - API E-Commerce

`![Status: Em Desenvolvimento](https://img.shields.io/badge/status-em_desenvolvimento-blue)`

## 📜 Sobre o Projeto

Esta é uma API RESTful para um sistema de E-Commerce, desenvolvida como parte do desafio de backend. O projeto implementa um banco de dados relacional com três entidades principais (Cliente, Produto, Compra) e foca em segurança, autenticação e boas práticas de desenvolvimento.

### Lógicas Implementadas

O sistema possui as seguintes funcionalidades principais:

* **Autenticação e Autorização:**
    * Registro de novos clientes com criptografia de senha (`bcryptjs`).
    * Login via E-mail e Senha, retornando um **Token JWT** para autenticação.
    * Middleware de autenticação que protege rotas que exigem login (`verifyToken`).
* **Controle de Acesso (Níveis de Usuário):**
    * O sistema diferencia usuários `padrao` e `administrador`.
    * Rotas críticas (como deletar um cliente) são protegidas por um middleware que verifica se o usuário é um administrador (`isAdmin`).
* **Recuperação de Senha:**
    * Um fluxo completo de "esqueci minha senha" foi implementado.
    * O usuário solicita um reset via e-mail (`/forgot-password`).
    * O sistema gera um token seguro (`crypto`), salva no banco com tempo de expiração, e envia um link de reset para o e-mail do usuário (`nodemailer`).
    * O usuário usa o link para definir uma nova senha (`/reset-password`).
* **CRUDs Completos:**
    * **Clientes:** CRUD completo, com a rota de `DELETE` restrita a administradores.
    * **Produtos:** CRUD completo para gerenciamento de produtos no inventário.
    * **Compras:** CRUD completo para gerenciar pedidos.
* **Lógica de Transação (ACID):**
    * Para garantir a integridade dos dados, **transações SQL** são usadas nas operações de `Compra`.
    * Ao **criar uma compra**, a API primeiro insere a "casca" da compra e depois insere todos os produtos. Se qualquer item falhar, a transação inteira é desfeita (`ROLLBACK`), impedindo compras "órfãs".
    * Ao **deletar uma compra**, a transação garante que primeiro todos os itens em `compra_produtos` são removidos antes de deletar a `compra` principal.

---

## 🛠️ Tecnologias e Justificativas

| Biblioteca | Justificativa |
| :--- | :--- |
| **Node.js** | Ambiente de execução JavaScript no lado do servidor, permitindo a construção da API. |
| **Express** | Framework web minimalista para Node.js. Usado para criar o servidor, definir rotas (`.routes.js`) e gerenciar middlewares. |
| **MySQL (Banco)** | Banco de dados relacional, conforme exigido pelo desafio. |
| **mysql2** | Driver otimizado para Node.js que se conecta ao banco de dados MySQL, com suporte a Promises e transações. |
| **Docker** | Plataforma de containerização. Usada para criar um ambiente de desenvolvimento e produção padronizado e isolado, facilitando o deploy. |
| **jsonwebtoken (JWT)** | Usado para implementar a autenticação baseada em token. Permite que a API verifique a identidade do usuário em rotas protegidas. |
| **bcryptjs** | Essencial para segurança. Usado para criptografar (hash) as senhas dos usuários antes de salvá-las no banco de dados. |
| **dotenv** | Carrega variáveis de ambiente (como senhas de banco e chaves secretas) do arquivo `.env` para `process.env`, mantendo dados sensíveis fora do código. |
| **nodemailer** | Usado na funcionalidade "Esqueci minha senha" para enviar e-mails transacionais (o link de recuperação) para os usuários. |
| **crypto** | Módulo nativo do Node.js. Usado para gerar tokens aleatórios e seguros para o processo de recuperação de senha. |

---

## 🚀 Como Executar o Projeto

Você pode rodar este projeto de duas formas: localmente (para desenvolvimento rápido) ou via Docker (o método recomendado para simular a produção).

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v16 ou superior)
* [Docker](https://www.docker.com/products/docker-desktop/) e [Docker Compose](https://docs.docker.com/compose/install/)
* Um cliente de API (como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/))
* Um cliente de Banco de Dados (como [MySQL Workbench](https://www.mysql.com/products/workbench/), já que você o utiliza)

---

### A. Execução com Docker (Recomendado)

Este método irá criar e orquestrar dois containers: um para a API Node.js e outro para o banco de dados MySQL.

**1. Clone o repositório**
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio
2. Crie o arquivo .env Crie um arquivo chamado .env na raiz do projeto. Este arquivo é essencial para o Docker Compose.

Atenção: Note que o DB_HOST é db, que é o nome do serviço do banco de dados definido no docker-compose.yml.

Ini, TOML

# Configs do Banco (para o Docker Compose)
DB_HOST=db
DB_USER=daniel
DB_PASS=daniel1
DB_NAME=eCommerce
DB_PORT=3306
DB_PASS_ROOT=daniel

# Chave Secreta do JWT
JWT_SECRET=petronio-labubu-jwt-123!@

# Configs do Nodemailer (Preencha com um serviço como Mailtrap ou SendGrid)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@example.com
EMAIL_PASS=sua-senha-de-app
3. Crie o arquivo Dockerfile Crie um arquivo chamado Dockerfile (sem extensão) na raiz:

Dockerfile

# Imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
4. Crie o arquivo docker-compose.yml Crie um arquivo chamado docker-compose.yml na raiz:

YAML

version: '3.8'

services:
  # Serviço da API Node.js
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
    command: npm start # ou node index.js (depende do seu package.json)

  # Serviço do Banco de Dados MySQL
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
      MYSQL_ROOT_PASSWORD: ${DB_PASS_ROOT}
    ports:
      # Expõe na porta 3307 da sua máquina (para conectar o Workbench)
      - "3307:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
5. Suba os containers

Bash

docker-compose up --build
(Use -d para rodar em segundo plano).

6. Execute o Setup do Banco (Primeira vez) Com os containers rodando, abra outro terminal e execute o script de setup dentro do container da API. Isso criará as tabelas e populará os produtos.

docker-compose exec api node backend/database/setupDatabase.js

Pronto! A API estará rodando em http://localhost:3000 e o banco estará acessível no MySQL Workbench em localhost:3307.

B. Execução Local (Sem Docker):

1. Clone o repositório:

git clone [https://github.com/danielreissss/PROJETO-E-COMMERCE]
cd seu-repositorio

2. Instale as dependências:

npm install

3. Configure o Banco de Dados

Abra o MySQL Workbench e inicie seu servidor MySQL.

Verifique se as credenciais (usuário, senha, porta) batem com as do seu ambiente.

4. Crie o arquivo .env Crie um arquivo .env na raiz do projeto. Preencha com suas credenciais locais e do serviço de e-mail.

# Configs do Banco (Local)
DB_HOST=localhost
DB_USER=daniel
DB_PASS=daniel1
DB_NAME=eCommerce
DB_PORT=3307
DB_PASS_ROOT=daniel

# Chave Secreta do JWT
JWT_SECRET=petronio-labubu-jwt-123!@

# Configs do Nodemailer (Preencha com um serviço como Mailtrap ou SendGrid)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@example.com
EMAIL_PASS=sua-senha-de-app

5. Execute o Setup do Banco Este script irá criar o banco de dados (se não existir), as tabelas e popular a tabela produtos.

node backend/database/setupDatabase.js

6. Inicie o servidor

node index.js

A API estará rodando em http://localhost:3000.

🗺️ Estrutura de Endpoints (API)
Autenticação (/api/clientes)
POST /register: Registra um novo cliente.

POST /login: Realiza o login e retorna um token JWT.

POST /forgot-password: Inicia o processo de recuperação de senha (envia e-mail).

POST /reset-password: Conclui o processo de recuperação de senha (usa token da URL).

Clientes (/api/clientes):

Rotas protegidas por token

GET /: Lista todos os clientes (sem dados sensíveis).

GET /:id: Busca um cliente específico.

PUT /:id: Atualiza um cliente.

DELETE /:id: Deleta um cliente (Apenas Administradores).

Produtos (/api/produtos):

GET /: Lista todos os produtos.

GET /:id: Busca um produto específico.

POST /: Cria um novo produto.

PUT /:id: Atualiza um produto.

DELETE /:id: Deleta um produto.

Compras (/api/compras):

GET /: Lista todas as compras.

GET /:id: Busca uma compra específica (e seus produtos).

POST /: Cria uma nova compra (com seus produtos).

PUT /:id: Atualiza o status de uma compra.

DELETE /:id: Deleta uma compra (e seus produtos associados).

Itens da Compra (/api/compras/:compraId/items)
GET /: Lista todos os produtos de uma compra específica.

POST /: Adiciona um novo produto a uma compra.

PUT /:produtoId: Atualiza um item (ex: quantidade) em uma compra.

DELETE /:produtoId: Remove um item de uma compra.





<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
&nbsp;
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
&nbsp;
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
&nbsp;
<img src="https://img.shields.io/badge/JWT-DB4C37?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
</p>
