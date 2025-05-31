import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    icon: String,
    timestamp: Date
});

export const chatModel = mongoose.model("Chat", chatSchema);