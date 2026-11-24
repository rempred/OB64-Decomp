#include "game/battle_roster_record.h"

#include "game/battle_predicates.h"
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;

s32 func_0002CBCC(void);
void func_0021D200(s32 record, s32 out_time, void *arg2);
void func_0021D230(s32 record, s32 out_time, void *arg2, s32 arg3);
s32 func_0022257C(void *record, s32 out_time, s32 *arg2);

s32 func_0022EDD4(void *record, s32 *out_time)
{
    s32 time;
    s32 current;
    u32 loaded;
    register u32 cap;
    u32 chance;
    u32 random0;
    u32 random1;
    s32 result;

    time = *out_time;
    current = ((BattleRosterRecord *)record)->scheduled_time;
    if (time < current) {
        time = current;
    }
    if (current < time) {
        current = time;
    }
    loaded = *(u32 *)0x801CE8C0;
    ((BattleRosterRecord *)record)->scheduled_time = current;
    loaded = *(u32 *)(loaded + 0x828);
    if (loaded < (u32)current) {
        cap = current;
    } else {
        cap = loaded;
    }
    *(u32 *)((u8 *)record + 0x94) = cap;
    func_0021D200(0x1C, cap, record);

    time = ((BattleRosterRecord *)record)->scheduled_time;
    chance = ((BattleRosterRecord *)record)->luck;
    ((BattleRosterRecord *)record)->actions_used += 1;
    random0 = func_0002CBCC();
    random1 = func_0002CBCC();
    if (chance >= ((((random0 << 18) & 0x0C000000U) |
                    (random1 << 15) | (u32)func_0002CBCC()) % 100U)) {
        func_0021D230(0x26, time, record, 0xFF);
        *(s32 *)((u8 *)record + 0x40) &= ~4;
        time += func_0022257C((u8 *)((BattleRosterRecord *)record)->primary_children[0] + 0x44, 0x23, 0);
        if (func_0020C348(record) != 0) {
            func_0021D230(0x27, time, record, 0xFF);
        }
        result = 1;
        ((BattleRosterRecord *)record)->scheduled_time = time;
        *out_time = time;
        return result;
    }
    return 1;
}
