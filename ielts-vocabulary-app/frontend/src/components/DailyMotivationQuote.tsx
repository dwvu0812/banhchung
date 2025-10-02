import React, { useEffect, useState } from 'react';
import {
  MotivationQuote,
  fetchGoogleMotivationQuote,
  getFallbackQuote,
} from '../lib/motivationalQuotes';
import { cn } from '../lib/utils';

interface DailyMotivationQuoteProps {
  className?: string;
}

const DailyMotivationQuote: React.FC<DailyMotivationQuoteProps> = ({ className }) => {
  const [quote, setQuote] = useState<MotivationQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const storageKey = 'daily-motivation-quote';

    const loadQuote = async () => {
      if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
        const fallbackQuote = getFallbackQuote();
        setQuote(fallbackQuote);
        setIsLoading(false);
        return;
      }

      const todayKey = new Date().toISOString().split('T')[0];

      try {
        const cached = localStorage.getItem(storageKey);

        if (cached) {
          const parsed = JSON.parse(cached) as { quote: MotivationQuote; date: string };

          if (parsed?.date === todayKey) {
            setQuote(parsed.quote);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Unable to read cached motivation quote', error);
      }

      try {
        const googleQuote = await fetchGoogleMotivationQuote();

        if (!isMounted) {
          return;
        }

        setQuote(googleQuote);

        try {
          localStorage.setItem(storageKey, JSON.stringify({ quote: googleQuote, date: todayKey }));
        } catch (error) {
          console.warn('Unable to cache Google motivation quote', error);
        }
      } catch (error) {
        console.warn('Falling back to local motivation quote list', error);

        if (!isMounted) {
          return;
        }

        const fallbackQuote = getFallbackQuote();
        setQuote(fallbackQuote);

        try {
          localStorage.setItem(storageKey, JSON.stringify({ quote: fallbackQuote, date: todayKey }));
        } catch (storageError) {
          console.warn('Unable to cache fallback motivation quote', storageError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadQuote();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <figure
      className={cn(
        'rounded-2xl border border-slate-200 bg-white/90 p-6 text-slate-700 shadow-sm backdrop-blur',
        className,
      )}
    >
      <blockquote className="text-base italic leading-relaxed text-slate-800 sm:text-lg">
        {isLoading ? (
          <span className="inline-flex animate-pulse select-none rounded bg-slate-200/80 px-2 py-1 text-transparent">
            Loading daily motivation…
          </span>
        ) : (
          <>“{quote?.text ?? 'Keep moving forward.'}”</>
        )}
      </blockquote>
      {!isLoading && quote?.author ? (
        <figcaption className="mt-4 text-sm font-medium text-slate-500">— {quote.author}</figcaption>
      ) : null}
    </figure>
  );
};

export default DailyMotivationQuote;
