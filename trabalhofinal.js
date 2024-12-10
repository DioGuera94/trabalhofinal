const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

// Configuração de sessão
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Altere para true se for usar HTTPS
}));

app.use(express.urlencoded({ extended: true }));

const porta = 3000;
const host = '0.0.0.0';

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'pages', 'public')));

// Página Inicial (Login)
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') {
        req.session.usuario = usuario; // Salvar o usuário na sessão
        req.session.usuarios = []; // Inicializar lista de usuários na sessão
        req.session.mensagens = []; // Inicializar lista de mensagens na sessão
        res.redirect('/menu');
    } else {
        res.send(`
            <html>
                <head>
                    <title>Login Falhou</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body class="dark-mode">
                    <h2>Usuário ou senha inválidos</h2>
                    <a href="/login.html">Tente novamente</a>
                </body>
            </html>
        `);
    }
});

// Página Menu
app.get('/menu', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }
    res.send(`
        <html>
            <head>
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/style.css">
            </head>
            <body class="dark-mode">
                <div class="container">
                    <h1>Menu</h1>
                    <a href="/cadastrousuario.html" class="btn btn-primary">Cadastro de Usuários</a>
                    <a href="/batepapo" class="btn btn-secondary">Bate-papo</a>
                    <a href="/logout" class="btn btn-danger">Sair</a>
                </div>
            </body>
        </html>
    `);
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Erro ao sair');
        }
        res.redirect('/login.html');
    });
});

// Página para Cadastro de Usuários (GET)
app.get('/cadastrousuario.html', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.send(`
        <html>
            <head>
                <title>Cadastro de Usuários</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/style.css">
            </head>
            <body class="dark-mode">
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
                    <a href="/menu" class="btn btn-secondary mt-3">Voltar ao Menu</a>
                </div>
            </body>
        </html>
    `);
});

// Rota para cadastrar usuário (POST)
app.post('/cadastrarusuario', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    const { nome, dataNascimento, apelido } = req.body;
    if (!nome || !dataNascimento || !apelido) {
        return res.send("Todos os campos são obrigatórios.");
    }

    const novoUsuario = { nome, dataNascimento, apelido };
    req.session.usuarios.push(novoUsuario); // Salvar na sessão

    res.send(`
        <html>
            <head>
                <title>Usuários Cadastrados</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/style.css">
            </head>
            <body class="dark-mode">
                <div class="container mt-5">
                    <h1>Usuários Cadastrados</h1>
                    <ul>
                        ${req.session.usuarios.map(u => `<li>${u.nome} (${u.apelido})</li>`).join('')}
                    </ul>
                    <a href="/cadastrousuario.html" class="btn btn-primary">Cadastrar novo usuário</a>
                    <a href="/menu" class="btn btn-secondary">Voltar ao Menu</a>
                </div>
            </body>
        </html>
    `);
});

// Rota para bate-papo
app.get('/batepapo', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/login.html');
    }

    res.send(`
        <html>
            <head>
                <title>Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="/style.css">
            </head>
            <body class="dark-mode">
                <div class="container">
                    <h1>Bate-papo</h1>
                    <div class="chat-box">
                        ${req.session.mensagens.map(m => `
                            <div class="mensagem ${m.usuario === req.session.usuario ? "usuario" : "outro"}">
                                <strong>${m.usuario}:</strong> ${m.texto}
                                <div>${m.dataHora}</div>
                            </div>
                        `).join('')}
                    </div>
                    <form action="/postarmensagem" method="POST" class="formulario">
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário</label>
                            <select id="usuario" name="usuario" class="form-select" required>
                                ${req.session.usuarios.map(u => `<option value="${u.apelido}">${u.apelido}</option>`).join('')}
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
    const mensagem = {
        usuario,
        texto,
        dataHora: new Date().toLocaleString('pt-BR'),
    };
    req.session.mensagens.push(mensagem); // Salvar na sessão
    res.redirect('/batepapo');
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
