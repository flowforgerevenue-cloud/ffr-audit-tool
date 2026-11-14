function check(report){
 const warnings=[],errors=[];const o=report.opportunity||{},s=report.simulation||{},f=report.financial||{};
 if(o.available){if(!(o.oppHigh>=o.oppLow&&o.oppLow>=0))errors.push('Opportunity bounds are invalid.');if(!o.acv)errors.push('Opportunity was quantified without ACV.');if(!o.qv)errors.push('Opportunity was quantified without qualified traffic.');if(o.annualUnadjusted>0&&Math.abs(o.annualUnadjusted-o.lostDeals*o.acv*12)>Math.max(1,o.annualUnadjusted*.00001))errors.push('Annual opportunity fails reconciliation.');}
 if(!report.currency)warnings.push('Currency not confirmed; financial values must remain unit-labeled, not automatically prefixed with a currency symbol.');
 if(!f.historicalRevenue?.length)warnings.push('No verified dated historical revenue series.');
 if(s.plausibility?.flagged)warnings.push('Opportunity exceeds opening revenue; requires additional scrutiny.');
 if(s.years?.length!==5)errors.push('Five-year projection missing.');
 if(s.years?.length===5){const sums={status_quo:0,conservative:0,base:0,aggressive:0};for(const row of s.years){for(const k of Object.keys(sums)){if(!Number.isFinite(row[k])||row[k]<0)errors.push(`Invalid ${k} year ${row.year}`);sums[k]+=row[k];}}for(const [k,n] of Object.entries(sums)){const field=k+'_5yr';if(Math.abs(n-(s.summary?.[field]??NaN))>1)errors.push(`Five-year ${field} does not reconcile.`);}}
 return {ok:errors.length===0,errors,warnings,standard:'FFR deterministic integrity v3.4'};
}
module.exports={check};
