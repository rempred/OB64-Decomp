#include "game/battle_predicates.h"
#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

extern u8 D_80190F80[];
extern u8 D_80193BC0[];
extern u8 D_801953F0[];
extern u8 D_80195560[];
extern u8 D_801976DC;
extern u8 D_801976E8;

void *func_0020C478(unsigned int actor_index);
s32 func_801D0880(void);

/* Write back HP, current alignment and status. Army roster rows also retain experience. */
void func_0021C3B0(void)
{
    s32 actor_index;
    u8 *actor;
    u8 *character_bytes;
    u8 *special_member_pool;
    s32 squad_source_index;
    u8 member_index;
    u8 *special_member_data;

    for (actor_index = 0; actor_index < 20; actor_index++) {
        actor = func_0020C478(actor_index);
        if (func_801D0880() != 0 &&
            func_0020BFF8(actor) != 0 &&
            func_0020C0E8(actor) != 0 &&
            func_0020C32C(actor) != 0) {
            *(u16 *)(actor + 0x20) = 0;
            *(s32 *)(actor + 0x40) &= ~2;
        }

        if (actor != 0 && func_0020C0CC(actor) == 0) {
            if (func_0020C014(actor) != 0) {
                squad_source_index = D_801976DC;
            } else {
                squad_source_index = D_801976E8;
            }

            if (squad_source_index < 30) {
                special_member_pool = D_80190F80;
                character_bytes = D_80193BC0 + actor[0xF6] * 0x38;
            } else {
                special_member_pool = D_801953F0;
                character_bytes = D_80195560 + actor[0xF6] * 0x34;
            }

            member_index = actor[0xF6];
            if (member_index == 0xFF) {
                continue;
            }

            if (member_index < 100) {
                *(u16 *)(character_bytes + 0x18) = *(u16 *)(actor + 0x20);
                character_bytes[0x1B] = actor[0x34];
                if (func_0020C32C(actor) != 0) {
                    character_bytes[0x33] |= 4;
                } else {
                    character_bytes[0x33] &= 0xFB;
                }
                if (squad_source_index < 30) {
                    character_bytes[0x35] = actor[0x32];
                }
            } else {
                special_member_data = special_member_pool;
                special_member_data += member_index * 2;
                *(u16 *)(special_member_data - 0xC4) = *(u16 *)(actor + 0x20);
                if (func_0020C2C0(actor) == 0 &&
                    func_0020C32C(actor) != 0) {
                    special_member_data = special_member_pool + actor[0xF6] + 0x90;
                    *special_member_data |= 4;
                } else {
                    special_member_data = special_member_pool + actor[0xF6] + 0x90;
                    *special_member_data &= 0xFB;
                }
            }
        }
    }
}
