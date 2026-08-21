import Conversation from "../models/conversation.model.js";
import Message from '../models/message.model.js';

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log("User ID from header:", userId);
        const conversation= await Conversation.create({ userId });
        return res.status(201).json( conversation );
    }catch (error) {
        console.error("Error creating conversation:", error);
        return res.status(500).json({ message: `Error creating conversation: ${error.message}` });
    }
}
export const getConversations = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log("User ID from header:", userId);
        const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
        return res.status(200).json(conversations);
    }catch (error) {
        console.error("Error retrieving conversation:", error);
        return res.status(500).json({ message: `Error retrieving conversation: ${error.message}` });
    }
}
export const updateConversation = async (req, res) => {
    try {
        const {id, title} = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, { title });
        return res.status(200).json( conversation );
    }catch (error) {
        console.error("Error updating conversation:", error);
        return res.status(500).json({ message: `Error updating conversation: ${error}` });
    }
}

export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, images } = req.body;
        const message = await Message.create({ conversationId, content, role, images });
        return res.status(201).json( message );
    }catch (error) {
        return res.status(500).json({ message: `Error saving message: ${error}` });
    }
}
export const getMessages = async (req, res) => {
    try {
        
        const messages = await Message.find({ conversationId:req.params.conversationId });
        
        return res.status(200).json(messages);
    }catch (error) {
        console.error("Error retrieving messages:", error);
        return res.status(500).json({ message: `Error retrieving messages: ${error.message}` });
    }
}