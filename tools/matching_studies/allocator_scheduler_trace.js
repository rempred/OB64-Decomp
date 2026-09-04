#!/usr/bin/env node
'use strict';

// Research-only compiler trace for the allocator return-save / owner-load
// scheduling decision. The authenticated compiler remains the production
// oracle; output produced by the instrumented compiler is never a candidate.

const childProcess = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {
  CASES,
  FOCUSED_VARIANTS,
  canonicalEmittedState,
} = require('./allocator_owner_order');
const {
  compileScratchCandidate,
  prepareCompilerSession,
} = require('../lib/matching/compiler');
const {
  canonicalJson,
  loadWorkbenchModel,
  resolveTarget,
} = require('../lib/matching/target_model');
const {
  classifySource,
  SOURCE_CLASSES,
} = require('../lib/source_policy');
const { sha256File } = require('../lib/phase7_conventional');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT_ROOT = path.join(ROOT, 'build', 'scheduler-trace');
const REPORT_FILE = path.join(OUTPUT_ROOT, 'report.json');
const EXPECTED_SOURCE_COMMIT = '43d1cdb67ed135879869b5266f01efaaada5e35a';
const EXPECTED_SOURCE_TREE = 'bbed133c38a1feffafe941c36b20d3b38ba47a33';
const EXPECTED_COMPILER_SHA256 = 'F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6';
const EXPECTED_BOOTSTRAP_SHA256 = '67F92A13C607836C90DF877E93A8D1096F44DC9D4193986C12783D7D3B57E904';
const EXPECTED_SOURCE_HASHES = Object.freeze({
  'sched.c': '01F112458F9C539D77F317490137D4AF5BFB9418B195B6A8798F8DB2B1D981C9',
  'calls.c': 'AA6FECB3A2F20D75BBBDE222B960DE20C5B47821831347CAD176E2905AFA337E',
  'emit-rtl.c': '99A2A98776BB37D6504E4151C9B1292ADE231D67DAE1D0FE2E115BD230A14450',
  'config/mips/mips.h': 'CCD2A9AC05A045B78E10D2AEE270829E8AC03D58923FD5C07FAF391E11C2297F',
});
const EXPECTED_EMITTED_STATES = Object.freeze({
  b1: '7AB4A8AFA47CB78EB730FAF409263BDB76EA77055DD20A5C144B3AB4AAD67F75',
  b2: '29F4106E8C25FD168F29CB853BE2CD696DAD69A9DDD37BE074FD0E721EF91265',
  b3: '07A2E15FEF8125920C5043FD31D359CA4949B4546D1FF651AEDB2E0FD49F07A3',
  b4: '60EB04DF88C14C77621E23ABB423B877073F4A86B0F44D2549BA16A71AD9C2DE',
  v1: '30D1EAA445D0F491313CE4621EA9F0F34774348DA9FBAD01F85885B36CBA79EA',
  v2: 'DEF880615EE6A235C2B424655F5C0E0F7A80478A248E54C3A9A2B38EC3CE6722',
});

const HOST_CFLAGS = Object.freeze([
  '/nologo',
  '/Od',
  '/Brepro',
  '/D_CRT_SECURE_NO_WARNINGS',
  '/D_CRT_NONSTDC_NO_WARNINGS',
  '/Di386',
  '/DWIN32',
  '/D_WIN32',
  '/D_X86_=1',
  '/DALMOST_STDC',
]);
const HOST_LDFLAGS = Object.freeze(['/nologo', '/SUBSYSTEM:CONSOLE', '/Brepro']);
const LINK_OBJECTS = Object.freeze([
  'c-parse.obj', 'c-lang.obj', 'c-lex.obj', 'c-pragma.obj', 'c-decl.obj',
  'c-typeck.obj', 'c-convert.obj', 'c-aux-info.obj', 'c-common.obj',
  'c-iterate.obj', 'toplev.obj', 'version.obj', 'tree.obj', 'print-tree.obj',
  'stor-layout.obj', 'fold-const.obj', 'function.obj', 'stmt.obj', 'expr.obj',
  'calls.obj', 'expmed.obj', 'explow.obj', 'optabs.obj', 'varasm.obj', 'rtl.obj',
  'print-rtl.obj', 'rtlanal.obj', 'emit-rtl.obj', 'real.obj', 'dbxout.obj',
  'sdbout.obj', 'dwarfout.obj', 'xcoffout.obj', 'integrate.obj', 'jump.obj',
  'cse.obj', 'loop.obj', 'unroll.obj', 'flow.obj', 'stupid.obj', 'combine.obj',
  'regclass.obj', 'local-alloc.obj', 'global.obj', 'reload.obj', 'reload1.obj',
  'caller-save.obj', 'insn-peep.obj', 'reorg.obj', 'sched.obj', 'final.obj',
  'recog.obj', 'reg-stack.obj', 'insn-opinit.obj', 'insn-recog.obj',
  'insn-extract.obj', 'insn-output.obj', 'insn-emit.obj', 'insn-attrtab.obj',
  'mips.obj', 'getpwd.obj', 'convert.obj', 'bc-emit.obj', 'bc-optab.obj',
  'obstack.obj', 'alloca.obj', 'libcmt.lib', 'kernel32.lib',
]);

