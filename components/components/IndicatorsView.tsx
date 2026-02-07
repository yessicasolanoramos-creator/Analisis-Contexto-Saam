
import React, { useState } from 'react';
import { 
  BarChart4, 
  ChevronRight, 
  Plus, 
  Trash, 
  Target, 
  Activity, 
  Database, 
  Layers, 
  ArrowRight,
  X,
  Save
} from 'lucide-react';
import { IndicatorRecord, IndicatorType } from '../types';

interface IndicatorsViewProps {
  indicators: IndicatorRecord[];
  onAddIndicator: (indicator: IndicatorRecord) => void;
  onDeleteIndicator: (id: string) => void;
}

const PROCESS_MAP = {
  estrategicos: [
    { id: 'pes', name: 'Planeación Estratégica' },
    { id: 'pqu', name: 'Calidad' }
  ],
  operativos: [
    { id: 'dco', name: 'Comercial' },
    { id: 'cco', name: 'Control Operacional (CCO)' },
    { id: 'mdo', name: 'Operaciones', sub: ['Personal embarcado', 'Aseguramiento y control', 'Alistamiento operativo', 'Avituallamiento', 'Mantenimiento abordo'] }
  ],
  apoyo: [
    { id: 'hse', name: 'HSE', sub: ['Salud', 'Seguridad', 'Ambiente'] },
    { id: 'egh', name: 'Gestión Humana' },
    { id: 'emt', name: 'Mantenimiento' },
    { id: 'ega', name: 'Gestión Administrativa', sub: ['Administración', 'Finanzas', 'Contabilidad', 'TIC'] }
  ]
};

