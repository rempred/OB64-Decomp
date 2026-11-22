#include "game/combat_selector.h"
#include "game/combat_state.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

typedef struct {
    s16 origin_x;
    s16 origin_y;
    u8 unk_04[4];
    s16 lower_x;
    s16 lower_y;
    u16 upper_x;
    u16 upper_y;
    u16 flags;
    u8 unk_12[2];
    Func001F1218State state;
} PrimaryRecord;

typedef union {
    Func001F1218State update;
    Func001F0E64Record selector;
} SecondaryState;

typedef struct {
    u8 unk_00[0x1E];
    s16 position;
    u8 unk_20[0x24];
    SecondaryState state;
} SecondaryCore;

typedef struct {
    SecondaryCore core;
    u32 flags;
} SecondaryRecord;

typedef struct {
    SecondaryRecord *record;
    u8 unk_04[0x28];
    u16 reset_base;
    u8 unk_2E[0xA];
    u16 frame_limit;
    u16 frame_step;
    u8 unk_3C[0xC];
    s32 extent;
} SecondaryEntry;

extern u8 * volatile D_801CE8C0;
extern s8 D_801CEAA9;
extern u8 *D_801D07D0;
extern u32 D_801D07D4;
extern u32 D_801D07D8;
extern u32 D_801D07E0;
extern u16 D_801D07F4;
extern u16 D_801D07F6;
extern u16 D_801D07F8;
extern u16 D_801D07FA;
extern u16 D_801D07FC;
extern u16 D_801D07FE;
extern u16 D_801D0800;
extern u16 D_801D0802;
extern s16 D_801D0804;
extern s16 D_801D0806;
extern s16 D_801D0808;
extern s16 D_801D080A;
extern s8 D_801D080C;
extern s8 D_801D080D;

void func_001FF8E0(void);
void func_002013D0(void);

