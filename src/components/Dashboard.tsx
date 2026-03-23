import React from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { FuelType } from '../types';
import { FUEL_CONFIGS } from '../constants';
import { 
  Car, 
  Route, 
  Fuel as FuelIcon, 
  IndianRupee, 
  TrendingUp,
  MapPin,
  Calendar,
  Zap,
  Cylinder
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { motion } from 'motion/react';

const Dashboard: React.FC = () => {
  const { stats, trips, settings } = useFuel();
  const { t } = useTranslation();

  const summaryCards = [
    { label: t('totalTrips'), value: stats.totalTrips, icon: Car, color: 'bg-blue-500' },
    { label: t('totalDistance'), value: `${stats.totalDistance.toLocaleString()} km`, icon: Route, color: 'bg-emerald-500' },
    { label: t('totalExpense'), value: `${settings.currency}${stats.totalExpense.toLocaleString()}`, icon: IndianRupee, color: 'bg-rose-500' },
    { label: t('totalProfit'), value: `${settings.currency}${stats.totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const fuelStats = (Object.keys(FUEL_CONFIGS) as FuelType[]).map(type => ({
    type,
    ...FUEL_CONFIGS[type],
    ...(stats.fuelWiseStats?.[type] || { distance: 0, cost: 0, trips: 0 })
  })).filter(s => s.trips > 0);

  const mostUsedFuel = fuelStats.length > 0 ? [...fuelStats].sort((a, b) => b.trips - a.trips)[0] : null;

  const cheapestFuel = (Object.keys(FUEL_CONFIGS) as FuelType[]).map(type => ({
    type,
    label: FUEL_CONFIGS[type].label,
    price: settings.fuelPrices?.[type] ?? 0,
    unit: FUEL_CONFIGS[type].unit
  })).sort((a, b) => a.price - b.price)[0];

  // Prepare chart data
  const chartData = trips.slice(0, 7).reverse().map(t => ({
    date: new Date(t.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
    profit: t.netProfit,
    expense: t.totalExpense,
    distance: t.distance
  }));

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('dashboard')}</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome back! Here's your performance summary.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={card.label}
            className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`${card.color} p-1.5 lg:p-2 rounded-lg text-white`}>
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-[10px] lg:text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{card.label}</p>
            <h3 className="text-lg lg:text-2xl font-bold text-zinc-900 dark:text-white mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Fuel Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Fuel Usage Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fuelStats.length > 0 ? fuelStats.map((s, i) => (
              <div key={s.type} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div className={`p-3 rounded-lg bg-${s.color}-500 text-white`}>
                  {s.unit === 'L' ? <FuelIcon size={20} /> : <Cylinder size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-zinc-900 dark:text-white">{s.label}</p>
                    <p className="text-xs text-zinc-500">{s.trips} Trips</p>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-xs text-zinc-500">{s.distance.toLocaleString()} km</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{settings.currency}{s.cost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-8 text-center text-zinc-500">No fuel data available.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-200 dark:shadow-none">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className="text-orange-100" />
              <h3 className="font-bold uppercase tracking-wider text-xs text-orange-100">Smart Suggestion</h3>
            </div>
            <p className="text-sm opacity-90 mb-4">Based on current prices, <span className="font-bold">{cheapestFuel.label}</span> is your cheapest option at <span className="font-bold">{settings.currency}{cheapestFuel.price}/{cheapestFuel.unit}</span>.</p>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <p className="text-[10px] uppercase font-bold opacity-70">Most Used Fuel</p>
              <p className="text-lg font-bold">{mostUsedFuel ? mostUsedFuel.label : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Profit vs Expense</h3>
          <div className="h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} name="Profit" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Distance Traveled (km)</h3>
          <div className="h-[250px] lg:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="distance" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="Distance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
