"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Globe, Shield, Palette, Moon, Sun } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Configuracoes = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('pt-BR');
  const [privacy, setPrivacy] = useState('public');

  const handleSaveSettings = () => {
    showSuccess('Configurações salvas com sucesso!');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-400">Personalize sua experiência no Nighshift</p>
      </div>

      <div className="space-y-6">
        {/* Aparência */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Aparência</CardTitle>
                <CardDescription className="text-gray-400">
                  Personalize a aparência da interface
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Modo Escuro</Label>
                <p className="text-sm text-gray-400">
                  Ativar/desativar o tema escuro
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-gray-400" />
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Moon className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription className="text-gray-400">
                  Controle suas notificações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações por Email</Label>
                <p className="text-sm text-gray-400">
                  Receber notificações por email
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-reminders">Lembretes de Sessão</Label>
                <p className="text-sm text-gray-400">
                  Lembretes antes das sessões
                </p>
              </div>
              <Switch
                id="session-reminders"
                checked={true}
                onCheckedChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacidade */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Privacidade</CardTitle>
                <CardDescription className="text-gray-400">
                  Controle sua visibilidade
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacy">Visibilidade do Perfil</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione a visibilidade" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="friends">Apenas Amigos</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-400">
                Quem pode ver seu perfil e mesas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;