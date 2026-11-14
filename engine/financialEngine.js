// Conservative financial extraction: do not interpret arbitrary narrative numbers as financial data.
function amount(raw){const s=String(raw||'').replace(/[$,£€₦\s]/g,'').replace(/,/g,'');const n=Number(s);return Number.isFinite(n)&&n>=0?n:null;}
function parseLines(text){
 const input=String(text||'');const lines=input.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 const out={historicalRevenue:[],metrics:{},source:'uploaded document',warnings:[],documentType:'unclassified',dataQuality:'low'};
 const auditIndicators=[/revenue opportunity report/i,/public funnel diagnostic/i,/illustrative (?:annual )?(?:revenue )?opportunity/i,/external audit/i,/quantification framework/i,/per 100 qualified visitors/i];
 const auditScore=auditIndicators.filter(re=>re.test(input)).length;
 if(auditScore>=2){out.documentType='external opportunity / audit report';out.warnings.push('Uploaded file is an external opportunity/audit report, not verified financial statements. Figures in the report must not be treated as company revenue or historical results.');return out;}
 const entries=new Map();
 for(const line of lines){
  // Only explicitly dated revenue entries; never parse an unlabelled year as revenue.
  const a=line.match(/^(?:FY\s*)?(20\d{2})\s*(?:[:|\-]\s*)?(?:total\s+)?(?:annual\s+)?(?:revenue|sales|turnover|ARR)\s*[:=\-]?\s*([$£€₦]?\s*[\d,]+(?:\.\d+)?)(?:\s*(million|billion|m|bn))?\s*$/i);
  const b=line.match(/^(?:annual\s+)?(?:revenue|sales|turnover|ARR)\s*(?:for\s*)?(?:FY\s*)?(20\d{2})\s*[:=\-]?\s*([$£€₦]?\s*[\d,]+(?:\.\d+)?)(?:\s*(million|billion|m|bn))?\s*$/i);
  const m=a||b;
  if(m){let n=amount(m[2]);if(n===null)continue;const scale=(m[3]||'').toLowerCase();if(['million','m'].includes(scale))n*=1e6;if(['billion','bn'].includes(scale))n*=1e9;entries.set(m[1],n);}
 }
 out.historicalRevenue=[...entries].sort((a,b)=>a[0].localeCompare(b[0])).map(([period,value])=>({period,value,source:'explicitly labeled annual revenue'}));
 out.latestRevenue=out.historicalRevenue.length?out.historicalRevenue[out.historicalRevenue.length-1].value:null;
 out.documentType=out.historicalRevenue.length?'financial data with labeled annual revenue':'unverified narrative / insufficient financial data';
 if(!out.historicalRevenue.length)out.warnings.push('No explicitly dated annual revenue series was extracted. Narrative numbers were excluded to prevent false financial metrics.');
 for(const line of lines){for(const [key,label] of [['grossProfit','gross profit'],['ebitda','ebitda'],['netIncome','net income']]){const re=new RegExp('^'+label+'\\s*[:=]?\\s*([$£€₦]?\\s*[\\d,]+(?:\\.\\d+)?)\\s*$','i');const m=line.match(re);if(m){const v=amount(m[1]);if(v!==null)out.metrics[key]=v;}}}
 out.dataQuality=out.historicalRevenue.length>=3?'high':out.historicalRevenue.length>=2?'medium':'low';
 return out;
}
function normalize({text,declaredRevenue}){const out=parseLines(text);const d=Number(declaredRevenue);out.declaredRevenue=Number.isFinite(d)&&d>0?d:null;out.modelRevenue=out.declaredRevenue||out.latestRevenue||null;out.revenueBasis=out.declaredRevenue?'user-declared annual revenue':out.latestRevenue?'explicit document annual revenue':'not established';if(out.declaredRevenue&&out.latestRevenue&&Math.abs(out.declaredRevenue-out.latestRevenue)>Math.max(1,out.declaredRevenue*.05))out.warnings.push('Declared revenue differs from the latest labeled historical revenue by more than 5%; confirm reporting periods and currency.');return out;}
module.exports={parseLines,normalize};
