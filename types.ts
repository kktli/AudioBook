
export interface TextSegment {
  id: number;
  startTime: number; // in seconds
  text: string;
}

export interface ChapterData {
  title: string;
  subtitle: string;
  content: TextSegment[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
