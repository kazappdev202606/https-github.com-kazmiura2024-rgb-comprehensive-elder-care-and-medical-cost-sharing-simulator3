import React from 'react';
import { SimulatorState, PersonProfile } from '../types';
import { User, Users, ChevronLeft, Split, HeartPulse, Briefcase, Award } from 'lucide-react';

interface InputSidebarProps {
  state: SimulatorState;
  onChange: (updater: (prev: SimulatorState) => SimulatorState) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  state,
  onChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  const isCouple = state.householdType === 'couple';

  // プロファイル項目変更ハンドラ（role: 'primary' または 'spouse' を直接指定）
  const handleFieldChange = <K extends keyof PersonProfile>(
    role: 'primary' | 'spouse',
    key: K,
    value: PersonProfile[K]
  ) => {
    onChange((prev) => {
      const updatedProfile = {
        ...prev[role],
        [key]: value,
      };

      if (key === 'pensionBasicMonthly' || key === 'pensionEmployeesMonthly') {
        const basic = key === 'pensionBasicMonthly' ? (value as number) : updatedProfile.pensionBasicMonthly || 0;
        const emp = key === 'pensionEmployeesMonthly' ? (value as number) : updatedProfile.pensionEmployeesMonthly || 0;
        updatedProfile.pensionAge65Monthly = Math.round((basic + emp) * 10) / 10;
      }

      return {
        ...prev,
        [role]: updatedProfile,
      };
    });
  };

  // 夫婦の月齢差を算出
  const diffMonths =
    state.spouse.ageYears * 12 + state.spouse.ageMonths - (state.primary.ageYears * 12 + state.primary.ageMonths);
  const diffYearsFormatted =
    diffMonths === 0
      ? '同い年'
      : diffMonths > 0
      ? `配偶者が ${Math.floor(diffMonths / 12)}歳${Math.abs(diffMonths % 12)}ヶ月 年上`
      : `ご本人が ${Math.floor(Math.abs(diffMonths) / 12)}歳${Math.abs(diffMonths % 12)}ヶ月 年上`;

