const express = require("express");
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware"); // Importa os middlewares
const router = express.Router();

// Rota de Criação de Usuário
// 1. Deve estar logado (protect)
// 2. Deve ser 'Admin' (authorize('Admin'))
router.post("/", protect, authorize("Admin"), userController.createUser);

// 1. Listagem de Usuários
// Apenas 'Admin' e 'Suporte' podem listar todos
router.get(
  "/",
  protect,
  authorize(["Admin", "Suporte"]),
  userController.getAllUsers
);

// 2. Detalhes de um Usuário Específico
// O controle de quem pode ver quem é feito dentro do controller (getUserById)
// Mas o usuário PRECISA estar logado (protect)
router.get("/:id", protect, userController.getUserById);

module.exports = router;
