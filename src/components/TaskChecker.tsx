import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TaskCheckerProps {
  taskId: string;
  taskTitle: string;
  taskContent: string;
  onComplete: (score: number, feedback: string) => void;
  onBack: () => void;
}

type Tool = 'pen' | 'pencil' | 'highlighter' | 'comment' | 'eraser';

interface Annotation {
  id: string;
  type: Tool;
  x: number;
  y: number;
  text?: string;
  color: string;
  strokeWidth: number;
  path?: string;
}

const TaskChecker: React.FC<TaskCheckerProps> = ({ taskId, taskTitle, taskContent, onComplete, onBack }) => {
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [commentText, setCommentText] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [score, setScore] = useState(85);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: 'pen' as Tool, name: 'Ручка', icon: 'Pen', color: '#DC2626' },
    { id: 'pencil' as Tool, name: 'Карандаш', icon: 'PenTool', color: '#6B7280' },
    { id: 'highlighter' as Tool, name: 'Выделитель', icon: 'Highlighter', color: '#FBBF24' },
    { id: 'comment' as Tool, name: 'Комментарий', icon: 'MessageCircle', color: '#3B82F6' },
    { id: 'eraser' as Tool, name: 'Ластик', icon: 'Eraser', color: '#EF4444' }
  ];

  const getCurrentColor = () => {
    const tool = tools.find(t => t.id === selectedTool);
    return tool?.color || '#DC2626';
  };

  const getStrokeWidth = () => {
    switch (selectedTool) {
      case 'pen': return 2;
      case 'pencil': return 1;
      case 'highlighter': return 8;
      default: return 2;
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (selectedTool === 'comment') {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setCommentPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setShowCommentInput(true);
      }
      return;
    }

    setIsDrawing(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath(`M ${x} ${y}`);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || selectedTool === 'comment') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath(prev => `${prev} L ${x} ${y}`);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (currentPath) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: selectedTool,
        x: 0,
        y: 0,
        color: getCurrentColor(),
        strokeWidth: getStrokeWidth(),
        path: currentPath
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setCurrentPath('');
    }
  };

  const addComment = () => {
    if (!commentText.trim()) return;

    const newComment: Annotation = {
      id: Date.now().toString(),
      type: 'comment',
      x: commentPosition.x,
      y: commentPosition.y,
      text: commentText,
      color: '#3B82F6',
      strokeWidth: 0
    };

    setAnnotations(prev => [...prev, newComment]);
    setCommentText('');
    setShowCommentInput(false);
  };

  const clearAnnotations = () => {
    setAnnotations([]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const handleComplete = () => {
    const feedback = `Проверено с использованием ${annotations.length} аннотаций. ` +
                    `Использованные инструменты: ${[...new Set(annotations.map(a => a.type))].join(', ')}.`;
    onComplete(score, feedback);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <div>
                <h1 className="font-semibold text-lg">Проверка задания</h1>
                <p className="text-sm text-gray-600">{taskTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Оценка:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
              <Button onClick={handleComplete}>
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Завершить проверку
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Tools Sidebar */}
          <aside className="w-64 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Инструменты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedTool === tool.id
                          ? 'bg-blue-100 text-blue-700 border-blue-200 border'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Icon name={tool.icon} size={20} style={{ color: tool.color }} />
                      <span className="font-medium">{tool.name}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-2"
                    onClick={clearAnnotations}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Очистить всё
                  </Button>
                  
                  <div className="text-xs text-gray-600">
                    Аннотаций: {annotations.length}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annotations List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Аннотации</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {annotations.map((annotation, index) => (
                    <div key={annotation.id} className="flex items-center justify-between p-2 border rounded text-xs">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: annotation.color }}
                        />
                        <span>
                          {annotation.type === 'comment' ? annotation.text?.slice(0, 20) + '...' : 
                           `${annotation.type} ${index + 1}`}
                        </span>
                      </div>
                      <button
                        onClick={() => removeAnnotation(annotation.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Задание для проверки</CardTitle>
                  <Badge variant="outline">
                    Активный инструмент: {tools.find(t => t.id === selectedTool)?.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={containerRef}
                  className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg min-h-[600px] p-6 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                >
                  {/* Task Content */}
                  <div className="relative z-10 pointer-events-none">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800">
                        {taskContent}
                      </div>
                    </div>
                  </div>

                  {/* SVG Overlay for Drawings */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 20 }}
                  >
                    {/* Existing annotations */}
                    {annotations.filter(a => a.path).map((annotation) => (
                      <path
                        key={annotation.id}
                        d={annotation.path}
                        stroke={annotation.color}
                        strokeWidth={annotation.strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={annotation.type === 'highlighter' ? 0.5 : 1}
                      />
                    ))}
                    
                    {/* Current drawing */}
                    {currentPath && (
                      <path
                        d={currentPath}
                        stroke={getCurrentColor()}
                        strokeWidth={getStrokeWidth()}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={selectedTool === 'highlighter' ? 0.5 : 1}
                      />
                    )}
                  </svg>

                  {/* Comments */}
                  {annotations.filter(a => a.type === 'comment').map((comment) => (
                    <div
                      key={comment.id}
                      className="absolute bg-blue-100 border border-blue-300 rounded-lg p-2 shadow-lg max-w-48 z-30"
                      style={{ left: comment.x, top: comment.y }}
                    >
                      <div className="text-xs text-blue-800">{comment.text}</div>
                      <button
                        onClick={() => removeAnnotation(comment.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Comment Input Modal */}
                {showCommentInput && (
                  <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 shadow-xl max-w-sm w-full mx-4">
                      <h3 className="font-semibold mb-3">Добавить комментарий</h3>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Введите комментарий..."
                        className="w-full p-2 border rounded-lg resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" onClick={addComment} disabled={!commentText.trim()}>
                          Добавить
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowCommentInput(false)}>
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TaskChecker;