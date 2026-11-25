#include "game/character_record.h"
#include "game/combat_draw_commands.h"
#include "game/scenario_formation_display.h"

extern const u8 D_801A79E8[];
extern const u16 D_801A7964[];
extern u8 D_801A8228;
extern u8 D_8018ECE4[][6];

void func_00083610(s32 x, s32 y, u16 image);
u8 func_00040FF4(u8 alternate, u8 target);
u8 func_00043d1c(int primary_class_id, int secondary_class_id);
int func_00043e18(int primary_class_id, int secondary_class_id);

#define FORMATION_CLIP4(value) (((u32)(value) << 2) & \
    (u32)(~(s32)(s16)((u32)(value) << 2) >> 31) & 0xFFCu)

/* Emit screen bounds and the texture origin correction for negative coordinates. */
#define FORMATION_RECTANGLE(left, top, right, bottom) { \
    CombatDrawCommand *rectangle = D_800E9BA0++; \
    CombatDrawCommand *texture_origin; \
    s32 clipped_x = (s16)((u32)(left) << 2); \
    s32 scaled_top; \
    u32 origin_word; \
    rectangle->first = (FORMATION_CLIP4(right) << 12) | \
        ((FORMATION_CLIP4(bottom) | 0xE4000000u) & 0xFF000FFFu); \
    rectangle->second = (FORMATION_CLIP4(left) << 12) | FORMATION_CLIP4(top); \
    texture_origin = D_800E9BA0++; \
    texture_origin->first = 0xE1000000u; \
    if (clipped_x < 0) { \
        s32 scaled = clipped_x * 8; \
        scaled &= -(scaled < 1); \
        origin_word = (0u - (u32)scaled) << 16; \
    } else { \
        origin_word = 0; \
    } \
    texture_origin->second = origin_word; \
    scaled_top = (s32)((u32)(top) << 2); \
    if (scaled_top < 0) { \
        s32 scaled = (s32)((u32)(top) << 18) >> 13; \
        scaled &= -(scaled < 1); \
        texture_origin->second = origin_word | (u16)(0u - (u32)scaled); \
    } \
}

#define FORMATION_RECTANGLE_END() \
    COMBAT_DRAW_PAIR(0xF1000000u, 0x04000400u) \
    COMBAT_DRAW_PAIR(0xE7000000u, 0)

#define FORMATION_PALETTE(image, load_end) \
    COMBAT_DRAW_PAIR(0xFD100000u, (u32)(image)) \
    FORMATION_PALETTE_TAIL(load_end)

#define FORMATION_PALETTE_TAIL(load_end) \
    COMBAT_DRAW_PAIR(0xE8000000u, 0) \
    COMBAT_DRAW_PAIR(0xF5000100u, 0x07000000u) \
    COMBAT_DRAW_PAIR(0xE6000000u, 0) \
    COMBAT_DRAW_PAIR(0xF0000000u, (load_end)) \
    COMBAT_DRAW_PAIR(0xE7000000u, 0)

#define FORMATION_TEXTURE(image, load_tile, load_size, render_header, render_tile, render_size) \
    COMBAT_DRAW_PAIR(0xFD500000u, (u32)(image)) \
    COMBAT_DRAW_PAIR(0xF5500000u, (load_tile)) \
    COMBAT_DRAW_PAIR(0xE6000000u, 0) \
    COMBAT_DRAW_PAIR(0xF3000000u, (load_size)) \
    COMBAT_DRAW_PAIR(0xE7000000u, 0) \
    COMBAT_DRAW_PAIR((render_header), (render_tile)) \
    COMBAT_DRAW_PAIR(0xF2000000u, (render_size))

#define FORMATION_BACKGROUND(image, x, y) \
    FORMATION_TEXTURE((image), 0x07000000u, 0x073EF0ABu, \
                      0xF5481800u, 0, 0x0017C050u) \
    COMBAT_DRAW_PAIR(0xE7000000u, 0) \
    FORMATION_RECTANGLE((x), (y), ((x) + 96), ((y) + 21)) \
    FORMATION_RECTANGLE_END()

