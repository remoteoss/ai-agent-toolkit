import { RemoteApiAgentToolkit } from '../langchain/toolkit';
import { ChatOpenAI } from '@langchain/openai';
import type { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';

// Load environment variables from .env file if present
import * as dotenv from 'dotenv';
dotenv.config();

// This script demonstrates testing the listTimeOff tool as part of a LangChain agent.

async function main() {
  console.log('Testing ListTimeOffTool with LangChain Agent...');

  // 1. Instantiate the LLM
  // Ensure your OPENAI_API_KEY environment variable is set.
  const llm = new ChatOpenAI({
    model: 'gpt-4o', // Or your preferred model
    temperature: 0,
  });

  // 2. Instantiate the Remote API Agent Toolkit
  // Ensure your REMOTE_API_KEY environment variable is set.
  const remoteApiKey = process.env.REMOTE_API_KEY;
  if (!remoteApiKey) {
    console.error(
      'Error: REMOTE_API_KEY environment variable is not set. Please set it to your Remote API key.'
    );
    process.exit(1);
  }
  const remoteApiToolkit = new RemoteApiAgentToolkit({ apiKey: remoteApiKey });

  // 3. Get tools from the toolkit
  const tools = remoteApiToolkit.getTools();
  console.log('Tools available to the agent:', tools.map(t => t.name));

  if (tools.length === 0) {
    console.error('No tools found in the toolkit. Ensure tools are correctly defined and loaded.');
    process.exit(1);
  }

  // 4. Pull a standard agent prompt
  // Using 'hwchase17/structured-chat-agent' which is suitable for structured tools.
  const prompt = await pull<ChatPromptTemplate>(
    'hwchase17/structured-chat-agent'
  );

  // 5. Create the agent
  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt,
  });

  // 6. Create the Agent Executor
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true, // Set to true for detailed logging of agent steps
  });

  // 7. Define the input for the agent
  // This prompt should ideally trigger the 'List Time Off' tool.
  const input = 'Does anyone have PTO in the next 30 days?';
  
  console.log(`\nInvoking agent with input: "${input}"`);

  try {
    // 8. Invoke the agent
    const response = await agentExecutor.invoke({
      input: input,
    });

    console.log('\nAgent execution successful. Response:');
    console.log(JSON.stringify(response, null, 2));

  } catch (error) {
    console.error('\nError during agent execution:');
    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error(String(error));
    }
  }
}

main().catch((error) => {
  console.error('Unhandled error in main function:', error);
}); 