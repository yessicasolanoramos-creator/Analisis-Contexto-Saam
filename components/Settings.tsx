
import React, { useState, useEffect } from 'react';
// Fix: Added missing Cloud icon import from lucide-react
import { Download, Database, Save, CheckCircle2, AlertTriangle, ExternalLink, FileSpreadsheet, BarChart4, RefreshCw, Lock, Trash2, Info, Terminal, Cloud } from 'lucide-react';
import { DofaRecord, IndicatorRecord } from '../types';

interface SettingsProps {
  records: DofaRecord[];
  indicators: IndicatorRecord[];
  onRefreshCloud?: () => void;
}

const Configuration: React.FC<SettingsProps> = ({ records, indicators, onRefreshCloud }) => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_KEY || '';

  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('sb_url') || envUrl);
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('sb_key') || envKey);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isUsingManual = !!localStorage.getItem('sb_url');
  const hasEnvVars = !!envUrl && !!envKey;

  const handleSupabaseSync = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setErrorMessage('Faltan credenciales.');
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    setErrorMessage('');

    try {
      localStorage.setItem('sb_url', supabaseUrl);
      localStorage.setItem('sb_key', supabaseKey);

      // Sincronizar DOFA
      await fetch(`${supabaseUrl}/rest/v1/dofa_records`, {
        method: 'POST',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify(records)
      });

      // Sincronizar Indicadores
      await fetch(`${supabaseUrl}/rest/v1/indicators_records`, {
        method: 'POST',
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify(indicators)
      });

      if (onRefreshCloud) onRefreshCloud();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMessage('Error al conectar. ¿Ya creaste las tablas en Supabase?');
      setSyncStatus('error');
    }
  };

  const sqlCode = `-- COPIA Y PEGA ESTO EN EL 'SQL EDITOR' DE SUPABASE:

-- 1. Tabla para la Matriz DOFA
CREATE TABLE IF NOT EXISTS dofa_records (
  id UUID PRIMARY KEY,
  country TEXT,
  axis TEXT,
  category TEXT,
  type TEXT,
  factor TEXT,
  description TEXT,
  justification TEXT,
  impact INTEGER,
  "user" TEXT,
  timestamp BIGINT,
  actions JSONB DEFAULT '[]'::jsonb
);

-- 2. Tabla para los Indicadores
CREATE TABLE IF NOT EXISTS indicators_records (
  id UUID PRIMARY KEY,
  "processId" TEXT,
  "processName" TEXT,
  type TEXT,
  name TEXT,
  goal TEXT,
  formula TEXT,
  timestamp BIGINT
);

-- 3. Desactivar RLS para pruebas rápidas
ALTER TABLE dofa_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE indicators_records DISABLE ROW LEVEL SECURITY;`;

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-900 text-sky-400 rounded-2xl shadow-xl">
          <Database size={28} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Configuración Cloud</h2>
          <p className="text-slate-500 font-medium">Gestión de base de datos colaborativa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase italic flex items-center gap-2">
                <Cloud size={20} className="text-sky-500" /> Estado de Conexión
              </h3>
              {!isUsingManual && hasEnvVars && (
                <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[9px] font-black uppercase tracking-widest">Vercel Active</span>
              )}
           </div>

           <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Supabase URL</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-xs" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anon Key (Public)</label>
                <input type="password" className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-xs" value={supabaseKey} onChange={(e) => setSupabaseKey(e.target.value)} />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={handleSupabaseSync} className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${syncStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
                  {syncStatus === 'syncing' ? 'Sincronizando...' : syncStatus === 'success' ? <><CheckCircle2 size={18}/> Éxito</> : <><RefreshCw size={18} className="text-sky-400"/> Sincronizar Ahora</>}
                </button>
                {isUsingManual && (
                  <button onClick={() => { localStorage.removeItem('sb_url'); localStorage.removeItem('sb_key'); window.location.reload(); }} className="p-5 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              {errorMessage && <p className="text-[10px] text-rose-500 font-bold uppercase text-center mt-2">{errorMessage}</p>}
           </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
           <h3 className="text-xl font-black mb-6 italic text-sky-400 flex items-center gap-2">
             <Terminal size={20} /> Setup Supabase
           </h3>
           <p className="text-xs text-slate-400 mb-4 leading-relaxed">
             Para que la base de datos funcione, debes ejecutar este código en el **SQL Editor** de tu proyecto en Supabase:
           </p>
           <div className="relative">
             <pre className="bg-black/50 p-5 rounded-2xl text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-[300px] border border-white/5">
               {sqlCode}
             </pre>
             <button onClick={() => navigator.clipboard.writeText(sqlCode)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all">
               <Download size={14} />
             </button>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
               <FileSpreadsheet size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 uppercase italic">Exportación Local</h3>
               <p className="text-slate-500 text-xs font-medium">Descarga tus datos actuales en formato Excel (.CSV).</p>
            </div>
         </div>
         <button onClick={() => {
            const headers = 'ID;Pais;Eje;Categoria;Tipo;Factor;Justificacion;Impacto;Usuario\n';
            const rows = records.map(r => `${r.id};${r.country};${r.axis};${r.category};${r.type};${r.factor};${r.justification};${r.impact};${r.user}`).join('\n');
            const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "Reporte_DOFA_SAAM.csv";
            link.click();
         }} className="px-12 py-5 bg-sky-500 text-slate-900 rounded-[2rem] font-black uppercase text-xs italic tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl">
            Descargar Reporte Completo
         </button>
      </div>
    </div>
  );
};

export default Configuration;
