// Carrega variáveis de ambiente do .env (por segurança em ambiente de teste)
require('dotenv').config();

const request = require('supertest');
// Importa o app Express (sem iniciar servidor) para uso pelo supertest
const { app } = require('../index.js');
// const db = require('../backend/database.js'); // Mantido comentado pois não é utilizado aqui

// Armazena o id do produto criado durante os testes
let produtoIdCriado;

// ------------------------------------------------------------------
// Testes de integração das rotas de Produtos (/api/produtos)
// ------------------------------------------------------------------
describe('Testes das Rotas de Produtos (/api/produtos)', () => {
  it('Deve listar todos os produtos (GET /api/produtos)', async () => {
    const response = await request(app).get('/api/produtos');

    // Espera que a rota retorne um array de produtos
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    // Aqui é validado que a base inicial tem 60 produtos cadastrados
    expect(response.body.length).toBe(60);
  });

  it('Deve buscar um produto específico pelo ID (GET /api/produtos/1)', async () => {
    const response = await request(app).get('/api/produtos/1');

    // Verifica se o produto retornado tem id = 1
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);

    // Garante que o campo "marca" está correto para o produto de id 1
    expect(response.body.marca).toBe('Logitech');
  });

  it('Deve retornar 404 para um produto inexistente (GET /api/produtos/9999)', async () => {
    const response = await request(app).get('/api/produtos/9999');

    // Espera que a API sinalize que o produto não foi encontrado
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Produto não encontrado');
  });

  it('Deve criar um novo produto (POST /api/produtos)', async () => {
    // Dados do produto que será criado apenas para fins de teste
    const novoProduto = {
      marca: 'Teste',
      modelo: 'Produto Teste 1',
      tipo_produto: 'Teste',
      preco: 100.0,
      estoque: 10,
    };

    const response = await request(app)
      .post('/api/produtos')
      .send(novoProduto);

    // Verifica se a criação foi bem-sucedida e se retornou o insertId
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('insertId');

    // Guarda o id do produto criado para usar nos próximos testes
    produtoIdCriado = response.body.insertId;
  });

  it('Deve atualizar o produto recém-criado (PUT /api/produtos/:id)', async () => {
    // Dados parciais que serão atualizados no produto criado anteriormente
    const dadosAtualizados = {
      preco: 150.0,
      estoque: 5,
    };

    const response = await request(app)
      .put(`/api/produtos/${produtoIdCriado}`)
      .send(dadosAtualizados);

    // Verifica se a atualização foi aplicada no produto correto
    expect(response.statusCode).toBe(200);
    expect(Number(response.body.id)).toBe(produtoIdCriado);

    // Confirma que os campos foram atualizados conforme enviado
    expect(response.body.preco).toBe(150);
    expect(response.body.estoque).toBe(5);
  });

  it('Deve deletar o produto recém-criado (DELETE /api/produtos/:id)', async () => {
    const response = await request(app).delete(
      `/api/produtos/${produtoIdCriado}`,
    );

    // Espera remoção bem-sucedida do produto criado no teste
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain(
      'Produto foi deletado com sucesso!',
    );
  });

  it('Deve retornar 404 ao tentar buscar o produto deletado', async () => {
    // Tenta buscar novamente o produto que acabou de ser deletado
    const response = await request(app).get(
      `/api/produtos/${produtoIdCriado}`,
    );

    // Espera que a API informe que o produto não existe mais
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Produto não encontrado');
  });
});
