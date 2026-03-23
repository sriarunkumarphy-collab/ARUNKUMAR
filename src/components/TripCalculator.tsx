import React, { useState } from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { calculateTripDetails } from '../utils/calculators';
import { Trip, FuelType } from '../types';
import { FUEL_CONFIGS } from '../constants';
import { motion } from 'motion/react';
import { Save, Calculator, MapPin, Fuel as FuelIcon, Navigation, IndianRupee, Gauge } from 'lucide-react';

const TripCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { settings, addTrip } = useFuel();

  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    distance: 0,
    fuelType: settings.defaultFuelType,
    fuelPrice: settings.fuelPrices[settings.defaultFuelType],
    mileage: 15,
    income: 0,
    tollCharges: 0,
    parkingCharges: 0,
    otherExpenses: 0,
  });

  const fuelConfig = FUEL_CONFIGS[formData.fuelType];

  const handleFuelTypeChange = (type: FuelType) => {
    setFormData({
      ...formData,
      fuelType: type,
      fuelPrice: settings.fuelPrices[type]
    });
  };

  const [result, setResult] = useState<any>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const details = calculateTripDetails(
      formData.distance,
      formData.fuelPrice,
      formData.mileage,
      formData.income,
      formData.tollCharges,
      formData.parkingCharges,
      formData.otherExpenses
    );
    setResult(details);
  };

  const handleSave = async () => {
    if (!result) return;

    const newTrip: Omit<Trip, 'id' | 'uid'> = {
      date: new Date().toISOString(),
      ...formData,
      ...result,
      vehicleId: 'default',
    };

    await addTrip(newTrip);
    alert('Trip saved successfully!');
    setResult(null);
    setFormData({
      ...formData,
      startLocation: '',
      destination: '',
      distance: 0,
      income: 0,
      tollCharges: 0,
      parkingCharges: 0,
      otherExpenses: 0,
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Trip Calculator</h2>
      </header>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">From Location</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E88E5]" />
              <input 
                type="text" 
                value={formData.startLocation}
                onChange={e => setFormData({...formData, startLocation: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition-all dark:text-white text-base"
                placeholder="Enter start point"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">To Location</label>
            <div className="relative">
              <Navigation size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E88E5]" />
              <input 
                type="text" 
                value={formData.destination}
                onChange={e => setFormData({...formData, destination: e.target.value})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition-all dark:text-white text-base"
                placeholder="Enter destination"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Distance (km)</label>
            <div className="relative">
              <Navigation size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E88E5] rotate-90" />
              <input 
                type="number" 
                value={formData.distance || ''}
                onChange={e => setFormData({...formData, distance: Number(e.target.value)})}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition-all dark:text-white text-base"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Fuel Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(FUEL_CONFIGS) as FuelType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleFuelTypeChange(type)}
                  className={`py-3 rounded-2xl text-[10px] font-bold border transition-all ${
                    formData.fuelType === type 
                      ? `bg-[#1E88E5] border-[#1E88E5] text-white shadow-lg shadow-blue-200` 
                      : 'bg-zinc-50 dark:bg-zinc-800 border-transparent text-zinc-500'
                  }`}
                >
                  {FUEL_CONFIGS[type].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Fuel Price (₹)</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E88E5]" />
                <input 
                  type="number" 
                  value={formData.fuelPrice || ''}
                  onChange={e => setFormData({...formData, fuelPrice: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition-all dark:text-white text-base"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Mileage</label>
              <div className="relative">
                <Gauge size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E88E5]" />
                <input 
                  type="number" 
                  value={formData.mileage || ''}
                  onChange={e => setFormData({...formData, mileage: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition-all dark:text-white text-base"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Income (₹)</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E88E5]" />
              <input 
                type="number" 
                value={formData.income || ''}
                onChange={e => setFormData({...formData, income: Number(e.target.value)})}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-[#1E88E5] outline-none transition-all dark:text-white text-base"
                placeholder="0"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-none text-lg mt-4"
          >
            CALCULATE
          </button>
        </form>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-zinc-100 dark:border-zinc-800"
          >
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium">Fuel Needed:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{result.fuelUsed} {fuelConfig.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium">Total Cost:</span>
                <span className="font-bold text-zinc-900 dark:text-white">₹{result.fuelCost}</span>
              </div>
              {formData.income > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 font-medium">Net Profit:</span>
                  <span className={`font-bold ${result.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ₹{result.netProfit}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-medium">Cost per KM:</span>
                <span className="font-bold text-[#1E88E5]">₹{(result.fuelCost / formData.distance).toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              className="mt-4 w-full flex items-center justify-center gap-2 text-[#1E88E5] font-bold py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
            >
              <Save size={18} />
              Save Trip
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TripCalculator;
