'use strict';

const path = require('path');
const { createDiffProfiler, profileOutputPath, writeProfileReport } = require('./diff_profile');
const { ROOT } = require('./phase7_conventional');

// Diagnostic sidecars never enter a build, source-proof or verification report.
function withVerificationProfile(enabled, command, callback, options = {}) {
  if (!enabled) return callback(null);
  const profile = createDiffProfiler(options.profilerOptions);
  const file = path.join(options.root || ROOT, 'build', 'verification-profile',
    path.basename(profileOutputPath(options.root || ROOT, command.replace(/-/g, '_'), profile.startedAt)));
  const log = options.log || console.log;
  let failed = false;
  profile.installChildProcessObserver();
  try {
    return callback(profile);
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    try {
      const report = profile.finish({ command, status: failed || process.exitCode ? 'error' : 'pass' });
      writeProfileReport(file, report);
      log(`Timing profile: ${file}`);
      log(`Profiled wall time: ${(report.totalMs / 1000).toFixed(3)} s`);
    } catch (error) {
      // Losing diagnostics cannot turn failed verification into a pass, replace
      // its original exception, or change otherwise valid acceptance evidence.
      try { log(`Timing profile could not be written: ${error.message}`); } catch (_) { /* diagnostic sink unavailable */ }
    } finally {
      profile.restoreChildProcessObserver();
    }
  }
}

function measure(profile, name, callback) {
  return profile ? profile.measure(name, callback) : callback();
}

function targetStage(prefix, symbol) {
  return `${prefix}-${symbol.toLowerCase().replace(/[^a-z0-9.-]/g, '-')}`;
}

module.exports = { withVerificationProfile, measure, targetStage };
