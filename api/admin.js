const {cors,json}=require('../utils/http');
const {sign,verify}=require('../utils/security');
const store=require('../utils/store');
function cookie(req,name){const c=req.headers?.cookie||'';return c.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${name}=`))?.split('=')[1]||'';}
function authorized(req){try{return verify(cookie(req,'ffr_admin')).kind==='ffr-admin';}catch{return false;}}
function config(){return {engine:'3.1.0',paymentLayer:'removed',persistenceConfigured:store.configured(),aiDependencies:[]};}
module.exports=async function(req,res){cors(res,req);if(req.method==='OPTIONS')return json(res,200,{ok:true});
 if(req.method==='GET'){if(!authorized(req))return json(res,401,{success:false,error:'Unauthorized'});return json(res,200,{success:true,config:config()});}
 if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});const action=req.body?.action;
 if(action==='login'){if(!process.env.FFR_ADMIN_PASSWORD||req.body.password!==process.env.FFR_ADMIN_PASSWORD)return json(res,401,{success:false,error:'Invalid credentials'});const token=sign({kind:'ffr-admin',exp:Date.now()+1000*60*60*8});res.setHeader('Set-Cookie',`ffr_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`);return json(res,200,{success:true});}
 if(!authorized(req))return json(res,401,{success:false,error:'Unauthorized'});
 if(action==='logout'){res.setHeader('Set-Cookie','ffr_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');return json(res,200,{success:true});}
 if(action==='health')return json(res,200,{success:true,config:config()});return json(res,400,{success:false,error:'Unknown admin action'});
};
