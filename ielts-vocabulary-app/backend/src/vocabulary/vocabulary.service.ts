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
      synonyms: createVocabularyDto.synonyms || [],
      antonyms: createVocabularyDto.antonyms || [],
      collocations: createVocabularyDto.collocations || [],
      topics: createVocabularyDto.topics || [],
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
      data: data as Vocabulary[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Vocabulary | null> {
    const db = this.databaseService.getDb();
    return await db.collection('vocabulary').findOne({ _id: new ObjectId(id) }) as Vocabulary | null;
  }

  async findByWord(word: string): Promise<Vocabulary | null> {
    const db = this.databaseService.getDb();
    return await db.collection('vocabulary').findOne({ 
      word: { $regex: new RegExp(`^${word}$`, 'i') } 
    }) as Vocabulary | null;
  }

  async search(
    query: string,
    page: number = 1,
    limit: number = 20,
    difficulty?: string,
    topic?: string,
  ): Promise<{
    data: Vocabulary[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const db = this.databaseService.getDb();
    const skip = (page - 1) * limit;

    const filters: any[] = [];

    if (query) {
      filters.push({
        $or: [
          { word: { $regex: query, $options: 'i' } },
          { definition: { $regex: query, $options: 'i' } },
          { synonyms: { $in: [new RegExp(query, 'i')] } },
        ],
      });
    }

    if (difficulty) {
      filters.push({ difficulty });
    }

    if (topic) {
      filters.push({ topics: { $in: [topic] } });
    }

    const searchFilter = filters.length === 0
      ? {}
      : filters.length === 1
        ? filters[0]
        : { $and: filters };

    const [data, total] = await Promise.all([
      db.collection('vocabulary').find(searchFilter).skip(skip).limit(limit).toArray(),
      db.collection('vocabulary').countDocuments(searchFilter),
    ]);

    return {
      data: data as Vocabulary[],
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
      // Academic Word List - Essential for IELTS Band 6.5
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
          },
          {
            phrase: "abundant supply",
            definition: "a large amount available",
            example: "There is an abundant supply of fresh water in this region."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "economics", "ielts-writing"],
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
          },
          {
            phrase: "accommodate changes",
            definition: "to adapt to modifications",
            example: "The system can accommodate changes in user requirements."
          }
        ],
        difficulty: "intermediate",
        topics: ["hospitality", "business", "ielts-speaking"],
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
          },
          {
            phrase: "acquire experience",
            definition: "to gain practical knowledge",
            example: "Young professionals need to acquire experience in their field."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "business", "ielts-writing"],
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
          },
          {
            phrase: "advocate policies",
            definition: "to support specific courses of action",
            example: "The organization advocates policies that protect the environment."
          }
        ],
        difficulty: "advanced",
        topics: ["politics", "social issues", "ielts-writing"],
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
          },
          {
            phrase: "analyze trends",
            definition: "to examine patterns over time",
            example: "Economists analyze trends in the housing market."
          }
        ],
        difficulty: "intermediate",
        topics: ["science", "research", "academic", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      // Environment & Climate Change - Common IELTS Topic
      {
        word: "sustainable",
        pronunciation: "/səˈsteɪnəbəl/",
        partOfSpeech: "adjective",
        definition: "able to be maintained at a certain rate or level; environmentally responsible",
        example: "We need to develop sustainable energy sources.",
        synonyms: ["renewable", "viable", "maintainable", "eco-friendly"],
        antonyms: ["unsustainable", "wasteful", "depleting"],
        collocations: [
          {
            phrase: "sustainable development",
            definition: "growth that meets present needs without compromising future generations",
            example: "The UN promotes sustainable development goals worldwide."
          },
          {
            phrase: "sustainable energy",
            definition: "renewable energy sources that don't deplete natural resources",
            example: "Solar and wind power are examples of sustainable energy."
          },
          {
            phrase: "sustainable practices",
            definition: "methods that can be continued long-term without harm",
            example: "Companies are adopting sustainable practices to reduce their carbon footprint."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "climate change", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "emissions",
        pronunciation: "/ɪˈmɪʃənz/",
        partOfSpeech: "noun",
        definition: "the production and discharge of something, especially gas or radiation",
        example: "Carbon emissions from vehicles contribute to air pollution.",
        synonyms: ["discharge", "release", "output", "pollution"],
        antonyms: ["absorption", "intake"],
        collocations: [
          {
            phrase: "carbon emissions",
            definition: "carbon dioxide released into the atmosphere",
            example: "Reducing carbon emissions is crucial for fighting climate change."
          },
          {
            phrase: "greenhouse gas emissions",
            definition: "gases that trap heat in the atmosphere",
            example: "Countries are working to cut greenhouse gas emissions by 50%."
          },
          {
            phrase: "reduce emissions",
            definition: "to decrease the amount of pollutants released",
            example: "Electric cars help reduce emissions in urban areas."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "climate change", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      // Technology - Common IELTS Topic
      {
        word: "innovation",
        pronunciation: "/ˌɪnəˈveɪʃən/",
        partOfSpeech: "noun",
        definition: "the action or process of innovating; a new method, idea, or product",
        example: "Technological innovation has transformed modern communication.",
        synonyms: ["invention", "advancement", "breakthrough", "novelty"],
        antonyms: ["tradition", "convention", "stagnation"],
        collocations: [
          {
            phrase: "technological innovation",
            definition: "new developments in technology",
            example: "Technological innovation drives economic growth in many countries."
          },
          {
            phrase: "foster innovation",
            definition: "to encourage new ideas and creativity",
            example: "Universities foster innovation through research programs."
          },
          {
            phrase: "innovation hub",
            definition: "a center where new ideas and technologies are developed",
            example: "Silicon Valley is known as a global innovation hub."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "business", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "digital",
        pronunciation: "/ˈdɪdʒɪtəl/",
        partOfSpeech: "adjective",
        definition: "relating to or using computer technology",
        example: "The digital revolution has changed how we work and communicate.",
        synonyms: ["electronic", "computerized", "online", "virtual"],
        antonyms: ["analog", "physical", "traditional"],
        collocations: [
          {
            phrase: "digital transformation",
            definition: "the integration of digital technology into all areas of business",
            example: "Many companies are undergoing digital transformation to stay competitive."
          },
          {
            phrase: "digital divide",
            definition: "the gap between those who have access to technology and those who don't",
            example: "The digital divide affects educational opportunities in rural areas."
          },
          {
            phrase: "digital literacy",
            definition: "the ability to use digital technology effectively",
            example: "Digital literacy is essential for success in the modern workplace."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "education", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      // Education - Common IELTS Topic
      {
        word: "curriculum",
        pronunciation: "/kəˈrɪkjʊləm/",
        partOfSpeech: "noun",
        definition: "the subjects comprising a course of study in a school or college",
        example: "The new curriculum includes more emphasis on critical thinking skills.",
        synonyms: ["syllabus", "program", "course", "studies"],
        antonyms: [],
        collocations: [
          {
            phrase: "school curriculum",
            definition: "the subjects taught in schools",
            example: "The school curriculum should prepare students for future careers."
          },
          {
            phrase: "design curriculum",
            definition: "to plan and organize educational content",
            example: "Educators work together to design curriculum that meets student needs."
          },
          {
            phrase: "curriculum development",
            definition: "the process of creating educational programs",
            example: "Curriculum development requires input from teachers, parents, and experts."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "literacy",
        pronunciation: "/ˈlɪtərəsi/",
        partOfSpeech: "noun",
        definition: "the ability to read and write; competence in a particular area",
        example: "Financial literacy is important for making good money decisions.",
        synonyms: ["education", "learning", "knowledge", "competence"],
        antonyms: ["illiteracy", "ignorance"],
        collocations: [
          {
            phrase: "improve literacy",
            definition: "to enhance reading and writing skills",
            example: "The program aims to improve literacy rates in developing countries."
          },
          {
            phrase: "literacy rate",
            definition: "the percentage of people who can read and write",
            example: "The country has achieved a 95% literacy rate among adults."
          },
          {
            phrase: "digital literacy",
            definition: "skills needed to use technology effectively",
            example: "Digital literacy is becoming as important as traditional literacy."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "social issues", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      // Health & Lifestyle - Common IELTS Topic
      {
        word: "obesity",
        pronunciation: "/əʊˈbiːsəti/",
        partOfSpeech: "noun",
        definition: "the condition of being grossly fat or overweight",
        example: "Childhood obesity has become a major public health concern.",
        synonyms: ["overweight", "corpulence"],
        antonyms: ["thinness", "underweight"],
        collocations: [
          {
            phrase: "childhood obesity",
            definition: "excessive weight in children",
            example: "Childhood obesity rates have doubled in the past 30 years."
          },
          {
            phrase: "combat obesity",
            definition: "to fight against excessive weight problems",
            example: "Schools are implementing programs to combat obesity among students."
          },
          {
            phrase: "obesity epidemic",
            definition: "widespread occurrence of obesity in a population",
            example: "Many countries are facing an obesity epidemic due to lifestyle changes."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "lifestyle", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "sedentary",
        pronunciation: "/ˈsedəntəri/",
        partOfSpeech: "adjective",
        definition: "requiring much sitting and little physical exercise",
        example: "A sedentary lifestyle can lead to various health problems.",
        synonyms: ["inactive", "stationary", "immobile"],
        antonyms: ["active", "mobile", "energetic"],
        collocations: [
          {
            phrase: "sedentary lifestyle",
            definition: "a way of living with little physical activity",
            example: "Modern office workers often have a sedentary lifestyle."
          },
          {
            phrase: "sedentary behavior",
            definition: "activities involving sitting or lying down",
            example: "Excessive sedentary behavior is linked to heart disease."
          },
          {
            phrase: "sedentary work",
            definition: "jobs that require sitting for long periods",
            example: "People with sedentary work should take regular breaks to exercise."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "lifestyle", "work", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      // Urbanization & Housing - Common IELTS Topic
      {
        word: "urbanization",
        pronunciation: "/ˌɜːbənaɪˈzeɪʃən/",
        partOfSpeech: "noun",
        definition: "the process by which towns and cities are formed and become larger",
        example: "Rapid urbanization has created both opportunities and challenges.",
        synonyms: ["urban development", "city growth"],
        antonyms: ["ruralization"],
        collocations: [
          {
            phrase: "rapid urbanization",
            definition: "fast growth of cities and towns",
            example: "Rapid urbanization in developing countries strains infrastructure."
          },
          {
            phrase: "urbanization process",
            definition: "the way cities develop and expand",
            example: "The urbanization process affects both social and economic structures."
          },
          {
            phrase: "effects of urbanization",
            definition: "consequences of city growth",
            example: "The effects of urbanization include both benefits and problems."
          }
        ],
        difficulty: "advanced",
        topics: ["cities", "development", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "infrastructure",
        pronunciation: "/ˈɪnfrəstrʌktʃə/",
        partOfSpeech: "noun",
        definition: "the basic physical and organizational structures needed for operation",
        example: "Good infrastructure is essential for economic development.",
        synonyms: ["framework", "foundation", "structure"],
        antonyms: [],
        collocations: [
          {
            phrase: "transport infrastructure",
            definition: "roads, railways, and other transportation systems",
            example: "Investment in transport infrastructure improves connectivity."
          },
          {
            phrase: "develop infrastructure",
            definition: "to build and improve basic facilities",
            example: "The government plans to develop infrastructure in rural areas."
          },
          {
            phrase: "infrastructure investment",
            definition: "money spent on building basic facilities",
            example: "Infrastructure investment creates jobs and boosts the economy."
          }
        ],
        difficulty: "intermediate",
        topics: ["cities", "development", "economics", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      // Work & Employment - Common IELTS Topic
      {
        word: "unemployment",
        pronunciation: "/ˌʌnɪmˈplɔɪmənt/",
        partOfSpeech: "noun",
        definition: "the state of being jobless; the number of unemployed people",
        example: "High unemployment rates affect the entire economy.",
        synonyms: ["joblessness", "worklessness"],
        antonyms: ["employment", "work"],
        collocations: [
          {
            phrase: "unemployment rate",
            definition: "the percentage of people without jobs",
            example: "The unemployment rate fell to 5% last month."
          },
          {
            phrase: "reduce unemployment",
            definition: "to decrease the number of jobless people",
            example: "The government introduced policies to reduce unemployment."
          },
          {
            phrase: "youth unemployment",
            definition: "joblessness among young people",
            example: "Youth unemployment is a serious problem in many countries."
          }
        ],
        difficulty: "intermediate",
        topics: ["work", "economics", "social issues", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      // Essential Phrasal Verbs for IELTS Band 6.5
      {
        word: "bring about",
        pronunciation: "/brɪŋ əˈbaʊt/",
        partOfSpeech: "phrasal verb",
        definition: "to cause something to happen",
        example: "The new policies will bring about significant changes in education.",
        synonyms: ["cause", "create", "produce", "generate"],
        antonyms: ["prevent", "stop"],
        collocations: [
          {
            phrase: "bring about change",
            definition: "to cause transformation or reform",
            example: "Technology can bring about positive change in healthcare."
          },
          {
            phrase: "bring about improvement",
            definition: "to cause something to become better",
            example: "The new management brought about improvement in company performance."
          },
          {
            phrase: "bring about reform",
            definition: "to cause systematic change",
            example: "Public pressure can bring about reform in government policies."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "carry out",
        pronunciation: "/ˈkæri aʊt/",
        partOfSpeech: "phrasal verb",
        definition: "to perform or complete a task, duty, or plan",
        example: "Scientists carry out experiments to test their theories.",
        synonyms: ["perform", "execute", "conduct", "implement"],
        antonyms: ["abandon", "cancel"],
        collocations: [
          {
            phrase: "carry out research",
            definition: "to conduct scientific investigation",
            example: "Universities carry out research in various fields of study."
          },
          {
            phrase: "carry out a survey",
            definition: "to conduct a study or poll",
            example: "The company will carry out a survey to understand customer needs."
          },
          {
            phrase: "carry out plans",
            definition: "to implement or execute strategies",
            example: "The team successfully carried out their marketing plans."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "academic", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "cope with",
        pronunciation: "/kəʊp wɪð/",
        partOfSpeech: "phrasal verb",
        definition: "to deal effectively with something difficult",
        example: "Students need strategies to cope with exam stress.",
        synonyms: ["handle", "manage", "deal with", "tackle"],
        antonyms: ["surrender", "give up"],
        collocations: [
          {
            phrase: "cope with stress",
            definition: "to manage pressure and anxiety",
            example: "Exercise helps people cope with stress more effectively."
          },
          {
            phrase: "cope with change",
            definition: "to adapt to new situations",
            example: "Employees need training to cope with technological change."
          },
          {
            phrase: "cope with challenges",
            definition: "to handle difficult situations",
            example: "Strong leadership helps organizations cope with challenges."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "psychology", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      }
    ];
  }
}