function classifyError(error){
  const message=String(error?.message||error||'').toLowerCase();
  if(message.includes('timeout')||message.includes('aborted')) return 'UPSTREAM_TIMEOUT';
  if(message.includes('private')||message.includes('blocked')) return 'URL_BLOCKED';
  if(message.includes('too large')) return 'PAYLOAD_TOO_LARGE';
  return 'INTERNAL_ERROR';
}
module.exports={classifyError};
