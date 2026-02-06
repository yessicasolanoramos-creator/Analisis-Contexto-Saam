
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
// Added ShieldCheck to the imports
import { Users, FileText, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { DofaRecord } from '../types';
import { TYPE_LABELS } from '../constants';

interface DashboardProps {
  records: DofaRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  // Stats
  const stats = useMemo(() => {
    const total = records.length;
    const critical = records.filter(r => r.impact >= 4).length;
    const countries = new Set(records.map(r => r.country)).size;
    const avgImpact = total > 0 
      ? (records.reduce((acc, curr) => acc + curr.impact, 0) / total).toFixed(1) 
      : 0;

    return [
      { label: 'Total Registros', value: total, icon: FileText, color: 'bg-blue-500' },
      { label: 'Países Activos', value: countries, icon: Users, color: 'bg-indigo-500' },
      { label: 'Promedio Impacto', value: avgImpact, icon: TrendingUp, color: 'bg-emerald-500' },
      { label: 'Nivel Crítico (4-5)', value: critical, icon: AlertCircle, color: 'bg-rose-500' },
    ];
  }, [records]);

  // Data for Category Distribution (Pie Chart)
  const categoryData = useMemo(() => {
    const counts = { F: 0, O: 0, D: 0, A: 0 };
    records.forEach(r => counts[r.type]++);
    return [
      { name: 'Fortalezas', value: counts.F, color: '#10b981' },
      { name: 'Oportunidades', value: counts.O, color: '#3b82f6' },
      { name: 'Debilidades', value: counts.D, color: '#f59e0b' },
      { name: 'Amenazas', value: counts.A, color: '#ef4444' },
    ];
  }, [records]);

  // Data for Country vs Type (Stacked Bar Chart)
  const countryTypeData = useMemo(() => {
    const countries = Array.from(new Set(records.map(r => r.country)));
    return countries.map(country => {
      const countryRecords = records.filter(r => r.country === country);
      return {
        name: country,
        Fortalezas: countryRecords.filter(r => r.type === 'F').length,
        Oportunidades: countryRecords.filter(r => r.type === 'O').length,
        Debilidades: countryRecords.filter(r => r.type === 'D').length,
        Amenazas: countryRecords.filter(r => r.type === 'A').length,
      };
    });
  }, [records]);

  // Data for Average Impact by Category (Radar Chart)
  const avgImpactData = useMemo(() => {
    const sums = { F: 0, O: 0, D: 0, A: 0 };
    const counts = { F: 0, O: 0, D: 0, A: 0 };
    records.forEach(r => {
      sums[r.type] += r.impact;
      counts[r.type]++;
    });
    return [
      { subject: 'Fortalezas', A: counts.F > 0 ? sums.F / counts.F : 0, fullMark: 5 },
      { subject: 'Oportunidades', A: counts.O > 0 ? sums.O / counts.O : 0, fullMark: 5 },
      { subject: 'Debilidades', A: counts.D > 0 ? sums.D / counts.D : 0, fullMark: 5 },
      { subject: 'Amenazas', A: counts.A > 0 ? sums.A / counts.A : 0, fullMark: 5 },
    ];
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8">
          <TrendingUp size={48} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">¡Bienvenido a DOFA Global!</h2>
        <p className="text-slate-500 max-w-lg mb-8">
          Aún no hay datos suficientes para generar un tablero de control. Comienza agregando algunos registros en el módulo de <strong>Lluvia de Ideas</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Directivo</h2>
          <p className="text-slate-500">Métricas clave y análisis de contexto en tiempo real.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`${stat.color} p-4 rounded-2xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución por Categoría */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Distribución F-O-D-A General
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Factores por País */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Análisis Comparativo por País
          </h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend />
                <Bar dataKey="Fortalezas" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={40} />
                <Bar dataKey="Oportunidades" stackId="a" fill="#3b82f6" />
                <Bar dataKey="Debilidades" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Amenazas" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impacto Promedio */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Nivel de Impacto Promedio</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={avgImpactData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 12, fontWeight: 500}} />
                <Radar
                  name="Impacto"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elementos Críticos */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200 h-[450px] flex flex-col text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            Top Factores Críticos (Impacto 5)
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded uppercase">Urgente</span>
          </h3>
          <div className="flex-1 overflow-auto space-y-4 pr-2 custom-scrollbar">
            {records.filter(r => r.impact === 5).length > 0 ? (
              records.filter(r => r.impact === 5).map(r => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{r.country}</span>
                    <span className="text-[10px] font-medium text-slate-500">{new Date(r.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="font-bold text-slate-100">{r.factor}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{r.description}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShieldCheck size={48} className="text-slate-700 mb-4" />
                <p className="text-slate-500 text-sm">No hay factores con impacto crítico nivel 5 registrados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
