import { Trip } from '../types';

export const calculateTripDetails = (
  distance: number,
  fuelPrice: number,
  mileage: number,
  income: number = 0,
  tolls: number = 0,
  parking: number = 0,
  others: number = 0
) => {
  const fuelUsed = distance / mileage;
  const fuelCost = fuelUsed * fuelPrice;
  const totalExpense = fuelCost + tolls + parking + others;
  const netProfit = income - totalExpense;
  const profitPerKm = distance > 0 ? netProfit / distance : 0;

  return {
    fuelUsed: Number(fuelUsed.toFixed(2)),
    fuelCost: Number(fuelCost.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    profitPerKm: Number(profitPerKm.toFixed(2)),
  };
};

export const calculatePossibleDistance = (
  amountOrLiters: number,
  mileage: number,
  isAmount: boolean,
  fuelPrice: number = 0
) => {
  const liters = isAmount ? amountOrLiters / fuelPrice : amountOrLiters;
  const distance = liters * mileage;
  return {
    liters: Number(liters.toFixed(2)),
    distance: Number(distance.toFixed(2)),
  };
};
