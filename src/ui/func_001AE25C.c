#include "game/character_display_records.h"
#include "game/character_record.h"
#include "game/combat_draw_commands.h"
#include "game/panel_constructor.h"
#include "game/unit_record_lookup.h"

typedef struct DisplayUnitRecord {
    u8 field_00[2];
    u8 unit_index;
    u8 field_03[6];
    u8 movement_type;
    u8 field_0A;
} DisplayUnitRecord;

extern DisplayUnitRecord D_801969B8[];

extern u16 D_8019532C[];
extern u8 D_80195480[];
extern u8 D_8021E383, D_8021E384, D_8021E385, D_8021E386;
extern u8 D_8021E1D9, D_8021E1DA, D_8021E1DB, D_8021E1DC, D_8021E1DD;
extern u8 D_8021E1DE, D_8021E1DF, D_8021E1E0, D_8021E1E1, D_8021E3E0;
extern s32 D_8021E374, D_8021E378;
extern u8 D_8021E1AC[], D_8021E1C4[];

extern Panel *D_801EB280;
extern s8 *D_801ED430, *D_801ED434, *D_801ED438;
extern s8 D_8021E31C[];
extern s32 D_801F3618, D_801ED5B0;

void func_0015DF10(u32 value);
u8 func_00043100(int primary_class_id, int secondary_class_id);
u16 D_801794C8(s8 *text);
s32 func_0005148c(void *record);
void func_001AE13C(Panel *panel, s32 pass);
void func_00052284(Panel *panel);
void func_00128E80(void);
int func_00129068(u8 *source_record);
u8 func_001291B4(u8 *record);
void func_00131B50(u16 item_id);
u32 func_0014F300(s32 source_word);
u8 func_8016C048(void);
void func_00023460(const void *source, void *destination, u32 bytes);

#define DRAW_X(x) COMBAT_DRAW_FIELD((u32)(x) << 2, 12, 12)
#define DRAW_Y(y) COMBAT_DRAW_FIELD((u32)(y) << 2, 0, 12)

static __inline__ void draw_marker_rectangle(CombatDrawCommand *draw, s32 x, s32 y)
{
    u32 packed_right_x = DRAW_X(x + 22);
    u32 packed_left_x = DRAW_X(x + 6);
    D_800E9BA0 = draw + 1;
    draw[0].first = 0xE7000000u;
    draw[0].second = 0;
    D_800E9BA0 = draw + 2;
    y -= D_8021E1E0;
    draw[1].first = packed_right_x | ((0xE4000000u | DRAW_Y(y + 10)) & 0xFF000FFFu);
    draw[1].second = packed_left_x | DRAW_Y(y - 6);
}

static __inline__ void draw_member_sprite(s32 position)
{
    s32 layer, row, column, x, y;
    register u32 sync;
    void *const *resources;

    layer = position / 9;
    row = (position % 9) / 3;
    sync = 0xE7000000u;
    resources = D_801EB290;
    COMBAT_DRAW_PAIR(sync, 0);
    COMBAT_DRAW_PAIR(0xE200001C, 0x00504240);
    COMBAT_DRAW_PAIR(0xFCFF9BFF, 0xFF34FE7F);
    COMBAT_DRAW_PAIR(0xE3001201, 0x00002000);
    COMBAT_DRAW_PAIR(0xE3001001, 0);
    COMBAT_DRAW_PAIR(0xFB000000, D_8021E1D9);
    COMBAT_DRAW_PAIR(0xFD100000, (u32)resources[D_8021E1DB]);
    COMBAT_DRAW_PAIR(0xF5100000, 0x07080200);
    column = position - (position / 3) * 3;
    x = row * 10 + 155;
    x -= column * 19;
    x += layer * 10;
    y = (column * 6 + 64) + row * 15;
    y += layer * 10;
    D_8021E374 = x;
    D_8021E378 = y;
    COMBAT_DRAW_PAIR(0xE6000000, 0);
    COMBAT_DRAW_PAIR(0xF3000000, 0x0737F125);
    COMBAT_DRAW_PAIR(sync, 0);
    COMBAT_DRAW_PAIR(0xF5100E00, 0x00080200);
    COMBAT_DRAW_PAIR(0xF2000000, 0x0006C07C);
    COMBAT_DRAW_PAIR(sync, 0);
    COMBAT_DRAW_PAIR(DRAW_X(x + 28) | ((0xE4000000u | DRAW_Y(y + 32)) & 0xFF000FFFu),
                     DRAW_X(x) | DRAW_Y(y));
    COMBAT_DRAW_PAIR(0xE1000000, 0);
    COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
    COMBAT_DRAW_PAIR(sync, 0);
    COMBAT_DRAW_PAIR(sync, 0);
}

