'use strict';
const scenarios=require('../data/scenarios');
const finitePositive=n=>Number.isFinite(Number(n))&&Number(n)>0?Number(n):0;
function baselineGrowth(financial){
  if(financial?.historyGrowthConflict) return {rate:0,observed:false,source:'Flat 0% comparison because declared and document revenue disagree by more than 5%; reconcile inputs before trend modeling'};
  const h=(financial?.historicalRevenue||[]).filter(x=>Number.isFinite(x.value)&&x.value>0&&/^20\d{2}$/.test(String(x.period)));
  if(h.length>=2){
    const a=h.at(-2),b=h.at(-1),span=Number(b.period)-Number(a.period);
    if(span>0&&span<=5){
      const observed=Math.pow(b.value/a.value,1/span)-1;
      if(Number.isFinite(observed)){
        const capped=Math.max(-.1,Math.min(.35,observed));
        return {rate:capped,observed:true,rawRate:observed, capped:capped!==observed,source:`Annualized change in labeled FY${a.period}–FY${b.period} revenue${capped!==observed?' (limited to -10% to +35% sensitivity range)':''}`};
      }
    }
  }
  return {rate:0,observed:false,source:'Flat 0% comparison baseline because no usable multi-year history was supplied; not an observed growth rate'};
}
function buildSimulation({currentRevenue,opportunity,financial,confidence='Medium',revenueBasis='recognized'}){
  const start=finitePositive(currentRevenue)||finitePositive(financial?.modelRevenue)||finitePositive(financial?.latestRevenue);
  const growth=baselineGrowth(financial);
  const candidate=opportunity?.available?(Number(opportunity.oppLow)+Number(opportunity.oppHigh))/2:0;
  const validCandidate=Number.isFinite(candidate)&&candidate>0?candidate:0;
  const ratio=start>0?validCandidate/start:null;
  const basisMismatch=validCandidate>0&&revenueBasis!=='annualized-run-rate';
  const blocked=validCandidate>0&&(start===0||ratio>1||basisMismatch);
  // Do not model recoveries whose scale cannot be reconciled with the declared annual revenue.
  const opp=blocked?0:validCandidate;
  const conf=confidence==='High'?1:confidence==='Medium'?.75:.5;
  const adj=.75+conf*.25;
  const keys=['status_quo','conservative','base','full_upside'],vals=Object.fromEntries(keys.map(k=>[k,start]));
  const sums={status_quo_5yr:0,conservative_5yr:0,base_5yr:0,aggressive_5yr:0},years=[];
  for(let year=1;year<=5;year++){
    const row={year,label:`Year ${year}`};
    for(const k of keys){
      const s=scenarios[k],ramp=Math.min(1,year*12/s.rampMonths);
      const increment=opp*s.realization*s.effectiveness*adj*ramp/5;
      const calculated=vals[k]*(1+growth.rate)+increment;
      vals[k]=Math.round(Math.max(0,calculated));
      const key=k==='full_upside'?'aggressive':k;
      row[key]=vals[k];sums[`${key}_5yr`]+=vals[k];
    }
    years.push(row);
  }
  const delta=sums.base_5yr-sums.status_quo_5yr;
  const warnings=[];
  if(!growth.observed)warnings.push('No sufficient dated historical series: a flat comparison baseline was used, not an assumed growth forecast.');
  if(growth.capped)warnings.push('The observed historical change exceeded the model sensitivity range; its capped rate is disclosed.');
  if(blocked)warnings.push(basisMismatch?'Financial hold: annual contract-value run rate cannot be added to recognized annual revenue. Select a comparable annualized recurring run-rate basis only when it is accurate.':'Financial hold: the illustrative annual opportunity is greater than the stated annual run-rate or the opening amount is missing. Recovery trajectories are withheld until inputs are reconciled.');
  if(!opp)warnings.push('Recovery scenarios coincide with the comparison baseline because no supportable modeled recovery is available.');
  const decisionAnalysis={cfo:{focus:'Financial return and cash risk',considerations:[`Comparison baseline: ${(growth.rate*100).toFixed(1)}% (${growth.source}).`,blocked?'Recovery trajectories withheld pending reconciliation.':'Revenue uplift is not profit; confirm margin and implementation costs.']},growth:{focus:'Repeatability and scalability',considerations:[`Five-year incremental modeled base versus baseline: ${delta.toLocaleString('en-US')}.`,'Realization parameters are sensitivity assumptions, not observed conversion performance.']},buyer:{focus:'Buyer procurement friction',considerations:['Verify changes in qualified buyer progression, not merely click rates.']}};
  return {startRevenue:start,baselineGrowth:growth.rate,modeledOpportunity:opp,rawModeledOpportunity:validCandidate,opportunityRange:opportunity?.available?[opportunity.oppLow,opportunity.oppHigh]:null,confidence,scenariosDistinct:opp>0,projectionStatus:blocked?(basisMismatch?'withheld-basis':'withheld-plausibility'):opp>0?'conditional-sensitivity':'baseline-only',years,summary:{...sums,incrementalBaseVsStatusQuo:delta},assumptions:{baseGrowthSource:growth.source,baselineObserved:growth.observed,revenueBasis,recognition:'ACV multiplied by 12 months of acquisition volume is annualized contract-value run-rate, not recognized accounting revenue. Scenario additions carry forward recurring run-rate increments and exclude churn, costs and accounting timing.',realization:'FFR sensitivity factors are stated modeling assumptions, not observed probabilities.',doubleCounting:'Only the primary opportunity is used. Secondary hypotheses are not added.',scenarioParameters:scenarios},warnings,plausibility:{annualOpportunityToOpeningRevenue:ratio,flagged:blocked,basisMismatch,reason:blocked?(basisMismatch?'Revenue basis mismatch: annualized new ACV is not directly comparable with recognized annual revenue':'Unreconciled annualized opportunity size compared with current recurring run-rate'):null},decisionAnalysis,key_insight:blocked?(basisMismatch?'HOLD: annualized contract-value sensitivity cannot be merged into a recognized-revenue forecast. Upside trajectories have been withheld.':'HOLD: the opportunity estimate is disproportionate to stated recurring run-rate. Upside trajectories have been withheld pending reconciliation.'):opp>0?'The differences between trajectories are conditional recovery sensitivities, not predictions.':'Only a flat or historically grounded comparison baseline is shown; an incremental recovery cannot be established from available evidence.'};
}
module.exports={buildSimulation,baselineGrowth};
