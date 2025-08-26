import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import LessonPlayer from '@/components/LessonPlayer';
import LoginModal from '@/components/LoginModal';
import TaskChecker from '@/components/TaskChecker';
import ManageView from '@/components/ManageView';
import { useParams } from 'react-router-dom';

const Subject = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonData, setLessonData] = useState([]);
  const [editingLessonData, setEditingLessonData] = useState({});
  const { subjectId } = useParams();

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const authKey = `auth_${subjectId}`;
    const isLoggedIn = localStorage.getItem(authKey) === 'true';
    
    if (isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      setShowLoginModal(true);
    }
  }, [subjectId]);

  const handleLogin = (username, password) => {
    // Сохраняем состояние авторизации
    const authKey = `auth_${subjectId}`;
    localStorage.setItem(authKey, 'true');
    localStorage.setItem(`user_${subjectId}`, username);
    
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    const authKey = `auth_${subjectId}`;
    localStorage.removeItem(authKey);
    localStorage.removeItem(`user_${subjectId}`);
    
    setIsAuthenticated(false);
    setShowLoginModal(true);
  };

  // Mock data for chemistry subject
  const subjectData = {
    id: 'chemistry-sanya',
    title: 'Химия с Саньком',
    teacher: 'Александр',
    description: 'Углубленное изучение химии для старших классов и подготовки к ЕГЭ',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16
  };

  const navigationItems = [
    { id: 'dashboard', title: 'Обзор', icon: 'LayoutDashboard' },
    { id: 'lessons', title: 'Уроки', icon: 'BookOpen' },
    { id: 'schedule', title: 'Расписание', icon: 'Calendar' },
    { id: 'tasks', title: 'Задания', icon: 'ClipboardList' },
    { id: 'achievements', title: 'Достижения', icon: 'Trophy' },
    { id: 'profile', title: 'Прогресс', icon: 'BarChart3' },
    { id: 'manage', title: 'Управление', icon: 'Settings' }
  ];

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Периодическая система элементов',
      status: 'completed',
      duration: 45,
      score: 95,
      topics: ['Строение атома', 'Периодические свойства'],
      videos: [],
      materials: []
    },
    {
      id: 2,
      title: 'Химические связи',
      status: 'completed',
      duration: 50,
      score: 88,
      topics: ['Ионная связь', 'Ковалентная связь', 'Металлическая связь'],
      videos: [],
      materials: []
    },
    {
      id: 3,
      title: 'Окислительно-восстановительные реакции',
      status: 'in-progress',
      duration: 60,
      score: null,
      topics: ['Степень окисления', 'Окислители и восстановители'],
      videos: [],
      materials: []
    },
    {
      id: 4,
      title: 'Электролиз и электрохимия',
      status: 'pending',
      duration: 55,
      score: null,
      topics: ['Процессы на электродах', 'Законы Фарадея'],
      videos: [],
      materials: []
    }
  ]);

  const recentTasks = [
    {
      id: 1,
      title: 'Решить 10 задач по периодичности',
      status: 'pending',
      deadline: '2024-12-20',
      progress: 60
    },
    {
      id: 2,
      title: 'Изучить типы химических связей',
      status: 'completed',
      deadline: '2024-12-18',
      progress: 100
    }
  ];

  const achievements = [
    { id: 1, title: 'Первый урок', icon: 'Star', unlocked: true },
    { id: 2, title: 'Неделя изучения', icon: 'Calendar', unlocked: true },
    { id: 3, title: 'Химик-знаток', icon: 'Award', unlocked: true },
    { id: 4, title: 'Мастер реакций', icon: 'FlaskConical', unlocked: false }
  ];

  const weeklySchedule = [
    { day: 'Понедельник', time: '18:00', lesson: 'Органическая химия', type: 'live' },
    { day: 'Среда', time: '18:00', lesson: 'Решение задач', type: 'practice' },
    { day: 'Пятница', time: '18:00', lesson: 'Лабораторная работа', type: 'lab' }
  ];

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="BookOpen" size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">{subjectData.completedLessons}/{subjectData.totalLessons}</p>
                <p className="text-gray-600">Уроков пройдено</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="TrendingUp" size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">{subjectData.progress}%</p>
                <p className="text-gray-600">Прогресс курса</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="Clock" size={24} className="text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold">12.5ч</p>
                <p className="text-gray-600">Время изучения</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''}>
          <CardHeader>
            <CardTitle>Последние уроки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessons.slice(0, 3).map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      lesson.status === 'completed' ? 'bg-green-500' :
                      lesson.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-600">{lesson.duration} мин</p>
                    </div>
                  </div>
                  {lesson.score && (
                    <Badge variant="secondary">{lesson.score}%</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активные задания</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={task.status === 'completed' ? 'default' : 'destructive'}>
                      {task.deadline}
                    </Badge>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{task.progress}% завершено</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const handleVideoUpload = (lessonId, videoFile) => {
    const videoUrl = URL.createObjectURL(videoFile);
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const newVideo = {
          id: `video-${Date.now()}`,
          name: videoFile.name,
          url: videoUrl,
          type: videoFile.type
        };
        return { ...lesson, videos: [...lesson.videos, newVideo] };
      }
      return lesson;
    });
    setLessons(updatedLessons);
  };

  const handleMaterialUpload = (lessonId, materialFile) => {
    const materialUrl = URL.createObjectURL(materialFile);
    const updatedLessons = lessons.map(lesson => {
      if (lesson.id === lessonId) {
        const newMaterial = {
          id: `material-${Date.now()}`,
          name: materialFile.name,
          url: materialUrl,
          type: materialFile.type
        };
        return { ...lesson, materials: [...lesson.materials, newMaterial] };
      }
      return lesson;
    });
    setLessons(updatedLessons);
  };

  const LessonsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${subjectId === 'chemistry-sanya' ? 'text-white' : ''}`}>Уроки курса</h2>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setIsEditMode(!isEditMode)}
            className="mr-4"
          >
            <Icon name="Edit" size={16} className="mr-2" />
            {isEditMode ? 'Завершить редактирование' : 'Редактировать уроки'}
          </Button>
          <Progress value={subjectData.progress} className="w-32 h-2" />
          <span className="text-sm text-gray-600">{subjectData.progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${
            subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''
          } ${
            lesson.status === 'completed' ? 'bg-green-50 border-green-200' :
            lesson.status === 'in-progress' ? 'bg-yellow-50 border-yellow-200' :
            'border-gray-200'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    lesson.status === 'completed' ? 'bg-green-100 text-green-600' :
                    lesson.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon 
                      name={lesson.status === 'completed' ? 'CheckCircle' : 
                            lesson.status === 'in-progress' ? 'Clock' : 'Play'} 
                      size={20} 
                    />
                  </div>
                  
                  <div className="flex-1">
                    {isEditMode && editingLessonData[lesson.id] ? (
                      <div className="space-y-2">
                        <Input 
                          value={editingLessonData[lesson.id]?.title || lesson.title}
                          onChange={(e) => setEditingLessonData({
                            ...editingLessonData,
                            [lesson.id]: { ...editingLessonData[lesson.id], title: e.target.value }
                          })}
                          className="text-lg font-semibold"
                          placeholder="Название урока"
                        />
                        <div className="flex gap-2">
                          <Input 
                            type="number"
                            value={editingLessonData[lesson.id]?.number || lesson.id}
                            onChange={(e) => setEditingLessonData({
                              ...editingLessonData,
                              [lesson.id]: { ...editingLessonData[lesson.id], number: e.target.value }
                            })}
                            className="w-20"
                            placeholder="№"
                          />
                          <Input 
                            type="number"
                            value={editingLessonData[lesson.id]?.duration || lesson.duration}
                            onChange={(e) => setEditingLessonData({
                              ...editingLessonData,
                              [lesson.id]: { ...editingLessonData[lesson.id], duration: e.target.value }
                            })}
                            className="w-24"
                            placeholder="мин"
                          />
                          <Button size="sm" onClick={() => {
                            // Сохранить изменения
                            setEditingLessonData({
                              ...editingLessonData,
                              [lesson.id]: null
                            });
                          }}>
                            <Icon name="Check" size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => {
                            // Отменить изменения
                            setEditingLessonData({
                              ...editingLessonData,
                              [lesson.id]: null
                            });
                          }}>
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{lesson.title}</h3>
                          {isEditMode && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setEditingLessonData({
                                ...editingLessonData,
                                [lesson.id]: { title: lesson.title, number: lesson.id, duration: lesson.duration }
                              })}
                            >
                              <Icon name="Edit" size={14} />
                            </Button>
                          )}
                        </div>
                        <p className="text-gray-600">Урок {lesson.id} • {lesson.duration} мин</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lesson.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {lesson.score && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{lesson.score}%</div>
                      <div className="text-xs text-gray-500">результат</div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    {isEditMode && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                      >
                        <Icon name="Plus" size={16} className="mr-1" />
                        Контент
                      </Button>
                    )}
                    <Button 
                      variant={lesson.status === 'completed' ? 'outline' : 'default'}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      {lesson.status === 'completed' ? 'Повторить' :
                       lesson.status === 'in-progress' ? 'Продолжить' :
                       'Начать'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Отображение видео и материалов */}
              {(lesson.videos.length > 0 || lesson.materials.length > 0) && (
                <div className="mt-4 pt-4 border-t">
                  {lesson.videos.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Видео:</h4>
                      <div className="flex flex-wrap gap-2">
                        {lesson.videos.map((video) => (
                          <div key={video.id} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                            <Icon name="Video" size={12} className="text-blue-600" />
                            <span className="text-xs text-blue-800">{video.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lesson.materials.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Материалы:</h4>
                      <div className="flex flex-wrap gap-2">
                        {lesson.materials.map((material) => (
                          <a
                            key={material.id}
                            href={material.url}
                            download={material.name}
                            className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full hover:bg-green-100 transition-colors"
                          >
                            <Icon name="FileDown" size={12} className="text-green-600" />
                            <span className="text-xs text-green-800">{material.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Модальное окно для добавления контента */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl bg-white">
            <CardHeader>
              <CardTitle>Добавить контент к уроку: {editingLesson.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Загрузка видео */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Добавить видео</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Введите URL видео (YouTube, Vimeo и др.)"
                      className="flex-1"
                      id="videoUrl"
                    />
                    <Button onClick={() => {
                      const url = document.getElementById('videoUrl').value;
                      if (url) {
                        handleVideoUpload(editingLesson.id, { url, type: 'url' });
                        document.getElementById('videoUrl').value = '';
                      }
                    }}>
                      Добавить
                    </Button>
                  </div>
                  <div className="text-center text-gray-500">или</div>
                  <div>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleVideoUpload(editingLesson.id, file);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Таймкоды */}
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Добавить таймкоды (опционально)</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-2">
                        <Input placeholder="00:00" className="w-20" />
                        <Input placeholder="Описание момента" className="flex-1" />
                        <Button size="sm">
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Загрузка файлов */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Прикрепить файлы</Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      handleMaterialUpload(editingLesson.id, file);
                    });
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Поддерживаются: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, и другие
                </p>
              </div>

              {/* Текущий контент */}
              {(editingLesson.videos?.length > 0 || editingLesson.materials?.length > 0) && (
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Текущий контент</Label>
                  {editingLesson.videos?.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Видео:</h5>
                      <div className="space-y-1">
                        {editingLesson.videos.map((video) => (
                          <div key={video.id} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                            <span className="text-sm">{video.name || 'Видео'}</span>
                            <Button size="sm" variant="ghost">
                              <Icon name="Trash" size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {editingLesson.materials?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Файлы:</h5>
                      <div className="space-y-1">
                        {editingLesson.materials.map((material) => (
                          <div key={material.id} className="flex items-center justify-between bg-green-50 p-2 rounded">
                            <span className="text-sm">{material.name}</span>
                            <Button size="sm" variant="ghost">
                              <Icon name="Trash" size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingLesson(null)}>
                  Закрыть
                </Button>
                <Button onClick={() => setEditingLesson(null)}>
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const ScheduleView = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${subjectId === 'chemistry-sanya' ? 'text-white' : ''}`}>Расписание занятий</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {weeklySchedule.map((item, index) => (
          <Card key={index} className={subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    item.type === 'live' ? 'bg-red-100 text-red-600' :
                    item.type === 'practice' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon 
                      name={item.type === 'live' ? 'Video' : 
                            item.type === 'practice' ? 'PenTool' : 'Flask'} 
                      size={24} 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.lesson}</h3>
                    <p className="text-gray-600">{item.day}, {item.time}</p>
                  </div>
                </div>
                
                <Badge variant={item.type === 'live' ? 'destructive' : 'secondary'}>
                  {item.type === 'live' ? 'Живой урок' :
                   item.type === 'practice' ? 'Практика' : 'Лабораторная'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${subjectId === 'chemistry-sanya' ? 'text-white' : ''}`}>Задания</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''}>
          <CardHeader>
            <CardTitle>Активные задания</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.filter(task => task.status === 'pending').map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant="destructive">до {task.deadline}</Badge>
                  </div>
                  <Progress value={task.progress} className="h-2 mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{task.progress}% выполнено</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                        <Icon name="PenTool" size={14} className="mr-1" />
                        Проверить
                      </Button>
                      <Button size="sm">Продолжить</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Завершенные задания</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.filter(task => task.status === 'completed').map((task) => (
                <div key={task.id} className="p-4 border rounded-lg bg-green-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-600">Завершено {task.deadline}</p>
                    </div>
                    <Icon name="CheckCircle" size={24} className="text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AchievementsView = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${subjectId === 'chemistry-sanya' ? 'text-white' : ''}`}>Достижения</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`text-center ${
            subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''
          } ${
            achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
          }`}>
            <CardContent className="p-6">
              <div className={`inline-flex p-4 rounded-full mb-3 ${
                achievement.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'
              }`}>
                <Icon name={achievement.icon} size={24} />
              </div>
              <h4 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                {achievement.title}
              </h4>
              {achievement.unlocked && (
                <Badge variant="secondary" className="mt-2">Получено!</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${subjectId === 'chemistry-sanya' ? 'text-white' : ''}`}>Мой прогресс</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className={subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''}>
            <CardHeader>
              <CardTitle>Статистика обучения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{subjectData.completedLessons}</div>
                  <div className="text-sm text-gray-600">Уроков завершено</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">91%</div>
                  <div className="text-sm text-gray-600">Средняя оценка</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">12.5ч</div>
                  <div className="text-sm text-gray-600">Время изучения</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-gray-600">Достижения</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Прогресс курса</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{subjectData.progress}%</div>
            <Progress value={subjectData.progress} className="mb-4" />
            <p className="text-gray-600">
              {subjectData.totalLessons - subjectData.completedLessons} уроков осталось
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ManageView = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${subjectId === 'chemistry-sanya' ? 'text-white' : ''}`}>Управление курсом</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className={subjectId === 'chemistry-sanya' ? 'bg-white/90 backdrop-blur-sm' : ''}>
          <CardHeader>
            <CardTitle>Статистика контента</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{lessons.length}</div>
                <div className="text-sm text-gray-600">Всего уроков</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {lessons.reduce((acc, lesson) => acc + lesson.videos.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Видео загружено</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {lessons.reduce((acc, lesson) => acc + lesson.materials.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Материалов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {lessons.filter(lesson => lesson.videos.length > 0 || lesson.materials.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">С контентом</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Быстрое редактирование</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Перейдите в раздел "Уроки" и нажмите "Редактировать уроки", чтобы добавлять видео и материалы к каждому уроку.</p>
            <Button onClick={() => setActiveSection('lessons')}>
              <Icon name="BookOpen" size={16} className="mr-2" />
              Перейти к урокам
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ContentUploadModal = ({ lesson, onClose, onVideoUpload, onMaterialUpload }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Добавить контент</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Урок: {lesson.title}</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Загрузить видео</Label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onVideoUpload(lesson.id, e.target.files[0]);
                  onClose();
                }
              }}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>
          
          <div>
            <Label>Загрузить материалы</Label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onMaterialUpload(lesson.id, e.target.files[0]);
                  onClose();
                }
              }}
              className="w-full p-2 border rounded-lg mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Поддерживаемые форматы: PDF, DOC, DOCX, TXT, PPT, PPTX</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'lessons':
        return <LessonsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'tasks':
        return <TasksView />;
      case 'achievements':
        return <AchievementsView />;
      case 'profile':
        return <ProfileView />;
      case 'manage':
        return <ManageView />;
      default:
        return <DashboardView />;
    }
  };

  if (selectedLesson) {
    const mockLessonData = {
      id: selectedLesson.id.toString(),
      title: selectedLesson.title,
      subject: subjectData.title,
      description: selectedLesson.topics.join(', '),
      duration: selectedLesson.duration,
      content: [
        {
          id: '1',
          type: 'text',
          title: 'Введение',
          content: `Добро пожаловать на урок "${selectedLesson.title}"!\n\nВ этом уроке мы изучим: ${selectedLesson.topics.join(', ')}.\n\nПродолжительность урока: ${selectedLesson.duration} минут.`
        },
        {
          id: '2',
          type: 'video',
          title: 'Основная часть',
          content: 'Теоретический материал по теме урока',
          duration: Math.floor(selectedLesson.duration * 0.6)
        },
        {
          id: '3',
          type: 'quiz',
          title: 'Проверка знаний',
          content: 'Ответьте на вопросы для закрепления материала',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'Какое утверждение верно?',
              options: [
                'Периодическая система содержит 118 элементов',
                'Периодическая система содержит 120 элементов',
                'Периодическая система содержит 115 элементов'
              ],
              correctAnswer: 0,
              explanation: 'На данный момент периодическая система содержит 118 подтвержденных химических элементов.'
            }
          ]
        }
      ]
    };

    return (
      <LessonPlayer
        lesson={mockLessonData}
        onComplete={() => setSelectedLesson(null)}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  if (selectedTask) {
    return (
      <TaskChecker
        taskId={selectedTask.id.toString()}
        taskTitle={selectedTask.title}
        taskContent={`Задание: ${selectedTask.title}\n\nОписание: ${selectedTask.title === 'Решить 10 задач по периодичности' 
          ? 'Решите задачи на определение периодичности элементов и их свойств.\n\n1. Определите период и группу элемента с атомным номером 19\n2. Сравните радиусы атомов Li, Na, K\n3. Объясните изменение электроотрицательности в периоде\n4. Какой элемент имеет большую энергию ионизации: Be или B?\n5. Расположите элементы по возрастанию металлических свойств: Mg, Al, Si' 
          : 'Изучите процессы клеточного деления и их особенности.\n\nТемы для изучения:\n- Митоз: фазы и их характеристика\n- Мейоз: особенности процесса\n- Различия между митозом и мейозом\n- Биологическое значение клеточного деления'}`}
        onComplete={(score, feedback) => {
          console.log(`Задание "${selectedTask.title}" оценено на ${score}%: ${feedback}`);
          setSelectedTask(null);
        }}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">

      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <div className="flex items-center space-x-3">
                {/* Logo for Chemistry Course */}
                {subjectId === 'chemistry-sanya' ? (
                  <img 
                    src="https://cdn.poehali.dev/files/24f93e50-2115-481e-939f-89bb8ce5f7b5.png" 
                    alt="Химия с Саньком" 
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Icon name="Atom" size={24} className="text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{subjectData.title}</h1>
                  <p className="text-sm text-gray-600">Преподаватель: {subjectData.teacher}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Прогресс: {subjectData.progress}%
              </div>
              <div className="w-32">
                <Progress value={subjectData.progress} className="h-2" />
              </div>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={18} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-1" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 space-y-2 relative">
            {/* Teacher Photo Background for Sidebar in Chemistry Course */}
            {subjectId === 'chemistry-sanya' && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-15 rounded-lg"
                style={{
                  backgroundImage: 'url(https://cdn.poehali.dev/files/f27ba186-5dbd-49ba-944c-ad2d22efc563.jpg)',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}
            <nav className="relative z-10">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main 
            className="flex-1 rounded-lg p-6 relative"
            style={{
              background: subjectId === 'chemistry-sanya' 
                ? `linear-gradient(135deg, rgba(30, 40, 80, 0.95), rgba(20, 30, 60, 0.95)), url('https://cdn.poehali.dev/files/a3b56f0b-2cae-490d-8925-42fbe72eb8f6.jpeg')`
                : 'rgba(255, 255, 255, 0.8)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              className="relative z-10"
              style={{
                color: subjectId === 'chemistry-sanya' ? '#ffffff' : 'inherit'
              }}
            >
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal && !isAuthenticated}
        onClose={() => window.history.back()}
        onLogin={handleLogin}
        subjectTitle={subjectData.title}
      />
    </div>
  );

  // Показываем только модальное окно входа, если пользователь не авторизован
  if (!isAuthenticated) {
    return (
      <>
        <LoginModal
          isOpen={true}
          onClose={() => window.history.back()}
          onLogin={handleLogin}
          subjectTitle={subjectData.title}
        />
      </>
    );
  }
};

export default Subject;