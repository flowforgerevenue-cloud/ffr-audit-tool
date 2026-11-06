const FIXES={
 A:{title:'Clarify ICP and commercial outcome',what:'State the primary buyer, use case and measurable business outcome in the first commercial section.',where:'Homepage hero and solution pages',why:'Reduces acquisition and buyer-mapping ambiguity.',difficulty:'Low'},
 B:{title:'Strengthen the primary conversion path',what:'Use one explicit CTA tied to a concrete next step and explain what happens after submission.',where:'Homepage, product and demo/contact pages',why:'Reduces decision friction at the point of intent.',difficulty:'Low'},
 C:{title:'Increase proof and trust density',what:'Surface customer proof, security/compliance evidence and implementation credibility close to conversion points.',where:'Homepage, product, pricing and enterprise pages',why:'Addresses risk perception for fintech buyers.',difficulty:'Medium'},
 D:{title:'Map the buying committee',what:'Create messaging blocks for economic, technical, operational and risk stakeholders.',where:'Solution and enterprise pages',why:'Makes the commercial case relevant to the actual decision process.',difficulty:'Medium'},
 E:{title:'Connect pricing to value',what:'Clarify packaging, pricing mechanics and the economic value created by the product.',where:'Pricing page and sales materials',why:'Improves monetization clarity and reduces pricing uncertainty.',difficulty:'Medium'},
 F:{title:'Make implementation concrete',what:'Show integration steps, timeline, requirements and time-to-value expectations.',where:'Product, docs and onboarding',why:'Reduces perceived switching and implementation risk.',difficulty:'Medium'},
 G:{title:'Tighten sales handoff',what:'Define qualification inputs, routing and the buyer’s next step after demo/contact.',where:'Demo/contact workflow',why:'Reduces leakage between marketing intent and sales execution.',difficulty:'Medium'},
 H:{title:'Expose expansion and retention mechanics',what:'Show how customers expand usage, renew and realize ongoing value.',where:'Product, customer and pricing pages',why:'Makes recurring revenue quality more visible.',difficulty:'Medium'}
};
function recommend(leaks){return leaks.slice(0,5).map((l,i)=>({...FIXES[l.id],category:l.category,priority:i===0?'Primary':i<3?'Secondary':'Later',impactScore:l.score}));}
module.exports={recommend};
