export type HouseholdType = 'single' | 'couple';
export type ActivePerspective = 'primary' | 'spouse' | 'both';

export type AppStep = 'step1_wall' | 'step2_lifeplan';
export type AppViewMode = 'matrix' | 'timeline';

export interface PersonProfile {
  name: string;
  ageYears: number;
  ageMonths: number;
  lifeExpectancyYears: number; // 寿命想定（65〜120歳、デフォルト100歳）
  pensionBasicMonthly: number;
  pensionEmployeesMonthly: number;
  pensionAge65Monthly: number;
  pensionStartAge: number;
  careerRetireAge: number;
  careerMonthlySalary: number;
  rehireRetireAge: number;
  rehireMonthlySalary: number;
}

// 期間指定のアイテム（開始年齢〜終了年齢、年間金額、項目名）
export interface PeriodItem {
  id: string;
  title: string;
  startAge: number;
  endAge: number;
  annualAmount: number; // 万円/年
}

// 単発指定のアイテム（発生年齢、金額、項目名）
export interface OneTimeItem {
  id: string;
  title: string;
  age: number;
  amount: number; // 万円
}

// 第2ステップ用：個人の収入・年金戦略
export interface PersonIncomeStrategy {
  careerRetireAge: number; // 正職リタイア年齢
  careerNetIncomeAnnual: number; // 正職就労手取り（万円/年）
  careerSeverancePayNet: number; // 正職退職金（手取り・万円）
  rehireRetireAge: number; // 再雇用リタイア年齢
  rehireNetIncomeAnnual: number; // 再雇用就労手取り（万円/年）
  rehireSeverancePayNet: number; // 再雇用退職金（手取り・万円）
  pensionStartAge: number; // 年金受給開始年齢
  pensionAge65GrossAnnual: number; // 65歳時点の年金額面（万円/年）
  pensionNetRate: number; // 年金手取り率（%、標準85%）
  idecoNetTotal: number; // iDeCo等（手取り・万円）
  idecoReceiveAge: number; // iDeCo受取年齢
  investments: number; // 現在の運用資産（万円）
}

// 第2ステップ用設定
export interface LifePlanConfig {
  // 基本情報＆経済環境
  inflationRate: number; // 物価上昇率（年率 %）
  investmentReturnRate: number; // 運用利回り (NISA等・年率 %)

  // 収入・年金戦略（本人・配偶者個別）
  primaryStrategy: PersonIncomeStrategy;
  spouseStrategy: PersonIncomeStrategy;
  temporaryIncomes: OneTimeItem[]; // 臨時収入 (単発・随時追加可能)

  // 現在の資産とバケット設定
  currentCashSavings: number; // 現在の預貯金（万円）
  limitToNisaCap: boolean; // チェック項目…運用をNISA枠(1800万/人)に制限する
  bucket1Cash: number; // バケット1: 生活インフラ現金（デフォルト300万）
  bucket3Emergency: number; // バケット3: 医療・介護防衛（デフォルト500万）

  // 支出設定（随時追加・編集可能なリスト形式）
  housingCosts: PeriodItem[]; // 住居固定費（内訳・金額・設定期間）
  baseLivingCosts: PeriodItem[]; // 基本生活インフラ費（内訳・金額・設定期間）
  activeLeisureAnnual: PeriodItem[]; // アクティブ娯楽費 (定額)（内訳・金額・設定期間）
  unforeseenBudgetAnnual: number; // 使途不明金・予備費（万円/年）
  largeLeisureOneTimes: OneTimeItem[]; // まとまった娯楽費 (単発)
  specialPeriodExpenses: PeriodItem[]; // 期間指定の特別支出（ローン・学費・仕送り等）
}

export interface SimulatorState {
  version: number;
  currentStep: AppStep;
  householdType: HouseholdType;
  perspective: ActivePerspective;
  targetAgeYears: number;
  primary: PersonProfile;
  spouse: PersonProfile;
  lifePlan: LifePlanConfig;
}

export type ZoneType = 'A' | 'B' | 'C';

export interface CalculationResult {
  personAge: number;
  personAgeMonths: number;
  isDeceased: boolean;
  isSpouseDeceased: boolean;
  pensionGrossAnnual: number;
  pensionGrossMonthly: number;
  pensionNetMonthly: number;
  survivorPensionMonthly: number;
  survivorPensionAnnual: number;
  salaryGrossAnnual: number;
  salaryGrossMonthly: number;
  totalGrossIncomeAnnual: number;
  householdGrossAnnual: number;
  netDisposableIncomeMonthly: number;
  householdNetDisposableIncomeMonthly: number;

  isTaxFree: boolean;
  careInsuranceRate: 1 | 2 | 3;
  medicalInsuranceRate: 1 | 2 | 3;
  highCostCareLimitMonthly: number;
  highCostMedicalLimitMonthly: number;
  hasNursingHomeFoodSubsidy: boolean;
  zone: ZoneType;

  taxFreeWallMargin: number;
  care20WallMargin: number;
  medical30WallMargin: number;
}

export interface MatrixCellData {
  rowOffset: number;
  colOffset: number;
  pensionStartAge: number;
  salaryModifierLabel: string;
  pensionModifierLabel: string;
  result: CalculationResult;
}

export interface LifetimeYearlyRecord {
  age: number;
  spouseAge: number | null;
  isSpouseDeceased: boolean;
  isPrimaryDeceased: boolean;
  householdGrossAnnual: number;
  primaryGrossAnnual: number;
  spouseGrossAnnual: number;
  pensionGrossAnnual: number;
  survivorPensionMonthly: number;
  salaryGrossAnnual: number;
  netDisposableIncomeMonthly: number;
  householdNetDisposableIncomeMonthly: number;
  isTaxFree: boolean;
  zone: ZoneType;
  careRate: 1 | 2 | 3;
  medicalRate: 1 | 2 | 3;
  hasNursingHomeFoodSubsidy: boolean;
  highCostCareLimitMonthly: number;
  highCostMedicalLimitMonthly: number;
  keyMilestone?: string;
}

// 第2ステップ 動的ライフプラン年次キャッシュフローレコード
export interface LifePlanYearRecord {
  year: number;
  age: number;
  spouseAge: number | null;
  isSpouseDeceased: boolean;
  isPrimaryDeceased: boolean;
  
  // 収入詳細（手取り・万円）
  primaryWorkNet: number;
  spouseWorkNet: number;
  primarySeveranceNet: number;
  spouseSeveranceNet: number;
  primaryPensionNet: number;
  spousePensionNet: number;
  survivorPensionNet: number;
  idecoNet: number;
  temporaryIncomeTotal: number;
  totalNetIncome: number;

  // 支出詳細（インフレ調整後・万円）
  housingExpense: number;
  baseLivingExpense: number;
  activeLeisureExpense: number;
  unforeseenExpense: number;
  largeLeisureExpense: number;
  specialPeriodExpense: number;
  totalExpense: number;

  annualCashFlow: number;

  // バケット残高（年末残高・万円）
  bucket1Balance: number;
  bucket2Balance: number;
  bucket3Balance: number;
  totalAssets: number;

  eventLabel?: string;
  isDeficit: boolean;
}
