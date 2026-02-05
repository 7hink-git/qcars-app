import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Phone, Sparkles, X, Car as CarIcon, Gauge, CalendarRange, ChevronDown, Zap, Shield, Star, Award, CheckCircle } from 'lucide-react';
import CarCard from '../components/CarCard';
import AIChat from '../components/AIChat';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

// Icon Mapping helper
const IconMap: Record<string, any> = {
  ShieldCheck, Phone, Sparkles, Zap, Shield, Star, Award, CheckCircle
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState<string | number>('All');
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { cars, settings } = useData();

  const handleAIRecommendation = (ids: string[]) => {
    setAiRecommendations(ids);
    document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Derive unique filters from dynamic data
  const brands = ['All', ...Array.from(new Set(cars.map(c => language === 'ar' ? c.brand_ar || c.brand : c.brand))).sort()];
  const types = ['All', ...Array.from(new Set(cars.map(c => language === 'ar' ? c.type_ar || c.type : c.type))).sort()];
  const years = ['All', ...Array.from(new Set(cars.map(c => c.year))).sort((a, b) => Number(b) - Number(a))];

  // Filter Logic
  const filteredCars = cars.filter(car => {
    const carBrand = language === 'ar' ? car.brand_ar || car.brand : car.brand;
    const carType = language === 'ar' ? car.type_ar || car.type : car.type;
    const carName = language === 'ar' ? car.name_ar || car.name : car.name;

    const matchBrand = selectedBrand === 'All' || carBrand === selectedBrand;
    const matchType = selectedType === 'All' || carType === selectedType;
    const matchYear = selectedYear === 'All' || car.year === selectedYear;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = carName.toLowerCase().includes(searchLower) || 
                        carBrand.toLowerCase().includes(searchLower);
    return matchBrand && matchType && matchYear && matchSearch;
  });

  // Sorting: AI recommendations first
  const sortedCars = [...filteredCars].sort((a, b) => {
    const aRec = aiRecommendations.includes(a.id);
    const bRec = aiRecommendations.includes(b.id);
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  const resetFilters = () => {
    setSelectedBrand('All');
    setSelectedType('All');
    setSelectedYear('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [selectedBrand, selectedType, selectedYear].filter(v => v !== 'All').length + (searchQuery ? 1 : 0);

  // Dynamic Content Strings
  const heroBadge = language === 'ar' ? settings.heroBadge_ar : settings.heroBadge;
  const heroTitle1 = language === 'ar' ? settings.heroTitle1_ar : settings.heroTitle1;
  const heroTitle2 = language === 'ar' ? settings.heroTitle2_ar : settings.heroTitle2;
  const heroSubtitle = language === 'ar' ? settings.heroSubtitle_ar : settings.heroSubtitle;

  return (
    <>
      <AIChat onRecommend={handleAIRecommendation} />
      
      {/* Modern Hero Section - Clean & Minimal */}
      <section className="relative pt-40 pb-20 flex flex-col justify-center overflow-hidden bg-[#FAFAFA]">
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 start-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] end-[-5%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-float" />
            <div className="absolute bottom-[10%] start-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 animate-float delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {heroBadge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 text-indigo-600 text-sm font-bold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <Sparkles size={14} className="animate-pulse" />
                <span className="tracking-wide uppercase text-xs">{heroBadge}</span>
              </div>
            )}
            
            {/* Dynamic Hero Title with Arabic Support */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
              {heroTitle1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                {heroTitle2}
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          </div>

          {/* Clean Search Bar (Hero) */}
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center animate-fade-in-up delay-200 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-300">
            <div className="ps-6 text-slate-400">
                <Search size={24} />
            </div>
            <input 
                type="text" 
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-4 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-medium text-lg w-full"
            />
            <button 
                onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all duration-200 hidden sm:block shadow-lg shadow-slate-200 hover:shadow-indigo-200"
            >
                {t('browse_btn')}
            </button>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in-up delay-300">
             <div>
                <h2 className="text-3xl font-bold text-slate-900">{t('collection_title')}</h2>
                 <p className="text-slate-500 mt-2">{t('collection_subtitle')}</p>
             </div>
             
             {activeFiltersCount > 0 && (
                 <button 
                     onClick={resetFilters}
                     className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                 >
                     <X size={14} />
                     {t('clear_filters')} ({activeFiltersCount})
                 </button>
             )}
          </div>

          {/* User-Friendly Filter Bar */}
          <div className="mb-12 bg-white p-4 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col lg:flex-row items-center gap-4 animate-fade-in-up delay-300 lg:sticky lg:top-24 z-30 backdrop-blur-md bg-white/90">
              
              {/* Search Field */}
              <div className="relative w-full lg:flex-1">
                  <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                      type="text" 
                      placeholder={t('search_placeholder_short')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full ps-11 pe-4 py-3 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
              </div>

              <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                  
                  {/* Brand */}
                  <div className="relative group">
                      <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none">
                          <CarIcon size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <select
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="w-full ps-10 pe-10 py-3 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-indigo-500 rounded-xl appearance-none cursor-pointer outline-none font-bold text-sm text-slate-700 focus:text-slate-900 transition-all truncate"
                      >
                          {brands.map(b => <option key={b} value={b}>{b === 'All' ? t('filter_all_makes') : b}</option>)}
                      </select>
                       <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                      </div>
                  </div>

                  {/* Type */}
                  <div className="relative group">
                      <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none">
                          <Gauge size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full ps-10 pe-10 py-3 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-indigo-500 rounded-xl appearance-none cursor-pointer outline-none font-bold text-sm text-slate-700 focus:text-slate-900 transition-all truncate"
                      >
                          {types.map(typeItem => <option key={typeItem} value={typeItem}>{typeItem === 'All' ? t('filter_all_types') : typeItem}</option>)}
                      </select>
                      <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                      </div>
                  </div>

                  {/* Year */}
                  <div className="relative group">
                      <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none">
                          <CalendarRange size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
                          className="w-full ps-10 pe-10 py-3 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-indigo-500 rounded-xl appearance-none cursor-pointer outline-none font-bold text-sm text-slate-700 focus:text-slate-900 transition-all truncate"
                      >
                          {years.map(y => <option key={y} value={y}>{y === 'All' ? t('filter_all_years') : y}</option>)}
                      </select>
                      <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                      </div>
                  </div>
              </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCars.length > 0 ? (
                sortedCars.map((car, idx) => (
                <div key={car.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in-up">
                    <CarCard 
                        car={car} 
                        onSelect={(c) => navigate(`/car/${c.id}`)}
                        isRecommended={aiRecommendations.includes(car.id)}
                    />
                </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center animate-fade-in-up">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Search size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{t('no_cars')}</h3>
                    <p className="text-slate-500 mt-2">{t('no_cars_sub')}</p>
                    <button 
                        onClick={resetFilters}
                        className="mt-6 text-indigo-600 font-bold hover:underline hover:text-indigo-700 transition-colors"
                    >
                        {t('reset_filters')}
                    </button>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
             <h2 className="text-3xl font-bold text-slate-900">{language === 'ar' ? settings.trustTitle_ar : settings.trustTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.trustFeatures.map((feature, idx) => {
              const Icon = IconMap[feature.icon] || ShieldCheck;
              const title = language === 'ar' ? feature.title_ar : feature.title;
              const desc = language === 'ar' ? feature.description_ar : feature.description;

              return (
                <div key={feature.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in-up group p-8 rounded-[2rem] bg-white hover:bg-indigo-50 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100/50">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 group-hover:bg-white transition-all duration-500 shadow-sm">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-indigo-900 transition-colors">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;