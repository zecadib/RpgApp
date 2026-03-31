"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';
import { useUser } from '@/contexts/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { username } = useUser();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header com perfil do usuário */}
        <header className="bg-gray-800/50 border-b border-gray-700 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Nighshift
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
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
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;