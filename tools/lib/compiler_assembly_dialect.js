'use strict';

const crypto = require('crypto');

const DIALECT_ID = 'kmc-gpr-move-addu-v1';
const DIALECT_RULE = 'move-numeric-gpr-gpr-to-addu-zero';
const ELIGIBLE_CLASS = 'PURE_C';
const HYBRID_CLASS = 'HYBRID_C';
const UNKNOWN_CLASS = 'UNKNOWN';

const MANIFEST_KEYS = [
  'assemblerConfigSha256',
  'assemblerExecutableSha256',
  'assemblerFlags',
  'assemblerVersion',
  'compileFlags',
  'compilerExecutableSha256',
  'compilerManifestSha256',
  'eligibilityClass',
  'hybridAction',
  'id',
  'implementationPath',
  'implementationSha256',
  'rule',
  'schemaVersion',
  'unknownAction',
  'unsupportedSyntax',
].sort();

function fail(message) {
  throw new Error(message);
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function sha256Buffer(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function requireBuffer(value, label) {
  if (!Buffer.isBuffer(value)) fail(`${label} must be a Buffer`);
  return value;
}

function decodeUtf8Exact(value, label) {
  const bytes = requireBuffer(value, label);
  const text = bytes.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(bytes)) fail(`${label} is not exact UTF-8 text`);
  return text;
}

function splitLines(text) {
  const lines = [];
  let start = 0;
  let index = 0;
  while (index < text.length) {
    if (text[index] !== '\r' && text[index] !== '\n') {
      index += 1;
      continue;
    }
    let ending = text[index];
    if (text[index] === '\r' && text[index + 1] === '\n') {
      ending = '\r\n';
      index += 1;
    }
    lines.push({ body: text.slice(start, index + 1 - ending.length), ending });
    index += 1;
    start = index;
  }
  if (start < text.length) lines.push({ body: text.slice(start), ending: '' });
  return lines;
}

function scanLine(body) {
  let quote = null;
  let escaped = false;
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '#') return { code: body.slice(0, index), comment: body.slice(index), semicolon: false };
    if (char === ';') return { code: body, comment: '', semicolon: true };
  }
  if (quote) fail('compiler assembly contains an unterminated quoted token');
  return { code: body, comment: '', semicolon: false };
}

function markerDiagnostics(value) {
  const text = requireBuffer(value, 'compiler assembly').toString('latin1');
  let appMarkerCount = 0;
  let noAppMarkerCount = 0;
  let explicitOrStatementCount = 0;
  for (const line of text.split(/\r\n|\n|\r/)) {
    const marker = /^[ \t]*#(APP|NO_APP)[ \t]*$/.exec(line);
    if (marker) {
      if (marker[1] === 'APP') appMarkerCount += 1;
      else noAppMarkerCount += 1;
    }
    if (/^[ \t]*or[ \t]/i.test(line)) explicitOrStatementCount += 1;
  }
  return { appMarkerCount, noAppMarkerCount, inlineRegionCount: appMarkerCount, explicitOrStatementCount };
}

function instructionText(code) {
  let text = code.trim();
  let hadLabel = false;
  while (text) {
    const label = /^[A-Za-z_.$][A-Za-z0-9_.$]*:[ \t]*/.exec(text);
    if (!label) break;
    hadLabel = true;
    text = text.slice(label[0].length);
  }
  return { hadLabel, text };
}

function transformPureCompilerAssembly(value) {
  const text = decodeUtf8Exact(value, 'PURE_C compiler assembly');
  if (/#(?:APP|NO_APP)\b/.test(text)) {
    fail('PURE_C compiler assembly contains #APP or #NO_APP');
  }
  const markers = markerDiagnostics(value);

  const lines = splitLines(text);
  const output = [];
  let transformationCount = 0;
  let explicitOrStatementCount = 0;
  const prohibitedDirective = /^\.(?:macro|endm|if|ifdef|ifndef|ifc|ifnc|elseif|else|endif|rept|irp|irpc|endr)\b/i;
  const prohibitedMnemonic = /^(?:mov\.(?:s|d|ps)|d?m[ft]c[0-3]|c[ft]c[0-3])$/i;
  const numericMove = /^([ \t]*)move([ \t]+)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*,[ \t]*)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*)$/i;

  for (const line of lines) {
    const scanned = scanLine(line.body);
    if (scanned.semicolon) fail('PURE_C compiler assembly contains a semicolon statement');
    const statement = instructionText(scanned.code);
    if (!statement.text) {
      output.push(line.body, line.ending);
      continue;
    }
    if (prohibitedDirective.test(statement.text)) {
      fail('PURE_C compiler assembly contains a macro or conditional directive');
    }
    const mnemonicMatch = /^([A-Za-z][A-Za-z0-9_.]*)\b/.exec(statement.text);
    if (!mnemonicMatch) {
      output.push(line.body, line.ending);
      continue;
    }
    const mnemonic = mnemonicMatch[1].toLowerCase();
    if (prohibitedMnemonic.test(mnemonic)) {
      fail(`PURE_C compiler assembly contains unsupported move syntax: ${mnemonic}`);
    }
    if (mnemonic === 'or') explicitOrStatementCount += 1;
    if (mnemonic !== 'move') {
      output.push(line.body, line.ending);
      continue;
    }
    if (statement.hadLabel) fail('PURE_C move must be one complete unlabeled statement');
    const match = numericMove.exec(scanned.code);
    if (!match) fail('PURE_C move must use two canonical numeric GPR operands from $0 through $31');
    output.push(
      match[1],
      'addu',
      match[2],
      match[3],
      match[4],
      match[5],
      ',$0',
      match[6],
      scanned.comment,
      line.ending,
    );
    transformationCount += 1;
  }

  return {
    output: Buffer.from(output.join(''), 'utf8'),
    sourceClass: ELIGIBLE_CLASS,
    eligible: true,
    action: 'numeric-gpr-move-adaptation',
    bypassReason: null,
    transformationCount,
    inlineRegionCount: 0,
    appMarkerCount: 0,
    noAppMarkerCount: 0,
    explicitOrStatementCount,
    unsupportedSyntaxCount: 0,
  };
}

function applyCompilerAssemblyDialect(compilerAssembly, sourceClass) {
  if (arguments.length !== 2) fail('dialect transformer accepts only compiler assembly bytes and source class');
  const input = requireBuffer(compilerAssembly, 'compiler assembly');
  if (sourceClass === UNKNOWN_CLASS) fail('UNKNOWN source class rejects before adaptation');
  if (sourceClass === HYBRID_CLASS) {
    const diagnostics = markerDiagnostics(input);
    return {
      output: Buffer.from(input),
      sourceClass,
      eligible: false,
      action: 'byte-identical-passthrough',
      bypassReason: 'HYBRID_C is opaque compiler assembly',
      transformationCount: 0,
      unsupportedSyntaxCount: 0,
      ...diagnostics,
    };
  }
  if (sourceClass !== ELIGIBLE_CLASS) fail(`unsupported source class rejects before adaptation: ${sourceClass}`);
  return transformPureCompilerAssembly(input);
}

function adjustSectionAssembly(dialectAssembly, sectionName) {
  if (arguments.length !== 2) fail('section adjustment accepts only dialect assembly and section name');
  if (typeof sectionName !== 'string' || !/^\.ob64\.r[0-9]+(?:\.s[0-9]+)?$/.test(sectionName)) {
    fail('target section name is malformed');
  }
  const text = decodeUtf8Exact(dialectAssembly, 'dialect assembly');
  const textMatches = text.match(/^[ \t]*\.text[ \t]*\r?$/gm) || [];
  if (textMatches.length !== 1 || /^\s*\.section\b/m.test(text)) fail('KMC target assembly section grammar drift');
  return Buffer.from(text.replace(
    /^[ \t]*\.text[ \t]*(\r?)$/m,
    (_, carriageReturn) => `.section ${sectionName},"ax",@progbits${carriageReturn}`,
  ), 'utf8');
}

