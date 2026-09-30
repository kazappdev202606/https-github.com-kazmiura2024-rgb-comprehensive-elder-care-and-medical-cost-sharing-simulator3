import React from 'react';
import { SimulatorState, LifePlanConfig } from '../types';
import { HelpTopic } from './HelpExplanationModal';
import {
  TrendingUp,
  Percent,
  Wallet,
  ShieldAlert,
  HelpCircle,
  ChevronLeft,
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  Sparkles,
  Info
} from 'lucide-react';

interface AssetManagementSidebarProps {
  state: SimulatorState;
  onChange: (updater: (prev: SimulatorState) => SimulatorState) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenHelp?: (topic: HelpTopic) => void;
}

export const AssetManagementSidebar: React.FC<AssetManagementSidebarProps> = ({
  state,
  onChange,
  onToggleCollapse,
  onOpenHelp,
}) => {
  const isCouple = state.householdType === 'couple';
  const cfg = state.lifePlan;

  const triggerHelp = (title: string, category: string, whatIsIt: string, howToInput: string, point: string, referenceValue?: string) => {
    if (onOpenHelp) {
      onOpenHelp({ title, category, whatIsIt, howToInput, point, referenceValue });
    }
  };

  const handleConfigChange = <K extends keyof LifePlanConfig>(key: K, val: LifePlanConfig[K]) => {
    onChange((prev) => ({
      ...prev,
      lifePlan: {
        ...prev.lifePlan,
        [key]: val,
      },
    }));
  };

  const totalCurrentInvestments =
    cfg.primaryStrategy.investments + (isCouple ? cfg.spouseStrategy.investments : 0);
  const nisaMaxCap = isCouple ? 3600 : 1800;

  return (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 text-sm relative">
      {/* 上部ヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div>
          <span className="text-xs font-black text-slate-800 tracking-tight block">
            第３ステップ：資産運用・取り崩し戦略
          </span>
          <span className="text-[10px] text-slate-500">余剰金投資＆不足分取り崩し特化設定</span>
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

      {/* 運用口座方針：NISA限定 vs 特定口座フル活用 */}
      <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            運用口座の活用ポリシー
            <button
              type="button"
              onClick={() =>
                triggerHelp(
                  '運用口座の活用ポリシー（NISA限定 vs 特定併用）',
                  '資産運用方針',
                  '家計の黒字余剰金を投資する際、NISA枠（1人1,800万、夫婦3,600万）に限定して運用するか、枠を超えた分も特定口座（課税）でフル投資するかを選択する設定です。',
                  'チェックボックスをONにするとNISA枠限定、OFFにすると特定口座（源泉徴収あり）も併用して全額投資します。ワンクリックで切り替えてグラフで将来資産の違いを比較できます。',
                  '特定口座を使う場合は、必ず「源泉徴収あり・申告不要」を選ぶことで、利益が公的な所得判定に影響せず、医療費や介護保険の自己負担割合悪化を防げます。',
                  '推奨: 資産寿命最大化なら特定口座併用'
                )
              }
              className="text-slate-400 hover:text-sky-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </span>
          <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-300">
            NISA生涯枠: {nisaMaxCap}万
          </span>
        </div>

        {/* トグル設定スイッチ */}
        <div className="bg-white p-3 rounded-lg border border-indigo-200 space-y-2 shadow-2xs">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={cfg.limitToNisaCap}
              onChange={(e) => handleConfigChange('limitToNisaCap', e.target.checked)}
              className="accent-indigo-600 rounded mt-0.5 w-4 h-4"
            />
            <div className="space-y-0.5">
              <span className="font-extrabold text-xs text-slate-900 block">
                運用をNISA枠 ({nisaMaxCap}万円) に限定する
              </span>
              <p className="text-[11px] text-slate-500 leading-snug">
                {cfg.limitToNisaCap
                  ? 'ON: NISA満額（年間360万/生涯1800万/人）後の余剰金は特定口座に投資せず、無リスク現金として残します。'
                  : 'OFF: NISA満額後や年間枠を超えた余剰金は「特定口座（源泉徴収あり）」に全額投資して運用益を最大化します。'}
              </p>
            </div>
          </label>
        </div>

        <p className="text-[10px] text-indigo-900 leading-relaxed">
          💡 <strong>NISA移行ルール:</strong> 特定口座に残高がありNISA年間枠に余裕がある年は、特定口座を取り崩してNISAへ自動移行（ロールオーバー）します。
        </p>
      </div>

      {/* 取り崩し優先順位ルールカード */}
      <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600" />
            不足時の自動取り崩し順序（鉄則）
          </span>
          <button
            type="button"
            onClick={() =>
              triggerHelp(
                '取り崩しの優先順位ルール',
                '取り崩し戦略',
                '赤字の年に、どの資産からどのような順序でお金を引き出すかの最適なルールです。',
                '①余剰現金（待機預金） → ②特定口座（課税運用） → ③NISA口座（非課税運用）の順で自動取り崩しされます。',
                '非課税で複利が増え続けるNISA口座を一番最後に回すことで、資産寿命が何年も引き延ばされます。バケット1と3はこれらが尽きるまで手を付けません。',
                '現金 → 特定 → NISA'
              )
            }
            className="text-slate-400 hover:text-sky-600"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5 font-mono">
          <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 text-[11px]">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
              1
            </span>
            <span className="font-bold text-slate-800">余剰現金（待機預金）</span>
            <span className="text-[10px] text-slate-400 font-sans ml-auto">まず現金を消化</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 text-[11px]">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              2
            </span>
            <span className="font-bold text-indigo-900">特定口座（課税運用）</span>
            <span className="text-[10px] text-slate-400 font-sans ml-auto">課税分を先行売却</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-indigo-300 text-[11px]">
            <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
              3
            </span>
            <span className="font-black text-sky-800">NISA口座（非課税運用）</span>
            <span className="text-[10px] text-emerald-600 font-bold font-sans ml-auto">最後まで非課税温存</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 leading-snug">
          ※バケット1（300万）とバケット3（500万）は別枠で確保され、上記すべてが尽きるまで取り崩されません。
        </p>
      </div>

      {/* 第2ステップからの引き継ぎデータ（再掲・即時編集可能） */}
      <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-3">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b pb-1.5">
          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
          現在の資産・バケット設定 (引継ぎ・微調整)
        </span>

        {/* 預貯金 */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">現在の預貯金:</span>
          <div className="flex items-center gap-1 font-mono">
            <input
              type="number"
              step={50}
              value={cfg.currentCashSavings}
              onChange={(e) => handleConfigChange('currentCashSavings', parseInt(e.target.value) || 0)}
              className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-bold"
            />
            <span className="text-[10px] text-slate-500">万</span>
          </div>
        </div>

        {/* 運用資産 */}
        <div className="space-y-1 pt-1 border-t border-slate-100 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">👤 {state.primary.name}の運用資産:</span>
            <div className="flex items-center gap-1 font-mono">
              <input
                type="number"
                step={50}
                value={cfg.primaryStrategy.investments}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    lifePlan: {
                      ...prev.lifePlan,
                      primaryStrategy: {
                        ...prev.lifePlan.primaryStrategy,
                        investments: parseInt(e.target.value) || 0,
                      },
                    },
                  }))
                }
                className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-bold text-indigo-700"
              />
              <span className="text-[10px] text-slate-500">万</span>
            </div>
          </div>

          {isCouple && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600">👥 {state.spouse.name}の運用資産:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  step={50}
                  value={cfg.spouseStrategy.investments}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      lifePlan: {
                        ...prev.lifePlan,
                        spouseStrategy: {
                          ...prev.lifePlan.spouseStrategy,
                          investments: parseInt(e.target.value) || 0,
                        },
                      },
                    }))
                  }
                  className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-bold text-indigo-700"
                />
                <span className="text-[10px] text-slate-500">万</span>
              </div>
            </div>
          )}
        </div>

        {/* 運用利回り */}
        <div className="pt-1 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-600">運用利回り (年率):</span>
            <span className="font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200">
              {cfg.investmentReturnRate} %
            </span>
          </div>
          <input
            type="range"
            min={1.0}
            max={7.0}
            step={0.5}
            value={cfg.investmentReturnRate}
            onChange={(e) => handleConfigChange('investmentReturnRate', parseFloat(e.target.value))}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded cursor-pointer"
          />
        </div>

        {/* バケット1 & 3 */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">バケット1 (生活現金):</span>
            <span className="font-bold font-mono text-emerald-700 text-xs mt-0.5 block">
              {cfg.bucket1Cash} 万円温存
            </span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 block">バケット3 (医療介護):</span>
            <span className="font-bold font-mono text-slate-800 text-xs mt-0.5 block">
              {cfg.bucket3Emergency} 万円温存
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
