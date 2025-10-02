import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Vocabulary } from './interfaces/vocabulary.interface';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class VocabularyService {
  constructor(private databaseService: DatabaseService) {}

  async create(createVocabularyDto: CreateVocabularyDto): Promise<Vocabulary> {
    const db = this.databaseService.getDb();
    const now = new Date();
    
    const vocabulary: Vocabulary = {
      ...createVocabularyDto,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('vocabulary').insertOne(vocabulary);
    return { ...vocabulary, _id: result.insertedId };
  }

  async findAll(page: number = 1, limit: number = 20, difficulty?: string, topic?: string): Promise<{
    data: Vocabulary[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const db = this.databaseService.getDb();
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topics = { $in: [topic] };

    const [data, total] = await Promise.all([
      db.collection('vocabulary').find(filter).skip(skip).limit(limit).toArray(),
      db.collection('vocabulary').countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Vocabulary | null> {
    const db = this.databaseService.getDb();
    return await db.collection('vocabulary').findOne({ _id: new ObjectId(id) });
  }

  async findByWord(word: string): Promise<Vocabulary | null> {
    const db = this.databaseService.getDb();
    return await db.collection('vocabulary').findOne({ 
      word: { $regex: new RegExp(`^${word}$`, 'i') } 
    });
  }

  async search(query: string, page: number = 1, limit: number = 20): Promise<{
    data: Vocabulary[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const db = this.databaseService.getDb();
    const skip = (page - 1) * limit;
    
    const searchFilter = {
      $or: [
        { word: { $regex: query, $options: 'i' } },
        { definition: { $regex: query, $options: 'i' } },
        { synonyms: { $in: [new RegExp(query, 'i')] } },
      ]
    };

    const [data, total] = await Promise.all([
      db.collection('vocabulary').find(searchFilter).skip(skip).limit(limit).toArray(),
      db.collection('vocabulary').countDocuments(searchFilter),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTopics(): Promise<string[]> {
    const db = this.databaseService.getDb();
    const result = await db.collection('vocabulary').aggregate([
      { $unwind: '$topics' },
      { $group: { _id: '$topics' } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    return result.map(item => item._id);
  }

  async initializeSampleData(): Promise<void> {
    const db = this.databaseService.getDb();
    const count = await db.collection('vocabulary').countDocuments();
    
    if (count === 0) {
      const sampleVocabulary = this.getSampleVocabulary();
      await db.collection('vocabulary').insertMany(sampleVocabulary);
      console.log('Sample vocabulary data initialized');
    }
  }

  private getSampleVocabulary(): Vocabulary[] {
    const now = new Date();
    return [
      {
        word: "abundant",
        pronunciation: "/əˈbʌndənt/",
        partOfSpeech: "adjective",
        definition: "existing or available in large quantities; plentiful",
        example: "The region has abundant natural resources.",
        synonyms: ["plentiful", "copious", "ample", "profuse"],
        antonyms: ["scarce", "sparse", "limited"],
        collocations: [
          {
            phrase: "abundant resources",
            definition: "plentiful natural materials or assets",
            example: "The country is blessed with abundant natural resources."
          },
          {
            phrase: "abundant evidence",
            definition: "plenty of proof or information",
            example: "There is abundant evidence to support this theory."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "economics"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "accommodate",
        pronunciation: "/əˈkɒmədeɪt/",
        partOfSpeech: "verb",
        definition: "to provide lodging or sufficient space for; to adapt or adjust to",
        example: "The hotel can accommodate up to 200 guests.",
        synonyms: ["house", "lodge", "adapt", "adjust"],
        antonyms: ["reject", "refuse"],
        collocations: [
          {
            phrase: "accommodate guests",
            definition: "to provide space or facilities for visitors",
            example: "The resort can accommodate 500 guests comfortably."
          },
          {
            phrase: "accommodate needs",
            definition: "to meet or satisfy requirements",
            example: "We will try to accommodate your special dietary needs."
          }
        ],
        difficulty: "intermediate",
        topics: ["hospitality", "business"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "acquire",
        pronunciation: "/əˈkwaɪə/",
        partOfSpeech: "verb",
        definition: "to buy or obtain for oneself; to learn or develop",
        example: "She acquired fluency in three languages.",
        synonyms: ["obtain", "gain", "purchase", "attain"],
        antonyms: ["lose", "forfeit", "surrender"],
        collocations: [
          {
            phrase: "acquire knowledge",
            definition: "to gain information or understanding",
            example: "Students acquire knowledge through various learning methods."
          },
          {
            phrase: "acquire skills",
            definition: "to develop abilities or expertise",
            example: "It takes time to acquire advanced programming skills."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "business"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "advocate",
        pronunciation: "/ˈædvəkeɪt/",
        partOfSpeech: "verb/noun",
        definition: "to publicly recommend or support; a person who publicly supports a cause",
        example: "She advocates for environmental protection.",
        synonyms: ["support", "champion", "promote", "endorse"],
        antonyms: ["oppose", "discourage", "criticize"],
        collocations: [
          {
            phrase: "advocate for change",
            definition: "to actively support reform or improvement",
            example: "Many citizens advocate for change in the education system."
          },
          {
            phrase: "strong advocate",
            definition: "a passionate supporter of a cause",
            example: "She is a strong advocate for women's rights."
          }
        ],
        difficulty: "advanced",
        topics: ["politics", "social issues"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "analyze",
        pronunciation: "/ˈænəlaɪz/",
        partOfSpeech: "verb",
        definition: "to examine methodically and in detail",
        example: "Scientists analyze data to draw conclusions.",
        synonyms: ["examine", "study", "investigate", "scrutinize"],
        antonyms: ["ignore", "overlook"],
        collocations: [
          {
            phrase: "analyze data",
            definition: "to examine information systematically",
            example: "Researchers analyze data to identify patterns."
          },
          {
            phrase: "analyze results",
            definition: "to study outcomes or findings",
            example: "We need to analyze the results of the experiment."
          }
        ],
        difficulty: "intermediate",
        topics: ["science", "research", "academic"],
        createdAt: now,
        updatedAt: now,
      }
    ];
  }
}