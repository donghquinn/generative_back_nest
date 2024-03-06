export interface ChatSchema {
  model: string;
  content: string;
  role: string;
  name?: string;
  temperature?: number;
  topP?: number;
  number?: number;
  stream?: boolean;
  stop?: string | Array<string>;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  user?: string;
  response?: string;
  created: string;
}

export interface ImageSchema {
  prompt: string;
  number: string;
  size: string;
  img: string;
  created: string;
}
