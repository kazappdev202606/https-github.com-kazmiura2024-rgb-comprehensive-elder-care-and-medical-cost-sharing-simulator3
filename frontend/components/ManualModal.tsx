import React, { useState } from 'react';
import { X, BookOpen, User, Users, HeartHandshake, Compass } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'couple' | 'bereaved' | 'goals'>('single');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-base">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <span>「老後の壁」使い方マニュアル＆戦略ガイド</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'single'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>① 単身世帯</span>
          </button>
          <button
            onClick={() => setActiveTab('couple')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'couple'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>② 夫婦世帯</span>
          </button>
          <button
            onClick={() => setActiveTab('bereaved')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'bereaved'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>③ 寿命と死別の検証</span>
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'goals'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>④ 4大目的別調整</span>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto p-5 sm:p-6 text-sm text-slate-700 space-y-4 leading-relaxed">
          {activeTab === 'single' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-base">単身世帯における確認ポイント</h4>
              <p>
                単身世帯では「155万円の非課税の壁」「280万円の介護2割の壁」「383万円の医療現役3割の壁」の3つのラインがすべてご自身の年収だけで決まります。
                寿命想定（65〜120歳、デフォルト100歳）を設定することで、生涯にわたる公的負担と手取りをシミュレーションできます。
              </p>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-sky-900">年齢スライダーの動かし方:</div>
                <ul className="list-disc list-inside space-y-1 text-sky-950">
                  <li><strong>65歳時点:</strong> 年金受給開始と再雇用の両立期。給与と合算して280万円を超えると介護負担が2割になります。</li>
                  <li><strong>70歳時点:</strong> 前期高齢者入り。医療費窓口負担が原則2割になります。</li>
                  <li><strong>75歳時点:</strong> 後期高齢者入り。非課税であれば窓口1割、上限24,600円となり恩恵が最大化します。</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'couple' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-base">夫婦世帯における年の差と制度適用時期のズレ</h4>
              <p>
                ご本人と配偶者の生年月日・年齢差により、同じ年であっても「一方は後期高齢者（1割）、もう一方は現役（3割）」といった制度適用のギャップが生じます。
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-slate-800">視点切り替えの活用:</div>
                <p>
                  「ご本人の立場で判定」「配偶者の立場で判定」「並列表示」をワンクリックで切り替え可能です。一方が退職して年金生活に入った後も、もう一方の就労収入が世帯合算判定（211万円や346万円）にどう影響するかを瞬時に把握できます。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'bereaved' && (
            <div className="space-y-3">
              <h4 className="font-bold text-rose-900 text-base">
                寿命想定に基づく死別シミュレーションと事前3大ルール
              </h4>
              <p className="text-slate-700 leading-relaxed">
                本アプリではご本人と配偶者それぞれに「寿命想定（65〜120歳、初期値100歳）」を設定できます。
                どちらかが先に寿命を迎えた年齢以降は、自動的に「夫婦合算211万円」から「単身155万円の崖」へ基準が移行し、先立たれた配偶者の老齢厚生年金の3/4をベースにした遺族厚生年金が自動加算されます。
                遺族年金は全額「非課税」のため壁の判定からは除外され、いくら受給しても負担割合や保険料が上がる原因にはなりません。
              </p>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2.5 text-xs text-rose-950">
                <div className="font-bold text-rose-900 text-sm">途方に暮れないための事前3大ルール:</div>
                <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                  <li>
                    <strong>残される側の「老齢年金」を繰下げ増額しすぎない:</strong>{' '}
                    155万円の崖を引き起こすリスクがあるのは、課税対象であるご自身の「老齢年金」です。繰下げで増やしすぎると配偶者の他界後に自動的に課税化し、医療・介護費が跳ね上がります（※非課税である遺族年金や障害年金はいくら増えても影響ありません）。
                  </li>
                  <li>
                    <strong>生前にNISAや非課税年金を軸にした資金設計をしておく:</strong>{' '}
                    預貯金やNISAの取崩し、および遺族年金・障害年金はすべて所得判定ゼロです。課税される老齢年金は抑えつつ、これらの「非課税の資金」で生活費を補うことで、医療・介護費の1割負担を維持できます。
                  </li>
                  <li>
                    <strong>介護保険料の段階を確認しておく:</strong>{' '}
                    ご自身の老齢年金などが原因で非課税世帯から外れると、自治体の介護保険料自体も年間数万円跳ね上がります（※遺族年金や障害年金が理由で非課税世帯から外れることはありません）。
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-base">4大目的別ライフプラン調整手順</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-xl">
                  <div className="font-bold text-emerald-900 mb-1">① 徹底的に非課税ゾーンA狙い</div>
                  <p className="text-emerald-950">
                    年金を65歳以前で受給し年金額面を抑制（単身155万、夫婦211万以内）。生活費不足分はNISA取り崩しで補填し、高額療養費月2.46万＋特養補足給付を享受。
                  </p>
                </div>
                <div className="border border-blue-200 bg-blue-50/50 p-3 rounded-xl">
                  <div className="font-bold text-blue-900 mb-2">② 高年金向け一般維持（ゾーンB）</div>
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
                  <div className="font-bold text-amber-900 mb-1">④ NISA併用型ハイブリッド</div>
                  <p className="text-amber-950">
                    公的年金は65歳受給、就労リタイア後は月3〜5万円のNISA非課税取崩しを恒常化。制度の壁を意識せずに生活満足度を最大化。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
