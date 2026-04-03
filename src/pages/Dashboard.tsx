"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import LayoutPadrao from '@/components/LayoutPadrao';
import CriarMesaModal from '@/components/CriarMesaModal';
import { Users, Crown, LogOut, Plus } from 'lucide-react';

const Dashboard = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarMesas();
  }, []);

  const carregarMesas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('mesa_participantes')
      .select('mesa_id, is_mestre, mesas(id, nome, slug)')
      .eq('user_id', user.id);

    if (!error && data) {
      setMesas(data.map(p => ({
        id: p.mesas.id,
        nome: p.mesas.nome,
        slug: p.mesas.slug,
        isMestre: p.is_mestre
      })));
    }
    setLoading(false);
  };

  const entrarNaMesa = (slug) => {
    navigate(`/sala/${slug}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <LayoutPadrao><div className="p-8">Carregando...</div></LayoutPadrao>;

  return (
    <LayoutPadrao>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Suas Mesas</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} /> Criar Mesa
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <LogOut size={20} /> Sair
            </button>
          </div>
        </div>

        {mesas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Você não participa de nenhuma mesa ainda.</p>
            <button
              onClick={() => setModalAberto(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              Criar sua primeira mesa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mesas.map((mesa) => (
              <div key={mesa.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{mesa.nome}</h2>
                  {mesa.isMestre && <Crown className="text-yellow-500" size={20} />}
                </div>
                <p className="text-gray-500 text-sm mb-4">slug: {mesa.slug}</p>
                <button
                  onClick={() => entrarNaMesa(mesa.slug)}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Entrar na Mesa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CriarMesaModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={() => {
          setModalAberto(false);
          carregarMesas();
        }}
      />
    </LayoutPadrao>
  );
};

export default Dashboard;