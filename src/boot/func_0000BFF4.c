#include "common/syncprintf.h"
#include "game/boot_archive_record.h"

extern signed char g_lha_bad_table_fmt[];
extern signed char g_lha_diag_prefix[];
void func_0000BFF4(const u8 *name, const u8 *message) {
    func_00023940((const char *)g_lha_bad_table_fmt, (const char *)g_lha_diag_prefix, (const char *)name, (const char *)message);
}
