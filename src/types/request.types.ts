// export type DefaultCtx = GenerateImage;

// export interface GenerateImage extends Context {
//   clientid: string;
// }

export interface ResponseBody {
  resCode: string;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

export interface KeyableObject {
  [key: string]: unknown;
}

export interface ImageRequestTypes {
  email: string;
  prompt: string;
  number: string;
  size?: SizeTypes;
  responseFormat?: Formats;
  user?: string;
}

export interface TranslateRequestTypes {
  file: string;
  targetLanguage: string;
  prompt?: string;
  temperature?: number;
  response_format?: string;
}
export interface RequestValidateType {
  prompt: string;
  number: string;
  size: SizeTypes;
  responseFormat?: Formats;
  user?: string;
}

export interface ChatRequest {
  email: string;
  model: string;
  content: string;
  role: string;
  name?: string;
  temperature?: number;
  topP?: number;
  number: string;
  stream?: boolean;
  stop?: string | Array<string>;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  user?: string;
}

export interface ImageEditRequest {
  image: unknown;
  prompt: string;
  number: string;
  size: string;
}

export type SizeTypes = '256x256' | '512x512' | '1024x1024';

export type Formats = 'url' | 'b64_json';
