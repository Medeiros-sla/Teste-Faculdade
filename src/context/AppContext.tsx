/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { HistoryEntry, IMCCategory, BluetoothDevice, AppNotification, Gender } from '../types';

interface AppContextType {
  history: HistoryEntry[];
  currentHeight: string;
  currentWeight: string;
  currentAge: string;
  currentGender: Gender;
  activeTab: 'home' | 'history' | 'bluetooth' | 'result';
  selectedHistoryId: string | null;
  notifications: AppNotification[];
  
  // Bluetooth BLE simulation state
  isBleScanning: boolean;
  discoveredDevices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  scaleWeight: number | null;
  scaleStabilized: boolean;
  scaleBioimpedance: {
    bodyFat: number;
    water: number;
    muscle: number;
  } | null;

  // Actions
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
  setAge: (age: string) => void;
  setGender: (gender: Gender) => void;
  setActiveTab: (tab: 'home' | 'history' | 'bluetooth' | 'result') => void;
  setSelectedHistoryId: (id: string | null) => void;
  calculateAndSaveIMC: (weightOverride?: number, bioimpedanceData?: { bodyFat: number; water: number; muscle: number } | null) => HistoryEntry;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  startBleScan: () => void;
  connectDevice: (device: BluetoothDevice) => void;
  disconnectDevice: () => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type: AppNotification['type']) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Deurenberg body fat percentage formula for adult
export function calculateBodyFat(imc: number, age: number, gender: Gender): number {
  const genderFactor = gender === 'masculino' ? 1 : 0;
  // Formula: 1.20 * IMC + 0.23 * Age - 10.8 * Gender - 5.4
  const fat = 1.20 * imc + 0.23 * age - 10.8 * genderFactor - 5.4;
  return Math.max(3, Math.min(60, parseFloat(fat.toFixed(1))));
}

// Get IMC status details
export function getIMCDetails(imc: number): { category: IMCCategory; label: string; color: string; description: string } {
  if (imc < 18.5) {
    return {
      category: 'abaixo',
      label: 'Abaixo do peso',
      color: 'text-amber-500 bg-amber-500/10 border-amber-300',
      description: 'Você está abaixo do peso ideal para sua altura. É recomendável consultar um nutricionista para uma avaliação de dieta e saúde.',
    };
  } else if (imc < 25.0) {
    return {
      category: 'normal',
      label: 'Peso saudável',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-300',
      description: 'Parabéns! Seu IMC está na faixa normal. Continue praticando atividades físicas e mantendo uma alimentação equilibrada.',
    };
  } else if (imc < 30.0) {
    return {
      category: 'sobrepeso',
      label: 'Sobrepeso',
      color: 'text-orange-500 bg-orange-500/10 border-orange-300',
      description: 'Seu IMC indica que você está na faixa de sobrepeso. Há um pequeno aumento no risco cardiovascular. Exercícios e ajuste alimentar podem ajudar.',
    };
  } else if (imc < 35.0) {
    return {
      category: 'obesidade_1',
      label: 'Obesidade Grau 1',
      color: 'text-rose-400 bg-rose-400/10 border-rose-300',
      description: 'Classificado como Obesidade Grau 1. Recomenda-se orientação profissional (médica/nutricional) para desenvolver um plano de perda de peso seguro.',
    };
  } else if (imc < 40.0) {
    return {
      category: 'obesidade_2',
      label: 'Obesidade Grau 2 (Severa)',
      color: 'text-rose-500 bg-rose-500/10 border-rose-400',
      description: 'Classificado como Obesidade Grau 2. Esta faixa traz maior risco a complicações como hipertensão e diabetes. Atenção médica é altamente encorajada.',
    };
  } else {
    return {
      category: 'obesidade_3',
      label: 'Obesidade Grau 3 (Mórbida)',
      color: 'text-red-600 bg-red-600/10 border-red-500',
      description: 'Classificado como Obesidade Grau 3. O risco para várias comorbidades graves é substancial. Procure assistência médica especializada.',
    };
  }
}

