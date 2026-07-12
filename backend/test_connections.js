import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generateAIResponse } from './services/geminiService.js';

dotenv.config();

console.log('--- starting K-Hub Backend Connections Test ---');
console.log('MongoDB URI present:', !!process.env.MONGODB_URI);
console.log('OpenRouter API Key present:', !!process.env.OPENROUTER_API_KEY);

const testDB = async () => {
  try {
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('SUCCESS: MongoDB connected successfully.');
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
  } catch (error) {
    console.error('FAILED: MongoDB connection failed:', error.message);
  }
};

const testOpenRouter = async () => {
  try {
    console.log('\nTesting OpenRouter API response...');
    const testHistory = [
      { role: 'user', content: 'Say "OpenRouter Integration is operational" in exactly five words.' }
    ];
    const text = await generateAIResponse(testHistory);
    console.log(`SUCCESS: OpenRouter responded. Output: "${text.trim()}"`);
  } catch (error) {
    console.error('FAILED: OpenRouter API integration failed:', error.message);
  }
};

const runAllTests = async () => {
  await testDB();
  await testOpenRouter();
  console.log('\n--- Test Execution Finished ---');
  process.exit(0);
};

runAllTests();
