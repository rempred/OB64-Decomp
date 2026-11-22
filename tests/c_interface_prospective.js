'use strict';
const fs = require('fs'),
  path = require('path'),
  cp = require('child_process'),
  assert = require('assert'),
  vm = require('vm');
const staged = path.resolve(__dirname, '..'),
  main = process.env.OB64_INTERFACE_TEST_ROOT || staged;
const checker = require('../tools/lib/c_interfaces'),
  types = require('../tools/lib/c_interface_types'),
  policy = require('../tools/lib/c_interface_prospective'),
  companion = require('../tools/lib/c_interface_companion');
const scratch = path.join(process.env.OB64_INTERFACE_TEST_SCRATCH || path.join(staged,
  'build/c-interface-tests'));
fs.mkdirSync(scratch, {
  recursive: true
});
const config = JSON.parse(fs.readFileSync(path.join(main, 'config/c-interface-frontend.json'))),
  exe = checker.authenticate(main, config);
let serial = 0,
  checks = 0;
const results = [];

function check(name, value) {
  assert(value, name);
  checks++;
  results.push({
    name,
    pass: true
  });
}

function parsed(text) {
  const file = path.join(scratch, 'unit-' + serial++ + '.i');
  fs.writeFileSync(file, text);
  return checker.parse(exe, file, text);
}

function pair(a, b, alias = false) {
  const aa = parsed(a),
    bb = parsed(b),
    sources = [a, b],
    analyses = [aa, bb],
    sections = [{
      index: 0,
      name: '',
      flags: 0,
      size: 0
    }, {
      index: 1,
      name: '.caller',
      flags: 6,
      address: 0x100,
      size: 0x80
    }, {
      index: 2,
      name: '.provider',
      flags: 6,
      address: 0x200,
      size: 0x80
    }];
  const symbols = [],
    units = analyses.map((analysis, i) => {
      const entries = analysis.functions.filter(f => f.definition).map((f, j) => {
        if (!f.local) symbols.push({
          name: f.name,
          binding: 1,
          symbolType: 2,
          size: 16,
          sectionIndex: i + 1,
          value: 0x100 + i * 0x100 + j * 16
        });
        return {
          symbol: f.name,
          binding: f.local ? 'LOCAL' : 'GLOBAL'
        };
      });
      return {
        identity: {
          source: i + '.c',
          sha256: checker.digest(sources[i]),
          authoredSha256: checker.digest(sources[i])
        },
        analysis,
        entries,
        sections: [sections[i + 1].name],
        relocations: []
      };
    });
  if (alias) symbols.push({
    ...symbols.find(s => s.name === 'f'),
    name: 'alias'
  });
  const linked = {
    sections,
    symbols,
    programHeaders: []
  };
  return {
    report: {
      producers: units.map(u => u.identity),
      ...checker.analyze(units, linked)
    },
    units,
    linked,
    sources
  };
}

function baseline(report) {
  return {
    schemaVersion: 1,
    purpose: 'reviewed-existing-interface-debt',
    producers: report.producers,
    findings: report.findings,
    limitations: [...new Map(report.gaps.map(g => {
      const x = checker.limitation(g);
      return [x.id, x];
    })).values()]
  };
}

function enforce(pair, ref = null) {
  pair.report.verdict = checker.compareBaseline(pair.report, baseline(pair.report));
  policy.enforce(scratch, scratch, {
    outputs: {}
  }, pair.report, pair.units, pair.linked, {
    reference: ref
  });
  return pair.report;
}
const good = 'unsigned int f(unsigned int);void caller(void){f(1);}',
  bad = 'int f(unsigned int);void caller(void){f(1);}',
  provider = 'unsigned int f(unsigned int x){return x+1;}';
const exact = enforce(pair(good, provider));
check('strict compatible fixture passes', exact.verdict.pass);
const wrong = enforce(pair(bad, provider));
check('edited baseline cannot override signed return mismatch', !wrong.verdict.pass && wrong.findings
  .length >
  0);
const wordByte = enforce(pair('unsigned char f(int);void caller(void){f(1);}',
  'unsigned int f(int x){return x;}'));
