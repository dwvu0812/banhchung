import { Vocabulary } from '../types';

export const FALLBACK_VOCABULARY_IMAGE =
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=60';

const slugifyForAudio = (word: string): string => {
  const normalized = word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || normalized
    || word.toLowerCase();
};

export const buildVocabularyAudioUrl = (word: string): string => {
  const slug = slugifyForAudio(word);
  return `https://api.dictionaryapi.dev/media/pronunciations/en/${slug}-us.mp3`;
};

export const buildVocabularyImageUrl = (vocabulary: Vocabulary): string => {
  const provided = vocabulary.imageUrl?.trim();
  if (provided) {
    return provided;
  }

  const keywordParts = [vocabulary.word, ...vocabulary.topics, vocabulary.difficulty]
    .filter(Boolean)
    .join(' ');

  const query = encodeURIComponent(keywordParts || vocabulary.word);
  return `https://source.unsplash.com/featured/400x300?${query}`;
};

export const resolveVocabularyImageUrl = (vocabulary: Vocabulary): string => {
  return buildVocabularyImageUrl(vocabulary) || FALLBACK_VOCABULARY_IMAGE;
};

export const resolveVocabularyAudioUrl = (vocabulary: Vocabulary): string => {
  const provided = vocabulary.audioUrl?.trim();
  if (provided) {
    return provided;
  }

  return buildVocabularyAudioUrl(vocabulary.word);
};
