/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useApp, getIMCDetails } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  Trash2, 
  ChevronRight, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Scale, 
  Activity, 
  HelpCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const HistoryScreen: React.FC = () => {
  const {
    history,
    setActiveTab,
    deleteHistoryEntry,
    setSelectedHistoryId,
    clearHistory
  } = useApp();

  // Sort history Chronologically (oldest to newest) specifically for the Recharts chart data
  const chartData = useMemo(() => {
    return [...history]
      .reverse() // from older to newer
      .map((entry) => {
        const dateObj = new Date(entry.date);
        return {
          id: entry.id,
          dateLabel: dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
          dateFull: dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' }),
          imc: entry.imc,
          weight: entry.weight,
        };
      });
  }, [history]);

  // Calculate metrics
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const currentWeight = history[0].weight;
    const initialWeight = history[history.length - 1].weight;
    const diffWeight = currentWeight - initialWeight;

    const sumIMC = history.reduce((acc, curr) => acc + curr.imc, 0);
    const avgIMC = parseFloat((sumIMC / history.length).toFixed(1));

    const pathDetails = getIMCDetails(history[0].imc);

    return {
      currentWeight,
      initialWeight,
      diffWeight,
      avgIMC,
      pathDetails,
    };
  }, [history]);

  const handleInspectEntry = (id: string) => {
    setSelectedHistoryId(id);
    setActiveTab('result');
  };

  return (
    <div id="history-view" className="flex flex-col flex-grow py-5 px-4 font-sans max-w-lg mx-auto">
      
      {/* View Header */}
      <div id="history-header" className="flex justify-between items-center mb-5 select-none">
        <div>
          <span className="text-[10px] font-black tracking-tight text-indigo-600 uppercase">Estatísticas Corpóreas</span>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight mt-0.5">Histórico & Evolução</h2>
        </div>
        
        {history.length > 0 && (
          <button
            id="btn-clear-history"
            onClick={() => {
              if (window.confirm('Deseja realmente apagar todo o seu histórico de registros permanentemente?')) {
                clearHistory();
              }
            }}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-700 bg-rose-500/5 px-2.5 py-1.5 rounded-lg border border-rose-500/10 cursor-pointer transition-all active:scale-95"
          >
            Limpar Tudo
          </button>
        )}
      </div>

      {history.length === 0 ? (
        /* Empty History view */
        <div id="history-empty" className="flex flex-col items-center justify-center flex-grow py-12 text-center select-none bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-3">
            <Database className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-xs font-black text-zinc-800 uppercase">Sem registros salvos</h3>
          <p className="text-[11px] font-medium text-zinc-500/90 mt-1.5 max-w-[210px] leading-relaxed">
            Seus cálculos de IMC e pesagens Bluetooth aparecerão compilados aqui. Calcule no painel principal!
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] rounded-lg tracking-wider uppercase transition-all flex items-center space-x-1 cursor-pointer"
          >
            <span>Ir para Calculadora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Render charts and list */
        <div id="history-content" className="space-y-5 flex-grow">
          
          {/* Diagnostic Stats Header */}
          {stats && (
            <div id="history-trends-panel" className="grid grid-cols-2 gap-3.5 select-none md:grid-cols-2">
              {/* Weight trend */}
              <div className="bg-zinc-900 text-white p-3.5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full -mr-6 -mt-6 pointer-events-none" />
                <div className="flex justify-between items-center mb-2 z-10">
                  <span className="text-[9px] font-black tracking-wider text-zinc-400 uppercase">Evolução Peso</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    stats.diffWeight <= -0.5 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : stats.diffWeight > 0.5 
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
                  }`}>
                    {stats.diffWeight < 0 ? (
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    ) : stats.diffWeight > 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Scale className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </div>
                
                <div className="z-10 mt-1">
                  <span className="text-[20px] font-mono font-black text-white">
                    {stats.diffWeight > 0 ? `+${stats.diffWeight.toFixed(1)}` : stats.diffWeight.toFixed(1)} <span className="text-xs font-semibold text-zinc-400">kg</span>
                  </span>
                  <p className="text-[10px] font-bold text-zinc-400/90 leading-none mt-1">
                    {stats.diffWeight < 0 ? 'Massa corporal eliminada' : stats.diffWeight > 0 ? 'Massa corporal acrescida' : 'Peso mantido constante'}
                  </p>
                </div>
              </div>

              {/* Monthly Average IMC */}
              <div className="bg-white border border-zinc-100 p-3.5 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black tracking-wider text-zinc-400 uppercase">Média de IMC</span>
                  <div className="w-6 h-6 bg-indigo-50 border border-indigo-150 rounded-lg text-indigo-600 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                </div>
                
                <div className="mt-1">
                  <span className="text-[20px] font-mono font-black text-zinc-800 leading-none">
                    {stats.avgIMC}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 ml-1.5 px-1.5 py-0.5 bg-zinc-100 rounded-md">
                    Histórico
                  </span>
                  <p className="text-[10px] font-bold text-zinc-400/90 leading-none mt-1">
                    Status atual: <span className="font-extrabold text-zinc-600">{stats.pathDetails.label}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AREA CHART - LINE TREND GRAPH (RECHARTS) */}
          <div id="history-chart-wrapper" className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm select-none">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">CURVA DE EVOLUÇÃO (IMC)</span>
            
            <div className="h-[180px] w-full min-w-0" id="chart-mount">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 3, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIMC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                  
                  <XAxis 
                    dataKey="dateLabel" 
                    tick={{ fontSize: 9, fill: '#A1A1AA', fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  
                  <YAxis 
                    domain={['dataMin - 1.5', 'dataMax + 1.5']} 
                    tick={{ fontSize: 9, fill: '#A1A1AA', fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181B', 
                      borderRadius: '12px', 
                      borderColor: '#27272A',
                      padding: '8px 12.5px',
                    }}
                    labelStyle={{ fontSize: '10px', color: '#A1A1AA', fontWeight: 'bold', fontFamily: 'sans-serif' }}
                    itemStyle={{ fontSize: '11px', color: '#FFFFFF', fontWeight: 'extrabold', fontFamily: 'monospace' }}
                    formatter={(value: any) => [`${parseFloat(value).toFixed(1)}`, 'IMC']}
                    labelFormatter={(label) => `Medição: ${label}`}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="imc" 
                    stroke="#4F46E5" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorIMC)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHRONOLOGICAL HISTORIC ENTRIES LIST */}
          <div id="history-records-block" className="space-y-2.5">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">CHRONOLOGIA DE REGISTROS</span>

            <div id="history-scroller shadow-inner" className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {history.map((entry) => {
                const details = getIMCDetails(entry.imc);
                const hasBio = entry.bodyFatSimulated !== undefined;

                return (
                  <motion.div
                    key={entry.id}
                    id={`history-item-${entry.id}`}
                    layoutId={entry.id}
                    className="group bg-white hover:bg-zinc-50/50 border border-zinc-150/60 p-3.5 rounded-2xl flex items-center justify-between transition-all shadow-3xs hover:shadow-2xs"
                  >
                    {/* Timestamp & metrics details */}
                    <div className="flex items-center space-x-3 select-none">
                      <div className="flex flex-col items-center justify-center w-10 h-10 bg-zinc-50 border border-zinc-150 rounded-xl">
                        <Calendar className="w-4.5 h-4.5 text-zinc-500" />
                        <span className="text-[7.5px] font-extrabold text-zinc-400 uppercase mt-0.5 font-mono">
                          {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-zinc-800 font-mono">
                            {entry.weight.toFixed(1)} kg
                          </span>
                          {hasBio && (
                            <span className="bg-amber-500/5 text-amber-600 border border-amber-500/10 text-[7px] font-black px-1 py-0.5 rounded-md uppercase leading-none">
                              Bio
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-400 mt-1 leading-none">
                          Idade: {entry.age}a • Altura: {entry.height.toFixed(2)}m
                        </span>
                      </div>
                    </div>

                    {/* Right column with category badge & triggers */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs font-black text-zinc-800 font-mono">IMC {entry.imc.toFixed(1)}</span>
                        <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide border mt-1 leading-none ${details.color}`}>
                          {details.label.split(' ')[0]} {/* shortened badge name */}
                        </span>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          title="Detalhar Resultados"
                          onClick={() => handleInspectEntry(entry.id)}
                          className="w-7 h-7 hover:bg-zinc-100 border border-zinc-200/20 rounded-lg text-zinc-400 hover:text-zinc-700 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <button
                          title="Apagar Registro"
                          onClick={() => deleteHistoryEntry(entry.id)}
                          className="w-7 h-7 hover:bg-rose-50 border border-rose-100 rounded-lg text-zinc-400 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
