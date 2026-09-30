export type HouseholdType = 'single' | 'couple';
export type ActivePerspective = 'primary' | 'spouse' | 'both';

export type AppStep = 'step1_wall' | 'step2_lifeplan' | 'step3_asset'; // 第1〜第3ステップ
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
  careerRetireAge: number;
  careerNetIncomeAnnual: number;
  careerSeverancePayNet: number;
  rehireRetireAge: number;
  rehireNetIncomeAnnual: number;
  rehireSeverancePayNet: number;
  pensionStartAge: number;
  pensionAge65GrossAnnual: number;
  pensionNetRate: number;
  idecoNetTotal: number;
  idecoReceiveAge: number;
  investments: number; // 現在の運用資産（万円）
}

// 第2ステップ設定
export interface LifePlanConfig {
  inflationRate: number;
  investmentReturnRate: number;

  primaryStrategy: PersonIncomeStrategy;
  spouseStrategy: PersonIncomeStrategy;
  temporaryIncomes: OneTimeItem[];

  currentCashSavings: number; // 現在の預貯金（万円）
  limitToNisaCap: boolean; // 運用をNISA枠(1800万/人)に制限する
  bucket1Cash: number; // バケット1: 生活インフラ現金（デフォルト300万）
  bucket3Emergency: number; // バケット3: 医療・介護防衛（デフォルト500万）

  housingCosts: PeriodItem[];
  baseLivingCosts: PeriodItem[];
  activeLeisureAnnual: PeriodItem[];
  unforeseenBudgetAnnual: number;
  largeLeisureOneTimes: OneTimeItem[];
  specialPeriodExpenses: PeriodItem[];
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

// 第2ステップ 動的ライフプラン年次レコード
export interface LifePlanYearRecord {
  year: number;
  age: number;
  spouseAge: number | null;
  isSpouseDeceased: boolean;
  isPrimaryDeceased: boolean;
  
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

  housingExpense: number;
  baseLivingExpense: number;
  activeLeisureExpense: number;
  unforeseenExpense: number;
  largeLeisureExpense: number;
  specialPeriodExpense: number;
  totalExpense: number;

  annualCashFlow: number;

  bucket1Balance: number;
  bucket2Balance: number;
  bucket3Balance: number;
  totalAssets: number;

  eventLabel?: string;
  isDeficit: boolean;
}

// 第3ステップ用：資産運用・取り崩しシミュレーション年次レコード
export interface AssetYearRecord {
  year: number;
  age: number;
  spouseAge: number | null;
  isSpouseDeceased: boolean;
  isPrimaryDeceased: boolean;

  // 収支
  totalNetIncome: number; // 手取り収入計（万円）
  totalExpense: number; // 支出計（万円）
  annualCashFlow: number; // 年間収支（黒字なら余剰、赤字なら不足・取り崩し）

  // 入金・投資アクション（万円）
  investToNisa: number; // NISA口座への新規投資
  investToTaxable: number; // 特定口座への新規投資
  rolloverToNisa: number; // 特定口座からNISAへの乗り換え移行額

  // 取り崩しアクション（万円）
  withdrawFromSurplusCash: number; // 余剰現金からの取り崩し
  withdrawFromTaxable: number; // 特定口座からの取り崩し
  withdrawFromNisa: number; // NISA口座からの取り崩し（最後の砦）
  usedEmergencyBuffer: number; // バケット1・3の防波堤発動額（枯渇危機時）

  // 年末残高（万円）
  nisaBalance: number; // NISA口座残高
  nisaCumulativeContributed: number; // NISA累計投資額（枠消化チェック用）
  taxableBalance: number; // 特定口座残高
  surplusCashBalance: number; // バケット1・3以外の待機預貯金残高
  bucket1Balance: number; // バケット1（生活現金・300万原則温存）
  bucket3Balance: number; // バケット3（医療介護・500万原則温存）
  totalNetAssets: number; // 純金融資産合計

  isNisaCapped: boolean; // NISA生涯枠に到達しているか
  isDepleted: boolean; // 全ての資産が底をつき破綻したか
  eventLabel?: string;
}
