require("dotenv").config();
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Chave secreta e tempo de expiração do JWT (3 horas)
const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRATION_TIME = "3h";

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    // 1. Busca o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !usuario.ativo) {
      return res
        .status(401)
        .json({ error: "Credenciais inválidas ou usuário inativo." });
    }

    // 2. Compara a senha informada com o hash salvo (método definido no modelo)
    const senhaValida = await usuario.checkPassword(senha);

    if (!senhaValida) {
      return res
        .status(401)
        .json({ error: "Credenciais inválidas ou usuário inativo." });
    }

    // 3. Cria o payload do JWT
    const payload = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
    };

    // 4. Gera o Token JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRATION_TIME });

    // 5. Retorna o token para o Front-end
    return res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