const EMIT_TRACE_SUPPORT = String.raw`

/* OB64 research trace: semantic RTL creation only.  */
#define OB64_TRACE_UID_LIMIT 65536
#define OB64_TRACE_ALLOCATOR_CALL 1
#define OB64_TRACE_RETURN_SAVE 2
#define OB64_TRACE_OWNER_LOAD 3
#define OB64_TRACE_CONTEXT_LOAD 4

static unsigned char ob64_trace_uid_kind[OB64_TRACE_UID_LIMIT];
static int ob64_trace_emit_sequence;
static int ob64_trace_enabled = -1;

static int
ob64_trace_enabled_p ()
{
  char *value;

  if (ob64_trace_enabled < 0)
    {
      value = getenv ("OB64_SCHED_TRACE");
      ob64_trace_enabled = value != 0 && value[0] != 0 && value[0] != '0';
    }
  return ob64_trace_enabled;
}

static const char *
ob64_trace_kind_name (kind)
     int kind;
{
  switch (kind)
    {
    case OB64_TRACE_ALLOCATOR_CALL: return "allocator-call";
    case OB64_TRACE_RETURN_SAVE: return "return-save";
    case OB64_TRACE_OWNER_LOAD: return "owner-load";
    case OB64_TRACE_CONTEXT_LOAD: return "context-load";
    default: return "none";
    }
}

const char *
ob64_trace_kind_for_uid (uid)
     int uid;
{
  if (uid < 0 || uid >= OB64_TRACE_UID_LIMIT)
    return "none";
  return ob64_trace_kind_name ((int) ob64_trace_uid_kind[uid]);
}

int
ob64_trace_relevant_uid (uid)
     int uid;
{
  return uid >= 0 && uid < OB64_TRACE_UID_LIMIT
    && ob64_trace_uid_kind[uid] != 0;
}

#define OB64_TRACE_SYMBOL_LIMIT 256
static rtx ob64_trace_symbols[OB64_TRACE_SYMBOL_LIMIT];
static unsigned char ob64_trace_symbol_kinds[OB64_TRACE_SYMBOL_LIMIT];
static int ob64_trace_symbol_count;

static void
ob64_trace_register_symbol (x)
     rtx x;
{
  int kind = 0;
  const char *name;

  if (! ob64_trace_enabled_p () || GET_CODE (x) != SYMBOL_REF)
    return;
  name = XSTR (x, 0);
  if (name != 0 && strcmp (name, "func_80070F30") == 0)
    kind = OB64_TRACE_ALLOCATOR_CALL;
  else if (name != 0 && strcmp (name, "D_801CE8BC") == 0)
    kind = OB64_TRACE_OWNER_LOAD;
  else if (name != 0 && strcmp (name, "D_801CE8C0") == 0)
    kind = OB64_TRACE_CONTEXT_LOAD;
  if (kind == 0)
    return;
  if (ob64_trace_symbol_count >= OB64_TRACE_SYMBOL_LIMIT)
    {
      fprintf (stderr,
               "OB64TRACE|error|seq=%d|reason=symbol-limit|uid=-1\n",
               ++ob64_trace_emit_sequence);
      fflush (stderr);
      return;
    }
  ob64_trace_symbols[ob64_trace_symbol_count] = x;
  ob64_trace_symbol_kinds[ob64_trace_symbol_count] = (unsigned char) kind;
  ob64_trace_symbol_count++;
}

static int
ob64_trace_pattern_has_kind (pattern, kind)
     rtx pattern;
     int kind;
{
  int i;

  for (i = 0; i < ob64_trace_symbol_count; i++)
    if (ob64_trace_symbol_kinds[i] == kind
        && reg_mentioned_p (ob64_trace_symbols[i], pattern))
      return 1;
  return 0;
}

static int
ob64_trace_return_save_p (pattern)
     rtx pattern;
{
  return pattern != 0 && GET_CODE (pattern) == SET
    && GET_CODE (SET_DEST (pattern)) == REG
    && GET_CODE (SET_SRC (pattern)) == REG
    && REGNO (SET_SRC (pattern)) == 2
    && REGNO (SET_DEST (pattern)) != 2;
}

static void
ob64_trace_mark_insn (insn, kind)
     rtx insn;
     int kind;
{
  int uid = INSN_UID (insn);
  int destination = -1;
  int source = -1;
  rtx pattern = PATTERN (insn);

  if (uid < 0 || uid >= OB64_TRACE_UID_LIMIT)
    {
      if (ob64_trace_enabled_p ())
        {
          fprintf (stderr, "OB64TRACE|error|reason=uid-limit|uid=%d\n", uid);
          fflush (stderr);
        }
      return;
    }
  ob64_trace_uid_kind[uid] = (unsigned char) kind;
  if (! ob64_trace_enabled_p ())
    return;
  if (pattern != 0 && GET_CODE (pattern) == SET)
    {
      if (GET_CODE (SET_DEST (pattern)) == REG)
        destination = REGNO (SET_DEST (pattern));
      if (GET_CODE (SET_SRC (pattern)) == REG)
        source = REGNO (SET_SRC (pattern));
    }
  fprintf (stderr,
           "OB64TRACE|emit|seq=%d|kind=%s|uid=%d|dest=%d|src=%d\n",
           ++ob64_trace_emit_sequence, ob64_trace_kind_name (kind), uid,
           destination, source);
  fflush (stderr);
}

static void
ob64_trace_new_insn (insn)
     rtx insn;
{
  rtx pattern = PATTERN (insn);

  if (! ob64_trace_enabled_p ())
    return;
  if (ob64_trace_symbol_count == 0)
    return;
  if (ob64_trace_pattern_has_kind (pattern, OB64_TRACE_ALLOCATOR_CALL))
    ob64_trace_mark_insn (insn, OB64_TRACE_ALLOCATOR_CALL);
  else if (ob64_trace_pattern_has_kind (pattern, OB64_TRACE_OWNER_LOAD))
    ob64_trace_mark_insn (insn, OB64_TRACE_OWNER_LOAD);
  else if (ob64_trace_pattern_has_kind (pattern, OB64_TRACE_CONTEXT_LOAD))
    ob64_trace_mark_insn (insn, OB64_TRACE_CONTEXT_LOAD);
  else if (ob64_trace_return_save_p (pattern))
    ob64_trace_mark_insn (insn, OB64_TRACE_RETURN_SAVE);
}

void
ob64_trace_call_result_copy (insn, target, valreg, copy_path)
     rtx insn, target, valreg;
     const char *copy_path;
{
  int destination = GET_CODE (target) == REG ? REGNO (target) : -1;
  int source = GET_CODE (valreg) == REG ? REGNO (valreg) : -1;

  if (! ob64_trace_enabled_p ())
    return;
  fprintf (stderr,
           "OB64TRACE|call-copy|seq=%d|uid=%d|dest=%d|src=%d|path=%s\n",
           ++ob64_trace_emit_sequence, INSN_UID (insn), destination, source,
           copy_path);
  fflush (stderr);
}
`;

const SCHED_TRACE_SUPPORT = String.raw`

/* OB64 research trace: scheduler decisions for marked semantic RTL.  */
extern const char *ob64_trace_kind_for_uid PROTO((int));
extern int ob64_trace_relevant_uid PROTO((int));

static int ob64_trace_sched_sequence;
static int ob64_trace_sched_enabled = -1;

static int
ob64_trace_sched_enabled_p ()
{
  char *value;

  if (ob64_trace_sched_enabled < 0)
    {
      value = getenv ("OB64_SCHED_TRACE");
      ob64_trace_sched_enabled = value != 0 && value[0] != 0
        && value[0] != '0';
    }
  return ob64_trace_sched_enabled;
}
`;

const INSTRUMENTED_INSN_COST = String.raw`__inline static int
insn_cost (insn, link, used)
     rtx insn, link, used;
{
  register int cost = INSN_COST (insn);
  int raw_cost;
  int adjusted_cost = -1;
  int free_at_entry = LINK_COST_FREE (link);
  int zero_at_entry = LINK_COST_ZERO (link);
  int free_before_adjust;
  int zero_before_adjust;
  int relevant = ob64_trace_relevant_uid (INSN_UID (insn))
    || ob64_trace_relevant_uid (INSN_UID (used));

  if (cost == 0)
    {
      recog_memoized (insn);

      /* A USE insn, or something else we don't need to understand.
	 We can't pass these directly to result_ready_cost because it will
	 trigger a fatal error for unrecognizable insns.  */
      if (INSN_CODE (insn) < 0)
	{
	  INSN_COST (insn) = 1;
	  if (relevant && ob64_trace_sched_enabled_p ())
	    {
	      fprintf (stderr,
		       "OB64TRACE|cost|seq=%d|reload=%d|insn=%d|insnkind=%s|used=%d|usedkind=%s|kind=%d|raw=1|adjusted=-1|final=1|free_entry=%d|zero_entry=%d|free_before=%d|zero_before=%d|free_after=%d|zero_after=%d\n",
		       ++ob64_trace_sched_sequence, reload_completed,
		       INSN_UID (insn), ob64_trace_kind_for_uid (INSN_UID (insn)),
		       INSN_UID (used), ob64_trace_kind_for_uid (INSN_UID (used)),
		       (int) REG_NOTE_KIND (link), free_at_entry, zero_at_entry,
		       LINK_COST_FREE (link), LINK_COST_ZERO (link),
		       LINK_COST_FREE (link), LINK_COST_ZERO (link));
	      fflush (stderr);
	    }
	  return 1;
	}
      else
	{
	  cost = result_ready_cost (insn);

	  if (cost < 1)
	    cost = 1;

	  INSN_COST (insn) = cost;
	}
    }

  raw_cost = cost;

  /* A USE insn should never require the value used to be computed.  This
     allows the computation of a function's result and parameter values to
     overlap the return and call.  */
  recog_memoized (used);
  if (INSN_CODE (used) < 0)
    LINK_COST_FREE (link) = 1;

  free_before_adjust = LINK_COST_FREE (link);
  zero_before_adjust = LINK_COST_ZERO (link);

  /* If some dependencies vary the cost, compute the adjustment.  Most
     commonly, the adjustment is complete: either the cost is ignored
     (in the case of an output- or anti-dependence), or the cost is
     unchanged.  These values are cached in the link as LINK_COST_FREE
     and LINK_COST_ZERO.  */

  if (LINK_COST_FREE (link))
    cost = 1;
#ifdef ADJUST_COST
  else if (! LINK_COST_ZERO (link))
    {
      int ncost = cost;

      ADJUST_COST (used, link, insn, ncost);
      adjusted_cost = ncost;
      if (ncost <= 1)
	LINK_COST_FREE (link) = ncost = 1;
      if (cost == ncost)
	LINK_COST_ZERO (link) = 1;
      cost = ncost;
    }
#endif
  if (relevant && ob64_trace_sched_enabled_p ())
    {
      fprintf (stderr,
	       "OB64TRACE|cost|seq=%d|reload=%d|insn=%d|insnkind=%s|used=%d|usedkind=%s|kind=%d|raw=%d|adjusted=%d|final=%d|free_entry=%d|zero_entry=%d|free_before=%d|zero_before=%d|free_after=%d|zero_after=%d\n",
	       ++ob64_trace_sched_sequence, reload_completed,
	       INSN_UID (insn), ob64_trace_kind_for_uid (INSN_UID (insn)),
	       INSN_UID (used), ob64_trace_kind_for_uid (INSN_UID (used)),
	       (int) REG_NOTE_KIND (link), raw_cost, adjusted_cost, cost,
	       free_at_entry, zero_at_entry, free_before_adjust,
	       zero_before_adjust, LINK_COST_FREE (link), LINK_COST_ZERO (link));
      fflush (stderr);
    }
  return cost;
}`;

