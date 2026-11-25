#include "game/character_record.h"
#include "game/combat_draw_commands.h"
#include "game/formation_panel.h"

/* These cursor aliases share an address. Publish ordered updates through the volatile pointer. */
extern CombatDrawCommand *volatile gTitleCardDisplayListCursor;
extern CombatDrawCommand D_801CFBF8[];
extern u16 D_801CFAD8[];
extern u16 D_801CFB38[];
extern u8 D_801CFB58[];
extern u16 D_80190EBC[];
extern u16 D_8019532C[];
extern CharacterClassRecord D_80187C14[];
extern u8 D_8018ECE4[][6];

u8 func_00040FF4(u8 alternate_roster, u8 member_index);
u8 func_00043d1c(int primary_class_id, int secondary_class_id);
int func_00043e18(int primary_class_id, int secondary_class_id);
void func_00208F90(int x, int y, u16 tile);
void *func_0020934C(int size, int icon, int style);
void *func_002094F8(int size, int variant, int style);
void func_00209A74(int x, int y, int hp, int max_hp);
void func_00209CAC(int x, int y, int number, int digits);

#define FIRST_AT(base, offset) (((CombatDrawCommand *)(base))[(offset) / 8].first)
#define SECOND_AT(base, offset) (((CombatDrawCommand *)(base))[(offset) / 8].second)
#define FIRST_ORDERED_AT(base, offset) (((volatile CombatDrawCommand *)(base))[(offset) / 8].first)
#define SECOND_ORDERED_AT(base, offset) (((volatile CombatDrawCommand *)(base))[(offset) / 8].second)

#define STRIP_COMMAND(commands, index, first_word, second_word) { \
    gTitleCardDisplayListCursor = (commands) + (index) + 1; \
    (commands)[index].first = (first_word); \
    (commands)[index].second = (second_word); \
}

#define FINISH_ICON_RECTANGLE() do { \
    if ((s32)((u32)icon_top << 2) < 0) { \
        s32 icon_t_offset = (s32)((u32)icon_top << 0x12) >> 0xD; \
        s32 clipped_t = icon_t_offset < 1 ? icon_t_offset : 0; \
        icon_texture_origin->second = icon_texture_word | ((u32)-clipped_t & 0xFFFF); \
    } \
    COMBAT_DRAW_PAIR(0xF1000000, 0x04000400); \
    COMBAT_DRAW_PAIR(0xE7000000, 0); \
} while (0)

