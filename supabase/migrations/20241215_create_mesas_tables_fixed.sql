-- Tabela de mesas
CREATE TABLE IF NOT EXISTS public.mesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Tabela de participantes da mesa
CREATE TABLE IF NOT EXISTS public.mesa_participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mesa_id UUID REFERENCES public.mesas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_exibicao TEXT NOT NULL,
  is_mestre BOOLEAN DEFAULT FALSE,
  ultima_atividade TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mesa_id, user_id)
);

-- Índices
CREATE INDEX idx_mesas_slug ON public.mesas(slug);
CREATE INDEX idx_mesa_participantes_mesa_id ON public.mesa_participantes(mesa_id);

-- RLS
ALTER TABLE public.mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mesa_participantes ENABLE ROW LEVEL SECURITY;

-- Políticas para mesas
CREATE POLICY "ver_mesas" ON public.mesas FOR SELECT TO authenticated USING (true);
CREATE POLICY "inserir_mesa" ON public.mesas FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Políticas para mesa_participantes
CREATE POLICY "ver_participantes" ON public.mesa_participantes FOR SELECT TO authenticated USING (true);
CREATE POLICY "inserir_participante" ON public.mesa_participantes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);