void func_001FFE80(void)
{
    /* The primary correction and secondary position use disjoint live ranges.
     * Sharing their real short keeps the required KMC allocation order. */
    s16 original_short;
    s16 temp_v1_35;
    s16 temp_v0_36;
    s16 temp_v0_47;
    s16 temp_a0_48;
    s16 temp_a0_60;
    s16 temp_v1_61;
    s16 temp_v0_62;
    s16 temp_v0_73;
    s16 temp_a0_74;
    s16 temp_s3_123;
    s32 temp_v0_118;
    s16 temp_v1_119;
    s16 temp_v1_125;
    s32 temp_v0_121;
    s32 var_s1_19;
    s32 var_s4_97;
    u16 temp_s0_103;
    u16 temp_s0_140;
    u16 temp_s1_141;
    u16 temp_v0_126;
    u32 index;
    u8 temp_v0_159;
    u8 temp_v0_161;
    u8 temp_v0_172;
    u8 temp_v0_174;
    SecondaryRecord *temp_a0_102;
    SecondaryCore *temp_a0_117;
    u32 temp_a1_112;
    SecondaryEntry *temp_a3_120;
    PrimaryRecord *temp_s0_27;
    SecondaryRecord *temp_s2_113;
    SecondaryEntry *temp_v0_101;
    void *temp_v1_158;
    /* Retain the existing unaccessed automatic reserve from the production
     * source. Removing it changes KMC frame152 to128; its original type and
     * purpose are unknown. No new reserve is introduced by this retry. */
    s32 frame_padding[6];

    index = 0;
    if (D_801D07D4 != 0) {
        var_s1_19 = 0;
        do {
            temp_s0_27 = (PrimaryRecord *)(D_801D07D0 + var_s1_19);
            func_001F1218(&temp_s0_27->state, 0x100, 0, 0, 0);
            if (temp_s0_27->flags & 1) {
                original_short = temp_s0_27->lower_x;
                temp_v1_35 = temp_s0_27->state.field0C;
                if (original_short > temp_s0_27->origin_x + temp_v1_35) {
                    temp_s0_27->state.field0C =
                        (s16)(temp_s0_27->upper_x + temp_v1_35 - original_short);
                }
                temp_v0_47 = (s16)*(u16 *)((s8 *)temp_s0_27 + 0xC);
                temp_a0_48 = *(s16 *)((s8 *)temp_s0_27 + 0x20);
                if (temp_v0_47 < *(s16 *)temp_s0_27 + temp_a0_48) {
                    *(s16 *)((s8 *)temp_s0_27 + 0x20) =
                        (s16)((u16)*(s16 *)((s8 *)temp_s0_27 + 8) +
                              temp_a0_48 - temp_v0_47);
                }
                temp_a0_60 = temp_s0_27->lower_y;
                temp_v1_61 = temp_s0_27->state.field0E;
                if (temp_a0_60 > temp_s0_27->origin_y + temp_v1_61) {
                    temp_s0_27->state.field0E =
                        (s16)(temp_s0_27->upper_y + temp_v1_61 - temp_a0_60);
                }
                temp_v0_73 = (s16)*(u16 *)((s8 *)temp_s0_27 + 0xE);
                temp_a0_74 = *(s16 *)((s8 *)temp_s0_27 + 0x22);
                if (temp_v0_73 < *(s16 *)((s8 *)temp_s0_27 + 2) + temp_a0_74) {
                    *(s16 *)((s8 *)temp_s0_27 + 0x22) =
                        (s16)((u16)*(s16 *)((s8 *)temp_s0_27 + 0xA) +
                              temp_a0_74 - temp_v0_73);
                }
            }
            index++;
            var_s1_19 += 0x64;
        } while (index < D_801D07D4);
    }

    index = 0;
    if (D_801D07E0 != 0) {
        var_s4_97 = 0;
        do {
            temp_v0_101 = (SecondaryEntry *)(var_s4_97 + D_801D07D8);
            temp_a0_102 = temp_v0_101->record;
            temp_s0_103 = temp_a0_102->core.state.selector.field_04;
            /* This call also reads the pointer at enclosing offset 0x90. */
            func_001F1218(&temp_a0_102->core.state.update,
                          temp_v0_101->extent,
                          0,
                          0,
                          0);
            temp_a1_112 = var_s4_97 + D_801D07D8;
            temp_s2_113 = ((SecondaryEntry *)temp_a1_112)->record;
            temp_a0_117 = &temp_s2_113->core;
            /* KMC joins these identical flag tests after alias analysis.
             * This preserves the measured record/core copy at the join. */
            if (temp_s0_103 == 0) {
                if (!(temp_s2_113->flags & 0x10)) {
                    goto next_entry;
                }
            } else {
                if (!(temp_s2_113->flags & 0x10)) {
                    goto next_entry;
                }
            }
            temp_v0_118 = temp_a0_117->position;
            temp_v1_119 = (s16)temp_a0_117->state.selector.field_0E;
            temp_a3_120 = (SecondaryEntry *)temp_a1_112;
            original_short = (s16)temp_v0_118;
            temp_s3_123 = temp_v1_119;
            temp_v0_121 = temp_v0_118 + temp_v1_119;
            /* Keep the existing late-joined sign checks: collapsing them
             * early coalesces the original-position copy in KMC. */
            if (temp_s2_113 == 0) {
                if (0 <= temp_v0_121) {
                    goto next_entry;
                }
            } else {
                if (0 <= temp_v0_121) {
                    goto next_entry;
                }
            }
            temp_v1_125 = (s16)temp_a0_117->state.selector.field_04;
            if (temp_v1_125 != temp_s0_103) {
                temp_v0_126 = temp_a3_120->reset_base;
                temp_a0_117->state.selector.field_0C = 0;
                temp_a0_117->state.selector.field_10 = 0;
                temp_a0_117->state.selector.field_0E = (s16)(temp_v0_126 - original_short);
                goto next_entry;
            }
            if (temp_v1_125 < ((SecondaryEntry *)temp_a1_112)->frame_limit) {
                temp_s0_140 = temp_s2_113->core.state.selector.field_0C;
                temp_s1_141 = temp_s2_113->core.state.selector.field_10;
                func_001F0E64(&temp_s2_113->core.state.selector,
                             temp_v1_125 +
                                 ((SecondaryEntry *)temp_a1_112)->frame_step);
                temp_s2_113->core.state.selector.field_0C = temp_s0_140;
                temp_s2_113->core.state.selector.field_0E = temp_s3_123;
                temp_s2_113->core.state.selector.field_10 = temp_s1_141;
            }
next_entry:
            index++;
            var_s4_97 += 0xF8;
        } while (index < D_801D07E0);
    }

    do {
        func_001FF8E0();
    } while (0);

    temp_v1_158 = D_801CE8C0;
    temp_v0_159 = *(u8 *)((s8 *)temp_v1_158 + 0x82C);
    if (temp_v0_159 != 0) {
        temp_v0_159--;
        *(u8 *)((s8 *)temp_v1_158 + 0x82C) = temp_v0_159;
        if (!(temp_v0_159 & 0xFF)) {
            D_801CEAA9 = 0;
        }
        temp_v1_158 = D_801CE8C0;
    }

    temp_v0_172 = *(u8 *)((s8 *)temp_v1_158 + 0x82D);
    if (temp_v0_172 != 0) {
        temp_v0_172--;
        *(u8 *)((s8 *)temp_v1_158 + 0x82D) = temp_v0_172;
        if (!(temp_v0_172 & 0xFF)) {
            D_801D0804 = 0;
            D_801D0806 = 0;
            D_801D0808 = 0;
            D_801D080A = 0;
            D_801D080C = 2;
            D_801D080D = 0;
            D_801D07FC = D_801D07F4;
            D_801D07FE = D_801D07F6;
            D_801D0800 = D_801D07F8;
            D_801D0802 = D_801D07FA;
        }
    }

    do {
        func_002013D0();
    } while (0);
    return;
}
