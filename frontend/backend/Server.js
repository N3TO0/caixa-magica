const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const lastMessageTime = new Map();

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("nova-pergunta", (data) => {
    console.log("Recebido:", data);

    if (!data || !data.texto) return;

    const agora = Date.now();
    const ultimoEnvio = lastMessageTime.get(socket.id) || 0;

    // anti-spam: 1 msg a cada 2s
    if (agora - ultimoEnvio < 2000) {
      console.log("Spam bloqueado");
      return;
    }

    lastMessageTime.set(socket.id, agora);

    // validação tamanho
    if (data.texto.length > 300) return;

    // sanitização básica
    const textoSeguro = data.texto
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    io.emit("nova-pergunta", {
      texto: textoSeguro,
      data: new Date().toLocaleString()
    });
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Servidor Socket.IO rodando na porta 3001");
});
