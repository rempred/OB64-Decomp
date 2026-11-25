#include "game/character_display_members.h"
#include "game/character_display_records.h"
#include "game/panel_constructor.h"
#include "game/class_sprite.h"
#include "game/character_record.h"
#include "game/scenario_source_record.h"

extern s32 D_801F3658, D_801F3618, D_801ED5B0;
extern s32 D_801F0B94, D_801F0B98;
extern void *D_80214E80;

extern u8 D_8021B484[5];
extern u8 D_8021B489, D_8021B56C, D_8021B56D, D_8021B56E, D_8021B56F;
extern u8 D_8021B570, D_8021B571, D_8021B572, D_8021B573;
extern s32 D_8021B520;
extern u8 D_8021B524;

extern u16 *D_8021B540[5];

extern u16 D_80190EBC[], D_8019532C[];
extern u8 D_80191010[], D_80195480[], D_8018F481;

extern void *func_00001330(u32 bytes);
extern void *func_0002E138(u32 key);
extern s32 func_80186210(s32 flag);
extern Panel *D_8017C29C(Panel *, s16 x1, s16 y1, s16 x2, s16 y2);

extern void func_0018B9CC(u16 *palette);
extern void func_0018BA40(u16 *palette);
extern void func_0018BA8C(const u16 *source, u16 *dest);

