import React, { useState } from 'react';
import { X, ShieldCheck, Layers, Coins, Landmark, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface SystemExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemExplanationModal: React.FC<SystemExplanationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'walls' | 'nisa' | 'pensionTax' | 'riskFramework'>('walls');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 text-slate-800 font-extrabold text-base">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="text-base font-black tracking-tight block">
                老後ライフプラン統合 制度解説ガイド
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                医療・介護の壁、新NISA、公的年金税制、3大バケット管理の完全連動ルール
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

        {/* タブナビゲーション */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 flex-wrap">
          <button
            onClick={() => setActiveTab('walls')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'walls'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>① 医療・介護・非課税の壁</span>
          </button>
          <button
            onClick={() => setActiveTab('nisa')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'nisa'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-indigo-600" />
            <span>② 新NISA＆特定口座の税制</span>
          </button>
          <button
            onClick={() => setActiveTab('pensionTax')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pensionTax'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>③ 年金・退職金・手取り構造</span>
          </button>
          <button
            onClick={() => setActiveTab('riskFramework')}
            className={`flex-1 py-3 px-2 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'riskFramework'
                ? 'border-amber-600 text-amber-700 bg-white shadow-2xs font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>④ リスク防衛と3大バケット</span>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto p-5 sm:p-6 text-sm text-slate-700 space-y-4 leading-relaxed">
          {activeTab === 'walls' && (
            <div className="space-y-4">
              <p>
                日本の社会保障制度は「住民税の課税・非課税」を起点として、医療費窓口負担割合・介護保険自己負担割合・高額療養費上限・特別養護老人ホーム費用補助がドミノ倒しのように連動します。
              </p>

              <div className="space-y-3">
                {/* ゾーンA */}
                <div className="border border-emerald-300 bg-emerald-50/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between font-black text-emerald-900 text-sm mb-1.5">
                    <span>ゾーンA: 住民税非課税・最大恩恵ゾーン</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                      単身155万 / 夫婦211万以下【額面】
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-emerald-950 space-y-1">
                    <li><strong>医療費:</strong> 75歳以上は原則1割負担。高額療養費上限は月額24,600円（外来8,000円）。</li>
                    <li><strong>介護保険:</strong> 自己負担1割。高額介護サービス費上限は月額24,600円。市区町村介護保険料も最安区分。</li>
                    <li><strong>特養施設:</strong> 食費・居住費の補足給付（負担限度額認定）の対象。月額自己負担が一般より約5〜8万円大幅軽減。</li>
                  </ul>
                </div>

                {/* ゾーンB */}
                <div className="border border-blue-300 bg-blue-50/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between font-black text-blue-900 text-sm mb-1.5">
                    <span>ゾーンB: 一般所得・中庸維持ゾーン</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                      単身156〜279万 / 夫婦212〜345万【額面】
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-blue-950 space-y-1">
                    <li><strong>医療費:</strong> 70〜74歳は原則2割、75歳以上は原則1割（一定所得は2割）。高額療養費上限は月額57,600円。</li>
                    <li><strong>介護保険:</strong> 自己負担1割を維持。高額介護上限は月額44,400円。</li>
                    <li><strong>ポイント:</strong> 非課税優遇は消えますが、介護2割の壁の手前で手取りと公的負担のバランスが最も安定する領域。</li>
                  </ul>
                </div>

                {/* ゾーンC */}
                <div className="border border-rose-300 bg-rose-50/50 rounded-2xl p-4">
                  <div className="flex items-center justify-between font-black text-rose-900 text-sm mb-1.5">
                    <span>ゾーンC: 負担急増・現役並み所得ゾーン</span>
                    <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-bold">
                      単身280万〜 / 夫婦346万〜【額面】
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-950 space-y-1">
                    <li><strong>介護保険:</strong> 自己負担が2割、または3割（単身340万〜）に跳ね上がり。高額介護上限も月93,000円へ急上昇。</li>
                    <li><strong>医療費:</strong> 現役並み所得（単身383万/夫婦520万）に該当すると窓口3割負担。上限も80,100円〜167,400円へ上昇。</li>
                    <li><strong>注意点:</strong> 「年金の繰下げ受給」で額面が増えすぎると知らぬ間にゾーンCへ突入するケースが多発しています。</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nisa' && (
            <div className="space-y-3.5 text-xs">
              <h4 className="font-black text-indigo-950 text-sm">
                新NISAと特定口座の税制連動ルール
              </h4>

              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1.5">
                <div className="font-bold text-indigo-900">① 新NISAの非課税保有限度額（1人1,800万円、夫婦3,600万円）</div>
                <p className="text-slate-600 leading-relaxed">
                  年間投資枠は最大360万円（つみたて120万＋成長投資枠240万）。売却しても簿価ベースで翌年に枠が復活するため、取り崩し期に最適です。
                  NISA口座内の値上がり益や分配金は<strong>「合計所得金額」に1円も算入されない</strong>ため、住民税非課税の判定や医療・介護の自己負担割合の判定に一切悪影響を与えません。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="font-bold text-slate-800">② 特定口座（源泉徴収あり・申告不要制度）の鉄則</div>
                <p className="text-slate-600 leading-relaxed">
                  NISA枠を超えて余剰金を投資する場合、特定口座（源泉徴収あり）を選び、<strong>「確定申告を行わない（申告不要）」</strong>ことが極めて重要です。
                  確定申告をしてしまうと、所得が増加したとみなされ、翌年の国民健康保険料・後期高齢者医療保険料・介護保険料が跳ね上がり、医療・介護の窓口負担が1割から2〜3割へ悪化します。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="font-bold text-emerald-900">③ 特定口座からNISAへのロールオーバー（乗り換え移行）</div>
                <p className="text-slate-600 leading-relaxed">
                  本シミュレーターでは、特定口座に資産があり、かつNISAの年間投資可能枠が余っている年は、特定口座を売却してNISA口座へ自動移行させます。これにより、将来の運用益を非課税空間へ集約します。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pensionTax' && (
            <div className="space-y-3.5 text-xs">
              <h4 className="font-black text-emerald-950 text-sm">
                公的年金・退職金・手取りと控除の仕組み
              </h4>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-800">① 公的年金の手取り率は「約85%」</div>
                <p className="text-slate-600 leading-relaxed">
                  年金額面からは、介護保険料・国民健康保険料（後期高齢者医療保険料）・所得税・住民税が自動天引き（特別徴収）されます。
                  額面年金が増えるほど天引き割合が高くなるため、シミュレーションでは「額面の80〜85%」を実質的な手取りとして計算します。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                <div className="font-bold text-emerald-900">② 退職金の「一時金受取」と退職所得控除</div>
                <p className="text-slate-600 leading-relaxed">
                  退職金を一時金で受け取る場合、勤続20年以下は年40万、20年超は年70万円の強力な「退職所得控除」が適用され、控除後の金額をさらに1/2して課税されます。
                  さらに分離課税のため、翌年の社会保険料にも一切跳ね返りません（年金分割で受け取ると毎年の税・社保が急増します）。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                <div className="font-bold text-amber-900">③ 在職老齢年金（月50万円の基準額）</div>
                <p className="text-slate-600 leading-relaxed">
                  65歳以降に働きながら厚生年金を受け取る場合、「給与（賞与含む月割）＋厚生年金月額」が50万円を超えると、超えた分の1/2の厚生年金が支給停止されます（基礎年金は満額受給可能）。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'riskFramework' && (
            <div className="space-y-3.5 text-xs">
              <h4 className="font-black text-amber-950 text-sm">
                老後リスクの防衛枠組みと3大バケット管理
              </h4>

              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                <div className="font-bold text-amber-900">① シーケンス・オブ・リターン・リスク（収益率の順序リスク）の防衛</div>
                <p className="text-slate-600 leading-relaxed">
                  退職直後の数年間に株価の大暴落が直撃すると、資産元本が急激に削られ、資産寿命が半減します。
                  これに対抗するため、日常の赤字は「バケット1（生活現金）」から埋め、不況期に株式を底値で売却しなくて済む現金クッションを保ちます。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="font-bold text-slate-800">② 医療・介護の生涯持ち出し上限（300万〜500万円）の確定</div>
                <p className="text-slate-600 leading-relaxed">
                  高額療養費・高額介護サービス費・高額医療合算介護制度により、一般所得世帯でも年間の自己負担上限は最大56万円です。
                  平均要介護期間5年間を考慮しても、自己資金からの持ち出しは300万〜500万円で天井が確定します。これを「バケット3」として封印します。
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1.5">
                <div className="font-bold text-rose-900">③ 遺族厚生年金の3/4差額支給（完全非課税）</div>
                <p className="text-slate-600 leading-relaxed">
                  配偶者が他界した際、先立った配偶者の老齢厚生年金の3/4をベースにした遺族厚生年金が支給されます。
                  遺族年金は所得税・住民税・社会保険料の対象外（完全非課税）であるため、壁の判定を狂わせることなく全額が手取り生活費を補填します。
                </p>
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
