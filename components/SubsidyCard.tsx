
import React, { useState } from 'react';
import type { Subsidy, SubsidyBenefitAssessment } from '../types';

interface SubsidyCardProps {
  subsidy: Subsidy;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value?: string | number | null }> = ({ icon, label, value }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-start text-sm text-slate-700 mb-3">
      <div className="w-5 h-5 mr-3 text-slate-500 flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <span className="font-semibold text-slate-800">{label}:</span> {value}
      </div>
    </div>
  );
};

const BenefitStat: React.FC<{ icon: React.ReactNode; label: string; value: string; unit: string; }> = ({ icon, label, value, unit }) => (
    <div className="flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="w-6 h-6 mb-1 text-[var(--netellus-green)]">{icon}</div>
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{label}</p>
        <p className="text-md font-bold text-[var(--earth-black)]">
            {value} <span className="text-xs font-normal">{unit}</span>
        </p>
    </div>
);

const BenefitAssessmentSection: React.FC<{ assessment: SubsidyBenefitAssessment }> = ({ assessment }) => {
    const formatCurrency = (num?: number) => {
        if (num === undefined) return 'N/A';
        if (num >= 10000) return `${(num / 10000).toFixed(1)}`;
        return `${num.toFixed(0)}`;
    };
    const currencyUnit = (num?: number) => (num !== undefined && num >= 10000 ? '萬元' : '元');

    return (
        <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-800">精準效益試算 (基於政策公式)</h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <BenefitStat 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    label="預估補助"
                    value={formatCurrency(assessment.estimatedSubsidyAmount)}
                    unit={currencyUnit(assessment.estimatedSubsidyAmount)}
                />
                <BenefitStat 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="年省電費"
                    value={formatCurrency(assessment.annualCostSaving)}
                    unit={currencyUnit(assessment.annualCostSaving)}
                />
                <BenefitStat 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    label="回收年限"
                    value={assessment.paybackPeriodYears?.toFixed(1) ?? 'N/A'}
                    unit="年"
                />
                <BenefitStat 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    label="年減碳量"
                    value={assessment.carbonReductionTons?.toFixed(2) ?? 'N/A'}
                    unit="噸"
                />
            </div>
            {assessment.calculationLogic && (
                <p className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded-lg italic">
                    <span className="font-bold">運算依據：</span> {assessment.calculationLogic}
                </p>
            )}
        </div>
    );
};

const SubsidyCard: React.FC<SubsidyCardProps> = ({ subsidy }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-slate-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--netellus-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A3.323 3.323 0 0010.603 3.303a3.236 3.236 0 00-3.042 1.135 4.902 4.902 0 01-2.26 2.021 3.236 3.236 0 00-1.135 3.042 4.902 4.902 0 01-2.021 2.26 3.236 3.236 0 00-1.135 3.042 4.902 4.902 0 012.021 2.26 3.236 3.236 0 001.135 3.042 4.902 4.902 0 012.26 2.021 3.236 3.236 0 003.042 1.135 4.902 4.902 0 012.26-2.021 3.236 3.236 0 003.042-1.135 4.902 4.902 0 012.26-2.021 3.236 3.236 0 003.042-1.135 4.902 4.902 0 012.021-2.26 3.236 3.236 0 001.135-3.042 4.902 4.902 0 012.021-2.26 3.236 3.236 0 001.135-3.042 4.902 4.902 0 01-2.021-2.26z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{subsidy.name}</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">聯網驗證 OK</span>
            {subsidy.relevanceScore && (
              <span className="text-xs text-slate-400 mt-1">匹配度: {subsidy.relevanceScore}/5</span>
            )}
          </div>
        </div>

        <InfoRow label="主辦機關" value={subsidy.agency} icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>} />
        <InfoRow label="計畫摘要" value={subsidy.description} icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h7" /></svg>} />
        <InfoRow label="申請資格" value={subsidy.eligibility} icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        
        {subsidy.benefitAssessment && <BenefitAssessmentSection assessment={subsidy.benefitAssessment} />}
        
        {subsidy.sources && subsidy.sources.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">政策來源網址</h5>
            <div className="flex flex-wrap gap-2">
              {subsidy.sources.map((src, i) => (
                <a key={i} href={src} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 underline truncate max-w-[200px]">{src}</a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <a href={subsidy.link} target="_blank" rel="noreferrer" className="px-6 py-2 bg-[var(--netellus-green)] text-[var(--earth-black)] font-bold rounded-2xl text-sm hover:opacity-90 transition-opacity">
            官方網站連結
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubsidyCard;
