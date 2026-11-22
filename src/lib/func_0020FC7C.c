#include "game/battle_roster_record.h"

#include "game/combat_types.h"

struct Func001F0E64Record;
extern void func_001F0E64(struct Func001F0E64Record *, u32);
extern void func_0020FA04(void *, int);

static __inline__ int flag(BattleRosterRecord *record, int bit)
{
    if (!record) return 0;
    return (record->flags40 >> bit) & 1;
}

void func_0020FC7C(BattleRosterRecord *record)
{
    u32 selector = 0;
    int code = 0;
    u32 index;
    if (flag(record, 3)) {
        code = 9;
        selector = 0x20;
    } else if (!flag(record, 3) && flag(record, 2)) {
        code = 5;
        selector = 0x22;
    } else if (!flag(record, 3) && !flag(record, 2) && flag(record, 4)) {
        code = 1;
        selector = 0;
    }
    if (code) {
        func_0020FA04(record, code);
        for (index = 0; index < 3; index++) {
            void *child = record->links[index];
            if (child) {
                func_001F0E64((struct Func001F0E64Record *)((unsigned char *)child + 0x44), selector);
            }
        }
    }
}
