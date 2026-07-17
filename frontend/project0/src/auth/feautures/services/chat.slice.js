import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats: {}, // { chatId: { _id, title, messages: [] } }
    currentChatId: null,
    isLoading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setCurrentChat: (state, action) => {
            state.currentChatId = action.payload;
        },

        addChat: (state, action) => {
            const chat = action.payload;

            state.chats[chat._id] = {
                ...chat,
                messages: state.chats[chat._id]?.messages || [],
            };
        },

        addMessage: (state, action) => {
            const message = action.payload;

            const chatId = message.chat;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    _id: chatId,
                    title: "",
                    messages: [],
                };
            }

            state.chats[chatId].messages.push(message);
        },

        setChats: (state, action) => {
            state.chats = action.payload.reduce((chats, chat) => {
                chats[chat._id] = {
                    ...chat,
                    messages: state.chats[chat._id]?.messages || [],
                };

                return chats;
            }, {});
        },

        setMessages: (state, action) => {
            const { chatId, messages } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    _id: chatId,
                    title: "",
                    messages: [],
                };
            }

            state.chats[chatId].messages = messages;
        },

        openChat: (state, action) => {
            const { chatId, messages } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    _id: chatId,
                    title: "",
                    messages: [],
                };
            }

            state.chats[chatId].messages = messages;
            state.currentChatId = chatId;
        },

        removeChat: (state, action) => {
            const chatId = action.payload;

            delete state.chats[chatId];

            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setLoading,
    setCurrentChat,
    addChat,
    addMessage,
    setChats,
    setMessages,
    openChat,
    removeChat,
    setError,
} = chatSlice.actions;

export default chatSlice.reducer;
