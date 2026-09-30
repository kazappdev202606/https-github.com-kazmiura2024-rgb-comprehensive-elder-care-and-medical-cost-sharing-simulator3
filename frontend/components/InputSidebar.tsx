import React from 'react';
import { SimulatorState, PersonProfile } from '../types';
import { HelpTopic } from './HelpExplanationModal';
import { User, Users, ChevronLeft, Split, HeartPulse, Briefcase, Award, HelpCircle } from 'lucide-react';

interface InputSidebarProps {
  state: SimulatorState;
  onChange: (updater: (prev: SimulatorState) => SimulatorState) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenHelp?: (topic: HelpTopic) => void;
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  state,
  onChange,
  isCollapsed,
  onToggleCollapse,
  onOpenHelp,
}) => {
  const isCouple = state.householdType === 'couple';

  // プロファイル項目変更ハンドラ
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

      const targetStrategyKey = role === 'primary' ? 'primaryStrategy' : 'spouseStrategy';
      const updatedStrategy = { ...prev.lifePlan[targetStrategyKey] };

      if (key === 'careerRetireAge') {
        updatedStrategy.careerRetireAge = value as number;
      } else if (key === 'rehireRetireAge') {
        updatedStrategy.rehireRetireAge = value as number;
      } else if (key === 'pensionStartAge') {
        updatedStrategy.pensionStartAge = value as number;
      } else if (key === 'pensionBasicMonthly' || key === 'pensionEmployeesMonthly') {
        updatedStrategy.pensionAge65GrossAnnual = Math.round(updatedProfile.pensionAge65Monthly * 12 * 10) / 10;
      }

      return {
        ...prev,
        [role]: updatedProfile,
        lifePlan: {
          ...prev.lifePlan,
          [targetStrategyKey]: updatedStrategy,
        },
      };
    });
  };

  const handleLifeExpectancyChange = (role: 'primary' | 'spouse', value: number) => {
    onChange((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        lifeExpectancyYears: value,
      },
    }));
  };

  const diffMonths =
    state.spouse.ageYears * 12 + state.spouse.ageMonths - (state.primary.ageYears * 12 + state.primary.ageMonths);
  const diffYearsFormatted =
    diffMonths === 0
      ? '同い年'
      : diffMonths > 0
      ? `配偶者が ${Math.floor(diffMonths / 12)}歳${Math.abs(diffMonths % 12)}ヶ月 年上`
      : `ご本人が ${Math.floor(Math.abs(diffMonths) / 12)}歳${Math.abs(diffMonths % 12)}ヶ月 年上`;

  // ヘルプ起動ヘルパー
  const triggerHelp = (title: string, category: string, whatIsIt: string, howToInput: string, point: string, referenceValue?: string) => {
    if (onOpenHelp) {
      onOpenHelp({ title, category, whatIsIt, howToInput, point, referenceValue });
    }
  };

  // 年金・就労入力コンポーネント（本人と配偶者両方に展開）
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
              <button
                type="button"
                onClick={() =>
                  triggerHelp(
                    '公的年金定期便見込額（65歳基準）',
                    '年金設定',
                    '日本年金機構から届く「ねんきん定期便」に記載されている、65歳から受給開始した場合の年金額面（総支給額）です。税金や社会保険料が引かれる前の金額です。',
                    'ねんきん定期便の「老齢基礎年金」欄と「老齢厚生年金」欄に記載されている月額または年額÷12の数値をそれぞれ入力してください。基礎年金＋厚生年金の合計が自動計算されます。',
                    '自営業・フリーランスの方は国民年金（基礎年金）のみ、会社員・公務員は両方を受給します。遺族厚生年金の計算には「厚生年金」の額が直接影響します。',
                    '基礎約6.8万円 / 厚生平均8〜12万円'
                  )
                }
                className="text-slate-400 hover:text-sky-600"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
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
            <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
              年金受給開始年齢（繰上げ・繰下げ）
              <button
                type="button"
                onClick={() =>
                  triggerHelp(
                    '年金受給開始年齢（繰上げ・繰下げ）',
                    '年金受給時期',
                    '公的年金を受け取り始める年齢（60〜75歳）です。標準は65歳です。',
                    'スライダーを動かして希望する受給開始年齢を選択してください。65歳より早くもらう（繰上げ）と1月あたり-0.4%（最大-24%）減額、遅くもらう（繰下げ）と1月あたり+0.7%（70歳で+42%、75歳で+84%）生涯増額されます。',
                    '繰り下げると生涯増額されますが、額面が増えすぎると医療・介護の自己負担が1割から2〜3割へ跳ね上がる「制度の壁」に突入するリスクがあります。',
                    '65歳（標準）〜70歳'
                  )
                }
                className="text-slate-400 hover:text-sky-600"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
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
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              2段階の就労・リタイア設定
            </span>
            <button
              type="button"
              onClick={() =>
                triggerHelp(
                  '2段階の就労リタイア計画',
                  '就労計画',
                  '定年までの「正職員・現役期」と、定年後の「再雇用・嘱託・パート期」の2段階で引退時期と月給を設定する仕組みです。',
                  '①正職引退年齢（例:60歳や65歳）と、賞与年額÷12を含む額面月給を入力します。\n②再雇用やパートを完全に卒業する年齢（例:65歳や70歳）と、その期間の額面月給を入力します。',
                  '公的な所得判定はすべて手取りではなく【額面年収】で行われます。給与収入が加算されると介護2割負担の壁（単身280万/夫婦346万）を超えやすくなるため、就労時間や日数の調整が重要になります。',
                  '正職60〜65歳 / 再雇用65〜70歳'
                )
              }
              className="text-slate-400 hover:text-sky-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            1. 世帯構成を選択
          </label>
          <button
            type="button"
            onClick={() =>
              triggerHelp(
                '世帯構成の選択',
                '基本設定',
                'ご自身1人の「単身世帯」か、パートナーと暮らす「夫婦世帯」かを選択します。',
                'ボタンをクリックして該当する世帯形態を選んでください。夫婦世帯の場合は、ご本人と配偶者の年齢・年金・就労・寿命想定をそれぞれ個別に精密シミュレーションできます。',
                '住民税非課税の壁は、単身世帯で155万円以下、夫婦世帯で合算211万円以下と大きく異なります。',
                '単身世帯 または 夫婦世帯'
              )
            }
            className="text-slate-400 hover:text-sky-600"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
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

        {/* 夫婦の場合: 視点切替タブ */}
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
          <label className="font-bold text-slate-700 text-xs flex items-center gap-1">
            シミュレーション検証年齢
            <button
              type="button"
              onClick={() =>
                triggerHelp(
                  'シミュレーション検証年齢',
                  '基本設定',
                  'マトリクスや判定バナーで、「ご本人が何歳の時点の状態を検証するか」を指定するスライダーです。',
                  'スライダーを左右に動かしてください。65歳（年金受給本番）、70歳（前期高齢者・医療2割）、75歳（後期高齢者・原則1割）などの制度の境目での負担変化が即座に切り替わります。',
                  '夫婦世帯では、ご本人の検証年齢に合わせて配偶者の年齢も月単位で自動計算され、年の差による制度適用のズレが完全再現されます。',
                  '60〜100歳（初期値75歳）'
                )
              }
              className="text-slate-400 hover:text-sky-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
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

      {/* 3. 寿命想定の設定 */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            寿命想定の設定（65〜120歳）
            <button
              type="button"
              onClick={() =>
                triggerHelp(
                  '寿命想定（何歳まで生きるか）',
                  'ライフプラン基本',
                  'ご自身および配偶者が何歳まで生きるかを想定する数値です（デフォルト100歳）。',
                  'スライダーを動かして65歳〜120歳の間で設定してください。夫婦世帯では、どちらかが先に他界した年齢以降は自動的に「死別単身世帯（単身155万円の崖）」へと移行し、遺族厚生年金が手取りに加算されます。',
                  '「平均寿命」ではなく「95〜100歳」を前提に組むことで、長生きしても絶対にお金が底をつかない頑丈なプランが作れます。',
                  'デフォルト100歳（設定可能範囲：65〜120歳）'
                )
              }
              className="text-slate-400 hover:text-sky-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </span>
          <span className="text-[10px] text-slate-400">第2ステップと相互連動</span>
        </div>

        {/* ご本人の寿命想定 */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-600 font-medium">{state.primary.name}の想定寿命:</span>
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

        {/* 配偶者の寿命想定（夫婦世帯時） */}
        {isCouple && (
          <div className="pt-2 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium">{state.spouse.name}の想定寿命:</span>
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

      {/* 4. 夫婦の生年月・年齢精密入力 (夫婦の場合のみ) */}
      {isCouple && (
        <div className="border border-slate-200 rounded-xl p-3 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700">
              ご本人・配偶者の現在年齢（満年齢＋月数）
            </h4>
            <button
              type="button"
              onClick={() =>
                triggerHelp(
                  '夫婦の満年齢と月数（年の差精密計算）',
                  '夫婦設定',
                  '夫婦それぞれの現在の満年齢と0〜11ヶ月を入力し、月単位での「年の差」を精密計算するための入力項目です。',
                  'ご本人と配偶者の「年齢」と「月数」をそれぞれ半角数字で入力してください。',
                  '例えば夫が75歳（後期高齢者・1割）になった時点で、妻が71歳8ヶ月（前期高齢者・2割）であるといった、夫婦間の制度適用時期のズレを完全にシミュレーションできます。',
                  '例: 65歳0ヶ月 / 62歳4ヶ月'
                )
              }
              className="text-slate-400 hover:text-sky-600"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
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

      {/* 5. 年金・就労条件設定 */}
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
