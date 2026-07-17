import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from "../chat/chat.socket";
import {
    sendMessage,
    getChats,
    getMessagesByChatId,
    deleteChat,
} from "../services/chat.api.js";

import {
    setLoading,
    addChat,
    addMessage,
    setCurrentChat,
    setChats,
    openChat,
    removeChat,
    setError,
} from "../services/chat.slice.js";

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || "Something went wrong";

export const useChat = () => {
    const dispatch = useDispatch();

    const handleSendMessage = useCallback(async ({ message, chatId }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await sendMessage({
                message,
                chatId,
            });

            const {
                chatId: newChatId,
                title,
                userMessage,
                assistantMessage,
            } = response;

            // If this is a newly created chat
            if (!chatId) {
                dispatch(
                    addChat({
                        _id: newChatId,
                        title,
                    })
                );

                dispatch(setCurrentChat(newChatId));
            }

            // Add both messages
            dispatch(addMessage(userMessage));
            dispatch(addMessage(assistantMessage));

            return response;
        } catch (error) {
            dispatch(setError(getErrorMessage(error)));
            console.error("Error sending message:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleGetChats = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await getChats();
            dispatch(setChats(response.data));

            return response;
        } catch (error) {
            dispatch(setError(getErrorMessage(error)));
            console.error("Error getting chats:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleOpenChat = useCallback(async (chatId) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await getMessagesByChatId(chatId);
            dispatch(openChat({ chatId, messages: response.data }));

            return response;
        } catch (error) {
            dispatch(setError(getErrorMessage(error)));
            console.error("Error opening chat:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleDeleteChat = useCallback(async (chatId) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await deleteChat(chatId);
            dispatch(removeChat(chatId));

            return response;
        } catch (error) {
            dispatch(setError(getErrorMessage(error)));
            console.error("Error deleting chat:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const handleNewChat = useCallback(() => {
        dispatch(setCurrentChat(null));
        dispatch(setError(null));
    }, [dispatch]);

    return useMemo(() => ({
        connectSocket,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleGetMessages: handleOpenChat,
        handleDeleteChat,
        handleNewChat,
    }), [handleSendMessage, handleGetChats, handleOpenChat, handleDeleteChat, handleNewChat]);
};
