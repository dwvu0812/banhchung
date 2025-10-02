import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Vocabulary } from './interfaces/vocabulary.interface';

@Injectable()
export class VocabularySeederService {
  constructor(private databaseService: DatabaseService) {}

  async seedIeltsVocabulary(): Promise<void> {
    const db = this.databaseService.getDb();
    
    // Check if IELTS vocabulary already exists
    const existingCount = await db.collection('vocabulary').countDocuments({
      topics: { $in: ['ielts-writing', 'ielts-speaking'] }
    });

    if (existingCount < 50) { // Only seed if we don't have enough IELTS vocabulary
      const ieltsVocabulary = this.getIeltsVocabularyPackages();
      await db.collection('vocabulary').insertMany(ieltsVocabulary);
      console.log(`Seeded ${ieltsVocabulary.length} IELTS vocabulary words`);
    }
  }

  private getIeltsVocabularyPackages(): Vocabulary[] {
    const now = new Date();
    return [
      // IELTS Writing Task 2 - Essential Academic Vocabulary
      {
        word: "significant",
        pronunciation: "/sɪɡˈnɪfɪkənt/",
        partOfSpeech: "adjective",
        definition: "sufficiently great or important to be worthy of attention; noteworthy",
        example: "There has been a significant increase in online learning.",
        synonyms: ["important", "notable", "considerable", "substantial"],
        antonyms: ["insignificant", "minor", "trivial"],
        collocations: [
          {
            phrase: "significant impact",
            definition: "a notable effect or influence",
            example: "Climate change has a significant impact on global agriculture."
          },
          {
            phrase: "significant difference",
            definition: "a notable distinction or variation",
            example: "There is a significant difference between online and traditional education."
          },
          {
            phrase: "significant increase",
            definition: "a notable rise or growth",
            example: "The city experienced a significant increase in population."
          }
        ],
        difficulty: "intermediate",
        topics: ["ielts-writing", "academic", "statistics"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "consequently",
        pronunciation: "/ˈkɒnsɪkwəntli/",
        partOfSpeech: "adverb",
        definition: "as a result; therefore",
        example: "The weather was bad; consequently, the match was cancelled.",
        synonyms: ["therefore", "thus", "as a result", "hence"],
        antonyms: [],
        collocations: [
          {
            phrase: "consequently lead to",
            definition: "to result in something as an outcome",
            example: "Poor diet can consequently lead to health problems."
          },
          {
            phrase: "consequently affect",
            definition: "to influence as a result",
            example: "Economic changes consequently affect employment rates."
          }
        ],
        difficulty: "intermediate",
        topics: ["ielts-writing", "academic", "linking words"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "furthermore",
        pronunciation: "/ˈfɜːðəmɔː/",
        partOfSpeech: "adverb",
        definition: "in addition; moreover",
        example: "The plan is cost-effective. Furthermore, it's environmentally friendly.",
        synonyms: ["moreover", "additionally", "besides", "in addition"],
        antonyms: [],
        collocations: [
          {
            phrase: "furthermore argue",
            definition: "to add another point to an argument",
            example: "Critics furthermore argue that the policy is unfair."
          },
          {
            phrase: "furthermore suggest",
            definition: "to add another suggestion or proposal",
            example: "Experts furthermore suggest implementing stricter regulations."
          }
        ],
        difficulty: "intermediate",
        topics: ["ielts-writing", "academic", "linking words"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "nevertheless",
        pronunciation: "/ˌnevəðəˈles/",
        partOfSpeech: "adverb",
        definition: "in spite of that; however",
        example: "The task was difficult; nevertheless, we completed it on time.",
        synonyms: ["however", "nonetheless", "yet", "still"],
        antonyms: [],
        collocations: [
          {
            phrase: "nevertheless important",
            definition: "still significant despite other factors",
            example: "The research is limited; nevertheless, it provides important insights."
          },
          {
            phrase: "nevertheless continue",
            definition: "to persist despite obstacles",
            example: "Despite the challenges, we will nevertheless continue our efforts."
          }
        ],
        difficulty: "intermediate",
        topics: ["ielts-writing", "academic", "linking words"],
        createdAt: now,
        updatedAt: now,
      },

      // Environment & Sustainability - Extended Vocabulary
      {
        word: "renewable",
        pronunciation: "/rɪˈnjuːəbəl/",
        partOfSpeech: "adjective",
        definition: "able to be renewed; relating to energy from sources that are naturally replenished",
        example: "Solar power is a renewable energy source.",
        synonyms: ["sustainable", "regenerative", "inexhaustible"],
        antonyms: ["non-renewable", "finite", "exhaustible"],
        collocations: [
          {
            phrase: "renewable energy",
            definition: "energy from sources that naturally replenish",
            example: "Many countries are investing in renewable energy technologies."
          },
          {
            phrase: "renewable resources",
            definition: "natural resources that can be replenished",
            example: "Wind and solar are examples of renewable resources."
          },
          {
            phrase: "renewable technology",
            definition: "technology that uses sustainable energy sources",
            example: "Advances in renewable technology are reducing costs significantly."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "energy", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "biodiversity",
        pronunciation: "/ˌbaɪəʊdaɪˈvɜːsəti/",
        partOfSpeech: "noun",
        definition: "the variety of plant and animal life in the world or in a particular habitat",
        example: "Deforestation threatens biodiversity in tropical regions.",
        synonyms: ["biological diversity", "ecological variety"],
        antonyms: ["monoculture", "uniformity"],
        collocations: [
          {
            phrase: "protect biodiversity",
            definition: "to preserve variety in ecosystems",
            example: "National parks help protect biodiversity for future generations."
          },
          {
            phrase: "biodiversity loss",
            definition: "the reduction of variety in living organisms",
            example: "Climate change is accelerating biodiversity loss worldwide."
          },
          {
            phrase: "rich biodiversity",
            definition: "high variety of species in an area",
            example: "Rainforests are known for their rich biodiversity."
          }
        ],
        difficulty: "advanced",
        topics: ["environment", "biology", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "conservation",
        pronunciation: "/ˌkɒnsəˈveɪʃən/",
        partOfSpeech: "noun",
        definition: "the protection of plants, animals, and natural areas",
        example: "Wildlife conservation is essential for maintaining ecosystems.",
        synonyms: ["preservation", "protection", "maintenance"],
        antonyms: ["destruction", "waste", "depletion"],
        collocations: [
          {
            phrase: "wildlife conservation",
            definition: "protection of animals and their habitats",
            example: "Wildlife conservation efforts have saved many endangered species."
          },
          {
            phrase: "conservation efforts",
            definition: "activities aimed at protecting the environment",
            example: "International conservation efforts are needed to address climate change."
          },
          {
            phrase: "energy conservation",
            definition: "reducing energy consumption to preserve resources",
            example: "Energy conservation in buildings can significantly reduce carbon emissions."
          }
        ],
        difficulty: "intermediate",
        topics: ["environment", "wildlife", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },

      // Technology & Digital Age - Extended Vocabulary
      {
        word: "artificial intelligence",
        pronunciation: "/ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns/",
        partOfSpeech: "noun",
        definition: "the simulation of human intelligence in machines",
        example: "Artificial intelligence is transforming many industries.",
        synonyms: ["AI", "machine intelligence", "computer intelligence"],
        antonyms: ["human intelligence", "natural intelligence"],
        collocations: [
          {
            phrase: "artificial intelligence technology",
            definition: "systems that simulate human thinking",
            example: "Artificial intelligence technology is advancing rapidly in healthcare."
          },
          {
            phrase: "develop artificial intelligence",
            definition: "to create AI systems",
            example: "Tech companies invest billions to develop artificial intelligence."
          },
          {
            phrase: "artificial intelligence applications",
            definition: "practical uses of AI technology",
            example: "Artificial intelligence applications include voice recognition and autonomous vehicles."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "future", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "automation",
        pronunciation: "/ˌɔːtəˈmeɪʃən/",
        partOfSpeech: "noun",
        definition: "the use of machines or computers to do work that was previously done by people",
        example: "Automation in factories has increased productivity but reduced jobs.",
        synonyms: ["mechanization", "computerization", "robotization"],
        antonyms: ["manual work", "human labor"],
        collocations: [
          {
            phrase: "workplace automation",
            definition: "using machines to replace human workers",
            example: "Workplace automation is changing the nature of employment."
          },
          {
            phrase: "automation technology",
            definition: "systems that perform tasks automatically",
            example: "Advances in automation technology are revolutionizing manufacturing."
          },
          {
            phrase: "job automation",
            definition: "replacing human jobs with machines",
            example: "Job automation may lead to unemployment in some sectors."
          }
        ],
        difficulty: "intermediate",
        topics: ["technology", "work", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },

      // Education & Learning - Extended Vocabulary
      {
        word: "pedagogy",
        pronunciation: "/ˈpedəɡɒdʒi/",
        partOfSpeech: "noun",
        definition: "the method and practice of teaching",
        example: "Modern pedagogy emphasizes student-centered learning approaches.",
        synonyms: ["teaching methods", "educational practice", "instruction"],
        antonyms: [],
        collocations: [
          {
            phrase: "effective pedagogy",
            definition: "successful teaching methods",
            example: "Effective pedagogy adapts to different learning styles."
          },
          {
            phrase: "digital pedagogy",
            definition: "teaching methods using technology",
            example: "Digital pedagogy has become essential in online education."
          },
          {
            phrase: "pedagogy research",
            definition: "studies on teaching methods",
            example: "Pedagogy research helps improve educational outcomes."
          }
        ],
        difficulty: "advanced",
        topics: ["education", "teaching", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "competency",
        pronunciation: "/ˈkɒmpɪtənsi/",
        partOfSpeech: "noun",
        definition: "the ability to do something successfully or efficiently",
        example: "Digital competency is essential for modern students.",
        synonyms: ["skill", "ability", "proficiency", "expertise"],
        antonyms: ["incompetence", "inability"],
        collocations: [
          {
            phrase: "develop competency",
            definition: "to build skills and abilities",
            example: "Students need to develop competency in critical thinking."
          },
          {
            phrase: "core competency",
            definition: "essential skills or abilities",
            example: "Communication is a core competency for all professionals."
          },
          {
            phrase: "competency assessment",
            definition: "evaluation of skills and abilities",
            example: "Regular competency assessment helps track student progress."
          }
        ],
        difficulty: "intermediate",
        topics: ["education", "skills", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },

      // Health & Wellbeing - Extended Vocabulary
      {
        word: "epidemic",
        pronunciation: "/ˌepɪˈdemɪk/",
        partOfSpeech: "noun",
        definition: "a widespread occurrence of an infectious disease in a community",
        example: "The flu epidemic affected thousands of people last winter.",
        synonyms: ["outbreak", "pandemic", "plague"],
        antonyms: ["endemic", "isolated case"],
        collocations: [
          {
            phrase: "epidemic outbreak",
            definition: "the sudden start of widespread disease",
            example: "Health officials work to prevent epidemic outbreaks."
          },
          {
            phrase: "control epidemic",
            definition: "to manage and stop disease spread",
            example: "Vaccination programs help control epidemic diseases."
          },
          {
            phrase: "epidemic prevention",
            definition: "measures to stop disease outbreaks",
            example: "Good hygiene is essential for epidemic prevention."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "medicine", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "mental health",
        pronunciation: "/ˈmentəl helθ/",
        partOfSpeech: "noun",
        definition: "a person's condition with regard to their psychological and emotional well-being",
        example: "Workplace stress can significantly impact mental health.",
        synonyms: ["psychological health", "emotional wellbeing"],
        antonyms: ["mental illness", "psychological disorder"],
        collocations: [
          {
            phrase: "mental health awareness",
            definition: "understanding and recognition of psychological wellbeing",
            example: "Mental health awareness campaigns reduce stigma and encourage treatment."
          },
          {
            phrase: "mental health support",
            definition: "assistance for psychological wellbeing",
            example: "Schools should provide mental health support for students."
          },
          {
            phrase: "mental health issues",
            definition: "problems related to psychological wellbeing",
            example: "Social media can contribute to mental health issues among teenagers."
          }
        ],
        difficulty: "intermediate",
        topics: ["health", "psychology", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },

      // Economics & Business - Extended Vocabulary
      {
        word: "globalization",
        pronunciation: "/ˌɡləʊbəlaɪˈzeɪʃən/",
        partOfSpeech: "noun",
        definition: "the process by which businesses develop international influence",
        example: "Globalization has connected markets around the world.",
        synonyms: ["internationalization", "worldwide integration"],
        antonyms: ["localization", "isolation"],
        collocations: [
          {
            phrase: "economic globalization",
            definition: "worldwide economic integration",
            example: "Economic globalization has increased trade between countries."
          },
          {
            phrase: "effects of globalization",
            definition: "consequences of worldwide integration",
            example: "The effects of globalization include both opportunities and challenges."
          },
          {
            phrase: "globalization process",
            definition: "the way worldwide integration occurs",
            example: "Technology has accelerated the globalization process."
          }
        ],
        difficulty: "advanced",
        topics: ["economics", "business", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "entrepreneurship",
        pronunciation: "/ˌɒntrəprəˈnɜːʃɪp/",
        partOfSpeech: "noun",
        definition: "the activity of setting up a business, taking financial risks for profit",
        example: "The government encourages entrepreneurship through tax incentives.",
        synonyms: ["business creation", "enterprise", "innovation"],
        antonyms: ["employment", "wage work"],
        collocations: [
          {
            phrase: "promote entrepreneurship",
            definition: "to encourage business creation",
            example: "Universities promote entrepreneurship through startup programs."
          },
          {
            phrase: "entrepreneurship education",
            definition: "teaching business creation skills",
            example: "Entrepreneurship education prepares students for self-employment."
          },
          {
            phrase: "social entrepreneurship",
            definition: "creating businesses to solve social problems",
            example: "Social entrepreneurship combines profit with positive social impact."
          }
        ],
        difficulty: "advanced",
        topics: ["business", "economics", "ielts-writing", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },

      // More Essential Phrasal Verbs for IELTS
      {
        word: "come across",
        pronunciation: "/kʌm əˈkrɒs/",
        partOfSpeech: "phrasal verb",
        definition: "to find or encounter by chance; to seem or appear",
        example: "I came across an interesting article about climate change.",
        synonyms: ["encounter", "find", "discover", "meet"],
        antonyms: ["avoid", "miss"],
        collocations: [
          {
            phrase: "come across information",
            definition: "to find data or facts by chance",
            example: "Researchers often come across unexpected information during studies."
          },
          {
            phrase: "come across as",
            definition: "to appear or seem to be",
            example: "The speaker came across as very knowledgeable about the topic."
          },
          {
            phrase: "come across problems",
            definition: "to encounter difficulties",
            example: "Students may come across problems when learning a new language."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "ielts-speaking", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "look into",
        pronunciation: "/lʊk ˈɪntuː/",
        partOfSpeech: "phrasal verb",
        definition: "to investigate or examine something",
        example: "The government will look into the causes of pollution.",
        synonyms: ["investigate", "examine", "research", "study"],
        antonyms: ["ignore", "overlook"],
        collocations: [
          {
            phrase: "look into the matter",
            definition: "to investigate a situation or problem",
            example: "The committee will look into the matter of student complaints."
          },
          {
            phrase: "look into possibilities",
            definition: "to explore potential options",
            example: "We should look into possibilities for renewable energy."
          },
          {
            phrase: "look into causes",
            definition: "to investigate reasons or origins",
            example: "Scientists look into causes of climate change."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "investigation", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "point out",
        pronunciation: "/pɔɪnt aʊt/",
        partOfSpeech: "phrasal verb",
        definition: "to direct attention to something; to mention or indicate",
        example: "The teacher pointed out the students' mistakes.",
        synonyms: ["indicate", "highlight", "mention", "show"],
        antonyms: ["ignore", "conceal"],
        collocations: [
          {
            phrase: "point out problems",
            definition: "to identify and mention difficulties",
            example: "Critics point out problems with the new education policy."
          },
          {
            phrase: "point out benefits",
            definition: "to highlight advantages",
            example: "Supporters point out benefits of renewable energy."
          },
          {
            phrase: "point out that",
            definition: "to mention or state that",
            example: "Experts point out that exercise improves mental health."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "communication", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "set up",
        pronunciation: "/set ʌp/",
        partOfSpeech: "phrasal verb",
        definition: "to establish or create something; to arrange or organize",
        example: "The company plans to set up a new branch in Asia.",
        synonyms: ["establish", "create", "found", "organize"],
        antonyms: ["dismantle", "close down"],
        collocations: [
          {
            phrase: "set up a business",
            definition: "to start or establish a company",
            example: "Many graduates want to set up their own business."
          },
          {
            phrase: "set up a system",
            definition: "to create or organize a method or process",
            example: "Schools need to set up effective online learning systems."
          },
          {
            phrase: "set up meetings",
            definition: "to arrange or organize gatherings",
            example: "The manager will set up meetings with all department heads."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrasal verbs", "business", "ielts-speaking"],
        createdAt: now,
        updatedAt: now,
      },

      // IELTS Speaking - Opinion and Discussion Vocabulary
      {
        word: "perspective",
        pronunciation: "/pəˈspektɪv/",
        partOfSpeech: "noun",
        definition: "a particular attitude toward or way of regarding something; a point of view",
        example: "From my perspective, education should be free for everyone.",
        synonyms: ["viewpoint", "standpoint", "outlook", "angle"],
        antonyms: [],
        collocations: [
          {
            phrase: "different perspective",
            definition: "an alternative viewpoint or way of thinking",
            example: "Traveling gives you a different perspective on life."
          },
          {
            phrase: "from this perspective",
            definition: "considering this viewpoint",
            example: "From this perspective, the policy makes perfect sense."
          },
          {
            phrase: "broader perspective",
            definition: "a wider or more comprehensive viewpoint",
            example: "We need a broader perspective to solve global problems."
          }
        ],
        difficulty: "intermediate",
        topics: ["opinion", "discussion", "ielts-speaking", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "controversy",
        pronunciation: "/ˈkɒntrəvɜːsi/",
        partOfSpeech: "noun",
        definition: "disagreement or argument about something important",
        example: "The new law has caused considerable controversy.",
        synonyms: ["debate", "dispute", "argument", "disagreement"],
        antonyms: ["agreement", "consensus", "harmony"],
        collocations: [
          {
            phrase: "cause controversy",
            definition: "to create disagreement or debate",
            example: "The politician's comments caused controversy in the media."
          },
          {
            phrase: "avoid controversy",
            definition: "to stay away from disagreement or conflict",
            example: "Companies often try to avoid controversy in their advertising."
          },
          {
            phrase: "controversial issue",
            definition: "a topic that causes disagreement",
            example: "Climate change policies remain a controversial issue."
          }
        ],
        difficulty: "intermediate",
        topics: ["debate", "politics", "ielts-speaking", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },

      // Additional Academic Word List (AWL) - Essential for IELTS Band 6.5
      {
        word: "approach",
        pronunciation: "/əˈprəʊtʃ/",
        partOfSpeech: "noun/verb",
        definition: "a way of dealing with something; to come near or nearer to",
        example: "The government adopted a new approach to education reform.",
        synonyms: ["method", "strategy", "technique", "way"],
        antonyms: ["avoidance", "retreat"],
        collocations: [
          {
            phrase: "systematic approach",
            definition: "an organized and methodical way of doing something",
            example: "A systematic approach to learning vocabulary improves retention."
          },
          {
            phrase: "approach the problem",
            definition: "to deal with or tackle an issue",
            example: "Scientists approach the problem from different angles."
          },
          {
            phrase: "innovative approach",
            definition: "a new and creative method",
            example: "The school uses an innovative approach to language teaching."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "methodology", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "concept",
        pronunciation: "/ˈkɒnsept/",
        partOfSpeech: "noun",
        definition: "an abstract idea or general notion",
        example: "The concept of sustainable development is widely accepted.",
        synonyms: ["idea", "notion", "principle", "theory"],
        antonyms: ["reality", "fact"],
        collocations: [
          {
            phrase: "basic concept",
            definition: "a fundamental idea or principle",
            example: "Students must understand the basic concepts before advancing."
          },
          {
            phrase: "introduce concept",
            definition: "to present or explain a new idea",
            example: "The teacher will introduce the concept of democracy."
          },
          {
            phrase: "abstract concept",
            definition: "an idea that is not concrete or physical",
            example: "Justice is an abstract concept that varies across cultures."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "philosophy", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "establish",
        pronunciation: "/ɪˈstæblɪʃ/",
        partOfSpeech: "verb",
        definition: "to set up on a firm or permanent basis; to prove or demonstrate",
        example: "The university was established in 1850.",
        synonyms: ["found", "create", "set up", "prove"],
        antonyms: ["destroy", "abolish", "disprove"],
        collocations: [
          {
            phrase: "establish relationship",
            definition: "to create or build connections",
            example: "Countries work to establish diplomatic relationships."
          },
          {
            phrase: "establish credibility",
            definition: "to build trust and reliability",
            example: "New businesses must establish credibility with customers."
          },
          {
            phrase: "establish guidelines",
            definition: "to create rules or principles",
            example: "The committee will establish guidelines for research ethics."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "business", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "factor",
        pronunciation: "/ˈfæktə/",
        partOfSpeech: "noun",
        definition: "a circumstance or element that contributes to a particular result",
        example: "Climate is an important factor in agricultural productivity.",
        synonyms: ["element", "component", "aspect", "influence"],
        antonyms: [],
        collocations: [
          {
            phrase: "key factor",
            definition: "an important element or influence",
            example: "Education is a key factor in economic development."
          },
          {
            phrase: "contributing factor",
            definition: "something that helps cause a result",
            example: "Stress is a contributing factor to many health problems."
          },
          {
            phrase: "external factor",
            definition: "an outside influence or element",
            example: "External factors like weather affect crop yields."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "analysis", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "indicate",
        pronunciation: "/ˈɪndɪkeɪt/",
        partOfSpeech: "verb",
        definition: "to point out or show; to be a sign or symptom of",
        example: "Research indicates that exercise improves mental health.",
        synonyms: ["show", "suggest", "demonstrate", "reveal"],
        antonyms: ["conceal", "hide"],
        collocations: [
          {
            phrase: "clearly indicate",
            definition: "to show something obviously",
            example: "The data clearly indicates an upward trend."
          },
          {
            phrase: "indicate that",
            definition: "to show or suggest that something is true",
            example: "Studies indicate that reading improves vocabulary."
          },
          {
            phrase: "indicate direction",
            definition: "to show which way to go",
            example: "Road signs indicate the direction to the city center."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "research", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "method",
        pronunciation: "/ˈmeθəd/",
        partOfSpeech: "noun",
        definition: "a particular form of procedure for accomplishing something",
        example: "Scientists use various methods to conduct experiments.",
        synonyms: ["technique", "approach", "way", "procedure"],
        antonyms: ["chaos", "disorder"],
        collocations: [
          {
            phrase: "effective method",
            definition: "a successful way of doing something",
            example: "Repetition is an effective method for learning vocabulary."
          },
          {
            phrase: "teaching method",
            definition: "a way of instructing students",
            example: "Interactive teaching methods engage students more effectively."
          },
          {
            phrase: "research method",
            definition: "a systematic way of investigating",
            example: "Qualitative research methods provide detailed insights."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "methodology", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "occur",
        pronunciation: "/əˈkɜː/",
        partOfSpeech: "verb",
        definition: "to happen; to take place",
        example: "Natural disasters occur more frequently due to climate change.",
        synonyms: ["happen", "take place", "arise", "emerge"],
        antonyms: ["cease", "stop"],
        collocations: [
          {
            phrase: "frequently occur",
            definition: "to happen often",
            example: "Traffic jams frequently occur during rush hour."
          },
          {
            phrase: "naturally occur",
            definition: "to happen without human intervention",
            example: "These minerals naturally occur in mountain regions."
          },
          {
            phrase: "occur simultaneously",
            definition: "to happen at the same time",
            example: "Multiple events can occur simultaneously in complex systems."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "events", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "process",
        pronunciation: "/ˈprəʊses/",
        partOfSpeech: "noun/verb",
        definition: "a series of actions or steps; to perform operations on data",
        example: "The manufacturing process has been improved significantly.",
        synonyms: ["procedure", "method", "system", "operation"],
        antonyms: ["stagnation", "inactivity"],
        collocations: [
          {
            phrase: "learning process",
            definition: "the way knowledge is acquired",
            example: "The learning process varies from person to person."
          },
          {
            phrase: "decision-making process",
            definition: "the steps involved in making choices",
            example: "The decision-making process should involve all stakeholders."
          },
          {
            phrase: "manufacturing process",
            definition: "the steps in producing goods",
            example: "Automation has revolutionized the manufacturing process."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "business", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "require",
        pronunciation: "/rɪˈkwaɪə/",
        partOfSpeech: "verb",
        definition: "to need for a particular purpose; to demand as necessary",
        example: "This job requires excellent communication skills.",
        synonyms: ["need", "demand", "necessitate", "call for"],
        antonyms: ["provide", "supply"],
        collocations: [
          {
            phrase: "require attention",
            definition: "to need focus or care",
            example: "Environmental issues require immediate attention."
          },
          {
            phrase: "require effort",
            definition: "to need work or energy",
            example: "Learning a language requires consistent effort."
          },
          {
            phrase: "require approval",
            definition: "to need official permission",
            example: "New policies require approval from the board."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "requirements", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "structure",
        pronunciation: "/ˈstrʌktʃə/",
        partOfSpeech: "noun/verb",
        definition: "the arrangement of parts in something; to organize or arrange",
        example: "The essay has a clear structure with introduction, body, and conclusion.",
        synonyms: ["organization", "framework", "arrangement", "system"],
        antonyms: ["chaos", "disorder"],
        collocations: [
          {
            phrase: "organizational structure",
            definition: "the way a company or group is arranged",
            example: "The company's organizational structure promotes efficiency."
          },
          {
            phrase: "social structure",
            definition: "the organization of society",
            example: "Education can change social structure over time."
          },
          {
            phrase: "sentence structure",
            definition: "the way words are arranged in sentences",
            example: "Good sentence structure improves writing clarity."
          }
        ],
        difficulty: "intermediate",
        topics: ["academic", "organization", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },

      // IELTS Band 6.5 - Advanced Collocations and Expressions
      {
        word: "take into account",
        pronunciation: "/teɪk ˈɪntuː əˈkaʊnt/",
        partOfSpeech: "phrase",
        definition: "to consider something when making a decision or judgment",
        example: "We must take into account the environmental impact of our actions.",
        synonyms: ["consider", "factor in", "bear in mind"],
        antonyms: ["ignore", "overlook"],
        collocations: [
          {
            phrase: "take into account factors",
            definition: "to consider various elements",
            example: "Employers take into account many factors when hiring."
          },
          {
            phrase: "fail to take into account",
            definition: "to not consider important elements",
            example: "The plan failed because it didn't take into account local conditions."
          },
          {
            phrase: "must take into account",
            definition: "it is necessary to consider",
            example: "Policymakers must take into account public opinion."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrases", "decision-making", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "in terms of",
        pronunciation: "/ɪn tɜːmz ɒv/",
        partOfSpeech: "phrase",
        definition: "with regard to; concerning",
        example: "In terms of cost, this option is the most economical.",
        synonyms: ["regarding", "concerning", "with respect to"],
        antonyms: [],
        collocations: [
          {
            phrase: "in terms of quality",
            definition: "regarding the standard or grade",
            example: "In terms of quality, this product exceeds expectations."
          },
          {
            phrase: "in terms of time",
            definition: "regarding duration or schedule",
            example: "In terms of time, the project is ahead of schedule."
          },
          {
            phrase: "in terms of benefits",
            definition: "regarding advantages or positive aspects",
            example: "In terms of benefits, renewable energy offers many advantages."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrases", "comparison", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      },
      {
        word: "as a result of",
        pronunciation: "/æz ə rɪˈzʌlt ɒv/",
        partOfSpeech: "phrase",
        definition: "because of; due to",
        example: "As a result of the pandemic, many people started working from home.",
        synonyms: ["due to", "because of", "owing to"],
        antonyms: ["despite", "regardless of"],
        collocations: [
          {
            phrase: "as a result of changes",
            definition: "because of modifications or alterations",
            example: "As a result of policy changes, unemployment decreased."
          },
          {
            phrase: "as a result of research",
            definition: "because of scientific investigation",
            example: "As a result of medical research, new treatments were developed."
          },
          {
            phrase: "as a result of efforts",
            definition: "because of hard work or attempts",
            example: "As a result of conservation efforts, the species was saved."
          }
        ],
        difficulty: "intermediate",
        topics: ["phrases", "cause-effect", "ielts-writing"],
        createdAt: now,
        updatedAt: now,
      }
    ];
  }
}