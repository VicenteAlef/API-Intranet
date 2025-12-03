const express = require("express");
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware"); // Importa os middlewares
const router = express.Router();

// Rota de Criação de Usuário
// 1. Deve estar logado (protect)
// 2. Deve ser 'Admin' (authorize('Admin'))
router.post("/", protect, authorize("Admin"), userController.createUser);

module.exports = router;
