"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface CriarMesaModalProps {
  onMesaCriada?: () => void;
}

const CriarMesaModal = ({ onMesaCriada }: CriarMesaModalProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    senha: ''
  });

  const gerarSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  const handleCriarMesa = async () => {
    if (!formData.nome.trim()) {
      showError('Digite um nome para a mesa');
      return;
    }

    if (!formData.senha.trim()) {
      showError('Digite uma senha para a mesa');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError('Você precisa estar logado para criar uma mesa');
        return;
      }

      const slug = gerarSlug(formData.nome);
      
      // Criar a mesa
      const { data: mesa, error: mesaError } = await supabase
        .from('mesas')
        .insert({
          nome: formData.nome,
          slug: slug,
          senha: formData.senha,
          created_by: user.id
        })
        .select()
        .single();

      if (mesaError) {
        if (mesaError.code === '23505') {
          // Slug duplicado, adicionar timestamp
          const uniqueSlug = `${slug}-${Date.now().toString().slice(-6)}`;
          const { data: mesaUnica, error: mesaUnicaError } = await supabase
            .from('mesas')
            .insert({
              nome: formData.nome,
              slug: uniqueSlug,
              senha: formData.senha,
              created_by: user.id
            })
            .select()
            .single();

          if (mesaUnicaError) throw mesaUnicaError;
          
          // Adicionar criador como mestre
          await supabase
            .from('mesa_participantes')
            .insert({
              mesa_id: mesaUnica.id,
              user_id: user.id,
              nome_exibicao: user.email?.split('@')[0] || 'Mestre',
              is_mestre: true
            });

          showSuccess('Mesa criada com sucesso!');
          setIsOpen(false);
          setFormData({ nome: '', senha: '' });
          
          if (onMesaCriada) onMesaCriada();
          navigate(`/sala/${uniqueSlug}`);
          return;
        }
        throw mesaError;
      }

      // Adicionar criador como mestre
      await supabase
        .from('mesa_participantes')
        .insert({
          mesa_id: mesa.id,
          user_id: user.id,
          nome_exibicao: user.email?.split('@')[0] || 'Mestre',
          is_mestre: true
        });

      showSuccess('Mesa criada com sucesso!');
      setIsOpen(false);
      setFormData({ nome: '', senha: '' });
      
      if (onMesaCriada) onMesaCriada();
      navigate(`/sala/${slug}`);
    } catch (error: any) {
      console.error('Erro ao criar mesa:', error);
      showError(error.message || 'Erro ao criar mesa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Criar Mesa
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Criar Nova Mesa</DialogTitle>
          <DialogDescription className="text-gray-400">
            Crie uma nova mesa de RPG para jogar com seus amigos
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome da Mesa</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: Aventura na Floresta"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="senha">Senha da Mesa</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
              placeholder="Digite uma senha para a mesa"
              className="bg-gray-700 border-gray-600"
            />
            <p className="text-sm text-gray-400">
              Os jogadores precisarão desta senha para entrar na mesa
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-gray-600 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCriarMesa}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'Criando...' : 'Criar Mesa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CriarMesaModal;