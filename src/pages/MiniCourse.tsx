import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import RutubePlayer from '@/components/RutubePlayer';

interface VideoStage {
  id: string;
  type: 'video';
  title: string;
  videos: {
    id: string;
    title: string;
    url: string; // Теперь только URL на Rutube
    description?: string;
  }[];
  description: string;
  duration: string;
}

interface TestStage {
  id: string;
  type: 'test';
  title: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

type CourseStage = VideoStage | TestStage;

const MiniCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [currentStage, setCurrentStage] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [courseData, setCourseData] = useState<CourseStage[]>([
    {
      id: '1',
      type: 'video',
      title: 'Введение в квантовую механику',
      description: 'Основные принципы и концепции квантовой физики',
      duration: '15 мин',
      videos: [
        {
          id: 'v1',
          title: 'Основы квантовой механики',
          url: 'https://rutube.ru/video/example123/',
          description: 'Введение в квантовую механику для начинающих'
        }
      ]
    },
    {
      id: '2',
      type: 'test',
      title: 'Проверка знаний: Основы квантовой механики',
      questions: [
        {
          id: 'q1',
          question: 'Что такое квантовое число?',
          options: [
            'Число электронов в атоме',
            'Характеристика энергетического состояния электрона',
            'Скорость движения электрона'
          ],
          correctAnswer: 1,
          explanation: 'Квантовые числа — это параметры, которые описывают энергетическое состояние электрона в атоме. Они определяют орбиталь, на которой находится электрон, и его энергию.'
        }
      ]
    }
  ]);

  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [newVideo, setNewVideo] = useState({ 
    title: '', 
    description: '', 
    duration: '',
    videos: [{ id: '1', title: 'Видео 1', url: '', description: '' }]
  });
  const [newTest, setNewTest] = useState({
    title: '',
    questions: [{ question: '', options: ['', '', ''], correctAnswer: 0, explanation: '' }]
  });
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load data from URL parameters or localStorage on component mount
  useEffect(() => {
    if (!courseId) return;
    
    // Сначала пытаемся загрузить из URL
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    const stageParam = urlParams.get('stage');
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(atob(dataParam));
        setCourseData(decodedData);
        if (stageParam) {
          setCurrentStage(parseInt(stageParam));
        }
        return;
      } catch (e) {
        console.error('Error loading data from URL:', e);
      }
    }
    
    // Если в URL нет данных, пытаемся загрузить из localStorage
    const savedCourseData = localStorage.getItem(`minicourse-${courseId}-data`);
    const savedCurrentStage = localStorage.getItem(`minicourse-${courseId}-stage`);
    
    if (savedCourseData) {
      try {
        const parsedData = JSON.parse(savedCourseData);
        setCourseData(parsedData);
      } catch (e) {
        console.error('Error loading course data:', e);
      }
    }
    
