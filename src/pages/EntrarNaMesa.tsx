"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Lock } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import LayoutPadrao from '@/components/LayoutPadrao';

const EntrarNaMesa = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mesa, setMesa] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome_exibicao: '',
    senha: ''
  });

  useEffect(() => {
    carregarMesa();
  }, [slug]);

  const carregarMesa = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          showError('Mesa não encontrada');
          navigate('/dashboard');
          return;
        }
        throw error;
      }

      setMesa(data);
    } catch (error: any) {
      console.error('Erro ao carregar mesa:', error);
      showError('Erro ao carregar mesa');
      navigate('/dashboard');
    }
  };

  const handleEntrarMesa = async () => {
    if (!formData.nome_exibicao.trim()) {
      showError('Digite um nome para exibição');
      return;
    }

    if (!formData.senha.trim()) {
      showError('Digite a senha da mesa');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError('Você precisa estar logado para entrar na mesa');
        return;
      }

      // Verificar se a senha está correta
      if (formData.senha !== mesa.senha) {
        showError('Senha incorreta');
        return;
      }

      // Verificar se o usuário já está na mesa
      const { data: participanteExistente } = await supabase
        .from('mesa_participantes')
        .select('*')
        .eq('mesa_id', mesa.id)
        .eq('user_id', user.id)
        .single();

      if (participanteExistente) {
        // Usuário já está na mesa, redirecionar direto
        showSuccess('Você já está nesta mesa!');
        navigate(`/sala/${slug}`);
        return;
      }

      // Adicionar usuário como participante
      const { error: participanteError } = await supabase
        .from('mesa_participantes')
        .insert({
          mesa_id: mesa.id,
          user_id: user.id,
          nome_exibicao: formData.nome_exibicao,
          is_mestre: false
        });

      if (participanteError) {
        if (participanteError.code === '23505') {
          showError('Você já está nesta mesa');
          navigate(`/sala/${slug}`);
          return;
        }
        throw participanteError;
      }

      showSuccess('Entrou na mesa com sucesso!');
      navigate(`/sala/${slug}`);
    } catch (error: any) {
      console.error('Erro ao entrar na mesa:', error);
      showError(error.message || 'Erro ao entrar na mesa');
    } finally {
      setLoading(false);
    }
  };

  if (!mesa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Carregando mesa...</p>
        </div>
      </div>
    );
  }

  return (
    <LayoutPadrao>
      <div className="container mx-auto max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">{mesa.nome}</CardTitle>
                <CardDescription className="text-gray-400">
                  Entre nesta mesa de RPG
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nome_exibicao">Nome de Exibição</Label>
                <Input
                  id="nome_exibicao"
                  value={formData.nome_exibicao}
                  onChange={(e) => setFormData({...formData, nome_exibicao: e.target.value})}
                  placeholder="Como você quer ser chamado na mesa?"
                  className="bg-gray-700 border-gray-600"
                />
                <p className="text-sm text-gray-400">
                  Este nome será visível para outros jogadores na sala
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha da Mesa</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    placeholder="Digite a senha da mesa"
                    className="bg-gray-700 border-gray-600 pr-10"
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">
                  Peça a senha ao mestre da mesa
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h4 className="font-medium mb-2">Informações da Mesa</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Código:</span>
                  <code className="bg-gray-800 px-2 py-1 rounded">{mesa.slug}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Criada em:</span>
                  <span>{new Date(mesa.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <div className="p-6 pt-0">
            <Button 
              onClick={handleEntrarMesa}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Entrando...' : 'Entrar na Mesa'}
            </Button>
          </div>
        </Card>
      </div>
    </LayoutPadrao>
  );
};

export default EntrarNaMesa;