'use strict';

const crypto = require('crypto');

const DIALECT_SCHEMA_VERSION = 2;
const DIALECT_PROOF_SCHEMA_VERSION = 2;
const DIALECT_ID = 'kmc-compiler-assembly-dialect-v2';
const MOVE_RULE_ID = 'move-numeric-gpr-gpr-to-addu-zero';
const LA_JAL_RULE_ID = 'la-gpr4-undefined-bare-symbol-direct-jal-delay-slot';
const DIALECT_RULES = Object.freeze([
  Object.freeze({
    id: MOVE_RULE_ID,
    sourceClass: 'PURE_C',
    input: 'unlabeled-complete-move-numeric-gpr-gpr',
    output: 'addu-destination-source-zero',
  }),
  Object.freeze({
    id: LA_JAL_RULE_ID,
    sourceClass: 'PURE_C',
    addressRegister: '$4',
    addressSymbol: 'undefined-bare-symbol',
    call: 'next-emitted-unlabeled-direct-jal-bare-symbol',
    requiredModes: Object.freeze(['reorder', 'macro', 'novolatile']),
    output: Object.freeze([
      'lui $4,%hi(address-symbol)',
      'jal call-target',
      'addiu $4,$4,%lo(address-symbol)',
    ]),
    assemblerModeGuard: Object.freeze(['noreorder', 'reorder']),
  }),
]);
const DIALECT_RULE_IDS = Object.freeze(DIALECT_RULES.map((rule) => rule.id));
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
  'rules',
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
  const labels = [];
  while (text) {
    const label = /^[A-Za-z_.$][A-Za-z0-9_.$]*:[ \t]*/.exec(text);
    if (!label) break;
    labels.push(label[0].slice(0, label[0].indexOf(':')));
    text = text.slice(label[0].length);
  }
  return { hadLabel: labels.length > 0, labels, text };
}

function emptyRuleTransformations() {
  return Object.fromEntries(DIALECT_RULE_IDS.map((ruleId) => [ruleId, 0]));
}

function totalRuleTransformations(ruleTransformations) {
  if (!ruleTransformations || typeof ruleTransformations !== 'object' || Array.isArray(ruleTransformations)
      || !sameJson(Object.keys(ruleTransformations), DIALECT_RULE_IDS)
      || Object.values(ruleTransformations).some((count) => !Number.isInteger(count) || count < 0)) {
    fail('compiler-assembly dialect per-rule transformation counts are malformed');
  }
  return Object.values(ruleTransformations).reduce((sum, count) => sum + count, 0);
}

function parseCompilerLines(text) {
  return splitLines(text).map((line) => {
    const scanned = scanLine(line.body);
    if (scanned.semicolon) fail('PURE_C compiler assembly contains a semicolon statement');
    return { ...line, scanned, statement: instructionText(scanned.code) };
  });
}

function collectDefinedSymbols(lines) {
  const defined = new Set();
  const symbol = '[A-Za-z_.$][A-Za-z0-9_.$]*';
  const definingDirective = new RegExp(`^\\.(?:comm|lcomm|equ|equiv|eqv)[ \\t]+(${symbol})(?:[ \\t]*,|[ \\t]+)`, 'i');
  const setDefinition = new RegExp(`^\\.set[ \\t]+(${symbol})[ \\t]*,`, 'i');
  const assignmentDefinition = new RegExp(`^(${symbol})[ \\t]*=`);
  for (const line of lines) {
    for (const label of line.statement.labels) defined.add(label);
    const directive = definingDirective.exec(line.statement.text)
      || setDefinition.exec(line.statement.text)
      || assignmentDefinition.exec(line.statement.text);
    if (directive) defined.add(directive[1]);
  }
  return defined;
}

