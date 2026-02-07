
import React, { useState, useMemo } from 'react';
import { Save, CheckCircle, User, Anchor, Globe, Info, AlertTriangle, Zap, MessageSquareQuote } from 'lucide-react';
import { COUNTRIES, AXES, CATEGORIES, FACTOR_TEMPLATES, TYPE_LABELS } from '../constants';
import { DofaType, DofaRecord } from '../types';

interface BrainstormingProps {
  onAddRecord: (record: DofaRecord) => void;
}

const IMPACT_CRITERIA_SHORT = [
  { level: 1, label: 'Bajo' },
  { level: 2, label: 'Relevante' },
  { level: 3, label: 'Importante' },
  { level: 4, label: 'Muy Importante' },
  { level: 5, label: 'Crítico' }
];

const Brainstorming: React.FC<BrainstormingProps> = ({ onAddRecord }) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0].name);
  const [selectedAxis, setSelectedAxis] = useState(AXES[0]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedType, setSelectedType] = useState<DofaType>('F');
  const [selectedFactor, setSelectedFactor] = useState('');
  const [customFactor, setCustomFactor] = useState('');
  const [justification, setJustification] = useState('');
  const [impact, setImpact] = useState(3);
  const [usuario, setUsuario] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const suggestedFactors = useMemo(() => {
    return FACTOR_TEMPLATES[selectedAxis]?.[selectedCategory] || [];
  }, [selectedAxis, selectedCategory]);

  const handleSave = () => {
    if (!usuario) return;
    const finalFactor = selectedFactor === 'Otro' ? customFactor : selectedFactor;
    if (!finalFactor || !justification) return;

    const record: DofaRecord = {
      id: crypto.randomUUID(),
      country: selectedCountry,
      axis: selectedAxis,
      category: selectedCategory,
      type: selectedType,
      factor: finalFactor,
      description: `Factor estratégico categorizado en ${selectedCategory} para la operación en ${selectedCountry}.`,
      justification: justification,
      impact: impact,
      user: usuario,
      timestamp: Date.now(),
      actions: []
    };

    onAddRecord(record);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setSelectedFactor('');
    setCustomFactor('');
    setJustification('');
  };

  const isFormValid = useMemo(() => {
    const hasUser = usuario.trim().length > 0;
    const hasFactor = selectedFactor === 'Otro' ? customFactor.trim().length > 0 : selectedFactor !== '';
    const hasJustification = justification.trim().length > 0;
    return hasUser && hasFactor && hasJustification;
  }, [usuario, selectedFactor, customFactor, justification]);

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl">
             <Anchor className="text-sky-400" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Registro de Inteligencia</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <Globe size={14} className="text-sky-500" /> Captura de Factores Críticos Regionales
            </p>
          </div>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl animate-in slide-in-from-top-4 font-black text-xs uppercase shadow-xl">
            <CheckCircle size={20} />
            Registro Completado
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
               <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
               Origen del Factor
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Responsable</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" placeholder="Su nombre..."
                      className="w-full pl-11 pr-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 focus:bg-white outline-none font-bold text-sm transition-all"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                    />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">País</label>
                 <select 
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 focus:bg-white outline-none font-bold text-sm appearance-none cursor-pointer"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                 >
                   {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                 </select>
               </div>
             </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
               <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
               Clasificación Estratégica
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Eje Corporativo</label>
                  <select className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-4 px-5 focus:border-sky-500 focus:bg-white outline-none font-bold text-sm" value={selectedAxis} onChange={(e) => setSelectedAxis(e.target.value)}>
                    {AXES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría Operativa</label>
                  <select className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-4 px-5 focus:border-sky-500 focus:bg-white outline-none font-bold text-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
             </div>

             <div className="space-y-8">
               <div className="flex gap-4 p-1 bg-slate-100 rounded-3xl h-[64px]">
                 {(Object.keys(TYPE_LABELS) as DofaType[]).map((key) => (
                   <button
                     key={key}
                     onClick={() => setSelectedType(key)}
                     className={`flex-1 text-[11px] font-black rounded-2xl transition-all uppercase tracking-widest ${selectedType === key ? 'bg-white text-sky-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {TYPE_LABELS[key]}
                   </button>
                 ))}
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción del Factor</label>
                 <select 
                   className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-4 px-5 focus:border-sky-500 focus:bg-white outline-none font-bold text-sm"
                   value={selectedFactor}
                   onChange={(e) => setSelectedFactor(e.target.value)}
                 >
                   <option value="">-- Seleccionar factor sugerido --</option>
                   {suggestedFactors.map((f, idx) => <option key={idx} value={f}>{f}</option>)}
                   <option value="Otro">Definir factor personalizado...</option>
                 </select>
                 
                 {selectedFactor === 'Otro' && (
                   <textarea 
                     className="w-full px-6 py-5 rounded-2xl border-2 border-sky-100 bg-sky-50/20 focus:border-sky-500 focus:bg-white outline-none font-bold text-slate-800 text-sm animate-in slide-in-from-top-2 h-32"
                     placeholder="Describa el factor detalladamente..."
                     value={customFactor}
                     onChange={(e) => setCustomFactor(e.target.value)}
                   />
                 )}
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2 mb-1">
                   <MessageSquareQuote size={16} className="text-sky-500" />
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Justificación del Factor</label>
                 </div>
                 <textarea 
                   className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-sky-500 focus:bg-white outline-none font-bold text-slate-800 text-sm h-32 resize-none transition-all shadow-inner"
                   placeholder="¿Por qué este factor es relevante para la operación? Justifique su respuesta..."
                   value={justification}
                   onChange={(e) => setJustification(e.target.value)}
                 />
               </div>
             </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
              Valoración de Impacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {IMPACT_CRITERIA_SHORT.map(c => (
                <button
                  key={c.level}
                  onClick={() => setImpact(c.level)}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2
                    ${impact === c.level ? 'border-sky-500 bg-sky-50 shadow-lg scale-105' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <span className={`text-2xl font-black ${impact === c.level ? 'text-sky-600' : 'text-slate-400'}`}>{c.level}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${impact === c.level ? 'text-sky-700' : 'text-slate-500'}`}>{c.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-8">
            <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl border border-slate-800">
               <h3 className="text-2xl font-black mb-8 text-sky-400 italic tracking-tighter flex items-center gap-3">
                 <Zap size={24} />
                 Resumen
               </h3>
               <div className="space-y-5">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">País</p>
                   <p className="font-bold text-sm text-sky-400">{selectedCountry}</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Clasificación</p>
                   <p className="font-bold text-xs uppercase italic text-emerald-400">{TYPE_LABELS[selectedType]}</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                   <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Impacto</p>
                   <p className="font-black text-sm uppercase text-rose-400">{impact}: {IMPACT_CRITERIA_SHORT[impact-1].label}</p>
                 </div>
               </div>

               <button
                 onClick={handleSave}
                 disabled={!isFormValid}
                 className={`w-full mt-10 py-6 rounded-3xl flex items-center justify-center gap-3 font-black uppercase text-sm tracking-widest transition-all
                   ${isFormValid 
                     ? 'bg-sky-500 text-slate-900 hover:bg-white hover:scale-[1.02] shadow-xl' 
                     : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
               >
                 <Save size={20} />
                 Guardar Registro
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brainstorming;
