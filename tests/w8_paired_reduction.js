'use strict';
const assert=require('assert');
const {endpoint,allocation,predicate}=require('../tools/matching_studies/w8-paired-reduction');
function initial(p=81,c=92){return `(insn 1 0 2 (set (reg/v:SI ${p}) (and:SI (reg:SI 50) (const_int 4095))) -1 (nil) (nil))
(insn 2 1 3 (set (reg/v:SI ${p}) (and:SI (reg:SI 51) (const_int 4095))) -1 (nil) (nil))
(insn 3 2 4 (set (reg/v:SI ${c}) (reg/v:SI ${p})) -1 (nil) (nil))
(insn 4 3 5 (set (reg:SI 95) (ior:SI (reg/v:SI ${p}) (const_int 7))) -1 (nil) (nil))
(insn 5 4 0 (set (reg:SI 96) (ior:SI (reg/v:SI ${c}) (const_int 8))) -1 (nil) (nil))`;}
const source=initial(),lreg='(insn 8 7 9 (set (mem:SI (reg:SI 7)) (ior:SI (reg/v:SI 81) (const_int 7))) 0 (nil) (nil))';
const stderr='HOME path=reload-initial pseudo=81 mode=SI\nSTACK function=func_001F3C00\n(mem:SI (plus:SI (reg:SI 30 $fp) (const_int 60)))\nHOME_RESULT pseudo=81\n';
const left={allocation:allocation(source,lreg,stderr,'\tsw\t$3,60($sp)\n\tlw\t$4,60($sp)\n')},right={allocation:allocation(source,lreg,'','')};
assert(predicate(left,right));assert(!predicate(left,left));assert(!predicate(right,left));
assert.equal(endpoint(initial(110,130)).pseudo,110);assert(!endpoint(source+'\n'+initial(120,140)).unique);
assert(!endpoint(source.replaceAll('reg/v:SI 81','reg/v:HI 81')).unique);
assert(!endpoint(source.replace('(reg/v:SI 92) (reg/v:SI 81)','(reg/v:SI 92) (reg:SI 80)')).unique);
assert(!endpoint(source.replace('(ior:SI (reg/v:SI 92)','(plus:SI (reg/v:SI 92)')).unique);
assert(!predicate({allocation:allocation(source,lreg,stderr,'\tsw\t$3,160($sp)\n\tlw\t$4,160($sp)\n')},right));
assert(!predicate({allocation:allocation(source,'(insn 8 7 9 (use (reg:SI 81)) 0 (nil) (nil))',stderr,'\tsw\t$3,60($sp)\n\tlw\t$4,60($sp)')},right));
assert.throws(()=>allocation(source,lreg,stderr.replace('HOME_RESULT pseudo=81','HOME_RESULT pseudo=82'),''));
assert(!predicate({allocation:allocation(source,'(insn 8 7 9 (set (reg/v:SI 81) (ior:SI (reg:SI 7) (const_int 4))) 0 (nil) (nil))',stderr,'\tsw\t$3,60($sp)\n\tlw\t$4,60($sp)')},right));
console.log('W8 paired reduction predicate: 12 controls PASS');
