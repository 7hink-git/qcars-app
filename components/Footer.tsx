import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
              <span className="text-xl font-bold">Q Cars</span>
            </div>
            <p className="text-slate-400 text-sm">{t('footer_desc')}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer_company')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_careers')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_blog')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer_support')}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_help')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_privacy')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer_newsletter')}</h4>
            <div className="flex gap-2">
              <input type="email" placeholder={t('footer_email_ph')} className="bg-slate-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-indigo-500" />
              <button className="bg-indigo-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-indigo-500 transition-colors">{t('footer_sub_btn')}</button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          {t('footer_rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;