/* Draw the formation background, index masks, and the five member sprites. */
void func_00083c5c(s32 x, s32 y)
{
    FormationDisplayState *display;
    const Func001957D0SourceRecord *source_record;
    s32 index;
    /* The halfword count preserves the compiler scheduling of the cell setup. */
    s16 palette_colors;
    u32 alternate;
    CombatDrawCommand *initial_command;

    initial_command = D_800E9BA0++;
    display = D_801A7960;
    initial_command->first = 0xDE000000u;
    initial_command->second = (u32)D_801A79E8;
    source_record = display->source_record;
    COMBAT_DRAW_PAIR(0xD7000002u, 0x80008000u)
    FORMATION_PALETTE(display->background_image, 0x073FC000u)
    FORMATION_BACKGROUND(display->background_image + 0x300, x, y)
    y += 21;
    FORMATION_BACKGROUND(D_801A7960->background_image + 0xAE0, x, y)
    y += 21;
    FORMATION_BACKGROUND(D_801A7960->background_image + 0x12C0, x, y)

    FORMATION_TEXTURE(D_801A7960->cell_image, 0x07000000u, 0x073FF400u,
                      0xF5400400u, 0, 0x0007C1FCu)
    x += 36;
    y -= 32;
    index = 0;
    palette_colors = 16;
    for (; index < 15; index++) {
        if (index < 6 || index > 8) {
            s32 column;
            s32 column_quotient;
            s32 row;
            s32 layer;
            s32 palette_offset;
            s32 cell_x;
            s32 projected_x;
            s32 projected_y;
            s32 cell_y;
            CombatDrawCommand *palette_command;

            /* Keep the variable palette offset multiplication in the native loop. */
            goto *&&cell_palette;
cell_palette:
            column_quotient = index / 3;
            layer = index / 9;
            palette_command = D_800E9BA0++;
            palette_command->first = 0xFD100000u;
            palette_offset = (index & 1) * palette_colors;
            COMBAT_DRAW_PAIR(0xE8000000u, 0)
            COMBAT_DRAW_PAIR(0xF5000100u, 0x07000000u)
            COMBAT_DRAW_PAIR(0xE6000000u, 0)
            column = index - column_quotient * 3;
            projected_x = x - column * 19;
            palette_command->second = (u32)(D_801A7964 + palette_offset);
            COMBAT_DRAW_PAIR(0xF0000000u, 0x0703C000u)
            row = (index - layer * 9) / 3;
            COMBAT_DRAW_PAIR(0xE7000000u, 0)
            cell_x = projected_x + row * 10 + layer * 10;
            projected_y = column * 6;
            projected_y -= 12;
            cell_y = y + projected_y + row * 15 + layer * 10;
            switch (display->cell_flags[index]) {
            case 15:
                func_00083610(cell_x, cell_y, 0);
                break;
            case 11:
                func_00083610(cell_x, cell_y, 7);
                break;
            case 10:
                func_00083610(cell_x, cell_y, 4);
                break;
            case 7:
                func_00083610(cell_x, cell_y, 6);
                break;
            case 5:
                func_00083610(cell_x, cell_y, 5);
                break;
            case 3:
                func_00083610(cell_x, cell_y, 1);
                break;
            case 2:
                func_00083610(cell_x, cell_y, 2);
                break;
            case 1:
                func_00083610(cell_x, cell_y, 3);
                break;
            }
        }
    }

    /* Address-taken labels retain the retail zero-mode tests. The compiler
     * removes each computed jump to the immediately following statement. */
    alternate = 0;
    COMBAT_DRAW_PAIR(0xD7000000u, 0x80008000u)
    for (index = 0; index < 5; index++) {
        u32 member_id = source_record->field_02[index];
        u8 tile_index;
        if (member_id != 0) {
            s32 position = 8 - source_record->field_07[index];
            s32 column_quotient = position / 3;
            s32 column = position - column_quotient * 3;
            s32 member_x = x + 8;
            s32 projected_x = member_x - column * 19;
            s32 layer = position / 9;
            s32 row = position - layer * 9;
            s32 projected_y;
            s32 member_y;

            row /= 3;
            member_x = projected_x + row * 10 + layer * 10;
            projected_y = y + column * 6 + row * 15;
            member_y = projected_y + layer * 10;

            if (member_id >= 100) {
                u8 sprite = func_00040FF4(D_801A8228, member_id);
                if (sprite != 0) {
                    CombatDrawCommand *sync = D_800E9BA0++;
                    FormationDisplayState *sprite_display = D_801A7960;
                    CombatDrawCommand *palette_command;
                    u32 palette;

                    sync->first = 0xE7000000u;
                    sync->second = 0;
                    palette_command = D_800E9BA0++;
                    palette_command->first = 0xFD100000u;
                    palette = sprite_display->member_image_14;
                    tile_index = sprite - 1;
                    goto *&&palette_mode_1;
palette_mode_1:
                    if (alternate == 0) {
                        palette += 0x200;
                    }
                    palette_command->second = palette;
                    FORMATION_PALETTE_TAIL(0x073FC000u)
                    COMBAT_DRAW_PAIR(0xD7000002u, 0x80008000u)
                    {
                        s32 image_offset = tile_index * 0x180 + 0x400;
                        FORMATION_TEXTURE(sprite_display->member_image_14 + image_offset,
                                          0x07080200u, 0x070BF400u,
                                          0xF5480400u, 0x00080200u, 0x0003C05Cu)
                    }
                    COMBAT_DRAW_PAIR(0xE7000000u, 0)
                    FORMATION_RECTANGLE(member_x, member_y - 24, member_x + 16, member_y)
                    FORMATION_RECTANGLE_END()
                }
            } else {
                u8 primary_class;
                u8 secondary_class;
                u8 member_size;

                {
                    goto *&&palette_mode_2;
palette_mode_2:
                    if (alternate != 0) {
                        primary_class = D_80195560[member_id].primary_class_id;
                        secondary_class = D_80195560[member_id].secondary_class_id;
                    } else {
                        primary_class = D_80193BC0[member_id].record.primary_class_id;
                        secondary_class = D_80193BC0[member_id].record.secondary_class_id;
                    }
                }
                member_size = func_00043d1c(primary_class, secondary_class);
                tile_index = func_00043e18(primary_class, secondary_class);
                COMBAT_DRAW_PAIR(0xE7000000u, 0)
                switch (member_size) {
                case 1: {
                    u32 image;
                    u32 palette;
                    CombatDrawCommand *palette_command;
                    if (D_8018ECE4[primary_class][0] & 0x80) {
                        image = D_801A7960->member_image_1C;
                    } else {
                        image = D_801A7960->member_image_14;
                    }
                    palette_command = D_800E9BA0++;
                    palette_command->first = 0xFD100000u;
                    palette = image;
                    goto *&&palette_mode_3;
palette_mode_3:
                    if (alternate == 0) {
                        palette += 0x200;
                    }
                    palette_command->second = palette;
                    FORMATION_PALETTE_TAIL(0x073FC000u)
                    {
                        s32 image_offset = tile_index * 0x180 + 0x400;
                        FORMATION_TEXTURE(image + image_offset,
                                          0x07080200u, 0x070BF400u,
                                          0xF5480400u, 0x00080200u, 0x0003C05Cu)
                    }
                    COMBAT_DRAW_PAIR(0xE7000000u, 0)
                    FORMATION_RECTANGLE(member_x, member_y - 24, member_x + 16, member_y)
                    FORMATION_RECTANGLE_END()
                    break;
                }
                case 2: {
                    CombatDrawCommand *sync = D_800E9BA0++;
                    FormationDisplayState *sprite_display = D_801A7960;
                    CombatDrawCommand *palette_command;
                    u32 palette;

                    sync->first = 0xE7000000u;
                    sync->second = 0;
                    palette_command = D_800E9BA0++;
                    palette_command->first = 0xFD100000u;
                    palette = sprite_display->member_image_18;
                    goto *&&palette_mode_4;
palette_mode_4:
                    if (alternate == 0) {
                        palette += 0x200;
                    }
                    palette_command->second = palette;
                    FORMATION_PALETTE_TAIL(0x073FC000u)
                    {
                        s32 image_offset = tile_index * 0x380 + 0x400;
                        FORMATION_TEXTURE(sprite_display->member_image_18 + image_offset,
                                          0x07000000u, 0x071BF200u,
                                          0xF5480800u, 0, 0x0007C06Cu)
                    }
                    COMBAT_DRAW_PAIR(0xE7000000u, 0)
                    FORMATION_RECTANGLE(member_x - 8, member_y - 28, member_x + 24, member_y)
                    FORMATION_RECTANGLE_END()
                    break;
                }
                }
            }
        }
    }
}
