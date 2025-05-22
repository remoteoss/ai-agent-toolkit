import * as dotenv from "dotenv";
dotenv.config();

import {
  App,
  SlackEventMiddlewareArgs,
  AllMiddlewareArgs,
  SayFn,
} from "@slack/bolt";
import { RemoteApiAgentToolkit } from "../langchain/toolkit";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { type ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ConversationSummaryBufferMemory } from "langchain/memory";

const slackBotToken = process.env.SLACK_BOT_TOKEN;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const remoteApiKey = process.env.REMOTE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!slackBotToken || !slackSigningSecret || !remoteApiKey || !openaiApiKey) {
  throw new Error(
    "Missing required environment variables: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, REMOTE_API_KEY, OPENAI_API_KEY",
  );
}

const slackApp = new App({
  token: slackBotToken,
  signingSecret: slackSigningSecret,
});

const remoteToolkit = new RemoteApiAgentToolkit({
  apiKey: remoteApiKey,
  apiBaseUrl: "https://gateway.remote-sandbox.com/v1",
});
const tools = remoteToolkit.getTools();

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
  apiKey: openaiApiKey,
});

const conversationHistories: Record<string, ChatMessageHistory> = {};

async function initializeAgentExecutor(userId: string) {
  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/structured-chat-agent",
  );

  const history = conversationHistories[userId] || new ChatMessageHistory();
  conversationHistories[userId] = history;

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
    handleParsingErrors: true,
  });
}

async function handleUserMessage(
  messageText: string | undefined,
  userId: string,
  say: SayFn,
  channelId: string,
  originalThreadTs: string,
) {
  const userMessage = messageText || "";
  console.log(`Processing message from User ${userId}: ${userMessage}`);
  try {
    let userProcessedText = userMessage;

    if (originalThreadTs) {
      await slackApp.client.assistant.threads.setStatus({
        thread_ts: originalThreadTs,
        channel_id: channelId,
        status: "HR Assistant is thinking...",
      });
    }

    if (!userProcessedText) {
      await say("Hello! How can I help you today?");
      return;
    }

    const executor = await initializeAgentExecutor(userId);
    const agentInput =
      `TASK: You are a helpful HR assistant. You have access to a list of tools to help the user with their requests. 
      **Resources that may require attention from the user are listTimeOff, listTimesheets, listExpense**
      When replying to a user, always explain what actions the user can take to resolve the issue. E.g., ask the user if they want to approve or reject a pending time off, expense or timesheet. 
      When returning employment related resources, avoid showing the UUID but use the employee name instead` +
      `Today is ${new Date().toLocaleDateString()}. ` +
      `REMEMBER YOU **MUST** format your responses using Slack's mrkdwn syntax (e.g., *bold*, _italic_, ~strike~).  ` +
      `The user's latest message is: "${userProcessedText}"`;

    const result = await executor.invoke({ input: agentInput });
    await say({ text: result.output as string, thread_ts: originalThreadTs });
  } catch (error) {
    console.error(`Error handling message from User ${userId}:`, error);
    await say("Sorry, I encountered an error trying to process your request.");
  }
}

async function main() {
  slackApp.message(
    async ({
      message,
      say,
    }: SlackEventMiddlewareArgs<"message"> & AllMiddlewareArgs) => {
      if (message.channel_type === "im" && !message.subtype && message.user) {
        await handleUserMessage(
          message.text,
          message.user,
          say,
          message.channel,
          message.thread_ts || "",
        );
      }
    },
  );

  const port = Number(process.env.PORT) || 3000;
  await slackApp.start(port);
  console.log(`⚡️ Conversational HR Assistant is running on port ${port}!`);
}

main().catch(console.error);
