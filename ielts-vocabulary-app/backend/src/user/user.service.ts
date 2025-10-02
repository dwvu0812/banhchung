import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, UserProgress } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const db = this.databaseService.getDb();
    const now = new Date();
    
    const user: User = {
      ...createUserDto,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.databaseService.getDb();
    return await db.collection('users').findOne({ email });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const db = this.databaseService.getDb();
    return await db.collection('users').findOne({ googleId });
  }

  async findById(id: string): Promise<User | null> {
    const db = this.databaseService.getDb();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  async updateProgress(userId: string, vocabularyId: string, correct: boolean): Promise<UserProgress> {
    const db = this.databaseService.getDb();
    const now = new Date();
    
    const existingProgress = await db.collection('userProgress').findOne({
      userId: new ObjectId(userId),
      vocabularyId: new ObjectId(vocabularyId),
    });

    if (existingProgress) {
      // Improved level calculation
      let newLevel: number;
      if (correct) {
        // Increase level, but cap at 6 (mastered)
        newLevel = Math.min(existingProgress.level + 1, 6);
      } else {
        // Decrease level more aggressively for better retention
        if (existingProgress.level <= 1) {
          newLevel = 0; // Reset to beginning if struggling with early levels
        } else {
          newLevel = Math.max(existingProgress.level - 2, 0); // Drop by 2 levels
        }
      }
      
      const nextReviewDate = this.calculateNextReviewDate(newLevel);
      
      const updateData = {
        level: newLevel,
        nextReviewDate,
        correctCount: correct ? existingProgress.correctCount + 1 : existingProgress.correctCount,
        incorrectCount: correct ? existingProgress.incorrectCount : existingProgress.incorrectCount + 1,
        lastReviewedAt: now,
        updatedAt: now,
      };

      await db.collection('userProgress').updateOne(
        { _id: existingProgress._id },
        { $set: updateData }
      );

      return { ...existingProgress, ...updateData };
    } else {
      // First time seeing this word
      const initialLevel = correct ? 1 : 0;
      const newProgress: UserProgress = {
        userId: new ObjectId(userId),
        vocabularyId: new ObjectId(vocabularyId),
        level: initialLevel,
        nextReviewDate: this.calculateNextReviewDate(initialLevel),
        correctCount: correct ? 1 : 0,
        incorrectCount: correct ? 0 : 1,
        lastReviewedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection('userProgress').insertOne(newProgress);
      return { ...newProgress, _id: result.insertedId };
    }
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const db = this.databaseService.getDb();
    return await db.collection('userProgress')
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  async getDueVocabulary(userId: string): Promise<any[]> {
    const db = this.databaseService.getDb();
    const now = new Date();
    
    // Get vocabulary that needs review
    const dueProgress = await db.collection('userProgress').aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          nextReviewDate: { $lte: now }
        }
      },
      {
        $lookup: {
          from: 'vocabulary',
          localField: 'vocabularyId',
          foreignField: '_id',
          as: 'vocabulary'
        }
      },
      {
        $unwind: '$vocabulary'
      },
      {
        $limit: 20 // Limit to 20 words per session
      }
    ]).toArray();

    // If no due vocabulary, get new vocabulary
    if (dueProgress.length === 0) {
      const learnedVocabIds = await db.collection('userProgress')
        .find({ userId: new ObjectId(userId) })
        .project({ vocabularyId: 1 })
        .toArray();
      
      const learnedIds = learnedVocabIds.map(p => p.vocabularyId);
      
      const newVocabulary = await db.collection('vocabulary')
        .find({ _id: { $nin: learnedIds } })
        .limit(10)
        .toArray();
      
      return newVocabulary.map(vocab => ({
        vocabulary: vocab,
        level: 0,
        nextReviewDate: now,
        correctCount: 0,
        incorrectCount: 0
      }));
    }

    return dueProgress;
  }

  private calculateNextReviewDate(level: number): Date {
    const now = new Date();
    // Improved spaced repetition intervals based on research
    // Level 0: 10 minutes (for immediate review of failed words)
    // Level 1: 1 day
    // Level 2: 3 days  
    // Level 3: 1 week
    // Level 4: 2 weeks
    // Level 5: 1 month
    // Level 6: 3 months (mastered)
    const intervals = [
      10 / (24 * 60), // 10 minutes in days
      1,              // 1 day
      3,              // 3 days
      7,              // 1 week
      14,             // 2 weeks
      30,             // 1 month
      90              // 3 months
    ];
    
    const days = intervals[Math.min(level, intervals.length - 1)] || 90;
    
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }
}