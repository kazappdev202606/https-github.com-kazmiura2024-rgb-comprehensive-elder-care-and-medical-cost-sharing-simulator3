import { SimulatorState } from './types';

export const CURRENT_STATE_VERSION = 7;

export const DEFAULT_STATE: SimulatorState = {
  version: CURRENT_STATE_VERSION,
  currentStep: 'step1_wall',
  householdType: 'couple',
  perspective: 'primary',
  targetAgeYears: 75,
  primary: {
    name: 'ご本人',
    ageYears: 65,
    ageMonths: 0,
    lifeExpectancyYears: 100,
    pensionBasicMonthly: 6.8,
    pensionEmployeesMonthly: 9.7,
    pensionAge65Monthly: 16.5,
    pensionStartAge: 65,
    careerRetireAge: 65,
    careerMonthlySalary: 35,
    rehireRetireAge: 70,
    rehireMonthlySalary: 12,
  },
  spouse: {
    name: '配偶者',
    ageYears: 62,
    ageMonths: 4,
    lifeExpectancyYears: 100,
    pensionBasicMonthly: 6.8,
    pensionEmployeesMonthly: 0.7,
    pensionAge65Monthly: 7.5,
    pensionStartAge: 65,
    careerRetireAge: 60,
    careerMonthlySalary: 18,
    rehireRetireAge: 65,
    rehireMonthlySalary: 8,
  },
  // 第2ステップ用：ユーザー指定項目に基づく高精度初期値
  lifePlan: {
    inflationRate: 1.5, // 物価上昇率 1.5%
    investmentReturnRate: 4.0, // 運用利回り (NISA等) 4.0%

    // 収入・年金戦略（本人）
    primaryStrategy: {
      careerRetireAge: 65,
      careerNetIncomeAnnual: 420, // 正職就労手取り（年420万）
      careerSeverancePayNet: 1500, // 正職退職金 1,500万
      rehireRetireAge: 70,
      rehireNetIncomeAnnual: 120, // 再雇用就労手取り（年120万）
      rehireSeverancePayNet: 0,
      pensionStartAge: 65,
      pensionAge65GrossAnnual: 198, // 16.5万×12 = 198万円
      pensionNetRate: 85, // 年金手取り率 85%
      idecoNetTotal: 300, // iDeCo等 300万円
      idecoReceiveAge: 65,
      investments: 1200, // ご本人の運用資産 1,200万円
    },

    // 収入・年金戦略（配偶者）
    spouseStrategy: {
      careerRetireAge: 60,
      careerNetIncomeAnnual: 180, // 正職就労手取り
      careerSeverancePayNet: 500, // 正職退職金 500万
      rehireRetireAge: 65,
      rehireNetIncomeAnnual: 80, // 再雇用就労手取り
      rehireSeverancePayNet: 0,
      pensionStartAge: 65,
      pensionAge65GrossAnnual: 90, // 7.5万×12 = 90万円
      pensionNetRate: 85,
      idecoNetTotal: 0,
      idecoReceiveAge: 65,
      investments: 600, // 配偶者の運用資産 600万円
    },

    // 臨時収入 (単発)
    temporaryIncomes: [
      { id: 'ti-1', title: '親からの相続・生前贈与', age: 67, amount: 300 },
      { id: 'ti-2', title: '満期保険金等', age: 72, amount: 150 },
    ],

    // 現在の資産とバケット設定
    currentCashSavings: 1500, // 現在の預貯金 1,500万円
    limitToNisaCap: true, // 運用をNISA枠(1800万/人)に制限する
    bucket1Cash: 300, // バケット1: 生活インフラ現金 デフォルト300万円
    bucket3Emergency: 500, // バケット3: 医療・介護防衛 デフォルト500万円

    // 支出設定
    // 住居固定費（期間指定可能）
    housingCosts: [
      { id: 'hc-1', title: '自宅維持費（管理費・修繕積立・固定資産税）', startAge: 65, endAge: 100, annualAmount: 48 },
    ],

    // 基本生活インフラ費（期間指定可能）
    baseLivingCosts: [
      { id: 'blc-1', title: 'アクティブ期 基本生活費 (食費・光熱費・通信費等)', startAge: 65, endAge: 79, annualAmount: 216 }, // 月18万×12
      { id: 'blc-2', title: '高齢安定期 基本生活費 (サイズダウン)', startAge: 80, endAge: 100, annualAmount: 180 }, // 月15万×12
    ],

    // アクティブ娯楽費 (定額)
    activeLeisureAnnual: [
      { id: 'ala-1', title: '旅行・趣味・外食（前期ゴールド期）', startAge: 65, endAge: 74, annualAmount: 60 }, // 年60万
      { id: 'ala-2', title: '近場レジャー・孫への支援（後期期）', startAge: 75, endAge: 84, annualAmount: 30 },
    ],

    // 使途不明金・予備費
    unforeseenBudgetAnnual: 20, // 年20万円

    // まとまった娯楽費 (単発)
    largeLeisureOneTimes: [
      { id: 'll-1', title: '定年退職記念 豪華海外旅行', age: 66, amount: 100 },
      { id: 'll-2', title: '金婚式記念 家族旅行', age: 75, amount: 60 },
    ],

    // 期間指定の特別支出（車のローン・教育・仕送り等）
    specialPeriodExpenses: [
      { id: 'spe-1', title: 'マイカー買い替え・維持ローン', startAge: 65, endAge: 72, annualAmount: 40 },
      { id: 'spe-2', title: '孫の大学入学・教育祝金', startAge: 68, endAge: 70, annualAmount: 50 },
    ],
  },
};

export const WALL_THRESHOLDS = {
  TAX_FREE_SINGLE: 155,
  TAX_FREE_COUPLE: 211,
  CARE_20_SINGLE: 280,
  CARE_20_COUPLE: 346,
  CARE_30_SINGLE: 340,
  MEDICAL_30_SINGLE: 383,
  MEDICAL_30_COUPLE: 520,
  MEDICAL_20_LATE_SINGLE: 200,
  MEDICAL_20_LATE_COUPLE: 320,
};