  // 年金・就労入力コンポーネント（再利用・本人と配偶者両方に展開）
  const renderPersonForm = (role: 'primary' | 'spouse', profile: PersonProfile, badgeColor: string) => {
    return (
      <div className={`p-3.5 rounded-xl border space-y-3.5 ${role === 'primary' ? 'bg-sky-50/40 border-sky-200' : 'bg-rose-50/40 border-rose-200'}`}>
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`}></span>
            {profile.name} の年金・就労設定
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            現在 {profile.ageYears}歳{profile.ageMonths}ヶ月
          </span>
        </div>

        {/* 公的年金内訳入力（基礎年金＋厚生年金） */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              年金定期便見込額 (65歳基準)【額面】
            </span>
            <span className="text-[11px] font-black text-slate-900 font-mono bg-slate-50 px-2 py-0.2 rounded border border-slate-300">
              合計 {profile.pensionAge65Monthly} 万/月
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div>
              <span className="text-[10px] text-slate-500 block mb-0.5">基礎年金(国民年金):</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={profile.pensionBasicMonthly}
                  onChange={(e) => handleFieldChange(role, 'pensionBasicMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500">万</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block mb-0.5">厚生年金(会社・共済):</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={30}
                  value={profile.pensionEmployeesMonthly}
                  onChange={(e) => handleFieldChange(role, 'pensionEmployeesMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded px-1.5 py-0.5 text-right text-xs font-bold text-indigo-700 bg-white"
                />
                <span className="text-[10px] text-slate-500">万</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-slate-400">※厚生年金部分の3/4が他界時の遺族厚生年金の基礎となります</p>
        </div>

        {/* 年金受給開始年齢 */}
        <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-700">年金受給開始年齢</label>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded font-mono">
              {profile.pensionStartAge} 歳
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-500 flex justify-between font-mono">
            <span>
              {profile.pensionStartAge < 65
                ? `繰上: -${(65 - profile.pensionStartAge) * 12 * 0.4}% 減`
                : profile.pensionStartAge > 65
                ? `繰下: +${(profile.pensionStartAge - 65) * 12 * 0.7}% 増`
                : '標準65歳受給'}
            </span>
            <span className="text-slate-700 font-medium">
              受給目安: {Math.round(profile.pensionAge65Monthly * (profile.pensionStartAge < 65 ? 1 - (65 - profile.pensionStartAge) * 0.048 : 1 + (profile.pensionStartAge - 65) * 0.084) * 10) / 10}万/月
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={75}
            step={1}
            value={profile.pensionStartAge}
            onChange={(e) => handleFieldChange(role, 'pensionStartAge', parseInt(e.target.value))}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded mt-1.5 cursor-pointer"
          />
        </div>

        {/* 2段階の就労リタイア設定 */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-600" />
            2段階の就労・リタイア設定
          </span>

          {/* ① 正職 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-600">① 正職引退年齢:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min={55}
                  max={70}
                  value={profile.careerRetireAge}
                  onChange={(e) => handleFieldChange(role, 'careerRetireAge', parseInt(e.target.value) || 60)}
                  className="w-12 border border-slate-300 rounded px-1 text-right text-xs"
                />
                <span className="text-[10px]">歳</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-600">正職月給【額面・賞与込】:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min={0}
                  max={150}
                  value={profile.careerMonthlySalary}
                  onChange={(e) => handleFieldChange(role, 'careerMonthlySalary', parseInt(e.target.value) || 0)}
                  className="w-14 border border-slate-300 rounded px-1 text-right text-xs"
                />
                <span className="text-[10px]">万/月</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-1.5 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-600">② 再雇用・パート引退年齢:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min={60}
                  max={80}
                  value={profile.rehireRetireAge}
                  onChange={(e) => handleFieldChange(role, 'rehireRetireAge', parseInt(e.target.value) || 65)}
                  className="w-12 border border-slate-300 rounded px-1 text-right text-xs"
                />
                <span className="text-[10px]">歳</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-600">再雇用月給【額面】:</span>
              <div className="flex items-center gap-1 font-mono">
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={profile.rehireMonthlySalary}
                  onChange={(e) => handleFieldChange(role, 'rehireMonthlySalary', parseInt(e.target.value) || 0)}
                  className="w-14 border border-slate-300 rounded px-1 text-right text-xs"
                />
                <span className="text-[10px]">万/月</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto p-4 sm:p-5 flex flex-col gap-5 text-sm relative">
      {/* 折りたたみボタン */}
      {onToggleCollapse && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 tracking-tight">設定入力パネル</span>
          <button
            type="button"
            onClick={onToggleCollapse}
            title="サイドバーをたたむ（表示エリアを拡大）"
            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>パネルをたたむ</span>
          </button>
        </div>
      )}

      {/* 1. 世帯構成の切替（単身世帯・夫婦世帯の2種） */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          1. 世帯構成を選択
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, householdType: 'single', perspective: 'primary' }))}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              state.householdType === 'single'
                ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold shadow-sm'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <User className="w-5 h-5 mb-1 text-sky-600" />
            <span className="text-xs font-bold">単身世帯</span>
            <span className="text-[10px] text-slate-400 mt-0.5">155万非課税・280万介護壁</span>
          </button>
          <button
            type="button"
            onClick={() => onChange((prev) => ({ ...prev, householdType: 'couple' }))}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              state.householdType === 'couple'
                ? 'border-sky-500 bg-sky-50 text-sky-800 font-bold shadow-sm'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <Users className="w-5 h-5 mb-1 text-indigo-600" />
            <span className="text-xs font-bold">夫婦世帯</span>
            <span className="text-[10px] text-slate-400 mt-0.5">211万合算非課税・年の差対応</span>
          </button>
        </div>

        {/* 夫婦の場合: 視点切替タブ（ご本人 / 配偶者 / 夫婦両方同時） */}
        {isCouple && (
          <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-600">判定・表示の視点:</span>
              <span className="text-[11px] text-sky-600 font-medium">{diffYearsFormatted}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, perspective: 'primary' }))}
                className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  state.perspective === 'primary' ? 'bg-white shadow text-sky-700 border border-slate-200 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>👤 ご本人の立場</span>
              </button>
              <button
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, perspective: 'spouse' }))}
                className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  state.perspective === 'spouse' ? 'bg-white shadow text-sky-700 border border-slate-200 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>👥 配偶者の立場</span>
              </button>
              <button
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, perspective: 'both' }))}
                title="ご本人と配偶者の両方のマトリクスを並列で同時表示"
                className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  state.perspective === 'both' ? 'bg-indigo-600 text-white shadow font-bold' : 'text-slate-600 hover:text-indigo-700 hover:bg-slate-200/60'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>並列表示</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. 検証ターゲット年齢スライダー */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-bold text-slate-700 text-xs">
            シミュレーション検証年齢
          </label>
          <span className="text-base font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-mono">
            {state.targetAgeYears} 歳
          </span>
        </div>
        <input
          type="range"
          min={60}
          max={100}
          step={1}
          value={state.targetAgeYears}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange((prev) => ({ ...prev, targetAgeYears: val }));
          }}
          className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>60歳</span>
          <span className="text-sky-600 font-bold">65歳(年金)</span>
          <span className="text-emerald-600 font-bold">70歳(前期)</span>
          <span className="text-rose-600 font-bold">75歳(後期)</span>
          <span>100歳</span>
        </div>
      </div>

      {/* 3. 寿命想定の設定（個々の寿命想定: 65歳〜120歳、デフォルト100歳） */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            寿命想定の設定（65〜120歳）
          </span>
          <span className="text-[10px] text-slate-400">他界後の遺族年金を自動判定</span>
        </div>

        {/* ご本人の寿命想定 */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-medium">{state.primary.name}の想定寿命:</span>
            <span className="font-bold font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {state.primary.lifeExpectancyYears} 歳
            </span>
          </div>
          <input
            type="range"
            min={65}
            max={120}
            step={1}
            value={state.primary.lifeExpectancyYears}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 100;
              onChange((prev) => ({
                ...prev,
                primary: { ...prev.primary, lifeExpectancyYears: val },
              }));
            }}
            className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded cursor-pointer"
          />
        </div>

        {/* 配偶者の寿命想定（夫婦世帯時） */}
        {isCouple && (
          <div className="pt-2 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">{state.spouse.name}の想定寿命:</span>
              <span className="font-bold font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {state.spouse.lifeExpectancyYears} 歳
              </span>
            </div>
            <input
              type="range"
              min={65}
              max={120}
              step={1}
              value={state.spouse.lifeExpectancyYears}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 100;
                onChange((prev) => ({
                  ...prev,
                  spouse: { ...prev.spouse, lifeExpectancyYears: val },
                }));
              }}
              className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* 4. 夫婦の生年月・年齢精密入力 (夫婦の場合のみ) */}
      {isCouple && (
        <div className="border border-slate-200 rounded-xl p-3 bg-white">
          <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>ご本人・配偶者の現在年齢（満年齢＋月数）</span>
            <span className="text-[10px] text-slate-400">制度ズレの精密計算用</span>
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">{state.primary.name}の現在年齢:</span>
              <div className="flex items-center gap-1 font-mono">
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
                  className="w-14 border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono"
                />
                <span>歳</span>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={state.primary.ageMonths}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      primary: { ...prev.primary, ageMonths: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-12 border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono"
                />
                <span>ヶ月</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">{state.spouse.name}の現在年齢:</span>
              <div className="flex items-center gap-1 font-mono">
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
                  className="w-14 border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono"
                />
                <span>歳</span>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={state.spouse.ageMonths}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      spouse: { ...prev.spouse, ageMonths: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-12 border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono"
                />
                <span>ヶ月</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 年金・就労条件設定: 夫婦世帯なら切り替え不要で「ご本人」と「配偶者」を両方常時表示 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-1">
          <span className="font-bold text-slate-800 text-xs">
            年金見込み額・就労条件設定
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            ※公的判定は【額面】で行われます
          </span>
        </div>

        {/* ご本人の設定フォーム */}
        {renderPersonForm('primary', state.primary, 'bg-sky-500')}

        {/* 夫婦世帯の場合、配偶者の設定フォームも続けて並列表示 */}
        {isCouple && renderPersonForm('spouse', state.spouse, 'bg-rose-500')}
      </div>
    </div>
  );
};
