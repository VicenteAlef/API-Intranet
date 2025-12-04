require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Importa a conexão e o modelo
const { sequelize, testConnection } = require("./config/database");
const Usuario = require("./models/Usuario");

const { seedAdminUser } = require("./seeders/adminSeeder"); // Importa a função de seed
const authRoutes = require("./routes/authRoutes"); // Importa o módulo de rotas de autenticação
const userRoutes = require("./routes/userRoutes"); // Importa o novo módulo de rotas de usuários
const noticeRoutes = require("./routes/noticeRoutes"); // Importa o módulo de rotas de avisos

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de Segurança e Comunicação
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota de Teste Simples
app.get("/", (req, res) => {
  // Importa a função de seed
  const { seedAdminUser } = require("./seeders/adminSeeder");
  res.send("API da Intranet online! Pronto para receber requisições.");
});

app.use("/api/auth", authRoutes); // Usa o módulo de rotas de autenticação
app.use("/api/users", userRoutes); // Usa o novo módulo de rotas de usuários
app.use("/api/notices", noticeRoutes); // Usa o módulo de rotas de avisos

// Inicialização da Aplicação
async function startServer() {
  await testConnection();

  // Sincroniza o modelo com o banco de dados.
  await sequelize.sync({ force: false });
  console.log("Modelos sincronizados com o banco de dados.");

  // EXECUTA O SCRIPT DE CRIAÇÃO DO ADMIN INICIAL
  await seedAdminUser();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
