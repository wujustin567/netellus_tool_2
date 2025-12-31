
import React, { useState, useCallback } from 'react';
import { findSubsidies } from './services/geminiService';
import type { CompanyProfile, Subsidy } from './types';
import { IMPLEMENTATION_TIMES, EQUIPMENT_CATEGORIES, MEASURE_CATEGORIES, TAIWAN_INDUSTRIES } from './constants';
import SubsidyCard from './components/SubsidyCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile>({
    contactPhone: '',
    taxId: '',
    industry: TAIWAN_INDUSTRIES[0],
    annualElectricityBill: 0,
    estimatedBudget: 0,
    projectEquipmentType: EQUIPMENT_CATEGORIES[0],
    projectMeasureType: MEASURE_CATEGORIES[0],
    implementationTime: IMPLEMENTATION_TIMES[0],
  });
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProfile(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSubsidies([]);
    setRecommendations([]);
    setHasSearched(true);

    try {
      const results = await findSubsidies(profile);
      setSubsidies(results.subsidies);
      setRecommendations(results.recommendations);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('發生未知錯誤');
      }
    } finally {
      setIsLoading(false);
    }
  }, [profile]);
  
  const InputField: React.FC<{ label: string; name: keyof CompanyProfile; children: React.ReactNode; helpText?: string }> = ({ label, name, children, helpText }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {helpText && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
    </div>
  );

  const FormSectionTitle: React.FC<{ title: string, subtitle?: string }> = ({ title, subtitle }) => (
    <div className="border-b border-slate-200 pb-2 mb-6 mt-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  );

  const commonInputStyles = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--ash-gray)] focus:outline-none sm:text-sm rounded-2xl shadow-sm focus-brand";

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
           <div className="p-2 bg-[var(--netellus-green)] rounded-lg mr-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--earth-black)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
           </div>
          <div>
            <h1 className="text-2xl font-bold">企業節能補助智慧比對工具</h1>
            <p className="text-sm text-slate-500">AI-Powered Grounding Search & Matching</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 sticky top-6">
              <h2 className="text-xl font-bold mb-4">精準比對設定</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Part I: Basic Info */}
                <section>
                  <FormSectionTitle title="企業規模與現況" subtitle="用於計算補助級距與回收效益" />
                  <div className="space-y-4">
                    <InputField label="公司統編" name="taxId">
                        <input type="text" id="taxId" name="taxId" value={profile.taxId} onChange={handleChange} className={commonInputStyles} placeholder="12345678" required />
                    </InputField>
                    <InputField label="產業類別" name="industry">
                      <select id="industry" name="industry" value={profile.industry} onChange={handleChange} className={commonInputStyles} required>
                        {TAIWAN_INDUSTRIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </InputField>
                    <InputField label="年平均電費 (新台幣元)" name="annualElectricityBill">
                        <input type="number" id="annualElectricityBill" name="annualElectricityBill" value={profile.annualElectricityBill} onChange={handleChange} className={commonInputStyles} placeholder="如：500000" required />
                    </InputField>
                  </div>
                </section>
                
                {/* Part II: Project Info */}
                <section>
                  <FormSectionTitle title="專案規劃" subtitle="AI 將根據預算搜尋匹配政策" />
                  <div className="space-y-4">
                    <InputField label="預計投入總預算 (新台幣元)" name="estimatedBudget">
                        <input type="number" id="estimatedBudget" name="estimatedBudget" value={profile.estimatedBudget} onChange={handleChange} className={commonInputStyles} placeholder="如：1000000" required />
                    </InputField>
                    <InputField label="設備類別" name="projectEquipmentType">
                      <select id="projectEquipmentType" name="projectEquipmentType" value={profile.projectEquipmentType} onChange={handleChange} className={commonInputStyles} required>
                        {EQUIPMENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </InputField>
                    <InputField label="執行措施" name="projectMeasureType">
                      <select id="projectMeasureType" name="projectMeasureType" value={profile.projectMeasureType} onChange={handleChange} className={commonInputStyles} required>
                        {MEASURE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </InputField>
                  </div>
                </section>
                
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-[var(--earth-black)] bg-[var(--netellus-green)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--netellus-green)] disabled:bg-[var(--ash-gray)] disabled:text-slate-500 disabled:cursor-not-allowed transition-opacity duration-200">
                  {isLoading ? '正在聯網搜尋最新政策...' : '開始精準搜尋補助'}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-200 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">官方補助比對結果</h2>
                <span className="text-xs text-slate-400">數據更新：{new Date().toLocaleDateString()}</span>
              </div>
              
              {isLoading && <LoadingSpinner />}
              {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-2xl">{error}</div>}
              
              {!isLoading && !error && hasSearched && subsidies.length === 0 && (
                <div className="text-center text-slate-500 pt-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">搜尋完畢，暫無完全匹配的補助</h3>
                  <p className="mt-1 text-sm text-slate-500">目前網路上尚無針對該項目的最新補助公告，我們會持續為您追蹤。</p>
                </div>
              )}

              {!isLoading && !error && subsidies.length > 0 && (
                <div className="space-y-6">
                  {subsidies.map((subsidy, index) => (
                    <SubsidyCard key={index} subsidy={subsidy} />
                  ))}
                </div>
              )}
               
              {!isLoading && !error && recommendations.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      專業申辦建議 (基於搜尋結果)
                    </h3>
                    <ul className="space-y-2 list-disc list-inside text-sm text-slate-700">
                        {recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>
              )}

              {!isLoading && !hasSearched && (
                 <div className="text-center text-slate-500 pt-10">
                   <p className="text-sm">請於左側輸入「年電費」與「預算」，以啟動 AI 聯網精準比對。</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
