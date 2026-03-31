"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, Award, Edit } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

const Perfil = () => {
  const { username, setUsername } = useUser();
  const [newUsername, setNewUsername] = useState(username || '');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    }
  };

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
      setIsEditing(false);
      showSuccess(`Nome atualizado para: ${newUsername}!`);
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar nome de usuário');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Mesas Ativas', value: '3', icon: <User className="h-5 w-5" /> },
    { label: 'Personagens', value: '2', icon: <Award className="h-5 w-5" /> },
    { label: 'Sessões', value: '15', icon: <Calendar className="h-5 w-5" /> }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Perfil</h1>
        <p className="text-gray-400">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações do Usuário */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription className="text-gray-400">
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                      disabled={!isEditing}
                    />
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                        className="border-gray-600 hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setNewUsername(username);
                          }}
                          className="border-gray-600 hover:bg-gray-700"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleSaveUsername}
                          disabled={loading}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-3 mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">{user?.email || 'carregando...'}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    O email não pode ser alterado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription className="text-gray-400">
                Sua atividade no Nighshift
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{stat.label}</span>
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar e Info */}
        <div>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-1">{username || 'Usuário'}</h3>
                <p className="text-gray-400 mb-4">Mestre de RPG</p>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span className="text-sm text-gray-400">Membro desde</span>
                    <span className="text-gray-300">2024</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span className="text-sm text-gray-400">Status</span>
                    <span className="text-green-400">● Ativo</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span className="text-sm text-gray-400">Tipo de Conta</span>
                    <span className="text-blue-400">Gratuita</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfil;