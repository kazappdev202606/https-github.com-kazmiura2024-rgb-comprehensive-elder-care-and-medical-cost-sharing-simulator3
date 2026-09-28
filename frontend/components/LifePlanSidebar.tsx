import React, { useState } from 'react';
import {
  SimulatorState,
  PersonIncomeStrategy,
  PeriodItem,
  OneTimeItem
} from '../types';
import {
  TrendingUp,
  Percent,
  Wallet,
  Home,
  Coffee,
  Plane,
  ChevronLeft,
  Plus,
  Trash2,
  Briefcase,
  Award,
  HeartPulse,
  Sparkles,
  Clock
} from 'lucide-react';

interface LifePlanSidebarProps {
  state: SimulatorState;
  onChange: (updater: (prev: SimulatorState) => SimulatorState) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const LifePlanSidebar: React.FC<LifePlanSidebarProps> = ({
  state,
  onChange,
  onToggleCollapse,
}) => {
  const isCouple = state.householdType === 'couple';
  const cfg = state.lifePlan;

  // 編集中のタブ（本人 / 配偶者）
  const [roleTab, setRoleTab] = useState<'primary' | 'spouse'>('primary');

  // ヘルパー：PersonIncomeStrategy 更新（第1ステップの primary / spouse とも完全同期）
  const handleStrategyChange = <K extends keyof PersonIncomeStrategy>(
    role: 'primary' | 'spouse',
    key: K,
    val: PersonIncomeStrategy[K]
  ) => {
    onChange((prev) => {
      const updatedStrategy = {
        ...prev.lifePlan[role === 'primary' ? 'primaryStrategy' : 'spouseStrategy'],
        [key]: val,
      };

      // 第1ステップ側の PersonProfile も同時に双方向同期
      const updatedPerson = { ...prev[role] };

      if (key === 'careerRetireAge') {
        updatedPerson.careerRetireAge = val as number;
      } else if (key === 'rehireRetireAge') {
        updatedPerson.rehireRetireAge = val as number;
      } else if (key === 'pensionStartAge') {
        updatedPerson.pensionStartAge = val as number;
      } else if (key === 'pensionAge65GrossAnnual') {
        // 年額から月額へ反映
        const monthly = Math.round(((val as number) / 12) * 10) / 10;
        updatedPerson.pensionAge65Monthly = monthly;
        // 基礎年金と厚生年金の配分を維持または按分
        const currentTotal = updatedPerson.pensionBasicMonthly + updatedPerson.pensionEmployeesMonthly;
        if (currentTotal > 0) {
          const ratioBasic = updatedPerson.pensionBasicMonthly / currentTotal;
          updatedPerson.pensionBasicMonthly = Math.round(monthly * ratioBasic * 10) / 10;
          updatedPerson.pensionEmployeesMonthly = Math.round((monthly - updatedPerson.pensionBasicMonthly) * 10) / 10;
        } else {
          updatedPerson.pensionBasicMonthly = 6.8;
          updatedPerson.pensionEmployeesMonthly = Math.max(0, Math.round((monthly - 6.8) * 10) / 10);
        }
      }

      return {
        ...prev,
        [role]: updatedPerson,
        lifePlan: {
          ...prev.lifePlan,
          [role === 'primary' ? 'primaryStrategy' : 'spouseStrategy']: updatedStrategy,
        },
      };
    });
  };

  // 寿命想定の変更（第1ステップと第2ステップの両方に完全同期）
  const handleLifeExpectancyChange = (role: 'primary' | 'spouse', value: number) => {
    onChange((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        lifeExpectancyYears: value,
      },
    }));
  };

  // 臨時収入の追加
  const addTemporaryIncome = () => {
    const newItem: OneTimeItem = {
      id: `ti-${Date.now()}`,
      title: '臨時収入',
      age: 68,
      amount: 100,
    };
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        temporaryIncomes: [...(prev.lifePlan.temporaryIncomes || []), newItem],
      },
    }));
  };

  const removeTemporaryIncome = (id: string) => {
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        temporaryIncomes: (prev.lifePlan.temporaryIncomes || []).filter((i) => i.id !== id),
      },
    }));
  };

  // 動的リスト汎用更新（期間アイテム）
  const handlePeriodItemUpdate = (
    listKey: 'housingCosts' | 'baseLivingCosts' | 'activeLeisureAnnual' | 'specialPeriodExpenses',
    id: string,
    field: keyof PeriodItem,
    value: any
  ) => {
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        [listKey]: (prev.lifePlan[listKey] || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addPeriodItem = (
    listKey: 'housingCosts' | 'baseLivingCosts' | 'activeLeisureAnnual' | 'specialPeriodExpenses',
    defaultTitle: string,
    defaultAmount: number
  ) => {
    const newItem: PeriodItem = {
      id: `${listKey}-${Date.now()}`,
      title: defaultTitle,
      startAge: 65,
      endAge: 80,
      annualAmount: defaultAmount,
    };
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        [listKey]: [...(prev.lifePlan[listKey] || []), newItem],
      },
    }));
  };

  const removePeriodItem = (
    listKey: 'housingCosts' | 'baseLivingCosts' | 'activeLeisureAnnual' | 'specialPeriodExpenses',
    id: string
  ) => {
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        [listKey]: (prev.lifePlan[listKey] || []).filter((item) => item.id !== id),
      },
    }));
  };

  // 動的リスト汎用更新（単発アイテム）
  const handleOneTimeItemUpdate = (
    listKey: 'largeLeisureOneTimes',
    id: string,
    field: keyof OneTimeItem,
    value: any
  ) => {
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        [listKey]: (prev.lifePlan[listKey] || []).map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addLargeLeisure = () => {
    const newItem: OneTimeItem = {
      id: `ll-${Date.now()}`,
      title: '記念旅行・まとまった買物',
      age: 70,
      amount: 100,
    };
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        largeLeisureOneTimes: [...(prev.lifePlan.largeLeisureOneTimes || []), newItem],
      },
    }));
  };

  const removeLargeLeisure = (id: string) => {
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        largeLeisureOneTimes: (prev.lifePlan.largeLeisureOneTimes || []).filter((i) => i.id !== id),
      },
    }));
  };

  const activeStrategy = roleTab === 'primary' ? cfg.primaryStrategy : cfg.spouseStrategy;
  const activeProfile = roleTab === 'primary' ? state.primary : state.spouse;

  return (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 text-sm relative">
      {/* 上部ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div>
          <span className="text-xs font-black text-slate-800 tracking-tight block">
            第２ステップ：詳細シミュレーション項目
          </span>
          <span className="text-[10px] text-slate-500">第1ステップと双方向リアルタイム同期中</span>
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>たたむ</span>
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────── */}
      {/* 1. 基本情報＆経済環境 */}
      {/* ─────────────────────────────────────── */}
      <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-indigo-600" />
            1. 基本情報＆経済環境
          </span>
          <span className="text-[10px] text-slate-400">マニュアル推奨値</span>
        </div>

        {/* 年齢設定（夫婦世帯なら両方） */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-slate-600 text-[10px] block font-medium">
              {state.primary.name}の現在年齢
            </span>
            <div className="flex items-center gap-1 font-mono mt-0.5">
              <input
                type="number"
                min={50}
                max={95}
                value={state.primary.ageYears}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    primary: { ...prev.primary, ageYears: parseInt(e.target.value) || 65 },
                  }))
                }
                className="w-12 border border-slate-300 rounded px-1 text-right text-xs"
              />
              <span className="text-slate-600">歳</span>
            </div>
          </div>

          {isCouple ? (
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-600 text-[10px] block font-medium">
                {state.spouse.name}の現在年齢
              </span>
              <div className="flex items-center gap-1 font-mono mt-0.5">
                <input
                  type="number"
                  min={50}
                  max={95}
                  value={state.spouse.ageYears}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      spouse: { ...prev.spouse, ageYears: parseInt(e.target.value) || 62 },
                    }))
                  }
                  className="w-12 border border-slate-300 rounded px-1 text-right text-xs"
                />
                <span className="text-slate-600">歳</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 p-2 rounded-lg text-[10px] text-slate-400 flex items-center justify-center">
              単身世帯設定
            </div>
          )}
        </div>

        {/* 寿命想定の設定（第1・第2ステップ双方向完全連動） */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              寿命想定の設定（65〜120歳）
            </span>
            <span className="text-[9px] text-slate-400">第1ステップと共通連動</span>
          </div>

          {/* 本人の想定寿命 */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-[11px] text-slate-600">{state.primary.name}の想定寿命:</span>
              <span className="font-bold font-mono text-sky-700 bg-sky-50 px-2 py-0.2 rounded border border-sky-200">
                {state.primary.lifeExpectancyYears} 歳
              </span>
            </div>
            <input
              type="range"
              min={65}
              max={120}
              step={1}
              value={state.primary.lifeExpectancyYears}
              onChange={(e) => handleLifeExpectancyChange('primary', parseInt(e.target.value) || 100)}
              className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>

          {/* 配偶者の想定寿命 */}
          {isCouple && (
            <div className="pt-1.5 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[11px] text-slate-600">{state.spouse.name}の想定寿命:</span>
                <span className="font-bold font-mono text-rose-700 bg-rose-50 px-2 py-0.2 rounded border border-rose-200">
                  {state.spouse.lifeExpectancyYears} 歳
                </span>
              </div>
              <input
                type="range"
                min={65}
                max={120}
                step={1}
                value={state.spouse.lifeExpectancyYears}
                onChange={(e) => handleLifeExpectancyChange('spouse', parseInt(e.target.value) || 100)}
                className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 物価上昇率 */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-600">物価上昇率 (年率):</span>
            <span className="font-bold font-mono text-slate-900 bg-white px-2 py-0.2 rounded border border-slate-300">
              {cfg.inflationRate} %
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={3.5}
            step={0.1}
            value={cfg.inflationRate}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                lifePlan: { ...prev.lifePlan, inflationRate: parseFloat(e.target.value) },
              }))
            }
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
          />
        </div>

        {/* 運用利回り (NISA等) */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-600">運用利回り (NISA等・年率):</span>
            <span className="font-bold font-mono text-indigo-700 bg-white px-2 py-0.2 rounded border border-indigo-300">
              {cfg.investmentReturnRate} %
            </span>
          </div>
          <input
            type="range"
            min={1.0}
            max={7.0}
            step={0.5}
            value={cfg.investmentReturnRate}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                lifePlan: { ...prev.lifePlan, investmentReturnRate: parseFloat(e.target.value) },
              }))
            }
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/* 2. 収入・年金戦略 */}
      {/* ─────────────────────────────────────── */}
      <div className="border border-sky-200 bg-sky-50/40 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            2. 収入・年金戦略
          </span>
          {isCouple && (
            <div className="flex items-center bg-white rounded-lg p-0.5 border border-sky-200 text-[11px]">
              <button
                type="button"
                onClick={() => setRoleTab('primary')}
                className={`px-2 py-0.5 rounded font-bold ${
                  roleTab === 'primary' ? 'bg-sky-600 text-white' : 'text-slate-600'
                }`}
              >
                👤 {state.primary.name}
              </button>
              <button
                type="button"
                onClick={() => setRoleTab('spouse')}
                className={`px-2 py-0.5 rounded font-bold ${
                  roleTab === 'spouse' ? 'bg-rose-600 text-white' : 'text-slate-600'
                }`}
              >
                👥 {state.spouse.name}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-700 block border-b pb-1">
            {roleTab === 'primary' ? state.primary.name : state.spouse.name} の就労・年金・退職金
          </span>

          {/* 正職リタイア年齢 & 手取り */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">正職リタイア年齢:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={activeStrategy.careerRetireAge}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'careerRetireAge', parseInt(e.target.value) || 60)
                  }
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">歳</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">正職就労手取り(年):</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={activeStrategy.careerNetIncomeAnnual}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'careerNetIncomeAnnual', parseInt(e.target.value) || 0)
                  }
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">万</span>
              </div>
            </div>
          </div>

          {/* 正職 退職金 (手取り) */}
          <div className="text-xs">
            <span className="text-[10px] text-slate-500 block">正職 退職金 (手取り):</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={activeStrategy.careerSeverancePayNet}
                onChange={(e) =>
                  handleStrategyChange(roleTab, 'careerSeverancePayNet', parseInt(e.target.value) || 0)
                }
                className="w-20 border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
              />
              <span className="text-[10px]">万円</span>
            </div>
          </div>

          {/* 再雇用リタイア年齢 & 手取り */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-500 block">再雇用リタイア年齢:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={activeStrategy.rehireRetireAge}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'rehireRetireAge', parseInt(e.target.value) || 65)
                  }
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">歳</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">再雇用手取り(年):</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={activeStrategy.rehireNetIncomeAnnual}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'rehireNetIncomeAnnual', parseInt(e.target.value) || 0)
                  }
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">万</span>
              </div>
            </div>
          </div>

          {/* 再雇用 退職金 (手取り) */}
          <div className="text-xs">
            <span className="text-[10px] text-slate-500 block">再雇用 退職金 (手取り):</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={activeStrategy.rehireSeverancePayNet}
                onChange={(e) =>
                  handleStrategyChange(roleTab, 'rehireSeverancePayNet', parseInt(e.target.value) || 0)
                }
                className="w-20 border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
              />
              <span className="text-[10px]">万円</span>
            </div>
          </div>

          {/* 年金受給開始年齢 ＆ 65歳額面 ＆ 手取り率 */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">年金受給開始年齢:</span>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    min={60}
                    max={75}
                    value={activeStrategy.pensionStartAge}
                    onChange={(e) =>
                      handleStrategyChange(roleTab, 'pensionStartAge', parseInt(e.target.value) || 65)
                    }
                    className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                  />
                  <span className="text-[10px]">歳</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">65歳年金額面(年):</span>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    value={activeStrategy.pensionAge65GrossAnnual}
                    onChange={(e) =>
                      handleStrategyChange(roleTab, 'pensionAge65GrossAnnual', parseInt(e.target.value) || 0)
                    }
                    className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs font-bold text-sky-800"
                  />
                  <span className="text-[10px]">万</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block">年金手取り率 (%):</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min={70}
                  max={95}
                  value={activeStrategy.pensionNetRate}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'pensionNetRate', parseInt(e.target.value) || 85)
                  }
                  className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">% (標準85%)</span>
              </div>
            </div>
          </div>

          {/* iDeCo等 (手取り) & 受取年齢 */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">iDeCo等(手取り):</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={activeStrategy.idecoNetTotal}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'idecoNetTotal', parseInt(e.target.value) || 0)
                  }
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">万</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">iDeCo受取年齢:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min={60}
                  max={75}
                  value={activeStrategy.idecoReceiveAge}
                  onChange={(e) =>
                    handleStrategyChange(roleTab, 'idecoReceiveAge', parseInt(e.target.value) || 65)
                  }
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
                />
                <span className="text-[10px]">歳</span>
              </div>
            </div>
          </div>
        </div>

        {/* 臨時収入 (単発・随時追加リスト) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">
              臨時収入 (単発)：
            </span>
            <button
              type="button"
              onClick={addTemporaryIncome}
              className="text-[10px] font-bold text-sky-700 bg-white hover:bg-sky-50 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              追加
            </button>
          </div>

          <div className="space-y-1.5">
            {(cfg.temporaryIncomes || []).map((item) => (
              <div
                key={item.id}
                className="bg-white p-2 rounded-lg border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = (cfg.temporaryIncomes || []).map((i) =>
                        i.id === item.id ? { ...i, title: e.target.value } : i
                      );
                      onChange((prev) => ({
                        ...prev,
                        lifePlan: { ...prev.lifePlan, temporaryIncomes: updated },
                      }));
                    }}
                    className="border border-slate-300 rounded px-1.5 py-0.5 text-xs flex-1 font-semibold"
                    placeholder="名目"
                  />
                  <button
                    type="button"
                    onClick={() => removeTemporaryIncome(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-slate-500 font-sans">受取:</span>
                  <input
                    type="number"
                    value={item.age}
                    onChange={(e) => {
                      const updated = (cfg.temporaryIncomes || []).map((i) =>
                        i.id === item.id ? { ...i, age: parseInt(e.target.value) || 60 } : i
                      );
                      onChange((prev) => ({
                        ...prev,
                        lifePlan: { ...prev.lifePlan, temporaryIncomes: updated },
                      }));
                    }}
                    className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right"
                  />
                  <span>歳</span>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => {
                      const updated = (cfg.temporaryIncomes || []).map((i) =>
                        i.id === item.id ? { ...i, amount: parseInt(e.target.value) || 0 } : i
                      );
                      onChange((prev) => ({
                        ...prev,
                        lifePlan: { ...prev.lifePlan, temporaryIncomes: updated },
                      }));
                    }}
                    className="w-16 border border-slate-300 rounded px-1 py-0.5 text-right font-bold text-sky-800 ml-auto"
                  />
                  <span>万円</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/* 3. 現在の資産とバケット設定 */}
      {/* ─────────────────────────────────────── */}
      <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            3. 現在の資産とバケット設定
          </span>
          <span className="text-[10px] text-emerald-800 font-bold font-mono">
            預金＋運用資産計: {cfg.currentCashSavings + cfg.primaryStrategy.investments + (isCouple ? cfg.spouseStrategy.investments : 0)}万
          </span>
        </div>

        {/* 現在の預貯金 */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-700 font-medium">現在の預貯金:</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={cfg.currentCashSavings}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    lifePlan: { ...prev.lifePlan, currentCashSavings: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-20 border border-slate-300 rounded px-1.5 py-0.5 text-right font-bold"
              />
              <span className="text-[10px]">万円</span>
            </div>
          </div>
        </div>

        {/* 現在の運用資産（本人・配偶者両方） */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
          <span className="text-slate-700 font-medium block">現在の運用資産:</span>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500">👤 {state.primary.name}:</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={cfg.primaryStrategy.investments}
                onChange={(e) => handleStrategyChange('primary', 'investments', parseInt(e.target.value) || 0)}
                className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-bold text-indigo-700"
              />
              <span className="text-[10px]">万円</span>
            </div>
          </div>

          {isCouple && (
            <div className="flex justify-between items-center pt-1 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">👥 {state.spouse.name}:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  value={cfg.spouseStrategy.investments}
                  onChange={(e) => handleStrategyChange('spouse', 'investments', parseInt(e.target.value) || 0)}
                  className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-bold text-indigo-700"
                />
                <span className="text-[10px]">万円</span>
              </div>
            </div>
          )}

          {/* チェック項目…運用をNISA枠(1800万/人)に制限する */}
          <label className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-indigo-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={cfg.limitToNisaCap}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  lifePlan: { ...prev.lifePlan, limitToNisaCap: e.target.checked },
                }))
              }
              className="accent-indigo-600 rounded"
            />
            <span className="font-semibold">運用をNISA枠 ({isCouple ? '3,600万' : '1,800万'}) に制限する</span>
          </label>
        </div>

        {/* バケット1 & バケット3 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-600 font-medium block">
              バケット1 (生活現金):
            </span>
            <div className="flex items-center gap-1 font-mono mt-1">
              <input
                type="number"
                step={50}
                value={cfg.bucket1Cash}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    lifePlan: { ...prev.lifePlan, bucket1Cash: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full border border-slate-300 rounded px-1 text-right text-xs"
              />
              <span className="text-[10px]">万</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">デフォルト300万</span>
          </div>

          <div className="bg-white p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-600 font-medium block">
              バケット3 (医療介護防衛):
            </span>
            <div className="flex items-center gap-1 font-mono mt-1">
              <input
                type="number"
                step={50}
                value={cfg.bucket3Emergency}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    lifePlan: { ...prev.lifePlan, bucket3Emergency: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-full border border-slate-300 rounded px-1 text-right text-xs"
              />
              <span className="text-[10px]">万</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">デフォルト500万</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/* 4. 支出設定 */}
      {/* ─────────────────────────────────────── */}
      <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-3.5">
        <div className="flex items-center justify-between border-b pb-1.5">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            4. 支出設定（随時追加・期間変更可能）
          </span>
          <span className="text-[10px] text-slate-400">現在価値・インフレ自動連動</span>
        </div>

        {/* ① 住居固定費（期間アイテム） */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-600" />
              住居固定費：
            </span>
            <button
              type="button"
              onClick={() => addPeriodItem('housingCosts', '家賃/管理修繕/固定資産税', 60)}
              className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              追加
            </button>
          </div>

          {(cfg.housingCosts || []).map((item) => (
            <div key={item.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handlePeriodItemUpdate('housingCosts', item.id, 'title', e.target.value)}
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs flex-1 font-semibold bg-white"
                />
                <button
                  type="button"
                  onClick={() => removePeriodItem('housingCosts', item.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <input
                  type="number"
                  value={item.startAge}
                  onChange={(e) => handlePeriodItemUpdate('housingCosts', item.id, 'startAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>〜</span>
                <input
                  type="number"
                  value={item.endAge}
                  onChange={(e) => handlePeriodItemUpdate('housingCosts', item.id, 'endAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>歳</span>
                <input
                  type="number"
                  value={item.annualAmount}
                  onChange={(e) => handlePeriodItemUpdate('housingCosts', item.id, 'annualAmount', parseInt(e.target.value) || 0)}
                  className="w-14 border border-slate-300 rounded px-1 py-0.5 text-right font-bold ml-auto bg-white"
                />
                <span>万/年</span>
              </div>
            </div>
          ))}
        </div>

        {/* ② 基本生活インフラ費（期間アイテム） */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              基本生活インフラ費：
            </span>
            <button
              type="button"
              onClick={() => addPeriodItem('baseLivingCosts', '食費・光熱費・通信費', 180)}
              className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              追加
            </button>
          </div>

          {(cfg.baseLivingCosts || []).map((item) => (
            <div key={item.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handlePeriodItemUpdate('baseLivingCosts', item.id, 'title', e.target.value)}
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs flex-1 font-semibold bg-white"
                />
                <button
                  type="button"
                  onClick={() => removePeriodItem('baseLivingCosts', item.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <input
                  type="number"
                  value={item.startAge}
                  onChange={(e) => handlePeriodItemUpdate('baseLivingCosts', item.id, 'startAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>〜</span>
                <input
                  type="number"
                  value={item.endAge}
                  onChange={(e) => handlePeriodItemUpdate('baseLivingCosts', item.id, 'endAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>歳</span>
                <input
                  type="number"
                  value={item.annualAmount}
                  onChange={(e) => handlePeriodItemUpdate('baseLivingCosts', item.id, 'annualAmount', parseInt(e.target.value) || 0)}
                  className="w-14 border border-slate-300 rounded px-1 py-0.5 text-right font-bold ml-auto bg-white"
                />
                <span>万/年</span>
              </div>
            </div>
          ))}
        </div>

        {/* ③ アクティブ娯楽費 (定額) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-sky-600" />
              アクティブ娯楽費 (定額・B2取崩し)：
            </span>
            <button
              type="button"
              onClick={() => addPeriodItem('activeLeisureAnnual', '毎年の旅行・趣味・外食', 60)}
              className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              追加
            </button>
          </div>

          {(cfg.activeLeisureAnnual || []).map((item) => (
            <div key={item.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handlePeriodItemUpdate('activeLeisureAnnual', item.id, 'title', e.target.value)}
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs flex-1 font-semibold bg-white"
                />
                <button
                  type="button"
                  onClick={() => removePeriodItem('activeLeisureAnnual', item.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <input
                  type="number"
                  value={item.startAge}
                  onChange={(e) => handlePeriodItemUpdate('activeLeisureAnnual', item.id, 'startAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>〜</span>
                <input
                  type="number"
                  value={item.endAge}
                  onChange={(e) => handlePeriodItemUpdate('activeLeisureAnnual', item.id, 'endAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>歳</span>
                <input
                  type="number"
                  value={item.annualAmount}
                  onChange={(e) => handlePeriodItemUpdate('activeLeisureAnnual', item.id, 'annualAmount', parseInt(e.target.value) || 0)}
                  className="w-14 border border-slate-300 rounded px-1 py-0.5 text-right font-bold text-sky-700 ml-auto bg-white"
                />
                <span>万/年</span>
              </div>
            </div>
          ))}
        </div>

        {/* ④ 使途不明金・予備費 */}
        <div className="pt-1 border-t border-slate-100 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">使途不明金・予備費 (年額):</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                value={cfg.unforeseenBudgetAnnual}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    lifePlan: { ...prev.lifePlan, unforeseenBudgetAnnual: parseInt(e.target.value) || 0 },
                  }))
                }
                className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs"
              />
              <span className="text-[10px]">万円/年</span>
            </div>
          </div>
        </div>

        {/* ⑤ まとまった娯楽費 (単発・B2からの予定切り崩し) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              まとまった娯楽費 (単発・B2取崩し)：
            </span>
            <button
              type="button"
              onClick={addLargeLeisure}
              className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              追加
            </button>
          </div>

          {(cfg.largeLeisureOneTimes || []).map((item) => (
            <div key={item.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleOneTimeItemUpdate('largeLeisureOneTimes', item.id, 'title', e.target.value)}
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs flex-1 font-semibold bg-white"
                />
                <button
                  type="button"
                  onClick={() => removeLargeLeisure(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-slate-500 font-sans">時期:</span>
                <input
                  type="number"
                  value={item.age}
                  onChange={(e) => handleOneTimeItemUpdate('largeLeisureOneTimes', item.id, 'age', parseInt(e.target.value) || 60)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>歳</span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleOneTimeItemUpdate('largeLeisureOneTimes', item.id, 'amount', parseInt(e.target.value) || 0)}
                  className="w-16 border border-slate-300 rounded px-1 py-0.5 text-right font-bold text-amber-700 ml-auto bg-white"
                />
                <span>万円</span>
              </div>
            </div>
          ))}
        </div>

        {/* ⑥ 期間指定の特別支出（ローン・学費・仕送り等） */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              期間指定の特別支出 (車・学費・仕送り等)：
            </span>
            <button
              type="button"
              onClick={() => addPeriodItem('specialPeriodExpenses', 'マイカーローン・教育等', 50)}
              className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              追加
            </button>
          </div>

          {(cfg.specialPeriodExpenses || []).map((item) => (
            <div key={item.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between gap-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handlePeriodItemUpdate('specialPeriodExpenses', item.id, 'title', e.target.value)}
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs flex-1 font-semibold bg-white"
                />
                <button
                  type="button"
                  onClick={() => removePeriodItem('specialPeriodExpenses', item.id)}
                  className="text-slate-400 hover:text-rose-600 p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <input
                  type="number"
                  value={item.startAge}
                  onChange={(e) => handlePeriodItemUpdate('specialPeriodExpenses', item.id, 'startAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>〜</span>
                <input
                  type="number"
                  value={item.endAge}
                  onChange={(e) => handlePeriodItemUpdate('specialPeriodExpenses', item.id, 'endAge', parseInt(e.target.value) || 0)}
                  className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right bg-white"
                />
                <span>歳</span>
                <input
                  type="number"
                  value={item.annualAmount}
                  onChange={(e) => handlePeriodItemUpdate('specialPeriodExpenses', item.id, 'annualAmount', parseInt(e.target.value) || 0)}
                  className="w-14 border border-slate-300 rounded px-1 py-0.5 text-right font-bold ml-auto bg-white"
                />
                <span>万/年</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
