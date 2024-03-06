export interface ChatReponse {
  id: string;
  object: string;
  created: number;
  choices: Array<ChoicesArray>;
  usage: Array<UsageResponse>;
}

export interface ChoicesArray {
  index: number;
  message: MessageResponse;
  finish_reason: string;
}

export interface MessageResponse {
  role: string;
  content: string;
  name?: string;
}

export interface UsageResponse {
  prompt_token: number;
  completion_tokens: number;
  total_tokens: number;
}
