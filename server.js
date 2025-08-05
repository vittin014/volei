const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const Aluno = require('./models/Aluno');
const Aula = require('./models/Aula');
const Usuario = require('./models/Usuario');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar banco MongoDB
mongoose.connect('mongodb://localhost:27017/volei', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Banco conectado'))
  .catch(err => console.error('Erro conexão BD:', err));

// Pasta pública
app.use(express.static(path.join(__dirname, 'public')));

// Pasta uploads (galeria)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Configurar multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Rotas:

// Cadastro de aluno
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  try {
    const existe = await Aluno.findOne({ email });
    if (existe) return res.status(400).send('Email já cadastrado');

    const aluno = new Aluno({ nome, email, senha, telefone });
    await aluno.save();
    res.status(201).send('Aluno cadastrado com sucesso');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar aluno');
  }
});

// Login (usuário)
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario || usuario.senha !== senha) {
      return res.status(401).send('Credenciais inválidas');
    }
    // Para autenticação real, implemente JWT ou sessões aqui.
    res.send('Login realizado com sucesso');
  } catch (err) {
    res.status(500).send('Erro no login');
  }
});

// Buscar aulas para calendário
app.get('/aulas', async (req, res) => {
  try {
    const aulas = await Aula.find();
    res.json(aulas);
  } catch (err) {
    res.status(500).send('Erro ao buscar aulas');
  }
});

// Upload foto da galeria (precisa estar logado para produção, mas aqui é aberto)
app.post('/upload-foto', upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).send('Nenhum arquivo enviado');
  res.send('Foto enviada com sucesso');
});

// Listar fotos para galeria
app.get('/galeria', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).send('Erro ao listar imagens');
    const imagens = files.map(f => `/uploads/${f}`);
    res.json(imagens);
  });
});
app.get('/galeria', (req, res) => {
  // Retorne os nomes ou caminhos das imagens
  res.json([
    '/images/volei1.jpeg',
    '/images/volei2.jpeg',
  ]);
});


// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
