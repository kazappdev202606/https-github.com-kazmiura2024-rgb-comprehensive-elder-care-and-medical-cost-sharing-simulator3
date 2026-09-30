import { SimulatorState, AssetYearRecord } from './types';
import { buildLifePlanTimeline } from './lifePlanCalculator';

/**
 * 第３ステップ：資産運用プラン作成シミュレーター
 * 
 * 【ルール仕様】:
 * 1. バケット1（生活現金・初期300万円）とバケット3（医療介護防衛・初期500万円）は切り崩し計画とは完全別枠で温存。
 *    シーケンス・オブ・リターン・リスクに対する最後の防護壁。
 * 2. 余剰現金＝（現在の預貯金 － バケット1 － バケット3）。
 * 3. 初期運用資産は、まずNISA枠へ優先配分（本人上限1800万、配偶者上限1800万）。
 *    NISA枠制限がOFFの場合は超過分を「特定口座」へ配分。
 * 4. 【余剰金がある年（黒字）】:
 *    ① NISAの年間上限枠（1人年360万円、夫婦で年720万円）＆生涯枠（1人1800万円、夫婦3600万円）まで最優先でNISA投資。
 *    ② もし特定口座に残高があり、NISA枠に余裕がある場合は特定口座からNISAへ移行（ロールオーバー）。
 *    ③ NISA制限がOFFの場合、残りの余剰金は「特定口座（源泉徴収あり）」に全額投資。NISA制限がONの場合は余剰現金として保持。
 * 5. 【不足金がある年（赤字取り崩し）】:
 *    取り崩し優先順位:
 *    ① 余剰現金（待機預貯金）
 *    ② 特定口座（課税口座を先に消化）
 *    ③ NISA口座（非課税口座を最後まで温存して複利最大化）
 *    ④ それでも不足する場合、最後の安全弁としてバケット1、バケット3を取り崩し（緊急警告）。
 */
