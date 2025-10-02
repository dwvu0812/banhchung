import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { vocabularyAPI, userAPI } from '../services/api';
import { Vocabulary, UserProgress } from '../types';
import { BookOpen, Target, Users, Lightbulb, Volume2, Search, Loader2, Clock } from 'lucide-react';

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

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📚 Gói từ vựng IELTS Band 6.5
              </h1>
              <p className="text-gray-600">
                Bộ sưu tập từ vựng chuyên biệt cho kỳ thi IELTS, được phân loại theo chủ đề và độ khó
              </p>
            </div>
            <Button 
              onClick={handleSeedIeltsVocabulary} 
              disabled={seeding}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {seeding ? 'Đang thêm...' : '+ Thêm từ vựng IELTS'}
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{pagination.total || 0}</p>
                    <p className="text-sm text-gray-600">Tổng từ vựng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">6.5</p>
                    <p className="text-sm text-gray-600">Mục tiêu Band</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{topics.length}</p>
                    <p className="text-sm text-gray-600">Chủ đề</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Lightbulb className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-gray-600">Cấp độ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="Tìm kiếm theo từ vựng, định nghĩa hoặc từ đồng nghĩa..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              {debouncedSearchTerm && (
                <p className="mt-2 text-xs text-gray-500">
                  Đang hiển thị kết quả cho "{debouncedSearchTerm}"
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <label className="text-sm font-medium text-gray-600">Sắp xếp theo mức độ thành thạo</label>
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="w-full lg:w-64 rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="default">Mặc định (theo thời gian thêm)</option>
                <option value="mastery-desc">Độ thành thạo cao → thấp</option>
                <option value="mastery-asc">Độ thành thạo thấp → cao</option>
                <option value="due-date">Đến hạn ôn sớm nhất</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topic Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chọn chủ đề IELTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedTopic('all')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedTopic === 'all' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">📚 Tất cả</div>
                    <div className="text-sm text-gray-600">Toàn bộ từ vựng</div>
                  </button>
                  {ieltsTopics.map((topic) => (
                    <button
                      key={topic.key}
                      onClick={() => setSelectedTopic(topic.key)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedTopic === topic.key 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{topic.icon} {topic.label}</div>
                      <div className="text-sm text-gray-600">{topic.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chọn cấp độ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedDifficulty === 'all' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">🎯 Tất cả cấp độ</div>
                    <div className="text-sm text-gray-600">Từ cơ bản đến nâng cao</div>
                  </button>
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.key}
                      onClick={() => setSelectedDifficulty(level.key)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedDifficulty === level.key 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{level.label}</div>
                        <span className={`px-2 py-1 rounded text-xs ${level.color}`}>
                          {level.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vocabulary List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Từ vựng {selectedTopic !== 'all' && `- ${getTopicInfo(selectedTopic).label}`}
                {selectedDifficulty !== 'all' && ` (${getDifficultyInfo(selectedDifficulty).label})`}
              </span>
              <span className="text-sm font-normal text-gray-600">
                {pagination.total || 0} từ
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải từ vựng...</p>
              </div>
            ) : sortedVocabulary.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không tìm thấy từ vựng phù hợp</p>
                <p className="text-sm text-gray-500 mt-2">
                  Thử thay đổi bộ lọc hoặc thêm từ vựng IELTS mới
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedVocabulary.map((vocab) => {
                  const difficultyInfo = getDifficultyInfo(vocab.difficulty);
                  const progress = getProgressForVocabulary(vocab._id);
                  const status = getLearningStatus(vocab._id);
                  const nextReviewHint = getNextReviewHint(progress);

                  return (
                    <Card key={vocab._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${status.color}`}>
                            {status.label}
                          </span>
                          {nextReviewHint && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {nextReviewHint}
                            </span>
                          )}
                        </div>

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-blue-600">
                                {vocab.word}
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakWord(vocab.word)}
                                className="p-1 h-6 w-6"
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {vocab.pronunciation}
                            </p>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {vocab.partOfSpeech}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${difficultyInfo.color}`}>
                            {difficultyInfo.label}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">
                          {vocab.definition}
                        </p>

                        <p className="text-xs text-gray-500 mb-3">{status.description}</p>

                        {progress ? (
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                            <span className="font-medium text-gray-700">
                              Cấp độ SRS: {progress.level}
                            </span>
                            <span>
                              Đúng: {progress.correctCount}
                            </span>
                            <span>
                              Sai: {progress.incorrectCount}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mb-3">
                            Chưa có thống kê ôn tập.
                          </div>
                        )}

                        <div className="bg-gray-50 p-2 rounded mb-3">
                          <p className="text-sm italic text-gray-600">
                            "{vocab.example}"
                          </p>
                        </div>

                        {vocab.collocations.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-gray-700 mb-2">
                              Collocations:
                            </h4>
                            <div className="space-y-1">
                              {vocab.collocations.slice(0, 2).map((collocation, index) => (
                                <div key={index} className="text-xs">
                                  <span className="font-medium text-blue-600">
                                    {collocation.phrase}
                                  </span>
                                  <p className="text-gray-600 ml-2">
                                    {collocation.definition}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {vocab.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                            >
                              {getTopicInfo(topic).icon} {topic}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            {hasMore && (
              <div ref={loadMoreRef} className="py-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
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