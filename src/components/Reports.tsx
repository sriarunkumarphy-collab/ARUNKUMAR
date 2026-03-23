import React, { useState, useMemo } from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Download, 
  Printer, 
  ChevronLeft, 
  Calendar, 
  TrendingUp, 
  IndianRupee, 
  MapPin,
  Filter,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const { trips, settings, stats: fuelStats } = useFuel();
  const [view, setView] = useState<'overview' | 'detailed'>('overview');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const stats = useMemo(() => {
    const totalDistance = trips.reduce((acc, t) => acc + t.distance, 0);
    const totalFuel = trips.reduce((acc, t) => acc + t.fuelUsed, 0);
    const totalCost = trips.reduce((acc, t) => acc + t.totalCost, 0);
    const avgMileage = totalDistance > 0 ? (totalDistance / totalFuel).toFixed(2) : '0';
    
    return {
      totalDistance,
      totalFuel: totalFuel.toFixed(2),
      totalCost: totalCost.toFixed(2),
      avgMileage
    };
  }, [trips]);

  const chartData = useMemo(() => {
    // Simple grouping by date for the last 7 entries
    return trips.slice(-7).map(t => ({
      name: new Date(t.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      cost: t.totalCost,
      distance: t.distance
    }));
  }, [trips]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Fuel & Trip Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = trips.map(t => [
      new Date(t.date).toLocaleDateString(),
      `${t.startLocation} to ${t.destination}`,
      `${t.distance} km`,
      `${t.fuelUsed} L`,
      `Rs.${t.totalCost}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Route', 'Distance', 'Fuel', 'Cost']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 136, 229] }
    });

    doc.save('fuel-report.pdf');
  };

  return (
    <div className="max-w-md mx-auto pb-24 space-y-6">
      <header className="flex items-center justify-between">
        {view === 'detailed' && (
          <button 
            onClick={() => setView('overview')}
            className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex-1 text-center">
          {view === 'overview' ? 'Reports' : 'Detailed Report'}
        </h2>
        {view === 'detailed' && (
          <div className="flex gap-2">
            <button onClick={exportPDF} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
              <Download size={20} />
            </button>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {view === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Time Filter */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              {(['daily', 'weekly', 'monthly'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    timeFilter === f 
                      ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' 
                      : 'text-zinc-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Chart Card */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-500" />
                  Trip Costs
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Last 7 Trips</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#1E88E5' : '#93c5fd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Report Options */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setView('detailed')}
                className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 text-left transition-all active:scale-95"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Full Activity Report</h4>
                  <p className="text-xs text-zinc-500">Detailed breakdown of all your trips</p>
                </div>
                <ChevronLeft size={20} className="rotate-180 text-zinc-300" />
              </button>

              <button className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 text-left transition-all active:scale-95">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <Filter size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white">Custom Filter</h4>
                  <p className="text-xs text-zinc-500">Filter by date, fuel type, or route</p>
                </div>
                <ChevronLeft size={20} className="rotate-180 text-zinc-300" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Distance</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.totalDistance} <span className="text-xs font-normal text-zinc-500">km</span></p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Cost</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">₹{stats.totalCost}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Fuel</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.totalFuel} <span className="text-xs font-normal text-zinc-500">L</span></p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Avg Mileage</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">{stats.avgMileage} <span className="text-xs font-normal text-zinc-500">km/L</span></p>
              </div>
            </div>

            {/* Trip List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white px-1">Trip Details</h3>
              {trips.map((trip) => (
                <div key={trip.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{trip.startLocation} → {trip.destination}</p>
                    <p className="text-[10px] text-zinc-500">{new Date(trip.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600">₹{trip.totalCost}</p>
                    <p className="text-[10px] text-zinc-400">{trip.distance} km</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
