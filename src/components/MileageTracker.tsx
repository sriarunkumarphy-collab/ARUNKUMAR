import React, { useState } from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { FUEL_CONFIGS } from '../constants';
import { Trash2, Calendar, MapPin, Fuel as FuelIcon, IndianRupee, Plus, BarChart3, ArrowRight, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MileageTracker: React.FC = () => {
  const { t } = useTranslation();
  const { trips, deleteTrip, settings } = useFuel();
  const [showGraph, setShowGraph] = useState(false);

  const chartData = trips.slice(-7).map(trip => ({
    date: new Date(trip.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    cost: trip.totalCost,
    profit: trip.netProfit
  }));

  return (
    <div className="max-w-md mx-auto pb-24 space-y-6">
      <header className="text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Mileage Tracker</h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <button 
          className="flex items-center justify-center gap-2 py-3 bg-[#1E88E5] text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('switchTab', { detail: 'trip-calculator' }));
          }}
        >
          <Plus size={18} />
          ADD TRIP
        </button>
        <button 
          className="flex items-center justify-center gap-2 py-3 bg-[#FF9800] text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
          onClick={() => setShowGraph(!showGraph)}
        >
          <BarChart3 size={18} />
          {showGraph ? 'VIEW LIST' : 'GRAPH'}
        </button>
      </div>

      {!showGraph && trips.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Cost</p>
            <p className="text-lg font-black text-zinc-900 dark:text-white">₹{trips.reduce((acc, t) => acc + (t.totalCost || 0), 0).toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Profit</p>
            <p className={`text-lg font-black ${trips.reduce((acc, t) => acc + (t.netProfit || 0), 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{trips.reduce((acc, t) => acc + (t.netProfit || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {showGraph ? (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800"
          >
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Profit vs Cost Trend</h3>
            <div className="h-64 w-full">
              {trips.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Bar dataKey="cost" name="Cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
                  Add trips to see the chart
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {trips.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 p-10 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center text-zinc-500">
                No trips recorded yet.
              </div>
            ) : (
              trips.map((trip) => {
                const fuelConfig = FUEL_CONFIGS[trip.fuelType || 'petrol'];
                return (
                  <motion.div
                    layout
                    key={trip.id}
                    className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-zinc-50 dark:border-zinc-800 pb-3">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <Calendar size={14} />
                        <span className="text-xs font-semibold">
                          {new Date(trip.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteTrip(trip.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm">
                          <MapPin size={14} className="text-blue-500" />
                          <span className="truncate">{trip.startLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm mt-1">
                          <MapPin size={14} className="text-orange-500" />
                          <span className="truncate">{trip.destination}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">{trip.distance}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">KM</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-50 dark:border-zinc-800">
                      <div className="flex flex-col items-center text-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Fuel</p>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{trip.fuelUsed} {fuelConfig.unit}</p>
                      </div>
                      <div className="flex flex-col items-center text-center border-x border-zinc-50 dark:border-zinc-800 px-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Cost</p>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">₹{trip.totalCost}</p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Profit</p>
                        <p className={`text-xs font-bold ${trip.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ₹{trip.netProfit}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MileageTracker;
