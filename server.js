const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const AIS_API_KEY = "GANTI_DENGAN_API_KEY_KAMU"; 

// Koneksi ke sumber data (AISStream)
const aisStream = new WebSocket("wss://stream.aisstream.io/v0/stream");

aisStream.on('open', () => {
    aisStream.send(JSON.stringify({
        APIKey: AIS_API_KEY,
        BoundingBoxes: [[[-11, 95], [6, 141]]] // Fokus Indonesia
    }));
});

aisStream.on('message', (data) => {
    // Kirim data ke tampilan HP/Web
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(data.toString());
    });
});

app.use(express.static('public'));
server.listen(process.env.PORT || 3000);
