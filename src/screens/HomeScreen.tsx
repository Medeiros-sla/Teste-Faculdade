/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, ArrowRight, Bluetooth, HelpCircle, Activity, Heart, BellRing, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const {
    currentHeight,
    currentWeight,
    currentAge,
    currentGender,
    connectedDevice,
    scaleWeight,
    scaleStabilized,
    notifications,
    setHeight,
    setWeight,
    setAge,
    setGender,
    setActiveTab,
    calculateAndSaveIMC,
  } = useApp();

  // Convert height string (meters) to cm (number) for user-friendly UI sliders
  const [heightCm, setHeightCm] = useState<number>(() => {
    const meters = parseFloat(currentHeight) || 1.76;
    return Math.round(meters * 100);
  });

  const [weightKg, setWeightKg] = useState<number>(() => {
    return parseFloat(currentWeight) || 78.5;
  });

  const [ageYears, setAgeYears] = useState<number>(() => {
    return parseInt(currentAge) || 28;
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync internal UI sliders with context hooks
  useEffect(() => {
    setHeight((heightCm / 100).toFixed(2));
  }, [heightCm, setHeight]);

  useEffect(() => {
    setWeight(weightKg.toFixed(1));
  }, [weightKg, setWeight]);

  useEffect(() => {
    setAge(ageYears.toString());
  }, [ageYears, setAge]);

  // Sync Bluetooth stabilized weight value directly to sliders/inputs when ready
  useEffect(() => {
    if (connectedDevice && scaleWeight !== null) {
      setWeightKg(scaleWeight);
    }
  }, [scaleWeight, connectedDevice]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (heightCm < 100 || heightCm > 250) {
      setValidationError('Insira uma altura razoável entre 100cm e 250cm.');
      return;
    }
    if (weightKg < 20 || weightKg > 350) {
      setValidationError('Insira um peso razoável entre 20kg e 350kg.');
      return;
    }
    if (ageYears < 2 || ageYears > 120) {
      setValidationError('Insira uma idade válida.');
      return;
    }

    try {
      calculateAndSaveIMC();
      setActiveTab('result');
    } catch (err: any) {
      setValidationError(err.message || 'Erro ao efetuar o cálculo.');
    }
  };

  // Get active notification count
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div id="homescreen-view" className="flex flex-col flex-grow py-5 px-4 font-sans max-w-lg mx-auto">
      
      {/* Decorative Brand Header */}
      <div id="homescreen-header" className="flex justify-between items-center mb-5 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-zinc-900 tracking-tight leading-none uppercase">FITNESS INTEGRADO</h2>
            <span className="text-[10px] font-bold text-zinc-400">MONITOR INTEGRAL</span>
          </div>
        </div>

        {/* Motivational Notification Bubble Trigger */}
        <div id="homescreen-notif-bubble" className="relative flex items-center space-x-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200/40">
          <BellRing className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] font-bold text-zinc-600">
            {unreadNotifications.length > 0 ? `${unreadNotifications.length} Alertas` : 'Em Dia'}
          </span>
          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-bounce" />
          )}
        </div>
      </div>

      {/* Top Banner Alert Feed (Previews latest warning/motivation notification in real-time) */}
      {notifications.length > 0 && (
        <motion.div
          id="latest-notification-banner"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 bg-indigo-50/70 border border-indigo-100 p-3 rounded-2xl flex items-start space-x-3 shadow-5xs"
        >
          <div className="bg-indigo-500/10 text-indigo-600 p-1.5 rounded-lg mt-0.5 self-start">
            <Sparkles className="w-3 text-indigo-600" />
          </div>
          <div className="flex-grow">
            <h4 className="text-xs font-black text-indigo-900 leading-none">{notifications[0].title}</h4>
            <p className="text-[11px] font-medium text-indigo-700/80 leading-relaxed mt-1">{notifications[0].message}</p>
          </div>
        </motion.div>
      )}

      {/* Bluetooth Integration Banner */}
      <div id="homescreen-bluetooth-panel" className="mb-6 select-none">
        {!connectedDevice ? (
          /* Disconnected promo card */
          <div 
            onClick={() => setActiveTab('bluetooth')}
            className="group bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-md flex items-center justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center space-x-3.5">
              <div id="bt-icon-wrapper" className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-all">
                <Bluetooth className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-white">Importar Peso Automático</h3>
                <p className="text-[10px] font-medium text-zinc-400/90 mt-0.5">Sincronize com sua balança de Bioimpedância via Bluetooth</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        ) : (
          /* Connected Live streaming visualizer */
          <div 
            onClick={() => setActiveTab('bluetooth')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              scaleStabilized 
                ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/5 shadow-md' 
                : 'bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/30 animate-pulse'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                  scaleStabilized 
                    ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
                    : 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30'
                }`}>
                  <Bluetooth className={`w-4 h-4 ${scaleStabilized ? 'text-emerald-500' : 'text-indigo-400 animate-bounce'}`} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">BALANÇA BLUETOOTH</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${scaleStabilized ? 'bg-emerald-500' : 'bg-indigo-500 animate-ping'}`} />
                  </div>
                  <h3 className="text-xs font-extrabold text-zinc-800 leading-none mt-1">{connectedDevice.name}</h3>
                </div>
              </div>

              {/* Weighing readouts */}
              <div className="text-right">
                <span className={`text-lg font-black ${scaleStabilized ? 'text-emerald-700 font-mono' : 'text-indigo-700 font-mono'}`}>
                  {scaleWeight !== null ? `${scaleWeight.toFixed(1)} kg` : 'Pronto'}
                </span>
                <p className="text-[9px] font-bold text-zinc-400 uppercase mt-0.5">
                  {scaleStabilized ? 'Medição Estável!' : 'Aguardando Pesagem...'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CORE IMC CALCULATION FORM */}
      <form id="homescreen-form" onSubmit={handleCalculate} className="space-y-5 bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm flex-grow">
        
        {/* Row for Gender selection & Age */}
        <div id="form-top-row" className="grid grid-cols-2 gap-4">
          
          {/* Gender selection */}
          <div className="flex flex-col space-y-1.5 select-none">
            <label className="text-[10px] font-black text-zinc-400 tracking-wider uppercase">Gênero Biológico</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="gender-male"
                type="button"
                onClick={() => setGender('masculino')}
                className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                  currentGender === 'masculino'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                    : 'bg-zinc-50 border-zinc-200/60 hover:bg-zinc-100 text-zinc-600'
                }`}
              >
                Masc
              </button>
              <button
                id="gender-female"
                type="button"
                onClick={() => setGender('feminino')}
                className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                  currentGender === 'feminino'
                    ? 'bg-fuchsia-600 border-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/10'
                    : 'bg-zinc-50 border-zinc-200/60 hover:bg-zinc-100 text-zinc-600'
                }`}
              >
                Fem
              </button>
            </div>
          </div>

          {/* Age Selection */}
          <div className="flex flex-col space-y-1.5 select-none">
            <label className="text-[10px] font-black text-zinc-400 tracking-wider uppercase">Idade (anos)</label>
            <div className="flex items-center space-x-2">
              <input
                id="age-input"
                type="number"
                min="1"
                max="120"
                value={ageYears}
                onChange={(e) => setAgeYears(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 h-10 rounded-xl font-bold text-center text-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
              {/* Plus/minus stepper actions */}
              <div className="flex flex-col space-y-0.5">
                <button
                  type="button"
                  onClick={() => setAgeYears(prev => Math.min(120, prev + 1))}
                  className="bg-zinc-100 border border-zinc-200/40 p-0.5 rounded-md hover:bg-zinc-200 text-zinc-600 text-[10px] font-black h-4.5 w-6 flex items-center justify-center leading-none"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setAgeYears(prev => Math.max(1, prev - 1))}
                  className="bg-zinc-100 border border-zinc-200/40 p-0.5 rounded-md hover:bg-zinc-200 text-zinc-600 text-[10px] font-black h-4.5 w-6 flex items-center justify-center leading-none"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Height control card */}
        <div id="height-control" className="flex flex-col space-y-2 select-none bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Altura Ideal</span>
            <span className="text-zinc-800 text-lg font-black font-mono">
              {heightCm} <span className="text-xs font-semibold text-zinc-400">cm</span>
              <span className="text-xs font-bold text-zinc-500/80 ml-2">({(heightCm / 100).toFixed(2)} m)</span>
            </span>
          </div>

          <input
            id="height-slider"
            type="range"
            min="100"
            max="225"
            step="1"
            value={heightCm}
            onChange={(e) => setHeightCm(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-bold text-zinc-400/90 font-mono">
            <span>100 cm</span>
            <span>160 cm</span>
            <span>225 cm</span>
          </div>
        </div>

        {/* Weight control card */}
        <div id="weight-control" className={`${
          connectedDevice ? 'ring-2 ring-indigo-500/20 bg-indigo-500/5 border border-indigo-100' : 'bg-zinc-50/50 border border-zinc-100'
        } flex flex-col space-y-2 select-none p-4 rounded-2xl transition-all`}>
          <div className="flex justify-between items-baseline mb-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Massa Corporal</span>
              {connectedDevice && (
                <span className="bg-indigo-600/10 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">BT Sinc</span>
              )}
            </div>
            <div className="flex items-baseline space-x-1">
              <input
                id="weight-input"
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={weightKg.toFixed(1)}
                onChange={(e) => setWeightKg(Math.max(10, parseFloat(e.target.value) || 0))}
                className="bg-transparent font-black font-mono text-zinc-800 text-lg border-b border-transparent focus:border-indigo-500 focus:outline-none text-right w-20 py-0 leading-none h-6"
              />
              <span className="text-xs font-semibold text-zinc-400">kg</span>
            </div>
          </div>

          <input
            id="weight-slider"
            type="range"
            min="30"
            max="180"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            disabled={connectedDevice !== null && !scaleStabilized} // lock slider during active Bluetooth weighing
          />
          <div className="flex justify-between text-[10px] font-bold text-zinc-400/90 font-mono">
            <span>30 kg</span>
            <span>100 kg</span>
            <span>180 kg</span>
          </div>
        </div>

        {/* Validation error display */}
        {validationError && (
          <div id="form-validation" className="flex items-center space-x-2 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-rose-600 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Trigger Button */}
        <button
          id="btn-calculate-imc"
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center space-x-2 rounded-2xl font-black text-xs text-white uppercase tracking-wider shadow-md shadow-indigo-600/25 active:scale-99 transition-all cursor-pointer select-none h-12"
        >
          <span>Calcular IMC & Histórico</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

      {/* Basic Healthy Info Disclaimer */}
      <p className="text-[10px] font-semibold text-zinc-400 text-center leading-relaxed mt-4 p-1 select-none">
        ⚠️ Atenção: O IMC é uma avaliação estatística geral de massa corporal e pode não contemplar com precisão atletas com elevada densidade muscular.
      </p>
    </div>
  );
};
