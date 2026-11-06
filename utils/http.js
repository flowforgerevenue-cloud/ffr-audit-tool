function origin(req){ return process.env.ALLOWED_ORIGIN || `${req.headers?.['x-forwarded-proto']||'https'}://${req.headers?.host||''}`; }
function cors(res, req){
  const allowed=process.env.ALLOWED_ORIGIN || origin(req);
  const requestOrigin=req.headers?.origin;
  if(requestOrigin && requestOrigin===allowed) res.setHeader('Access-Control-Allow-Origin',requestOrigin);
  else if(!requestOrigin) res.setHeader('Access-Control-Allow-Origin',allowed);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
}
function json(res,status,payload){ return res.status(status).json(payload); }
function bodySize(req){ try{return Buffer.byteLength(JSON.stringify(req.body||{}),'utf8')}catch{return Infinity} }
module.exports={cors,json,bodySize};
