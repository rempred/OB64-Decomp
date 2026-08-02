'use strict';

const childProcess = require('child_process');

function normalize(name) { return name.toLowerCase().replace(/[-_.]+/g, '-'); }
function runPython(python, code, args) {
  const result = childProcess.spawnSync(python, ['-c', code, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'Python dependency derivation failed');
  return JSON.parse(result.stdout);
}
function directInventory(python, pyproject) {
  const code = "import json,tomllib,sys; d=tomllib.load(open(sys.argv[1],'rb')); p=d['project']; out=[]; groups=[('base',p['dependencies']),('mips',p['optional-dependencies']['mips']),('dev',p['optional-dependencies']['dev']),('build-system',d['build-system']['requires'])]; [out.append({'requirement':r,'group':g}) for g,rs in groups for r in rs]; print(json.dumps(out))";
  return runPython(python, code, [pyproject]).map((row) => ({ ...row, name: normalize(row.requirement.replace(/[<>=!~;\[ ].*$/, '')) }));
}
function parentEdges(python, names) {
  const code = "import importlib.metadata as m,json; print(json.dumps({d.metadata['Name']:d.requires or [] for d in m.distributions()}))";
  const metadata = runPython(python, code, []);
  const edges = {};
  for (const child of names) {
    const parents = Object.entries(metadata).filter(([, requirements]) => requirements.some((requirement) => normalize(requirement.replace(/[<>=!~;\[ ].*$/, '')) === child)).map(([name]) => normalize(name)).sort();
    edges[child] = parents[0] || 'resolved-by-pip';
  }
  return edges;
}
module.exports = { normalize, directInventory, parentEdges };