/* Initialize character panels or advance the active member's panel transition. */
void func_00188CDC(void)
{
    s32 palette_index;
    s32 slot;
    s32 scenario_layout_flag;

    if (D_8021B56E != 0) {
        D_8021B56E--;
    }
    palette_index = 4;
    if (D_8021B489 != 0) {
        Panel **panel_slot;
        s32 coordinate, left, right;

        u8 layout_bit = D_801F0CB0[D_8021B573]->flags;
        u32 active_index = D_8021B570;
        u32 requested_index = D_8021B56C;

        layout_bit &= 8;
        scenario_layout_flag = layout_bit == 0;
        if (active_index == requested_index) {
            return;
        }
        if (D_8021B56D == 0) {
            D_8021B56D = 1;
            D_8021B520 = 0;
            D_8021B524 = 0;
            return;
        }
        if (D_8021B56F == 0) {
            if (D_8021B524 == 0) {
                D_8021B520 = D_8021B520 + 0x1E;
            } else {
                D_8021B520 = D_8021B520 - 0x1E;
            }
            panel_slot = &D_8021B470.panels[D_8021B56C];
            if (scenario_layout_flag == 0 && D_8021B573 < 30) {
                coordinate = 0x24 - D_8021B520;
            } else {
                coordinate = 0x3D - D_8021B520;
            }
            left = (s16)coordinate;
            if (scenario_layout_flag == 0 && D_8021B573 < 30) {
                coordinate = 0x11C - D_8021B520;
            } else {
                coordinate = 0x103 - D_8021B520;
            }
            right = (s16)coordinate;
            D_8017C29C(*panel_slot, left, 0x18, right,
                       scenario_layout_flag == 0 && D_8021B573 < 30 ? 0x66 : 0x5F);
        } else {
            if (D_8021B524 == 0) {
                D_8021B520 = D_8021B520 + 0x1E;
            } else {
                D_8021B520 = D_8021B520 - 0x1E;
            }
            panel_slot = &D_8021B470.panels[D_8021B570];
            if (scenario_layout_flag == 0 && D_8021B573 < 30) {
                coordinate = D_8021B520 + 0x24;
            } else {
                coordinate = D_8021B520 + 0x3D;
            }
            left = (s16)coordinate;
            if (scenario_layout_flag == 0 && D_8021B573 < 30) {
                coordinate = D_8021B520 + 0x11C;
            } else {
                coordinate = D_8021B520 + 0x103;
            }
            right = (s16)coordinate;
            D_8017C29C(*panel_slot, left, 0x18, right,
                       scenario_layout_flag == 0 && D_8021B573 < 30 ? 0x66 : 0x5F);
        }

        if (D_8021B524 == 0) {
            if (D_8021B520 >= 0xF0) {
                s32 target_index = D_8021B56C;
                s32 position_or_scan_index;
                /* Bind the table here to retain the position-address schedule. */
                Panel **panel_table = D_8021B470.panels;
                Panel **current_slot, **target_slot;
                Panel *current, *target, *previous_current, *next, *previous;

                position_or_scan_index = g_func_001957D0_source_records[D_8021B573].field_07[target_index];
                current_slot = &panel_table[D_8021B570];
                current = *current_slot;
                target_slot = &panel_table[target_index];
                target = *target_slot;
                previous_current = current->link00;
                D_801ED5B0 = position_or_scan_index;
                next = current->link04;
                if (previous_current == target) {
                    Panel **search_table;
                    Panel **scan;
                    Panel *scan_predecessor;
                    Panel **following_slot;

                    slot = target_index;
                    search_table = panel_table;

                    do {
                        scan_predecessor = search_table[slot]->link00;
                        for (position_or_scan_index = 0, scan = search_table; position_or_scan_index < 5; position_or_scan_index++, scan++) {
                            if (scan_predecessor == *scan) {
                                break;
                            }
                        }
                        if (position_or_scan_index == 5) {
                            break;
                        }
                        slot = position_or_scan_index;
                    } while (1);
                    following_slot = (Panel **)(slot * sizeof(Panel *) + (u32)search_table);
                    previous = (*following_slot)->link00;
                    previous->link04 = search_table[D_8021B570];
                    search_table[D_8021B570]->link00 = previous;
                    search_table[D_8021B570]->link04 = *following_slot;
                    (*following_slot)->link00 = search_table[D_8021B570];
                    search_table[D_8021B56C]->link04 = next;
                    if (next != 0) {
                        next->link00 = search_table[D_8021B56C];
                    }
                } else {
                    previous = target->link00;
                    previous->link04 = target->link04;
                    {
                        Panel *reloaded_target = *target_slot;
                        previous = reloaded_target->link04;
                        previous->link00 = reloaded_target->link00;
                    }
                    (*current_slot)->link04 = *target_slot;
                    (*target_slot)->link00 = *current_slot;
                    (*target_slot)->link04 = next;
                    if (next != 0) {
                        next->link00 = *target_slot;
                    }
                }
                D_8021B524 = 1;
            }
        } else if (D_8021B520 == 0) {
            D_8021B524 = 0;
            D_8021B520 = 0;
            D_8021B56D = 0;
            D_8021B570 = D_8021B56C;
        }
    } else {
        u32 palette_entry_address;
        u16 **sprite_pixels;
        void **sprite_resource;
        u16 **sprite_pixel_table;
        void **sprite_resource_table;
        s32 squad_word;
        u32 squad_flags;
        u8 start_position;
        u32 member_count;
        void *display_resource;

        D_8021B571 = 0;
        /* The final advance on exit is address arithmetic, with no access. */
        palette_entry_address = (u32)&D_8021B558[4];
        do {
            *(u16 **)palette_entry_address = func_00001330(0x200);
            palette_index--;
            palette_entry_address -= sizeof(u16 *);
        } while (palette_index >= 0);
        squad_word = D_801F3658;
        squad_flags = D_801F0CB0[(u8)squad_word]->flags;
        D_8021B573 = squad_word;
        if ((squad_flags & 8) == 0) {
            scenario_layout_flag = 1;
            if (squad_flags & 0x01000000) {
                D_8021B572 = 1;
            } else {
                D_8021B572 = 0;
            }
            if (func_80186210(0x1C) != 0) {
                D_8021B572 = 1;
            }
        } else {
            scenario_layout_flag = 0;
            D_8021B572 = 1;
        }
        slot = 4;
        /* Invariant table bases let the compiler reduce both indexed cursors. */
        sprite_pixel_table = D_8021B540;
        sprite_resource_table = D_8021B528;

        do {
            u32 member;

            sprite_pixels = &sprite_pixel_table[slot];
            sprite_resource = &sprite_resource_table[slot];

            D_8021B484[slot] = g_func_001957D0_source_records[D_8021B573].field_02[slot];
            if (D_8021B484[slot] != 0) {
                Panel *member_panel;
                u8 class_id, variant;
                u32 member_index;
                u32 status;

                D_8021B571++;
                if (scenario_layout_flag == 0 && D_8021B573 < 30) {
                    member_panel = func_8017BFB0(0, 0, func_00189778, 0x24, 0x18,
                                                 0x28, 0x1C, 0x24, 0x18, 0x11C, 0x66);
                } else {
                    member_panel = func_8017BFB0(0, 0, func_00189778, 0x3D, 0x18,
                                                 0x41, 0x1C, 0x3D, 0x18, 0x103, 0x5F);
                }
                D_8021B470.panels[slot] = member_panel;
                member = D_8021B484[slot];
                /* Keep the original selector paths separate through loop allocation. */
                if (member >= 100) {
                    if (scenario_layout_flag == 0) {
                        variant = 0;
                        if (D_8021B573 < 30) {
                            class_id = D_80193BC0[0].record.primary_class_id;
                            *sprite_resource = func_8016FBE0(class_id, variant, sprite_pixels);
                            goto copy_sprite_palette;
                        } else {
                            class_id = D_80195560[0].primary_class_id;
                            *sprite_resource = func_8016FBE0(class_id, variant, sprite_pixels);
                            goto copy_sprite_palette;
                        }
                    } else {
                        class_id = D_80195560[0].primary_class_id;
                        variant = 1;
                        *sprite_resource = func_8016FBE0(class_id, variant, sprite_pixels);
                        goto copy_sprite_palette;
                    }
                } else if (scenario_layout_flag == 0) {
                    variant = 0;
                    if (D_8021B573 < 30) {
                        class_id = D_80193BC0[member].record.primary_class_id;
                        *sprite_resource = func_8016FBE0(class_id, variant, sprite_pixels);
                        goto copy_sprite_palette;
                    } else {
                        class_id = D_80195560[member].primary_class_id;
                    }
                    *sprite_resource = func_8016FBE0(class_id, variant, sprite_pixels);
                    goto copy_sprite_palette;
                } else {
                    u32 record_offset_words;

                    if (D_8018F481 == 0x26 && ((D_8021B573 == 30) & (slot == 0))) {
                        variant = 0;
                        if (D_8021B572 != 0) {
                            class_id = 0x54;
                            goto load_sprite;
                        }
                        record_offset_words = member * 13;
                    } else {
                        record_offset_words = D_8021B484[slot] * 13;
                    }
                    class_id = ((const CharacterRecord *)((const u8 *)D_80195560
                                + record_offset_words * 4))->primary_class_id;
                    variant = 1;
                }
load_sprite:
                *sprite_resource = func_8016FBE0(class_id, variant, sprite_pixels);
copy_sprite_palette:
                func_0018BA8C(*sprite_pixels, D_8021B558[slot]);
                if (scenario_layout_flag == 0 && D_8021B573 < 30) {
                    member_index = D_8021B484[slot];
                    if (member_index >= 100) {
                        if (D_80190EBC[member_index] == 0) {
                            func_0018BA40(D_8021B558[slot]);
                            goto next_slot;
                        }
                        status = D_80191010[member_index] & 4;
                    } else {
                        if (D_80193BC0[member_index].record.hp == 0) {
                            func_0018BA40(D_8021B558[slot]);
                            goto next_slot;
                        }
                        status = D_80193BC0[member_index].record.status_flags & 4;
                    }
                    if (status != 0) {
                        func_0018B9CC(D_8021B558[slot]);
                    }
                    goto next_slot;
                } else {
                    member_index = D_8021B484[slot];
                    if (member_index >= 100) {
                        if (D_8019532C[member_index] == 0) {
                            func_0018BA40(D_8021B558[slot]);
                            goto next_slot;
                        }
                        status = D_80195480[member_index] & 4;
                    } else {
                        if (D_80195560[member_index].hp == 0) {
                            func_0018BA40(D_8021B558[slot]);
                            goto next_slot;
                        }
                        status = D_80195560[member_index].status_flags & 4;
                    }
                }
                if (status != 0) {
                    func_0018B9CC(D_8021B558[slot]);
                }
            } else {
                D_8021B470.panels[slot] = 0;
            }
next_slot:
            slot--;
        } while (slot >= 0);

        display_resource = func_0002E138(0x01DC2D10);
        squad_word = D_8021B573;
        D_8021B489 = 1;
        D_80214E80 = display_resource;
        D_801F0B94 = 0x74;
        D_801F0B98 = 0x79;
        D_8021B56C = 0;
        D_8021B570 = 0;
        D_801F3618 = squad_word;
        start_position = g_func_001957D0_source_records[squad_word].field_07[0];
        member_count = D_8021B571;
        D_8021B56D = 0;
        D_8021B56E = 0xF;
        D_801ED5B0 = start_position;
        if (member_count >= 2) {
            D_8021B571 = 1;
        } else {
            D_8021B571 = 0;
        }
    }
}
