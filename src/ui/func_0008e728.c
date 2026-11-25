#include "game/display_list_cursor.h"
#include "game/character_record.h"

typedef struct StatPanelResources {
    u32 field_00;
    u32 image;
    u32 palette;
    u8 field_0c[0x93];
    u8 show_adjustment_delta;
} StatPanelResources;

extern u8 *D_80196AF8;
/* The RSP consumes this display-list address in segment 6. */
extern const CombatDrawCommand D_060047A0[];

extern void func_00087b30(s32 palette, s32 image, s32 width, s32 height, s32 mode);
extern void func_00087200(s32 x, s32 y, s32 label);
extern void func_000881dc(s32 adjustment_delta);
extern void func_000885a8(s32 x, s32 y, s32 value, s32 digits);
extern s32 func_00090e40(s32 value, s32 limit);
extern s16 func_000bd60c(s32 table_mode, s32 character_index, s32 stat_index);
extern s16 func_000bd4f4(s32 table_mode, s32 character_index, s32 stat_index);

/* Draw the six character stats and optionally mark equipment adjustment changes. */
void func_0008e728(s32 x, s32 y, u8 table_mode, s32 character_index)
{
    StatPanelResources *setup_resources = (StatPanelResources *)D_80196AF8;
    StatPanelResources *resources;
    CombatDrawCommand *commands;
    u32 load_block;
    u32 set_tile;
    u32 tile_size;
    u32 size_opcode;
    u32 image;
    u8 original_index = character_index;
    u8 selected_index;
    CharacterRecord *record;
    s32 comparison_x;

    func_00087b30(setup_resources->palette + 0x3A0, setup_resources->image + 0x2F48, 32, 48, 2);
    func_00087200(x, y - 1, 14);

    load_block = 0x073FF200;
    set_tile = 0xF5400800;
    commands = gTitleCardDisplayListCursor;
    resources = (StatPanelResources *)D_80196AF8;
    tile_size = 0x000FC0FC;
    commands[0].first = 0xDE000000;
    commands[0].second = (u32)D_060047A0;
    commands[1].first = 0xFD500000;
    image = resources->image;
    /* Preserve the intermediate display-list cursor updates. */
    gTitleCardDisplayListCursor = commands + 1;
    gTitleCardDisplayListCursor = commands + 2;
    gTitleCardDisplayListCursor = commands + 3;
    commands[2].first = 0xF5500000;
    commands[2].second = 0x07000000;
    gTitleCardDisplayListCursor = commands + 4;
    commands[3].first = 0xE6000000;
    gTitleCardDisplayListCursor = commands + 5;
    commands[4].first = 0xF3000000;
    gTitleCardDisplayListCursor = commands + 6;
    commands[5].first = 0xE7000000;
    gTitleCardDisplayListCursor = commands + 7;
    gTitleCardDisplayListCursor = commands + 8;
    /* Complete the texture-load packet in retail store order. */
    size_opcode = 0xF2000000;
    ((volatile CombatDrawCommand *)commands)[3].second = 0;
    ((volatile CombatDrawCommand *)commands)[4].second = load_block;
    ((volatile CombatDrawCommand *)commands)[5].second = 0;
    ((volatile CombatDrawCommand *)commands)[6].first = set_tile;
    ((volatile CombatDrawCommand *)commands)[6].second = 0;
    ((volatile CombatDrawCommand *)commands)[7].first = size_opcode;
    ((volatile CombatDrawCommand *)commands)[7].second = tile_size;
    commands[1].second = image + 0x948;

    if (original_index == 0xFF) {
        return;
    }
    /* Preserve the original byte while applying the retail row-zero fallback. */
    character_index &= -(original_index < 100);
    selected_index = character_index;
    if ((u8)table_mode == 0) {
        record = &D_80193BC0[(u8)selected_index].record;
    } else {
        record = &D_80195560[(u8)selected_index];
    }

    if (((StatPanelResources *)D_80196AF8)->show_adjustment_delta == 0) {
        s32 plain_x;
        s32 value;

        /* Keep the byte-to-word index conversion local to this draw path for KMC. */
        selected_index = (u8)selected_index;
        value = func_00090e40(record->strength + func_000bd60c((u8)table_mode, selected_index, 0), 999);
        plain_x = x + 24;
        func_000885a8(plain_x, y, value, -3);

        value = func_00090e40(record->vitality + func_000bd60c((u8)table_mode, selected_index, 1), 999);
        func_000885a8(plain_x, y + 8, value, -3);

        value = func_00090e40(record->intelligence + func_000bd60c((u8)table_mode, selected_index, 2), 999);
        func_000885a8(plain_x, y + 16, value, -3);

        value = func_00090e40(record->mentality + func_000bd60c((u8)table_mode, selected_index, 3), 999);
        func_000885a8(plain_x, y + 24, value, -3);

        value = func_00090e40(record->agility + func_000bd60c((u8)table_mode, selected_index, 4), 999);
        func_000885a8(plain_x, y + 32, value, -3);

        value = func_00090e40(record->dexterity + func_000bd60c((u8)table_mode, selected_index, 5), 999);
        func_000885a8(plain_x, y + 40, value, -3);
    } else {
        s16 adjustment;
        s32 value;

        /* Keep the byte-to-word index conversion local to this draw path for KMC. */
        selected_index = (u8)selected_index;
        adjustment = func_000bd60c((u8)table_mode, selected_index, 0);
        func_000881dc(func_000bd4f4((u8)table_mode, selected_index, 0) - adjustment);
        value = func_00090e40(record->strength + adjustment, 999);
        comparison_x = x + 24;
        func_000885a8(comparison_x, y, value, -3);

        adjustment = func_000bd60c((u8)table_mode, selected_index, 1);
        func_000881dc(func_000bd4f4((u8)table_mode, selected_index, 1) - adjustment);
        value = func_00090e40(record->vitality + adjustment, 999);
        func_000885a8(comparison_x, y + 8, value, -3);

        adjustment = func_000bd60c((u8)table_mode, selected_index, 2);
        func_000881dc(func_000bd4f4((u8)table_mode, selected_index, 2) - adjustment);
        value = func_00090e40(record->intelligence + adjustment, 999);
        func_000885a8(comparison_x, y + 16, value, -3);

        adjustment = func_000bd60c((u8)table_mode, selected_index, 3);
        func_000881dc(func_000bd4f4((u8)table_mode, selected_index, 3) - adjustment);
        value = func_00090e40(record->mentality + adjustment, 999);
        func_000885a8(comparison_x, y + 24, value, -3);

        adjustment = func_000bd60c((u8)table_mode, selected_index, 4);
        func_000881dc(func_000bd4f4((u8)table_mode, selected_index, 4) - adjustment);
        value = func_00090e40(record->agility + adjustment, 999);
        func_000885a8(comparison_x, y + 32, value, -3);

        adjustment = func_000bd60c((u8)table_mode, selected_index, 5);
        func_000881dc(func_000bd4f4((u8)table_mode, selected_index, 5) - adjustment);
        value = func_00090e40(record->dexterity + adjustment, 999);
        func_000885a8(comparison_x, y + 40, value, -3);
    }
}
