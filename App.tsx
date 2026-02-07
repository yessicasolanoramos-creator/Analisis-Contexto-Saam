
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  TableProperties, 
  Anchor,
  Menu,
  X,
  Settings,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  BarChart4,
  ClipboardList,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { DofaRecord, IndicatorRecord } from './types';
import Brainstorming from './components/Brainstorming';
import ConsolidatedView from './components/ConsolidatedView';
import Dashboard from './components/Dashboard';
import Configuration from './components/Settings';
import TasksView from './components/TasksView';
import IndicatorsView from './components/IndicatorsView';
import ConsolidatedIndicatorsView from './components/ConsolidatedIndicatorsView';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'brainstorming' | 'consolidated' | 'dashboard' | 'settings' | 'tasks' | 'indicators' | 'consolidated_indicators'>('dashboard');
  const [records, setRecords] = useState<DofaRecord[]>([]);
  const [indicators, setIndicators] = useState<IndicatorRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchFromCloud = useCallback(async () => {
    const url = localStorage.getItem('sb_url');
    const key = localStorage.getItem('sb_key');
    const table = localStorage.getItem('sb_table') || 'dofa_records';

    if (!url || !key) {
      setIsCloudEnabled(false);
      return;
    }

    setIsCloudEnabled(true);
    setIsSyncing(true);
    
    try {
      const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      if (response.ok) {
        const cloudData = await response.json();
        if (cloudData && Array.isArray(cloudData)) {
          // Combinar datos locales con los de la nube (preferir los de la nube si hay conflicto)
          setRecords(cloudData);
          localStorage.setItem('dofa_records', JSON.stringify(cloudData));
        }
      }
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial local
    const savedRecords = localStorage.getItem('dofa_records');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        console.error("Error loading records", e);
      }
    }

    const savedIndicators = localStorage.getItem('saam_indicators');
    if (savedIndicators) {
      try {
        setIndicators(JSON.parse(savedIndicators));
      } catch (e) {
        console.error("Error loading indicators", e);
      }
    }

    // Intentar carga desde la nube
    fetchFromCloud();

    // Polling opcional cada 60 segundos para mantener datos frescos de otros usuarios
    const interval = setInterval(fetchFromCloud, 60000);
    return () => clearInterval(interval);
  }, [fetchFromCloud]);

  useEffect(() => {
    localStorage.setItem('dofa_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('saam_indicators', JSON.stringify(indicators));
  }, [indicators]);

  const addRecord = (newRecord: DofaRecord) => {
    setRecords(prev => [...prev, newRecord]);
    // Si la nube está activa, intentar subir inmediatamente
    syncToCloud([...records, newRecord]);
  };

  const updateRecord = (updatedRecord: DofaRecord) => {
    const newRecords = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    setRecords(newRecords);
    syncToCloud(newRecords);
  };

  const deleteRecord = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      const newRecords = records.filter(r => r.id !== id);
      setRecords(newRecords);
      // Opcional: Implementar delete en supabase o re-subir todo
      syncToCloud(newRecords);
    }
  };

  const syncToCloud = async (dataToSync: DofaRecord[]) => {
    const url = localStorage.getItem('sb_url');
    const key = localStorage.getItem('sb_key');
    const table = localStorage.getItem('sb_table') || 'dofa_records';
    
    if (!url || !key) return;

    try {
      await fetch(`${url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(dataToSync)
      });
    } catch (e) {
      console.error("Background sync failed", e);
    }
  };

  const addIndicator = (newIndicator: IndicatorRecord) => {
    setIndicators(prev => [...prev, newIndicator]);
  };

  const deleteIndicator = (id: string) => {
    if (window.confirm('¿Desea eliminar este indicador?')) {
      setIndicators(prev => prev.filter(i => i.id !== id));
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Estratégico', icon: LayoutDashboard },
    { id: 'brainstorming', label: 'Lluvia de Ideas', icon: BrainCircuit },
    { id: 'consolidated', label: 'Análisis Consolidado', icon: TableProperties },
    { id: 'tasks', label: 'Seguimiento de Tareas', icon: CheckSquare },
    { id: 'indicators', label: 'Mapa de Procesos', icon: BarChart4 },
    { id: 'consolidated_indicators', label: 'Consolidado Indicadores', icon: ClipboardList },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`hidden md:flex fixed top-10 z-50 bg-slate-900 text-sky-400 p-2 rounded-full shadow-2xl border border-slate-700 hover:bg-black transition-all duration-500 ${isSidebarOpen ? 'left-[270px]' : 'left-6'}`}
      >
        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-900 text-white rounded-md shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-0 md:w-0'} fixed md:static inset-y-0 left-0 z-40 bg-slate-900 text-white transition-all duration-500 flex flex-col shadow-2xl overflow-hidden`}>
        <div className="p-8 border-b border-slate-800 flex flex-col gap-2 min-w-[280px]">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 p-2 rounded-lg shadow-lg">
              <Anchor className="text-white" size={24} />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">SAAMTOWAGE</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-11">Análisis de Contexto</p>
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2 min-w-[280px]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as any);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeModule === item.id ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Indicador de Nube */}
        <div className="p-6 border-t border-slate-800 min-w-[280px]">
          <div className={`flex items-center justify-between p-4 rounded-2xl ${isCloudEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
            <div className="flex items-center gap-3">
              {isCloudEnabled ? <Cloud size={18} /> : <CloudOff size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isCloudEnabled ? 'Cloud Conectado' : 'Modo Local'}
              </span>
            </div>
            {isCloudEnabled && (
              <button 
                onClick={fetchFromCloud}
                disabled={isSyncing}
                className={`${isSyncing ? 'animate-spin' : ''} hover:text-white transition-colors`}
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <main className={`flex-1 p-4 md:p-8 lg:p-12 overflow-auto transition-all ${!isSidebarOpen ? 'md:pl-20' : ''}`}>
        <div className="max-w-[1600px] mx-auto">
          {activeModule === 'dashboard' && <Dashboard records={records} />}
          {activeModule === 'brainstorming' && <Brainstorming onAddRecord={addRecord} />}
          {activeModule === 'consolidated' && <ConsolidatedView records={records} onUpdateRecord={updateRecord} onDeleteRecord={deleteRecord} />}
          {activeModule === 'tasks' && <TasksView records={records} onUpdateRecord={updateRecord} />}
          {activeModule === 'indicators' && <IndicatorsView indicators={indicators} onAddIndicator={addIndicator} onDeleteIndicator={deleteIndicator} />}
          {activeModule === 'consolidated_indicators' && <ConsolidatedIndicatorsView indicators={indicators} onDeleteIndicator={deleteIndicator} />}
          {activeModule === 'settings' && <Configuration records={records} indicators={indicators} onRefreshCloud={fetchFromCloud} />}
        </div>
      </main>
    </div>
  );
};

export default App;
