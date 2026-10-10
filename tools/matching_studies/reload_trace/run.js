'use strict';
const c = require('./common'), { fs, path, ROOT, hash, identity, same, fresh, write, environment } = c;
const policy = require('../../lib/source_policy'), p7 = require('../../lib/phase7_conventional'), p8 = require('../../lib/phase8_matching_c');
const { assertToolchainAvailable, loadToolchainConfig } = require('../../lib/real_mips_toolchain');
const { parse } = require('./parse');
const FOCUSED = [
  { id: 'accepted-c78c', symbol: 'func_0022C78C', source: 'src/battle/func_0022C78C.c', accepted: true },
  { id: 'd14c-best', symbol: 'func_0022D14C', source: 'build/matching/combat-w6-fresh-261010/d14c-best.c', sha256: '718B3615611E145AB2E8D820AF9E37CCB949F94E427588D93146E3DAB732E098', expanded: 'A483DFC548F371B421A0BFC61600A2256079AEEA5F6F211806ACFBFC024A17F3', expectedBytes: 6844, native: 'CEBDD465931AE9ACD48526DFF1110CCCF1DD7F40A8BF491E510F599036A2B575' },
  { id: 'd14c-1720', symbol: 'func_0022D14C', source: 'docs/archive/matching-c-candidates/2026-10-09-func_0022D14C-172014c126.c', sha256: 'D7A59B0BFDF0D236F9799C7737914F585BDBF3E47A56537DD7144CDD20BB952E', expanded: 'B0C2D7DB0444C84FD2B41DF7F2A89EA4EE69151E15F86878BD1F41CAE0F7C756', expectedBytes: 6852 },
  { id: 'd14c-da2a', symbol: 'func_0022D14C', source: 'build/matching/combat-w6-fresh-261010/d14c-mode3-argument-loop.c', sha256: '99B4E0BD8E07B1862F0E307284E1F422F49E6D5AAB9110CBF07AA3F6CC415F14', expanded: '0A6D0E372148E2BB4644D864943848C007FF00F31F8E523844908824EE7C47C5', expectedBytes: 6844, native: 'CEBDD465931AE9ACD48526DFF1110CCCF1DD7F40A8BF491E510F599036A2B575' },
  { id: 'd14c-b30d', symbol: 'func_0022D14C', source: 'build/matching/combat-w6-fresh-261010/d14c-mode3-call-address-phase.c', sha256: 'F8CC946E3FA5E442D3B18DF23DFA03D10CED9C52903A3BA5EF01508DEBF57E56', expanded: '377729DD49590144E8BB0C0636349F865256D976340340BF2EC96882D524D49A', expectedBytes: 6844, native: 'CEBDD465931AE9ACD48526DFF1110CCCF1DD7F40A8BF491E510F599036A2B575' },
];
function authenticateManifest(file) {
  return require('./provenance').authenticateManifest(file);
}
function nativeCensus(file) {
  const elf = p7.parseElfFile(file);
  return { header: elf.header, sections: elf.sections.map(s => ({ index: s.index, name: s.name, type: s.type, flags: s.flags, address: s.address, alignment: s.alignment, size: s.size, link: s.link, info: s.info,
    // Actual serialized bytes preserve relocation order and in-place addends.
    sha256: s.type === 8 ? null : hash(p7.elfSectionBytes(elf, s)) })), symbols: elf.symbols };
}
function compileOne({ directory, compiler, input, flags, settings, tools }) {
  c.contained(directory); fs.mkdirSync(directory); write(path.join(directory, 'input.c'), input);
  const started = process.hrtime.bigint();
  const result = c.cp.spawnSync(compiler, [...flags, '-o', 'output.s', 'input.c'], { cwd: directory, env: environment(settings), encoding: 'utf8', windowsHide: true, timeout: 20000, maxBuffer: 128 * 1024 * 1024 });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  write(path.join(directory, 'stdout.txt'), result.stdout || ''); write(path.join(directory, 'stderr.txt'), result.stderr || '');
  const execution = { compiler: identity(compiler), flags, settings, input: identity(path.join(directory, 'input.c')), elapsedMs, exit: result.status, signal: result.signal, error: result.error?.message || null };
  write(path.join(directory, 'execution.json'), execution);
  if (result.error || result.status !== 0) throw Error('compiler failed; not parity: ' + directory);
  const assembly = fs.readFileSync(path.join(directory, 'output.s'));
  write(path.join(directory, 'assigned.s'), p8.adjustSectionAssembly(assembly, '.ob64.r0001', { allowAuxiliaryReadOnlySections: true }));
  const assembler = c.cp.spawnSync(tools.assemblerAbs, [...tools.compilerAssemblerFlags, '-o', 'native.o', 'assigned.s'], { cwd: directory, env: environment(), encoding: 'utf8', windowsHide: true });
  write(path.join(directory, 'assembler.txt'), (assembler.stdout || '') + (assembler.stderr || ''));
  if (assembler.error || assembler.status !== 0) throw Error('native assembly failed: ' + directory);
  const trace = settings.OB64_RELOAD_TRACE === '1' ? parse(result.stderr, settings.OB64_RELOAD_FUNCTION) : null;
  if (trace) write(path.join(directory, 'events.json'), trace);
  return { execution, directory, assembly, object: fs.readFileSync(path.join(directory, 'native.o')), census: nativeCensus(path.join(directory, 'native.o')), trace };
}
function parity(base, observed) {
  same(observed.assembly.equals(base.assembly), true, 'compiler assembly parity');
  same(observed.object.equals(base.object), true, 'actual ELF object/ordered REL/addend parity');
  same(JSON.stringify(observed.census), JSON.stringify(base.census), 'native census parity');
  return { assembly: hash(base.assembly), object: hash(base.object), completeCensus: hash(JSON.stringify(base.census)), exact: true };
}
function focused(manifestFile, definitions = FOCUSED) {
  const manifest = authenticateManifest(manifestFile), dir = fresh('focused'), tools = assertToolchainAvailable(loadToolchainConfig());
  const configFile = path.join(ROOT, 'config/phase8/matching-c.json'), config = JSON.parse(fs.readFileSync(configFile));
  const compiler = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/local-tools.json'))).compiler;
  same(identity(compiler).sha256, config.compiler.executableSha256, 'canonical compiler contract');
  same(identity(compiler).sha256, c.COMPILER, 'pinned compiler identity');
  const report = { schemaVersion: 1, researchOnly: true, acceptanceEligible: false, started: new Date().toISOString(), root: dir, buildManifest: identity(manifestFile), flags: config.compiler.compileFlags, config: identity(configFile),
    implementation: [__filename, require.resolve('./common'), require.resolve('./parse'), require.resolve('./provenance'), require.resolve('../../lib/source_policy'), require.resolve('../../lib/phase8_matching_c'), require.resolve('../../lib/phase7_conventional')].map(identity),
    tools: { assembler: identity(tools.assemblerAbs), flags: tools.compilerAssemblerFlags }, cases: [] };
  try {
    for (const definition of definitions) {
      if (!/^[A-Za-z_][A-Za-z_0-9]*$/.test(definition.symbol) || !/^[a-z0-9-]+$/.test(definition.id)) throw Error('candidate symbol/id');
      const source = path.resolve(ROOT, definition.source), sourceId = identity(source);
      if (definition.sha256) same(sourceId.sha256, definition.sha256, 'focused source');
      const classification = policy.classifySource(source);
      same(classification.class, 'PURE_C', 'focused source classification'); policy.verifyClassificationInputs(classification);
      const input = policy.compilationInputBytes(classification);
      if (definition.expanded) same(hash(input), definition.expanded, 'focused expanded bytes');
      const caseDir = path.join(dir, definition.id); fs.mkdirSync(caseDir); write(path.join(caseDir, 'authored.c'), fs.readFileSync(source));
      write(path.join(caseDir, 'classification.json'), classification);
      const args = { input, flags: report.flags, tools };
      const base = compileOne({ ...args, directory: path.join(caseDir, 'pinned'), compiler, settings: {} });
      const off = compileOne({ ...args, directory: path.join(caseDir, 'off'), compiler: manifest.compiler.path, settings: {} });
      const on = compileOne({ ...args, directory: path.join(caseDir, 'on'), compiler: manifest.compiler.path, settings: { OB64_RELOAD_TRACE: '1', OB64_RELOAD_FUNCTION: definition.symbol } });
      const offParity = parity(base, off), onParity = parity(base, on);
      policy.verifyClassificationInputs(classification); same(identity(source).sha256, sourceId.sha256, 'candidate source changed');
      const elf = p7.parseElfFile(path.join(base.directory, 'native.o')), text = elf.sections.find(s => s.name === '.ob64.r0001'), ro = elf.sections.find(s => s.name === '.rodata');
      const bytes = p7.elfSectionBytes(elf, text), textHash = hash(bytes);
      if (definition.expectedBytes) same(bytes.length, definition.expectedBytes, 'focused text extent');
      if (definition.native) same(textHash, definition.native, 'focused baseline native output');
      policy.verifyClassificationInputs(classification); same(identity(source).sha256, sourceId.sha256, 'source changed during run');
      const record = { ...definition, sourceIdentity: sourceId, expandedSha256: hash(input), classification: identity(path.join(caseDir, 'classification.json')), offParity, onParity,
        native: { bytes: bytes.length, textSha256: textHash, rodata: ro && { bytes: ro.size, sha256: hash(p7.elfSectionBytes(elf, ro)) },
          textRelocations: elf.sections.find(s => s.name === '.rel.ob64.r0001')?.size / 8,
          dataRelocations: elf.sections.find(s => s.name === '.rel.rodata')?.size / 8,
          frame: base.assembly.toString().split('\n').find(l => l.includes('.frame')), calls: (base.assembly.toString().match(/^\s*jal\s/gm) || []).length },
        executions: [base, off, on].map(v => v.execution), observedCoverage: on.trace.coverage, events: identity(path.join(on.directory, 'events.json')), stderr: identity(path.join(on.directory, 'stderr.txt')) };
      if (definition.id.startsWith('d14c-')) {
        same(record.native.textRelocations, 177, 'D14C text relocation baseline'); same(record.native.dataRelocations, 15, 'D14C table relocation baseline');
        same(record.native.rodata.bytes, 64, 'D14C table extent'); same(record.native.calls, 131, 'D14C calls');
        same(/\.frame\s+\$sp,616,\$31/.test(record.native.frame), true, 'D14C frame baseline');
      }
      report.cases.push(record); write(path.join(caseDir, 'result.json'), record);
      console.log(JSON.stringify({ id: record.id, bytes: bytes.length, parity: true, events: on.trace.events.length, retries: on.trace.coverage['retry-before-restore'], elapsedMs: record.executions.map(e => e.elapsedMs) }));
    }
    authenticateManifest(manifestFile); same(identity(configFile).sha256, report.config.sha256, 'compiler flags changed');
    report.status = 'pass';
  } catch (error) { report.status = 'failed'; report.error = error.stack || error.message; }
  report.finished = new Date().toISOString(); write(path.join(dir, 'report.json'), report);
  if (report.status !== 'pass') throw Error(report.error + '\nPreserved report: ' + dir);
  return report;
}
if (require.main === module) { const file = process.argv[2]; if (!file) throw Error('explicit research build manifest required'); const r = focused(path.resolve(file)); console.log(JSON.stringify({ status: r.status, root: r.root, cases: r.cases.length })); }
module.exports = { focused, compileOne, nativeCensus, parity, authenticateManifest };