check('cross-TU word/byte mismatch rejects', !wordByte.verdict.pass);
const depth = enforce(pair('struct A;void f(struct A*);void caller(struct A*x){f(x);}',
  'struct A;void f(struct A**x){}'));
check('pointer depth mismatch rejects', depth.compatibility.conflicts.length > 0);
const qual = enforce(pair('void f(const int*);void caller(const int*x){f(x);}', 'void f(int*x){}'));
check('pointee qualifier mismatch rejects', !qual.verdict.pass);
const conversion = enforce(pair('void f(void*);void caller(int*x){f(x);}', 'void f(void*x){}'));
check('ordinary object-to-void argument conversion accepted', conversion.verdict.pass);
const callback = enforce(pair('void f(void(*)(void));void caller(void(*p)(void)){f(p);}',
  'void f(void(*p)(void*)){}'));
check('callback formal arity mismatch rejects', callback.compatibility.conflicts.length > 0);
const array = enforce(pair('void f(int x[3]);void caller(int*x){f(x);}', 'void f(int*x){}'));
check('array adjustment accepted', array.verdict.pass);
const fn = enforce(pair('typedef int F(int);void f(F x);int g(int x){return x;}void caller(void){f(g);}',
  'void f(int(*x)(int)){}'));
check('function typedef adjustment accepted by richer comparator', fn.compatibility.conflicts.length ===
  0 &&
  fn.compatibility.comparisons.every(x => x.result === 'compatible'));
const structs = enforce(pair(
  'struct A{int x;struct A*next;};void f(struct A*);void caller(struct A*x){f(x);}',
  'struct A{int x;struct A*next;};void f(struct A*x){}'));
check('recursive unique record members agree', structs.compatibility.comparisons.every(x => x.result ===
  'compatible'));
const sameUnitCast = enforce(pair(
  'struct A{int x;};struct B{int x;};void f(struct A*x){}void caller(struct B*x){((void(*)(struct B*))f)(x);}',
  'int g(void){return 0;}'));
check('same-TU distinct records do not become compatible through a function cast', sameUnitCast
  .compatibility.conflicts.length > 0);
const sameIncomplete = enforce(pair('struct A;void f(struct A*x){}void caller(struct A*x){f(x);}',
  'int g(void){return 0;}'));
check('same AST record identity remains compatible when incomplete', sameIncomplete.compatibility
  .comparisons.every(c => c.result === 'compatible'));
const renamed = enforce(pair('struct A{int x;};void f(struct A*);void caller(struct A*x){f(x);}',
  'typedef struct {int x;} B;void f(B*x){}'));
check('C90 complete records ignore tag spelling', renamed.compatibility.comparisons.every(x => x
  .result ===
  'compatible'));
const incomplete = enforce(pair('struct A;void f(struct A*);void caller(struct A*x){f(x);}',
  'struct A{short x;};void f(struct A*x){}'));
check('incomplete record remains unknown', incomplete.compatibility.comparisons.every(x => x.result ===
  'unknown'));
const fields = enforce(pair('struct A{int x;};void f(struct A*);void caller(struct A*x){f(x);}',
  'struct A{short x;};void f(struct A*x){}'));
check('record member disagreement rejects', fields.compatibility.conflicts.length > 0);
const union = enforce(pair('union U{int x;short y;};void f(union U*);void caller(union U*x){f(x);}',
  'union U{short y;int x;};void f(union U*x){}'));
check('union correspondence does not require declaration order', union.compatibility.comparisons.every(
  x => x
  .result === 'compatible'));
const tq = enforce(pair(
  'typedef int*P;struct A{const P x;};void f(struct A*);void caller(struct A*x){f(x);}',
  'typedef int*P;struct A{P x;};void f(struct A*x){}'));
check('typedef-hidden member qualifier disagreement rejects', tq.compatibility.conflicts.length > 0);
const cast = enforce(pair('unsigned int f(int);void caller(void){((int(*)(int))f)(1);}',
  'unsigned int f(int x){return x;}'));
check('known cross-cast checked at actual invocation', cast.findings.length === 0 && cast.compatibility
  .conflicts.length > 0);
