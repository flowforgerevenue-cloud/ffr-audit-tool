'use strict';
function check(report){
 const warnings=[],errors=[],o=report.opportunity||{},s=report.simulation||{},f=report.financial||{};
 if(!['USD','NGN','EUR','GBP'].includes(report.currency))errors.push('A recognized, explicitly selected monetary currency is required.');
 if(o.available){
  if(!(Number.isFinite(o.oppHigh)&&Number.isFinite(o.oppLow)&&o.oppHigh>=o.oppLow&&o.oppLow>=0))errors.push('Opportunity bounds are invalid.');
  if(!(o.acv>0))errors.push('Opportunity quantified without annual contract value.');
  if(!(o.qv>0))errors.push('Opportunity quantified without qualified visitors.');
  if(!o.sourceEvidenceCount)errors.push('Opportunity monetized without a directly observed website signal.');
  if(!Number.isFinite(o.annualUnadjusted)||Math.abs(o.annualUnadjusted-o.lostDeals*o.acv*12)>Math.max(1,o.annualUnadjusted*.00001))errors.push('Annual opportunity does not reconcile to monthly funnel volumes times twelve.');
 }
 if(!f.historicalRevenue?.length)warnings.push('No document-labeled historical annual revenue series; do not claim verified historical performance.');
 if(s.plausibility?.flagged){warnings.push(s.plausibility.reason||'The opportunity scale or revenue basis is not comparable; upside scenarios must be withheld.');if(s.scenariosDistinct||s.modeledOpportunity>0)errors.push('Unreconciled opportunity must not affect five-year scenarios.');}
 if(s.years?.length!==5)errors.push('Exactly five annual comparison rows are required.');
 if(s.years?.length===5){
  const sums={status_quo:0,conservative:0,base:0,aggressive:0};
  for(const row of s.years){for(const k of Object.keys(sums)){if(!Number.isFinite(row[k])||row[k]<0)errors.push(`Invalid ${k} year ${row.year}`);sums[k]+=row[k];}}
  for(const [k,n] of Object.entries(sums))if(Math.abs(n-(s.summary?.[k+'_5yr']??NaN))>1)errors.push(`Cumulative ${k} projection does not reconcile.`);
 }
 if(f.warnings?.length)warnings.push(...f.warnings);
 return {ok:errors.length===0,errors,warnings,standard:'FFR deterministic integrity v3.4.1'};
}
module.exports={check};
