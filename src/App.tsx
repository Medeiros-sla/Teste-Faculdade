/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileSimulator } from './components/MobileSimulator';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { BluetoothScreen } from './screens/BluetoothScreen';
import { ResultScreen } from './screens/ResultScreen';
import { Activity, History, Bluetooth, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { activeTab, setActiveTab, connectedDevice } = useApp();

  // Render the currently selected screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'bluetooth':
        return <BluetoothScreen />;
      case 'result':
        return <ResultScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <MobileSimulator activeDeviceConnection={connectedDevice !== null}>
      {/* App main client workspace area */}
      <div id="screen-viewport" className="flex-grow flex flex-col overflow-y-auto mb-16 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            id={`tab-wrapper-${activeTab}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="flex-grow flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FIXED MOBILE BOTTOM TAB NAVIGATION BAR */}
      <nav id="mobile-tab-bar" className="absolute bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-zinc-150/80 flex justify-between items-center px-4 z-40 select-none">
        
        {/* TAB 1: CALCULAR */}
        <button
          id="tab-btn-home"
          onClick={() => setActiveTab('home')}
          className="flex-grow flex flex-col items-center justify-center py-1.5 h-full relative cursor-pointer group active:scale-95 transition-all text-zinc-400"
        >
          <Activity className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'home' ? 'text-indigo-600' : 'text-zinc-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${
            activeTab === 'home' ? 'text-indigo-600 font-extrabold' : 'text-zinc-500'
          }`}>
            Calcular
          </span>
          {activeTab === 'home' && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-full"
            />
          )}
        </button>

        {/* TAB 2: HISTÓRICO */}
        <button
          id="tab-btn-history"
          onClick={() => setActiveTab('history')}
          className="flex-grow flex flex-col items-center justify-center py-1.5 h-full relative cursor-pointer group active:scale-95 transition-all text-zinc-400"
        >
          <History className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'history' ? 'text-indigo-600' : 'text-zinc-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${
            activeTab === 'history' ? 'text-indigo-600 font-extrabold' : 'text-zinc-500'
          }`}>
            Histórico
          </span>
          {activeTab === 'history' && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-full"
            />
          )}
        </button>

        {/* TAB 3: BALANÇA BLUETOOTH */}
        <button
          id="tab-btn-bluetooth"
          onClick={() => setActiveTab('bluetooth')}
          className="flex-grow flex flex-col items-center justify-center py-1.5 h-full relative cursor-pointer group active:scale-95 transition-all text-zinc-400"
        >
          <div className="relative">
            <Bluetooth className={`w-5 h-5 transition-transform group-hover:scale-105 ${
              activeTab === 'bluetooth' ? 'text-indigo-600' : 'text-zinc-400'
            }`} />
            {connectedDevice && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white animate-pulse" />
            )}
          </div>
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${
            activeTab === 'bluetooth' ? 'text-indigo-600 font-extrabold' : 'text-zinc-500'
          }`}>
            Balança
          </span>
          {activeTab === 'bluetooth' && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-full"
            />
          )}
        </button>

        {/* TAB 4: RESULTADOS DETALHADOS (Only visible/highlighed if calculations are available) */}
        <button
          id="tab-btn-result"
          onClick={() => setActiveTab('result')}
          className="flex-grow flex flex-col items-center justify-center py-1.5 h-full relative cursor-pointer group active:scale-94 transition-all text-zinc-400"
        >
          <ClipboardCheck className={`w-5 h-5 transition-transform group-hover:scale-105 ${
            activeTab === 'result' ? 'text-indigo-600' : 'text-zinc-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 tracking-wider ${
            activeTab === 'result' ? 'text-indigo-600 font-extrabold' : 'text-zinc-500'
          }`}>
            Resultados
          </span>
          {activeTab === 'result' && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-full"
            />
          )}
        </button>
        
      </nav>
    </MobileSimulator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
