import React from 'react';
import { CalculationResult, HouseholdType } from '../types';
import { AlertTriangle, Users, Sparkles } from 'lucide-react';

interface AdviceReportsProps {
  currentResult: CalculationResult;
  householdType: HouseholdType;
}

export const AdviceReports: React.FC<AdviceReportsProps> = ({ currentResult, householdType }) => {
  const isTaxFree = currentResult.isTaxFree;

  return (
    <div className="space-y-3">
      <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
        <span>パーソナライズ制度助言＆リスク分析レポート</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* レポート①: 逆進性（働き損）リスクと手取り最適化 */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>① 逆進性（働き損）リスクと手取り最適化</span>
            </div>
            <div className="text-xs text-amber-950 leading-relaxed space-y-2">
              {isTaxFree ? (
                <>
                  <p>
                    現在、世帯年収 {currentResult.householdGrossAnnual}万円で非課税ゾーンAを維持しています。
                    もし年収があと少し増えて課税になると、高額療養費の上限が月24,600円から57,600円へ倍増し、特養の補足給付（年間約30〜50万円）も剥奪されるため、数万円の労働給与増よりも手取りが減る「逆進性の崖」に直面します。
                  </p>
                  <p className="bg-amber-100/70 p-2 rounded-lg border border-amber-300 text-[11px] leading-relaxed">
                    <strong>⚠️ 繰上げ受給の留意点:</strong> 65歳未満で老齢年金を繰り上げると、法律上「みなし65歳到達」となり、繰上げ後に重い病気やケガを負っても「障害年金（事後重症請求など）」を原則請求できなくなります。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    現在、課税ゾーン（B/C）に位置しており、高額介護サービス費や医療費窓口負担はすでに一般/現役水準（上限44,400円〜）となっています。中途半端に働くよりも、健康が許す限りしっかり稼いで資産形成を図るか、繰上げ受給によって手取りを最大化する戦略が有効です。
                  </p>
                  <div className="bg-amber-100/70 p-2 rounded-lg border border-amber-300 text-[11px] leading-relaxed space-y-1">
                    <div className="font-bold text-amber-900">検討にあたっての留意点とリスク:</div>
                    <p>
                      <strong>繰上げ受給のリスク:</strong> 65歳未満で老齢年金を繰上げ受給した場合、みなし65歳到達となり、繰上げ後に障害を負っても「障害年金」が請求できなくなります。
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-200/80 text-[11px] text-amber-900 font-medium leading-snug">
            💡 <strong>推奨対策:</strong> 自身の健康リスクや万が一の補償（障害年金・民間保険等）との兼ね合いを見極めつつ、年金受給開始を繰り下げすぎない範囲で、労働給与の調整を行うことを推奨します。
          </div>
        </div>

        {/* レポート②: 世帯別リスク分析 */}
        <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>
                {householdType === 'couple'
                  ? '② 夫婦の年の差ギャップと配偶者他界後の崖'
                  : '② 単身者の特養補足給付の壁'}
              </span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed">
              {householdType === 'couple' ? (
                <>
                  夫婦間に年の差がある場合、一方が75歳で後期高齢者（1〜2割負担）になっても、もう一方は前期高齢者（原則2割）や現役（3割）の時期が続きます。
                  また、配偶者が他界した後は世帯非課税基準が211万円から単身155万円へ急落します。ただし、遺族厚生年金は「完全非課税」のため壁の判定には一切影響せず、全額が手取り生活費にプラスされます。残された側ご自身の老齢年金受給額が155万円を超えているかどうかが最大の焦点です。
                </>
              ) : (
                <>
                  単身世帯は年収155万円を超えると特養ホームでの食費・居住費負担限度額（第3段階まで）が受けられなくなり、月額自己負担が平均6〜8万円跳ね上がります。預貯金要件（単身1,000万円以下）と併せて年収管理が極めて重要です。
                </>
              )}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-blue-200/60 text-[11px] text-blue-800 font-medium">
            💡 対策: 残された側の基礎控除枠や非課税収入（遺族年金等）を軸にした資金計画を推奨
          </div>
        </div>

        {/* レポート③: 公的年金と手取り最大化の黄金ルール */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>③ 年金繰下げと自己負担の黄金バランス</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              公的年金は増額させると安心感がありますが、1円でも基準を超えると「合計所得金額」に加算され、医療・介護の自己負担率が1割から2割〜3割へと引き上がるトリガーになります。
              特に配偶者が他界した後は単身155万円基準へ縮小するため、自身の老齢年金を繰り下げて増やしすぎると、かえって自己負担と保険料が跳ね上がる逆転現象を招きます。年金受給開始年齢とリタイア時期のバランス設計が極めて重要です。
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-medium">
            💡 黄金ルール: 「額面年金だけを増やしすぎず、制度の壁を意識した受給時期の選定」
          </div>
        </div>
      </div>
    </div>
  );
};
