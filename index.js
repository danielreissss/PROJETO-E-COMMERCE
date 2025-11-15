// Carrega variáveis de ambiente do arquivo .env para process.env
require('dotenv').config();

const express = require('express');
const app = express();

// ---------- Middlewares globais ----------

// Habilita recebimento de JSON no corpo das requisições
app.use(express.json());

// Habilita leitura de dados de formulários (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// ---------- Importação das rotas ----------

// Rotas de produtos
const produtoRoutes = require('./backend/routes/produtos.routes.js');

// Rotas de clientes
const clienteRoutes = require('./backend/routes/cliente.routes.js');

// Rotas de compras
const compraRoutes = require('./backend/routes/compra.routes.js');

// Rotas de itens de compra (relação compra-produtos)
const compraProdutosRoutes = require('./backend/routes/compra_produtos.routes.js');

// ---------- Registro das rotas na aplicação ----------

// Todas as rotas de produtos começam com /api/produtos
app.use('/api/produtos', produtoRoutes);

// Todas as rotas de clientes começam com /api/clientes
app.use('/api/clientes', clienteRoutes);

// Todas as rotas de compras começam com /api/compras
app.use('/api/compras', compraRoutes);

// Todas as rotas de itens de compra começam com /api/compra-produtos
app.use('/api/compra-produtos', compraProdutosRoutes);

// Rota básica para verificação rápida se a API está no ar
app.get('/', (_req, res) => {
  res.json({ message: 'API do E-commerce no ar!' });
});

// Porta obtida do .env ou padrão 3000
const PORT = process.env.PORT || 3000;

// Referência do servidor HTTP (utilizada apenas fora de ambiente de teste)
let server = null;

// ---------- Inicialização condicional do servidor ----------
// Em ambiente de teste (NODE_ENV = 'test'), o servidor NÃO é iniciado.
// Isso permite que o Jest use somente o app (sem ficar com porta aberta).
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Exporta o app para ser usado em testes (supertest) e o server para
// permitir encerramento manual se necessário em outros contextos.
module.exports = { app, server };
