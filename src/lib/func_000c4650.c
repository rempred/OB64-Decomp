#include "game/scenario_item_views.h"

extern u16 D_80190EBC[];
extern u8 D_80191010[];
extern u8 *D_80196AF8;
extern u8 func_00045440(s32 item_id);

/* Update target availability for the requested Army consumable. */
u16 func_000c4650(u16 item_id)
{
    u16 available = 0;
    s32 index;
    u8 capped;
    if (func_00045440(item_id) == 1) {
        for (index = 0; index < 220; index++) {
            ScenarioCharacter *character = &D_80193BC0[index];
            u8 *flags = D_80196AF8 + 0x1872 + index * 2;
            switch (item_id) {
            case 1:
            case 2:
                if (index == 0 || (*flags & 0x10)) goto disabled;
                if (index >= 100) {
                    u16 hp = D_80190EBC[index];
                    u16 maximum = D_80190EBC[99];
                    u16 third;
                    if (hp == maximum) *flags |= 0x80;
                    else {
                        third = maximum / 3U;
                        if (hp == third || hp == third * 2) *flags |= 0x80;
                        else if (hp != 0) {
                            *flags &= 0x7F;
                            available++;
                        }
                    }
                } else if (character->secondary_class_id != 0) {
                    if (character->hp == 0 || character->hp == character->max_hp) *flags |= 0x80;
                    else { *flags &= 0x7F; available++; }
                }
                continue;
            case 6:
                if (index == 0 || (*flags & 0x10)) goto disabled;
                if (index >= 100) {
                    if (D_80190EBC[index] == 0 || !(D_80191010[index] & 4)) goto disabled;
                    *flags &= 0x7F;
                    available++;
                } else if (character->secondary_class_id != 0) {
                    if (character->hp == 0 || !(character->status_flags & 4)) goto disabled;
                    *flags &= 0x7F;
                    available++;
                }
                continue;
            case 7:
                if (index == 0 || (*flags & 0x10) || index >= 100) goto disabled;
                if (character->secondary_class_id != 0) {
                    if (character->hp != 0) *flags |= 0x80;
                    else { *flags &= 0x7F; available++; }
                }
                continue;
            default:
                if (index == 0 || (*flags & 0x10) || index >= 100) goto disabled;
                if (character->secondary_class_id == 0) continue;
                break;
            }
            /* Keep the per-case cap exits and the last/default merge distinct.
             * KMC otherwise fills the class guard from the range check, changing
             * the retail branch-likely delay slot. */
            capped = 0;
            switch (item_id) {
            case 9:
                if (character->level >= 99) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 10:
                if (character->max_hp >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 11:
                if (character->stats_1C[0] >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 12:
                if (character->stats_1C[1] >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 13:
                if (character->stats_1C[2] >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 14:
                if (character->stats_1C[3] >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 15:
                if (character->stats_1C[4] >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 16:
                if (character->stats_1C[5] >= 999) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 17:
                if (character->alignment >= 100) capped++;
                if (capped) goto disabled;
                goto enabled;
            case 18:
                if (character->alignment == 0) capped++;
                break;
            }
            if (capped) goto disabled;
enabled:
            *flags &= 0x7F;
            available++;

            continue;
disabled:
            *flags |= 0x80;
        }
    } else {
        for (index = 0; index < 30; index++) {
            u8 *squad = D_80196AF8 + 0x117C + index * 0x36;
            if (squad[3] != 0xFF) {
                if (squad[1] & 0x10) squad[1] |= 0x80;
                else squad[1] &= 0x7F;
            }
        }
    }
    return available;
}


