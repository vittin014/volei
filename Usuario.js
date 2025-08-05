const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
  // Pode expandir com nome, perfil, etc.
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
