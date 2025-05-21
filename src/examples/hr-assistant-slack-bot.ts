import * as dotenv from 'dotenv';
dotenv.config();

import { App, SlackEventMiddlewareArgs, AllMiddlewareArgs, SayFn } from '@slack/bolt';
import { RemoteApiAgentToolkit } from '../langchain/toolkit';
import { AgentExecutor, createStructuredChatAgent, AgentStep } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { type ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ConversationSummaryBufferMemory } from "langchain/memory";

const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const remoteApiKey = process.env.REMOTE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!slackBotToken || !slackSigningSecret || !remoteApiKey || !openaiApiKey) {
  throw new Error(
    'Missing required environment variables: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, REMOTE_API_KEY, OPENAI_API_KEY'
  );
}

const slackApp = new App({
  token: slackBotToken,
  signingSecret: slackSigningSecret,
});

const remoteToolkit = new RemoteApiAgentToolkit({
  apiKey: remoteApiKey,
  apiBaseUrl: 'https://gateway.remote-sandbox.com/v1',
});
const tools = remoteToolkit.getTools();

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0,
  apiKey: openaiApiKey,
});

const conversationHistories: Record<string, ChatMessageHistory> = {};

async function initializeAgentExecutor(userId: string) {
  const prompt = await pull<ChatPromptTemplate>('hwchase17/structured-chat-agent');

  // Get or create chat history for the user
  const history = conversationHistories[userId] || new ChatMessageHistory();
  conversationHistories[userId] = history; // Ensure it's stored if new

  const memory = new ConversationSummaryBufferMemory({
    llm: llm,
    chatHistory: history,
    maxTokenLimit: 1500,
    memoryKey: "chat_history",
    returnMessages: true,
    outputKey: "output",
  });

  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt,
  });
  
  return new AgentExecutor({ 
    agent, 
    tools, 
    memory,
    verbose: true,
    handleParsingErrors: true
  });
}

async function handleUserMessage(
  messageText: string | undefined,
  userId: string,
  say: SayFn,
  botUserId?: string
) {
  const userMessage = messageText || '';
  console.log(`Processing message from User ${userId}: ${userMessage}`);
  try {
    let userProcessedText = userMessage;
    if (botUserId) {
      const mentionRegex = new RegExp(`^<@${botUserId}>\s*`);
      userProcessedText = userMessage.replace(mentionRegex, '').trim();
    }

    if (!userProcessedText) {
      await say("Hello! How can I help you today?");
      return;
    }

    const executor = await initializeAgentExecutor(userId);
    const agentInput = 
      `TASK: You are a helpful HR assistant. You have access to a list of tools to help the user with their requests. ` +
      `Today is ${new Date().toLocaleDateString()}. ` +
      `Please format your responses using Slack's mrkdwn syntax (e.g., *bold*, _italic_, ~strike~, \\\`code\\\`, \\\`\`\`preformatted block\\\`\`\`, <url|text>). ` +
      `The user's latest message is: "${userProcessedText}"`;
    
    const result = await executor.invoke({ input: agentInput });
    await say(result.output as string);

  } catch (error) {
    console.error(`Error handling message from User ${userId}:`, error);
    await say('Sorry, I encountered an error trying to process your request.');
  }
}

async function main() {
  slackApp.event('app_mention', async ({ event, say, context }: SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs) => {
    await handleUserMessage(event.text, event.user || '', say, context.botUserId);
  });

  slackApp.message(async ({ message, say }: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) => {
    if (message.channel_type === 'im' && !message.subtype && message.user) {
      await handleUserMessage(message.text, message.user, say);
    }
  });

  const port = Number(process.env.PORT) || 3000;
  await slackApp.start(port);
  console.log(`⚡️ Conversational HR Assistant is running on port ${port}!`);
}

main().catch(console.error);