import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeConversation: null,
  onlineUsers: [],
  typingUsers: {},
  unreadTotal: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    setTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (!state.typingUsers[conversationId].includes(userId)) {
        state.typingUsers[conversationId].push(userId);
      }
    },
    clearTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(id => id !== userId);
      }
    },
    setUnreadTotal: (state, action) => {
      state.unreadTotal = action.payload;
    }
  },
});

export const { 
  setActiveConversation, 
  setOnlineUsers, 
  addOnlineUser, 
  removeOnlineUser,
  setTypingUser,
  clearTypingUser,
  setUnreadTotal
} = chatSlice.actions;
export default chatSlice.reducer;
