import express from 'express';
import {
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.route('/')
  .get(getConversations);

router.route('/:id')
  .get(getConversationById)
  .put(updateConversation)
  .delete(deleteConversation);

export default router;
