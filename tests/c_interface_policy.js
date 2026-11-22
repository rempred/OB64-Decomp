'use strict';
// Routine source-interface regressions. Native/retained-ROM demonstrations are opt-in.
const path = require('path'),
  cp = require('child_process');
for (const name of ['c_interface_prospective.js', 'c_interface_assembly.js', 'c_interface_reference.js',
    'c_interface_retirement.js'
  ]) {
  const result = cp.spawnSync(process.execPath, [path.join(__dirname, name)], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      OB64_INTERFACE_NATIVE_DEMO: '',
      OB64_INTERFACE_REAL_REFERENCE: ''
    },
    stdio: 'inherit',
    windowsHide: true
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
