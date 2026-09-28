import React, { useState } from 'react';
import { SimulatorState, LifePlanYearRecord } from '../types';
import { buildLifePlanTimeline } from '../lifePlanCalculator';
import {
  TrendingUp,
  BarChart3,
  Table,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Flame,
  Info,
  Calendar,
  Layers,
  MousePointer
} from 'lucide-react';

interface LifePlanViewProps {
  state: SimulatorState;
  onChange: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

export const LifePlanView: React.FC<LifePlanViewProps> = ({ state, onChange }) => {
  const [displayMode, setDisplayMode] = useState<'both' | 'chart' | 'table'>('both');
  const [hoveredAge, setHoveredAge] = useState<number | null>(null);

  // 動的ライフプラン表の計算
  const timeline = buildLifePlanTimeline(state);

  // 100歳時点のレコード
  const recordAt100 = timeline.find((r) => r.age === 100) || timeline[timeline.length - 1];

  // 資金ショート（バケット2がマイナス）が発生した最初の年
  const firstDeficitRecord = timeline.find((r) => r.isDeficit);

  // 着目中のレコード（ホバー中または100歳時点）
  const activeRecord =
    timeline.find((r) => r.age === (hoveredAge ?? 100)) || recordAt100;

  // グラフ用最大資産額
  const maxAsset = Math.max(...timeline.map((r) => Math.max(0, r.totalAssets)), 4000);

  return (
    <div className="space-y-5 animate-fadeIn w-full">
      {/* 診断サマリーカード */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-all ${
          !firstDeficitRecord && recordAt100.bucket2Balance > 0
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-300 text-emerald-950'
            : 'bg-gradient-to-r from-rose-50 via-amber-50 to-white border-rose-300 text-rose-950'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-2xs ${
                  !firstDeficitRecord && recordAt100.bucket2Balance > 0
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {!firstDeficitRecord && recordAt100.bucket2Balance > 0 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    【合格】100歳安心ライフプラン完成！
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    【要調整】{firstDeficitRecord ? `${firstDeficitRecord.age}歳` : '高齢期'}で資金ショート発生
                  </>
                )}
              </span>
              <span className="text-xs font-bold text-slate-600">
                『安心と楽しみを両立する老後経済プラン構築マニュアル』完全連動判定
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {!firstDeficitRecord && recordAt100.bucket2Balance > 0 ? (
                <>
                  100歳時点でバケット2（運用資産・NISA）に{' '}
                  <strong className="font-mono text-emerald-700 text-sm">
                    {recordAt100.bucket2Balance}万円
                  </strong>{' '}
                  の残高が残り、バケット3（医療介護防衛資金{state.lifePlan.bucket3Emergency}万円）も無傷で温存されます。長生きが最大のご褒美になる無敵の設計です！
                </>
              ) : (
                <>
                  {firstDeficitRecord?.age}歳時点でバケット2が底をつき、赤字転落します。
                  左カラムの<strong>「就労期間・年金開始・娯楽費・特別支出」</strong>を調整して、100歳までバケット2が1円でも残る状態を構築してください。
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-bold">
            <div className="bg-white/90 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-center">
              <span className="text-[10px] text-slate-500 font-sans block">100歳時点 バケット2残高</span>
              <span
                className={`text-base font-black ${
                  recordAt100.bucket2Balance >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {recordAt100.bucket2Balance >= 0 ? `+${recordAt100.bucket2Balance}` : recordAt100.bucket2Balance}
                <span className="text-xs font-sans ml-0.5">万</span>
              </span>
            </div>
            <div className="bg-white/90 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-center">
              <span className="text-[10px] text-slate-500 font-sans block">バケット3 (医療介護防衛)</span>
              <span className="text-base font-black text-slate-800">
                {state.lifePlan.bucket3Emergency}<span className="text-xs font-sans ml-0.5">万温存</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 表示形式切替 ＆ アクションバー */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-600" />
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
            現在から100歳までの動的ライフプラン表（インフレ・3大バケット自動連動）
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setDisplayMode('both')}
            className={`px-3 py-1.5 rounded-lg transition ${
              displayMode === 'both' ? 'bg-white shadow text-sky-700' : 'hover:text-slate-900'
            }`}
          >
            グラフ＋表
          </button>
          <button
            onClick={() => setDisplayMode('chart')}
            className={`px-3 py-1.5 rounded-lg transition ${
              displayMode === 'chart' ? 'bg-white shadow text-sky-700' : 'hover:text-slate-900'
            }`}
          >
            グラフ中心
          </button>
          <button
            onClick={() => setDisplayMode('table')}
            className={`px-3 py-1.5 rounded-lg transition ${
              displayMode === 'table' ? 'bg-white shadow text-sky-700' : 'hover:text-slate-900'
            }`}
          >
            全年次表
          </button>
        </div>
      </div>

      {/* グラフエリア */}
      {(displayMode === 'both' || displayMode === 'chart') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          {/* グラフ上部ヘッダー */}
          <div className="flex items-center justify-between border-b pb-2 flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              3大バケット資産推移（青: バケット2運用資産 / 緑: バケット1現金 / 灰: バケット3防衛資金）
            </span>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-indigo-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span>バケット2 (運用資産)
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>バケット1 ({state.lifePlan.bucket1Cash}万)
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>バケット3 ({state.lifePlan.bucket3Emergency}万)
              </span>
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>赤字破綻ライン
              </span>
            </div>
          </div>

          {/* ホバー連動リアルタイム・インフォメーションボード（隠れ防止＋見やすさ向上） */}
          <div className="bg-slate-900 text-white p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 font-mono">
                <span className="text-[10px] text-slate-400 block font-sans">着目年次</span>
                <span className="text-base font-black text-amber-300">
                  {activeRecord.age}歳{' '}
                  <span className="text-xs text-slate-300 font-normal">({activeRecord.year}年)</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">総金融資産:</span>
                  <span className="text-sm font-black font-mono text-white">
                    {activeRecord.totalAssets}万円
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    (手取収入: {activeRecord.totalNetIncome}万 / 支出計: {activeRecord.totalExpense}万)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
                  <span className="text-indigo-300 font-bold font-mono">
                    B2運用資産: {activeRecord.bucket2Balance}万円
                  </span>
                  <span>/</span>
                  <span className={activeRecord.annualCashFlow >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
                    年間収支: {activeRecord.annualCashFlow >= 0 ? `+${activeRecord.annualCashFlow}` : activeRecord.annualCashFlow}万円
                  </span>
                  {activeRecord.eventLabel && (
                    <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30 text-[10px]">
                      {activeRecord.eventLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MousePointer className="w-3.5 h-3.5 text-slate-400" />
              <span>棒にカーソルを合わせると年次詳細が切り替わります</span>
            </div>
          </div>

          {/* ビジュアル・スタックバーグラフ（上部余白 pt-24 を確保しツールチップが切れないように修正） */}
          <div className="relative pt-24 pb-3 overflow-x-auto w-full">
            <div className="flex items-end gap-1 sm:gap-1.5 min-w-[720px] h-60 px-2 border-b border-slate-300 relative">
              {/* 基準ゼロ線 */}
              <div className="absolute left-0 right-0 border-t border-slate-400 bottom-6 pointer-events-none z-10"></div>

              {timeline.map((item) => {
                const isHovered = item.age === hoveredAge;
                const isTargetAge = item.age === state.targetAgeYears;

                // 高さ計算
                const b1Height = Math.max(0, Math.min(40, (item.bucket1Balance / maxAsset) * 160));
                const b3Height = Math.max(0, Math.min(40, (item.bucket3Balance / maxAsset) * 160));
                const b2Height = item.bucket2Balance >= 0
                  ? Math.max(0, Math.min(120, (item.bucket2Balance / maxAsset) * 160))
                  : Math.max(8, Math.min(30, (Math.abs(item.bucket2Balance) / maxAsset) * 160));

                return (
                  <div
                    key={item.age}
                    onMouseEnter={() => setHoveredAge(item.age)}
                    className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group relative"
                  >
                    {/* 最前面・上部隠れ防止ポップアップツールチップ */}
                    <div
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-slate-900/95 text-white text-[10px] py-1.5 px-2.5 rounded-lg whitespace-nowrap shadow-xl border border-slate-700/80 backdrop-blur-xs flex flex-col items-center leading-tight`}
                    >
                      <span className="font-bold text-amber-300 text-[11px]">
                        {item.age}歳 ({item.year}年)
                      </span>
                      <span className="text-white mt-0.5">
                        総資産: <strong className="font-mono text-white">{item.totalAssets}万</strong>
                      </span>
                      <span className="text-indigo-300 font-mono">
                        B2運用: {item.bucket2Balance}万 / 収支:{' '}
                        {item.annualCashFlow >= 0 ? `+${item.annualCashFlow}` : item.annualCashFlow}万
                      </span>
                      {/* 下向き矢印ヒゲ */}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-700/80 rotate-45"></span>
                    </div>

                    {/* 棒グラフ */}
                    <div className="w-full flex flex-col justify-end overflow-hidden">
                      {item.isDeficit ? (
                        <div
                          style={{ height: `${b2Height}px` }}
                          className="w-full bg-rose-500 rounded-b-sm animate-pulse"
                          title={`赤字: ${item.bucket2Balance}万円`}
                        ></div>
                      ) : (
                        <>
                          <div
                            style={{ height: `${b2Height}px` }}
                            className={`w-full rounded-t-sm transition-colors ${
                              isHovered ? 'bg-indigo-400 brightness-110' : 'bg-indigo-600 group-hover:bg-indigo-500'
                            }`}
                          ></div>
                          <div
                            style={{ height: `${b1Height}px` }}
                            className="w-full bg-emerald-500"
                          ></div>
                          <div
                            style={{ height: `${b3Height}px` }}
                            className="w-full bg-slate-400"
                          ></div>
                        </>
                      )}
                    </div>

                    {/* 横軸ラベル */}
                    <span
                      className={`text-[9px] font-mono mt-1 ${
                        isHovered
                          ? 'font-black text-indigo-700 underline'
                          : item.age % 5 === 0
                          ? 'font-bold text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.age % 5 === 0 ? `${item.age}` : '・'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 全年次キャッシュフロー表 */}
      {(displayMode === 'both' || displayMode === 'table') && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden w-full">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Table className="w-4 h-4 text-sky-600" />
              <span>100歳までの動的年次キャッシュフロー詳細一覧表</span>
            </div>
            <span className="text-[11px] text-slate-500">
              ※赤字（資金ショート）となったマスは赤色で強調表示されます
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 shadow-2xs z-10 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">西暦/年齢</th>
                  <th className="py-2.5 px-2">手取収入計</th>
                  <th className="py-2.5 px-2">住居固定費</th>
                  <th className="py-2.5 px-2">基本生活費</th>
                  <th className="py-2.5 px-2">娯楽費(B2)</th>
                  <th className="py-2.5 px-2">特別支出等</th>
                  <th className="py-2.5 px-2">支出計</th>
                  <th className="py-2.5 px-2">年間収支</th>
                  <th className="py-2.5 px-2 text-indigo-900 font-bold">バケット2 (運用)</th>
                  <th className="py-2.5 px-2">バケット1</th>
                  <th className="py-2.5 px-2">バケット3</th>
                  <th className="py-2.5 px-3 font-black text-slate-900">総資産残高</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {timeline.map((row) => (
                  <tr
                    key={row.age}
                    className={`transition-colors ${
                      row.isDeficit
                        ? 'bg-rose-100/90 text-rose-950 font-bold'
                        : row.age === 65 || row.age === 70 || row.age === 75
                        ? 'bg-amber-50/50 hover:bg-slate-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2 px-3 font-sans font-bold flex items-center gap-1">
                      <span>{row.year}年</span>
                      <span className="text-slate-800">({row.age}歳)</span>
                      {row.eventLabel && (
                        <span className="text-[9px] bg-slate-800 text-white px-1.5 py-0.2 rounded font-normal">
                          {row.eventLabel}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-slate-900 font-bold">
                      {row.totalNetIncome}万
                    </td>
                    <td className="py-2 px-2 text-slate-600">{row.housingExpense}万</td>
                    <td className="py-2 px-2 text-slate-600">{row.baseLivingExpense}万</td>
                    <td className="py-2 px-2 text-sky-700">
                      {row.activeLeisureExpense + row.largeLeisureExpense}万
                    </td>
                    <td className="py-2 px-2 text-slate-600">
                      {row.specialPeriodExpense + row.unforeseenExpense}万
                    </td>
                    <td className="py-2 px-2 text-slate-800 font-bold">{row.totalExpense}万</td>
                    <td
                      className={`py-2 px-2 font-bold ${
                        row.annualCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {row.annualCashFlow >= 0 ? `+${row.annualCashFlow}` : row.annualCashFlow}万
                    </td>
                    <td
                      className={`py-2 px-2 font-black ${
                        row.bucket2Balance >= 0 ? 'text-indigo-700' : 'text-rose-700 bg-rose-200/80 px-1 rounded'
                      }`}
                    >
                      {row.bucket2Balance}万
                    </td>
                    <td className="py-2 px-2 text-emerald-800">{row.bucket1Balance}万</td>
                    <td className="py-2 px-2 text-slate-600">{row.bucket3Balance}万</td>
                    <td className="py-2 px-3 font-black text-slate-900">{row.totalAssets}万</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
