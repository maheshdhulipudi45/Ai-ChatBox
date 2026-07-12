import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// @desc    Get all conversations for logged in user
// @route   GET /api/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ timestamp: -1 })
          .select('content role timestamp');
        
        return {
          _id: conv._id,
          title: conv.title,
          isRenamed: conv.isRenamed || false,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            role: lastMessage.role,
            timestamp: lastMessage.timestamp
          } : null
        };
      })
    );

    res.status(200).json({ success: true, count: conversationsWithLastMessage.length, data: conversationsWithLastMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single conversation and its messages
// @route   GET /api/conversations/:id
// @access  Private
export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOne({ _id: id, userId: req.user._id });

    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    const messages = await Message.find({ conversationId: id }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: {
        _id: conversation._id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename a conversation
// @route   PUT /api/conversations/:id
// @access  Private
export const updateConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      res.status(400);
      throw new Error('Conversation title cannot be empty');
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title: title.trim(), isRenamed: true },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a conversation and all its messages
// @route   DELETE /api/conversations/:id
// @access  Private
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    // Delete all associated messages
    await Message.deleteMany({ conversationId: id });

    res.status(200).json({ success: true, message: 'Conversation and its history deleted successfully' });
  } catch (error) {
    next(error);
  }
};