function validateDialectManifest(manifest, contract) {
  if (arguments.length !== 2 || !manifest || typeof manifest !== 'object' || Array.isArray(manifest)
      || !contract || typeof contract !== 'object' || Array.isArray(contract)) {
    fail('dialect manifest validation contract is malformed');
  }
  if (!sameJson(Object.keys(manifest).sort(), MANIFEST_KEYS)) fail('compiler-assembly dialect manifest schema drift');
  const expected = {
    schemaVersion: 1,
    id: DIALECT_ID,
    eligibilityClass: ELIGIBLE_CLASS,
    hybridAction: 'byte-identical-passthrough',
    unknownAction: 'reject',
    compilerManifestSha256: contract.compilerManifestSha256,
    compilerExecutableSha256: contract.compilerExecutableSha256,
    compileFlags: contract.compileFlags,
    assemblerConfigSha256: contract.assemblerConfigSha256,
    assemblerExecutableSha256: contract.assemblerExecutableSha256,
    assemblerVersion: contract.assemblerVersion,
    assemblerFlags: contract.assemblerFlags,
    rule: DIALECT_RULE,
    unsupportedSyntax: 'reject',
    implementationPath: contract.implementationPath,
    implementationSha256: contract.implementationSha256,
  };
  for (const key of MANIFEST_KEYS) {
    if (!sameJson(manifest[key], expected[key])) fail(`compiler-assembly dialect manifest ${key} drift`);
  }
  return manifest;
}

function buildDialectProof(input) {
  if (arguments.length !== 1 || !input || typeof input !== 'object' || Array.isArray(input)) {
    fail('dialect proof input is malformed');
  }
  return {
    schemaVersion: 1,
    generator: 'tools/build_phase8_matching_c.js',
    target: input.targetSymbol,
    dialect: {
      id: input.dialect.id,
      rule: input.dialect.rule,
      manifestPath: input.dialect.manifestPath,
      manifestSha256: input.dialect.manifestSha256,
      implementationPath: input.dialect.implementationPath,
      implementationSha256: input.dialect.implementationSha256,
    },
    sourcePolicy: {
      class: input.classification.class,
      digest: input.classification.digest,
      configSha256: input.sourcePolicyConfigSha256,
    },
    eligibility: {
      eligible: input.decision.eligible,
      action: input.decision.action,
      bypassReason: input.decision.bypassReason,
    },
    artifacts: input.artifacts,
    toolchain: {
      compiler: input.compiler,
      assembler: input.assembler,
    },
    counts: {
      transformationCount: input.decision.transformationCount,
      inlineRegionCount: input.decision.inlineRegionCount,
      appMarkerCount: input.decision.appMarkerCount,
      noAppMarkerCount: input.decision.noAppMarkerCount,
      explicitOrStatementCount: input.decision.explicitOrStatementCount,
      unsupportedSyntaxCount: input.decision.unsupportedSyntaxCount,
    },
    finalObject: input.finalObject,
    finalTarget: input.finalTarget,
  };
}

function serializeDialectProof(proof) {
  return Buffer.from(`${JSON.stringify(proof, null, 2)}\n`, 'utf8');
}

module.exports = {
  DIALECT_ID,
  DIALECT_RULE,
  ELIGIBLE_CLASS,
  HYBRID_CLASS,
  MANIFEST_KEYS,
  UNKNOWN_CLASS,
  adjustSectionAssembly,
  applyCompilerAssemblyDialect,
  buildDialectProof,
  markerDiagnostics,
  serializeDialectProof,
  sha256Buffer,
  validateDialectManifest,
};
