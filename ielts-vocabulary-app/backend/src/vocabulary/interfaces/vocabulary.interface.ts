import { ObjectId } from 'mongodb';

export interface Vocabulary {
  _id?: ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Collocation {
  phrase: string;
  definition: string;
  example: string;
}