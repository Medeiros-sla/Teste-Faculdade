/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { getIMCDetails } from '../context/AppContext';

interface IMCGaugeProps {
  imc: number;
}

export const IMCGauge: React.FC<IMCGaugeProps> = ({ imc }) => {
  const details = getIMCDetails(imc);

  // Map BMI between 15 and 45 onto 0 to 180 degrees
  const minBMI = 15;
  const maxBMI = 45;
  const clampedIMC = Math.max(minBMI, Math.min(maxBMI, imc));
  const percentage = (clampedIMC - minBMI) / (maxBMI - minBMI);
  const angle = percentage * 180 - 90; // -90 to 90 degrees for a semi-circle

  // Arc path formulas for drawing visual arc segments
  // Center is at (100, 100), radius is 80
  return (
    <div id="imc-gauge-card" className="flex flex-col items-center p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm w-full">
      <div id="gauge-container" className="relative w-full max-w-[260px] flex justify-center items-center h-[130px] overflow-hidden select-none">
        
        {/* Semicircular Gauge SVG */}
        <svg viewBox="0 0 200 110" className="w-full h-full mt-2">
          {/* Background tracks with distinct category colors */}
          <g strokeWidth="12" strokeLinecap="round" fill="none">
            {/* Abaixo do peso: 15 - 18.5 (11.6% of the 30 BMI unit range) */}
            <path d="M 20,100 A 80,80 0 0,1 42,47" stroke="#F59E0B" opacity="0.3" />
            <path d="M 20,100 A 80,80 0 0,1 42,47" stroke="#F59E0B" strokeDasharray="3 30" className="hidden" />
            
            {/* Peso Saudável: 18.5 - 25.0 (21.6% range) */}
            <path d="M 46,43 A 80,80 0 0,1 100,20" stroke="#10B981" opacity="0.3" />
            
            {/* Sobrepeso: 25 - 30 (16.6% range) */}
            <path d="M 104,20 A 80,80 0 0,1 154,43" stroke="#F97316" opacity="0.3" />
            
            {/* Obesidade 1, 2 e 3: 30 - 45 (50% range) */}
            <path d="M 158,47 A 80,80 0 0,1 180,100" stroke="#EF4444" opacity="0.3" />
          </g>

          {/* Active Highlight Track - overlays the active sector with solid opacity */}
          <g strokeWidth="14" strokeLinecap="round" fill="none">
            {imc < 18.5 && (
              <path d="M 20,100 A 80,80 0 0,1 42,47" stroke="#F59E0B" />
            )}
            {imc >= 18.5 && imc < 25.0 && (
              <path d="M 46,43 A 80,80 0 0,1 100,20" stroke="#10B981" />
            )}
            {imc >= 25.0 && imc < 30.0 && (
              <path d="M 104,20 A 80,80 0 0,1 154,43" stroke="#F97316" />
            )}
            {imc >= 30.0 && (
              <path d="M 158,47 A 80,80 0 0,1 180,100" stroke="#EF4444" />
            )}
          </g>

          {/* Floating needle pointer */}
          <g transform="translate(100, 100)">
            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: angle }}
              transition={{ type: 'spring', stiffness: 50, damping: 10 }}
            >
              {/* Outer circle of needle hub */}
              <circle cx="0" cy="0" r="10" fill="#3F3F46" />
              {/* Core of needle hub */}
              <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
              {/* Pointer shaft */}
              <path d="M -3,0 L 0,-85 L 3,0 Z" fill="#3F3F46" />
              {/* Tip accent of pointer shaft */}
              <circle cx="0" cy="-80" r="3" fill="#EF4444" />
            </motion.g>
          </g>

          {/* Base bottom divider */}
          <line x1="10" y1="100" x2="190" y2="100" stroke="#E4E4E7" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Displaying main BMI numbers inside */}
        <div id="gauge-center-badge" className="absolute bottom-0 flex flex-col items-center">
          <span className="text-[28px] font-black tracking-tight text-zinc-800 leading-none">{imc.toFixed(1)}</span>
          <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-1">Seu IMC</span>
        </div>
      </div>

      {/* Grid displays scale guide boundaries */}
      <div id="gauge-scales-grid" className="w-full grid grid-cols-4 gap-1 mt-2.5 px-1 text-center select-none">
        <div className="flex flex-col items-center py-1 bg-amber-500/5 rounded-md border border-amber-500/10">
          <span className="text-[9px] font-black text-amber-600">&lt; 18.5</span>
          <span className="text-[8px] font-bold text-amber-500/80 uppercase">Abaixo</span>
        </div>
        <div className="flex flex-col items-center py-1 bg-emerald-500/5 rounded-md border border-emerald-500/10">
          <span className="text-[9px] font-black text-emerald-600">18.5 - 24.9</span>
          <span className="text-[8px] font-bold text-emerald-500/80 uppercase">Saudável</span>
        </div>
        <div className="flex flex-col items-center py-1 bg-orange-500/5 rounded-md border border-orange-500/10">
          <span className="text-[9px] font-black text-orange-600">25.0 - 29.9</span>
          <span className="text-[8px] font-bold text-orange-500/80 uppercase">Sobre</span>
        </div>
        <div className="flex flex-col items-center py-1 bg-red-500/5 rounded-md border border-red-500/10">
          <span className="text-[9px] font-black text-red-600">&ge; 30.0</span>
          <span className="text-[8px] font-bold text-red-500/80 uppercase">Obeso</span>
        </div>
      </div>
    </div>
  );
};
