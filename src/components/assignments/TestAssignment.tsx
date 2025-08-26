import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

export interface TestAssignment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  attempts: number;
  deadline: string;
  status: 'draft' | 'published' | 'closed';
  createdBy: string;
}

interface TestAssignmentCreatorProps {
  onSave: (assignment: TestAssignment) => void;
  onCancel: () => void;
}

export const TestAssignmentCreator = ({ onSave, onCancel }: TestAssignmentCreatorProps) => {
  const [assignment, setAssignment] = useState<Partial<TestAssignment>>({
    title: '',
    description: '',
    questions: [],
    timeLimit: 60,
    attempts: 3,
    deadline: '',
    status: 'draft'
  });

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'single',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const addQuestion = () => {
    if (!currentQuestion.question) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type!,
      question: currentQuestion.question,
      options: currentQuestion.type !== 'text' ? currentQuestion.options?.filter(opt => opt.trim()) : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points || 1
    };

    setAssignment(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));

    setCurrentQuestion({
      type: 'single',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestion = (questionId: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId) || []
    }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), '']
    }));
  };

  const removeOption = (index: number) => {
    if ((currentQuestion.options?.length || 0) <= 2) return; // Минимум 2 варианта
    
    const newOptions = currentQuestion.options?.filter((_, i) => i !== index) || [];
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions,
      // Сброс правильного ответа если он стал недоступен
      correctAnswer: prev.type === 'single' && prev.correctAnswer === currentQuestion.options?.[index] 
        ? newOptions[0] || '' 
        : prev.type === 'multiple' && Array.isArray(prev.correctAnswer)
        ? prev.correctAnswer.filter(ans => ans !== currentQuestion.options?.[index])
        : prev.correctAnswer
    }));
  };

  const handleSave = () => {
    if (!assignment.title || !assignment.questions?.length) return;

    const newAssignment: TestAssignment = {
      id: Date.now().toString(),
      title: assignment.title,
      description: assignment.description || '',
      questions: assignment.questions,
      timeLimit: assignment.timeLimit,
      attempts: assignment.attempts || 3,
      deadline: assignment.deadline || '',
      status: assignment.status as 'draft' | 'published' | 'closed',
      createdBy: 'admin'
    };

    onSave(newAssignment);
  };

  const totalPoints = assignment.questions?.reduce((sum, q) => sum + q.points, 0) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="FileQuestion" size={24} />
            <span>Создание тестового задания</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название теста</label>
              <Textarea
                value={assignment.title}
                onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Введите название теста"
                rows={2}
                className="min-h-[60px] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дедлайн</label>
              <Input
                type="datetime-local"
                value={assignment.deadline}
                onChange={(e) => setAssignment(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <Textarea
              value={assignment.description}
              onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Описание задания, инструкции для учеников"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Время на тест (мин)</label>
              <Input
                type="number"
                value={assignment.timeLimit}
                onChange={(e) => setAssignment(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Количество попыток</label>
              <Input
                type="number"
                value={assignment.attempts}
                onChange={(e) => setAssignment(prev => ({ ...prev, attempts: Number(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Badge variant="secondary">
                Всего баллов: {totalPoints}
              </Badge>
              <Badge variant="outline">
                Вопросов: {assignment.questions?.length || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Создание вопроса */}
      <Card>
        <CardHeader>
          <CardTitle>Добавить вопрос</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Тип вопроса</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'single' | 'multiple' | 'text',
                  correctAnswer: e.target.value === 'multiple' ? [] : ''
                }))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="single">Один правильный ответ</option>
                <option value="multiple">Несколько правильных ответов</option>
                <option value="text">Развернутый ответ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Баллов за вопрос</label>
              <Input
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: Number(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Вопрос</label>
            <Textarea
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Введите текст вопроса"
              rows={2}
            />
          </div>

          {currentQuestion.type !== 'text' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Варианты ответов</label>
                <div className="flex space-x-2">
                  <Button
                    onClick={addOption}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    <Icon name="Plus" size={12} className="mr-1" />
                    Добавить вариант
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                    {currentQuestion.type === 'single' ? (
                      <input
                        type="radio"
                        name="correct-answer"
                        checked={currentQuestion.correctAnswer === option}
                        onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: option }))}
                        className="w-4 h-4 text-blue-600"
                      />
                    ) : (
                      <Checkbox
                        checked={Array.isArray(currentQuestion.correctAnswer) && currentQuestion.correctAnswer.includes(option)}
                        onCheckedChange={(checked) => {
                          const current = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : [];
                          const updated = checked 
                            ? [...current, option]
                            : current.filter(ans => ans !== option);
                          setCurrentQuestion(prev => ({ ...prev, correctAnswer: updated }));
                        }}
                      />
                    )}
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(currentQuestion.options || [])];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Вариант ${index + 1}`}
                      className="flex-1"
                    />
                    {(currentQuestion.options?.length || 0) > 2 && (
                      <Button
                        onClick={() => removeOption(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        type="button"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                    <span className="text-xs text-gray-500 min-w-fit">
                      {currentQuestion.type === 'single' ? 'правильный' : 'отметьте если правильный'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-500 flex items-center">
                <Icon name="Info" size={12} className="mr-1" />
                {currentQuestion.type === 'single' 
                  ? 'Выберите один правильный ответ' 
                  : 'Отметьте все правильные варианты'
                }
              </div>
            </div>
          )}

          <Button onClick={addQuestion} disabled={!currentQuestion.question}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить вопрос
          </Button>
        </CardContent>
      </Card>

      {/* Список вопросов */}
      {assignment.questions && assignment.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Вопросы в тесте ({assignment.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignment.questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <Badge variant={question.type === 'single' ? 'default' : question.type === 'multiple' ? 'secondary' : 'destructive'}>
                          {question.type === 'single' ? 'Один ответ' : 
                           question.type === 'multiple' ? 'Много ответов' : 'Текстовый'}
                        </Badge>
                        <Badge variant="outline">{question.points} баллов</Badge>
                      </div>
                      <p className="font-medium">{question.question}</p>
                      {question.options && (
                        <div className="mt-2 text-sm text-gray-600">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-1">
                              <span>{optIndex + 1}.</span>
                              <span className={
                                (Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option)
                                  ? 'font-medium text-green-600' : ''
                              }>
                                {option}
                              </span>
                              {(Array.isArray(question.correctAnswer) ? question.correctAnswer.includes(option) : question.correctAnswer === option) && (
                                <Icon name="Check" size={14} className="text-green-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeQuestion(question.id)}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Действия */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <div className="space-x-2">
          <Button 
            variant="secondary"
            onClick={() => {
              setAssignment(prev => ({ ...prev, status: 'draft' }));
              handleSave();
            }}
            disabled={!assignment.title || !assignment.questions?.length}
          >
            Сохранить как черновик
          </Button>
          <Button 
            onClick={() => {
              setAssignment(prev => ({ ...prev, status: 'published' }));
              handleSave();
            }}
            disabled={!assignment.title || !assignment.questions?.length}
          >
            <Icon name="Send" size={16} className="mr-2" />
            Опубликовать
          </Button>
        </div>
      </div>
    </div>
  );
};