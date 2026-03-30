import { MadeWithDyad } from "@/components/made-with-dyad";
import Auth from "@/components/Auth";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            RPG App
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Um sistema completo para gerenciar suas campanhas de RPG, personagens e aventuras
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">✨ Recursos</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Criação de personagens detalhada</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gerenciamento de campanhas</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sistema de combate integrado</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Inventário e equipamentos</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Magias e habilidades</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">🚀 Comece Agora</h2>
              <p className="text-gray-300 mb-4">
                Crie sua conta gratuitamente e comece a gerenciar suas aventuras de RPG de forma profissional.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Online 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Gratuito</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Auth />
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p className="mb-2">Projeto desenvolvido com React, Vite, Tailwind CSS e Supabase</p>
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Index;