function scoreLeak(l,reach=.6){const conf=l.confidence==='High'?1:l.confidence==='Medium'?.75:.35;const evidence=l.evidenceStatus==='observed-surface-signal'?1:.2;const score=reach*l.severity*l.recoverability*conf*evidence;return {...l,reach,severity_score:l.severity,recoverability_score:l.recoverability,confidence_score:conf,score:Number(score.toFixed(4))};}
function scoreLeaks(leaks){return leaks.map(l=>scoreLeak(l,l.evidenceStatus==='observed-surface-signal'?.8:.35)).sort((a,b)=>b.score-a.score).map((x,i)=>({...x,rank:i+1}));}
module.exports={scoreLeak,scoreLeaks};
