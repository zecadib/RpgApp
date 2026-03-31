"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, Gamepad2, Lock, ArrowRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { username } = useUser();

  useEffect(() => {
    // Se já tem username, redireciona para dashboard
    if (username) {
      navigate('/dashboard');
    }
  }, [username, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToPerfil = () => {
    navigate('/perfil');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Bem-vindo ao Nighshift! 🎲
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Configure seu perfil para começar a gerenciar suas mesas de RPG
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Instruções de Configuração */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle>👤 Configuração Inicial</CardTitle>
              <CardDescription className="text-gray-400">
                Para começar, você precisa configurar seu nome de usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4">
                    <User className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Configure seu Perfil</h3>
                  <p className="text-gray-300 mb-6">
                    Clique no botão abaixo para configurar seu nome de usuário e outras informações no seu perfil.
                  </p>
                  
                  <Button 
                    onClick={handleGoToPerfil}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Configurar Perfil
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu de funcionalidades */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">O que você pode fazer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => navigate('/perfil')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <Users className="h-6 w-6" />
                    </div>
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Mesas</h3>
                  <p className="text-sm text-gray-400">Gerencie suas mesas de RPG</p>
                  
                  <div className="mt-4">
                    <span className="text-xs px-2 py-1 bg-yellow-700 rounded-full text-yellow-300">
                      Configure seu perfil primeiro
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => navigate('/perfil')}
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
                    <span className="text-xs px-2 py-1 bg-yellow-700 rounded-full text-yellow-300">
                      Configure seu perfil primeiro
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => navigate('/perfil')}
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
                    <span className="text-xs px-2 py-1 bg-yellow-700 rounded-full text-yellow-300">
                      Configure seu perfil primeiro
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
                  <span>Clique em "Configurar Perfil" para definir seu nome de usuário</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm">2</span>
                  <span>Na página de Perfil, defina seu nome de usuário e salve</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">3</span>
                  <span>Volte ao Dashboard para acessar todas as funcionalidades</span>
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