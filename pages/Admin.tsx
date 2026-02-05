import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Car, DiscountRule, BookingExtra, TrustFeature } from '../types';
import { 
  LayoutDashboard, Car as CarIcon, LogOut, 
  Lock, Plus, Edit2, Trash2, Save, X, Settings, Upload, Tag, Briefcase,
  AlertCircle, CheckCircle2, XCircle, LayoutTemplate, Type, MousePointerClick, 
  Globe, Shield, Zap, Star, Phone, Award, Sparkles, CheckCircle, Palette,
  Gauge, Fuel, Users, Clock, Wind, Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CAR_COLORS } from '../constants';

// Initial Empty States
const EMPTY_CAR: Car = {
  id: '',
  name: '',
  brand: '',
  year: 2024,
  type: 'Sedan',
  pricePerDay: 0,
  image: '',
  gallery: [],
  seats: 4,
  transmission: 'Automatic',
  fuel: 'Petrol',
  features: [],
  extraConditions: [],
  description: '',
  rating: 5,
  highlight: '',
  color: 'Alpine White',
  colorHex: '#F8FAFC',
  isAvailable: true,
  weeklyDiscount: 10,
  monthlyDiscount: 25,
  specs: { engine: '', horsepower: 0, acceleration: '', topSpeed: '' },
  rentalTerms: { mileageLimit: '', deposit: 0, insurance: 'Standard' }
};

