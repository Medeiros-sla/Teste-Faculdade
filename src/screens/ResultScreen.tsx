/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, getIMCDetails } from '../context/AppContext';
import { AvatarVisualizer } from '../components/AvatarVisualizer';
import { IMCGauge } from '../components/IMCGauge';
import { 
  ArrowLeft, 
  Dumbbell, 
  Heart, 
  HelpCircle, 
  History, 
  Droplet, 
  Flame, 
  Sparkles, 
  Share2, 
  ShieldAlert,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';

export const ResultScreen: React.FC = () => {
  const {
    history,
    currentGender,
    setActiveTab,
    selectedHistoryId,
    setSelectedHistoryId,
  } = useApp();

  // If we are looking at a specific historic entry, use that. Otherwise, load the most recent entry from history.
  const activeEntry = selectedHistoryId 
    ? history.find((e) => e.id === selectedHistoryId) 
    : history[0];

  if (!activeEntry) {
    return (
      <div id="results-empty" className="flex flex-col items-center justify-center flex-grow p-6 text-center select-none">
        <ShieldAlert className="w-12 h-12 text-zinc-400 mb-2 animate-bounce" />
        <h3 className="text-sm font-black text-zinc-900 uppercase">Nenhum cálculo encontrado</h3>
        <p className="text-xs font-semibold text-zinc-500 mt-1 max-w-[240px]">Por favor, vá para a tela inicial para calcular seu IMC.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
        >
          Ir Calcular
        </button>
      </div>
    );
  }

  const details = getIMCDetails(activeEntry.imc);
  const isFromBioimpedance = activeEntry.bodyFatSimulated !== undefined;

  // Handle returning back to previous context
  const handleBack = () => {
    if (selectedHistoryId) {
      setSelectedHistoryId(null);
      setActiveTab('history');
    } else {
      setActiveTab('home');
    }
  };

  return (
    <div id="result-view" className="flex flex-col flex-grow py-5 px-4 font-sans max-w-lg mx-auto">
      
      {/* Upper Navigation Row */}
      <div id="result-navigation" className="flex justify-between items-center mb-5 select-none">
        <button
          onClick={handleBack}
          className="hover:bg-zinc-100 p-2 rounded-xl transition-all border border-zinc-200/20 text-zinc-600 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-xs font-bold">Voltar</span>
        </button>
        <span className="text-[10px] font-black tracking-tight text-zinc-400 uppercase">
          {selectedHistoryId ? 'Registro Histórico' : 'Resultado do Cálculo'}
        </span>
        <button
          onClick={() => {
            // Simulated share API
            navigator.clipboard.writeText(`Meu IMC é ${activeEntry.imc} (${details.label}). Calculado com IMC Fitness!`);
            alert('Copiado para a área de transferência! Compartilhe seu progresso.');
          }}
          className="hover:bg-zinc-100 p-2 rounded-xl transition-all border border-zinc-200/20 text-zinc-600 flex items-center justify-center cursor-pointer"
          title="Compartilhar"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Badge Section */}
      <div id="result-hero" className="text-center mb-5 select-none">
        <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1 text-xs font-black rounded-full border ${details.color}`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          <span>{details.label}</span>
        </span>
        <span className="block text-[10px] font-bold text-zinc-400/90 tracking-wide mt-2 uppercase">
          Aferição em {new Date(activeEntry.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })} às {new Date(activeEntry.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Main Grid View - Avatar and Gauge Side by Side/Stack */}
      <div id="result-visualizer-stack" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Dynamic Physical State Avatar */}
        <div className="flex flex-col items-center bg-white border border-zinc-100 rounded-3xl p-1 shadow-sm">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2 p-1">REPRESENTAÇÃO FÍSICA</span>
          <AvatarVisualizer 
            imc={activeEntry.imc} 
            category={activeEntry.category} 
            gender={activeEntry.gender} 
            scale={1.05} 
          />
        </div>

        {/* Visual Needle Gauge */}
        <div className="flex flex-col justify-between h-full space-y-4">
          <div className="flex-grow flex flex-col items-center bg-white border border-zinc-100 rounded-3xl p-1 shadow-sm h-full justify-between pb-3">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2 p-1">ZONA DO ESPECTRO</span>
            <IMCGauge imc={activeEntry.imc} />
          </div>
        </div>
      </div>

      {/* Bioimpedance Telemetry Card Section */}
      <div id="result-telemetry-card" className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm mb-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">COMPOSIÇÃO CORPORAL</span>
            <span className="text-xs font-bold text-zinc-800">Parâmetros de Bioimpedância</span>
          </div>
          {isFromBioimpedance ? (
            <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              Balança Ativa
            </span>
          ) : (
            <span className="bg-zinc-100 text-zinc-500 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              Análise Estimada
            </span>
          )}
        </div>

        {/* Metric Triplet */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Body Fat */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-1.5 shadow-5xs">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Gordura</span>
            <span className="text-sm font-black text-zinc-800 mt-1 font-mono">{activeEntry.bodyFatSimulated?.toFixed(1) || '--'}%</span>
          </div>

          {/* Muscle Mass */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1.5 shadow-5xs">
              <Dumbbell className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Músculo</span>
            <span className="text-sm font-black text-zinc-800 mt-1 font-mono">{activeEntry.muscleMassSimulated?.toFixed(1) || '--'}%</span>
          </div>

          {/* Body Water */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 shadow-5xs">
              <Droplet className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Água</span>
            <span className="text-sm font-black text-zinc-800 mt-1 font-mono">{activeEntry.waterMassSimulated?.toFixed(1) || '--'}%</span>
          </div>
        </div>
      </div>

      {/* Structured Health Recommendations */}
      <div id="result-recommendations" className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm mb-6 flex items-start space-x-3.5">
        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-100 mt-0.5">
          <Compass className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-xs font-black text-zinc-800 tracking-wider uppercase">Dicas e Recomendações</h3>
          <p className="text-xs font-medium text-zinc-500/90 leading-relaxed mt-1.5">
            {details.description}
          </p>
        </div>
      </div>

      {/* Button Row */}
      <div id="result-action-row" className="grid grid-cols-2 gap-3 mt-auto">
        <button
          id="btn-recalculate"
          onClick={() => {
            setSelectedHistoryId(null);
            setActiveTab('home');
          }}
          className="py-3.5 bg-zinc-100 border border-zinc-200/60 font-black text-xs text-zinc-700 uppercase tracking-wider rounded-xl hover:bg-zinc-200 active:scale-98 transition-all cursor-pointer select-none"
        >
          Refazer Cálculo
        </button>

        <button
          id="btn-nav-history"
          onClick={() => {
            setSelectedHistoryId(null);
            setActiveTab('history');
          }}
          className="py-3.5 bg-indigo-600 font-black text-xs text-white uppercase tracking-wider rounded-xl hover:bg-indigo-700 active:scale-98 shadow-md shadow-indigo-600/10 transition-all cursor-pointer select-none flex items-center justify-center space-x-1.5"
        >
          <History className="w-4 h-4" />
          <span>Ver Histórico</span>
        </button>
      </div>

    </div>
  );
};
