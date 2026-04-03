"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Sword, User, LogOut } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useUser } from '@/contexts/UserContext';
import CriarMesaModal from '@/components/CriarMesaModal';

interface Mesa {
  id: string;
  nome: string;
  slug: string;
  created_at: string;
  is_mestre: boolean;
  participantes_count: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { username } = useUser();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    carregarMesas();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
    }
  };

  const carregarMesas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar mesas que o usuário participa
      const { data: participantes, error: participantesError } = await supabase
        .from('mesa_participantes')
        .select(`
          mesa_id,
          is_mestre,
          mesas (
            id,
            nome,
            slug,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (participantesError) throw participantesError;

      // Buscar contagem de participantes para cada mesa
      const mesasComParticipantes = await Promise.all(
        (participantes || []).map(async (participante: any) => {
          const { count } = await supabase
            .from('mesa_participantes')
            .select('*', { count: 'exact', head: true })
            .eq('mesa_id', participante.mesa_id);

          return {
            id: participante.mesas.id,
            nome: participante.mesas.nome,
            slug: participante.mesas.slug,
            created_at: participante.mesas.created_at,
            is_mestre: participante.is_mestre,
            participantes_count: count || 0
          };
        })
      );

      setMesas(mesasComParticipantes);
    } catch (error: any) {
      console.error('Erro ao carregar mesas:', error);
      showError('Erro ao carregar mesas');
    } finally {
      setLoading(false);
    }
  };

  const handleEntrarMesa = (slug: string) => {
    navigate(`/entrar/${slug}`);
  };

  const handleIrParaSala = (slug: string) => {
    navigate(`/sala/${slug}`);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('stayLoggedIn');
      showSuccess('Logout realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      showError(error.message || 'Erro ao fazer logout');
    }
  };

  const handleMesaCriada = () => {
    carregarMesas();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Gerencie suas mesas de RPG</p>
        </div>
        
        <div className="flex gap-2">
          <CriarMesaModal onMesaCriada={handleMesaCriada} />
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-gray-600 hover:bg-gray-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                  {mesas.reduce((acc, mesa) => acc + mesa.participantes_count, 0)}
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
                <p className="text-sm text-gray-400">Você é Mestre</p>
                <p className="text-2xl font-bold">
                  {mesas.filter(m => m.is_mestre).length}
                </p>
              </div>
              <User className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bem-vindo</p>
                <p className="text-2xl font-bold truncate">
                  {username || user?.email?.split('@')[0] || 'Jogador'}
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
          <p className="text-gray-400">Clique em uma mesa para entrar</p>
        </div>
      </div>

      {/* Grid de Mesas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Carregando mesas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mesas.map((mesa) => (
            <Card key={mesa.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">{mesa.nome}</CardTitle>
                <CardDescription className="text-gray-400">
                  Criada em {new Date(mesa.created_at).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Participantes</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{mesa.participantes_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${mesa.is_mestre ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'}`}>
                      {mesa.is_mestre ? 'Mestre' : 'Jogador'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Código</span>
                    <code className="text-sm bg-gray-900 px-2 py-1 rounded">{mesa.slug}</code>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  onClick={() => handleIrParaSala(mesa.slug)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Entrar na Sala
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Mensagem se não houver mesas */}
      {!loading && mesas.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">Nenhuma mesa encontrada</h3>
          <p className="text-gray-400 mb-6">Crie sua primeira mesa para começar a jogar!</p>
          <CriarMesaModal onMesaCriada={handleMesaCriada} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;