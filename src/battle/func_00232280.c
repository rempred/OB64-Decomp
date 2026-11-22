#include "game/battle_record_flag.h"

#include "game/battle_resolution_record.h"

typedef unsigned char u8;
typedef unsigned int u32;

typedef struct ResolutionGlobal {
    u8 unknown00[0x6074];
    u8 field6074;
} ResolutionGlobal;

extern ResolutionGlobal *D_801CE8BC;
extern int func_0020BF6C(void);
extern void *func_0020C478(unsigned int index);

void func_00232280(BattleResolutionRecord *records)
{
    BattleRosterRecord *object;
    BattleResolutionRecord temporary;
    int i;
    u32 j;

    if (!func_0020BF6C())
        return;
    if (!D_801CE8BC->field6074)
        return;

    for (i = 0; i < 20; ++i) {
        object = func_0020C478(i);
        if (!func_0020C2C0(object) && !func_0020C014(object))
            break;
    }
    if (i >= 20)
        return;

    for (i = 0; i < 6; ++i) {
        for (j = 0; j < 3; ++j) {
            if (records[i].objects[j] == object) {
                while (i != 0) {
                    temporary = records[i];
                    records[i] = records[i - 1];
                    records[i - 1] = temporary;
                    --i;
                }
                D_801CE8BC->field6074 = 0;
                return;
            }
        }
    }

    --object->field6C;
    func_00231CC0(records);
    func_00232280(records);
}
