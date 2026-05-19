/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, Monitor, HelpCircle, Wifi, Battery, Nfc, Bluetooth } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileSimulatorProps {
  children: React.ReactNode;
  activeDeviceConnection: boolean;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({ 
  children, 
  activeDeviceConnection 
}) => {
  const [time, setTime] = useState('');
  const [isSimulatorMode, setIsSimulatorMode] = useState(true);

  // Update clock at status bar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="sim-root" className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-slate-950 to-neutral-900 font-sans flex flex-col justify-between items-center py-6 px-4 md:px-8 text-white relative overflow-hidden">
      
      {/* Dynamic Ambient Background Sparkles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Top Banner Control Section */}
      <header id="sim-top-nav" className="w-full max-w-6xl flex justify-between items-center z-10 mb-2 select-none">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-bold tracking-tight text-sm uppercase">PROTÓTIPO EM SIMULAÇÃO</span>
            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30 rounded-md animate-pulse">LIVE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">Calculadora e Monitor de IMC</h1>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/50 p-1.5 rounded-xl">
          <button 
            id="btn-toggle-sim"
            onClick={() => setIsSimulatorMode(!isSimulatorMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isSimulatorMode 
                ? 'bg-indigo-600/90 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Format Celular</span>
          </button>
          <button 
            onClick={() => setIsSimulatorMode(false)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isSimulatorMode 
                ? 'bg-indigo-600/90 text-white shadow-md' 
                : 'text-zinc-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Tela Cheia</span>
          </button>
        </div>
      </header>

      {/* Primary Simulator Body Chassis */}
      <main id="sim-main" className="w-full flex-grow flex justify-center items-center z-10 my-4 select-text">
        {isSimulatorMode ? (
          /* High-Fidelity physical Smartphone viewport */
          <div 
            id="mobile-phone-device"
            className="relative bg-zinc-950 rounded-[48px] p-3.5 border-[5.5px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] max-w-[395px] w-full aspect-[9/19.2] flex flex-col items-stretch overflow-hidden ring-[1px] ring-zinc-700/40"
          >
            {/* Dynamic Island / Punch Hole housing front camera */}
            <div id="dynamic-island" className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-3xl z-40 flex items-center justify-between px-3.5 ring-1 ring-zinc-900">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800/80 m-0.5" />
              <div className="flex items-center space-x-1">
                {activeDeviceConnection && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Bluetooth className="w-2.5 h-2.5 text-blue-400 fill-blue-400/20" />
                  </motion.div>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 m-0.5 animate-pulse" />
              </div>
            </div>

            {/* Simulated side hardware buttons */}
            <div className="absolute top-28 -left-[7px] w-[2px] h-10 bg-zinc-800 rounded-r-lg" />
            <div className="absolute top-44 -left-[7px] w-[2px] h-14 bg-zinc-800 rounded-r-lg" />
            <div className="absolute top-60 -left-[7px] w-[2px] h-14 bg-zinc-800 rounded-r-lg" />
            <div className="absolute top-40 -right-[7px] w-[2px] h-16 bg-zinc-800 rounded-l-lg" />

            {/* Core Screen inside the chassis */}
            <div id="phone-screen" className="flex-grow rounded-[36px] bg-zinc-50 flex flex-col overflow-hidden relative border border-black/10">
              
              {/* Device Status Bar */}
              <div id="phone-status-bar" className="h-11 bg-zinc-900 text-white flex items-center justify-between px-6 z-30 select-none">
                <span className="font-semibold text-xs text-zinc-100">{time}</span>
                <div className="flex items-center space-x-1.5">
                  {activeDeviceConnection && (
                    <Bluetooth className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  )}
                  <Wifi className="w-3.5 h-3.5 text-zinc-100" />
                  <span className="text-[10px] font-extrabold font-mono text-zinc-100">5G</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] font-bold text-zinc-300">89%</span>
                    <Battery className="w-4 h-4 text-zinc-100 rotate-0" />
                  </div>
                </div>
              </div>

              {/* Dynamic Inner App Render */}
              <div id="phone-content-view" className="flex-grow flex flex-col overflow-y-auto overflow-x-hidden relative bg-zinc-50 p-0 text-zinc-800">
                {children}
              </div>

              {/* Virtual Home Bar Indicator */}
              <div id="phone-home-indicator" className="h-6 bg-zinc-50 flex justify-center items-center select-none z-30">
                <div className="w-32 h-1 bg-zinc-400/80 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Browser Full Width viewport with styled tablet/desktop bounds */
          <div 
            id="full-web-canvas"
            className="max-w-4xl w-full bg-zinc-50 border border-zinc-200 shadow-2xl rounded-3xl min-h-[720px] flex flex-col text-zinc-800 overflow-hidden"
          >
            <div className="h-10 bg-zinc-900 text-zinc-400 flex items-center justify-between px-6 select-none font-medium">
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-zinc-300 text-xs font-mono font-medium tracking-tight">https://imc-smart-fitness.app/dashboard</span>
              <div className="flex items-center space-x-2">
                {activeDeviceConnection && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md text-[9px] font-bold">Bluetooth Ativo</span>}
                <span className="text-xs text-zinc-400">{time}</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col">
              {children}
            </div>
          </div>
        )}
      </main>

      {/* Decorative Footer */}
      <footer id="sim-footer" className="w-full text-center z-10 text-[11px] font-semibold text-zinc-500 tracking-wide mt-2 select-none">
        PROJETADO COM REQUISITOS RESPONSIVOS PARA DISPOSITIVOS iOS & ANDROID CORRESPONDENTES.
      </footer>
    </div>
  );
};
