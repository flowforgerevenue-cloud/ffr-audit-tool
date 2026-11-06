const {crawl}=require('./crawler');
const {extractEvidence}=require('./evidenceEngine');
const {detectLeaks}=require('./leakEngine');
const {scoreLeaks}=require('./scoringEngine');
const {quantify}=require('./quantificationEngine');
const {recommend}=require('./recommendationEngine');
const {buildSimulation}=require('./simulationEngine');
const {normalize}=require('./financialEngine');
const {validateAudit}=require('./validationEngine');
async function runAudit(input){
 const started=Date.now(); const company=String(input.company||'').trim(); const url=String(input.url||'').trim();
 if(!company||!url)throw new Error('Company and website are required');
 const crawlResult=await crawl(url); const evidence=extractEvidence(crawlResult.pages); const leaks=scoreLeaks(detectLeaks(evidence)); const primary=leaks[0];
 const opportunity=primary?quantify({stage:input.stage,acv:input.acv,traffic:input.traffic,closeRate:input.closeRate,monthlyDemos:input.monthlyDemos,leak:primary}):{available:false,reason:'No material deterministic leak signal was detected.'};
 const recommendations=recommend(leaks); const financial=normalize({text:input.financialText||'',declaredRevenue:Number(input.currentRevenue||0)}); const simulation=buildSimulation({currentRevenue:Number(input.currentRevenue||0),opportunity,financial,confidence:primary?.confidence||'Low'});
 const audit={version:'3.1.0',company,url,stage:input.stage,acv:Number(input.acv||0),focus:input.focus||'full funnel',industry:input.industry||'B2B fintech',createdAt:new Date().toISOString(),pages:crawlResult.pages.map(p=>({url:p.url,title:p.title,type:p.type,depth:p.depth,textLength:p.text.length,ctas:p.ctas.slice(0,15),forms:p.forms.length})),crawlErrors:crawlResult.errors,evidence,leaks,recommendations,opportunity,financial,simulation,qa:{sourceCount:crawlResult.pages.length,evidenceCount:evidence.length,primaryLeak:primary?.title||null,durationMs:Date.now()-started},framework:'FlowForge Revenue Quantification Framework v3.1'};
 const qa=validateAudit(audit); audit.qa.validation=qa; if(!qa.ok)throw new Error(`Audit validation failed: ${qa.errors.join(', ')}`);
 return {audit,preview:require('./reportEngine').preview(audit)};
}
module.exports={runAudit};
