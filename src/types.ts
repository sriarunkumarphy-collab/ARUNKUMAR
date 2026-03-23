export type FuelType = 'petrol' | 'diesel' | 'cng' | 'lpg';

export interface Trip {
  id: string;
  date: string;
  startLocation: string;
  destination: string;
  distance: number; // km
  fuelType: FuelType;
  fuelPrice: number; // per unit
  mileage: number; // km/unit
  fuelUsed: number; // units
  fuelCost: number; // currency
  tollCharges: number;
  parkingCharges: number;
  otherExpenses: number;
  income: number;
  totalExpense: number;
  netProfit: number;
  profitPerKm: number;
  vehicleId: string;
  uid: string;
}

export interface Vehicle {
  id: string;
  name: string;
  fuelType: FuelType;
  defaultMileage: number;
}

export interface UserSettings {
  currency: string;
  defaultFuelType: FuelType;
  fuelPrices: Record<FuelType, number>;
  darkMode: boolean;
  language: 'en' | 'ta';
  uid: string;
}

export interface DashboardStats {
  totalTrips: number;
  totalDistance: number;
  totalFuelUsed: number;
  totalExpense: number;
  totalProfit: number;
  fuelWiseStats: Record<FuelType, {
    distance: number;
    cost: number;
    trips: number;
  }>;
}
