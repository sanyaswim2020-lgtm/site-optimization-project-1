import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTool, setSelectedTool] = useState('pen');
  const [activeSection, setActiveSection] = useState('main');

  const subjects = [
    {
      id: 'chemistry-sanya',
      title: 'Химия с Саньком',
      description: 'Углубленное изучение химии для старших классов и подготовки к ЕГЭ',
      icon: 'Atom',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      teacher: 'Александр'
    },
    {
      id: 'biology',
      title: 'Биология',
      description: 'Изучение биологических процессов и подготовка к экзаменам',
      icon: 'Microscope',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      teacher: 'Преподаватель биологии'
    },
    {
      id: 'chemistry-oge',
      title: 'Химия ОГЭ',
      description: 'Целенаправленная подготовка к ОГЭ по химии для 9 класса',
      icon: 'FlaskConical',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      teacher: 'Специалист ОГЭ'
    }
  ];

  const navigationItems = [
    { id: 'main', title: 'Главная', icon: 'Home' },
    { id: 'lessons', title: 'Обучение', icon: 'BookOpen' },
    { id: 'tasks', title: 'Задания', icon: 'ClipboardList' },
    { id: 'profile', title: 'Профиль', icon: 'User' },
    { id: 'results', title: 'Результаты', icon: 'BarChart3' },
    { id: 'contacts', title: 'Контакты', icon: 'Mail' }
  ];

  const tools = [
    { id: 'pen', icon: 'Pen', title: 'Ручка' },
    { id: 'pencil', icon: 'Pencil', title: 'Карандаш' },
    { id: 'highlighter', icon: 'Highlighter', title: 'Выделитель' },
    { id: 'comment', icon: 'MessageSquare', title: 'Комментарий' }
  ];

  const getCurrentSubject = () => subjects.find(s => s.id === selectedSubject);

  // Если не выбран предмет, показываем выбор предметов
  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Хедер */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Icon name="GraduationCap" size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Образовательная платформа</h1>
              <p className="text-xl text-gray-600">Выберите предмет для изучения</p>
            </div>
          </div>
        </header>

        {/* Выбор предметов */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${subject.bgColor} ${subject.borderColor} border-2`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-r ${subject.color} rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                    <Icon name={subject.icon as any} size={36} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{subject.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4 leading-relaxed">{subject.description}</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Icon name="User" size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{subject.teacher}</span>
                  </div>
                  <Button className={`w-full bg-gradient-to-r ${subject.color} hover:shadow-lg`}>
                    Начать изучение
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Дополнительная информация */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Для всех уровней</h3>
                <p className="text-gray-600 text-sm">От базового до углубленного изучения</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Icon name="BookOpen" size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Интерактивное обучение</h3>
                <p className="text-gray-600 text-sm">Современные методы преподавания</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Icon name="Trophy" size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Результат гарантирован</h3>
                <p className="text-gray-600 text-sm">Проверенные методики подготовки</p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Подвал */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600">© 2024 Образовательная платформа. Все права защищены.</p>
              <p className="text-sm text-gray-500 mt-2">Изучайте науки с лучшими преподавателями! 🧪🔬</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const currentSubject = getCurrentSubject();

  const renderMainContent = () => {
    switch (activeSection) {
      case 'lessons':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Обучение - {currentSubject?.title}</h2>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {currentSubject?.teacher}
              </Badge>
            </div>
            
            {/* Контент в зависимости от предмета */}
            {selectedSubject === 'chemistry-sanya' && (
              <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="bg-green-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold">Валентные и внешние электроны</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p><strong>Внешние электроны</strong> — это электроны, находящиеся на самом дальнем от ядра энергетическом уровне (с самым большим номером n).</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p><strong>Валентные электроны</strong> — это электроны, которые могут участвовать в образовании химических связей.</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm mb-2">Для <strong>s и p-элементов</strong> (элементы главных подгрупп) валентными являются <strong>все электроны внешнего уровня</strong>. Их число равно номеру группы.</p>
                    </div>
                    <div>
                      <p className="text-sm mb-2">Для <strong>d-элементов</strong> (элементы побочных подгрупп) валентными являются электроны <strong>внешнего s-подуровня и предвнешнего d-подуровня</strong>.</p>
                    </div>
                  </div>
                </div>

                {/* Таблица в стиле скриншота */}
                <div className="overflow-x-auto mt-6">
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4 border-l-4 border-yellow-400">
                    <p className="text-sm italic text-center font-medium">Иногда на разнице между этими понятиями ловят в заданиях! Обязательно посмотрите дальнейшие примеры...</p>
                  </div>
                  <table className="w-full border-collapse border-2 border-gray-800">
                    <thead>
                      <tr className="bg-orange-200">
                        <th className="border border-gray-800 p-3 text-left font-semibold">Элемент</th>
                        <th className="border border-gray-800 p-3 text-left font-semibold">Конфигурация</th>
                        <th className="border border-gray-800 p-3 text-left font-semibold">Внешние электроны</th>
                        <th className="border border-gray-800 p-3 text-left font-semibold">Валентные электроны</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-blue-100">
                        <td className="border border-gray-800 p-3 font-mono font-bold">₁₅P</td>
                        <td className="border border-gray-800 p-3 font-mono">...3s²3p³</td>
                        <td className="border border-gray-800 p-3">5 (на 3-м уровне)</td>
                        <td className="border border-gray-800 p-3">5 (2e на 4s и 3e на 3d)</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-gray-800 p-3 font-mono font-bold">₂₆Fe</td>
                        <td className="border border-gray-800 p-3 font-mono">...3d⁶4s²</td>
                        <td className="border border-gray-800 p-3">2 (на 4s-орбитали)</td>
                        <td className="border border-gray-800 p-3">8 (2e на 4s и 6e на 3d)</td>
                      </tr>
                      <tr className="bg-blue-100">
                        <td className="border border-gray-800 p-3 font-mono font-bold">₂₄Cr</td>
                        <td className="border border-gray-800 p-3 font-mono">...3d⁵4s¹</td>
                        <td className="border border-gray-800 p-3">1 (на 4s-орбитали)</td>
                        <td className="border border-gray-800 p-3">6 (1e на 4s и 5e на 3d)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-green-700 mb-3">Сходные и одинаковые конфигурации</h4>
                  <div className="bg-white p-4 rounded-lg border border-green-200 space-y-3">
                    <p className="text-sm">На разнице между «сходной» и «одинаковой» конфигурацией часто ловят на экзамене. Посмотрите на следующий пример:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
                      <div>
                        <div className="font-bold">K</div>
                        <div>1s²2s²2p⁶3s²3p⁶4s¹</div>
                      </div>
                      <div>
                        <div className="font-bold">Cr</div>
                        <div>1s²2s²2p⁶3s²3p⁶3d⁵4s¹</div>
                      </div>
                      <div>
                        <div className="font-bold">Cu</div>
                        <div>1s²2s²2p⁶3s²3p⁶3d¹⁰4s¹</div>
                      </div>
                    </div>
                    
                    <p className="text-sm">У этих атомов внешним является один и тот же энергетический уровень (4 у. у.), и <span className="bg-yellow-200 px-1 rounded">на нём у всех атомов одинаковое количество электронов (1е на 4s-подуровне)</span>. У <strong>K, Cr, Cu одинаковые конфигурации внешнего электронного слоя</strong> (уровня). <strong>Электронный слой и энергетический уровень - это синонимы</strong>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Задания - {currentSubject?.title}</h2>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Система проверки активна
              </Badge>
            </div>
            
            {/* Панель инструментов для проверки */}
            <Card className="border-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Icon name="Wrench" size={20} />
                  <span>Инструменты проверки</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool(tool.id)}
                      className="flex items-center space-x-2"
                    >
                      <Icon name={tool.icon as any} size={16} />
                      <span>{tool.title}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Icon name="Info" size={16} className="inline mr-2" />
                    Активный инструмент: <strong>{tools.find(t => t.id === selectedTool)?.title}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Пример тестового задания */}
            <Card className="border-2 border-dashed border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Задание 1: Электронные конфигурации (Тестовое)</span>
                  <Badge>Тест</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 font-medium">
                  Какой элемент имеет электронную конфигурацию 1s²2s²2p⁶3s²3p⁶3d¹⁰4s²4p⁵?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Бром (Br)', 'Хлор (Cl)', 'Йод (I)', 'Фтор (F)'].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto p-3 text-left"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Пример задания в зависимости от предмета */}
            <Card className={`border-2 border-dashed ${currentSubject?.borderColor} ${currentSubject?.bgColor}`}>
              <CardHeader>
                <CardTitle>
                  Задание 1: {selectedSubject === 'chemistry-sanya' ? 'Электронные конфигурации (Углубленный уровень)' :
                              selectedSubject === 'biology' ? 'Строение клетки' :
                              'Периодическая система (ОГЭ)'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSubject === 'chemistry-sanya' && (
                  <div>
                    <p className="text-gray-700 font-medium mb-4">
                      Определите количество валентных электронов и возможные степени окисления для элементов:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm mb-4">
                      <li>Хром (Cr) - 24 электрона</li>
                      <li>Марганец (Mn) - 25 электронов</li>
                      <li>Медь (Cu) - 29 электронов</li>
                    </ol>
                  </div>
                )}

                {selectedSubject === 'biology' && (
                  <div>
                    <p className="text-gray-700 font-medium mb-4">
                      Сравните строение растительной и животной клетки:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                      <li>Укажите общие органоиды</li>
                      <li>Назовите различия в строении</li>
                      <li>Объясните функциональные особенности</li>
                    </ul>
                  </div>
                )}

                {selectedSubject === 'chemistry-oge' && (
                  <div>
                    <p className="text-gray-700 font-medium mb-4">
                      В каком периоде и группе находится элемент с зарядом ядра +17?
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {['2 период, VII группа', '3 период, VII группа', '2 период, V группа', '3 период, V группа'].map((option, index) => (
                        <Button key={index} variant="outline" className="justify-start text-left">
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 min-h-[150px]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">Область для решения</p>
                    <div className="flex items-center space-x-2">
                      <Icon name={tools.find(t => t.id === selectedTool)?.icon as any} size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {tools.find(t => t.id === selectedTool)?.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 italic">
                    Здесь студент может писать решение с выбранным инструментом...
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Сохранить черновик</Button>
                  <Button>Отправить на проверку</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Профиль студента</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">С</span>
                  </div>
                  <h3 className="font-semibold text-xl">Саня</h3>
                  <p className="text-gray-600">Изучаю химию</p>
                  <Badge className="mt-2">Активный студент</Badge>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Прогресс обучения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Электронные конфигурации</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Химические связи</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Периодическая система</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                  <p className="text-gray-600">Выполнено заданий</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">4.2</div>
                  <p className="text-gray-600">Средний балл</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24ч</div>
                  <p className="text-gray-600">Время изучения</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Результаты</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                  <p className="text-gray-700 font-medium">Правильных ответов</p>
                  <Icon name="TrendingUp" size={24} className="text-green-500 mx-auto mt-2" />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
                  <p className="text-gray-700 font-medium">Выполнено тестов</p>
                  <Icon name="CheckCircle" size={24} className="text-blue-500 mx-auto mt-2" />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">4.6</div>
                  <p className="text-gray-700 font-medium">Средняя оценка</p>
                  <Icon name="Star" size={24} className="text-purple-500 mx-auto mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>История результатов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { test: 'Электронные конфигурации', score: '95%', date: '20.08.2024', type: 'Развернутое' },
                    { test: 'Валентность и степень окисления', score: '88%', date: '19.08.2024', type: 'Тест' },
                    { test: 'Периодическая система', score: '92%', date: '18.08.2024', type: 'Тест' },
                    { test: 'Химические связи', score: '87%', date: '17.08.2024', type: 'Развернутое' },
                  ].map((result, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <span className="font-medium">{result.test}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">{result.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={`${parseFloat(result.score) >= 90 ? 'bg-green-500' : parseFloat(result.score) >= 80 ? 'bg-blue-500' : 'bg-yellow-500'} text-white`}>
                          {result.score}
                        </Badge>
                        <span className="text-sm text-gray-500">{result.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Контакты</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Mail" size={20} />
                    <span>Связаться с нами</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Mail" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">support@chemwithsanya.ru</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="Phone" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Телефон</p>
                      <p className="text-gray-600">+7 (999) 123-45-67</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Icon name="MapPin" size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Адрес</p>
                      <p className="text-gray-600">Москва, Россия</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Обратная связь</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Ваше имя</label>
                    <input 
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Введите ваше имя"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Email</label>
                    <input 
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Ваше сообщение</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Напишите ваш вопрос или предложение..."
                    />
                  </div>
                  <Button className="w-full">Отправить сообщение</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            {/* Герой-секция для выбранного предмета */}
            <div className={`text-center py-16 bg-gradient-to-br ${currentSubject?.color} rounded-2xl text-white relative overflow-hidden`}>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Icon name={currentSubject?.icon as any} size={32} className="text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">{currentSubject?.title}</h1>
                <p className="text-xl md:text-2xl mb-8 text-white/90">{currentSubject?.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => setActiveSection('lessons')}
                    className="bg-white/90 text-gray-800 hover:bg-white"
                  >
                    <Icon name="BookOpen" size={20} className="mr-2" />
                    Начать обучение
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setActiveSection('tasks')}
                    className="border-white/50 text-white hover:bg-white/10"
                  >
                    <Icon name="ClipboardList" size={20} className="mr-2" />
                    Перейти к заданиям
                  </Button>
                </div>
              </div>
            </div>

            {/* Основные разделы */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'lessons', title: 'Обучение', icon: 'BookOpen', desc: 'Интерактивные уроки по химии с подробными объяснениями', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
                { id: 'tasks', title: 'Задания', icon: 'ClipboardList', desc: 'Практические задачи с системой проверки', color: 'bg-green-50 border-green-200 hover:bg-green-100' },
                { id: 'results', title: 'Результаты', icon: 'BarChart3', desc: 'Отслеживание прогресса и статистика', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
                { id: 'profile', title: 'Профиль', icon: 'User', desc: 'Личная информация и достижения', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
                { id: 'contacts', title: 'Контакты', icon: 'Mail', desc: 'Связаться с преподавателем', color: 'bg-pink-50 border-pink-200 hover:bg-pink-100' },
              ].map((section) => (
                <Card 
                  key={section.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${section.color}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Icon name={section.icon as any} size={28} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Краткая статистика */}
            <Card className="bg-gradient-to-r from-gray-50 to-white">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Прогресс изучения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                    <p className="text-sm text-gray-600">Уроков изучено</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                    <p className="text-sm text-gray-600">Правильных ответов</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">24ч</div>
                    <p className="text-sm text-gray-600">Время изучения</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">4.2</div>
                    <p className="text-sm text-gray-600">Средний балл</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Особенности платформы */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Особенности нашей платформы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Pen" size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Система проверки заданий</h4>
                      <p className="text-sm text-gray-600">Ручка, карандаш, выделитель и комментарии для удобной проверки</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="BookOpen" size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Подробные объяснения</h4>
                      <p className="text-sm text-gray-600">Каждая тема разобрана с примерами и таблицами</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="BarChart3" size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Отслеживание прогресса</h4>
                      <p className="text-sm text-gray-600">Следите за успехами и улучшайте результаты</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Персональный подход</h4>
                      <p className="text-sm text-gray-600">Индивидуальная обратная связь от преподавателя</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация с возможностью вернуться к выбору предметов */}
      <nav className="bg-white border-b-2 border-green-500 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedSubject('')}
                className="mr-2"
              >
                <Icon name="ArrowLeft" size={16} />
              </Button>
              <div className={`w-10 h-10 bg-gradient-to-r ${currentSubject?.color} rounded-lg flex items-center justify-center`}>
                <Icon name={currentSubject?.icon as any} size={24} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">{currentSubject?.title}</span>
                <div className="text-xs text-gray-500">{currentSubject?.teacher}</div>
              </div>
            </div>
            
            <div className="hidden lg:flex space-x-1">
              {navigationItems.slice(0, 3).map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon name={item.icon as any} size={16} />
                  <span>{item.title}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Мобильная навигация */}
      <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
        <div className="flex overflow-x-auto px-4 py-2 space-x-2 scrollbar-hide">
          {navigationItems.slice(0, 3).map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(item.id)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <Icon name={item.icon as any} size={16} />
              <span>{item.title}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderMainContent()}
      </main>

      {/* Подвал */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="GraduationCap" size={20} className="text-green-500" />
              <span className="font-bold text-lg">Образовательная платформа</span>
            </div>
            <p className="text-gray-600">© 2024 Все права защищены.</p>
            <p className="text-sm text-gray-500">Изучайте науки с лучшими преподавателями! 🧪🔬📚</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;