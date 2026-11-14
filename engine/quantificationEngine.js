'use strict';
const B=require('../data/benchmarks');
const finite=(v)=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v))?Number(v):null;
function quantify({stage,acv,traffic,closeRate,leak={},monthlyDemos,currency,trafficType}){
 const b=B[stage],issues=[],t=finite(traffic),d=finite(monthlyDemos),a=finite(acv),c=finite(closeRate);
 if(!b)issues.push('Select a supported funding stage.');
 if(!['USD','NGN','EUR','GBP'].includes(currency))issues.push('Choose a supported currency for all monetary inputs.');
 if(t!==null&&(t<=0||t>1e9))issues.push('Monthly qualified visitors must be a positive, plausible count.');
 if(d!==null&&(d<=0||d>1e8))issues.push('Monthly demos must be a positive count.');
 if(a===null||a<=0||a>1e10)issues.push('Enter an actual numerical annual contract value; no value is inferred from an ACV range.');
 if(c!==null&&(c<0||c>100))issues.push('Close rate must be between 0% and 100%.');
 if(t!==null&&d!==null&&d>t)issues.push('Monthly demos exceed stated qualified visitors. Reconcile the audience and period.');
 if(trafficType&&trafficType!=='qualified')issues.push('Traffic must represent monthly qualified visitors, not sessions or total site visits.');
 const benchmark=b||B['Series A'];
 const qv=t!==null?t:d!==null?d/benchmark.dcr:null;
 if(qv===null||qv<=0)issues.push('Monthly qualified visitors or monthly demos must be supplied to monetize an opportunity.');
 const sourceEvidence=(leak.evidence||[]).filter(x=>x.url&&x.state==='observed');
 if(!sourceEvidence.length)issues.push('No directly observed, source-linked surface signal exists; absence of a signal is only an unverified hypothesis.');
 const fr=Math.min(.5,Math.max(.01,.06+Math.max(0,Math.min(1,Number(leak.severity)||0))*.18));
 const cr=c===null?benchmark.cr:c/100;
 const provenance={qv:t!==null?'User-entered monthly qualified visitor count':d!==null?'Derived from user-entered demo volume and stage benchmark (not measured visitors)':'Unavailable',acv:a!==null?'User-entered annual contract value (not audited)':'Unavailable',cr:c!==null?'User-entered close rate':'Stage benchmark; illustrative',dcr:'Stage benchmark; illustrative',sqlr:'Stage benchmark; illustrative',fr:'Severity-derived scenario parameter; NOT observed lost or recoverable visitors'};
 const base={available:false,reason:issues[0]||'',issues,fr,dcr:benchmark.dcr,sqlr:benchmark.sqlr,cr,qv,acv:a,currency,provenance,modelStatus:'insufficient-evidence',isIllustrative:true,sourceEvidenceCount:sourceEvidence.length};
 if(issues.length)return base;
 const affected=qv*fr,demos=affected*benchmark.dcr,sqls=demos*benchmark.sqlr,deals=sqls*cr;
 const annual=deals*a*12;
 const oppLow=Math.round(annual*.8),oppHigh=Math.round(annual*1.3);
 return {...base,available:true,reason:'',issues:[],modelStatus:'unverified-sensitivity',affected,lostDemos:demos,lostSQLs:sqls,lostDeals:deals,oppLow,oppHigh,annualUnadjusted:annual};
}
module.exports={quantify};