const INSTRUMENTED_RANK = String.raw`static int
rank_for_schedule (x, y)
     rtx *x, *y;
{
  rtx tmp = *y;
  rtx tmp2 = *x;
  rtx link = 0;
  rtx link2 = 0;
  rtx preferred;
  int tmp_class = -1;
  int tmp2_class = -1;
  int tmp_cost = -1;
  int tmp2_cost = -1;
  int tmp_raw = -1;
  int tmp2_raw = -1;
  int tmp_link_kind = -1;
  int tmp2_link_kind = -1;
  int value;
  const char *clause;

  /* Choose the instruction with the highest priority, if different.  */
  value = INSN_PRIORITY (tmp) - INSN_PRIORITY (tmp2);
  if (value)
    {
      clause = "priority";
      goto ob64_trace_rank_done;
    }

  if (last_scheduled_insn)
    {
      /* Classify the instructions into three classes:
	 1) Data dependent on last schedule insn.
	 2) Anti/Output dependent on last scheduled insn.
	 3) Independent of last scheduled insn, or has latency of one.
	 Choose the insn from the highest numbered class if different.  */
      link = find_insn_list (tmp, LOG_LINKS (last_scheduled_insn));
      if (link == 0)
	tmp_class = 3;
      else
	{
	  tmp_link_kind = (int) REG_NOTE_KIND (link);
	  tmp_cost = insn_cost (tmp, link, last_scheduled_insn);
	  tmp_raw = INSN_COST (tmp);
	  if (tmp_cost == 1)
	    tmp_class = 3;
	  else if (REG_NOTE_KIND (link) == 0) /* Data dependence.  */
	    tmp_class = 1;
	  else
	    tmp_class = 2;
	}

      link2 = find_insn_list (tmp2, LOG_LINKS (last_scheduled_insn));
      if (link2 == 0)
	tmp2_class = 3;
      else
	{
	  tmp2_link_kind = (int) REG_NOTE_KIND (link2);
	  tmp2_cost = insn_cost (tmp2, link2, last_scheduled_insn);
	  tmp2_raw = INSN_COST (tmp2);
	  if (tmp2_cost == 1)
	    tmp2_class = 3;
	  else if (REG_NOTE_KIND (link2) == 0) /* Data dependence.  */
	    tmp2_class = 1;
	  else
	    tmp2_class = 2;
	}

      value = tmp_class - tmp2_class;
      if (value)
	{
	  clause = "class";
	  goto ob64_trace_rank_done;
	}
    }

  /* If insns are equally good, sort by INSN_LUID (original insn order),
     so that we make the sort stable.  This minimizes instruction movement,
     thus minimizing sched's effect on debugging and cross-jumping.  */
  value = INSN_LUID (tmp) - INSN_LUID (tmp2);
  clause = "luid";

ob64_trace_rank_done:
  if (ob64_trace_sched_enabled_p ()
      && (ob64_trace_relevant_uid (INSN_UID (tmp))
	  || ob64_trace_relevant_uid (INSN_UID (tmp2))))
    {
      preferred = value > 0 ? tmp : tmp2;
      fprintf (stderr,
	       "OB64TRACE|rank|seq=%d|reload=%d|last=%d|lastkind=%s|x=%d|xkind=%s|xluid=%d|xpriority=%d|xlink=%d|xraw=%d|xcost=%d|xclass=%d|y=%d|ykind=%s|yluid=%d|ypriority=%d|ylink=%d|yraw=%d|ycost=%d|yclass=%d|clause=%s|result=%d|preferred=%d|preferredkind=%s\n",
	       ++ob64_trace_sched_sequence, reload_completed,
	       last_scheduled_insn ? INSN_UID (last_scheduled_insn) : -1,
	       last_scheduled_insn
	       ? ob64_trace_kind_for_uid (INSN_UID (last_scheduled_insn)) : "none",
	       INSN_UID (tmp2), ob64_trace_kind_for_uid (INSN_UID (tmp2)),
	       INSN_LUID (tmp2), INSN_PRIORITY (tmp2), tmp2_link_kind,
	       tmp2_raw, tmp2_cost, tmp2_class,
	       INSN_UID (tmp), ob64_trace_kind_for_uid (INSN_UID (tmp)),
	       INSN_LUID (tmp), INSN_PRIORITY (tmp), tmp_link_kind,
	       tmp_raw, tmp_cost, tmp_class, clause, value,
	       INSN_UID (preferred),
	       ob64_trace_kind_for_uid (INSN_UID (preferred)));
      fflush (stderr);
    }
  return value;
}`;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

function shown(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function requireIdentity(label, actual, expected) {
  if (String(actual).toUpperCase() !== String(expected).toUpperCase()) {
    throw new Error(`${label} identity drift: expected ${expected}, observed ${actual}`);
  }
  return actual;
}

function replaceExactly(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0 || source.indexOf(needle, first + 1) >= 0) {
    throw new Error(`${label} transform anchor census is not one`);
  }
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
}

function runGit(sourceRoot, args) {
  const result = childProcess.spawnSync('git', ['-C', sourceRoot, ...args], {
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`compiler source git check failed: ${String(result.stderr || result.stdout).trim()}`);
  }
  return String(result.stdout).trim();
}