const localCast = enforce(pair(
  'unsigned int f(int);void caller(void){int(*p)(int)=(int(*)(int))f;p(1);}',
  'unsigned int f(int x){return x;}'));
check('immutable local callback cross-cast is attributed', localCast.findings.length === 0 && localCast
  .compatibility.conflicts.length > 0);
const factory = parsed(
  'typedef int(*CB)(int);extern CB factory(void);int caller(void){return factory()(1);}');
check('factory-produced callback identity stays unknown', factory.calls.some(c => !c.name && !c
  .addressedDeclaration));
const returned = enforce(pair('int (*f(void))(int);void caller(void){f();}', 'int f(void){return 0;}'));
check('unsupported function-return declarator never becomes primitive compatibility', returned
  .compatibility
  .comparisons.every(c => c.result === 'unknown'));
const truncated = parsed(
  'int f(int);void caller(void){((int(*)(int))(unsigned char)(unsigned int)f)(1);}');
check('nonrepresentational pointer conversion is not a known target', truncated.calls.some(c => !c
  .name && !c
  .addressedDeclaration));
const alias = enforce(pair('unsigned char alias(int);void caller(void){alias(1);}',
  'unsigned int f(int x){return x;}', true));
check('named linker alias checked', !alias.verdict.pass);
const unknown = enforce(pair('void caller(int(*p)(int)){p(1);}', 'int f(int x){return x;}'));
check('unknown supplier remains explicitly unknown', unknown.compatibility.indirect[0]?.status ===
  'unresolved-supplier');
const reference = {
  identity: {
    fingerprint: 'fixture-accepted'
  },
  inventory: policy.inventory(pair(good, provider).units),
  relationships: []
};
const body = pair(good, provider.replace('x+1', 'x+2'));
const scope = policy.affected(policy.inventory(body.units), reference);
check('body-only provider change attributed', scope.changedFunctions.includes('1.c#f'));
const stable = pair('/*note*/' + good, provider);
check('comment-only edit does not change function', policy.affected(policy.inventory(stable.units),
    reference)
  .changedFunctions.length === 0);
const extraOld = pair(good + 'int unrelated(void){return 1;}', provider),
  extraNew = pair(good + 'int unrelated(void){return 2;}', provider);
const delta = policy.affected(policy.inventory(extraNew.units), {
  identity: {},
  inventory: policy.inventory(extraOld.units)
});
check('unrelated same-TU function is distinct', JSON.stringify(delta.changedFunctions) === JSON
  .stringify([
    '0.c#unrelated'
  ]));
const unrelatedCallOld = pair(
    'struct A;void f(struct A*);void caller(struct A*x){f(x);}int unrelated(void){return 1;}',
    'struct A;void f(struct A**x){}'),
  unrelatedCallNew = pair(
    'struct A;void f(struct A*);void caller(struct A*x){f(x);}int unrelated(void){return 2;}',
    'struct A;void f(struct A**x){}');
const oldInventory = policy.inventory(unrelatedCallOld.units),
  newInventory = policy.inventory(unrelatedCallNew.units);
check('unchanged outgoing call remains outside changed-call scope', policy.affected(newInventory, {
  identity: {},
  inventory: oldInventory
}).changedCalls.length === 0);
const unchangedOutgoingRef = {
  identity: {},
  inventory: oldInventory,
  bindingFingerprint: policy.linkageFingerprint({
    outputs: {}
  })
};
check('unrelated body edit does not recheck untouched outgoing legacy mismatch', enforce(
  unrelatedCallNew,
  unchangedOutgoingRef).compatibility.conflicts.length === 0);
check('changed linkage cannot silently reuse unchanged-call scope', enforce(unrelatedCallNew, {
  ...unchangedOutgoingRef,
  bindingFingerprint: 'A'.repeat(64)
}).compatibility.conflicts.length > 0);
check('missing trusted reference compares all', policy.affected(policy.inventory(body.units), null)
  .mode ===
  'all-known-interfaces-no-trusted-reference');
// Exact pre-publication controller, with unrelated native gates stubbed, real strict verdict.
const code = fs.readFileSync(path.join(staged, 'tools/lib/current_workflow.js'), 'utf8'),
  bodyCode = code.slice(code.indexOf('function verifyCurrent('), code.indexOf(
    'function currentVerificationState('));

function publish(report) {
  const publications = [],
    build = {
      output: '/isolated/build'
    },
    identity = {
      sha256: 'build'
    },
    sealed = {},
    fresh = new Map(),
    context = {
      currentFingerprint: 'new',
      baselineFingerprint: 'base',
      phase8: {
        targets: [],
        config: {
          compiler: {
            executableSha256: 'compiler'
          }
        }
      },
      localTools: {},
      sourcePolicy: {}
    };
  fresh.set(build, {
    fingerprint: 'new',
    outputs: sealed,
    buildReport: identity
  });
  const env = {
    path,
    fs: {
      readFileSync: () => Buffer.from('{}')
    },
    ROOT: '/repo',
    CURRENT_STATE_PATH: '/repo/state',
    SOURCE_POLICY_REPORT_PATH: '/repo/policy',
    freshBuilds: fresh,
    existingState: () => null,
    measure: (p, n, f) => f(),
    ensureCurrentBuild: () => build,
    runNode: () => ({}),
    runtimeArgs: () => [],
    executionReportSha256: () => 'verification',
    sha256Value: checker.digest,
    isDeepStrictEqual: require('util').isDeepStrictEqual,
    textContract: {
      readCompactReport: (dir, file) => file === 'verification.json' ? {
        identity: {
          sha256: 'verification'
        },
        report: {
          verification: {}
        }
      } : file === 'fresh-compilation.json' ? {
        identity: {
          sha256: 'fresh'
        },
        report: publications.find(p => p.file.endsWith('fresh-compilation.json'))?.value
      } : {
        identity,
        report: {
          objects: {
            manifest: {}
          }
        }
      },
      publishCompactReport: (file, value) => publications.push({
        file,
        value
      })
    },
    readJson: () => ({}),
    validateVerifiedCompanions: () => {},
    prepareContext: () => context,
    verifyRuntimeTools: () => {},
    outputSeal: () => sealed,
    classifyActiveTargets: () => ({}),
    require: name => name === './c_interface_prospective' ? {
      reference: () => null
    } : name === './c_interface_companion' ? {
      create: companion.create,
      validate: () => ({
        version: 2
      })
    } : {
      run: () => report
    }
  };
  let error;
  try {
    vm.runInNewContext('(' + bodyCode + ')', env)(context);
  } catch (e) {
    error = e.message;
  }
  return {
    published: publications.some(p => p.file === '/repo/state'),
    error
  };
}
check('real publication controller rejects edited-baseline same-byte conflict', !publish(wrong)
  .published);
check('transition result cannot publish before ratification', !publish(exact).published);
const permanentExact = {
  ...exact,
  compatibility: {
    ...exact.compatibility,
    phase: 'permanent'
  },
  verdict: {
    ...exact.verdict,
    readyForPublication: true
  }
};
check('real publication controller publishes ratified compatible result', publish(permanentExact)
  .published);
check('new companion cannot publish legacy-policy report', (() => {
  try {
    companion.create({
      output: path.resolve(scratch, 'build')
    }, {
      schemaVersion: 1,
      verdict: {
        pass: true
      }
    }, Buffer.from('{}'));
    return false;
  } catch {
    return true;
  }
})());
if (process.env.OB64_INTERFACE_NATIVE_DEMO === '1') {
  const native = require('./c_interface_same_bytes')(main, path.join(scratch, 'same-bytes'));
  check('fresh authenticated KMC identical whole-object evidence', native.objects[0].object === native
    .objects[1].object);
}
fs.writeFileSync(path.join(scratch, 'focused-results.json'), JSON.stringify({
  status: 'pass',
  checks,
  results,
  note: 'Publication controller uses real strict result and bounded native evidence stubs; no canonical build.'
}, null, 2));
console.log(JSON.stringify({
  status: 'pass',
  checks,
  scratch
}));
