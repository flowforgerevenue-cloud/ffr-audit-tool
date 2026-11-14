'use strict';
// A document label is an observation about the uploaded text, NOT verification of accounts.
const AUDIT_MARKERS=[/revenue opportunity report/i,/public funnel diagnostic/i,/illustrative (?:annual )?(?:revenue )?opportunity/i,/external audit/i,/quantification framework/i,/per 100 qualified visitors/i];
const CODE={USD:'USD',NGN:'NGN',EUR:'EUR',GBP:'GBP'};
function amount(str,scale=''){
 const s=String(str||'').trim().replace(/[,$£€₦\s]/g,'');
 if(!/^\d+(?:\.\d+)?$/.test(s))return null;
 let n=Number(s);if(!Number.isFinite(n)||n<=0)return null;
 if(/^(million|m)$/i.test(scale))n*=1e6;
 if(/^(billion|bn)$/i.test(scale))n*=1e9;
 return n>0&&n<=1e13?n:null;
}
function currencyFrom(line){
 const matches=new Set();
 for(const [code,re] of [['NGN',/\bNGN\b|₦/i],['EUR',/\bEUR\b|€/i],['GBP',/\bGBP\b|£/i],['USD',/\bUSD\b/i]])if(re.test(line))matches.add(code);
 return matches.size===1?[...matches][0]:null; // A $ sign alone is not a unique currency code.
}
function parseLines(text){
 const raw=String(text||'').slice(0,100000),lines=raw.split(/\r?\n/).map(s=>s.trim()).filter(Boolean),out={historicalRevenue:[],metrics:{},source:'uploaded user document (not independently audited)',warnings:[],documentType:'unclassified',dataQuality:'low',currencyEvidence:[]};
 if(AUDIT_MARKERS.filter(re=>re.test(raw)).length>=2){out.documentType='external opportunity / audit report';out.warnings.push('This is an opportunity/audit narrative, not dated company financial statements. Its modeled figures were excluded from historical financial data.');return out;}
 const annual=new Map(),conflicts=new Set(),seenCurrency=new Set();
 // CSV data must have an explicit year/period + annual revenue header; unlabeled numbers are never trusted.
 const headers=lines.findIndex(x=>/^(?:year|period|fiscal\s*year)\s*[,;\t]\s*(?:annual\s+)?(?:revenue|total\s+revenue|sales|turnover|ARR)/i.test(x));
 if(headers>=0){
  for(const row of lines.slice(headers+1)){
   const cells=row.split(/[,;\t]/).map(x=>x.trim());
   if(cells.length<2||!/^20\d{2}$/.test(cells[0]))continue;
   const v=amount(cells[1]);if(v===null)continue;
   const year=cells[0];if(Number(year)>new Date().getUTCFullYear()){out.warnings.push(`Future year ${year} was excluded from historical revenue.`);continue;}
   if(annual.has(year)&&annual.get(year).value!==v)conflicts.add(year);
   else annual.set(year,{period:year,value:v,source:'labeled year / annual revenue CSV column',currency:currencyFrom(row)});
  }
 }

 const money='((?:USD|NGN|EUR|GBP)?\\s*[$£€₦]?\\s*[\\d,]+(?:\\.\\d+)?)';
 const patterns=[
  new RegExp('^(?:FY\\s*)?(20\\d{2})\\s*[:|,\\-]?\\s*(?:total\\s+)?(?:annual\\s+)?(?:revenue|sales|turnover|annual recurring revenue|ARR)\\s*[:=,\\-]?\\s*'+money+'\\s*(million|billion|m|bn)?\\s*$','i'),
  new RegExp('^(?:annual\\s+)?(?:revenue|sales|turnover|annual recurring revenue|ARR)\\s*(?:for\\s*)?(?:FY\\s*)?(20\\d{2})\\s*[:=,\\-]?\\s*'+money+'\\s*(million|billion|m|bn)?\\s*$','i')
 ];
 for(const line of lines){
  for(const re of patterns){const match=line.match(re);if(!match)continue;
   const [_,period,rawVal,scale]=match,value=amount(rawVal.replace(/\b(USD|NGN|EUR|GBP)\b/gi,''),scale||'');if(value===null)break;
   if(Number(period)>new Date().getUTCFullYear()){out.warnings.push(`Future year ${period} was excluded from historical revenue.`);break;}
   if(annual.has(period)&&annual.get(period).value!==value){conflicts.add(period);break;}
   const currency=currencyFrom(line);if(currency)seenCurrency.add(currency);
   annual.set(period,{period,value,source:'explicit dated annual-revenue line in uploaded document',currency});break;
  }
 }
 for(const year of conflicts)annual.delete(year);
 if(conflicts.size)out.warnings.push(`Conflicting annual revenue entries for ${[...conflicts].join(', ')} were rejected.`);
 const currencies=[...seenCurrency];out.currencyEvidence=currencies;
 if(currencies.length>1){out.warnings.push('Multiple currencies were detected in annual revenue rows; conversion was not assumed. Historic series excluded.');annual.clear();}
 out.historicalRevenue=[...annual.values()].sort((a,b)=>Number(a.period)-Number(b.period));
 out.latestRevenue=out.historicalRevenue.at(-1)?.value??null;
 out.documentType=out.historicalRevenue.length?'dated annual revenue entries (user-supplied; unaudited)':'unverified narrative / insufficient dated annual revenue';
 if(!out.historicalRevenue.length)out.warnings.push('No unambiguous dated annual revenue series was parsed. Financial figures from unrelated text were not used.');
 for(const line of lines){for(const [key,label] of [['grossProfit','gross profit'],['ebitda','ebitda'],['netIncome','net income']]){
  const re=new RegExp('^'+label+'\\s*[:=,]?\\s*([$£€₦]?\\s*[\\d,]+(?:\\.\\d+)?)\\s*$','i'),m=line.match(re);if(m){const v=amount(m[1]);if(v!==null)out.metrics[key]=v;}
 }}
 if(out.historicalRevenue.length&&!currencies.length)out.warnings.push('Annual revenue rows did not explicitly state a currency. The user-selected monetary unit is assumed until verified.');
 out.dataQuality=out.historicalRevenue.length>=3?'medium':out.historicalRevenue.length>=2?'limited':'low'; // no self-attested file is verified financial data
 return out;
}
function normalize({text,declaredRevenue,currency}){
 const out=parseLines(text),d=Number(declaredRevenue);
 out.declaredRevenue=Number.isFinite(d)&&d>0?d:null;
 out.modelRevenue=out.declaredRevenue||out.latestRevenue||null;
 out.revenueBasis=out.declaredRevenue?'user-declared annual revenue':out.latestRevenue?'document-labeled annual revenue (unaudited)':'not established';
 out.declaredCurrency=CODE[currency]||null;
 if(out.currencyEvidence.length&&out.declaredCurrency&&out.currencyEvidence.some(c=>c!==out.declaredCurrency)){
  out.warnings.push('Uploaded document currency differs from the selected input currency. Historical growth will not be used until amounts are reconciled.');
  out.historicalRevenue=[];out.latestRevenue=null;out.dataQuality='low';
 }
 if(out.declaredRevenue&&out.latestRevenue&&Math.abs(out.declaredRevenue-out.latestRevenue)>Math.max(1,out.declaredRevenue*.05)){out.historyGrowthConflict=true;out.warnings.push('Declared revenue differs from the latest dated document revenue by more than 5%; historic growth is withheld pending reconciliation of periods, units and currency.');}
 return out;
}
module.exports={parseLines,normalize};
