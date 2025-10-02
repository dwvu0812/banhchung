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
    return await db.collection('users').findOne({ email }) as User | null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const db = this.databaseService.getDb();
    return await db.collection('users').findOne({ googleId }) as User | null;
  }

  async findById(id: string): Promise<User | null> {
    const db = this.databaseService.getDb();
    return await db.collection('users').findOne({ _id: new ObjectId(id) }) as User | null;
  }

  async updateProgress(userId: string, vocabularyId: string, correct: boolean): Promise<UserProgress> {
    const db = this.databaseService.getDb();
    const now = new Date();
    
    const existingProgress = await db.collection('userProgress').findOne({
      userId: new ObjectId(userId),
      vocabularyId: new ObjectId(vocabularyId),
    });

    if (existingProgress) {
      const newLevel = correct 
        ? Math.min(existingProgress.level + 1, 5)
        : Math.max(existingProgress.level - 1, 0);
      
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

      return { ...existingProgress, ...updateData } as UserProgress;
    } else {
      const newProgress: UserProgress = {
        userId: new ObjectId(userId),
        vocabularyId: new ObjectId(vocabularyId),
        level: correct ? 1 : 0,
        nextReviewDate: this.calculateNextReviewDate(correct ? 1 : 0),
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
      .toArray() as UserProgress[];
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
    const intervals = [1, 3, 7, 14, 30, 90]; // days
    const days = intervals[level] || 90;
    
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }
}