#include "game/battle_roster_types.h"

typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;

extern u8 D_801976E8;

extern void *battle_roster_lookup_actor(unsigned int index);
extern s32 battle_actor_is_side_one(void *actor);
extern void func_00207C08(s32 handle);
extern void func_001F0F90(void *primary_child);
extern void func_001F1050(void *primary_child);
extern void func_00023780(void *pointer, u32 size);
extern void func_002ACA3C(s32 unitSelector);

#define WORD(p, o) (*(s32 *)((u8 *)(p) + (o)))

/*
 * Director opcode 0x96 roster reset.
 *
 * Walks the twenty Actor-input rows. For each row that battle_actor_is_side_one selects,
 * releases the handle at +0x50, clears and releases the three linked object
 * pairs at +0x0/+0xC, +0x4/+0x10, and +0x8/+0x14, and zeroes the 0xF8-byte row.
 * Then appends deployed unit selector 30 and records it as the current second
 * roster unit (event property FD). Field meanings are structural observations,
 * not verified semantics.
 */
void func_002ACF08(s32 commandWord)
{
    s32 actor_index;
    u32 child_index;
    BattleRosterRecord *actor;
    void *primary_child;

    actor_index = 0;
    do {
        actor = battle_roster_lookup_actor(actor_index);
        if (battle_actor_is_side_one(actor) != 0) {
            func_00207C08(actor->body_resource_key);
            /* Indexing from one base keeps the partner access as an offset of
             * the same strength-reduced pointer; a second cursor would need
             * another callee-saved register. */
            child_index = 0;
            do {
                primary_child = actor->primary_children[child_index];
                if (primary_child != 0) {
                    WORD(primary_child, 0x18) = 0;
                    WORD(actor->secondary_children[child_index], 0x18) = 0;
                    func_001F0F90(actor->primary_children[child_index]);
                    func_001F1050(actor->secondary_children[child_index]);
                    actor->primary_children[child_index] = 0;
                    actor->secondary_children[child_index] = 0;
                }
                child_index += 1;
            } while (child_index < 3);
            func_00023780(actor, 0xF8);
        }
        actor_index += 1;
    } while (actor_index < 20);
    func_002ACA3C(30);
    D_801976E8 = 30;
}
