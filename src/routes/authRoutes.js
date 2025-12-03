const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Rota POST para login
router.post("/login", authController.login);

module.exports = router;
