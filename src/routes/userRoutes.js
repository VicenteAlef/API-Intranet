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

// 2. Atualização do Próprio Perfil
// Qualquer usuário logado pode atualizar seu próprio perfil
router.patch("/profile", protect, userController.updateProfile);

// 3. Detalhes de um Usuário Específico
// O controle de quem pode ver quem é feito dentro do controller (getUserById)
// Mas o usuário PRECISA estar logado (protect)
router.get("/:id", protect, userController.getUserById);

// 4. Atualização Completa de Usuário
router.put("/:id", protect, authorize("Admin"), userController.updateUser);

// 5. Inativar/Ativar Usuário (Controle de Status)
router.patch(
  "/:id/status",
  protect,
  authorize("Admin"),
  userController.toggleUserStatus
);

// 6. Excluir Usuário
router.delete("/:id", protect, authorize("Admin"), userController.deleteUser);

module.exports = router;
