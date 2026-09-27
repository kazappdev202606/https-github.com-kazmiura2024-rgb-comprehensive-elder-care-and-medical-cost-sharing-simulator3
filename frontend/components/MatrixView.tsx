import React, { useState } from 'react';
import { MatrixCellData, ZoneType, HouseholdType, SimulatorState } from '../types';
import { buildMatrix } from '../calculator';
import { ShieldCheck, Flame, CheckCircle2, Split, User, Users } from 'lucide-react';

interface MatrixViewProps {
  matrix: MatrixCellData[][];
  householdType: HouseholdType;
  state: SimulatorState;
  onSelectCell: (cell: MatrixCellData) => void;
  onApplyConditions: (cell: MatrixCellData, forcedRole?: 'primary' | 'spouse') => void;
  selectedCell: MatrixCellData | null;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  matrix,
  householdType,
  state,
  onSelectCell,
  onApplyConditions,
  selectedCell,
}) => {
  const isCouple = householdType === 'couple';
  const isBothMode = isCouple && state.perspective === 'both';

  // 夫婦両方モードの場合、ご本人視点マトリクスと配偶者視点マトリクスの両方を生成
  const primaryMatrix = isBothMode ? buildMatrix(state, 'primary') : matrix;
  const spouseMatrix = isBothMode ? buildMatrix(state, 'spouse') : matrix;

  const [bothTab, setBothTab] = useState<'sideBySide' | 'primary' | 'spouse'>('sideBySide');

  const getZoneBadge = (zone: ZoneType) => {
    switch (zone) {
      case 'A':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" /> ゾーンA
          </span>
        );
      case 'B':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" /> ゾーンB
          </span>
        );
      case 'C':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600" /> ゾーンC
          </span>
        );
    }
  };

  const getBorderColor = (zone: ZoneType, isCenter: boolean, isSelected: boolean) => {
    if (isSelected) return 'ring-2 ring-indigo-600 border-indigo-600 shadow-md scale-[1.01] bg-white';
    if (isCenter) return 'border-2 border-slate-700 bg-white shadow-sm ring-1 ring-slate-900/10';
    switch (zone) {
      case 'A':
        return 'border-emerald-200/90 hover:border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/50';
      case 'B':
        return 'border-blue-200/90 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/50';
      case 'C':
        return 'border-rose-200/90 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/50';
    }
  };

  // 単体マトリクスレンダラー
  const renderSingleMatrix = (
    currentMatrix: MatrixCellData[][],
    roleLabel: string,
    forcedRoleKey?: 'primary' | 'spouse'
  ) => {
    return (
      <div className="relative border border-slate-300 rounded-2xl bg-white shadow-sm overflow-x-auto p-2.5 sm:p-3.5 w-full">
        <div className="min-w-[480px] sm:min-w-[540px]">
          {/* マトリクス見出し */}
          {isBothMode && (
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${forcedRoleKey === 'primary' ? 'bg-sky-500' : 'bg-rose-500'}`}></span>
                {roleLabel}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {forcedRoleKey === 'primary' ? state.primary.name : state.spouse.name}の就労・受給年齢を変化
              </span>
            </div>
          )}

          {/* 列ヘッダー */}
          <div className="grid grid-cols-[68px_1fr_1fr_1fr] sm:grid-cols-[78px_1fr_1fr_1fr] gap-1.5 sm:gap-2 mb-2 text-center text-[11px] sm:text-xs font-bold text-slate-600">
            <div className="flex items-center justify-center p-1 text-[10px] text-slate-400 font-medium leading-tight">
              就労 ＼ 年金
            </div>
            <div className="bg-slate-100 py-1.5 px-1 rounded-lg text-slate-700 font-bold border border-slate-200">
              ◀ -2歳 繰上
            </div>
            <div className="bg-slate-800 py-1.5 px-1 rounded-lg text-white font-extrabold shadow-xs">
              ★ 現在年齢
            </div>
            <div className="bg-slate-100 py-1.5 px-1 rounded-lg text-slate-700 font-bold border border-slate-200">
              +2歳 繰下 ▶
            </div>
          </div>

          {/* 行ループ */}
          <div className="space-y-1.5 sm:space-y-2">
            {currentMatrix.map((row, rIndex) => (
              <div
                key={rIndex}
                className="grid grid-cols-[68px_1fr_1fr_1fr] sm:grid-cols-[78px_1fr_1fr_1fr] gap-1.5 sm:gap-2"
              >
                {/* 行ヘッダー */}
                <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200/90 rounded-xl px-1 py-1.5 text-center select-none shadow-2xs">
                  <span
                    className={`text-[10px] sm:text-[11px] font-black leading-tight ${
                      rIndex === 0
                        ? 'text-indigo-700'
                        : rIndex === 1
                        ? 'text-slate-800'
                        : 'text-slate-600'
                    }`}
                  >
                    {rIndex === 0 && '▲ +50%'}
                    {rIndex === 1 && '★ 現在値'}
                    {rIndex === 2 && '▼ 0円引退'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium mt-0.5 leading-tight">
                    {rIndex === 0 && '就労延長'}
                    {rIndex === 1 && '基準設定'}
                    {rIndex === 2 && '年金のみ'}
                  </span>
                </div>

                {/* メインマス */}
                {row.map((cell, cIndex) => {
                  const isCenter = rIndex === 1 && cIndex === 1;
                  const isSelected =
                    selectedCell?.rowOffset === cell.rowOffset &&
                    selectedCell?.colOffset === cell.colOffset;

                  return (
                    <div
                      key={cIndex}
                      onClick={() => onSelectCell(cell)}
                      className={`relative rounded-xl p-2 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between ${getBorderColor(
                        cell.result.zone,
                        isCenter,
                        isSelected
                      )}`}
                    >
                      {/* 中央バッジ */}
                      {isCenter && (
                        <span className="absolute -top-2 right-2 bg-slate-800 text-white text-[8px] font-black px-1.5 py-0.2 rounded shadow tracking-wide">
                          現在値
                        </span>
                      )}

                      {/* 上部 */}
                      <div>
                        <div className="flex items-center justify-between mb-1 gap-1 flex-wrap">
                          {getZoneBadge(cell.result.zone)}
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-white/80 px-1 py-0.2 rounded border border-slate-200">
                            {cell.pensionStartAge}歳受給
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-0.5">
                          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">世帯年収</span>
                          <span className="font-black text-sm sm:text-base text-slate-900 font-mono tracking-tight">
                            {cell.result.householdGrossAnnual}
                            <span className="text-[10px] font-bold text-slate-600 ml-0.5">万</span>
                          </span>
                        </div>
                      </div>

                      {/* 中部 */}
                      <div className="my-1.5 py-1 border-y border-slate-200/70 grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[10px] sm:text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">住民税:</span>
                          <span
                            className={`font-black ${
                              cell.result.isTaxFree ? 'text-emerald-700 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {cell.result.isTaxFree ? '非課税' : '課税'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">介護:</span>
                          <span
                            className={`font-black font-mono ${
                              cell.result.careInsuranceRate >= 2
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-800'
                            }`}
                          >
                            {cell.result.careInsuranceRate}割
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">医療:</span>
                          <span
                            className={`font-black font-mono ${
                              cell.result.medicalInsuranceRate >= 2
                                ? 'text-rose-600 font-bold'
                                : 'text-slate-800'
                            }`}
                          >
                            {cell.result.medicalInsuranceRate}割
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">特養:</span>
                          <span
                            className={`font-black ${
                              cell.result.hasNursingHomeFoodSubsidy
                                ? 'text-emerald-700'
                                : 'text-slate-400 font-normal'
                            }`}
                          >
                            {cell.result.hasNursingHomeFoodSubsidy ? '減額有' : '無'}
                          </span>
                        </div>
                      </div>

                      {/* 下部 */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500">
                          <span>介護上限:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {cell.result.highCostCareLimitMonthly.toLocaleString()}円
                          </span>
                        </div>
                        <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500">
                          <span>療養上限:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {cell.result.highCostMedicalLimitMonthly.toLocaleString()}円
                          </span>
                        </div>

                        {/* 手取り生活費 */}
                        <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-0.5">
                          {isCouple ? (
                            <div className="flex flex-col text-[10px] font-mono leading-tight bg-slate-50/90 p-1 rounded border border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-sans text-[9px]">個人手取:</span>
                                <strong className="text-slate-800">{cell.result.netDisposableIncomeMonthly}万</strong>
                              </div>
                              <div className="flex items-center justify-between text-sky-900 font-bold border-t border-slate-200/60 pt-0.5">
                                <span className="font-sans text-[9px] text-sky-700">世帯計:</span>
                                <span>{cell.result.householdNetDisposableIncomeMonthly}万/月</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-600 font-mono">
                              手取:{' '}
                              <strong className="text-slate-800">
                                {cell.result.netDisposableIncomeMonthly}万/月
                              </strong>
                            </div>
                          )}

                          <div className="flex items-center justify-end pt-0.5">
                            {!isCenter && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApplyConditions(cell, forcedRoleKey);
                                }}
                                className="text-[9px] font-extrabold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-1.5 py-0.5 rounded transition shadow-2xs"
                              >
                                条件適用
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 w-full">
      {/* 上部ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <span>3×3 判定マトリクス</span>
            {isBothMode && (
              <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded text-xs font-bold border border-indigo-200 flex items-center gap-1">
                <Split className="w-3.5 h-3.5" /> 夫婦両方同時表示モード
              </span>
            )}
            <span className="text-xs font-normal text-slate-500">
              （中央が現在値。マスをクリックすると詳細診断が開きます）
            </span>
          </h3>
        </div>

        {/* 夫婦両方モードのタブ切り替え（左右並列 / ご本人のみ / 配偶者のみ） */}
        {isBothMode ? (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setBothTab('sideBySide')}
              className={`px-2.5 py-1 rounded-lg transition ${
                bothTab === 'sideBySide' ? 'bg-white text-indigo-700 shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 左右並列表示
            </button>
            <button
              type="button"
              onClick={() => setBothTab('primary')}
              className={`px-2.5 py-1 rounded-lg transition ${
                bothTab === 'primary' ? 'bg-white text-sky-700 shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👤 ご本人マトリクス
            </button>
            <button
              type="button"
              onClick={() => setBothTab('spouse')}
              className={`px-2.5 py-1 rounded-lg transition ${
                bothTab === 'spouse' ? 'bg-white text-rose-700 shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 配偶者マトリクス
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>A: 非課税
            </span>
            <span className="flex items-center gap-1 text-blue-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>B: 一般
            </span>
            <span className="flex items-center gap-1 text-rose-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>C: 負担増
            </span>
          </div>
        )}
      </div>

      {/* 夫婦両方同時表示モードの場合：PCワイド画面なら2カラム並列 */}
      {isBothMode ? (
        <div className="space-y-4 w-full">
          {bothTab === 'sideBySide' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 w-full">
              <div className="w-full">{renderSingleMatrix(primaryMatrix, `👤 ${state.primary.name}視点`, 'primary')}</div>
              <div className="w-full">{renderSingleMatrix(spouseMatrix, `👥 ${state.spouse.name}視点`, 'spouse')}</div>
            </div>
          ) : bothTab === 'primary' ? (
            renderSingleMatrix(primaryMatrix, `👤 ${state.primary.name}視点`, 'primary')
          ) : (
            renderSingleMatrix(spouseMatrix, `👥 ${state.spouse.name}視点`, 'spouse')
          )}
        </div>
      ) : (
        renderSingleMatrix(matrix, state.perspective === 'primary' ? `👤 ${state.primary.name}視点` : `👥 ${state.spouse.name}視点`)
      )}
    </div>
  );
};
