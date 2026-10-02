#!/usr/bin/env node
'use strict';

// Advisory source inventory, deliberately independent of build/verification modules.
// This is a bounded token scanner, not a C parser or an ABI/semantic equivalence test.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const IDENT = /^[A-Za-z_][A-Za-z_0-9]*$/;
const QUALIFIERS = new Set(['const', 'volatile', 'restrict']);
const STORAGE = new Set(['extern', 'static', 'register', 'auto', 'inline']);
const BUILTINS = new Map([
  ['void', 'void'], ['char', 'char'], ['signed char', 'signed char'], ['unsigned char', 'unsigned char'],
  ['short', 'short'], ['short int', 'short'], ['signed short', 'short'], ['signed short int', 'short'],
  ['unsigned short', 'unsigned short'], ['unsigned short int', 'unsigned short'],
  ['int', 'int'], ['signed', 'int'], ['signed int', 'int'], ['unsigned', 'unsigned int'], ['unsigned int', 'unsigned int'],
  ['long', 'long'], ['long int', 'long'], ['signed long', 'long'], ['signed long int', 'long'],
  ['unsigned long', 'unsigned long'], ['unsigned long int', 'unsigned long'],
  ['float', 'float'], ['double', 'double'], ['long double', 'long double'],
]);
const WORDS = new Set([...BUILTINS.keys()].flatMap(key => key.split(' ')));
const values = tokens => tokens.map(token => token.value);
const spelling = tokens => values(tokens).join(' ');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function tokenize(text) {
  const tokens = [], issues = [];
  let i = 0, line = 1, lineStart = true;
  const advance = end => {
    while (i < end) { if (text[i++] === '\n') { line++; lineStart = true; } }
  };
  while (i < text.length) {
    if (/\s/.test(text[i])) { advance(i + 1); continue; }
    if (text.startsWith('//', i)) { const end = text.indexOf('\n', i); advance(end < 0 ? text.length : end); continue; }
    if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2);
      if (end < 0) { issues.push({ line, reason: 'unterminated-comment' }); break; }
      advance(end + 2); continue;
    }
    const start = i, startLine = line;
    if (text[i] === '#' && lineStart) {
      let end = i;
      do { end = text.indexOf('\n', end + 1); } while (end >= 0 && text.slice(start, end).replace(/\r$/, '').endsWith('\\'));
      if (end < 0) end = text.length;
      tokens.push({ value: text.slice(start, end).replace(/\\\r?\n/g, ' '), line, offset: start, directive: true });
      advance(end); continue;
    }
    lineStart = false;
    if (text[i] === '"' || text[i] === "'") {
      const quote = text[i++];
      while (i < text.length && text[i] !== quote) { if (text[i] === '\\') i++; i++; }
      if (i >= text.length) issues.push({ line: startLine, reason: 'unterminated-literal' });
      else i++;
      const end = i; i = start; advance(end);
      tokens.push({ value: text.slice(start, end), line: startLine, offset: start, literal: true });
      continue;
    }
    const match = /^(?:[A-Za-z_][A-Za-z_0-9]*|0[xX][0-9A-Fa-f]+[uUlL]*|[0-9]+[uUlL]*|\.\.\.)/.exec(text.slice(i));
    const value = match ? match[0] : text[i];
    tokens.push({ value, line, offset: start }); advance(i + value.length);
  }
  return { tokens, issues };
}

function closing(tokens, start, open, close) {
  let depth = 0;
  for (let i = start; i < tokens.length; i++) {
    if (tokens[i].value === open) depth++;
    if (tokens[i].value === close && --depth === 0) return i;
    // Only decrement on close; the short circuit above leaves other tokens alone.
  }
  return -1;
}

function split(tokens, delimiter) {
  const parts = []; let start = 0, depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    if (['(', '[', '{'].includes(tokens[i].value)) depth++;
    if ([')', ']', '}'].includes(tokens[i].value)) depth--;
    if (!depth && tokens[i].value === delimiter) { parts.push(tokens.slice(start, i)); start = i + 1; }
  }
  parts.push(tokens.slice(start)); return parts;
}