/* Draw the two squads' formation grids, member icons and optional HP overlays. */
void func_00209F74(s32 first_x, s32 first_y, s32 second_x, s32 second_y, s32 show_hp) {
    FormationState *formation;
    FormationSquadView *squad;
    s32 lead_hp_x;
    s32 lead_hp_y;
    s32 side;
    s32 palette_tile_command;
    u8 squad_style_byte;
    u32 grid_palette_address;
    u32 grid_pixel_address;
    s16 middle_strip_fixed_x;
    s16 lower_strip_fixed_x;
    s16 soldier_icon_fixed_x;
    s16 large_icon_fixed_x;
    s16 regular_icon_fixed_x;
    s16 lead_marker_fixed_x;
    s16 upper_strip_fixed_x;
    s32 cell_column;
    s32 cell_column_quotient;
    s32 cell_layer;
    u32 cell_palette_stride;
    u32 cell_palette_index;
    s32 icon_layer_slot;
    s32 icon_row;
    s32 hp_row;
    s32 cell_layer_slot;
    s32 cell_row;
    s32 icon_layer_displacement;
    s32 icon_index;
    s32 hp_layer_displacement;
    s32 cell_layer_displacement;
    s32 icon_column;
    s32 hp_column;
    s32 hp_column_quotient;
    s32 hp_layer;
    s32 cell_x;
    s32 cell_y;
    s32 cell_column_y;
    s32 icon_layer;
    s32 soldier_icon_pixels;
    s32 large_icon_pixels;
    s32 regular_icon_pixels;
    s32 displayed_hp;
    s32 hp_y;
    u8 unit_size;
    s32 hp_x;
    s32 icon_y;
    s32 icon_x;
    s32 lower_strip_t_offset;
    s32 soldier_icon_id;
    s32 soldier_icon_palette;
    s32 soldier_icon_right;
    s32 soldier_icon_top;
    s32 large_icon_palette;
    s32 large_icon_right;
    s32 large_icon_left;
    s32 large_icon_top;
    s32 regular_icon_palette;
    s32 regular_icon_right;
    s32 regular_icon_top;
    s32 upper_strip_right;
    s32 lead_marker_right;
    s32 lead_marker_bottom;
    s32 lead_marker_t_offset;
    s32 upper_strip_bottom;
    s32 upper_strip_t_offset;
    s32 middle_strip_right;
    s32 middle_strip_bottom;
    s32 middle_strip_t_offset;
    s32 lower_strip_right;
    s32 lower_strip_bottom;
    s32 icon_size_case;
    s32 large_icon_s_offset;
    s32 regular_icon_s_offset;
    s32 lead_marker_s_offset;
    s32 upper_strip_s_offset;
    s32 middle_strip_s_offset;
    s32 lower_strip_s_offset;
    s32 soldier_icon_s_offset;
    s32 upper_strip_texture_word;
    s32 middle_strip_texture_word;
    s32 lower_strip_texture_word;
    s32 icon_texture_word;
    s32 lead_marker_texture_word;
    s32 grid_y;
    s32 secondary_class;
    s32 grid_x;
    s32 primary_class;
    s32 hp_origin_y;
    s32 slot_index;
    u16 draw_hp;
    s32 class_override_key;
    u32 override_class;
    s32 soldier_has_hp;
    s32 icon_top;
    s32 hp;
    s32 max_hp;
    u32 icon_member_index;
    u32 icon_variant;
    const u16 *scenario_hp_pool;
    u32 hp_member_index;
    u16 hp_member;
    u8 icon_member;
    u8 related_class;
    u8 cell_flags;
    s32 icon_formation_slot;
    s32 hp_formation_slot;
    u8 primary_class_byte;
    CombatDrawCommand *lead_marker_commands;
    CombatDrawCommand *second_strip_commands;
    CombatDrawCommand *third_strip_commands;
    CombatDrawCommand *first_strip_texture_origin;
    CombatDrawCommand *second_strip_texture_origin;
    CombatDrawCommand *third_strip_texture_origin;
    CombatDrawCommand *lead_marker_texture_origin;
    CombatDrawCommand *first_strip_commands;
    FormationPanelView *formations;
    FormationSquadView *side_squad;
    FormationState *side_formation;
    CombatDrawCommand *opening_commands;
    CombatDrawCommand *icon_sync_command;
    CombatDrawCommand *lead_marker_finish_commands;
    CombatDrawCommand *hp_texture_disable_commands;
    CombatDrawCommand *cell_texture_commands;
    CombatDrawCommand *grid_texture_disable_commands;
    CombatDrawCommand *icon_texture_origin;

    lead_hp_x = 0;
    lead_hp_y = 0;
    if (D_801CFA70 != 0) {
        opening_commands = gTitleCardDisplayListCursor;
        palette_tile_command = 0xF5000100;
        side = 0;
        gTitleCardDisplayListCursor = opening_commands + 1;
        FIRST_AT(opening_commands, 0x0) = 0xDE000000;
        SECOND_AT(opening_commands, 0x4) = (u32)D_801CFBF8;
        for (; side < 2; side++) {
            u32 style;
            FormationPanelView *middle_formations;
            const u8 *middle_pixels;
            FormationPanelView *lower_formations;
            const u8 *lower_pixels;
            FormationPanelView *cell_formations;
            u32 cell_texture_address;
            u32 cell_tile_extent;
            u32 middle_right_field;
            u32 middle_bottom_field;
            formations = D_801CFA70;
            first_strip_commands = gTitleCardDisplayListCursor;
            side_formation = &formations->formations[side];
            formation = side_formation;
            side_squad = side_formation->squad;
            squad = side_squad;
            squad_style_byte = squad->style;
            FIRST_AT(first_strip_commands, 0x0) = 0xD7000002;
            SECOND_AT(first_strip_commands, 0x4) = 0x80008000;
            FIRST_AT(first_strip_commands, 0x8) = 0xFD100000;
            do {
                grid_palette_address = (u32)formations->grid_texture;
            } while (0);
            grid_x = first_x;
            FIRST_AT(first_strip_commands, 0x10) = 0xE8000000;
            SECOND_AT(first_strip_commands, 0x14) = 0;
            gTitleCardDisplayListCursor = first_strip_commands + 1;
            gTitleCardDisplayListCursor = first_strip_commands + 2;
            gTitleCardDisplayListCursor = first_strip_commands + 3;
            STRIP_COMMAND(first_strip_commands, 3, palette_tile_command, 0x07000000);
            gTitleCardDisplayListCursor = first_strip_commands + 5;
            gTitleCardDisplayListCursor = first_strip_commands + 6;
            SECOND_ORDERED_AT(first_strip_commands, 0x24) = 0;
            SECOND_ORDERED_AT(first_strip_commands, 0x2C) = 0x073FC000;
            D_800E9BA0 = first_strip_commands + 7;
            FIRST_ORDERED_AT(first_strip_commands, 0x30) = 0xE7000000;
            SECOND_ORDERED_AT(first_strip_commands, 0x34) = 0;
            do {
                FIRST_AT(first_strip_commands, 0x20) = 0xE6000000;
            } while (0);
            FIRST_AT(first_strip_commands, 0x28) = 0xF0000000;
            style = squad_style_byte >> 7;
            SECOND_AT(first_strip_commands, 0xC) = (s32) (grid_palette_address + (style << 8));
            if (side != 0) {
                grid_x = second_x;
            }
            grid_y = first_y;
            if (side != 0) {
                grid_y = second_y;
            }
            {
                CombatDrawCommand *image = D_800E9BA0++;
                image->first = 0xFD500000;
                grid_pixel_address = (u32)formations->grid_texture;
            }
            COMBAT_DRAW_PAIR(0xF5500000, 0x07000000);
            COMBAT_DRAW_PAIR(0xE6000000, 0);
            COMBAT_DRAW_PAIR(0xF3000000, 0x073EF0AB);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            COMBAT_DRAW_PAIR(0xF5481800, 0);
            COMBAT_DRAW_PAIR(0xF2000000, 0x17C050);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            {
                u32 right_field;
                u32 bottom_field;
                u32 top_left;
                CombatDrawCommand *rectangle;

                upper_strip_right = grid_x + 0x60;
                right_field = (upper_strip_right * 4 &
                    ((s32) ~(s16)(upper_strip_right * 4) >> 31) & 0xFFC) << 12;
                upper_strip_bottom = grid_y + 0x15;
                bottom_field = (upper_strip_bottom * 4 & ((s32) ~(s16)(upper_strip_bottom * 4) >> 31) & 0xFFC) | 0xE4000000U;
                rectangle = D_800E9BA0++;
                rectangle->first = right_field | (bottom_field & 0xFF000FFFU);

                upper_strip_fixed_x = grid_x * 4;
                top_left = ((grid_x * 4 & ((s32) ~upper_strip_fixed_x >> 31) & 0xFFC) << 12) |
                    (grid_y * 4 & ((s32) ~(s16) (grid_y * 4) >> 31) & 0xFFC);
                rectangle->second = top_left;
                first_strip_texture_origin = D_800E9BA0++;
                first_strip_texture_origin->first = 0xE1000000;
            }

            first_strip_commands[7].second = grid_pixel_address + 0x300;
            if (upper_strip_fixed_x < 0) {
                upper_strip_s_offset = upper_strip_fixed_x * 8;
                upper_strip_texture_word = (0 - (upper_strip_s_offset & (0 - (upper_strip_s_offset < 1)))) << 0x10;
            } else {
                upper_strip_texture_word = 0;
            }
            first_strip_texture_origin->second = upper_strip_texture_word;
            if ((s32)((u32)grid_y << 2) < 0) {
                upper_strip_t_offset = (s32)((u32)grid_y << 0x12) >> 0xD;
                first_strip_texture_origin->second = (s32) (upper_strip_texture_word | ((0 - (upper_strip_t_offset & (0 - (upper_strip_t_offset < 1)))) & 0xFFFF));
            }
            second_strip_commands = D_800E9BA0;
            middle_formations = D_801CFA70;
            COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
            grid_y += 0x15;
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            FIRST_AT(second_strip_commands, 0x10) = 0xFD500000;
            middle_pixels = middle_formations->grid_texture;
            {
                CombatDrawCommand *image = D_800E9BA0++;
                image->second = (u32)(middle_pixels + 0xAE0);
            }
            COMBAT_DRAW_PAIR(0xF5500000, 0x07000000);
            COMBAT_DRAW_PAIR(0xE6000000, 0);
            COMBAT_DRAW_PAIR(0xF3000000, 0x073EF0AB);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            COMBAT_DRAW_PAIR(0xF5481800, 0);
            COMBAT_DRAW_PAIR(0xF2000000, 0x17C050);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            middle_strip_right = grid_x + 0x60;
            middle_right_field = (middle_strip_right * 4 & ((s32) ~(s16)(middle_strip_right * 4) >> 31) & 0xFFC) << 12;
            middle_strip_bottom = grid_y + 0x15;
            middle_bottom_field = (middle_strip_bottom * 4 & ((s32) ~(s16)(middle_strip_bottom * 4) >> 31) & 0xFFC) | 0xE4000000U;
            {
                u32 top_left;
                CombatDrawCommand *rectangle = D_800E9BA0++;

                rectangle->first = middle_right_field | (middle_bottom_field & 0xFF000FFFU);

                do {
                    middle_strip_fixed_x = grid_x * 4;
                    top_left = (s32) ((((grid_x * 4) & ((s32) ~middle_strip_fixed_x >> 0x1F) & 0xFFC) << 0xC) | ((grid_y * 4) & ((s32) ~(s16) (grid_y * 4) >> 0x1F) & 0xFFC));
                } while (0);
                second_strip_texture_origin = D_800E9BA0++;
                rectangle->second = top_left;
                second_strip_texture_origin->first = 0xE1000000;
            }
            if (middle_strip_fixed_x < 0) {
                middle_strip_s_offset = middle_strip_fixed_x * 8;
                middle_strip_texture_word = (0 - (middle_strip_s_offset & (0 - (middle_strip_s_offset < 1)))) << 0x10;
            } else {
                middle_strip_texture_word = 0;
            }
            SECOND_AT(second_strip_texture_origin, 0x4) = middle_strip_texture_word;
            if ((s32)((u32)grid_y << 2) < 0) {
                middle_strip_t_offset = (s32)((u32)grid_y << 0x12) >> 0xD;
                SECOND_AT(second_strip_texture_origin, 0x4) = (s32) (middle_strip_texture_word | ((0 - (middle_strip_t_offset & (0 - (middle_strip_t_offset < 1)))) & 0xFFFF));
            }
            third_strip_commands = D_800E9BA0;
            lower_formations = D_801CFA70;
            COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
            grid_y += 0x15;
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            FIRST_AT(third_strip_commands, 0x10) = 0xFD500000;
            lower_pixels = lower_formations->grid_texture;
            {
                CombatDrawCommand *image = D_800E9BA0++;
                image->second = (u32)(lower_pixels + 0x12C0);
            }
            COMBAT_DRAW_PAIR(0xF5500000, 0x07000000);
            COMBAT_DRAW_PAIR(0xE6000000, 0);
            COMBAT_DRAW_PAIR(0xF3000000, 0x073EF0AB);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            COMBAT_DRAW_PAIR(0xF5481800, 0);
            COMBAT_DRAW_PAIR(0xF2000000, 0x17C050);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            {
                u32 rectangle_right;
                u32 rectangle_bottom;
                u32 top_left;
                CombatDrawCommand *rectangle;

                lower_strip_right = grid_x + 0x60;
                rectangle_right = (lower_strip_right * 4 & ((s32) ~(s16) (lower_strip_right * 4) >> 31) & 0xFFC) << 12;
                lower_strip_bottom = grid_y + 0x15;
                rectangle_bottom = (lower_strip_bottom * 4 & ((s32) ~(s16)(lower_strip_bottom * 4) >> 31) & 0xFFC) | 0xE4000000U;
                rectangle = D_800E9BA0++;
                rectangle->first = rectangle_right | (rectangle_bottom & 0xFF000FFFU);

                do {
                    lower_strip_fixed_x = grid_x * 4;
                    top_left = (s32) ((((grid_x * 4) & ((s32) ~lower_strip_fixed_x >> 0x1F) & 0xFFC) << 0xC) | ((grid_y * 4) & ((s32) ~(s16) (grid_y * 4) >> 0x1F) & 0xFFC));
                } while (0);
                third_strip_texture_origin = D_800E9BA0++;
                rectangle->second = top_left;
                third_strip_texture_origin->first = 0xE1000000;
            }
            if (lower_strip_fixed_x < 0) {
                lower_strip_s_offset = lower_strip_fixed_x * 8;
                lower_strip_texture_word = (0 - (lower_strip_s_offset & (0 - (lower_strip_s_offset < 1)))) << 0x10;
            } else {
                lower_strip_texture_word = 0;
            }
            SECOND_AT(third_strip_texture_origin, 0x4) = lower_strip_texture_word;
            if ((s32)((u32)grid_y << 2) < 0) {
                lower_strip_t_offset = (s32)((u32)grid_y << 0x12) >> 0xD;
                SECOND_AT(third_strip_texture_origin, 0x4) = (s32) (lower_strip_texture_word | ((0 - (lower_strip_t_offset & (0 - (lower_strip_t_offset < 1)))) & 0xFFFF));
            }
            cell_tile_extent = 0x70000;
            cell_texture_commands = D_800E9BA0;
            cell_formations = D_801CFA70;
            COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            FIRST_AT(cell_texture_commands, 0x10) = 0xFD500000;
            cell_texture_address = (u32)cell_formations->cell_texture;
            {
                CombatDrawCommand *image = D_800E9BA0++;
                image->second = cell_texture_address;
            }
            COMBAT_DRAW_PAIR(0xF5500000, 0x07000000);
            COMBAT_DRAW_PAIR(0xE6000000, 0);
            COMBAT_DRAW_PAIR(0xF3000000, 0x073FF400);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            COMBAT_DRAW_PAIR(0xF5400400, 0);
            cell_tile_extent |= 0xC1FC;
            grid_x += 0x24;
            grid_y -= 0x20;
            COMBAT_DRAW_PAIR(0xF2000000, cell_tile_extent);
            slot_index = 0;
            for (; slot_index < 15; slot_index++) {
                if ((u32)(slot_index - 6) < 3U) {
                    continue;
                }
                {
                    cell_palette_stride = (style << 4) + 0x10;
                    cell_palette_index = slot_index & 1;
                    cell_column_quotient = slot_index / 3;
                    cell_layer = slot_index / 9;
                    COMBAT_DRAW_PAIR(0xFD100000, (u32)&D_801CFAD8[cell_palette_index * cell_palette_stride]);
                    COMBAT_DRAW_PAIR(0xE8000000, 0);
                    COMBAT_DRAW_PAIR(palette_tile_command, 0x07000000);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF0000000, 0x0703C000);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                }
                cell_column = slot_index - (cell_column_quotient * 3);
                cell_layer_slot = slot_index - (cell_layer * 9);
                {
                    s32 after_column = grid_x - cell_column * 0x13;
                    s32 after_row;
                    cell_row = cell_layer_slot / 3;
                    after_row = after_column + cell_row * 0xA;
                    cell_layer_displacement = cell_layer * 0xA;
                    cell_x = after_row + cell_layer_displacement;
                }
                {
                    cell_column_y = (cell_column * 6) - 0xC;
                }
                cell_y = grid_y + cell_column_y + (cell_row * 0xF) + cell_layer_displacement;
                cell_flags = formation->slot_flags[slot_index];
                switch (cell_flags) {
                case 15: func_00208F90(cell_x, cell_y, 0); continue;
                case 11: func_00208F90(cell_x, cell_y, 7); continue;
                case 10: func_00208F90(cell_x, cell_y, 4); continue;
                case 7:  func_00208F90(cell_x, cell_y, 6); continue;
                case 5:  func_00208F90(cell_x, cell_y, 5); continue;
                case 3:  func_00208F90(cell_x, cell_y, 1); continue;
                case 2:  func_00208F90(cell_x, cell_y, 2); continue;
                case 1:  func_00208F90(cell_x, cell_y, 3); continue;
                }
            }
            grid_texture_disable_commands = gTitleCardDisplayListCursor;
            gTitleCardDisplayListCursor = grid_texture_disable_commands + 1;
            FIRST_AT(grid_texture_disable_commands, 0x0) = 0xD7000000;
            SECOND_AT(grid_texture_disable_commands, 0x4) = 0x80008000;
            slot_index = 0;
            for (; slot_index < 5; slot_index++) {
                icon_member = squad->member_indices[slot_index];
                if (icon_member == 0) {
                    continue;
                }
                if (side == 0) {
                    icon_formation_slot = 8 - squad->formation_slots[slot_index];
                } else {
                    icon_formation_slot = squad->formation_slots[slot_index];
                }
                if (side == 0) {
                    icon_x = first_x + 0x2C;
                } else {
                    icon_x = second_x + 0x2C;
                }
                if (side == 0) {
                    icon_y = first_y + 0xC;
                } else {
                    icon_y = second_y + 0xC;
                }
                {
                    s32 column_quotient;
                    column_quotient = icon_formation_slot / 3;
                    icon_layer = icon_formation_slot / 9;
                    icon_column = icon_formation_slot - column_quotient * 3;
                }
                /* KMC schedules the row multiply with the column shift in this phase. */
                do {
                    s32 x_after_column;
                    icon_layer_slot = icon_formation_slot - icon_layer * 9;
                    x_after_column = icon_x - icon_column * 0x13;
                    icon_row = icon_layer_slot / 3;
                    icon_layer_displacement = icon_layer * 0xA;
                    icon_x = (x_after_column + icon_row * 0xA) + icon_layer_displacement;
                } while (0);
                icon_y = icon_y + (icon_column * 6) + (icon_row * 0xF) + icon_layer_displacement;
                icon_member_index = icon_member & 0xFF;
                if (icon_member_index >= 0x64U) {
                    u8 soldier_icon_id_byte;

                    if (formation->squad_source_index >= 0x1E) {
                        soldier_icon_id_byte = func_00040FF4(1, icon_member_index);
                    } else {
                        soldier_icon_id_byte = func_00040FF4(0, icon_member_index);
                    }
                    soldier_icon_id = soldier_icon_id_byte & 0xFF;
                    if (soldier_icon_id != 0) {
                        CombatDrawCommand *soldier_texture_origin;
                        soldier_icon_pixels = (u32)func_0020934C(0U, soldier_icon_id - 1, style);
                        soldier_icon_palette = (u32)func_002094F8(0U, style, style);
                        COMBAT_DRAW_PAIR(0xE7000000, 0);
                        COMBAT_DRAW_PAIR(0xFD100000, soldier_icon_palette);
                        COMBAT_DRAW_PAIR(0xE8000000, 0);
                        COMBAT_DRAW_PAIR(palette_tile_command, 0x07000000);
                        COMBAT_DRAW_PAIR(0xE6000000, 0);
                        COMBAT_DRAW_PAIR(0xF0000000, 0x073FC000);
                        COMBAT_DRAW_PAIR(0xE7000000, 0);
                        COMBAT_DRAW_PAIR(0xD7000002, 0x80008000);
                        COMBAT_DRAW_PAIR(0xFD500000, soldier_icon_pixels);
                        COMBAT_DRAW_PAIR(0xF5500000, 0x07080200);
                        COMBAT_DRAW_PAIR(0xE6000000, 0);
                        COMBAT_DRAW_PAIR(0xF3000000, 0x070BF400);
                        COMBAT_DRAW_PAIR(0xE7000000, 0);
                        COMBAT_DRAW_PAIR(0xF5480400, 0x80200);
                        COMBAT_DRAW_PAIR(0xF2000000, 0x3C05C);
                        COMBAT_DRAW_PAIR(0xE7000000, 0);
                        {
                            CombatDrawCommand *rectangle;
                            u32 top_left;
                            u32 left_word;
                            s32 unwrapped_left;
                            s32 wrapped_left;

                            soldier_icon_right = icon_x + 0x10;
                            {
                                u32 right_field = ((soldier_icon_right * 4) & ((s32) ~(s16)(soldier_icon_right * 4) >> 31) & 0xFFC) << 12;
                                u32 bottom_field = ((icon_y * 4) & ((s32) ~(s16)(icon_y * 4) >> 31) & 0xFFC) | 0xE4000000U;
                                rectangle = D_800E9BA0++;
                                rectangle->first = right_field | (bottom_field & 0xFF000FFFU);
                            }

                            unwrapped_left = icon_x * 4;
                            wrapped_left = (s32)((u32)icon_x << 18);
                            soldier_icon_fixed_x = wrapped_left >> 16;
                            left_word = ((unwrapped_left & ((s32) ~soldier_icon_fixed_x >> 0x1F) & 0xFFC) << 0xC);
                            soldier_icon_top = icon_y - 0x18;
                            top_left = left_word | ((soldier_icon_top * 4) & ((s32) ~(s16) (soldier_icon_top * 4) >> 0x1F) & 0xFFC);
                            rectangle->second = top_left;
                            soldier_texture_origin = D_800E9BA0++;
                            soldier_texture_origin->first = 0xE1000000;
                        }
                        if (soldier_icon_fixed_x < 0) {
                            soldier_icon_s_offset = soldier_icon_fixed_x * 8;
                            icon_texture_word = (0 - (soldier_icon_s_offset & (0 - (soldier_icon_s_offset < 1)))) << 0x10;
                        } else {
                            icon_texture_word = 0;
                        }
                        SECOND_AT(soldier_texture_origin, 0x4) = icon_texture_word;
                        icon_top = icon_y - 0x18;
                        if ((s32)((u32)icon_top << 2) < 0) {
                            s32 icon_t_offset = (s32)((u32)icon_top << 0x12) >> 0xD;
                            s32 clipped_t = icon_t_offset < 1 ? icon_t_offset : 0;
                            soldier_texture_origin->second = icon_texture_word | ((u32)-clipped_t & 0xFFFF);
                        }
                        COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
                        COMBAT_DRAW_PAIR(0xE7000000, 0);
                    }
                    continue;
                }
                {
                    /* Keep the member index live for the primary lookup while this value is reused. */
                    u32 member_or_secondary_class = icon_member_index;

                    if (formation->squad_source_index >= 0x1E) {
                        primary_class_byte = D_80195560[icon_member_index].primary_class_id;
                        member_or_secondary_class = D_80195560[member_or_secondary_class].secondary_class_id;
                        class_override_key = primary_class_byte ^ 0x5D;
                    } else {
                        primary_class_byte = D_80193BC0[icon_member_index].record.primary_class_id;
                        member_or_secondary_class = D_80193BC0[member_or_secondary_class].record.secondary_class_id;
                        class_override_key = primary_class_byte ^ 0x5D;
                    }
                    primary_class = primary_class_byte & 0xFF;
                    do {
                        u32 is_override_class = class_override_key == 0;

                        override_class = style;
                        override_class &= is_override_class;
                    } while (0);
                    if (override_class) {
                        member_or_secondary_class = 0x72;
                        primary_class_byte = 0x72;
                    }
                    primary_class = primary_class_byte & 0xFF;
                    unit_size = func_00043d1c(primary_class, (u8)member_or_secondary_class);
                    icon_index = func_00043e18(primary_class,
                                              secondary_class = (u8)member_or_secondary_class);
                }
                related_class = D_80187C14[primary_class].related_class_id;
                if ((related_class != 0) && (related_class == secondary_class)) {
                    secondary_class = primary_class;
                }
                {
                    u8 icon_variant_byte;
                    CombatDrawCommand *next_icon_command;
                    do {
                        icon_variant_byte = D_8018ECE4[secondary_class][0];
                        icon_sync_command = gTitleCardDisplayListCursor;
                        icon_variant = icon_variant_byte >> 7;
                        next_icon_command = icon_sync_command + 1;
                    } while (0);
                    FIRST_AT(icon_sync_command, 0x0) = 0xE7000000;
                    SECOND_AT(icon_sync_command, 0x4) = 0;
                    icon_size_case = unit_size & 0xFF;
                    gTitleCardDisplayListCursor = next_icon_command;
                }
                switch (icon_size_case) {
                case 1: {
                    CombatDrawCommand *regular_texture_origin;
                    regular_icon_pixels = (u32)func_0020934C(icon_variant, icon_index & 0xFF, style);
                    regular_icon_palette = (u32)func_002094F8(icon_variant, style, style);
                    COMBAT_DRAW_PAIR(0xFD100000, regular_icon_palette);
                    COMBAT_DRAW_PAIR(0xE8000000, 0);
                    COMBAT_DRAW_PAIR(palette_tile_command, 0x07000000);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF0000000, 0x073FC000);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xFD500000, regular_icon_pixels);
                    COMBAT_DRAW_PAIR(0xF5500000, 0x07080200);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF3000000, 0x070BF400);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xF5480400, 0x80200);
                    COMBAT_DRAW_PAIR(0xF2000000, 0x3C05C);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    {
                        CombatDrawCommand *rectangle;
                        u32 right_field;
                        u32 bottom_field;
                        u32 top_left;
                        u32 left_word;
                        s32 unwrapped_left;
                        s32 wrapped_left;

                        regular_icon_right = icon_x + 0x10;
                        right_field = ((regular_icon_right * 4) & ((s32) ~(s16)(regular_icon_right * 4) >> 31) & 0xFFC) << 12;
                        bottom_field = ((icon_y * 4) & ((s32) ~(s16)(icon_y * 4) >> 31) & 0xFFC) | 0xE4000000U;
                        rectangle = D_800E9BA0++;
                        rectangle->first = right_field | (bottom_field & 0xFF000FFFU);
                        unwrapped_left = icon_x * 4;
                        wrapped_left = (s32)((u32)icon_x << 18);
                        regular_icon_fixed_x = wrapped_left >> 16;
                        left_word = ((unwrapped_left & ((s32) ~regular_icon_fixed_x >> 31) & 0xFFC) << 12);
                        regular_icon_top = icon_y - 0x18;
                        top_left = left_word |
                            ((regular_icon_top * 4) & ((s32) ~(s16)(regular_icon_top * 4) >> 31) & 0xFFC);
                        rectangle->second = top_left;
                        regular_texture_origin = D_800E9BA0++;
                        regular_texture_origin->first = 0xE1000000;
                    }
                    if (regular_icon_fixed_x < 0) {
                        regular_icon_s_offset = regular_icon_fixed_x * 8;
                        icon_texture_word = (0 - (regular_icon_s_offset & (0 - (regular_icon_s_offset < 1)))) << 0x10;
                    } else {
                        icon_texture_word = 0;
                    }
                    SECOND_AT(regular_texture_origin, 0x4) = icon_texture_word;
                    icon_top = icon_y - 0x18;
                    if ((s32)((u32)icon_top << 2) < 0) {
                        s32 icon_t_offset = (s32)((u32)icon_top << 0x12) >> 0xD;
                        s32 clipped_t = icon_t_offset < 1 ? icon_t_offset : 0;
                        regular_texture_origin->second = icon_texture_word | ((u32)-clipped_t & 0xFFFF);
                    }
                    COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    continue;
                }
                case 2: {
                    s32 fixed_bottom;
                    CombatDrawCommand *large_texture_origin;

                    large_icon_pixels = (u32)func_0020934C(2U, icon_index & 0xFF, style);
                    large_icon_palette = (u32)func_002094F8(2U, style, style);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xFD100000, large_icon_palette);
                    COMBAT_DRAW_PAIR(0xE8000000, 0);
                    COMBAT_DRAW_PAIR(palette_tile_command, 0x07000000);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF0000000, 0x073FC000);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xFD500000, large_icon_pixels);
                    COMBAT_DRAW_PAIR(0xF5500000, 0x07000000);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF3000000, 0x071BF200);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xF5480800, 0);
                    COMBAT_DRAW_PAIR(0xF2000000, 0x7C06C);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    {
                        CombatDrawCommand *rectangle;
                        u32 right_field;
                        u32 bottom_field;
                        u32 top_left;
                        u32 left_fixed;
                        u32 left_word;
                        s32 left_wrapped;

                        large_icon_right = icon_x + 0x18;
                        right_field = (large_icon_right * 4 & ((s32) ~(s16)(large_icon_right * 4) >> 31) & 0xFFC) << 12;
                        fixed_bottom = (s32)((u32)icon_y << 2);
                        bottom_field = (fixed_bottom & ((s32) ~(s16)fixed_bottom >> 31) & 0xFFC) | 0xE4000000;
                        rectangle = D_800E9BA0++;
                        rectangle->first = right_field | bottom_field;

                        large_icon_left = icon_x - 8;
                        left_fixed = (u32)large_icon_left << 2;
                        left_wrapped = (s32)((u32)large_icon_left << 18);
                        large_icon_fixed_x = left_wrapped >> 16;
                        left_word = (left_fixed & ((s32) ~large_icon_fixed_x >> 31) & 0xFFC) << 12;
                        large_icon_top = icon_y - 0x1C;
                        top_left = left_word | (large_icon_top * 4 & ((s32) ~(s16)(large_icon_top * 4) >> 31) & 0xFFC);
                        rectangle->second = top_left;
                        large_texture_origin = D_800E9BA0++;
                        large_texture_origin->first = 0xE1000000;
                    }
                    if (large_icon_fixed_x < 0) {
                        large_icon_s_offset = large_icon_fixed_x * 8;
                        icon_texture_word = (0 - (large_icon_s_offset & (0 - (large_icon_s_offset < 1)))) << 0x10;
                    } else {
                        icon_texture_word = 0;
                    }
                    SECOND_AT(large_texture_origin, 0x4) = icon_texture_word;
                    icon_top = icon_y - 0x1C;
                    icon_texture_origin = large_texture_origin;
                    break;
                }
                default:
                    continue;
                }
                FINISH_ICON_RECTANGLE();
                continue;
            }
            if (show_hp != 0) {
                CombatDrawCommand *hp_setup_commands;
                FormationPanelView *hp_setup_formations;
                const u16 *army_hp_pool;
                u32 hp_palette_address;
                u32 hp_texture_address;
                u32 hp_palette_upload = 0x0703C000;
                u32 hp_load_bounds;

                hp_load_bounds = 0x073F0000;
                hp_setup_commands = D_800E9BA0;
                hp_setup_formations = D_801CFA70;
                hp_load_bounds |= 0xF200;
                FIRST_AT(hp_setup_commands, 0x0) = 0xE7000000;
                SECOND_AT(hp_setup_commands, 0x4) = 0;
                FIRST_AT(hp_setup_commands, 0x8) = 0xFD100000;
                hp_palette_address = (u32)hp_setup_formations->hp_texture;
                FIRST_AT(hp_setup_commands, 0x10) = 0xE8000000;
                SECOND_AT(hp_setup_commands, 0x14) = 0;
                FIRST_AT(hp_setup_commands, 0x18) = palette_tile_command;
                SECOND_AT(hp_setup_commands, 0x24) = 0;
                SECOND_AT(hp_setup_commands, 0x2C) = hp_palette_upload;
                FIRST_AT(hp_setup_commands, 0x30) = 0xE7000000;
                SECOND_AT(hp_setup_commands, 0x34) = 0;
                SECOND_AT(hp_setup_commands, 0x1C) = 0x07000000;
                FIRST_AT(hp_setup_commands, 0x20) = 0xE6000000;
                FIRST_AT(hp_setup_commands, 0x28) = 0xF0000000;
                FIRST_AT(hp_setup_commands, 0x38) = 0xFD500000;
                SECOND_AT(hp_setup_commands, 0xC) = hp_palette_address;
                hp_texture_address = (u32)hp_setup_formations->hp_texture;
                gTitleCardDisplayListCursor = hp_setup_commands + 1;
                gTitleCardDisplayListCursor = hp_setup_commands + 2;
                gTitleCardDisplayListCursor = hp_setup_commands + 3;
                gTitleCardDisplayListCursor = hp_setup_commands + 4;
                gTitleCardDisplayListCursor = hp_setup_commands + 5;
                gTitleCardDisplayListCursor = hp_setup_commands + 6;
                gTitleCardDisplayListCursor = hp_setup_commands + 7;
                gTitleCardDisplayListCursor = hp_setup_commands + 8;
                gTitleCardDisplayListCursor = hp_setup_commands + 9;
                FIRST_AT(hp_setup_commands, 0x40) = 0xF5500000;
                SECOND_AT(hp_setup_commands, 0x44) = 0x07000000;
                FIRST_ORDERED_AT(hp_setup_commands, 0x48) = 0xE6000000;
                D_800E9BA0 = hp_setup_commands + 10;
                SECOND_ORDERED_AT(hp_setup_commands, 0x3C) = hp_texture_address + 0x20;
                SECOND_ORDERED_AT(hp_setup_commands, 0x4C) = 0;
                FIRST_ORDERED_AT(hp_setup_commands, 0x50) = 0xF3000000;
                SECOND_ORDERED_AT(hp_setup_commands, 0x54) = hp_load_bounds;
                FIRST_AT(hp_setup_commands, 0x58) = 0xE7000000;
                SECOND_AT(hp_setup_commands, 0x5C) = 0;
                gTitleCardDisplayListCursor = hp_setup_commands + 11;
                gTitleCardDisplayListCursor = hp_setup_commands + 12;
                gTitleCardDisplayListCursor = hp_setup_commands + 13;
                gTitleCardDisplayListCursor = hp_setup_commands + 14;
                FIRST_AT(hp_setup_commands, 0x60) = 0xF5400800;
                SECOND_AT(hp_setup_commands, 0x64) = 0;
                FIRST_AT(hp_setup_commands, 0x68) = 0xF2000000;
                SECOND_AT(hp_setup_commands, 0x6C) = 0xFC0FC;
                if (side == 0) {
                    icon_x = first_x + 0x2C;
                } else {
                    icon_x = second_x + 0x2C;
                }
                if (side == 0) {
                    hp_origin_y = first_y + 0xC;
                } else {
                    hp_origin_y = second_y + 0xC;
                }
                slot_index = 0;
                scenario_hp_pool = D_8019532C;
                army_hp_pool = D_80190EBC;
                for (; slot_index < 5; slot_index++) {
                    hp_member = squad->member_indices[slot_index];
                    draw_hp = 1;
                    if (hp_member != 0) {
                        s32 layer_slot;
                        s32 slots_before_layer;
                        if (side == 0) {
                            hp_formation_slot = 8 - squad->formation_slots[slot_index];
                        } else {
                            hp_formation_slot = squad->formation_slots[slot_index];
                        }
                        hp_member_index = hp_member;
                        if (hp_member_index >= 0x64U) {
                            if (formation->squad_source_index >= 0x1E) {
                                hp = scenario_hp_pool[hp_member_index];
                                max_hp = scenario_hp_pool[0x63];
                                soldier_has_hp = hp != 0;
                            } else {
                                hp = army_hp_pool[hp_member_index];
                                max_hp = army_hp_pool[0x63];
                                soldier_has_hp = hp != 0;
                            }
                            draw_hp &= -soldier_has_hp;
                        } else if (formation->squad_source_index >= 0x1E) {
                            hp = D_80195560[hp_member_index].hp;
                            max_hp = D_80195560[hp_member_index].max_hp;
                        } else {
                            hp = D_80193BC0[hp_member_index].record.hp;
                            max_hp = D_80193BC0[hp_member_index].record.max_hp;
                        }
                        hp_column_quotient = hp_formation_slot / 3;
                        hp_layer = hp_formation_slot / 9;
                        hp_column = hp_formation_slot - hp_column_quotient * 3;
                        slots_before_layer = hp_layer * 9;
                        /* Include the layer remainder in the horizontal phase for the HP pass too. */
                        do {
                            s32 x_after_column;
                            layer_slot = hp_formation_slot - slots_before_layer;
                            x_after_column = icon_x - hp_column * 0x13;
                            hp_row = layer_slot / 3;
                            hp_layer_displacement = hp_layer * 0xA;
                            hp_x = (x_after_column + hp_row * 0xA) + hp_layer_displacement;
                        } while (0);
                        hp_y = hp_origin_y + (hp_column * 6) + (hp_row * 0xF) + hp_layer_displacement;
                        if (slot_index == 0) {
                            lead_hp_x = hp_x + 0xC;
                            lead_hp_y = hp_y - 0x16;
                        }
                        if (draw_hp) {
                            displayed_hp = hp & 0xFFFF;
                            func_00209A74(hp_x, hp_y - 6, displayed_hp, max_hp);
                            if (displayed_hp != 0) {
                                func_00209CAC(hp_x, hp_y - 9, displayed_hp, -3);
                            }
                        }
                    }
                }
                if (squad->member_indices[0] != 0) {
                    CombatDrawCommand *rectangle;

                    lead_marker_commands = D_800E9BA0;
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xFD100000, (u32)D_801CFB38);
                    COMBAT_DRAW_PAIR(0xE8000000, 0);
                    COMBAT_DRAW_PAIR(palette_tile_command, 0x07000000);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF0000000, 0x0703C000);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xFD500000, (u32)D_801CFB58);
                    COMBAT_DRAW_PAIR(0xF5500000, 0x07000000);
                    COMBAT_DRAW_PAIR(0xE6000000, 0);
                    COMBAT_DRAW_PAIR(0xF3000000, 0x0704F800);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    COMBAT_DRAW_PAIR(0xF5400200, 0);
                    COMBAT_DRAW_PAIR(0xF2000000, 0x3C04C);
                    COMBAT_DRAW_PAIR(0xE7000000, 0);
                    {
                        u32 right_field;
                        u32 bottom_field;
                        u32 top_left;
                        s32 left;

                        lead_marker_right = lead_hp_x + 0xA;
                        right_field = (lead_marker_right * 4 &
                            ((s32) ~(s16)(lead_marker_right * 4) >> 31) & 0xFFC) << 12;
                        lead_marker_bottom = lead_hp_y + 9;
                        /* Include the left X capture so KMC reloads it before advancing the cursor. */
                        do {
                            s32 fixed_bottom = lead_marker_bottom * 4;
                            bottom_field = fixed_bottom & ((s32) ~(s16)fixed_bottom >> 31) & 0xFFC;
                            bottom_field |= 0xE4000000;
                            rectangle = D_800E9BA0;
                            rectangle->first = right_field | bottom_field;
                            left = lead_hp_x;
                            gTitleCardDisplayListCursor = rectangle + 1;
                            lead_marker_fixed_x = (s16)(left * 4);
                        } while (0);
                        top_left = ((left * 4 & ((s32) ~lead_marker_fixed_x >> 31) & 0xFFC) << 12);
                        {
                            s32 fixed_top = lead_hp_y * 4;
                            top_left |= fixed_top & ((s32) ~(s16)fixed_top >> 31) & 0xFFC;
                        }
                        lead_marker_texture_origin = rectangle + 1;
                        D_800E9BA0 = rectangle + 2;
                        rectangle->second = top_left;
                        lead_marker_texture_origin->first = 0xE1000000;
                    }
                    if (lead_marker_fixed_x < 0) {
                        lead_marker_s_offset = lead_marker_fixed_x * 8;
                        lead_marker_texture_word = (0 - (lead_marker_s_offset & (0 - (lead_marker_s_offset < 1)))) << 0x10;
                    } else {
                        lead_marker_texture_word = 0;
                    }
                    SECOND_AT(lead_marker_texture_origin, 0x4) = lead_marker_texture_word;
                    if ((s32)((u32)lead_hp_y << 2) < 0) {
                        lead_marker_t_offset = (s32)((u32)lead_hp_y << 0x12) >> 0xD;
                        SECOND_AT(lead_marker_texture_origin, 0x4) = (s32) (lead_marker_texture_word | ((0 - (lead_marker_t_offset & (0 - (lead_marker_t_offset < 1)))) & 0xFFFF));
                    }
                    lead_marker_finish_commands = gTitleCardDisplayListCursor;
                    gTitleCardDisplayListCursor = lead_marker_finish_commands + 1;
                    FIRST_AT(lead_marker_finish_commands, 0x0) = 0xF1000000;
                    SECOND_AT(lead_marker_finish_commands, 0x4) = 0x04000400;
                    gTitleCardDisplayListCursor = lead_marker_finish_commands + 2;
                    FIRST_AT(lead_marker_finish_commands, 0x8) = 0xE7000000;
                    SECOND_AT(lead_marker_finish_commands, 0xC) = 0;
                }
                hp_texture_disable_commands = gTitleCardDisplayListCursor;
                gTitleCardDisplayListCursor = hp_texture_disable_commands + 1;
                FIRST_AT(hp_texture_disable_commands, 0x0) = 0xD7000000;
                SECOND_AT(hp_texture_disable_commands, 0x4) = 0x80008000;
            }
        }
    }
}
