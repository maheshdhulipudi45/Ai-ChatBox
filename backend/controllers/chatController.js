import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { generateAIResponse, generateAutoTitle } from '../services/geminiService.js';

// @desc    Send a message to the AI
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { content, conversationId } = req.body;

    // Validate request
    if (!content || content.trim() === '') {
      res.status(400);
      throw new Error('Message content cannot be empty');
    }

    let conversation;

    // 1. Resolve or Create Conversation belonging to the user
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
      if (!conversation) {
        res.status(404);
        throw new Error('Conversation not found');
      }
    } else {
      // Create a new conversation and generate an initial title from the prompt
      const generatedTitle = await generateAutoTitle(content);
      conversation = new Conversation({
        userId: req.user._id,
        title: generatedTitle
      });
      await conversation.save();
    }

    // 2. Save User Message
    const userMessage = new Message({
      conversationId: conversation._id,
      role: 'user',
      content: content.trim()
    });
    await userMessage.save();

    // 3. Retrieve Entire Message History for Context
    const history = await Message.find({ conversationId: conversation._id }).sort({ timestamp: 1 });

    // 4. Call AI Provider Service
    let aiResponseText;
    try {
      aiResponseText = await generateAIResponse(history);
    } catch (apiError) {
      res.status(502);
      throw new Error(`AI Provider Error: ${apiError.message}`);
    }

    // 5. Save AI Response Message
    const aiMessage = new Message({
      conversationId: conversation._id,
      role: 'model',
      content: aiResponseText
    });
    await aiMessage.save();

    // 6. Update Conversation updatedAt Timestamp
    conversation.updatedAt = new Date();
    await conversation.save();

    // 7. Return to Frontend
    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      title: conversation.title,
      userMessage,
      aiMessage
    });
  } catch (error) {
    next(error);
  }
};
