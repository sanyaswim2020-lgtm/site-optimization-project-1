import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'drag-drop';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

interface LessonContent {
  id: string;
  type: 'video' | 'text' | 'interactive' | 'quiz';
  title: string;
  content: string;
  duration?: number;
  questions?: Question[];
}

interface Lesson {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  content: LessonContent[];
}

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onComplete, onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const currentContent = lesson.content[currentSlide];
  const progress = ((currentSlide + 1) / lesson.content.length) * 100;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentSlide < lesson.content.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    
    lesson.content.forEach(content => {
      if (content.questions) {
        content.questions.forEach(question => {
          total++;
          if (answers[question.id] === question.correctAnswer.toString()) {
            correct++;
          }
        });
      }
    });
    
    return total > 0 ? Math.round((correct / total) * 100) : 100;
  };

  const renderVideoContent = () => (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Icon name="Play" size={48} className="mx-auto mb-2" />
          <p>Видео: {currentContent.title}</p>
          <p className="text-sm opacity-75">{currentContent.duration} мин</p>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p>{currentContent.content}</p>
      </div>
    </div>
  );

  const renderTextContent = () => (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">{currentContent.title}</h3>
          <div className="whitespace-pre-line">{currentContent.content}</div>
        </div>
      </div>
    </div>
  );

  const renderInteractiveContent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Lightbulb" size={20} className="mr-2 text-yellow-500" />
            {currentContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <p className="text-lg">{currentContent.content}</p>
          </div>
          
          {currentContent.questions?.map((question) => (
            <div key={question.id} className="mt-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-3">{question.question}</h4>
              
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(question.id, index.toString())}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        answers[question.id] === index.toString()
                          ? 'bg-blue-100 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {question.type === 'text' && (
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  placeholder="Введите ваш ответ..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              )}
              
              {answers[question.id] && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderQuizContent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="HelpCircle" size={20} className="mr-2 text-blue-500" />
            Проверьте свои знания
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentContent.questions?.map((question, index) => (
            <div key={question.id} className="mb-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-3">
                {index + 1}. {question.question}
              </h4>
              
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswer(question.id, optionIndex.toString())}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        answers[question.id] === optionIndex.toString()
                          ? 'bg-blue-100 border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentContent.type) {
      case 'video':
        return renderVideoContent();
      case 'text':
        return renderTextContent();
      case 'interactive':
        return renderInteractiveContent();
      case 'quiz':
        return renderQuizContent();
      default:
        return renderTextContent();
    }
  };

  const renderResults = () => {
    const score = calculateScore();
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className={`inline-flex p-4 rounded-full mb-4 ${
              score >= 80 ? 'bg-green-100 text-green-600' :
              score >= 60 ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <Icon 
                name={score >= 80 ? 'Trophy' : score >= 60 ? 'Star' : 'AlertCircle'} 
                size={32} 
              />
            </div>
            <CardTitle className="text-2xl">Урок завершен!</CardTitle>
            <p className="text-gray-600">
              {score >= 80 ? 'Отличная работа!' :
               score >= 60 ? 'Хорошо, но можно лучше' :
               'Стоит повторить материал'}
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-gray-600 mb-6">Ваш результат</p>
            
            <div className="flex justify-center space-x-4">
              <Button onClick={onComplete}>
                Перейти к следующему уроку
              </Button>
              <Button variant="outline" onClick={() => {
                setCurrentSlide(0);
                setAnswers({});
                setShowResults(false);
              }}>
                Пройти заново
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {renderResults()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <div>
                <h1 className="font-semibold">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.subject}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentSlide + 1} / {lesson.content.length}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <Badge variant="outline" className="mb-2">
            {currentContent.type === 'video' ? 'Видео' :
             currentContent.type === 'text' ? 'Теория' :
             currentContent.type === 'interactive' ? 'Интерактив' :
             'Тест'}
          </Badge>
        </div>
        
        {renderContent()}
        
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentSlide === 0}
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            Назад
          </Button>
          
          <Button onClick={handleNext}>
            {currentSlide < lesson.content.length - 1 ? (
              <>
                Далее
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </>
            ) : (
              'Завершить урок'
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default LessonPlayer;