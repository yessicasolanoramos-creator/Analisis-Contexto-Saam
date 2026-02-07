
import React, { useState, useMemo, useCallback } from 'react';
import { 
  Search as SearchIcon, 
  Globe as GlobeIcon, 
  Trash as TrashIcon, 
  Save as SaveIcon, 
  ClipboardList as ClipboardListIcon, 
  User as UserIcon,
  Filter as FilterIcon,
  CheckCircle as CheckCircleIcon,
  X as XIcon,
  Plus as PlusIcon,
  MessageSquareQuote,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DofaRecord, DofaAction, ActionStatus } from '../types';
import { TYPE_LABELS, TYPE_COLORS, COUNTRIES, CATEGORIES } from '../constants';

interface ConsolidatedViewProps {
  records: DofaRecord[];
  onUpdateRecord: (record: DofaRecord) => void;
  onDeleteRecord: (id: string) => void;
}

const ConsolidatedView: React.FC<ConsolidatedViewProps> = ({ records, onUpdateRecord, onDeleteRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('Todos los Países');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas las Categorías');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getActionStatus = useCallback((action: DofaAction): ActionStatus => {
    if (action.effectivenessFollowUp && action.effectivenessFollowUp.trim().length > 0) return 'Cerrada';
    if (!action.startDate || !action.endDate) return 'Abierta';
    const now = new Date();
    const end = new Date(action.endDate);
    if (now > end) return 'Retrasada';
    return 'En proceso';
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesCountry = countryFilter === 'Todos los Países' || r.country === countryFilter;
      const matchesCategory = categoryFilter === 'Todas las Categorías' || r.category === categoryFilter;
      const searchStr = `${r.factor} ${r.justification} ${r.user}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      return matchesCountry && matchesCategory && matchesSearch;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [records, searchTerm, countryFilter, categoryFilter]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Análisis Consolidado</h2>
        <p className="text-slate-500 font-medium italic">Historial completo de factores registrados.</p>
      </div>

      {/* Barra de Filtros (Estilo de tu captura) */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Buscar factores o descripciones..." 
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-sky-500 outline-none font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-4 rounded-2xl bg-slate-50 border-transparent font-bold text-sm outline-none cursor-pointer"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option>Todos los Países</option>
          {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
        </select>
        <select 
          className="px-6 py-4 rounded-2xl bg-slate-50 border-transparent font-bold text-sm outline-none cursor-pointer"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>Todas las Categorías</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Listado de Factores */}
      <div className="space-y-4">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
            <div className="p-10 flex flex-col xl:flex-row xl:items-center gap-8">
              <div className="w-24 shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <FilterIcon size={12} /> Fecha
                </p>
                <p className="font-bold text-slate-700 text-sm tabular-nums">{new Date(record.timestamp).toLocaleDateString()}</p>
              </div>

              <div className="w-32 shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">País</p>
                <p className="font-black text-slate-900 text-sm">{record.country}</p>
              </div>

              <div className="w-40 shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoría</p>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border-2 shadow-sm ${TYPE_COLORS[record.type]}`}>
                  {TYPE_LABELS[record.type]}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Descripción del Factor</p>
                <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight leading-tight mb-2">{record.factor}</h4>
                <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                  Factor estratégico categorizado en {record.category} para la operación en {record.country}.
                </p>
              </div>

              <div className="w-32 text-center shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                  Impacto
                </p>
                <div className={`inline-flex px-4 py-1.5 rounded-xl font-black text-[10px] uppercase ${record.impact >= 4 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                  {record.impact} - {record.impact >= 4 ? 'Crítico' : record.impact >= 3 ? 'Importante' : 'Bajo'}
                </div>
              </div>

              <div className="w-32 shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Usuario</p>
                <p className="font-bold text-slate-600 text-xs italic">{record.user}</p>
              </div>

              <div className="shrink-0 flex gap-2">
                <button 
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm border-2 ${expandedId === record.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-sky-600 border-sky-50 hover:bg-sky-50'}`}
                >
                  <ClipboardListIcon size={16} />
                  {expandedId === record.id ? 'Cerrar Plan' : `Plan (${record.actions.length})`}
                </button>
                <button 
                  onClick={() => onDeleteRecord(record.id)}
                  className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>

            {/* Formulario de Plan de Acción (Lo que faltaba) */}
            {expandedId === record.id && (
              <div className="bg-slate-50 p-10 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500">
                <ActionManager 
                  record={record} 
                  onSave={(updated) => {
                    onUpdateRecord(updated);
                    // No cerramos automáticamente para que el usuario vea que se guardó
                  }} 
                  onClose={() => setExpandedId(null)}
                  getStatus={getActionStatus}
                />
              </div>
            )}
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">
            No se encontraron factores con los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};

