require('dotenv').config();
const express = require('express');

// 1. Importe TODOS os seus arquivos de rotas
const produtoRoutes = require('./backend/routes/produtos.routes.js');
const clienteRoutes = require('./backend/routes/cliente.routes.js');
const compraRoutes = require('./backend/routes/compra.routes.js');
const compra_produtosRoutes = require('./backend/routes/compra_produtos.routes.js');

const app = express();
app.use(express.json()); // Middleware para interpretar JSON

// 2. Conecte cada rota a um caminho base na sua API
app.use('/api/produtos', produtoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/compras', compraRoutes);
app.use('/api/compra_produtos', compra_produtosRoutes);

const PORT = process.env.PORT || 3000;

// CORREÇÃO: Impede que o servidor inicie durante os testes
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app; // CORREÇÃO: Exporta o app para o SuperTest