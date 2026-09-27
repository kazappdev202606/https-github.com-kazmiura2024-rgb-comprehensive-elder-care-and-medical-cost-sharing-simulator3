import { SimulatorState } from './types';

export const CURRENT_STATE_VERSION = 4;

export const DEFAULT_STATE: SimulatorState = {
  version: CURRENT_STATE_VERSION,
  householdType: 'couple',
  perspective: 'primary',
  targetAgeYears: 75,
  primary: {
    name: 'ご本人',
    ageYears: 65,
    ageMonths: 0,
    lifeExpectancyYears: 100, // 寿命想定: デフォルト100歳 (65〜120歳)
    pensionBasicMonthly: 6.8, // 基礎年金 満額約6.8万円
    pensionEmployeesMonthly: 9.7, // 厚生年金 9.7万円
    pensionAge65Monthly: 16.5, // 額面合計16.5万円/月
    pensionStartAge: 65,
    careerRetireAge: 65,
    careerMonthlySalary: 35, // 額面35万円
    rehireRetireAge: 70,
    rehireMonthlySalary: 12, // 額面12万円
    nisaMonthlyDrawdown: 3, // 手取り3万円
  },
  spouse: {
    name: '配偶者',
    ageYears: 62,
    ageMonths: 4, // 2歳8ヶ月差
    lifeExpectancyYears: 100, // 寿命想定: デフォルト100歳 (65〜120歳)
    pensionBasicMonthly: 6.8, // 基礎年金 6.8万円
    pensionEmployeesMonthly: 0.7, // 厚生年金 0.7万円（短期間厚生年金または国民年金主軸）
    pensionAge65Monthly: 7.5, // 額面合計7.5万円/月
    pensionStartAge: 65,
    careerRetireAge: 60,
    careerMonthlySalary: 18,
    rehireRetireAge: 65,
    rehireMonthlySalary: 8,
    nisaMonthlyDrawdown: 2,
  },
};

// 制度の壁（額面年収基準・万円）
export const WALL_THRESHOLDS = {
  TAX_FREE_SINGLE: 155, // 65歳以上単身（公的年金110万控除+45万非課税限度額目安）
  TAX_FREE_COUPLE: 211, // 65歳以上夫婦世帯合算基準目安（主たる年金生活者）
  CARE_20_SINGLE: 280, // 介護2割負担判定基準（単身合計所得160万円＋公的年金控除加味で額面約280万）
  CARE_20_COUPLE: 346, // 介護2割負担判定基準（夫婦合算額面約346万）
  CARE_30_SINGLE: 340, // 介護3割負担判定（単身220万所得＋加味で約340万）
  MEDICAL_30_SINGLE: 383, // 医療現役並み所得（3割）単身年収約383万円
  MEDICAL_30_COUPLE: 520, // 医療現役並み所得（3割）夫婦合算年収約520万円
  MEDICAL_20_LATE_SINGLE: 200, // 75歳以上後期高齢者2割窓口負担（単身200万円以上）
  MEDICAL_20_LATE_COUPLE: 320, // 75歳以上後期高齢者2割窓口負担（夫婦320万円以上）
};
