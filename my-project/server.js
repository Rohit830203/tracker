// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('send-location', (data) => {
        console.log('location received from:', socket.id, data);
        // Broadcast the location to all other clients
        socket.broadcast.emit('receive-location', {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
