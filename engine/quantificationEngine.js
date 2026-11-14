const B=require('../data/benchmarks');
const finite=(v)=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v))?Number(v):null;
function quantify({stage,acv,traffic,closeRate,leak={},monthlyDemos,currency,trafficType}){
 const b=B[stage]||B['Series A'];const issues=[];const provenance={};
 const t=finite(traffic),d=finite(monthlyDemos),a=finite(acv),c=finite(closeRate);
 if(t!==null&&(t<0||t>1e10))issues.push('Qualified visitor volume must be nonnegative and within the supported range.');
 if(d!==null&&(d<0||d>1e9))issues.push('Monthly demo volume is outside the supported range.');
 if(a===null||a<=0||a>1e12)issues.push('A positive, explicitly supplied annual contract value is required; no default ACV is invented.');
 if(c!==null&&(c<0||c>100))issues.push('Close rate must be between 0 and 100 percent.');
 if(t!==null&&d!==null&&d>t)issues.push('Monthly demos exceed reported monthly qualified visitors; reconcile the periods and funnel definitions.');
 if(trafficType&&trafficType!=='qualified')issues.push('Traffic must represent qualified visitors, not all sessions or total page views.');
 const qv=t!==null?t:(d!==null?d/b.dcr:null);
 if(qv===null||qv<=0)issues.push('Monthly qualified visitor volume or monthly demo volume is required.');
 if(!leak.evidence?.length)issues.push('No source-linked evidence supports a recoverable friction estimate.');
 const cr=c===null?b.cr:c/100;
 // A severity score is not a measured recoverable fraction. Keep it labeled as a sensitivity assumption.
 const fr=Math.min(.5,Math.max(.01,.06+Math.max(0,Math.min(1,Number(leak.severity)||0))*.18));
 provenance.qv=t!==null?'user-declared monthly qualified visitors':d!==null?'inferred from declared monthly demos and stage benchmark':'unavailable';
 provenance.acv=a!==null?'user-declared annual contract value':'unavailable';
 provenance.cr=c!==null?'user-declared':'stage benchmark';provenance.dcr='stage benchmark (not company-observed)';provenance.sqlr='stage benchmark (not company-observed)';provenance.fr='severity-derived sensitivity assumption; NOT observed recoverable friction';
 const base={available:false,reason:issues[0]||'',issues,fr,dcr:b.dcr,sqlr:b.sqlr,cr,qv,acv:a,currency:currency||null,provenance,modelStatus:'insufficient-inputs',isIllustrative:true};
 if(issues.length)return base;
 const affected=qv*fr,demos=affected*b.dcr,sqls=demos*b.sqlr,deals=sqls*cr;
 // qv is MONTHLY. Convert to annual opportunity exactly once (12 months).
 const annual=deals*a*12;
 const oppLow=Math.round(annual*.8),oppHigh=Math.round(annual*1.3);
 return {...base,available:true,reason:'',modelStatus:'illustrative-sensitivity',affected,lostDemos:demos,lostSQLs:sqls,lostDeals:deals,oppLow,oppHigh,annualUnadjusted:annual,issues:[]};
}
module.exports={quantify};