export function buildAssetManagementTimeline(
  state: SimulatorState,
  overrideNisaOnly?: boolean
): AssetYearRecord[] {
  const isSingle = state.householdType === 'single';
  const cfg = state.lifePlan;

  // NISA限定フラグ（override指定があればそれを優先、なければ設定値）
  const isNisaOnly = overrideNisaOnly !== undefined ? overrideNisaOnly : cfg.limitToNisaCap;

  // 第2ステップの動的キャッシュフローをベースに計算
  const lifePlanRecords = buildLifePlanTimeline(state);

  const nisaLifetimeCap = isSingle ? 1800 : 3600; // 生涯上限枠
  const nisaAnnualCap = isSingle ? 360 : 720; // 年間上限枠
  const returnRate = cfg.investmentReturnRate / 100;

  // 初期資産の仕分け
  const b1Init = cfg.bucket1Cash;
  const b3Init = cfg.bucket3Emergency;

  // 待機余剰現金（預貯金からバケット1・3を隔離した残り）
  let currentSurplusCash = Math.max(0, cfg.currentCashSavings - b1Init - b3Init);
  let currentB1 = b1Init;
  let currentB3 = b3Init;

  // 運用資産の初期配分
  let initialTotalInvestments = cfg.primaryStrategy.investments + (isSingle ? 0 : cfg.spouseStrategy.investments);
  let currentNisa = Math.min(nisaLifetimeCap, initialTotalInvestments);
  let nisaContributed = currentNisa;
  let currentTaxable = isNisaOnly ? 0 : Math.max(0, initialTotalInvestments - currentNisa);

  const records: AssetYearRecord[] = [];

  for (let i = 0; i < lifePlanRecords.length; i++) {
    const lp = lifePlanRecords[i];
    const netIncome = lp.totalNetIncome;
    const expense = lp.totalExpense;
    const cashFlow = lp.annualCashFlow; // 収入 - 支出

    // 投資・取り崩しアクションの初期化
    let investToNisa = 0;
    let investToTaxable = 0;
    let rolloverToNisa = 0;

    let withdrawFromSurplusCash = 0;
    let withdrawFromTaxable = 0;
    let withdrawFromNisa = 0;
    let usedEmergencyBuffer = 0;

    // 前年の運用資産にリターン発生（年初）
    currentNisa = Math.round(currentNisa * (1 + returnRate) * 10) / 10;
    currentTaxable = Math.round(currentTaxable * (1 + returnRate) * 10) / 10;

    // ■ フェーズA: 余剰金（年間黒字）の運用投資
    if (cashFlow > 0) {
      let surplus = cashFlow;

      // 1. NISA口座への最優先投資
      const nisaAvailableCap = Math.max(0, nisaLifetimeCap - nisaContributed);
      const nisaRoomThisYear = Math.min(nisaAnnualCap, nisaAvailableCap);

      if (nisaRoomThisYear > 0) {
        investToNisa = Math.min(surplus, nisaRoomThisYear);
        currentNisa = Math.round((currentNisa + investToNisa) * 10) / 10;
        nisaContributed += investToNisa;
        surplus = Math.round((surplus - investToNisa) * 10) / 10;

        // もし年枠にまだ余裕があり、特定口座に残高があればNISAへシフト（ロールオーバー）
        const remainingNisaRoom = nisaRoomThisYear - investToNisa;
        if (remainingNisaRoom > 0 && currentTaxable > 0) {
          rolloverToNisa = Math.min(currentTaxable, remainingNisaRoom);
          currentTaxable = Math.round((currentTaxable - rolloverToNisa) * 10) / 10;
          currentNisa = Math.round((currentNisa + rolloverToNisa) * 10) / 10;
          nisaContributed += rolloverToNisa;
        }
      }

      // 2. 残った余剰金の配分
      if (surplus > 0) {
        if (!isNisaOnly) {
          // 特定口座（源泉徴収あり）へ全額投資
          investToTaxable = surplus;
          currentTaxable = Math.round((currentTaxable + investToTaxable) * 10) / 10;
        } else {
          // NISA限定の場合は余剰現金として保持
          currentSurplusCash = Math.round((currentSurplusCash + surplus) * 10) / 10;
        }
      }
    }

    // ■ フェーズB: 不足金（年間赤字）の計画的取り崩し
    // 取り崩し順序: ①余剰現金 → ②特定口座 → ③NISA口座 → ④バケット1・3(緊急バッファ)
    else if (cashFlow < 0) {
      let deficit = Math.abs(cashFlow);

      // ① 余剰現金から取り崩し
      if (currentSurplusCash > 0) {
        withdrawFromSurplusCash = Math.min(currentSurplusCash, deficit);
        currentSurplusCash = Math.round((currentSurplusCash - withdrawFromSurplusCash) * 10) / 10;
        deficit = Math.round((deficit - withdrawFromSurplusCash) * 10) / 10;
      }

      // ② 特定口座から取り崩し
      if (deficit > 0 && currentTaxable > 0) {
        withdrawFromTaxable = Math.min(currentTaxable, deficit);
        currentTaxable = Math.round((currentTaxable - withdrawFromTaxable) * 10) / 10;
        deficit = Math.round((deficit - withdrawFromTaxable) * 10) / 10;
      }

      // ③ NISA口座から取り崩し（最後まで非課税の複利を温存）
      if (deficit > 0 && currentNisa > 0) {
        withdrawFromNisa = Math.min(currentNisa, deficit);
        currentNisa = Math.round((currentNisa - withdrawFromNisa) * 10) / 10;
        deficit = Math.round((deficit - withdrawFromNisa) * 10) / 10;
      }

      // ④ それでも足りない場合：バケット1(生活現金)およびバケット3(医療介護)から防衛出動
      if (deficit > 0) {
        const availableEmergency = currentB1 + currentB3;
        usedEmergencyBuffer = Math.min(availableEmergency, deficit);
        if (currentB1 >= usedEmergencyBuffer) {
          currentB1 = Math.round((currentB1 - usedEmergencyBuffer) * 10) / 10;
        } else {
          const fromB3 = usedEmergencyBuffer - currentB1;
          currentB1 = 0;
          currentB3 = Math.max(0, Math.round((currentB3 - fromB3) * 10) / 10);
        }
        deficit = Math.round((deficit - usedEmergencyBuffer) * 10) / 10;
      }
    }

    const totalNetAssets = Math.round(
      (currentNisa + currentTaxable + currentSurplusCash + currentB1 + currentB3) * 10
    ) / 10;

    const isDepleted = totalNetAssets <= 0;

    records.push({
      year: lp.year,
      age: lp.age,
      spouseAge: lp.spouseAge,
      isSpouseDeceased: lp.isSpouseDeceased,
      isPrimaryDeceased: lp.isPrimaryDeceased,
      totalNetIncome: netIncome,
      totalExpense: expense,
      annualCashFlow: cashFlow,
      investToNisa,
      investToTaxable,
      rolloverToNisa,
      withdrawFromSurplusCash,
      withdrawFromTaxable,
      withdrawFromNisa,
      usedEmergencyBuffer,
      nisaBalance: currentNisa,
      nisaCumulativeContributed: nisaContributed,
      taxableBalance: currentTaxable,
      surplusCashBalance: currentSurplusCash,
      bucket1Balance: currentB1,
      bucket3Balance: currentB3,
      totalNetAssets,
      isNisaCapped: nisaContributed >= nisaLifetimeCap,
      isDepleted,
      eventLabel: lp.eventLabel,
    });
  }

  return records;
}
