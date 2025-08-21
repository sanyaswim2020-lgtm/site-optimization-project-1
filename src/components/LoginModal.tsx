import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  subjectTitle: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, subjectTitle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Имитация проверки авторизации
    setTimeout(() => {
      // Демо-логины для разных предметов
      const validCredentials = {
        'chemistry-sanya': { username: 'student', password: 'chem2024' },
        'biology': { username: 'student', password: 'bio2024' },
        'chemistry-oge': { username: 'student', password: 'oge2024' }
      };

      const currentSubject = window.location.pathname.split('/')[2];
      const validCreds = validCredentials[currentSubject as keyof typeof validCredentials];

      if (validCreds && username === validCreds.username && password === validCreds.password) {
        onLogin(username, password);
        setUsername('');
        setPassword('');
        setError('');
      } else {
        setError('Неверный логин или пароль');
      }
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
            <CardTitle className="text-xl">Вход в систему</CardTitle>
            <p className="text-gray-600">
              Для доступа к курсу "{subjectTitle}" необходимо авторизоваться
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите логин"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="mt-1"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={16} className="text-red-600 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Icon name="Info" size={16} className="text-blue-600 mr-2 mt-0.5" />
                  <div className="text-blue-700 text-sm">
                    <p className="font-medium">Демо-доступы:</p>
                    <p>Логин: <code>student</code></p>
                    <p>Пароль: <code>chem2024</code></p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    <>
                      <Icon name="LogIn" size={16} className="mr-2" />
                      Войти
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginModal;