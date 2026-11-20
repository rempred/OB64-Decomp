'use strict';
// Versioned companion binding shared by canonical, capture, and historical readers.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const valueHash=v=>hash(JSON.stringify(v));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=m=>{const e=Error('C interface companion: '+m);e.code='OB64_SELECTED_INPUT';throw e;};
const FIELDS=['cInterfaceContract','cInterfaceReport','cInterfaceReportSha256','cInterfaceReportRawSha256','cInterfaceReportBytes','cInterfaceFrontend'];
function binding(state) { const result={};for(const name of FIELDS)if(Object.hasOwn(state,name))result[name]=state[name];return result; }
function reportPath(state) {if(typeof state.output!=='string'||!path.isAbsolute(state.output))fail('invalid accepted output');return path.join(path.dirname(state.output),'c-interface-report.json');}
function regularRead(file) {
  const absolute=path.resolve(file);
  for(let p=absolute;;p=path.dirname(p)){const s=fs.lstatSync(p);if(s.isSymbolicLink())fail('redirected companion input');if(p===absolute&&(!s.isFile()||s.nlink!==1))fail('nonregular companion input');if(p===path.dirname(p))break;}
  if(fs.realpathSync.native(absolute).toLowerCase()!==absolute.toLowerCase())fail('aliased companion input');return fs.readFileSync(absolute);
}
function create(state,report,frontendBytes) {
  const bytes=Buffer.from(JSON.stringify(report,null,2)+'\n');
  return {cInterfaceContract:1,cInterfaceReport:reportPath(state),cInterfaceReportSha256:valueHash(report),cInterfaceReportRawSha256:hash(bytes),cInterfaceReportBytes:bytes.length,
    cInterfaceFrontend:{path:'config/c-interface-frontend.json',bytes:frontendBytes.length,sha256:hash(frontendBytes)}};
}
function validate({root,state,fresh,accepted,read=regularRead,trustedFrontend,selectedInputs}) {
  const stateBinding=binding(state),selectedBinding=accepted?binding(accepted):null;
  const marked=Object.keys(stateBinding).length || fresh?.cInterfaceEvidence!==undefined || selectedBinding&&Object.keys(selectedBinding).length;
  if(!marked)return {version:0,report:null}; // Original historical contract, never relabeled.
  if(state.cInterfaceContract!==1 || !same(Object.keys(stateBinding),FIELDS) || !fresh || !same(fresh.cInterfaceEvidence,stateBinding))fail('state/fresh contract binding');
  if(accepted&&!same(selectedBinding,stateBinding))fail('selected manifest binding');
  if(typeof state.cInterfaceReport!=='string'||!path.isAbsolute(state.cInterfaceReport)||path.resolve(state.cInterfaceReport).toLowerCase()!==reportPath(state).toLowerCase())fail('escaped or foreign companion path');
  if(!Number.isSafeInteger(state.cInterfaceReportBytes)||state.cInterfaceReportBytes<1||!['cInterfaceReportSha256','cInterfaceReportRawSha256'].every(k=>/^[A-F0-9]{64}$/.test(state[k])))fail('malformed report identity');
  const bytes=read(state.cInterfaceReport);
  if(bytes.length!==state.cInterfaceReportBytes||hash(bytes)!==state.cInterfaceReportRawSha256)fail('raw companion identity');
  const report=JSON.parse(bytes);
  if(valueHash(report)!==state.cInterfaceReportSha256||report.schemaVersion!==1||report.verdict?.pass!==true)fail('companion value/verdict');
  if(!same(report.acceptanceBinding,{inputFingerprint:state.fingerprint,baselineFingerprint:state.baselineFingerprint,buildReport:state.buildReport}))fail('foreign acceptance binding');
  const front=state.cInterfaceFrontend;
  if(!front||front.path!=='config/c-interface-frontend.json'||!Number.isSafeInteger(front.bytes)||front.bytes<1||!/^[A-F0-9]{64}$/.test(front.sha256))fail('malformed frontend binding');
  const configBytes=read(path.join(root,front.path));
  if(configBytes.length!==front.bytes||hash(configBytes)!==front.sha256)fail('frontend configuration identity');
  const config=JSON.parse(configBytes);
  if(report.frontend!==valueHash(config))fail('report frontend identity');
  if(trustedFrontend) {
    const pins=c=>({version:c.version,flags:c.flags,executable:c.executable});
    if(!same(pins(config),pins(typeof trustedFrontend==='function'?trustedFrontend():trustedFrontend)))fail('selected frontend differs from installed shared pin');
  }
  require('./c_interfaces').authenticate(root,config,selectedInputs || {read,resolve:file=>file});
  return {version:1,report,frontend:config,rawIdentity:{bytes:bytes.length,sha256:hash(bytes)}};
}
module.exports={FIELDS,binding,reportPath,regularRead,create,validate,valueHash};
