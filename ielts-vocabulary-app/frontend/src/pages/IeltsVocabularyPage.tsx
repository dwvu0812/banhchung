import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { vocabularyAPI, userAPI } from '../services/api';
import { Vocabulary, UserProgress } from '../types';
import { BookOpen, Target, Users, Lightbulb, Volume2, Search, Loader2, Clock } from 'lucide-react';
import { resolveVocabularyAudioUrl, resolveVocabularyImageUrl, FALLBACK_VOCABULARY_IMAGE } from '../lib/media';

type SortOption = 'default' | 'mastery-desc' | 'mastery-asc' | 'due-date';

const IeltsVocabularyPage: React.FC = () => {
  const [vocabularyItems, setVocabularyItems] = useState<Vocabulary[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    totalPages: number;
  }>({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  const ieltsTopics = [
    { key: 'ielts-writing', label: 'IELTS Writing', icon: '✍️', description: 'Essential vocabulary for Task 1 & 2' },
    { key: 'ielts-speaking', label: 'IELTS Speaking', icon: '🗣️', description: 'Key phrases for all speaking parts' },
    { key: 'environment', label: 'Environment', icon: '🌱', description: 'Climate change, sustainability' },
    { key: 'technology', label: 'Technology', icon: '💻', description: 'Digital age, AI, innovation' },
    { key: 'education', label: 'Education', icon: '🎓', description: 'Learning, curriculum, pedagogy' },
    { key: 'health', label: 'Health', icon: '🏥', description: 'Lifestyle, mental health, wellness' },
    { key: 'business', label: 'Business', icon: '💼', description: 'Economics, entrepreneurship' },
    { key: 'phrasal verbs', label: 'Phrasal Verbs', icon: '🔗', description: 'Essential phrasal verbs for Band 6.5' },
  ];

  const difficultyLevels = [
    { key: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800', description: 'Foundation level' },
    { key: 'intermediate', label: 'Intermediate', color: 'bg-blue-100 text-blue-800', description: 'Band 5.5-6.5' },
    { key: 'advanced', label: 'Advanced', color: 'bg-purple-100 text-purple-800', description: 'Band 7.0+' },
  ];

  const loadTopics = useCallback(async () => {
    try {
      const topicList = await vocabularyAPI.getTopics();
      setTopics(topicList);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  }, []);

  const loadUserProgress = useCallback(async () => {
    try {
      const progressList = await userAPI.getProgress();
      const map: Record<string, UserProgress> = {};

      progressList.forEach((progress: UserProgress) => {
        const vocabularyId = (progress as any).vocabularyId?.toString?.() ?? progress.vocabularyId;
        if (vocabularyId) {
          map[vocabularyId] = {
            ...progress,
            vocabularyId,
          };
        }
      });

      setProgressMap(map);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, []);

  const fetchVocabulary = useCallback(
    async (pageToLoad: number = 1, append = false) => {
      const isInitialPage = pageToLoad === 1;
      const limit = 30;
      const topicParam = selectedTopic !== 'all' ? selectedTopic : undefined;
      const difficultyParam = selectedDifficulty !== 'all' ? selectedDifficulty : undefined;

      try {
        if (isInitialPage) {
          setLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        let response;

        if (debouncedSearchTerm) {
          response = await vocabularyAPI.search(debouncedSearchTerm, {
            page: pageToLoad,
            limit,
            topic: topicParam,
            difficulty: difficultyParam,
          });
        } else {
          const params: any = {
            page: pageToLoad,
            limit,
          };

          if (topicParam) params.topic = topicParam;
          if (difficultyParam) params.difficulty = difficultyParam;

          response = await vocabularyAPI.getAll(params);
        }

        const { data, total, totalPages } = response;

        setPagination({
          total,
          page: pageToLoad,
          totalPages,
        });

        setHasMore(pageToLoad < totalPages);
        setCurrentPage(pageToLoad);

        setVocabularyItems((prev) => {
          if (!append) {
            return data;
          }

          const existingIds = new Set(prev.map((item) => item._id));
          const merged = [...prev];

          data.forEach((item: Vocabulary) => {
            if (!existingIds.has(item._id)) {
              merged.push(item);
            }
          });

          return merged;
        });
      } catch (error) {
        console.error('Error loading vocabulary:', error);
        if (!append) {
          setVocabularyItems([]);
          setPagination({ total: 0, page: 1, totalPages: 1 });
        }
        setHasMore(false);
      } finally {
        if (isInitialPage) {
          setLoading(false);
        } else {
          setIsFetchingMore(false);
        }
      }
    },
    [debouncedSearchTerm, selectedDifficulty, selectedTopic]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchVocabulary(1, false);
  }, [fetchVocabulary]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && !isFetchingMore) {
          fetchVocabulary(currentPage + 1, true);
        }
      },
      {
        rootMargin: '200px',
      }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasMore, loading, isFetchingMore, fetchVocabulary, currentPage]);

  const handleSeedIeltsVocabulary = async () => {
    try {
      setSeeding(true);
      await vocabularyAPI.seedIeltsVocabulary();
      alert('IELTS vocabulary đã được thêm thành công!');
      await fetchVocabulary(1, false);
      await loadTopics();
    } catch (error) {
      console.error('Error seeding vocabulary:', error);
      alert('Có lỗi xảy ra khi thêm từ vựng IELTS');
    } finally {
      setSeeding(false);
    }
  };

  const speakWordWithSpeechSynthesis = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }, []);

  const playPronunciation = useCallback((vocabulary: Vocabulary) => {
    const audioUrl = resolveVocabularyAudioUrl(vocabulary);

    if (typeof Audio !== 'undefined' && audioUrl) {
      const cacheKey = vocabulary._id;
      const cache = audioElementsRef.current;
      let audioElement = cache[cacheKey];

      if (!audioElement || audioElement.src !== audioUrl) {
        audioElement = new Audio(audioUrl);
        audioElement.onerror = () => {
          speakWordWithSpeechSynthesis(vocabulary.word);
        };
        cache[cacheKey] = audioElement;
      }

      audioElement.currentTime = 0;
      const playPromise = audioElement.play();
      if (playPromise?.catch) {
        playPromise.catch(() => speakWordWithSpeechSynthesis(vocabulary.word));
      }
      return;
    }

    speakWordWithSpeechSynthesis(vocabulary.word);
  }, [speakWordWithSpeechSynthesis]);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    if (event.currentTarget.src !== FALLBACK_VOCABULARY_IMAGE) {
      event.currentTarget.src = FALLBACK_VOCABULARY_IMAGE;
    }
  }, []);

  const getTopicInfo = (topicKey: string) => {
    return ieltsTopics.find(t => t.key === topicKey) || { 
      key: topicKey, 
      label: topicKey, 
      icon: '📚', 
      description: 'General vocabulary' 
    };
  };

  const getDifficultyInfo = (difficulty: string) => {
    return difficultyLevels.find(d => d.key === difficulty) || difficultyLevels[1];
  };

  const getProgressForVocabulary = (vocabularyId: string) => {
    return progressMap[vocabularyId];
  };

  const getLearningStatus = (vocabularyId: string) => {
    const progress = getProgressForVocabulary(vocabularyId);

    if (!progress) {
      return {
        label: 'Chưa học',
        color: 'bg-gray-100 text-gray-700',
        description: 'Bắt đầu học để thêm từ này vào lộ trình ôn tập.',
      };
    }

    const now = new Date();
    const nextReviewDate = progress.nextReviewDate ? new Date(progress.nextReviewDate) : null;

    if (nextReviewDate && nextReviewDate <= now) {
      return {
        label: 'Đến hạn ôn',
        color: 'bg-red-100 text-red-700',
        description: 'Từ này đang chờ bạn ôn lại.',
      };
    }

    if (progress.level >= 4) {
      return {
        label: 'Đã thành thạo',
        color: 'bg-green-100 text-green-700',
        description: 'Bạn đã trả lời chính xác nhiều lần, hãy duy trì phong độ!'
      };
    }

    if (progress.level >= 2) {
      return {
        label: 'Đang tiến bộ',
        color: 'bg-blue-100 text-blue-700',
        description: 'Bạn đang ghi nhớ tốt, tiếp tục ôn tập để đạt thành thạo.'
      };
    }

    return {
      label: 'Mới học',
      color: 'bg-amber-100 text-amber-700',
      description: 'Bạn vừa bắt đầu làm quen với từ này.',
    };
  };

  const getNextReviewHint = (progress?: UserProgress) => {
    if (!progress?.nextReviewDate) return null;
    const nextReview = new Date(progress.nextReviewDate);

    if (Number.isNaN(nextReview.getTime())) return null;

    const now = new Date();

    if (nextReview <= now) {
      return 'Đến hạn ôn';
    }

    const diffMs = nextReview.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      const hours = Math.max(diffHours, 1);
      return `~${hours} giờ nữa`;
    }

    const diffDays = Math.round(diffHours / 24);
    return `~${diffDays} ngày nữa`;
  };

  const sortedVocabulary = useMemo(() => {
    const items = [...vocabularyItems];

    const getProgressLevel = (vocabularyId: string) => {
      const progress = progressMap[vocabularyId];
      return progress ? progress.level : -1;
    };

    const getNextReviewTime = (vocabularyId: string) => {
      const progress = progressMap[vocabularyId];
      if (!progress?.nextReviewDate) return Number.POSITIVE_INFINITY;
      const nextReview = new Date(progress.nextReviewDate);
      if (Number.isNaN(nextReview.getTime())) return Number.POSITIVE_INFINITY;
      return nextReview.getTime();
    };

    switch (sortOption) {
      case 'mastery-desc':
        return items.sort((a, b) => getProgressLevel(b._id) - getProgressLevel(a._id));
      case 'mastery-asc':
        return items.sort((a, b) => getProgressLevel(a._id) - getProgressLevel(b._id));
      case 'due-date':
        return items.sort((a, b) => getNextReviewTime(a._id) - getNextReviewTime(b._id));
      default:
        return items;
    }
  }, [sortOption, vocabularyItems, progressMap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-sky-100 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                <BookOpen className="h-3.5 w-3.5" /> IELTS Vocabulary Pack
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Gói từ vựng IELTS Band 6.5
              </h1>
              <p className="max-w-xl text-sm text-slate-500">
                Bộ sưu tập từ vựng chuyên biệt cho kỳ thi IELTS với các chủ đề trọng tâm, mức độ rõ ràng và hệ thống ôn luyện khoa học.
              </p>
            </div>
            <Button
              onClick={handleSeedIeltsVocabulary}
              disabled={seeding}
              className="h-12 rounded-full bg-sky-500 px-6 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:bg-sky-600 disabled:shadow-none"
            >
              {seeding ? 'Đang thêm...' : '+ Thêm từ vựng IELTS'}
            </Button>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-sky-100/60 bg-sky-50/80 p-5 text-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-inner">
                  <BookOpen className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">{pagination.total || 0}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Tổng từ vựng</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100/60 bg-emerald-50/80 p-5 text-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-inner">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">6.5</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Mục tiêu Band</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-100/60 bg-amber-50/80 p-5 text-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-inner">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">{topics.length}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Chủ đề</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-violet-100/60 bg-violet-50/80 p-5 text-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-inner">
                  <Lightbulb className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">3</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Cấp độ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="Tìm kiếm từ vựng, định nghĩa hoặc từ đồng nghĩa..."
                className="w-full rounded-full border border-white/70 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-600 shadow-inner transition placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-100"
              />
              {debouncedSearchTerm && (
                <p className="mt-2 text-xs text-slate-500">
                  Đang hiển thị kết quả cho "{debouncedSearchTerm}"
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sắp xếp theo mức độ thành thạo
              </label>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="w-full rounded-full border border-white/70 bg-white/80 py-3 px-4 text-sm text-slate-600 shadow-inner transition focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-100 md:w-64"
              >
                <option value="default">Mặc định (theo thời gian thêm)</option>
                <option value="mastery-desc">Độ thành thạo cao → thấp</option>
                <option value="mastery-asc">Độ thành thạo thấp → cao</option>
                <option value="due-date">Đến hạn ôn sớm nhất</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Topic Filter */}
            <Card className="border-none bg-white/80 shadow-lg shadow-sky-100">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-lg text-slate-800">Chủ đề trọng tâm</CardTitle>
                <p className="text-sm text-slate-500">
                  Chọn chủ đề bạn muốn tập trung để hệ thống lọc ra các từ liên quan nhất.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedTopic('all')}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                      selectedTopic === 'all'
                        ? 'border-sky-300 bg-sky-100/80 text-sky-700 shadow-sm'
                        : 'border-white/80 bg-white hover:border-sky-200 hover:bg-sky-50/70'
                    }`}
                  >
                    <div className="font-semibold text-slate-800">📚 Tất cả</div>
                    <div className="mt-1 text-xs text-slate-500">Toàn bộ từ vựng</div>
                  </button>
                  {ieltsTopics.map((topic) => (
                    <button
                      key={topic.key}
                      onClick={() => setSelectedTopic(topic.key)}
                      className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${
                        selectedTopic === topic.key
                          ? 'border-sky-300 bg-sky-100/80 text-sky-700 shadow-sm'
                          : 'border-white/80 bg-white hover:border-sky-200 hover:bg-sky-50/70'
                      }`}
                    >
                      <div className="font-semibold text-slate-800">{topic.icon} {topic.label}</div>
                      <div className="mt-1 text-xs text-slate-500">{topic.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Filter */}
            <Card className="border-none bg-white/80 shadow-lg shadow-emerald-100">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-lg text-slate-800">Cấp độ phù hợp</CardTitle>
                <p className="text-sm text-slate-500">
                  Lọc theo độ khó để khớp với mục tiêu band hiện tại của bạn.
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`w-full rounded-2xl border px-5 py-4 text-left text-sm transition ${
                    selectedDifficulty === 'all'
                      ? 'border-emerald-300 bg-emerald-100/80 text-emerald-700 shadow-sm'
                      : 'border-white/80 bg-white hover:border-emerald-200 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="font-semibold text-slate-800">🎯 Tất cả cấp độ</div>
                  <div className="mt-1 text-xs text-slate-500">Từ cơ bản đến nâng cao</div>
                </button>
                {difficultyLevels.map((level) => (
                  <button
                    key={level.key}
                    onClick={() => setSelectedDifficulty(level.key)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-sm transition ${
                      selectedDifficulty === level.key
                        ? 'border-emerald-300 bg-emerald-100/80 text-emerald-700 shadow-sm'
                        : 'border-white/80 bg-white hover:border-emerald-200 hover:bg-emerald-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-800">{level.label}</div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${level.color}`}>
                        {level.description}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {level.key === 'beginner'
                        ? 'Các khái niệm nền tảng giúp bạn bắt đầu.'
                        : level.key === 'intermediate'
                        ? 'Mở rộng vốn từ cho các band mục tiêu 5.5 - 6.5.'
                        : 'Thử thách cao hơn để chinh phục band 7.0+'}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vocabulary List */}
        <Card className="border-none bg-white/80 shadow-xl shadow-slate-200">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl text-slate-900">Danh sách từ vựng</CardTitle>
                <p className="text-sm text-slate-500">
                  {selectedTopic !== 'all' ? getTopicInfo(selectedTopic).label : 'Tất cả chủ đề'} ·
                  {' '}
                  {selectedDifficulty !== 'all' ? getDifficultyInfo(selectedDifficulty).label : 'Mọi cấp độ'}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {pagination.total || 0} từ vựng
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="flex justify-center py-10 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : sortedVocabulary.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="font-medium">Không tìm thấy từ vựng phù hợp.</p>
                <p className="mt-2 text-sm text-slate-400">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedVocabulary.map((vocab) => {
                  const difficultyInfo = getDifficultyInfo(vocab.difficulty);
                  const progress = getProgressForVocabulary(vocab._id);
                  const status = getLearningStatus(vocab._id);
                  const nextReviewHint = getNextReviewHint(progress);
                  const imageUrl = resolveVocabularyImageUrl(vocab);

                  return (
                    <Card
                      key={vocab._id}
                      className="border border-slate-100/60 bg-white/90 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-5 md:flex-row">
                          <div className="overflow-hidden rounded-2xl bg-slate-100/80 shadow-inner md:w-48 lg:w-56">
                            <img
                              src={imageUrl}
                              alt={`Minh họa cho từ ${vocab.word}`}
                              className="h-40 w-full object-cover transition duration-500 ease-out hover:scale-105 md:h-full"
                              loading="lazy"
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                                {status.label}
                              </span>
                              {nextReviewHint && (
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                  <Clock className="h-3.5 w-3.5" />
                                  {nextReviewHint}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="min-w-[12rem] flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-2xl font-semibold text-slate-900">{vocab.word}</h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playPronunciation(vocab)}
                                    className="h-7 w-7 rounded-full text-slate-500 hover:bg-slate-100"
                                  >
                                    <Volume2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">Nghe phát âm</span>
                                  </Button>
                                </div>
                                <p className="text-sm text-slate-400">{vocab.pronunciation}</p>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                  {vocab.partOfSpeech}
                                </span>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyInfo.color}`}>
                                {difficultyInfo.label}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <p className="text-sm leading-relaxed text-slate-600">{vocab.definition}</p>
                              <p className="text-xs text-slate-400">{status.description}</p>

                              {progress ? (
                                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                  <span className="font-medium text-slate-600">
                                    Cấp độ SRS: {progress.level}
                                  </span>
                                  <span>Đúng: {progress.correctCount}</span>
                                  <span>Sai: {progress.incorrectCount}</span>
                                </div>
                              ) : (
                                <div className="text-xs text-slate-400">Chưa có thống kê ôn tập.</div>
                              )}
                            </div>

                            <div className="rounded-2xl bg-slate-50/80 p-3 text-sm italic text-slate-500">
                              “{vocab.example}”
                            </div>

                            {vocab.collocations.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Collocations tiêu biểu
                                </h4>
                                <div className="space-y-2">
                                  {vocab.collocations.slice(0, 2).map((collocation, index) => (
                                    <div key={index} className="rounded-xl bg-white/80 p-2 text-xs text-slate-500 shadow-inner">
                                      <span className="font-semibold text-sky-600">{collocation.phrase}</span>
                                      <p className="mt-1 text-slate-400">{collocation.definition}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {vocab.topics.slice(0, 3).map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600"
                                >
                                  {getTopicInfo(topic).icon} {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            {hasMore && (
              <div ref={loadMoreRef} className="py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  {isFetchingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang tải thêm từ vựng...</span>
                    </>
                  ) : (
                    <span>Kéo xuống để tải thêm...</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IeltsVocabularyPage;