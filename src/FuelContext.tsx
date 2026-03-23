import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, UserSettings, DashboardStats, FuelType } from './types';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface FuelContextType {
  trips: Trip[];
  settings: UserSettings;
  stats: DashboardStats;
  user: User | null;
  loading: boolean;
  addTrip: (trip: Omit<Trip, 'id' | 'uid'>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

const FuelContext = createContext<FuelContextType | undefined>(undefined);

export const FuelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>({
    currency: '₹',
    defaultFuelType: 'petrol',
    fuelPrices: {
      petrol: 100,
      diesel: 90,
      cng: 80,
      lpg: 70
    },
    darkMode: false,
    language: 'en',
    uid: ''
  });

  useEffect(() => {
    // Initial loading timeout if auth state doesn't resolve
    const authTimeout = setTimeout(() => {
      if (loading && !user) {
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      clearTimeout(authTimeout);
      setUser(u);
      if (!u) {
        setTrips([]);
        setLoading(false);
      }
    });
    return () => {
      clearTimeout(authTimeout);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      const path = `settings/${user.uid}`;
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', user.uid));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          // Ensure fuelPrices exists for backward compatibility
          const mergedSettings: UserSettings = {
            currency: data.currency || '₹',
            defaultFuelType: data.defaultFuelType || 'petrol',
            darkMode: data.darkMode ?? false,
            language: data.language || 'en',
            uid: user.uid,
            fuelPrices: {
              petrol: 100,
              diesel: 90,
              cng: 80,
              lpg: 70,
              ...(data.fuelPrices || {})
            }
          };
          setSettings(mergedSettings);
        } else {
          const defaultSettings: UserSettings = {
            currency: '₹',
            defaultFuelType: 'petrol',
            fuelPrices: {
              petrol: 100,
              diesel: 90,
              cng: 80,
              lpg: 70
            },
            darkMode: false,
            language: 'en',
            uid: user.uid
          };
          try {
            await setDoc(doc(db, 'settings', user.uid), defaultSettings);
          } catch (e) {
            console.error("Failed to save default settings:", e);
          }
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        // Don't throw here to avoid blocking the app, just use defaults
      }
    };

    fetchSettings();

    const path = 'trips';
    const q = query(collection(db, 'trips'), where('uid', '==', user.uid));
    
    // Safety timeout for loading state
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10 seconds timeout

    const unsubscribe = onSnapshot(q, (snapshot) => {
      clearTimeout(timeoutId);
      const tripList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Trip[];
      setTrips(tripList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoading(false);
    }, (error) => {
      clearTimeout(timeoutId);
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const addTrip = async (tripData: Omit<Trip, 'id' | 'uid'>) => {
    if (!user) return;
    const path = 'trips';
    try {
      await addDoc(collection(db, 'trips'), {
        ...tripData,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!user) return;
    const path = `trips/${id}`;
    try {
      await deleteDoc(doc(db, 'trips', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;
    const path = `settings/${user.uid}`;
    try {
      const updated = { ...settings, ...newSettings, uid: user.uid };
      await setDoc(doc(db, 'settings', user.uid), updated);
      setSettings(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const stats: DashboardStats = {
    totalTrips: trips.length,
    totalDistance: trips.reduce((acc, t) => acc + t.distance, 0),
    totalFuelUsed: trips.reduce((acc, t) => acc + t.fuelUsed, 0),
    totalExpense: trips.reduce((acc, t) => acc + t.totalExpense, 0),
    totalProfit: trips.reduce((acc, t) => acc + t.netProfit, 0),
    fuelWiseStats: trips.reduce((acc, t) => {
      const type = t.fuelType || 'petrol';
      if (!acc[type]) {
        acc[type] = { distance: 0, cost: 0, trips: 0 };
      }
      acc[type].distance += t.distance;
      acc[type].cost += t.fuelCost;
      acc[type].trips += 1;
      return acc;
    }, {
      petrol: { distance: 0, cost: 0, trips: 0 },
      diesel: { distance: 0, cost: 0, trips: 0 },
      cng: { distance: 0, cost: 0, trips: 0 },
      lpg: { distance: 0, cost: 0, trips: 0 }
    } as Record<FuelType, { distance: number; cost: number; trips: number; }>)
  };

  return (
    <FuelContext.Provider value={{ trips, settings, stats, user, loading, addTrip, deleteTrip, updateSettings }}>
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) throw new Error('useFuel must be used within a FuelProvider');
  return context;
};
