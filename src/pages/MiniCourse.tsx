import React, { useState, useRef, useEffect } from 'react';
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

interface VideoStage {
  id: string;
  type: 'video';
  title: string;
  videos: {
    id: string;
    title: string;
    url?: string;
    files: {
      id: string;
      name: string;
      url: string;
      type: string;
    }[];
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
          url: '',
          files: []
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
  const [newVideo, setNewVideo] = useState({ 
    title: '', 
    description: '', 
    duration: '',
    videos: [{ id: '1', title: 'Видео 1', url: '', files: [] }]
  });
  const [newTest, setNewTest] = useState({
    title: '',
    questions: [{ question: '', options: ['', '', ''], correctAnswer: 0, explanation: '' }]
  });
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (!courseId) return;
    
    const savedCourseData = localStorage.getItem(`minicourse-${courseId}-data`);
    const savedCurrentStage = localStorage.getItem(`minicourse-${courseId}-stage`);
    const savedTestAnswers = localStorage.getItem(`minicourse-${courseId}-answers`);
    
    if (savedCourseData) {
      try {
        setCourseData(JSON.parse(savedCourseData));
      } catch (e) {
        console.error('Error loading course data:', e);
      }
    }
    
    if (savedCurrentStage) {
      setCurrentStage(parseInt(savedCurrentStage));
    }
    
    if (savedTestAnswers) {
      try {
        setTestAnswers(JSON.parse(savedTestAnswers));
      } catch (e) {
        console.error('Error loading test answers:', e);
      }
    }
  }, [courseId]);

  // Save course data to localStorage whenever it changes
  useEffect(() => {
    if (!courseId) return;
    localStorage.setItem(`minicourse-${courseId}-data`, JSON.stringify(courseData));
    console.log('Course data saved:', courseData.length, 'stages');
    
    // Create backup every time data changes
    if (courseData.length > 0) {
      const backupData = {
        courseData,
        currentStage,
        testAnswers,
        timestamp: Date.now()
      };
      localStorage.setItem(`minicourse-${courseId}-backup`, JSON.stringify(backupData));
      console.log('Backup created:', backupData);
    }
  }, [courseData, courseId, currentStage, testAnswers]);

  // Save current stage to localStorage whenever it changes
  useEffect(() => {
    if (!courseId) return;
    localStorage.setItem(`minicourse-${courseId}-stage`, currentStage.toString());
  }, [currentStage, courseId]);

  // Save test answers to localStorage whenever they change
  useEffect(() => {
    if (!courseId || Object.keys(testAnswers).length === 0) return;
    localStorage.setItem(`minicourse-${courseId}-answers`, JSON.stringify(testAnswers));
  }, [testAnswers, courseId]);

  // Backup and restore functions
  const createBackup = () => {
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

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>, videoIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      const updatedVideos = [...newVideo.videos];
      updatedVideos[videoIndex] = { ...updatedVideos[videoIndex], url: videoUrl };
      setNewVideo({ ...newVideo, videos: updatedVideos });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, videoIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const updatedVideos = [...newVideo.videos];
      const newFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        url: fileUrl,
        type: file.type
      };
      updatedVideos[videoIndex].files.push(newFile);
      setNewVideo({ ...newVideo, videos: updatedVideos });
    }
  };

  const addVideoToStage = () => {
    const newVideoId = `v${newVideo.videos.length + 1}`;
    setNewVideo({
      ...newVideo,
      videos: [...newVideo.videos, { id: newVideoId, title: `Видео ${newVideo.videos.length + 1}`, url: '', files: [] }]
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
      setCourseData([...courseData, newStage]);
      setNewVideo({ 
        title: '', 
        description: '', 
        duration: '',
        videos: [{ id: '1', title: 'Видео 1', url: '', files: [] }]
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
      setCourseData([...courseData, newStage]);
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
              url: '',
              files: []
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
    }
  };

  const prevStage = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
      setTestAnswers({});
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
        videos: [{ id: '1', title: 'Видео 1', url: '', files: [] }]
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
    setEditingStageId(null);
  };

  const cancelEdit = () => {
    setEditingStageId(null);
    setNewVideo({ 
      title: '', 
      description: '', 
      duration: '',
      videos: [{ id: '1', title: 'Видео 1', url: '', files: [] }]
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
    <div className="min-h-screen bg-gray-50">
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
                              <video
                                controls
                                className="w-full rounded-lg"
                                src={video.url}
                              >
                                Ваш браузер не поддерживает видео.
                              </video>
                            ) : (
                              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <Icon name="Video" size={32} className="mx-auto mb-2 text-gray-400" />
                                  <p className="text-sm text-gray-500">Видео не загружено</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {video.files.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-gray-700">Материалы к видео:</h4>
                              <div className="grid gap-2">
                                {video.files.map((file) => (
                                  <a
                                    key={file.id}
                                    href={file.url}
                                    download={file.name}
                                    className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <Icon name="FileDown" size={16} className="text-blue-600" />
                                    <span className="text-sm text-blue-800">{file.name}</span>
                                  </a>
                                ))}
                              </div>
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
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="HelpCircle" size={20} className="text-blue-600" />
                      </div>
                      <CardTitle>{currentStageData.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentStageData.questions.map((question, index) => (
                        <div key={question.id} className="space-y-3">
                          <h3 className="font-semibold">{index + 1}. {question.question}</h3>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={optionIndex}
                                  checked={testAnswers[question.id] === optionIndex}
                                  onChange={() => setTestAnswers({ ...testAnswers, [question.id]: optionIndex })}
                                  className="text-blue-600"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                          
                          {/* Show explanation in admin preview if exists */}
                          {question.explanation && (
                            <div className="mt-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-300">
                              <div className="flex items-center space-x-2 mb-1">
                                <Icon name="Info" size={14} className="text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Пояснение:</span>
                              </div>
                              <div className="text-sm text-gray-700">{question.explanation}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Правильный ответ: {question.options[question.correctAnswer]}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                            <Label>Видеофайл</Label>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoUpload(e, index)}
                              className="hidden"
                              id={`video-upload-${index}`}
                            />
                            <Button 
                              onClick={() => document.getElementById(`video-upload-${index}`)?.click()} 
                              variant="outline" 
                              className="w-full"
                            >
                              <Icon name="Upload" size={16} className="mr-2" />
                              {video.url ? 'Изменить видео' : 'Загрузить видео'}
                            </Button>
                            {video.url && (
                              <p className="text-sm text-green-600 mt-1">✓ Видео загружено</p>
                            )}
                          </div>

                          <div>
                            <Label>Файлы к видео</Label>
                            <input
                              type="file"
                              accept="*/*"
                              onChange={(e) => handleFileUpload(e, index)}
                              className="hidden"
                              id={`file-upload-${index}`}
                            />
                            <Button 
                              onClick={() => document.getElementById(`file-upload-${index}`)?.click()} 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                            >
                              <Icon name="Paperclip" size={16} className="mr-2" />
                              Прикрепить файл
                            </Button>
                            {video.files.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {video.files.map((file) => (
                                  <div key={file.id} className="text-sm text-blue-600 flex items-center space-x-1">
                                    <Icon name="FileText" size={12} />
                                    <span>{file.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
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
                            <p className="font-medium mb-1">Автоматическое сохранение</p>
                            <p>Все изменения в курсе автоматически сохраняются в браузере. Данные восстанавливаются при обновлении страницы.</p>
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
                              onClick={createBackup}
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
                            <video
                              controls
                              className="w-full rounded-lg"
                              src={video.url}
                            >
                              Ваш браузер не поддерживает видео.
                            </video>
                          ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <Icon name="Video" size={32} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Видео не загружено</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {video.files.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-gray-700">Материалы к видео:</h4>
                            <div className="grid gap-2">
                              {video.files.map((file) => (
                                <a
                                  key={file.id}
                                  href={file.url}
                                  download={file.name}
                                  className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <Icon name="FileDown" size={16} className="text-blue-600" />
                                  <span className="text-sm text-blue-800">{file.name}</span>
                                </a>
                              ))}
                            </div>
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
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="HelpCircle" size={20} className="text-blue-600" />
                    </div>
                    <CardTitle>{currentStageData.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentStageData.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <h3 className="font-semibold">{index + 1}. {question.question}</h3>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optionIndex}
                                checked={testAnswers[question.id] === optionIndex}
                                onChange={() => setTestAnswers({ ...testAnswers, [question.id]: optionIndex })}
                                className="text-blue-600"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
  );
};

export default MiniCourse;