function simpleDeclarator(tokens, allowUnnamed = false) {
  const list = tokens.filter(token => !STORAGE.has(token.value));
  if (list.some(token => ['(', ')', ',', ':', '=', '{', '}', '...'].includes(token.value))) return null;
  const array = list.findIndex(token => token.value === '[');
  const prefix = array < 0 ? list : list.slice(0, array);
  const suffix = array < 0 ? [] : list.slice(array);
  if (suffix.length && !/^(?:\[ (?:0[xX][0-9a-fA-F]+|[0-9]+)? ?\] ?)+$/.test(spelling(suffix))) return null;
  const last = prefix[prefix.length - 1];
  const hasName = last && IDENT.test(last.value) && !WORDS.has(last.value) && !QUALIFIERS.has(last.value)
    && prefix.length > 1 && prefix[prefix.length - 2].value !== 'struct';
  if (!hasName && !allowUnnamed) return null;
  return { name: hasName ? last.value : null, type: hasName ? prefix.slice(0, -1) : prefix, arrays: suffix };
}

function parseDeclaration(tokens, definition, file) {
  const base = { file, line: tokens[0].line, offset: tokens[0].offset, text: spelling(tokens),
    name: null, kind: 'unsupported', supported: false, reasons: [], definition,
    storage: values(tokens).filter(word => STORAGE.has(word)) };
  const v = values(tokens);
  if (v.includes('__attribute__') || v.includes('__declspec')) base.reasons.push('attribute-or-packing');
  if (tokens.some(token => token.conditional && token.conditional.length)) base.reasons.push('conditional-declaration');
  const isTypedef = v[0] === 'typedef';
  const begin = isTypedef ? 1 : 0;
  if (v[begin] === 'struct') {
    const tag = IDENT.test(v[begin + 1] || '') ? v[begin + 1] : null;
    const brace = v.indexOf('{');
    if (brace >= 0) {
      const end = closing(tokens, brace, '{', '}');
      const tail = tokens.slice(end + 1);
      if (end < 0 || tail.length > (isTypedef ? 1 : 0) || (isTypedef && (!tail[0] || !IDENT.test(tail[0].value)))) {
        base.reasons.push('complex-struct-declarator'); return base;
      }
      base.name = isTypedef ? tail[0].value : tag; base.tag = tag; base.kind = 'struct-body';
      base.alias = isTypedef; base.fields = split(tokens.slice(brace + 1, end), ';').filter(part => part.length).map(part => simpleDeclarator(part));
      base.bodyText = spelling(tokens.slice(brace + 1, end));
      base.coverage = 'not-established; may be a partial view';
      if (!base.name || !base.fields.length || base.fields.some(field => !field)) base.reasons.push('unsupported-struct-field');
    } else if (tag && (v.length === begin + 2 || (isTypedef && v.length === begin + 3 && IDENT.test(v[begin + 2])))) {
      base.name = isTypedef ? v[begin + 2] : tag; base.tag = tag; base.alias = isTypedef; base.kind = 'opaque-forward';
      if (!base.name) base.reasons.push('missing-typedef-name');
    }
  }
  if (base.kind === 'unsupported' && !base.reasons.length) {
    const paren = v.indexOf('(');
    if (paren >= 0 && !isTypedef) {
      const end = closing(tokens, paren, '(', ')');
      const head = simpleDeclarator(tokens.slice(0, paren));
      if (head && end === tokens.length - 1 && !tokens.slice(paren + 1, end).some(token => ['(', ')', '...'].includes(token.value))) {
        base.kind = 'function'; base.name = head.name; base.returnType = head.type; base.definition = definition;
        const params = tokens.slice(paren + 1, end);
        base.prototype = params.length === 0 ? 'unspecified' : spelling(params) === 'void' ? 'void' : 'parameters';
        base.parameters = base.prototype === 'parameters' ? split(params, ',').map(part => simpleDeclarator(part, true)) : [];
        if (base.parameters.some(param => !param)) base.reasons.push('unsupported-parameter');
      } else base.reasons.push('function-pointer-macro-or-complex-prototype');
    } else {
      const item = simpleDeclarator(isTypedef ? tokens.slice(1) : tokens);
      if (item) { base.kind = isTypedef ? 'typedef' : 'global'; base.name = item.name; base.type = item.type; base.arrays = item.arrays; }
      else base.reasons.push('unsupported-declarator');
    }
  }
  if (base.kind === 'unsupported' && !base.reasons.length) base.reasons.push('unsupported-declaration');
  base.storage = v.filter(word => STORAGE.has(word));
  base.supported = base.reasons.length === 0;
  return base;
}