function instrumentEmitRtl(source) {
  source = source.replace(/\r\n/g, '\n');
  let result = replaceExactly(
    source,
    '#include "bc-emit.h"\n\n#include <stdio.h>\n',
    '#include "bc-emit.h"\n\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n',
    'emit-rtl includes',
  );
  result = replaceExactly(
    result,
    '\n\n/* Opcode names */',
    `${EMIT_TRACE_SUPPORT}\n\n/* Opcode names */`,
    'emit-rtl trace support',
  );
  result = replaceExactly(
    result,
    '  va_end (p);\n  return rt_val;\t\t/* Return the new RTX...\t\t*/\n}',
    '  va_end (p);\n  ob64_trace_register_symbol (rt_val);\n  return rt_val;\t\t/* Return the new RTX...\t\t*/\n}',
    'gen_rtx symbol registration',
  );
  result = replaceExactly(
    result,
    `  REG_NOTES (insn) = NULL;\n\n  return insn;\n}\n\n/* Like \u0060make_insn' but make a JUMP_INSN instead of an insn.  */`,
    `  REG_NOTES (insn) = NULL;\n\n  ob64_trace_new_insn (insn);\n  return insn;\n}\n\n/* Like \u0060make_insn' but make a JUMP_INSN instead of an insn.  */`,
    'make_insn_raw trace',
  );
  result = replaceExactly(
    result,
    `  REG_NOTES (insn) = NULL;\n  CALL_INSN_FUNCTION_USAGE (insn) = NULL;\n\n  return insn;\n}`,
    `  REG_NOTES (insn) = NULL;\n  CALL_INSN_FUNCTION_USAGE (insn) = NULL;\n\n  ob64_trace_new_insn (insn);\n  return insn;\n}`,
    'make_call_insn_raw trace',
  );
  return result;
}

function instrumentCalls(source) {
  source = source.replace(/\r\n/g, '\n');
  let result = replaceExactly(
    source,
    '#include "insn-flags.h"\n',
    '#include "insn-flags.h"\n\nextern void ob64_trace_call_result_copy PROTO((rtx, rtx, rtx, const char *));\n',
    'calls trace prototype',
  );
  result = replaceExactly(
    result,
    '    emit_move_insn (target, valreg);',
    '    {\n      rtx ob64_result_copy = emit_move_insn (target, valreg);\n      ob64_trace_call_result_copy (ob64_result_copy, target, valreg, "target-move");\n    }',
    'calls target return copy',
  );
  result = replaceExactly(
    result,
    '  else\n    target = copy_to_reg (valreg);',
    '  else\n    {\n      target = copy_to_reg (valreg);\n      ob64_trace_call_result_copy (get_last_insn (), target, valreg, "copy-to-reg");\n    }',
    'calls fallback return copy',
  );
  return result;
}

function instrumentSched(source) {
  source = source.replace(/\r\n/g, '\n');
  let result = replaceExactly(
    source,
    '#include <stdio.h>\n',
    '#include <stdio.h>\n#include <stdlib.h>\n',
    'sched includes',
  );
  result = replaceExactly(
    result,
    'static rtx last_scheduled_insn;\n',
    `static rtx last_scheduled_insn;\n${SCHED_TRACE_SUPPORT}\n`,
    'sched trace support',
  );
  const costStart = result.indexOf('__inline static int\ninsn_cost (insn, link, used)');
  const costEndMarker = '\n\n/* Compute the priority number for INSN.  */';
  const costEnd = result.indexOf(costEndMarker, costStart);
  if (costStart < 0 || costEnd < 0 || result.indexOf('__inline static int\ninsn_cost (insn, link, used)', costStart + 1) >= 0) {
    throw new Error('insn_cost transform anchor census is not one');
  }
  result = result.slice(0, costStart) + INSTRUMENTED_INSN_COST + result.slice(costEnd);
  const rankStart = result.indexOf('static int\nrank_for_schedule (x, y)');
  const rankEndMarker = '\n\n/* Resort the array A in which only element at index N may be out of order.  */';
  const rankEnd = result.indexOf(rankEndMarker, rankStart);
  if (rankStart < 0 || rankEnd < 0 || result.indexOf('static int\nrank_for_schedule (x, y)', rankStart + 1) >= 0) {
    throw new Error('rank_for_schedule transform anchor census is not one');
  }
  result = result.slice(0, rankStart) + INSTRUMENTED_RANK + result.slice(rankEnd);
  result = replaceExactly(
    result,
    '      n_ready = new_ready;\n      last_scheduled_insn = insn = ready[0];',
    `      n_ready = new_ready;\n      if (ob64_trace_sched_enabled_p ()\n\t  && (ob64_trace_relevant_uid (INSN_UID (ready[0]))\n\t      || (last_scheduled_insn\n\t\t  && ob64_trace_relevant_uid (INSN_UID (last_scheduled_insn)))))\n\t{\n\t  fprintf (stderr,\n\t\t   "OB64TRACE|select|seq=%d|reload=%d|clock=%d|last=%d|lastkind=%s|selected=%d|selectedkind=%s|priority=%d|luid=%d|ready=%d\\n",\n\t\t   ++ob64_trace_sched_sequence, reload_completed, clock,\n\t\t   last_scheduled_insn ? INSN_UID (last_scheduled_insn) : -1,\n\t\t   last_scheduled_insn\n\t\t   ? ob64_trace_kind_for_uid (INSN_UID (last_scheduled_insn))\n\t\t   : "none", INSN_UID (ready[0]),\n\t\t   ob64_trace_kind_for_uid (INSN_UID (ready[0])),\n\t\t   INSN_PRIORITY (ready[0]), INSN_LUID (ready[0]), n_ready);\n\t  fflush (stderr);\n\t}\n      last_scheduled_insn = insn = ready[0];`,
    'scheduler selected ready entry',
  );
  return result;
}

const INSTRUMENTATION_ID = sha256(Buffer.from(canonicalJson({
  schemaVersion: 1,
  emit: EMIT_TRACE_SUPPORT,
  cost: INSTRUMENTED_INSN_COST,
  rank: INSTRUMENTED_RANK,
  scheduler: SCHED_TRACE_SUPPORT,
  transforms: ['normalize-crlf-v1', 'emit-rtl-v6', 'calls-v1', 'sched-v1'],
}), 'utf8'));

function inspectCompilerSource(sourceRoot, productionCompiler) {
  if (!sourceRoot) throw new Error('compiler source is required via --compiler-source or OB64_KMC_GCC_SOURCE');
  const directory = fs.realpathSync(path.resolve(sourceRoot));
  const commit = runGit(directory, ['rev-parse', 'HEAD']);
  const tree = runGit(directory, ['rev-parse', 'HEAD^{tree}']);
  requireIdentity('compiler source commit', commit, EXPECTED_SOURCE_COMMIT);
  requireIdentity('compiler source tree', tree, EXPECTED_SOURCE_TREE);
  const trackedStatus = runGit(directory, ['status', '--short', '--untracked-files=no']);
  if (trackedStatus) throw new Error(`compiler source has tracked changes:\n${trackedStatus}`);
  const files = {};
  for (const [relative, expected] of Object.entries(EXPECTED_SOURCE_HASHES)) {
    const file = path.join(directory, ...relative.split('/'));
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`compiler source is missing ${relative}`);
    files[relative] = { path: file, sha256: requireIdentity(`${relative} SHA-256`, sha256File(file), expected) };
  }
  requireIdentity('authenticated compiler SHA-256', sha256File(productionCompiler), EXPECTED_COMPILER_SHA256);
  const sourceCompiler = path.join(directory, 'cc1.exe');
  requireIdentity('source-tree compiler SHA-256', sha256File(sourceCompiler), EXPECTED_COMPILER_SHA256);
  const bootstrapFile = path.resolve(directory, '..', '..', 'bootstrap-result.json');
  requireIdentity('bootstrap-result.json SHA-256', sha256File(bootstrapFile), EXPECTED_BOOTSTRAP_SHA256);
  const bootstrap = JSON.parse(fs.readFileSync(bootstrapFile, 'utf8'));
  if (bootstrap.status !== 'pass' || bootstrap.source?.commit !== EXPECTED_SOURCE_COMMIT
      || bootstrap.source?.tree !== EXPECTED_SOURCE_TREE
      || bootstrap.compiler?.sha256 !== EXPECTED_COMPILER_SHA256
      || bootstrap.compiler?.version !== 'GNU C version 2.7.2 (MIPS GNU/ELF)') {
    throw new Error('bootstrap compiler/source contract drift');
  }
  if (bootstrap.compiler.buildCflags !== HOST_CFLAGS.join(' ')
      || bootstrap.compiler.buildLdflags !== HOST_LDFLAGS.join(' ')) {
    throw new Error('bootstrap host build flags drift');
  }
  const vcvarsRecord = bootstrap.host?.tools?.find((item) => /vcvarsall\.bat$/i.test(item.path));
  if (!vcvarsRecord || !fs.existsSync(vcvarsRecord.path)) throw new Error('authenticated vcvarsall.bat is unavailable');
  requireIdentity('vcvarsall.bat SHA-256', sha256File(vcvarsRecord.path), vcvarsRecord.sha256);
  return {
    directory,
    commit,
    tree,
    files,
    sourceCompiler: { path: sourceCompiler, sha256: sha256File(sourceCompiler) },
    bootstrap: { path: bootstrapFile, sha256: sha256File(bootstrapFile), record: bootstrap },
    vcvars: { path: vcvarsRecord.path, sha256: vcvarsRecord.sha256 },
  };
}