// Initial realistic tracking data (mocked to look like a actual user tracking journey)
const INITIAL_HISTORY: HistoryEntry[] = [
  {
    id: 'h1',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
    weight: 92.5,
    height: 1.76,
    age: 28,
    gender: 'masculino',
    imc: 29.9,
    category: 'sobrepeso',
    bodyFatSimulated: 26.9,
    waterMassSimulated: 52.6,
    muscleMassSimulated: 33.5,
  },
  {
    id: 'h2',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
    weight: 88.0,
    height: 1.76,
    age: 28,
    gender: 'masculino',
    imc: 28.4,
    category: 'sobrepeso',
    bodyFatSimulated: 25.1,
    waterMassSimulated: 53.9,
    muscleMassSimulated: 34.8,
  },
  {
    id: 'h3',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    weight: 83.2,
    height: 1.76,
    age: 28,
    gender: 'masculino',
    imc: 26.9,
    category: 'sobrepeso',
    bodyFatSimulated: 23.3,
    waterMassSimulated: 55.2,
    muscleMassSimulated: 36.1,
  },
  {
    id: 'h4',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    weight: 79.8,
    height: 1.76,
    age: 28,
    gender: 'masculino',
    imc: 25.8,
    category: 'sobrepeso',
    bodyFatSimulated: 21.9,
    waterMassSimulated: 56.2,
    muscleMassSimulated: 37.1,
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Monitoramento Ativo 🎯',
    message: 'Seja bem-vindo ao seu painel de saúde! Registre suas medidas para começar a acompanhar seu progresso histórico.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    type: 'success',
  },
  {
    id: 'n2',
    title: 'Dica de Hidratação 💧',
    message: 'Beber água regularmente acelera o metabolismo e auxilia nos cálculos de bioimpedância, promovendo maior precisão.',
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false,
    type: 'tip',
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or fallbacks
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem('imc_history');
    return stored ? JSON.parse(stored) : INITIAL_HISTORY;
  });

  const [currentHeight, setHeight] = useState(() => localStorage.getItem('imc_height') || '1.76');
  const [currentWeight, setWeight] = useState(() => localStorage.getItem('imc_weight') || '78.5');
  const [currentAge, setAge] = useState(() => localStorage.getItem('imc_age') || '28');
  const [currentGender, setGender] = useState<Gender>(() => (localStorage.getItem('imc_gender') as Gender) || 'masculino');
  
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'bluetooth' | 'result'>('home');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const stored = localStorage.getItem('imc_notifications');
    return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
  });

  // Bluetooth Simulation State
  const [isBleScanning, setIsBleScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [scaleWeight, setScaleWeight] = useState<number | null>(null);
  const [scaleStabilized, setScaleStabilized] = useState(false);
  const [scaleBioimpedance, setScaleBioimpedance] = useState<{
    bodyFat: number;
    water: number;
    muscle: number;
  } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('imc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('imc_height', currentHeight);
  }, [currentHeight]);

  useEffect(() => {
    localStorage.setItem('imc_weight', currentWeight);
  }, [currentWeight]);

  useEffect(() => {
    localStorage.setItem('imc_age', currentAge);
  }, [currentAge]);

  useEffect(() => {
    localStorage.setItem('imc_gender', currentGender);
  }, [currentGender]);

  useEffect(() => {
    localStorage.setItem('imc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle Notifications
  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const newNotification: AppNotification = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Delete / Reset history
  const deleteHistoryEntry = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    addNotification('Registro removido 🗑️', 'Um registro foi excluído do seu histórico de acompanhamento.', 'warning');
  };

  const clearHistory = () => {
    setHistory([]);
    addNotification('Histórico limpo ✨', 'Todos os seus registros históricos foram apagados permanente.', 'warning');
  };

  // Main BMI Calculator
  const calculateAndSaveIMC = (weightOverride?: number, bioimpedanceData?: typeof scaleBioimpedance) => {
    const wt = weightOverride !== undefined ? weightOverride : parseFloat(currentWeight);
    const ht = parseFloat(currentHeight);
    const ag = parseInt(currentAge) || 28;
    const gd = currentGender;

    if (isNaN(wt) || isNaN(ht) || ht <= 0) {
      throw new Error('Por favor, insira valores válidos de peso e altura.');
    }

    const imcRaw = wt / (ht * ht);
    const imc = parseFloat(imcRaw.toFixed(1));
    const { category } = getIMCDetails(imc);

    // Compute Bioimpedance Values
    // If we have scale measurements override, use them. Otherwise, calculate with standard prediction
    const bodyFat = bioimpedanceData?.bodyFat || calculateBodyFat(imc, ag, gd);
    const muscleMass = bioimpedanceData?.muscle || (gd === 'masculino' ? parseFloat((76.5 - bodyFat).toFixed(1)) : parseFloat((68.2 - bodyFat).toFixed(1)));
    const waterMass = bioimpedanceData?.water || parseFloat(((100 - bodyFat) * (gd === 'masculino' ? 0.73 : 0.68)).toFixed(1));

    const newEntry: HistoryEntry = {
      id: `h-${Date.now()}`,
      date: new Date().toISOString(),
      weight: wt,
      height: ht,
      age: ag,
      gender: gd,
      imc,
      category,
      bodyFatSimulated: bodyFat,
      waterMassSimulated: waterMass,
      muscleMassSimulated: muscleMass,
    };

    // Add entry
    setHistory((prev) => {
      // Avoid duplicate logs on same day by replacing or adding. Let's just add for tracking granular sessions
      return [newEntry, ...prev];
    });

    // Save state weights/parameters
    setWeight(wt.toString());

    // Generate notifications according to progress
    generateMotivationalFeedback(imc, wt);

    return newEntry;
  };

  // Generate customized notification feedback
  const generateMotivationalFeedback = (imc: number, weight: number) => {
    const details = getIMCDetails(imc);
    
    // Pick tailored motivational messages
    let title = '';
    let message = '';
    let type: AppNotification['type'] = 'motivation';

    if (details.category === 'normal') {
      title = 'Excelente Estado de Saúde! 🎉';
      message = `Seu IMC de ${imc} está na faixa ideal. Manter esse peso ideal reduz riscos cardíacos e aumenta sua longevidade!`;
      type = 'success';
    } else if (details.category === 'abaixo') {
      title = 'Foco em Nutrição 💪';
      message = 'Estar abaixo do peso pode estar associado a carências nutricionais. Que tal consultar um especialista para ganho saudável de massa muscular?';
      type = 'tip';
    } else {
      title = 'Jornada Ativa e Consistente! 🔥';
      message = `Seu novo IMC é ${imc}. Combinar alimentação saudável com caminhadas moderadas de 30 min por dia já faz uma diferença de peso a longo prazo!`;
      type = 'motivation';
    }

    // Checking evolution check
    if (history.length > 0) {
      const prevEntry = history[0]; // most recent previous calculation
      const diff = weight - prevEntry.weight;
      if (diff < -0.5) {
        title = 'Evolução Incrível! 📉';
        message = `Você eliminou ${Math.abs(diff).toFixed(1)} kg em comparação ao seu último registro. Parabéns pela consistência na sua rotina!`;
        type = 'success';
      } else if (diff > 0.5) {
        title = 'Foco no Objetivo! 🧭';
        message = `Houve uma variação positiva de +${diff.toFixed(1)} kg. Flutuações de água são super comuns — continue focado nos hábitos diários!`;
        type = 'tip';
      }
    }

    addNotification(title, message, type);
  };

  // BLE Scan Simulation
  const startBleScan = () => {
    setIsBleScanning(true);
    setDiscoveredDevices([]);
    disconnectDevice();

    // After 1.5s, find devices
    setTimeout(() => {
      const devices: BluetoothDevice[] = [
        { id: 'dev-01', name: 'Balança Smart BioFit Pro', signalStrength: -54, connected: false, type: 'bioimpedance' },
        { id: 'dev-02', name: 'Mi Smart Body Composition Scale 2', signalStrength: -68, connected: false, type: 'bioimpedance' },
        { id: 'dev-03', name: 'Bluetooth Scale S3 Lite', signalStrength: -78, connected: false, type: 'standard' }
      ];
      setDiscoveredDevices(devices);
      setIsBleScanning(false);
    }, 2000);
  };

  // BLE Conect Simulation
  const connectDevice = (device: BluetoothDevice) => {
    setIsBleScanning(false);
    
    // Simulate connection phase
    const updatedDevice = { ...device, connected: true };
    setConnectedDevice({ ...device, id: device.id, name: device.name, signalStrength: device.signalStrength, connected: true, type: device.type });
    setDiscoveredDevices(prev => prev.map(d => d.id === device.id ? updatedDevice : { ...d, connected: false }));
    
    // Reset scale weighing values
    setScaleWeight(0);
    setScaleStabilized(false);
    setScaleBioimpedance(null);

    addNotification('Balança Conectada! 📶', `Conexão via Bluetooth estabelecida com ${device.name}. Pronto para pesagem.`, 'success');

    // Simulate stepping on scale after 2 seconds
    setTimeout(() => {
      simulateWeighingProcess(device.type === 'bioimpedance');
    }, 3500);
  };

  const simulateWeighingProcess = (isBioimpedance: boolean) => {
    let current = 0;
    // Set a plausible target weight based on user's current values (or an default)
    const targetWeight = parseFloat(currentWeight) > 30 ? parseFloat(currentWeight) : 74.8;
    
    const interval = setInterval(() => {
      current += Math.random() * 8 + 3;
      if (current >= targetWeight) {
        // Stabilize weighing
        clearInterval(interval);
        setScaleWeight(targetWeight);
        setScaleStabilized(true);

        if (isBioimpedance) {
          // Calculate high-fidelity simulated metrics
          const currentHeightNum = parseFloat(currentHeight) || 1.76;
          const imc = targetWeight / (currentHeightNum * currentHeightNum);
          const ageNum = parseInt(currentAge) || 28;
          const fat = calculateBodyFat(imc, ageNum, currentGender);
          const muscle = currentGender === 'masculino' ? parseFloat((76.5 - fat).toFixed(1)) : parseFloat((68.2 - fat).toFixed(1));
          const water = parseFloat(((100 - fat) * (currentGender === 'masculino' ? 0.72 : 0.67)).toFixed(1));

          setScaleBioimpedance({
            bodyFat: fat,
            water,
            muscle
          });

          addNotification('Análise Avançada Concluída! 📊', 'Balança de bioimpedância transmitiu massa gorda, muscular e retenção de água.', 'success');
        } else {
          addNotification('Massa Corporal Registrada ⚖️', `Peso de ${targetWeight.toFixed(1)} kg lido com sucesso via Bluetooth!`, 'success');
        }
      } else {
        setScaleWeight(parseFloat(current.toFixed(1)));
      }
    }, 120);
  };

  const disconnectDevice = () => {
    if (connectedDevice) {
      addNotification('Dispositivo desconectado', `Desconectado de ${connectedDevice.name}.`, 'warning');
    }
    setConnectedDevice(null);
    setScaleWeight(null);
    setScaleStabilized(false);
    setScaleBioimpedance(null);
  };

  return (
    <AppContext.Provider value={{
      history,
      currentHeight,
      currentWeight,
      currentAge,
      currentGender,
      activeTab,
      selectedHistoryId,
      notifications,
      isBleScanning,
      discoveredDevices,
      connectedDevice,
      scaleWeight,
      scaleStabilized,
      scaleBioimpedance,
      setHeight,
      setWeight,
      setAge,
      setGender,
      setActiveTab,
      setSelectedHistoryId,
      calculateAndSaveIMC,
      deleteHistoryEntry,
      clearHistory,
      startBleScan,
      connectDevice,
      disconnectDevice,
      markNotificationAsRead,
      addNotification,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado sob um AppProvider');
  }
  return context;
};
