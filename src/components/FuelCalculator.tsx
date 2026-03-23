import React, { useState, useEffect } from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { FuelType } from '../types';
import { FUEL_CONFIGS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Fuel as FuelIcon, Calculator, IndianRupee, Droplets } from 'lucide-react';

const FuelCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { settings } = useFuel();

  const [fuelType, setFuelType] = useState<FuelType>(settings.defaultFuelType);
  const [amount, setAmount] = useState<number>(0);
  const [fuelPrice, setFuelPrice] = useState<number>(settings.fuelPrices[settings.defaultFuelType]);
  const [result, setResult] = useState<{ liters: string; totalCost: string } | null>(null);

  useEffect(() => {
    setFuelPrice(settings.fuelPrices[fuelType]);
  }, [fuelType, settings.fuelPrices]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && fuelPrice > 0) {
      const liters = (amount / fuelPrice).toFixed(2);
      setResult({
        liters,
        totalCost: amount.toFixed(2)
      });
    }
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="mb-6 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Fuel Calculator</h2>
      </header>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Fuel Type</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <FuelIcon size={18} />
            </div>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as FuelType)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white appearance-none"
            >
              {(Object.keys(FUEL_CONFIGS) as FuelType[]).map((type) => (
                <option key={type} value={type}>
                  {FUEL_CONFIGS[type].label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Enter Amount (₹)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <IndianRupee size={18} />
            </div>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Fuel Price (₹)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <IndianRupee size={18} />
            </div>
            <input
              type="number"
              value={fuelPrice || ''}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-4 bg-[#1E88E5] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Calculator size={20} />
          CALCULATE
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30"
            >
              <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">Result:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Droplets size={16} />
                    <span>Fuel Needed:</span>
                  </div>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">{result.liters} {FUEL_CONFIGS[fuelType].unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <IndianRupee size={16} />
                    <span>Total Cost:</span>
                  </div>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">₹{result.totalCost}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FuelCalculator;
