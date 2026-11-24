#include "game/scenario_item_views.h"

/* Partial pool view: maximum is also D_80190EBC[99]; target IDs100..255 follow it. */
extern u16 D_80190EBC[];
extern u8 D_80191010[];
extern u16 D_801953F2;
extern u16 D_8019532C[];
extern s32 rand(void);
struct CharacterRecord;
extern void character_apply_level_up(struct CharacterRecord *);

/* Parameterized remainder retains the signed division used by this compiler. */
static inline s32 random_bounded(s32 divisor)
{
    return rand() % divisor;
}
static inline s32 above(s32 value, s32 maximum) { return value > maximum; }
/* Preview an item effect so the caller can retain its value, or apply that saved value. */
s32 func_00041098(u8 apply_effect, s32 effect_value, u16 item_id, u8 target_index)
{
    ScenarioCharacter *character = &D_80193BC0[target_index];
    s32 result = 0;
    u16 amount;
    s32 current;
    u16 *halfword_stat;
    u8 *byte_stat;

    switch (item_id) {
    case 1:
    case 2:
        amount = 100; if (item_id != 1) amount = 300;
        result = amount;
        goto heal;
    case 3:
        amount = 150;
        result = 150;
heal:
        if (apply_effect) {
            if (target_index >= 100) {
                u16 step = D_80190EBC[99] / 3U;
                /* Widen after narrowing: keep the cap unit distinct from the countdown step. */
                s32 segment_size = (u16)(D_80190F82.pool.maximum / 3U);
                s16 remaining = D_80190F82.pool.values[target_index - 100];
                s16 count = 0;
                s32 segments;
                u16 limit;
                while (remaining > 0) { remaining -= step; count++; }
                if (count >= 4) count = 3;
                segments = (u8)count;
                if ((u32)segments >= 3) limit = D_80190F82.pool.maximum;
                else limit = segment_size * segments;
                if (limit < D_80190EBC[target_index] + amount) D_80190EBC[target_index] = limit;
                else D_80190EBC[target_index] = D_80190EBC[target_index] + amount;
            } else {
                u16 hp = character->hp;
                if (hp != 0) {
                    u16 maximum = character->max_hp;
                    u16 healed;
                    if (maximum < hp + effect_value) healed = maximum;
                    else healed = hp + effect_value;
                    character->hp = healed;
                }
            }
        }
        break;
    case 4:
    case 5:
        amount = 20; if (item_id != 4) amount = 50;
        result = amount;
        if (apply_effect) {
            if (target_index < 100) {
                u8 fatigue;
                if (character->fatigue - effect_value < 0) fatigue = 0;
                else fatigue = character->fatigue - effect_value;
                character->fatigue = fatigue;
            }
        }
        break;
    case 6:
        if (apply_effect) {
            if (target_index >= 100) D_80191010[target_index] &= 0xFB;
            else character->status_flags &= 0xFB;
        }
        break;
    case 7:
        result = character->max_hp;
        if (apply_effect) {
            u16 hp = character->hp;
            if (result >= hp + effect_value) hp = hp + effect_value;
            else hp = character->max_hp;
            character->hp = hp;
            character->status_flags &= 0xFB;
        }
        break;
    case 9:
        if (!apply_effect) { rand(); result = 1; }
        else { character_apply_level_up((struct CharacterRecord *)character); result = 0; }
        break;
    /* Separate cases preserve the compiler-shared generation and clamp tails. */
    case 10:
        current = character->max_hp;
        halfword_stat = &character->max_hp;
        if (!apply_effect) result = random_bounded(6) + (5);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 11:
        current = character->stats_1C[0];
        halfword_stat = &character->stats_1C[0];
        if (!apply_effect) result = random_bounded(3) + (2);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 12:
        current = character->stats_1C[1];
        halfword_stat = &character->stats_1C[1];
        if (!apply_effect) result = random_bounded(3) + (2);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 13:
        current = character->stats_1C[2];
        halfword_stat = &character->stats_1C[2];
        if (!apply_effect) result = random_bounded(3) + (2);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 14:
        current = character->stats_1C[3];
        halfword_stat = &character->stats_1C[3];
        if (!apply_effect) result = random_bounded(3) + (2);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 15:
        current = character->stats_1C[4];
        halfword_stat = &character->stats_1C[4];
        if (!apply_effect) result = random_bounded(3) + (2);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 16:
        current = character->stats_1C[5];
        halfword_stat = &character->stats_1C[5];
        if (!apply_effect) result = random_bounded(3) + (2);
        else {
            current += (s16)effect_value;
            if (above(current, 999)) current = 999;
            else if (current < 0) current = 0;
            if (apply_effect) *halfword_stat = current;
            result = 0;
        }
        break;
    case 17:
        current = character->alignment;
        byte_stat = &character->alignment;
        if (!apply_effect) result = random_bounded(3) + (1);
        else {
            current += (s16)effect_value;
            if (above(current, 100)) current = 100;
            else if (current < 0) current = 0;
            if (apply_effect) *byte_stat = current;
            result = 0;
        }
        break;
    case 18:
        current = character->alignment;
        byte_stat = &character->alignment;
        if (!apply_effect) result = random_bounded(3) + (-3);
        else {
            current += (s16)effect_value;
            if (above(current, 100)) current = 100;
            else if (current < 0) current = 0;
            if (apply_effect) *byte_stat = current;
            result = 0;
        }
        break;
    case 19:
        current = character->luck;
        byte_stat = &character->luck;
        if (!apply_effect) result = random_bounded(3) + (-1);
        else {
            current += (s16)effect_value;
            if (above(current, 100)) current = 100;
            else if (current < 0) current = 0;
            if (apply_effect) *byte_stat = current;
            result = 0;
        }
        break;
    }
    return result;
}












