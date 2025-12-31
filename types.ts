
export interface CompanyProfile {
  contactPhone: string;
  taxId: string;
  industry: string;             // 新增：產業類別
  annualElectricityBill: number; // 新增：年平均電費
  estimatedBudget: number;      // 新增：預計投入預算
  projectEquipmentType: string; 
  projectMeasureType: string;   
  implementationTime: string;   
}

export interface SubsidyBenefitAssessment {
  estimatedSubsidyAmount?: number;
  netInvestment?: number;
  paybackPeriodYears?: number;
  annualCostSaving?: number;
  carbonReductionTons?: number;
  costPerTonCarbonReduction?: number;
  calculationLogic?: string; // 新增：計算邏輯說明
}

export interface Subsidy {
  name: string;
  agency: string;
  description: string;
  eligibility: string;
  deadline?: string;
  link: string;
  benefitAssessment?: SubsidyBenefitAssessment;
  relevanceScore?: number;
  matchingRationale?: string;
  sources?: string[]; // 顯示搜尋來源
}

export interface GeminiResponse {
  subsidies: Subsidy[];
  recommendations: string[];
}