function patchResearchSource(copyRoot) {
  const transformations = {
    'emit-rtl.c': instrumentEmitRtl,
    'calls.c': instrumentCalls,
    'sched.c': instrumentSched,
  };
  const patched = {};
  for (const [relative, transform] of Object.entries(transformations)) {
    const file = path.join(copyRoot, relative);
    const original = fs.readFileSync(file, 'utf8');
    const result = transform(original);
    if (result === original) throw new Error(`instrumentation did not change ${relative}`);
    fs.writeFileSync(file, result, 'utf8');
    patched[relative] = { sha256: sha256File(file), bytes: fs.statSync(file).size };
  }
  return patched;
}

function prepareResearchSource(sourceEvidence) {
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  const copyRoot = path.join(OUTPUT_ROOT, `s-${INSTRUMENTATION_ID.slice(0, 8).toLowerCase()}`);
  const manifestFile = path.join(copyRoot, 'ob64-trace-source.json');
  if (fs.existsSync(copyRoot)) {
    if (!fs.statSync(copyRoot).isDirectory() || !fs.existsSync(manifestFile)) {
      throw new Error(`existing research source copy is incomplete: ${copyRoot}`);
    }
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    requireIdentity('research source instrumentation', manifest.instrumentationId, INSTRUMENTATION_ID);
    requireIdentity('research source origin commit', manifest.origin.commit, EXPECTED_SOURCE_COMMIT);
    for (const [relative, record] of Object.entries(manifest.patchedFiles)) {
      requireIdentity(`prepared ${relative} SHA-256`, sha256File(path.join(copyRoot, relative)), record.sha256);
    }
    return { copyRoot, manifestFile, manifest, reused: true };
  }
  fs.cpSync(sourceEvidence.directory, copyRoot, {
    recursive: true,
    filter(source) {
      return path.basename(source) !== '.git';
    },
  });
  const patchedFiles = patchResearchSource(copyRoot);
  const manifest = {
    schemaVersion: 1,
    researchOnly: true,
    instrumentationId: INSTRUMENTATION_ID,
    origin: {
      path: sourceEvidence.directory,
      commit: sourceEvidence.commit,
      tree: sourceEvidence.tree,
      files: sourceEvidence.files,
    },
    patchedFiles,
    boundary: 'This isolated source copy is explanatory only. It does not replace or modify the authenticated production compiler or its source checkout.',
  };
  writeJson(manifestFile, manifest);
  return { copyRoot, manifestFile, manifest, reused: false };
}

