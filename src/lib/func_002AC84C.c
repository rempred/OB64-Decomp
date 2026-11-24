#include "game/battle_roster_types.h"

#include "game/class_comparison.h"

typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A974;
extern u8 *D_801CE8BC;
void func_002AC84C(s32 requested_body_slot, s32 class_word) {
    u8 slot = requested_body_slot;
    u8 class_byte = class_word;
    s32 actor_index;
    s32 body_slot;
    s32 primary_class_id;
    s32 roster_offset;
    u8 *scene_bytes;
    u8 *requested_body;
    u8 *matching_body;
    actor_index = 0;
    roster_offset = 0x1C4;
    do {
        primary_class_id = ((BattleRosterRecord *)(D_801CE8BC + roster_offset))->primary_class_id.word;
        if (primary_class_id != 0 && D_8016FF5C(primary_class_id, class_byte)) {
            break;
        }
        actor_index++;
        roster_offset += 0xF8;
    } while (actor_index < 20);
    if (actor_index < 20) {
        scene_bytes = D_8022A974;
        for (body_slot = 0; body_slot < 28; body_slot++) {
            if ((*(u8 * *)((u8 *)(scene_bytes + body_slot * 4) + (0x18))) != ((void *)0) && (*(u8 * *)((u8 *)(scene_bytes + body_slot * 4) + (0x18)))[0x147] == actor_index) {
                matching_body = (*(u8 * *)((u8 *)(scene_bytes + (u8)body_slot * 4) + (0x18)));
                requested_body = (*(u8 * *)((u8 *)(scene_bytes + slot * 4) + (0x18)));
                (*(u8 * *)((u8 *)(scene_bytes + (u8)body_slot * 4) + (0x18))) = requested_body;
                (*(u8 * *)((u8 *)(scene_bytes + slot * 4) + (0x18))) = matching_body;
                if (matching_body != ((void *)0)) {
                    (*(s32 *)((u8 *)(matching_body) + (0xE4))) = slot;
                }
                if (requested_body != ((void *)0)) {
                    (*(s32 *)((u8 *)(requested_body) + (0xE4))) = (u8)body_slot;
                }
                return;
            }
        }
    }
}
