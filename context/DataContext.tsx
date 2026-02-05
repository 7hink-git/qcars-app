import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CARS, EXTRAS, UI_TRANSLATIONS } from '../constants';
import { Car, Booking, BookingExtra, DiscountRule, CompanySettings } from '../types';

interface DataContextType {
  cars: Car[];
  bookings: Booking[];
  settings: CompanySettings;
  extras: BookingExtra[];
  discountRules: DiscountRule[];
  
  // Actions
  addCar: (car: Car) => void;
  updateCar: (car: Car) => void;
  deleteCar: (id: string) => void;
  
  updateSettings: (settings: CompanySettings) => void;
  
  addExtra: (extra: BookingExtra) => void;
  deleteExtra: (id: string) => void;
  
  addDiscountRule: (rule: DiscountRule) => void;
  deleteDiscountRule: (id: string) => void;
  
  refreshBookings: () => void;
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "Q Cars",
  whatsappNumber: "971502990802",
  contactEmail: "info@qcars.com",
  currency: "AED",
  primaryColor: "#4F46E5",
  
  // Hero Defaults
  heroTitle1: "Drive the",
  heroTitle1_ar: "قُد",
  heroTitle2: "Extraordinary.",
  heroTitle2_ar: "الاستثنائي.",
  heroSubtitle: "Experience the perfect blend of performance and luxury. Your journey begins with the perfect vehicle.",
  heroSubtitle_ar: "استمتع بمزيج مثالي من الأداء والفخامة. رحلتك تبدأ بالسيارة المثالية.",
  heroBadge: "Premium Fleet 2024",
  heroBadge_ar: "أسطول النخبة ٢٠٢٤",

  // Trust Defaults
  trustTitle: "Why Choose Us",
  trustTitle_ar: "لماذا تختارنا",
  trustFeatures: [
    {
      id: 't1',
      icon: 'Shield',
      title: "Comprehensive Coverage",
      title_ar: "تغطية شاملة",
      description: "Drive with confidence knowing you're fully covered.",
      description_ar: "قُد بثقة مع العلم أنك مغطى بالكامل."
    },
    {
      id: 't2',
      icon: 'Sparkles',
      title: "Premium Condition",
      title_ar: "حالة ممتازة",
      description: "Every vehicle is meticulously detailed and inspected.",
      description_ar: "يتم تفصيل وفحص كل مركبة بدقة."
    },
    {
      id: 't3',
      icon: 'Phone',
      title: "24/7 Concierge",
      title_ar: "كونسيرج ٢٤/٧",
      description: "Our dedicated team is available round-the-clock.",
      description_ar: "فريقنا المخصص متاح على مدار الساعة."
    }
  ],

  // Card Config Defaults
  cardConfig: {
    showYear: true,
    showBrand: true,
    showRating: true,
    showPrice: true,
    showAvailability: true,
    showHighlight: true,
    showSpecs: true,
  },

  // Details Page Defaults
  detailsLabels: {
    specsTitle: "Vehicle Specifications",
    specsTitle_ar: "مواصفات المركبة",
    featuresTitle: "Premium Features",
    featuresTitle_ar: "ميزات مميزة",
    rentalConditionsTitle: "Rental Conditions",
    rentalConditionsTitle_ar: "شروط التأجير",
    bookingPanelTitle: "Daily Rate",
    bookingPanelTitle_ar: "السعر اليومي"
  }
};

const DEFAULT_DISCOUNTS: DiscountRule[] = [
  { id: 'd1', minDays: 3, percentageOff: 0.05, label: '3+ Days Deal' },
  { id: 'd2', minDays: 7, percentageOff: 0.10, label: 'Weekly Offer' },
  { id: 'd3', minDays: 14, percentageOff: 0.15, label: '2 Week Special' },
  { id: 'd4', minDays: 30, percentageOff: 0.25, label: 'Monthly Plan' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem('cms_fleet');
    return saved ? JSON.parse(saved) : CARS;
  });

  // Migration logic for settings: if old format exists, merge with new defaults
  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('cms_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist if loading old data
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    return DEFAULT_SETTINGS;
  });

  const [extras, setExtras] = useState<BookingExtra[]>(() => {
    const saved = localStorage.getItem('cms_extras');
    return saved ? JSON.parse(saved) : EXTRAS;
  });

  const [discountRules, setDiscountRules] = useState<DiscountRule[]>(() => {
    const saved = localStorage.getItem('cms_discounts');
    return saved ? JSON.parse(saved) : DEFAULT_DISCOUNTS;
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('cms_fleet', JSON.stringify(cars)); }, [cars]);
  useEffect(() => { localStorage.setItem('cms_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('cms_extras', JSON.stringify(extras)); }, [extras]);
  useEffect(() => { localStorage.setItem('cms_discounts', JSON.stringify(discountRules)); }, [discountRules]);

  // --- BOOKING SYNC ---
  const refreshBookings = () => {
    const usersStr = localStorage.getItem('q_cars_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const allBookings = users.flatMap((u: any) => 
        u.bookings.map((b: any) => ({...b, userName: u.name, userEmail: u.email}))
      );
      setBookings(allBookings);
    }
  };

  useEffect(() => {
    refreshBookings();
    window.addEventListener('storage', refreshBookings);
    return () => window.removeEventListener('storage', refreshBookings);
  }, []);

  // --- ACTIONS ---
  const addCar = (car: Car) => setCars(prev => [car, ...prev]);
  const updateCar = (updatedCar: Car) => setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
  const deleteCar = (id: string) => setCars(prev => prev.filter(c => c.id !== id));
  const updateSettings = (newSettings: CompanySettings) => setSettings(newSettings);
  const addExtra = (extra: BookingExtra) => setExtras(prev => [...prev, extra]);
  const deleteExtra = (id: string) => setExtras(prev => prev.filter(e => e.id !== id));
  const addDiscountRule = (rule: DiscountRule) => setDiscountRules(prev => [...prev, rule].sort((a,b) => a.minDays - b.minDays));
  const deleteDiscountRule = (id: string) => setDiscountRules(prev => prev.filter(d => d.id !== id));

  return (
    <DataContext.Provider value={{ 
      cars, bookings, settings, extras, discountRules,
      addCar, updateCar, deleteCar,
      updateSettings,
      addExtra, deleteExtra,
      addDiscountRule, deleteDiscountRule,
      refreshBookings
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