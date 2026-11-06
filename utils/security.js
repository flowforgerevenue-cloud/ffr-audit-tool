const crypto = require('crypto');

function secret() {
  const raw = process.env.FFR_TOKEN_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'development-only-change-me');
  if (!raw) throw new Error('FFR_TOKEN_SECRET must be configured before administrator authentication is enabled.');
  return /^[0-9a-f]{64}$/i.test(raw) ? Buffer.from(raw, 'hex') : crypto.createHash('sha256').update(raw).digest();
}
function b64url(buf){ return Buffer.from(buf).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function fromB64url(s){ return Buffer.from(s.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4-s.length%4)%4),'base64'); }
function encrypt(payload){
  const iv=crypto.randomBytes(12); const key=secret();
  const c=crypto.createCipheriv('aes-256-gcm',key,iv);
  const body=Buffer.from(JSON.stringify(payload)); const enc=Buffer.concat([c.update(body),c.final()]);
  return [b64url(iv),b64url(c.getAuthTag()),b64url(enc)].join('.');
}
function decrypt(token){
  const [ivS,tagS,dataS]=String(token||'').split('.'); if(!ivS||!tagS||!dataS) throw new Error('Invalid token');
  const d=crypto.createDecipheriv('aes-256-gcm',secret(),fromB64url(ivS)); d.setAuthTag(fromB64url(tagS));
  return JSON.parse(Buffer.concat([d.update(fromB64url(dataS)),d.final()]).toString('utf8'));
}
function sign(payload){
  const body=b64url(Buffer.from(JSON.stringify(payload))); const mac=crypto.createHmac('sha256',secret()).update(body).digest(); return `${body}.${b64url(mac)}`;
}
function verify(token){
  const [body,mac]=String(token||'').split('.'); if(!body||!mac) throw new Error('Invalid signature');
  const expected=crypto.createHmac('sha256',secret()).update(body).digest(); const got=fromB64url(mac);
  if(got.length!==expected.length || !crypto.timingSafeEqual(got,expected)) throw new Error('Invalid signature');
  const p=JSON.parse(fromB64url(body).toString('utf8')); if(p.exp && Date.now()>p.exp) throw new Error('Token expired'); return p;
}
function hash(value){ return crypto.createHash('sha256').update(String(value)).digest('hex'); }
module.exports={encrypt,decrypt,sign,verify,hash};
