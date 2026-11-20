#!/usr/bin/env node
'use strict';
// Portable provisioning: never runs an installer or changes the matching compiler.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { checkedFile, authenticate, digest } = require('./lib/c_interfaces');
const root = path.resolve(__dirname,'..');
const config = JSON.parse(fs.readFileSync(path.join(root,'config/c-interface-frontend.json')));
function main(args) {
  if (args.length !== 2 || !['--archive','--clang'].includes(args[0])) {
    console.log('Usage: node tools/setup_c_interfaces.js --archive <official LLVM tar.xz> | --clang <exact clang.exe>');
    console.log(`Official package: ${config.archive.url}\nSHA256: ${config.archive.sha256}\nDownload: ${config.archive.bytes} bytes; installed executable: ${config.executable.bytes} bytes.`);
    return;
  }
  const source = path.resolve(args[1]), dest = path.resolve(root,config.executable.path);
  if (args[0] === '--clang') {
    checkedFile(path.dirname(source),path.basename(source),config.executable);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    if (fs.existsSync(dest) && digest(fs.readFileSync(dest)) !== config.executable.sha256) throw new Error('Refusing to overwrite a different frontend');
    fs.copyFileSync(source,dest);
  } else {
    checkedFile(path.dirname(source),path.basename(source),config.archive);
    fs.mkdirSync(path.join(root,'build'),{recursive:true});
    const staging = fs.mkdtempSync(path.join(root,'build/c-interface-provision-'));
    // An exact package identity and one fixed member prohibit archive path traversal.
    const r=cp.spawnSync('tar.exe',['-xf',source,'-C',staging,config.archive.member],{encoding:'utf8',windowsHide:true});
    if(r.status!==0)throw new Error(`Portable tar extraction failed: ${r.stderr || r.error}`);
    const extracted=path.join(staging,config.archive.member);
    checkedFile(path.dirname(extracted),path.basename(extracted),config.executable);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    if (fs.existsSync(dest) && digest(fs.readFileSync(dest)) !== config.executable.sha256) throw new Error('Refusing to overwrite a different frontend');
    fs.copyFileSync(extracted,dest);
    console.log(`Extraction staging retained at ${staging}`);
  }
  authenticate(root,config);
  console.log(`Pinned diagnostic frontend ready: ${config.executable.path}`);
}
try { main(process.argv.slice(2)); } catch(e) { console.error(e.message); process.exitCode=1; }
