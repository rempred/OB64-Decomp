#include "game/cutscene_panels.h"
#include "game/character_record.h"
#include "game/scenario_source_record.h"

typedef struct {
    u32 w0;
    u32 w1;
} Gfx;

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

extern Gfx D_801EB1D0[];
extern u8 *volatile D_800E9BA0;
extern u8 *D_801F0B90, *D_801F36C0;
extern u8 D_8018F481, D_801F36A0, D_8021B56D, D_8021B571, D_8021B572, D_8021B573;
extern s32 D_801F401C;
extern u8 D_80213EA4[];
extern u16 D_80190EBC[], D_8019532C[];
typedef struct {
    Panel *panels[5];
    u8 member_indices[5];
    u8 field19[3];
    u8 fallback_class_label_start;
    u8 field1D[7];
    u8 fallback_label_start;
} CharacterDisplayMembers;

extern u8 D_8021B470[];
extern u8 D_801E8564[];
extern u32 D_8021B528[], D_8021B558[];
extern u8 D_80210D80[];
extern u8 D_80210AF8[];
extern u8 D_802113D8[];
extern u8 D_802110B0[];
extern u8 D_80211508[];
extern u8 D_80211400[];
extern u8 D_801EC740[];
extern u8 D_801EC760[];
extern void *D_801F0CB0[];

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
void func_00189778(Panel *panel, s32 slot) {
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
    s32 temp_a0_2262;
    s32 notice_x, notice_right;
    s32 temp_a2_1760;
    s32 position_bonus;
    s32 temp_a2_223;
    s32 fatigue_bar_height;
    void *squad;
    u16 second_stat;
    s32 temp_s1_292;
    s32 action_kind;
    s32 temp_s2_295;
    u16 first_stat;
    s32 stat_member;
    s32 record_pool;
    s32 panel_x;
    s32 panel_y;
    u32 texture_data_word;
    s32 fallback_index;
    u32 scenario_index;
    s32 decoded_action_kind;
    s32 temp_v0_2200;
    s32 description_member;
    u8 selector_work;
    s32 temp_v1_2216;
    s32 temp_v1_2236;
    s32 var_a0_1060;
    s32 var_a0_1396;
    s32 var_a0_1617;
    s32 var_a0_1740;
    s32 var_a0_1762;
    s32 var_a0_2116;
    s32 var_a0_2136;
    s32 var_a0_2231;
    s32 var_a0_2308;
    u8 description_selector;
    s32 detail_x;
    s32 level_x;
    s32 var_a0_388;
    s32 var_a0_475;
    s32 var_a0_718;
    s32 var_a0_738;
    s32 first_stat_pool;
    s32 var_a0_894;
    s32 var_a0_905;
    s32 var_a1_1064;
    s32 var_a1_1621;
    s32 var_a1_1744;
    s32 var_a1_1767;
    s32 var_a1_1781;
    s32 texture_edge_y;
    s32 var_a1_196;
    s32 var_a1_2121;
    s32 var_a1_227;
    s32 var_a1_2292;
    s32 var_a1_2312;
    s32 var_a1_236;
    s32 var_a1_265;
    s32 var_a1_392;
    s32 name_x;
    s32 class_name_x;
    s32 var_a1_723;
    s32 var_a1_742;
    s32 var_a1_898;
    s32 var_a1_909;
    s32 var_a2_1068;
    s32 var_a2_1785;
    s32 var_a2_2125;
    s32 bar_y;
    s32 var_a2_2146;
    s32 var_a2_2316;
    s32 detail_right;
    s32 detail_y;
    s32 level_y;
    s32 name_y;
    s32 class_name_y;
    s32 var_a2_727;
    s32 var_a2_746;
    s32 var_a3_1072;
    s32 texture_end_y;
    s32 texture_edge_end_y;
    s32 var_a3_2129;
    s32 var_a3_2151;
    s32 var_a3_2299;
    s32 var_a3_2320;
    s32 var_a3_731;
    s32 var_a3_750;
    s32 position_stat;
    s32 position_kind;
    s32 var_s1_2082;
    s32 stat_pool_byte;
    s32 member_index;
    s32 panel_index;
    s32 texture_y;
    s32 texture_x, texture_end_x, texture_edge_x;
    u32 texture_command_word;
    s32 icon_fade_color;
    u32 rectangle_word;
    s32 var_v0_1355;
    s32 var_v0_1376;
    u32 texture_work;
    char *var_v0_1772;
    s32 var_v0_2140;
    s32 var_v0_2239;
    const u8 *display_label;
    u32 rectangle_work;
    u32 lower_edge_word;
    s32 var_v1_1425;
    s32 var_v1_1463;
    u32 scissor_work;
    u16 var_a2_399;
    u16 var_a3_418;
    u32 notice_counter;
    s32 notice_counter_running;
    s32 show_notice;
    u8 army_action;
    u8 scenario_action;
    u8 description_counter;
    u8 squad_index;
    u8 description_flags;
    u8 var_a2_208;
    u8 var_a2_248;
    u8 var_a2_277;
    u8 displayed_level;
    u8 primary_class;
    u8 var_v0_2058;
    u8 var_v0_2092;
    s32 leader_class;
    Gfx *fade_commands;
    void *temp_a0_12;
    Gfx *fade_color_cursor, *fade_color_command;
    Gfx *icon_bank_commands;
    Gfx *rectangle_start;
    Gfx *texture_command;
    Gfx *stat_texture;
    Gfx *indexed_texture;
    Gfx *fatigue_texture;
    Gfx *scissor_packet;
    Gfx *initial_cursor;
    Gfx *texture_commands;
    Gfx *position_texture;
    Gfx *rectangle_command;
    Gfx *clipped_rectangle_tail;
    Gfx *extended_draw_sync;
    Gfx *scissor_command;
    Gfx *description_draw_sync;
    Gfx *description_draw_packet;
    Gfx *indicator_packet;

    panel_slot = slot;
    temp_a0_12 = (void *)((u32)slot * 2 + (u32)panel);
    position_state = 0;
    squad_member_slot = 0;
    member_index = 0;
    leader_class_is_21 = 0;
    if (FIELD(temp_a0_12, s16 *, 0x18) != 0) {
        s32 fade;

        panel_x = panel->field2C;
        panel_y = panel->field30;
        initial_cursor = (Gfx *)D_800E9BA0;
        initial_cursor->w0 = 0xE7000000;
        initial_cursor->w1 = 0;
        fade = FIELD(temp_a0_12, s16 *, 0x18);
        D_800E9BA0 = (u8 *)(initial_cursor + 1);
        func_000523b4(fade);
        panel_index = 0;
        panel_cursor = ((CharacterDisplayMembers *)D_8021B470)->panels;
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
        member_index = ((const CharacterDisplayMembers *)D_8021B470)->member_indices[panel_index];
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
                var_a1_196 = panel_y + 0xC;
            } else {
                var_a1_196 = panel_y + 2;
            }
            if (record_pool == 0) {
                var_a2_208 = D_80193BC0[member_index].record.alignment;
            } else {
                var_a2_208 = D_80195560[member_index].alignment;
            }
            func_00153F80(icon_x, var_a1_196, var_a2_208);
            temp_a2_223 = func_00043dc4(primary_class, secondary_class) & 0xFF;
            class_icon_x = panel_x + 5;
            if (record_pool == 0) {
                var_a1_227 = panel_y + 0xC;
            } else {
                var_a1_227 = panel_y + 2;
            }
            func_00153CE0(class_icon_x, var_a1_227, temp_a2_223);
            element_icon_x = panel_x + 0x10;
            if (record_pool == 0) {
                var_a1_236 = panel_y + 0xC;
            } else {
                var_a1_236 = panel_y + 2;
            }
            if (record_pool == 0) {
                var_a2_248 = D_80193BC0[member_index].record.element;
            } else {
                var_a2_248 = D_80195560[member_index].element;
            }
            func_00153ADC(element_icon_x, var_a1_236, var_a2_248);
            func_0015394C();
            status_alignment_x = panel_x + 0x20;
            if (record_pool == 0) {
                var_a1_265 = panel_y + 0xC;
            } else {
                var_a1_265 = panel_y + 2;
            }
            if (record_pool == 0) {
                var_a2_277 = D_80193BC0[member_index].record.alignment;
            } else {
                var_a2_277 = D_80195560[member_index].alignment;
            }
            func_001540C4(status_alignment_x, var_a1_265, var_a2_277);
            if (record_pool == 0) {
                temp_s1_292 = panel_y + 2;
                temp_s2_295 = panel_y + 9;
                func_00188B60(panel_x + 5, temp_s1_292, panel_x + 0x14, temp_s2_295, 0x18, 0x1B);
                func_00151318(panel_x + 0x16, temp_s1_292, D_80193BC0[member_index].field_34, 2);
                func_00188B60(panel_x + 0x5C, temp_s1_292, panel_x + 0x6D, temp_s2_295, 0x23, 8);
                func_00151318(panel_x + 0x70, temp_s1_292, D_80193BC0[member_index].experience, 0);
                func_00151318(panel_x + 0x90, temp_s1_292, func_00043100(D_80193BC0[member_index].record.primary_class_id, D_80193BC0[member_index].record.secondary_class_id) & 0xFF, 1);
            }
            detail_x = panel_x + 0x50;
            if (record_pool == 0) {
                detail_x = panel_x + 0x39;
            }
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
                var_a0_388 = panel_x + 0xA6;
                if (record_pool != 0) {
                    var_a0_388 = panel_x + 0x7B;
                }
                var_a1_392 = panel_y + 2;
                if (record_pool == 0) {
                    var_a2_399 = D_80193BC0[member_index].record.hp;
                } else {
                    var_a2_399 = D_80195560[member_index].hp;
                }
                if (record_pool == 0) {
                    var_a3_418 = D_80193BC0[member_index].record.max_hp;
                } else {
                    var_a3_418 = D_80195560[member_index].max_hp;
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
            var_a0_388 = panel_x + 0xA6;
            if (record_pool != 0) {
                var_a0_388 = panel_x + 0x7B;
            }
            var_a1_392 = panel_y + 2;
            if (record_pool == 0) {
                var_a2_399 = D_80190EBC[member_index];
            } else {
                var_a2_399 = D_8019532C[member_index];
            }
            if (record_pool == 0) {
                var_a3_418 = D_80190F82.pool.maximum;
            } else {
                var_a3_418 = D_801953F2;
            }
block_74:
            func_00153A14(var_a0_388, var_a1_392, var_a2_399, var_a3_418);
            if (record_pool != 0) {
                goto select_member_display_name;
            }
            goto upload_class_indicator;
        } else {
block_75:
            var_a0_475 = panel_x + 0xA6;
            if (record_pool != 0) {
                var_a0_475 = panel_x + 0x7B;
            }
            func_00153A98(var_a0_475, panel_y + 2);
        }
        if (record_pool != 0) {
            goto select_member_display_name;
        }
upload_class_indicator:
        {
            void *texture_destination = D_801F36C0 + 0x2E0;
            void *texture_source = D_801F0B90 + 0x27A8;

            indicator_packet = (Gfx *)D_800E9BA0;
            D_800E9BA0 = (u8 *)(indicator_packet + 1);
            indicator_packet[0].w0 = 0xE7000000;
            D_800E9BA0 = (u8 *)(indicator_packet + 2);
            indicator_packet[0].w1 = 0;
            indicator_packet[1].w0 = 0xD7000002;
            indicator_packet[1].w1 = 0x80008000;
            func_001520E0(texture_destination, texture_source, 0x10, 8, 2);
            func_00151F40(panel_x + 0x86, panel_y + 1, 0x47);
            if (record_pool == 0) {
                func_001518FC((func_00043ad8(primary_class, secondary_class) - 1) & 0xFF, panel_x + 0xCF, panel_y + 0x3E);
            }
        }
select_member_display_name:
        if (member_index >= 100) {
            display_label = &((const CharacterDisplayMembers *)D_8021B470)->fallback_label_start;
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
            display_label = &((const CharacterDisplayMembers *)D_8021B470)->fallback_class_label_start;
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
        texture_commands = (Gfx *)D_800E9BA0;
        D_800E9BA0 = (u8 *)(texture_commands + 1);
        texture_commands[0].w0 = 0xE7000000;
        texture_commands[0].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 2);
        texture_commands[1].w0 = 0xE3001001;
        texture_commands[1].w1 = 0x8000;
        D_800E9BA0 = (u8 *)(texture_commands + 3);
        texture_commands[2].w0 = 0xFD100000;
        texture_commands[2].w1 = (u32)D_80210D80;
        D_800E9BA0 = (u8 *)(texture_commands + 4);
        texture_commands[3].w0 = 0xE8000000;
        texture_commands[3].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 5);
        texture_commands[4].w0 = 0xF5000100;
        texture_commands[4].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(texture_commands + 6);
        texture_commands[5].w0 = 0xE6000000;
        texture_commands[5].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 7);
        texture_commands[6].w0 = 0xF0000000;
        texture_commands[6].w1 = 0x0703C000;
        D_800E9BA0 = (u8 *)(texture_commands + 8);
        texture_commands[7].w0 = 0xE7000000;
        texture_commands[7].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 9);
        texture_commands[8].w0 = 0xD7000002;
        texture_commands[8].w1 = 0x80008000;
        D_800E9BA0 = (u8 *)(texture_commands + 10);
        texture_commands[9].w0 = 0xFD500000;
        texture_commands[9].w1 = (u32)D_80210AF8;
        D_800E9BA0 = (u8 *)(texture_commands + 11);
        texture_commands[10].w0 = 0xF5500000;
        texture_commands[10].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(texture_commands + 12);
        texture_commands[11].w0 = 0xE6000000;
        texture_commands[11].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 13);
        texture_commands[12].w0 = 0xF3000000;
        texture_commands[12].w1 = 0x0713F400;
        D_800E9BA0 = (u8 *)(texture_commands + 14);
        texture_commands[13].w0 = 0xE7000000;
        texture_commands[13].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 15);
        texture_commands[14].w0 = 0xF5400400;
        texture_commands[14].w1 = 0;
        D_800E9BA0 = (u8 *)(texture_commands + 16);
        texture_commands[15].w0 = 0xF2000000;
        texture_commands[15].w1 = 0x7C09C;
        if (record_pool == 0) {
            var_a0_718 = panel_x + 0x68;
        } else {
            var_a0_718 = panel_x + 0x9F;
        }
        var_a1_723 = panel_y + 0xB;
        if (record_pool == 0) {
            var_a1_723 = panel_y + 0x38;
        }
        var_a2_727 = panel_x + 0xBE;
        if (record_pool == 0) {
            var_a2_727 = panel_x + 0x87;
        }
        var_a3_731 = panel_y + 0x1E;
        if (record_pool == 0) {
            var_a3_731 = panel_y + 0x4B;
        }
        func_00188B60(var_a0_718, var_a1_723, var_a2_727, var_a3_731, 0, 0);
        var_a0_738 = panel_x + 0x9F;
        if (record_pool == 0) {
            var_a0_738 = panel_x + 0x8B;
        }
        var_a1_742 = panel_y + 0x1E;
        if (record_pool == 0) {
            var_a1_742 = panel_y + 0x37;
        }
        var_a2_746 = panel_x + 0xBE;
        if (record_pool == 0) {
            var_a2_746 = panel_x + 0xAA;
        }
        var_a3_750 = panel_y + 0x31;
        if (record_pool == 0) {
            var_a3_750 = panel_y + 0x4A;
        }
        func_00188B60(var_a0_738, var_a1_742, var_a2_746, var_a3_750, 0, 0x14);
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
            var_a0_894 = panel_x + 0xAB;
            if (record_pool == 0) {
                var_a0_894 = panel_x + 0x74;
            }
            var_a1_898 = panel_y + 0x12;
            if (record_pool == 0) {
                var_a1_898 = panel_y + 0x3F;
            }
            func_00151318(var_a0_894, var_a1_898, first_stat, -3);
            var_a0_905 = panel_x + 0xAB;
            if (record_pool == 0) {
                var_a0_905 = panel_x + 0x97;
            }
            var_a1_909 = panel_y + 0x25;
            if (record_pool == 0) {
                var_a1_909 = panel_y + 0x3F;
            }
            func_00151318(var_a0_905, var_a1_909, second_stat, -3);
        }
        func_0015394C();
        if (record_pool == 0) {
            func_001541C0(panel_x + 0x34, panel_y + 0x1D, 0, member_index);
        }
        position_texture = (Gfx *)D_800E9BA0;
        D_800E9BA0 = (u8 *)(position_texture + 1);
        position_texture[0].w0 = 0xE7000000;
        position_texture[0].w1 = 0;
        D_800E9BA0 = (u8 *)(position_texture + 2);
        position_texture[1].w0 = 0xE3001001;
        position_texture[1].w1 = 0x8000;
        D_800E9BA0 = (u8 *)(position_texture + 3);
        position_texture[2].w0 = 0xFD100000;
        position_texture[2].w1 = (u32)D_802113D8;
        D_800E9BA0 = (u8 *)(position_texture + 4);
        position_texture[3].w0 = 0xE8000000;
        position_texture[3].w1 = 0;
        D_800E9BA0 = (u8 *)(position_texture + 5);
        position_texture[4].w0 = 0xF5000100;
        position_texture[4].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(position_texture + 6);
        position_texture[5].w0 = 0xE6000000;
        position_texture[5].w1 = 0;
        D_800E9BA0 = (u8 *)(position_texture + 7);
        position_texture[6].w0 = 0xF0000000;
        position_texture[6].w1 = 0x0703C000;
        D_800E9BA0 = (u8 *)(position_texture + 8);
        position_texture[7].w0 = 0xE7000000;
        position_texture[7].w1 = 0;
        D_800E9BA0 = (u8 *)(position_texture + 9);
        position_texture[8].w0 = 0xD7000002;
        position_texture[8].w1 = 0x80008000;
        D_800E9BA0 = (u8 *)(position_texture + 10);
        position_texture[9].w0 = 0xFD500000;
        position_texture[9].w1 = (u32)D_802110B0;
        D_800E9BA0 = (u8 *)(position_texture + 11);
        position_texture[10].w0 = 0xF5500000;
        position_texture[10].w1 = 0x07018060;
        D_800E9BA0 = (u8 *)(position_texture + 12);
        position_texture[11].w0 = 0xE6000000;
        position_texture[11].w1 = 0;
        D_800E9BA0 = (u8 *)(position_texture + 13);
        position_texture[12].w0 = 0xF3000000;
        position_texture[12].w1 = 0x0718F400;
        D_800E9BA0 = (u8 *)(position_texture + 14);
        position_texture[13].w0 = 0xE7000000;
        position_texture[13].w1 = 0;
        D_800E9BA0 = (u8 *)(position_texture + 15);
        texture_command_word = 0xF5400400;
        position_texture[14].w0 = texture_command_word;
        position_texture[14].w1 = 0x18060;
        D_800E9BA0 = (u8 *)(position_texture + 16);
        position_texture[15].w0 = 0xF2000000;
        texture_data_word = 0x7C0C4;
        position_texture[15].w1 = texture_data_word;
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
        var_a0_1060 = panel_x + 0x31;
        if (record_pool == 0) {
            var_a0_1060 = panel_x + 0x63;
        }
        var_a1_1064 = panel_y + 0x33;
        if (record_pool == 0) {
            var_a1_1064 = panel_y + 0x1B;
        }
        var_a2_1068 = panel_x + 0x48;
        if (record_pool == 0) {
            var_a2_1068 = panel_x + 0x7A;
        }
        var_a3_1072 = panel_y + 0x43;
        if (record_pool == 0) {
            var_a3_1072 = panel_y + 0x2B;
        }
        func_00188B60(var_a0_1060, var_a1_1064, var_a2_1068, var_a3_1072, 0, panel_index);
        fallback_index = member_index & (0 - (member_index < 0x64));
        scenario_index = (u32)fallback_index & ((1u << 31) - 1);
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
        fade_commands = (Gfx *)D_800E9BA0;
        fade_color_cursor = fade_commands + 1;
        fade_commands[0].w0 = 0xE7000000;
        D_800E9BA0 = (u8 *)fade_color_cursor;
        D_800E9BA0 = (u8 *)(fade_commands + 2);
        fade_commands[0].w1 = 0;
        fade_commands[1].w0 = 0xFA000000;
        icon_fade = FIELD(((panel_slot * 2) + (u8 *)panel), s16 *, 0x18);
        action_kind = decoded_action_kind & 0xFF;
        fade_color_command = fade_color_cursor;
        if (icon_fade < 0x81) {
            icon_fade_color = icon_fade | ~0xFF;
        } else {
            icon_fade_color = -0x80;
        }
        ((volatile Gfx *)fade_color_command)->w1 = icon_fade_color;
        icon_bank_commands = (Gfx *)D_800E9BA0;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 1);
        icon_bank_commands[0].w0 = 0xE200001C;
        icon_bank_commands[0].w1 = 0x504240;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 2);
        icon_bank_commands[1].w0 = 0xFC119623;
        icon_bank_commands[1].w1 = 0xFF2FFFFF;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 3);
        icon_bank_commands[2].w0 = 0xFD500000;
        icon_bank_commands[2].w1 = (s32) (D_801F0B90 + 0x5B48);
        D_800E9BA0 = (u8 *)(icon_bank_commands + 4);
        icon_bank_commands[3].w0 = 0xF5500000;
        icon_bank_commands[3].w1 = 0x07000240;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 5);
        icon_bank_commands[4].w0 = 0xE6000000;
        icon_bank_commands[4].w1 = 0;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 6);
        icon_bank_commands[5].w0 = 0xF3000000;
        icon_bank_commands[5].w1 = 0x0703F800;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 7);
        icon_bank_commands[6].w0 = 0xE7000000;
        icon_bank_commands[6].w1 = 0;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 8);
        icon_bank_commands[7].w0 = 0xF5400200;
        icon_bank_commands[7].w1 = 0x240;
        D_800E9BA0 = (u8 *)(icon_bank_commands + 9);
        icon_bank_commands[8].w0 = 0xF2000000;
        icon_bank_commands[8].w1 = 0x3C03C;
        texture_data_word = (s32)D_801F36C0;
        do {
            texture_command_word = texture_data_word + 0x880;
        } while (0);
        if (action_kind == 3) {
            texture_command_word = texture_data_word + 0x8A0;
        }
        func_00152448(texture_command_word);
        rectangle_start = (Gfx *)D_800E9BA0;
        rectangle_work = (u32)rectangle_start + 8;
        rectangle_start[0].w0 = 0xE7000000;
        rectangle_start[0].w1 = 0;
        D_800E9BA0 = (u8 *)rectangle_work;
        D_800E9BA0 = (u8 *)(rectangle_start + 2);
        if (record_pool == 0) {
            rectangle_command = (Gfx *)rectangle_work;
            rectangle_word = (u32)(panel_x + 0xF2) << 18;
            rectangle_work = 0xE4000000;
            if ((s32)rectangle_word > 0) {
                goto pack_rectangle_right;
            }
        } else {
            rectangle_command = (Gfx *)rectangle_work;
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
        rectangle_command->w0 = rectangle_word;
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
                var_v0_1355 = panel_x + 0x47;
                if (record_pool == 0) {
                    var_v0_1355 = panel_x + 0x79;
                }
                lower_edge_word = ((var_v0_1355 * 4) & 0xFFC) << 0xC;
            }
        }
        if (record_pool == 0) {
            if ((s32)((u32)(panel_y + 0x1C) << 18) > 0) {
                goto block_204;
            }
        } else if ((s32)((u32)(panel_y + 0x34) << 18) > 0) {
block_204:
            var_v0_1376 = panel_y + 0x34;
            if (record_pool == 0) {
                var_v0_1376 = panel_y + 0x1C;
            }
            lower_edge_word |= (var_v0_1376 * 4) & 0xFFC;
        }
        texture_work = (u32)D_800E9BA0;
        rectangle_command->w1 = lower_edge_word;
        lower_edge_word = texture_work + 8;
        D_800E9BA0 = (u8 *)lower_edge_word;
        texture_command = (Gfx *)texture_work;
        texture_work = 0xE1000000;
        texture_command->w0 = texture_work;
        if (record_pool == 0) {
            var_a0_1396 = 0;
            if ((s32)((u32)(panel_x + 0x79) << 18) >= 0) {

            } else {
                goto block_211;
            }
        } else {
            var_a0_1396 = 0;
            if ((s32)((u32)(panel_x + 0x47) << 18) < 0) {
block_211:
                if (record_pool == 0) {
                    var_a0_1396 = 0;
                    if (((s16) ((panel_x + 0x79) * 4) * 0x11) >= 0) {

                    } else {
                        goto block_215;
                    }
                } else {
                    var_a0_1396 = 0;
                    if (((s16) ((panel_x + 0x47) * 4) * 0x11) < 0) {
block_215:
                        var_v1_1425 = panel_x + 0x47;
                        if (record_pool == 0) {
                            var_v1_1425 = panel_x + 0x79;
                        }
                        var_a0_1396 = (0 - ((s32) ((s16) (var_v1_1425 * 4) * 0x11) >> 4)) << 0x10;
                    }
                }
            }
        }
        if (record_pool == 0) {
            texture_work = (u32)(panel_y + 0x1C) << 2;
            if ((s32)texture_work < 0) {
                goto clip_texture_y;
            }
            texture_work = var_a0_1396 | 0x20;
        } else {
            texture_work = (u32)(panel_y + 0x34) << 2;
            if ((s32)texture_work < 0) {
clip_texture_y:
                if (record_pool == 0) {
                    texture_work = (u32)(panel_y + 0x1C) << 18;
                    if ((s32)texture_work < 0) {
                        goto pack_texture_y;
                    }
                    texture_work = var_a0_1396 | 0x20;
                } else {
                    texture_work = (u32)(panel_y + 0x34) << 18;
                    if ((s32)texture_work < 0) {
pack_texture_y:
                        var_v1_1463 = panel_y + 0x34;
                        if (record_pool == 0) {
                            var_v1_1463 = panel_y + 0x1C;
                        }
                        texture_work = var_a0_1396 | ((0x20 - ((s32)((u32)var_v1_1463 << 18) >> 13)) & 0xFFFF);
                    } else {
                        texture_work = var_a0_1396 | 0x20;
                    }
                }
            } else {
                texture_work = var_a0_1396 | 0x20;
            }
        }
        clipped_rectangle_tail = (Gfx *)D_800E9BA0;
        texture_command->w1 = texture_work;
        clipped_rectangle_tail[0].w0 = 0xF1000000;
        clipped_rectangle_tail[0].w1 = 0x880400;
        clipped_rectangle_tail[1].w0 = 0xE7000000;
        clipped_rectangle_tail[1].w1 = 0;
        clip_fade = FIELD(((u32)panel_slot * 2U + (u32)panel), s16 *, 0x18);
        D_800E9BA0 = (u8 *)(clipped_rectangle_tail + 1);
        D_800E9BA0 = (u8 *)(clipped_rectangle_tail + 2);
        func_000523b4(clip_fade);
        stat_texture = (Gfx *)D_800E9BA0;
        D_800E9BA0 = (u8 *)(stat_texture + 1);
        stat_texture[0].w0 = 0xE7000000;
        stat_texture[0].w1 = 0;
        D_800E9BA0 = (u8 *)(stat_texture + 2);
        stat_texture[1].w0 = 0xE3001001;
        stat_texture[1].w1 = 0x8000;
        D_800E9BA0 = (u8 *)(stat_texture + 3);
        stat_texture[2].w0 = 0xFD100000;
        stat_texture[2].w1 = (u32)D_80211508;
        D_800E9BA0 = (u8 *)(stat_texture + 4);
        stat_texture[3].w0 = 0xE8000000;
        stat_texture[3].w1 = 0;
        D_800E9BA0 = (u8 *)(stat_texture + 5);
        stat_texture[4].w0 = 0xF5000100;
        stat_texture[4].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(stat_texture + 6);
        stat_texture[5].w0 = 0xE6000000;
        stat_texture[5].w1 = 0;
        D_800E9BA0 = (u8 *)(stat_texture + 7);
        stat_texture[6].w0 = 0xF0000000;
        stat_texture[6].w1 = 0x0703C000;
        D_800E9BA0 = (u8 *)(stat_texture + 8);
        stat_texture[7].w0 = 0xE7000000;
        stat_texture[7].w1 = 0;
        D_800E9BA0 = (u8 *)(stat_texture + 9);
        stat_texture[8].w0 = 0xD7000002;
        stat_texture[8].w1 = 0x80008000;
        D_800E9BA0 = (u8 *)(stat_texture + 10);
        stat_texture[9].w0 = 0xFD500000;
        stat_texture[9].w1 = (u32)D_80211400;
        D_800E9BA0 = (u8 *)(stat_texture + 11);
        stat_texture[10].w0 = 0xF5500000;
        stat_texture[10].w1 = 0x07018060;
        D_800E9BA0 = (u8 *)(stat_texture + 12);
        stat_texture[11].w0 = 0xE6000000;
        stat_texture[11].w1 = 0;
        D_800E9BA0 = (u8 *)(stat_texture + 13);
        stat_texture[12].w0 = 0xF3000000;
        stat_texture[12].w1 = 0x0707F400;
        D_800E9BA0 = (u8 *)(stat_texture + 14);
        stat_texture[13].w0 = 0xE7000000;
        stat_texture[13].w1 = 0;
        D_800E9BA0 = (u8 *)(stat_texture + 15);
        stat_texture[14].w0 = 0xF5400400;
        stat_texture[14].w1 = 0x18060;
        D_800E9BA0 = (u8 *)(stat_texture + 16);
        stat_texture[15].w0 = 0xF2000000;
        stat_texture[15].w1 = 0x7C03C;
        if (D_8021B572 == 1) {
            var_a0_1617 = panel_x + 0xA4;
            if (record_pool == 0) {
                var_a0_1617 = panel_x + 0xD5;
            }
            var_a1_1621 = panel_y + 0x32;
            if (record_pool == 0) {
                var_a1_1621 = panel_y + 0x1A;
            }
            func_00154694(var_a0_1617, var_a1_1621, action_kind);
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
            var_a0_1740 = panel_x + 0x9C;
            if (record_pool == 0) {
                var_a0_1740 = panel_x + 0xD0;
            }
            var_a1_1744 = panel_y + 0x3B;
            if (record_pool == 0) {
                var_a1_1744 = panel_y + 0x23;
            }
            func_00151318(var_a0_1740, var_a1_1744, position_stat, -3);
            position_bonus = squad_member_slot != 0;
            position_bonus = leader_class_is_21 & position_bonus;
            temp_a2_1760 = position_bonus + (func_00044238(primary_class, secondary_class, position_kind) & 0xFF);
            if (record_pool == 0) {
                var_a0_1762 = panel_x + 0xE6;
            } else {
                var_a0_1762 = panel_x + 0xB2;
            }
            var_a1_1767 = panel_y + 0x39;
            if (record_pool == 0) {
                var_a1_1767 = panel_y + 0x21;
            }
            func_00154F0C(var_a0_1762, var_a1_1767, temp_a2_1760);
            var_v0_1772 = func_00044340(action_id);
        } else {
            var_v0_1772 = (char *)D_801E8564;
        }
        var_a1_1781 = panel_x + 0x47;
        if (record_pool == 0) {
            var_a1_1781 = panel_x + 0x79;
        }
        var_a2_1785 = panel_y + 0x34;
        if (record_pool == 0) {
            var_a2_1785 = panel_y + 0x1C;
        }
        func_0004ef34(var_v0_1772, var_a1_1781, var_a2_1785);
        func_0015394C();
        indexed_texture = (Gfx *)D_800E9BA0;
        D_800E9BA0 = (u8 *)(indexed_texture + 1);
        indexed_texture[0].w0 = 0xE7000000;
        indexed_texture[0].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 2);
        indexed_texture[1].w0 = 0xE3001001;
        indexed_texture[1].w1 = 0x8000;
        D_800E9BA0 = (u8 *)(indexed_texture + 3);
        indexed_texture[2].w0 = 0xFD100000;
        indexed_texture[2].w1 = D_8021B558[squad_member_slot];
        D_800E9BA0 = (u8 *)(indexed_texture + 4);
        indexed_texture[3].w0 = 0xE8000000;
        indexed_texture[3].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 5);
        indexed_texture[4].w0 = 0xF5000100;
        indexed_texture[4].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(indexed_texture + 6);
        indexed_texture[5].w0 = 0xE6000000;
        indexed_texture[5].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 7);
        indexed_texture[6].w0 = 0xF0000000;
        indexed_texture[6].w1 = 0x073FC000;
        D_800E9BA0 = (u8 *)(indexed_texture + 8);
        indexed_texture[7].w0 = 0xE7000000;
        indexed_texture[7].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 9);
        indexed_texture[8].w0 = 0xD7000002;
        indexed_texture[8].w1 = 0x80008000;
        D_800E9BA0 = (u8 *)(indexed_texture + 10);
        indexed_texture[9].w0 = 0xFD500000;
        indexed_texture[9].w1 = D_8021B528[squad_member_slot];
        D_800E9BA0 = (u8 *)(indexed_texture + 11);
        indexed_texture[10].w0 = 0xF5500000;
        indexed_texture[10].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(indexed_texture + 12);
        indexed_texture[11].w0 = 0xE6000000;
        indexed_texture[11].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 13);
        indexed_texture[12].w0 = 0xF3000000;
        indexed_texture[12].w1 = 0x073BF19A;
        D_800E9BA0 = (u8 *)(indexed_texture + 14);
        indexed_texture[13].w0 = 0xE7000000;
        indexed_texture[13].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 15);
        indexed_texture[14].w0 = 0xF5480A00;
        indexed_texture[14].w1 = 0;
        D_800E9BA0 = (u8 *)(indexed_texture + 16);
        indexed_texture[15].w0 = 0xF2000000;
        indexed_texture[15].w1 = 0x9C0BC;
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
        fatigue_texture = (Gfx *)D_800E9BA0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 1);
        fatigue_texture[0].w0 = 0xE7000000;
        fatigue_texture[0].w1 = 0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 2);
        fatigue_texture[1].w0 = 0xE3001001;
        fatigue_texture[1].w1 = 0x8000;
        D_800E9BA0 = (u8 *)(fatigue_texture + 3);
        fatigue_texture[2].w0 = 0xFD100000;
        fatigue_texture[2].w1 = (u32)D_801EC740;
        D_800E9BA0 = (u8 *)(fatigue_texture + 4);
        fatigue_texture[3].w0 = 0xE8000000;
        fatigue_texture[3].w1 = 0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 5);
        fatigue_texture[4].w0 = 0xF5000100;
        fatigue_texture[4].w1 = 0x07000000;
        D_800E9BA0 = (u8 *)(fatigue_texture + 6);
        fatigue_texture[5].w0 = 0xE6000000;
        fatigue_texture[5].w1 = 0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 7);
        fatigue_texture[6].w0 = 0xF0000000;
        fatigue_texture[6].w1 = 0x0703C000;
        D_800E9BA0 = (u8 *)(fatigue_texture + 8);
        fatigue_texture[7].w0 = 0xE7000000;
        fatigue_texture[7].w1 = 0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 9);
        fatigue_texture[8].w0 = 0xFD500000;
        fatigue_texture[8].w1 = (u32)D_801EC760;
        D_800E9BA0 = (u8 *)(fatigue_texture + 10);
        fatigue_texture[9].w0 = 0xF5500000;
        fatigue_texture[9].w1 = 0x07018060;
        D_800E9BA0 = (u8 *)(fatigue_texture + 11);
        fatigue_texture[10].w0 = 0xE6000000;
        fatigue_texture[10].w1 = 0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 12);
        fatigue_texture[11].w0 = 0xF3000000;
        fatigue_texture[11].w1 = 0x071FF200;
        D_800E9BA0 = (u8 *)(fatigue_texture + 13);
        fatigue_texture[12].w0 = 0xE7000000;
        fatigue_texture[12].w1 = 0;
        D_800E9BA0 = (u8 *)(fatigue_texture + 14);
        fatigue_texture[13].w0 = 0xF5480800;
        fatigue_texture[13].w1 = 0x18060;
        D_800E9BA0 = (u8 *)(fatigue_texture + 15);
        fatigue_texture[14].w0 = 0xF2000000;
        fatigue_texture[14].w1 = 0x7C07C;
        if (member_index < 0x64) {
            float fatigue_ratio;

            if (record_pool == 0) {
                var_v0_2058 = D_80193BC0[member_index].record.fatigue;
                fatigue_ratio = 100.0f;
            } else {
                var_v0_2058 = D_80195560[member_index].fatigue;
                fatigue_ratio = 100.0f;
            }
            var_s1_2082 = 0;
            fatigue_ratio = (float)var_v0_2058 / fatigue_ratio;
            if (fatigue_ratio >= 0.7f) {
                var_s1_2082 = 0x10;
            }
            if (record_pool == 0) {
                var_v0_2092 = D_80193BC0[member_index].record.fatigue;
            } else {
                var_v0_2092 = D_80195560[member_index].fatigue;
            }
            fatigue_bar_height = (var_v0_2092 * 0x10) / 100;
            fatigue_bar_height = 0x10 - fatigue_bar_height;
            if (record_pool == 0) {
                var_a0_2116 = panel_x + 0xBC;
            } else {
                var_a0_2116 = panel_x + 0x3A;
            }
            var_a1_2121 = panel_y + 1;
            if (record_pool == 0) {
                var_a1_2121 = panel_y + 0x3A;
            }
            var_a2_2125 = panel_x + 0x4A;
            if (record_pool == 0) {
                var_a2_2125 = panel_x + 0xCC;
            }
            var_a3_2129 = panel_y + 0x11;
            if (record_pool == 0) {
                var_a3_2129 = panel_y + 0x4A;
            }
            func_00188B60(var_a0_2116, var_a1_2121, var_a2_2125, var_a3_2129, 0, var_s1_2082);
            var_a0_2136 = panel_x + 0x3A;
            if (record_pool == 0) {
                var_a0_2136 = panel_x + 0xBC;
            }
            var_v0_2140 = fatigue_bar_height + 1;
            if (record_pool == 0) {
                var_v0_2140 = fatigue_bar_height + 0x3A;
            }
            bar_y = panel_y + var_v0_2140;
            if (record_pool == 0) {
                var_a2_2146 = panel_x + 0xCC;
            } else {
                var_a2_2146 = panel_x + 0x4A;
            }
            var_a3_2151 = panel_y + 0x11;
            if (record_pool == 0) {
                var_a3_2151 = panel_y + 0x4A;
            }
            var_v0_2140 = 0x10;
            func_00188B60(var_a0_2136, bar_y, var_a2_2146, var_a3_2151, var_v0_2140, fatigue_bar_height + var_s1_2082);
            extended_draw_sync = (Gfx *)D_800E9BA0;
            D_800E9BA0 = (u8 *)(extended_draw_sync + 1);
            extended_draw_sync[0].w0 = 0xE7000000;
            extended_draw_sync[0].w1 = 0;
        }
        scissor_packet = (Gfx *)D_800E9BA0;
        scissor_work = 0xE7000000;
        scissor_packet[0].w0 = scissor_work;
        scissor_packet[0].w1 = 0;
        clip_left = FIELD(panel, s32 *, 0x7C);
        scissor_work = (u32)(scissor_packet + 1);
        D_800E9BA0 = (u8 *)scissor_work;
        D_800E9BA0 = (u8 *)(scissor_packet + 2);
        if (clip_left >= 0) {
            scissor_command = (Gfx *)scissor_work;
            scissor_work = (((s32)((float)clip_left * 4.0f) & 0xFFF) << 12) | 0xED000000;
        } else {
            scissor_command = (Gfx *)scissor_work;
            scissor_work = 0xED000000;
        }
        temp_v0_2200 = FIELD(panel, s32 *, 0x80) - 8;
        clip_left = scissor_work;
        if (temp_v0_2200 >= 0) {
            clip_left |= (s32) ((float) temp_v0_2200 * 4.0f) & 0xFFF;
        }
        scissor_command->w0 = clip_left;
        temp_v1_2216 = FIELD(panel, s32 *, 0x84);
        if (temp_v1_2216 != 0x140) {
            var_a0_2231 = ((s32) ((float) temp_v1_2216 * 4.0f) & 0xFFF) << 0xC;
        } else {
            var_a0_2231 = 0x4FC000;
        }
        temp_v1_2236 = FIELD(panel, s32 *, 0x88) + 0x24;
        if (temp_v1_2236 != 0xF0) {
            var_v0_2239 = var_a0_2231 | ((s32) ((float) temp_v1_2236 * 4.0f) & 0xFFF);
        } else {
            var_v0_2239 = var_a0_2231 | 0x3BC;
        }
        description_draw_sync = (Gfx *)D_800E9BA0;
        notice_counter = D_8021B571;
        scissor_command->w1 = var_v0_2239;
        D_800E9BA0 = (u8 *)(description_draw_sync + 1);
        notice_counter_running = notice_counter != 0;
        temp_a0_2262 = notice_counter < 15U;
        show_notice = notice_counter_running & temp_a0_2262;
        description_draw_sync[0].w0 = 0xE7000000;
        description_draw_sync[0].w1 = 0;
        if (show_notice && panel == func_00055308()) {
            notice_x = panel_x + 5;
            if (D_8021B56D == 0) {
                description_draw_packet = (Gfx *)D_800E9BA0;
                D_800E9BA0 = (u8 *)(description_draw_packet + 1);
                description_draw_packet[0].w0 = 0xDE000000;
                description_draw_packet[0].w1 = (u32)D_801EB1D0;
                D_800E9BA0 = (u8 *)(description_draw_packet + 2);
                description_draw_packet[1].w0 = 0xE7000000;
                description_draw_packet[1].w1 = 0;
                if (record_pool == 0) {
                    var_a1_2292 = panel_y + 0x5F;
                } else {
                    var_a1_2292 = panel_y + 0x57;
                }
                notice_right = panel_x + 0x11;
                if (record_pool == 0) {
                    var_a3_2299 = panel_y + 0x6F;
                } else {
                    var_a3_2299 = panel_y + 0x67;
                }
                func_00188B60(notice_x, var_a1_2292, notice_right, var_a3_2299, 0x11, 0);
                var_a0_2308 = panel_x + 0xB6;
                if (record_pool == 0) {
                    var_a0_2308 = panel_x + 0xE8;
                }
                var_a1_2312 = panel_y + 0x57;
                if (record_pool == 0) {
                    var_a1_2312 = panel_y + 0x5F;
                }
                var_a2_2316 = panel_x + 0xC2;
                if (record_pool == 0) {
                    var_a2_2316 = panel_x + 0xF4;
                }
                var_a3_2320 = panel_y + 0x67;
                if (record_pool == 0) {
                    var_a3_2320 = panel_y + 0x6F;
                }
                func_00188B60(var_a0_2308, var_a1_2312, var_a2_2316, var_a3_2320, 3, 0);
            }
        }
        description_counter = D_8021B571;
        if (description_counter != 0) {
            if (panel == func_00055308()) {
                D_8021B571 = (u8) (D_8021B571 + 1);
            }
        }
        if (D_8021B571 >= 31U) {
            selector_work = 1;
            D_8021B571 = selector_work;
        }
        selector_work = D_801F36A0;
        description_member = D_801F401C;
        selector_work &= 1;
        selector_work <<= 1;
        if (description_member >= 100) {
            description_selector = selector_work | 1;
        } else {
            description_selector = selector_work;
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









