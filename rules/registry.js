const {hasAny,countAny,excerpt}=require('../utils/text');
const RULES=[
 {id:'A01',name:'Value Proposition Clarity',cat:'A',severity:4,applies:['home','product','solution'],test:p=>!hasAny(p.text,['increase revenue','reduce cost','save time','automate','platform','infrastructure','solution','helps'])},
 {id:'A02',name:'ICP Clarity',cat:'A',severity:4,applies:['home','product','solution'],test:p=>countAny(p.text,['fintech','bank','payments','merchant','enterprise','developer','startup','CFO','CTO'])<2},
 {id:'A03',name:'Differentiation',cat:'A',severity:3,applies:['home','product','solution'],test:p=>!hasAny(p.text,['unlike','why us','differenti','only','unique','built for','trusted by'])},
 {id:'A04',name:'Use-Case Clarity',cat:'A',severity:3,applies:['product','solution'],test:p=>countAny(p.text,['use case','payments','collections','reconciliation','fraud','issuing','payouts','accounts'])<2},
 {id:'B01',name:'Primary CTA Clarity',cat:'B',severity:5,applies:['home','product','solution'],test:p=>countAny(p.ctas,['book','demo','talk','contact','start','get started','request'])===0},
 {id:'B02',name:'CTA Strength',cat:'B',severity:4,applies:['home','product','solution','contact'],test:p=>p.ctas.length>0 && p.ctas.every(x=>['learn more','read more','click here'].includes(x.toLowerCase()))},
 {id:'B03',name:'Contact Form Friction',cat:'B',severity:4,applies:['contact','demo'],test:p=>p.forms.length>5},
 {id:'B04',name:'Next-Step Clarity',cat:'B',severity:4,applies:['demo','contact','pricing'],test:p=>!hasAny(p.text,['what happens next','next steps','we will contact','schedule','calendar'])},
 {id:'C01',name:'Customer Proof',cat:'C',severity:4,applies:['home','product','solution','customers'],test:p=>!hasAny(p.text,['customer','case study','case studies','success story','trusted by','used by'])},
 {id:'C02',name:'Enterprise Proof',cat:'C',severity:3,applies:['home','product','solution','enterprise'],test:p=>!hasAny(p.text,['enterprise','sla','uptime','security','compliance','soc 2','iso 27001'])},
 {id:'C03',name:'Security / Compliance Visibility',cat:'C',severity:5,applies:['security','product','solution','enterprise'],test:p=>!hasAny(p.text,['soc 2','iso 27001','pci','gdpr','security','compliance','encryption'])},
 {id:'D01',name:'Buyer Mapping',cat:'D',severity:4,applies:['home','product','solution'],test:p=>!hasAny(p.text,['CFO','CTO','CEO','finance team','operations','engineering','compliance','risk team'])},
 {id:'E01',name:'Pricing Transparency',cat:'E',severity:4,applies:['pricing'],test:p=>!hasAny(p.text,['$','pricing','plans','per month','per year','quote','contact sales'])},
 {id:'E02',name:'Pricing / Value Framing',cat:'E',severity:3,applies:['pricing','product'],test:p=>hasAny(p.text,['$','pricing']) && !hasAny(p.text,['save','reduce','roi','return','cost','value'])},
 {id:'F01',name:'Implementation Clarity',cat:'F',severity:4,applies:['product','solution','onboarding'],test:p=>!hasAny(p.text,['integrat','api','implementation','setup','migration','time to value'])},
 {id:'F02',name:'Activation Path',cat:'F',severity:4,applies:['signup','onboarding'],test:p=>!hasAny(p.text,['create account','sign up','onboarding','get started','setup'])},
 {id:'G01',name:'Sales Handoff',cat:'G',severity:3,applies:['demo','contact'],test:p=>!hasAny(p.text,['sales','account executive','solutions engineer','schedule','calendar'])},
 {id:'G02',name:'Commercial Qualification',cat:'G',severity:3,applies:['demo','contact'],test:p=>p.forms.length>0 && !hasAny(p.text,['company','team size','volume','use case','budget','timeline'])},
 {id:'H01',name:'Expansion Signal',cat:'H',severity:2,applies:['product','solution','pricing'],test:p=>!hasAny(p.text,['expand','upsell','additional','more volume','enterprise plan','add-on'])},
 {id:'H02',name:'Retention Signal',cat:'H',severity:3,applies:['home','product','solution'],test:p=>!hasAny(p.text,['renew','retention','retained','long-term','lifetime','churn'])}
];
function runRules(page){
 const out=[]; for(const r of RULES){if(!r.applies.includes(page.type))continue; let failed=false; try{failed=r.test(page)}catch{} if(failed)out.push({rule:r.id,name:r.name,category:r.cat,severity:r.severity,page:page.url,observation:`${r.name} signal was not clearly observable on this page.`,evidence:excerpt(page.text, page.ctas[0]||page.title),confidence:page.text.length>300?'Medium':'Low'});} return out;
}
module.exports={RULES,runRules};
