const https = require("https");
const fs = require("fs");
const WebSocket = require("ws");
const dotenv = require("dotenv").config();

const credentials = {
  pfx: fs.readFileSync(process.env.PFX_FILE),
  passphrase: process.env.PFX_PASSPHRASE,
  ca: fs.readFileSync(process.env.INTERCERT_FILE),
};

const httpsServer = https.createServer(credentials);
const wss = new WebSocket.Server({ server: httpsServer });

wss.on("connection", (socket) => {
  console.log("Klien terhubung");
  const data = {
    time: new Date().toLocaleTimeString(),
    message: "Pesan dari server dalam format JSON",
  };
  const interval = setInterval(() => {
    socket.send("Pesan dari server: " + new Date().toLocaleTimeString());
  }, 1000);

  socket.on("close", () => {
    console.log("Klien terputus");
    clearInterval(interval);
  });
});

httpsServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server HTTPS berjalan di port ${process.env.PORT || 3000}`);
});
