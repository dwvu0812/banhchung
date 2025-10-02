export interface MotivationQuote {
  text: string;
  author: string;
}

const fallbackQuotes: MotivationQuote[] = [
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'Believe you can and you are halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'Great things are done by a series of small things brought together.', author: 'Vincent van Gogh' },
  { text: 'Every day is a chance to get better. Don’t waste it.', author: 'Unknown' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Small progress is still progress.', author: 'Unknown' },
  { text: 'Dream big. Start small. Act now.', author: 'Robin Sharma' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
  { text: 'You don’t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'What you do today can improve all your tomorrows.', author: 'Ralph Marston' },
  { text: 'Your limitation—it is only your imagination.', author: 'Unknown' },
  { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'Well done is better than well said.', author: 'Benjamin Franklin' },
];

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const getDayOfYear = (date: Date) => {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / ONE_DAY_MS);
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ');

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity) => {
    if (entity.startsWith('&#x')) {
      return String.fromCharCode(parseInt(entity.slice(3, -1), 16));
    }

    if (entity.startsWith('&#')) {
      return String.fromCharCode(parseInt(entity.slice(2, -1), 10));
    }

    switch (entity) {
      case '&quot;':
        return '"';
      case '&apos;':
      case '&#39;':
        return "'";
      case '&amp;':
        return '&';
      case '&lt;':
        return '<';
      case '&gt;':
        return '>';
      default:
        return entity;
    }
  });

const normaliseQuoteText = (value: string) => {
  const cleaned = decodeHtmlEntities(stripHtml(value)).replace(/\s+/g, ' ').trim();

  return cleaned
    .replace(/^…\s*/u, '')
    .replace(/\s*…$/u, '')
    .replace(/^"|"$/g, '')
    .replace(/^'|'$/g, '');
};

const googleBooksEndpoint = 'https://www.googleapis.com/books/v1/volumes';

type GoogleBooksItem = {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    description?: string;
  };
  searchInfo?: {
    textSnippet?: string;
  };
};

const isReasonableLength = (text: string) => text.length >= 40 && text.length <= 240;

const mapItemToQuote = (item: GoogleBooksItem): MotivationQuote | null => {
  const rawText = item.searchInfo?.textSnippet ?? item.volumeInfo?.description;

  if (!rawText) {
    return null;
  }

  const text = normaliseQuoteText(rawText);

  if (!text || !isReasonableLength(text)) {
    return null;
  }

  const author = item.volumeInfo?.authors?.[0] ?? item.volumeInfo?.title ?? 'Unknown';

  return {
    text,
    author,
  };
};

export const fetchGoogleMotivationQuote = async (date: Date = new Date()): Promise<MotivationQuote> => {
  const params = new URLSearchParams({
    q: '"motivational quote" OR "inspirational quote"',
    langRestrict: 'en',
    maxResults: '30',
    printType: 'books',
    orderBy: 'relevance',
    fields: 'items(volumeInfo/title,volumeInfo/authors,volumeInfo/description,searchInfo/textSnippet)',
  });

  const headers: Record<string, string> = {};

  if (process.env.REACT_APP_GOOGLE_BOOKS_API_KEY) {
    headers['X-Goog-Api-Key'] = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
  }

  const response = await fetch(`${googleBooksEndpoint}?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch quote from Google Books');
  }

  const payload = (await response.json()) as { items?: GoogleBooksItem[] };
  const googleQuotes = (payload.items ?? []).map(mapItemToQuote).filter(Boolean) as MotivationQuote[];

  if (googleQuotes.length === 0) {
    throw new Error('Google Books response did not contain quotes');
  }

  const dayOfYear = getDayOfYear(date);
  const index = ((dayOfYear % googleQuotes.length) + googleQuotes.length) % googleQuotes.length;
  return googleQuotes[index];
};

export const getFallbackQuote = (date: Date = new Date()): MotivationQuote => {
  if (fallbackQuotes.length === 0) {
    return { text: 'Keep moving forward.', author: 'Unknown' };
  }

  const dayOfYear = getDayOfYear(date);
  const index = ((dayOfYear % fallbackQuotes.length) + fallbackQuotes.length) % fallbackQuotes.length;
  return fallbackQuotes[index];
};

export default fallbackQuotes;
