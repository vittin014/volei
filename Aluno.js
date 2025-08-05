const mongoose = require('mongoose');

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: String,
  dataCadastro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Aluno', AlunoSchema);
