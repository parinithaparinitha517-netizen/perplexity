import { Router } from 'express'
import { authUser } from '../middlewares/auth.middleware.js';
import { sendMessage, getChats, getMessagesByChatId,deleteChat } from '../controllers/chat.controller.js';
const chatRoutes = Router()
chatRoutes.post('/message', authUser, sendMessage);
chatRoutes.get('/', authUser, getChats);
chatRoutes.get('/messages/:chatId', authUser, getMessagesByChatId);
chatRoutes.delete('/chats/:chatId', authUser, deleteChat);
export default chatRoutes;
