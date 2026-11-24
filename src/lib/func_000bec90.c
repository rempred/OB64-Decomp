typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

typedef s32 (*ClassCheck)(u8, u8);

extern u8 D_80193BC0[];
extern ClassCheck D_801EF288[];

/* Check a character's stored and class-default equipment slots for a requested item. */
s32 func_000bec90(s32 character_index_word, s32 target_equipment_word)
{
    register s32 slot asm("$18");
    register ClassCheck *check asm("$19");
    register s32 character_index asm("$2");
    s32 target_equipment;
    s32 switch_value;
    s32 result_value;
    u8 result;
    u16 equipment_id;
    void *slot_character;
    void *character;

    result = 0;
    target_equipment_word &= 0xFFFF;
    if (target_equipment_word != 0) {
        slot = 0;
        character_index = character_index_word & 0xFF;
        character = (character_index * 0x38) + D_80193BC0;
        slot_character = character;
        target_equipment = target_equipment_word;
        check = D_801EF288;
loop:
        switch_value = (slot + 1) & 0xFF;
        switch (switch_value) {
        case 1:
            equipment_id = *(u16 *)((s8 *)slot_character + 0x2A);
            break;
        case 2:
            equipment_id = *(u16 *)((s8 *)slot_character + 0x2C);
            break;
        case 3:
            equipment_id = *(u16 *)((s8 *)slot_character + 0x2E);
            break;
        default:
            equipment_id = *(u16 *)((s8 *)slot_character + 0x30);
            break;
        }
        if (target_equipment != equipment_id) {
            goto primary_done;
        }
        result += 1;
primary_done:
        result_value = result & 0xFF;
        if (result_value == 0) {
            if (target_equipment != ((*check)(*(u8 *)((s8 *)character + 0x11),
                                      *(u8 *)((s8 *)character + 0x12)) & 0xFFFF)) {
                goto secondary_done;
            }
            result += 1;
secondary_done:
            result_value = result & 0xFF;
            slot += 1;
            if (result_value == 0) {
                check += 1;
                if (slot >= 4) {
                    goto done;
                }
                goto loop;
            }
        }
    } else {
done:
        result_value = result & 0xFF;
    }
    return result_value;
    asm("# Hybrid scope: the three register-asm declarations above emit no instructions.\n"
        "# They keep the four-pass slot counter in $s2, the advancing predicate-table pointer in $s3,\n"
        "# and the short-lived class index in $v0 so KMC reproduces the retail register allocation.\n"
        "# All loads, comparisons, indirect calls, branches, loop control, and the return remain compiled C.\n");
}
