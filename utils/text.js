function clean(s=''){return String(s).replace(/\s+/g,' ').trim();}
function words(s=''){return clean(s).toLowerCase();}
function hasAny(s, arr){const t=words(s); return arr.some(x=>t.includes(x.toLowerCase()));}
function countAny(s, arr){const t=words(s); return arr.reduce((n,x)=>n+(t.includes(x.toLowerCase())?1:0),0);}
function excerpt(s, needle){const t=clean(s); const i=t.toLowerCase().indexOf(String(needle).toLowerCase()); return i<0?t.slice(0,220):t.slice(Math.max(0,i-100),Math.min(t.length,i+needle.length+160));}
module.exports={clean,words,hasAny,countAny,excerpt};
