
import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  Download, 
  Trash2, 
  Filter, 
  BarChart4, 
  Target, 
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { IndicatorRecord } from '../types';

interface ConsolidatedIndicatorsViewProps {
  indicators: IndicatorRecord[];
  onDeleteIndicator: (id: string) => void;
}

const ConsolidatedIndicatorsView: React.FC<ConsolidatedIndicatorsViewProps> = ({ indicators, onDeleteIndicator }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('Todos');

  const filteredIndicators = useMemo(() => {
    return indicators.filter(i => {
      const matchesType = typeFilter === 'Todos' || i.type === typeFilter;
      const searchStr = `${i.name} ${i.processName} ${i.formula}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [indicators, searchTerm, typeFilter]);

  const exportToExcel = () => {
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

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-2 underline decoration-emerald-500 decoration-8 underline-offset-8">Consolidado de Indicadores</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-6 flex items-center gap-2">
            <BarChart4 size={12} className="text-emerald-500" /> Monitoreo de Desempeño HSEQ por Proceso
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar indicador o proceso..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-xs shadow-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-11 pr-10 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 outline-none font-bold text-[10px] uppercase shadow-sm bg-white appearance-none cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="Todos">Todos los Tipos</option>
              <option value="Estratégico">Estratégico</option>
              <option value="Táctico">Táctico</option>
              <option value="Operativo">Operativo</option>
            </select>
          </div>
          <button 
            onClick={exportToExcel}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-emerald-400 rounded-2xl font-black uppercase text-xs italic tracking-widest shadow-xl hover:bg-black transition-all"
          >
            <FileSpreadsheet size={18} /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Fecha</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Proceso</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Tipo</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800">Nombre del Indicador</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-800 text-center">Meta</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIndicators.map(indicator => (
                <tr key={indicator.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-7 whitespace-nowrap text-xs font-bold text-slate-400 tabular-nums">
                    {new Date(indicator.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-7">
                    <p className="font-black text-slate-900 text-sm uppercase tracking-tight leading-tight">{indicator.processName}</p>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm
                      ${indicator.type === 'Estratégico' ? 'bg-sky-500 text-white' : 
                        indicator.type === 'Táctico' ? 'bg-emerald-500 text-white' : 
                        'bg-amber-500 text-white'}`}>
                      {indicator.type}
                    </span>
                  </td>
                  <td className="px-8 py-7">
                    <p className="font-black text-slate-800 text-sm italic">{indicator.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 leading-tight">Fórmula: {indicator.formula}</p>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <div className="inline-block px-5 py-2 bg-slate-800 rounded-xl text-white text-xs font-black shadow-md uppercase tracking-wider">
                      {indicator.goal}
                    </div>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <button 
                      onClick={() => onDeleteIndicator(indicator.id)}
                      className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      title="Eliminar Indicador"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredIndicators.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <Target size={48} className="mb-4 opacity-10" />
                      <p className="font-black uppercase text-[10px] tracking-[0.3em]">No se encontraron indicadores</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedIndicatorsView;
