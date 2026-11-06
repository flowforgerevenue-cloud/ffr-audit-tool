const dns = require('dns').promises;
const net = require('net');
function isPrivateIp(ip){
  if(net.isIPv4(ip)){const p=ip.split('.').map(Number); return p[0]===10||p[0]===127||(p[0]===169&&p[1]===254)||(p[0]===172&&p[1]>=16&&p[1]<=31)||(p[0]===192&&p[1]===168)||p[0]===0;}
  if(net.isIPv6(ip)){const x=ip.toLowerCase(); return x==='::1'||x.startsWith('fc')||x.startsWith('fd')||x.startsWith('fe80:')||x==='::';}
  return true;
}
async function assertSafeUrl(raw){
  const u=new URL(raw); if(!['http:','https:'].includes(u.protocol)) throw new Error('Only HTTP(S) URLs are allowed');
  if(u.username||u.password) throw new Error('Credentials in URL are not allowed');
  if(u.port && !['80','443'].includes(u.port)) throw new Error('Non-standard ports are not allowed');
  const host=u.hostname.toLowerCase(); if(host==='localhost'||host.endsWith('.localhost')||host.endsWith('.internal')) throw new Error('Internal host blocked');
  const records=await dns.lookup(host,{all:true}); if(!records.length||records.some(r=>isPrivateIp(r.address))) throw new Error('Private or local destination blocked');
  return u;
}
function sameOrigin(a,b){return new URL(a).origin===new URL(b).origin;}
module.exports={assertSafeUrl,sameOrigin,isPrivateIp};
