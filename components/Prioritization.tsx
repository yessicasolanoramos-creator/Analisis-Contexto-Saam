
import React, { useState, useMemo } from 'react';
import { 
  Rocket, Plus, Trash2, Calendar, User, 
  ArrowRight, Save, Globe, ChevronUp,
  FileEdit, CheckCircle2, Database, Trash, ClipboardList
} from 'lucide-react';
import { DofaRecord, DofaAction } from '../types';
import { TYPE_LABELS, TYPE_COLORS, IMPACT_LABELS } from '../constants';

interface PrioritizationProps {
  records: DofaRecord[];
  onUpdateRecord: (record: DofaRecord) => void;
}

const Prioritization: React.FC<PrioritizationProps> = ({ records, onUpdateRecord }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const prioritizedRecords = useMemo(() => {
    return records.filter(r => r.impact >= 3).sort((a, b) => b.impact - a.impact);
  }, [records]);

  const handleUpdate = (record: DofaRecord) => {
    onUpdateRecord(record);
    setEditingId(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 text-sky-400 rounded-lg shadow-lg">
              <Database size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Priorización DOFA</h2>
          </div>
          <p className="text-slate-500 font-medium ml-12 italic">Base de Datos Consolidada - SAAMTOWAGE Towage Operations.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temas Críticos</p>
            <p className="text-2xl font-black text-sky-600 leading-none">{prioritizedRecords.length}</p>
          </div>
          <div className="w-px h-10 bg-slate-100 mx-1"></div>
          <Rocket className="text-sky-600" size={32} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Fecha</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">País</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Categoría</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Factor / Descripción</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800 text-center">Impacto</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Usuario</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Gestión Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prioritizedRecords.map(record => (
                <React.Fragment key={record.id}>
                  <tr className={`hover:bg-slate-50 transition-all ${editingId === record.id ? 'bg-sky-50/20' : ''}`}>
                    <td className="px-6 py-6 whitespace-nowrap text-xs font-bold text-slate-500 tabular-nums">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6 font-black text-slate-900 text-sm">
                      <div className="flex items-center gap-2"><Globe size={14} className="text-sky-500" />{record.country}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 shadow-sm ${TYPE_COLORS[record.type]}`}>
                        {TYPE_LABELS[record.type]}
                      </span>
                    </td>
                    <td className="px-6 py-6 min-w-[320px]">
                      <p className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">{record.factor}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium italic">{record.description}</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg ${record.impact >= 4 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {record.impact}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase text-slate-600">
                        <div className="w-7 h-7 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">{record.user.charAt(0).toUpperCase()}</div>
                        {record.user}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button 
                        onClick={() => setEditingId(editingId === record.id ? null : record.id)}
                        className={`p-3 rounded-xl transition-all shadow-md ${editingId === record.id ? 'bg-slate-900 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
                      >
                        {editingId === record.id ? <ChevronUp size={20} /> : <FileEdit size={20} />}
                      </button>
                    </td>
                  </tr>
                  {editingId === record.id && (
                    <tr className="bg-sky-50/10">
                      <td colSpan={7} className="px-8 py-10 border-l-4 border-sky-500">
                        <ActionManager 
                          record={record} 
                          onSave={handleUpdate} 
                          onCancel={() => setEditingId(null)} 
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ActionManager: React.FC<{
  record: DofaRecord;
  onSave: (record: DofaRecord) => void;
  onCancel: () => void;
}> = ({ record, onSave, onCancel }) => {
  const [localActions, setLocalActions] = useState<DofaAction[]>([...record.actions]);

  const addAction = () => {
    setLocalActions([...localActions, {
      id: crypto.randomUUID(),
      text: '',
      responsible: '',
      startDate: '',
      endDate: '',
      effectivenessFollowUp: ''
    }]);
  };

  const updateAction = (id: string, field: keyof DofaAction, value: string) => {
    setLocalActions(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAction = (id: string) => {
    setLocalActions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl animate-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-8 pb-4 border-b">
        <div className="flex items-center gap-3">
           <ClipboardList className="text-sky-600" size={24} />
           <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Plan de Gestión</h4>
        </div>
        <button onClick={addAction} className="bg-slate-900 text-sky-400 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg">
          <Plus size={18} /> Nueva Acción
        </button>
      </div>

      <div className="space-y-6">
        {localActions.length > 0 ? (
          localActions.map((action, idx) => (
            <div key={action.id} className="group relative bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 hover:border-sky-200 transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Info Principal */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center font-black text-xs">{idx + 1}</span>
                    <input 
                      type="text"
                      className="flex-1 bg-transparent border-b-2 border-slate-200 focus:border-sky-500 outline-none py-1 font-black text-slate-800 placeholder:text-slate-300"
                      placeholder="¿Qué acción se va a realizar?"
                      value={action.text}
                      onChange={(e) => updateAction(action.id, 'text', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Responsable / Cargo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none"
                          value={action.responsible}
                          onChange={(e) => updateAction(action.id, 'responsible', e.target.value)}
                          placeholder="Líder de la acción"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Plazo de Ejecución</label>
                      <div className="flex items-center gap-2">
                        <input type="date" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold" value={action.startDate} onChange={(e) => updateAction(action.id, 'startDate', e.target.value)} />
                        <ArrowRight size={14} className="text-slate-300" />
                        <input type="date" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold" value={action.endDate} onChange={(e) => updateAction(action.id, 'endDate', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seguimiento */}
                <div className="lg:w-1/3 space-y-2">
                  <label className="text-[10px] font-black text-sky-600 uppercase tracking-widest ml-1">Seguimiento de Eficacia</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-3 text-sky-500" size={16} />
                    <textarea 
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium h-24 resize-none bg-white focus:ring-2 focus:ring-sky-500 outline-none leading-relaxed"
                      placeholder="Describa el resultado del seguimiento y cumplimiento de KPIs..."
                      value={action.effectivenessFollowUp}
                      onChange={(e) => updateAction(action.id, 'effectivenessFollowUp', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeAction(action.id)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border shadow-md text-slate-300 hover:text-red-500 hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <Trash size={16} />
              </button>
            </div>
          )
        ) : (
          <div className="py-12 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 italic text-sm">
             <ClipboardList size={40} className="mb-2 opacity-10" />
             No hay acciones registradas para este factor.
          </div>
        )}
      </div>

      <div className="mt-10 pt-8 border-t flex justify-end gap-4">
        <button onClick={onCancel} className="px-6 py-3 rounded-2xl font-black text-slate-400 uppercase text-xs tracking-widest hover:bg-slate-50">Cancelar</button>
        <button 
          onClick={() => onSave({ ...record, actions: localActions })}
          className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-sm italic tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
        >
          <Save size={20} className="text-sky-400" /> Guardar Estrategia
        </button>
      </div>
    </div>
  );
};

export default Prioritization;
