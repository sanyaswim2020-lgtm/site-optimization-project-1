import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import LessonContentManager from './LessonContentManager';
import Icon from '@/components/ui/icon';

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnail?: string;
}

interface TheoryMaterial {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'formula' | 'definition' | 'example' | 'note';
  order: number;
}

interface LessonData {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number;
  video?: VideoData;
  theoryMaterials: TheoryMaterial[];
}

const ManageView = () => {
  const [lessons, setLessons] = useState<LessonData[]>([
    {
      id: '1',
      title: 'Введение в органическую химию',
      subject: 'Химия',
      description: 'Основы органической химии, структура углеводородов',
      duration: 45,
      theoryMaterials: []
    },
    {
      id: '2', 
      title: 'Алканы и их свойства',
      subject: 'Химия',
      description: 'Изучение алканов, их строение и химические свойства',
      duration: 60,
      theoryMaterials: []
    }
  ]);
  
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDescription, setNewLessonDescription] = useState('');

  const handleLessonUpdate = (updatedLesson: LessonData) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === updatedLesson.id ? updatedLesson : lesson
    ));
    setSelectedLesson(updatedLesson);
  };

  const handleCreateLesson = () => {
    if (!newLessonTitle.trim()) return;

    const newLesson: LessonData = {
      id: `lesson_${Date.now()}`,
      title: newLessonTitle,
      subject: 'Химия',
      description: newLessonDescription,
      duration: 0,
      theoryMaterials: []
    };

    setLessons(prev => [...prev, newLesson]);
    setSelectedLesson(newLesson);
    setNewLessonTitle('');
    setNewLessonDescription('');
    setIsCreatingLesson(false);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    if (selectedLesson?.id === lessonId) {
      setSelectedLesson(null);
    }
  };

  const moveLessonUp = (lessonId: string) => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (currentIndex <= 0) return;

    const newLessons = [...lessons];
    [newLessons[currentIndex], newLessons[currentIndex - 1]] = 
    [newLessons[currentIndex - 1], newLessons[currentIndex]];
    
    setLessons(newLessons);
  };

  const moveLessonDown = (lessonId: string) => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
    if (currentIndex === -1 || currentIndex >= lessons.length - 1) return;

    const newLessons = [...lessons];
    [newLessons[currentIndex], newLessons[currentIndex + 1]] = 
    [newLessons[currentIndex + 1], newLessons[currentIndex]];
    
    setLessons(newLessons);
  };

  const renderLessonsList = () => (
    <div className="space-y-4">
      {/* Заголовок и кнопка создания */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Управление уроками</h3>
        <Button onClick={() => setIsCreatingLesson(true)}>
          <Icon name="Plus" size={16} className="mr-2" />
          Создать урок
        </Button>
      </div>

      {/* Форма создания нового урока */}
      {isCreatingLesson && (
        <Card>
          <CardHeader>
            <CardTitle>Создать новый урок</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Название урока *</Label>
              <Input
                id="lesson-title"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="Введите название урока"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lesson-description">Описание</Label>
              <Input
                id="lesson-description"
                value={newLessonDescription}
                onChange={(e) => setNewLessonDescription(e.target.value)}
                placeholder="Краткое описание урока"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreatingLesson(false);
                  setNewLessonTitle('');
                  setNewLessonDescription('');
                }}
              >
                Отмена
              </Button>
              <Button 
                onClick={handleCreateLesson}
                disabled={!newLessonTitle.trim()}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Создать
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список уроков */}
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            className={`cursor-pointer transition-colors ${
              selectedLesson?.id === lesson.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedLesson(lesson)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{lesson.title}</h4>
                  {lesson.description && (
                    <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <Badge variant="secondary">{lesson.subject}</Badge>
                    {lesson.video && (
                      <span className="flex items-center">
                        <Icon name="Video" size={12} className="mr-1" />
                        Видео
                      </span>
                    )}
                    <span className="flex items-center">
                      <Icon name="BookOpen" size={12} className="mr-1" />
                      {lesson.theoryMaterials.length} материалов
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Move Up/Down */}
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLessonUp(lesson.id);
                      }}
                      disabled={lessons.findIndex(l => l.id === lesson.id) === 0}
                      className="h-5 w-6 p-0 text-gray-400 hover:text-blue-600"
                      title="Переместить вверх"
                    >
                      <Icon name="ChevronUp" size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLessonDown(lesson.id);
                      }}
                      disabled={lessons.findIndex(l => l.id === lesson.id) === lessons.length - 1}
                      className="h-5 w-6 p-0 text-gray-400 hover:text-blue-600"
                      title="Переместить вниз"
                    >
                      <Icon name="ChevronDown" size={12} />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLesson(lesson.id);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {lessons.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Icon name="BookOpen" size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Нет созданных уроков</p>
            <p>Создайте первый урок для начала работы</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLessonEditor = () => {
    if (!selectedLesson) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Icon name="ArrowLeft" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Выберите урок для редактирования</p>
          <p>Кликните на урок в списке слева</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Заголовок урока */}
        <div className="pb-4 border-b">
          <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <Badge variant="secondary">{selectedLesson.subject}</Badge>
            {selectedLesson.video && (
              <span className="flex items-center">
                <Icon name="Video" size={16} className="mr-1" />
                Видео: {selectedLesson.video.duration} мин
              </span>
            )}
            <span className="flex items-center">
              <Icon name="BookOpen" size={16} className="mr-1" />
              {selectedLesson.theoryMaterials.length} теоретических материалов
            </span>
          </div>
        </div>

        {/* Менеджер контента */}
        <LessonContentManager
          lesson={selectedLesson}
          onLessonUpdate={handleLessonUpdate}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Управление курсом</h1>
          <p className="text-gray-600">Создавайте и редактируйте уроки, добавляйте видео и теоретические материалы</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Список уроков */}
          <div className="col-span-4">
            <Card>
              <CardContent className="p-6">
                {renderLessonsList()}
              </CardContent>
            </Card>
          </div>

          {/* Редактор урока */}
          <div className="col-span-8">
            <Card>
              <CardContent className="p-6">
                {renderLessonEditor()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageView;