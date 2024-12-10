const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

const porta = 3000;
const host = '0.0.0.0';

let usuarios = [];
let mensagens = [];

app.get('/', (req, res) => {
    res.redirect('/menu');
});

app.get('/menu', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Menu</h1>
                    <a href="/cadastroUsuario.html" class="btn btn-primary">Cadastro de Usuários</a>
                    <a href="/batepapo" class="btn btn-secondary">Bate-papo</a>
                </div>
            </body>
        </html>
    `);
});

app.get('/cadastroUsuario.html', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Cadastro de Usuários</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Cadastro de Usuários</h1>
                    <form action="/cadastrarUsuario" method="POST">
                        <div class="mb-3">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" required>
                        </div>
                        <div class="mb-3">
                            <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                            <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" required>
                        </div>
                        <div class="mb-3">
                            <label for="nickname" class="form-label">Nickname</label>
                            <input type="text" class="form-control" id="nickname" name="nickname" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                    </form>
                    <a href="/menu" class="btn btn-secondary mt-3">Voltar</a>
                </div>
            </body>
        </html>
    `);
});

app.post('/cadastrarUsuario', (req, res) => {
    const { nome, dataNascimento, nickname } = req.body;

    if (!nome || !dataNascimento || !nickname) {
        res.send("Todos os campos são obrigatórios.");
        return;
    }

    usuarios.push({ nome, dataNascimento, nickname });
    res.send(`
        <h1>Usuários cadastrados</h1>
        <ul>
            ${usuarios.map(u => `<li>${u.nome} (${u.nickname})</li>`).join('')}
        </ul>
        <a href="/cadastroUsuario.html">Cadastrar novo usuário</a>
        <a href="/menu">Voltar ao menu</a>
    `);
});

app.get('/batepapo', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-5">
                    <h1>Bate-papo</h1>
                    <ul>
                        ${mensagens.map(m => `<li>${m.dataHora} - <strong>${m.usuario}:</strong> ${m.texto}</li>`).join('')}
                    </ul>
                    <form action="/postarMensagem" method="POST">
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário</label>
                            <select id="usuario" name="usuario" class="form-select" required>
                                ${usuarios.map(u => `<option value="${u.nickname}">${u.nickname}</option>`).join('')}
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

app.post('/postarMensagem', (req, res) => {
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
