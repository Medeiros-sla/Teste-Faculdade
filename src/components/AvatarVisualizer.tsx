/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { IMCCategory, Gender } from '../types';
import { getIMCDetails } from '../context/AppContext';

interface AvatarVisualizerProps {
  imc: number;
  category: IMCCategory;
  gender: Gender;
  scale?: number; // overall rendering size factor
}

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  imc,
  category,
  gender,
  scale = 1,
}) => {
  const details = getIMCDetails(imc);

  // Configuration factors based on IMC category for drawing the dynamic SVG avatar
  const getAvatarMetrics = (cat: IMCCategory) => {
    switch (cat) {
      case 'abaixo':
        return {
          bodyWidth: 28,      // slender waist
          bodyHeight: 75,
          limbWidth: 6,
          headScale: 1.05,
          color: '#F59E0B',   // amber
          glowColor: 'rgba(245, 158, 11, 0.25)',
          expression: 'mild-smile',
          stomachOffset: 0,
          vibe: 'De leve humor e corpo esguio. Precisa fortalecer nutrição!',
        };
      case 'normal':
        return {
          bodyWidth: 38,      // healthy proportions
          bodyHeight: 74,
          limbWidth: 8,
          headScale: 1.0,
          color: '#10B981',   // emerald
          glowColor: 'rgba(16, 185, 129, 0.25)',
          expression: 'big-smile',
          stomachOffset: 0,
          vibe: 'Sensação atlética e enérgica! Proporções de alta saúde.',
        };
      case 'sobrepeso':
        return {
          bodyWidth: 48,      // slightly wider waist
          bodyHeight: 73,
          limbWidth: 9.5,
          headScale: 0.98,
          color: '#F97316',   // orange
          glowColor: 'rgba(249, 115, 22, 0.25)',
          expression: 'neutral',
          stomachOffset: 4,
          vibe: 'Foco na atividade! Massa corpórea um pouco acima.',
        };
      case 'obesidade_1':
        return {
          bodyWidth: 58,      // wider / robust waist
          bodyHeight: 72,
          limbWidth: 11,
          headScale: 0.96,
          color: '#FB7185',   // rose
          glowColor: 'rgba(251, 113, 133, 0.25)',
          expression: 'gentle',
          stomachOffset: 8,
          vibe: 'Curvas cheias de energia. Buscando equilíbrio físico.',
        };
      case 'obesidade_2':
        return {
          bodyWidth: 68,      // highly robust body shape
          bodyHeight: 71,
          limbWidth: 12.5,
          headScale: 0.94,
          color: '#F43F5E',   // deep rose
          glowColor: 'rgba(244, 63, 94, 0.25)',
          expression: 'sweating',
          stomachOffset: 12,
          vibe: 'Sinal de esforço e determinação para retomar o foco!',
        };
      case 'obesidade_3':
        default:
        return {
          bodyWidth: 78,      // heavily wider waist
          bodyHeight: 70,
          limbWidth: 14,
          headScale: 0.92,
          color: '#DC2626',   // red
          glowColor: 'rgba(220, 38, 38, 0.25)',
          expression: 'motivated',
          stomachOffset: 16,
          vibe: 'Compromisso com novos hábitos saudáveis e reeducação.',
        };
    }
  };

  const metrics = getAvatarMetrics(category);

  // SVG dimensions: width = 200, height = 300
  return (
    <div id="avatar-container" className="flex flex-col items-center justify-center p-3 font-sans w-full select-none">
      
      {/* Decorative Aura and Dynamic SVG drawing */}
      <div 
        id="avatar-frame"
        className="relative bg-zinc-50 border border-zinc-100 rounded-2xl p-5 flex items-center justify-center shadow-inner transition-all duration-500 overflow-hidden"
        style={{ width: 170 * scale, height: 210 * scale }}
      >
        {/* Dynamic Glowing Aura behind the avatar */}
        <motion.div
          id="avatar-glow"
          className="absolute rounded-full pointer-events-none"
          initial={{ scale: 0.8, opacity: 0.4 }}
          animate={{
            scale: [0.85, 1.15, 0.85],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '100px',
            height: '140px',
            background: `radial-gradient(circle, ${metrics.glowColor} 0%, rgba(255,255,255,0) 70%)`,
          }}
        />

        {/* The Animated Vector Character */}
        <svg 
          id="avatar-svg"
          viewBox="0 0 200 300" 
          className="w-full h-full relative z-10 filter drop-shadow-md"
        >
          {/* Floor Shadow */}
          <ellipse cx="100" cy="272" rx="42" ry="7" fill="#E4E4E7" />
          <motion.ellipse 
            cx="100" 
            cy="272" 
            rx={metrics.bodyWidth * 0.72 + 10} 
            ry="6" 
            fill="#D4D4D8" 
            animate={{ rx: metrics.bodyWidth * 0.72 + 10 }}
            transition={{ type: 'spring', damping: 15 }}
          />

          {/* SKELETON / JOINTS ANCHORED BY MOTION */}
          
          {/* Hair back (long hair if female) */}
          {gender === 'feminino' && (
            <motion.path
              d="M 65,95 C 65,58 135,58 135,95 C 135,145 125,180 120,180 C 110,130 90,130 80,180 C 75,180 65,145 65,95 Z"
              fill="#523B2A"
              animate={{ scaleY: category === 'abaixo' ? 1.02 : 1 }}
              transition={{ type: 'spring' }}
            />
          )}

          {/* Left Foot */}
          <rect cx="82" cy="260" width="16" height="12" rx="6" fill="#71717A" x="72" y="258" />
          {/* Right Foot */}
          <rect cx="102" cy="260" width="16" height="12" rx="6" fill="#71717A" x="112" y="258" />

          {/* Left Leg */}
          <motion.rect
            x="76"
            y="170"
            width={metrics.limbWidth}
            height="95"
            rx={metrics.limbWidth / 2}
            fill="#3F3F46"
            animate={{ width: metrics.limbWidth }}
            transition={{ type: 'spring', damping: 15 }}
          />

          {/* Right Leg */}
          <motion.rect
            x={124 - metrics.limbWidth}
            y="170"
            width={metrics.limbWidth}
            height="95"
            rx={metrics.limbWidth / 2}
            fill="#3F3F46"
            animate={{ width: metrics.limbWidth }}
            transition={{ type: 'spring', damping: 15 }}
          />

          {/* TORSO / BODY - WIDENS DYNAMICALLY based on BMI */}
          <motion.rect
            x={100 - metrics.bodyWidth / 2}
            y="110"
            width={metrics.bodyWidth}
            height={metrics.bodyHeight}
            rx={metrics.bodyWidth * 0.35}
            fill={metrics.color}
            animate={{ 
              width: metrics.bodyWidth, 
              height: metrics.bodyHeight,
              x: 100 - metrics.bodyWidth / 2,
              fill: metrics.color
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
          />

          {/* Shirt Graphics / Heart Rate Line */}
          <motion.path
            d="M 90,140 Q 95,143 100,137 T 110,140"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
            animate={{
              d: category === 'normal' 
                ? "M 88,140 Q 92,135 96,145 T 104,133 T 112,140" // athletic heart rate wave
                : "M 90,140 Q 95,142 100,138 T 110,140"
            }}
          />

          {/* Left Arm */}
          <motion.line
            x1={95 - metrics.bodyWidth / 2}
            y1="120"
            x2={70 - metrics.limbWidth / 3}
            y2="178"
            stroke="#3F3F46"
            strokeWidth={metrics.limbWidth}
            strokeLinecap="round"
            animate={{
              x1: 98 - metrics.bodyWidth / 2,
              strokeWidth: metrics.limbWidth,
              // Adjust position for specific actions
              x2: category === 'normal' ? 60 : 70 - metrics.limbWidth / 3,
              y2: category === 'normal' ? 140 : 178, // Wave for healthy/normal target!
            }}
            transition={{ type: 'spring', damping: 14 }}
          />

          {/* Right Arm */}
          <motion.line
            x1={105 + metrics.bodyWidth / 2}
            y1="120"
            x2={130 + metrics.limbWidth / 3}
            y2="178"
            stroke="#3F3F46"
            strokeWidth={metrics.limbWidth}
            strokeLinecap="round"
            animate={{
              x1: 102 + metrics.bodyWidth / 2,
              strokeWidth: metrics.limbWidth,
              x2: category === 'normal' ? 140 : 130 + metrics.limbWidth / 3,
              y2: category === 'normal' ? 140 : 178, // Wave for healthy/normal target!
            }}
            transition={{ type: 'spring', damping: 14 }}
          />

          {/* Head & Neck */}
          <motion.rect
            x="96"
            y="95"
            width="8"
            height="20"
            rx="4"
            fill="#E4E4E7"
          />

          <motion.circle
            cx="100"
            cy="75"
            r="26"
            fill="#F4F4F5"
            stroke="#E4E4E7"
            strokeWidth="1.5"
            style={{ originY: 1 }}
            animate={{
              scale: metrics.headScale,
              y: category === 'abaixo' ? -2 : 0,
            }}
            transition={{ type: 'spring' }}
          />

          {/* Hair front (Feminino bangs or Masculino spiked haircut) */}
          {gender === 'masculino' ? (
            <path
              d="M 74,70 Q 72,54 85,50 Q 88,38 100,45 Q 112,38 115,50 Q 128,54 126,70 C 114,64 88,64 74,70 Z"
              fill="#27272A"
            />
          ) : (
            <path
              d="M 74,72 C 74,52 126,52 126,72 C 120,60 80,60 74,72 Z"
              fill="#523B2A"
            />
          )}

          {/* Eyes (Smiling or blinking) */}
          <g>
            {/* Left Eye */}
            <motion.ellipse
              cx="91"
              cy="74"
              rx="2.5"
              ry="3.5"
              fill="#27272A"
              animate={{
                ry: metrics.expression === 'big-smile' ? 1.5 : 3.5,
                cy: metrics.expression === 'big-smile' ? 76 : 74,
              }}
            />
            {/* Right Eye */}
            <motion.ellipse
              cx="109"
              cy="74"
              rx="2.5"
              ry="3.5"
              fill="#27272A"
              animate={{
                ry: metrics.expression === 'big-smile' ? 1.5 : 3.5,
                cy: metrics.expression === 'big-smile' ? 76 : 74,
              }}
            />
          </g>

          {/* Dynamic Mouth and Sweating effect */}
          {metrics.expression === 'big-smile' && (
            // Smiling path
            <path d="M 91,85 Q 100,95 109,85 Q 100,90 91,85" fill="#DC2626" stroke="#27272A" strokeWidth="1" strokeLinecap="round" />
          )}

          {metrics.expression === 'mild-smile' && (
            // Smiling line
            <path d="M 94,84 Q 100,88 106,84" fill="none" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {metrics.expression === 'neutral' && (
            // Straight neutral line
            <line x1="94" y1="84" x2="106" y2="84" stroke="#27272A" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {metrics.expression === 'sweating' && (
            // Curved struggle mouth
            <g>
              <path d="M 94,86 Q 100,80 106,86" fill="none" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />
              {/* Sweat drop on the left */}
              <motion.path
                d="M 78,74 L 81,77 L 80,81 C 79,82 77,82 76,81 C 75,80 75,76 78,74 Z"
                fill="#3B82F6"
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </g>
          )}

          {metrics.expression === 'motivated' && (
            // Open determined mouth
            <g>
              <circle cx="100" cy="86" r="4" fill="#27272A" />
              {/* Energy Sparkles */}
              <motion.circle cx="70" cy="55" r="2.5" fill="#EAB308" animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.1 }} />
              <motion.circle cx="130" cy="62" r="2.5" fill="#EAB308" animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.5 }} />
            </g>
          )}

          {metrics.expression === 'gentle' && (
            // Warm smiling curved line
            <path d="M 95,83 Q 100,87 105,83" fill="none" stroke="#27272A" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Glasses Option (just for aesthetic balance) */}
          {imc > 30 && (
            <g stroke="#3F3F46" strokeWidth="1.5" fill="none" opacity="0.6">
              <rect x="85" y="70" width="11" height="9" rx="3" />
              <rect x="104" y="70" width="11" height="9" rx="3" />
              <line x1="96" y1="74" x2="104" y2="74" />
            </g>
          )}
        </svg>

        {/* Floating BMI Label in the frame */}
        <div id="imc-badge-floating" className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-2xs border border-zinc-200/60 shadow-xs px-3 py-1 rounded-full flex items-center justify-center space-x-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metrics.color }} />
          <span className="font-mono text-xs font-semibold text-zinc-700">BMI {imc.toFixed(1)}</span>
        </div>
      </div>

      {/* Dynamic bio-impedance status description based on current BMI */}
      <p id="avatar-vibe-text" className="text-zinc-500 text-[11px] font-medium text-center mt-2.5 max-w-[210px] bg-zinc-50 border border-dotted border-zinc-200/50 p-1.5 rounded-lg leading-relaxed shadow-3xs">
        💡 {metrics.vibe}
      </p>
    </div>
  );
};