/* Advance the group display, its selection marker and the selected member transfer. */
void func_001AE25C(void)
{
    s32 slot;
    const u16 *extended_hp;
    s32 position;

    slot = -1;
    while (++slot < 5) {
        u32 member_id;
        u32 status;
        extended_hp = D_8019532C;
        member_id = D_801971F2[D_8021E384].members[slot];
        if (member_id == 0) {
            continue;
        }
        if (member_id >= 100) {
            if (extended_hp[member_id] == 0) {
                continue;
            }
            status = D_80195480[member_id] & 4;
        } else {
            if (D_80195560[member_id].hp == 0) {
                continue;
            }
            status = D_80195560[member_id].status_flags & 4;
        }
        if (status == 0) {
            position = D_801971F2[D_8021E384].positions[slot];
            draw_member_sprite(position);
        }
    }

    if (D_8021E1DF == 1 && D_8021E1D9 == 32) {
        func_0015DF10(19);
    }
    if (++D_8021E1DC >= 4) {
        D_8021E1DC = 0;
        if (++D_8021E1DB >= 4) {
            D_8021E1DB = 0;
            if (++D_8021E1DF > 64) {
                D_8021E1DF = 64;
            }
        }
    }
    if ((D_8021E1DF >= 3 && D_8021E1DB >= 2) || D_8021E1DF >= 4) {
        if (D_8021E1D9 >= 16) {
            D_8021E1D9 -= 16;
        } else {
            D_8021E1D9 = 0;
        }
    } else if (D_8021E1DF != 0) {
        D_8021E1D9 = D_8021E1D9 < 240 ? D_8021E1D9 + 16 : 255;
    }

    if (D_8021E383 != 0) {
        if (D_8021E1DF >= 4) {
            s32 layer;
            s32 row;
            s32 column;
            s32 row_x;

            if (++D_8021E1DE >= D_8021E1AC[D_8021E1DD]) {
                ++D_8021E1DD;
                D_8021E1DE = 0;
                if (D_8021E1DD >= 20) {
                    D_8021E1DD = 20;
                }
            }
            position = D_801971F2[D_8021E384].positions[D_8021E385];
            layer = position / 9;
            row = (position % 9) / 3;
            row_x = row * 10 + 155;
            column = position - (position / 3) * 3;
            D_8021E374 = row_x - column * 19 + layer * 10;
            D_8021E378 = (column * 6 + 64) + row * 15 + layer * 10;

            COMBAT_DRAW_PAIR(0xFB000000, D_8021E1DA);
            COMBAT_DRAW_PAIR(0xFD180000, (u32)D_801EB290[D_8021E1C4[D_8021E1DD]]);
            COMBAT_DRAW_PAIR(0xF5180000, 0x07080200);
            COMBAT_DRAW_PAIR(0xE6000000, 0);
            COMBAT_DRAW_PAIR(0xF3000000, 0x070FF100);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            COMBAT_DRAW_PAIR(0xF5180800, 0x00080200);
            COMBAT_DRAW_PAIR(0xF2000000, 0x0003C03C);

            if (D_8021E1DD == 0) {
                D_8021E1E0 = 0;
            } else if (D_8021E1DD == 1) {
                D_8021E1E0 = 6;
            } else if (D_8021E1DD != 2) {
                if (D_8021E1DD == 3) {
                    D_8021E1E0 = 9;
                } else {
                    D_8021E1E0 = 8;
                }
            } else {
                D_8021E1E0 = 8;
            }
            draw_marker_rectangle(D_800E9BA0, D_8021E374, D_8021E378);
            COMBAT_DRAW_PAIR(0xE1000000, 0);
            COMBAT_DRAW_PAIR(0xF1000000, 0x04000400);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
            COMBAT_DRAW_PAIR(0xE7000000, 0);
        }
    } else if (D_8021E1DF >= 4) {
        D_8021E1DD = 20;
    }

    if (D_8021E1DD < 20) {
        return;
    }
    if (D_8021E1DA >= 24) {
        D_8021E1DA -= 24;
        return;
    }

    if (D_8021E3E0 == 0) {
        if (D_8021E1E1 >= 9) {
            D_8021E3E0 = 1;
            D_8021E1E1 = 0;
        } else {
            ++D_8021E1E1;
        }
        if (D_801EB280 == 0) {
            s32 width;
            s32 offset;
            if (D_8021E383 != 0) {
                u32 member_id = D_801971F2[D_8021E384].members[D_8021E385];
                s32 name_width = func_0005148c(&D_80195560[member_id]);
                u16 template_width = D_801794C8(D_801ED434);
                width = name_width + (template_width - D_801794C8(D_8021E31C));
                if (width < D_801794C8(D_801ED430)) {
                    width = D_801794C8(D_801ED430);
                }
                offset = 8;
            } else {
                width = D_801794C8(D_801ED438);
                offset = 0;
            }
            D_801EB280 = func_00051eb0(0, 0, func_001AE13C, 158,
                                      170 - offset, 162, 174 - offset,
                                      156 - width / 2, 162 - offset,
                                      164 + width / 2, (s16)((u32)offset * 2 + 182u) - offset);
        }
    } else if (D_8021E3E0 == 2) {
        if (D_8021E1E1 >= 7) {
            if (D_8021E383 != 0) {
                u32 group_index = D_8021E384;
                u8 member_id = D_801971F2[group_index].members[D_8021E385];
                s32 item_slot = func_0014F300(group_index);
                u8 equipped_items = func_00043100(D_80195560[member_id].primary_class_id,
                                                  D_80195560[member_id].secondary_class_id);
                u8 destination_status;
                CharacterRecord56 *destination;
                CharacterRecord *record;
                u32 class_id;
                DisplayUnit *unit;

                for (slot = 0; slot < equipped_items;) {
                    ++slot;
                    ((u8 *)&D_801971F2[D_8021E384])[(u8)item_slot + 0xA] = 0;
                    --item_slot;
                }
                {
                    u32 offset = sizeof(DisplayGroupRecord) * D_8021E384;
                    u8 *selected_members = (u8 *)D_801971F2 + offset;
                    u32 member_base = (u32)D_801971F2;
                    selected_members[D_8021E385] = 0;
                    D_80195560[member_id].status_flags &= 0x7F;
                    member_base -= 2;
                    D_801971F2[D_8021E384].movement_type =
                        func_00129068((u8 *)(sizeof(DisplayGroupRecord) * D_8021E384 + member_base));
                }
                {
                    u8 unit_group_index = D_8021E384;
                    unit = D_801F0CB0[unit_group_index];
                    unit->field_70 = D_801971F2[unit_group_index].movement_type;
                }
                if (unit->flags & 0x40) {
                    DisplayUnitRecord *record = &D_801969B8[func_0012E968(unit)];
                    record->movement_type = func_001291B4((u8 *)record);
                    record->field_0A = 11 - func_0012E8EC(D_801F0CB0[record->unit_index]);
                }
                class_id = D_80195560[member_id].primary_class_id;
                func_00131B50(g_func_0019554C_class_records[class_id].default_equipment_slot_0);
                func_00131B50(g_func_0019554C_class_records[class_id].default_equipment_slot_1);
                func_00131B50(g_func_0019554C_class_records[class_id].default_equipment_slot_2);
                func_00131B50(g_func_0019554C_class_records[class_id].default_equipment_slot_3);
                func_00131B50(D_80195560[member_id].equipment_slot_0);
                func_00131B50(D_80195560[member_id].equipment_slot_1);
                func_00131B50(D_80195560[member_id].equipment_slot_2);
                func_00131B50(D_80195560[member_id].equipment_slot_3);
                destination_status = func_8016C048();
                record = &D_80195560[member_id];
                destination = &D_80193BC0[D_8021E386];
                func_00023460(record, &destination->record, sizeof(CharacterRecord));
                destination->record.status_flags = 0;
                destination->experience = 0;
                destination->field_36 = 0;
                destination->field_37 = 0;
                destination->field_34 = destination_status;
                func_00128E80();
            }
            D_8021E1DA = 255;
            D_8021E1E0 = 1;
            D_8021E1D9 = 0;
            D_8021E1DB = 0;
            D_8021E1DC = 0;
            D_8021E1DD = 0;
            D_8021E1DE = 0;
            D_8021E1DF = 0;
            D_8021E1E1 = 0;
            D_8021E3E0 = 3;
        } else {
            ++D_8021E1E1;
        }
        {
            Panel **dialog = &D_801EB280;
            if (*dialog == 0) {
                return;
            }
            func_00052284(*dialog);
            *dialog = 0;
            D_801F3618 = -1;
            D_801ED5B0 = -1;
        }
    }
}
