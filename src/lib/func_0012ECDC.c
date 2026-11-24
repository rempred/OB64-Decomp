typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

extern u8 D_8018F481;
extern u8 D_801974E0[];
extern u8 D_801971F2[][25];
extern u8 D_801971F1[][25];
extern u16 D_8019532C[];
extern u16 D_80190EBC[];
extern u8 D_80195480[];
extern u8 D_80191010[];
extern u16 D_80195578[][26];
extern u16 D_80193BD8[][28];
extern u8 D_80195593[][52];
extern u8 D_80193BF3[][56];

/* Check for nonzero member HP and clear status bit 2 on zero-HP entries. */
s32 func_0012ECDC(s32 squad_source_index)
{
    s32 result;
    s32 uses_army_roster;
    /* Share the first-member temporary between the two special cases;
    keep their clear cursors separate from the later scan. */
    u32 first_member_index;
    u8 *cursor;
    u8 *start;
    u8 *end;

    /* Pointer limits below retain the retail signed 32-bit comparisons. */
    if ((u32)(D_8018F481 - 45) >= 2) {
        result = 0;
        if (squad_source_index == 30) {
            first_member_index = D_801974E0[0];
            if (D_80195578[first_member_index][0] == 0 || (D_80195593[first_member_index][0] & 4)) {
                u8 *clear_cursor;
                u8 *clear_end;
                u16 *special_member_hp = D_8019532C;
                u8 *base = D_801971F2[0];
                clear_cursor = base + 30 * 25;
                clear_end = base + 30 * 25 + 5;
                do {
                    s32 member_index = *clear_cursor;
                    if (member_index != 0) {
                        if (member_index >= 100) {
                            special_member_hp[member_index] = 0;
                        } else {
                            D_80195578[member_index][0] = 0;
                        }
                    }
                    clear_cursor++;
                } while ((s32)clear_cursor < (s32)clear_end);
                return 0;
            }
        }
    } else {
        if ((u32)(squad_source_index - 30) < 2) {
            s32 squad_byte_offset = squad_source_index * 25;
            first_member_index = *(u8 *)((u32)D_801971F2 + squad_byte_offset);
            if (D_80195578[first_member_index][0] == 0 || (D_80195593[first_member_index][0] & 4)) {
                u8 *clear_cursor;
                u8 *clear_end;
                u16 *special_member_hp = D_8019532C;
                clear_cursor = (u8 *)((u32)D_801971F2 + squad_byte_offset);
                clear_end = clear_cursor + 5;
                do {
                    s32 member_index = *clear_cursor;
                    if (member_index != 0) {
                        if (member_index >= 100) {
                            special_member_hp[member_index] = 0;
                        } else {
                            D_80195578[member_index][0] = 0;
                        }
                    }
                    clear_cursor++;
                } while ((s32)clear_cursor < (s32)clear_end);
                return 0;
            }
        }
        result = 0;
    }

    uses_army_roster = squad_source_index < 30;
    {
        u16 *army_special_member_hp = D_80190EBC;
        u16 *scenario_special_member_hp = D_8019532C;
        s32 squad_byte_offset = squad_source_index * 25;
        cursor = (u8 *)((u32)D_801971F2 + squad_byte_offset);
        start = cursor;
        end = cursor + 5;
        do {
            s32 member_index = *cursor;
            if (member_index != 0) {
                if (member_index >= 100) {
                    if (uses_army_roster) {
                        if (army_special_member_hp[member_index] != 0) {
                            result = 1;
                        } else {
                            D_80191010[member_index] &= ~4;
                        }
                    } else {
                        if (scenario_special_member_hp[member_index] != 0) {
                            result = 1;
                        } else {
                            D_80195480[member_index] &= ~4;
                        }
                    }
                } else if (uses_army_roster) {
                    if (D_80193BD8[member_index][0] != 0) {
                        result = 1;
                    } else {
                        D_80193BF3[member_index][0] &= ~4;
                    }
                } else {
                    if (D_80195578[member_index][0] != 0) {
                        result = 1;
                    } else {
                        D_80195593[member_index][0] &= ~4;
                        if (cursor == start && !(*(u8 *)((u32)D_801971F1 + squad_byte_offset) & 0x80)) {
                            return 0;
                        }
                    }
                }
            }
            cursor++;
        } while ((s32)cursor < (s32)end);
        return result;
    }
}
