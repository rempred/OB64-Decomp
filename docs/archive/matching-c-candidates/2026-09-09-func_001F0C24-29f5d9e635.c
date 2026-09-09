#include "game/combat_types.h"

typedef unsigned char u8;

typedef struct {
    u8 prefix[0xC0];
    u8 *field_C0;
    u32 field_C4;
    u32 field_C8;
} CombatServiceSlot;

extern CombatServiceSlot *D_801CE8BC;
extern u8 *func_001F0A9C(u32);
extern int func_00201E08(int, int, int);
extern u32 func_00201E38(int, u32);
extern void *func_00001330(u32);

u8 *func_001F0C24(u32 key)
{
    volatile CombatServiceSlot *scan = D_801CE8BC;
    CombatServiceSlot *slot;
    u32 i, selected, row, x;
    u8 *found;
    u8 *source, *output, *sourceRow, *destination;

    for (i = 0; i < 16; scan = (CombatServiceSlot *)((u8 *)scan + 12)) {
        i++;
        if (scan->field_C0 != 0 && scan->field_C4 == key) {
            found = scan->field_C0;
            scan->field_C8 = 15;
            return found;
        }
    }
    for (selected = 0; selected < 16; selected++) {
        if (((CombatServiceSlot *)((u8 *)D_801CE8BC + selected * 12))->field_C0 == 0) {
            source = func_001F0A9C(0x00391270);
            output = func_00001330(func_00201E08(0, 90, 15) + 8);
            output[0] = 0x36;
            output[1] = 0x34;
            output[2] = 2;
            *(u16 *)(output + 4) = 90;
            output[3] = 0;
            *(u16 *)(output + 6) = 15;
            for (row = 0; row < 15; row++) {
                sourceRow = source + (func_00201E38(4, 90) * (row + key * 15) + 8);
                destination = output + (func_00201E38(0, 90) * row + 8);
                for (x = 0; x < 90; x += 4) {
                    *destination++ = ((*sourceRow >> 2) & 0x30) | ((*sourceRow >> 4) & 3);
                    *destination++ = ((*sourceRow << 2) & 0x30) | (*sourceRow & 3);
                    sourceRow++;
                }
            }
            slot = (CombatServiceSlot *)((u8 *)D_801CE8BC + selected * 12);
            slot->field_C0 = output;
            slot->field_C4 = key;
            slot->field_C8 = 15;
            return slot->field_C0;
        }
    }
    return 0;
}
