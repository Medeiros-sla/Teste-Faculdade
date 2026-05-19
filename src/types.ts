/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'masculino' | 'feminino';

export type IMCCategory = 
  | 'abaixo'       // < 18.5
  | 'normal'       // 18.5 - 24.9
  | 'sobrepeso'    // 25.0 - 29.9
  | 'obesidade_1'  // 30.0 - 34.9
  | 'obesidade_2'  // 35.0 - 39.9
  | 'obesidade_3'; // >= 40.0

export interface HistoryEntry {
  id: string;
  date: string; // ISO date string format e.g., "ON_DATE"
  weight: number; // in kg
  height: number; // in meters
  age: number;
  gender: Gender;
  imc: number;
  category: IMCCategory;
  bodyFatSimulated?: number; // percentage simulated from bioimpedance scale
  waterMassSimulated?: number; // percentage simulated from bioimpedance scale
  muscleMassSimulated?: number; // percentage simulated from bioimpedance scale
}

export interface BluetoothDevice {
  id: string;
  name: string;
  signalStrength: number; // RSSI e.g. -65 dBm
  connected: boolean;
  type: 'bioimpedance' | 'standard';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'success' | 'warning' | 'motivation' | 'tip';
}
