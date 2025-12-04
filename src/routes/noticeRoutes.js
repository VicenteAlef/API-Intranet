const express = require("express");
const noticeController = require("../controllers/noticeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Todas as rotas requerem login
router.use(protect);

// GET /api/notices -> Qualquer usuário logado pode ver
router.get("/", noticeController.getActiveNotices);

// POST /api/notices -> Apenas Admin e Suporte podem criar
router.post(
  "/",
  authorize(["Admin", "Suporte"]),
  noticeController.createNotice
);

// DELETE /api/notices/:id -> Apenas Admin e Suporte podem apagar
router.delete(
  "/:id",
  authorize(["Admin", "Suporte"]),
  noticeController.deleteNotice
);

module.exports = router;
