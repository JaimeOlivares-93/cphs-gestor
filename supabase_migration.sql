-- =====================================================
-- MIGRACIÓN SUPABASE: Tablas faltantes para sincronización
-- CPHS Gestor - Sincronización Multi-Dispositivo
-- =====================================================
-- INSTRUCCIONES:
-- 1. Ve a https://supabase.com/dashboard
-- 2. Selecciona tu proyecto (zdhsuhxshsrslxlnllcs)
-- 3. Ve a "SQL Editor" en el menú lateral
-- 4. Pega TODO este código y haz clic en "Run"
-- =====================================================

-- =====================================================
-- TABLA 1: worker_of_month (Trabajador Destacado del Mes)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.worker_of_month (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  avatar TEXT DEFAULT '🏆',
  month TEXT NOT NULL DEFAULT '',
  photo TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solo necesitamos 1 fila activa (el reconocimiento actual)
-- Insertar fila semilla si la tabla está vacía
INSERT INTO public.worker_of_month (name, role, reason, avatar, month, photo)
SELECT 'Carlos Mendoza', 'Operario de Bodega y Despacho', 
       'Reportó diligentemente 12 condiciones de riesgo y mantuvo asistencia del 100% en charlas de seguridad de EPP en el Taller.',
       'C', 'Mayo 2026', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.worker_of_month LIMIT 1);

-- =====================================================
-- TABLA 2: prevention_alerts (Alertas de Terreno y Sugerencias)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.prevention_alerts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'ALERTA' CHECK (type IN ('ALERTA', 'SUGERENCIA')),
  description TEXT NOT NULL DEFAULT '',
  worker_name TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (status IN ('PENDIENTE', 'RESUELTA')),
  photo TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar datos semilla si la tabla está vacía
INSERT INTO public.prevention_alerts (type, description, worker_name, date, status, photo)
SELECT 'ALERTA', 
       'Falta de demarcación de seguridad en la zona de maniobras de grúas horquillas en Bodega sector B.',
       'Raúl Canumán', '2026-05-24', 'PENDIENTE', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.prevention_alerts LIMIT 1);

INSERT INTO public.prevention_alerts (type, description, worker_name, date, status, photo)
SELECT 'SUGERENCIA', 
       'Instalar protectores de goma en las esquinas de los soportes metálicos del taller de mantención.',
       'Gonzalo Jara', '2026-05-20', 'RESUELTA', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.prevention_alerts WHERE type = 'SUGERENCIA' LIMIT 1);

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- Permitir lectura y escritura pública con la clave anon
-- (Igual que las demás tablas del proyecto)
-- =====================================================

-- worker_of_month: Habilitar RLS y políticas
ALTER TABLE public.worker_of_month ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública worker_of_month" 
  ON public.worker_of_month FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserción pública worker_of_month" 
  ON public.worker_of_month FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública worker_of_month" 
  ON public.worker_of_month FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir eliminación pública worker_of_month" 
  ON public.worker_of_month FOR DELETE 
  USING (true);

-- prevention_alerts: Habilitar RLS y políticas
ALTER TABLE public.prevention_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública prevention_alerts" 
  ON public.prevention_alerts FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserción pública prevention_alerts" 
  ON public.prevention_alerts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Permitir actualización pública prevention_alerts" 
  ON public.prevention_alerts FOR UPDATE 
  USING (true);

CREATE POLICY "Permitir eliminación pública prevention_alerts" 
  ON public.prevention_alerts FOR DELETE 
  USING (true);

-- =====================================================
-- FIN DE MIGRACIÓN
-- =====================================================
