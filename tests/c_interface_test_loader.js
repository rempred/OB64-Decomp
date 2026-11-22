'use strict';
// Test-only source overlay: execute candidate modules without changing main.
const fs = require('fs'),
  path = require('path'),
  Module = require('module');
module.exports = function(main, staged, overrides = {}) {
  const cache = new Map();

  function load(file) {
    file = path.resolve(file);
    const relative = path.relative(main, file).replace(/\\/g, '/');
    if (Object.hasOwn(overrides, relative)) return overrides[relative];
    if (cache.has(file)) return cache.get(file).exports;
    const candidate = path.join(staged, relative),
      source = fs.existsSync(candidate) ? candidate : file;
    const mod = new Module(file, module);
    cache.set(file, mod);
    mod.filename = file;
    mod.paths = Module._nodeModulePaths(path.dirname(file));
    mod.require = function(name) {
      if (name.startsWith('.')) {
        const requested = path.resolve(path.dirname(file), name);
        for (const target of [requested, requested + '.js'])
          if (target.endsWith('.js') && fs.existsSync(path.join(staged, path.relative(main,
            target)))) return load(target);
      }
      const resolved = Module._resolveFilename(name, mod);
      if (typeof resolved === 'string' && resolved.startsWith(main + path.sep) && resolved.endsWith(
          '.js')) return load(resolved);
      return require(resolved);
    };
    mod._compile(fs.readFileSync(source, 'utf8'), file);
    mod.loaded = true;
    return mod.exports;
  }
  return {
    load: relative => load(path.resolve(main, relative)),
    cache
  };
};
