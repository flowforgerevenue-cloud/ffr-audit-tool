const B=require('../data/benchmarks');
function num(v){const n=Number(v);return Number.isFinite(n)&&n>=0?n:0;}
function quantify({stage,acv,traffic,closeRate,leak,monthlyDemos}){
 const b=B[stage]||B['Series A']; const qv=traffic?num(traffic):monthlyDemos?num(monthlyDemos)/b.dcr:0; const cr=closeRate?num(closeRate)/100:b.cr; const fr=Math.min(.5,Math.max(.01,.06+leak.severity*.18));
 const provenance={qv:traffic?'user-provided':monthlyDemos?'derived from user demo volume and benchmark DCR':'not available — no traffic data supplied',cr:closeRate?'user-provided':`${stage} benchmark`,dcr:`${stage} benchmark`,sqlr:`${stage} benchmark`,fr:'FFR deterministic friction estimate derived from evidence severity; not observed conversion loss'};
 if(!qv) return {available:false,reason:'Qualified traffic or monthly demo volume is required to quantify a dollar opportunity without inventing traffic.',fr,dcr:b.dcr,sqlr:b.sqlr,cr,provenance};
 const affected=qv*fr, demos=affected*b.dcr, sqls=demos*b.sqlr, deals=sqls*cr, acvN=num(acv)||15000; const low=deals*acvN*.8*12, high=deals*acvN*1.3*12;
 return {available:true,qv,fr,dcr:b.dcr,sqlr:b.sqlr,cr,affected,lostDemos:demos,lostSQLs:sqls,lostDeals:deals,oppLow:Math.round(low),oppHigh:Math.round(high),provenance};
}
module.exports={quantify};
