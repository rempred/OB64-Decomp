'use strict';
// Conservative C90 compatibility descriptors from Clang's adjusted parameter AST.
// Unknown is not compatible. AST allocation IDs never enter persisted identities.
const crypto = require('crypto');
const hash = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').toUpperCase();

function split(s) {
  const out = [];
  let depth = 0,
    start = 0;
  for (let i = 0; i < s.length; i++) {
    if ('(['.includes(s[i])) depth++;
    else if (')]'.includes(s[i])) depth--;
    else if (s[i] === ',' && depth === 0) {
      out.push(s.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(s.slice(start).trim());
  return out;
}

function unknown(reason, spelling) {
  return {
    kind: 'unknown',
    reason,
    spelling: spelling?.replace(/at (?:[A-Za-z]:)?[^()]*?:(\d+):(\d+)/g, 'at <expanded-source>:$1:$2')
  };
}

function createResolver(ast) {
  const nodes = new Map(),
    aliases = new Map(),
    namedRecords = new Map(),
    recordIds = new Map(),
    records = {},
    building = new Set();
  let recordNumber = 0;

  function walk(n) {
    if (n.id) nodes.set(n.id, n);
    if (n.kind === 'TypedefDecl' && !n.isImplicit) {
      const a = aliases.get(n.name) || [];
      a.push(n);
      aliases.set(n.name, a);
    }
    for (const x of n.inner || []) walk(x);
  }
  walk(ast);

  function family(n) {
    let root = n;
    const seen = new Set();
    while (root.previousDecl && nodes.has(root.previousDecl) && !seen.has(root.id)) {
      seen.add(root.id);
      root = nodes.get(root.previousDecl);
    }
    return root.id;
  }
  for (const n of nodes.values())
    if (n.kind === 'RecordDecl') {
      const f = family(n);
      if (!recordIds.has(f)) recordIds.set(f, 'r' + recordNumber++);
      recordIds.set(n.id, recordIds.get(f));
      if (n.name) {
        const a = namedRecords.get(n.tagUsed + ' ' + n.name) || new Set();
        a.add(recordIds.get(f));
        namedRecords.set(n.tagUsed + ' ' + n.name, a);
      }
    }
  const recordDefs = new Map();
  for (const n of nodes.values())
    if (n.kind === 'RecordDecl') {
      const key = recordIds.get(n.id),
        prior = recordDefs.get(key);
      if (!prior || n.completeDefinition) recordDefs.set(key, n);
    }

  function record(key) {
    if (!key) return unknown('unresolved-record');
    if (records[key] || building.has(key)) return {
      kind: 'record',
      key
    };
    const n = recordDefs.get(key);
    if (!n) return unknown('missing-record');
    building.add(key);
    const named = n.name ? namedRecords.get(n.tagUsed + ' ' + n.name) : null;
    const row = {
      tag: n.name || null,
      tagKind: n.tagUsed || 'struct',
      ambiguous: !!named && named.size !== 1,
      complete: !!n.completeDefinition,
      fields: [],
      attributes: (n.inner || []).filter(x => /Attr$/.test(x.kind)).map(x => x.kind)
    };
    records[key] = row;
    for (const f of (n.inner || []).filter(x => x.kind === 'FieldDecl')) {
      let width = null;
      if (f.isBitfield) {
        const value = (f.inner || []).find(x => x.kind === 'ConstantExpr');
        if (value?.value === undefined) width = 'unknown';
        else width = String(value.value);
      }
      row.fields.push({
        name: f.name || null,
        type: resolve(f.type),
        bitWidth: width,
        attributes: (f.inner || []).filter(x => /Attr$/.test(x.kind)).map(x => x.kind)
      });
    }
    building.delete(key);
    return {
      kind: 'record',
      key
    };
  }

  function fromNode(n, seen) {
    if (!n) return unknown('missing-type-node');
    if (n.kind === 'RecordType') return record(recordIds.get(n.decl?.id));
    if (n.kind === 'PointerType') return {
      kind: 'pointer',
      qual: [],
      to: fromNode(n.inner?.[0], seen)
    };
    if (n.kind === 'FunctionProtoType' || n.kind === 'FunctionNoProtoType') return {
      kind: 'function',
      mode: n.kind === 'FunctionNoProtoType' ? 'unspecified' : 'fixed',
      variadic: !!n.variadic,
      result: fromNode(n.inner?.[0], seen),
      params: (n.inner || []).slice(1).map(x => fromNode(x, seen))
    };
    if (n.kind === 'ConstantArrayType' || n.kind === 'IncompleteArrayType') return {
      kind: 'array',
      length: n.kind === 'IncompleteArrayType' ? null : String(n.size),
      of: fromNode(n.inner?.[0], seen)
    };
    if (['ElaboratedType', 'ParenType'].includes(n.kind) && n.inner?.length === 1) return fromNode(n.inner[0],
      seen);
    if (n.kind === 'TypedefType' && n.decl?.id) {
      const alias = nodes.get(n.decl.id);
      if (alias && !seen.has(alias.id)) {
        const next = new Set(seen);
        next.add(alias.id);
        return fromNode(alias.inner?.[0], next);
      }
    }
    return parse(n.type?.desugaredQualType || n.type?.qualType || '', seen);
  }

  function parse(s, seen = new Set()) {
    s = s.trim().replace(/\s+/g, ' ');
    if (!s) return unknown('missing-type');
    const fp = s.match(/^(.*?)\(\s*\*\s*((?:(?:const|volatile|restrict)\s*)*)\)\s*\((.*)\)$/);
    if (fp) {
      const ps = split(fp[3]);
      return {
        kind: 'pointer',
        qual: fp[2].trim().split(/\s+/).filter(Boolean).sort(),
        to: {
          kind: 'function',
          mode: fp[3].trim() === '' ? 'unspecified' : 'fixed',
          variadic: ps.at(-1) === '...',
          result: parse(fp[1], seen),
          params: ps.length === 1 && ps[0] === 'void' ? [] : ps.filter(x => x && x !== '...').map(x => parse(
            x, seen))
        }
      };
    }
    const arrayPointer = s.match(
      /^(.*?)\(\s*\*\s*((?:(?:const|volatile|restrict)\s*)*)\)\s*((?:\[\s*\d*\s*\])+)$/);
    if (arrayPointer) return {
      kind: 'pointer',
      qual: arrayPointer[2].trim().split(/\s+/).filter(Boolean).sort(),
      to: parse(arrayPointer[1] + arrayPointer[3], seen)
    };
    const array = s.match(/^(.*?)\[\s*(\d*)\s*\]((?:\[\s*\d*\s*\])*)$/);
    if (array) return {
      kind: 'array',
      length: array[2] || null,
      of: parse(array[1] + array[3], seen)
    };
    if (/[()[\]]/.test(s)) return unknown('unsupported-declarator', s);
    const p = s.match(/^(.*)\*\s*((?:(?:const|volatile|restrict)\s*)*)$/);
    if (p) return {
      kind: 'pointer',
      qual: p[2].trim().split(/\s+/).filter(Boolean).sort(),
      to: parse(p[1], seen)
    };
    const qual = (s.match(/\b(const|volatile|restrict)\b/g) || []).sort();
    s = s.replace(/\b(const|volatile|restrict)\b/g, '').trim().replace(/\s+/g, ' ');
    if (/^(struct|union) \w+$/.test(s)) {
      const keys = namedRecords.get(s);
      return keys?.size === 1 ? {
        ...record([...keys][0]),
        qual
      } : unknown('ambiguous-or-missing-tag', s);
    }
    if (aliases.has(s)) {
      const a = aliases.get(s);
      if (a.length !== 1 || seen.has(a[0].id)) return unknown('ambiguous-or-recursive-typedef', s);
      const next = new Set(seen);
      next.add(a[0].id);
      const d = fromNode(a[0].inner?.[0], next);
      return {
        ...d,
        qual: [...(d.qual || []), ...qual].sort()
      };
    }
    if (
      /^(void|char|signed char|unsigned char|short(?: int)?|signed short(?: int)?|unsigned short(?: int)?|int|signed(?: int)?|unsigned(?: int)?|long(?: int)?|signed long(?: int)?|unsigned long(?: int)?|long long(?: int)?|signed long long(?: int)?|unsigned long long(?: int)?|float|double|long double|_Bool)$/
      .test(s)) {
      s = s.replace(/^signed (?!char)/, '').replace(/^signed$/, 'int').replace(/^unsigned$/, 'unsigned int')
        .replace(/\b(short|long|long long) int$/, '$1');
      return {
        kind: s === 'void' ? 'void' : 'primitive',
        name: s,
        qual
      };
    }
    return unknown('unsupported-type', s);
  }

  function resolve(type) {
    if (type?.typeAliasDeclId && nodes.has(type.typeAliasDeclId)) {
      const n = nodes.get(type.typeAliasDeclId),
        spelling = type.qualType || '',
        quals = (spelling.match(/\b(const|volatile|restrict)\b/g) || []).sort();
      if (spelling.replace(/\b(const|volatile|restrict)\b/g, '').trim() === n.name) {
        const d = fromNode(n.inner?.[0], new Set([n.id]));
        return {
          ...d,
          qual: [...(d.qual || []), ...quals].sort()
        };
      }
    }
    return parse(type?.desugaredQualType || type?.qualType || '');
  }

  function signature(n) {
    const q = n.type?.qualType || '',
      i = q.indexOf('('),
      ps = (n.inner || []).filter(x => x.kind === 'ParmVarDecl');
    const body = (n.inner || []).find(x => x.kind === 'CompoundStmt');
    return {
      kind: 'function',
      result: i < 0 || /^\(\s*\*/.test(q.slice(i)) ? unknown('unsupported-function-result-declarator', q) :
        parse(q.slice(0, i)),
      params: ps.map(p => resolve(p.type)),
      mode: n.variadic ? 'fixed' : /\(\)$/.test(q) ? body ? 'definition-empty' : 'unspecified' : 'fixed',
      variadic: !!n.variadic
    };
  }

  function canonical(shape) {
    const seen = new Map();

    function render(x) {
      if (x?.kind === 'record') {
        if (seen.has(x.key)) return {
          kind: 'record-reference',
          ordinal: seen.get(x.key),
          qual: x.qual || []
        };
        const ordinal = seen.size;
        seen.set(x.key, ordinal);
        const r = records[x.key];
        return {
          kind: 'record',
          ordinal,
          qual: x.qual || [],
          ...r,
          fields: r?.fields.map(f => ({
            ...f,
            type: render(f.type)
          }))
        };
      }
      if (x?.kind === 'pointer') return {
        ...x,
        to: render(x.to)
      };
      if (x?.kind === 'array') return {
        ...x,
        of: render(x.of)
      };
      if (x?.kind === 'function') return {
        ...x,
        result: render(x.result),
        params: x.params.map(render)
      };
      return x;
    }
    return render(shape);
  }
  const fingerprints = new Map();

  function metadata(shape) {
    const key = JSON.stringify(shape);
    if (!fingerprints.has(key)) {
      const value = canonical(shape);
      fingerprints.set(key, {
        fingerprint: hash(value),
        complete: !JSON.stringify(value).includes('\"kind\":\"unknown\"')
      });
    }
    return fingerprints.get(key);
  }

  function fingerprint(shape) {
    return metadata(shape).fingerprint;
  }

  function complete(shape) {
    return metadata(shape).complete;
  }
  return {
    resolve,
    signature,
    records,
    canonical,
    fingerprint,
    complete
  };
}

function compare(left, right, leftRecords = {}, rightRecords = {}, parameter = false, seen = new Set()) {
  if (!left || !right || left.kind === 'unknown' || right.kind === 'unknown') return 'unknown';
  // Only the top-level parameter qualifiers are adjusted away. Pointee and
  // nested member qualifiers still participate in declaration compatibility.
  if (!parameter && JSON.stringify(left.qual || []) !== JSON.stringify(right.qual || [])) {
    return 'incompatible';
  }
  if (left.kind !== right.kind) return 'incompatible';
  if (left.kind === 'pointer') {
    return compare(left.to, right.to, leftRecords, rightRecords, false, seen);
  }
  if (left.kind === 'array') {
    if (left.length !== null && right.length !== null && left.length !== right.length) return 'incompatible';
    return compare(left.of, right.of, leftRecords, rightRecords, false, seen);
  }
  if (left.kind === 'record') {
    const leftRecord = leftRecords[left.key];
    const rightRecord = rightRecords[right.key];
    if (!leftRecord || !rightRecord || leftRecord.ambiguous || rightRecord.ambiguous) return 'unknown';
    // Within one AST, distinct record declarations are distinct C types. The
    // C90 structural rule below applies across translation units, not to a cast
    // between two separate same-TU records that happen to have equal members.
    if (leftRecords === rightRecords) return left.key === right.key ? 'compatible' : 'incompatible';
    if (leftRecord.attributes.length || rightRecord.attributes.length) return 'unknown';
    // C90 cross-translation-unit compatibility uses complete member evidence;
    // different tag spellings alone do not establish an incompatibility.
    if (leftRecord.tagKind !== rightRecord.tagKind) return 'incompatible';
    if (!leftRecord.complete || !rightRecord.complete) return 'unknown';
    const pair = left.key + ':' + right.key;
    if (seen.has(pair)) return 'compatible';
    const next = new Set(seen);
    next.add(pair);
    if (leftRecord.fields.length !== rightRecord.fields.length) return 'incompatible';
    const isUnion = leftRecord.tagKind === 'union';
    if (isUnion && (leftRecord.fields.some(field => field.name === null) ||
        new Set(leftRecord.fields.map(field => field.name)).size !== leftRecord.fields.length ||
        new Set(rightRecord.fields.map(field => field.name)).size !== rightRecord.fields.length)) {
      return 'unknown';
    }
    const results = [];
    for (let index = 0; index < leftRecord.fields.length; index++) {
      const leftField = leftRecord.fields[index];
      const rightField = isUnion
        ? rightRecord.fields.find(field => field.name === leftField.name)
        : rightRecord.fields[index];
      if (!rightField || leftField.name !== rightField.name || leftField.bitWidth !== rightField.bitWidth) {
        return 'incompatible';
      }
      if (leftField.bitWidth === 'unknown' || leftField.attributes.length || rightField.attributes.length) {
        results.push('unknown');
      } else {
        results.push(compare(leftField.type, rightField.type, leftRecords, rightRecords, false, next));
      }
    }
    return combine(results);
  }
  if (left.kind === 'function') {
    // An unprototyped declaration does not prove its promoted argument types.
    if (left.mode === 'unspecified' || right.mode === 'unspecified') return 'unknown';
    if (left.variadic !== right.variadic || left.params.length !== right.params.length) return 'incompatible';
    const results = [compare(left.result, right.result, leftRecords, rightRecords, false, seen)];
    for (let index = 0; index < left.params.length; index++) {
      results.push(compare(left.params[index], right.params[index], leftRecords, rightRecords, true, seen));
    }
    return combine(results);
  }
  return left.name === right.name ? 'compatible' : 'incompatible';
}

function combine(rs) {
  return rs.includes('incompatible') ? 'incompatible' : rs.includes('unknown') ? 'unknown' : 'compatible';
}
module.exports = {
  createResolver,
  compare,
  combine,
  hash
};
