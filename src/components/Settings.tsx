import React from 'react';
import { useFuel } from '../FuelContext';
import { useTranslation } from 'react-i18next';
import { FuelType } from '../types';
import { FUEL_CONFIGS } from '../constants';
import { Moon, Sun, Globe, IndianRupee, Fuel as FuelIcon, Cylinder } from 'lucide-react';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useFuel();

  const handleLanguageChange = (lang: 'en' | 'ta') => {
    i18n.changeLanguage(lang);
    updateSettings({ language: lang });
  };

  const handleFuelPriceChange = (type: FuelType, price: number) => {
    const newPrices = { ...settings.fuelPrices, [type]: price };
    updateSettings({ fuelPrices: newPrices });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{t('settings')}</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Personalize your experience and app defaults.</p>
      </header>

      <div className="space-y-4">
        {/* Appearance */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">{t('darkMode')}</p>
                <p className="text-xs text-zinc-500">Toggle between light and dark themes</p>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.darkMode ? 'bg-blue-600' : 'bg-zinc-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Localization */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Localization</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{t('language')}</p>
                  <p className="text-xs text-zinc-500">Choose your preferred language</p>
                </div>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'ta')}
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm outline-none dark:text-white"
              >
                <option value="en">{t('english')}</option>
                <option value="ta">{t('tamil')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                  <IndianRupee size={20} />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{t('currency')}</p>
                  <p className="text-xs text-zinc-500">Set your default currency symbol</p>
                </div>
              </div>
              <input 
                type="text" 
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
                className="w-16 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm text-center outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Defaults */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-6">App Defaults</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                  <FuelIcon size={20} />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Default Fuel Type</p>
                  <p className="text-xs text-zinc-500">Preferred fuel for calculators</p>
                </div>
              </div>
              <select 
                value={settings.defaultFuelType}
                onChange={(e) => updateSettings({ defaultFuelType: e.target.value as FuelType })}
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm outline-none dark:text-white"
              >
                {(Object.keys(FUEL_CONFIGS) as FuelType[]).map(type => (
                  <option key={type} value={type}>{FUEL_CONFIGS[type].label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Default Fuel Prices</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(FUEL_CONFIGS) as FuelType[]).map(type => (
                  <div key={type} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${FUEL_CONFIGS[type].color}-500`} />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{FUEL_CONFIGS[type].label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{settings.currency}</span>
                      <input 
                        type="number" 
                        value={settings.fuelPrices[type]}
                        onChange={(e) => handleFuelPriceChange(type, Number(e.target.value))}
                        className="w-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm outline-none dark:text-white text-right"
                      />
                      <span className="text-[10px] text-zinc-400">/{FUEL_CONFIGS[type].unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
