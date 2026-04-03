"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Book, Star } from 'lucide-react';

const Sistemas = () => {
  const sistemas = [
    {
      id: 1,
      nome: 'Dungeons & Dragons 5e',
      descricao: 'O sistema de RPG de fantasia mais popular do mundo',
      jogadores: '4-6',
      complexidade: 'Média',
      popularidade: 5
    },
    {
      id: 2,
      nome: 'Pathfinder 2e',
      descricao: 'Sistema de fantasia com foco em customização',
      jogadores: '4-6',
      complexidade: 'Alta',
      popularidade: 4
    },
    {
      id: 3,
      nome: 'Cyberpunk RED',
      descricao: 'RPG de ficção científica cyberpunk',
      jogadores: '3-5',
      complexidade: 'Média',
      popularidade: 4
    },
    {
      id: 4,
      nome: 'Call of Cthulhu',
      descricao: 'RPG de horror cósmico e investigação',
      jogadores: '3-6',
      complexidade: 'Baixa',
      popularidade: 4
    },
    {
      id: 5,
      nome: 'Tormenta20',
      descricao: 'Sistema brasileiro de fantasia heroica',
      jogadores: '4-6',
      complexidade: 'Média',
      popularidade: 5
    },
    {
      id: 6,
      nome: 'Vampire: The Masquerade',
      descricao: 'RPG de horror pessoal e vampiros',
      jogadores: '3-5',
      complexidade: 'Média',
      popularidade: 4
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sistemas de RPG</h1>
        <p className="text-gray-400">Explore diferentes sistemas de RPG para suas campanhas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sistemas.map((sistema) => (
          <Card key={sistema.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{sistema.nome}</CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    {sistema.descricao}
                  </CardDescription>
                </div>
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Book className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Jogadores</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{sistema.jogadores}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Complexidade</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sistema.complexidade === 'Baixa' ? 'bg-green-900/30 text-green-400' :
                    sistema.complexidade === 'Média' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {sistema.complexidade}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Popularidade</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < sistema.popularidade ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-gray-600 hover:bg-gray-700"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sistemas;