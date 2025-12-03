const Usuario = require("../models/Usuario");
const { sequelize } = require("../config/database");

// Definir as credenciais do Admin inicial
const ADMIN_EMAIL = "admin@suaempresa.com.br";
const ADMIN_PASSWORD = "admin123"; // Senha que será hasheada

async function seedAdminUser() {
  await sequelize.sync({ force: false }); // Garante que a tabela exista

  try {
    // 1. Verificar se o Admin já existe
    const existingAdmin = await Usuario.findOne({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log(`Usuário Admin (${ADMIN_EMAIL}) já existe. Pulando criação.`);
      return;
    }

    // 2. Se não existir, criar o novo Admin
    const newAdmin = await Usuario.create({
      nome: "Administrador Geral",
      email: ADMIN_EMAIL,
      senha: ADMIN_PASSWORD, // O hook do modelo Usuario fará o hash automaticamente
      departamento: "TI / Administração",
      role: "Admin",
      ativo: true,
    });

    console.log(`Usuário Admin inicial criado com sucesso: ${newAdmin.email}`);
    console.log(`Role: ${newAdmin.role}`);
    console.log(
      `Senha Padrão: ${ADMIN_PASSWORD} (ALTERE APÓS O PRIMEIRO LOGIN!)`
    );
  } catch (error) {
    console.error("Erro ao executar o seed do Admin:", error.message);
  }
}

module.exports = { seedAdminUser, ADMIN_EMAIL, ADMIN_PASSWORD };
