import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [activeSection, setActiveSection] = useState('subjects');
  const navigate = useNavigate();

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
      completedLessons: 16,
      logoUrl: 'https://cdn.poehali.dev/files/24f93e50-2115-481e-939f-89bb8ce5f7b5.png',
      teacherPhoto: 'https://cdn.poehali.dev/files/f27ba186-5dbd-49ba-944c-ad2d22efc563.jpg'
    },
    {
      id: 'biology',
      title: 'Био с C-MaN',
      description: 'Изучение биологических процессов и подготовка к экзаменам',
      icon: 'Microscope',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      teacher: 'Семён',
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
    { id: 'subjects', title: 'Мои предметы', icon: 'BookOpen' },
    { id: 'minicourses', title: 'Мини-курсы', icon: 'Zap' },
    { id: 'contacts', title: 'Контакты', icon: 'Phone' },
    { id: 'about', title: 'О нас', icon: 'Info' },
    { id: 'reviews', title: 'Отзывы', icon: 'MessageSquare' }
  ];

  const miniCourses = [
    {
      id: 'quantum-leap',
      title: 'Квантовый скачок',
      description: 'Интенсивный курс по квантовой физике и химии для подготовки к олимпиадам',
      duration: '2 недели',
      stages: 8,
      completedStages: 0,
      difficulty: 'Продвинутый',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: 'Zap'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Анна Петрова',
      grade: '11 класс',
      text: 'Химия с Саньком помогла мне разобраться в сложных темах. Теперь химия - мой любимый предмет!',
      rating: 5,
      subject: 'Химия с Саньком',
      photo: '/img/066a34d1-1476-4b66-97df-463a08a30fbc.jpg'
    },
    {
      id: 2,
      name: 'Михаил Сидоров',
      grade: '9 класс',
      text: 'Отличная подготовка к ОГЭ по химии. Результат превзошел ожидания!',
      rating: 5,
      subject: 'Химия ОГЭ',
      photo: '/img/2f63d23a-41a9-4feb-a819-993cb7447a2b.jpg'
    },
    {
      id: 3,
      name: 'Елена Васильева',
      grade: '10 класс',
      text: 'Биология стала понятнее благодаря интерактивным урокам и отличным объяснениям.',
      rating: 4,
      subject: 'Биология',
      photo: '/img/cfac57b8-3822-429e-8c36-841f765ca4c4.jpg'
    }
  ];

  const SubjectsView = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Команда молодых и инициативных</h2>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Изучайте естественные науки с лучшими преподавателями. 
          Интерактивные уроки, персональный подход и отслеживание прогресса.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className={`${subject.borderColor} border-2 hover:shadow-lg transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm`}>
            <CardHeader className={`${subject.bgColor} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color} text-white`}>
                  {subject.logoUrl ? (
                    <img 
                      src={subject.logoUrl} 
                      alt={subject.title}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <Icon name={subject.icon} size={24} />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {subject.teacherPhoto && (
                    <img 
                      src={subject.teacherPhoto} 
                      alt={subject.teacher}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  )}
                  <Badge variant="secondary">{subject.teacher}</Badge>
                </div>
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
                onClick={() => navigate(`/subject/${subject.id}`)}
              >
                Перейти к обучению
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Секция отзывов */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Отзывы наших учеников</h3>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Узнайте, что говорят наши студенты о своем опыте обучения
          </p>
        </div>

        <div className="space-y-8">
          {reviews.map((review, index) => (
            <div key={review.id} className={`flex items-center gap-8 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}>
              {/* Фото */}
              <div className="flex-shrink-0">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-24 h-24 rounded-lg object-cover border-4 border-white/20"
                />
              </div>

              {/* Карточка с отзывом */}
              <Card className="flex-1 bg-white/90 backdrop-blur-sm max-w-md">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.grade}</p>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Icon 
                        key={i}
                        name="Star" 
                        size={16} 
                        className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.text}</p>
                  
                  <Badge variant="outline">{review.subject}</Badge>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ContactsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Контакты</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Свяжитесь с нами</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={20} className="text-blue-600" />
              <span>info@eduplatform.ru</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="Phone" size={20} className="text-green-600" />
              <span>+7 (999) 123-45-67</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="MapPin" size={20} className="text-red-600" />
              <span>Москва, ул. Образования, 15</span>
            </div>
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={20} className="text-purple-600" />
              <span>Пн-Пт: 9:00-18:00</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Напишите нам</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сообщение</label>
                <textarea 
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ваше сообщение..."
                />
              </div>
              <Button className="w-full">Отправить</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AboutView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">О нас</h2>
      
      <div className="space-y-8">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="GraduationCap" size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Наша миссия</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Сделать качественное образование доступным для каждого ученика. 
                Мы создаем интерактивную среду обучения, где сложные науки становятся понятными и увлекательными.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Опытные преподаватели</h4>
              <p className="text-gray-600 text-sm">
                Наши учителя имеют многолетний опыт и используют современные методики обучения
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Lightbulb" size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Интерактивный подход</h4>
              <p className="text-gray-600 text-sm">
                Используем современные технологии для создания увлекательных уроков
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name="Target" size={24} className="text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Результативность</h4>
              <p className="text-gray-600 text-sm">
                Отслеживаем прогресс и помогаем достигать учебных целей
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const ReviewsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Отзывы учеников</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.grade}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Icon 
                    key={i}
                    name="Star" 
                    size={16} 
                    className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 mb-3">{review.text}</p>
              
              <Badge variant="outline">{review.subject}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Поделитесь своим опытом</h3>
          <p className="text-gray-600 mb-6">
            Ваши отзывы помогают нам становиться лучше и мотивируют других учеников
          </p>
          <Button>Оставить отзыв</Button>
        </CardContent>
      </Card>
    </div>
  );

  const MiniCoursesView = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Мини-курсы</h2>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Интенсивные курсы для углубленного изучения сложных тем. 
          Быстрый путь к экспертизе в выбранной области.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miniCourses.map((course) => (
          <Card key={course.id} className={`${course.bgColor} ${course.borderColor} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm`}
                onClick={() => navigate(`/minicourse/${course.id}`)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${course.color} flex items-center justify-center`}>
                  <Icon name={course.icon} size={24} className="text-white" />
                </div>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>
              <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Прогресс</span>
                  <span className="font-medium">{course.completedStages}/{course.stages} этапов</span>
                </div>
                <Progress value={(course.completedStages / course.stages) * 100} className="h-2" />
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Icon name="Clock" size={16} className="mr-1" />
                    {course.duration}
                  </div>
                  <Button size="sm" className={`bg-gradient-to-r ${course.color} hover:opacity-90`}>
                    {course.completedStages === 0 ? 'Начать' : 'Продолжить'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Plus" size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-4">Создать свой мини-курс</h3>
          <p className="text-gray-600 mb-6">
            Загружайте свои материалы и создавайте уникальные образовательные программы
          </p>
          <Button variant="outline">Начать создание</Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'subjects':
        return <SubjectsView />;
      case 'minicourses':
        return <MiniCoursesView />;
      case 'contacts':
        return <ContactsView />;
      case 'about':
        return <AboutView />;
      case 'reviews':
        return <ReviewsView />;
      default:
        return <SubjectsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Космический фон */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/files/f5b0ceb5-7132-42cd-a8d6-841d27ed2207.jpeg)'
        }}
      />
      {/* Тёмный оверлей для лучшей читаемости */}
      <div className="fixed inset-0 bg-black/40 z-0" />
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Команда молодых и инициативных</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
                      ? 'bg-blue-100/90 text-blue-700 font-medium backdrop-blur-sm'
                      : 'text-white hover:bg-white/20 backdrop-blur-sm'
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