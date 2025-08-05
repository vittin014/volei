const mongoose = require('mongoose');

const AulaSchema = new mongoose.Schema({
  nome_aula: String,
  data_aula: String, // use formato "YYYY-MM-DD"
  hora_inicio: String, // "HH:mm"
  hora_fim: String,    // "HH:mm"
  descricao: String,
  professor: String
});

module.exports = mongoose.model('Aula', AulaSchema);
