import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('subjects');
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = [
    {
      id: 'chemistry-sanya',
      title: 'Химия с Саньком',
      description: 'Углубленное изучение химии для старших классов и подготовки к ЕГЭ',
      icon: 'Atom',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      teacher: 'Александр',
      progress: 65,
      lessons: 24,
      completedLessons: 16
    },
    {
      id: 'biology',
      title: 'Биология',
      description: 'Изучение биологических процессов и подготовка к экзаменам',
      icon: 'Microscope',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      teacher: 'Мария Петровна',
      progress: 45,
      lessons: 20,
      completedLessons: 9
    },
    {
      id: 'chemistry-oge',
      title: 'Химия ОГЭ',
      description: 'Целенаправленная подготовка к ОГЭ по химии для 9 класса',
      icon: 'FlaskConical',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      teacher: 'Анна Сергеевна',
      progress: 80,
      lessons: 18,
      completedLessons: 14
    }
  ];

  const navigationItems = [
    { id: 'subjects', title: 'Предметы', icon: 'BookOpen' },
    { id: 'schedule', title: 'Расписание', icon: 'Calendar' },
    { id: 'tasks', title: 'Задания', icon: 'ClipboardList' },
    { id: 'achievements', title: 'Достижения', icon: 'Trophy' },
    { id: 'profile', title: 'Профиль', icon: 'User' }
  ];

  const recentLessons = [
    {
      id: 1,
      subject: 'Химия с Саньком',
      title: 'Периодическая система элементов',
      status: 'completed',
      date: '2024-12-18',
      score: 95
    },
    {
      id: 2,
      subject: 'Биология',
      title: 'Клеточное строение организмов',
      status: 'in-progress',
      date: '2024-12-19',
      score: null
    },
    {
      id: 3,
      subject: 'Химия ОГЭ',
      title: 'Решение задач на растворы',
      status: 'pending',
      date: '2024-12-20',
      score: null
    }
  ];

  const achievements = [
    { id: 1, title: 'Первый урок', icon: 'Star', unlocked: true },
    { id: 2, title: 'Неделя обучения', icon: 'Calendar', unlocked: true },
    { id: 3, title: 'Отличник', icon: 'Award', unlocked: false },
    { id: 4, title: 'Химик-эксперт', icon: 'FlaskConical', unlocked: false }
  ];

  const SubjectsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Мои предметы</h2>
        <Button variant="outline">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить предмет
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className={`${subject.borderColor} border-2 hover:shadow-lg transition-shadow cursor-pointer`}>
            <CardHeader className={`${subject.bgColor} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color} text-white`}>
                  <Icon name={subject.icon} size={24} />
                </div>
                <Badge variant="secondary">{subject.teacher}</Badge>
              </div>
              <CardTitle className="text-lg">{subject.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-4">{subject.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Прогресс</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Уроков: {subject.completedLessons}/{subject.lessons}</span>
                  <span>Следующий урок</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={() => setSelectedSubject(subject.id)}
              >
                Продолжить обучение
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const ScheduleView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Расписание</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Сегодня, 19 декабря</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        lesson.status === 'completed' ? 'bg-green-500' :
                        lesson.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-gray-600">{lesson.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {lesson.score && (
                        <Badge variant="secondary">{lesson.score}%</Badge>
                      )}
                      <Button size="sm" variant={lesson.status === 'completed' ? 'outline' : 'default'}>
                        {lesson.status === 'completed' ? 'Повторить' : 
                         lesson.status === 'in-progress' ? 'Продолжить' : 'Начать'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Статистика недели</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">7</div>
                  <div className="text-sm text-gray-600">уроков завершено</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">4.2ч</div>
                  <div className="text-sm text-gray-600">времени обучения</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-gray-600">средняя оценка</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const TasksView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Задания</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Активные задания</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Решить 10 задач по химии</h4>
                  <Badge variant="destructive">Срок: завтра</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Задачи на молярность растворов</p>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">6/10 завершено</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Изучить клеточное деление</h4>
                  <Badge variant="secondary">3 дня</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">Митоз и мейоз</p>
                <Progress value={25} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">1/4 завершено</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Завершенные задания</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Периодическая система</h4>
                    <p className="text-sm text-gray-600">Оценка: 95%</p>
                  </div>
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>
              </div>
              
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Органические соединения</h4>
                    <p className="text-sm text-gray-600">Оценка: 88%</p>
                  </div>
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AchievementsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Достижения</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`text-center ${achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
            <CardContent className="p-4">
              <div className={`inline-flex p-3 rounded-full mb-2 ${achievement.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'}`}>
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
      <h2 className="text-2xl font-bold text-gray-900">Профиль</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              АП
            </div>
            <h3 className="font-semibold text-lg">Анна Петрова</h3>
            <p className="text-gray-600">Ученица 10 класса</p>
            <Badge variant="secondary" className="mt-2">Уровень: Продвинутый</Badge>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Общая статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-gray-600">Урока завершено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Средняя оценка</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15.3ч</div>
                  <div className="text-sm text-gray-600">Время обучения</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">4</div>
                  <div className="text-sm text-gray-600">Достижения</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'subjects':
        return <SubjectsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'tasks':
        return <TasksView />;
      case 'achievements':
        return <AchievementsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <SubjectsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">EduPlatform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Icon name="Bell" size={18} />
              </Button>
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

export default Index;