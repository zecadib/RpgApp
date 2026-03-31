"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, User, Gamepad2, Lock, ArrowRight } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useUser } from '@/contexts/UserContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useUser();
  const [newUsername, setNewUsername] = useState(username || '');
  const [loading, setLoading] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(!!username);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      showError('Digite um nome de usuário');
      return;
    }

    if (newUsername.length < 3) {
      showError('O nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    setLoading(true);
    try {
      setUsername(newUsername);
      setUsernameSaved(true);
      showSuccess(`Nome de usuário salvo: ${newUsername}!`);
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar nome de usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Bem-vindo ao Nighshift! 🎲
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Primeiro, vamos configurar seu perfil para começar a gerenciar suas mesas de RPG
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Configuração do Username */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle>👤 Configurar Nome de Usuário</CardTitle>
              <CardDescription className="text-gray-400">
                Escolha um nome que será exibido para outros jogadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Ex: MestreGandalf"
                    className="bg-gray-700 border-gray-600"
                    disabled={usernameSaved}
                  />
                  <p className="text-sm text-gray-400">
                    Mínimo de 3 caracteres. Pode conter letras, números e underscores.
                  </p>
                </div>

                {!usernameSaved ? (
                  <Button 
                    onClick={handleSaveUsername}
                    disabled={loading || !newUsername.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? 'Salvando...' : 'Salvar Nome de Usuário'}
                  </Button>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">🎉 Tudo pronto!</h3>
                      <p className="text-gray-300">
                        Seu nome de usuário foi configurado. Agora você pode acessar todas as funcionalidades do Nighshift.
                      </p>
                    </div>
                    <Button 
                      onClick={handleGoToDashboard}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 whitespace-nowrap"
                    >
                      Ir para o Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Menu de funcionalidades */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">O que você pode fazer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                  !usernameSaved ? 'opacity-60' : ''
                }`}
                onClick={() => {
                  if (!usernameSaved) {
                    showError('Primeiro salve seu nome de usuário!');
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      usernameSaved
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                        : 'bg-gray-700'
                    }`}>
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Mesas</h3>
                  <p className="text-sm text-gray-400">Gerencie suas mesas de RPG</p>
                  
                  {!usernameSaved && (
                    <div className="mt-4">
                      <span className="text-xs px-2 py-1 bg-yellow-700 rounded-full text-yellow-300">
                        Salve seu nome primeiro
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => showError('Funcionalidade em breve!')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <User className="h-6 w-6" />
                    </div>
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Personagens</h3>
                  <p className="text-sm text-gray-400">Crie e gerencie seus personagens</p>
                  
                  <div className="mt-4">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      Em breve
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => showError('Funcionalidade em breve!')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <Gamepad2 className="h-6 w-6" />
                    </div>
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Sistemas</h3>
                  <p className="text-sm text-gray-400">Explore sistemas de RPG</p>
                  
                  <div className="mt-4">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      Em breve
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instruções */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">📝 Como começar</h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">1</span>
                  <span>Defina seu nome de usuário acima e clique em "Salvar"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm">2</span>
                  <span>Clique em "Ir para o Dashboard" para acessar suas mesas</span>
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