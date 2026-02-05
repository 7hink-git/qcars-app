import React from 'react';
import { Car } from '../types';
import { CAR_COLORS } from '../constants';
import { Fuel, Gauge, Users, ArrowUpRight, Zap, MessageCircle, Phone, Lock, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  isRecommended?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, onSelect, isRecommended }) => {
  const { t, language, formatPrice } = useLanguage();
  const { settings } = useData();
  const { cardConfig } = settings;
  const colorHex = car.colorHex || CAR_COLORS[car.color] || '#E2E8F0';

  // Translation helpers
  const brand = language === 'ar' ? car.brand_ar || car.brand : car.brand;
  const name = language === 'ar' ? car.name_ar || car.name : car.name;
  const highlight = language === 'ar' ? car.highlight_ar || car.highlight : car.highlight;
  const colorName = language === 'ar' ? car.color_ar || car.color : car.color;
  const fuelName = language === 'ar' ? car.fuel_ar || car.fuel : car.fuel;
  const transmissionName = language === 'ar' ? car.transmission_ar || (car.transmission === 'Automatic' ? 'Auto' : 'Manual') : (car.transmission === 'Automatic' ? 'Auto' : 'Manual');

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open('tel:+971502990802', '_self');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello Q Cars! I'm interested in the ${car.year} ${car.brand} ${car.name}. Is it available?`;
    window.open(`https://wa.me/971502990802?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(car);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Reliable fallback
  };

  return (
    <div 
      onClick={() => onSelect(car)}
      className="group flex flex-col h-full bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-indigo-100/50 transition-all duration-300 cursor-pointer overflow-hidden relative hover:-translate-y-1"
    >
      {/* Badge - Positioned absolutely - Logical Properties */}
      {isRecommended && car.isAvailable && cardConfig.showAvailability && (
        <div className="absolute top-7 start-7 z-20 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-indigo-200 flex items-center gap-1 animate-pulse">
          <Zap size={10} fill="currentColor" />
          {t('ai_pick')}
        </div>
      )}
      
      {/* Image Area */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-50 mb-5 isolate">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
        
        {/* Availability Status Badge (Blinking) */}
        {cardConfig.showAvailability && (
            <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white/50">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${car.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${car.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${car.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                    {car.isAvailable ? t('status_available') : t('status_booked')}
                </span>
            </div>
        )}

        {/* Availability Overlay (Full block if unavailable) */}
        {!car.isAvailable && cardConfig.showAvailability && (
            <div className="absolute inset-0 z-20 bg-gray-900/50 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl border border-white/20 flex items-center gap-2">
                    <Lock size={14} />
                    <span>Unavailable</span>
                </div>
            </div>
        )}

        <img 
          src={car.image} 
          alt={name} 
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!car.isAvailable ? 'grayscale' : ''}`}
        />

        {/* Arrow Button - Top End of Image */}
        <div className="absolute top-3 end-3 z-30">
            <button 
                type="button"
                onClick={handleArrowClick}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200"
            >
                <ArrowUpRight size={20} className={`transition-transform duration-300 group-hover:rotate-45 ${language === 'ar' ? 'scale-x-[-1]' : ''}`} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 px-1 ${!car.isAvailable && cardConfig.showAvailability ? 'opacity-60' : ''}`}>
        
        {/* Header */}
        <div className="mb-4">
            <div className="flex justify-between items-start mb-1">
                {cardConfig.showBrand && <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{brand}</span>}
                
                {/* Right side Header Meta */}
                <div className="flex items-center gap-2">
                   {cardConfig.showRating && car.rating > 0 && (
                       <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">
                           <Star size={10} className="text-yellow-500" fill="currentColor"/>
                           <span className="text-[10px] font-bold text-yellow-700">{car.rating}</span>
                       </div>
                   )}
                   {cardConfig.showYear && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{car.year}</span>}
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">{name}</h3>
            
            {/* Highlight Tag - Moved Below Model */}
            {cardConfig.showHighlight && highlight && (
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide">
                            {highlight}
                        </span>
                    </div>
                </div>
            )}
        </div>

        {/* Specs Row - Now 4 cols with Color */}
        {cardConfig.showSpecs && (
            <div className="grid grid-cols-4 gap-2 mb-6 py-4 border-t border-b border-gray-50">
                <div className="flex flex-col items-center justify-center gap-1.5 text-center group/icon">
                    <Gauge size={16} className="text-slate-400 group-hover:text-indigo-500 transition-all duration-300 group-hover:scale-110" />
                    <span className="text-[10px] font-medium text-slate-600 truncate w-full">{transmissionName}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 text-center border-l rtl:border-l-0 rtl:border-r border-gray-50 group/icon">
                    <Users size={16} className="text-slate-400 group-hover:text-indigo-500 transition-all duration-300 group-hover:scale-110" />
                    <span className="text-[10px] font-medium text-slate-600 truncate w-full">{car.seats} {t('seats')}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 text-center border-l rtl:border-l-0 rtl:border-r border-gray-50 group/icon">
                    <Fuel size={16} className="text-slate-400 group-hover:text-indigo-500 transition-all duration-300 group-hover:scale-110" />
                    <span className="text-[10px] font-medium text-slate-600 truncate w-full">{fuelName}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 text-center border-l rtl:border-l-0 rtl:border-r border-gray-50 group/icon">
                    <div 
                        className="w-4 h-4 rounded-full border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: colorHex }} 
                    />
                    <span className="text-[10px] font-medium text-slate-600 truncate w-full">{colorName}</span>
                </div>
            </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2">
            {cardConfig.showPrice && (
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('daily_rate')}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">{formatPrice(car.pricePerDay)}</span>
                    </div>
                </div>
            )}
            {!cardConfig.showPrice && <div></div>} {/* Spacer */}
            
            <div className="flex items-center gap-2">
                {/* Call - Solid Dark */}
                <button 
                    onClick={handleCall}
                    className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-all duration-300 hover:scale-110 shadow-md shadow-slate-200"
                    title="Call Us"
                >
                    <Phone size={18} />
                </button>
                
                {/* WhatsApp - Solid Green with Glow */}
                <button 
                    onClick={handleWhatsApp}
                    disabled={!car.isAvailable}
                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg ${!car.isAvailable ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#20bd5a] shadow-green-200 hover:shadow-green-300'}`}
                    title="WhatsApp"
                >
                    <MessageCircle size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;