import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import VideoUploader from './VideoUploader';
import TheoryMaterialsManager from './TheoryMaterialsManager';
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
  video?: VideoData;
  theoryMaterials: TheoryMaterial[];
}

interface LessonContentManagerProps {
  lesson: LessonData;
  onLessonUpdate: (lesson: LessonData) => void;
}

const LessonContentManager: React.FC<LessonContentManagerProps> = ({
  lesson,
  onLessonUpdate
}) => {
  const [activeTab, setActiveTab] = useState('video');

  const handleVideoUpdate = (video: VideoData) => {
    onLessonUpdate({
      ...lesson,
      video
    });
  };

  const handleVideoRemove = () => {
    const updatedLesson = { ...lesson };
    delete updatedLesson.video;
    onLessonUpdate(updatedLesson);
  };

  const handleTheoryMaterialsUpdate = (theoryMaterials: TheoryMaterial[]) => {
    onLessonUpdate({
      ...lesson,
      theoryMaterials
    });
  };

  const renderVideoTab = () => (
    <div className="space-y-6">
      {lesson.video ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Icon name="Video" size={20} className="mr-2 text-red-500" />
                Прикрепленное видео
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVideoRemove}
                className="text-red-600 hover:text-red-700"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Превью видео */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {lesson.video.url.includes('youtube.com') || lesson.video.url.includes('youtu.be') ? (
                  <iframe
                    src={lesson.video.url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={lesson.video.url}
                    controls
                    className="w-full h-full"
                  />
                )}
              </div>
              
              {/* Информация о видео */}
              <div>
                <h3 className="font-semibold text-lg mb-2">{lesson.video.title}</h3>
                {lesson.video.description && (
                  <p className="text-gray-600 mb-2">{lesson.video.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Icon name="Clock" size={16} className="mr-1" />
                    {lesson.video.duration} мин
                  </span>
                </div>
              </div>
              
              {/* Кнопка редактирования */}
              <Button variant="outline" className="w-full">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать видео
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <VideoUploader 
          onVideoAdd={handleVideoUpdate}
        />
      )}
      
      {lesson.video && (
        <VideoUploader 
          onVideoAdd={handleVideoUpdate}
          existingVideo={lesson.video}
        />
      )}
    </div>
  );

  const renderTheoryTab = () => (
    <TheoryMaterialsManager
      materials={lesson.theoryMaterials}
      onMaterialsUpdate={handleTheoryMaterialsUpdate}
    />
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon name="Eye" size={20} className="mr-2 text-blue-500" />
            Предварительный просмотр урока
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Информация об уроке */}
            <div className="pb-4 border-b">
              <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <Badge variant="secondary">{lesson.subject}</Badge>
                {lesson.video && (
                  <span className="flex items-center">
                    <Icon name="Video" size={16} className="mr-1" />
                    Видео: {lesson.video.duration} мин
                  </span>
                )}
                <span className="flex items-center">
                  <Icon name="BookOpen" size={16} className="mr-1" />
                  {lesson.theoryMaterials.length} материалов
                </span>
              </div>
            </div>

            {/* Видео блок */}
            {lesson.video && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Icon name="Play" size={18} className="mr-2" />
                  Видеоурок
                </h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Icon name="Play" size={48} className="mx-auto mb-2" />
                    <p className="font-medium">{lesson.video.title}</p>
                    <p className="text-sm">{lesson.video.duration} минут</p>
                  </div>
                </div>
                {lesson.video.description && (
                  <p className="text-gray-600">{lesson.video.description}</p>
                )}
              </div>
            )}

            {/* Теоретические материалы */}
            {lesson.theoryMaterials.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Icon name="BookOpen" size={18} className="mr-2" />
                  Теоретические материалы
                </h3>
                <div className="space-y-4">
                  {lesson.theoryMaterials
                    .sort((a, b) => a.order - b.order)
                    .map((material) => {
                      const typeColors = {
                        text: 'bg-blue-100 text-blue-700',
                        formula: 'bg-purple-100 text-purple-700',
                        definition: 'bg-green-100 text-green-700',
                        example: 'bg-yellow-100 text-yellow-700',
                        note: 'bg-orange-100 text-orange-700'
                      };
                      
                      const typeLabels = {
                        text: 'Текст',
                        formula: 'Формула',
                        definition: 'Определение',
                        example: 'Пример',
                        note: 'Заметка'
                      };

                      return (
                        <Card key={material.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <Badge className={typeColors[material.type]}>
                                {typeLabels[material.type]}
                              </Badge>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">{material.title}</h4>
                                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                                  {material.content}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Пустое состояние */}
            {!lesson.video && lesson.theoryMaterials.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Урок пока пустой</p>
                <p>Добавьте видео или теоретические материалы</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="video" className="flex items-center">
            <Icon name="Video" size={16} className="mr-2" />
            Видео
            {lesson.video && (
              <Badge variant="secondary" className="ml-2 text-xs">1</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center">
            <Icon name="BookOpen" size={16} className="mr-2" />
            Теория
            {lesson.theoryMaterials.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {lesson.theoryMaterials.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Icon name="Eye" size={16} className="mr-2" />
            Просмотр
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="mt-6">
          {renderVideoTab()}
        </TabsContent>
        
        <TabsContent value="theory" className="mt-6">
          {renderTheoryTab()}
        </TabsContent>
        
        <TabsContent value="preview" className="mt-6">
          {renderPreviewTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonContentManager;