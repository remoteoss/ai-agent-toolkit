import { z } from 'zod';
import type { Context } from './configuration';
import type { ApiClient } from '../client';

export interface Tool {
  method: string;
  name: string;
  description: string;
  parameters: z.AnyZodObject;
  execute: (
    apiClient: ApiClient,
    context: Context,
    params: z.infer<z.AnyZodObject>
  ) => Promise<any>;
  actions?: Record<string, Record<string, boolean>>;
}

export type ToolFactory = (context: Context) => Tool;
export type ToolListFactory = (context: Context) => Tool[]; 