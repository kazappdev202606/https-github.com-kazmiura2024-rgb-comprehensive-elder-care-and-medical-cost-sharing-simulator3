import { SimulatorState, LifePlanYearRecord } from './types';
import { calculatePensionRate, calculateSurvivorPensionMonthly } from './calculator';

export function buildLifePlanTimeline(state: SimulatorState): LifePlanYearRecord[] {
  const isSingle = state.householdType === 'single';
  const cfg = state.lifePlan;

  const currentYear = new Date().getFullYear();
  const startAge = state.primary.ageYears;
  const endAge = isSingle
    ? Math.min(120, state.primary.lifeExpectancyYears)
    : Math.min(120, Math.max(state.primary.lifeExpectancyYears, state.spouse.lifeExpectancyYears));

  const diffMonths =
    state.spouse.ageYears * 12 + state.spouse.ageMonths - (state.primary.ageYears * 12 + state.primary.ageMonths);

  const records: LifePlanYearRecord[] = [];

  // 1. 運用資産の初期値計算（NISA枠上限チェックを考慮）
  let totalInvestments = cfg.primaryStrategy.investments;
  if (!isSingle) {
    totalInvestments += cfg.spouseStrategy.investments;
  }

  // NISA枠(1800万/人)の制限チェック
  const nisaMaxCap = isSingle ? 1800 : 3600;
  if (cfg.limitToNisaCap && totalInvestments > nisaMaxCap) {
    totalInvestments = nisaMaxCap;
  }

  // バケット残高の初期化
  let currentBucket1 = cfg.bucket1Cash; // 生活インフラ現金（デフォルト300万）
  let currentBucket2 = totalInvestments; // バケット2：運用資産（NISA）
  let currentBucket3 = cfg.bucket3Emergency; // バケット3：医療・介護防衛（デフォルト500万）

  const inflation = cfg.inflationRate / 100;
  const investmentReturn = cfg.investmentReturnRate / 100;

  for (let age = startAge; age <= endAge; age++) {
    const elapsedYears = age - startAge;
    const year = currentYear + elapsedYears;

    const primaryTargetMonths = age * 12 + state.primary.ageMonths;
    const spouseTargetMonths = primaryTargetMonths + diffMonths;
    const spouseAgeNumber = Math.floor(spouseTargetMonths / 12);

    const isPrimaryDeceased = age >= state.primary.lifeExpectancyYears;
    const isSpouseDeceased = !isSingle && spouseAgeNumber >= state.spouse.lifeExpectancyYears;

    // ────────────────────────────
    // 1. 収入の計算（手取り・万円）
    // ────────────────────────────
    let primaryWorkNet = 0;
    let spouseWorkNet = 0;
    let primarySeveranceNet = 0;
    let spouseSeveranceNet = 0;
    let primaryPensionNet = 0;
    let spousePensionNet = 0;
    let survivorPensionNet = 0;
    let idecoNet = 0;
    let temporaryIncomeTotal = 0;

    // ■ ご本人収入
    if (!isPrimaryDeceased) {
      const pStrat = cfg.primaryStrategy;

      // 正職就労
      if (age < pStrat.careerRetireAge) {
        primaryWorkNet = pStrat.careerNetIncomeAnnual;
      } else if (age < pStrat.rehireRetireAge) {
        // 再雇用就労
        primaryWorkNet = pStrat.rehireNetIncomeAnnual;
      }

      // 退職金（正職退職時）
      if (age === pStrat.careerRetireAge && pStrat.careerSeverancePayNet > 0) {
        primarySeveranceNet += pStrat.careerSeverancePayNet;
      }
      // 退職金（再雇用退職時）
      if (age === pStrat.rehireRetireAge && pStrat.rehireSeverancePayNet > 0) {
        primarySeveranceNet += pStrat.rehireSeverancePayNet;
      }

      // 公的年金（繰上げ・繰下げ率を適用）
      if (age >= pStrat.pensionStartAge) {
        const pRate = calculatePensionRate(pStrat.pensionStartAge);
        primaryPensionNet = Math.round(pStrat.pensionAge65GrossAnnual * pRate * (pStrat.pensionNetRate / 100) * 10) / 10;
      }

      // iDeCo受取
      if (age === pStrat.idecoReceiveAge && pStrat.idecoNetTotal > 0) {
        idecoNet += pStrat.idecoNetTotal;
      }
    }

    // ■ 配偶者収入
    if (!isSingle && !isSpouseDeceased) {
      const sStrat = cfg.spouseStrategy;

      // 正職就労
      if (spouseAgeNumber < sStrat.careerRetireAge) {
        spouseWorkNet = sStrat.careerNetIncomeAnnual;
      } else if (spouseAgeNumber < sStrat.rehireRetireAge) {
        // 再雇用就労
        spouseWorkNet = sStrat.rehireNetIncomeAnnual;
      }

      // 退職金（正職退職時）
      if (spouseAgeNumber === sStrat.careerRetireAge && sStrat.careerSeverancePayNet > 0) {
        spouseSeveranceNet += sStrat.careerSeverancePayNet;
      }
      // 退職金（再雇用退職時）
      if (spouseAgeNumber === sStrat.rehireRetireAge && sStrat.rehireSeverancePayNet > 0) {
        spouseSeveranceNet += sStrat.rehireSeverancePayNet;
      }

      // 公的年金
      if (spouseAgeNumber >= sStrat.pensionStartAge) {
        const sRate = calculatePensionRate(sStrat.pensionStartAge);
        spousePensionNet = Math.round(sStrat.pensionAge65GrossAnnual * sRate * (sStrat.pensionNetRate / 100) * 10) / 10;
      }

      // iDeCo受取
      if (spouseAgeNumber === sStrat.idecoReceiveAge && sStrat.idecoNetTotal > 0) {
        idecoNet += sStrat.idecoNetTotal;
      }
    }

    // ■ 遺族厚生年金（配偶者が先に他界した場合・全額非課税）
    if (!isSingle && isSpouseDeceased && !isPrimaryDeceased) {
      const survivorMonthly = calculateSurvivorPensionMonthly(state.spouse, state.primary, age);
      survivorPensionNet = Math.round(survivorMonthly * 12 * 10) / 10;
    } else if (!isSingle && isPrimaryDeceased && !isSpouseDeceased) {
      const survivorMonthly = calculateSurvivorPensionMonthly(state.primary, state.spouse, spouseAgeNumber);
      survivorPensionNet = Math.round(survivorMonthly * 12 * 10) / 10;
    }

    // ■ 臨時収入 (単発・随時追加リストから該当年の合計)
    const matchedTempIncomes = (cfg.temporaryIncomes || []).filter((item) => item.age === age);
    temporaryIncomeTotal = matchedTempIncomes.reduce((sum, item) => sum + (item.amount || 0), 0);

    const totalNetIncome =
      Math.round(
        (primaryWorkNet +
          spouseWorkNet +
          primarySeveranceNet +
          spouseSeveranceNet +
          primaryPensionNet +
          spousePensionNet +
          survivorPensionNet +
          idecoNet +
          temporaryIncomeTotal) *
          10
      ) / 10;

    // ────────────────────────────
    // 2. 支出の計算（インフレ連動・万円）
    // ────────────────────────────
    const inflationFactor = Math.pow(1 + inflation, elapsedYears);

    // ① 住居固定費（期間内アイテムの合計）
    const matchedHousing = (cfg.housingCosts || []).filter(
      (item) => age >= item.startAge && age <= item.endAge
    );
    const housingExpense = Math.round(
      matchedHousing.reduce((sum, item) => sum + item.annualAmount, 0) * inflationFactor * 10
    ) / 10;

    // ② 基本生活インフラ費（期間内アイテムの合計。片方他界後は75%圧縮）
    const matchedLiving = (cfg.baseLivingCosts || []).filter(
      (item) => age >= item.startAge && age <= item.endAge
    );
    let livingSum = matchedLiving.reduce((sum, item) => sum + item.annualAmount, 0);
    if (!isSingle && (isSpouseDeceased || isPrimaryDeceased)) {
      livingSum *= 0.75;
    }
    const baseLivingExpense = Math.round(livingSum * inflationFactor * 10) / 10;

    // ③ アクティブ娯楽費 (定額)（期間内アイテムの合計）
    const matchedLeisure = (cfg.activeLeisureAnnual || []).filter(
      (item) => age >= item.startAge && age <= item.endAge
    );
    const activeLeisureExpense = Math.round(
      matchedLeisure.reduce((sum, item) => sum + item.annualAmount, 0) * inflationFactor * 10
    ) / 10;

    // ④ 使途不明金・予備費
    const unforeseenExpense = Math.round((cfg.unforeseenBudgetAnnual || 0) * inflationFactor * 10) / 10;

    // ⑤ まとまった娯楽費 (単発・該当年齢アイテムの合計)
    const matchedLargeLeisure = (cfg.largeLeisureOneTimes || []).filter((item) => item.age === age);
    const largeLeisureExpense = Math.round(
      matchedLargeLeisure.reduce((sum, item) => sum + item.amount, 0) * inflationFactor * 10
    ) / 10;

    // ⑥ 期間指定の特別支出（ローン・学費・仕送り等）
    const matchedSpecial = (cfg.specialPeriodExpenses || []).filter(
      (item) => age >= item.startAge && age <= item.endAge
    );
    const specialPeriodExpense = Math.round(
      matchedSpecial.reduce((sum, item) => sum + item.annualAmount, 0) * inflationFactor * 10
    ) / 10;

    const totalExpense =
      Math.round(
        (housingExpense +
          baseLivingExpense +
          activeLeisureExpense +
          unforeseenExpense +
          largeLeisureExpense +
          specialPeriodExpense) *
          10
      ) / 10;

    // ────────────────────────────
    // 3. 年間収支とバケット残高遷移
    // ────────────────────────────
    const annualCashFlow = Math.round((totalNetIncome - totalExpense) * 10) / 10;

    // バケット2の成長＆加減算
    const previousBucket2 = currentBucket2;
    if (previousBucket2 > 0) {
      currentBucket2 = Math.round((previousBucket2 * (1 + investmentReturn) + annualCashFlow) * 10) / 10;
    } else {
      currentBucket2 = Math.round((previousBucket2 + annualCashFlow) * 10) / 10;
    }

    const totalAssets = Math.round((currentBucket1 + currentBucket2 + currentBucket3) * 10) / 10;

    // イベントラベル
    let eventLabel: string | undefined = undefined;
    if (primarySeveranceNet > 0 || spouseSeveranceNet > 0) {
      eventLabel = '🎉 退職金受取';
    } else if (age === cfg.primaryStrategy.pensionStartAge) {
      eventLabel = `65歳：${state.primary.name}年金受給開始`;
    } else if (age === cfg.primaryStrategy.idecoReceiveAge && cfg.primaryStrategy.idecoNetTotal > 0) {
      eventLabel = '💰 iDeCo受給';
    } else if (largeLeisureExpense > 0) {
      eventLabel = `✈️ ${matchedLargeLeisure.map((i) => i.title).join(' / ')}`;
    } else if (!isSingle && isSpouseDeceased && spouseAgeNumber === state.spouse.lifeExpectancyYears) {
      eventLabel = `🕊️ 配偶者が${state.spouse.lifeExpectancyYears}歳で他界（遺族年金開始）`;
    }

    records.push({
      year,
      age,
      spouseAge: isSpouseDeceased ? null : spouseAgeNumber,
      isSpouseDeceased,
      isPrimaryDeceased,
      primaryWorkNet,
      spouseWorkNet,
      primarySeveranceNet,
      spouseSeveranceNet,
      primaryPensionNet,
      spousePensionNet,
      survivorPensionNet,
      idecoNet,
      temporaryIncomeTotal,
      totalNetIncome,
      housingExpense,
      baseLivingExpense,
      activeLeisureExpense,
      unforeseenExpense,
      largeLeisureExpense,
      specialPeriodExpense,
      totalExpense,
      annualCashFlow,
      bucket1Balance: currentBucket1,
      bucket2Balance: currentBucket2,
      bucket3Balance: currentBucket3,
      totalAssets,
      eventLabel,
      isDeficit: currentBucket2 < 0,
    });
  }

  return records;
}
