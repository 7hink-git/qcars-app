import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MessageCircle, Shield, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, extras, discountRules, settings } = useData();
  const car = cars.find(c => c.id === id);
  const { formatPrice, t } = useLanguage();

  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  if (!car) return null;

  // --- DYNAMIC PRICING LOGIC ---
  let discountPercent = 0;
  let discountLabel = '';

  if (days >= 30 && car.monthlyDiscount) {
    discountPercent = car.monthlyDiscount / 100;
    discountLabel = t('special_monthly');
  } else if (days >= 7 && car.weeklyDiscount) {
    discountPercent = car.weeklyDiscount / 100;
    discountLabel = t('special_weekly');
  } else {
    // Fallback
    const applicableRule = discountRules
      .sort((a, b) => b.minDays - a.minDays)
      .find(rule => days >= rule.minDays);
    
    if (applicableRule) {
      discountPercent = applicableRule.percentageOff;
      discountLabel = applicableRule.label;
    }
  }

  const basePrice = car.pricePerDay * days;
  const discountAmount = basePrice * discountPercent;
  const finalCarPrice = basePrice - discountAmount;
  
  // Calculate Extras
  const extrasPrice = selectedExtras.reduce((acc, id) => {
    const extra = extras.find(e => e.id === id);
    return acc + (extra ? extra.price : 0);
  }, 0);

  const total = finalCarPrice + extrasPrice;

  // Calculate End Date
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + days);
  const endDateString = end.toISOString().split('T')[0];

  const handleToggleExtra = (id: string) => {
    if (selectedExtras.includes(id)) {
      setSelectedExtras(prev => prev.filter(e => e !== id));
    } else {
      setSelectedExtras(prev => [...prev, id]);
    }
  };

  const handleWhatsAppBooking = () => {
    const extraNames = selectedExtras.map(id => extras.find(e => e.id === id)?.name).join(', ');
    const message = `Hello ${settings.companyName}! I'm interested in renting the *${car.brand} ${car.name}*.

🚗 *Booking Details:*
- Duration: ${days} days
- Dates: ${startDate} to ${endDateString}
- Pickup: Standard Location

✨ *Extras:* ${extraNames || 'None'}

💰 *Price Estimate:*
- Rate: ${car.pricePerDay} ${settings.currency}/day
- Discount: ${discountLabel} (${(discountPercent * 100).toFixed(0)}% OFF)
- Total: ${total.toFixed(0)} ${settings.currency}

Is this car available?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(`/car/${id}`)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          {t('back_fleet')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Configurator */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Duration & Dates */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-2xl font-bold text-slate-900">{t('booking_duration_title')}</h2>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <label className="block text-sm font-medium text-slate-700">{t('booking_days_label')}</label>
                  <div className="flex items-center gap-2">
                     <span className="text-sm text-slate-500">{t('booking_manual_input')}:</span>
                     <input 
                      type="number" 
                      min="1" 
                      max="60"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                
                {discountPercent > 0 && (
                   <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-green-700 animate-in fade-in slide-in-from-top-2">
                     <Tag size={16} />
                     <span className="font-bold">{discountLabel}: {(discountPercent * 100).toFixed(0)}% Discount!</span>
                     <span className="text-sm opacity-80 ml-auto">{t('save_text')} {formatPrice(discountAmount)}</span>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('booking_pickup')}</label>
                  <input 
                    type="date" 
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('booking_dropoff')}</label>
                  <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-slate-500 font-medium">
                    {endDateString}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Extras */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-bold text-slate-900">{t('booking_extras_title')}</h2>
              </div>
              
              <div className="space-y-4">
                {extras.map(extra => (
                  <div 
                    key={extra.id}
                    onClick={() => handleToggleExtra(extra.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedExtras.includes(extra.id) 
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                        selectedExtras.includes(extra.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                      }`}>
                        {selectedExtras.includes(extra.id) && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{extra.name}</h4>
                        <p className="text-sm text-slate-500">{extra.description}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">+{formatPrice(extra.price)}</span>
                  </div>
                ))}
                {extras.length === 0 && <p className="text-gray-400 italic">{t('booking_no_extras')}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-gray-50 p-4 rounded-2xl">
              <Shield size={16} className="text-green-600" />
              <span>{t('booking_no_card')}</span>
            </div>

            <button 
              onClick={handleWhatsAppBooking}
              className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-bold text-xl hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} />
              {t('book_whatsapp')}
            </button>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">{t('booking_summary')}</h3>
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-lg mb-1">{car.name}</h4>
              <p className="text-sm text-slate-500 mb-6">{car.brand}</p>
              
              <div className="border-t border-gray-100 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t('booking_rate_x')} (x{days})</span>
                  <span className="font-medium">{formatPrice(basePrice)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{discountLabel}</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {selectedExtras.map(id => {
                  const extra = extras.find(e => e.id === id);
                  return extra ? (
                    <div key={id} className="flex justify-between text-sm text-indigo-600">
                      <span>{extra.name}</span>
                      <span className="font-medium">+{formatPrice(extra.price)}</span>
                    </div>
                  ) : null;
                })}
              </div>
              
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">{t('total_estimate')}</span>
                <span className="font-bold text-3xl text-indigo-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;