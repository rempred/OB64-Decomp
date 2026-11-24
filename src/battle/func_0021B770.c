#include "game/battle_predicates.h"
typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

s32 func_0020C014(void *);
s32 func_0020C104(void *);
s32 func_0020C2C0(void *);
s32 func_0020C32C(void *);
void *func_0020C478(unsigned int index);

extern u8 D_80193BC0[];
extern u8 D_80195560[];

/* Reset fatigue on the persistent characters represented by eligible battle actors. */
void func_0021B770(void)
{
    s32 actor_index;
    s32 squad_source_index;
    s32 uses_army_roster;
    BattleRosterRecord *actor;
    u8 *character_bytes;

    actor_index = 0;
    do {
        actor = func_0020C478(actor_index);
        if ((actor != 0) &&
            (func_0020C104(actor) == 0) &&
            (func_0020C0CC(actor) == 0) &&
            ((func_0020C2C0(actor) != 0) ||
             (func_0020C32C(actor) != 0) ||
            (actor->hp == 0))) {
            if (func_0020C014(actor) != 0) {
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
