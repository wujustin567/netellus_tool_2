
import { GoogleGenAI, Type } from "@google/genai";
import type { CompanyProfile, Subsidy, GeminiResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const benefitAssessmentSchema = {
    type: Type.OBJECT,
    description: '根據搜尋到的政策公式與企業預算進行的效益評估',
    properties: {
        estimatedSubsidyAmount: { type: Type.NUMBER, description: '預估可獲得的補助金額 (新台幣元)' },
        netInvestment: { type: Type.NUMBER, description: '企業淨投入金額 (總投入 - 預估補助)' },
        paybackPeriodYears: { type: Type.NUMBER, description: '預估的投資回收年限 (年)' },
        annualCostSaving: { type: Type.NUMBER, description: '預估的年節省電費 (新台幣元)' },
        carbonReductionTons: { type: Type.NUMBER, description: '預估的年減碳量 (公噸 CO2e)' },
        calculationLogic: { type: Type.STRING, description: '具體列出你是根據哪個公式計算的，例如：補助 30% 或每 kW 補助 2500 元。' },
    },
};

const subsidySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: '補助方案的完整官方名稱' },
        agency: { type: Type.STRING, description: '主辦或執行此補助方案的政府機關' },
        description: { type: Type.STRING, description: '計畫內容摘要' },
        eligibility: { type: Type.STRING, description: '申請資格' },
        deadline: { type: Type.STRING, description: '申請截止日期' },
        link: { type: Type.STRING, description: '官方申請頁面或簡章連結' },
        benefitAssessment: benefitAssessmentSchema,
        relevanceScore: { type: Type.NUMBER, description: '相關性評分 (1-5)' },
        matchingRationale: { type: Type.STRING, description: '說明符合程度' },
        sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: '搜尋參考的網頁連結' },
    },
    required: ['name', 'agency', 'description', 'eligibility', 'relevanceScore', 'matchingRationale', 'link']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        subsidies: {
            type: Type.ARRAY,
            items: subsidySchema
        },
        recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ['subsidies', 'recommendations']
};

function buildPrompt(profile: CompanyProfile): string {
  return `
  你是專業的台灣節能補助顧問，現在必須透過「聯網搜尋」提供 100% 正確的建議。
  
  **企業背景：**
  - 產業：${profile.industry}
  - 年電費：${profile.annualElectricityBill} 元 (用於計算節電潛力)
  - 預計投入預算：${profile.estimatedBudget} 元 (用於計算補助佔比)
  - 目標設備：${profile.projectEquipmentType}
  - 措施：${profile.projectMeasureType}
  
  **執行指令：**
  1. 使用 Google Search 優先搜尋以下網站 2024-2025 年的補助：
     - 經濟部能源署 (energypark.org.tw)
     - 經濟部產業發展署 (ida.gov.tw)
     - 經濟部商業發展署
     - 環境部氣候變遷署
  2. **嚴格禁止憑空捏造數據**。若搜尋不到特定設備補助，請回傳空陣列。
  3. **計算要求**：
     - 若政策寫「補助 30%」，則預估補助 = ${profile.estimatedBudget} * 0.3。
     - 若政策寫「上限 50 萬」，則預估補助不可超過 50 萬。
     - 投資回收年限 = (${profile.estimatedBudget} - 預估補助) / (年省電費)。請根據該設備平均節能率 (15-25%) 推算。
  4. 必須在「sources」中列出你搜尋到的網頁網址。
  `;
}

export async function findSubsidies(profile: CompanyProfile): Promise<GeminiResponse> {
    const prompt = buildPrompt(profile);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error:", error);
        throw new Error("無法連接聯網搜尋，請確認網路環境或 API 金鑰權限。");
    }
}