function scanSource(text, file = '<memory>') {
  const lex = tokenize(text), directives = lex.tokens.filter(token => token.directive);
  const first = directives[0], second = directives[1], last = directives[directives.length - 1];
  const guardMatch = first && /^#\s*ifndef\s+([A-Za-z_]\w*)\s*$/.exec(first.value);
  // Only the conventional whole-file guard is exempted. Nested conditions stay unsupported.
  let guard = null;
  if (guardMatch && second && last && new RegExp('^#\\s*define\\s+' + guardMatch[1] + '\\s*$').test(second.value)
      && /^#\s*endif\s*$/.test(last.value) && lex.tokens[0] === first && lex.tokens[lex.tokens.length - 1] === last) {
    let depth = 0, whole = true;
    for (const directive of directives) {
      if (/^#\s*(if|ifdef|ifndef)\b/.test(directive.value)) depth++;
      if (/^#\s*endif\b/.test(directive.value)) { depth--; if (depth === 0 && directive !== last) whole = false; }
    }
    if (whole && depth === 0) guard = guardMatch[1];
  }
  const events = [], code = [], conditions = [];
  for (const token of lex.tokens) {
    if (!token.directive) { code.push({ ...token, conditional: [...conditions] }); continue; }
    if (guard && [first, second, last].includes(token)) continue;
    const match = /^#\s*(\w+)\b\s*([\s\S]*)$/.exec(token.value);
    const command = match ? match[1] : 'unknown', argument = match ? match[2].trim() : token.value;
    events.push({ kind: 'directive', command, argument, line: token.line, offset: token.offset, conditional: [...conditions] });
    if (['if', 'ifdef', 'ifndef'].includes(command)) conditions.push(token.value);
    else if (['else', 'elif'].includes(command)) { if (conditions.length) conditions[conditions.length - 1] = token.value; else lex.issues.push({ line: token.line, reason: 'unbalanced-conditional' }); }
    else if (command === 'endif') { if (conditions.length) conditions.pop(); else lex.issues.push({ line: token.line, reason: 'unbalanced-conditional' }); }
  }
  if (conditions.length) lex.issues.push({ line: conditions.length, reason: 'unclosed-conditional' });
  let start = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i].value === '(') { const end = closing(code, i, '(', ')'); if (end < 0) break; i = end; continue; }
    if (code[i].value === '{') {
      const end = closing(code, i, '{', '}');
      if (end < 0) { lex.issues.push({ line: code[i].line, reason: 'unclosed-body' }); break; }
      const prefix = code.slice(start, i);
      if (prefix.some(token => token.value === '(') && prefix[0]?.value !== 'typedef' && !prefix.some(token => token.value === '=')) {
        for (const event of events) if (event.kind === 'directive' && event.offset > code[i].offset && event.offset < code[end].offset) event.blockScoped = true;
        events.push(parseDeclaration(prefix, true, file)); start = end + 1;
      }
      i = end; continue;
    }
    if (code[i].value === ';') {
      if (i > start) events.push(parseDeclaration(code.slice(start, i), false, file));
      start = i + 1;
    }
  }
  if (start < code.length) lex.issues.push({ line: code[start].line, reason: 'unconsumed-top-level-syntax' });
  return { file, guard, events: events.sort((a, b) => a.offset - b.offset), issues: lex.issues };
}

function normalizeType(tokens, arrays, environment) {
  const v = values(tokens);
  if (v.some(word => environment.macros.has(word))) return { reason: 'macro-in-type' };
  const star = v.indexOf('*'), base = star < 0 ? v : v.slice(0, star), pointer = star < 0 ? [] : v.slice(star);
  if (pointer.some(word => word !== '*' && !QUALIFIERS.has(word))) return { reason: 'unsupported-pointer-type' };
  const qualifiers = base.filter(word => QUALIFIERS.has(word)).sort();
  const words = base.filter(word => !QUALIFIERS.has(word));
  let key = BUILTINS.get(words.join(' ')), contextual = false;
  if (!key && words.length === 1) {
    const alias = environment.aliases.get(words[0]);
    if (alias && !alias.reason) { key = alias.key; contextual = alias.contextual; }
  }
  if (!key && words.length === 2 && words[0] === 'struct') {
    key = environment.tags.get(words[1]); contextual = true;
  }
  if (!key) return { reason: 'unresolved-type:' + words.join(' ') };
  const dimensions = spelling(arrays || []).replace(/0[xX][0-9a-fA-F]+|[0-9]+/g, literal => {
    if (/^0[0-7]+$/.test(literal)) return BigInt('0o' + literal.slice(1)).toString();
    return BigInt(literal).toString();
  });
  return { key: [...qualifiers, key, ...pointer, dimensions].filter(Boolean).join(' '), contextual };
}

