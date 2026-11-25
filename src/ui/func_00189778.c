#include "game/display_list_cursor.h"
#include "game/character_display_records.h"
#include "game/character_display_members.h"
#include "game/character_record.h"
#include "game/scenario_source_record.h"

typedef struct {
    u8 field00;
    u8 field01;
    u8 field02[10];
} DescriptionEntry;

typedef struct InputRecord { u8 bytes[16]; } InputRecord;
typedef union {
    u16 entries[157];
    struct { u16 maximum; s16 values[156]; } pool;
} ScenarioPoolView;

extern const InputRecord D_8018AA80[];
extern ScenarioPoolView D_80190F82;
extern u16 D_801953F2, D_801F36BC;

extern CombatDrawCommand D_801EB1D0[];
/* Both names bind the display-list cursor at 0x800E9BA0.
 * Explicit cursor stores retain their ordering. The palette packet uses normal postfix increments.
 */

extern u8 *D_801F0B90, *D_801F36C0;
extern u8 D_8018F481, D_801F36A0, D_8021B56D, D_8021B571, D_8021B572, D_8021B573;
extern s32 D_801F401C;
extern u8 D_80213EA4[];
extern u16 D_80190EBC[], D_8019532C[];

extern u8 D_801E8564[];

extern u8 D_80210D80[];
extern u8 D_80210AF8[];
extern u8 D_802113D8[];
extern u8 D_802110B0[];
extern u8 D_80211508[];
extern u8 D_80211400[];
extern u8 D_801EC740[];
extern u8 D_801EC760[];

#define FIELD(base, type, offset) (*(type)((u8 *)(base) + (offset)))

extern u8 func_00043100(s32, s32);
extern u8 func_00043ad8(s32, s32);
extern u8 func_00043dc4(s32, s32);
extern const u8 * func_000440dc(s32, s32);
extern s32 func_00044130(s32, s32, s32);
extern s32 func_00044238(s32, s32, s32);
extern char * func_00044340(s32);
extern s32 func_00044358(s32);
extern u8 func_0004440c(u8 *, s32, s32, s32, u8, u16, u16, u16, u16);
extern void func_0004ef34(void *, s32, s32);
extern void func_000523b4(s32);
extern Panel * func_00055308(void);
extern s32 func_0012DA10(void *);
extern s32 func_0012DA9C(void *);
extern void func_00151318(s32, s32, s32, s32);
extern void func_001518FC(u8, s32, s32);
extern void func_00151F40(s32, s32, s32);
extern void func_001520E0(void *, void *, u16, u16, u16);
extern void func_00152448(u32);
/* The assembly stat readers consume the low byte of the member index word. */
extern u16 func_001526AC(u8 pool, s32 member_index);
extern u16 func_00152930(u8 pool, s32 member_index);
extern u16 func_00152FBC(u8, u8, u8);
extern u16 func_001532B0(u8, u8, u8);
extern u16 func_001535A4(u8, u8, u8);
extern void func_0015394C(void);
extern void func_001539B0(void);
extern void func_00153A14(s32, s32, u16, u16);
extern void func_00153A98(s32, s32);
extern void func_00153ADC(s32, s32, s32);
extern void func_00153CE0(s32, s32, u8);
extern void func_00153F80(s32, s32, u8);
extern void func_001540C4(s32, s32, u8);
extern void func_001541C0(s32, s32, u8, s32);
extern void func_00154694(s32, s32, u8);
extern void func_001546C8(s32, s32, s32, s32);
extern void func_00154F0C(s32, s32, s32);
extern void func_0015E380(u8);
extern void func_00188B60(s32, s32, s32, s32, s32, s32);

static inline float get_fatigue_scale(u8 index, u8 pool)
{
    const CharacterRecord *record;
    u32 fatigue;

    if (pool == 0) {
        record = &D_80193BC0[index].record;
    } else {
        record = &D_80195560[(u8)index];
    }
    if ((u32)index >= 100U || ((fatigue = record->fatigue) < 70U)) {
        return 1.0f;
    }
    if (fatigue < 80U) {
        return 0.8f;
    }
    if (fatigue < 90U) {
        return 0.75f;
    }
    return 0.5f;
}

