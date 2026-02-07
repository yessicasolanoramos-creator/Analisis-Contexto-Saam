
import React, { useMemo, useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Calendar, 
  User, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Flag
} from 'lucide-react';
import { DofaRecord, DofaAction, ActionStatus } from '../types';

interface TasksViewProps {
  records: DofaRecord[];
  onUpdateRecord: (record: DofaRecord) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todas');

  const allTasks = useMemo(() => {
    const tasks: any[] = [];
    records.forEach(record => {
      record.actions.forEach(action => {
        const getStatus = (a: DofaAction): ActionStatus => {
          if (a.effectivenessFollowUp && a.effectivenessFollowUp.trim().length > 0) return 'Cerrada';
          if (!a.startDate || !a.endDate) return 'Abierta';
          const now = new Date();
          const end = new Date(a.endDate);
          if (now > end) return 'Retrasada';
          return 'En proceso';
        };

        tasks.push({
          ...action,
          status: getStatus(action),
          parentFactor: record.factor,
          parentCountry: record.country,
          parentAxis: record.axis,
          parentRecordId: record.id
        });
      });
    });
    return tasks;
  }, [records]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter(t => {
      const matchesStatus = statusFilter === 'Todas' || t.status === statusFilter;
      const searchStr = `${t.text} ${t.responsible} ${t.parentFactor} ${t.parentCountry}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    }).sort((a, b) => {
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });
  }, [allTasks, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: allTasks.length,
    closed: allTasks.filter(t => t.status === 'Cerrada').length,
    delayed: allTasks.filter(t => t.status === 'Retrasada').length,
    process: allTasks.filter(t => t.status === 'En proceso').length
  }), [allTasks]);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-slate-200 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Operational Tracking</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">SEGUIMIENTO DE TAREAS</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center gap-2 text-emerald-600">
            <CheckSquare size={14} /> Control de Compromisos Regionales
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Total', val: stats.total, color: 'text-slate-900', bg: 'bg-slate-100' },
             { label: 'Cerradas', val: stats.closed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'En Proceso', val: stats.process, color: 'text-sky-600', bg: 'bg-sky-50' },
             { label: 'Retrasadas', val: stats.delayed, color: 'text-rose-600', bg: 'bg-rose-50' }
           ].map((s, idx) => (
             <div key={idx} className={`${s.bg} p-4 rounded-2xl border border-white/10 text-center min-w-[100px]`}>
               <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">{s.label}</p>
               <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por actividad, responsable o factor..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-xs shadow-sm bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full lg:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            className="w-full pl-11 pr-10 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-[10px] uppercase shadow-sm bg-white appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todas">Todos los Estados</option>
            <option value="Abierta">Abierta</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrada">Cerrada</option>
            <option value="Retrasada">Retrasada</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 group transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
                {task.status === 'Cerrada' ? <CheckCircle2 size={24} /> : task.status === 'Retrasada' ? <AlertCircle size={24} /> : <Clock size={24} />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{task.parentCountry}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{task.parentAxis}</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm uppercase leading-tight mb-2">{task.text || 'Sin descripción de actividad'}</h4>
                <p className="text-[10px] text-slate-400 font-bold italic">Factor Relacionado: {task.parentFactor}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 shrink-0">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Responsable</span>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-800 uppercase">{task.responsible || 'No asignado'}</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Plazo</span>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-sky-500" />
                    <span className={`text-[10px] font-black tabular-nums ${task.status === 'Retrasada' ? 'text-rose-500' : 'text-slate-800'}`}>
                      {task.endDate ? new Date(task.endDate).toLocaleDateString() : 'Sin fecha'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center col-span-2 md:col-span-1">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm
                    ${task.status === 'Cerrada' ? 'bg-emerald-500 text-white' : 
                      task.status === 'En proceso' ? 'bg-sky-500 text-white' : 
                      task.status === 'Retrasada' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
            
            {task.effectivenessFollowUp && (
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-start gap-3">
                 <Flag size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Resultado de Eficacia (Consolidado)</p>
                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">{task.effectivenessFollowUp}</p>
                 </div>
              </div>
            )}
          </div>
        )) : (
          <div className="py-32 flex flex-col items-center justify-center border-4 border-dashed rounded-[3rem] border-slate-100 text-slate-300 font-black uppercase text-[10px] tracking-widest">
            <CheckSquare size={48} className="mb-4 opacity-10" />
            No se encontraron tareas registradas
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
