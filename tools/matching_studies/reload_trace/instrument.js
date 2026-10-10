'use strict';

// Only reload1.c is changed. Every added call observes already computed state;
// no compiler predicate is evaluated a second time and no RTL is constructed.
function once(text, needle, replacement) {
  const at = text.indexOf(needle);
  if (at < 0 || text.indexOf(needle, at + needle.length) >= 0) throw Error('nonunique reload trace anchor: ' + needle.slice(0, 100));
  return text.slice(0, at) + replacement + text.slice(at + needle.length);
}
function body(text, name, transform) {
  const at = text.indexOf('\n' + name + ' (');
  if (at < 0) throw Error('function missing: ' + name);
  const start = text.indexOf('{', at); let depth = 1, i = start + 1, state = '';
  for (; i < text.length && depth; i++) {
    const c = text[i], n = text[i + 1];
    if (state === 'comment') { if (c === '*' && n === '/') { state = ''; i++; } }
    else if (state) { if (c === '\\') i++; else if (c === state) state = ''; }
    else if (c === '/' && n === '*') { state = 'comment'; i++; }
    else if (c === '"' || c === "'") state = c;
    else if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  if (depth) throw Error('unclosed function: ' + name);
  return text.slice(0, start + 1) + transform(text.slice(start + 1, i - 1)) + text.slice(i - 1);
}
const DECL = `
/* Research-only reload observers; definitions are below all compiler globals. */
static void rr_event ();
static void rr_rtx ();
static void rr_list ();
static void rr_state ();
static void rr_range ();
static void rr_spills ();
static int rr_attempt = -1;
static int rr_choose = 0;
static int rr_phase = 0;
`;
const SUPPORT = String.raw`

/* Observational output is separate from compiler assembly. */
static unsigned long rr_sequence;
static int rr_started;
static int rr_overflow;
static void rr_finish ()
{
  fprintf (stderr, "RR|end|%lu|%d\n", rr_sequence, rr_overflow);
  fflush (stderr);
}
static int rr_enabled ()
{
  char *on = getenv ("OB64_RELOAD_TRACE");
  char *filter = getenv ("OB64_RELOAD_FUNCTION");
  if (!on || strcmp (on, "1")) return 0;
  if (filter && filter[0] && (!current_function_name || strcmp (filter, current_function_name))) return 0;
  if (!rr_started) {
    rr_started = 1;
    fprintf (stderr, "RR|begin|1\n");
    atexit (rr_finish);
  }
  if (rr_sequence >= 2000000) { rr_overflow = 1; return 0; }
  return 1;
}
static void rr_event (kind, insn, r, a, b, c)
     char *kind; rtx insn; int r, a, b, c;
{
  if (!rr_enabled ()) return;
  fprintf (stderr, "RR|%s|%lu|%s|%d|%d|%d|%d|%d|%d|%d|%d|%d\n",
    kind, ++rr_sequence, current_function_name ? current_function_name : "?",
    insn ? INSN_UID (insn) : -1, rr_phase, rr_choose, rr_attempt, r, last_spill_reg, a, b, c);
}
static void rr_rtx (kind, insn, r, x)
     char *kind; rtx insn; int r; rtx x;
{
  if (!rr_enabled ()) return;
  rr_event (kind, insn, r, 0, 0, 0);
  fprintf (stderr, "RR|rtl-begin\n");
  if (x) { print_rtl (stderr, x); fprintf (stderr, "\n"); } else fprintf (stderr, "nil\n");
  fprintf (stderr, "RR|rtl-end\n");
}
static void rr_list (kind, insn)
     char *kind; rtx insn;
{
  int r;
  if (!rr_enabled ()) return;
  rr_event (kind, insn, -1, n_reloads, 0, 0);
  for (r = 0; r < n_reloads; r++) {
    rr_event ("descriptor", insn, r, reload_reg_class[r], reload_opnum[r], reload_optional[r]);
    rr_event ("descriptor-modes", insn, r, reload_inmode[r], reload_outmode[r], reload_secondary_p[r]);
    rr_event ("descriptor-kind", insn, r, reload_when_needed[r], 0, 0);
    rr_rtx ("input", insn, r, reload_in[r]);
    rr_rtx ("output", insn, r, reload_out[r]);
    rr_rtx ("selected", insn, r, reload_reg_rtx[r]);
  }
}
static void rr_state (kind, insn)
     char *kind; rtx insn;
{
  int j, r;
  if (!rr_enabled ()) return;
  rr_event (kind, insn, -1, n_reloads, 0, 0);
  for (j = 0; j < n_reloads; j++) {
    r = reload_order[j];
    rr_event ("state", insn, r, j, reload_inherited[r], reload_spill_index[r]);
    rr_rtx ("state-reg", insn, r, reload_reg_rtx[r]);
    rr_rtx ("state-override", insn, r, reload_override_in[r]);
  }
}
static void rr_range (kind, insn, first, end)
     char *kind; rtx insn, first, end;
{
  rtx p;
  if (!rr_enabled ()) return;
  rr_event (kind, insn, -1, 0, 0, 0);
  for (p = first; p && p != end; p = NEXT_INSN (p))
    if (GET_RTX_CLASS (GET_CODE (p)) == 'i') rr_rtx ("insn", p, -1, PATTERN (p));
  rr_event ("range-end", insn, -1, 0, 0, 0);
}
static void rr_spills (kind, insn)
     char *kind; rtx insn;
{
  int i;
  if (!rr_enabled ()) return;
  rr_event (kind, insn, -1, n_spills, 0, 0);
  for (i = 0; i < n_spills; i++)
    rr_event ("spill", insn, -1, i, spill_regs[i], reg_reloaded_contents[i]);
}
`;
function instrument(source) {
  let s = source.replace(/\r\n/g, '\n');
  s = once(s, '#include "real.h"\n', '#include "real.h"\n' + DECL);
  for (const [mode, fourth] of [[0, 'global'], [1, 'live_known']]) {
    const needle = `find_reloads (insn, ${mode}, spill_indirect_levels, ${fourth},\n\t\t\t    spill_reg_order);`;
    s = once(s, needle, `rr_phase = ${mode};\n              rr_event ("find-begin", insn, -1, ${mode}, 0, 0);\n              ${needle}\n              rr_list ("find-end-${mode}", insn);`);
  }
  s = body(s, 'reload_as_needed', t => {
    t = once(t, '  bzero ((char *) spill_reg_rtx', '  rr_phase = 1;\n  rr_event ("replacement-begin", first, -1, live_known, 0, 0);\n  bzero ((char *) spill_reg_rtx');
    t = once(t, '  for (insn = first; insn;)', '  rr_spills ("spill-order", first);\n  for (insn = first; insn;)');
    t = once(t, '      register rtx next = NEXT_INSN (insn);', '      register rtx next = NEXT_INSN (insn);\n      rr_event ("scan", insn, -1, GET_CODE (insn), 0, 0);');
    t = once(t, '\t      subst_reloads ();', '\t      subst_reloads ();\n              rr_range ("emitted-substituted", insn, NEXT_INSN (prev), next);');
    // Record reset-triggering instructions and resulting spill contents, without
    // inventing a reset of the round-robin cursor (the compiler does not do one).
    t = once(t, '      insn = next;', '      if (GET_CODE (insn) == CODE_LABEL || GET_CODE (insn) == CALL_INSN)\n        rr_spills ("label-call-state", insn);\n      insn = next;');
    return t + '\n  rr_range ("replacement-survivors", first, first, 0);\n  rr_event ("replacement-end", first, -1, 0, 0, 0);\n';
  });
  s = body(s, 'allocate_reload_reg', t => {
    t = once(t, '  int force_group = reload_nregs[r] > 1 && ! last_reload;', '  int force_group = reload_nregs[r] > 1 && ! last_reload;\n  rr_event ("allocate-begin", insn, r, last_reload, noerror, force_group);');
    t = once(t, '\t  i = (i + 1) % n_spills;', '\t  i = (i + 1) % n_spills;\n          rr_event ("allocate-index", insn, r, pass, i, spill_regs[i]);');
    t = t.replace(/return 0;/g, '{ rr_event ("allocate-failure", insn, r, pass, count, noerror); return 0; }');
    t = once(t, '    last_spill_reg = i;', '    rr_event ("allocate-selected", insn, r, i, regno, pass);\n    last_spill_reg = i;');
    t = once(t, '\t    return 1;', '\t    rr_event ("allocate-success", insn, r, i, regno, pass);\n\t    return 1;');
    t = once(t, ' failure:\n', ' failure:\n  rr_event ("allocate-fatal", insn, r, noerror, 0, 0);\n');
    t = once(t, '\n  return 1;', '\n  rr_event ("allocate-disabled", insn, r, 0, 0, 0);\n  return 1;');
    return t;
  });
  s = body(s, 'choose_reload_regs', t => {
    t = once(t, '  bzero (reload_inherited', '  rr_choose++; rr_attempt = -1;\n  rr_event ("choose-begin", insn, -1, n_reloads, 0, 0);\n  bzero (reload_inherited');
    t = once(t, '  bcopy ((char *) reload_reg_rtx', '  rr_state ("choose-order", insn);\n  bcopy ((char *) reload_reg_rtx');
    t = once(t, '  for (inheritance = optimize > 0; inheritance >= 0; inheritance--)\n    {', '  for (inheritance = optimize > 0; inheritance >= 0; inheritance--)\n    {\n      rr_attempt = inheritance;\n      rr_state ("attempt-begin", insn);');
    t = once(t, '\t\t      reload_spill_index[r] = i;', '\t\t      reload_spill_index[r] = i;\n                      rr_event ("inherit-success", insn, r, regno, i, reload_inheritance_insn[r] ? INSN_UID (reload_inheritance_insn[r]) : -1);');
    t = once(t, '\t      int regno;\n', '\t      int regno;\n              rr_rtx ("equivalent-found", insn, r, equiv);\n');
    t = once(t, '\t      /* If we found an equivalent reg, say no code need be generated', '\t      rr_rtx ("equivalent-usable", insn, r, equiv);\n              /* If we found an equivalent reg, say no code need be generated');
    t = once(t, '\t\t  reload_inherited[r] = 1;', '\t\t  reload_inherited[r] = 1;\n                  rr_event ("equivalent-success", insn, r, regno, 0, 0);');
    t = once(t, '      if (j == n_reloads)\n\tbreak;', '      if (j == n_reloads)\n        { rr_state ("attempt-success", insn); break; }');
    t = once(t, '    fail:\n', '    fail:\n      rr_state ("retry-before-restore", insn);\n');
    t = once(t, '    }\n\n  /* If we thought we could inherit', '      rr_state ("retry-after-restore", insn);\n    }\n\n  rr_state ("before-cancellations", insn);\n  /* If we thought we could inherit');
    t = once(t, '  /* Record which pseudos and which spill regs have output reloads.  */', '  rr_state ("after-cancellations", insn);\n  /* Record which pseudos and which spill regs have output reloads.  */');
    return t + '\n  rr_state ("choose-end", insn);\n';
  });
  s = body(s, 'emit_reload_insns', t => {
    // Actual alternate input selected during emission, after its validation.
    t = once(t, '\t  if (oldequiv == 0)\n\t    oldequiv = old;', '\t  rr_rtx ("emit-equivalent", insn, j, oldequiv);\n\t  if (oldequiv == 0)\n\t    oldequiv = old;');
    return t;
  });
  return s + SUPPORT;
}
module.exports = { instrument, once, body };