    if (savedCurrentStage) {
      setCurrentStage(parseInt(savedCurrentStage));
    }
  }, [courseId]);

  // Функция для обновления URL с данными
  const updateURLWithData = () => {
    if (!courseData || courseData.length === 0) return;
    
    try {
      const encodedData = btoa(JSON.stringify(courseData));
      const url = new URL(window.location.href);
      url.searchParams.set('data', encodedData);
      url.searchParams.set('stage', currentStage.toString());
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.error('Error updating URL:', e);
    }
  };

  // Автоматическая синхронизация: обновляем URL при любых изменениях данных или этапа
  useEffect(() => {
    // Только если данные уже загружены и не пустые
    if (courseData.length === 0) return;
    
    setIsSyncing(true);
    
    // Небольшая задержка чтобы избежать частых обновлений URL
    const timer = setTimeout(() => {
      updateURLWithData();
      setIsSyncing(false);
      
      // Показать ненавязчивое уведомление о синхронизации (только для админ режима)
      if (isAdminMode) {
        console.log('🔄 Данные курса синхронизированы с URL. Ссылка обновлена для доступа с других устройств.');
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setIsSyncing(false);
    };
  }, [courseData, currentStage, isAdminMode]);

  // Простая функция для создания бэкапа (вызывается вручную)
  const createBackupData = () => {
    if (!courseId) return;
    const backupData = {
      courseData,
      currentStage,
      testAnswers,
      timestamp: Date.now()
    };
    localStorage.setItem(`minicourse-${courseId}-backup`, JSON.stringify(backupData));
    console.log('Backup created:', backupData);
  };

  // Save current stage to localStorage whenever it changes
  useEffect(() => {
    if (!courseId) return;
    localStorage.setItem(`minicourse-${courseId}-stage`, currentStage.toString());
  }, [currentStage, courseId]);

  // Force video reload when stage changes


  // Не сохраняем ответы теста - пусть каждый раз проходят заново

  // Backup and restore functions - используем общую функцию createBackupData

  const restoreFromBackup = () => {
    if (!courseId) return;
    const backupData = localStorage.getItem(`minicourse-${courseId}-backup`);
    if (backupData) {
      try {
        const backup = JSON.parse(backupData);
        setCourseData(backup.courseData || []);
        setCurrentStage(backup.currentStage || 0);
        setTestAnswers(backup.testAnswers || {});
        console.log('Restored from backup:', backup);
        return true;
      } catch (e) {
        console.error('Error restoring backup:', e);
      }
    }
    return false;
  };

  const exportCourseData = () => {
    const dataStr = JSON.stringify(courseData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `minicourse-${courseId}-export.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Функция для обновления URL видео
  const handleVideoUrlChange = (videoIndex: number, url: string) => {
    const updatedVideos = [...newVideo.videos];
    updatedVideos[videoIndex] = { 
      ...updatedVideos[videoIndex], 
      url: url
    };
    setNewVideo({ ...newVideo, videos: updatedVideos });
  };

  const addVideoToStage = () => {
    const newVideoId = `v${newVideo.videos.length + 1}`;
    setNewVideo({
      ...newVideo,
      videos: [...newVideo.videos, { id: newVideoId, title: `Видео ${newVideo.videos.length + 1}`, url: '', description: '' }]
    });
  };

  const createVideoStage = () => {
    if (editingStageId) {
      saveEditedStage();
    } else {
      const newStage: VideoStage = {
        id: `video-${Date.now()}`,
        type: 'video',
        title: newVideo.title || 'Новый этап',
        description: newVideo.description || 'Описание этапа',
        duration: newVideo.duration || '15 мин',
        videos: newVideo.videos.filter(v => v.title.trim() !== '')
      };
      
      const updatedCourseData = [...courseData, newStage];
      setCourseData(updatedCourseData);
      
      // Сохраняем в localStorage сразу
      if (courseId) {
        localStorage.setItem(`minicourse-${courseId}-data`, JSON.stringify(updatedCourseData));
        createBackupData();
      }
      
      setNewVideo({ 
        title: '', 
        description: '', 
        duration: '',
        videos: [{ id: '1', title: 'Видео 1', url: '', description: '' }]
      });
    }
  };

  const addTestStage = () => {
    if (editingStageId) {
      saveEditedStage();
    } else {
      const newStage: TestStage = {
        id: `test-${Date.now()}`,
        type: 'test',
        title: newTest.title || 'Новый тест',
        questions: newTest.questions.filter(q => q.question.trim() !== '')
      };
      
      const updatedCourseData = [...courseData, newStage];
      setCourseData(updatedCourseData);
      
      // Сохраняем в localStorage сразу
      if (courseId) {
        localStorage.setItem(`minicourse-${courseId}-data`, JSON.stringify(updatedCourseData));
        createBackupData();
      }
      
      setNewTest({
        title: '',
        questions: [{ question: '', options: ['', '', ''], correctAnswer: 0 }]
      });
    }
  };

  const deleteStage = (stageId: string) => {
    const stageIndex = courseData.findIndex(stage => stage.id === stageId);
    if (stageIndex === -1) return;
    
    const updatedCourseData = courseData.filter(stage => stage.id !== stageId);
    setCourseData(updatedCourseData);
    
    // Сохраняем в localStorage сразу
    if (courseId) {
      localStorage.setItem(`minicourse-${courseId}-data`, JSON.stringify(updatedCourseData));
      createBackupData();
    }
    
    // Если удаляем текущий этап или этап перед ним, нужно скорректировать текущий индекс
    if (stageIndex <= currentStage && updatedCourseData.length > 0) {
      setCurrentStage(Math.max(0, currentStage - 1));
    } else if (updatedCourseData.length === 0) {
      setCurrentStage(0);
    }
  };

  const clearCourseData = () => {
    if (!courseId) return;
    if (confirm('Вы уверены, что хотите очистить все данные курса? Это действие нельзя отменить.')) {
      localStorage.removeItem(`minicourse-${courseId}-data`);
      localStorage.removeItem(`minicourse-${courseId}-stage`);
      localStorage.removeItem(`minicourse-${courseId}-answers`);
      
      // Reset to default data
      setCourseData([
        {
          id: '1',
          type: 'video',
          title: 'Введение в квантовую механику',
          description: 'Основные принципы и концепции квантовой физики',
          duration: '15 мин',
          videos: [
            {
              id: 'v1',
              title: 'Основы квантовой механики',
              url: 'https://rutube.ru/video/example123/',
              description: 'Введение в квантовую механику для начинающих'
            }
          ]
        },
        {
          id: '2',
          type: 'test',
          title: 'Проверка знаний: Основы квантовой механики',
          questions: [
            {
              id: 'q1',
              question: 'Что такое квантовое число?',
              options: [
                'Число электронов в атоме',
                'Характеристика энергетического состояния электрона',
                'Скорость движения электрона'
              ],
              correctAnswer: 1,
              explanation: 'Квантовые числа — это параметры, которые описывают энергетическое состояние электрона в атоме. Они определяют орбиталь, на которой находится электрон, и его энергию.'
            }
          ]
        }
      ]);
      setCurrentStage(0);
      setTestAnswers({});
    }
  };

  const currentStageData = courseData[currentStage];
  const progress = ((currentStage + 1) / courseData.length) * 100;

  const nextStage = () => {
    if (currentStage < courseData.length - 1) {
      setCurrentStage(currentStage + 1);
      setTestAnswers({});
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
    }
  };

  const prevStage = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
      setTestAnswers({});
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
    }
  };

  const handleAnswerQuestion = () => {
    if (currentStageData && currentStageData.type === 'test') {
      const currentQuestion = currentStageData.questions[currentQuestionIndex];
      if (testAnswers[currentQuestion.id] !== undefined) {
        setShowExplanation(true);
      }
    }
  };

  const nextQuestion = () => {
    if (currentStageData && currentStageData.type === 'test') {
      if (currentQuestionIndex < currentStageData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowExplanation(false);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const addQuestionToTest = () => {
    setNewTest({
      ...newTest,
      questions: [...newTest.questions, { question: '', options: ['', '', ''], correctAnswer: 0, explanation: '' }]
    });
  };

  const addOptionToQuestion = (questionIndex: number) => {
    const updatedQuestions = [...newTest.questions];
    updatedQuestions[questionIndex].options.push('');
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const removeOptionFromQuestion = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...newTest.questions];
    if (updatedQuestions[questionIndex].options.length > 2) { // Минимум 2 варианта
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      // Если удаляем правильный ответ или он стал недоступным, сбрасываем на первый
      if (updatedQuestions[questionIndex].correctAnswer >= updatedQuestions[questionIndex].options.length) {
        updatedQuestions[questionIndex].correctAnswer = 0;
      }
      setNewTest({ ...newTest, questions: updatedQuestions });
    }
  };

  const removeQuestion = (questionIndex: number) => {
    const updatedQuestions = newTest.questions.filter((_, index) => index !== questionIndex);
    setNewTest({ ...newTest, questions: updatedQuestions });
  };

  const moveStage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= courseData.length) return;
    
    const updatedCourseData = [...courseData];
    const [movedStage] = updatedCourseData.splice(fromIndex, 1);
    updatedCourseData.splice(toIndex, 0, movedStage);
    setCourseData(updatedCourseData);
    
    // Обновляем текущий индекс, если нужно
    if (currentStage === fromIndex) {
      setCurrentStage(toIndex);
    } else if (currentStage === toIndex) {
      setCurrentStage(fromIndex);
    } else if (fromIndex < currentStage && toIndex >= currentStage) {
      setCurrentStage(currentStage - 1);
    } else if (fromIndex > currentStage && toIndex <= currentStage) {
      setCurrentStage(currentStage + 1);
    }
  };

  const editStage = (stage: VideoStage | TestStage) => {
    if (stage.type === 'video') {
      setNewVideo({
        title: stage.title,
        description: stage.description,
        duration: stage.duration,
        videos: stage.videos
      });
      setEditingStageId(stage.id);
    } else {
      setNewTest({
        title: stage.title,
        questions: stage.questions
      });
      setEditingStageId(stage.id);
    }
  };

  const saveEditedStage = () => {
    if (!editingStageId) return;
    
    const stageIndex = courseData.findIndex(stage => stage.id === editingStageId);
    if (stageIndex === -1) return;
    
    const updatedCourseData = [...courseData];
    const existingStage = updatedCourseData[stageIndex];
    
    if (existingStage.type === 'video') {
      updatedCourseData[stageIndex] = {
        ...existingStage,
        title: newVideo.title || existingStage.title,
        description: newVideo.description || existingStage.description,
        duration: newVideo.duration || existingStage.duration,
        videos: newVideo.videos.filter(v => v.title.trim() !== '')
      };
      setNewVideo({ 
        title: '', 
        description: '', 
        duration: '',
        videos: [{ id: '1', title: 'Видео 1', url: '', description: '' }]
      });
    } else {
      updatedCourseData[stageIndex] = {
        ...existingStage,
        title: newTest.title || existingStage.title,
        questions: newTest.questions.filter(q => q.question.trim() !== '')
      };
      setNewTest({
        title: '',
        questions: [{ question: '', options: ['', '', ''], correctAnswer: 0 }]
      });
    }
    
    setCourseData(updatedCourseData);
    
    // Сохраняем в localStorage сразу
    if (courseId) {
      localStorage.setItem(`minicourse-${courseId}-data`, JSON.stringify(updatedCourseData));
      createBackupData();
    }
    
    setEditingStageId(null);
  };

  const cancelEdit = () => {
    setEditingStageId(null);
    setNewVideo({ 
      title: '', 
      description: '', 
      duration: '',
      videos: [{ id: '1', title: 'Видео 1', url: '', description: '' }]
    });
    setNewTest({
      title: '',
      questions: [{ question: '', options: ['', '', ''], correctAnswer: 0 }]
    });
  };

  if (!currentStageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Курс не найден</h2>
            <p className="text-gray-600 mb-4">Такого курса не существует</p>
            <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 relative"
      style={{
        backgroundImage: 'url(https://cdn.poehali.dev/files/9fe0ef78-b574-42b7-8ed4-2e886b56d5d8.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Квантовый скачок</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isSyncing && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                  <Icon name="Loader2" size={14} className="animate-spin text-blue-600" />
                  <span className="text-xs text-blue-600">Синхронизация...</span>
                </div>
              )}
              <Button
                variant={isAdminMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAdminMode(!isAdminMode)}
              >
                <Icon name="Settings" size={16} className="mr-2" />
                {isAdminMode ? 'Режим просмотра' : 'Режим редактирования'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Этап {currentStage + 1} из {courseData.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% завершено</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {isAdminMode ? (
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Просмотр контента</TabsTrigger>
              <TabsTrigger value="admin">Управление курсом</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              {/* Content display - same as view mode */}
              {currentStageData.type === 'video' ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Icon name="Play" size={20} className="text-red-600" />
                      </div>
                      <div>
                        <CardTitle>{currentStageData.title}</CardTitle>
                        <p className="text-sm text-gray-600">{currentStageData.duration}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentStageData.videos.map((video, index) => (
                        <div key={video.id} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-3">{video.title}</h3>
                          <div className="mb-4">
                            {video.url ? (
                              <RutubePlayer 
                                url={video.url}
                                title={video.title}
                                className="rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <Icon name="Video" size={32} className="mx-auto mb-2 text-gray-400" />
                                  <p className="text-sm text-gray-600 font-medium">URL видео не добавлен</p>
                                  <p className="text-xs text-gray-500 mt-1">Добавьте ссылку на Rutube в режиме редактирования</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {video.description && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">{video.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-700">{currentStageData.description}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon name="HelpCircle" size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <CardTitle>{currentStageData.title}</CardTitle>
                          <p className="text-sm text-gray-600">
                            Предпросмотр теста (Вопрос {currentQuestionIndex + 1} из {currentStageData.questions.length})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevQuestion}
                          disabled={currentQuestionIndex === 0}
                        >
                          <Icon name="ChevronLeft" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextQuestion}
                          disabled={currentQuestionIndex === currentStageData.questions.length - 1}
                        >
                          <Icon name="ChevronRight" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const currentQuestion = currentStageData.questions[currentQuestionIndex];
                      if (!currentQuestion) return null;
                      
                      return (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                          
                          <div className="space-y-3">
                            {currentQuestion.options.map((option, optionIndex) => (
                              <label 
                                key={optionIndex} 
                                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                  optionIndex === currentQuestion.correctAnswer
                                    ? 'bg-green-50 border-green-300'
                                    : 'hover:bg-gray-50 border-gray-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`admin-question-${currentQuestion.id}`}
                                  value={optionIndex}
                                  checked={optionIndex === currentQuestion.correctAnswer}
                                  readOnly
                                  className="text-green-600"
                                />
                                <span className="flex-1">{option}</span>
                                {optionIndex === currentQuestion.correctAnswer && (
                                  <Icon name="Check" size={16} className="text-green-600" />
                                )}
                              </label>
                            ))}
                          </div>
                          
                          {/* Show explanation in admin preview if exists */}
                          {currentQuestion.explanation && (
                            <div className="mt-4 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-300">
                              <div className="flex items-center space-x-2 mb-2">
                                <Icon name="Info" size={16} className="text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Объяснение:</span>
                              </div>
                              <div className="text-sm text-gray-700">{currentQuestion.explanation}</div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="admin">
              <div className="space-y-6">
                {/* Add Video Stage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="Video" size={20} />
                        <span>{editingStageId ? 'Редактировать этап с видео' : 'Добавить этап с видео'}</span>
                      </div>
                      {editingStageId && (
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <Icon name="X" size={14} className="mr-1" />
                          Отмена
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="stage-title">Название этапа</Label>
                      <Input
                        id="stage-title"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Название этапа"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage-description">Описание этапа</Label>
                      <Textarea
                        id="stage-description"
                        value={newVideo.description}
                        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                        placeholder="Описание этапа"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage-duration">Продолжительность</Label>
                      <Input
                        id="stage-duration"
                        value={newVideo.duration}
                        onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                        placeholder="15 мин"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Видео в этапе</Label>
                        <Button onClick={addVideoToStage} variant="outline" size="sm">
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить видео
                        </Button>
                      </div>

                      {newVideo.videos.map((video, index) => (
                        <div key={video.id} className="border rounded-lg p-4 space-y-3">
                          <div>
                            <Label>Название видео {index + 1}</Label>
                            <textarea
                              value={video.title}
                              onChange={(e) => {
                                const updatedVideos = [...newVideo.videos];
                                updatedVideos[index].title = e.target.value;
                                setNewVideo({ ...newVideo, videos: updatedVideos });
                              }}
                              placeholder="Название видео"
                              className="w-full min-h-[60px] p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <Label>URL видео на Rutube</Label>
                            <Input
                              type="url"
                              value={video.url}
                              onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                              placeholder="https://rutube.ru/video/..."
                              className="w-full"
                            />
                            {video.url && (
                              <div className="mt-2">
                                <p className="text-sm text-green-600">✓ URL видео добавлен</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <Label>Описание видео (опционально)</Label>
                            <Textarea
                              value={video.description || ''}
                              onChange={(e) => {
                                const updatedVideos = [...newVideo.videos];
                                updatedVideos[index] = { 
                                  ...updatedVideos[index], 
                                  description: e.target.value
                                };
                                setNewVideo({ ...newVideo, videos: updatedVideos });
                              }}
                              placeholder="Краткое описание видео..."
                              className="min-h-[60px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button onClick={createVideoStage} className="w-full">
                      <Icon name="Save" size={16} className="mr-2" />
                      {editingStageId ? 'Сохранить изменения' : 'Создать этап'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Add Test */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="HelpCircle" size={20} />
                        <span>{editingStageId ? 'Редактировать тест' : 'Добавить тест'}</span>
                      </div>
                      {editingStageId && (
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <Icon name="X" size={14} className="mr-1" />
                          Отмена
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="test-title">Название теста</Label>
                      <textarea
                        id="test-title"
                        value={newTest.title}
                        onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                        placeholder="Введите название теста"
                        className="w-full min-h-[60px] p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    
                    {newTest.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="border rounded-lg p-4 space-y-3">
                        <div>
                          <Label>Вопрос {questionIndex + 1}</Label>
                          <textarea
                            value={question.question}
                            onChange={(e) => {
                              const updatedQuestions = [...newTest.questions];
                              updatedQuestions[questionIndex].question = e.target.value;
                              setNewTest({ ...newTest, questions: updatedQuestions });
                            }}
                            placeholder="Введите вопрос"
                            className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Варианты ответов</Label>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => addOptionToQuestion(questionIndex)}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Icon name="Plus" size={12} className="mr-1" />
                                Добавить вариант
                              </Button>
                              <Button
                                onClick={() => removeQuestion(questionIndex)}
                                variant="destructive"
                                size="sm"
                                className="text-xs"
                              >
                                <Icon name="Trash2" size={12} className="mr-1" />
                                Удалить вопрос
                              </Button>
                            </div>
                          </div>
                          
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                              <input
                                type="radio"
                                name={`correct-${questionIndex}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => {
                                  const updatedQuestions = [...newTest.questions];
                                  updatedQuestions[questionIndex].correctAnswer = optionIndex;
                                  setNewTest({ ...newTest, questions: updatedQuestions });
                                }}
                                className="w-4 h-4 text-blue-600"
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const updatedQuestions = [...newTest.questions];
                                  updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
                                  setNewTest({ ...newTest, questions: updatedQuestions });
                                }}
                                placeholder={`Вариант ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              {question.options.length > 2 && (
                                <Button
                                  onClick={() => removeOptionFromQuestion(questionIndex, optionIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Icon name="X" size={16} />
                                </Button>
                              )}
                            </div>
                          ))}
                          
                          <div className="text-xs text-gray-500 mt-2">
                            <Icon name="Info" size={12} className="inline mr-1" />
                            Выберите правильный ответ, отметив соответствующую радио-кнопку
                          </div>
                        </div>
                        
                        {/* Explanation field */}
                        <div>
                          <Label className="text-sm font-medium">Объяснение ответа (необязательно)</Label>
                          <Textarea
                            value={question.explanation || ''}
                            onChange={(e) => {
                              const updatedQuestions = [...newTest.questions];
                              updatedQuestions[questionIndex].explanation = e.target.value;
                              setNewTest({ ...newTest, questions: updatedQuestions });
                            }}
                            placeholder="Введите объяснение правильного ответа"
                            className="min-h-[60px] resize-y"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <Button onClick={addQuestionToTest} variant="outline" className="flex-1">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить вопрос
                      </Button>
                      <Button onClick={addTestStage} className="flex-1">
                        {editingStageId ? 'Сохранить изменения' : 'Сохранить тест'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Existing Stages Management */}
                {courseData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Icon name="List" size={20} />
                        <span>Управление этапами курса</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {courseData.map((stage, index) => (
                          <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                stage.type === 'video' 
                                  ? 'bg-red-100 text-red-600' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                <Icon name={stage.type === 'video' ? 'Play' : 'HelpCircle'} size={16} />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  Этап {index + 1}: {stage.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {stage.type === 'video' 
                                    ? `Видео • ${(stage as VideoStage).duration || 'Длительность не указана'}` 
                                    : `Тест • ${(stage as TestStage).questions.length} вопросов`
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Badge variant={index === currentStage ? 'default' : 'outline'} className="text-xs">
                                {index === currentStage ? 'Текущий' : `Этап ${index + 1}`}
                              </Badge>
                              
                              {/* Move Up/Down */}
                              <div className="flex flex-col">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveStage(index, index - 1)}
                                  disabled={index === 0}
                                  className="h-5 w-6 p-0 text-gray-400 hover:text-blue-600"
                                  title="Переместить вверх"
                                >
                                  <Icon name="ChevronUp" size={12} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveStage(index, index + 1)}
                                  disabled={index === courseData.length - 1}
                                  className="h-5 w-6 p-0 text-gray-400 hover:text-blue-600"
                                  title="Переместить вниз"
                                >
                                  <Icon name="ChevronDown" size={12} />
                                </Button>
                              </div>

                              {/* Edit Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editStage(stage)}
                                className="text-gray-600 hover:text-green-600"
                                title="Редактировать этап"
                              >
                                <Icon name="Edit" size={14} />
                              </Button>
                              
                              {/* View Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentStage(index)}
                                className="text-gray-600 hover:text-blue-600"
                                title="Перейти к этапу"
                              >
                                <Icon name="Eye" size={14} />
                              </Button>
                              
                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Вы уверены, что хотите удалить этап "${stage.title}"?`)) {
                                    deleteStage(stage.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Удалить этап"
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {courseData.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Icon name="BookOpen" size={32} className="mx-auto mb-2 opacity-50" />
                          <p>В курсе пока нет этапов</p>
                          <p className="text-sm">Создайте первый этап с видео или тестом</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Course Data Management */}
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <Icon name="AlertTriangle" size={20} />
                      <span>Управление данными курса</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Icon name="Info" size={16} className="text-amber-600 mt-0.5" />
                          <div className="text-sm text-amber-800">
                            <p className="font-medium mb-1">Сохранение данных</p>
                            <p>Структура курса, тексты и <strong>загруженные видео</strong> сохраняются автоматически на сервере. Курс доступен по ссылке с любого устройства со всеми материалами.</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Backup and Restore Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                          <div>
                            <h4 className="font-medium text-blue-800">Резервное копирование</h4>
                            <p className="text-sm text-blue-600 mt-1">
                              Создать резервную копию или восстановить данные курса
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={createBackupData}
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                              <Icon name="Save" size={16} className="mr-2" />
                              Создать копию
                            </Button>
                            <Button
                              onClick={() => {
                                if (restoreFromBackup()) {
                                  alert('Данные успешно восстановлены из резервной копии!');
                                } else {
                                  alert('Резервная копия не найдена');
                                }
                              }}
                              variant="outline" 
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                              <Icon name="RotateCcw" size={16} className="mr-2" />
                              Восстановить
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50">
                          <div>
                            <h4 className="font-medium text-purple-800">Поделиться курсом</h4>
                            <p className="text-sm text-purple-600 mt-1">
                              Ссылка автоматически обновляется при изменениях. Копируйте для доступа с других устройств
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              updateURLWithData();
                              navigator.clipboard.writeText(window.location.href).then(() => {
                                alert('Ссылка скопирована в буфер обмена! Теперь курс можно открыть на любом устройстве.');
                              }).catch(() => {
                                alert('Ссылка обновлена в адресной строке. Скопируйте её для доступа с других устройств.');
                              });
                            }}
                            variant="outline"
                            size="sm"
                            className="border-purple-300 text-purple-700 hover:bg-purple-100"
                          >
                            <Icon name="Share2" size={16} className="mr-2" />
                            Поделиться
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50">
                          <div>
                            <h4 className="font-medium text-green-800">Экспорт данных</h4>
                            <p className="text-sm text-green-600 mt-1">
                              Скачать данные курса в файл JSON
                            </p>
                          </div>
                          <Button
                            onClick={exportCourseData}
                            variant="outline"
                            size="sm"
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <Icon name="Download" size={16} className="mr-2" />
                            Экспорт
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div>
                          <h4 className="font-medium text-red-800">Очистить все данные курса</h4>
                          <p className="text-sm text-red-600 mt-1">
                            Удалит все созданные этапы, тесты и прогресс. Действие необратимо.
                          </p>
                        </div>
                        <Button
                          onClick={clearCourseData}
                          variant="destructive"
                          size="sm"
                          className="ml-4"
                        >
                          <Icon name="Trash2" size={16} className="mr-2" />
                          Очистить данные
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // View Mode
          <>
            {currentStageData.type === 'video' ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Icon name="Play" size={20} className="text-red-600" />
                    </div>
                    <div>
                      <CardTitle>{currentStageData.title}</CardTitle>
                      <p className="text-sm text-gray-600">{currentStageData.duration}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentStageData.videos.map((video, index) => (
                      <div key={video.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">{video.title}</h3>
                        <div className="mb-4">
                          {video.url ? (
                            <RutubePlayer 
                              url={video.url}
                              title={video.title}
                              className="w-full rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Icon name="Video" size={32} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Видео не добавлено</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {video.description && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">{video.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-700">{currentStageData.description}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="HelpCircle" size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{currentStageData.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Вопрос {currentQuestionIndex + 1} из {currentStageData.questions.length}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <Icon name="ChevronLeft" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex === currentStageData.questions.length - 1}
                      >
                        <Icon name="ChevronRight" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const currentQuestion = currentStageData.questions[currentQuestionIndex];
                    if (!currentQuestion) return null;
                    
                    return (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                        
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, optionIndex) => (
                            <label 
                              key={optionIndex} 
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                testAnswers[currentQuestion.id] === optionIndex 
                                  ? 'bg-blue-50 border-blue-300' 
                                  : 'hover:bg-gray-50 border-gray-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={optionIndex}
                                checked={testAnswers[currentQuestion.id] === optionIndex}
                                onChange={() => setTestAnswers({ ...testAnswers, [currentQuestion.id]: optionIndex })}
                                className="text-blue-600"
                                disabled={showExplanation}
                              />
                              <span className="flex-1">{option}</span>
                            </label>
                          ))}
                        </div>
                        
                        {!showExplanation ? (
                          <Button
                            onClick={handleAnswerQuestion}
                            disabled={testAnswers[currentQuestion.id] === undefined}
                            className="w-full"
                          >
                            Ответить
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            {/* Show result */}
                            <div className={`p-4 rounded-lg border-l-4 ${
                              testAnswers[currentQuestion.id] === currentQuestion.correctAnswer
                                ? 'bg-green-50 border-green-400'
                                : 'bg-red-50 border-red-400'
                            }`}>
                              <div className="flex items-center space-x-2 mb-2">
                                <Icon 
                                  name={testAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? "CheckCircle" : "XCircle"} 
                                  size={16} 
                                  className={testAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? "text-green-600" : "text-red-600"} 
                                />
                                <span className={`font-medium ${
                                  testAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? "text-green-700" : "text-red-700"
                                }`}>
                                  {testAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? "Правильно!" : "Неправильно"}
                                </span>
                              </div>
                              
                              {testAnswers[currentQuestion.id] !== currentQuestion.correctAnswer && (
                                <p className="text-sm text-red-700 mb-2">
                                  Правильный ответ: {currentQuestion.options[currentQuestion.correctAnswer]}
                                </p>
                              )}
                              
                              {currentQuestion.explanation && (
                                <div className="text-sm text-gray-700">
                                  <strong>Объяснение:</strong> {currentQuestion.explanation}
                                </div>
                              )}
                            </div>
                            
                            {/* Navigation buttons */}
                            <div className="flex space-x-2">
                              {currentQuestionIndex < currentStageData.questions.length - 1 ? (
                                <Button onClick={nextQuestion} className="flex-1">
                                  Следующий вопрос
                                  <Icon name="ArrowRight" size={16} className="ml-2" />
                                </Button>
                              ) : (
                                <Button onClick={nextStage} disabled={currentStage === courseData.length - 1} className="flex-1">
                                  Завершить тест
                                  <Icon name="CheckCircle" size={16} className="ml-2" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={prevStage}
            disabled={currentStage === 0}
          >
            <Icon name="ChevronLeft" size={16} className="mr-2" />
            К предыдущему этапу
          </Button>
          
          <Badge variant="outline">
            {currentStageData.type === 'video' ? 'Видео' : 'Тест'}
          </Badge>
          
          <Button
            onClick={nextStage}
            disabled={currentStage === courseData.length - 1}
          >
            К следующему этапу
            <Icon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MiniCourse;