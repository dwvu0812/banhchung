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
      // Environment & Nature
      {
        word: "pollution",
        pronunciation: "/pəˈluːʃən/",
        partOfSpeech: "noun",
        definition: "the presence in the environment of harmful substances",
        example: "Air pollution is a major problem in big cities.",
        synonyms: ["contamination", "poisoning", "toxicity"],
        antonyms: ["purity", "cleanliness"],
        collocations: [
          {
            phrase: "air pollution",
            definition: "contamination of the atmosphere",
            example: "Air pollution causes serious health problems."
          },
          {
            phrase: "reduce pollution",
            definition: "to decrease environmental contamination",
            example: "We must reduce pollution to protect our planet."
          },
          {
            phrase: "water pollution",
            definition: "contamination of water bodies",
            example: "Water pollution affects marine life significantly."
          }
        ],
        difficulty: "beginner",
        topics: ["environment", "health"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "renewable",
        pronunciation: "/rɪˈnjuːəbəl/",
        partOfSpeech: "adjective",
        definition: "able to be renewed or replaced naturally",
        example: "Solar energy is a renewable source of power.",
        synonyms: ["sustainable", "inexhaustible", "endless"],
        antonyms: ["finite", "limited", "non-renewable"],
        collocations: [
          {
            phrase: "renewable energy",
            definition: "energy from sources that naturally replenish",
            example: "Renewable energy is essential for our future."
          },
          {
            phrase: "renewable resources",
            definition: "natural resources that can be replenished",
            example: "Wind and solar are renewable resources."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "technology"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "conservation",
        pronunciation: "/ˌkɒnsəˈveɪʃən/",
        partOfSpeech: "noun",
        definition: "the protection and preservation of natural resources",
        example: "Wildlife conservation is crucial for biodiversity.",
        synonyms: ["preservation", "protection", "maintenance"],
        antonyms: ["destruction", "waste", "depletion"],
        collocations: [
          {
            phrase: "energy conservation",
            definition: "reducing energy consumption",
            example: "Energy conservation helps reduce electricity bills."
          },
          {
            phrase: "wildlife conservation",
            definition: "protecting animals and their habitats",
            example: "Wildlife conservation programs save endangered species."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "science"],
        createdAt: now,
        updatedAt: now,
      },

      // Education
      {
        word: "curriculum",
        pronunciation: "/kəˈrɪkjələm/",
        partOfSpeech: "noun",
        definition: "the subjects comprising a course of study in a school or college",
        example: "The school updated its curriculum to include computer science.",
        synonyms: ["syllabus", "program", "course"],
        antonyms: [],
        collocations: [
          {
            phrase: "school curriculum",
            definition: "the set of courses taught in school",
            example: "The school curriculum includes math, science, and literature."
          },
          {
            phrase: "develop curriculum",
            definition: "to create educational programs",
            example: "Teachers work together to develop curriculum."
          }
        ],
        difficulty: "intermediate",
        topics: ["education"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "literacy",
        pronunciation: "/ˈlɪtərəsi/",
        partOfSpeech: "noun",
        definition: "the ability to read and write",
        example: "Improving literacy rates is a government priority.",
        synonyms: ["reading ability", "education"],
        antonyms: ["illiteracy"],
        collocations: [
          {
            phrase: "digital literacy",
            definition: "ability to use digital technology effectively",
            example: "Digital literacy is essential in the modern workplace."
          },
          {
            phrase: "literacy rate",
            definition: "percentage of people who can read and write",
            example: "The country has achieved a 95% literacy rate."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "social issues"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "scholarship",
        pronunciation: "/ˈskɒləʃɪp/",
        partOfSpeech: "noun",
        definition: "a grant of money to support a student's education",
        example: "She received a scholarship to study at university.",
        synonyms: ["grant", "bursary", "award"],
        antonyms: [],
        collocations: [
          {
            phrase: "receive scholarship",
            definition: "to be awarded financial aid for education",
            example: "Many students receive scholarships based on merit."
          },
          {
            phrase: "scholarship program",
            definition: "system of providing educational grants",
            example: "The scholarship program helps disadvantaged students."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "finance"],
        createdAt: now,
        updatedAt: now,
      },

      // Technology
      {
        word: "innovation",
        pronunciation: "/ˌɪnəˈveɪʃən/",
        partOfSpeech: "noun",
        definition: "the introduction of new ideas, methods, or things",
        example: "Technological innovation has changed our daily lives.",
        synonyms: ["invention", "creativity", "novelty"],
        antonyms: ["tradition", "convention"],
        collocations: [
          {
            phrase: "technological innovation",
            definition: "new developments in technology",
            example: "Technological innovation drives economic growth."
          },
          {
            phrase: "promote innovation",
            definition: "to encourage new ideas and methods",
            example: "Companies promote innovation through research and development."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "business"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "efficient",
        pronunciation: "/ɪˈfɪʃənt/",
        partOfSpeech: "adjective",
        definition: "working in a well-organized way; competent",
        example: "The new system is more efficient than the old one.",
        synonyms: ["effective", "productive", "competent"],
        antonyms: ["inefficient", "wasteful", "unproductive"],
        collocations: [
          {
            phrase: "energy efficient",
            definition: "using energy in the best way with little waste",
            example: "Energy efficient appliances save money on electricity."
          },
          {
            phrase: "work efficiently",
            definition: "to work in an organized and effective way",
            example: "Good planning helps us work efficiently."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "business", "environment"],
        createdAt: now,
        updatedAt: now,
      },

      // Health & Lifestyle
      {
        word: "nutrition",
        pronunciation: "/njuːˈtrɪʃən/",
        partOfSpeech: "noun",
        definition: "the process of providing or obtaining food necessary for health",
        example: "Good nutrition is essential for children's development.",
        synonyms: ["nourishment", "diet", "feeding"],
        antonyms: ["malnutrition"],
        collocations: [
          {
            phrase: "proper nutrition",
            definition: "eating the right foods for good health",
            example: "Proper nutrition prevents many diseases."
          },
          {
            phrase: "nutrition education",
            definition: "teaching about healthy eating",
            example: "Schools should provide nutrition education to students."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "lifestyle"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "exercise",
        pronunciation: "/ˈeksəsaɪz/",
        partOfSpeech: "noun/verb",
        definition: "physical activity to improve health and fitness",
        example: "Regular exercise helps maintain good health.",
        synonyms: ["workout", "training", "activity"],
        antonyms: ["inactivity", "rest"],
        collocations: [
          {
            phrase: "regular exercise",
            definition: "physical activity done consistently",
            example: "Regular exercise reduces the risk of heart disease."
          },
          {
            phrase: "physical exercise",
            definition: "bodily activity for fitness",
            example: "Physical exercise improves both body and mind."
          }
        ],
        difficulty: "beginner",
        topics: ["health", "lifestyle"],
        createdAt: now,
        updatedAt: now,
      },

      // Work & Career
      {
        word: "employment",
        pronunciation: "/ɪmˈplɔɪmənt/",
        partOfSpeech: "noun",
        definition: "the condition of having paid work",
        example: "The government aims to increase employment opportunities.",
        synonyms: ["work", "job", "occupation"],
        antonyms: ["unemployment", "joblessness"],
        collocations: [
          {
            phrase: "full-time employment",
            definition: "working a complete work week",
            example: "She found full-time employment after graduation."
          },
          {
            phrase: "employment rate",
            definition: "percentage of people who have jobs",
            example: "The employment rate has improved this year."
          }
        ],
        difficulty: "intermediate",
        topics: ["work", "economics"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "salary",
        pronunciation: "/ˈsæləri/",
        partOfSpeech: "noun",
        definition: "a fixed regular payment for work",
        example: "His salary increased after the promotion.",
        synonyms: ["wage", "pay", "income"],
        antonyms: [],
        collocations: [
          {
            phrase: "annual salary",
            definition: "yearly payment for work",
            example: "Her annual salary is quite competitive."
          },
          {
            phrase: "salary increase",
            definition: "raise in pay",
            example: "Employees received a 5% salary increase."
          }
        ],
        difficulty: "beginner",
        topics: ["work", "finance"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "colleague",
        pronunciation: "/ˈkɒliːɡ/",
        partOfSpeech: "noun",
        definition: "a person with whom one works",
        example: "My colleagues are very supportive and helpful.",
        synonyms: ["coworker", "associate", "partner"],
        antonyms: [],
        collocations: [
          {
            phrase: "work with colleagues",
            definition: "to collaborate with coworkers",
            example: "I enjoy working with my colleagues on projects."
          },
          {
            phrase: "helpful colleague",
            definition: "a supportive coworker",
            example: "She is a helpful colleague who always assists others."
          }
        ],
        difficulty: "intermediate",
        topics: ["work", "relationships"],
        createdAt: now,
        updatedAt: now,
      },

      // Transportation
      {
        word: "commute",
        pronunciation: "/kəˈmjuːt/",
        partOfSpeech: "verb/noun",
        definition: "to travel regularly between work and home",
        example: "I commute to work by train every day.",
        synonyms: ["travel", "journey"],
        antonyms: [],
        collocations: [
          {
            phrase: "daily commute",
            definition: "regular journey to and from work",
            example: "My daily commute takes about 45 minutes."
          },
          {
            phrase: "commute by train",
            definition: "to travel to work using railway transport",
            example: "Many people commute by train in the city."
          }
        ],
        difficulty: "intermediate",
        topics: ["transportation", "work"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "traffic",
        pronunciation: "/ˈtræfɪk/",
        partOfSpeech: "noun",
        definition: "vehicles moving on roads",
        example: "Heavy traffic made me late for the meeting.",
        synonyms: ["vehicles", "congestion"],
        antonyms: [],
        collocations: [
          {
            phrase: "heavy traffic",
            definition: "many vehicles causing slow movement",
            example: "Heavy traffic is common during rush hour."
          },
          {
            phrase: "traffic jam",
            definition: "situation where vehicles cannot move",
            example: "We were stuck in a traffic jam for an hour."
          }
        ],
        difficulty: "beginner",
        topics: ["transportation", "urban life"],
        createdAt: now,
        updatedAt: now,
      },

      // Social Issues
      {
        word: "poverty",
        pronunciation: "/ˈpɒvəti/",
        partOfSpeech: "noun",
        definition: "the state of being extremely poor",
        example: "The government is working to reduce poverty.",
        synonyms: ["destitution", "hardship", "need"],
        antonyms: ["wealth", "prosperity", "affluence"],
        collocations: [
          {
            phrase: "reduce poverty",
            definition: "to decrease the number of poor people",
            example: "Education helps reduce poverty in developing countries."
          },
          {
            phrase: "extreme poverty",
            definition: "very severe lack of basic necessities",
            example: "Extreme poverty affects millions of people worldwide."
          }
        ],
        difficulty: "intermediate",
        topics: ["social issues", "economics"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "community",
        pronunciation: "/kəˈmjuːnəti/",
        partOfSpeech: "noun",
        definition: "a group of people living in the same place",
        example: "Our community organized a charity event.",
        synonyms: ["neighborhood", "society", "group"],
        antonyms: [],
        collocations: [
          {
            phrase: "local community",
            definition: "people living in the nearby area",
            example: "The local community supports the new library."
          },
          {
            phrase: "community service",
            definition: "voluntary work to help the community",
            example: "Students participate in community service projects."
          }
        ],
        difficulty: "intermediate",
        topics: ["social issues", "relationships"],
        createdAt: now,
        updatedAt: now,
      },

      // Communication & Media
      {
        word: "communicate",
        pronunciation: "/kəˈmjuːnɪkeɪt/",
        partOfSpeech: "verb",
        definition: "to share or exchange information",
        example: "It's important to communicate clearly with your team.",
        synonyms: ["convey", "express", "share"],
        antonyms: ["withhold", "conceal"],
        collocations: [
          {
            phrase: "communicate effectively",
            definition: "to share information clearly and successfully",
            example: "Good managers communicate effectively with their staff."
          },
          {
            phrase: "communicate with others",
            definition: "to exchange information with people",
            example: "Social media helps us communicate with others easily."
          }
        ],
        difficulty: "intermediate",
        topics: ["communication", "relationships"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "information",
        pronunciation: "/ˌɪnfəˈmeɪʃən/",
        partOfSpeech: "noun",
        definition: "facts or knowledge provided or learned",
        example: "The internet provides access to vast amounts of information.",
        synonyms: ["data", "facts", "knowledge"],
        antonyms: ["ignorance", "misinformation"],
        collocations: [
          {
            phrase: "reliable information",
            definition: "trustworthy and accurate facts",
            example: "Students need reliable information for their research."
          },
          {
            phrase: "share information",
            definition: "to give facts or knowledge to others",
            example: "Teachers share information with their students."
          }
        ],
        difficulty: "beginner",
        topics: ["communication", "education"],
        createdAt: now,
        updatedAt: now,
      },

      // Culture & Entertainment
      {
        word: "culture",
        pronunciation: "/ˈkʌltʃə/",
        partOfSpeech: "noun",
        definition: "the customs, arts, and achievements of a particular society",
        example: "Learning about different cultures broadens our perspective.",
        synonyms: ["civilization", "society", "heritage"],
        antonyms: [],
        collocations: [
          {
            phrase: "local culture",
            definition: "customs and traditions of a specific area",
            example: "Tourists enjoy experiencing local culture."
          },
          {
            phrase: "cultural differences",
            definition: "variations in customs between societies",
            example: "Understanding cultural differences improves communication."
          }
        ],
        difficulty: "intermediate",
        topics: ["culture", "society"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "entertainment",
        pronunciation: "/ˌentəˈteɪnmənt/",
        partOfSpeech: "noun",
        definition: "activities that provide amusement or enjoyment",
        example: "Movies and music are popular forms of entertainment.",
        synonyms: ["amusement", "recreation", "fun"],
        antonyms: ["boredom", "work"],
        collocations: [
          {
            phrase: "popular entertainment",
            definition: "widely enjoyed forms of amusement",
            example: "Television is a popular entertainment medium."
          },
          {
            phrase: "entertainment industry",
            definition: "businesses that provide amusement",
            example: "The entertainment industry employs many creative people."
          }
        ],
        difficulty: "intermediate",
        topics: ["culture", "lifestyle"],
        createdAt: now,
        updatedAt: now,
      },

      // Food & Agriculture
      {
        word: "agriculture",
        pronunciation: "/ˈæɡrɪkʌltʃə/",
        partOfSpeech: "noun",
        definition: "the practice of farming and growing crops",
        example: "Agriculture is vital for food production.",
        synonyms: ["farming", "cultivation", "husbandry"],
        antonyms: [],
        collocations: [
          {
            phrase: "modern agriculture",
            definition: "current farming methods and technology",
            example: "Modern agriculture uses advanced machinery."
          },
          {
            phrase: "sustainable agriculture",
            definition: "farming that protects the environment",
            example: "Sustainable agriculture preserves soil quality."
          }
        ],
        difficulty: "intermediate",
        topics: ["agriculture", "environment"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "organic",
        pronunciation: "/ɔːˈɡænɪk/",
        partOfSpeech: "adjective",
        definition: "produced without artificial chemicals",
        example: "Many people prefer organic vegetables.",
        synonyms: ["natural", "chemical-free"],
        antonyms: ["artificial", "synthetic"],
        collocations: [
          {
            phrase: "organic food",
            definition: "food grown without artificial chemicals",
            example: "Organic food is becoming more popular."
          },
          {
            phrase: "organic farming",
            definition: "agriculture without synthetic pesticides",
            example: "Organic farming protects the environment."
          }
        ],
        difficulty: "intermediate",
        topics: ["food", "health", "environment"],
        createdAt: now,
        updatedAt: now,
      },

      // Basic Academic Words
      {
        word: "research",
        pronunciation: "/rɪˈsɜːtʃ/",
        partOfSpeech: "noun/verb",
        definition: "detailed study to discover new information",
        example: "Scientists conduct research to find new medicines.",
        synonyms: ["study", "investigation", "inquiry"],
        antonyms: [],
        collocations: [
          {
            phrase: "conduct research",
            definition: "to carry out a detailed study",
            example: "Universities conduct research in many fields."
          },
          {
            phrase: "research project",
            definition: "a planned study to discover information",
            example: "Students work on research projects during their studies."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "science"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "develop",
        pronunciation: "/dɪˈveləp/",
        partOfSpeech: "verb",
        definition: "to grow or cause to grow gradually",
        example: "Children develop language skills through practice.",
        synonyms: ["grow", "progress", "advance"],
        antonyms: ["decline", "deteriorate"],
        collocations: [
          {
            phrase: "develop skills",
            definition: "to improve abilities through practice",
            example: "Practice helps develop skills in any field."
          },
          {
            phrase: "develop technology",
            definition: "to create or improve technical systems",
            example: "Companies invest money to develop technology."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "technology", "business"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "opportunity",
        pronunciation: "/ˌɒpəˈtjuːnəti/",
        partOfSpeech: "noun",
        definition: "a chance for progress or advancement",
        example: "Education provides opportunities for a better life.",
        synonyms: ["chance", "possibility", "opening"],
        antonyms: ["obstacle", "barrier"],
        collocations: [
          {
            phrase: "job opportunity",
            definition: "a chance to get employment",
            example: "The new factory will create job opportunities."
          },
          {
            phrase: "take opportunity",
            definition: "to use a chance when it appears",
            example: "You should take every opportunity to learn."
          }
        ],
        difficulty: "intermediate",
        topics: ["work", "education", "life"],
        createdAt: now,
        updatedAt: now,
      },

      // More Essential IELTS Band 6.0 Vocabulary
      {
        word: "government",
        pronunciation: "/ˈɡʌvənmənt/",
        partOfSpeech: "noun",
        definition: "the group of people who control a country or state",
        example: "The government announced new education policies.",
        synonyms: ["administration", "authority", "state"],
        antonyms: [],
        collocations: [
          {
            phrase: "local government",
            definition: "administration of a city or region",
            example: "Local government is responsible for public services."
          },
          {
            phrase: "government policy",
            definition: "official plans or decisions by authorities",
            example: "Government policy affects everyone's daily life."
          }
        ],
        difficulty: "intermediate",
        topics: ["politics", "society"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "economy",
        pronunciation: "/ɪˈkɒnəmi/",
        partOfSpeech: "noun",
        definition: "the system of trade and industry in a country",
        example: "The country's economy is growing rapidly.",
        synonyms: ["financial system", "market"],
        antonyms: [],
        collocations: [
          {
            phrase: "strong economy",
            definition: "a healthy financial system",
            example: "A strong economy creates more jobs."
          },
          {
            phrase: "global economy",
            definition: "worldwide economic system",
            example: "The global economy affects all countries."
          }
        ],
        difficulty: "intermediate",
        topics: ["economics", "business"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "population",
        pronunciation: "/ˌpɒpjuˈleɪʃən/",
        partOfSpeech: "noun",
        definition: "all the people living in a particular area",
        example: "The city's population has doubled in ten years.",
        synonyms: ["inhabitants", "residents", "people"],
        antonyms: [],
        collocations: [
          {
            phrase: "growing population",
            definition: "increasing number of people",
            example: "The growing population needs more housing."
          },
          {
            phrase: "population density",
            definition: "number of people per area",
            example: "Urban areas have high population density."
          }
        ],
        difficulty: "intermediate",
        topics: ["society", "demographics"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "environment",
        pronunciation: "/ɪnˈvaɪrənmənt/",
        partOfSpeech: "noun",
        definition: "the natural world around us",
        example: "We must protect the environment for future generations.",
        synonyms: ["nature", "surroundings", "ecosystem"],
        antonyms: [],
        collocations: [
          {
            phrase: "protect environment",
            definition: "to keep nature safe from harm",
            example: "Everyone should help protect the environment."
          },
          {
            phrase: "natural environment",
            definition: "the world of nature",
            example: "Animals need a clean natural environment to survive."
          }
        ],
        difficulty: "beginner",
        topics: ["environment", "nature"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "technology",
        pronunciation: "/tekˈnɒlədʒi/",
        partOfSpeech: "noun",
        definition: "scientific knowledge used to create tools and machines",
        example: "Modern technology has made communication easier.",
        synonyms: ["innovation", "advancement", "science"],
        antonyms: [],
        collocations: [
          {
            phrase: "modern technology",
            definition: "current scientific tools and methods",
            example: "Modern technology helps doctors save lives."
          },
          {
            phrase: "information technology",
            definition: "computer and internet systems",
            example: "Information technology is essential for business."
          }
        ],
        difficulty: "beginner",
        topics: ["technology", "science"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "society",
        pronunciation: "/səˈsaɪəti/",
        partOfSpeech: "noun",
        definition: "people living together in organized communities",
        example: "Education benefits the whole society.",
        synonyms: ["community", "civilization", "public"],
        antonyms: [],
        collocations: [
          {
            phrase: "modern society",
            definition: "today's way of living together",
            example: "Modern society relies heavily on technology."
          },
          {
            phrase: "benefit society",
            definition: "to help the community",
            example: "Volunteer work benefits society in many ways."
          }
        ],
        difficulty: "intermediate",
        topics: ["society", "culture"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "education",
        pronunciation: "/ˌedʒuˈkeɪʃən/",
        partOfSpeech: "noun",
        definition: "the process of learning and teaching",
        example: "Good education opens many doors in life.",
        synonyms: ["learning", "schooling", "instruction"],
        antonyms: ["ignorance"],
        collocations: [
          {
            phrase: "higher education",
            definition: "university or college level learning",
            example: "Higher education is expensive but valuable."
          },
          {
            phrase: "quality education",
            definition: "good standard of teaching and learning",
            example: "All children deserve quality education."
          }
        ],
        difficulty: "beginner",
        topics: ["education", "learning"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "experience",
        pronunciation: "/ɪkˈspɪəriəns/",
        partOfSpeech: "noun/verb",
        definition: "knowledge gained through doing or living through something",
        example: "Work experience is valuable for finding jobs.",
        synonyms: ["knowledge", "practice", "encounter"],
        antonyms: ["inexperience"],
        collocations: [
          {
            phrase: "work experience",
            definition: "knowledge gained from doing jobs",
            example: "Work experience helps you understand business."
          },
          {
            phrase: "gain experience",
            definition: "to learn through practice",
            example: "Internships help students gain experience."
          }
        ],
        difficulty: "intermediate",
        topics: ["work", "education", "life"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "important",
        pronunciation: "/ɪmˈpɔːtənt/",
        partOfSpeech: "adjective",
        definition: "having great value or significance",
        example: "It's important to eat healthy food.",
        synonyms: ["significant", "crucial", "essential"],
        antonyms: ["unimportant", "trivial", "minor"],
        collocations: [
          {
            phrase: "very important",
            definition: "extremely significant",
            example: "Education is very important for success."
          },
          {
            phrase: "important role",
            definition: "significant function or position",
            example: "Teachers play an important role in society."
          }
        ],
        difficulty: "beginner",
        topics: ["general", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "problem",
        pronunciation: "/ˈprɒbləm/",
        partOfSpeech: "noun",
        definition: "a difficult situation that needs to be solved",
        example: "Traffic congestion is a major problem in cities.",
        synonyms: ["issue", "difficulty", "challenge"],
        antonyms: ["solution", "answer"],
        collocations: [
          {
            phrase: "solve problem",
            definition: "to find an answer to a difficulty",
            example: "Scientists work together to solve problems."
          },
          {
            phrase: "serious problem",
            definition: "a major difficulty",
            example: "Climate change is a serious problem."
          }
        ],
        difficulty: "beginner",
        topics: ["general", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "solution",
        pronunciation: "/səˈluːʃən/",
        partOfSpeech: "noun",
        definition: "an answer to a problem",
        example: "Renewable energy is a solution to pollution.",
        synonyms: ["answer", "resolution", "remedy"],
        antonyms: ["problem", "question"],
        collocations: [
          {
            phrase: "find solution",
            definition: "to discover an answer",
            example: "We need to find a solution to this issue."
          },
          {
            phrase: "practical solution",
            definition: "a realistic and workable answer",
            example: "The team proposed a practical solution."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "increase",
        pronunciation: "/ɪnˈkriːs/",
        partOfSpeech: "verb/noun",
        definition: "to become or make larger in amount",
        example: "The company plans to increase salaries next year.",
        synonyms: ["grow", "rise", "expand"],
        antonyms: ["decrease", "reduce", "decline"],
        collocations: [
          {
            phrase: "increase rapidly",
            definition: "to grow very quickly",
            example: "The population increased rapidly in recent years."
          },
          {
            phrase: "significant increase",
            definition: "a large growth",
            example: "There was a significant increase in sales."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "business", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "decrease",
        pronunciation: "/dɪˈkriːs/",
        partOfSpeech: "verb/noun",
        definition: "to become or make smaller in amount",
        example: "Exercise can decrease the risk of heart disease.",
        synonyms: ["reduce", "decline", "drop"],
        antonyms: ["increase", "grow", "rise"],
        collocations: [
          {
            phrase: "decrease significantly",
            definition: "to reduce by a large amount",
            example: "Pollution decreased significantly after new laws."
          },
          {
            phrase: "steady decrease",
            definition: "gradual reduction",
            example: "There's been a steady decrease in crime rates."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "benefit",
        pronunciation: "/ˈbenɪfɪt/",
        partOfSpeech: "noun/verb",
        definition: "an advantage or good result",
        example: "Exercise has many health benefits.",
        synonyms: ["advantage", "profit", "gain"],
        antonyms: ["disadvantage", "harm", "loss"],
        collocations: [
          {
            phrase: "health benefits",
            definition: "advantages for physical wellbeing",
            example: "Vegetables provide many health benefits."
          },
          {
            phrase: "benefit from",
            definition: "to gain advantage from something",
            example: "Students benefit from extra study time."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "health", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "advantage",
        pronunciation: "/ədˈvɑːntɪdʒ/",
        partOfSpeech: "noun",
        definition: "a good or useful feature",
        example: "Speaking multiple languages is a great advantage.",
        synonyms: ["benefit", "strength", "asset"],
        antonyms: ["disadvantage", "weakness", "drawback"],
        collocations: [
          {
            phrase: "take advantage",
            definition: "to use an opportunity",
            example: "Students should take advantage of free resources."
          },
          {
            phrase: "competitive advantage",
            definition: "a feature that makes you better than others",
            example: "Good education gives a competitive advantage."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "business", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "disadvantage",
        pronunciation: "/ˌdɪsədˈvɑːntɪdʒ/",
        partOfSpeech: "noun",
        definition: "an unfavorable condition or situation",
        example: "Not speaking English is a disadvantage in global business.",
        synonyms: ["drawback", "weakness", "handicap"],
        antonyms: ["advantage", "benefit", "strength"],
        collocations: [
          {
            phrase: "major disadvantage",
            definition: "a serious unfavorable condition",
            example: "Lack of experience is a major disadvantage."
          },
          {
            phrase: "at a disadvantage",
            definition: "in an unfavorable position",
            example: "Rural students are at a disadvantage without internet."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "success",
        pronunciation: "/səkˈses/",
        partOfSpeech: "noun",
        definition: "achieving what you want or intended",
        example: "Hard work is the key to success.",
        synonyms: ["achievement", "accomplishment", "victory"],
        antonyms: ["failure", "defeat"],
        collocations: [
          {
            phrase: "achieve success",
            definition: "to reach your goals",
            example: "Many factors help people achieve success."
          },
          {
            phrase: "key to success",
            definition: "the most important factor for achieving goals",
            example: "Education is often the key to success."
          }
        ],
        difficulty: "beginner",
        topics: ["general", "life", "work"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "failure",
        pronunciation: "/ˈfeɪljə/",
        partOfSpeech: "noun",
        definition: "not achieving what you want or intended",
        example: "Failure is often a step toward success.",
        synonyms: ["defeat", "disappointment", "setback"],
        antonyms: ["success", "achievement", "victory"],
        collocations: [
          {
            phrase: "learn from failure",
            definition: "to gain knowledge from mistakes",
            example: "Successful people learn from failure."
          },
          {
            phrase: "fear of failure",
            definition: "worry about not succeeding",
            example: "Fear of failure prevents many people from trying."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "life", "psychology"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "progress",
        pronunciation: "/ˈprəʊɡres/",
        partOfSpeech: "noun/verb",
        definition: "forward movement toward a goal",
        example: "The student made good progress in English.",
        synonyms: ["advancement", "improvement", "development"],
        antonyms: ["regression", "decline"],
        collocations: [
          {
            phrase: "make progress",
            definition: "to move forward or improve",
            example: "With practice, you will make progress."
          },
          {
            phrase: "slow progress",
            definition: "gradual improvement",
            example: "Learning a language requires slow progress."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "education", "development"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "quality",
        pronunciation: "/ˈkwɒləti/",
        partOfSpeech: "noun",
        definition: "how good or bad something is",
        example: "This restaurant is known for high-quality food.",
        synonyms: ["standard", "grade", "caliber"],
        antonyms: [],
        collocations: [
          {
            phrase: "high quality",
            definition: "very good standard",
            example: "High quality products last longer."
          },
          {
            phrase: "improve quality",
            definition: "to make something better",
            example: "The company works to improve quality constantly."
          }
        ],
        difficulty: "intermediate",
        topics: ["general", "business", "academic"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "support",
        pronunciation: "/səˈpɔːt/",
        partOfSpeech: "verb/noun",
        definition: "to help or encourage someone or something",
        example: "Parents should support their children's education.",
        synonyms: ["help", "assist", "aid"],
        antonyms: ["oppose", "hinder", "obstruct"],
        collocations: [
          {
            phrase: "provide support",
            definition: "to give help or assistance",
            example: "Teachers provide support to struggling students."
          },
          {
            phrase: "family support",
            definition: "help from relatives",
            example: "Family support is important for success."
          }
        ],
        difficulty: "beginner",
        topics: ["general", "relationships", "help"],
        createdAt: now,
        updatedAt: now,
      }
    ];
  }
}