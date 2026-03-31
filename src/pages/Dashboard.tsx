"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Users, Calendar, Sword, LogOut, User } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useUser } from '@/contexts/UserContext';

interface Mesa {
  id: string;
  nome: string;
  descricao: string;
  sistema: string;
  jogadores: number;
  mestre: string;
  proximaSessao?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { username } = useUser();
  const [mesas, setMesas] = useState<Mesa[]>([
    {
      id: '1',
      nome: 'Reinos Perdidos',
      descricao: 'Uma campanha épica em um mundo de fantasia medieval',
      sistema: 'D&D 5e',
      jogadores: 4,
      mestre: 'Gandalf',
      proximaSessao: '2024-12-15'
    },
    {
      id: '2',
      nome: 'Cyberpunk 2077',
      descricao: 'Aventuras nas ruas de Night City',
      sistema: 'Cyberpunk RED',
      jogadores: 3,
      mestre: 'Rogue',
      proximaSessao: '2024-12-18'
    },
    {
      id: '3',
      nome: 'Call of Cthulhu',
      descricao: 'Investigações sobrenaturais nos anos 20',
      sistema: 'Call of Cthulhu',
      jogadores: 5,
      mestre: 'Lovecraft',
      proximaSessao: '2024-12-20'
    }
  ]);
  
  const [novaMesa, setNovaMesa] = useState({
    nome: '',
    descricao: '',
    sistema: 'D&D 5e',
    jogadores: 4
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
      // Se não tem username, redirecionar para onboarding
      if (!username) {
        navigate('/onboarding');
      }
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

  const handleCriarMesa = () => {
    if (!novaMesa.nome.trim()) {
      showError('Digite um nome para a mesa');
      return;
    }

    const novaMesaObj: Mesa = {
      id: Date.now().toString(),
      nome: novaMesa.nome,
      descricao: novaMesa.descricao,
      sistema: novaMesa.sistema,
      jogadores: novaMesa.jogadores,
      mestre: username || user?.email || 'Você'
    };

    setMesas([novaMesaObj, ...mesas]);
    setNovaMesa({
      nome: '',
      descricao: '',
      sistema: 'D&D 5e',
      jogadores: 4
    });
    setIsDialogOpen(false);
    showSuccess(`Mesa "${novaMesa.nome}" criada com sucesso!`);
  };

  const handleEntrarMesa = (mesaId: string) => {
    showSuccess(`Entrando na mesa ${mesaId}...`);
    // Aqui você pode navegar para a página da mesa específica
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Nighshift
            </h1>
            <p className="text-gray-400">Gerencie suas mesas de RPG</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{username || 'Usuário'}</p>
              </div>
              <p className="text-sm text-gray-400">{user?.email}</p>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Mesas</p>
                  <p className="text-2xl font-bold">{mesas.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Jogadores Ativos</p>
                  <p className="text-2xl font-bold">
                    {mesas.reduce((acc, mesa) => acc + mesa.jogadores, 0)}
                  </p>
                </div>
                <Sword className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Próxima Sessão</p>
                  <p className="text-2xl font-bold">
                    {mesas.filter(m => m.proximaSessao).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header das Mesas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Suas Mesas</h2>
            <p className="text-gray-400">Gerencie e participe de mesas de RPG</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Nova Mesa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Criar Nova Mesa</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Preencha os detalhes da sua nova mesa de RPG
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome da Mesa</Label>
                  <Input
                    id="nome"
                    value={novaMesa.nome}
                    onChange={(e) => setNovaMesa({...novaMesa, nome: e.target.value})}
                    placeholder="Ex: Reinos Perdidos"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={novaMesa.descricao}
                    onChange={(e) => setNovaMesa({...novaMesa, descricao: e.target.value})}
                    placeholder="Descreva sua campanha..."
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sistema">Sistema</Label>
                    <select
                      id="sistema"
                      value={novaMesa.sistema}
                      onChange={(e) => setNovaMesa({...novaMesa, sistema: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="D&D 5e">D&D 5e</option>
                      <option value="Pathfinder 2e">Pathfinder 2e</option>
                      <option value="Cyberpunk RED">Cyberpunk RED</option>
                      <option value="Call of Cthulhu">Call of Cthulhu</option>
                      <option value="Tormenta20">Tormenta20</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="jogadores">Nº de Jogadores</Label>
                    <Input
                      id="jogadores"
                      type="number"
                      min="1"
                      max="10"
                      value={novaMesa.jogadores}
                      onChange={(e) => setNovaMesa({...novaMesa, jogadores: parseInt(e.target.value) || 1})}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCriarMesa}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Criar Mesa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de Mesas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mesas.map((mesa) => (
            <Card key={mesa.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">{mesa.nome}</CardTitle>
                <CardDescription className="text-gray-400">
                  {mesa.descricao}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Sistema</span>
                    <span className="font-medium">{mesa.sistema}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Jogadores</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{mesa.jogadores}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Mestre</span>
                    <span className="font-medium">{mesa.mestre}</span>
                  </div>
                  
                  {mesa.proximaSessao && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Próxima Sessão</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{mesa.proximaSessao}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleEntrarMesa(mesa.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Entrar na Mesa
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Mensagem se não houver mesas */}
        {mesas.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhuma mesa encontrada</h3>
            <p className="text-gray-400 mb-6">Crie sua primeira mesa para começar a jogar!</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Mesa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;