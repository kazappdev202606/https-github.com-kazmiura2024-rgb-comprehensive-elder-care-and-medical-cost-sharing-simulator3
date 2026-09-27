import React, { useState } from 'react';
import { SimulatorState, LifetimeYearlyRecord, ZoneType } from '../types';
import { buildLifetimeTimeline } from '../calculator';
import {
  TrendingUp,
  SlidersHorizontal,
  Table,
  BarChart3,
  HeartHandshake,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

interface LifetimeTimelineViewProps {
  state: SimulatorState;
  onChange: (updater: (prev: SimulatorState) => SimulatorState) => void;
}

export const LifetimeTimelineView: React.FC<LifetimeTimelineViewProps> = ({ state, onChange }) => {
  const [displayType, setDisplayType] = useState<'both' | 'chart' | 'table'>('both');
  const [hoveredAge, setHoveredAge] = useState<number | null>(state.targetAgeYears);

  const isCouple = state.householdType === 'couple';

  // 夫婦世帯で調整対象を切り替え可能にするためのステート
  const [selectedAdjustRole, setSelectedAdjustRole] = useState<'primary' | 'spouse'>('primary');

  // タイムライン算出（リアルタイム連動）
  const timeline = buildLifetimeTimeline(state);

  // 選択中またはホバー中のレコード
  const activeRecord =
    timeline.find((item) => item.age === (hoveredAge ?? state.targetAgeYears)) ||
    timeline.find((item) => item.age === state.targetAgeYears) ||
    timeline[0];

  // グラフ用最大値
  const maxIncome = Math.max(...timeline.map((d) => d.householdGrossAnnual), 500);

  // 安全に 'primary' または 'spouse' を解決
  const roleKey: 'primary' | 'spouse' =
    state.householdType === 'single'
      ? 'primary'
      : isCouple
      ? (state.perspective === 'both' ? selectedAdjustRole : state.perspective === 'spouse' ? 'spouse' : 'primary')
      : 'primary';

  const currentProfile = state[roleKey] || state.primary;

  return (
    <div className="space-y-5 animate-fadeIn w-full">
      {/* 上部ヘッダー＆表示モード切替 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
              生涯推移タイムライン＆制度の壁シミュレーション
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            横軸を検証年齢とし、夫婦存命期間の「ご本人・配偶者の収入配分」や配偶者他界時の「遺族年金加算・単身155万枠移行」を色分けで可視化します
          </p>
        </div>

        {/* チャート/テーブル表示切替 */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setDisplayType('both')}
            className={`px-3 py-1.5 rounded-lg transition ${
              displayType === 'both' ? 'bg-white shadow text-sky-700' : 'hover:text-slate-900'
            }`}
          >
            グラフ＋表
          </button>
          <button
            onClick={() => setDisplayType('chart')}
            className={`px-3 py-1.5 rounded-lg transition ${
              displayType === 'chart' ? 'bg-white shadow text-sky-700' : 'hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> グラフ中心
            </span>
          </button>
          <button
            onClick={() => setDisplayType('table')}
            className={`px-3 py-1.5 rounded-lg transition ${
              displayType === 'table' ? 'bg-white shadow text-sky-700' : 'hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1">
              <Table className="w-3.5 h-3.5" /> 全年次一覧表
            </span>
          </button>
        </div>
      </div>

      {/* リアルタイム インライン調整スライダーバー */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between mb-3 border-b border-slate-700 pb-2.5 gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
            <span className="font-extrabold text-sm text-slate-100">
              {currentProfile.name} の設定リアルタイム微調整
            </span>
            <span className="text-[11px] text-sky-300 bg-sky-950/80 border border-sky-600/50 px-2 py-0.5 rounded-full">
              動かすと下の生涯推移が即座に連動します
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 夫婦世帯で微調整対象を切り替えるボタン */}
            {isCouple && (
              <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedAdjustRole('primary')}
                  className={`px-2 py-0.5 rounded ${roleKey === 'primary' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                >
                  👤 {state.primary.name}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAdjustRole('spouse')}
                  className={`px-2 py-0.5 rounded ${roleKey === 'spouse' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                >
                  👥 {state.spouse.name}
                </button>
              </div>
            )}
            <span className="text-xs text-slate-300 font-mono">
              選択年齢: <strong className="text-amber-400 font-bold">{state.targetAgeYears}歳時点</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 年金開始年齢 */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300">年金受給開始年齢:</span>
              <span className="font-bold font-mono text-sky-300 text-sm">
                {currentProfile.pensionStartAge} 歳
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={75}
              value={currentProfile.pensionStartAge}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onChange((prev) => ({
                  ...prev,
                  [roleKey]: { ...prev[roleKey], pensionStartAge: val },
                }));
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>60歳(-24%)</span>
              <span>65歳(基準)</span>
              <span>75歳(+84%)</span>
            </div>
          </div>

          {/* 再雇用月給 */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300">再雇用月給【額面】:</span>
              <span className="font-bold font-mono text-sky-300 text-sm">
                {currentProfile.rehireMonthlySalary} 万円/月
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={currentProfile.rehireMonthlySalary}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onChange((prev) => ({
                  ...prev,
                  [roleKey]: { ...prev[roleKey], rehireMonthlySalary: val },
                }));
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0万(引退)</span>
              <span>20万</span>
              <span>50万(フル就労)</span>
            </div>
          </div>

          {/* 再雇用引退年齢 */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300">完全引退年齢:</span>
              <span className="font-bold font-mono text-sky-300 text-sm">
                {currentProfile.rehireRetireAge} 歳
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={80}
              value={currentProfile.rehireRetireAge}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onChange((prev) => ({
                  ...prev,
                  [roleKey]: { ...prev[roleKey], rehireRetireAge: val },
                }));
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>60歳(即引退)</span>
              <span>70歳</span>
              <span>80歳</span>
            </div>
          </div>

          {/* 想定寿命 */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="text-rose-300 font-semibold">{currentProfile.name}の想定寿命:</span>
              <span className="font-bold font-mono text-rose-300 text-sm">
                {currentProfile.lifeExpectancyYears} 歳
              </span>
            </div>
            <input
              type="range"
              min={65}
              max={120}
              step={1}
              value={currentProfile.lifeExpectancyYears}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onChange((prev) => ({
                  ...prev,
                  [roleKey]: { ...prev[roleKey], lifeExpectancyYears: val },
                }));
              }}
              className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>65歳</span>
              <span>85歳</span>
              <span>100歳</span>
              <span>120歳</span>
            </div>
          </div>
        </div>
      </div>

      {/* ホバー/選択年齢のリアルタイム詳細ステータスバナー */}
      {activeRecord && (
        <div
          className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-xs transition-all ${
            activeRecord.zone === 'A'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : activeRecord.zone === 'B'
              ? 'bg-blue-50/80 border-blue-300 text-blue-950'
              : 'bg-rose-50/80 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">着目年齢</span>
              <span className="text-2xl font-black font-mono tracking-tight text-slate-900">
                {activeRecord.age} 歳
                {activeRecord.spouseAge !== null ? (
                  <span className="text-xs text-slate-500 ml-1 font-sans">
                    (配偶者 {activeRecord.spouseAge}歳・存命期)
                  </span>
                ) : (
                  <span className="text-xs text-rose-600 font-bold ml-1 font-sans">
                    [🕊️ 配偶者他界後]
                  </span>
                )}
              </span>
            </div>

            <div className="border-l border-slate-300 pl-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black text-white ${
                    activeRecord.zone === 'A'
                      ? 'bg-emerald-600'
                      : activeRecord.zone === 'B'
                      ? 'bg-blue-600'
                      : 'bg-rose-600'
                  }`}
                >
                  ゾーン{activeRecord.zone}（{activeRecord.isTaxFree ? '住民税非課税' : '課税世帯'}）
                </span>
                <span className="text-xs font-bold text-slate-700">
                  世帯判定年収: <strong className="text-sm font-mono text-slate-900">{activeRecord.householdGrossAnnual}万円</strong>
                </span>

                {/* 夫婦存命期の内訳（ご本人XX万 + 配偶者XX万） */}
                {!activeRecord.isSpouseDeceased && isCouple && (
                  <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                    内訳: <span className="text-sky-700 font-bold">{state.primary.name} {activeRecord.primaryGrossAnnual}万</span> +{' '}
                    <span className="text-rose-700 font-bold">{state.spouse.name} {activeRecord.spouseGrossAnnual}万</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>
                  個人手取り目安:{' '}
                  <strong className="text-slate-900 font-mono font-bold">
                    {activeRecord.netDisposableIncomeMonthly} 万円/月
                  </strong>
                </span>
                {activeRecord.survivorPensionMonthly > 0 && (
                  <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-mono font-bold border border-rose-300 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                    遺族厚生年金: +{activeRecord.survivorPensionMonthly} 万円/月【全額非課税】
                  </span>
                )}
                {!activeRecord.isSpouseDeceased && isCouple && (
                  <span className="bg-sky-100 text-sky-900 px-2 py-0.5 rounded font-mono font-bold border border-sky-200">
                    世帯合計手取り生活費: {activeRecord.householdNetDisposableIncomeMonthly} 万円/月
                  </span>
                )}
                {activeRecord.keyMilestone && (
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                    🚩 {activeRecord.keyMilestone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-sans mr-1">介護:</span>
              <span className={activeRecord.careRate >= 2 ? 'text-rose-600' : 'text-slate-800'}>
                {activeRecord.careRate}割
              </span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-sans mr-1">医療窓口:</span>
              <span className={activeRecord.medicalRate >= 2 ? 'text-rose-600' : 'text-slate-800'}>
                {activeRecord.medicalRate}割
              </span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-sans mr-1">高額療養上限:</span>
              <span className="text-slate-800">{activeRecord.highCostMedicalLimitMonthly.toLocaleString()}円</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-sans mr-1">特養補足給付:</span>
              <span className={activeRecord.hasNursingHomeFoodSubsidy ? 'text-emerald-700' : 'text-slate-400'}>
                {activeRecord.hasNursingHomeFoodSubsidy ? '◎ 減額あり' : '× なし'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* グラフ表示セクション */}
      {(displayType === 'both' || displayType === 'chart') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <h4 className="font-extrabold text-sm text-slate-800">
                世帯年収【課税額面】の推移 ＆ ご本人・配偶者の収入配分色分け
              </h4>
            </div>
            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              {/* 夫婦存命期の収入色分け凡例 */}
              {isCouple && (
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                  <span className="flex items-center gap-1 font-bold text-sky-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>{state.primary.name}の収入
                  </span>
                  <span className="flex items-center gap-1 font-bold text-rose-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>{state.spouse.name}の収入
                  </span>
                </div>
              )}
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>非課税
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>一般
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>負担急増
              </span>
            </div>
          </div>

          {/* ビジュアル・タイムラインバーチャート */}
          <div className="relative pt-8 pb-2 overflow-x-auto w-full">
            {/* 非課税壁ライン */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500 pointer-events-none z-10"
              style={{
                bottom: `${( (state.householdType === 'single' ? 155 : 211) / maxIncome ) * 160 + 36}px`,
              }}
            >
              <span className="absolute -top-3 left-2 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded">
                非課税の壁（単身155万 / 夫婦健在211万）
              </span>
            </div>

            {/* 介護2割壁ライン */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-rose-400 pointer-events-none z-10"
              style={{
                bottom: `${( (state.householdType === 'single' ? 280 : 346) / maxIncome ) * 160 + 36}px`,
              }}
            >
              <span className="absolute -top-3 right-2 text-[10px] font-bold text-rose-800 bg-rose-100/90 px-1.5 py-0.2 rounded">
                介護2割の壁（単身280万 / 夫婦健在346万）
              </span>
            </div>

            {/* チャート本体バー列 */}
            <div className="flex items-end gap-1 sm:gap-1.5 min-w-[720px] h-52 px-2 border-b border-slate-300 relative">
              {timeline.map((item, index) => {
                const totalBarHeight = Math.max(8, Math.min(160, (item.householdGrossAnnual / maxIncome) * 160));
                const isTargetAge = item.age === state.targetAgeYears;

                // ご本人・配偶者の積み上げ高さ比率（夫婦存命期）
                const primaryRatio = item.householdGrossAnnual > 0 ? item.primaryGrossAnnual / item.householdGrossAnnual : 1;
                const spouseRatio = item.householdGrossAnnual > 0 ? item.spouseGrossAnnual / item.householdGrossAnnual : 0;

                const primaryHeight = Math.round(totalBarHeight * primaryRatio);
                const spouseHeight = Math.round(totalBarHeight * spouseRatio);

                // 配偶者他界境界チェック
                const prevItem = index > 0 ? timeline[index - 1] : null;
                const isPassingTransition = prevItem && !prevItem.isSpouseDeceased && item.isSpouseDeceased;

                return (
                  <div
                    key={item.age}
                    onMouseEnter={() => setHoveredAge(item.age)}
                    onClick={() => onChange((prev) => ({ ...prev, targetAgeYears: item.age }))}
                    className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer group relative ${
                      isPassingTransition ? 'border-l-2 border-rose-500 pl-0.5' : ''
                    }`}
                  >
                    {/* 他界境界フラグピン */}
                    {isPassingTransition && (
                      <div className="absolute -top-6 text-[9px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded shadow z-20 whitespace-nowrap animate-pulse">
                        🕊️ 配偶者他界
                      </div>
                    )}

                    {/* ツールチップ */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-16 z-30 pointer-events-none bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded whitespace-nowrap shadow-md">
                      {item.age}歳: {item.isSpouseDeceased ? '[配偶者他界後]' : '[夫婦存命期]'}
                      <br />
                      世帯年収: {item.householdGrossAnnual}万円
                      {!item.isSpouseDeceased && isCouple && (
                        <span> ({state.primary.name}{item.primaryGrossAnnual}万 / {state.spouse.name}{item.spouseGrossAnnual}万)</span>
                      )}
                      <br />
                      手取: 個人{item.netDisposableIncomeMonthly}万
                      {item.survivorPensionMonthly > 0 ? ` (うち遺族年金+${item.survivorPensionMonthly}万)` : ''}
                      {!item.isSpouseDeceased && isCouple ? ` / 世帯計${item.householdNetDisposableIncomeMonthly}万` : ''}
                    </div>

                    {/* 選択年齢ピン */}
                    {isTargetAge && (
                      <div className="absolute top-1 text-[9px] bg-slate-900 text-white font-extrabold px-1 rounded-sm shadow-sm animate-pulse z-20">
                        検証中
                      </div>
                    )}

                    {/* 棒グラフ（夫婦存命期はご本人と配偶者の積み上げカラーバー） */}
                    <div
                      style={{ height: `${totalBarHeight}px` }}
                      className={`w-full rounded-t-sm transition-all duration-150 flex flex-col justify-end overflow-hidden ${
                        isTargetAge ? 'ring-2 ring-slate-900 shadow-md scale-y-105' : ''
                      }`}
                    >
                      {!item.isSpouseDeceased && isCouple && item.spouseGrossAnnual > 0 ? (
                        <>
                          {/* 配偶者の収入（上段: ローズピンク） */}
                          <div
                            style={{ height: `${spouseHeight}px` }}
                            className="w-full bg-rose-400 group-hover:bg-rose-300 transition-colors"
                            title={`${state.spouse.name}の年収: ${item.spouseGrossAnnual}万円`}
                          ></div>
                          {/* ご本人の収入（下段: スカイブルー） */}
                          <div
                            style={{ height: `${primaryHeight}px` }}
                            className="w-full bg-sky-500 group-hover:bg-sky-400 transition-colors"
                            title={`${state.primary.name}の年収: ${item.primaryGrossAnnual}万円`}
                          ></div>
                        </>
                      ) : (
                        /* 他界後または単身世帯（ゾーン色） */
                        <div
                          className={`w-full h-full ${
                            item.zone === 'A'
                              ? 'bg-emerald-500 group-hover:bg-emerald-400'
                              : item.zone === 'B'
                              ? 'bg-blue-500 group-hover:bg-blue-400'
                              : 'bg-rose-500 group-hover:bg-rose-400'
                          }`}
                        ></div>
                      )}
                    </div>

                    {/* 横軸ラベル */}
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono mt-1 ${
                        isTargetAge
                          ? 'font-black text-slate-950 underline decoration-sky-500 decoration-2'
                          : item.age % 5 === 0
                          ? 'font-bold text-slate-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.age % 5 === 0 || isTargetAge ? `${item.age}` : '・'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ヒートマップ帯 */}
            <div className="mt-3 pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600">
                  判定ゾーンの推移:
                </span>
                {isCouple && (
                  <span className="text-[10px] text-slate-500">
                    ← 夫婦存命期 | 🕊️ 配偶者想定寿命 ({state.spouse.lifeExpectancyYears}歳) 以降: 単身期 →
                  </span>
                )}
              </div>
              <div className="flex h-5 rounded-lg overflow-hidden border border-slate-300 shadow-2xs min-w-[720px]">
                {timeline.map((item) => (
                  <div
                    key={item.age}
                    onClick={() => onChange((prev) => ({ ...prev, targetAgeYears: item.age }))}
                    title={`${item.age}歳: ゾーン${item.zone} (${item.isSpouseDeceased ? '配偶者他界後' : '夫婦存命'})`}
                    className={`flex-1 transition-all cursor-pointer ${
                      item.zone === 'A'
                        ? 'bg-emerald-500 hover:bg-emerald-400'
                        : item.zone === 'B'
                        ? 'bg-blue-500 hover:bg-blue-400'
                        : 'bg-rose-500 hover:bg-rose-400'
                    } ${item.age === state.targetAgeYears ? 'brightness-125 ring-1 ring-white' : ''}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全年次一覧表セクション */}
      {(displayType === 'both' || displayType === 'table') && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden w-full">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-sky-600" />
              <h4 className="font-extrabold text-sm text-slate-800">
                生涯推移・制度適用詳細テーブル
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">
              ※行をクリックするとその年齢がシミュレーション検証年齢に設定されます
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 shadow-2xs z-10 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">年齢</th>
                  <th className="py-2.5 px-2">世帯フェーズ</th>
                  <th className="py-2.5 px-2">世帯判定年収【課税額面】</th>
                  {isCouple && (
                    <th className="py-2.5 px-2 text-indigo-900">夫婦収入内訳 (ご本人 / 配偶者)</th>
                  )}
                  <th className="py-2.5 px-2">遺族厚生年金【非課税】</th>
                  <th className="py-2.5 px-2">手取生活費 (個人 / 世帯計)</th>
                  <th className="py-2.5 px-2">判定ゾーン</th>
                  <th className="py-2.5 px-2">住民税</th>
                  <th className="py-2.5 px-2">介護負担</th>
                  <th className="py-2.5 px-2">医療窓口</th>
                  <th className="py-2.5 px-2">高額療養上限</th>
                  <th className="py-2.5 px-3">特養補助</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {timeline.map((row, index) => {
                  const isSelected = row.age === state.targetAgeYears;
                  const prevRow = index > 0 ? timeline[index - 1] : null;
                  const isBoundary = prevRow && !prevRow.isSpouseDeceased && row.isSpouseDeceased;

                  return (
                    <React.Fragment key={row.age}>
                      {/* 他界の区切りバナー行 */}
                      {isBoundary && (
                        <tr className="bg-rose-100/90 text-rose-950 font-sans border-y-2 border-rose-400">
                          <td colSpan={13} className="py-2 px-4 font-bold text-center">
                            🕊️ 【配偶者他界想定】 配偶者が{state.spouse.lifeExpectancyYears}歳で他界し、遺族厚生年金の受給が開始。非課税基準は夫婦211万円から単身155万円へ縮小
                          </td>
                        </tr>
                      )}

                      <tr
                        onClick={() => onChange((prev) => ({ ...prev, targetAgeYears: row.age }))}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-sky-50 font-bold text-sky-950 ring-1 ring-sky-400'
                            : row.isSpouseDeceased
                            ? 'bg-rose-50/20 hover:bg-rose-50/40'
                            : row.age === 65 || row.age === 70 || row.age === 75
                            ? 'bg-amber-50/50 hover:bg-slate-50'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold font-sans flex items-center gap-1.5">
                          <span className="text-slate-800">{row.age}歳</span>
                          {row.spouseAge !== null && (
                            <span className="text-[10px] text-slate-400">({row.spouseAge}歳)</span>
                          )}
                          {isSelected && (
                            <span className="text-[9px] bg-sky-600 text-white px-1.5 py-0.2 rounded font-sans">
                              検証中
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 font-sans">
                          {row.isSpouseDeceased ? (
                            <span className="text-rose-700 font-bold bg-rose-100/80 px-1.5 py-0.5 rounded text-[10px]">
                              🕊️ 配偶者他界後
                            </span>
                          ) : (
                            <span className="text-sky-700 font-bold bg-sky-100/80 px-1.5 py-0.5 rounded text-[10px]">
                              👥 夫婦存命期
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-2 font-bold text-slate-900">
                          {row.householdGrossAnnual}
                          <span className="text-[10px] font-normal text-slate-500 ml-0.5">万</span>
                        </td>
                        {isCouple && (
                          <td className="py-2 px-2 font-mono">
                            {!row.isSpouseDeceased ? (
                              <span className="flex items-center gap-1 text-[10px]">
                                <span className="text-sky-700 font-bold">{state.primary.name}{row.primaryGrossAnnual}万</span>
                                <span className="text-slate-400">/</span>
                                <span className="text-rose-700 font-bold">{state.spouse.name}{row.spouseGrossAnnual}万</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">単身生活</span>
                            )}
                          </td>
                        )}
                        <td className="py-2 px-2">
                          {row.survivorPensionMonthly > 0 ? (
                            <span className="font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                              +{row.survivorPensionMonthly}万/月
                            </span>
                          ) : (
                            <span className="text-slate-400">0円</span>
                          )}
                        </td>
                        <td className="py-2 px-2 font-bold font-sans">
                          {!row.isSpouseDeceased && isCouple ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-800 font-mono">{row.netDisposableIncomeMonthly}万</span>
                              <span className="text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                                世帯計: {row.householdNetDisposableIncomeMonthly}万/月
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-indigo-700 font-mono font-bold">
                                {row.netDisposableIncomeMonthly}万/月
                              </span>
                              {row.survivorPensionMonthly > 0 && (
                                <span className="text-[9px] text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">
                                  遺族年金込
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-2 font-sans">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.zone === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : row.zone === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            ゾーン{row.zone}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-sans">
                          {row.isTaxFree ? (
                            <span className="text-emerald-700 font-bold">◎ 非課税</span>
                          ) : (
                            <span className="text-slate-600">課税</span>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          <span className={row.careRate >= 2 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                            {row.careRate}割
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <span className={row.medicalRate >= 2 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                            {row.medicalRate}割
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-700">
                          {row.highCostMedicalLimitMonthly.toLocaleString()}円
                        </td>
                        <td className="py-2 px-3 font-sans">
                          {row.hasNursingHomeFoodSubsidy ? (
                            <span className="text-emerald-700 font-bold">◎ 減額あり</span>
                          ) : (
                            <span className="text-slate-400">× なし</span>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
