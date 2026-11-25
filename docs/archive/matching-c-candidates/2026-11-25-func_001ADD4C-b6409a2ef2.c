#include "game/boot_command_stream.h"
#include "game/character_record.h"

typedef struct DisplayGroupRecord {
    u8 members[5];
    u8 field_05[20];
} DisplayGroupRecord;

extern DisplayGroupRecord D_801971F2[];
extern u16 D_8019532C[];
extern u8 D_80195480[];
extern u8 D_8021E383;
extern u8 D_8021E384;
extern u8 D_8021E385;
extern u8 D_8021E386;
extern u8 D_8021E3E0;
extern void *D_801EB290;
extern void *D_801EB294;
extern void *D_801EB298;
extern void *D_801EB29C;
extern void *D_801EB2A0;
extern void *D_801EB2A4;
extern void *D_801EB2A8;

u32 func_00022E60(void);

/* Prepare the group display and select a member slot when the selection is enabled. */
void func_001ADD4C(u8 group_index)
{
    s32 first_free;
    s32 occupied;
    s32 slot;
    s32 active_members;
    u8 candidate_count;
    u8 candidate_slots[5];
    const u8 *member_slot;
    const u16 *fallback_hp;
    const CharacterRecord *characters;
    u32 excluded_class;
    u8 *candidate_list;
    void **first_resource = &D_801EB290;

    if (*first_resource == 0) {
        *first_resource = func_0000978C(0x0218E9B4u, 0x14, -3, 0);
        D_801EB294 = func_0000978C(0x0218E9B4u, 0x14, -3, 1);
        D_801EB298 = func_0000978C(0x0218E9B4u, 0x14, -3, 2);
        D_801EB29C = func_0000978C(0x0218E9B4u, 0x14, -3, 3);
        D_801EB2A0 = func_0000978C(0x0218E9B4u, 0x14, -3, 4);
        D_801EB2A4 = func_0000978C(0x0218E9B4u, 0x14, -3, 5);
        D_801EB2A8 = func_0000978C(0x0218E9B4u, 0x14, -3, 6);
    }

    first_free = 0;
    occupied = 0;
    slot = 1;
    D_8021E3E0 = 0;
    D_8021E384 = group_index;
    do {
        if (D_80193BC0[slot].record.primary_class_id != 0) {
            occupied++;
        } else if (first_free == 0) {
            first_free = slot;
        }
        slot++;
    } while (slot < 100);

    if (occupied < 94) {
        D_8021E383 = 1;
    } else {
        D_8021E383 = 0;
    }
    D_8021E386 = first_free;

    slot = 0;
    active_members = 0;
    candidate_count = 0;
    fallback_hp = D_8019532C;
    characters = D_80195560;
    excluded_class = 0x37;
    candidate_list = candidate_slots;
    member_slot = D_801971F2[group_index].members;
    for (; slot < 5; slot++, member_slot++) {
        u32 member_index = *member_slot;
        if (member_index != 0) {
            if (member_index >= 100) {
                if (fallback_hp[member_index] != 0) {
                    u32 blocked = D_80195480[member_index] & 4;
                    active_members += blocked == 0;
                }
            } else {
                const CharacterRecord *member = &characters[member_index];
                if (member->hp != 0 && (member->status_flags & 4) == 0) {
                    u32 class_id = member->primary_class_id;
                    if ((class_id >= 81) | (slot == 0)) {
                        active_members++;
                        continue;
                    }
                    if (class_id != excluded_class) {
                        candidate_list[candidate_count] = slot;
                        candidate_count++;
                    }
                    active_members++;
                }
            }
        }
    }

    if (candidate_count == 0 || ((candidate_count == 1) & (active_members == 1))) {
        D_8021E383 = 0;
    }
    if (D_8021E383 != 0) {
        if ((s32)func_00022E60() % 100 < 75) {
            D_8021E383 = 1;
        } else {
            D_8021E383 = 0;
        }
        if (D_8021E383 != 0) {
            D_8021E385 = candidate_slots[(s32)func_00022E60() % candidate_count];
        }
    }
}
