'use strict';
// Exercise the exact publication controller with bounded evidence stubs. These
// tests prove ordering/failure paths, not ROM/ELF construction or audit acceptance.
const fs = require('fs'),
  path = require('path'),
  vm = require('vm'),
  assert = require('assert');
const code = fs.readFileSync(path.join(__dirname, '../tools/lib/current_workflow.js'), 'utf8');
const checker = require('../tools/lib/c_interfaces');
const verificationBody = code.slice(code.indexOf('function verifyCurrent('), code.indexOf(
  'function currentVerificationState('));
const stateBody = code.slice(code.indexOf('function currentVerificationState('), code.indexOf(
  'module.exports ='));
let assertions = 0;

function controller(change) {
  const publications = [],
    build = {
      output: '/isolated/build'
    },
    identity = {
      sha256: 'build'
    },
    sealed = {
      files: 'sealed'
    },
    sessions = new Map();
  const context = {
    currentFingerprint: 'before',
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
  sessions.set(build, {
    fingerprint: 'before',
    outputs: sealed,
    buildReport: identity
  });
  let mutated = false;
  let companionChecks = 0;
  const env = {
    path,
    fs: {
      readFileSync: () => Buffer.from('{}')
    },
    ROOT: '/repo',
    CURRENT_STATE_PATH: '/repo/state',
    SOURCE_POLICY_REPORT_PATH: '/repo/policy',
    freshBuilds: sessions,
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
    prepareContext: () => ({
      ...context,
      currentFingerprint: mutated && ['source', 'header', 'baseline'].includes(change) ? 'after' :
        'before'
    }),
    verifyRuntimeTools: () => {
      if (mutated && change === 'tool') throw Error('tool identity changed');
    },
    outputSeal: () => mutated && change === 'output' ? {
      files: 'changed'
    } : sealed,
    classifyActiveTargets: () => ({}),
    require: name => {
      if (name === './c_interface_prospective') return {
        reference: () => null
      };
      if (name === './c_interface_companion') return {
        create: require('../tools/lib/c_interface_companion').create,
        validate: () => {
          companionChecks++;
          if (change === 'raw-report' && companionChecks === 2) throw Error(
            'raw companion changed before publication');
          return {
            version: 1
          };
        }
      };
      assert.strictEqual(name, './c_interfaces');
      return {
        run: () => {
          mutated = true;
          return {
            schemaVersion: 2,
            findings: [],
            compatibility: {
              version: 2,
              phase: 'permanent',
              policy: 'zero-definite-and-affected-interfaces-v2',
              conflicts: [],
              siteConflicts: []
            },
            verdict: {
              pass: change !== 'conflict',
              readyForPublication: true
            },
            coverage: {}
          };
        }
      };
    }
  };
  const verify = vm.runInNewContext(`(${verificationBody})`, env);
  if (change) {
    assert.throws(() => verify(context));
    assert(!publications.some(p => p.file === '/repo/state'), 'verified CURRENT published after ' + change);
    assertions += 2;
  } else {
    verify(context);
    assert(publications.some(p => p.file === '/repo/state' && p.value.status === 'verified'));
    assertions++;
  }
}
for (const change of ['conflict', 'source', 'header', 'baseline', 'tool', 'output', 'raw-report', null])
  controller(change);

function stateControl(change, selected = false) {
  const interfaces = {
      schemaVersion: 1,
      verdict: {
        pass: true,
        readyForPublication: true
      }
    },
    state = {
      output: '/build',
      verifiedAt: 'today',
      verificationReport: 'verify',
      verificationSha256: 'v',
      freshCompilationReport: 'fresh',
      freshCompilationSha256: 'f',
      schemaVersion: 7,
      cInterfaceReport: 'interfaces',
      cInterfaceReportSha256: checker.digest(interfaces)
    };
  const env = {
    path,
    ROOT: '/repo',
    fs: {
      existsSync: () => true,
      statSync: () => ({
        size: 1
      })
    },
    CURRENT_STATE_PATH: 'state',
    sha256Value: checker.digest,
    existingState: () => state,
    reusableCurrentState: () => true,
    inputSet: {
      context: () => selected ? {} : null,
      rethrow: e => {
        if (selected) throw e;
      }
    },
    require: name => name === './matching/diagnostic_context' ? {
      assertCanonicalContext: () => {}
    } : name === './c_interface_companion' ? {
      validate: () => {
        if (change) throw Error('companion rejected');
        return {
          version: 1
        };
      }
    } : {
      readJson: file => file === 'state' ? state : file === 'interfaces' ? (change === 'failed' ? {
        schemaVersion: 1,
        verdict: {
          pass: false
        }
      } : interfaces) : {
        schemaVersion: 7
      },
      sha256File: file => file === 'verify' ? 'v' : file === 'fresh' ? 'f' : 'r'
    }
  };
  if (change === 'stale') state.cInterfaceReportSha256 = 'stale';
  if (change === 'missing') delete state.cInterfaceReport;
  if (selected && change) {
    assert.throws(() => vm.runInNewContext(`(${stateBody})`, env)({
      model: {
        config: {
          rom: {
            bytes: 1,
            sha256: 'r'
          }
        }
      }
    }));
    assertions++;
    return;
  }
  const status = vm.runInNewContext(`(${stateBody})`, env)({
    model: {
      config: {
        rom: {
          bytes: 1,
          sha256: 'r'
        }
      }
    }
  });
  assert.strictEqual(status.exact, !change);
  assertions++;
}
for (const selected of [false, true])
  for (const change of [null, 'stale', 'failed', 'missing']) stateControl(change, selected);
console.log(JSON.stringify({
  status: 'pass',
  assertions,
  scope: 'exact controller ordering with bounded construction/evidence stubs; no production build'
}));
