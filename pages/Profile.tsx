import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Calendar, MapPin, Package, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const { formatPrice, t } = useLanguage();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('profile_welcome')}, {user.name}</h1>
          <p className="text-slate-500">{t('profile_manage')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">{t('profile_total_bookings')}</p>
              <p className="text-2xl font-bold text-slate-900">{user.bookings.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">{t('profile_active_rentals')}</p>
              <p className="text-2xl font-bold text-slate-900">
                {user.bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('profile_history')}</h2>
        
        {user.bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t('profile_no_bookings')}</h3>
            <p className="text-slate-500">{t('profile_start_journey')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {user.bookings.map((booking, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="w-full md:w-64 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={booking.carImage} alt={booking.carName} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{booking.carName}</h3>
                      <p className="text-slate-500 text-sm">{t('profile_id')}: {booking.id}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-indigo-600" />
                      <span>{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-indigo-600" />
                      <span>{booking.extras.length} {t('profile_extras_selected')}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-sm text-slate-400">{t('profile_booked_on')} {new Date(booking.bookedAt).toLocaleDateString()}</span>
                    <span className="text-xl font-bold text-indigo-600">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;