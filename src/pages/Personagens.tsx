"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User, Shield, Sword, Heart } from 'lucide-react';
import LayoutPadrao from '@/components/LayoutPadrao';

const Personagens = () => {
  const personagens = [
    {
      id: 1,
      nome: 'Aragorn',
      classe: 'Guerreiro',
      nivel: 5,
      raca: 'Humano',
      vida: 45,
      forca: 18,
      destreza: 14,
      constituicao: 16
    },
    {
      id: 2,
      nome: 'Gandalf',
      classe: 'Mago',
      nivel: 8,
      raca: 'Humano',
      vida: 32,
      forca: 10,
      destreza: 12,
      constituicao: 14
    },
    {
      id: 3,
      nome: 'Legolas',
      classe: 'Arqueiro',
      nivel: 6,
      raca: 'Elfo',
      vida: 38,
      forca: 14,
      destreza: 20,
      constituicao: 12
    }
  ];

  return (
    <LayoutPadrao>
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Personagens</h1>
            <p className="text-gray-400">Gerencie seus personagens de RPG</p>
          </div>
          
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Personagem
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personagens.map((personagem) => (
            <Card key={personagem.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{personagem.nome}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {personagem.raca} • Nível {personagem.nivel}
                    </CardDescription>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Classe</span>
                    <span className="font-medium">{personagem.classe}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-gray-400">Vida</span>
                      </div>
                      <div className="text-xl font-bold">{personagem.vida}</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Sword className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Força</span>
                      </div>
                      <div className="text-xl font-bold">{personagem.forca}</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-400">Destreza</span>
                      </div>
                      <div className="text-xl font-bold">{personagem.destreza}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {personagens.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhum personagem encontrado</h3>
            <p className="text-gray-400 mb-6">Crie seu primeiro personagem para começar a jogar!</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Personagem
            </Button>
          </div>
        )}
      </div>
    </LayoutPadrao>
  );
};

export default Personagens;