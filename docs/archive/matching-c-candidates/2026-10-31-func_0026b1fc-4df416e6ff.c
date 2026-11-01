#include "common/types.h"

typedef struct Func0026ADD0Record {
    u32 unknown_00;
    u32 *entry_04;
    void *records_08;
    void *slots_0C;
    u16 value_10;
    u8 unknown_12[6];
} Func0026ADD0Record;

typedef struct Func0026ADD0Fields {
    float (*matrices_00)[4][4];
    s32 count_04;
    u16 *flags_08;
    Func0026ADD0Record *records_0C;
} Func0026ADD0Fields;

extern void func_00268358(u32 count, void *slots);

void func_0026b1fc(Func0026ADD0Fields *fields, s32 item)
{
    if (!(fields->flags_08[item] & 1)) {
        func_00268358(fields->records_0C[item].entry_04[1],
                      fields->records_0C[item].slots_0C);
        fields->flags_08[item] |= 1;
    }
}
