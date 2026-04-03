"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Crown, LogOut, Copy, User, Shield } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Participante {
  id: string;
  nome_exibicao: string;
  is_mestre: boolean;
  ultima_atividade: string;
  user_id: string;
}

const Sala = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [mesa, setMesa] = useState<any>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMestre, setIsMestre] = useState(false);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(atualizarAtividade, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, [slug]);

  const carregarDados = async () => {
    if (!slug) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setCurrentUser(user);

      // Carregar dados da mesa
      const { data: mesaData, error: mesaError } = await supabase
        .from('mesas')
        .select('*')
        .eq('slug', slug)
        .single();

      if (mesaError) {
        showError('Mesa não encontrada');
        navigate('/dashboard');
        return;
      }
      setMesa(mesaData);

      // Carregar participantes
      await carregarParticipantes(mesaData.id, user.id);

      // Verificar se o usuário é mestre
      const { data: participante } = await supabase
        .from('mesa_participantes')
        .select('is_mestre')
        .eq('mesa_id', mesaData.id)
        .eq('user_id', user.id)
        .single();

      setIsMestre(participante?.is_mestre || false);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      showError('Erro ao carregar sala');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const carregarParticipantes = async (mesaId: string, userId: string) => {
    const { data, error } = await supabase
      .from('mesa_participantes')
      .select('*')
      .eq('mesa_id', mesaId)
      .order('is_mestre', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao carregar participantes:', error);
      return;
    }

    setParticipantes(data || []);
  };

  const atualizarAtividade = async () => {
    if (!mesa || !currentUser) return;

    try {
      await supabase
        .from('mesa_participantes')
        .update({ ultima_atividade: new Date().toISOString() })
        .eq('mesa_id', mesa.id)
        .eq('user_id', currentUser.id);
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
    }
  };

  const handleSairDaMesa = async () => {
    if (!mesa || !currentUser) return;

    try {
      const { error } = await supabase
        .from('mesa_participantes')
        .delete()
        .eq('mesa_id', mesa.id)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      showSuccess('Você saiu da mesa');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao sair da mesa:', error);
      showError('Erro ao sair da mesa');
    }
  };

  const handleCopiarLink = () => {
    const link = `${window.location.origin}/entrar/${slug}`;
    navigator.clipboard.writeText(link);
    showSuccess('Link copiado para a área de transferência!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Carregando sala...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mesa?.nome}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-5 w-5" />
                <span>{participantes.length} jogadores</span>
              </div>
              {isMestre && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Crown className="h-5 w-5" />
                  <span className="text-sm">Você é o mestre</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCopiarLink}
              className="border-gray-600 hover:bg-gray-700"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar Link
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSairDaMesa}
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Mesa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Participantes */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participantes
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Jogadores online na mesa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participantes.map((participante) => {
                    const isOnline = new Date(participante.ultima_atividade).getTime() > Date.now() - 60000; // 1 minuto
                    const isCurrentUser = participante.user_id === currentUser?.id;
                    
                    return (
                      <div 
                        key={participante.id} 
                        className={`flex items-center justify-between p-3 rounded-lg ${isCurrentUser ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gray-800/30'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{participante.nome_exibicao}</span>
                              {participante.is_mestre && (
                                <Crown className="h-4 w-4 text-yellow-400" />
                              )}
                              {isCurrentUser && (
                                <span className="text-xs text-blue-400">(Você)</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {isOnline ? 'Online' : 'Offline'}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(participante.ultima_atividade).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área Principal da Sala */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat da Mesa */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Chat da Mesa</CardTitle>
                <CardDescription className="text-gray-400">
                  Converse com os outros jogadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
                  <div className="text-center text-gray-500 py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chat da mesa em desenvolvimento</p>
                    <p className="text-sm mt-2">Em breve: mensagens em tempo real!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ferramentas do Mestre */}
            {isMestre && (
              <Card className="bg-gray-800/50 border-gray-700 border-yellow-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Shield className="h-5 w-5" />
                    Ferramentas do Mestre
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Controle exclusivo para o mestre da mesa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20">
                      Gerenciar NPCs
                    </Button>
                    <Button variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20">
                      Rolagem de Dados
                    </Button>
                    <Button variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20">
                      Iniciar Combate
                    </Button>
                    <Button variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20">
                      Configurações da Mesa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informações da Mesa */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Informações da Mesa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Código da Mesa:</span>
                      <code className="bg-gray-900 px-2 py-1 rounded">{mesa?.slug}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Criada em:</span>
                      <span>{new Date(mesa?.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">● Ativa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Link de Convite:</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCopiarLink}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sala;