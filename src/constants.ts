import { FuelType } from './types';

export interface FuelConfig {
  type: FuelType;
  unit: string;
  efficiencyUnit: string;
  color: string;
  label: string;
}

export const FUEL_CONFIGS: Record<FuelType, FuelConfig> = {
  petrol: { 
    type: 'petrol', 
    unit: 'L', 
    efficiencyUnit: 'km/l', 
    color: 'blue', 
    label: 'Petrol' 
  },
  diesel: { 
    type: 'diesel', 
    unit: 'L', 
    efficiencyUnit: 'km/l', 
    color: 'emerald', 
    label: 'Diesel' 
  },
  cng: { 
    type: 'cng', 
    unit: 'kg', 
    efficiencyUnit: 'km/kg', 
    color: 'orange', 
    label: 'CNG' 
  },
  lpg: { 
    type: 'lpg', 
    unit: 'kg', 
    efficiencyUnit: 'km/kg', 
    color: 'purple', 
    label: 'LPG/Gas' 
  },
};
