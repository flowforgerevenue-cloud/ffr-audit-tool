const taxonomy=require('../data/taxonomy');
const map=Object.fromEntries(taxonomy.map(x=>[x.id,x]));
function detectLeaks(evidence){
 const groups={}; for(const e of evidence){(groups[e.category]??=[]).push(e)}
 return Object.entries(groups).map(([cat,items])=>{const max=items.reduce((s,x)=>s+x.severity,0); const top=items.slice().sort((a,b)=>b.severity-a.severity)[0]; const t=map[cat]; return {id:cat,title:`${t.name} — ${top.name}`,category:`${cat}. ${t.name}`,funnel_area:top.page_type,evidence:items.slice(0,5),severity:Math.min(1,max/12),recoverability:cat==='H'?.45:cat==='C'?.7:.8,confidence:items.some(x=>x.confidence==='Medium')?'Medium':'Low'};}).sort((a,b)=>b.severity-a.severity);
}
module.exports={detectLeaks};
