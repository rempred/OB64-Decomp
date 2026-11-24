#include "game/battle_record_flag.h"
#include "game/battle_roster_record.h"
#include "game/class_comparison.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;

extern char *D_801CE8BC;  /* deployed-unit service table; units at +0x1C4, stride 0xF8 */
extern u8 *D_8022A974;    /* Director scene block; actor pointers at +0x18 */
extern s8 D_8022AC80;     /* Director scene mode */
extern s16 D_8022A994;    /* current scenario id */

extern u8 func_002AD574(void *actor);
extern void *func_0002CD70(void *destination, int value, unsigned int count);
extern s32 func_002A9364(s32 slot, s32 primary_class_id, s32 variant, s32 animation,
                        s32 arg5, s32 arg6, u8 keep145, u8 keepUnit);
extern void func_0029E70C(u8 *scene_body);
extern void func_002AB574(void);

/*
 * Director roster placement. Walks the 20 deployed units, decides per unit
 * whether it takes part (leader/member class filters -1 = any, -2 = any with
 * the extra check, 0 = none, otherwise a class match that is consumed),
 * asks func_002AB810 for the slot list, and places each slot. Names for the
 * unit fields and callee semantics are structural observations.
 */
s32 func_002ABB3C(s32 bit8_class_filter, s32 other_class_filter, s32 flagC)
{
    /* Keep retail reloads when reading the slots written by func_002AB810. */
    union {
        s32 write[4];
        volatile s32 read[4];
    } slots;
    s32 want[2];
    BattleRosterRecord *actor;
    u8 *scene_body;
    s32 actor_index;
    s32 j;
    s32 primary_class_id;
    s32 skip;
    s32 flip;
    s32 bit8_filter;
    s32 other_filter;
    u8 classByte;
    s32 mode;
    s32 isNine;
    s32 seen_leader;
    s32 isSix;
    s32 child_index;

    want[1] = other_class_filter;
    want[0] = bit8_class_filter;
    mode = D_8022AC80;
    isNine = mode == -9;
    seen_leader = 0;
    for (actor_index = 0; actor_index < 20; actor_index++) {
        actor = (BattleRosterRecord *)(D_801CE8BC + 0x1C4 + actor_index * 0xF8);
        if (actor->primary_class_id.word == 0) {
            continue;
        }
        bit8_filter = want[0];
        other_filter = want[1];
        primary_class_id = actor->primary_class_id.word;
        if (bit8_filter == -1 && battle_actor_is_side_one(actor)) {
            skip = 0;
        } else if (other_filter == -1 && !battle_actor_is_side_one(actor)) {
            skip = 0;
        } else if (bit8_filter == -2 && battle_actor_is_side_one(actor) && battle_actor_has_flag_9(actor)) {
            skip = 0;
        } else if (other_filter == -2 && !battle_actor_is_side_one(actor) && battle_actor_has_flag_9(actor)) {
            skip = 0;
        } else if (bit8_filter == 0 && battle_actor_is_side_one(actor)) {
            skip = 1;
        } else if (other_filter == 0 && !battle_actor_is_side_one(actor)) {
            skip = 1;
        } else {
            classByte = primary_class_id;
            if (func_00045e5c(bit8_filter, classByte)) {
                want[0] = 0;
                skip = 0;
            } else if (func_00045e5c(other_filter, classByte)) {
                want[1] = 0;
                skip = 0;
            } else {
                skip = 1;
            }
        }
        if (skip == 1) {
            continue;
        }
        if ((D_8022AC80 == -3 || D_8022AC80 == -10) && func_002AD574(actor) == 1) {
            continue;
        }
        /* Retail retains this 28-step loop. The dead assignment prevents KMC
         * from reversing it to a count-down; its original purpose is unknown. */
        for (j = 0; j < 28; j++) {
            flip = j;
        }
        flip = actor->formation_row < 4;
        func_0002CD70(slots.write, 0xFF, 0x10);
        func_002AB810(slots.write, actor, actor_index, flip, actor->primary_class_id.word, actor->secondary_class_id.word, seen_leader);
        if (actor->primary_class_id.word == 0x87) {
            seen_leader = 1;
        }
        /* Separate arms preserve the constant's KMC allocation priority.
         * Combining all six cases into one test swaps saved registers. */
        if (D_8022A994 == 0x3D9 || D_8022A994 == 0x21F || D_8022A994 == 0xC6 || D_8022A994 == 0xF5) {
            flip = 1 - flip;
        } else if (D_8022A994 == 0x1E4 || D_8022A994 == 0x1E5) {
            flip = 1 - flip;
        }
        if (slots.read[0] == -1) continue;
        /* Compute this in the outer body so KMC keeps the saved mode live. */
        isSix = mode == -6;
        child_index = 0;
        do {
            /* A separate initial value keeps KMC from hoisting the flag
             * comparison. Assigning in the condition retains the direct
             * failure edge to default placement. */
            s32 allow = 0;
            if (battle_actor_has_flag_1(actor) && (!battle_actor_is_side_one(actor) || !battle_actor_has_flag_9(actor))) {
                scene_body = *(u8 **)(D_8022A974 + slots.read[child_index] * 4 + 0x18);
                func_002A9364(slots.read[child_index], -1, -1, *(s16 *)(scene_body + 0x138) + 0x1C, -1, -1, 0, 1);
                func_0029E70C(scene_body);
            } else if ((isNine || isSix) && (allow = ((flip == 1) & (flagC == 0))) != 0) {
                scene_body = *(u8 **)(D_8022A974 + slots.read[child_index] * 4 + 0x18);
                func_002A9364(slots.read[child_index], -1, -1, *(s16 *)(scene_body + 0x138) + 0x1A, -1, -1, 0, 1);
                func_0029E70C(scene_body);
            } else {
                func_002A9364(slots.read[child_index], -1, -1, -1, -1, -1, 0, 1);
            }
            child_index++;
        } while (slots.read[child_index] != -1);
    }
    func_002AB574();
    return 0;
}
