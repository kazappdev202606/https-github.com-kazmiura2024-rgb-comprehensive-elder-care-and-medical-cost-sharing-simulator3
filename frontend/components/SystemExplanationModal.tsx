import React from 'react';
import { X, ShieldCheck, HelpCircle, Layers } from 'lucide-react';

interface SystemExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemExplanationModal: React.FC<SystemExplanationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-base">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>3つのゾーンと連動する制度の仕組み</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto p-5 sm:p-6 text-sm text-slate-700 space-y-5 leading-relaxed">
          <p>
            日本の社会保障制度は「住民税の課税・非課税」を起点として、医療費の窓口負担割合、高額療養費の上限額、介護保険の自己負担割合、特別養護老人ホームの費用補助がドミノ倒しのように連動します。
          </p>

          <div className="space-y-4">
            {/* ゾーンA */}
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4">
              <div className="flex items-center justify-between font-extrabold text-emerald-900 text-sm mb-2">
                <span>ゾーンA: 住民税非課税・最大恩恵ゾーン</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                  単身155万 / 夫婦211万以下【額面】
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-emerald-950 space-y-1">
                <li><strong>医療費:</strong> 75歳以上は原則1割負担。高額療養費上限は月額24,600円（外来8,000円）。</li>
                <li><strong>介護保険:</strong> 自己負担1割。高額介護サービス費上限は月額24,600円。自治体介護保険料も最安区分。</li>
                <li><strong>特養施設:</strong> 食費・居住費の補足給付（負担限度額認定）の対象。月額自己負担が一般より約5〜8万円軽減。</li>
              </ul>
            </div>

            {/* ゾーンB */}
            <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4">
              <div className="flex items-center justify-between font-extrabold text-blue-900 text-sm mb-2">
                <span>ゾーンB: 一般所得・中庸維持ゾーン</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                  単身156〜279万 / 夫婦212〜345万【額面】
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-blue-950 space-y-1">
                <li><strong>医療費:</strong> 70〜74歳は原則2割、75歳以上は1割（一定以上所得は2割）。高額療養費上限は月額57,600円。</li>
                <li><strong>介護保険:</strong> 自己負担1割をキープ。高額介護上限は月額44,400円。</li>
                <li><strong>注意点:</strong> 非課税優遇は消滅しますが、介護2割の壁の手前で最も手取り生活費のバランスが取れる領域です。</li>
              </ul>
            </div>

            {/* ゾーンC */}
            <div className="border border-rose-200 bg-rose-50/50 rounded-2xl p-4">
              <div className="flex items-center justify-between font-extrabold text-rose-900 text-sm mb-2">
                <span>ゾーンC: 負担急増・現役並み所得ゾーン</span>
                <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono">
                  単身280万〜 / 夫婦346万〜【額面】
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-rose-950 space-y-1">
                <li><strong>介護保険:</strong> 合計所得基準により自己負担が2割、または3割（単身340万〜）に跳ね上がり。高額介護上限も月93,000円へ。</li>
                <li><strong>医療費:</strong> 70歳以上でも現役並み所得（単身383万/夫婦520万）に該当すると窓口3割負担。上限も80,100円〜167,400円へ急上昇。</li>
                <li><strong>対策:</strong> 「年金の繰下げ受給」で額面が増えすぎると知らぬ間にゾーンCへ突入するケースが多発しています。</li>
              </ul>
            </div>
          </div>
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
