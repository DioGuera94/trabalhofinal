const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'chave-secreta',
        resave: false,
        saveUninitialized: true,
    })
);

const porta = 3000;
const host = '0.0.0.0';

let listaProdutos = [];

function verificarAutenticacao(req, resp, next) {
    if (req.session.autenticado) {
        next();
    } else {
        resp.redirect('/login');
    }
}

app.get('/login', (req, resp) => {
    resp.send(`
        <html>
            <head>
                <title>Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #333333;
                        color: #f5f5f5;
                    }
                    .container {
                        background-color: #444444;
                        padding: 30px;
                        border-radius: 8px;
                        width: 100%;
                        max-width: 400px;
                        margin-top: 100px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
                    }
                    .form-label {
                        color: #f5f5f5;
                    }
                    .btn-primary {
                        background-color: #007bff;
                        border: none;
                        border-radius: 0;
                    }
                    .btn-primary:hover {
                        background-color: #0056b3;
                    }
                    fieldset {
                        border-color: #2D572C;
                        border-width: 2px;
                    }
                    legend {
                        color: #ffffff;
                    }
                    .form-control {
                        border-radius: 0;
                        color: #fff;
                        background-color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
                        <fieldset class="border p-2">
                            <legend class="mb-3">Autenticação do Sistema</legend>
                            <div class="col-md-12">
                                <label for="usuario" class="form-label">Usuário:</label>
                                <input type="text" class="form-control" id="usuario" name="usuario" required>
                            </div>
                            <div class="col-md-12">
                                <label for="senha" class="form-label">Senha</label>
                                <input type="password" class="form-control" id="senha" name="senha" required>
                            </div>
                            <div class="col-12 mt-2">
                                <button class="btn btn-primary" type="submit">Login</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </body>
        </html>
    `);
});

app.post('/login', (req, resp) => {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === '123') {
        req.session.autenticado = true;
        resp.redirect('/');
    } else {
        resp.send(`
            <div class="alert alert-danger" role="alert">
                Usuário ou senha inválidos!
            </div>
            <a href="/login" class="btn btn-primary">Tentar Novamente</a>
        `);
    }
});

app.get('/logout', (req, resp) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
        }
        resp.redirect('/login');
    });
});

app.get('/', verificarAutenticacao, (req, resp) => {
    const dataHoraAtual = new Date();
    const dataHoraFormatada = dataHoraAtual.toLocaleString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    req.session.ultimaVisita = dataHoraFormatada;

    resp.send(`
        <html>
            <head>
                <title>Bem-vindo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #333333;
                        color: #f5f5f5;
                    }
                    .container {
                        background-color: #444444;
                        padding: 40px;
                        border-radius: 0;
                    }
                    h1 {
                        color: #f5f5f5;
                    }
                    .btn {
                        border-radius: 0;
                    }
                    .btn-primary {
                        background-color: #007bff;
                        border: none;
                    }
                    .btn-primary:hover {
                        background-color: #0056b3;
                    }
                    .btn-danger {
                        background-color: #dc3545;
                        border: none;
                    }
                    .btn-danger:hover {
                        background-color: #c82333;
                    }
                    .ultima-visita {
                        background-color: #555555;
                        padding: 10px;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container text-center mt-5">
                    <h1>Bem-vindo ao Cadastro de Produtos</h1>
                    <a class="btn btn-primary m-2" href="/cadastrarProduto">Cadastrar Produto</a>
                    <a class="btn btn-success m-2" href="/listarProdutos">Lista de Produtos</a>
                    <a class="btn btn-danger m-2" href="/logout">Sair</a>

                    <div class="ultima-visita mt-4">
                        <p>Você acessou esta página pela última vez em:</p>
                        <h5>${req.session.ultimaVisita}</h5>
                    </div>
                </div>
            </body>
        </html>
    `);
});

function cadastroProdutoView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #333333;
                        color: #f5f5f5;
                    }
                    .container {
                        background-color: #444444;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    h1 {
                        color: #f5f5f5;
                    }
                    .form-control {
                        border-radius: 8px;
                        color: #fff;
                        background-color: #555;
                    }
                    .btn {
                        border-radius: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Cadastro de Produtos</h1>
                    <form method="POST" action="/cadastrarProduto" class="border p-4 row g-3">
                        <div class="col-md-6">
                            <label for="codigoBarras" class="form-label">Código de Barras</label>
                            <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>
                        </div>
                        <div class="col-md-6">
                            <label for="descricao" class="form-label">Descrição do Produto</label>
                            <input type="text" class="form-control" id="descricao" name="descricao" required>
                        </div>
                        <div class="col-md-6">
                            <label for="precoCusto" class="form-label">Preço de Custo</label>
                            <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>
                        </div>
                        <div class="col-md-6">
                            <label for="precoVenda" class="form-label">Preço de Venda</label>
                            <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" required>
                        </div>
                        <div class="col-md-6">
                            <label for="dataValidade" class="form-label">Data de Validade</label>
                            <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                        </div>
                        <div class="col-md-6">
                            <label for="qtdEstoque" class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" required>
                        </div>
                        <div class="col-md-12">
                            <label for="nomeFabricante" class="form-label">Nome do Fabricante</label>
                            <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" required>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar Produto</button>
                        </div>
                    </form>
                    <a href="/" class="btn btn-secondary mt-4">Voltar</a>
                </div>
            </body>
        </html>
    `);
}

function listarProdutosView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Lista de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #333333;
                        color: #f5f5f5;
                    }
                    .container {
                        background-color: #444444;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    .table {
                        background-color: #555555;
                        color: #fff;
                    }
                    th, td {
                        text-align: center;
                    }
                    .btn-primary {
                        background-color: #007bff;
                    }
                    .btn-primary:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Lista de Produtos</h1>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Preço Custo</th>
                                <th>Preço Venda</th>
                                <th>Quantidade</th>
                                <th>Data Validade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listaProdutos.map(produto => `
                                <tr>
                                    <td>${produto.codigoBarras}</td>
                                    <td>${produto.descricao}</td>
                                    <td>${produto.precoCusto}</td>
                                    <td>${produto.precoVenda}</td>
                                    <td>${produto.qtdEstoque}</td>
                                    <td>${produto.dataValidade}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <a href="/" class="btn btn-primary">Voltar</a>
                </div>
            </body>
        </html>
    `);
}

app.get('/cadastrarProduto', verificarAutenticacao, cadastroProdutoView);
app.get('/listarProdutos', verificarAutenticacao, listarProdutosView);

app.post('/cadastrarProduto', verificarAutenticacao, (req, resp) => {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, qtdEstoque, nomeFabricante } = req.body;
    listaProdutos.push({
        codigoBarras,
        descricao,
        precoCusto,
        precoVenda,
        dataValidade,
        qtdEstoque,
        nomeFabricante,
    });

    resp.redirect('/listarProdutos');
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});