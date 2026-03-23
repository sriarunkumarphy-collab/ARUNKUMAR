import React from 'react';
import { 
  Car, 
  Fuel, 
  TrendingUp, 
  IndianRupee 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'trip-calculator', label: 'Trip', icon: Car },
    { id: 'fuel-calculator', label: 'Fuel', icon: Fuel },
    { id: 'mileage-tracker', label: 'Track', icon: TrendingUp },
    { id: 'profit-calculator', label: 'Profit', icon: IndianRupee },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 z-50 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className="flex flex-col items-center gap-1 transition-all duration-200"
        >
          <div className={cn(
            "p-2 rounded-xl transition-all",
            activeTab === item.id 
              ? "text-[#1E88E5]" 
              : "text-zinc-400"
          )}>
            <item.icon size={24} />
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            activeTab === item.id ? "text-[#1E88E5]" : "text-zinc-400"
          )}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
