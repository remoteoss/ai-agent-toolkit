// import { RemoteApiAgentToolkit } from '@remoteoss/ai-agent-toolkit/langchain';
import { RemoteApiAgentToolkit } from '../../src/langchain';
import { ChatOpenAI } from '@langchain/openai';
import type { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';

async function main() {
  const llm = new ChatOpenAI({
    model: 'gpt-4o', // Or your preferred model
    temperature: 0,
  });

  const remoteApiToolkit = new RemoteApiAgentToolkit({
    apiKey: process.env.REMOTE_API_KEY ?? '',
    apiBaseUrl: 'https://gateway.remote-sandbox.com/v1',
  });

  const tools = remoteApiToolkit.getTools();
  const prompt = await pull<ChatPromptTemplate>(
    'hwchase17/structured-chat-agent',
  );

  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const input = 'Can you list all open time off requests?';
  const response = await agentExecutor.invoke({
    input: input,
  });

  console.log(JSON.stringify(response, null, 2));
}

main().catch(console.error);
