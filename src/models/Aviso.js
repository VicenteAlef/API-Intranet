const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Usuario = require("./Usuario");

const Aviso = sequelize.define(
  "Aviso",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("Geral", "Importante", "Manutencao"),
      defaultValue: "Geral",
    },
    data_expiracao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: "id",
      },
    },
  },
  {
    tableName: "avisos",
    timestamps: true,
  }
);

// Define o relacionamento: Um Aviso pertence a um Usuário
Aviso.belongsTo(Usuario, { foreignKey: "usuario_id", as: "autor" });

module.exports = Aviso;