/* Draw the selected squad member in its character display panel. */
void func_00189778(Panel *panel, s32 slot)
{
    u8 action_id;
    s32 panel_slot;
    s32 position_state;
    s32 squad_member_slot;
    s32 secondary_class;
    u8 leader_class_is_21;
    float stat_multiplier;
    float position_multiplier;
    s32 icon_fade;
    Panel **panel_cursor;
    s32 clip_left, clip_fade;
    s32 notice_counter_visible;
    s32 notice_x, notice_right;
    s32 action_position_value;
    s32 position_bonus;
    s32 class_icon_id;
    s32 fatigue_bar_height;
    void *squad;
    u16 second_stat;
    s32 army_detail_left;
    s32 army_detail_top;
    u32 icon_palette_base;
    u32 icon_palette_address;
    s32 action_kind;
    s32 army_detail_bottom;
    u16 first_stat;
    s32 stat_member;
    s32 record_pool;
    s32 panel_x;
    s32 panel_y;
    u32 texture_data_word;
    s32 fallback_index;
    u32 scenario_index;
    s32 decoded_action_kind;
    s32 scissor_top;
    s32 description_member;
    u8 description_pool_flags;
    s32 description_pool_index;
    s32 scissor_right;
    s32 scissor_bottom;
    s32 position_frame_left;
    s32 texture_origin_s_word;
    s32 action_icon_x;
    s32 position_stat_x;
    s32 position_value_x;
    s32 fatigue_frame_left;
    s32 fatigue_fill_left;
    s32 scissor_right_word;
    s32 notice_mark_left;
    u8 description_selector;
    s32 detail_x;
    s32 level_x;
    s32 hp_x;
    s32 hp_label_x;
    s32 first_stat_frame_left;
    s32 second_stat_frame_left;
    s32 first_stat_pool;
    s32 first_stat_x;
    s32 second_stat_x;
    s32 position_frame_top;
    s32 action_icon_y;
    s32 position_stat_y;
    s32 position_value_y;
    s32 action_label_x;
    s32 texture_edge_y;
    s32 alignment_icon_y;
    s32 fatigue_frame_top;
    s32 class_icon_y;
    s32 notice_top;
    s32 notice_mark_top;
    s32 element_icon_y;
    s32 status_alignment_y;
    s32 hp_y;
    s32 name_x;
    s32 class_name_x;
    s32 first_stat_frame_top;
    s32 second_stat_frame_top;
    s32 first_stat_y;
    s32 second_stat_y;
    s32 position_frame_right;
    s32 action_label_y;
    s32 fatigue_frame_right;
    s32 bar_y;
    s32 fatigue_fill_right;
    s32 notice_mark_right;
    s32 detail_right;
    s32 detail_y;
    s32 level_y;
    s32 name_y;
    s32 class_name_y;
    s32 first_stat_frame_right;
    s32 second_stat_frame_right;
    s32 position_frame_bottom;
    s32 texture_end_y;
    s32 texture_edge_end_y;
    s32 fatigue_frame_bottom;
    s32 fatigue_fill_bottom;
    s32 notice_bottom;
    s32 notice_mark_bottom;
    s32 first_stat_frame_bottom;
    s32 second_stat_frame_bottom;
    s32 position_stat;
    s32 position_kind;
    s32 fatigue_tile_offset;
    s32 stat_pool_byte;
    s32 member_index;
    s32 panel_index;
    s32 texture_y;
    s32 texture_x, texture_end_x, texture_edge_x;
    u32 texture_command_word;
    s32 icon_fade_color;
    u32 rectangle_word;
    s32 lower_edge_x;
    s32 lower_edge_y;
    u32 texture_work;
    char *action_label;
    s32 fatigue_fill_start;
    s32 scissor_end_word;
    const u8 *display_label;
    u32 rectangle_work;
    u32 lower_edge_word;
    s32 texture_origin_x;
    s32 texture_origin_y;
    u32 scissor_work;
    u16 current_hp;
    u16 maximum_hp;
    u32 notice_counter;
    s32 notice_counter_running;
    s32 show_notice;
    u8 army_action;
    u8 scenario_action;
    u8 description_counter;
    u8 squad_index;
    u8 description_flags;
    u8 icon_alignment;
    u8 icon_element;
    u8 status_alignment;
    u8 displayed_level;
    u8 primary_class;
    u8 fatigue_percent;
    u8 fatigue_for_height;
    s32 leader_class;
    CombatDrawCommand *fade_commands;
    void *fade_panel;
    CombatDrawCommand *fade_color_cursor, *fade_color_command;
    CombatDrawCommand *icon_bank_commands;
    CombatDrawCommand *rectangle_start;
    CombatDrawCommand *texture_command;
    CombatDrawCommand *stat_texture;
    CombatDrawCommand *indexed_texture;
    CombatDrawCommand *fatigue_texture;
    CombatDrawCommand *scissor_packet;
    CombatDrawCommand *initial_cursor;
    CombatDrawCommand *texture_commands;
    CombatDrawCommand *position_texture;
    CombatDrawCommand *rectangle_command;
    CombatDrawCommand *clipped_rectangle_tail;
    CombatDrawCommand *extended_draw_sync;
    CombatDrawCommand *scissor_command;
    CombatDrawCommand *description_draw_sync;
    CombatDrawCommand *description_draw_packet;
    CombatDrawCommand *indicator_packet;

    panel_slot = slot;
    fade_panel = (void *)((u32)slot * 2 + (u32)panel);
    position_state = 0;
    squad_member_slot = 0;
    member_index = 0;
    leader_class_is_21 = 0;
    if (FIELD(fade_panel, s16 *, 0x18) != 0) {
        s32 fade;

        panel_x = panel->field2C;
        panel_y = panel->field30;
        initial_cursor = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        initial_cursor->first = 0xE7000000;
        initial_cursor->second = 0;
        fade = FIELD(fade_panel, s16 *, 0x18);
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(initial_cursor + 1);
        func_000523b4(fade);
        panel_index = 0;
        panel_cursor = D_8021B470.panels;
        do {
            if (panel == *panel_cursor) {
                goto member_found;
            }
            panel_index++;
            panel_cursor++;
        } while (panel_index < 5);

load_squad:
        squad_index = D_8021B573;
        record_pool = squad_index >= 30U;
        squad = D_801F0CB0[squad_index];
        if (record_pool == 0) {
            goto check_first_pool;
        }
        if (func_0012DA10(squad) == 0 || func_0012DA9C(squad) != 0) {
            goto select_record;
        }
        leader_class = D_80195560[g_func_001957D0_source_records[D_8021B573].field_02[0]].secondary_class_id;
        goto check_leader_class;

member_found:
        member_index = D_8021B470.member_indices[panel_index];
        squad_member_slot = panel_index;
        position_state = g_func_001957D0_source_records[D_8021B573].field_07[panel_index];
        goto load_squad;

check_first_pool:
        if (func_0012DA10(squad) == 0 || func_0012DA9C(squad) != 0) {
            goto select_record;
        }
        leader_class = D_80193BC0[g_func_001957D0_source_records[D_8021B573].field_02[0]].record.secondary_class_id;

check_leader_class:
        if (leader_class == 0x21) {
            leader_class_is_21 = 1;
        }

select_record:
        if (member_index >= 100) {
            secondary_class = 1;
            primary_class = 1;
        } else if (record_pool == 0) {
            primary_class = D_80193BC0[member_index].record.primary_class_id;
            secondary_class = (s32) D_80193BC0[member_index].record.secondary_class_id;
        } else {
            primary_class = D_80195560[member_index].primary_class_id;
            secondary_class = (s32) D_80195560[member_index].secondary_class_id;
        }
        D_801F401C = member_index;
        D_801F36A0 = record_pool | (D_8021B572 * 2);
        if (func_00043dc4(primary_class, secondary_class) & 0xFF) {
            D_801F36A0 = (u8) (D_801F36A0 | 4);
        }
        if (member_index < 100) {
            s32 icon_x;
            s32 class_icon_x;
            s32 element_icon_x;
            s32 status_alignment_x;

            icon_x = panel_x + 0x20;

            if (record_pool == 0) {
                alignment_icon_y = panel_y + 0xC;
            } else {
                alignment_icon_y = panel_y + 2;
            }
            if (record_pool == 0) {
                icon_alignment = D_80193BC0[member_index].record.alignment;
            } else {
                icon_alignment = D_80195560[member_index].alignment;
            }
            func_00153F80(icon_x, alignment_icon_y, icon_alignment);
            class_icon_id = func_00043dc4(primary_class, secondary_class) & 0xFF;
            class_icon_x = panel_x + 5;
            if (record_pool == 0) {
                class_icon_y = panel_y + 0xC;
            } else {
                class_icon_y = panel_y + 2;
            }
            func_00153CE0(class_icon_x, class_icon_y, class_icon_id);
            element_icon_x = panel_x + 0x10;
            if (record_pool == 0) {
                element_icon_y = panel_y + 0xC;
            } else {
                element_icon_y = panel_y + 2;
            }
            if (record_pool == 0) {
                icon_element = D_80193BC0[member_index].record.element;
            } else {
                icon_element = D_80195560[member_index].element;
            }
            func_00153ADC(element_icon_x, element_icon_y, icon_element);
            func_0015394C();
            status_alignment_x = panel_x + 0x20;
            if (record_pool == 0) {
                status_alignment_y = panel_y + 0xC;
            } else {
                status_alignment_y = panel_y + 2;
            }
            if (record_pool == 0) {
                status_alignment = D_80193BC0[member_index].record.alignment;
            } else {
                status_alignment = D_80195560[member_index].alignment;
            }
            func_001540C4(status_alignment_x, status_alignment_y, status_alignment);
            detail_x = panel_x + 0x50;
            if (record_pool != 0) {
                goto draw_detail_right;
            }
            {
                if (member_index != 0) {
                    army_detail_left = panel_x + 5;
                    goto draw_army_rows;
                }
                army_detail_left = panel_x + 5;
draw_army_rows:
                army_detail_top = panel_y + 2;
                army_detail_bottom = panel_y + 9;
                func_00188B60(army_detail_left, army_detail_top, panel_x + 0x14, army_detail_bottom, 0x18, 0x1B);
                func_00151318(panel_x + 0x16, army_detail_top, D_80193BC0[member_index].field_34, 2);
                func_00188B60(panel_x + 0x5C, army_detail_top, panel_x + 0x6D, army_detail_bottom, 0x23, 8);
                func_00151318(panel_x + 0x70, army_detail_top, D_80193BC0[member_index].experience, 0);
                func_00151318(panel_x + 0x90, army_detail_top, func_00043100(D_80193BC0[member_index].record.primary_class_id, D_80193BC0[member_index].record.secondary_class_id) & 0xFF, 1);
            }
            detail_x = panel_x + 0x50;
            if (record_pool == 0) {
                detail_x = panel_x + 0x39;
            }
draw_detail_right:
            detail_y = panel_y + 2;
            if (record_pool == 0) {
                detail_right = panel_x + 0x47;
            } else {
                detail_right = panel_x + 0x5E;
            }
            func_00188B60(detail_x, detail_y, detail_right, panel_y + 9, 0x14, 8);
            level_x = panel_x + 0x5F;
            if (record_pool == 0) {
                level_x = panel_x + 0x48;
            }
            level_y = panel_y + 2;
            if (record_pool == 0) {
                displayed_level = D_80193BC0[member_index].record.level;
            } else {
                displayed_level = D_80195560[member_index].level;
            }
            func_00151318(level_x, level_y, displayed_level, 2);
            if (D_8021B572 == 1) {
                hp_x = panel_x + 0xA6;
                if (record_pool != 0) {
                    hp_x = panel_x + 0x7B;
                }
                hp_y = panel_y + 2;
                if (record_pool == 0) {
                    current_hp = D_80193BC0[member_index].record.hp;
                } else {
                    current_hp = D_80195560[member_index].hp;
                }
                if (record_pool == 0) {
                    maximum_hp = D_80193BC0[member_index].record.max_hp;
                } else {
                    maximum_hp = D_80195560[member_index].max_hp;
                }
                goto block_74;
            }
            goto block_75;
        }
        func_0015394C();
        if (record_pool == 0) {
            func_00151318(panel_x + 0x90, panel_y + 2, 1U, 1);
        }
        if (D_8021B572 == 1) {
            hp_x = panel_x + 0xA6;
            if (record_pool != 0) {
                hp_x = panel_x + 0x7B;
            }
            hp_y = panel_y + 2;
            if (record_pool == 0) {
                current_hp = D_80190EBC[member_index];
            } else {
                current_hp = D_8019532C[member_index];
            }
            if (record_pool == 0) {
                maximum_hp = D_80190F82.pool.maximum;
            } else {
                maximum_hp = D_801953F2;
            }
block_74:
            func_00153A14(hp_x, hp_y, current_hp, maximum_hp);
            if (record_pool != 0) {
                goto select_member_display_name;
            }
            goto upload_class_indicator;
        } else {
block_75:
            hp_label_x = panel_x + 0xA6;
            if (record_pool != 0) {
                hp_label_x = panel_x + 0x7B;
            }
            func_00153A98(hp_label_x, panel_y + 2);
        }
        if (record_pool != 0) {
            goto select_member_display_name;
        }
upload_class_indicator:
        {
            void *texture_destination = D_801F36C0 + 0x2E0;
            void *texture_source = D_801F0B90 + 0x27A8;

            indicator_packet = (CombatDrawCommand *)gTitleCardDisplayListCursor;
            gTitleCardDisplayListCursor = (CombatDrawCommand *)(indicator_packet + 1);
            indicator_packet[0].first = 0xE7000000;
            gTitleCardDisplayListCursor = (CombatDrawCommand *)(indicator_packet + 2);
            indicator_packet[0].second = 0;
            indicator_packet[1].first = 0xD7000002;
            indicator_packet[1].second = 0x80008000;
            func_001520E0(texture_destination, texture_source, 0x10, 8, 2);
            func_00151F40(panel_x + 0x86, panel_y + 1, 0x47);
            if (record_pool == 0) {
                func_001518FC((func_00043ad8(primary_class, secondary_class) - 1) & 0xFF, panel_x + 0xCF, panel_y + 0x3E);
            }
        }
select_member_display_name:
        if (member_index >= 100) {
            display_label = &D_8021B470.fallback_label_start;
        } else if (record_pool == 0) {
            display_label = D_80193BC0[member_index].record.name;
        } else {
            if (D_8018F481 == 0x26 && ((D_8021B573 == 30) & (primary_class == 0x9C)) && D_8021B572 == 0) {
                display_label = D_801E8564;
            } else {
                display_label = D_80195560[member_index].name;
            }
        }
        name_x = panel_x + 0x34;
        if (record_pool == 0) {
            name_x = panel_x + 0x37;
        }
        name_y = panel_y + 0x14;
        if (record_pool == 0) {
            name_y = panel_y + 0xC;
        }
        func_0004ef34((void *)display_label, name_x, name_y);
        if (member_index >= 0x64) {
            display_label = &D_8021B470.fallback_class_label_start;
        } else {
            display_label = func_000440dc(primary_class, secondary_class);
        }
        class_name_x = panel_x + 0x34;
        if (record_pool == 0) {
            class_name_x = panel_x + 0x94;
        }
        class_name_y = panel_y + 0x24;
        if (record_pool == 0) {
            class_name_y = panel_y + 0xC;
        }
        func_0004ef34((void *)display_label, class_name_x, class_name_y);
        texture_commands = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 1);
        texture_commands[0].first = 0xE7000000;
        texture_commands[0].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 2);
        texture_commands[1].first = 0xE3001001;
        texture_commands[1].second = 0x8000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 3);
        texture_commands[2].first = 0xFD100000;
        texture_commands[2].second = (u32)D_80210D80;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 4);
        texture_commands[3].first = 0xE8000000;
        texture_commands[3].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 5);
        texture_commands[4].first = 0xF5000100;
        texture_commands[4].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 6);
        texture_commands[5].first = 0xE6000000;
        texture_commands[5].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 7);
        texture_commands[6].first = 0xF0000000;
        texture_commands[6].second = 0x0703C000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 8);
        texture_commands[7].first = 0xE7000000;
        texture_commands[7].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 9);
        texture_commands[8].first = 0xD7000002;
        texture_commands[8].second = 0x80008000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 10);
        texture_commands[9].first = 0xFD500000;
        texture_commands[9].second = (u32)D_80210AF8;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 11);
        texture_commands[10].first = 0xF5500000;
        texture_commands[10].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 12);
        texture_commands[11].first = 0xE6000000;
        texture_commands[11].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 13);
        texture_commands[12].first = 0xF3000000;
        texture_commands[12].second = 0x0713F400;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 14);
        texture_commands[13].first = 0xE7000000;
        texture_commands[13].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 15);
        texture_commands[14].first = 0xF5400400;
        texture_commands[14].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(texture_commands + 16);
        texture_commands[15].first = 0xF2000000;
        texture_commands[15].second = 0x7C09C;
        if (record_pool == 0) {
            first_stat_frame_left = panel_x + 0x68;
        } else {
            first_stat_frame_left = panel_x + 0x9F;
        }
        first_stat_frame_top = panel_y + 0xB;
        if (record_pool == 0) {
            first_stat_frame_top = panel_y + 0x38;
        }
        first_stat_frame_right = panel_x + 0xBE;
        if (record_pool == 0) {
            first_stat_frame_right = panel_x + 0x87;
        }
        first_stat_frame_bottom = panel_y + 0x1E;
        if (record_pool == 0) {
            first_stat_frame_bottom = panel_y + 0x4B;
        }
        func_00188B60(first_stat_frame_left, first_stat_frame_top, first_stat_frame_right, first_stat_frame_bottom, 0, 0);
        second_stat_frame_left = panel_x + 0x9F;
        if (record_pool == 0) {
            second_stat_frame_left = panel_x + 0x8B;
        }
        second_stat_frame_top = panel_y + 0x1E;
        if (record_pool == 0) {
            second_stat_frame_top = panel_y + 0x37;
        }
        second_stat_frame_right = panel_x + 0xBE;
        if (record_pool == 0) {
            second_stat_frame_right = panel_x + 0xAA;
        }
        second_stat_frame_bottom = panel_y + 0x31;
        if (record_pool == 0) {
            second_stat_frame_bottom = panel_y + 0x4A;
        }
        func_00188B60(second_stat_frame_left, second_stat_frame_top, second_stat_frame_right, second_stat_frame_bottom, 0, 0x14);
        if (D_8021B572 == 1) {
            stat_multiplier = get_fatigue_scale(member_index, record_pool);
            /* Stage the index in each mode so KMC retains the byte mask at their join. */
            if (stat_multiplier == 1.0f) {
                stat_pool_byte = record_pool & 0xFF;
                func_0015394C();
                first_stat_pool = stat_pool_byte;
                stat_member = member_index & 0xFF;
            } else {
                stat_pool_byte = record_pool & 0xFF;
                func_001539B0();
                first_stat_pool = stat_pool_byte;
                stat_member = member_index & 0xFF;
            }
            first_stat = func_001526AC(first_stat_pool, stat_member);
            second_stat = func_00152930(stat_pool_byte, stat_member);
            first_stat = (u32)(stat_multiplier * (float)first_stat);
            second_stat = (u32)(stat_multiplier * (float)second_stat);
            if (first_stat >= 1000) {
                first_stat = 999;
            }
            if (second_stat >= 1000) {
                second_stat = 999;
            }
            first_stat_x = panel_x + 0xAB;
            if (record_pool == 0) {
                first_stat_x = panel_x + 0x74;
            }
            first_stat_y = panel_y + 0x12;
            if (record_pool == 0) {
                first_stat_y = panel_y + 0x3F;
            }
            func_00151318(first_stat_x, first_stat_y, first_stat, -3);
            second_stat_x = panel_x + 0xAB;
            if (record_pool == 0) {
                second_stat_x = panel_x + 0x97;
            }
            second_stat_y = panel_y + 0x25;
            if (record_pool == 0) {
                second_stat_y = panel_y + 0x3F;
            }
            func_00151318(second_stat_x, second_stat_y, second_stat, -3);
        }
        func_0015394C();
        if (record_pool == 0) {
            func_001541C0(panel_x + 0x34, panel_y + 0x1D, 0, member_index);
        }
        position_texture = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 1);
        position_texture[0].first = 0xE7000000;
        position_texture[0].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 2);
        position_texture[1].first = 0xE3001001;
        position_texture[1].second = 0x8000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 3);
        position_texture[2].first = 0xFD100000;
        position_texture[2].second = (u32)D_802113D8;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 4);
        position_texture[3].first = 0xE8000000;
        position_texture[3].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 5);
        position_texture[4].first = 0xF5000100;
        position_texture[4].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 6);
        position_texture[5].first = 0xE6000000;
        position_texture[5].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 7);
        position_texture[6].first = 0xF0000000;
        position_texture[6].second = 0x0703C000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 8);
        position_texture[7].first = 0xE7000000;
        position_texture[7].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 9);
        position_texture[8].first = 0xD7000002;
        position_texture[8].second = 0x80008000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 10);
        position_texture[9].first = 0xFD500000;
        position_texture[9].second = (u32)D_802110B0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 11);
        position_texture[10].first = 0xF5500000;
        position_texture[10].second = 0x07018060;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 12);
        position_texture[11].first = 0xE6000000;
        position_texture[11].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 13);
        position_texture[12].first = 0xF3000000;
        position_texture[12].second = 0x0718F400;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 14);
        position_texture[13].first = 0xE7000000;
        position_texture[13].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 15);
        texture_command_word = 0xF5400400;
        position_texture[14].first = texture_command_word;
        position_texture[14].second = 0x18060;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(position_texture + 16);
        position_texture[15].first = 0xF2000000;
        texture_data_word = 0x7C0C4;
        position_texture[15].second = texture_data_word;
        if (position_state < 3) {
            panel_index = 0x21;
            position_kind = 2;
        } else if (position_state < 6) {
            panel_index = 0x11;
            position_kind = 1;
        } else {
            panel_index = 0;
            position_kind = 0;
        }
        position_frame_left = panel_x + 0x31;
        if (record_pool == 0) {
            position_frame_left = panel_x + 0x63;
        }
        position_frame_top = panel_y + 0x33;
        if (record_pool == 0) {
            position_frame_top = panel_y + 0x1B;
        }
        position_frame_right = panel_x + 0x48;
        if (record_pool == 0) {
            position_frame_right = panel_x + 0x7A;
        }
        position_frame_bottom = panel_y + 0x43;
        if (record_pool == 0) {
            position_frame_bottom = panel_y + 0x2B;
        }
        func_00188B60(position_frame_left, position_frame_top, position_frame_right, position_frame_bottom, 0, panel_index);
        fallback_index = member_index & (0 - (member_index < 0x64));
        /* Keep separate index lifetimes through CSE. The 52-byte scale drops
         * the top two bits from the 32-bit address calculation. */
        scenario_index = (u32)fallback_index & ((1u << 30) - 1);
        if (record_pool == 0) {
            army_action = func_00044130(D_80193BC0[fallback_index].record.primary_class_id, D_80193BC0[fallback_index].record.secondary_class_id, position_kind);
            action_id = army_action;
            func_0004440c(&action_id, D_80193BC0[fallback_index].record.primary_class_id, D_80193BC0[fallback_index].record.secondary_class_id, army_action & 0xFF, D_80193BC0[fallback_index].record.element, D_80193BC0[fallback_index].record.equipment_slot_0, D_80193BC0[fallback_index].record.equipment_slot_1, D_80193BC0[fallback_index].record.equipment_slot_2, D_80193BC0[fallback_index].record.equipment_slot_3);
        } else {
            scenario_action = func_00044130(D_80195560[scenario_index].primary_class_id, D_80195560[scenario_index].secondary_class_id, position_kind);
            action_id = scenario_action;
            func_0004440c(&action_id, D_80195560[scenario_index].primary_class_id, D_80195560[scenario_index].secondary_class_id, scenario_action & 0xFF, D_80195560[scenario_index].element, D_80195560[scenario_index].equipment_slot_0, D_80195560[scenario_index].equipment_slot_1, D_80195560[scenario_index].equipment_slot_2, D_80195560[scenario_index].equipment_slot_3);
        }
        D_801F36BC = action_id | (position_kind << 8);
        decoded_action_kind = func_00044358(action_id);
        fade_commands = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        fade_color_cursor = fade_commands + 1;
        fade_commands[0].first = 0xE7000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)fade_color_cursor;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fade_commands + 2);
        fade_commands[0].second = 0;
        fade_commands[1].first = 0xFA000000;
        icon_fade = FIELD(((panel_slot * 2) + (u8 *)panel), s16 *, 0x18);
        action_kind = decoded_action_kind & 0xFF;
        if (icon_fade < 0x81) {
            fade_color_command = fade_color_cursor;
            icon_fade_color = icon_fade | ~0xFF;
        } else {
            fade_color_command = fade_color_cursor;
            icon_fade_color = -0x80;
        }
        icon_palette_base = (s32)D_801F36C0;
        fade_color_command->second = icon_fade_color;
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xE200001C;
            command->second = 0x504240;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xFC119623;
            command->second = 0xFF2FFFFF;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xFD500000;
            command->second = (s32) (D_801F0B90 + 0x5B48);
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xF5500000;
            command->second = 0x07000240;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xE6000000;
            command->second = 0;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xF3000000;
            command->second = 0x0703F800;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xE7000000;
            command->second = 0;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xF5400200;
            command->second = 0x240;
        }
        {
            CombatDrawCommand *command = D_800E9BA0++;

            command->first = 0xF2000000;
            command->second = 0x3C03C;
        }
        icon_palette_address = icon_palette_base + 0x880;
        if (action_kind == 3) {
            icon_palette_address = icon_palette_base + 0x8A0;
        }
        func_00152448(icon_palette_address);
        rectangle_start = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        rectangle_work = (u32)rectangle_start + 8;
        rectangle_start[0].first = 0xE7000000;
        rectangle_start[0].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)rectangle_work;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(rectangle_start + 2);
        if (record_pool == 0) {
            rectangle_command = (CombatDrawCommand *)rectangle_work;
            rectangle_word = (u32)(panel_x + 0xF2) << 18;
            rectangle_work = 0xE4000000;
            if ((s32)rectangle_word > 0) {
                goto pack_rectangle_right;
            }
        } else {
            rectangle_command = (CombatDrawCommand *)rectangle_work;
            rectangle_word = (u32)(panel_x + 0xC0) << 18;
            rectangle_work = 0xE4000000;
            if ((s32)rectangle_word > 0) {
pack_rectangle_right:
                rectangle_word = panel_x + 0xC0;
                if (record_pool == 0) {
                    rectangle_word = panel_x + 0xF2;
                }
                rectangle_work = ((rectangle_word * 4U & 0xFFCU) << 12) | 0xE4000000;
            }
        }
        if (record_pool == 0) {
            rectangle_word = (u32)(panel_y + 0x29) << 18;
            if ((s32)rectangle_word > 0) {
                goto pack_rectangle_bottom;
            }
            rectangle_word = rectangle_work;
        } else {
            rectangle_word = (u32)(panel_y + 0x41) << 18;
            if ((s32)rectangle_word > 0) {
pack_rectangle_bottom:
                if (record_pool == 0) {
                    rectangle_word = panel_y + 0x29;
                } else {
                    rectangle_word = panel_y + 0x41;
                }
                rectangle_word = rectangle_work | (rectangle_word * 4U & 0xFFCU);
            } else {
                rectangle_word = rectangle_work;
            }
        }
        rectangle_command->first = rectangle_word;
        if (record_pool == 0) {
            lower_edge_word = 0;
            if ((s32)((u32)(panel_x + 0x79) << 18) <= 0) {

            } else {
                goto block_197;
            }
        } else {
            lower_edge_word = 0;
            if ((s32)((u32)(panel_x + 0x47) << 18) > 0) {
block_197:
                lower_edge_x = panel_x + 0x47;
                if (record_pool == 0) {
                    lower_edge_x = panel_x + 0x79;
                }
                lower_edge_word = ((lower_edge_x * 4) & 0xFFC) << 0xC;
            }
        }
        if (record_pool == 0) {
            if ((s32)((u32)(panel_y + 0x1C) << 18) > 0) {
                goto block_204;
            }
        } else if ((s32)((u32)(panel_y + 0x34) << 18) > 0) {
block_204:
            lower_edge_y = panel_y + 0x34;
            if (record_pool == 0) {
                lower_edge_y = panel_y + 0x1C;
            }
            lower_edge_word |= (lower_edge_y * 4) & 0xFFC;
        }
        texture_work = (u32)gTitleCardDisplayListCursor;
        rectangle_command->second = lower_edge_word;
        lower_edge_word = texture_work + 8;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)lower_edge_word;
        texture_command = (CombatDrawCommand *)texture_work;
        texture_work = 0xE1000000;
        texture_command->first = texture_work;
        if (record_pool == 0) {
            texture_origin_s_word = 0;
            if ((s32)((u32)(panel_x + 0x79) << 18) >= 0) {

            } else {
                goto block_211;
            }
        } else {
            texture_origin_s_word = 0;
            if ((s32)((u32)(panel_x + 0x47) << 18) < 0) {
block_211:
                if (record_pool == 0) {
                    texture_origin_s_word = 0;
                    if (((s16) ((panel_x + 0x79) * 4) * 0x11) >= 0) {

                    } else {
                        goto block_215;
                    }
                } else {
                    texture_origin_s_word = 0;
                    if (((s16) ((panel_x + 0x47) * 4) * 0x11) < 0) {
block_215:
                        texture_origin_x = panel_x + 0x47;
                        if (record_pool == 0) {
                            texture_origin_x = panel_x + 0x79;
                        }
                        texture_origin_s_word = (0 - ((s32) ((s16) (texture_origin_x * 4) * 0x11) >> 4)) << 0x10;
                    }
                }
            }
        }
        if (record_pool == 0) {
            texture_work = (u32)(panel_y + 0x1C) << 2;
            if ((s32)texture_work < 0) {
                goto clip_texture_y;
            }
            texture_work = texture_origin_s_word | 0x20;
        } else {
            texture_work = (u32)(panel_y + 0x34) << 2;
            if ((s32)texture_work < 0) {
clip_texture_y:
                if (record_pool == 0) {
                    texture_work = (u32)(panel_y + 0x1C) << 18;
                    if ((s32)texture_work < 0) {
                        goto pack_texture_y;
                    }
                    texture_work = texture_origin_s_word | 0x20;
                } else {
                    texture_work = (u32)(panel_y + 0x34) << 18;
                    if ((s32)texture_work < 0) {
pack_texture_y:
                        texture_origin_y = panel_y + 0x34;
                        if (record_pool == 0) {
                            texture_origin_y = panel_y + 0x1C;
                        }
                        texture_work = texture_origin_s_word | ((0x20 - ((s32)((u32)texture_origin_y << 18) >> 13)) & 0xFFFF);
                    } else {
                        texture_work = texture_origin_s_word | 0x20;
                    }
                }
            } else {
                texture_work = texture_origin_s_word | 0x20;
            }
        }
        clipped_rectangle_tail = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        texture_command->second = texture_work;
        clipped_rectangle_tail[0].first = 0xF1000000;
        clipped_rectangle_tail[0].second = 0x880400;
        clipped_rectangle_tail[1].first = 0xE7000000;
        clipped_rectangle_tail[1].second = 0;
        clip_fade = FIELD(((u32)panel_slot * 2U + (u32)panel), s16 *, 0x18);
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(clipped_rectangle_tail + 1);
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(clipped_rectangle_tail + 2);
        func_000523b4(clip_fade);
        stat_texture = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 1);
        stat_texture[0].first = 0xE7000000;
        stat_texture[0].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 2);
        stat_texture[1].first = 0xE3001001;
        stat_texture[1].second = 0x8000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 3);
        stat_texture[2].first = 0xFD100000;
        stat_texture[2].second = (u32)D_80211508;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 4);
        stat_texture[3].first = 0xE8000000;
        stat_texture[3].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 5);
        stat_texture[4].first = 0xF5000100;
        stat_texture[4].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 6);
        stat_texture[5].first = 0xE6000000;
        stat_texture[5].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 7);
        stat_texture[6].first = 0xF0000000;
        stat_texture[6].second = 0x0703C000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 8);
        stat_texture[7].first = 0xE7000000;
        stat_texture[7].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 9);
        stat_texture[8].first = 0xD7000002;
        stat_texture[8].second = 0x80008000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 10);
        stat_texture[9].first = 0xFD500000;
        stat_texture[9].second = (u32)D_80211400;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 11);
        stat_texture[10].first = 0xF5500000;
        stat_texture[10].second = 0x07018060;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 12);
        stat_texture[11].first = 0xE6000000;
        stat_texture[11].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 13);
        stat_texture[12].first = 0xF3000000;
        stat_texture[12].second = 0x0707F400;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 14);
        stat_texture[13].first = 0xE7000000;
        stat_texture[13].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 15);
        stat_texture[14].first = 0xF5400400;
        stat_texture[14].second = 0x18060;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(stat_texture + 16);
        stat_texture[15].first = 0xF2000000;
        stat_texture[15].second = 0x7C03C;
        if (D_8021B572 == 1) {
            action_icon_x = panel_x + 0xA4;
            if (record_pool == 0) {
                action_icon_x = panel_x + 0xD5;
            }
            action_icon_y = panel_y + 0x32;
            if (record_pool == 0) {
                action_icon_y = panel_y + 0x1A;
            }
            func_00154694(action_icon_x, action_icon_y, action_kind);
        }
        if ((u32) (D_8018AA80[action_id].bytes[3] - 1) < 2U) {
            if (action_kind == 3) {
                position_stat = func_001535A4(record_pool, member_index, position_kind) & 0xFFFF;
            } else {
                if (action_kind < 3) {
                    goto normal_position_stat;
                }
                if (action_kind < 6) {
                    position_stat = func_00152FBC(record_pool, member_index, position_kind) & 0xFFFF;
                } else {
normal_position_stat:
                    position_stat = func_001532B0(record_pool, member_index, position_kind) & 0xFFFF;
                }
            }
        } else {
            position_stat = 0;
        }
        position_multiplier = get_fatigue_scale(member_index, record_pool);
        position_stat = (s32) (position_multiplier * (float) position_stat);
        if (position_multiplier == 1.0f) {
            func_0015394C();
        } else {
            func_001539B0();
        }
        if (D_8021B572 == 1) {
            if (position_stat >= 0x3E7) {
                position_stat = 0x3E7;
            }
            position_stat_x = panel_x + 0x9C;
            if (record_pool == 0) {
                position_stat_x = panel_x + 0xD0;
            }
            position_stat_y = panel_y + 0x3B;
            if (record_pool == 0) {
                position_stat_y = panel_y + 0x23;
            }
            func_00151318(position_stat_x, position_stat_y, position_stat, -3);
            position_bonus = squad_member_slot != 0;
            position_bonus = leader_class_is_21 & position_bonus;
            action_position_value = position_bonus + (func_00044238(primary_class, secondary_class, position_kind) & 0xFF);
            if (record_pool == 0) {
                position_value_x = panel_x + 0xE6;
            } else {
                position_value_x = panel_x + 0xB2;
            }
            position_value_y = panel_y + 0x39;
            if (record_pool == 0) {
                position_value_y = panel_y + 0x21;
            }
            func_00154F0C(position_value_x, position_value_y, action_position_value);
            action_label = func_00044340(action_id);
        } else {
            action_label = (char *)D_801E8564;
        }
        action_label_x = panel_x + 0x47;
        if (record_pool == 0) {
            action_label_x = panel_x + 0x79;
        }
        action_label_y = panel_y + 0x34;
        if (record_pool == 0) {
            action_label_y = panel_y + 0x1C;
        }
        func_0004ef34(action_label, action_label_x, action_label_y);
        func_0015394C();
        indexed_texture = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 1);
        indexed_texture[0].first = 0xE7000000;
        indexed_texture[0].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 2);
        indexed_texture[1].first = 0xE3001001;
        indexed_texture[1].second = 0x8000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 3);
        indexed_texture[2].first = 0xFD100000;
        indexed_texture[2].second = (u32)D_8021B558[squad_member_slot];
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 4);
        indexed_texture[3].first = 0xE8000000;
        indexed_texture[3].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 5);
        indexed_texture[4].first = 0xF5000100;
        indexed_texture[4].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 6);
        indexed_texture[5].first = 0xE6000000;
        indexed_texture[5].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 7);
        indexed_texture[6].first = 0xF0000000;
        indexed_texture[6].second = 0x073FC000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 8);
        indexed_texture[7].first = 0xE7000000;
        indexed_texture[7].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 9);
        indexed_texture[8].first = 0xD7000002;
        indexed_texture[8].second = 0x80008000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 10);
        indexed_texture[9].first = 0xFD500000;
        indexed_texture[9].second = (u32)D_8021B528[squad_member_slot];
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 11);
        indexed_texture[10].first = 0xF5500000;
        indexed_texture[10].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 12);
        indexed_texture[11].first = 0xE6000000;
        indexed_texture[11].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 13);
        indexed_texture[12].first = 0xF3000000;
        indexed_texture[12].second = 0x073BF19A;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 14);
        indexed_texture[13].first = 0xE7000000;
        indexed_texture[13].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 15);
        indexed_texture[14].first = 0xF5480A00;
        indexed_texture[14].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(indexed_texture + 16);
        indexed_texture[15].first = 0xF2000000;
        indexed_texture[15].second = 0x9C0BC;
        texture_y = panel_y + 0x1C;
        texture_x = panel_x + 6;
        if (record_pool != 0) {
            texture_y = panel_y + 0x14;
        }
        texture_end_x = panel_x + 0x2E;
        if (record_pool != 0) {
            texture_end_y = panel_y + 0x44;
        } else {
            texture_end_y = panel_y + 0x4C;
        }
        func_00188B60(texture_x, texture_y, texture_end_x, texture_end_y, 0, 0);
        texture_edge_y = panel_y + 0x1C;
        texture_edge_x = panel_x + 6;
        if (record_pool != 0) {
            texture_edge_y = panel_y + 0x14;
        }
        texture_end_x = panel_x + 0x2E;
        if (record_pool != 0) {
            texture_edge_end_y = panel_y + 0x44;
        } else {
            texture_edge_end_y = panel_y + 0x4C;
        }
        func_001546C8(texture_edge_x, texture_edge_y, texture_end_x, texture_edge_end_y);
        fatigue_texture = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 1);
        fatigue_texture[0].first = 0xE7000000;
        fatigue_texture[0].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 2);
        fatigue_texture[1].first = 0xE3001001;
        fatigue_texture[1].second = 0x8000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 3);
        fatigue_texture[2].first = 0xFD100000;
        fatigue_texture[2].second = (u32)D_801EC740;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 4);
        fatigue_texture[3].first = 0xE8000000;
        fatigue_texture[3].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 5);
        fatigue_texture[4].first = 0xF5000100;
        fatigue_texture[4].second = 0x07000000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 6);
        fatigue_texture[5].first = 0xE6000000;
        fatigue_texture[5].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 7);
        fatigue_texture[6].first = 0xF0000000;
        fatigue_texture[6].second = 0x0703C000;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 8);
        fatigue_texture[7].first = 0xE7000000;
        fatigue_texture[7].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 9);
        fatigue_texture[8].first = 0xFD500000;
        fatigue_texture[8].second = (u32)D_801EC760;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 10);
        fatigue_texture[9].first = 0xF5500000;
        fatigue_texture[9].second = 0x07018060;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 11);
        fatigue_texture[10].first = 0xE6000000;
        fatigue_texture[10].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 12);
        fatigue_texture[11].first = 0xF3000000;
        fatigue_texture[11].second = 0x071FF200;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 13);
        fatigue_texture[12].first = 0xE7000000;
        fatigue_texture[12].second = 0;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 14);
        fatigue_texture[13].first = 0xF5480800;
        fatigue_texture[13].second = 0x18060;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(fatigue_texture + 15);
        fatigue_texture[14].first = 0xF2000000;
        fatigue_texture[14].second = 0x7C07C;
        if (member_index < 0x64) {
            float fatigue_ratio;

            if (record_pool == 0) {
                fatigue_percent = D_80193BC0[member_index].record.fatigue;
                fatigue_ratio = 100.0f;
            } else {
                fatigue_percent = D_80195560[member_index].fatigue;
                fatigue_ratio = 100.0f;
            }
            fatigue_tile_offset = 0;
            fatigue_ratio = (float)fatigue_percent / fatigue_ratio;
            if (fatigue_ratio >= 0.7f) {
                fatigue_tile_offset = 0x10;
            }
            if (record_pool == 0) {
                fatigue_for_height = D_80193BC0[member_index].record.fatigue;
            } else {
                fatigue_for_height = D_80195560[member_index].fatigue;
            }
            fatigue_bar_height = (fatigue_for_height * 0x10) / 100;
            fatigue_bar_height = 0x10 - fatigue_bar_height;
            if (record_pool == 0) {
                fatigue_frame_left = panel_x + 0xBC;
            } else {
                fatigue_frame_left = panel_x + 0x3A;
            }
            fatigue_frame_top = panel_y + 1;
            if (record_pool == 0) {
                fatigue_frame_top = panel_y + 0x3A;
            }
            fatigue_frame_right = panel_x + 0x4A;
            if (record_pool == 0) {
                fatigue_frame_right = panel_x + 0xCC;
            }
            fatigue_frame_bottom = panel_y + 0x11;
            if (record_pool == 0) {
                fatigue_frame_bottom = panel_y + 0x4A;
            }
            func_00188B60(fatigue_frame_left, fatigue_frame_top, fatigue_frame_right, fatigue_frame_bottom, 0, fatigue_tile_offset);
            fatigue_fill_left = panel_x + 0x3A;
            if (record_pool == 0) {
                fatigue_fill_left = panel_x + 0xBC;
            }
            fatigue_fill_start = fatigue_bar_height + 1;
            if (record_pool == 0) {
                fatigue_fill_start = fatigue_bar_height + 0x3A;
            }
            bar_y = panel_y + fatigue_fill_start;
            if (record_pool == 0) {
                fatigue_fill_right = panel_x + 0xCC;
            } else {
                fatigue_fill_right = panel_x + 0x4A;
            }
            fatigue_fill_bottom = panel_y + 0x11;
            if (record_pool == 0) {
                fatigue_fill_bottom = panel_y + 0x4A;
            }
            fatigue_fill_start = 0x10;
            func_00188B60(fatigue_fill_left, bar_y, fatigue_fill_right, fatigue_fill_bottom, fatigue_fill_start, fatigue_bar_height + fatigue_tile_offset);
            extended_draw_sync = (CombatDrawCommand *)gTitleCardDisplayListCursor;
            gTitleCardDisplayListCursor = (CombatDrawCommand *)(extended_draw_sync + 1);
            extended_draw_sync[0].first = 0xE7000000;
            extended_draw_sync[0].second = 0;
        }
        scissor_packet = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        scissor_work = 0xE7000000;
        scissor_packet[0].first = scissor_work;
        scissor_packet[0].second = 0;
        clip_left = FIELD(panel, s32 *, 0x7C);
        scissor_work = (u32)(scissor_packet + 1);
        gTitleCardDisplayListCursor = (CombatDrawCommand *)scissor_work;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(scissor_packet + 2);
        if (clip_left >= 0) {
            scissor_command = (CombatDrawCommand *)scissor_work;
            scissor_work = (((s32)((float)clip_left * 4.0f) & 0xFFF) << 12) | 0xED000000;
        } else {
            scissor_command = (CombatDrawCommand *)scissor_work;
            scissor_work = 0xED000000;
        }
        scissor_top = FIELD(panel, s32 *, 0x80) - 8;
        clip_left = scissor_work;
        if (scissor_top >= 0) {
            clip_left |= (s32) ((float) scissor_top * 4.0f) & 0xFFF;
        }
        scissor_command->first = clip_left;
        scissor_right = FIELD(panel, s32 *, 0x84);
        if (scissor_right != 0x140) {
            scissor_right_word = ((s32) ((float) scissor_right * 4.0f) & 0xFFF) << 0xC;
        } else {
            scissor_right_word = 0x4FC000;
        }
        scissor_bottom = FIELD(panel, s32 *, 0x88) + 0x24;
        if (scissor_bottom != 0xF0) {
            scissor_end_word = scissor_right_word | ((s32) ((float) scissor_bottom * 4.0f) & 0xFFF);
        } else {
            scissor_end_word = scissor_right_word | 0x3BC;
        }
        description_draw_sync = (CombatDrawCommand *)gTitleCardDisplayListCursor;
        notice_counter = D_8021B571;
        scissor_command->second = scissor_end_word;
        gTitleCardDisplayListCursor = (CombatDrawCommand *)(description_draw_sync + 1);
        notice_counter_running = notice_counter != 0;
        notice_counter_visible = notice_counter < 15U;
        show_notice = notice_counter_running & notice_counter_visible;
        description_draw_sync[0].first = 0xE7000000;
        description_draw_sync[0].second = 0;
        if (show_notice && panel == func_00055308()) {
            notice_x = panel_x + 5;
            if (D_8021B56D == 0) {
                description_draw_packet = (CombatDrawCommand *)gTitleCardDisplayListCursor;
                gTitleCardDisplayListCursor = (CombatDrawCommand *)(description_draw_packet + 1);
                description_draw_packet[0].first = 0xDE000000;
                description_draw_packet[0].second = (u32)D_801EB1D0;
                gTitleCardDisplayListCursor = (CombatDrawCommand *)(description_draw_packet + 2);
                description_draw_packet[1].first = 0xE7000000;
                description_draw_packet[1].second = 0;
                if (record_pool == 0) {
                    notice_top = panel_y + 0x5F;
                } else {
                    notice_top = panel_y + 0x57;
                }
                notice_right = panel_x + 0x11;
                if (record_pool == 0) {
                    notice_bottom = panel_y + 0x6F;
                } else {
                    notice_bottom = panel_y + 0x67;
                }
                func_00188B60(notice_x, notice_top, notice_right, notice_bottom, 0x11, 0);
                notice_mark_left = panel_x + 0xB6;
                if (record_pool == 0) {
                    notice_mark_left = panel_x + 0xE8;
                }
                notice_mark_top = panel_y + 0x57;
                if (record_pool == 0) {
                    notice_mark_top = panel_y + 0x5F;
                }
                notice_mark_right = panel_x + 0xC2;
                if (record_pool == 0) {
                    notice_mark_right = panel_x + 0xF4;
                }
                notice_mark_bottom = panel_y + 0x67;
                if (record_pool == 0) {
                    notice_mark_bottom = panel_y + 0x6F;
                }
                func_00188B60(notice_mark_left, notice_mark_top, notice_mark_right, notice_mark_bottom, 3, 0);
            }
        }
        description_counter = D_8021B571;
        if (description_counter != 0) {
            if (panel == func_00055308()) {
                D_8021B571 = (u8) (D_8021B571 + 1);
            }
        }
        if (D_8021B571 >= 31U) {
            description_counter = 1;
            D_8021B571 = description_counter;
        }
        description_pool_flags = D_801F36A0;
        description_member = D_801F401C;
        description_pool_flags &= 1;
        description_pool_index = description_pool_flags;
        description_pool_index <<= 1;
        if (description_member >= 100) {
            description_selector = description_pool_index | 1;
        } else {
            description_selector = description_pool_index;
        }
        description_flags = D_801F36A0;
        if ((description_flags & 1) && !(description_flags & 2)) {
            description_selector += 2;
        }
        if (((const DescriptionEntry *)D_80213EA4)[description_selector].field01 != 0) {
            func_0015E380(description_selector);
        }
    }
}
