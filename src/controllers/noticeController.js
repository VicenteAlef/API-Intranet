const Aviso = require("../models/Aviso");
const Usuario = require("../models/Usuario");
const { Op } = require("sequelize"); // Necessário para operações de data (>=)

/**
 * Cria um novo aviso (Admin/Suporte)
 */
exports.createNotice = async (req, res) => {
  const { titulo, mensagem, tipo, data_expiracao } = req.body;
  const usuario_id = req.user.id; // Pego do token JWT

  if (!titulo || !mensagem) {
    return res
      .status(400)
      .json({ error: "Título e mensagem são obrigatórios." });
  }

  try {
    // LÓGICA DE EXPIRAÇÃO:
    // Se enviou data, usa ela. Se não, soma 3 dias à data atual.
    let dataFinal;

    if (data_expiracao) {
      dataFinal = new Date(data_expiracao);
    } else {
      const hoje = new Date();
      // Adiciona 3 dias (3 * 24h * 60m * 60s * 1000ms)
      dataFinal = new Date(hoje.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    const novoAviso = await Aviso.create({
      titulo,
      mensagem,
      tipo: tipo || "Geral",
      data_expiracao: dataFinal,
      usuario_id,
    });

    return res.status(201).json(novoAviso);
  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    return res.status(500).json({ error: "Erro ao salvar o aviso." });
  }
};

/**
 * Lista avisos ativos (Não expirados)
 * Rota pública para logados
 */
exports.getActiveNotices = async (req, res) => {
  try {
    const hoje = new Date();

    const avisos = await Aviso.findAll({
      where: {
        // Filtra onde data_expiracao é MAIOR ou IGUAL a agora
        data_expiracao: {
          [Op.gte]: hoje,
        },
      },
      include: [
        {
          model: Usuario,
          as: "autor",
          attributes: ["id", "nome"], // Traz apenas o nome do autor
        },
      ],
      order: [["createdAt", "DESC"]], // Mais recentes primeiro
    });

    return res.json(avisos);
  } catch (error) {
    console.error("Erro ao listar avisos:", error);
    return res.status(500).json({ error: "Erro ao buscar avisos." });
  }
};

/**
 * Exclui um aviso (Admin/Suporte)
 */
exports.deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const aviso = await Aviso.findByPk(id);

    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado." });
    }

    await aviso.destroy();
    return res.json({ message: "Aviso removido com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir aviso:", error);
    return res.status(500).json({ error: "Erro ao excluir aviso." });
  }
};
