typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;

void *func_00070F30(s32);
s32 func_000712C4(void *);
f32 func_001BC35C(s16, s16);
f32 func_0023D178(f32, f32);
extern void *D_8022A974;

void func_002A0EF0(void) {
    f32 temp_f2_246;
    f32 temp_f4_113;
    f32 temp_f6_231;
    f32 var_f4_261;
    f32 var_f20;
    s32 temp_a0_198;
    s32 temp_a0_19;
    s32 temp_a3_38;
    s32 temp_s1_89;
    s32 temp_s3_200;
    s32 var_a0_243;
    s32 var_a2_34;
    s32 var_s4_193;
    s32 var_v0_250;
    s32 var_v0_36;
    s32 var_v0_68;
    s32 var_v0_77;
    s32 var_v1_60;
    s32 temp_v0_230;
    s32 temp_v0_245;
    s32 var_s4;
    s32 var_s3;
    void *temp_a0_41;
    void *temp_a1_40;
    void *temp_s0_209;
    void *temp_s0_29;
    void *temp_s1_202;
    void *temp_s2_206;
    void *temp_s2_23;
    void *temp_v0_96;
    void *temp_v1_201;
    void *temp_v1_22;

    var_s4 = 0;
    var_s3 = 2;
loop_1:
    temp_a0_19 = (s32)D_8022A974;
    temp_v1_22 = ((s32) (var_s4 << 0x10) >> 0xE) + temp_a0_19;
    temp_s2_23 = *(void **)((s8 *)temp_v1_22 + 0xF8);
    if (temp_s2_23 == 0) {
        goto block_41;
    }
    temp_s0_29 = *(void **)((s8 *)temp_v1_22 + 0x18);
    if (*(u8 *)0x8018FC19 != var_s3) {
        goto block_27;
    }
    var_a2_34 = 0;
    if (!(*(s32 *)0x80197B14 & 8)) {
        goto block_27;
    }
    var_v0_36 = 0 << 0x10;
loop_5:
    temp_a3_38 = var_v0_36 >> 0x10;
    temp_a1_40 = (temp_a3_38 * 4) + temp_a0_19;
    temp_a0_41 = *(void **)((s8 *)temp_a1_40 + 0x18);
    if (temp_a0_41 != 0) {
        goto block_7;
    }
    var_a2_34 += 1;
    goto block_22;
block_7:
    if (temp_a0_41 != temp_s0_29) {
        goto block_10;
    }
    var_a2_34 += 1;
    goto block_22;
block_10:
    var_a2_34 += 1;
    if (*(u8 *)((s8 *)temp_a0_41 + 0x147) == *(u8 *)((s8 *)temp_s0_29 + 0x147)) {
        goto block_22;
    }
    if (*(s32 *)((s8 *)temp_a1_40 + 0x88) != 0) {
        goto block_22;
    }
    var_v1_60 = (s32)(*(f32 *)((s8 *)temp_a0_41 + 0x11C) - *(f32 *)((s8 *)temp_s0_29 + 0x11C));
    if (var_v1_60 >= 0) {
        goto block_15;
    }
    var_v1_60 = 0 - var_v1_60;
    goto block_17;
block_15:
block_17:
    var_v0_68 = (s32)(*(f32 *)((s8 *)temp_a0_41 + 0x124) - *(f32 *)((s8 *)temp_s0_29 + 0x124));
    if (var_v0_68 >= 0) {
        goto block_19;
    }
    var_v0_68 = 0 - var_v0_68;
    goto block_21;
block_19:
block_21:
    var_v0_77 = temp_a3_38;
    if ((var_v0_68 < 0x14) & (var_v1_60 < 0x14)) {
        goto block_24;
    }
block_22:
    var_v0_36 = var_a2_34 << 0x10;
    if ((u32)(var_a2_34 & 0xFFFF) < 0x1CU) {
        goto loop_5;
    }
    var_v0_77 = -1;
block_24:
    temp_s1_89 = (s16)var_v0_77 * 4;
    if ((s16)var_v0_77 == -1) {
        goto block_27;
    }
    if (*(s32 *)((s8 *)(temp_s1_89 + D_8022A974) + 0x88) != 0) {
        goto block_27;
    }
    temp_v0_96 = func_00070F30(4);
    *(void **)((s8 *)(temp_s1_89 + D_8022A974) + 0x88) = temp_v0_96;
    *(s8 *)((s8 *)temp_v0_96 + 3) = var_s4;
block_27:
    if (*(u8 *)((s8 *)temp_s2_23 + 0xE) != 0) {
        goto block_36;
    }
    *(f32 *)((s8 *)temp_s0_29 + 0x11C) = *(f32 *)((s8 *)temp_s0_29 + 0x11C) + *(f32 *)((s8 *)temp_s2_23 + 0);
    temp_f4_113 = *(f32 *)((s8 *)temp_s0_29 + 0x124) + *(f32 *)((s8 *)temp_s2_23 + 8);
    *(f32 *)((s8 *)temp_s0_29 + 0x124) = temp_f4_113;
    if (*(u8 *)0x8018FC19 != var_s3) {
        goto block_32;
    }
    if (!(*(u8 *)((s8 *)temp_s0_29 + 0x145) & 1)) {
        goto block_32;
    }
    *(f32 *)((s8 *)temp_s0_29 + 0x120) = func_001BC35C(
        (s16)(s32)*(f32 *)((s8 *)temp_s0_29 + 0x11C),
        (s16)(s32)temp_f4_113);
    goto block_35;
block_32:
    if (*(void **)0x8018FC19 != 0) {
        goto block_35;
    }
    if (!(*(u8 *)((s8 *)temp_s0_29 + 0x145) & 1)) {
        goto block_35;
    }
    *(f32 *)((s8 *)temp_s0_29 + 0x120) = func_0023D178(
        *(f32 *)((s8 *)temp_s0_29 + 0x11C),
        *(f32 *)((s8 *)temp_s0_29 + 0x124));
block_35:
    *(u16 *)((s8 *)temp_s2_23 + 0xC) = *(u16 *)((s8 *)temp_s2_23 + 0xC) - 1;
block_36:
    if ((s16)*(u16 *)((s8 *)temp_s2_23 + 0xC) != 0) {
        goto block_38;
    }
    func_000712C4(temp_s2_23);
    *(s32 *)((s8 *)(((s32)(var_s4 << 0x10) >> 0xE) + D_8022A974) + 0xF8) = 0;
block_38:
    if (*(u8 *)0x8018FC19 != var_s3) {
        goto block_41;
    }
    if (!(*(u8 *)((s8 *)temp_s0_29 + 0x145) & 1)) {
        goto block_41;
    }
    *(f32 *)((s8 *)temp_s0_29 + 0x120) = func_001BC35C(
        (s16)(s32)*(f32 *)((s8 *)temp_s0_29 + 0x11C),
        (s16)(s32)*(f32 *)((s8 *)temp_s0_29 + 0x124));
block_41:
    var_s4 += 1;
    if ((u32)(var_s4 & 0xFFFF) < 0x1CU) {
        goto loop_1;
    }
    var_s4 = 0;
    var_f20 = 20.0f;
loop_43:
    temp_a0_198 = (s32)D_8022A974;
    temp_s3_200 = (s32)(var_s4 << 0x10) >> 0xE;
    temp_v1_201 = temp_s3_200 + temp_a0_198;
    temp_s1_202 = *(void **)((s8 *)temp_v1_201 + 0x88);
    if (temp_s1_202 == 0) {
        goto block_64;
    }
    temp_s2_206 = *(void **)((s8 *)temp_v1_201 + 0x18);
    temp_s0_209 = *(void **)((s8 *)((*(u8 *)((s8 *)temp_s1_202 + 3) * 4) + temp_a0_198) + 0x18);
    if (((temp_s2_206 == 0) | (temp_s0_209 == 0)) != 0) {
        goto block_63;
    }
    temp_v0_230 = (s32)(*(f32 *)((s8 *)temp_s2_206 + 0x124) - *(f32 *)((s8 *)temp_s0_209 + 0x124));
    if (temp_v0_230 >= 0) {
        goto block_47;
    }
    temp_v0_230 = -temp_v0_230;
    goto block_49;
block_47:
block_49:
    temp_f6_231 = (f32)temp_v0_230;
    temp_v0_245 = (s32)(*(f32 *)((s8 *)temp_s2_206 + 0x11C) - *(f32 *)((s8 *)temp_s0_209 + 0x11C));
    if (temp_v0_245 >= 0) {
        goto block_51;
    }
    temp_v0_245 = -temp_v0_245;
    goto block_53;
block_51:
block_53:
    temp_f2_246 = (f32)temp_v0_245;
    var_a0_243 = temp_f6_231 < var_f20;
block_55:
    var_v0_250 = temp_f2_246 < var_f20;
block_57:
    if (!(var_a0_243 & var_v0_250)) {
        goto block_63;
    }
    var_f4_261 = __builtin_sqrtf((temp_f2_246 * temp_f2_246) + (temp_f6_231 * temp_f6_231));
block_60:
    var_v0_250 = (s32)(0x14 - (s16)(s32)var_f4_261) / 2;
    *(s16 *)((s8 *)temp_s1_202 + 0) = (s16)var_v0_250;
    if (!((*(f32 *)((s8 *)temp_s2_206 + 0x124) - *(f32 *)((s8 *)temp_s0_209 + 0x124)) < 0.0f)) {
        goto block_64;
    }
    *(s16 *)((s8 *)temp_s1_202 + 0) = (s16)-var_v0_250;
    goto block_64;
block_63:
    func_000712C4(temp_s1_202);
    *(s32 *)((s8 *)(temp_s3_200 + D_8022A974) + 0x88) = 0;
block_64:
    var_s4 += 1;
    if ((u32)(var_s4 & 0xFFFF) < 0x1CU) {
        goto loop_43;
    }
}
