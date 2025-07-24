const clientes = require('../models/clientes');
const usuarios = require('../models/usuarios'); // importa usuários
const bcrypt = require('bcryptjs');

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCpfCnpj(valor) {
  const limpo = valor.replace(/\D/g, '');
  return limpo.length === 11 || limpo.length === 14;
}

function validarSenha(senha) {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{15,}$/;
  return regex.test(senha);
}

exports.cadastrarCliente = (req, res) => {
  try {
    const {
      nome,
      cpfCnpj,
      endereco,
      telefone1,
      telefone2,
      email,
      pisPasep,
      processosVinculados,
      senha
    } = req.body;

    if (!nome || !cpfCnpj || !endereco || !telefone1 || !email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ erro: 'Email inválido.' });
    }

    if (!validarCpfCnpj(cpfCnpj)) {
      return res.status(400).json({ erro: 'CPF ou CNPJ inválido.' });
    }

    if (!validarSenha(senha)) {
      return res.status(400).json({
        erro: 'A senha deve ter no mínimo 15 caracteres, letras, números e um símbolo.'
      });
    }

    const jaExiste = clientes.find(c =>
      c.cpfCnpj.replace(/\D/g, '') === cpfCnpj.replace(/\D/g, '') ||
      c.email.toLowerCase() === email.toLowerCase()
    );

    if (jaExiste) {
      return res.status(409).json({ erro: 'Cliente já cadastrado.' });
    }

    const senhaHash = bcrypt.hashSync(senha, 8);

    const novoCliente = {
      id: clientes.length + 1,
      nome,
      cpfCnpj,
      endereco,
      telefone1,
      telefone2,
      email,
      pisPasep,
      processosVinculados: Number(processosVinculados || 0),
      senha: senhaHash // salva com hash
    };

    clientes.push(novoCliente);

    // 👇 Adiciona o cliente também em `usuarios.js` para login
    usuarios.push({
      id: usuarios.length + 1,
      nome,
      email,
      senha: senhaHash,
      role: 'cliente'
    });

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso.',
      cliente: { ...novoCliente, senha: undefined } // não envia senha de volta
    });

  } catch (erro) {
    console.error('Erro ao cadastrar cliente:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
};

exports.listarClientes = (req, res) => {
  try {
    res.json(clientes);
  } catch (erro) {
    console.error('Erro ao listar clientes:', erro);
    res.status(500).json({ erro: 'Erro ao obter clientes.' });
  }
};
