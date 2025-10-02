import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { vocabularyAPI } from '../services/api';
import { Vocabulary } from '../types';
import { BookOpen, Target, Users, Lightbulb, Volume2 } from 'lucide-react';

const IeltsVocabularyPage: React.FC = () => {
  const [vocabularyData, setVocabularyData] = useState<{
    data: Vocabulary[];
    total: number;
    page: number;
    totalPages: number;
  } | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);

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

  const loadVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (selectedTopic !== 'all') params.topic = selectedTopic;
      if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;

      const data = await vocabularyAPI.getAll(params);
      setVocabularyData(data);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDifficulty, selectedTopic]);

  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const handleSeedIeltsVocabulary = async () => {
    try {
      setSeeding(true);
      await vocabularyAPI.seedIeltsVocabulary();
      alert('IELTS vocabulary đã được thêm thành công!');
      await loadVocabulary();
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
                    <p className="text-2xl font-bold">{vocabularyData?.total || 0}</p>
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
        <div className="mb-6">
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
                {vocabularyData?.total || 0} từ
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải từ vựng...</p>
              </div>
            ) : vocabularyData?.data.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không tìm thấy từ vựng phù hợp</p>
                <p className="text-sm text-gray-500 mt-2">
                  Thử thay đổi bộ lọc hoặc thêm từ vựng IELTS mới
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vocabularyData?.data.map((vocab) => (
                  <Card key={vocab._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
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
                        <span className={`px-2 py-1 rounded text-xs ${getDifficultyInfo(vocab.difficulty).color}`}>
                          {getDifficultyInfo(vocab.difficulty).label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {vocab.definition}
                      </p>

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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IeltsVocabularyPage;