/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bluetooth, 
  BluetoothSearching, 
  Wifi, 
  RefreshCw, 
  Smartphone, 
  Scale, 
  Activity, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Droplets,
  Flame,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const BluetoothScreen: React.FC = () => {
  const {
    isBleScanning,
    discoveredDevices,
    connectedDevice,
    scaleWeight,
    scaleStabilized,
    scaleBioimpedance,
    startBleScan,
    connectDevice,
    disconnectDevice,
    calculateAndSaveIMC,
    setActiveTab,
  } = useApp();

  const handleImportAndCalculate = () => {
    if (!scaleStabilized || scaleWeight === null) return;
    
    // Auto save the measurement to history
    // Save in database
    const savedEntry = calculateAndSaveIMC(scaleWeight, scaleBioimpedance || undefined);
    
    // Redirect to results immediately
    setActiveTab('result');
  };

  return (
    <div id="bluetooth-view" className="flex flex-col flex-grow py-5 px-4 font-sans max-w-lg mx-auto">
      
      {/* View Header */}
      <div id="bluetooth-header" className="flex justify-between items-center mb-5 select-none">
        <div>
          <span className="text-[10px] font-black tracking-tight text-indigo-600 uppercase">Aferição de Alta Precisão</span>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight mt-0.5">Balança Bluetooth</h2>
        </div>
        
        {connectedDevice && (
          <button
            onClick={disconnectDevice}
            className="text-[10px] font-extrabold text-rose-500 hover:text-white hover:bg-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 cursor-pointer transition-all active:scale-95"
          >
            Desconectar
          </button>
        )}
      </div>

      {!connectedDevice ? (
        /* DISCONNECTED DISCOVERY DASHBOARD */
        <div id="discovery-panel" className="space-y-5">
          
          {/* Informational Guidance Banner */}
          <div id="scanner-disclaimer" className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl flex items-start space-x-3.5 select-none">
            <div className="bg-indigo-500/10 text-indigo-600 p-2 rounded-xl mt-0.5 border border-indigo-500/20">
              <Info className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-indigo-900 uppercase">Tecnologia Smart-Scale BLE</h3>
              <p className="text-xs font-medium text-indigo-700/85 leading-relaxed mt-1">
                Conecte-se a uma balança inteligente de bioimpedância. O app receberá seu peso e analisará massa gorda e muscular por Bluetooth de forma automatizada!
              </p>
            </div>
          </div>

          {/* Core Radar Area Trigger */}
          <div id="ble-radar-card" className="bg-white border border-zinc-150 p-6 rounded-3xl shadow-sm text-center select-none flex flex-col items-center justify-center relative overflow-hidden">
            {isBleScanning ? (
              /* Scanning/Searching wave simulator */
              <div className="py-6 flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                  <motion.div
                    className="absolute inset-0 bg-indigo-500/10 rounded-full border border-indigo-500/30"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute inset-2 bg-indigo-500/20 rounded-full border border-indigo-500/20"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                  />
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/35 relative z-10">
                    <BluetoothSearching className="w-6 h-6 text-white animate-spin" />
                  </div>
                </div>
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Escaneando Frequência BLE...</h4>
                <p className="text-[10px] font-semibold text-zinc-400 mt-1">Certifique-se de que a balança está ligada e próxima.</p>
              </div>
            ) : (
              /* Idle trigger scan */
              <div className="py-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
                  <Bluetooth className="w-8 h-8 text-indigo-500" />
                </div>
                <h4 className="text-xs font-black text-zinc-800 uppercase tracking-wider">Nenhum Dispositivo Conectado</h4>
                <p className="text-[10px] font-bold text-zinc-400 mt-1 max-w-[210px] leading-relaxed">Clique abaixo para iniciar a busca por balanças de bioimpedância.</p>

                <button
                  id="btn-scan-ble"
                  onClick={startBleScan}
                  className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-sm shadow-indigo-600/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-97"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Buscar Balanças</span>
                </button>
              </div>
            )}
          </div>

          {/* List of found Bluetooth scales */}
          {!isBleScanning && discoveredDevices.length > 0 && (
            <div id="ble-devices-block" className="space-y-2.5">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">DISPOSITIVOS ENCONTRADOS ({discoveredDevices.length})</span>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {discoveredDevices.map((device) => (
                  <div
                    key={device.id}
                    id={`ble-device-${device.id}`}
                    onClick={() => connectDevice(device)}
                    className="p-3.5 bg-white hover:bg-indigo-50/25 border border-zinc-150 rounded-2xl flex items-center justify-between cursor-pointer group active:scale-99 transition-all shadow-3xs"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-9 h-9 bg-zinc-50 border border-zinc-150 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 hover:border-indigo-250 transition-all">
                        <Scale className="w-4.5 h-4.5 text-indigo-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-zinc-800 leading-none group-hover:text-indigo-900 transition-all">{device.name}</h4>
                        <div className="flex items-center space-x-2 mt-1 select-none">
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-indigo-600/10 text-indigo-600 rounded-md uppercase">
                            {device.type === 'bioimpedance' ? 'Bioimpedância' : 'Padrão'}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 font-mono">Sinal: {device.signalStrength} dBm</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-indigo-600 group-hover:text-white bg-indigo-50 group-hover:bg-indigo-600 border border-indigo-200/50 px-3.5 py-1.5 rounded-lg transition-all">
                      Conectar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* CONNECTED ACTIVE WEIGHING SCALE PLATFORM */
        <div id="weighing-dashboard" className="space-y-5">
          
          {/* Connection status tag */}
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-between select-none">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-black text-emerald-900 uppercase">CONECTADO: {connectedDevice.name}</span>
            </div>
            <span className="bg-emerald-600/10 text-emerald-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase animate-pulse">Sinal Forte</span>
          </div>

          {/* PHYSICAL DRAWING OF GLASS BIOIMPEDANCE SMART SCALE */}
          <div 
            id="smart-scale-drawing-card" 
            className="bg-white border-2 border-zinc-150 rounded-3xl p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden select-none"
          >
            {/* Glossy metallic glass grid highlights */}
            <div className="absolute inset-0 bg-radial-gradient from-zinc-50/30 to-zinc-200/20 pointer-events-none" />
            <div className="absolute top-0 w-full h-[1px] bg-white opacity-40" />

            {/* Scale LED Digit readouts */}
            <div 
              id="scale-led-display" 
              className="bg-zinc-950 px-6 py-3.5 rounded-2xl flex flex-col items-center justify-center shadow-inner relative z-10 w-full max-w-[190px] mb-8 border border-zinc-800"
            >
              {scaleWeight !== null ? (
                <>
                  <span className={`text-[32px] font-black font-mono tracking-tight leading-none ${
                    scaleStabilized ? 'text-emerald-400 animate-pulse' : 'text-zinc-100'
                  }`}>
                    {scaleWeight.toFixed(1)} <span className="text-sm font-semibold">kg</span>
                  </span>
                  <span className={`text-[8px] font-bold uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded ${
                    scaleStabilized ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400 animate-pulse'
                  }`}>
                    {scaleStabilized ? 'Estável • Travado' : 'Medindo peso...'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl font-black text-rose-500 font-mono tracking-widest uppercase leading-none">--.-- kg</span>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Aguardando Carga</span>
                </>
              )}
            </div>

            {/* Smart scale circular metal bioimpedance electrodes pads */}
            <div id="scale-electrodes" className="w-full max-w-[250px] aspect-square border-2 border-dashed border-zinc-200 rounded-2xl p-4 flex justify-between relative mt-4">
              
              {/* Scale metallic vertical line divide */}
              <div className="absolute left-1/2 top-4 bottom-4 w-[1.5px] bg-zinc-200" />
              
              {/* LEFT METAL PAD (Electrode) */}
              <div className="w-[45%] flex flex-col justify-between items-center py-2 h-full">
                <div className="w-12 h-20 rounded-full border-[1.5px] border-zinc-200/80 bg-zinc-50 flex flex-col items-center justify-around opacity-60">
                  <span className="text-[11px] font-bold text-zinc-300">PÉ ESQUERDO</span>
                </div>
              </div>

              {/* RIGHT METAL PAD (Electrode) */}
              <div className="w-[45%] flex flex-col justify-between items-center py-2 h-full">
                <div className="w-12 h-20 rounded-full border-[1.5px] border-zinc-200/80 bg-zinc-50 flex flex-col items-center justify-around opacity-60">
                  <span className="text-[11px] font-bold text-zinc-300">PÉ DIREITO</span>
                </div>
              </div>

              {/* Step indicator */}
              {!scaleStabilized && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <div className="bg-indigo-600/90 backdrop-blur-3xs text-white px-3 py-1.5 rounded-full text-[9px] font-bold border border-indigo-500 shadow-lg flex items-center space-x-1 animate-bounce">
                    <Zap className="w-3 h-3 text-amber-300 mr-1" />
                    <span>Suba na Balança Descalço</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BIOIMPEDANCE REAL TIME ANALYSIS */}
          {scaleStabilized && scaleBioimpedance && (
            <motion.div
              id="bio-telemetry-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-zinc-150 p-4 rounded-3xl shadow-sm leading-normal space-y-3"
            >
              <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2.5">
                <Activity className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-black text-zinc-900 uppercase">Métricas Avançadas Enviadas</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center select-none font-sans">
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase">Massa Gorda</span>
                  <div className="text-sm font-black text-zinc-800 font-mono mt-0.5">{scaleBioimpedance.bodyFat.toFixed(1)}%</div>
                </div>
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase">Massa Muscular</span>
                  <div className="text-sm font-black text-zinc-800 font-mono mt-0.5">{scaleBioimpedance.muscle.toFixed(1)}%</div>
                </div>
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase">Água Corporal</span>
                  <div className="text-sm font-black text-zinc-800 font-mono mt-0.5">{scaleBioimpedance.water.toFixed(1)}%</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ACTIVE IMPORT SCALE ACTION */}
          <button
            id="btn-import-scale"
            onClick={handleImportAndCalculate}
            disabled={!scaleStabilized}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              scaleStabilized 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10' 
                : 'bg-zinc-300 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>Inserir no Histórico de Saúde</span>
          </button>

          <p className="text-[9px] font-semibold text-zinc-400 text-center leading-relaxed px-4 select-none">
            💡 Nota: As balanças de bioimpedância de múltiplas frequências transmitem dados usando barramentos de canais BLE seguros padrão.
          </p>

        </div>
      )}

    </div>
  );
};
