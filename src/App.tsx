import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Personagens from "./pages/Personagens";
import Sistemas from "./pages/Sistemas";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import EntrarNaMesa from "./pages/EntrarNaMesa";
import Sala from "./pages/Sala";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/personagens" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Personagens />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sistemas" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Sistemas />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Perfil />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Configuracoes />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/entrar/:slug" 
              element={
                <ProtectedRoute>
                  <EntrarNaMesa />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sala/:slug" 
              element={
                <ProtectedRoute>
                  <Sala />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;