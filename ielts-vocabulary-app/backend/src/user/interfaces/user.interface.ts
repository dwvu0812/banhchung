import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  googleId?: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProgress {
  _id?: ObjectId;
  userId: ObjectId;
  vocabularyId: ObjectId;
  level: number; // Spaced repetition level (0-5)
  nextReviewDate: Date;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}