function normalizeDeclaration(declaration, environment) {
  const reasons = [...declaration.reasons, ...(environment.unsupported || [])];
  const norm = (tokens, arrays = []) => {
    const result = normalizeType(tokens, arrays, environment);
    if (result.reason) reasons.push(result.reason);
    return result;
  };
  let signature = null, contextual = false;
  if (declaration.kind === 'opaque-forward' || declaration.kind === 'struct-body') {
    const tagKey = environment.tags.get(declaration.tag) || `struct ${declaration.tag || declaration.name}@${declaration.file}:${declaration.line}`;
    if (declaration.tag && !reasons.length) environment.tags.set(declaration.tag, tagKey);
    if (declaration.alias && declaration.name) environment.aliases.set(declaration.name,
      reasons.length ? { reason: 'unsupported-alias-context' } : { key: tagKey, contextual: true });
    if (declaration.kind === 'struct-body') {
      const fields = (declaration.fields || []).filter(Boolean).map(field => ({ name: field.name, type: norm(field.type, field.arrays) }));
      signature = fields.map(field => `${field.name}:${field.type.key || '?'}`).join(';');
      contextual = fields.some(field => field.type.contextual);
    }
  } else if (declaration.kind === 'function') {
    if (declaration.prototype === 'unspecified') reasons.push('unspecified-parameter-list');
    const result = norm(declaration.returnType);
    const parameters = declaration.parameters.filter(Boolean).map(param => {
      // C adjusts parameter types; leave those compatibility rules to a compiler.
      if (param.arrays.length) reasons.push('array-parameter-adjustment-unsupported');
      const lastStar = values(param.type).lastIndexOf('*');
      if (param.type.some((token, index) => QUALIFIERS.has(token.value) && (lastStar < 0 || index > lastStar))) reasons.push('qualified-parameter-compatibility-unsupported');
      return norm(param.type, param.arrays);
    });
    signature = `${result.key || '?'} (${declaration.prototype}:${parameters.map(param => param.key || '?').join(',')})`;
    contextual = result.contextual || parameters.some(param => param.contextual);
  } else if (declaration.type) {
    const result = norm(declaration.type, declaration.arrays);
    signature = result.key || null; contextual = result.contextual;
    if (declaration.kind === 'typedef') environment.aliases.set(declaration.name, reasons.length ? { reason: 'unsupported-alias-context' } : result);
  }
  if (declaration.name && environment.macros.has(declaration.name)) reasons.push('macro-in-declaration-name');
  return { signature, contextual: !!contextual, supported: declaration.supported && !reasons.length, reasons: [...new Set(reasons)] };
}

function repositoryPath(root, relative, mustExist = true) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || /^[A-Za-z]:/.test(relative)
      || relative.includes('\\') || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error(`unsafe repository path: ${relative}`);
  const absolute = path.resolve(root, relative);
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) { if (mustExist) throw new Error(`missing repository input: ${relative}`); return absolute; }
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`symbolic-link repository input: ${relative}`);
  }
  const real = fs.realpathSync(absolute), boundary = path.relative(fs.realpathSync(root), real);
  if (path.isAbsolute(boundary) || boundary === '..' || boundary.startsWith('..' + path.sep)) throw new Error(`repository path escape: ${relative}`);
  return absolute;
}

