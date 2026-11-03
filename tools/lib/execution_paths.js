'use strict';
// Physical code placement, never environment or selected data, chooses execution mode.
const path=require('path');
const CODE_ROOT=path.resolve(__dirname,'../..');
const parent=path.dirname(CODE_ROOT);
const bundled=path.basename(parent)==='matching-tools' && path.basename(path.dirname(parent))==='build';
const ROOT=bundled?path.resolve(parent,'../..'):CODE_ROOT;
const codePath=(logical)=>path.resolve(CODE_ROOT,logical);
function logicalCode(file) {
  const relative=path.relative(CODE_ROOT,path.resolve(file)).replace(/\\/g,'/');
  if(!relative.startsWith('tools/')||relative.includes('../'))throw Error('implementation outside code root');
  return relative;
}
function bundle() { return bundled?require('./matching/tool_bundle_runtime').current():null; }
function assertCanonical() { if(bundled)throw Error('bundled private tools cannot construct or certify canonical output'); }
module.exports={ROOT,CODE_ROOT,bundled,codePath,logicalCode,bundle,assertCanonical};
