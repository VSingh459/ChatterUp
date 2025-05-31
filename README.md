# ChatterUp
# 💬 ChatterUp - Real-Time Chat Application

ChatterUp is a real-time messaging web app built with **Socket.IO**, **Express.js**, **MongoDB**, and **Vanilla JS/CSS**. It allows users to join a chat room, send/receive messages instantly, see who is typing, and view who is online—all in real-time.

---

## 🚀 Features

- 🔌 Real-time messaging using WebSockets (Socket.IO)
- 🗂️ Chat message persistence using MongoDB
- 👤 Dynamic avatars for each connected user
- ✍️ Typing indicators
- 📡 User join/leave notifications
- 📱 Responsive front-end layout with a simple and clean UI
- 🛠️ Live user count and connected user list

  
<img width="960" alt="P3" src="https://github.com/user-attachments/assets/1196e8af-4e26-4558-8f22-3e90951976d3" />

---

## 📁 Project Structure

.
├── client.html # Main frontend HTML page
├── client.css # Frontend styling
├── script.js # Socket client logic
├── server.js # Express + Socket.IO backend
├── chat.schema.js # Mongoose schema for chat messages
├── config.js # MongoDB connection setup
├── package.json # Project dependencies and metadata
└── public/
└── images/ # Avatars for users

yaml
Copy
Edit

---

## 🧪 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB (via Mongoose)

