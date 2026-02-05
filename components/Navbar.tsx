import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, LogOut, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, currency, toggleCurrency, t } = useLanguage();
  const { user, logout } = useAuth();
  const { settings } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav 
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}
      >
        <div 
          className={`rounded-2xl px-6 transition-all duration-500 ${
            scrolled || isMenuOpen 
              ? 'bg-white/90 backdrop-blur-xl shadow-lg border border-white/20 py-3' 
              : 'bg-transparent py-4'
          }`}
        >
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-indigo-500/20" />
              ) : (
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-indigo-500/30">
                  {settings.companyName.charAt(0)}
                </div>
              )}
              <span className={`text-2xl font-bold tracking-tight transition-colors ${scrolled || isMenuOpen ? 'text-slate-900' : 'text-slate-900'}`}>
                {settings.companyName}
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <div className="flex items-center gap-2">
                 {/* Admin Link (Discreet) */}
                 <Link 
                    to="/admin" 
                    className={`p-2 rounded-full transition-all hover:scale-105 active:scale-95 ${
                        scrolled ? 'text-slate-400 hover:text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
                    }`}
                    title={t('nav_admin')}
                 >
                    <ShieldCheck size={18} />
                 </Link>

                 {/* Currency Switcher */}
                <button 
                    onClick={toggleCurrency}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                        scrolled ? 'border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600' : 'border-slate-300/50 text-slate-800 hover:bg-white hover:text-indigo-600'
                    }`}
                >
                    <span className="text-xs font-bold uppercase w-6 text-center">{currency === 'USD' ? settings.currency || 'AED' : 'USD'}</span>
                </button>

                {/* Language Switcher */}
                <button 
                    onClick={toggleLanguage}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all hover:scale-105 active:scale-95 ${
                        scrolled ? 'border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600' : 'border-slate-300/50 text-slate-800 hover:bg-white hover:text-indigo-600'
                    }`}
                >
                    <Globe size={16} />
                    <span className="text-xs font-bold uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>

                {/* Auth Button */}
                {user ? (
                   <div className="relative group/auth ml-2">
                      <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 transition-colors">
                        <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {user.name.charAt(0)}
                        </div>
                      </Link>
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover/auth:block animate-in fade-in slide-in-from-top-2 rtl:left-0 rtl:right-auto">
                         <div className="p-3 border-b border-gray-50">
                            <p className="font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                         </div>
                         <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-50 hover:text-indigo-600">{t('profile_link')}</Link>
                         <button onClick={handleLogout} className="w-full text-left rtl:text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                            <LogOut size={14} /> {t('sign_out')}
                         </button>
                      </div>
                   </div>
                ) : (
                  <Link 
                    to="/login"
                    className="ml-2 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 flex items-center gap-2"
                  >
                    <User size={16} />
                    {t('sign_in')}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
                <Link to="/admin" className="p-2 text-slate-400">
                    <ShieldCheck size={18} />
                </Link>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden animate-in slide-in-from-top-10 fade-in duration-300 pt-28 px-6">
          <div className="flex flex-col space-y-4">
            {!user && (
                 <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-center"
                 >
                   {t('sign_in')} / {t('sign_up')}
                 </Link>
            )}
            {user && (
                 <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="mt-4 w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-center"
                 >
                   {t('sign_out')}
                 </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;