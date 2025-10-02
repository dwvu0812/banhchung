import { useCallback, useEffect, useState } from 'react';

interface StudyStreakState {
  currentStreak: number;
  bestStreak: number;
  lastCheckIn: string | null;
}

const STORAGE_KEY = 'study-streak';

const defaultState: StudyStreakState = {
  currentStreak: 0,
  bestStreak: 0,
  lastCheckIn: null,
};

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isPreviousDay = (referenceDate: string, currentDate: string) => {
  const [year, month, day] = referenceDate.split('-').map(Number);
  const reference = new Date(year, (month ?? 1) - 1, day ?? 1);
  reference.setDate(reference.getDate() + 1);
  return getLocalDateString(reference) === currentDate;
};

const useStudyStreak = () => {
  const [state, setState] = useState<StudyStreakState>(defaultState);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<StudyStreakState>;
        const today = getLocalDateString(new Date());
        const hydratedState: StudyStreakState = {
          currentStreak: parsed.currentStreak ?? 0,
          bestStreak: parsed.bestStreak ?? 0,
          lastCheckIn: parsed.lastCheckIn ?? null,
        };

        const shouldResetStreak = (() => {
          if (!hydratedState.lastCheckIn) {
            return false;
          }
          if (hydratedState.lastCheckIn === today) {
            return false;
          }
          return !isPreviousDay(hydratedState.lastCheckIn, today);
        })();

        const nextState: StudyStreakState = shouldResetStreak
          ? { ...hydratedState, currentStreak: 0 }
          : hydratedState;

        if (shouldResetStreak) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
          } catch (error) {
            console.error('Failed to update study streak after reset', error);
          }
        }

        setState(nextState);
        setIsCheckedInToday(nextState.lastCheckIn === today);
      } else {
        setState(defaultState);
        setIsCheckedInToday(false);
      }
    } catch (error) {
      console.error('Failed to load study streak from storage', error);
      setState(defaultState);
      setIsCheckedInToday(false);
    }
  }, []);

  useEffect(() => {
    const today = getLocalDateString(new Date());
    setIsCheckedInToday(state.lastCheckIn === today);
  }, [state.lastCheckIn]);

  const checkIn = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setState((previous) => {
      const today = getLocalDateString(new Date());

      if (previous.lastCheckIn === today) {
        setIsCheckedInToday(true);
        return previous;
      }

      let currentStreak = 1;
      if (previous.lastCheckIn && isPreviousDay(previous.lastCheckIn, today)) {
        currentStreak = previous.currentStreak + 1;
      }

      const nextState: StudyStreakState = {
        currentStreak,
        bestStreak: Math.max(currentStreak, previous.bestStreak),
        lastCheckIn: today,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch (error) {
        console.error('Failed to save study streak to storage', error);
      }

      setIsCheckedInToday(true);
      return nextState;
    });
  }, []);

  return {
    currentStreak: state.currentStreak,
    bestStreak: state.bestStreak,
    lastCheckIn: state.lastCheckIn,
    isCheckedInToday,
    checkIn,
  };
};

export default useStudyStreak;
