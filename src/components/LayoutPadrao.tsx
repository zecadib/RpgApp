"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  Users, 
  User, 
  Book,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sword,
  Dice5,
  DoorClosed,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

interface LayoutPadraoProps {
  children: React.ReactNode;
  isSala?: boolean;
  mesaSlug?: string;
  isMestre?: boolean;
  onSairMesa?: () => void;
  onEncerrarMesa?: () => void;
}

const LayoutPadrao = ({ 
  children, 
  isSala = false, 
  mesaSlug = '', 
  isMestre = false,
  onSairMesa,
  onEncerrarMesa
}: LayoutPadraoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const menuItemsDashboard = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      id: 'personagens',
      title: 'Personagens',
      icon: <User className="h-5 w-5" />,
      path: '/personagens'
    },
    {
      id: 'sistemas',
      title: 'Sistemas',
      icon: <Book className="h-5 w-5" />,
      path: '/sistemas'
    },
    {
      id: 'perfil',
      title: 'Perfil',
      icon: <UserCircle className="h-5 w-5" />,
      path: '/perfil'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      icon: <Settings className="h-5 w-5" />,
      path: '/configuracoes'
    }
  ];

  const menuItemsSala = [
    {
      id: 'visao-mesa',
      title: 'Visão da Mesa',
      icon: <Users className="h-5 w-5" />,
      path: `/sala/${mesaSlug}`
    },
    {
      id: 'personagens',
      title: 'Personagens',
      icon: <Sword className="h-5 w-5" />,
      path: `/sala/${mesaSlug}/personagens`
    },
    {
      id: 'dice-roller',
      title: 'Dice Roller',
      icon: <Dice5 className="h-5 w-5" />,
      path: `/sala/${mesaSlug}/dice`
    }
  ];

  const menuItems = isSala ? menuItemsSala : menuItemsDashboard;

  const isActive = (path: string) => {
    return location.pathname === path;
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

  const handleVoltar = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`h-screen bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Nighshift
                </span>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto"></div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${isActive(item.path) ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Button>
          ))}
        </div>

        {/* Ações da Sala (se for sala) */}
        {isSala && (
          <div className="p-4 border-t border-gray-800 space-y-2">
            {/* Botão Voltar para todos */}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleVoltar}
            >
              <ArrowLeft className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Voltar</span>}
            </Button>
            
            {/* Botão específico para mestre ou jogador */}
            {isMestre && onEncerrarMesa && (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={onEncerrarMesa}
              >
                <Trash2 className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Encerrar Mesa</span>}
              </Button>
            )}
            
            {!isMestre && onSairMesa && (
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={onSairMesa}
              >
                <DoorClosed className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Sair da Mesa</span>}
              </Button>
            )}
          </div>
        )}

        {/* User Info e Logout (se não for sala) */}
        {!isSala && (
          <div className="p-4 border-t border-gray-800 space-y-4">
            {!collapsed && username && (
              <div className="mb-2">
                <p className="text-sm font-medium text-white truncate">{username}</p>
                <p className="text-xs text-gray-400 truncate">Bem-vindo ao Nighshift</p>
              </div>
            )}
            
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Sair</span>}
            </Button>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutPadrao;