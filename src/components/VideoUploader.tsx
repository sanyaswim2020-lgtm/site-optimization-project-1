import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnail?: string;
}

interface VideoUploaderProps {
  onVideoAdd: (video: VideoData) => void;
  existingVideo?: VideoData;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoAdd, existingVideo }) => {
  const [title, setTitle] = useState(existingVideo?.title || '');
  const [description, setDescription] = useState(existingVideo?.description || '');
  const [videoUrl, setVideoUrl] = useState(existingVideo?.url || '');
  const [duration, setDuration] = useState(existingVideo?.duration || 0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(existingVideo?.url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setPreviewUrl(url);
      
      // Создаем видео элемент для получения длительности
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        setDuration(Math.floor(video.duration / 60));
      };
    }
  };

  const handleYouTubeUrl = (url: string) => {
    setVideoUrl(url);
    setPreviewUrl(url);
    
    // Извлекаем ID из YouTube URL
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (match) {
      const videoId = match[1];
      // В реальном приложении здесь можно использовать YouTube API для получения метаданных
      if (!title) {
        setTitle('YouTube видео');
      }
    }
  };

  const handleSave = () => {
    if (!title || !videoUrl) return;

    const videoData: VideoData = {
      id: existingVideo?.id || `video_${Date.now()}`,
      title,
      description,
      url: videoUrl,
      duration,
      thumbnail: previewUrl
    };

    onVideoAdd(videoData);
    
    if (!existingVideo) {
      // Очистка формы после добавления нового видео
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setDuration(0);
      setPreviewUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="Video" size={20} className="mr-2 text-red-500" />
          {existingVideo ? 'Редактировать видео' : 'Добавить видео к уроку'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Загрузка видео */}
        <div className="space-y-4">
          <Label>Загрузить видео</Label>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Выбрать файл
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          <div className="text-center text-gray-500">или</div>
          
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={isYouTubeUrl(videoUrl) ? videoUrl : ''}
              onChange={(e) => handleYouTubeUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Предварительный просмотр */}
        {previewUrl && (
          <div className="space-y-2">
            <Label>Предварительный просмотр</Label>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {isYouTubeUrl(previewUrl) ? (
                <iframe
                  src={previewUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        )}

        {/* Метаданные */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Название видео *</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название видео"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Описание</Label>
            <Textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание содержания видео"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-duration">Длительность (минуты)</Label>
            <Input
              id="video-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleSave}
            disabled={!title || !videoUrl || isUploading}
          >
            {isUploading ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={16} className="mr-2" />
                {existingVideo ? 'Обновить' : 'Добавить видео'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUploader;