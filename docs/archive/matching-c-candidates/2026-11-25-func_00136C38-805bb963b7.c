#include "common/types.h"
#include "game/scenario_source_record.h"
#include "game/character_record.h"

typedef struct CombatDrawCommand {
    u32 first;
    u32 second;
} CombatDrawCommand;

extern CombatDrawCommand *volatile D_800E9BA0;

typedef struct SquadScreenState {
    u32 texture_base;
    u32 icon_texture_base;
    u32 alternate_texture_base;
    Func001957D0SourceRecord *first_squad;
    Func001957D0SourceRecord *second_squad;
    u8 first_formation_flags[15];
    u8 second_formation_flags[15];
    u8 first_vertical_offsets[24];
    u8 second_vertical_offsets[24];
    u8 field_62[0x30];
    u8 first_offset_direction;
    u8 second_offset_direction;
    u32 texture_address;
    u32 value_texture_address;
} SquadScreenState;

typedef struct FormationOrigin {
    s32 x;
    s32 y;
} FormationOrigin;

typedef struct ClassDisplayEntry {
    u8 flags;
    u8 field_01[5];
} ClassDisplayEntry;

extern ClassDisplayEntry D_8018ECE4[];

typedef struct FormationPositionOrder {
    u8 positions[9];
} FormationPositionOrder;

extern const CombatDrawCommand D_801ED650[];
extern s32 D_801F0B94, D_801F0B98, D_801F0B78, D_801F0B7C;
extern s32 D_801F0B9C, D_801F0D7C;
extern u8 D_801F3678[], D_801F3684[];
extern u8 D_801F39B0[], D_801ED5D0[], D_801F3A10[];
extern u8 D_80212518[], D_80212410[];
static const FormationPositionOrder position_order_template = {{0, 1, 3, 2, 4, 6, 5, 7, 8}};
extern u8 D_801F0B84[];
extern u8 D_801F3998[];
extern SquadScreenState *D_801ED5C0;
extern s32 D_801ED5B0;
extern s32 D_801ED5B4;
extern s32 D_801ED5B8;
extern s32 D_801ED5BC;
extern s32 D_801ED5C4;
extern s32 D_801ED5C8;
extern s32 D_801F0DE0;
extern u8 D_801F3A48;
extern s32 D_8021B508;
extern u8 D_8021B4F0[], D_8021B330[];
extern u8 D_80191010[], D_80195480[];
extern u16 D_80190EBC[], D_8019532C[], D_801953F2;
extern u32 *D_801F0CB0[];
extern void *D_801F0BCC;
extern void func_80093380(void *dest, s32 length);
extern u8 func_00040FF4(u8 alternate, u8 target);
extern u8 D_8016DE1C(s32 primary_class_id, s32 secondary_class_id);
extern s32 func_00043e18(s32 primary_class_id, s32 secondary_class_id);
extern s32 func_80186210(s32 flag);
extern void func_801E0F60(s32 x0, s32 y0, s32 x1, s32 y1, s32 texture_s, s32 texture_t);
extern void func_00136738(s32 x, s32 y, s32 value, s32 limit);
extern void func_00136970(s32 x, s32 y, s32 value, s32 format);

