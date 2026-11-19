typedef signed int s32;
void func_0000BFC0(s32 a);
extern signed char g_lha_bad_table_fmt[];
extern signed char g_lha_diag_prefix[];
extern signed char g_lha_bad_table_suffix[];
void func_00023940(const signed char *fmt, ...);
void func_0000BFC0(s32 a) {
    func_00023940(g_lha_bad_table_fmt, g_lha_diag_prefix, g_lha_bad_table_suffix, a);
}
