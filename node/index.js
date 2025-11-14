import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }))

app.get("/", (req, res) => {
  res.send("API WHIM está rodando!");
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, paciente) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
    req.paciente = paciente;

    next();
  });
}

app.post("/auth/register", async (req, res) => {
  const {
    email,
    nomeCompleto,
    telefone,
    sexo,
    pesoAtual,
    alturaCm,
    senha,
    dataNascimento,
  } = req.body;

  if (
    !email ||
    !senha ||
    !nomeCompleto ||
    !dataNascimento ||
    !alturaCm ||
    !pesoAtual
  ) {
    return res
      .status(400)
      .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novaPaciente = await prisma.paciente.create({
      data: {
        email,
        senhaHash,
        nomeCompleto,
        telefone,
        sexo,
        alturaCm: parseFloat(alturaCm),
        dataNascimento: new Date(dataNascimento),
      },
    });

    await prisma.historicoPeso.create({
      data: {
        pacienteId: novaPaciente.id,
        pesoKg: parseFloat(pesoAtual),
        dataRegistro: new Date(),
      },
    });

    res.status(201).json({
      message: "Cadastro realizado com sucesso!",
      paciente: {
        id: novaPaciente.id,
        email: novaPaciente.email,
        nome: novaPaciente.nomeCompleto,
      },
    });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });
    }
    console.error("Erro no cadastro:", e);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const paciente = await prisma.paciente.findUnique({
      where: { email },
    });

    if (!paciente) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, paciente.senhaHash);

    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { pacienteId: paciente.id, email: paciente.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login bem-sucedido!",
      token,
      paciente: {
        id: paciente.id,
        nome: paciente.nomeCompleto,
        email: paciente.email,
      },
    });
  } catch (e) {
    console.error("Erro no login:", e);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.get("/questionario/estrutura", authenticateToken, async (req, res) => {
  try {
    const estrutura = await prisma.pilar.findMany({
      include: {
        perguntas: {
          orderBy: { ordem: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    res.json(estrutura);
  } catch (e) {
    console.error("Erro ao buscar a estrutura:", e);
    res.status(500).json({
      error: "Não foi possível carregar a estrutura do questionário.",
    });
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(
      "❌ Falha ao iniciar o servidor ou conectar ao banco de dados:",
      e
    );
    process.exit(1);
  }
}

startServer();