const ActionManager: React.FC<{
  record: DofaRecord;
  onSave: (record: DofaRecord) => void;
  onClose: () => void;
  getStatus: (action: DofaAction) => ActionStatus;
}> = ({ record, onSave, onClose, getStatus }) => {
  const [localActions, setLocalActions] = useState<DofaAction[]>([...record.actions]);

  const addAction = () => {
    const newAction: DofaAction = {
      id: crypto.randomUUID(),
      text: '',
      responsible: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      effectivenessFollowUp: ''
    };
    setLocalActions([...localActions, newAction]);
  };

  const updateAction = (id: string, field: keyof DofaAction, value: string) => {
    setLocalActions(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAction = (id: string) => {
    setLocalActions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-50 pb-8">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <ClipboardListIcon size={28} />
           </div>
           <div>
             <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Gestión de Tareas y Estrategia</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Planes de mitigación para: <span className="text-sky-600">{record.factor}</span></p>
           </div>
        </div>
        <button 
          onClick={addAction} 
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-sky-400 rounded-2xl font-black uppercase text-xs italic tracking-widest shadow-xl hover:bg-black transition-all"
        >
          <PlusIcon size={18} /> Añadir Actividad
        </button>
      </div>

      <div className="space-y-6 mb-10">
        {localActions.length > 0 ? localActions.map((action, idx) => {
          const status = getStatus(action);
          return (
            <div key={action.id} className="group bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 hover:border-sky-300 transition-all relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-black text-sm shrink-0 shadow-md">{idx + 1}</div>
                    <div className="flex-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Descripción de la Actividad Operativa</label>
                      <textarea 
                        className="w-full bg-white border-2 border-slate-50 rounded-2xl p-4 focus:border-sky-500 outline-none font-bold text-slate-800 text-sm h-24 resize-none shadow-sm transition-all" 
                        placeholder="¿Qué acción específica se ejecutará?"
                        value={action.text} 
                        onChange={(e) => updateAction(action.id, 'text', e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14">
                     <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Líder Responsable</label>
                       <div className="relative">
                         <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="text" 
                           className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-50 rounded-xl focus:border-sky-500 outline-none text-xs font-black shadow-sm" 
                           value={action.responsible} 
                           onChange={(e) => updateAction(action.id, 'responsible', e.target.value)} 
                         />
                       </div>
                     </div>
                     <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fecha Límite</label>
                       <input 
                        type="date" 
                        className="w-full p-3 bg-white border-2 border-slate-50 rounded-xl focus:border-sky-500 outline-none text-[10px] font-black" 
                        value={action.endDate} 
                        onChange={(e) => updateAction(action.id, 'endDate', e.target.value)} 
                       />
                     </div>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                     <label className="text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircleIcon size={12} /> Seguimiento de Eficacia
                     </label>
                     <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${status === 'Cerrada' ? 'bg-emerald-500 text-white' : status === 'En proceso' ? 'bg-sky-500 text-white' : status === 'Retrasada' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>{status}</span>
                  </div>
                  <textarea 
                    className="flex-1 p-5 rounded-2xl border-2 border-slate-50 text-xs font-bold min-h-[140px] resize-none bg-white focus:border-sky-500 outline-none transition-all italic" 
                    placeholder="Evidencia de cierre y resultados..." 
                    value={action.effectivenessFollowUp} 
                    onChange={(e) => updateAction(action.id, 'effectivenessFollowUp', e.target.value)} 
                  />
                </div>
              </div>
              <button onClick={() => removeAction(action.id)} className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white border-2 border-slate-100 shadow-xl text-slate-300 hover:text-rose-500 hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <TrashIcon size={18} />
              </button>
            </div>
          );
        }) : (
          <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300">
             <ClipboardListIcon size={48} className="mb-4 opacity-10" />
             <p className="text-[10px] font-black uppercase tracking-widest">No hay actividades para este plan</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-6 pt-10 border-t border-slate-50">
        <button onClick={onClose} className="px-10 py-5 rounded-2xl font-black text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">Cancelar</button>
        <button 
          onClick={() => { onSave({ ...record, actions: localActions }); }} 
          className="px-14 py-5 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs italic tracking-widest flex items-center gap-4 hover:bg-black transition-all shadow-2xl"
        >
          <SaveIcon size={20} className="text-sky-400" /> Confirmar Cambios
        </button>
      </div>
    </div>
  );
};

export default ConsolidatedView;
