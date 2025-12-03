require("dotenv").config();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// 1. Middleware principal para verificar se o usuário está logado
exports.protect = (req, res, next) => {
  // O token geralmente vem no cabeçalho 'Authorization' no formato 'Bearer <token>'
  let token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  // Remove 'Bearer '
  token = token.replace("Bearer ", "");

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adiciona as informações do usuário logado ao objeto da requisição (req.user)
    req.user = decoded;

    next(); // Permite que a requisição siga para o controller
  } catch (error) {
    // Se o token for inválido, expirado, etc.
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

// 2. Middleware para verificar a Role (Admin, Suporte, etc.)
exports.authorize = (roles = []) => {
  // roles pode ser uma string ('Admin') ou um array (['Admin', 'Suporte'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    // Verifica se o role do usuário logado (req.user.role, injetado pelo 'protect')
    // está incluído na lista de roles permitidas
    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Acesso negado. Role não autorizada." });
    }

    next();
  };
};
