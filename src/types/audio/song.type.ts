export interface SongGenerateRequest {
  email: string;
  select: string;
  lyric?: string;
  emotion?: string;
}

export interface SongResponse {
  type: string;
  time: Date;
  data: Array<SongData>;
}

export interface SongData {
  FileData: {
    path: string;
    url: string;
  };
}

export interface LyricResponse {
  type: string;
  time: Date;
  data: Array<string>;
  endpoint: string;
  fn_index: number;
}

export type SongEmotions = '행복' | '슬픔' | '기쁨' | '도전' | '희망';

export type SongSelections =
  | 'Deck the Halls by Cecilia'
  | 'Move your Body by Cecilia'
  | 'Dark Trap by Jerry'
  | 'Happy Birthday by Jerry'
  | 'Levitate by Ed';
