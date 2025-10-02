import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { userAPI } from '../services/api';
import { StudySession } from '../types';
import { Volume2, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { resolveVocabularyAudioUrl, resolveVocabularyImageUrl, FALLBACK_VOCABULARY_IMAGE } from '../lib/media';

const StudyPage: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    loadStudySessions();
  }, []);

  const loadStudySessions = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getDueVocabulary();
      setSessions(data);
    } catch (error) {
      console.error('Error loading study sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (correct: boolean) => {
    const currentSession = sessions[currentIndex];
    if (!currentSession) return;

    try {
      await userAPI.updateProgress(currentSession.vocabulary._id, correct);
      setCompleted(completed + 1);
      
      if (currentIndex < sessions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Study session completed
        alert('Hoàn thành phiên học! Chúc mừng bạn!');
        loadStudySessions(); // Reload for next session
        setCurrentIndex(0);
        setCompleted(0);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const speakWordWithSpeechSynthesis = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }, []);

  const playPronunciation = useCallback((vocabulary: StudySession['vocabulary']) => {
    const audioUrl = resolveVocabularyAudioUrl(vocabulary);

    if (typeof Audio !== 'undefined' && audioUrl) {
      const cache = audioElementsRef.current;
      const cacheKey = vocabulary._id;
      let audioElement = cache[cacheKey];

      if (!audioElement || audioElement.src !== audioUrl) {
        audioElement = new Audio(audioUrl);
        audioElement.onerror = () => speakWordWithSpeechSynthesis(vocabulary.word);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Không có từ vựng để học</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Bạn đã hoàn thành tất cả từ vựng hôm nay!
            </p>
            <Button onClick={loadStudySessions}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Tải lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSession = sessions[currentIndex];
  const progress = ((completed) / sessions.length) * 100;
  const illustrationUrl = resolveVocabularyImageUrl(currentSession.vocabulary);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Học từ vựng</h1>
            <span className="text-sm text-gray-600">
              {completed}/{sessions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">
                {currentSession.vocabulary.word}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => playPronunciation(currentSession.vocabulary)}
              >
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Nghe phát âm</span>
              </Button>
            </CardTitle>
            <p className="text-lg text-gray-600">
              {currentSession.vocabulary.pronunciation}
            </p>
            <p className="text-sm text-gray-500 font-medium">
              {currentSession.vocabulary.partOfSpeech}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6 overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
              <img
                src={illustrationUrl}
                alt={`Minh họa cho từ ${currentSession.vocabulary.word}`}
                className="h-48 w-full object-cover"
                loading="lazy"
                onError={handleImageError}
              />
            </div>
            {!showAnswer ? (
              <div className="text-center py-8">
                <p className="text-lg mb-6">Bạn có nhớ nghĩa của từ này không?</p>
                <Button onClick={() => setShowAnswer(true)}>
                  Hiển thị đáp án
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Định nghĩa:</h3>
                  <p className="text-gray-700">{currentSession.vocabulary.definition}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Ví dụ:</h3>
                  <p className="text-gray-700 italic">"{currentSession.vocabulary.example}"</p>
                </div>

                {currentSession.vocabulary.synonyms.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Từ đồng nghĩa:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentSession.vocabulary.synonyms.map((synonym, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentSession.vocabulary.collocations.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Collocations:</h3>
                    <div className="space-y-2">
                      {currentSession.vocabulary.collocations.map((collocation, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium">{collocation.phrase}</p>
                          <p className="text-sm text-gray-600">{collocation.definition}</p>
                          <p className="text-sm text-gray-500 italic">"{collocation.example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleAnswer(false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Khó
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleAnswer(true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Dễ
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyPage;