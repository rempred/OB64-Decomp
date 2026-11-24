#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

s32 func_0020C104(void *record);
s32 func_0020C2C0(void *record);
void *func_0020C478(unsigned int index);
s32 func_0020D444(s32, s32);
s32 func_002224F4(void);
void func_0022A414(void *record);

void func_0022A7B8(void *record, s32 unused1, s32 field94, s32 amount, s32 unused4, s32 adjust)
{
    s32 result;
    s32 first;
    s32 second;
    s32 mask;
    s32 clearIndex;
    u8 *cursor;
    s32 remaining;
    s32 updated;
    BattleRosterRecord *entry;
    if (func_0020C104(record) != 0) {
        remaining = ((BattleRosterRecord *)record)->hp;
        if (amount >= remaining) {
            clearIndex = 0;
            do {
                ((s32 *)record)[clearIndex] = 0;
                ((s32 *)record)[clearIndex + 3] = 0;
                clearIndex++;
            } while (clearIndex < 3);
            ((BattleRosterRecord *)record)->hp = 0;
            ((BattleRosterRecord *)record)->scheduled_time = field94;
            *(s32 *)((u8 *)record + 0x40) = (*(s32 *)((u8 *)record + 0x40) & ~0x3E) | 1;
            return;
        }
        /* Retail calls twice and reloads both fields between the calls. */
        first = func_0020D444(remaining - amount, ((BattleRosterRecord *)record)->max_hp);
        second = func_0020D444(((BattleRosterRecord *)record)->hp - amount, ((BattleRosterRecord *)record)->max_hp);
        remaining = 0;
        if (second != first) {
            mask = ((1 << second) - 1) ^ ((1 << first) - 1);
            cursor = record;
            do {
                result = (mask >> remaining) & 1;
                remaining++;
                if (result) {
                    *(s32 *)cursor = 0;
                    *(s32 *)(cursor + 0xC) = 0;
                }
                cursor += 4;
            } while ((u32)remaining < 3);
        }
        updated = ((BattleRosterRecord *)record)->hp - amount;
        goto store_remaining;
    }
    mask = ((BattleRosterRecord *)record)->hp;
    if (amount < mask) {
        updated = mask - amount;
store_remaining:
        ((BattleRosterRecord *)record)->hp = updated;
        if (adjust != 0) {
            func_0022A414(record);
        }
        ((BattleRosterRecord *)record)->scheduled_time = field94;
        return;
    }
    ((BattleRosterRecord *)record)->hp = 0;
    ((BattleRosterRecord *)record)->scheduled_time = field94;
    *(s32 *)((u8 *)record + 0x40) = (*(s32 *)((u8 *)record + 0x40) & ~0x3E) | 1;
    result = func_002224F4();
    *(u16 *)((u8 *)*(void **)0x801CE8BC + 0x606A) = result;
    first = 0;
    if ((u16)result) {
        do {
            entry = func_0020C478(first);
            result = func_0020C2C0(entry);
            first++;
            if (result == 0) {
                entry->actions_used = entry->action_limit;
            }
        } while (first < 20);
    }
}
