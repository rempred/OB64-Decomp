#include "game/battle_predicates.h"
typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

s32 battle_actor_is_side_zero(void *);
s32 battle_actor_secondary_class_is_one(void *);
s32 battle_actor_is_absent_or_has_flag_0(void *);
s32 battle_actor_has_flag_1(void *);
void *battle_roster_lookup_actor(unsigned int index);

extern u8 D_80193BC0[];
extern u8 D_80195560[];

/* Reset fatigue on the persistent characters represented by eligible battle actors. */
void battle_roster_reset_member_fatigue(void)
{
    s32 actor_index;
    s32 squad_source_index;
    s32 uses_army_roster;
    BattleRosterRecord *actor;
    u8 *character_bytes;

    actor_index = 0;
    do {
        actor = battle_roster_lookup_actor(actor_index);
        if ((actor != 0) &&
            (battle_actor_secondary_class_is_one(actor) == 0) &&
            (battle_actor_has_flag_12(actor) == 0) &&
            ((battle_actor_is_absent_or_has_flag_0(actor) != 0) ||
             (battle_actor_has_flag_1(actor) != 0) ||
            (actor->hp == 0))) {
            if (battle_actor_is_side_zero(actor) != 0) {
                squad_source_index = *(u8 *)0x801976DC;
                uses_army_roster = squad_source_index < 0x1E;
            } else {
                squad_source_index = *(u8 *)0x801976E8;
                uses_army_roster = squad_source_index < 0x1E;
            }

            if (uses_army_roster != 0) {
                character_bytes = (actor->member_index * 0x38) + D_80193BC0;
            } else {
                character_bytes = (actor->member_index * 0x34) + D_80195560;
            }
            character_bytes[0x32] = 0;
        }
        actor_index++;
    } while (actor_index < 0x14);
}
