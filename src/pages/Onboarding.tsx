"use client";

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ArrowRight } from 'lucide-react';
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

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>👤 Configuração Inicial</CardTitle>
              <CardDescription className="text-gray-400">
                Para começar, você precisa configurar seu nome de usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default Onboarding;