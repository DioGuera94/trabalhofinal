const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

const porta = 3000;
const host = '0.0.0.0';

let usuarios = [];
let mensagens = [];

app.use(express.static(path.join(__dirname, 'trabalhofinal', 'pages', 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'trabalhofinal', 'pages', 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') {
        res.redirect('/menu');
    } else {
        res.send(`
            <html>
                <head><title>Login Falhou</title></head>
                <body>
                    <h2>Usuário ou senha inválidos</h2>
                    <a href="/login.html">Tente novamente</a>
                </body>
            </html>
        `);
    }
});

app.get('/menu', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { margin-top: 50px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Menu</h1>
                    <a href="/cadastrousuario.html" class="btn btn-primary">Cadastro de Usuários</a>
                    <a href="/batepapo" class="btn btn-secondary">Bate-papo</a>
                </div>
            </body>
        </html>
    `);
});

app.get('/cadastrousuario.html', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Cadastro de Usuários</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { margin-top: 50px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Cadastro de Usuários</h1>
                    <form action="/cadastrarusuario" method="POST">
                        <div class="mb-3">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" required>
                        </div>
                        <div class="mb-3">
                            <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                            <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" required>
                        </div>
                        <div class="mb-3">
                            <label for="apelido" class="form-label">Apelido</label>
                            <input type="text" class="form-control" id="apelido" name="apelido" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                    </form>
                    <a href="/menu" class="btn btn-secondary mt-3">Voltar</a>
                </div>
            </body>
        </html>
    `);
});

app.post('/cadastrarusuario', (req, res) => {
    const { nome, dataNascimento, apelido } = req.body;
    if (!nome || !dataNascimento || !apelido) {
        res.send("Todos os campos são obrigatórios.");
        return;
    }
    usuarios.push({ nome, dataNascimento, apelido });
    res.send(`
        <html>
            <head>
                <title>Usuários Cadastrados</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Usuários cadastrados</h1>
                    <ul>
                        ${usuarios.map(u => `<li>${u.nome} (${u.apelido})</li>`).join('')}
                    </ul>
                    <a href="/cadastrousuario.html" class="btn btn-primary">Cadastrar novo usuário</a>
                    <a href="/menu" class="btn btn-secondary">Voltar ao menu</a>
                </div>
            </body>
        </html>
    `);
});

app.get('/batepapo', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { margin-top: 50px; }
                    .mensagem {
                        margin-bottom: 15px;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        max-width: 60%;
                    }
                    .mensagem.usuario {
                        background-color: #f0f8ff;
                        align-self: flex-start;
                    }
                    .mensagem.outro {
                        background-color: #e6ffe6;
                        align-self: flex-end;
                    }
                    .chat-box {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .formulario {
                        margin-top: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Bate-papo</h1>
                    <div class="chat-box">
                        ${mensagens.map(m => `
                            <div class="mensagem ${m.usuario === "Você" ? "usuario" : "outro"}">
                                <strong>${m.usuario}:</strong> ${m.texto}
                                <div style="font-size: 0.8em; color: #555;">${m.dataHora}</div>
                            </div>
                        `).join('')}
                    </div>
                    <form action="/postarmensagem" method="POST" class="formulario">
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário</label>
                            <select id="usuario" name="usuario" class="form-select" required>
                                ${usuarios.map(u => `<option value="${u.apelido}">${u.apelido}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="texto" class="form-label">Mensagem</label>
                            <textarea id="texto" name="texto" class="form-control" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </form>
                    <a href="/menu" class="btn btn-secondary mt-3">Voltar</a>
                </div>
            </body>
        </html>
    `);
});

app.post('/postarmensagem', (req, res) => {
    const { usuario, texto } = req.body;
    if (!usuario || !texto) {
        res.send("Usuário e mensagem são obrigatórios.");
        return;
    }
    mensagens.push({
        usuario,
        texto,
        dataHora: new Date().toLocaleString('pt-BR'),
    });
    res.redirect('/batepapo');
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
