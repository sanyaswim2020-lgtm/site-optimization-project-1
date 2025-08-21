import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import LessonPlayer from '@/components/LessonPlayer';

const Subject = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);

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
    { id: 'profile', title: 'Прогресс', icon: 'BarChart3' }
  ];

  const lessons = [
    {
      id: 1,
      title: 'Периодическая система элементов',
      status: 'completed',
      duration: 45,
      score: 95,
      topics: ['Строение атома', 'Периодические свойства']
    },
    {
      id: 2,
      title: 'Химические связи',
      status: 'completed',
      duration: 50,
      score: 88,
      topics: ['Ионная связь', 'Ковалентная связь', 'Металлическая связь']
    },
    {
      id: 3,
      title: 'Окислительно-восстановительные реакции',
      status: 'in-progress',
      duration: 60,
      score: null,
      topics: ['Степень окисления', 'Окислители и восстановители']
    },
    {
      id: 4,
      title: 'Электролиз и электрохимия',
      status: 'pending',
      duration: 55,
      score: null,
      topics: ['Процессы на электродах', 'Законы Фарадея']
    }
  ];

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
        <Card>
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
        <Card>
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

  const LessonsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Уроки курса</h2>
        <div className="flex items-center space-x-4">
          <Progress value={subjectData.progress} className="w-32 h-2" />
          <span className="text-sm text-gray-600">{subjectData.progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${
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
                  
                  <div>
                    <h3 className="font-semibold text-lg">{lesson.title}</h3>
                    <p className="text-gray-600">Урок {lesson.id} • {lesson.duration} мин</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lesson.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {lesson.score && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{lesson.score}%</div>
                      <div className="text-xs text-gray-500">результат</div>
                    </div>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ScheduleView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Расписание занятий</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {weeklySchedule.map((item, index) => (
          <Card key={index}>
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
      <h2 className="text-2xl font-bold">Задания</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
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
                    <Button size="sm">Продолжить</Button>
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
      <h2 className="text-2xl font-bold">Достижения</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`text-center ${
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
      <h2 className="text-2xl font-bold">Мой прогресс</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
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
          type: 'text' as const,
          title: 'Введение',
          content: `Добро пожаловать на урок "${selectedLesson.title}"!\n\nВ этом уроке мы изучим: ${selectedLesson.topics.join(', ')}.\n\nПродолжительность урока: ${selectedLesson.duration} минут.`
        },
        {
          id: '2',
          type: 'video' as const,
          title: 'Основная часть',
          content: 'Теоретический материал по теме урока',
          duration: Math.floor(selectedLesson.duration * 0.6)
        },
        {
          id: '3',
          type: 'quiz' as const,
          title: 'Проверка знаний',
          content: 'Ответьте на вопросы для закрепления материала',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice' as const,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Icon name="Atom" size={24} className="text-white" />
                </div>
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 space-y-2">
            <nav>
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
          <main className="flex-1">
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Subject;