function updateAssemblerMode(statement, mode) {
  const match = /^\.set[ \t]+(.+?)[ \t]*$/i.exec(statement);
  if (!match) return false;
  const setting = match[1].toLowerCase();
  if (setting === 'reorder') mode.reorder = true;
  else if (setting === 'noreorder') mode.reorder = false;
  else if (setting === 'macro') mode.macro = true;
  else if (setting === 'nomacro') mode.macro = false;
  else if (setting === 'at') mode.at = true;
  else if (setting === 'noat') mode.at = false;
  else if (setting === 'volatile') mode.volatile = true;
  else if (setting === 'novolatile') mode.volatile = false;
  else if (/^[A-Za-z_.$][A-Za-z0-9_.$]*[ \t]*,/.test(match[1])) return true;
  else fail(`PURE_C compiler assembly contains unsupported .set mode transition: ${match[1]}`);
  return true;
}

function mnemonicOf(statement) {
  const match = /^([A-Za-z][A-Za-z0-9_.]*)\b/.exec(statement);
  return match ? match[1].toLowerCase() : null;
}

function validateLaStatement(line) {
  const code = line.statement.hadLabel ? line.statement.text : line.scanned.code;
  const match = /^([ \t]*)la([ \t]+)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*,[ \t]*)([^,\s](?:[^,]*[^,\s])?)([ \t]*)$/i.exec(code);
  if (!match) fail('PURE_C la must use one canonical numeric GPR and one nonempty comma-free address operand');
  return {
    indentation: match[1],
    register: match[3],
    separator: match[4],
    operand: match[5],
    trailingWhitespace: match[6],
  };
}

function validateJalStatement(line) {
  const code = line.statement.hadLabel ? line.statement.text : line.scanned.code;
  const match = /^([ \t]*)jal([ \t]+)([^,\s](?:[^,]*[^,\s])?)([ \t]*)$/i.exec(code);
  if (!match) fail('PURE_C jal must use one nonempty comma-free direct target operand');
  return {
    indentation: match[1],
    operand: match[3],
    trailingWhitespace: match[4],
  };
}

function nextEmittedStatement(lines, start) {
  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.statement.hadLabel || line.statement.text) return index;
  }
  return -1;
}

function renderLaJalSequence(lines, laIndex, jalIndex, la, addressSymbol) {
  const laLine = lines[laIndex];
  const jalLine = lines[jalIndex];
  const laEnding = laLine.ending || jalLine.ending || '\n';
  const jalInternalEnding = jalLine.ending || laEnding;
  const output = [
    `${la.indentation}.set\tnoreorder`, laEnding,
    `${la.indentation}lui\t$4,%hi(${addressSymbol})${la.trailingWhitespace}${laLine.scanned.comment}`, laEnding,
  ];
  for (let index = laIndex + 1; index < jalIndex; index += 1) {
    output.push(lines[index].body, lines[index].ending);
  }
  output.push(
    jalLine.body, jalInternalEnding,
    `${la.indentation}addiu\t$4,$4,%lo(${addressSymbol})`, jalInternalEnding,
    `${la.indentation}.set\treorder`, jalLine.ending,
  );
  return output;
}

