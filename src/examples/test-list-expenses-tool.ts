import { RemoteApiAgentToolkit } from "../langchain/toolkit";
import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Testing ListExpensesTool with LangChain Agent...");

  const llm = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });

  const remoteApiKey = process.env.REMOTE_API_KEY;
  if (!remoteApiKey) {
    console.error(
      "Error: REMOTE_API_KEY environment variable is not set. Please set it to your Remote API key.",
    );
    process.exit(1);
  }
  const remoteApiToolkit = new RemoteApiAgentToolkit({ apiKey: remoteApiKey });
  const tools = remoteApiToolkit.getTools();
  console.log(
    "Tools available to the agent:",
    tools.map(t => t.name),
  );

  if (tools.length === 0) {
    console.error(
      "No tools found in the toolkit. Ensure tools are correctly defined and loaded.",
    );
    process.exit(1);
  }

  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/structured-chat-agent",
  );
  const agent = await createStructuredChatAgent({ llm, tools, prompt });
  const agentExecutor = new AgentExecutor({ agent, tools, verbose: true });

  const input = "Show me the last 5 expenses.";
  console.log(`\nInvoking agent with input: "${input}"`);

  try {
    const response = await agentExecutor.invoke({ input });
    console.log("\nAgent execution successful. Response:");
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("\nError during agent execution:");
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

main().catch(error => {
  console.error("Unhandled error in main function:", error);
});
