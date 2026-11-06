const assert=require('assert');
const {buildSimulation}=require('../engine/simulationEngine');
const {quantify}=require('../engine/quantificationEngine');
const {normalize}=require('../engine/financialEngine');
const {runRules}=require('../rules/registry');
(async()=>{
 const q=quantify({stage:'Series A',acv:40000,traffic:1000,closeRate:12,leak:{severity:.6}});assert(q.available&&q.oppHigh>q.oppLow);
 const sim=buildSimulation({currentRevenue:1000000,opportunity:q,confidence:'Medium'});assert.equal(sim.years.length,5);assert(sim.summary.base_5yr>sim.summary.status_quo_5yr);
 const fin=normalize({text:'2024 Revenue $800,000\n2025 Revenue $1,000,000\nGross Profit $400,000\nEBITDA $100,000',declaredRevenue:0});assert.equal(fin.latestRevenue,1000000);assert.equal(fin.metrics.grossProfit,400000);
 const rules=runRules({type:'home',url:'https://example.com',title:'Example',text:'A platform',ctas:[],forms:[]});assert(rules.length>0);
 // API contract smoke test for financial forecast response.
 const simulate=require('./simulate');
 const response={statusCode:0,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.payload=v;return v}};
 await simulate({method:'POST',headers:{host:'localhost'},body:{company:'Test Fintech',stage:'Seed',currentRevenue:1000000,fileContent:Buffer.from('2024 Revenue $800,000\n2025 Revenue $1,000,000').toString('base64'),fileType:'text'}},response);
 assert.equal(response.statusCode,200);assert(response.payload.success);assert.equal(response.payload.full_report.simulation.years.length,5);
 const health=require('./health');
 const healthResponse={statusCode:0,headers:{},setHeader(){},status(n){this.statusCode=n;return this},json(v){this.payload=v;return v}};
 await health({method:'GET',headers:{host:'localhost'}},healthResponse);
 assert.equal(healthResponse.payload.version,'3.1.0');assert.equal(healthResponse.payload.payments,false);
 // Deterministic website-crawl integration test with network and DNS isolated.
 const dns=require('dns').promises; const originalLookup=dns.lookup; const originalFetch=global.fetch;
 dns.lookup=async()=>[{address:'93.184.216.34',family:4}];
 global.fetch=async()=>new Response('<html><head><title>Example Fintech</title></head><body><h1>Business payments for fintech teams</h1><p>We help fintech companies manage payment processing, reconciliation, collections, and enterprise onboarding. Contact sales for a demo. Trusted by leading merchants.</p><a href="/pricing">Pricing</a><a href="/contact">Contact sales</a><form><input name="email"></form></body></html>',{status:200,headers:{'content-type':'text/html'}});
 try {
   const {runAudit}=require('../engine/auditEngine');
   const built=await runAudit({url:'https://example.test',company:'Example Fintech',stage:'Seed',acv:40000,currentRevenue:1000000,traffic:10000});
   console.log('audit smoke',built.audit.pages.length,built.audit.crawlErrors); assert(built.audit && Array.isArray(built.audit.pages) && built.audit.pages.length>=1);
   assert(Array.isArray(built.audit.leaks) && built.audit.simulation.years.length===5);
 } finally { dns.lookup=originalLookup; global.fetch=originalFetch; }
 console.log('FFR tests: engine calculations, website audit integration, forecast API contract and health endpoint passed');
})().catch(e=>{console.error(e);process.exit(1)});
