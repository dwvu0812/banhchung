export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Vocabulary {
  _id: string;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  collocations: Collocation[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collocation {
  phrase: string;
  definition: string;
  example: string;
}

export interface UserProgress {
  _id: string;
  userId: string;
  vocabularyId: string;
  level: number;
  nextReviewDate: string;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  vocabulary: Vocabulary;
  level?: number;
  nextReviewDate?: string;
  correctCount?: number;
  incorrectCount?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}