/* Draw the selected squads, their formation cells, and member values. */
void func_00136C38(s32 first_squad_index, s32 second_squad_index)
{
    FormationPositionOrder position_order;
    SquadScreenState *screen;
    Func001957D0SourceRecord *squad;
    u32 squad_variant;
    const FormationOrigin *formation_origin;
    s32 *comparison_slot;
    s32 *squad_index;
    const u8 *side_palette;
    u8 *vertical_offsets;
    u8 *formation_flags;
    u8 *offset_direction;
    s32 formation_pool_offset;
    s32 *side_selection_slot;
    u32 background_texture_address;
    u32 value_palette_address;
    u32 value_texture_address;
    s32 value_column;
    s32 leading_row;
    s32 leader_marker_row;
    Func001957D0SourceRecord *second_squad;
    s32 first_selection_column;
    s32 first_selection_column_group;
    s32 second_selection_column;
    s32 second_selection_column_group;
    s32 base_layer_index;
    s32 base_row;
    s32 base_selected_slot;
    s32 formation_row;
    s32 formation_selected_slot;
    s32 position_column;
    s32 position_column_group;
    s32 leading_column;
    s32 value_row;
    s32 leader_marker_layer_offset;
    s32 first_selection_row;
    s32 second_selection_row;
    s32 base_column;
    s32 base_selector_mode;
    s32 formation_column;
    s32 formation_selector_mode;
    s32 position_within_layer;
    s32 position_row;
    s32 leading_layer_offset;
    s32 value_layer_offset;
    s32 leader_marker_x;
    s32 leading_marker_x;
    s32 second_selection_x;
    s32 second_selection_slot;
    s32 base_layer_offset;
    s32 base_marker_x;
    s32 formation_layer_offset;
    s32 formation_marker_x;
    s32 layer_offset;
    s32 leader_marker_y;
    s32 first_selection_layer_offset;
    s32 first_selection_layer;
    s32 second_selection_layer_offset;
    s32 second_selection_layer;
    s32 position_layer;
    s32 secondary_class_argument;
    u8 unit_size;
    s32 member_value;
    s32 formation_y;
    s32 grid_origin_y;
    u32 sprite_command_opcode;
    s32 value_y;
    s32 value_x;
    s32 value_origin_x;
    s32 palette_flags;
    s32 display_pool_variant;
    s32 formation_x;
    s32 grid_origin_x;
    s32 leading_palette_width;
    s32 base_palette_width;
    s32 palette_bank;
    s32 raw_formation_slot;
    s32 first_selection_y;
    s32 second_selection_y;
    u8 special_sprite_count;
    s32 class_display_index;
    s32 base_comparison_slot;
    s32 display_squad_index;
    s32 display_squad_flags;
    s32 leader_marker_column;
    s32 special_palette_index;
    u32 special_palette_image_word;
    s32 member_left;
    s32 unit_selected_palette;
    s32 display_pool_flag;
    s32 ordered_member_count;
    s32 special_palette_address;
    s32 member_top;
    s32 member_bottom;
    s32 member_right;
    s32 leading_marker_y;
    s32 base_marker_y;
    s32 formation_marker_y;
    s32 value_column_quotient;
    s32 slot_index;
    s32 vertical_offset_index;
    s32 sprite_y;
    s32 draw_member_value;
    s32 marker_palette_address;
    const u8 *occupancy_entry;
    s32 unit_palette_address;
    s32 unit_texture_address;
    s32 unit_icon_palette;
    s32 sprite_class;
    u8 special_sprite_index;
    s32 alternate_texture_flag;
    s32 icon_palette_address;
    s32 has_display_value;
    s32 palette_status;
    s32 base_palette_state;
    s32 formation_palette_state;
    u8 *ordered_member_output;
    s8 ordered_member_number;
    u16 current_hp;
    u16 display_value;
    u16 display_limit;
    const u16 *small_pool_values;
    u8 *leading_offset;

    u8 *base_offset;
    const u8 *position_cursor;
    const u8 *position_order_start;
    u8 member_position;
    u8 value_member_id;
    u8 member_id;
    s32 position;
    u8 ordered_member;
    u8 value_member_slot;
    s32 sorted_member_slot;
    s32 primary_class_argument;
    s32 use_variant_class;
    u8 secondary_class_id;
    u8 primary_class_id;
    volatile CombatDrawCommand *special_sprite_palette;
    volatile CombatDrawCommand *unit_palette_commands;
    CombatDrawCommand *selection_marker_commands;
    CombatDrawCommand *special_sprite_texture;
    volatile CombatDrawCommand *unit_texture_commands;
    SquadScreenState *live_screen;
    SquadScreenState *initial_screen;
    u32 special_sprite_texture_address;
    SquadScreenState *value_screen;
    volatile CombatDrawCommand *unit_icon_commands;
    volatile CombatDrawCommand *value_overlay_commands;
    CombatDrawCommand *position_marker_commands;
    volatile CombatDrawCommand *formation_background;
    volatile CombatDrawCommand *special_sprite_state;
    CombatDrawCommand *unit_sprite_pipe_sync;
    volatile CombatDrawCommand *position_marker_restore;
    volatile CombatDrawCommand *leading_marker_palette;
    volatile CombatDrawCommand *second_marker_color;
    volatile CombatDrawCommand *final_color;
    volatile CombatDrawCommand *base_marker_palette;
    volatile CombatDrawCommand *side_setup;
    CombatDrawCommand *formation_marker_palette;
    volatile CombatDrawCommand *texture_disable;

    (void)first_squad_index;
    (void)second_squad_index;
    initial_screen = D_801ED5C0;
    if (initial_screen == 0) {
        D_801ED5C8 = -1;
        D_801ED5C4 = -1;
        return;
    }
    if (D_801ED5C4 != -1) {
        screen = initial_screen;
        squad = initial_screen->first_squad;
        side_selection_slot = &D_801ED5B0;
        formation_origin = (const FormationOrigin *)&D_801F0B94;
        formation_flags = initial_screen->first_formation_flags;
        vertical_offsets = initial_screen->first_vertical_offsets;
        comparison_slot = &D_801F0B9C;
        squad_index = &D_801ED5C4;
        offset_direction = &initial_screen->first_offset_direction;
        side_palette = D_801F3678;
draw_side:
        side_setup = D_800E9BA0;
        side_setup->first = 0xDE000000;
        side_setup->second = (u32)D_801ED650;
        D_800E9BA0 = (CombatDrawCommand *)(side_setup + 1);
        formation_pool_offset = squad == screen->second_squad ? 9 : 0;
        if (squad != 0) {
            squad_variant = squad->field_01 >> 7;
        } else {
            squad_variant = 0;
        }
        {
        u32 background_rgba_command;
        u32 background_rgba_scales;
        u32 background_load_block_args;
        u32 background_render_tile_word;
        u32 background_tile_size;
        do {
            background_rgba_command = 0xD7000002;
            background_rgba_scales = 0x80008000;
            background_load_block_args = 0x073FF400;
            background_render_tile_word = 0xF5400400;
            formation_background = D_800E9BA0;
            background_tile_size = 0x7C1FC;
            formation_background->first = background_rgba_command;
            formation_background->second = background_rgba_scales;
        } while (0);
        live_screen = D_801ED5C0;
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 1);
        grid_origin_x = ((volatile FormationOrigin *) formation_origin)->x;
        grid_origin_y = ((volatile FormationOrigin *) formation_origin)->y;
        formation_background[1].first = 0xE7000000;
        formation_background[1].second = 0;
        leading_palette_width = (squad_variant * 0x10) + 0x10;
        formation_background[2].first = 0xFD500000;
        background_rgba_scales = live_screen->texture_address;
        leading_offset = vertical_offsets;
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 2);
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 3);
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 4);
        formation_background[3].first = 0xF5500000;
        formation_background[3].second = 0x07000000;
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 5);
        formation_background[4].first = 0xE6000000;
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 6);
        formation_background[5].first = 0xF3000000;
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 7);
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 8);
        D_800E9BA0 = (CombatDrawCommand *)(formation_background + 9);
        grid_origin_x += 0x24;
        grid_origin_y += 0xA;
        formation_background[4].second = 0;
        formation_background[5].second = background_load_block_args;
        formation_background[6].first = 0xE7000000;
        formation_background[6].second = 0;
        formation_background[7].first = background_render_tile_word;
        formation_background[7].second = 0;
        formation_background[8].first = 0xF2000000;
        formation_background[8].second = background_tile_size;
        formation_background[2].second = background_rgba_scales;
        }
        for (slot_index = 0; slot_index < 3; ++slot_index, ++leading_offset) {
            s32 column_y;
            s32 column_group;
            leading_layer_offset = (slot_index / 9) * 0xA;
            column_group = slot_index / 3;
            leading_column = 3 * column_group;
            leading_column = slot_index - leading_column;
            leading_row = (slot_index % 9) / 3;
            column_y = leading_column * 6;
            column_y -= 0xC;
            leading_marker_y = (grid_origin_y + column_y) + (leading_row * 0xF) + leading_layer_offset;
            leading_marker_x = (grid_origin_x - (leading_column * 0x13)) + (leading_row * 0xA) + leading_layer_offset;
            leading_marker_y += 0xA;
            if (*offset_direction == 0) {
                leading_marker_y -= *leading_offset;
            } else {
                leading_marker_y += *leading_offset;
            }
            leading_marker_palette = D_800E9BA0;
            D_800E9BA0 = (CombatDrawCommand *)(leading_marker_palette + 1);
            leading_marker_palette->first = 0xFD100000;
            D_800E9BA0 = (CombatDrawCommand *)(leading_marker_palette + 2);
            leading_marker_palette[1].first = 0xE8000000;
            D_800E9BA0 = (CombatDrawCommand *)(leading_marker_palette + 3);
            leading_marker_palette[2].second = 0x07000000;
            D_800E9BA0 = (CombatDrawCommand *)(leading_marker_palette + 4);
            leading_marker_palette[3].first = 0xE6000000;
            D_800E9BA0 = (CombatDrawCommand *)(leading_marker_palette + 5);
            leading_marker_palette[4].first = 0xF0000000;
            D_800E9BA0 = (CombatDrawCommand *)(leading_marker_palette + 6);
            leading_marker_palette[5].first = 0xE7000000;
            leading_marker_palette[1].second = 0;
            leading_marker_palette[2].first = 0xF5000100;
            leading_marker_palette[3].second = 0;
            leading_marker_palette[4].second = 0x0703C000;
            leading_marker_palette[5].second = 0;
            leading_marker_palette->second = (s32) (((slot_index & 1) * leading_palette_width * 2) + (u32)D_801F39B0);
            func_801E0F60(leading_marker_x + 1, leading_marker_y + 1, leading_marker_x + 0x20, leading_marker_y + 0x16, 0, 0);
        }
        vertical_offset_index = slot_index;
        slot_index = 0;
        base_offset = vertical_offsets + 3;
        for (; slot_index < 6; ++slot_index, ++base_offset, ++vertical_offset_index) {
            s32 column_group;
            s32 layer_group;
            s32 column_y;
            layer_group = slot_index / 9;
            column_group = slot_index / 3;
            base_layer_index = 9 * layer_group;
            base_layer_index = slot_index - base_layer_index;
            base_layer_offset = layer_group * 0xA;
            base_column = 3 * column_group;
            base_column = slot_index - base_column;
            base_row = base_layer_index / 3;
            base_palette_width = (squad_variant * 0x10) + 0x10;
            column_y = (base_column * 6) - 0xC;
            base_marker_y = (grid_origin_y + column_y) + (base_row * 0xF) + base_layer_offset;
            base_marker_x = (grid_origin_x - (base_column * 0x13)) + (base_row * 0xA) + base_layer_offset;
            base_marker_y += 5;
            if (*offset_direction == 0) {
                base_marker_y -= *base_offset;
            } else {
                base_marker_y += *base_offset;
            }
            base_selector_mode = D_801F0DE0;
            base_palette_state = 1;
            if (base_selector_mode == 0x28) {
                if (D_801ED5B0 != -1 || D_801ED5B4 != -1) {
                    if (D_8021B508 != -1) {
                        s32 base_comparison_slot = *comparison_slot;
                        if (base_comparison_slot != -1) {
                            if (slot_index == base_comparison_slot) {
                                base_palette_state = 2;
                                goto select_base_palette;
                            }
                            occupancy_entry = &D_8021B4F0[formation_pool_offset + slot_index];
                            base_palette_state = 2;
                            if (*occupancy_entry != 0) {
                                goto select_base_palette;
                            }
                            base_palette_state = slot_index == *side_selection_slot;
                        } else {
                            occupancy_entry = &D_8021B4F0[formation_pool_offset + slot_index];
                            base_palette_state = 2;
                            if (*occupancy_entry != 0) {
                                goto select_base_palette;
                            }
                            base_palette_state = slot_index == *side_selection_slot;
                        }
                    } else {
                        base_palette_state = slot_index == *side_selection_slot;
                    }
                }
            } else {
                base_selected_slot = *side_selection_slot;
                base_palette_state = 1;
                if (base_selected_slot != -1) {
                    base_palette_state = *comparison_slot;
                    if (base_palette_state == -1) {
                        base_palette_state = slot_index == base_selected_slot;
                    } else if (base_selector_mode == 0x18) {
                        if (slot_index == base_palette_state) {
                            base_palette_state = 2;
                        } else {
                            base_palette_state = 2;
                            if (D_8021B330[slot_index] != 0) {
                                goto select_base_palette;
                            }
                            base_palette_state = slot_index == base_selected_slot;
                        }
                    } else if (slot_index == base_palette_state) {
                        base_palette_state = 2;
                    } else {
                        base_palette_state = slot_index == base_selected_slot;
                    }
                }
            }
select_base_palette:
            switch (base_palette_state) {
            case 0:
                palette_bank = slot_index & 1;
                marker_palette_address = (palette_bank * base_palette_width * 2) + (u32)D_801F39B0;
                break;
            case 1:
                palette_bank = slot_index & 1;
                marker_palette_address = (palette_bank * base_palette_width * 2) + (u32)D_801ED5D0;
                break;
            case 2:
                marker_palette_address = (u32)D_801F3A10;
                break;
            default:
                marker_palette_address = 0;
                break;
            }
            base_marker_palette = D_800E9BA0;
            D_800E9BA0 = (CombatDrawCommand *)(base_marker_palette + 1);
            base_marker_palette->first = 0xFD100000;
            D_800E9BA0 = (CombatDrawCommand *)(base_marker_palette + 2);
            base_marker_palette[1].first = 0xE8000000;
            D_800E9BA0 = (CombatDrawCommand *)(base_marker_palette + 3);
            base_marker_palette[2].second = 0x07000000;
            D_800E9BA0 = (CombatDrawCommand *)(base_marker_palette + 4);
            base_marker_palette[3].first = 0xE6000000;
            D_800E9BA0 = (CombatDrawCommand *)(base_marker_palette + 5);
            base_marker_palette[4].first = 0xF0000000;
            D_800E9BA0 = (CombatDrawCommand *)(base_marker_palette + 6);
            base_marker_palette->second = marker_palette_address;
            base_marker_palette[1].second = 0;
            base_marker_palette[2].first = 0xF5000100;
            base_marker_palette[3].second = 0;
            base_marker_palette[4].second = 0x0703C000;
            base_marker_palette[5].first = 0xE7000000;
            base_marker_palette[5].second = 0;
            func_801E0F60(base_marker_x + 1, base_marker_y + 1, base_marker_x + 0x20, base_marker_y + 0x16, 0, 0);
        }
        slot_index = 0;
        leading_palette_width = (squad_variant * 0x10) + 0x10;
        for (; slot_index < 15; ++slot_index, ++vertical_offset_index) {
            s32 column_group;
            s32 layer_group;
            s32 position_within_grid;
            s32 column_y;
            layer_group = slot_index / 9;
            column_group = slot_index / 3;
            position_within_grid = 9 * layer_group;
            position_within_grid = slot_index - position_within_grid;
            formation_layer_offset = layer_group * 0xA;
            formation_column = 3 * column_group;
            formation_column = slot_index - formation_column;
            formation_row = position_within_grid / 3;
            column_y = (formation_column * 6) - 0xC;
            formation_marker_y = (grid_origin_y + column_y) + (formation_row * 0xF) + formation_layer_offset;
            formation_marker_x = (grid_origin_x - (formation_column * 0x13)) + (formation_row * 0xA) + formation_layer_offset;
            if (*offset_direction == 0) {
                formation_marker_y -= vertical_offsets[vertical_offset_index];
            } else {
                formation_marker_y += vertical_offsets[vertical_offset_index];
            }
            raw_formation_slot = slot_index;
            if (slot_index >= 9) {
                slot_index -= 6;
            }
            formation_selector_mode = D_801F0DE0;
            if (formation_selector_mode == 0x28) {
                if (D_801ED5B0 != -1 || D_801ED5B4 != -1) {
                    if (D_8021B508 != -1) {
                        s32 formation_comparison_slot = *comparison_slot;
                        if (formation_comparison_slot != -1) {
                            formation_palette_state = 2;
                            if (slot_index != formation_comparison_slot) {
                                if (D_8021B4F0[slot_index + formation_pool_offset] != 0) {
                                    goto select_formation_palette;
                                }
                                formation_palette_state = slot_index == *side_selection_slot;
                            }
                        } else {
                            formation_palette_state = D_8021B4F0[slot_index + formation_pool_offset] != 0 ? 2 : (slot_index == *side_selection_slot);
                        }
                    } else {
                        formation_palette_state = slot_index == *side_selection_slot;
                    }
                } else {
                    formation_palette_state = 1;
                }
            } else {
                formation_selected_slot = *side_selection_slot;
                formation_palette_state = 1;
                if (formation_selected_slot != -1) {
                    formation_palette_state = *comparison_slot;
                    if (formation_palette_state == -1) {
                        formation_palette_state = slot_index == formation_selected_slot;
                    } else if (formation_selector_mode == 0x18) {
                        if (slot_index == formation_palette_state) {
                            formation_palette_state = 2;
                        } else {
                            formation_palette_state = 2;
                            if (D_8021B330[slot_index] != 0) {
                                goto select_formation_palette;
                            }
                            formation_palette_state = slot_index == formation_selected_slot;
                        }
                    } else if (slot_index == formation_palette_state) {
                        formation_palette_state = 2;
                    } else {
                        formation_palette_state = slot_index == formation_selected_slot;
                    }
                }
            }
select_formation_palette:
            switch (formation_palette_state) {
            case 0:
                palette_bank = slot_index & 1;
                marker_palette_address = (palette_bank * leading_palette_width * 2) + (u32)D_801F39B0;
                break;
            case 1:
                palette_bank = slot_index & 1;
                marker_palette_address = (palette_bank * leading_palette_width * 2) + (u32)D_801ED5D0;
                break;
            case 2:
                marker_palette_address = (u32)D_801F3A10;
                break;
            default:
                marker_palette_address = 0;
                break;
            }
            slot_index = raw_formation_slot;
            formation_marker_palette = D_800E9BA0;
            D_800E9BA0 = (CombatDrawCommand *)(formation_marker_palette + 1);
            formation_marker_palette->first = 0xFD100000;
            D_800E9BA0 = (CombatDrawCommand *)(formation_marker_palette + 2);
            formation_marker_palette[1].first = 0xE8000000;
            D_800E9BA0 = (CombatDrawCommand *)(formation_marker_palette + 3);
            formation_marker_palette[2].second = 0x07000000;
            D_800E9BA0 = (CombatDrawCommand *)(formation_marker_palette + 4);
            formation_marker_palette[3].first = 0xE6000000;
            D_800E9BA0 = (CombatDrawCommand *)(formation_marker_palette + 5);
            formation_marker_palette[4].first = 0xF0000000;
            D_800E9BA0 = (CombatDrawCommand *)(formation_marker_palette + 6);
            formation_marker_palette[5].first = 0xE7000000;
            formation_marker_palette->second = marker_palette_address;
            formation_marker_palette[1].second = 0;
            formation_marker_palette[2].first = 0xF5000100;
            formation_marker_palette[3].second = 0;
            formation_marker_palette[5].second = 0;
            formation_marker_palette[4].second = 0x0703C000;
            if ((u32)(slot_index - 6) >= 3U) {
                switch (formation_flags[slot_index]) {
                case 11:
                    func_801E0F60(formation_marker_x + 1, formation_marker_y + 1,
                                  formation_marker_x + 0x1A, formation_marker_y + 0x17, 0, 0x69);
                    break;
                case 10:
                    func_801E0F60(formation_marker_x + 1, formation_marker_y + 4,
                                  formation_marker_x + 0x16, formation_marker_y + 0x16, 0, 0x3E);
                    break;
                case 7:
                    func_801E0F60(formation_marker_x + 1, formation_marker_y + 1,
                                  formation_marker_x + 0x20, formation_marker_y + 0x13, 0, 0x51);
                    break;
                case 5:
                    func_801E0F60(formation_marker_x + 0xA, formation_marker_y + 4,
                                  formation_marker_x + 0x1F, formation_marker_y + 0x17, 0, 0x3E);
                    break;
                case 3:
                    func_801E0F60(formation_marker_x + 1, formation_marker_y + 1,
                                  formation_marker_x + 0x20, formation_marker_y + 0x12, 0, 0x19);
                    break;
                case 2:
                    func_801E0F60(formation_marker_x + 1, formation_marker_y + 4,
                                  formation_marker_x + 0x11, formation_marker_y + 0x12, 0, 0x2C);
                    break;
                case 1:
                    func_801E0F60(formation_marker_x + 0xA, formation_marker_y + 1,
                                  formation_marker_x + 0x1A, formation_marker_y + 0xE, 0, 0x2C);
                    break;
                case 15:
                    goto draw_full_cell;
                }
            } else {
draw_full_cell:
                func_801E0F60(formation_marker_x + 1, formation_marker_y + 1, formation_marker_x + 0x20, formation_marker_y + 0x16, 0, 0);
            }
        }
        texture_disable = D_800E9BA0;
        D_800E9BA0 = (CombatDrawCommand *)(texture_disable + 1);
        texture_disable->first = 0xD7000000;
        texture_disable->second = 0x80008000;
        if (squad != 0) {
            position_order = position_order_template;
            func_80093380(D_801F0B84, 9);
            func_80093380(D_801F3998, 5);
            slot_index = 0;
            position_order_start = position_order.positions;
            do {
                if (squad->field_02[slot_index] != 0) {
                    member_position = squad->field_07[slot_index];
                    position = 0;
                    position_cursor = position_order_start;
                    do {
                        if (*position_cursor == member_position) {
                            goto record_position_order;
                        }
                        ++position;
                        ++position_cursor;
                    } while (position < 9);
record_position_order:
                    D_801F0B84[position] = slot_index + 1;
                }
                slot_index += 1;
                ordered_member_count = 0;
            } while (slot_index < 5);
            slot_index = 0;
            ordered_member_output = D_801F3998;
            do {
                ordered_member = D_801F0B84[slot_index];
                slot_index += 1;
                if (ordered_member != 0) {
                    *ordered_member_output = ordered_member - 1;
                    ordered_member_output += 1;
                    ordered_member_count += 1;
                }
            } while (slot_index < 9);
            slot_index = ordered_member_count;
            if (ordered_member_count < 5) {
                do {
                    D_801F3998[slot_index] = 0xFF;
                    slot_index += 1;
                } while (slot_index < 5);
            }
            {
            u32 palette_tile_command;
            palette_tile_command = 0xF5000100;
            for (slot_index = 0; slot_index < 5 &&
                 (sorted_member_slot = D_801F3998[slot_index]) != 0xFF; ++slot_index) {
                member_id = squad->field_02[sorted_member_slot];
                if (member_id == 0) {
                    continue;
                }
                position = squad->field_07[sorted_member_slot];
                position_column_group = position / 3;
                {
                    s32 sprite_x_without_layer;
                    formation_x = formation_origin->x + 0x2C;
                    sprite_y = formation_origin->y + 0xC;
                    position_layer = position / 9;
                    position_within_layer = position % 9;
                    layer_offset = position_layer * 0xA;
                    position_column = position - (position_column_group * 3);
                    position_row = position_within_layer / 3;
                    sprite_x_without_layer = formation_x - position_column * 0x13;
                    sprite_x_without_layer += position_row * 0xA;
                    formation_x = sprite_x_without_layer + layer_offset;
                    sprite_y += position_column * 6;
                    sprite_y += position_row * 0xF;
                    sprite_y += layer_offset;
                    if (member_id >= 0x64U) {
                        special_sprite_count = func_00040FF4(*squad_index >= 30, member_id);
                        if (special_sprite_count != 0) {
                            u32 special_sprite_texture_offset;
                            u32 special_sprite_color;
                            special_sprite_state = D_800E9BA0;
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_state + 1);
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_state + 2);
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_state + 3);
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_state + 4);
                            sprite_command_opcode = 0xE7000000;
                            special_sprite_state->first = sprite_command_opcode;
                            special_sprite_state->second = 0;
                            special_sprite_state[1].first = 0xE200001C;
                            special_sprite_state[1].second = 0x504240;
                            special_sprite_state[2].first = 0xFCFF9BFF;
                            special_sprite_state[2].second = 0xFF34FE7F;
                            special_sprite_state[3].first = 0xFB000000;
                            do {
                                special_sprite_color = side_palette[3];
                            } while (0);
                            special_sprite_state[3].second = special_sprite_color;
                            special_sprite_index = special_sprite_count - 1;
                            special_palette_index = 0;
                            if (squad_variant != 0) {
                                special_palette_index = (D_80195480[member_id] >> 2) & 1;
                            } else if (D_80191010[member_id] & 4) {
                                special_palette_index = 1;
                            }
                            special_palette_image_word = 0xFD100000;
                            if (special_palette_index & 0xFF) {
                                special_sprite_palette = D_800E9BA0;
                                special_palette_address = D_801ED5BC;
                                special_sprite_palette->first = special_palette_image_word;
                                D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 1);
                                if (squad_variant != 0) {
                                    special_palette_address += 0x200;
                                }
                            } else {
                                special_sprite_palette = D_800E9BA0;
                                special_sprite_palette->first = special_palette_image_word;
                                special_palette_address = screen->texture_base;
                                D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 1);
                                if (squad_variant == 0) {
                                    special_palette_address += 0x200;
                                }
                            }
                            special_sprite_palette->second = special_palette_address;
                            special_sprite_palette[1].first = 0xE8000000;
                            special_sprite_palette[1].second = 0;
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 2);
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 3);
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 4);
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 5);
                            special_sprite_palette[3].second = 0;
                            special_sprite_palette[4].second = 0x073FC000;
                            D_800E9BA0 = (CombatDrawCommand *)(special_sprite_palette + 6);
                            special_sprite_palette[5].second = 0;
                            special_sprite_palette[2].first = palette_tile_command;
                            special_sprite_palette[2].second = 0x07000000;
                            sprite_command_opcode = 0xE6000000;
                            special_sprite_palette[3].first = sprite_command_opcode;
                            sprite_command_opcode = 0xF0000000;
                            special_sprite_palette[4].first = sprite_command_opcode;
                            sprite_command_opcode = 0xE7000000;
                            special_sprite_palette[5].first = sprite_command_opcode;
                            special_sprite_texture = D_800E9BA0;
                            member_top = sprite_y - 0x18;
                            member_bottom = sprite_y;
                            special_sprite_texture->second = 0x80008000;
                            special_sprite_texture->first = 0xD7000002;
                            special_sprite_texture[1].first = 0xFD500000;
                            special_sprite_texture_address = screen->texture_base;
                            D_800E9BA0 = special_sprite_texture + 1;
                            D_800E9BA0 = special_sprite_texture + 2;
                            D_800E9BA0 = special_sprite_texture + 3;
                            special_sprite_texture[2].first = 0xF5500000;
                            D_800E9BA0 = special_sprite_texture + 4;
                            D_800E9BA0 = special_sprite_texture + 5;
                            special_sprite_texture[4].first = 0xF3000000;
                            sprite_command_opcode = 0xE6000000;
                            special_sprite_texture[3].first = sprite_command_opcode;
                            D_800E9BA0 = special_sprite_texture + 6;
                            D_800E9BA0 = special_sprite_texture + 7;
                            D_800E9BA0 = special_sprite_texture + 8;
                            special_sprite_texture[7].first = 0xF2000000;
                            special_sprite_texture[2].second = 0x07080200;
                            special_sprite_texture[3].second = 0;
                            special_sprite_texture[4].second = 0x070BF400;
                            sprite_command_opcode = 0xE7000000;
                            special_sprite_texture[5].first = sprite_command_opcode;
                            special_sprite_texture[5].second = 0;
                            special_sprite_texture[6].first = 0xF5480400;
                            special_sprite_texture[6].second = 0x80200;
                            special_sprite_texture[7].second = 0x3C05C;
                            special_sprite_texture_offset = (special_sprite_index & 0xFF) * 0x180;
                            special_sprite_texture_offset += 0x400;
                            special_sprite_texture[1].second = (s32)(special_sprite_texture_address + special_sprite_texture_offset);
                            func_801E0F60(formation_x, member_top, formation_x + 0x10, member_bottom, 0, 0);
                            continue;
                        }
                        continue;
                    }
                    if (*squad_index >= 0x1E) {
                        primary_class_id = D_80195560[member_id].primary_class_id;
                        secondary_class_id = D_80195560[member_id].secondary_class_id;
                        current_hp = D_80195560[member_id].hp;
                        palette_status = D_80195560[member_id].status_flags & 4;
                    } else {
                        primary_class_id = D_80193BC0[member_id].record.primary_class_id;
                        secondary_class_id = D_80193BC0[member_id].record.secondary_class_id;
                        current_hp = D_80193BC0[member_id].record.hp;
                        palette_status = D_80193BC0[member_id].record.status_flags & 4;
                    }
                    do {
                        palette_flags = palette_status & 0xFF;
                    } while (0);
                    primary_class_argument = primary_class_id & 0xFF;
                    secondary_class_argument = secondary_class_id & 0xFF;
                    unit_size = D_8016DE1C(primary_class_argument, secondary_class_argument);
                    sprite_class = func_00043e18(primary_class_argument, secondary_class_argument);
                    unit_sprite_pipe_sync = D_800E9BA0++;
                    sprite_command_opcode = 0xE7000000;
                    unit_sprite_pipe_sync->first = sprite_command_opcode;
                    unit_sprite_pipe_sync->second = 0;
                    switch (unit_size) {
                    case 1: {
                        u32 unit_texture_offset;
                        u32 unit_color;
                        if (primary_class_argument == 0x5D) {
                            use_variant_class = 1;
                        } else {
                            use_variant_class = 0;
                        }
                        if (use_variant_class & squad_variant) {
                            secondary_class_id = 0x72;
                            primary_class_id = 0x72;
                            sprite_class = func_00043e18(0x72, 0x72);
                        }
                        primary_class_id = g_func_0019554C_class_records[primary_class_id & 0xFF].related_class_id
                            == secondary_class_id ? primary_class_id : secondary_class_id;
                        if (current_hp == 0) {
                            unit_palette_address = D_801ED5B8;
                            alternate_texture_flag = D_8018ECE4[primary_class_id].flags & 0x80;
                            goto block_152;
                        }
                        class_display_index = primary_class_id & 0xFF;
                        if (palette_flags != 0) {
                            unit_palette_address = D_801ED5BC;
                            alternate_texture_flag = D_8018ECE4[class_display_index].flags & 0x80;
block_152:
                            if (alternate_texture_flag != 0) {
                                unit_palette_address += 0x400;
                            }
                        } else if (D_8018ECE4[class_display_index].flags & 0x80) {
                            unit_palette_address = screen->alternate_texture_base;
                        } else {
                            unit_palette_address = screen->texture_base;
                        }
                        unit_palette_commands = D_800E9BA0;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 1);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 2);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 3);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 4);
                        unit_palette_commands[0].first = 0xE7000000;
                        unit_palette_commands[0].second = 0;
                        unit_palette_commands[1].first = 0xE200001C;
                        unit_palette_commands[1].second = 0x504240;
                        unit_palette_commands[2].first = 0xFCFF9BFF;
                        unit_palette_commands[2].second = 0xFF34FE7F;
                        unit_palette_commands[3].first = 0xFB000000;
                        do {
                            unit_color = side_palette[3];
                        } while (0);
                        unit_palette_commands[4].first = 0xFD100000;
                        unit_palette_commands[3].second = unit_color;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 5);
                        unit_selected_palette = unit_palette_address;
                        if (squad_variant == 0) {
                            unit_selected_palette = unit_palette_address + 0x200;
                        }
                        unit_palette_commands[4].second = unit_selected_palette;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 6);
                        unit_palette_commands[5].first = 0xE8000000;
                        unit_palette_commands[5].second = 0;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 7);
                        unit_palette_commands[6].first = palette_tile_command;
                        unit_palette_commands[6].second = 0x07000000;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 8);
                        unit_palette_commands[7].first = 0xE6000000;
                        unit_palette_commands[7].second = 0;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 9);
                        unit_palette_commands[8].first = 0xF0000000;
                        unit_palette_commands[8].second = 0x073FC000;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_palette_commands + 10);
                        unit_palette_commands[9].first = 0xE7000000;
                        unit_palette_commands[9].second = 0;
                        if (D_8018ECE4[primary_class_id].flags & 0x80) {
                            unit_texture_address = screen->alternate_texture_base;
                        } else {
                            unit_texture_address = screen->texture_base;
                        }
                        member_top = sprite_y - 0x18;
                        member_bottom = sprite_y;
                        unit_texture_commands = D_800E9BA0;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 1);
                        unit_texture_commands->first = 0xFD500000;
                        unit_texture_offset = (sprite_class & 0xFF) * 0x180;
                        unit_texture_offset += 0x400;
                        unit_texture_commands->second = (s32)(unit_texture_address + unit_texture_offset);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 2);
                        unit_texture_commands[1].first = 0xF5500000;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 3);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 4);
                        unit_texture_commands[3].first = 0xF3000000;
                        sprite_command_opcode = 0xE6000000;
                        unit_texture_commands[2].first = sprite_command_opcode;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 5);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 6);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_texture_commands + 7);
                        unit_texture_commands[1].second = 0x07080200;
                        unit_texture_commands[2].second = 0;
                        unit_texture_commands[3].second = 0x070BF400;
                        sprite_command_opcode = 0xE7000000;
                        unit_texture_commands[4].first = sprite_command_opcode;
                        unit_texture_commands[4].second = 0;
                        unit_texture_commands[5].first = 0xF5480400;
                        unit_texture_commands[5].second = 0x80200;
                        unit_texture_commands[6].first = 0xF2000000;
                        unit_texture_commands[6].second = 0x3C05C;
                        func_801E0F60(formation_x, member_top, formation_x + 0x10, member_bottom, 0, 0);
                        continue;
                    }
                    case 2:
                        if (current_hp == 0) {
                            icon_palette_address = D_801ED5B8 + 0x800;
                        } else if (palette_flags != 0) {
                            icon_palette_address = D_801ED5BC + 0x800;
                        } else {
                            icon_palette_address = screen->icon_texture_base;
                        }
                        unit_icon_commands = D_800E9BA0;
                        sprite_command_opcode = 0xE7000000;
                        unit_icon_commands->first = sprite_command_opcode;
                        unit_icon_commands->second = 0;
                        unit_icon_commands[1].first = 0xFD100000;
                        unit_icon_palette = icon_palette_address;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 1);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 2);
                        if (squad_variant == 0) {
                            unit_icon_palette += 0x200;
                        }
                        unit_icon_commands[1].second = unit_icon_palette;
                        unit_icon_commands[2].first = 0xE8000000;
                        unit_icon_commands[2].second = 0;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 3);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 4);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 5);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 6);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 7);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 8);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 9);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 10);
                        unit_icon_commands[4].second = 0;
                        unit_icon_commands[5].second = 0x073FC000;
                        unit_icon_commands[6].second = 0;
                        unit_icon_commands[7].first = 0xE200001C;
                        unit_icon_commands[7].second = 0x504240;
                        unit_icon_commands[8].first = 0xFCFF9BFF;
                        unit_icon_commands[8].second = 0xFF34FE7F;
                        unit_icon_commands[9].first = 0xFB000000;
                        unit_icon_commands[3].first = palette_tile_command;
                        unit_icon_commands[3].second = 0x07000000;
                        sprite_command_opcode = 0xE6000000;
                        unit_icon_commands[4].first = sprite_command_opcode;
                        sprite_command_opcode = 0xF0000000;
                        unit_icon_commands[5].first = sprite_command_opcode;
                        sprite_command_opcode = 0xE7000000;
                        unit_icon_commands[6].first = sprite_command_opcode;
                        member_left = formation_x - 8;
                        member_top = sprite_y - 0x1C;
                        member_bottom = sprite_y;
                        member_right = formation_x + 0x18;
                        unit_icon_commands[10].first = 0xFD500000;
                        unit_icon_commands[9].second = (s32) side_palette[3];
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 11);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 12);
                        unit_icon_commands[11].first = 0xF5500000;
                        unit_icon_commands[11].second = 0x07000000;
                        unit_icon_commands[10].second = (s32) (screen->icon_texture_base + (((sprite_class & 0xFF) * 0x380) + 0x400));
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 13);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 14);
                        unit_icon_commands[13].first = 0xF3000000;
                        sprite_command_opcode = 0xE6000000;
                        unit_icon_commands[12].first = sprite_command_opcode;
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 15);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 16);
                        D_800E9BA0 = (CombatDrawCommand *)(unit_icon_commands + 17);
                        unit_icon_commands[12].second = 0;
                        unit_icon_commands[13].second = 0x071BF200;
                        sprite_command_opcode = 0xE7000000;
                        unit_icon_commands[14].first = sprite_command_opcode;
                        unit_icon_commands[14].second = 0;
                        unit_icon_commands[15].first = 0xF5480800;
                        unit_icon_commands[15].second = 0;
                        unit_icon_commands[16].first = 0xF2000000;
                        unit_icon_commands[16].second = 0x7C06C;
                        func_801E0F60(member_left, member_top, member_right, member_bottom, 0, 0);
                        continue;
                    default:
                        continue;
                    }
                }
            }
            }
            if (func_80186210(0x27) == 0) {
                display_squad_index = *squad_index;
                display_pool_flag = 0;
                if (display_squad_index >= 0x1E) {
                    display_squad_flags = *D_801F0CB0[display_squad_index];
                    if (display_squad_flags & 0x01000008) {
                        if (display_squad_flags & 8) {
                            display_pool_flag = 1;
                        }
                        goto block_181;
                    }
                } else {
block_181:
                    {
                    u32 value_palette_tile = 0xF5000100;
                    u32 value_palette_load = 0x0703C000;
                    u32 value_texture_load = 0x073FF200;
                    u32 value_render_tile = 0xF5400800;
                    u32 value_tile_size = 0xFC0FC;
                    u32 value_sync_word = 0xE7000000;
                    value_overlay_commands = D_800E9BA0;
                    display_pool_variant = squad_variant | display_pool_flag;
                    value_screen = D_801ED5C0;
                    value_overlay_commands->first = value_sync_word;
                    value_overlay_commands->second = 0;
                    value_overlay_commands[1].first = 0xFD100000;
                    value_palette_address = value_screen->value_texture_address;
                    value_overlay_commands[3].first = value_palette_tile;
                    value_overlay_commands[2].first = 0xE8000000;
                    value_overlay_commands[5].first = 0xF0000000;
                    value_overlay_commands[2].second = 0;
                    value_overlay_commands[3].second = 0x07000000;
                    value_overlay_commands[4].first = 0xE6000000;
                    value_overlay_commands[4].second = 0;
                    value_overlay_commands[5].second = value_palette_load;
                    value_overlay_commands[6].first = value_sync_word;
                    value_overlay_commands[6].second = 0;
                    value_overlay_commands[7].first = 0xFD500000;
                    value_overlay_commands[1].second = (s32) value_palette_address;
                    value_texture_address = value_screen->value_texture_address;
                    slot_index = 0;
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 1);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 2);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 3);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 4);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 5);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 6);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 7);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 8);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 9);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 10);
                    value_overlay_commands[8].first = 0xF5500000;
                    value_overlay_commands[8].second = 0x07000000;
                    value_overlay_commands[9].first = 0xE6000000;
                    value_overlay_commands[7].second = value_texture_address + 0x20;
                    value_overlay_commands[9].second = 0;
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 11);
                    value_overlay_commands[10].first = 0xF3000000;
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 12);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 13);
                    D_800E9BA0 = (CombatDrawCommand *)(value_overlay_commands + 14);
                    value_overlay_commands[10].second = value_texture_load;
                    value_overlay_commands[11].first = value_sync_word;
                    value_overlay_commands[11].second = 0;
                    value_overlay_commands[12].first = value_render_tile;
                    value_overlay_commands[12].second = 0;
                    value_overlay_commands[13].first = 0xF2000000;
                    value_overlay_commands[13].second = value_tile_size;
                    }
                    value_origin_x = formation_origin->x + 0x2C;
                    formation_y = formation_origin->y + 0xC;
                    small_pool_values = D_80190EBC;
                    for (; slot_index < 5; ++slot_index) {
                    value_member_slot = D_801F3998[slot_index];
                    draw_member_value = 1;
                    if (value_member_slot == 0xFF) {
                        break;
                    }
                    {
                        value_member_id = squad->field_02[value_member_slot];
                        if (value_member_id != 0) {
                            position = squad->field_07[value_member_slot];
                            if (value_member_id >= 0x64U) {
                                if (display_pool_variant != 0) {
                                    display_value = D_8019532C[value_member_id];
                                    display_limit = D_801953F2;
                                    has_display_value = display_value != 0;
                                } else {
                                    display_value = small_pool_values[value_member_id];
                                    display_limit = small_pool_values[99];
                                    has_display_value = display_value != 0;
                                }
                                draw_member_value &= -has_display_value;
                                goto block_192;
                            }
                            if (display_pool_variant != 0) {
                                display_value = D_80195560[value_member_id].hp;
                                display_limit = D_80195560[value_member_id].max_hp;
                                value_column_quotient = position / 3;
                            } else {
                                display_value = D_80193BC0[value_member_id].record.hp;
                                display_limit = D_80193BC0[value_member_id].record.max_hp;
block_192:
                                value_column_quotient = position / 3;
                            }
                            value_column = position - (value_column_quotient * 3);
                            value_layer_offset = (position / 9) * 0xA;
                            value_row = (position % 9) / 3;
                            value_x = (value_origin_x - (value_column * 0x13)) + (value_row * 0xA) + value_layer_offset;
                            value_y = formation_y + (value_column * 6) + (value_row * 0xF) + value_layer_offset;
                            if (draw_member_value & 0xFFFF) {
                                member_value = display_value & 0xFFFF;
                                func_00136738(value_x, value_y - 6, member_value, display_limit);
                                if (member_value != 0) {
                                    func_00136970(value_x, value_y - 9, member_value, -3);
                                }
                            }
                        }
                    }
                    }
                }
            }
            if (squad->field_02[0] != 0) {
                s32 leader_layer;
                s32 leader_column_group;
                s32 leader_origin_x;
                s32 leader_origin_y;
                s32 leader_column_y;
                position = squad->field_07[0];
                leader_layer = position / 9;
                leader_column_group = position / 3;
                position_marker_commands = D_800E9BA0;
                leader_origin_x = *(volatile s32 *)&formation_origin->x;
                leader_origin_y = *(volatile s32 *)&formation_origin->y;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 1);
                position_marker_commands[0].first = 0xE7000000;
                position_marker_commands[0].second = 0;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 2);
                position_marker_commands[1].first = 0xE3001001;
                position_marker_commands[1].second = 0;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 3);
                position_marker_commands[2].first = 0xFD100000;
                position_marker_commands[2].second = (u32)D_801F0BCC;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 4);
                position_marker_commands[3].first = 0xF5100000;
                position_marker_commands[3].second = 0x07000000;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 5);
                position_marker_commands[4].first = 0xE6000000;
                position_marker_commands[4].second = 0;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 6);
                position_marker_commands[5].first = 0xF3000000;
                position_marker_commands[5].second = 0x070D7156;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 7);
                position_marker_commands[6].first = 0xE7000000;
                position_marker_commands[6].second = 0;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 8);
                position_marker_commands[7].first = 0xF5100C00;
                position_marker_commands[7].second = 0;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 9);
                position_marker_commands[8].first = 0xF2000000;
                position_marker_commands[8].second = 0x5C020;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 10);
                position_marker_commands[9].first = 0xE200001C;
                position_marker_commands[9].second = 0x504240;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 11);
                position_marker_commands[10].first = 0xFCFF9BFF;
                position_marker_commands[10].second = 0xFF34FE7F;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_commands + 12);
                position_marker_commands[11].first = 0xFB000000;
                position_marker_commands[11].second = (s32) side_palette[3];
                leader_marker_column = position - 3 * leader_column_group;
                leader_marker_layer_offset = leader_layer * 0xA;
                leader_marker_row = (position - leader_layer * 9) / 3;
                leader_column_y = leader_marker_column * 6;
                leader_column_y += 0xC;
                leader_marker_y = leader_origin_y + leader_column_y + (leader_marker_row * 0xF) + leader_marker_layer_offset;
                leader_marker_x = (leader_origin_x - ((leader_marker_column * 0x13) - 0x2C)) + (leader_marker_row * 0xA) + leader_marker_layer_offset;
                if (*D_801F0CB0[*squad_index] & 0x80) {
                    func_801E0F60(leader_marker_x + 0xC, leader_marker_y - 0x16,
                                  leader_marker_x + 0x16, leader_marker_y - 0xD, 8, 0);
                } else {
                    func_801E0F60(leader_marker_x + 0xC, leader_marker_y - 0x16,
                                  leader_marker_x + 0x14, leader_marker_y - 0xD, 0, 0);
                }
                position_marker_restore = D_800E9BA0;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_restore + 1);
                position_marker_restore->first = 0xE7000000;
                D_800E9BA0 = (CombatDrawCommand *)(position_marker_restore + 2);
                position_marker_restore->second = 0;
                position_marker_restore[1].first = 0xE3001001;
                position_marker_restore[1].second = 0x8000;
            }
        }
        second_squad = screen->second_squad;
        if (squad != second_squad && D_801ED5C8 != -1) {
            formation_origin = (const FormationOrigin *)&D_801F0B78;
            formation_flags = screen->second_formation_flags;
            vertical_offsets = screen->second_vertical_offsets;
            comparison_slot = &D_801F0D7C;
            squad_index = &D_801ED5C8;
            side_selection_slot = &D_801ED5B4;
            squad = second_squad;
            offset_direction = &screen->second_offset_direction;
            side_palette = D_801F3684;
            goto draw_side;
        }
        slot_index = D_801ED5B0;
        if ((slot_index >= 0) || (D_801ED5B4 >= 0)) {
            selection_marker_commands = D_800E9BA0;
            D_800E9BA0 = selection_marker_commands + 1;
            selection_marker_commands[0].first = 0xE7000000;
            selection_marker_commands[0].second = 0;
            D_800E9BA0 = selection_marker_commands + 2;
            selection_marker_commands[1].first = 0xFA000000;
            selection_marker_commands[1].second = -1;
            D_800E9BA0 = selection_marker_commands + 3;
            selection_marker_commands[2].first = 0xE3000C00;
            selection_marker_commands[2].second = 0;
            D_800E9BA0 = selection_marker_commands + 4;
            selection_marker_commands[3].first = 0xE200001C;
            selection_marker_commands[3].second = 0x504240;
            D_800E9BA0 = selection_marker_commands + 5;
            selection_marker_commands[4].first = 0xFCFF9BFF;
            selection_marker_commands[4].second = 0xFF34FE7F;
            D_800E9BA0 = selection_marker_commands + 6;
            selection_marker_commands[5].first = 0xFD100000;
            selection_marker_commands[5].second = (u32)D_80212518;
            D_800E9BA0 = selection_marker_commands + 7;
            selection_marker_commands[6].first = 0xE8000000;
            selection_marker_commands[6].second = 0;
            D_800E9BA0 = selection_marker_commands + 8;
            selection_marker_commands[7].first = 0xF5000100;
            selection_marker_commands[7].second = 0x07000000;
            D_800E9BA0 = selection_marker_commands + 9;
            selection_marker_commands[8].first = 0xE6000000;
            selection_marker_commands[8].second = 0;
            D_800E9BA0 = selection_marker_commands + 10;
            selection_marker_commands[9].first = 0xF0000000;
            selection_marker_commands[9].second = 0x0703C000;
            D_800E9BA0 = selection_marker_commands + 11;
            selection_marker_commands[10].first = 0xE7000000;
            selection_marker_commands[10].second = 0;
            D_800E9BA0 = selection_marker_commands + 12;
            selection_marker_commands[11].first = 0xE3001001;
            selection_marker_commands[11].second = 0x8000;
            D_800E9BA0 = selection_marker_commands + 13;
            selection_marker_commands[12].first = 0xD7000002;
            selection_marker_commands[12].second = 0x80008000;
            D_800E9BA0 = selection_marker_commands + 14;
            selection_marker_commands[13].first = 0xFD500000;
            selection_marker_commands[13].second = (u32)D_80212410;
            D_800E9BA0 = selection_marker_commands + 15;
            selection_marker_commands[14].first = 0xF5500000;
            selection_marker_commands[14].second = 0x07000000;
            D_800E9BA0 = selection_marker_commands + 16;
            selection_marker_commands[15].first = 0xE6000000;
            selection_marker_commands[15].second = 0;
            D_800E9BA0 = selection_marker_commands + 17;
            selection_marker_commands[16].first = 0xF3000000;
            selection_marker_commands[16].second = 0x0707F800;
            D_800E9BA0 = selection_marker_commands + 18;
            selection_marker_commands[17].first = 0xE7000000;
            selection_marker_commands[17].second = 0;
            D_800E9BA0 = selection_marker_commands + 19;
            selection_marker_commands[18].first = 0xF5400200;
            selection_marker_commands[18].second = 0;
            D_800E9BA0 = selection_marker_commands + 20;
            selection_marker_commands[19].first = 0xF2000000;
            selection_marker_commands[19].second = 0x3C07C;
            if (slot_index >= 0) {
                first_selection_layer = slot_index / 9;
                first_selection_column_group = slot_index / 3;
                D_800E9BA0 = (CombatDrawCommand *)(selection_marker_commands + 21);
                selection_marker_commands[20].first = 0xFB000000;
                selection_marker_commands[20].second = (s32) D_801F3678[3];
                grid_origin_x = D_801F0B94 + 0x24;
                first_selection_y = D_801F0B98;
                first_selection_column = slot_index - 3 * first_selection_column_group;
                first_selection_layer_offset = first_selection_layer * 0xA;
                first_selection_row = (slot_index - 9 * first_selection_layer) / 3;
                first_selection_y += first_selection_column * 6;
                first_selection_y -= 2;
                first_selection_y += first_selection_row * 0xF;
                grid_origin_y = first_selection_y;
                grid_origin_y += first_selection_layer_offset;
                grid_origin_y -= 0x18;
                grid_origin_y -= D_801F3A48 & 0xF;
                grid_origin_x = (grid_origin_x - (first_selection_column * 0x13)) + (first_selection_row * 0xA) + first_selection_layer_offset;
                func_801E0F60(grid_origin_x + 0xE, grid_origin_y, grid_origin_x + 0x1C, grid_origin_y + 0x12, 0, 0xE);
            }
            second_selection_slot = D_801ED5B4;
            if (second_selection_slot >= 0) {
                slot_index = second_selection_slot;
                second_selection_layer = slot_index / 9;
                second_selection_column_group = slot_index / 3;
                second_marker_color = D_800E9BA0;
                second_marker_color->first = 0xFB000000;
                second_marker_color->second = (s32) D_801F3684[3];
                D_800E9BA0 = (CombatDrawCommand *)(second_marker_color + 1);
                grid_origin_x = D_801F0B78 + 0x24;
                grid_origin_y = D_801F0B7C;
                second_selection_column = slot_index - 3 * second_selection_column_group;
                second_selection_layer_offset = second_selection_layer * 0xA;
                second_selection_row = (slot_index - 9 * second_selection_layer) / 3;
                grid_origin_y += second_selection_column * 6;
                grid_origin_y -= 2;
                grid_origin_y += second_selection_row * 0xF;
                grid_origin_y += second_selection_layer_offset;
                grid_origin_y -= 0x18;
                grid_origin_y -= D_801F3A48 & 0xF;
                second_selection_x = (grid_origin_x - (second_selection_column * 0x13)) + (second_selection_row * 0xA) + second_selection_layer_offset;
                func_801E0F60(second_selection_x + 0xE, grid_origin_y, second_selection_x + 0x1C, grid_origin_y + 0x12, 0, 0xE);
            }
            final_color = D_800E9BA0;
            D_800E9BA0 = (CombatDrawCommand *)(final_color + 1);
            final_color->first = 0xFB000000;
            final_color->second = 0xFF;
        }
    }
}
