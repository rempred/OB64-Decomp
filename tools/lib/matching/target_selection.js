'use strict';
// A public description, never a target/context or a grant of native eligibility.
function describe(rows,bodies,symbol,{checkEntryOffset}) {
  const {pairs,claims}=require('./target_model').compositeFunctionRows({rows},{checkEntryOffset});
  const names=new Set(),members=new Set();
  for(const pair of pairs) {
    if(names.has(pair.symbol)||members.has(pair.head)||members.has(pair.tail))return {kind:'conflict',reason:'ambiguous continuation composition'};
    names.add(pair.symbol);members.add(pair.head);members.add(pair.tail);
    if([pair.head.part.name,pair.tail.part.name].some(n=>n.toLowerCase()===symbol.toLowerCase()))return {kind:'partial',reason:'partial continuation selection'};
  }
  const pair=pairs.find(p=>p.symbol.toLowerCase()===symbol.toLowerCase());
  if(pair) {
    if(pair.symbol!==symbol)return {kind:'alias',canonicalSymbol:pair.symbol,reason:'exact continuation spelling required'};
    if(rows.some(r=>r.part?.name.toLowerCase()===symbol.toLowerCase())||bodies.some(b=>[b.symbol,...b.aliases].some(n=>n.toLowerCase()===symbol.toLowerCase())))return {kind:'conflict',reason:'continuation symbol conflict'};
    return projection('continuation',symbol,[pair.head,pair.tail]);
  }
  if(claims.some(c=>[c.symbol,c.row.part.name].some(n=>n.toLowerCase()===symbol.toLowerCase())))return {kind:'partial',reason:'incomplete continuation selection'};
  const aliases=bodies.filter(b=>[b.symbol,...b.aliases].some(n=>n.toLowerCase()===symbol.toLowerCase()));
  const candidates=rows.filter(r=>r.part?.name.toLowerCase()===symbol.toLowerCase()||aliases.some(b=>b.romStart>=r.romStart&&b.romStart<r.romEndExclusive));
  if(candidates.length!==1)return {kind:'unsupported',reason:'target original owner missing/ambiguous'};
  const row=candidates[0];
  return {...projection('owner',row.part.name,[row]),requestKind:symbol===row.part.name?'canonical':'alias',requestedSymbol:symbol};
}
function projection(kind,symbol,rows) {
  return {descriptionOnly:true,kind,canonicalSymbol:symbol,primaryRowIndex:rows[0].index,romStart:rows[0].romStart,romEndExclusive:rows[rows.length-1].romEndExclusive,
    owners:rows.map(r=>({rowIndex:r.index,symbol:r.part.name,romStart:r.romStart,romEndExclusive:r.romEndExclusive,original:r.part.file,sha256:r.part.sha256}))};
}
module.exports={describe};
