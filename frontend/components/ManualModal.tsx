import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ShieldCheck,
  Compass,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  Users,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  Percent,
  Home,
  Clock,
  Sparkles,
  Lock,
  ArrowRightLeft,
  Split
} from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  // 3部構成の親ステップ切替
  const [part, setPart] = useState<'part1' | 'part2' | 'part3'>('part1');

  // 第1部用サブタブ
  const [part1Tab, setPart1Tab] = useState<'walls' | 'survivor' | 'reverse' | 'strategies'>('walls');

  // 第2部用サブタブ
  const [part2Tab, setPart2Tab] = useState<'bucket' | 'rule100' | 'params' | 'levers'>('bucket');

  // 第3部用サブタブ
  const [part3Tab, setPart3Tab] = useState<'nisaPriority' | 'withdrawOrder' | 'sequenceRisk' | 'compare'>('nisaPriority');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 text-slate-800 font-extrabold text-base">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <div>
              <span className="text-sm sm:text-base font-black tracking-tight block">
                『安心と楽しみを両立する老後経済プラン』公式使い方マニュアル
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                第１部（壁診断）・第２部（動的ライフプラン表）・第３部（資産運用＆取り崩し）の3段階体系ガイド
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 最上部：第１部 / 第２部 / 第３部 切替ピルタブ */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setPart('part1')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              part === 'part1'
                ? 'bg-white shadow text-sky-700 border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>第１部：壁統合診断</span>
          </button>

          <button
            type="button"
            onClick={() => setPart('part2')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              part === 'part2'
                ? 'bg-indigo-600 shadow text-white'
                : 'text-slate-600 hover:text-indigo-700'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>第２部：動的ライフプラン表</span>
          </button>

          <button
            type="button"
            onClick={() => setPart('part3')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
              part === 'part3'
                ? 'bg-emerald-600 shadow text-white'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>第３部：資産運用・取り崩し</span>
          </button>
        </div>

        {/* 各部の内部詳細サブタブ */}
        {part === 'part1' ? (
          <div className="flex border-b border-slate-200 bg-white text-xs font-bold text-slate-600">
            <button
              onClick={() => setPart1Tab('walls')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part1Tab === 'walls'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ① 公的な「壁」と3ゾーン
            </button>
            <button
              onClick={() => setPart1Tab('survivor')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part1Tab === 'survivor'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ② 寿命・遺族年金と単身155万枠
            </button>
            <button
              onClick={() => setPart1Tab('reverse')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part1Tab === 'reverse'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ③ 働き損リスクと障害年金
            </button>
            <button
              onClick={() => setPart1Tab('strategies')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part1Tab === 'strategies'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ④ 4大目的別調整手順
            </button>
          </div>
        ) : part === 'part2' ? (
          <div className="flex border-b border-slate-200 bg-white text-xs font-bold text-slate-600">
            <button
              onClick={() => setPart2Tab('bucket')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part2Tab === 'bucket'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ① 3大バケット管理の基本思想
            </button>
            <button
              onClick={() => setPart2Tab('rule100')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part2Tab === 'rule100'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ② 100歳まで1円以上残るルール
            </button>
            <button
              onClick={() => setPart2Tab('params')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part2Tab === 'params'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ③ インフレ連動・手取り・NISA枠
            </button>
            <button
              onClick={() => setPart2Tab('levers')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part2Tab === 'levers'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ④ 資金ショート解消の4大レバー
            </button>
          </div>
        ) : (
          <div className="flex border-b border-slate-200 bg-white text-xs font-bold text-slate-600">
            <button
              onClick={() => setPart3Tab('nisaPriority')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part3Tab === 'nisaPriority'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ① 余剰金投資とNISA最優先
            </button>
            <button
              onClick={() => setPart3Tab('withdrawOrder')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part3Tab === 'withdrawOrder'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ② 取り崩しの黄金順序（現金→特定→NISA）
            </button>
            <button
              onClick={() => setPart3Tab('sequenceRisk')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part3Tab === 'sequenceRisk'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ③ シーケンス・リスクとバケット防護
            </button>
            <button
              onClick={() => setPart3Tab('compare')}
              className={`flex-1 py-2.5 px-2 text-center border-b-2 transition ${
                part3Tab === 'compare'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              ④ NISA限定 vs 特定口座併用比較
            </button>
          </div>
        )}

        {/* 本文コンテンツエリア */}
        <div className="overflow-y-auto p-5 sm:p-6 text-sm text-slate-700 space-y-4 leading-relaxed">
          {/* ══════════════════════════════════════════ */}
          {/* 第1部：老後のお金・医療・介護の壁 統合シミュレーター */}
          {/* ══════════════════════════════════════════ */}
          {part === 'part1' && (
            <>
              {part1Tab === 'walls' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-sky-600" />
                    公的な「壁」の仕組みと3つのゾーン判定
                  </h4>
                  <p>
                    老後の公的保障は、「住民税非課税の壁」を起点として、医療窓口負担割合・介護自己負担割合・高額療養費上限・特別養護老人ホームの補足給付がドミノ倒しのように連動します。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/60">
                      <div className="font-bold text-emerald-900 mb-1">ゾーンA（住民税非課税）</div>
                      <p className="text-emerald-950">
                        単身155万円・夫婦211万円以下【額面】。医療費上限月24,600円、介護1割、特養の食費・居住費減免（補足給付）など最大級の優遇を受けられる領域。
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-blue-300 bg-blue-50/60">
                      <div className="font-bold text-blue-900 mb-1">ゾーンB（一般1〜2割）</div>
                      <p className="text-blue-950">
                        単身156〜279万円・夫婦212〜345万円【額面】。非課税からは外れますが、介護2割の壁（280万/346万）手前で最も手取り生活費のバランスが取れる領域。
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-rose-300 bg-rose-50/60">
                      <div className="font-bold text-rose-900 mb-1">ゾーンC（負担増2〜3割）</div>
                      <p className="text-rose-950">
                        単身280万円以上・夫婦346万円以上【額面】。介護保険が2〜3割負担に跳ね上がり、高額介護上限も月93,000円へ急上昇する警戒領域。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {part1Tab === 'survivor' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-rose-900 text-base flex items-center gap-1.5">
                    <HeartHandshake className="w-5 h-5 text-rose-600" />
                    寿命想定に基づく死別シミュレーションと遺族厚生年金
                  </h4>
                  <p>
                    本アプリでは、ご本人と配偶者それぞれに「寿命想定（65〜120歳、初期値100歳）」を設定できます。
                    どちらかが先に寿命を迎えた年齢以降は、自動的に「夫婦合算211万円」から「単身155万円の崖」へ判定基準が移行します。
                  </p>
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-950 space-y-2">
                    <div className="font-bold text-rose-900 text-sm">知っておくべき遺族厚生年金の鉄則:</div>
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      <li>
                        <strong>遺族厚生年金は全額「完全非課税」:</strong> 判定基準年収（課税所得）には1円も加算されないため、いくら受給しても非課税枠や1割負担が剥奪されることはありません。手取り生活費にのみ100%丸々プラスされます。
                      </li>
                      <li>
                        <strong>支給額の計算ロジック:</strong> 先立った配偶者の老齢厚生年金（報酬比例部分）の3/4から、生存者自身の老齢厚生年金を差し引いた差額が支給されます（差額支給方式）。
                      </li>
                      <li>
                        <strong>残される側の老齢年金を増やしすぎない:</strong> 自身の老齢年金は課税対象となるため、繰下げで増やしすぎると配偶者他界後に自動課税化し、医療・介護自己負担が倍増します。
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {part1Tab === 'reverse' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-amber-900 text-base flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    逆進性（働き損）リスクと障害年金への留意点
                  </h4>
                  <p>
                    非課税枠や介護1割枠の境界線上では、数万円の労働給与増によって自己負担上限が倍増し、手取りが逆に減る「逆進性の崖」が存在します。
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
                    <div className="font-bold text-amber-900 text-sm">繰上げ受給を検討する際の重大な留意点:</div>
                    <p>
                      65歳未満で老齢年金を繰り上げると、法律上「みなし65歳到達」となります。繰上げ後に重い病気やケガを負っても、<strong>「事後重症による障害年金」を原則請求できなくなります。</strong>
                    </p>
                    <div className="pt-1 text-amber-900 font-medium">
                      💡 <strong>推奨対策:</strong> 健康リスクや万が一の補償（障害年金・傷害保険など）との兼ね合いを見極めつつ、年金受給開始を繰り下げすぎない範囲で、労働給与の調整を行うことが推奨されます。
                    </div>
                  </div>
                </div>
              )}

              {part1Tab === 'strategies' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-slate-800 text-base">4大目的別ライフプラン調整手順</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-xl">
                      <div className="font-bold text-emerald-900 mb-1">① 徹底的に非課税ゾーンA狙い</div>
                      <p className="text-emerald-950">
                        年金を65歳以前で受給し年金額面を抑制（単身155万、夫婦211万以内）。高額療養費月2.46万＋特養補足給付を享受。
                      </p>
                    </div>
                    <div className="border border-blue-200 bg-blue-50/50 p-3 rounded-xl">
                      <div className="font-bold text-blue-900 mb-1">② 高年金向け一般維持（ゾーンB）</div>
                      <p className="text-blue-950">
                        非課税が無理な場合、介護2割ライン（単身280万、夫婦346万）の手前で就労を調整し、自己負担1割と上限44,400円をキープ。
                      </p>
                    </div>
                    <div className="border border-purple-200 bg-purple-50/50 p-3 rounded-xl">
                      <div className="font-bold text-purple-900 mb-1">③ 介護2割手前で最大稼ぐ</div>
                      <p className="text-purple-950">
                        再雇用の就労時間を調整し、介護負担2倍化（2割）の手前で抑えて可処分所得を極大化。
                      </p>
                    </div>
                    <div className="border border-amber-200 bg-amber-50/50 p-3 rounded-xl">
                      <div className="font-bold text-amber-900 mb-1">④ 夫婦バランス型受給設計</div>
                      <p className="text-amber-950">
                        公的年金は65歳受給、夫婦それぞれの就労時期と他界後の遺族厚生年金を踏まえ、生涯の自己負担を最小化。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════ */}
          {/* 第2部：動的ライフプラン作成シミュレーター */}
          {/* ══════════════════════════════════════════ */}
          {part === 'part2' && (
            <>
              {part2Tab === 'bucket' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-indigo-950 text-base flex items-center gap-1.5">
                    <Wallet className="w-5 h-5 text-indigo-600" />
                    3大バケット（用途別口座）管理の基本思想
                  </h4>
                  <p>
                    全資産を1つの普通預金にまとめていると、「残高が減る恐怖」から使っていいお金まで使えなくなります。『完全マニュアル』では資金を以下の3つに物理的・機能的に分離します。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/60">
                      <div className="font-bold text-emerald-900 text-sm mb-1">バケット1：生活現金</div>
                      <div className="text-[11px] text-emerald-800 font-mono mb-1.5">目安: 300万円キープ</div>
                      <p className="text-emerald-950 leading-relaxed">
                        毎月の年金振込と日々の固定生活費のズレを吸収する待機現金。日々の赤字を吸収するクッションとして機能します。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-indigo-300 bg-indigo-50/60">
                      <div className="font-bold text-indigo-900 text-sm mb-1">バケット2：NISA運用資産</div>
                      <div className="text-[11px] text-indigo-800 font-mono mb-1.5">★最重要エンジン</div>
                      <p className="text-indigo-950 leading-relaxed">
                        世界株式インデックス投資等。毎年の収支黒字はここへプールされ、赤字やアクティブ娯楽費はここから取り崩されます。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50">
                      <div className="font-bold text-slate-800 text-sm mb-1">バケット3：医療介護防衛</div>
                      <div className="text-[11px] text-slate-600 font-mono mb-1.5">目安: 500万円温存</div>
                      <p className="text-slate-700 leading-relaxed">
                        第3章の公的上限確定に基づき完全隔離する元本保証資産（個人向け国債変動10年等）。日々の生活費では一切手を付けない聖域。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {part2Tab === 'rule100' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-indigo-950 text-base flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    【最重要コンセプト】「バケット2が1円でも残る状態」を100歳まで維持する
                  </h4>
                  <p>
                    動的ライフプラン表の究極の合格基準は、<strong>「100歳を迎えた時点で、バケット2（運用資産）に1円でも残高が残っていること」</strong>です。
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 text-slate-700">
                    <div className="font-bold text-slate-900 text-sm">赤字を隠さずマイナス表示する理由:</div>
                    <p>
                      一般的なシミュレーションソフトのように残高ゼロで計算を止めず、本アプリではバケット2が枯渇すると「マイナス（赤字）」のまま突き抜けて赤色で表示されます。
                    </p>
                    <p className="text-rose-700 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                      「何歳で何千万円足りなくなるのか」を画面上で発見し、事前に潰すことこそがシミュレーションの真の目的です。画面上での失敗は、未来の成功を約束します。
                    </p>
                  </div>
                </div>
              )}

              {part2Tab === 'params' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-indigo-950 text-base flex items-center gap-1.5">
                    <Percent className="w-5 h-5 text-indigo-600" />
                    インフレ自動連動・手取りスライド・NISA制限枠
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        インフレ自動複利連動:
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        物価上昇率（例: 年1.5%）を設定すると、年数が経過するにつれて生活費・娯楽費・修繕費が自動的に膨らんで計算されます。将来の購買力低下リスクを完全に反映します。
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                        手取り率スライド（現役80% / 年金85%）:
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        額面ではなく、税・社会保険料が控除された後の「実際に口座に振り込まれる可処分所得」でキャッシュフローを精密計算します。
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        NISA枠制限チェック（1,800万円/人）:
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        非課税枠の範囲内（単身1,800万、夫婦3,600万）で運用されているかを確認し、課税口座の所得連動ペナルティを回避する健全な運用規模を保ちます。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {part2Tab === 'levers' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-indigo-950 text-base flex items-center gap-1.5">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    資金ショートを解消する「4大調整レバー」
                  </h4>
                  <p>
                    表上でバケット2がマイナス（赤字）になった場合、以下の4大レバーを左カラムで少し動かすだけで、数字は劇的に黒字化へ改善します。
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="border border-indigo-200 bg-indigo-50/50 p-3.5 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-950 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        レバー1：就労の延伸
                      </div>
                      <p className="text-indigo-900 leading-relaxed">
                        65〜70歳で月10〜15万円（夫婦で軽労務）働くことで、取り崩しの開始を5年間先送りし、資産寿命を半永久化します。
                      </p>
                    </div>

                    <div className="border border-indigo-200 bg-indigo-50/50 p-3.5 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-950 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        レバー2：年金受給開始の調整
                      </div>
                      <p className="text-indigo-900 leading-relaxed">
                        手元資金が薄い場合は無理に繰り下げず65歳から受給開始し、退職初期のキャッシュ枯渇（シーケンス・オブ・リターン）を防ぎます。
                      </p>
                    </div>

                    <div className="border border-indigo-200 bg-indigo-50/50 p-3.5 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-950 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        レバー3：アクティブ娯楽費の伸縮
                      </div>
                      <p className="text-indigo-900 leading-relaxed">
                        バケット2の娯楽予算にメリハリをつけ、相場下落時や高齢期には少し予算を調整して元本を保護します。
                      </p>
                    </div>

                    <div className="border border-indigo-200 bg-indigo-50/50 p-3.5 rounded-xl space-y-1">
                      <div className="font-bold text-indigo-950 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        レバー4：住まいの最適化（現金化）
                      </div>
                      <p className="text-indigo-900 leading-relaxed">
                        70代で持ち家を売却・賃貸へ住み替え、手取り1,000万〜2,000万円をバケット2へ合流させて一気に黒字化します。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════ */}
          {/* 第3部：資産運用プラン作成シミュレーター */}
          {/* ══════════════════════════════════════════ */}
          {part === 'part3' && (
            <>
              {part3Tab === 'nisaPriority' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-emerald-950 text-base flex items-center gap-1.5">
                    <Coins className="w-5 h-5 text-emerald-600" />
                    余剰金投資とNISA最優先ルール
                  </h4>
                  <p>
                    毎年の家計が黒字（余剰金）になった際、どこにどのような優先順位でお金を回すべきかの最適解をシミュレーションします。
                  </p>
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2 text-emerald-950">
                    <div className="font-bold text-emerald-900 text-sm">余剰金の投資ルーティング原則:</div>
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      <li>
                        <strong>① NISA年間上限枠（360万/人）を最優先で消化:</strong> 生涯非課税枠（1,800万円/人、夫婦3,600万円）が残っている限り、手取り余剰金は真っ先にNISAへ投入します。
                      </li>
                      <li>
                        <strong>② 特定口座からの自動移行（ロールオーバー）:</strong> 特定口座に資金がありNISA年間枠に余裕がある年は、特定口座を取り崩してNISAへ自動で買い直します。
                      </li>
                      <li>
                        <strong>③ NISA満額後の分岐:</strong> 「NISA枠限定ON」なら無リスク現金で保持。「NISA枠限定OFF」なら特定口座（源泉徴収あり）へ投資し、さらなる複利増殖を図ります。
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {part3Tab === 'withdrawOrder' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-emerald-950 text-base flex items-center gap-1.5">
                    <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                    取り崩しの黄金順序（現金 → 特定口座 → NISA口座）
                  </h4>
                  <p>
                    定年退職後や年金生活で家計が赤字（取り崩しフェーズ）に入った際、どの口座から取り崩すかで資産寿命は何年も変わります。
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                      <div>
                        <strong className="text-slate-900 block text-xs">余剰現金（待機普通預金）の先行消化</strong>
                        <p className="text-slate-500 text-[11px] mt-0.5">利息がほぼつかない現金を真っ先に消費し、運用口座に触れない期間を稼ぎます。</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-sky-300 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                      <div>
                        <strong className="text-sky-900 block text-xs">特定口座（課税口座）の売却</strong>
                        <p className="text-slate-600 text-[11px] mt-0.5">利益に約20.315%の税金がかかる課税口座から先に現金化していきます。</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-indigo-400 bg-indigo-50/30 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                      <div>
                        <strong className="text-indigo-950 block text-xs">NISA口座（非課税口座）を最後まで温存</strong>
                        <p className="text-indigo-900 text-[11px] mt-0.5">非課税で複利が働き続ける最強の資産を一番最後に回すことで、資産寿命を極限まで引き延ばします。</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {part3Tab === 'sequenceRisk' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-rose-950 text-base flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    シーケンス・オブ・リターン・リスクとバケット防衛
                  </h4>
                  <p>
                    取り崩し初期（65〜70歳頃）に歴史的な株価暴落が直撃すると、資産元本が削られ急激に枯渇へ向かう現象を「収益率の順序リスク（シーケンス・リスク）」と呼びます。
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-slate-700">
                    <div className="font-bold text-slate-900 text-sm">バケット1と3が最後の防波堤となる理由:</div>
                    <p>
                      本シミュレーターでは、バケット1（生活現金300万）とバケット3（医療介護防衛500万）を取り崩し計画から完全に別枠隔離しています。
                    </p>
                    <p className="leading-relaxed">
                      市場が大暴落している最中に生活費のために株式を底値で売却する必要が一切なく、株価が回復するまでの数年間を無傷でやり過ごすことができます。
                    </p>
                    <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 font-bold">
                      ⚠️ テーブル上で「緊急防衛バッファ」から出動（-〇〇万）が表示された場合は、手元資産の抜本的な改善が必要なシグナルです。
                    </div>
                  </div>
                </div>
              )}

              {part3Tab === 'compare' && (
                <div className="space-y-3.5">
                  <h4 className="font-black text-slate-800 text-base flex items-center gap-1.5">
                    <Split className="w-5 h-5 text-indigo-600" />
                    NISA限定 vs 特定口座併用の比較活用法
                  </h4>
                  <p>
                    第3ステップでは、ワンクリックで「運用をNISA枠に限定した方針」と「特定口座もフル活用した方針」の生涯資産推移を横並びで比較できます。
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-sky-300 bg-sky-50/50 space-y-1">
                      <div className="font-bold text-sky-950">方針A：運用をNISA枠に限定</div>
                      <p className="text-sky-900 leading-relaxed text-[11px]">
                        メリット：利益が非課税枠内のみのため、確定申告による社会保険料の跳ね上がりや介護保険2割化のリスクがゼロ。
                        <br />
                        デメリット：多額の余剰金が現金で寝てしまい、インフレで購買力が目減りする可能性。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-indigo-300 bg-indigo-50/50 space-y-1">
                      <div className="font-bold text-indigo-950">方針B：特定口座（源泉あり）も併用</div>
                      <p className="text-indigo-900 leading-relaxed text-[11px]">
                        メリット：余剰金を全額複利運用に回せるため、100歳時点での総資産額が数倍〜数千万円単位で大きくなる。
                        <br />
                        ポイント：必ず「源泉徴収あり（申告不要）」を選ぶことで、公的な所得判定に影響を与えずに安全に運用可能。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {part === 'part1'
              ? '※上部タブから「第２部（動的ライフプラン表）」「第３部（資産運用）」のマニュアルへ切り替えられます'
              : part === 'part2'
              ? '※上部タブから「第１部（壁診断）」「第３部（資産運用）」のマニュアルへ切り替えられます'
              : '※上部タブから「第１部（壁診断）」「第２部（動的ライフプラン表）」のマニュアルへ切り替えられます'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition shadow-sm"
          >
            マニュアルを閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
