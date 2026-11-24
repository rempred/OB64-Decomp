#include "game/battle_roster_record.h"
#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_801CE8C0;
extern u8 *D_801CE8BC;
/* Retail byte access at 0x801CE8F8; the original data ASM owns its storage. */
extern u8 D_801CE8F8;
s32 func_0020C120(void *);
void *func_0020C478(u32);
s32 func_00214BDC(void *);
void func_0021D200(s32, s32, void *);
s32 func_0022BFF8(void *, s32 *);
s32 func_0022C78C(void *, s32 *);
s32 func_0022D14C(void *, s32 *);
s32 func_0022EC08(void *, s32 *);
s32 func_0022EDD4(void *, s32 *);
void func_0022EF50(void *);

s32 func_0022F2BC(void *record, s32 *out_time)
{
    s32 count, limit, current, requested, flags, scan_index, predicate, result;
    s32 final_count, final_time;
    s32 scan_current, scan_requested, initial_count, return_time;
    u8 *return_global;
    u32 early_loaded, middle_loaded, scan_loaded;
    register u32 cap;
    register u32 scan_cap;
    u8 mode;
    u8 *global;
    u8 *owner;
    BattleRosterRecord *entry;

    if (record == 0) {
        return 0;
    }
    initial_count = ((BattleRosterRecord *)record)->actions_used;
    limit = ((BattleRosterRecord *)record)->action_limit;
    *(s32 *)((u8 *)record + 0x8C) = 0;
    *(s32 *)((u8 *)record + 0x88) = 0;
    *(s32 *)((u8 *)record + 0x84) = 0;
    if (initial_count >= limit) {
        return 0;
    }

    global = D_801CE8C0;
    global[0x818]++;
    if (func_0020C2C0(record) != 0 || func_0020C32C(record) != 0) {
        current = ((BattleRosterRecord *)record)->scheduled_time;
        requested = *out_time;
        if (current < requested) current = requested;
        early_loaded = (u32)D_801CE8C0;
        ((BattleRosterRecord *)record)->scheduled_time = current;
        early_loaded = *(u32 *)(early_loaded + 0x828);
        if (early_loaded < (u32)current) cap = current;
        else cap = early_loaded;
        *(u32 *)((u8 *)record + 0x94) = cap;
        func_0021D200(0x1C, cap, record);
        count = ((BattleRosterRecord *)record)->actions_used;
        return_time = ((BattleRosterRecord *)record)->scheduled_time;
        result = 0;
        count++;
        ((BattleRosterRecord *)record)->actions_used = count;
        *out_time = return_time;
        return result;
    }
    flags = *(s32 *)((u8 *)record + 0x40);
    if (flags & 8) return func_0022EC08(record, out_time);
    if (flags & 4) return func_0022EDD4(record, out_time);

    owner = D_801CE8C0;
    count = ((BattleRosterRecord *)record)->actions_used;
    if (count != *(s32 *)owner || ((BattleRosterRecord *)record)->action_limit < count) {
        current = ((BattleRosterRecord *)record)->scheduled_time;
        requested = *out_time;
        if (current < requested) current = requested;
        ((BattleRosterRecord *)record)->scheduled_time = current;
        middle_loaded = *(u32 *)(owner + 0x828);
        if (middle_loaded < (u32)current) cap = current;
        else cap = middle_loaded;
        *(u32 *)((u8 *)record + 0x94) = cap;
        func_0021D200(0x1C, cap, record);
        count = ((BattleRosterRecord *)record)->actions_used;
        return_time = ((BattleRosterRecord *)record)->scheduled_time;
        result = 0;
        count++;
        ((BattleRosterRecord *)record)->actions_used = count;
        *out_time = return_time;
        return result;
    }
    if (func_00214BDC(record) != 0) {
        scan_index = 0;
        do {
            entry = func_0020C478(scan_index);
            predicate = func_0020C2C0(entry);
            scan_index++;
            if (predicate == 0) entry->actions_used = entry->action_limit;
        } while (scan_index < 20);
        scan_current = ((BattleRosterRecord *)record)->scheduled_time;
        scan_requested = *out_time;
        if (scan_current < scan_requested) scan_current = scan_requested;
        scan_loaded = (u32)D_801CE8C0;
        ((BattleRosterRecord *)record)->scheduled_time = scan_current;
        scan_loaded = *(u32 *)(scan_loaded + 0x828);
        if (scan_loaded < (u32)scan_current) scan_cap = scan_current;
        else scan_cap = scan_loaded;
        *(u32 *)((u8 *)record + 0x94) = scan_cap;
        func_0021D200(0x1C, scan_cap, record);
        final_count = ((BattleRosterRecord *)record)->actions_used;
        final_time = ((BattleRosterRecord *)record)->scheduled_time;
        final_count++;
        ((BattleRosterRecord *)record)->actions_used = final_count;
        *out_time = final_time;
        return_global = D_801CE8BC;
        result = 1;
        return_global[0x6088] = 1;
        return result;
    }
    if (((BattleRosterRecord *)record)->secondary_class_id.word == 0xA4) D_801CE8F8++;
    func_0022EF50(record);
    mode = ((BattleRosterRecord *)record)->action_kind;
    if (mode == 0) {
        if (func_0020C120(record) != 0) result = func_0022C78C(record, out_time);
        else result = func_0022B1F4(record, out_time);
    } else if (mode == 1) result = func_0022BFF8(record, out_time);
    else result = func_0022D14C(record, out_time);
    if (result != 0) return result;
    *(s32 *)((u8 *)record + 0x68) = -1;
    return 0;
}
