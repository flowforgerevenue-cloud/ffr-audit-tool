const BASE = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function configured(){ return !!(BASE && TOKEN); }
function assertConfigured(){ if(!configured()) throw new Error('Persistent store is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel.'); }

async function command(parts){
  assertConfigured();
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(parts),signal:AbortSignal.timeout(10000)});
  const text=await r.text();
  let d; try{d=JSON.parse(text)}catch{throw new Error(`Persistent store returned invalid JSON (${r.status})`)}
  if(!r.ok || d.error) throw new Error(d.error || `Persistent store error (${r.status})`);
  return d.result;
}
async function get(key){ const v=await command(['GET',key]); if(v==null)return null; try{return JSON.parse(v)}catch{return v;} }
async function set(key,value,ttlSeconds){ const args=['SET',key,typeof value==='string'?value:JSON.stringify(value)]; if(ttlSeconds)args.push('EX',String(ttlSeconds)); await command(args); return true; }
async function del(key){ await command(['DEL',key]); return true; }
async function zadd(key,score,member){ await command(['ZADD',key,String(score),member]); return true; }
async function zrange(key,start,stop,reverse=false){ return await command(['ZRANGE',key,String(start),String(stop),...(reverse?['REV']:[])]); }
async function mget(keys){ if(!keys.length)return []; const values=await command(['MGET',...keys]); return (values||[]).map(v=>{if(v==null)return null;try{return JSON.parse(v)}catch{return v;}}); }
module.exports={configured,get,set,del,zadd,zrange,mget};
