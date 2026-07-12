import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setError(null);
      const res = await api.getConversations();
      if (res.success) {
        setConversations(res.data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Could not retrieve conversation history.');
    }
  };

  // Sync conversations list with authentication status
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      setConversations([]);
      setActiveConversationId(null);
      setActiveConversation(null);
    }
  }, [isAuthenticated]);

  // Load a single conversation's messages
  const loadConversation = async (id) => {
    try {
      setIsLoading(false); // Reset loading if switching chats
      setError(null);
      setActiveConversationId(id);
      
      const res = await api.getConversationById(id);
      if (res.success) {
        setActiveConversation(res.data);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Failed to load conversation messages.');
    }
  };

  // Start a new blank chat session
  const startNewChat = () => {
    setActiveConversationId(null);
    setActiveConversation(null);
    setError(null);
    setIsLoading(false);
  };

  // Send a message to the AI
  const sendMessage = async (content) => {
    if (!content || content.trim() === '') return;
    
    setError(null);
    
    const tempUserMessage = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    if (activeConversation) {
      setActiveConversation(prev => ({
        ...prev,
        messages: [...prev.messages, tempUserMessage]
      }));
    } else {
      setActiveConversation({
        title: content.substring(0, 30),
        messages: [tempUserMessage]
      });
    }

    setIsLoading(true);

    try {
      const res = await api.sendMessageToAI(content.trim(), activeConversationId);
      
      if (res.success) {
        const { conversationId, title, userMessage, aiMessage } = res;
        
        setActiveConversationId(conversationId);
        
        setActiveConversation(prev => {
          const filtered = prev ? prev.messages.filter(m => !m._id.startsWith('temp-')) : [];
          return {
            _id: conversationId,
            title,
            messages: [...filtered, userMessage, aiMessage]
          };
        });

        await fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMsg = err.response?.data?.message || err.message || 'API request failed';
      setError(`Failed to get response: ${errorMsg}`);
      
      setActiveConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.filter(m => !m._id.startsWith('temp-'))
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rename conversation
  const renameChat = async (id, title) => {
    try {
      setError(null);
      const res = await api.renameConversation(id, title);
      if (res.success) {
        setConversations(prev =>
          prev.map(c => (c._id === id ? { ...c, title: res.data.title } : c))
        );
        if (activeConversationId === id) {
          setActiveConversation(prev => ({ ...prev, title: res.data.title }));
        }
      }
    } catch (err) {
      console.error('Error renaming conversation:', err);
      setError('Failed to rename conversation.');
    }
  };

  // Delete conversation
  const deleteChat = async (id) => {
    try {
      setError(null);
      const res = await api.deleteConversation(id);
      if (res.success) {
        if (activeConversationId === id) {
          startNewChat();
        }
        setConversations(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation.');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        isLoading,
        error,
        fetchConversations,
        loadConversation,
        startNewChat,
        sendMessage,
        renameChat,
        deleteChat,
        setError
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
