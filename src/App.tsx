import React, { useState } from 'react';
import { FuelProvider, useFuel } from './FuelContext';
import BottomNav from './components/BottomNav';
import TripCalculator from './components/TripCalculator';
import FuelCalculator from './components/FuelCalculator';
import MileageTracker from './components/MileageTracker';
import ProfitCalculator from './components/ProfitCalculator';
import Settings from './components/Settings';
import './i18n';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { signIn } from './firebase';
import { Loader2, Settings as SettingsIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MainApp: React.FC = () => {
  const { user, loading, settings } = useFuel();
  const [activeTab, setActiveTab] = useState('trip-calculator');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && !user && !error) {
      signIn().catch((err: any) => {
        console.error("Sign-in error:", err);
        setError(err.message || "Failed to sign in anonymously. Please ensure Anonymous Auth is enabled in the Firebase Console.");
      });
    }
  }, [loading, user, error]);

  React.useEffect(() => {
    const handleSwitchTab = (e: any) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('switchTab', handleSwitchTab);
    return () => window.removeEventListener('switchTab', handleSwitchTab);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-center">
          <h2 className="text-xl font-bold text-rose-600 mb-4">Connection Error</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
          <p className="text-zinc-500 font-medium">Loading DriveCost...</p>
          <p className="text-zinc-400 text-xs mt-2">Connecting to Firebase... This may take a moment.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'trip-calculator':
        return <TripCalculator />;
      case 'fuel-calculator':
        return <FuelCalculator />;
      case 'mileage-tracker':
        return <MileageTracker />;
      case 'profit-calculator':
        return <ProfitCalculator />;
      case 'settings':
        return <Settings />;
      default:
        return <TripCalculator />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-300 pb-20",
      settings.darkMode && "dark"
    )}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1E88E5] rounded-lg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white">DriveCost</h1>
        </div>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "p-2 rounded-lg transition-all",
            activeTab === 'settings' ? "bg-blue-50 text-blue-600" : "text-zinc-500 hover:bg-zinc-100"
          )}
        >
          <SettingsIcon size={20} />
        </button>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FuelProvider>
        <MainApp />
      </FuelProvider>
    </ErrorBoundary>
  );
};

export default App;
