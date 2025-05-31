import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connect } from './config.js';
import { chatModel } from './chat.schema.js';

const app = express();

// 1. Creating server using http.
const server = http.createServer(app);

app.use(express.static('public'));


// 2. Create socket server.
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// 3. Use socket events.

let connectedUsers = 0;
const users = []; // Array to store connected users

const imageFiles = [
    'batman.png',
    'glad.png',
    'hulk.png',
    'invi.jpg',
    'spider.png',
    'Super.png',
    'wolv.png'
];

io.on('connection', (socket) => {
    console.log("Connection is established");
    connectedUsers++;

    // Emit the updated count to all users (including the newly connected user)
    io.emit('update_user_count', { count: connectedUsers });

    socket.on("join", (data) => {
        socket.username = data;
        users.push(data);

        socket.broadcast.emit("user_joined", {
            username: data
        });

        // Randomly select an image for the user
        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const imageUrl = `http://localhost:3000/images/${randomImage}`;
        socket.userIcon = imageUrl;

        // image sending
        socket.emit("batman_image", { url: imageUrl });


        // Send the list of all connected users to the new user
        socket.emit("all_users", { users });

        // send old messages to the clients.
        chatModel.find().sort({ timestamp: 1 }).limit(50)
            .then(messages => {
                socket.emit('load_messages', messages);
            }).catch(err => {
                console.log(err);
            })
    });

    socket.on('new_message', (data) => {
        const { message, time } = data; // Destructure message and time
        const userMessage = {
            username: socket.username,
            message: message, // Keep the message as a string
            icon: socket.userIcon,
            time: time, // Add time for broadcasting
        };
    
        const newChat = new chatModel({
            username: socket.username,
            message: message, // Save only the string part to MongoDB
            icon: socket.userIcon,
            timestamp: new Date(),
        });
    
        newChat.save().catch((err) => {
            console.error("Error saving chat:", err);
        });
    
        // Send the message to the sender
        socket.emit('broadcast_message', userMessage);
    
        // Broadcast this message to all other clients
        socket.broadcast.emit('broadcast_message', userMessage);
    });
    

    socket.on('disconnect', () => {
        connectedUsers--; // Decrement the count when a user disconnects
        // Remove the user from the list
        const index = users.indexOf(socket.username);
        if (index !== -1) {
            users.splice(index, 1);
        }
        io.emit('update_user_count', { count: connectedUsers });

        // Notify all users that someone left
        io.emit("user_left", { username: socket.username });
        console.log("Connection is disconnected");
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('show_typing', { username: socket.username }); // Broadcast to others
    });

    // Listen for stop typing event
    socket.on('stop_typing', () => {
        socket.broadcast.emit('hide_typing', { username: socket.username }); // Broadcast to others
    });
});

server.listen(3000, () => {
    console.log("App is listening on 3000");
    connect();
})
