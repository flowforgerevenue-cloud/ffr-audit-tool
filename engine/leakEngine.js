const taxonomy=require('../data/taxonomy');
const map=Object.fromEntries(taxonomy.map(x=>[x.id,x]));
function detectLeaks(evidence){
 const groups={};for(const e of evidence){(groups[e.category]??=[]).push(e);}
 return Object.entries(groups).map(([cat,items])=>{
  const observed=items.filter(e=>e.state==='observed'),basis=observed.length?observed:items;
  const top=[...basis].sort((a,b)=>b.severity-a.severity)[0];
  const score=basis.reduce((a,e)=>a+e.severity,0);
  const t=map[cat]||{name:cat};
  return {id:cat,title:`${t.name} - ${top.name}`,category:`${cat}. ${t.name}`,funnel_area:top.page_type,evidence:basis.slice(0,5),supportingHypotheses:items.filter(x=>x.state!=='observed').slice(0,8),evidenceStatus:observed.length?'observed-surface-signal':'unverified-hypothesis',severity:Math.min(1,score/(observed.length?12:35)),recoverability:cat==='H'?.45:cat==='C'?.7:.8,confidence:observed.length?'Medium':'Low'};
 }).sort((a,b)=>(b.evidenceStatus==='observed-surface-signal')-(a.evidenceStatus==='observed-surface-signal')||b.severity-a.severity);
}
module.exports={detectLeaks};
