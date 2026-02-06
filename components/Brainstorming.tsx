
import React, { useState, useMemo } from 'react';
import { Save, CheckCircle, Info, User, Anchor } from 'lucide-react';
import { COUNTRIES, PREDEFINED_FACTORS, TYPE_LABELS, TYPE_COLORS, IMPACT_LABELS } from '../constants';
import { DofaType, DofaRecord } from '../types';

interface BrainstormingProps {
  onAddRecord: (record: DofaRecord) => void;
}

const Brainstorming: React.FC<BrainstormingProps> = ({ onAddRecord }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].name);
  const [selectedType, setSelectedType] = useState<DofaType>('F');
  const [selectedFactorId, setSelectedFactorId] = useState('');
  const [impact, setImpact] = useState(3);
  const [usuario, setUsuario] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredFactors = useMemo(() => {
    return PREDEFINED_FACTORS.filter(f => f.type === selectedType);
  }, [selectedType]);

  const currentFactor = useMemo(() => {
    return PREDEFINED_FACTORS.find(f => f.id === selectedFactorId);
  }, [selectedFactorId]);

  const handleSave = () => {
    if (!selectedFactorId || !currentFactor || !usuario) return;

    const record: DofaRecord = {
      id: crypto.randomUUID(),
      country: selectedCountry,
      type: selectedType,
      factor: currentFactor.factor,
      description: currentFactor.description,
      impact: impact,
      user: usuario,
      timestamp: Date.now(),
      actions: []
    };

    onAddRecord(record);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setSelectedFactorId('');
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-900/20 rotate-3">
             <Anchor className="text-sky-400" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Lluvia de Ideas</h2>
            <p className="text-slate-500 font-medium tracking-tight">Registro de factores estratégicos - SAAMTOWAGE.</p>
          </div>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-200 animate-in slide-in-from-right-10 duration-500 font-bold shadow-sm shadow-emerald-100">
            <CheckCircle size={20} />
            <span>¡Registro guardado correctamente!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">1</div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Identificación</h3>
             </div>

             <div className="relative">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Usuario / Analista</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text"
                    placeholder="Ingrese su nombre de usuario..."
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/5 outline-none font-bold text-slate-700 transition-all"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">2</div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Clasificación Estratégica</h3>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">País</label>
                <select 
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-5 px-6 focus:border-sky-500 focus:bg-white outline-none font-bold text-slate-700 transition-all cursor-pointer"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tipo (DOFA)</label>
                <div className="flex p-1.5 bg-slate-100 rounded-[1.2rem] h-full items-center">
                  {(Object.keys(TYPE_LABELS) as DofaType[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedType(key);
                        setSelectedFactorId('');
                      }}
                      className={`
                        flex-1 py-3 text-sm font-black rounded-[0.9rem] transition-all duration-300
                        ${selectedType === key 
                          ? 'bg-white text-sky-600 shadow-xl shadow-slate-200' 
                          : 'text-slate-400 hover:text-slate-600'}
                      `}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Selección de Factor</label>
                <select 
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-5 px-6 focus:border-sky-500 focus:bg-white outline-none font-bold text-slate-700 transition-all cursor-pointer"
                  value={selectedFactorId}
                  onChange={(e) => setSelectedFactorId(e.target.value)}
                >
                  <option value="">Seleccione el factor de la base de datos...</option>
                  {filteredFactors.map(f => (
                    <option key={f.id} value={f.id}>{f.factor}</option>
                  ))}
                </select>
              </div>

              {currentFactor && (
                <div className={`p-6 rounded-[1.8rem] border-2 ${TYPE_COLORS[selectedType]} flex gap-4 animate-in slide-in-from-top-4 duration-500 shadow-sm`}>
                  <Info className="shrink-0 mt-1 opacity-70" size={24} />
                  <div>
                    <p className="text-[10px] font-black uppercase mb-1 opacity-60 tracking-wider">Contexto:</p>
                    <p className="text-sm font-semibold leading-relaxed">{currentFactor.description}</p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Impacto</label>
                  <div className={`px-4 py-1.5 rounded-xl font-black text-sm uppercase transition-all duration-500 shadow-sm ${impact >= 4 ? 'bg-red-500 text-white' : impact === 3 ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}>
                    {IMPACT_LABELS[impact]} ({impact})
                  </div>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  value={impact}
                  onChange={(e) => setImpact(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-100 rounded-2xl appearance-none cursor-pointer accent-slate-900 hover:accent-sky-600 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-900/40 sticky top-10 border border-slate-800">
            <h3 className="text-2xl font-black mb-8 tracking-tighter text-sky-400">Resumen Registro</h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">Usuario</p>
                <p className="font-bold text-lg text-slate-100 truncate">{usuario || '---'}</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">Factor</p>
                <p className="font-bold text-lg text-slate-100 truncate">{currentFactor?.factor || '---'}</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!selectedFactorId || !usuario}
              className={`
                w-full mt-12 py-6 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm transition-all duration-300
                ${(selectedFactorId && usuario) 
                  ? 'bg-sky-500 text-slate-900 hover:bg-white hover:scale-[1.03] shadow-2xl active:scale-95' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
              `}
            >
              <Save size={24} />
              Guardar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brainstorming;