function inventory(options = {}) {
  const root = path.resolve(options.root || ROOT), files = new Map(), scans = new Map();
  const read = relative => {
    const absolute = repositoryPath(root, relative);
    if (!fs.statSync(absolute).isFile()) throw new Error(`not a regular file: ${relative}`);
    const bytes = fs.readFileSync(absolute); files.set(relative, { path: relative, sha256: hash(bytes) }); return bytes.toString('utf8');
  };
  const config = JSON.parse(read('config/matching-c-targets.json'));
  const groups = JSON.parse(read('config/matching-c-compilation-groups.json'));
  const linkage = JSON.parse(read('config/matching-c-linkage.json'));
  const policy = JSON.parse(read('config/source-policy.json'));
  if (!Array.isArray(config.targets) || !Array.isArray(groups.groups) || !Array.isArray(linkage.symbols)
      || !Array.isArray(linkage.targets) || !Array.isArray(policy.preprocessor?.includeDirectories)) throw new Error('unsupported inventory configuration shape');
  const includeDirectories = policy.preprocessor.includeDirectories;
  for (const directory of includeDirectories) repositoryPath(root, directory);
  const producers = new Map(), bySymbol = new Map(), groupById = new Map();
  for (const group of groups.groups) {
    if (groupById.has(group.id)) throw new Error(`ambiguous compilation group: ${group.id}`);
    groupById.set(group.id, group);
  }
  for (const target of config.targets) {
    if (typeof target.symbol !== 'string' || bySymbol.has(target.symbol.toLowerCase())) throw new Error('ambiguous active target');
    const group = target.compilationGroup && groupById.get(target.compilationGroup);
    if (target.compilationGroup && (!group || !group.members.some(member => member.symbol === target.symbol) || target.source)) throw new Error(`unresolved grouped producer: ${target.symbol}`);
    const source = group ? group.source : target.source;
    repositoryPath(root, source);
    if (!source.endsWith('.c')) throw new Error(`unsupported producer source: ${source}`);
    let producer = producers.get(source);
    if (!producer) { producer = { source, group: group?.id || null, targets: [], overlayContext: /(?:^|\/)descriptor_([^/]+)/.exec(source)?.[1] || 'unresolved' }; producers.set(source, producer); }
    if (producer.group !== (group?.id || null)) throw new Error(`ambiguous producer context: ${source}`);
    producer.targets.push(target.symbol); bySymbol.set(target.symbol.toLowerCase(), producer);
  }
  for (const producer of producers.values()) if (producer.group) {
    const group = groupById.get(producer.group);
    if (group.members.some(member => !producer.targets.includes(member.symbol))) throw new Error(`incomplete active compilation group: ${group.id}`);
  }
  const nominated = new Set();
  for (const symbol of options.targets || []) {
    const producer = bySymbol.get(symbol.toLowerCase()); if (!producer) throw new Error(`unknown active target: ${symbol}`);
    nominated.add(producer.source);
  }
  const headers = new Set(options.headers || []);
  for (const header of headers) { repositoryPath(root, header); if (!header.endsWith('.h')) throw new Error(`header scope is not a header: ${header}`); }
  if (!nominated.size && !headers.size) throw new Error('at least one --target or --header is required');
  if (options.check && (!nominated.size || !headers.size)) throw new Error('--check requires --header and nominated --target consumers');
  const headerFiles = [];
  const walk = directory => {
    const absolute = repositoryPath(root, directory);
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const relative = directory + '/' + entry.name;
      if (entry.isSymbolicLink()) throw new Error(`symbolic-link header inventory: ${relative}`);
      if (entry.isDirectory()) walk(relative); else if (entry.isFile() && entry.name.endsWith('.h')) headerFiles.push(relative);
    }
  };
  for (const directory of includeDirectories) walk(directory);
  for (const header of headers) if (!headerFiles.includes(header)) headerFiles.push(header);
  const scan = file => { if (!scans.has(file)) scans.set(file, scanSource(read(file), file)); return scans.get(file); };
  const declarations = new Map(), issues = [], closures = [], occurrences = [];
  const run = (entry, producer = null) => {
    const environment = { aliases: new Map(), tags: new Map(), macros: new Set(), unsupported: [] }, seenGuards = new Map(), stack = [], reached = new Set(), edges = [];
    const context = producer ? producer.source : `header:${entry}`;
    const issue = (file, line, reason) => issues.push({ context, file, line, reason });
    const visit = file => {
      reached.add(file);
      if (stack.includes(file)) { issue(file, 1, 'include-cycle'); return; }
      const parsed = scan(file);
      if (parsed.guard && environment.macros.has(parsed.guard) && !seenGuards.has(parsed.guard)) {
        issue(file, 1, 'predefined-header-guard:' + parsed.guard); return;
      }
      if (parsed.guard && seenGuards.has(parsed.guard)) {
        if (seenGuards.get(parsed.guard) !== file) issue(file, 1, 'header-guard-collision:' + seenGuards.get(parsed.guard));
        return;
      }
      if (parsed.guard) { seenGuards.set(parsed.guard, file); environment.macros.add(parsed.guard); }
      stack.push(file);
      for (const problem of parsed.issues) issue(file, problem.line, problem.reason);
      for (const event of parsed.events) {
        if (event.kind === 'directive') {
          if (event.blockScoped) { issue(file, event.line, 'block-scope-preprocessing'); environment.unsupported.push('block-scope-preprocessing'); }
          if (event.command === 'include') {
            const match = /^(?:"([^"\r\n]+)"|<([^>\r\n]+)>)$/.exec(event.argument);
            if (!match || event.conditional.length) { issue(file, event.line, 'macro-or-conditional-include'); continue; }
            const name = match[1] || match[2];
            if (name.includes('\\') || path.isAbsolute(name) || /^[A-Za-z]:/.test(name) || name.split('/').some(part => part === '..' || part === '.' || !part)) { issue(file, event.line, 'unsafe-include-path'); continue; }
            // Quoted includes search the current file first; source-policy also adds
            // the producer directory to its explicit -I search for both forms.
            const directories = [...(match[1] ? [path.posix.dirname(file)] : []), path.posix.dirname(entry), ...includeDirectories];
            const candidates = [...new Set(directories.map(directory => path.posix.join(directory, name)))];
            const existing = candidates.filter(candidate => fs.existsSync(repositoryPath(root, candidate, false)));
            if (!existing.length) { issue(file, event.line, 'missing-include:' + name); continue; }
            const resolved = existing[0]; repositoryPath(root, resolved);
            edges.push({ from: file, line: event.line, spelling: name, resolved, shadowedCandidates: existing.slice(1) }); visit(resolved);
          } else if (event.command === 'define') {
            const name = /^([A-Za-z_]\w*)/.exec(event.argument)?.[1]; if (name) environment.macros.add(name);
          } else if (event.command === 'undef') { environment.macros.delete(event.argument); seenGuards.delete(event.argument); }
          else if (!['if', 'ifdef', 'ifndef', 'elif', 'else', 'endif'].includes(event.command)) {
            issue(file, event.line, 'unsupported-directive:' + event.command);
            environment.unsupported.push('unsupported-directive-context:' + event.command);
          }
          continue;
        }
        const id = `${file}:${event.line}:${event.offset}`;
        if (!declarations.has(id)) {
          const { type, arrays, returnType, parameters, fields, ...publicEvent } = event;
          declarations.set(id, { id, ...publicEvent, contexts: [] });
        }
        const normalized = normalizeDeclaration(event, environment);
        const observation = { context, ...normalized };
        declarations.get(id).contexts.push(observation);
        occurrences.push({ id, context, header: file.endsWith('.h'), name: event.name, kind: event.kind, definition: event.definition,
          alias: event.alias || event.kind === 'typedef', static: event.storage.includes('static'), ...normalized });
      }
      stack.pop();
    };
    visit(entry);
    closures.push({ context, producer: !!producer, files: [...reached].sort(), edges,
      textualComplete: !issues.some(problem => problem.context === context), authenticatedDependencies: false });
  };
  for (const producer of producers.values()) run(producer.source, producer);
  // Standalone header contexts expose self-containment gaps without borrowing a
  // consumer's local typedefs. These are advisory, not producer occurrences.
  for (const header of headerFiles) run(header);
  const headerScopeFiles = new Set([...headers].flatMap(header => closures.find(item => item.context === `header:${header}`)?.files || [header]));
  const scopeNames = new Set();
  for (const declaration of declarations.values()) if (headerScopeFiles.has(declaration.file) || declaration.contexts.some(item => nominated.has(item.context))) {
    if (declaration.name) scopeNames.add(declaration.name);
  }
  const selected = [...declarations.values()].filter(item => scopeNames.has(item.name) || headerScopeFiles.has(item.file) || item.contexts.some(context => nominated.has(context.context)));
  const names = [...scopeNames].sort(), relationships = [];
  for (const name of names) {
    const entries = selected.filter(item => item.name === name), bodies = entries.filter(item => item.kind === 'struct-body'), forwards = entries.filter(item => item.kind === 'opaque-forward');
    const taggedBodies = bodies.filter(item => item.tag), anonymousBodies = bodies.filter(item => !item.tag);
    const variants = [...new Set(bodies.map(item => item.bodyText))];
    const comparable = entries.filter(item => ['global', 'function', 'typedef'].includes(item.kind));
    const signatures = [...new Set(comparable.flatMap(item => item.contexts.filter(context => context.supported).map(context => context.signature)))];
    const classifications = [];
    if (forwards.length) classifications.push('opaque-forward-declarations');
    if (bodies.length === 1) classifications.push('single-concrete-body');
    if (anonymousBodies.length) classifications.push('anonymous-typedef-views');
    if (bodies.length > 1) classifications.push(variants.length === 1 ? 'textual-duplicate-candidate' : 'partial-views-or-incompatible-bodies');
    if (comparable.length > 1) classifications.push(signatures.length > 1 ? 'signature-difference-review-context' : 'textual-signature-candidate');
    if (entries.some(item => item.contexts.some(context => !context.supported))) classifications.push('unsupported-or-unresolved');
    relationships.push({ name, classifications, opaqueForwards: forwards.length, concreteBodies: bodies.length,
      taggedConcreteBodies: taggedBodies.length, anonymousTypedefBodies: anonymousBodies.length,
      bodySignatures: [...new Set(bodies.flatMap(item => item.contexts.filter(context => context.supported).map(context => context.signature)))],
      locations: entries.map(item => item.id), supportedSignatures: signatures,
      mappings: linkage.symbols.filter(item => item.name === name),
      mappedReferences: linkage.targets.filter(target => target.expectedRelocations?.some(relocation => relocation.symbol === name)).map(target => ({ target: target.symbol,
        producer: bySymbol.get(target.symbol.toLowerCase())?.source || null, overlayContext: bySymbol.get(target.symbol.toLowerCase())?.overlayContext || 'unresolved' })),
      identity: 'producer/overlay context required; equal names or addresses do not establish one object' });
  }
  let check = null;
  if (options.check) {
    const problems = [], uncertainties = [], headerNames = new Set(selected.filter(item => headerScopeFiles.has(item.file)).map(item => item.name).filter(Boolean));
    for (const declaration of selected) if (headerScopeFiles.has(declaration.file)) {
      if (!declaration.supported) uncertainties.push({ context: declaration.file, declaration: declaration.id, reason: declaration.reasons.join(', ') });
      for (const context of declaration.contexts) if ([...headers].some(header => context.context === `header:${header}`) && !context.supported) {
        uncertainties.push({ context: context.context, declaration: declaration.id, reason: 'header-self-containment:' + context.reasons.join(', ') });
      }
    }
    const knownConsumers = closures.filter(item => item.producer && [...headers].some(header => item.files.includes(header))).map(item => item.context);
    for (const consumer of knownConsumers) if (!nominated.has(consumer)) uncertainties.push({ context: consumer, reason: 'consumer-not-nominated' });
    for (const name of headerNames) {
      const scoped = occurrences.filter(item => headerScopeFiles.has(declarations.get(item.id).file) && item.name === name && item.supported);
      const signatures = new Set(scoped.map(item => item.signature).filter(Boolean));
      const outside = occurrences.filter(item => producers.has(item.context) && !nominated.has(item.context) && item.name === name);
      for (const item of outside) if (!item.supported || (item.signature && !signatures.has(item.signature))) {
        uncertainties.push({ context: item.context, name, declaration: item.id, reason: 'declared-outside-nominated-closure',
          identity: 'Possible different producer/overlay object; no identity or incompatibility claim.' });
      }
    }
    for (const context of nominated) {
      const closure = closures.find(item => item.context === context);
      for (const header of headers) if (!closure.files.includes(header)) uncertainties.push({ context, reason: 'nominated-consumer-does-not-include:' + header });
      uncertainties.push(...issues.filter(item => item.context === context));
      const relevant = occurrences.filter(item => item.context === context && headerNames.has(item.name));
      for (const item of relevant) if (!item.supported) uncertainties.push({ context, declaration: item.id, reason: item.reasons.join(', ') });
      for (const name of headerNames) {
        const items = relevant.filter(item => item.name === name);
        const bodies = items.filter(item => item.kind === 'struct-body');
        const functions = items.filter(item => item.kind === 'function' && item.definition);
        if (bodies.length > 1 || functions.length > 1) problems.push({ context, name, reason: 'duplicate-definition', declarations: [...bodies, ...functions].map(item => item.id) });
        const aliases = items.filter(item => item.alias);
        if (aliases.length > 1) uncertainties.push({ context, name, reason: 'duplicate-alias-needs-target-compiler' });
        for (const kind of ['function', 'global', 'typedef']) {
          const typed = items.filter(item => item.kind === kind && item.supported);
          if (new Set(typed.map(item => item.signature)).size > 1) {
            if (typed.some(item => /\[\s*\]/.test(item.signature))) uncertainties.push({ context, name, reason: 'incomplete-array-type-needs-compiler' });
            else problems.push({ context, name, reason: 'supported-declaration-conflict', declarations: typed.map(item => item.id) });
          }
          if (typed.some(item => item.static) && typed.some(item => !item.static)) uncertainties.push({ context, name, reason: 'mixed-linkage-context' });
        }
      }
    }
    // An unreadable include in another active producer can conceal a consumer.
    for (const issue of issues) if (producers.has(issue.context) && !nominated.has(issue.context) && /include|conditional/.test(issue.reason)) uncertainties.push({ ...issue, reason: 'consumer-closure-unresolved:' + issue.reason });
    check = { kind: 'supported-textual-declaration-check', compilerChecked: false,
      status: problems.length ? 'conflict' : uncertainties.length ? 'incomplete' : 'supported-subset-clean', knownConsumers, problems, uncertainties };
  }
  return { schemaVersion: 1, generator: 'tools/declarations.js', scope: { targets: options.targets || [], headers: [...headers] },
    evidenceBoundary: ['Read-only token inventory; no preprocessing, compilation, layout calculation or semantic equivalence proof.',
      'Active target/group and linkage configuration are advisory inputs, not independently authenticated owner evidence.',
      'Include closure follows current literal source includes; macro/conditional resolution is incomplete. No depfile or grep-only closure claim.',
      'Function bodies are skipped. Complex declarators, attributes, packing, variadics and macro-dependent types remain unsupported.',
      'Matching/source-policy/ABI acceptance and mapped assembly callers remain separate checks.'],
    inputs: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)), producers: [...producers.values()],
    includeClosure: closures.filter(item => nominated.has(item.context) || [...headers].some(header => item.files.includes(header))),
    declarations: selected, relationships, issues: issues.filter(item => nominated.has(item.context) || headers.has(item.file)), check };
}

