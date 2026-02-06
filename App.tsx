
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  TableProperties, 
  ListFilter, 
  Anchor,
  Menu,
  X
} from 'lucide-react';
import { DofaRecord } from './types';
import Brainstorming from './components/Brainstorming';
import ConsolidatedView from './components/ConsolidatedView';
import Prioritization from './components/Prioritization';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'brainstorming' | 'consolidated' | 'prioritization' | 'dashboard'>('dashboard');
  const [records, setRecords] = useState<DofaRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('dofa_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading records", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dofa_records', JSON.stringify(records));
  }, [records]);

  const addRecord = (newRecord: DofaRecord) => {
    setRecords(prev => [...prev, newRecord]);
  };

  const updateRecord = (updatedRecord: DofaRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'brainstorming', label: 'Lluvia de Ideas', icon: BrainCircuit },
    { id: 'consolidated', label: 'Análisis Consolidado', icon: TableProperties },
    { id: 'prioritization', label: 'Priorización DOFA', icon: ListFilter },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-40
        w-72 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        flex flex-col shadow-2xl
      `}>
        <div className="p-8 border-b border-slate-800 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 p-2 rounded-lg shadow-lg shadow-sky-900/20">
              <Anchor className="text-white" size={24} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">SAAMTOWAGE</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-11">Contexto Estratégico</p>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as any);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                ${activeModule === item.id 
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} className={activeModule === item.id ? 'animate-pulse' : ''} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center font-black text-white shadow-inner">
              ST
            </div>
            <div>
              <p className="text-xs font-black text-slate-100 uppercase tracking-wider">Analista Senior</p>
              <p className="text-[10px] text-sky-400 font-bold">Panel de Control</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          {activeModule === 'dashboard' && <Dashboard records={records} />}
          {activeModule === 'brainstorming' && (
            <Brainstorming onAddRecord={addRecord} />
          )}
          {activeModule === 'consolidated' && (
            <ConsolidatedView records={records} />
          )}
          {activeModule === 'prioritization' && (
            <Prioritization records={records} onUpdateRecord={updateRecord} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
