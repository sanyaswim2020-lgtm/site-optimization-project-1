import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TheoryMaterial {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'formula' | 'definition' | 'example' | 'note';
  order: number;
}

interface TheoryMaterialsManagerProps {
  materials: TheoryMaterial[];
  onMaterialsUpdate: (materials: TheoryMaterial[]) => void;
}

const TheoryMaterialsManager: React.FC<TheoryMaterialsManagerProps> = ({ 
  materials, 
  onMaterialsUpdate 
}) => {
  const [editingMaterial, setEditingMaterial] = useState<TheoryMaterial | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Omit<TheoryMaterial, 'id' | 'order'>>({
    title: '',
    content: '',
    type: 'text'
  });

  const materialTypes = [
    { value: 'text', label: 'Текст', icon: 'FileText', color: 'bg-blue-100 text-blue-700' },
    { value: 'formula', label: 'Формула', icon: 'Calculator', color: 'bg-purple-100 text-purple-700' },
    { value: 'definition', label: 'Определение', icon: 'BookOpen', color: 'bg-green-100 text-green-700' },
    { value: 'example', label: 'Пример', icon: 'Lightbulb', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'note', label: 'Заметка', icon: 'StickyNote', color: 'bg-orange-100 text-orange-700' }
  ];

  const getTypeInfo = (type: string) => {
    return materialTypes.find(t => t.value === type) || materialTypes[0];
  };

  const addMaterial = () => {
    if (!newMaterial.title || !newMaterial.content) return;

    const material: TheoryMaterial = {
      ...newMaterial,
      id: `material_${Date.now()}`,
      order: materials.length
    };

    onMaterialsUpdate([...materials, material]);
    setNewMaterial({ title: '', content: '', type: 'text' });
    setIsAdding(false);
  };

  const updateMaterial = (updatedMaterial: TheoryMaterial) => {
    const updatedMaterials = materials.map(m => 
      m.id === updatedMaterial.id ? updatedMaterial : m
    );
    onMaterialsUpdate(updatedMaterials);
    setEditingMaterial(null);
  };

  const deleteMaterial = (id: string) => {
    const filteredMaterials = materials.filter(m => m.id !== id);
    // Пересчитываем порядок
    const reorderedMaterials = filteredMaterials.map((m, index) => ({
      ...m,
      order: index
    }));
    onMaterialsUpdate(reorderedMaterials);
  };

  const moveMaterial = (id: string, direction: 'up' | 'down') => {
    const currentIndex = materials.findIndex(m => m.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= materials.length) return;

    const newMaterials = [...materials];
    [newMaterials[currentIndex], newMaterials[newIndex]] = 
    [newMaterials[newIndex], newMaterials[currentIndex]];

    // Обновляем порядок
    const reorderedMaterials = newMaterials.map((m, index) => ({
      ...m,
      order: index
    }));

    onMaterialsUpdate(reorderedMaterials);
  };

  const renderMaterialForm = (
    material: Partial<TheoryMaterial>,
    onSave: () => void,
    onCancel: () => void,
    isEditing = false
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Редактировать материал' : 'Добавить теоретический материал'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Тип материала</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {materialTypes.map((type) => (
              <Button
                key={type.value}
                variant={material.type === type.value ? 'default' : 'outline'}
                onClick={() => {
                  if (isEditing && editingMaterial) {
                    setEditingMaterial({
                      ...editingMaterial,
                      type: type.value as TheoryMaterial['type']
                    });
                  } else {
                    setNewMaterial({ ...newMaterial, type: type.value as TheoryMaterial['type'] });
                  }
                }}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Icon name={type.icon as any} size={16} className="mb-1" />
                <span className="text-xs">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Заголовок *</Label>
          <Input
            value={material.title || ''}
            onChange={(e) => {
              if (isEditing && editingMaterial) {
                setEditingMaterial({ ...editingMaterial, title: e.target.value });
              } else {
                setNewMaterial({ ...newMaterial, title: e.target.value });
              }
            }}
            placeholder="Введите заголовок"
          />
        </div>

        <div className="space-y-2">
          <Label>Содержание *</Label>
          <Textarea
            value={material.content || ''}
            onChange={(e) => {
              if (isEditing && editingMaterial) {
                setEditingMaterial({ ...editingMaterial, content: e.target.value });
              } else {
                setNewMaterial({ ...newMaterial, content: e.target.value });
              }
            }}
            placeholder="Введите содержание материала"
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Поддерживается Markdown разметка для форматирования текста
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button 
            onClick={onSave}
            disabled={!material.title || !material.content}
          >
            <Icon name="Save" size={16} className="mr-2" />
            {isEditing ? 'Обновить' : 'Добавить'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMaterialCard = (material: TheoryMaterial, index: number) => {
    const typeInfo = getTypeInfo(material.type);
    
    return (
      <Card key={material.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={typeInfo.color}>
                <Icon name={typeInfo.icon as any} size={14} className="mr-1" />
                {typeInfo.label}
              </Badge>
              <h3 className="font-medium">{material.title}</h3>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveMaterial(material.id, 'up')}
                disabled={index === 0}
              >
                <Icon name="ChevronUp" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => moveMaterial(material.id, 'down')}
                disabled={index === materials.length - 1}
              >
                <Icon name="ChevronDown" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingMaterial(material)}
              >
                <Icon name="Edit" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMaterial(material.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {material.content}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (editingMaterial) {
    return renderMaterialForm(
      editingMaterial,
      () => updateMaterial(editingMaterial),
      () => setEditingMaterial(null),
      true
    );
  }

  if (isAdding) {
    return renderMaterialForm(
      newMaterial,
      addMaterial,
      () => {
        setIsAdding(false);
        setNewMaterial({ title: '', content: '', type: 'text' });
      }
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Icon name="BookOpen" size={20} className="mr-2 text-blue-500" />
              Теоретические материалы
            </CardTitle>
            <Button onClick={() => setIsAdding(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить материал
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icon name="BookOpen" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Пока нет теоретических материалов</p>
              <p className="text-sm">Добавьте первый материал для урока</p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials
                .sort((a, b) => a.order - b.order)
                .map((material, index) => renderMaterialCard(material, index))
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TheoryMaterialsManager;