const AVAILABLE_ICONS = [
  { value: 'Shield', label: 'Shield' },
  { value: 'Zap', label: 'Lightning' },
  { value: 'Star', label: 'Star' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Award', label: 'Award' },
  { value: 'Sparkles', label: 'Sparkles' },
  { value: 'CheckCircle', label: 'Check' },
];

const BASIC_PALETTE = [
  '#000000', '#FFFFFF', '#C0C0C0', '#334155', 
  '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'
];

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'fleet' | 'offers' | 'extras'>('overview');
  const [cmsSection, setCmsSection] = useState<'home' | 'cards' | 'details'>('home');
  
  // Context Data
  const { 
    cars, bookings, settings, extras, discountRules,
    addCar, updateCar, deleteCar,
    updateSettings,
    addExtra, deleteExtra,
    addDiscountRule, deleteDiscountRule,
    refreshBookings 
  } = useData();
  
  const { formatPrice } = useLanguage();
  const navigate = useNavigate();

  // Local Editor States
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [currentCar, setCurrentCar] = useState<Car>(EMPTY_CAR);
  const [localSettings, setLocalSettings] = useState(settings);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountRule>>({ minDays: 3, percentageOff: 5, label: '' });
  const [newExtra, setNewExtra] = useState<Partial<BookingExtra>>({ name: '', price: 0, description: '' });

  // Inputs for Dynamic Arrays
  const [featureInput, setFeatureInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('q_cars_admin');
    if (session) setIsAuthenticated(true);
    refreshBookings();
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('q_cars_admin', 'true');
    } else {
      alert('Invalid credentials. Try admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('q_cars_admin');
    navigate('/');
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditingCar) {
          setCurrentCar(prev => ({ ...prev, image: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fleet Handlers
  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCar.id) {
      updateCar(currentCar);
    } else {
      const newCar = { ...currentCar, id: Math.random().toString(36).substr(2, 9) };
      addCar(newCar);
    }
    setIsEditingCar(false);
    setCurrentCar(EMPTY_CAR);
  };
  
  const handleEditCar = (car: Car) => {
    setCurrentCar({
        ...car,
        colorHex: car.colorHex || CAR_COLORS[car.color] || '#000000'
    });
    setIsEditingCar(true);
  };

  const handleToggleAvailability = (car: Car) => {
    updateCar({ ...car, isAvailable: !car.isAvailable });
  };

  // Feature/Condition Handlers
  const addFeature = () => {
    if (!featureInput.trim()) return;
    if (!currentCar.features.includes(featureInput.trim())) {
      setCurrentCar(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    }
    setFeatureInput('');
  };

  const removeFeature = (feat: string) => {
    setCurrentCar(prev => ({ ...prev, features: prev.features.filter(f => f !== feat) }));
  };

  const addCondition = () => {
    if (!conditionInput.trim()) return;
    const newConditions = currentCar.extraConditions || [];
    if (!newConditions.includes(conditionInput.trim())) {
      setCurrentCar(prev => ({ ...prev, extraConditions: [...newConditions, conditionInput.trim()] }));
    }
    setConditionInput('');
  };

  const removeCondition = (cond: string) => {
    setCurrentCar(prev => ({ ...prev, extraConditions: (prev.extraConditions || []).filter(c => c !== cond) }));
  };


  // --- CMS Handlers ---
  const handleSaveSettings = () => {
    updateSettings(localSettings);
    alert('Website configuration updated successfully!');
  };

  const handleTrustFeatureChange = (index: number, field: keyof TrustFeature, value: string) => {
    const updated = [...localSettings.trustFeatures];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSettings({ ...localSettings, trustFeatures: updated });
  };

  const handleAddTrustFeature = () => {
    setLocalSettings({
      ...localSettings,
      trustFeatures: [
        ...localSettings.trustFeatures,
        { id: Math.random().toString(), icon: 'Shield', title: 'New Feature', title_ar: 'ميزة جديدة', description: 'Description', description_ar: 'الوصف' }
      ]
    });
  };

  const handleDeleteTrustFeature = (index: number) => {
    const updated = localSettings.trustFeatures.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, trustFeatures: updated });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-slate-500">Log in to manage your rental business</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input 
              type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Access Dashboard</button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-400">Hint: admin / admin123</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white md:min-h-screen flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard /> {settings.companyName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Admin Portal</p>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => setActiveTab('cms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cms' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutTemplate size={20} /> Content (CMS)
          </button>
          <button onClick={() => setActiveTab('fleet')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'fleet' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <CarIcon size={20} /> Fleet
          </button>
          <button onClick={() => setActiveTab('offers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'offers' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Tag size={20} /> Global Offers
          </button>
          <button onClick={() => setActiveTab('extras')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'extras' ? 'bg-indigo-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Briefcase size={20} /> Extras / Add-ons
          </button>
        </nav>
        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors"><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-900">Business Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold text-slate-900">{formatPrice(bookings.reduce((sum, b) => sum + b.totalPrice, 0))}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-slate-500 text-sm font-medium">Active Bookings</p>
                <h3 className="text-3xl font-bold text-slate-900">{bookings.filter(b => b.status === 'confirmed').length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-slate-500 text-sm font-medium">Fleet Size</p>
                <h3 className="text-3xl font-bold text-slate-900">{cars.length} Vehicles</h3>
              </div>
            </div>
          </div>
        )}

        {/* CMS / Settings */}
        {activeTab === 'cms' && (
           <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
                 <button onClick={handleSaveSettings} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2">
                    <Save size={18}/> Save Changes
                 </button>
              </div>
              
              {/* CMS Navigation */}
              <div className="flex bg-white p-1 rounded-xl border border-gray-200 w-fit">
                 <button onClick={() => setCmsSection('home')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${cmsSection === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-gray-50'}`}>Home Page</button>
                 <button onClick={() => setCmsSection('cards')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${cmsSection === 'cards' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-gray-50'}`}>Vehicle Cards</button>
                 <button onClick={() => setCmsSection('details')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${cmsSection === 'details' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-gray-50'}`}>Details Page</button>
              </div>

              {/* Home Page Editor */}
              {cmsSection === 'home' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hero Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                       <h3 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2"><Sparkles size={18}/> Hero Section</h3>
                       <div>
                          <label className="text-sm font-bold text-slate-700">Hero Title Line 1 (En/Ar)</label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                             <input type="text" placeholder="English" value={localSettings.heroTitle1} onChange={e => setLocalSettings({...localSettings, heroTitle1: e.target.value})} className="px-3 py-2 border rounded-lg"/>
                             <input type="text" placeholder="Arabic" value={localSettings.heroTitle1_ar} onChange={e => setLocalSettings({...localSettings, heroTitle1_ar: e.target.value})} className="px-3 py-2 border rounded-lg text-right"/>
                          </div>
                       </div>
                       <div>
                          <label className="text-sm font-bold text-slate-700">Hero Title Line 2 (Gradient)</label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                             <input type="text" placeholder="English" value={localSettings.heroTitle2} onChange={e => setLocalSettings({...localSettings, heroTitle2: e.target.value})} className="px-3 py-2 border rounded-lg"/>
                             <input type="text" placeholder="Arabic" value={localSettings.heroTitle2_ar} onChange={e => setLocalSettings({...localSettings, heroTitle2_ar: e.target.value})} className="px-3 py-2 border rounded-lg text-right"/>
                          </div>
                       </div>
                       <div>
                          <label className="text-sm font-bold text-slate-700">Subtitle</label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                             <textarea rows={3} placeholder="English" value={localSettings.heroSubtitle} onChange={e => setLocalSettings({...localSettings, heroSubtitle: e.target.value})} className="px-3 py-2 border rounded-lg w-full"/>
                             <textarea rows={3} placeholder="Arabic" value={localSettings.heroSubtitle_ar} onChange={e => setLocalSettings({...localSettings, heroSubtitle_ar: e.target.value})} className="px-3 py-2 border rounded-lg w-full text-right"/>
                          </div>
                       </div>
                       <div>
                          <label className="text-sm font-bold text-slate-700">Badge Tag</label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                             <input type="text" placeholder="English" value={localSettings.heroBadge} onChange={e => setLocalSettings({...localSettings, heroBadge: e.target.value})} className="px-3 py-2 border rounded-lg"/>
                             <input type="text" placeholder="Arabic" value={localSettings.heroBadge_ar} onChange={e => setLocalSettings({...localSettings, heroBadge_ar: e.target.value})} className="px-3 py-2 border rounded-lg text-right"/>
                          </div>
                       </div>
                    </div>

                    {/* Trust Features */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                       <div className="flex justify-between items-center border-b pb-2">
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Shield size={18}/> Trust Features</h3>
                          <button onClick={handleAddTrustFeature} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">Add Feature</button>
                       </div>
                       
                       <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-2">
                               <input type="text" value={localSettings.trustTitle} onChange={e => setLocalSettings({...localSettings, trustTitle: e.target.value})} className="px-3 py-2 border rounded-lg font-bold" placeholder="Section Title (En)"/>
                               <input type="text" value={localSettings.trustTitle_ar} onChange={e => setLocalSettings({...localSettings, trustTitle_ar: e.target.value})} className="px-3 py-2 border rounded-lg font-bold text-right" placeholder="Section Title (Ar)"/>
                           </div>
                           
                           {localSettings.trustFeatures.map((feature, idx) => (
                              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                 <button onClick={() => handleDeleteTrustFeature(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={16}/></button>
                                 
                                 <div className="mb-3">
                                     <label className="text-xs font-bold text-slate-500 block mb-1">Icon</label>
                                     <select 
                                        value={feature.icon} 
                                        onChange={(e) => handleTrustFeatureChange(idx, 'icon', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                     >
                                        {AVAILABLE_ICONS.map(icon => <option key={icon.value} value={icon.value}>{icon.label}</option>)}
                                     </select>
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-3">
                                    <input type="text" value={feature.title} onChange={(e) => handleTrustFeatureChange(idx, 'title', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" placeholder="Title En"/>
                                    <input type="text" value={feature.title_ar} onChange={(e) => handleTrustFeatureChange(idx, 'title_ar', e.target.value)} className="px-3 py-2 border rounded-lg text-sm text-right" placeholder="Title Ar"/>
                                    <textarea rows={2} value={feature.description} onChange={(e) => handleTrustFeatureChange(idx, 'description', e.target.value)} className="px-3 py-2 border rounded-lg text-xs" placeholder="Desc En"/>
                                    <textarea rows={2} value={feature.description_ar} onChange={(e) => handleTrustFeatureChange(idx, 'description_ar', e.target.value)} className="px-3 py-2 border rounded-lg text-xs text-right" placeholder="Desc Ar"/>
                                 </div>
                              </div>
                           ))}
                       </div>
                    </div>
                 </div>
              )}

              {/* Cards Editor */}
              {cmsSection === 'cards' && (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><MousePointerClick size={24}/> Vehicle Card Configuration</h3>
                    <p className="text-slate-500 mb-6">Toggle the visibility of specific elements on the vehicle cards displayed on the homepage.</p>
                    
                    <div className="space-y-4">
                       {Object.entries(localSettings.cardConfig).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                             <div className="capitalize font-bold text-slate-700">
                                {key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                   type="checkbox" 
                                   checked={val} 
                                   onChange={(e) => setLocalSettings({
                                      ...localSettings, 
                                      cardConfig: { ...localSettings.cardConfig, [key]: e.target.checked }
                                   })}
                                   className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                             </label>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* Details Page Editor */}
              {cmsSection === 'details' && (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Type size={24}/> Details Page Labels</h3>
                    <p className="text-slate-500 mb-8">Customize the section headers and labels on the individual car details page.</p>

                    <div className="space-y-6">
                       <div>
                          <label className="text-sm font-bold text-slate-700 block mb-2">Specs Section Title</label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="relative">
                                <Globe size={16} className="absolute top-3 left-3 text-gray-400"/>
                                <input type="text" value={localSettings.detailsLabels.specsTitle} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, specsTitle: e.target.value}})} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="English"/>
                             </div>
                             <input type="text" value={localSettings.detailsLabels.specsTitle_ar} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, specsTitle_ar: e.target.value}})} className="w-full px-4 py-3 border rounded-xl text-right" placeholder="Arabic"/>
                          </div>
                       </div>

                       <div>
                          <label className="text-sm font-bold text-slate-700 block mb-2">Features Section Title</label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="relative">
                                <Globe size={16} className="absolute top-3 left-3 text-gray-400"/>
                                <input type="text" value={localSettings.detailsLabels.featuresTitle} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, featuresTitle: e.target.value}})} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="English"/>
                             </div>
                             <input type="text" value={localSettings.detailsLabels.featuresTitle_ar} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, featuresTitle_ar: e.target.value}})} className="w-full px-4 py-3 border rounded-xl text-right" placeholder="Arabic"/>
                          </div>
                       </div>

                       <div>
                          <label className="text-sm font-bold text-slate-700 block mb-2">Rental Conditions Title</label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="relative">
                                <Globe size={16} className="absolute top-3 left-3 text-gray-400"/>
                                <input type="text" value={localSettings.detailsLabels.rentalConditionsTitle} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, rentalConditionsTitle: e.target.value}})} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="English"/>
                             </div>
                             <input type="text" value={localSettings.detailsLabels.rentalConditionsTitle_ar} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, rentalConditionsTitle_ar: e.target.value}})} className="w-full px-4 py-3 border rounded-xl text-right" placeholder="Arabic"/>
                          </div>
                       </div>

                       <div>
                          <label className="text-sm font-bold text-slate-700 block mb-2">Booking Panel Title (Rate)</label>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="relative">
                                <Globe size={16} className="absolute top-3 left-3 text-gray-400"/>
                                <input type="text" value={localSettings.detailsLabels.bookingPanelTitle} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, bookingPanelTitle: e.target.value}})} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="English"/>
                             </div>
                             <input type="text" value={localSettings.detailsLabels.bookingPanelTitle_ar} onChange={e => setLocalSettings({...localSettings, detailsLabels: {...localSettings.detailsLabels, bookingPanelTitle_ar: e.target.value}})} className="w-full px-4 py-3 border rounded-xl text-right" placeholder="Arabic"/>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* Fleet Manager */}
        {activeTab === 'fleet' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-900">Fleet Manager</h1>
              <button 
                onClick={() => { setCurrentCar(EMPTY_CAR); setIsEditingCar(true); }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2"
              >
                <Plus size={18} /> Add Vehicle
              </button>
            </div>

            {isEditingCar ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">{currentCar.id ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                  <button onClick={() => setIsEditingCar(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>
                <form onSubmit={handleSaveCar} className="space-y-8">
                  
                  {/* Status & Availability Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${currentCar.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {currentCar.isAvailable ? <CheckCircle2 size={24}/> : <XCircle size={24}/>}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Vehicle Availability</h4>
                            <p className="text-sm text-slate-500">{currentCar.isAvailable ? 'Vehicle is listed and bookable.' : 'Vehicle is hidden from booking queries.'}</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={currentCar.isAvailable} onChange={e => setCurrentCar({...currentCar, isAvailable: e.target.checked})} />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Section 1: Basic Details */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 border-b pb-2">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Brand</label>
                        <input required type="text" value={currentCar.brand} onChange={e => setCurrentCar({...currentCar, brand: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Model Name</label>
                        <input required type="text" value={currentCar.name} onChange={e => setCurrentCar({...currentCar, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
                        <input required type="number" value={currentCar.year} onChange={e => setCurrentCar({...currentCar, year: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" />
                      </div>
                      
                      {/* Color Section - Custom */}
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                              <Palette size={16}/> Vehicle Color
                          </label>
                          <div className="flex gap-3 mb-3">
                            <div className="flex-1">
                               <input 
                                  type="text" 
                                  value={currentCar.color} 
                                  onChange={e => setCurrentCar({...currentCar, color: e.target.value})} 
                                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                                  placeholder="e.g. Midnight Black"
                               />
                            </div>
                            <div className="relative group">
                               <input 
                                 type="color" 
                                 value={currentCar.colorHex || '#ffffff'}
                                 onChange={e => setCurrentCar({...currentCar, colorHex: e.target.value})}
                                 className="w-12 h-[50px] p-1 bg-white border rounded-xl cursor-pointer"
                                 title="Choose custom hex color"
                               />
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {BASIC_PALETTE.map(c => (
                                <button
                                   key={c}
                                   type="button"
                                   onClick={() => setCurrentCar({...currentCar, colorHex: c})}
                                   className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${currentCar.colorHex === c ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                                   style={{ backgroundColor: c }}
                                   title={c}
                                />
                             ))}
                          </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1.5: Technical Specs */}
                  <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 border-b pb-2">Technical Specifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {/* Seats */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Seats</label>
                              <div className="relative">
                                  <Users size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <input 
                                      type="number" 
                                      value={currentCar.seats} 
                                      onChange={e => setCurrentCar({...currentCar, seats: parseInt(e.target.value)})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl"
                                  />
                              </div>
                          </div>

                          {/* Transmission */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Transmission</label>
                              <div className="relative">
                                  <Gauge size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <select 
                                      value={currentCar.transmission} 
                                      onChange={e => setCurrentCar({...currentCar, transmission: e.target.value as any})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl appearance-none"
                                  >
                                      <option value="Automatic">Automatic</option>
                                      <option value="Manual">Manual</option>
                                  </select>
                              </div>
                          </div>

                          {/* Fuel */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Fuel Type</label>
                              <div className="relative">
                                  <Fuel size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <select 
                                      value={currentCar.fuel} 
                                      onChange={e => setCurrentCar({...currentCar, fuel: e.target.value as any})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl appearance-none"
                                  >
                                      <option value="Petrol">Petrol</option>
                                      <option value="Diesel">Diesel</option>
                                      <option value="Electric">Electric</option>
                                      <option value="Hybrid">Hybrid</option>
                                  </select>
                              </div>
                          </div>
                          
                          {/* Horsepower */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Horsepower</label>
                              <div className="relative">
                                  <Zap size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <input 
                                      type="number" 
                                      value={currentCar.specs.horsepower} 
                                      onChange={e => setCurrentCar({...currentCar, specs: {...currentCar.specs, horsepower: parseInt(e.target.value) || 0}})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl"
                                      placeholder="HP"
                                  />
                              </div>
                          </div>

                          {/* Engine */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Engine</label>
                              <div className="relative">
                                  <Flame size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <input 
                                      type="text" 
                                      value={currentCar.specs.engine} 
                                      onChange={e => setCurrentCar({...currentCar, specs: {...currentCar.specs, engine: e.target.value}})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl"
                                      placeholder="e.g. V8"
                                  />
                              </div>
                          </div>

                          {/* Acceleration */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">0-60 mph</label>
                              <div className="relative">
                                  <Clock size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <input 
                                      type="text" 
                                      value={currentCar.specs.acceleration} 
                                      onChange={e => setCurrentCar({...currentCar, specs: {...currentCar.specs, acceleration: e.target.value}})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl"
                                      placeholder="e.g. 3.2s"
                                  />
                              </div>
                          </div>

                          {/* Top Speed */}
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Max Speed</label>
                              <div className="relative">
                                  <Wind size={16} className="absolute top-3.5 left-3 text-gray-400"/>
                                  <input 
                                      type="text" 
                                      value={currentCar.specs.topSpeed} 
                                      onChange={e => setCurrentCar({...currentCar, specs: {...currentCar.specs, topSpeed: e.target.value}})} 
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl"
                                      placeholder="e.g. 200 mph"
                                  />
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* Section 2: Pricing & Individual Discounts */}
                  <div className="space-y-4 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2 flex items-center gap-2"><Tag size={18}/> Pricing & Discounts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-indigo-900 mb-2">Base Rate (Per Day)</label>
                        <input required type="number" value={currentCar.pricePerDay} onChange={e => setCurrentCar({...currentCar, pricePerDay: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-indigo-900 mb-2">Weekly Discount (%)</label>
                        <input type="number" min="0" max="100" value={currentCar.weeklyDiscount || 0} onChange={e => setCurrentCar({...currentCar, weeklyDiscount: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-indigo-900 mb-2">Monthly Discount (%)</label>
                        <input type="number" min="0" max="100" value={currentCar.monthlyDiscount || 0} onChange={e => setCurrentCar({...currentCar, monthlyDiscount: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl" />
                      </div>
                    </div>
                    <p className="text-xs text-indigo-600">These specific discounts override global settings for this car.</p>
                  </div>

                  {/* Section 3: Premium Features (Dynamic Tags) */}
                  <div className="space-y-4">
                     <h4 className="font-bold text-slate-900 border-b pb-2">Premium Features</h4>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {currentCar.features.map(feat => (
                           <span key={feat} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold flex items-center gap-2">
                              {feat}
                              <button type="button" onClick={() => removeFeature(feat)} className="hover:text-indigo-900"><X size={14}/></button>
                           </span>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           value={featureInput} 
                           onChange={e => setFeatureInput(e.target.value)} 
                           placeholder="Type feature (e.g. 'Heated Seats')..." 
                           className="flex-1 px-4 py-3 bg-gray-50 border rounded-xl"
                        />
                        <button type="button" onClick={addFeature} className="px-6 bg-slate-900 text-white rounded-xl font-bold">Add</button>
                     </div>
                  </div>

                  {/* Section 4: Rental Conditions */}
                  <div className="space-y-4">
                     <h4 className="font-bold text-slate-900 border-b pb-2">Rental Conditions</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Mileage Limit</label>
                           <input type="text" value={currentCar.rentalTerms.mileageLimit} onChange={e => setCurrentCar({...currentCar, rentalTerms: {...currentCar.rentalTerms, mileageLimit: e.target.value}})} className="w-full px-3 py-2 border rounded-xl" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Security Deposit</label>
                           <input type="number" value={currentCar.rentalTerms.deposit} onChange={e => setCurrentCar({...currentCar, rentalTerms: {...currentCar.rentalTerms, deposit: parseInt(e.target.value)}})} className="w-full px-3 py-2 border rounded-xl" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Insurance Type</label>
                           <input type="text" value={currentCar.rentalTerms.insurance} onChange={e => setCurrentCar({...currentCar, rentalTerms: {...currentCar.rentalTerms, insurance: e.target.value}})} className="w-full px-3 py-2 border rounded-xl" />
                        </div>
                     </div>
                     
                     {/* Dynamic Extra Conditions */}
                     <label className="block text-sm font-bold text-slate-700 mb-2">Additional Restrictions / Rules</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {(currentCar.extraConditions || []).map(cond => (
                           <span key={cond} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-bold flex items-center gap-2 border border-red-100">
                              <AlertCircle size={12}/> {cond}
                              <button type="button" onClick={() => removeCondition(cond)} className="hover:text-red-800"><X size={14}/></button>
                           </span>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           value={conditionInput} 
                           onChange={e => setConditionInput(e.target.value)} 
                           placeholder="Type restriction (e.g. 'No Pets')..." 
                           className="flex-1 px-4 py-3 bg-gray-50 border rounded-xl"
                        />
                        <button type="button" onClick={addCondition} className="px-6 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold">Add Rule</button>
                     </div>
                  </div>

                  {/* Image Upload for Car */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Image</label>
                    <div className="flex gap-4 items-center">
                        <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                             {currentCar.image ? <img src={currentCar.image} className="w-full h-full object-cover" alt="Preview"/> : <div className="flex items-center justify-center h-full text-gray-400"><CarIcon/></div>}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 text-slate-700 hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center gap-2">
                            <Upload size={16}/> Upload Image
                        </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" onClick={() => setIsEditingCar(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Save Vehicle</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
                  <div key={car.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition-all">
                     <div className="relative">
                        <img src={car.image} className={`w-24 h-24 rounded-xl object-cover ${!car.isAvailable ? 'grayscale opacity-75' : ''}`} alt="" />
                        {!car.isAvailable && <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">Unavailable</div>}
                     </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900 line-clamp-1">{car.name}</h3>
                        <div className="flex gap-1">
                          <button onClick={() => handleEditCar(car)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                          <button onClick={() => deleteCar(car.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{car.brand} • {car.year}</p>
                      <div className="flex flex-col gap-1 mb-2">
                         <span className="font-bold text-indigo-600">{formatPrice(car.pricePerDay)}/day</span>
                      </div>
                      
                      {/* Quick Toggle */}
                      <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleAvailability(car); }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${car.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                         >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${car.isAvailable ? 'translate-x-5' : 'translate-x-1'}`} />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;