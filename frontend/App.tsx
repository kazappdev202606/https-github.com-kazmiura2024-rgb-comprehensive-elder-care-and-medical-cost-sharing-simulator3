import React, { useState, useEffect, useMemo } from 'react';
import { SimulatorState, MatrixCellData, HouseholdType, AppViewMode, AppStep } from './types';
import { DEFAULT_STATE, CURRENT_STATE_VERSION } from './constants';
import { buildMatrix } from './calculator';
import { InputSidebar } from './components/InputSidebar';
import { MatrixView } from './components/MatrixView';
import { LifetimeTimelineView } from './components/LifetimeTimelineView';
import { LifePlanSidebar } from './components/LifePlanSidebar';
import { LifePlanView } from './components/LifePlanView';
import { DetailDiagnosisModal } from './components/DetailDiagnosisModal';
import { AdviceReports } from './components/AdviceReports';
import { ManualModal } from './components/ManualModal';
import { SystemExplanationModal } from './components/SystemExplanationModal';
import {
  Download,
  Upload,
  RotateCcw,
  BookOpen,
  Layers,
  Check,
  LayoutGrid,
  TrendingUp,
  HeartHandshake,
  PanelLeftClose,
  PanelLeftOpen,
  Split,
  Compass,
  ShieldCheck
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'senior_wall_simulator_state_v5';

export const App: React.FC = () => {
  // 1. LocalStorage復元初期化
  const [state, setState] = useState<SimulatorState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_STATE,
            ...parsed,
            currentStep: parsed.currentStep || 'step1_wall',
            householdType: parsed.householdType === 'single' ? 'single' : 'couple',
            primary: { ...DEFAULT_STATE.primary, ...(parsed.primary || {}) },
            spouse: { ...DEFAULT_STATE.spouse, ...(parsed.spouse || {}) },
            lifePlan: { ...DEFAULT_STATE.lifePlan, ...(parsed.lifePlan || {}) },
            version: CURRENT_STATE_VERSION,
          };
        }
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return DEFAULT_STATE;
  });

  // LocalStorage自動保存
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [state]);

  // 第1ステップのビューモード（3x3マトリクス vs 生涯推移グラフ・表）
  const [viewMode, setViewMode] = useState<AppViewMode>('matrix');

  // 左サイドバーの折りたたみ状態
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // モーダル状態管理
  const [selectedCell, setSelectedCell] = useState<MatrixCellData | null>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isSystemOpen, setIsSystemOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 第1ステップ: 3x3 マトリクスの計算
  const matrix = useMemo(() => {
    return buildMatrix(state);
  }, [state]);

  const centerResult = matrix[1][1].result;

  // 夫婦時の配偶者年齢
  const diffMonths =
    state.spouse.ageYears * 12 + state.spouse.ageMonths - (state.primary.ageYears * 12 + state.primary.ageMonths);
  const spouseAgeAtTarget = Math.floor(
    (state.targetAgeYears * 12 + state.primary.ageMonths + diffMonths) / 12
  );

  // 条件の全体適用ハンドラ
  const handleApplyConditions = (cell: MatrixCellData, forcedRole?: 'primary' | 'spouse') => {
    const roleKey: 'primary' | 'spouse' =
      forcedRole ||
      (state.householdType === 'single'
        ? 'primary'
        : state.perspective === 'both'
        ? 'primary'
        : state.perspective);

    setState((prev) => {
      const targetProfile = prev[roleKey];
      let newRehireSalary = targetProfile.rehireMonthlySalary;

      if (cell.rowOffset === 1) {
        newRehireSalary = Math.round(newRehireSalary * 1.5 * 10) / 10;
      } else if (cell.rowOffset === -1) {
        newRehireSalary = 0;
      }

      return {
        ...prev,
        [roleKey]: {
          ...targetProfile,
          pensionStartAge: cell.pensionStartAge,
          rehireMonthlySalary: newRehireSalary,
        },
      };
    });

    const targetLabel = roleKey === 'primary' ? state.primary.name : state.spouse.name;
    showToast(`${targetLabel}の年金開始 ${cell.pensionStartAge}歳・就労条件を適用しました`);
  };

  // 詳細モーダルからの全体適用
  const handleApplyFromModal = (pensionAge: number, rehireSalaryDelta: number) => {
    const roleKey: 'primary' | 'spouse' =
      state.householdType === 'single'
        ? 'primary'
        : state.perspective === 'both'
        ? 'primary'
        : state.perspective;

    setState((prev) => {
      const targetProfile = prev[roleKey];
      return {
        ...prev,
        [roleKey]: {
          ...targetProfile,
          pensionStartAge: pensionAge,
          rehireMonthlySalary: Math.max(0, targetProfile.rehireMonthlySalary + rehireSalaryDelta),
        },
      };
    });
    showToast('微調整内容をシミュレーション全体へ反映しました');
  };

  // 初期値リセット
  const handleReset = () => {
    if (window.confirm('すべての設定を初期値にリセットしますか？')) {
      setState(DEFAULT_STATE);
      showToast('初期値にリセットしました');
    }
  };

  // JSONエクスポート
  const handleExport = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `lifeplan_simulation_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('設定データをJSONファイルとして保存しました');
    } catch (e) {
      alert('エクスポートに失敗しました');
    }
  };

  // JSONインポート
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === 'object') {
            setState({
              ...DEFAULT_STATE,
              ...parsed,
              currentStep: parsed.currentStep || 'step1_wall',
              householdType: parsed.householdType === 'single' ? 'single' : 'couple',
              primary: { ...DEFAULT_STATE.primary, ...(parsed.primary || {}) },
              spouse: { ...DEFAULT_STATE.spouse, ...(parsed.spouse || {}) },
              lifePlan: { ...DEFAULT_STATE.lifePlan, ...(parsed.lifePlan || {}) },
              version: CURRENT_STATE_VERSION,
            });
            showToast('設定データを正常に読み込みました');
          }
        } catch (err) {
          alert('ファイルの形式が正しくありません');
        }
      };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* グローバルヘッダー：第1ステップ / 第2ステップの最上部切替タブを新設 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* サイドバー折りたたみトグルボタン */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              title={isSidebarCollapsed ? '設定パネルを開く' : '設定パネルをたたむ（画面を広く表示）'}
              className="p-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition shadow-2xs flex items-center gap-1.5 text-xs font-bold"
            >
              {isSidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-4 h-4 text-sky-600" />
                  <span className="hidden sm:inline">設定を開く</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">全幅表示</span>
                </>
              )}
            </button>

            {/* ステップ切り替えピルタブ（第1ステップ vs 第2ステップ） */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setState((prev) => ({ ...prev, currentStep: 'step1_wall' }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  state.currentStep === 'step1_wall'
                    ? 'bg-white shadow text-sky-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>第１ステップ：老後のお金・医療・介護の壁 統合シミュレーター</span>
              </button>
              <button
                type="button"
                onClick={() => setState((prev) => ({ ...prev, currentStep: 'step2_lifeplan' }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  state.currentStep === 'step2_lifeplan'
                    ? 'bg-indigo-600 shadow text-white'
                    : 'text-slate-600 hover:text-indigo-700'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>第２ステップ：動的ライフプラン作成シミュレーター</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* 第1ステップ選択時のみ：マトリクス vs 生涯推移タブ */}
            {state.currentStep === 'step1_wall' && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mr-2">
                <button
                  type="button"
                  onClick={() => setViewMode('matrix')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                    viewMode === 'matrix' ? 'bg-white shadow text-sky-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>3×3 マトリクス</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                    viewMode === 'timeline' ? 'bg-white shadow text-sky-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>推移グラフ</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsManualOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold transition shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">マニュアル</span>
            </button>
            <button
              onClick={() => setIsSystemOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold transition shadow-2xs"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">制度解説</span>
            </button>

            {/* エクスポート・インポート・リセット */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={handleExport}
                title="設定データをダウンロード保存"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <Download className="w-4 h-4" />
              </button>
              <label
                title="設定データを読み込み復元"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition"
              >
                <Upload className="w-4 h-4" />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button
                onClick={handleReset}
                title="初期値にリセット"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインレイアウト */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col md:flex-row overflow-hidden relative">
        {/* 左側カラム: ステップに応じて切り替え */}
        {!isSidebarCollapsed && (
          <aside className="w-full md:w-[330px] lg:w-[350px] shrink-0 border-r border-slate-200 bg-white transition-all duration-200">
            {state.currentStep === 'step1_wall' ? (
              <InputSidebar
                state={state}
                onChange={setState}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(true)}
              />
            ) : (
              <LifePlanSidebar
                state={state}
                onChange={setState}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(true)}
              />
            )}
          </aside>
        )}

        {/* 右側メインカラム */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-5 min-w-0">
          {/* 折りたたみ中の展開ボタンバナー */}
          {isSidebarCollapsed && (
            <div className="flex items-center justify-between bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl text-xs text-sky-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <PanelLeftOpen className="w-4 h-4 text-sky-600" />
                <span className="font-bold">設定パネルを折りたたんでワイド表示中</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="bg-white border border-sky-300 hover:bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-lg transition shadow-2xs"
              >
                設定パネルを開く
              </button>
            </div>
          )}

          {/* ステップによる画面切り替え */}
          {state.currentStep === 'step1_wall' ? (
            <>
              {/* 第1ステップの現在判定バナー */}
              <div
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-xs ${
                  centerResult.zone === 'A'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : centerResult.zone === 'B'
                    ? 'bg-blue-50 border-blue-300 text-blue-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        centerResult.zone === 'A'
                          ? 'bg-emerald-600 text-white'
                          : centerResult.zone === 'B'
                          ? 'bg-blue-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      現在判定: ゾーン{centerResult.zone}
                    </span>

                    {state.householdType === 'couple' && centerResult.isSpouseDeceased && !centerResult.isDeceased && (
                      <span className="text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300">
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                        <span>配偶者他界後（単身155万枠・遺族厚生年金受給中）</span>
                      </span>
                    )}

                    {state.householdType === 'couple' && state.perspective === 'both' && (
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                        <Split className="w-3.5 h-3.5" /> 夫婦両方（ご本人・配偶者並列診断）
                      </span>
                    )}

                    <span className="font-extrabold text-base">
                      判定基準年収 {centerResult.householdGrossAnnual}万円【課税額面】
                    </span>
                  </div>

                  <div className="text-xs mt-1 text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      検証年齢 {state.targetAgeYears}歳時点
                      {state.householdType === 'couple' &&
                        (state.perspective === 'both'
                          ? `（ご本人 ${state.targetAgeYears}歳 / 配偶者 ${spouseAgeAtTarget}歳）`
                          : `（${state.perspective === 'primary' ? state.primary.name : state.spouse.name}の視点）`)}
                    </span>
                    <span>/</span>
                    <span className="inline-flex items-center gap-2 flex-wrap">
                      <span>
                        個人手取り目安:{' '}
                        <strong className="font-mono text-slate-900 font-bold">
                          {centerResult.netDisposableIncomeMonthly} 万円/月
                        </strong>
                      </span>

                      {centerResult.survivorPensionMonthly > 0 && (
                        <span className="text-rose-700 bg-rose-100/90 font-bold px-1.5 py-0.5 rounded text-[11px] font-mono border border-rose-300">
                          うち遺族年金: +{centerResult.survivorPensionMonthly}万/月【非課税】
                        </span>
                      )}

                      {!centerResult.isSpouseDeceased && state.householdType === 'couple' && (
                        <span className="bg-white/95 border border-slate-300 px-2 py-0.5 rounded-md font-bold text-sky-800 font-mono shadow-2xs">
                          世帯合計手取り目安: {centerResult.householdNetDisposableIncomeMonthly} 万円/月
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono font-bold">
                  <div className="bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-sans mr-1">介護:</span>
                    <span>{centerResult.careInsuranceRate}割</span>
                  </div>
                  <div className="bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-sans mr-1">医療窓口:</span>
                    <span>{centerResult.medicalInsuranceRate}割</span>
                  </div>
                  <div className="bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-sans mr-1">高額介護上限:</span>
                    <span>{centerResult.highCostCareLimitMonthly.toLocaleString()}円</span>
                  </div>
                </div>
              </div>

              {/* 第1ステップ ビュー */}
              {viewMode === 'matrix' ? (
                <MatrixView
                  matrix={matrix}
                  householdType={state.householdType}
                  state={state}
                  selectedCell={selectedCell}
                  onSelectCell={(cell) => setSelectedCell(cell)}
                  onApplyConditions={handleApplyConditions}
                />
              ) : (
                <LifetimeTimelineView state={state} onChange={setState} />
              )}

              {/* 制度助言・リスク分析レポート */}
              <AdviceReports currentResult={centerResult} householdType={state.householdType} />
            </>
          ) : (
            /* 第2ステップ：動的ライフプラン作成シミュレーター */
            <LifePlanView state={state} onChange={setState} />
          )}
        </main>
      </div>

      {/* 詳細診断・微調整モーダル */}
      {selectedCell && (
        <DetailDiagnosisModal
          cell={selectedCell}
          state={state}
          onClose={() => setSelectedCell(null)}
          onApplyGlobal={handleApplyFromModal}
          onHouseholdChange={(type) => {
            setState((prev) => ({ ...prev, householdType: type }));
          }}
        />
      )}

      {/* 使い方マニュアルモーダル */}
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      {/* 制度解説モーダル */}
      <SystemExplanationModal isOpen={isSystemOpen} onClose={() => setIsSystemOpen(false)} />

      {/* トースト通知 */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