const IndicatorsView: React.FC<IndicatorsViewProps> = ({ indicators, onAddIndicator, onDeleteIndicator }) => {
  const [selectedProcess, setSelectedProcess] = useState<{id: string, name: string} | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Táctico' as IndicatorType,
    name: '',
    goal: '',
    formula: ''
  });

  const filteredIndicators = indicators.filter(i => i.processId === selectedProcess?.id);

  const handleAdd = () => {
    if (!selectedProcess || !formData.name) return;
    
    const newIndicator: IndicatorRecord = {
      id: crypto.randomUUID(),
      processId: selectedProcess.id,
      processName: selectedProcess.name,
      type: formData.type,
      name: formData.name,
      goal: formData.goal,
      formula: formData.formula,
      timestamp: Date.now()
    };

    onAddIndicator(newIndicator);
    setFormData({ type: 'Táctico', name: '', goal: '', formula: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="mb-12 border-b border-slate-200 pb-10">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">MAPA DE PROCESOS</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center gap-2 text-sky-600">
          <BarChart4 size={14} /> Gestión de Indicadores HSEQ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
             <div className="flex flex-col gap-12">
                <section>
                  <h3 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mb-6">Estratégicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROCESS_MAP.estrategicos.map(p => (
                      <button key={p.id} onClick={() => setSelectedProcess(p)} className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${selectedProcess?.id === p.id ? 'bg-sky-600 border-sky-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-sky-300'}`}>
                        <span className="font-black text-sm uppercase italic tracking-tight">{p.name}</span>
                        <ChevronRight size={18} />
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-6">Operativos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PROCESS_MAP.operativos.map(p => (
                      <div key={p.id} className="space-y-3">
                        <button onClick={() => setSelectedProcess(p)} className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${selectedProcess?.id === p.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-emerald-300'}`}>
                          <span className="font-black text-sm uppercase italic tracking-tight leading-tight">{p.name}</span>
                        </button>
                        {p.sub && (
                          <div className="pl-4 flex flex-col gap-1.5 border-l-2 border-emerald-100 ml-6">
                             {p.sub.map(s => (
                               <button key={s} onClick={() => setSelectedProcess({id: `${p.id}-${s}`, name: s})} className={`text-[9px] font-black uppercase text-left py-1.5 px-3 rounded-lg ${selectedProcess?.name === s ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`}>• {s}</button>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-6">Apoyo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROCESS_MAP.apoyo.map(p => (
                      <div key={p.id} className="space-y-4">
                        <button onClick={() => setSelectedProcess(p)} className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${selectedProcess?.id === p.id ? 'bg-amber-600 border-amber-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-amber-300'}`}>
                          <span className="font-black text-sm uppercase italic tracking-tight">{p.name}</span>
                        </button>
                        {p.sub && (
                          <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-amber-100 ml-6">
                             {p.sub.map(s => (
                               <button key={s} onClick={() => setSelectedProcess({id: `${p.id}-${s}`, name: s})} className={`text-[9px] font-black uppercase text-left py-2 px-3 rounded-xl ${selectedProcess?.name === s ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:text-amber-500'}`}>• {s}</button>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-8">
            {selectedProcess ? (
              <div className="bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl">
                 <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Target size={28} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{selectedProcess.name}</h4>
                      <p className="text-[9px] text-sky-400 font-black uppercase tracking-[0.2em] mt-1">Hoja de Indicadores</p>
                    </div>
                 </div>

                 <div className="space-y-4 mb-10">
                    {filteredIndicators.length > 0 ? filteredIndicators.map(ind => (
                      <div key={ind.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] group relative">
                         <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${ind.type === 'Estratégico' ? 'bg-sky-500' : ind.type === 'Táctico' ? 'bg-emerald-500' : 'bg-amber-500'}`}>{ind.type}</span>
                            <button onClick={() => onDeleteIndicator(ind.id)} className="text-white/20 hover:text-rose-400"><Trash size={14} /></button>
                         </div>
                         <h5 className="font-black text-sm uppercase italic text-white/90 mb-2">{ind.name}</h5>
                         <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-black/20 p-3 rounded-xl">
                              <p className="text-[8px] font-black text-white/30 uppercase">Meta</p>
                              <p className="text-[10px] font-bold text-sky-400">{ind.goal}</p>
                            </div>
                            <div className="bg-black/20 p-3 rounded-xl">
                              <p className="text-[8px] font-black text-white/30 uppercase">Fórmula</p>
                              <p className="text-[10px] font-bold text-white/60 leading-tight">{ind.formula}</p>
                            </div>
                         </div>
                      </div>
                    )) : (
                      <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2.5rem] text-white/20">
                         <Activity size={32} className="mb-2" />
                         <p className="text-[10px] font-black uppercase">Sin indicadores registrados</p>
                      </div>
                    )}
                 </div>

                 <button onClick={() => setIsFormOpen(true)} className="w-full py-5 bg-sky-500 text-slate-900 rounded-[2rem] font-black uppercase text-xs italic tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl">
                   <Plus size={18} /> Registrar Indicador
                 </button>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center">
                 <Layers size={40} className="text-slate-200 mb-6" />
                 <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Seleccione un Proceso</h4>
                 <p className="text-slate-400 font-medium text-xs uppercase tracking-widest opacity-60">PULSE SOBRE UN BLOQUE DEL MAPA PARA GESTIONAR INDICADORES</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <h4 className="text-xl font-black uppercase italic text-slate-900">Nuevo Indicador</h4>
                <button onClick={() => setIsFormOpen(false)} className="p-3 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200"><X size={20} /></button>
             </div>

             <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                  <div className="flex gap-4 p-1.5 bg-slate-100 rounded-2xl">
                    {['Estratégico', 'Táctico', 'Operativo'].map((t) => (
                      <button key={t} onClick={() => setFormData({...formData, type: t as IndicatorType})} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${formData.type === t ? 'bg-white text-sky-600 shadow-md' : 'text-slate-400'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Indicador</label>
                   <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-sm" value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fórmula</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 outline-none font-bold text-sm" value={formData.formula} onChange={(e) => setFormData({...formData, formula: e.target.value})} />
                  </div>
                </div>
             </div>

             <div className="p-10 bg-slate-50 flex justify-end gap-6">
                <button onClick={handleAdd} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs italic tracking-widest flex items-center gap-3 shadow-xl">
                  <Save size={18} className="text-sky-400" /> Confirmar Registro
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndicatorsView;
