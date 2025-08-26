import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface OpenAssignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  deadline: string;
  maxScore: number;
  allowFileUpload: boolean;
  allowDrawing: boolean;
  status: 'draft' | 'published' | 'closed';
  createdBy: string;
}

interface OpenAssignmentCreatorProps {
  onSave: (assignment: OpenAssignment) => void;
  onCancel: () => void;
}

interface DrawingCanvasProps {
  onDrawingChange?: (imageData: string) => void;
}

const DrawingCanvas = ({ onDrawingChange }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Настройка canvas
    canvas.width = 800;
    canvas.height = 600;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    
    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#000000';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();

    // Сохранить изображение
    if (onDrawingChange) {
      const imageData = canvas.toDataURL();
      onDrawingChange(imageData);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (onDrawingChange) {
      onDrawingChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={currentTool === 'pen' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('pen')}
            >
              <Icon name="Pen" size={16} />
            </Button>
            <Button
              size="sm"
              variant={currentTool === 'eraser' ? 'default' : 'outline'}
              onClick={() => setCurrentTool('eraser')}
            >
              <Icon name="Eraser" size={16} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm">Размер:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-500">{brushSize}px</span>
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={clearCanvas}>
          <Icon name="RotateCcw" size={16} className="mr-1" />
          Очистить
        </Button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full bg-white border rounded cursor-crosshair"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

interface FileUploadProps {
  onFileChange?: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
}

const FileUpload = ({ onFileChange, acceptedTypes = "*", maxFiles = 5 }: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > maxFiles) {
      alert(`Можно загрузить максимум ${maxFiles} файлов`);
      return;
    }

    setSelectedFiles(files);
    if (onFileChange) {
      onFileChange(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (onFileChange) {
      onFileChange(newFiles);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Байт';
    const k = 1024;
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Icon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Загрузите файлы</p>
          <p className="text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Выбрать файлы
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Выбранные файлы:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="File" size={20} className="text-gray-500" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const OpenAssignmentCreator = ({ onSave, onCancel }: OpenAssignmentCreatorProps) => {
  const [assignment, setAssignment] = useState<Partial<OpenAssignment>>({
    title: '',
    description: '',
    instructions: '',
    deadline: '',
    maxScore: 100,
    allowFileUpload: true,
    allowDrawing: false,
    status: 'draft'
  });

  const handleSave = () => {
    if (!assignment.title || !assignment.description) return;

    const newAssignment: OpenAssignment = {
      id: Date.now().toString(),
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.instructions || '',
      deadline: assignment.deadline || '',
      maxScore: assignment.maxScore || 100,
      allowFileUpload: assignment.allowFileUpload || false,
      allowDrawing: assignment.allowDrawing || false,
      status: assignment.status as 'draft' | 'published' | 'closed',
      createdBy: 'admin'
    };

    onSave(newAssignment);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon name="FileEdit" size={24} />
            <span>Создание развернутого задания</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название задания</label>
              <Input
                value={assignment.title}
                onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Введите название задания"
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
            <label className="block text-sm font-medium mb-2">Описание задания</label>
            <Textarea
              value={assignment.description}
              onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Краткое описание того, что должны сделать ученики"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Подробные инструкции</label>
            <Textarea
              value={assignment.instructions}
              onChange={(e) => setAssignment(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Детальные инструкции по выполнению задания, критерии оценки"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Максимальная оценка</label>
              <Input
                type="number"
                value={assignment.maxScore}
                onChange={(e) => setAssignment(prev => ({ ...prev, maxScore: Number(e.target.value) }))}
                min="1"
                max="100"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="allowFileUpload"
                checked={assignment.allowFileUpload}
                onChange={(e) => setAssignment(prev => ({ ...prev, allowFileUpload: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="allowFileUpload" className="text-sm font-medium">
                Разрешить загрузку файлов
              </label>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="allowDrawing"
                checked={assignment.allowDrawing}
                onChange={(e) => setAssignment(prev => ({ ...prev, allowDrawing: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="allowDrawing" className="text-sm font-medium">
                Разрешить рисование
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Предварительный просмотр интерфейса для учеников */}
      <Card>
        <CardHeader>
          <CardTitle>Предварительный просмотр для учеников</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{assignment.title || 'Название задания'}</h3>
            <p className="text-gray-700 mb-4">{assignment.description || 'Описание задания появится здесь'}</p>
            
            {assignment.instructions && (
              <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                <h4 className="font-medium text-blue-900 mb-1">Инструкции:</h4>
                <p className="text-blue-800 text-sm">{assignment.instructions}</p>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="outline">
                Максимум баллов: {assignment.maxScore}
              </Badge>
              {assignment.deadline && (
                <Badge variant="destructive">
                  До: {new Date(assignment.deadline).toLocaleDateString()}
                </Badge>
              )}
            </div>

            {assignment.allowFileUpload && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Загрузка файлов:</h4>
                <div className="text-sm text-gray-600 p-3 border border-dashed rounded">
                  Ученики смогут загрузить сюда свои файлы
                </div>
              </div>
            )}

            {assignment.allowDrawing && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Область для рисования:</h4>
                <div className="text-sm text-gray-600 p-3 border border-dashed rounded h-32 flex items-center justify-center">
                  Здесь будет холст для рисования
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 p-3 border border-dashed rounded">
              Область для текстового ответа (всегда доступна)
            </div>
          </div>
        </CardContent>
      </Card>

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
            disabled={!assignment.title || !assignment.description}
          >
            Сохранить как черновик
          </Button>
          <Button 
            onClick={() => {
              setAssignment(prev => ({ ...prev, status: 'published' }));
              handleSave();
            }}
            disabled={!assignment.title || !assignment.description}
          >
            <Icon name="Send" size={16} className="mr-2" />
            Опубликовать
          </Button>
        </div>
      </div>
    </div>
  );
};

export { DrawingCanvas, FileUpload };