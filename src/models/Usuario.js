const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  departamento: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Suporte', 'Usuario Comum'),
    defaultValue: 'Usuario Comum',
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: true, 

// HOOK: Criptografa a senha antes de salvar
Usuario.beforeSave(async (usuario, options) => {
  if (usuario.changed('senha')) {
    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(usuario.senha, salt);
  }
});

// Método de Instância: Compara a senha informada com o hash salvo
Usuario.prototype.checkPassword = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

module.exports = Usuario;