function safeBatchValue(value, label) {
  if (typeof value !== 'string' || !value || /[\r\n"]/.test(value)) throw new Error(`${label} is unsafe for the research build script`);
  return value;
}

function compilerVersion(executable) {
  const result = childProcess.spawnSync(executable, ['-version'], {
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`research compiler version probe exited ${result.status}`);
  return [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
}

function buildResearchCompiler(prepared, sourceEvidence) {
  const executable = path.join(prepared.copyRoot, 'cc1-trace.exe');
  const manifestFile = path.join(prepared.copyRoot, 'ob64-trace-build.json');
  if (fs.existsSync(executable) && fs.existsSync(manifestFile)) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    requireIdentity('research build instrumentation', manifest.instrumentationId, INSTRUMENTATION_ID);
    requireIdentity('research compiler SHA-256', sha256File(executable), manifest.compiler.sha256);
    return { executable, manifestFile, manifest, reused: true };
  }
  for (const object of LINK_OBJECTS.filter((item) => /\.obj$/i.test(item))) {
    if (!fs.existsSync(path.join(prepared.copyRoot, object))) throw new Error(`research compiler link prerequisite is missing: ${object}`);
  }
  const clFile = path.join(prepared.copyRoot, 'ob64-cl-path.txt');
  const linkFile = path.join(prepared.copyRoot, 'ob64-link-path.txt');
  const scriptFile = path.join(prepared.copyRoot, 'ob64-trace-build.cmd');
  const vcvars = safeBatchValue(sourceEvidence.vcvars.path, 'vcvarsall.bat path');
  const compilePrefix = ['cl', '-c', '-DCROSS_COMPILE', '-DIN_GCC', ...HOST_CFLAGS, '-I.', '-I.', '-I./config'];
  const compileCommands = ['sched.c', 'calls.c', 'emit-rtl.c'].map((file) => [...compilePrefix, file]);
  const linkCommand = ['link', ...HOST_LDFLAGS, '-out:cc1-trace.exe', ...LINK_OBJECTS];
  const lines = [
    '@echo off',
    `call "${vcvars}" x86`,
    'if errorlevel 1 exit /b %errorlevel%',
    `where cl > "${safeBatchValue(clFile, 'cl output path')}"`,
    'if errorlevel 1 exit /b %errorlevel%',
    `where link > "${safeBatchValue(linkFile, 'link output path')}"`,
    'if errorlevel 1 exit /b %errorlevel%',
    ...compileCommands.flatMap((command) => [command.join(' '), 'if errorlevel 1 exit /b %errorlevel%']),
    linkCommand.join(' '),
    'if errorlevel 1 exit /b %errorlevel%',
    '',
  ];
  fs.writeFileSync(scriptFile, lines.join('\r\n'), 'utf8');
  const startedAt = new Date().toISOString();
  const result = childProcess.spawnSync('cmd.exe', ['/d', '/c', scriptFile], {
    cwd: prepared.copyRoot,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 128 * 1024 * 1024,
  });
  const buildLog = path.join(prepared.copyRoot, 'ob64-trace-build.log');
  fs.writeFileSync(buildLog, [result.stdout, result.stderr].filter(Boolean).join('\n'), 'utf8');
  if (result.error) throw result.error;
  if (result.status !== 0 || !fs.existsSync(executable)) {
    throw new Error(`research compiler build exited ${result.status}; see ${buildLog}`);
  }
  const firstPath = (file) => fs.readFileSync(file, 'utf8').split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  const clPath = firstPath(clFile);
  const linkPath = firstPath(linkFile);
  if (!clPath || !linkPath || !fs.existsSync(clPath) || !fs.existsSync(linkPath)) throw new Error('host compiler/linker provenance capture failed');
  const manifest = {
    schemaVersion: 1,
    researchOnly: true,
    instrumentationId: INSTRUMENTATION_ID,
    startedAt,
    completedAt: new Date().toISOString(),
    compiler: { path: executable, sha256: sha256File(executable), version: compilerVersion(executable) },
    hostTools: {
      cl: { path: clPath, sha256: sha256File(clPath) },
      link: { path: linkPath, sha256: sha256File(linkPath) },
      vcvars: sourceEvidence.vcvars,
    },
    flags: { compile: HOST_CFLAGS, link: HOST_LDFLAGS },
    commands: { compile: compileCommands, link: linkCommand },
    log: buildLog,
    boundary: 'The research compiler is isolated under ignored build/scheduler-trace and is not accepted production tooling.',
  };
  writeJson(manifestFile, manifest);
  return { executable, manifestFile, manifest, reused: false };
}

function parseTrace(text) {
  const records = [];
  for (const line of String(text).split(/\r?\n/)) {
    if (!line.startsWith('OB64TRACE|')) continue;
    const pieces = line.split('|');
    if (pieces.length < 3 || pieces[0] !== 'OB64TRACE' || !/^[a-z-]+$/.test(pieces[1])) {
      throw new Error(`malformed research trace line: ${line}`);
    }
    const record = { type: pieces[1], traceLine: line };
    for (const piece of pieces.slice(2)) {
      const separator = piece.indexOf('=');
      if (separator <= 0) throw new Error(`malformed research trace field: ${line}`);
      const key = piece.slice(0, separator);
      const rawValue = piece.slice(separator + 1);
      if (!/^[a-z][a-z0-9_]*$/.test(key) || Object.prototype.hasOwnProperty.call(record, key) || !rawValue) {
        throw new Error(`invalid research trace field: ${line}`);
      }
      record[key] = /^-?\d+$/.test(rawValue) ? Number(rawValue) : rawValue;
    }
    if (record.type === 'error') throw new Error(`research compiler reported ${record.reason || 'an internal trace error'}`);
    if (!Number.isSafeInteger(record.seq) || record.seq <= 0) throw new Error(`research trace record lacks a positive sequence: ${line}`);
    records.push(record);
  }
  if (!records.length) throw new Error('research compiler produced no OB64TRACE records');
  for (const domain of [new Set(['emit', 'call-copy']), new Set(['cost', 'rank', 'select'])]) {
    let previous = 0;
    for (const record of records.filter((item) => domain.has(item.type))) {
      if (record.seq <= previous) throw new Error(`research trace sequence is not increasing at: ${record.traceLine}`);
      previous = record.seq;
    }
  }
  return records;
}

function sideForKind(rank, kind) {
  if (rank.xkind === kind) {
    return { uid: rank.x, luid: rank.xluid, priority: rank.xpriority, link: rank.xlink, raw: rank.xraw, cost: rank.xcost, class: rank.xclass };
  }
  if (rank.ykind === kind) {
    return { uid: rank.y, luid: rank.yluid, priority: rank.ypriority, link: rank.ylink, raw: rank.yraw, cost: rank.ycost, class: rank.yclass };
  }
  return null;
}

function analyzeCreationOrder(records, expectedSites) {
  const emissions = records.filter((record) => record.type === 'emit');
  const copies = records.filter((record) => record.type === 'call-copy');
  const sites = [];
  let previousCopySequence = 0;
  for (const copy of copies) {
    const precedingCalls = emissions.filter((record) => record.kind === 'allocator-call'
      && record.seq > previousCopySequence && record.seq < copy.seq);
    previousCopySequence = copy.seq;
    if (!precedingCalls.length) continue;
    // GCC creates a raw CALL_INSN and then the linked CALL_INSN. The calls.c
    // result-copy hook identifies which group is a source-level allocator
    // site; the nearest preceding allocator UID is the linked call.
    sites.push({ call: precedingCalls.at(-1), copy });
  }
  if (sites.length !== expectedSites) throw new Error(`allocator result-copy site census is ${sites.length}, expected ${expectedSites}`);
  return sites.map(({ call, copy }, index) => {
    const end = sites[index + 1]?.copy.seq ?? Number.POSITIVE_INFINITY;
    const owner = emissions.find((record) => record.kind === 'owner-load' && record.seq > call.seq && record.seq < end);
    const context = emissions.find((record) => record.kind === 'context-load' && record.seq > call.seq && record.seq < end);
    const save = emissions.find((record) => record.kind === 'return-save' && record.uid === copy.uid && record.seq > call.seq && record.seq < end);
    if (!copy || !save || !owner || !(call.seq < save.seq && save.seq <= copy.seq && copy.seq < owner.seq)) {
      throw new Error(`direct RTL creation order is incomplete or unexpected at allocator site ${index + 1}`);
    }
    return {
      site: index + 1,
      allocatorCall: { seq: call.seq, uid: call.uid },
      returnSave: { seq: save.seq, uid: save.uid, destination: save.dest, source: save.src },
      callsResultCopy: { seq: copy.seq, uid: copy.uid, destination: copy.dest, source: copy.src, path: copy.path },
      ownerLoad: { seq: owner.seq, uid: owner.uid },
      contextLoad: context ? { seq: context.seq, uid: context.uid } : null,
      directlyObservedOrder: ['allocator-call', 'return-save', 'calls-result-copy', 'owner-load'],
    };
  });
}

function schedulerPairs(records, strictExpected = null) {
  const candidateRanks = records.filter((record) => record.type === 'rank'
    && record.reload === 1
    && new Set([record.xkind, record.ykind]).size === 2
    && [record.xkind, record.ykind].includes('owner-load')
    && [record.xkind, record.ykind].includes('return-save'));
  const unique = new Map();
  for (const rank of candidateRanks) {
    const owner = sideForKind(rank, 'owner-load');
    const save = sideForKind(rank, 'return-save');
    unique.set(`${rank.last}:${owner.uid}:${save.uid}`, rank);
  }
  const pairs = [...unique.values()].map((rank, index) => {
    const owner = sideForKind(rank, 'owner-load');
    const save = sideForKind(rank, 'return-save');
    const costs = records.filter((record) => record.type === 'cost' && record.reload === 1
      && record.insn === save.uid && record.used === rank.last && record.kind === 14);
    const adjustment = costs.find((record) => record.adjusted === 0 && record.final === 1) || null;
    const selection = records.find((record) => record.type === 'select' && record.reload === 1
      && record.last === rank.last && record.selected === owner.uid) || null;
    return {
      site: index + 1,
      last: { uid: rank.last, kind: rank.lastkind },
      owner,
      returnSave: save,
      comparator: { clause: rank.clause, result: rank.result, preferred: rank.preferred, preferredKind: rank.preferredkind },
      adjustment: adjustment ? {
        linkKind: adjustment.kind,
        rawCost: adjustment.raw,
        postAdjustCost: adjustment.adjusted,
        effectiveCost: adjustment.final,
        freeBefore: adjustment.free_before,
        freeAfter: adjustment.free_after,
      } : null,
      selected: selection ? { uid: selection.selected, kind: selection.selectedkind, clock: selection.clock, ready: selection.ready } : null,
      directTraceLines: [adjustment?.traceLine, rank.traceLine, selection?.traceLine].filter(Boolean),
    };
  });
  if (strictExpected !== null) {
    if (pairs.length !== strictExpected) throw new Error(`decisive scheduler pair census is ${pairs.length}, expected ${strictExpected}`);
    for (const pair of pairs) {
      const valid = pair.last.kind === 'context-load'
        && pair.owner.priority === pair.returnSave.priority
        && pair.owner.link === -1 && pair.owner.class === 3
        && pair.returnSave.link === 14 && pair.returnSave.cost === 1 && pair.returnSave.class === 3
        && pair.owner.luid > pair.returnSave.luid
        && pair.comparator.clause === 'luid'
        && pair.comparator.preferred === pair.owner.uid
        && pair.comparator.preferredKind === 'owner-load'
        && pair.adjustment?.postAdjustCost === 0
        && pair.adjustment?.effectiveCost === 1
        && pair.adjustment?.freeAfter === 1
        && pair.selected?.uid === pair.owner.uid;
      if (!valid) throw new Error(`direct scheduler trace did not confirm the expected decision at site ${pair.site}`);
    }
  }
  return pairs;
}

function semanticSchedulerEvidence(records) {
  const semantic = new Set(['owner-load', 'return-save', 'context-load']);
  const dependencies = new Map();
  for (const record of records.filter((item) => item.type === 'cost' && item.reload === 1
    && item.kind === 0 && item.final > 1
    && semantic.has(item.insnkind) && semantic.has(item.usedkind))) {
    const key = `${record.insn}:${record.used}:${record.kind}`;
    const prior = dependencies.get(key);
    if (!prior || (prior.adjusted < 0 && record.adjusted >= 0)) dependencies.set(key, record);
  }
  return {
    nonFreeTrueDependencies: [...dependencies.values()].map((record) => ({
      insn: { uid: record.insn, kind: record.insnkind },
      used: { uid: record.used, kind: record.usedkind },
      linkKind: record.kind,
      rawCost: record.raw,
      postAdjustCost: record.adjusted,
      effectiveCost: record.final,
      directTraceLine: record.traceLine,
    })),
    semanticSelections: records.filter((record) => record.type === 'select' && record.reload === 1
      && semantic.has(record.lastkind) && semantic.has(record.selectedkind)).map((record) => ({
      clock: record.clock,
      last: { uid: record.last, kind: record.lastkind },
      selected: { uid: record.selected, kind: record.selectedkind },
      ready: record.ready,
      directTraceLine: record.traceLine,
    })),
  };
}

function assertParity(production, research, buffers) {
  const comparisons = {
    compilerAssemblyExact: buffers.productionAssembly.equals(buffers.researchAssembly),
    adjustedAssemblyExact: buffers.productionAdjusted.equals(buffers.researchAdjusted),
    rawObjectExact: buffers.productionObject.equals(buffers.researchObject),
    objectTextExact: production.objectText.equals(research.objectText),
    relocationsExact: canonicalJson(production.relocations) === canonicalJson(research.relocations),
  };
  if (Object.values(comparisons).some((value) => value !== true)) {
    throw new Error(`research/production output parity failed: ${JSON.stringify(comparisons)}`);
  }
  const productionState = canonicalEmittedState(production.objectText, production.relocations);
  const researchState = canonicalEmittedState(research.objectText, research.relocations);
  requireIdentity('research emitted-state SHA-256', researchState.emittedStateSha256, productionState.emittedStateSha256);
  return {
    ...comparisons,
    compilerAssemblySha256: sha256(buffers.productionAssembly),
    adjustedAssemblySha256: sha256(buffers.productionAdjusted),
    rawObjectSha256: sha256(buffers.productionObject),
    objectTextSha256: productionState.objectTextSha256,
    relocationSha256: productionState.relocationSha256,
    emittedStateSha256: productionState.emittedStateSha256,
  };
}

function copyCompileArtifacts(scratch, destination) {
  fs.mkdirSync(destination, { recursive: true });
  const names = ['candidate.compiler.s', 'candidate.s', 'candidate.o'];
  const buffers = {};
  for (const name of names) {
    const source = path.join(scratch, name);
    const target = path.join(destination, name);
    fs.copyFileSync(source, target);
    buffers[name] = fs.readFileSync(target);
  }
  return buffers;
}

function withTraceEnvironment(callback) {
  const hadValue = Object.prototype.hasOwnProperty.call(process.env, 'OB64_SCHED_TRACE');
  const prior = process.env.OB64_SCHED_TRACE;
  process.env.OB64_SCHED_TRACE = '1';
  try {
    return callback();
  } finally {
    if (hadValue) process.env.OB64_SCHED_TRACE = prior;
    else delete process.env.OB64_SCHED_TRACE;
  }
}

function compileCase({ session, researchCompiler, model, definition }) {
  const target = resolveTarget(model, definition.symbol);
  if (definition.expectedBytes !== undefined && target.bytes !== definition.expectedBytes) {
    throw new Error(`${definition.symbol} accepted extent drift: ${target.bytes}`);
  }
  const directory = path.join(OUTPUT_ROOT, 'r', definition.id);
  const scratch = path.join(directory, 'c');
  fs.mkdirSync(scratch, { recursive: true });
  const sourceFile = path.join(directory, 'candidate.c');
  if (fs.existsSync(sourceFile) && fs.readFileSync(sourceFile, 'utf8') !== definition.sourceText) {
    throw new Error(`trace case source collision: ${definition.id}`);
  }
  fs.writeFileSync(sourceFile, definition.sourceText, 'utf8');
  const sourcePolicy = classifySource(sourceFile, { preprocessor: session.preprocessor });
  if (sourcePolicy.class !== SOURCE_CLASSES.PURE_C) throw new Error(`${definition.id} is not PURE_C: ${sourcePolicy.class}`);

  const savedTrace = process.env.OB64_SCHED_TRACE;
  delete process.env.OB64_SCHED_TRACE;
  let production;
  try {
    production = compileScratchCandidate({ session, target, sourceFile, artifactDir: scratch });
  } finally {
    if (savedTrace !== undefined) process.env.OB64_SCHED_TRACE = savedTrace;
  }
  const productionFiles = copyCompileArtifacts(scratch, path.join(directory, 'production'));
  const researchSession = {
    ...session,
    context: {
      ...session.context,
      localTools: { ...session.context.localTools, compiler: researchCompiler },
    },
  };
  const research = withTraceEnvironment(() => compileScratchCandidate({
    session: researchSession,
    target,
    sourceFile,
    artifactDir: scratch,
  }));
  const researchFiles = copyCompileArtifacts(scratch, path.join(directory, 'research'));
  const traceFile = path.join(directory, 'trace.log');
  fs.writeFileSync(traceFile, research.stderr, 'utf8');
  const records = parseTrace(research.stderr);
  const parity = assertParity(production, research, {
    productionAssembly: productionFiles['candidate.compiler.s'],
    researchAssembly: researchFiles['candidate.compiler.s'],
    productionAdjusted: productionFiles['candidate.s'],
    researchAdjusted: researchFiles['candidate.s'],
    productionObject: productionFiles['candidate.o'],
    researchObject: researchFiles['candidate.o'],
  });
  requireIdentity(`${definition.id} emitted-state SHA-256`, parity.emittedStateSha256, definition.expectedEmittedStateSha256);
  const creationOrder = analyzeCreationOrder(records, definition.expectedSites);
  const pairs = schedulerPairs(records, definition.strictScheduler ? definition.expectedSites : null);
  return {
    id: definition.id,
    symbol: definition.symbol,
    role: definition.role,
    source: { origin: definition.origin, file: shown(sourceFile), sha256: sha256File(sourceFile), sourcePolicy },
    target: { targetId: target.targetId, bytes: target.bytes, sectionName: target.sectionName },
    parity,
    artifacts: {
      production: shown(path.join(directory, 'production')),
      research: shown(path.join(directory, 'research')),
      trace: shown(traceFile),
      traceSha256: sha256File(traceFile),
    },
    trace: {
      recordCount: records.length,
      typeCounts: Object.fromEntries([...new Set(records.map((record) => record.type))].map((type) => [type, records.filter((record) => record.type === type).length])),
      creationOrder,
      decisiveSchedulerPairs: pairs,
      semanticSchedulerEvidence: semanticSchedulerEvidence(records),
    },
  };
}

function readPinnedSource(record) {
  const file = path.join(ROOT, ...record.source.split('/'));
  const text = fs.readFileSync(file, 'utf8');
  requireIdentity(`${record.symbol} source SHA-256`, sha256File(file), record.sourceSha256);
  return { file, text };
}

function studyDefinitions() {
  const baselines = CASES.filter((record) => record.role === 'baseline-pure').map((record, index) => {
    const source = readPinnedSource(record);
    return {
      id: `b${index + 1}`,
      symbol: record.symbol,
      role: 'pinned-baseline',
      origin: record.source,
      sourceText: source.text,
      expectedBytes: record.expectedBytes,
      expectedSites: record.residualRegions.length,
      expectedEmittedStateSha256: EXPECTED_EMITTED_STATES[`b${index + 1}`],
      strictScheduler: true,
    };
  });
  const smallest = baselines[0];
  const selected = ['do-while-late-transfer', 'inline-two-result-helper'].map((id, index) => {
    const variant = FOCUSED_VARIANTS.find((item) => item.id === id);
    if (!variant) throw new Error(`focused variant definition is unavailable: ${id}`);
    return {
      id: `v${index + 1}`,
      symbol: smallest.symbol,
      role: 'focused-distinct-emitted-state',
      origin: `${smallest.origin} + ${id}`,
      sourceText: variant.apply(smallest.sourceText),
      expectedSites: 1,
      expectedEmittedStateSha256: EXPECTED_EMITTED_STATES[`v${index + 1}`],
      strictScheduler: false,
      variant: id,
    };
  });
  return [...baselines, ...selected];
}

function runStudy(options) {
  const session = prepareCompilerSession();
  const sourceEvidence = inspectCompilerSource(options.compilerSource, session.context.localTools.compiler);
  const prepared = prepareResearchSource(sourceEvidence);
  const build = buildResearchCompiler(prepared, sourceEvidence);
  const model = loadWorkbenchModel();
  const definitions = studyDefinitions();
  const cases = definitions.map((definition) => compileCase({
    session,
    researchCompiler: build.executable,
    model,
    definition,
  }));
  const focusedStates = cases.filter((item) => item.role === 'focused-distinct-emitted-state')
    .map((item) => item.parity.emittedStateSha256);
  if (focusedStates.length !== 2 || new Set(focusedStates).size !== 2) {
    throw new Error('focused emitted-state census is not exactly two distinct states');
  }
  const report = {
    schemaVersion: 1,
    study: 'allocator-scheduler-trace',
    researchOnly: true,
    acceptanceEligible: false,
    createdAt: new Date().toISOString(),
    authenticatedProductionCompiler: {
      path: session.context.localTools.compiler,
      sha256: sha256File(session.context.localTools.compiler),
      tool: session.tool,
    },
    pinnedCompilerSource: sourceEvidence,
    researchCompiler: {
      path: build.executable,
      sha256: sha256File(build.executable),
      manifest: shown(build.manifestFile),
      reusedBuild: build.reused,
      instrumentationId: INSTRUMENTATION_ID,
    },
    cases,
    directObservations: {
      creationOrder: 'At every allocator site, emit-rtl.c created the return-save and calls.c reported the result copy before emit-rtl.c created the owner load.',
      schedulerDecision: 'At every pinned baseline site, the schedule2 trace directly recorded equal priority, raw and post-ADJUST_COST values, free effective cost 1, class 3 for both candidates, the later owner-load LUID as comparator winner, and owner-load as selected ready[0].',
    },
    inference: {
      earliestSourceInfluence: 'A source change must affect call/tree expansion early enough to change semantic RTL creation before the calls.c result-copy point, or must create a genuinely non-free priority/dependence distinction before schedule2. Later statement spelling that reaches the same RTL cannot change this decision.',
      nextHypotheses: [
        'Test one semantics-justified form that materializes the owner read during an enclosing inline expression before the allocator call result is copied; reject it immediately if its first creation trace is unchanged.',
        'Use the do-while carrier trace to isolate its non-tie dependency, then test at most one narrower lifetime form only if that dependency is directly non-free and does not expand the emitted state.',
      ],
    },
    acceptanceBoundary: 'Only stderr logging is explanatory evidence. Research compiler assembly and objects were used solely for parity checks and must never be promoted as candidate output.',
  };
  writeJson(REPORT_FILE, report);
  return report;
}

function parseArguments(argv) {
  const result = {
    command: 'run',
    compilerSource: process.env.OB64_KMC_GCC_SOURCE || null,
  };
  const values = [...argv];
  if (values.includes('--help') || values.includes('-h')) return { ...result, command: 'help' };
  if (values[0] && !values[0].startsWith('-')) result.command = values.shift();
  while (values.length) {
    const option = values.shift();
    if (option === '--compiler-source') result.compilerSource = values.shift();
    else throw new Error(`unknown allocator scheduler trace option: ${option}`);
  }
  if (!result.compilerSource && result.command !== 'help') throw new Error('--compiler-source or OB64_KMC_GCC_SOURCE is required');
  return result;
}

function printHelp() {
  console.log([
    'Allocator scheduler research trace (diagnostic only)',
    '',
    'Usage:',
    '  node tools/matching_studies/allocator_scheduler_trace.js prepare --compiler-source <gcc-source>',
    '  node tools/matching_studies/allocator_scheduler_trace.js build --compiler-source <gcc-source>',
    '  node tools/matching_studies/allocator_scheduler_trace.js run --compiler-source <gcc-source>',
    '',
    'Generated source, compiler, trace, assembly, and object evidence remains under build/scheduler-trace/.',
  ].join('\n'));
}

function main(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.command === 'help') return printHelp();
  const session = prepareCompilerSession();
  const sourceEvidence = inspectCompilerSource(options.compilerSource, session.context.localTools.compiler);
  const prepared = prepareResearchSource(sourceEvidence);
  if (options.command === 'prepare') {
    console.log(JSON.stringify({ status: 'prepared', path: shown(prepared.copyRoot), reused: prepared.reused, instrumentationId: INSTRUMENTATION_ID }, null, 2));
    return;
  }
  const build = buildResearchCompiler(prepared, sourceEvidence);
  if (options.command === 'build') {
    console.log(JSON.stringify({ status: 'built', compiler: shown(build.executable), sha256: sha256File(build.executable), reused: build.reused }, null, 2));
    return;
  }
  if (options.command !== 'run') throw new Error(`unknown allocator scheduler trace command: ${options.command}`);
  // runStudy authenticates again so the standalone function retains a complete
  // fail-closed contract when imported by another tool.
  const report = runStudy(options);
  console.log(JSON.stringify({
    status: 'complete',
    report: shown(REPORT_FILE),
    parity: report.cases.every((item) => Object.values(item.parity).every((value) => value === true || typeof value === 'string')),
    cases: report.cases.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      creationSites: item.trace.creationOrder.length,
      decisiveSchedulerPairs: item.trace.decisiveSchedulerPairs.length,
    })),
  }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`allocator scheduler trace failed: ${error.stack || error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  EXPECTED_SOURCE_COMMIT,
  EXPECTED_EMITTED_STATES,
  INSTRUMENTATION_ID,
  analyzeCreationOrder,
  assertParity,
  instrumentCalls,
  instrumentEmitRtl,
  instrumentSched,
  parseArguments,
  parseTrace,
  schedulerPairs,
  semanticSchedulerEvidence,
  sideForKind,
  studyDefinitions,
};
