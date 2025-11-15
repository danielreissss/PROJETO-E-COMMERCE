// index.js
require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas em backend/routes
const produtoRoutes = require('./backend/routes/produtos.routes.js');
const clienteRoutes = require('./backend/routes/cliente.routes.js');
const compraRoutes = require('./backend/routes/compra.routes.js');
const compraProdutosRoutes = require('./backend/routes/compra_produtos.routes.js');

app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/compra-produtos', compraProdutosRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'API do E-commerce no ar!' });
});

const PORT = process.env.PORT || 3000;

// Não sobe o servidor em ambiente de teste (para Jest)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
