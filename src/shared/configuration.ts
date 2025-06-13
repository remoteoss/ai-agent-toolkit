/**
 * Represents the shared context that can be passed to tools.
 * This can be expanded to include API keys, configurations, etc.
 */
export interface Context {
  apiKey?: string;
  allowedTools?: string[]; // Array of tool names to allow. If undefined, all tools are allowed.
  [key: string]: any;
}
