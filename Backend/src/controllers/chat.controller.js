import { generateResponses, generateChatTitle } from "../services/ai.services.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chatId } = req.body;

        let chat;

        // Create a new chat if no chatId is provided
        if (!chatId) {
            const title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title,
            });
        } else {
            chat = await chatModel.findOne({
                _id: chatId,
                user: req.user.id,
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }
        }

        // Save user's message
        const userMessage = await messageModel.create({
            chat: chat._id,
            role: "user",
            content: message,
        });

        // Get all previous messages of this chat
        const messages = await messageModel
            .find({ chat: chat._id })
            .sort({ createdAt: 1 });

        // Generate AI response
        const result = await generateResponses(messages);

        // Save assistant response
        const assistantMessage = await messageModel.create({
            chat: chat._id,
            role: "assistant",
            content: result,
        });

        return res.status(200).json({
            success: true,
            chatId: chat._id,
            title: chat.title,
            data: result,
            userMessage,
            assistantMessage,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function getChats(req, res) {
    try {
        const chats = await chatModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Chats received successfully",
            data: chats,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export async function getMessagesByChatId(req, res) {
    try {
        const { chatId } = req.params;

        // Verify chat exists and belongs to user
        const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // Get all messages for this chat
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        // Check if the chat exists and belongs to the logged-in user
        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // Delete all messages in the chat
        await messageModel.deleteMany({
            chat: chatId,
        });

        // Delete the chat itself
        await chatModel.findByIdAndDelete(chatId);

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
