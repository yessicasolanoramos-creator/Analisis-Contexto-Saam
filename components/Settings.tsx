
import React, { useState } from 'react';
import { Download, Database, Save, CheckCircle2, AlertTriangle, ExternalLink, FileSpreadsheet, BarChart4, RefreshCw } from 'lucide-react';
import { DofaRecord, IndicatorRecord } from '../types';

interface SettingsProps {
  records: DofaRecord[];
  indicators: IndicatorRecord[];
  onRefreshCloud?: () => void;
}

const Configuration: React.FC<SettingsProps> = ({ records, indicators, onRefreshCloud }) => {
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('sb_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('sb_key') || '');
  const [supabaseTable, setSupabaseTable] = useState(localStorage.getItem('sb_table') || 'dofa_records');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const exportDOFAToExcel = () => {
    const headers = [
      'ID', 'Fecha', 'Pais', 'Eje', 'Categoria', 'Tipo', 'Factor', 'Justificacion', 'Impacto', 'Usuario', 
      'Accion', 'Responsable', 'Fecha Inicio', 'Fecha Fin', 'Seguimiento Eficacia'
    ].join(';');

    const rows = records.flatMap(r => {
      const baseInfo = [
        r.id,
        new Date(r.timestamp).toLocaleDateString(),
        r.country,
        r.axis,
        r.category,
        r.type,
        r.factor,
        (r.justification || '').replace(/;/g, ','),
        r.impact,
        r.user
      ];

      if (r.actions.length === 0) {
        return [baseInfo.join(';') + ';;;;'];
      }

      return r.actions.map(a => [
        ...baseInfo,
        (a.text || '').replace(/;/g, ','),
        (a.responsible || '').replace(/;/g, ','),
        a.startDate,
        a.endDate,
        (a.effectivenessFollowUp || '').replace(/;/g, ',')
      ].join(';'));
    });

    const csvContent = "\uFEFF" + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DOFA_SAAMTOWAGE_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportIndicatorsToExcel = () => {
    const headers = ['ID', 'Fecha Registro', 'Proceso', 'Tipo', 'Nombre Indicador', 'Meta', 'Formula'].join(';');
    const rows = indicators.map(i => [
      i.id,
      new Date(i.timestamp).toLocaleDateString(),
      i.processName,
      i.type,
      i.name,
      i.goal,
      i.formula
    ].join(';'));

    const csvContent = "\uFEFF" + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Indicadores_Consolidados_SAAMTOWAGE_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSupabaseSync = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setErrorMessage('Por favor ingrese la URL y la Key de Supabase.');
      setSyncStatus('error');
      return;
    }

    setSyncStatus('syncing');
    setErrorMessage('');

    try {
      localStorage.setItem('sb_url', supabaseUrl);
      localStorage.setItem('sb_key', supabaseKey);
      localStorage.setItem('sb_table', supabaseTable);

      // Sincronización: Subir datos locales
      const response = await fetch(`${supabaseUrl}/rest/v1/${supabaseTable}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(records)
      });

      if (!response.ok) {
        throw new Error(`Error en sincronización: ${response.statusText}`);
      }

      // Después de subir, forzar descarga de lo que hay en la nube (incluyendo lo de otros)
      if (onRefreshCloud) {
        onRefreshCloud();
      }

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con Supabase.');
      setSyncStatus('error');
    }
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-slate-900 text-sky-400 rounded-2xl shadow-xl">
          <Database size={28} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Configuración</h2>
          <p className="text-slate-500 font-medium">Gestión de datos, exportaciones y sincronización cloud.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exportación */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-emerald-500" size={24} />
            <h3 className="text-xl font-black text-slate-800 uppercase italic">Exportar a Excel</h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Descargue toda la base de datos de registros y planes de acción en formato .CSV para Microsoft Excel.
          </p>
          
          <div className="space-y-4 pt-4">
            <button 
              onClick={exportDOFAToExcel}
              className="w-full py-5 bg-sky-500 text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all shadow-lg"
            >
              <Download size={18} />
              Exportar Matriz DOFA
            </button>
            <button 
              onClick={exportIndicatorsToExcel}
              className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-emerald-600 hover:scale-[1.02] transition-all shadow-lg"
            >
              <BarChart4 size={18} />
              Exportar Indicadores
            </button>
          </div>
        </div>

        {/* Supabase Config */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-sky-500" size={24} />
            <h3 className="text-xl font-black text-slate-800 uppercase italic">Conectar Cloud</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Project URL</label>
              <input 
                type="text" 
                placeholder="https://xyz.supabase.co"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-xs"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Anon Public Key</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-xs"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={handleSupabaseSync}
                disabled={syncStatus === 'syncing'}
                className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg
                  ${syncStatus === 'syncing' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                    syncStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}
                `}
              >
                {syncStatus === 'syncing' ? 'Sincronizando...' : 
                 syncStatus === 'success' ? (
                   <><CheckCircle2 size={18} /> Listo</>
                 ) : (
                   <><Save size={18} className="text-sky-400" /> Guardar y Sincronizar</>
                 )}
              </button>
              
              <button 
                onClick={() => onRefreshCloud?.()}
                className="p-5 bg-sky-100 text-sky-600 rounded-2xl hover:bg-sky-600 hover:text-white transition-all shadow-lg"
                title="Refrescar datos de la nube"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            {syncStatus === 'error' && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 animate-in shake duration-300">
                <AlertTriangle size={18} className="shrink-0" />
                <p className="text-[10px] font-bold uppercase leading-tight">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
        <h3 className="text-xl font-black mb-6 text-sky-400 italic">Notas Técnicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Sincronización colaborativa: Al conectar con Supabase, la aplicación descargará automáticamente los registros creados por otros usuarios cada 60 segundos o al iniciar sesión.
            </p>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-black">
              <ExternalLink size={14} />
              <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="hover:underline">Dashboard de Supabase</a>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
            <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Base de Datos</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-100">Matriz DOFA:</span>
              <span className="font-black text-sky-400">{records.length} registros</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-2">
              <span className="text-xs font-bold text-slate-100">Indicadores:</span>
              <span className="font-black text-emerald-400">{indicators.length} registros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
