import React from 'react';
import { X, HelpCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

export interface HelpTopic {
  title: string;
  category: string;
  whatIsIt: string; // これは何か？
  howToInput: string; // 何をどう入力・設定すればいいか？
  point: string; // 失敗しないためのポイント・アドバイス
  referenceValue?: string; // 目安・標準値
}

interface HelpExplanationModalProps {
  topic: HelpTopic | null;
  onClose: () => void;
}

export const HelpExplanationModal: React.FC<HelpExplanationModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                {topic.category}
              </span>
              <h3 className="text-sm font-black text-slate-800 leading-tight">
                {topic.title} の入力ガイド
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 本文 */}
        <div className="p-5 space-y-4 text-xs text-slate-700 overflow-y-auto max-h-[75vh] leading-relaxed">
          {/* 目安値バッジ */}
          {topic.referenceValue && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 flex items-center justify-between">
              <span className="font-bold text-sky-900">標準的な目安・初期値:</span>
              <span className="font-mono font-black text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-300">
                {topic.referenceValue}
              </span>
            </div>
          )}

          {/* これは何？ */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              この項目は何を表しているか？
            </h4>
            <p className="text-slate-600 pl-3.5 whitespace-pre-line">
              {topic.whatIsIt}
            </p>
          </div>

          {/* どう入力するか？ */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              入力・設定の具体的な手順
            </h4>
            <p className="text-slate-600 whitespace-pre-line text-[11px] leading-relaxed">
              {topic.howToInput}
            </p>
          </div>

          {/* ポイント */}
          <div className="space-y-1 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-amber-950">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              賢く設定するためのヒント＆注意点
            </h4>
            <p className="whitespace-pre-line text-[11px] leading-relaxed">
              {topic.point}
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            理解しました
          </button>
        </div>
      </div>
    </div>
  );
};
