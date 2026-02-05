import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CARS, EXTRAS } from '../constants';
import { Car, Booking, BookingExtra, DiscountRule, CompanySettings } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  cars: Car[];
  bookings: Booking[];
  settings: CompanySettings;
  extras: BookingExtra[];
  discountRules: DiscountRule[];
  
  // Actions
  addCar: (car: Car) => Promise<void>;
  updateCar: (car: Car) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  
  updateSettings: (settings: CompanySettings) => Promise<void>;
  
  addExtra: (extra: BookingExtra) => void;
  deleteExtra: (id: string) => void;
  
  addDiscountRule: (rule: DiscountRule) => void;
  deleteDiscountRule: (id: string) => void;
  
  refreshBookings: () => void;
  loading: boolean;
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "Q Cars",
  whatsappNumber: "971502990802",
  contactEmail: "info@qcars.com",
  currency: "AED",
  primaryColor: "#4F46E5",
  heroTitle1: "Drive the",
  heroTitle1_ar: "قُد",
  heroTitle2: "Extraordinary.",
  heroTitle2_ar: "الاستثنائي.",
  heroSubtitle: "Experience the perfect blend of performance and luxury.",
  heroSubtitle_ar: "استمتع بمزيج مثالي من الأداء والفخامة.",
  heroBadge: "Premium Fleet 2024",
  heroBadge_ar: "أسطول النخبة ٢٠٢٤",
  trustTitle: "Why Choose Us",
  trustTitle_ar: "لماذا تختارنا",
  trustFeatures: [],
  cardConfig: {
    showYear: true, showBrand: true, showRating: true, showPrice: true, 
    showAvailability: true, showHighlight: true, showSpecs: true,
  },
  detailsLabels: {
    specsTitle: "Vehicle Specifications", specsTitle_ar: "مواصفات المركبة",
    featuresTitle: "Premium Features", featuresTitle_ar: "ميزات مميزة",
    rentalConditionsTitle: "Rental Conditions", rentalConditionsTitle_ar: "شروط التأجير",
    bookingPanelTitle: "Daily Rate", bookingPanelTitle_ar: "السعر اليومي"
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  
  // These remain local for now for simplicity, or can be moved to DB tables similarly
  const [extras, setExtras] = useState<BookingExtra[]>(EXTRAS);
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // --- FETCH DATA FROM SUPABASE ---
  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Cars
    const { data: carsData, error: carsError } = await supabase.from('cars').select('*');
    if (!carsError && carsData) {
      const formattedCars: Car[] = carsData.map((row: any) => ({
        id: row.id,
        name: row.name,
        brand: row.brand,
        year: row.year,
        type: row.type,
        pricePerDay: row.price_per_day,
        image: row.image,
        isAvailable: row.is_available,
        ...row.data // Spread the JSONB column for details
      }));
      setCars(formattedCars.length > 0 ? formattedCars : CARS); // Fallback to mocks if DB empty
    } else {
        setCars(CARS); // Fallback on error (or if no env vars set)
    }

    // 2. Fetch Settings
    const { data: settingsData } = await supabase.from('settings').select('*').single();
    if (settingsData) {
      setSettings({
        companyName: settingsData.company_name,
        ...settingsData.config
      });
    }

    // 3. Fetch Bookings
    const { data: bookingsData } = await supabase.from('bookings').select('*');
    if (bookingsData) {
      const formattedBookings: Booking[] = bookingsData.map((b: any) => ({
         id: b.id,
         carId: b.car_id,
         carName: 'Unknown', // In a real app, you'd join tables
         carImage: '',
         startDate: b.start_date,
         endDate: b.end_date,
         totalPrice: b.total_price,
         status: b.status,
         extras: b.extras || [],
         bookedAt: b.created_at,
         userName: b.user_name,
         userEmail: b.user_email
      }));
      setBookings(formattedBookings);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ACTIONS (Write to DB) ---
  
  const addCar = async (car: Car) => {
    // Optimistic Update
    setCars(prev => [car, ...prev]);

    // DB Insert
    // Extract properties that map to DB columns, the rest go to 'data' JSONB column
    const { 
      id, name, brand, year, type, pricePerDay, image, isAvailable, 
      ...jsonContent 
    } = car;
    
    await supabase.from('cars').insert({
      id: id.length < 10 ? undefined : id, // Let DB generate ID if it's a temp one
      name,
      brand,
      year,
      type,
      price_per_day: pricePerDay,
      image,
      is_available: isAvailable,
      data: jsonContent // Store the rest (specs, features) in JSONB
    });
    
    fetchData(); // Refresh to get real ID
  };

  const updateCar = async (updatedCar: Car) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
    
    const { 
      id, name, brand, year, type, pricePerDay, image, isAvailable, 
      ...jsonContent 
    } = updatedCar;
    
    await supabase.from('cars').update({
      name,
      brand,
      year,
      type,
      image,
      price_per_day: pricePerDay,
      is_available: isAvailable,
      data: jsonContent
    }).eq('id', id);
  };

  const deleteCar = async (id: string) => {
    setCars(prev => prev.filter(c => c.id !== id));
    await supabase.from('cars').delete().eq('id', id);
  };

  const updateSettings = async (newSettings: CompanySettings) => {
    setSettings(newSettings);
    const { companyName, ...config } = newSettings;
    
    // Check if row exists, if not insert
    const { data } = await supabase.from('settings').select('id').single();
    
    if (data) {
        await supabase.from('settings').update({
            company_name: companyName,
            config: config
        }).eq('id', 1);
    } else {
        await supabase.from('settings').insert({
            id: 1,
            company_name: companyName,
            config: config
        });
    }
  };

  // Local-only actions for this demo (extras/discounts)
  const addExtra = (extra: BookingExtra) => setExtras(prev => [...prev, extra]);
  const deleteExtra = (id: string) => setExtras(prev => prev.filter(e => e.id !== id));
  const addDiscountRule = (rule: DiscountRule) => setDiscountRules(prev => [...prev, rule].sort((a,b) => a.minDays - b.minDays));
  const deleteDiscountRule = (id: string) => setDiscountRules(prev => prev.filter(d => d.id !== id));
  const refreshBookings = () => fetchData();

  return (
    <DataContext.Provider value={{ 
      cars, bookings, settings, extras, discountRules,
      addCar, updateCar, deleteCar,
      updateSettings,
      addExtra, deleteExtra,
      addDiscountRule, deleteDiscountRule,
      refreshBookings,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};