function parseArguments(argv) {
  const options = { targets: [], headers: [], json: false, check: false };
  for (let i = 0; i < argv.length; i++) {
    const argument = argv[i];
    if (argument === '--help' || argument === '-h') options.help = true;
    else if (argument === '--json') options.json = true;
    else if (argument === '--check') options.check = true;
    else if (argument === '--target' || argument === '--header') {
      const value = argv[++i]; if (!value || value.startsWith('--')) throw new Error(`missing ${argument} value`);
      options[argument === '--target' ? 'targets' : 'headers'].push(value);
    } else throw new Error(`unknown option: ${argument}`);
  }
  return options;
}

function formatHuman(report) {
  const lines = ['Declaration inventory (advisory; compilerChecked: false)', ...report.evidenceBoundary,
    `${report.producers.length} active producers inspected; ${report.declarations.length} scoped physical declarations.`];
  for (const item of report.relationships) {
    const aliasesOnly = item.locations.length > 8 && report.declarations.filter(declaration => declaration.name === item.name).every(declaration => declaration.kind === 'typedef');
    if (aliasesOnly) { lines.push(`${item.name}: ${item.locations.length} typedef declarations; ${item.classifications.join(', ')} (locations in --json)`); continue; }
    lines.push(`${item.name}: ${item.classifications.join(', ') || 'single declaration'}; ${item.opaqueForwards} opaque, ${item.taggedConcreteBodies} tagged bodies, ${item.anonymousTypedefBodies} anonymous alias bodies`);
    lines.push('  ' + item.locations.slice(0, 3).join(', ') + (item.locations.length > 3 ? ` (+${item.locations.length - 3}; see --json)` : ''));
    if (item.supportedSignatures.length > 1) lines.push('  signatures: ' + item.supportedSignatures.join(' | '));
    if (item.mappings.length) lines.push('  configured mapping: ' + JSON.stringify(item.mappings) + '; producer/overlay identity unresolved');
  }
  for (const issue of report.issues) lines.push(`UNSUPPORTED ${issue.file}:${issue.line}: ${issue.reason}`);
  for (const declaration of report.declarations) if (!declaration.supported) {
    lines.push(`UNSUPPORTED ${declaration.file}:${declaration.line}: ${declaration.reasons.join(', ')}`);
  }
  if (report.check) {
    lines.push(`Textual check: ${report.check.status}; ${report.check.problems.length} conflicts; ${report.check.uncertainties.length} unresolved.`);
    for (const issue of [...report.check.problems, ...report.check.uncertainties]) lines.push(`  ${issue.context}: ${issue.name || ''} ${issue.reason}`);
  }
  return lines.join('\n');
}

function main(argv) {
  const options = parseArguments(argv);
  if (options.help) { console.log('Usage: node tools/declarations.js [--target SYMBOL ...] [--header include/PATH.h ...] [--json] [--check]\nRead-only stdout. --check requires header and nominated consumers; exit 1 conflict, 2 incomplete/input error, 0 supported subset clean. No compiler or acceptance gate.'); return 0; }
  const report = inventory(options);
  console.log(options.json ? JSON.stringify(report, null, 2) : formatHuman(report));
  return report.check?.status === 'conflict' ? 1 : report.check?.status === 'incomplete' ? 2 : 0;
}

if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (error) { console.error('declarations: ' + error.message); process.exitCode = 2; }
}
module.exports = { tokenize, scanSource, normalizeDeclaration, repositoryPath, inventory, parseArguments, formatHuman, main };
