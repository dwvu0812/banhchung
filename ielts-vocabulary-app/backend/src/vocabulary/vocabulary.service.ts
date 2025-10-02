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
      // Academic & Education
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
      },
      // Technology & Innovation
      {
        word: "breakthrough",
        pronunciation: "/ˈbreɪkθruː/",
        partOfSpeech: "noun",
        definition: "a sudden, dramatic, and important discovery or development",
        example: "The new vaccine represents a major breakthrough in medicine.",
        synonyms: ["discovery", "advancement", "innovation", "progress"],
        antonyms: ["setback", "regression", "failure"],
        collocations: [
          {
            phrase: "scientific breakthrough",
            definition: "an important discovery in science",
            example: "The scientific breakthrough could revolutionize cancer treatment."
          },
          {
            phrase: "technological breakthrough",
            definition: "a significant advance in technology",
            example: "The technological breakthrough made smartphones possible."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "science", "innovation"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "contemporary",
        pronunciation: "/kənˈtempərəri/",
        partOfSpeech: "adjective",
        definition: "belonging to or occurring in the present time; modern",
        example: "Contemporary art often challenges traditional concepts.",
        synonyms: ["modern", "current", "present-day", "up-to-date"],
        antonyms: ["ancient", "outdated", "old-fashioned"],
        collocations: [
          {
            phrase: "contemporary society",
            definition: "modern society and its characteristics",
            example: "Social media plays a crucial role in contemporary society."
          },
          {
            phrase: "contemporary issues",
            definition: "current problems or topics of discussion",
            example: "Climate change is one of the most pressing contemporary issues."
          }
        ],
        difficulty: "intermediate",
        topics: ["society", "culture", "art"],
        createdAt: now,
        updatedAt: now,
      },
      // Environment & Sustainability
      {
        word: "deteriorate",
        pronunciation: "/dɪˈtɪəriəreɪt/",
        partOfSpeech: "verb",
        definition: "to become progressively worse",
        example: "The patient's condition began to deteriorate rapidly.",
        synonyms: ["worsen", "decline", "degrade", "decay"],
        antonyms: ["improve", "enhance", "recover"],
        collocations: [
          {
            phrase: "deteriorate rapidly",
            definition: "to get worse very quickly",
            example: "The building's condition deteriorated rapidly after the flood."
          },
          {
            phrase: "health deteriorates",
            definition: "physical condition becomes worse",
            example: "His health deteriorated due to poor lifestyle choices."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "environment", "general"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "sustainable",
        pronunciation: "/səˈsteɪnəbəl/",
        partOfSpeech: "adjective",
        definition: "able to be maintained at a certain rate or level; not harmful to the environment",
        example: "We need to find sustainable solutions to energy problems.",
        synonyms: ["maintainable", "viable", "renewable", "eco-friendly"],
        antonyms: ["unsustainable", "harmful", "depleting"],
        collocations: [
          {
            phrase: "sustainable development",
            definition: "development that meets present needs without compromising future generations",
            example: "Sustainable development is crucial for our planet's future."
          },
          {
            phrase: "sustainable energy",
            definition: "renewable energy sources that don't harm the environment",
            example: "Solar power is a form of sustainable energy."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "economics", "energy"],
        createdAt: now,
        updatedAt: now,
      },
      // Business & Economics
      {
        word: "entrepreneur",
        pronunciation: "/ˌɒntrəprəˈnɜː/",
        partOfSpeech: "noun",
        definition: "a person who organizes and operates a business, taking on financial risks",
        example: "The young entrepreneur started her company with just $1000.",
        synonyms: ["businessperson", "innovator", "founder", "venture capitalist"],
        antonyms: ["employee", "worker"],
        collocations: [
          {
            phrase: "successful entrepreneur",
            definition: "a businessperson who has achieved significant success",
            example: "She became a successful entrepreneur by age 30."
          },
          {
            phrase: "social entrepreneur",
            definition: "someone who uses business methods to solve social problems",
            example: "As a social entrepreneur, he focuses on education in rural areas."
          }
        ],
        difficulty: "intermediate",
        topics: ["business", "economics", "innovation"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "fluctuate",
        pronunciation: "/ˈflʌktʃueɪt/",
        partOfSpeech: "verb",
        definition: "to rise and fall irregularly in number or amount",
        example: "Stock prices fluctuate throughout the trading day.",
        synonyms: ["vary", "oscillate", "change", "shift"],
        antonyms: ["stabilize", "remain constant"],
        collocations: [
          {
            phrase: "prices fluctuate",
            definition: "costs go up and down irregularly",
            example: "Oil prices fluctuate based on global demand."
          },
          {
            phrase: "fluctuate wildly",
            definition: "to change dramatically and unpredictably",
            example: "The currency's value fluctuated wildly during the crisis."
          }
        ],
        difficulty: "intermediate",
        topics: ["economics", "business", "finance"],
        createdAt: now,
        updatedAt: now,
      },
      // Social Issues & Culture
      {
        word: "diversity",
        pronunciation: "/daɪˈvɜːsəti/",
        partOfSpeech: "noun",
        definition: "the state of being diverse; variety",
        example: "The company values diversity in its workforce.",
        synonyms: ["variety", "multiculturalism", "heterogeneity", "difference"],
        antonyms: ["uniformity", "homogeneity", "similarity"],
        collocations: [
          {
            phrase: "cultural diversity",
            definition: "variety of different cultures in a society",
            example: "Cultural diversity enriches our community."
          },
          {
            phrase: "promote diversity",
            definition: "to encourage variety and inclusion",
            example: "The university actively promotes diversity among students."
          }
        ],
        difficulty: "intermediate",
        topics: ["society", "culture", "workplace"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "inequality",
        pronunciation: "/ˌɪnɪˈkwɒləti/",
        partOfSpeech: "noun",
        definition: "difference in size, degree, circumstances, especially lack of equality",
        example: "Income inequality has increased in many countries.",
        synonyms: ["disparity", "imbalance", "unfairness", "discrimination"],
        antonyms: ["equality", "fairness", "balance"],
        collocations: [
          {
            phrase: "social inequality",
            definition: "unequal distribution of opportunities and resources in society",
            example: "Education can help reduce social inequality."
          },
          {
            phrase: "income inequality",
            definition: "uneven distribution of income across a population",
            example: "Income inequality is a major political issue."
          }
        ],
        difficulty: "intermediate",
        topics: ["society", "politics", "economics"],
        createdAt: now,
        updatedAt: now,
      },
      // Health & Lifestyle
      {
        word: "obesity",
        pronunciation: "/əʊˈbiːsəti/",
        partOfSpeech: "noun",
        definition: "the condition of being grossly fat or overweight",
        example: "Childhood obesity has become a serious health concern.",
        synonyms: ["overweight", "corpulence"],
        antonyms: ["thinness", "underweight"],
        collocations: [
          {
            phrase: "childhood obesity",
            definition: "excessive weight in children",
            example: "Schools are implementing programs to combat childhood obesity."
          },
          {
            phrase: "obesity epidemic",
            definition: "widespread occurrence of obesity in a population",
            example: "The obesity epidemic affects millions worldwide."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "lifestyle", "society"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "sedentary",
        pronunciation: "/ˈsedəntəri/",
        partOfSpeech: "adjective",
        definition: "requiring much sitting and little physical exercise",
        example: "Many office jobs involve sedentary work.",
        synonyms: ["inactive", "stationary", "sitting"],
        antonyms: ["active", "mobile", "dynamic"],
        collocations: [
          {
            phrase: "sedentary lifestyle",
            definition: "a way of living with little physical activity",
            example: "A sedentary lifestyle can lead to health problems."
          },
          {
            phrase: "sedentary work",
            definition: "jobs that involve mostly sitting",
            example: "Computer programming is typically sedentary work."
          }
        ],
        difficulty: "advanced",
        topics: ["health", "lifestyle", "work"],
        createdAt: now,
        updatedAt: now,
      },
      // Advanced Academic Vocabulary
      {
        word: "phenomenon",
        pronunciation: "/fəˈnɒmɪnən/",
        partOfSpeech: "noun",
        definition: "a fact or situation that is observed to exist or happen",
        example: "Global warming is a complex phenomenon.",
        synonyms: ["occurrence", "event", "manifestation", "happening"],
        antonyms: [],
        collocations: [
          {
            phrase: "natural phenomenon",
            definition: "an event occurring in nature",
            example: "Earthquakes are a natural phenomenon."
          },
          {
            phrase: "social phenomenon",
            definition: "an observable pattern in society",
            example: "Social media addiction is a modern phenomenon."
          }
        ],
        difficulty: "advanced",
        topics: ["science", "academic", "general"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "hypothesis",
        pronunciation: "/haɪˈpɒθəsɪs/",
        partOfSpeech: "noun",
        definition: "a supposition or proposed explanation made on the basis of limited evidence",
        example: "The scientist tested her hypothesis through experiments.",
        synonyms: ["theory", "assumption", "proposition", "conjecture"],
        antonyms: ["fact", "certainty", "proof"],
        collocations: [
          {
            phrase: "test a hypothesis",
            definition: "to examine whether a theory is correct",
            example: "Researchers need to test their hypothesis with data."
          },
          {
            phrase: "working hypothesis",
            definition: "a tentative theory used as a starting point",
            example: "We'll use this as our working hypothesis for now."
          }
        ],
        difficulty: "advanced",
        topics: ["science", "research", "academic"],
        createdAt: now,
        updatedAt: now,
      }
    ];
  }
}