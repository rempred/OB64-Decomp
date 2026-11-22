#include "game/boot_archive_record.h"

/* Partial view of the observed sixteen-byte input. */
typedef struct ResourceArchiveInput {
    u32 field_00;
    u32 field_04;
    u32 field_08;
    u32 field_0C;
} ResourceArchiveInput;

typedef union ResourceArchiveInputOrCount {
    ResourceArchiveInput *input;
    u32 count;
} ResourceArchiveInputOrCount;

extern void func_0000B33C(u32 acquire);
extern void func_0000C204(void); /* Existing binding is RAM8007C204. */
extern void func_0000BBC0(u32 key); /* Existing binding is RAM8007BBC0. */
extern const u8 g_boot_resource_lzss_error_anchor[];

u32 func_0000B29C(ResourceArchiveInput *input)
{
    ResourceRecordScratch scratch;
    ArcFile *record;
    ResourceArchiveInputOrCount state;

    state.input = input;
    func_0000B33C(1);
    func_0000C204();
    /* Archive table800AE0A8, relative to the existing800B0000 anchor. */
    record = func_0000F4E4((void *)state.input->field_00,
                         g_boot_resource_lzss_error_anchor - 0x1F58,
                         (u8 *)state.input->field_08, (s32)state.input->field_0C);
    if (record == 0) {
        func_0000BBC0(state.input->field_00);
    }
    state.count = 0;

    while (func_0000B3E4(record, &scratch.record) != 0) {
        state.count++;
        record->pos += scratch.record.word08;
    }
    record->open = 0;
    func_0000B33C(0);
    return state.count;
}
