"use client";

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireUsername?: boolean;
}

const ProtectedRoute = ({ children, requireUsername = false }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasUsername, setHasUsername] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Verificar autenticação periodicamente
    const interval = setInterval(() => {
      checkAuth();
    }, 30000); // Verificar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuthenticated(false);
        setHasUsername(false);
        return;
      }
      
      setAuthenticated(!!user);
      
      if (user) {
        // Verificar se tem username no localStorage
        const username = localStorage.getItem('nighshift_username');
        setHasUsername(!!username);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAuthenticated(false);
      setHasUsername(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  // Se requer username mas o usuário não tem, redirecionar para onboarding
  if (requireUsername && !hasUsername) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;