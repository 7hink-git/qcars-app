import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, Tag, MessageCircle, Shield, Clock, Phone, Zap, Gauge, Flame, Wind, Wallet, Ban, FileCheck, ChevronLeft, ChevronRight, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { CAR_COLORS } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, discountRules, settings } = useData();
  const car = cars.find(c => c.id === id);
  const { t, language, formatPrice } = useLanguage();

  const [mode, setMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [quantity, setQuantity] = useState(3);
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });
  
  const [currentImage, setCurrentImage] = useState('');

  const galleryImages = useMemo(() => {
    if (!car) return [];
    const rawImages = car.gallery && car.gallery.length > 0 
      ? [car.image, ...car.gallery] 
      : [car.image];
    return Array.from(new Set(rawImages));
  }, [car]);

  useEffect(() => {
    if (car && galleryImages.length > 0) {
        setCurrentImage(car.image);
    }
    window.scrollTo(0, 0);
  }, [car, galleryImages]);

  if (!car) return <div className="min-h-screen flex items-center justify-center">Car not found</div>;

  const colorHex = car.colorHex || CAR_COLORS[car.color] || '#E2E8F0';

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = galleryImages.indexOf(currentImage);
    const newIndex = currentIndex <= 0 ? galleryImages.length - 1 : currentIndex - 1;
    setCurrentImage(galleryImages[newIndex]);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = galleryImages.indexOf(currentImage);
    const newIndex = currentIndex >= galleryImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentImage(galleryImages[newIndex]);
  };

  // Calculate Total Days
  const totalDays = useMemo(() => {
    if (mode === 'weekly') return quantity * 7;
    if (mode === 'monthly') return quantity * 30;
    return quantity;
  }, [mode, quantity]);

  // --- DYNAMIC PRICING LOGIC ---
  let discountPercent = 0;
  let discountLabel = '';

  if (totalDays >= 30 && car.monthlyDiscount) {
    discountPercent = car.monthlyDiscount / 100;
    discountLabel = t('special_monthly');
  } else if (totalDays >= 7 && car.weeklyDiscount) {
    discountPercent = car.weeklyDiscount / 100;
    discountLabel = t('special_weekly');
  } else {
    // Fallback
    const applicableRule = discountRules
      .sort((a, b) => b.minDays - a.minDays)
      .find(rule => totalDays >= rule.minDays);
    
    if (applicableRule) {
      discountPercent = applicableRule.percentageOff;
      discountLabel = applicableRule.label;
    }
  }

  const basePrice = car.pricePerDay * totalDays;
  const discountAmount = basePrice * discountPercent;
  const finalCarPrice = basePrice - discountAmount;
  const total = finalCarPrice;
  
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + totalDays);
  const endDateString = end.toISOString().split('T')[0];

  const handleModeSwitch = (newMode: 'daily' | 'weekly' | 'monthly') => {
      setMode(newMode);
      setQuantity(1);
  };

  const { max: sliderMax, label: sliderUnit } = (() => {
      switch(mode) {
          case 'weekly': return { max: 12, label: language === 'ar' ? 'أسابيع' : 'Weeks' };
          case 'monthly': return { max: 12, label: language === 'ar' ? 'شهور' : 'Months' };
          default: return { max: 30, label: language === 'ar' ? 'أيام' : 'Days' };
      }
  })();

  const carBrand = language === 'ar' ? car.brand_ar || car.brand : car.brand;
  const carName = language === 'ar' ? car.name_ar || car.name : car.name;
  
  const handleWhatsAppBooking = () => {
    if (!car.isAvailable) return;
    const durationText = `${quantity} ${sliderUnit}`;
    const message = `Hello ${settings.companyName}! I'm interested in renting the *${car.year} ${car.brand} ${car.name}*.

🚗 *Booking Details:*
- Duration: ${durationText}
- Dates: ${startDate} to ${endDateString}

💰 *Price Estimate:*
- Rate: ${car.pricePerDay} ${settings.currency}/day
- Discount: ${discountLabel} (${(discountPercent * 100).toFixed(0)}% OFF)
- Total: ${total.toFixed(0)} ${settings.currency}

Is this car available?`;

    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Dynamic Labels
  const specsTitle = language === 'ar' ? settings.detailsLabels.specsTitle_ar : settings.detailsLabels.specsTitle;
  const featuresTitle = language === 'ar' ? settings.detailsLabels.featuresTitle_ar : settings.detailsLabels.featuresTitle;
  const conditionsTitle = language === 'ar' ? settings.detailsLabels.rentalConditionsTitle_ar : settings.detailsLabels.rentalConditionsTitle;
  const rateTitle = language === 'ar' ? settings.detailsLabels.bookingPanelTitle_ar : settings.detailsLabels.bookingPanelTitle;


  return (
    <div className="pt-28 pb-20 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all shadow-sm group-hover:shadow-md">
            {language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          </div>
          <span className="font-medium">{t('back_fleet')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visuals & Info */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-2 animate-fade-in-up">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">{carBrand}</span>
                    <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1 rounded-full border border-gray-200/50">
                        <div className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: colorHex }} />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{car.color}</span>
                    </div>

                    {/* LIVE AVAILABILITY STATUS */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${car.isAvailable ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide">
                            {car.isAvailable ? t('status_available') : t('status_booked')}
                        </span>
                    </div>
                </div>
                <h1 className="text-5xl font-bold text-slate-900 tracking-tight">{car.year} {carName}</h1>
                <p className="text-xl text-slate-500 font-light leading-relaxed">{car.description}</p>
            </div>

            {/* Gallery */}
            <div className="space-y-4 animate-fade-in-up delay-100">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100 h-[500px] bg-white relative group select-none">
                    <img src={currentImage} alt={carName} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!car.isAvailable ? 'grayscale' : ''}`} />
                    {!car.isAvailable && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none">
                            <span className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-xl uppercase tracking-widest border-2 border-white shadow-2xl transform -rotate-12">{t('unavailable_badge')}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button onClick={handlePrevImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-slate-900 flex items-center justify-center pointer-events-auto"><ChevronLeft size={28} /></button>
                        <button onClick={handleNextImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-slate-900 flex items-center justify-center pointer-events-auto"><ChevronRight size={28} /></button>
                    </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                     {galleryImages.map((img, i) => (
                        <div key={i} onClick={() => setCurrentImage(img)} className={`shrink-0 w-28 h-20 rounded-2xl overflow-hidden cursor-pointer ${currentImage === img ? 'ring-2 ring-indigo-600' : 'opacity-60'}`}>
                           <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                     ))}
                </div>
            </div>

            {/* Specs Grid */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fade-in-up delay-200">
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Gauge size={24} className="text-indigo-600" />{specsTitle}</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                     <Flame size={24} className="text-slate-400 mb-2" />
                     <span className="text-sm text-slate-500 font-medium">{t('engine')}</span>
                     <span className="text-sm font-bold text-slate-900 ltr">{car.specs.engine}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                     <Zap size={24} className="text-slate-400 mb-2" />
                     <span className="text-sm text-slate-500 font-medium">{t('power')}</span>
                     <span className="text-lg font-bold text-slate-900 ltr">{car.specs.horsepower} HP</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                     <Clock size={24} className="text-slate-400 mb-2" />
                     <span className="text-sm text-slate-500 font-medium">{t('acceleration')}</span>
                     <span className="text-lg font-bold text-slate-900 ltr">{car.specs.acceleration}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                     <Wind size={24} className="text-slate-400 mb-2" />
                     <span className="text-sm text-slate-500 font-medium">{t('max_speed')}</span>
                     <span className="text-lg font-bold text-slate-900 ltr">{car.specs.topSpeed}</span>
                  </div>
               </div>
            </div>

            {/* Rental Terms & Extra Conditions */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fade-in-up delay-200">
               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><FileCheck size={24} className="text-indigo-600" />{conditionsTitle}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-start gap-4 p-4 border border-dashed border-gray-200 rounded-2xl">
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0"><Ban size={20} /></div>
                     <div><p className="text-sm font-bold text-slate-900">{t('mileage')}</p><p className="text-sm text-slate-500">{car.rentalTerms.mileageLimit}</p></div>
                  </div>
                  <div className="flex items-start gap-4 p-4 border border-dashed border-gray-200 rounded-2xl">
                     <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0"><Wallet size={20} /></div>
                     <div><p className="text-sm font-bold text-slate-900">{t('deposit')}</p><p className="text-sm text-slate-500">{formatPrice(car.rentalTerms.deposit)}</p></div>
                  </div>
                  <div className="flex items-start gap-4 p-4 border border-dashed border-gray-200 rounded-2xl">
                     <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0"><Shield size={20} /></div>
                     <div><p className="text-sm font-bold text-slate-900">{t('insurance')}</p><p className="text-sm text-slate-500">{car.rentalTerms.insurance}</p></div>
                  </div>
               </div>
               
               {/* Custom Conditions */}
               {car.extraConditions && car.extraConditions.length > 0 && (
                   <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                       <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2"><AlertCircle size={16}/> Special Requirements</h3>
                       <div className="flex flex-wrap gap-2">
                           {car.extraConditions.map(cond => (
                               <span key={cond} className="px-3 py-1 bg-white border border-red-100 text-red-600 text-xs font-bold rounded-full">{cond}</span>
                           ))}
                       </div>
                   </div>
               )}
            </div>

            {/* Features (Now Dynamic) */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 animate-fade-in-up delay-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2"><Star size={24} className="text-indigo-600" />{featuresTitle}</h2>
                <div className="flex flex-wrap gap-3">
                  {car.features.map(feature => (
                    <div key={feature} className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                      <CheckCircle size={16} className="text-indigo-500" />
                      <span className="text-sm font-medium text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Panel */}
          <div className="lg:col-span-4">
             <div className="sticky top-28 space-y-6 animate-fade-in-up delay-300">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
                    {/* ... Existing Pricing Panel ... */}
                     <div className="mb-8">
                        <p className="text-slate-500 font-medium mb-1">{rateTitle}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-slate-900">{formatPrice(car.pricePerDay)}</span>
                        </div>
                    </div>
                    
                    <div className="bg-slate-100 p-1.5 rounded-xl flex mb-6 relative">
                        {['daily', 'weekly', 'monthly'].map((m) => (
                             <button key={m} onClick={() => handleModeSwitch(m as any)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1 capitalize ${mode === m ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-900'}`}>
                                {language === 'ar' && m === 'daily' ? 'يومي' : language === 'ar' && m === 'weekly' ? 'أسبوعي' : language === 'ar' && m === 'monthly' ? 'شهري' : m}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-900 flex items-center gap-2"><Clock size={16} className="text-indigo-500" />{t('duration')}</label>
                                <span className="text-2xl font-bold text-indigo-600">{quantity} <span className="text-sm font-medium text-slate-400">{sliderUnit}</span></span>
                            </div>
                            <input type="range" min="1" max={sliderMax} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className={`w-full mb-2 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            {discountPercent > 0 && (
                                <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex justify-between items-center text-xs text-green-600 font-bold bg-green-50 px-3 py-2 rounded-xl border border-green-100/50 animate-pulse">
                                        <div className="flex items-center gap-1"><Tag size={12} /><span>{discountLabel}</span></div>
                                        <span>{discountPercent * 100}% OFF</span>
                                    </div>
                                    <div className="text-end text-sm font-bold text-green-600">{t('save_text')} {formatPrice(discountAmount)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* ... Total ... */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm font-medium text-slate-500">{t('total_estimate')}</span>
                            <div className="text-end">
                                {discountAmount > 0 && <span className="block text-sm text-slate-400 line-through mb-1">{formatPrice(basePrice)}</span>}
                                <span className="text-4xl font-bold text-slate-900 tracking-tight transition-all duration-300">{formatPrice(total)}</span>
                            </div>
                        </div>
                        {car.isAvailable ? (
                             <button onClick={handleWhatsAppBooking} className="w-full h-16 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200/50 hover:shadow-green-300/60 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
                                <MessageCircle size={24} />
                                <span className="relative">{t('book_whatsapp')}</span>
                             </button>
                        ) : (
                             <button disabled className="w-full h-16 bg-gray-200 text-gray-500 rounded-2xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-3">
                                <Lock size={24} />
                                <span className="relative">{t('unavailable_badge')}</span>
                             </button>
                        )}
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;