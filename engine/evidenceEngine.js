const {runRules}=require('../rules/registry');
function extractEvidence(pages){return pages.flatMap(p=>runRules(p).map(x=>({...x,page_title:p.title,page_type:p.type,url:p.url})));}
module.exports={extractEvidence};
