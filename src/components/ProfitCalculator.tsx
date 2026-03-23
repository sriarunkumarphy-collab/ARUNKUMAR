import React, { useState, useEffect } from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { calculateTripDetails } from '../utils/calculators';
import { FuelType } from '../types';
import { FUEL_CONFIGS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  IndianRupee, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Save, 
  Gauge, 
  MapPin, 
  Fuel as FuelIcon,
  CircleDollarSign,
  ParkingCircle,
  Receipt
} from 'lucide-react';

const ProfitCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { settings, addTrip } = useFuel();

  const [formData, setFormData] = useState({
    income: 0,
    distance: 0,
    fuelType: settings.defaultFuelType,
    fuelPrice: settings.fuelPrices[settings.defaultFuelType],
    mileage: 15,
    tolls: 0,
    parking: 0,
    others: 0,
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fuelPrice: settings.fuelPrices[formData.fuelType]
    }));
  }, [formData.fuelType, settings.fuelPrices]);

  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const details = calculateTripDetails(
      formData.distance,
      formData.fuelPrice,
      formData.mileage,
      formData.income,
      formData.tolls,
      formData.parking,
      formData.others
    );
    setResult(details);
  };

  const handleSave = async () => {
    if (!result) return;
    await addTrip({
      date: new Date().toISOString(),
      startLocation: 'Manual Entry',
      destination: 'Manual Entry',
      ...formData,
      ...result,
      vehicleId: 'default',
    });
    // Using a custom toast/modal instead of alert would be better, but keeping it simple for now
    setResult(null);
  };

  return (
    <div className="max-w-md mx-auto pb-24 space-y-6">
      <header className="text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Profit Calculator</h2>
      </header>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-5">
        {/* Income */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Income (₹)</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <CircleDollarSign size={18} />
            </div>
            <input 
              type="number" 
              value={formData.income || ''}
              onChange={e => setFormData({...formData, income: Number(e.target.value)})}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Distance & Mileage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Distance (km)</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <MapPin size={18} />
              </div>
              <input 
                type="number" 
                value={formData.distance || ''}
                onChange={e => setFormData({...formData, distance: Number(e.target.value)})}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Mileage</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Gauge size={18} />
              </div>
              <input 
                type="number" 
                value={formData.mileage || ''}
                onChange={e => setFormData({...formData, mileage: Number(e.target.value)})}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Fuel Type & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Fuel Type</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <FuelIcon size={18} />
              </div>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value as FuelType})}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white appearance-none"
              >
                {(Object.keys(FUEL_CONFIGS) as FuelType[]).map((type) => (
                  <option key={type} value={type}>
                    {FUEL_CONFIGS[type].label}
                  </option>
                ))}
              </select>
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
                value={formData.fuelPrice || ''}
                onChange={e => setFormData({...formData, fuelPrice: Number(e.target.value)})}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Other Expenses */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Tolls</label>
            <input 
              type="number" 
              value={formData.tolls || ''}
              onChange={e => setFormData({...formData, tolls: Number(e.target.value)})}
              placeholder="0"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Parking</label>
            <input 
              type="number" 
              value={formData.parking || ''}
              onChange={e => setFormData({...formData, parking: Number(e.target.value)})}
              placeholder="0"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Others</label>
            <input 
              type="number" 
              value={formData.others || ''}
              onChange={e => setFormData({...formData, others: Number(e.target.value)})}
              placeholder="0"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <button 
          onClick={handleCalculate}
          className="w-full py-4 bg-[#1E88E5] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
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
              className="mt-6 space-y-4"
            >
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Profit Analysis:</h3>
                  <div className={result.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                    {result.netProfit >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase">Net Profit</p>
                      <p className={`text-3xl font-black ${result.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ₹{result.netProfit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Profit / KM</p>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">₹{result.profitPerKm}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-100 dark:border-blue-800/50">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Total Exp.</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">₹{result.totalExpense}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Fuel Cost</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">₹{result.fuelCost}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-4 bg-[#FF9800] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                SAVE TRIP
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfitCalculator;