function transformPureCompilerAssembly(value) {
  const text = decodeUtf8Exact(value, 'PURE_C compiler assembly');
  if (/#(?:APP|NO_APP)\b/.test(text)) {
    fail('PURE_C compiler assembly contains #APP or #NO_APP');
  }
  const markers = markerDiagnostics(value);

  const lines = parseCompilerLines(text);
  const definedSymbols = collectDefinedSymbols(lines);
  const output = [];
  const ruleTransformations = emptyRuleTransformations();
  let explicitOrStatementCount = 0;
  const mode = { reorder: true, macro: true, at: true, volatile: false };
  const prohibitedDirective = /^\.(?:macro|endm|if|ifdef|ifndef|ifc|ifnc|elseif|else|endif|rept|irp|irpc|endr)\b/i;
  const prohibitedConfigurationDirective = /^\.(?:abicalls|cpload|cprestore|cpadd|gpword|gpdword|option|module|insn)\b/i;
  const prohibitedMnemonic = /^(?:mov\.(?:s|d|ps)|d?m[ft]c[0-3]|c[ft]c[0-3])$/i;
  const numericMove = /^([ \t]*)move([ \t]+)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*,[ \t]*)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*)$/i;
  const bareSymbol = /^[A-Za-z_.$][A-Za-z0-9_.$]*$/;
  const numericRegisterToken = /^\$(?:0|[1-9]|[12][0-9]|3[01])$/;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const { scanned, statement } = line;
    if (!statement.text) {
      output.push(line.body, line.ending);
      continue;
    }
    if (prohibitedDirective.test(statement.text)) {
      fail('PURE_C compiler assembly contains a macro or conditional directive');
    }
    if (prohibitedConfigurationDirective.test(statement.text)) {
      fail('PURE_C compiler assembly contains an unsupported configuration directive');
    }
    if (updateAssemblerMode(statement.text, mode)) {
      output.push(line.body, line.ending);
      continue;
    }
    const mnemonic = mnemonicOf(statement.text);
    if (!mnemonic) {
      output.push(line.body, line.ending);
      continue;
    }
    if (prohibitedMnemonic.test(mnemonic)) {
      fail(`PURE_C compiler assembly contains unsupported move syntax: ${mnemonic}`);
    }
    if (mnemonic === 'or') explicitOrStatementCount += 1;

    if (mnemonic === 'la') {
      const la = validateLaStatement(line);
      const jalIndex = nextEmittedStatement(lines, index + 1);
      if (!statement.hadLabel && la.register === '$4' && bareSymbol.test(la.operand)
          && !numericRegisterToken.test(la.operand)
          && !definedSymbols.has(la.operand) && mode.reorder && mode.macro && !mode.volatile
          && jalIndex >= 0) {
        const jalLine = lines[jalIndex];
        if (mnemonicOf(jalLine.statement.text) === 'jal') {
          const jal = validateJalStatement(jalLine);
          if (!jalLine.statement.hadLabel && bareSymbol.test(jal.operand)
              && !numericRegisterToken.test(jal.operand)) {
            output.push(...renderLaJalSequence(lines, index, jalIndex, la, la.operand));
            ruleTransformations[LA_JAL_RULE_ID] += 1;
            index = jalIndex;
            continue;
          }
        }
      }
      output.push(line.body, line.ending);
      continue;
    }

    if (mnemonic === 'jal') validateJalStatement(line);
    if (mnemonic === 'move') {
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
      ruleTransformations[MOVE_RULE_ID] += 1;
      continue;
    }
    output.push(line.body, line.ending);
  }

  const transformationCount = totalRuleTransformations(ruleTransformations);

  return {
    output: Buffer.from(output.join(''), 'utf8'),
    sourceClass: ELIGIBLE_CLASS,
    eligible: true,
    action: 'versioned-compiler-assembly-adaptation',
    bypassReason: null,
    transformationCount,
    ruleTransformations,
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
      ruleTransformations: emptyRuleTransformations(),
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
    schemaVersion: DIALECT_SCHEMA_VERSION,
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
    rules: DIALECT_RULES,
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
  const transformationCount = totalRuleTransformations(input.decision.ruleTransformations);
  if (input.decision.transformationCount !== transformationCount) {
    fail('dialect proof total transformation count differs from its per-rule counts');
  }
  return {
    schemaVersion: DIALECT_PROOF_SCHEMA_VERSION,
    generator: 'tools/build_phase8_matching_c.js',
    target: input.targetSymbol,
    dialect: {
      id: input.dialect.id,
      rules: input.dialect.rules,
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
      ruleTransformations: input.decision.ruleTransformations,
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
  DIALECT_PROOF_SCHEMA_VERSION,
  DIALECT_RULE_IDS,
  DIALECT_RULES,
  DIALECT_SCHEMA_VERSION,
  ELIGIBLE_CLASS,
  HYBRID_CLASS,
  LA_JAL_RULE_ID,
  MANIFEST_KEYS,
  MOVE_RULE_ID,
  UNKNOWN_CLASS,
  adjustSectionAssembly,
  applyCompilerAssemblyDialect,
  buildDialectProof,
  markerDiagnostics,
  serializeDialectProof,
  sha256Buffer,
  totalRuleTransformations,
  validateDialectManifest,
};
