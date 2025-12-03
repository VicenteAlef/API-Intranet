const Usuario = require("../models/Usuario");

// Controlador para criar um novo usuário - Apenas Admins podem acessar esta funcionalidade
exports.createUser = async (req, res) => {
  const { nome, email, senha, departamento, role } = req.body;

  // 1. Validação básica de entrada
  if (!nome || !email || !senha || !role) {
    return res
      .status(400)
      .json({ error: "Nome, email, senha e role são obrigatórios." });
  }

  // 2. Garante que apenas Roles válidas sejam aceitas
  const rolesValidas = ["Admin", "Suporte", "Usuario Comum"];
  if (!rolesValidas.includes(role)) {
    return res.status(400).json({ error: "Role inválida fornecida." });
  }

  try {
    // 3. Verifica se o email já está em uso
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Este email já está cadastrado no sistema." });
    }

    // 4. Cria o novo usuário
    // A senha será automaticamente hasheada pelo hook 'beforeSave' no modelo Usuario
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha,
      departamento: departamento || "Não Definido", // Aceita departamento opcional
      role,
      ativo: true, // Novo usuário é criado sempre ativo
    });

    // 5. Retorna o usuário criado (sem o hash da senha, por segurança!)
    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      departamento: novoUsuario.departamento,
      role: novoUsuario.role,
      ativo: novoUsuario.ativo,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    // Erros de validação do DB (embora o email já tenha sido checado)
    return res
      .status(500)
      .json({ error: "Erro interno ao tentar salvar o usuário." });
  }
};

// Lista todos os usuários (Admin e Suporte) - Rota: GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.findAll({
      // Seleciona apenas os campos necessários para a listagem
      attributes: ["id", "nome", "email", "departamento", "role", "ativo"],
      order: [["nome", "ASC"]], // Ordena alfabeticamente
    });

    return res.json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ error: "Erro interno ao buscar usuários." });
  }
};

/**
 * Busca dados de um usuário específico
 * Rota: GET /api/users/:id
 * Regra: Admin/Suporte podem ver qualquer um. Usuário Comum só pode ver a si mesmo.
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user; // Vem do middleware 'protect'

  // REGRA DE SEGURANÇA:
  // Se não for Admin nem Suporte, só pode acessar se o ID solicitado for o dele mesmo.
  if (
    usuarioLogado.role !== "Admin" &&
    usuarioLogado.role !== "Suporte" &&
    usuarioLogado.id !== parseInt(id)
  ) {
    return res.status(403).json({ error: "Acesso negado a este perfil." });
  }

  try {
    const user = await Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] }, // Exclui a senha do retorno
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao buscar dados do usuário." });
  }
};

/**
 * Atualiza dados de um usuário (Admin)
 * Rota: PUT /api/users/:id
 * Nota: Se a senha for enviada, o hook do modelo irá criptografá-la novamente.
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, departamento, role } = req.body;

  try {
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Verifica se o email foi alterado e se já existe em outro usuário
    if (email && email !== user.email) {
      const emailExists = await Usuario.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ error: 'Este email já está em uso por outro usuário.' });
      }
    }

    // Atualiza os campos
    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.departamento = departamento || user.departamento;
    user.role = role || user.role;
    
    // Se a senha foi informada, atualiza (o hook beforeSave fará o hash)
    if (senha) {
      user.senha = senha;
    }

    await user.save(); // Salva e dispara os hooks

    return res.json({
      message: 'Usuário atualizado com sucesso.',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        departamento: user.departamento
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
  }
};

/**
 * Alterna o status do usuário (Ativo/Inativo)
 * Rota: PATCH /api/users/:id/status
 */
exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { ativo } = req.body; // Espera true ou false

  if (typeof ativo !== 'boolean') {
    return res.status(400).json({ error: 'O campo "ativo" deve ser booleano.' });
  }

  try {
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    user.ativo = ativo;
    await user.save();

    return res.json({
      message: `Usuário ${ativo ? 'ativado' : 'inativado'} com sucesso.`,
      id: user.id,
      ativo: user.ativo
    });

  } catch (error) {
    console.error('Erro ao alterar status:', error);
    return res.status(500).json({ error: 'Erro interno ao alterar status.' });
  }
};

/**
 * Exclui um usuário permanentemente
 * Rota: DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Usuario.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await user.destroy(); // Remove do banco de dados

    return res.json({ message: 'Usuário excluído com sucesso.' });

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir usuário.' });
  }
};
