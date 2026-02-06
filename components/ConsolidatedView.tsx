
import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Globe, Tag, User, TrendingUp } from 'lucide-react';
import { DofaRecord, DofaType } from '../types';
import { TYPE_LABELS, TYPE_COLORS, IMPACT_LABELS } from '../constants';

interface ConsolidatedViewProps {
  records: DofaRecord[];
}

const ConsolidatedView: React.FC<ConsolidatedViewProps> = ({ records }) => {
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterType, setFilterType] = useState<DofaType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const countries = useMemo(() => {
    return Array.from(new Set(records.map(r => r.country))).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchCountry = filterCountry === 'All' || r.country === filterCountry;
      const matchType = filterType === 'All' || r.type === filterType;
      const matchSearch = r.factor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCountry && matchType && matchSearch;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [records, filterCountry, filterType, searchTerm]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Análisis Consolidado</h2>
          <p className="text-slate-500">Historial completo de factores registrados.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar factores o descripciones..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none cursor-pointer"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
              >
                <option value="All">Todos los Países</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="All">Todas las Categorías</option>
                <option value="F">Fortalezas</option>
                <option value="O">Oportunidades</option>
                <option value="D">Debilidades</option>
                <option value="A">Amenazas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRecords.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"><div className="flex items-center gap-2"><Calendar size={14}/> Fecha</div></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"><div className="flex items-center gap-2"><Globe size={14}/> País</div></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"><div className="flex items-center gap-2"><Tag size={14}/> Categoría</div></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción del Factor</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"><div className="flex items-center justify-center gap-2"><TrendingUp size={14}/> Impacto</div></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"><div className="flex items-center gap-2"><User size={14}/> Usuario</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-6 whitespace-nowrap text-sm text-slate-600">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6 font-bold text-slate-900">
                      {record.country}
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${TYPE_COLORS[record.type]}`}>
                        {TYPE_LABELS[record.type]}
                      </span>
                    </td>
                    <td className="px-6 py-6 max-w-md">
                      <div className="font-bold text-slate-800 mb-1">{record.factor}</div>
                      <p className="text-xs text-slate-500 leading-relaxed">{record.description}</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`
                        px-2 py-1 rounded-lg text-xs font-black
                        ${record.impact >= 4 ? 'bg-red-50 text-red-600' : record.impact >= 3 ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}
                      `}>
                        {record.impact} - {IMPACT_LABELS[record.impact]}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-slate-700">
                      {record.user}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center text-slate-400">
              No se encontraron registros que coincidan con los filtros.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedView;
