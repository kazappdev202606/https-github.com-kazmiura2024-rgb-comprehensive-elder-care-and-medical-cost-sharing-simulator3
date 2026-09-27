export type HouseholdType = 'single' | 'couple';
export type ActivePerspective = 'primary' | 'spouse' | 'both'; // 'both' で夫婦両方同時・並列表示

export type AppViewMode = 'matrix' | 'timeline'; // 3x3マトリクス vs 生涯推移タイムラインモード

export interface PersonProfile {
  name: string;
  ageYears: number;
  ageMonths: number;
  lifeExpectancyYears: number; // 寿命想定（満年齢 65〜120歳、デフォルト100歳）
  // 65歳基準公的年金（基礎年金と厚生年金・共済部分の個別設定）
  pensionBasicMonthly: number; // 老齢基礎年金月額（国民年金・満額目安約6.8万円）
  pensionEmployeesMonthly: number; // 老齢厚生年金月額（会社員・公務員共済等）
  pensionAge65Monthly: number; // 合計額面月額（互換性・自動連動）
  pensionStartAge: number; // 60〜75歳
  careerRetireAge: number; // 正職引退年齢
  careerMonthlySalary: number; // 正職月額給与（賞与年額÷12含む, 額面万円）
  rehireRetireAge: number; // 再雇用・パート引退年齢
  rehireMonthlySalary: number; // 再雇用月給（賞与月割含む, 額面万円）
  nisaMonthlyDrawdown: number; // NISA等非課税取崩し（万円/月, 手取り）
}

export interface SimulatorState {
  version: number;
  householdType: HouseholdType; // 'single' または 'couple'
  perspective: ActivePerspective;
  targetAgeYears: number; // 検証ターゲット年齢 (primary基準の満年齢)
  primary: PersonProfile;
  spouse: PersonProfile;
}

export type ZoneType = 'A' | 'B' | 'C';

export interface CalculationResult {
  personAge: number; // 計算対象者の満年齢
  personAgeMonths: number;
  isDeceased: boolean; // 本人が寿命を迎えているか
  isSpouseDeceased: boolean; // 配偶者が寿命を迎えているか
  pensionGrossAnnual: number; // 自身の老齢年金年額（額面万円）
  pensionGrossMonthly: number; // 自身の老齢年金月額（額面万円）
  pensionNetMonthly: number; // 老齢年金手取り概算（万円）
  survivorPensionMonthly: number; // 遺族厚生年金月額（非課税・全額手取り加算）
  survivorPensionAnnual: number; // 遺族厚生年金年額（非課税）
  salaryGrossAnnual: number; // 就労給与年額（額面万円）
  salaryGrossMonthly: number; // 就労給与月額（額面万円）
  nisaMonthly: number; // NISA非課税（万円）
  totalGrossIncomeAnnual: number; // 個人判定基準年収（課税対象・額面万円）
  householdGrossAnnual: number; // 世帯合計年収（課税対象・額面万円）
  netDisposableIncomeMonthly: number; // 個人実質手取り生活費概算（万円/月）
  householdNetDisposableIncomeMonthly: number; // 世帯合計手取り生活費概算（万円/月）

  isTaxFree: boolean; // 住民税非課税判定（遺族年金は非課税のため除外）
  careInsuranceRate: 1 | 2 | 3; // 介護負担割合 (1, 2, 3割)
  medicalInsuranceRate: 1 | 2 | 3; // 医療窓口負担割合 (1, 2, 3割)
  highCostCareLimitMonthly: number; // 高額介護上限 (円/月)
  highCostMedicalLimitMonthly: number; // 高額療養費上限 (円/月)
  hasNursingHomeFoodSubsidy: boolean; // 特養食費・居住費減免（補足給付）
  zone: ZoneType; // A: 非課税, B: 一般(1-2割), C: 現役並み(2-3割/高負担)

  // 制度の壁までのマージン（万円単位、正: 余裕、負: 超過）
  taxFreeWallMargin: number; // 住民税非課税の壁までの余裕
  care20WallMargin: number; // 介護2割の壁までの余裕
  medical30WallMargin: number; // 医療現役3割の壁までの余裕
}

export interface MatrixCellData {
  rowOffset: number; // 縦軸: 給与調整 (-1: 0円完全引退, 0: 設定値, +1: +50%増収)
  colOffset: number; // 横軸: 年金受給開始年齢 (-1: -2歳繰上げ, 0: 設定値, +1: +2歳繰下げ)
  pensionStartAge: number;
  salaryModifierLabel: string;
  pensionModifierLabel: string;
  result: CalculationResult;
}

// 生涯推移レコード
export interface LifetimeYearlyRecord {
  age: number; // primaryの年齢
  spouseAge: number | null; // 夫婦時の配偶者年齢（他界後はnull）
  isSpouseDeceased: boolean; // 配偶者が他界しているか（死別単身期）
  isPrimaryDeceased: boolean; // primaryが他界しているか
  householdGrossAnnual: number; // 世帯課税判定年収【額面】（遺族年金は非課税のため含まず）
  primaryGrossAnnual: number; // 夫の課税年収（年金+給与）【額面】
  spouseGrossAnnual: number; // 妻の課税年収（年金+給与）【額面】
  pensionGrossAnnual: number; // 自身の老齢年金年額【額面】
  survivorPensionMonthly: number; // 遺族厚生年金【非課税】
  salaryGrossAnnual: number; // 就労給与年額【額面】
  nisaAnnual: number; // NISA取崩し【手取り】
  netDisposableIncomeMonthly: number; // 個人手取り生活費概算（万円/月）
  householdNetDisposableIncomeMonthly: number; // 世帯合計手取り生活費概算（万円/月）
  isTaxFree: boolean; // 住民税非課税判定
  zone: ZoneType; // ゾーン A / B / C
  careRate: 1 | 2 | 3; // 介護負担割合
  medicalRate: 1 | 2 | 3; // 医療負担割合
  hasNursingHomeFoodSubsidy: boolean; // 特養補足給付
  highCostCareLimitMonthly: number; // 高額介護上限
  highCostMedicalLimitMonthly: number; // 高額療養上限
  keyMilestone?: string;
}
