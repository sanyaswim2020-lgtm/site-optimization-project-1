import React from 'react';

interface RutubePlayerProps {
  url: string;
  title?: string;
  className?: string;
}

const RutubePlayer: React.FC<RutubePlayerProps> = ({ url, title, className = '' }) => {
  // Функция для извлечения ID видео из различных форматов URL Rutube
  const getRutubeEmbedUrl = (videoUrl: string): string => {
    try {
      // Различные форматы URL Rutube:
      // https://rutube.ru/video/VIDEO_ID/
      // https://rutube.ru/video/VIDEO_ID/?param=value
      // https://rutube.ru/play/embed/VIDEO_ID
      
      let videoId = '';
      
      // Если это уже embed URL, возвращаем как есть
      if (videoUrl.includes('/play/embed/')) {
        return videoUrl;
      }
      
      // Извлекаем ID из обычной ссылки
      const match = videoUrl.match(/\/video\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        videoId = match[1];
        return `https://rutube.ru/play/embed/${videoId}`;
      }
      
      // Если не удалось распарсить, возвращаем исходный URL
      return videoUrl;
    } catch (error) {
      console.error('Error parsing Rutube URL:', error);
      return videoUrl;
    }
  };

  const embedUrl = getRutubeEmbedUrl(url);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-gray-100">
        <iframe
          src={embedUrl}
          title={title || 'Rutube Video'}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default RutubePlayer;