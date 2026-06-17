/* =====================================================================
   BLOX RIVALS — reference multiplayer server (WebSocket room relay)
   ---------------------------------------------------------------------
   The game client only needs a server that does ONE thing:
   rebroadcast every JSON message it receives to all OTHER clients
   that are in the same `room`. That's it — no game logic required.

   Run it:
     npm init -y
     npm install ws
     node server-example.js
   Then in the game's LOBBY screen, set Server URL to:
     ws://localhost:8080          (same machine / LAN testing)
   For players over the internet, host this somewhere and use wss://
   (e.g. Render/Railway/Fly/your VPS behind TLS).
   ===================================================================== */
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  ws.room = null;

  ws.on('message', (data) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    // first message with a room "subscribes" this socket to that room
    if (msg.room) ws.room = msg.room;

    // relay to everyone else in the same room
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1 && client.room === msg.room) {
        client.send(data.toString());
      }
    });
  });

  ws.on('close', () => {
    // tell the room this peer left (best-effort; client also sends its own 'leave')
    wss.clients.forEach((client) => {
      if (client.readyState === 1 && client.room === ws.room) {
        client.send(JSON.stringify({ t: 'leave', id: ws.id, room: ws.room }));
      }
    });
  });
});

console.log('BLOX RIVALS relay server listening on ws://localhost:' + PORT);
