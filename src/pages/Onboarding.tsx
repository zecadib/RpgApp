"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Users, User, Gamepad2, LogOut } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Onboarding = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
      // Verificar se já tem perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile?.username) {
        // Já tem username, redirecionar para dashboard
        navigate('/dashboard');
      }
    }
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      showError('Digite um nome de usuário');
      return;
    }

    if (username.length < 3) {
      showError('O nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Aqui você pode salvar no banco de dados
      // Por enquanto, vamos apenas salvar no localStorage
      localStorage.setItem('nighshift_username', username);
      showSuccess(`Bem-vindo, ${username}!`);
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar nome de usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showSuccess('Logout realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      showError(error.message || 'Erro ao fazer logout');
    }
  };

  const menuItems = [
    {
      id: 'mesas',
      title: 'Mesas',
      description: 'Gerencie suas mesas de RPG',
      icon: <Users className="h-6 w-6" />,
      enabled: true,
      onClick: () => navigate('/dashboard')
    },
    {
      id: 'personagens',
      title: 'Personagens',
      description: 'Crie e gerencie seus personagens',
      icon: <User className="h-6 w-6" />,
      enabled: false,
      onClick: () => showError('Funcionalidade em breve!')
    },
    {
      id: 'sistemas',
      title: 'Sistemas',
      description: 'Explore sistemas de RPG',
      icon: <Gamepad2 className="h-6 w-6" />,
      enabled: false,
      onClick: () => showError('Funcionalidade em breve!')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Nighshift
            </h1>
            <p className="text-gray-400">Configure sua conta para começar</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-400">Novo usuário</p>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleLogout}
              className="border-gray-700 hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Card de configuração de username */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">👋 Bem-vindo ao Nighshift!</CardTitle>
              <CardDescription className="text-gray-400">
                Primeiro, escolha como você será chamado na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2">
                    Nome de usuário
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ex: MestreDungeon"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Este será o nome que outros jogadores verão
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveUsername}
                  disabled={loading || !username.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Salvando...' : 'Salvar e Continuar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Menu de funcionalidades */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">O que você pode fazer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card 
                  key={item.id}
                  className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                    !item.enabled ? 'opacity-60' : ''
                  }`}
                  onClick={item.onClick}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        item.enabled 
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                          : 'bg-gray-700'
                      }`}>
                        {item.icon}
                      </div>
                      {!item.enabled && (
                        <Lock className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                    
                    {!item.enabled && (
                      <div className="mt-4">
                        <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                          Em breve
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Instruções */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">📝 Como começar</h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">1</span>
                  <span>Defina seu nome de usuário acima</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm">2</span>
                  <span>Acesse "Mesas" para criar ou entrar em uma mesa de RPG</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">3</span>
                  <span>Em breve: Crie personagens e explore sistemas de RPG</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;