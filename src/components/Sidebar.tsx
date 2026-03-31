"use client";

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  User, 
  Gamepad2, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Home,
  UserCircle
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
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
      icon: <Gamepad2 className="h-5 w-5" />,
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
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

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed && (
          <div>
            <p className="text-sm font-medium text-white truncate">{username || 'Usuário'}</p>
            <p className="text-xs text-gray-400 truncate">Bem-vindo ao Nighshift</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;