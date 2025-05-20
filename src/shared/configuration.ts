/**
 * Represents the shared context that can be passed to tools.
 * This can be expanded to include API keys, configurations, etc.
 */
export interface Context {
  apiKey?: string; 
  [key: string]: any; 
}