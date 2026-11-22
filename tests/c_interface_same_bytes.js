'use strict';
const fs = require('fs'),
  path = require('path'),
  cp = require('child_process'),
  assert = require('assert'),
  m = require('../tools/lib/c_interfaces');
module.exports = function demonstrate(root, scratch) {
  fs.mkdirSync(scratch, {
    recursive: true
  });
  const compiler = JSON.parse(fs.readFileSync(path.join(root, 'config/local-tools.json'))).compiler,
    config = JSON.parse(fs.readFileSync(path.join(root, 'config/phase8/matching-c.json'))).compiler,
    assembler = path.join(root, '.toolchains/gnu-binutils-2.6-mips-kmc-elf-msys2/bin/mips-kmc-elf-as.exe');
  assert.equal(m.digest(fs.readFileSync(compiler)), config.executableSha256);
  assert.equal(m.digest(fs.readFileSync(assembler)),
    '0589F2ADEC34E8BD99F550AF91B1D8868B71904D0D0F8117CA247DF899B8C938');
  const sources = ['unsigned int f(unsigned int); void caller(void){f(1);}',
      'int f(unsigned int); void caller(void){f(1);}'
    ],
    objects = sources.map((source, i) => {
      fs.writeFileSync(path.join(scratch, 'caller.c'), source);
      cp.execFileSync(compiler, [...config.compileFlags, '-o', i + '.s', 'caller.c'], {
        cwd: scratch,
        windowsHide: true,
        stdio: 'pipe'
      });
      cp.execFileSync(assembler, ['-EB', '-mips3', '-32', '-o', i + '.o', i + '.s'], {
        cwd: scratch,
        windowsHide: true,
        stdio: 'pipe'
      });
      return {
        source,
        assembly: m.digest(fs.readFileSync(path.join(scratch, i + '.s'))),
        object: m.digest(fs.readFileSync(path.join(scratch, i + '.o')))
      };
    });
  assert.equal(objects[0].object, objects[1].object);
  assert.equal(objects[0].assembly, objects[1].assembly);
  const result = {
    compiler: config.executableSha256,
    assembler: m.digest(fs.readFileSync(assembler)),
    objects,
    note: 'Whole native object equality, not a full-ROM acceptance claim.'
  };
  fs.writeFileSync(path.join(scratch, 'result.json'), JSON.stringify(result, null, 2));
  return result;
};

if (require.main === module) {
  const root = process.env.OB64_INTERFACE_TEST_ROOT || path.resolve(__dirname, '..');
  console.log(JSON.stringify(module.exports(root, path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path
    .join(root, 'build/c-interface-tests'), 'same-bytes'))));
}
