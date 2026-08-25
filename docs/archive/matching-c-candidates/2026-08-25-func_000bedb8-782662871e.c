typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef signed long long s64;
typedef unsigned long long u64;
typedef float f32;
typedef double f64;
typedef s32 M2C_UNK;
typedef s8 M2C_UNK8;
typedef s16 M2C_UNK16;
typedef s32 M2C_UNK32;
typedef s64 M2C_UNK64;
s32 func_000415fc(s32);                                         
s32 func_00045df4(M2C_UNK);                                     
s32 func_000bec90(s32, s32);                                    
s32 func_000bf228(s32);                                         
u32 func_000bf9c8(s32, u8);                                     
s32 func_000c37ec(s32, u8, u8);                                 

s32 func_000bedb8(s32 arg0, s8 arg1) {
    u32 var_s2;
    s32 var_s5_168;
    void *temp_s6_30;
    u32 var_s7;
    s32 temp_v1_192;
    s32 var_s1_13;
    u32 var_s0;
    s32 var_s4_169;
    s32 var_v0_206;
    s32 var_v0_234;
    s32 var_v0_52;
    s32 var_v0_75;
    s32 var_v1_239;
    u8 temp_a1_34;
    u8 temp_a2_39;
    u8 temp_v1_109;
    u8 temp_v1_121;
    u8 temp_v1_133;
    u8 temp_v1_145;
    u8 temp_v1_157;
    u8 temp_v1_71;
    u8 temp_v1_85;
    u8 temp_v1_97;
    u8 var_a0_31;
    u32 var_s3;
    void *temp_v0_237;
    void *temp_v1_201;
    volatile u8 selected_slot[8];

    selected_slot[7] = arg1;
    var_s1_13 = 1;
    (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x5ED))) = 0;
    temp_s6_30 = ((arg0 & 0xFF) * 0x38) + 0x80193BC0;
    var_a0_31 = (*(u8 *)((s8 *)(temp_s6_30) + (0x12)));
    temp_a1_34 = (*(u8 *)((s8 *)(temp_s6_30) + (0x11)));
    temp_a2_39 = (*(u8 *)((s8 *)((temp_a1_34 + 0x801F0000)) + (-0xC48)));
    var_s0 = (u32)(*(u8 **)(*(u8 **)0x80196AF8 + 0x80) + (selected_slot[7] * 8));
    if (temp_a2_39 == 0) {
        goto block_3;
    }
    if ((*(u8 *)((s8 *)(((temp_a1_34 * 0x48) + 0x80180000)) + (0x7C59))) != var_a0_31) {
        goto block_3;
    }
    var_a0_31 = temp_a2_39;
block_3:
    var_s3 = var_a0_31 & 0xFF;
    if ((var_s1_13 & 0xFF) == 0) {
        goto block_59;
    }
    var_s2 = selected_slot[7];
    if (!(func_000c37ec(var_s3, var_s2, temp_a2_39) & 0xFF)) {
        var_s1_13 = 0;
        (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x5ED))) = 1;
    }
    if ((var_s1_13 & 0xFF) == 0) {
        goto block_59;
    }
    temp_v1_71 = (*(u8 *)((s8 *)var_s0 + (0)));
    var_v0_75 = var_s1_13 & 0xFF;
    if ((temp_v1_71 & 0xFF) == 0xFF) {
        goto block_9;
    }
    var_s1_13 &= 0 - ((u16) (*(u16 *)((s8 *)(temp_s6_30) + (0x1C))) >= temp_v1_71);
    var_v0_75 = var_s1_13 & 0xFF;
block_9:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_75 == 0) {
        goto block_59;
    }
    temp_v1_85 = (*(u8 *)((s8 *)var_s0 + (1)));
    if (temp_v1_85 == 0xFF) {
        goto block_12;
    }
    var_s1_13 &= 0 - ((u16) (*(u16 *)((s8 *)(temp_s6_30) + (0x1E))) >= temp_v1_85);
    var_v0_52 = var_s1_13 & 0xFF;
block_12:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 == 0) {
        goto block_59;
    }
    temp_v1_97 = (*(u8 *)((s8 *)var_s0 + (2)));
    if (temp_v1_97 == 0xFF) {
        goto block_15;
    }
    var_s1_13 &= 0 - ((u16) (*(u16 *)((s8 *)(temp_s6_30) + (0x20))) >= temp_v1_97);
    var_v0_52 = var_s1_13 & 0xFF;
block_15:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 == 0) {
        goto block_59;
    }
    temp_v1_109 = (*(u8 *)((s8 *)var_s0 + (3)));
    if (temp_v1_109 == 0xFF) {
        goto block_18;
    }
    var_s1_13 &= 0 - ((u16) (*(u16 *)((s8 *)(temp_s6_30) + (0x22))) >= temp_v1_109);
    var_v0_52 = var_s1_13 & 0xFF;
block_18:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 == 0) {
        goto block_59;
    }
    temp_v1_121 = (*(u8 *)((s8 *)var_s0 + (4)));
    if (temp_v1_121 == 0xFF) {
        goto block_21;
    }
    var_s1_13 &= 0 - ((u16) (*(u16 *)((s8 *)(temp_s6_30) + (0x24))) >= temp_v1_121);
    var_v0_52 = var_s1_13 & 0xFF;
block_21:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 == 0) {
        goto block_59;
    }
    temp_v1_133 = (*(u8 *)((s8 *)var_s0 + (5)));
    if (temp_v1_133 == 0xFF) {
        goto block_24;
    }
    var_s1_13 &= 0 - ((u16) (*(u16 *)((s8 *)(temp_s6_30) + (0x26))) >= temp_v1_133);
    var_v0_52 = var_s1_13 & 0xFF;
block_24:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 == 0) {
        goto block_59;
    }
    temp_v1_145 = (*(u8 *)((s8 *)var_s0 + (6)));
    if (temp_v1_145 == 0xFF) {
        goto block_27;
    }
    var_s1_13 &= 0 - ((u8) (*(u8 *)((s8 *)(temp_s6_30) + (0x1B))) >= temp_v1_145);
    var_v0_52 = var_s1_13 & 0xFF;
block_27:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 == 0) {
        goto block_59;
    }
    temp_v1_157 = (*(u8 *)((s8 *)var_s0 + (7)));
    if (temp_v1_157 == 0xFF) {
        goto block_30;
    }
    var_s1_13 &= 0 - (temp_v1_157 >= (u8) (*(u8 *)((s8 *)(temp_s6_30) + (0x1B))));
    var_v0_52 = var_s1_13 & 0xFF;
block_30:
    var_s5_168 = 0;
    if (var_v0_52 == 0) {
        goto block_58;
    }
    var_s4_169 = 0;
    var_s7 = var_s3;
    var_s3 = var_s2;
    var_s2 = 0x801EF288;
loop_32:
    if (var_s7 == var_s3) {
        goto block_45;
    }
    var_s0 = (*(s32 (**)(u8, u8))var_s2)(var_s3, var_s3) & 0xFFFF;
    if (var_s0 == 0) {
        goto block_45;
    }
    if (func_000bec90(arg0 & 0xFF, var_s0) & 0xFF) {
        goto block_45;
    }
    temp_v1_192 = func_000415fc(var_s0) & 0xFFFF;
    if (temp_v1_192 != 0x1FF) {
        goto block_37;
    }
    var_s1_13 = 0;
    goto block_45;
block_37:
    temp_v1_201 = (temp_v1_192 * 4) + 0x80196B00;
    var_v0_206 = var_s1_13 & 0xFF;
    if ((u8) (*(u8 *)((s8 *)(temp_v1_201) + (2))) < (u8) (*(u8 *)((s8 *)(temp_v1_201) + (3)))) {
        goto block_43;
    }
    if (func_000bf228(var_s0) & 0xFF) {
        goto block_40;
    }
    var_s5_168 += 1;
    goto block_42;
block_40:
    var_s1_13 = 0;
block_42:
    var_v0_206 = var_s1_13 & 0xFF;
block_43:
    if (var_v0_206 != 0) {
        goto block_45;
    }
    (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x5ED))) = 3;
block_45:
    var_s4_169 += 1;
    var_s2 += 4;
    if (var_s4_169 < 4) {
        goto loop_32;
    }
    var_v0_234 = var_s1_13 & 0xFF;
    if (!(var_s1_13 & 0xFF & (var_s5_168 & 0xFF))) {
        goto block_54;
    }
    temp_v0_237 = **(void ***)0x800C4BBC;
    var_v1_239 = var_s1_13 & 0xFF;
    if (temp_v0_237 == 0) {
        goto block_50;
    }
    var_v1_239 = var_s1_13 & 0xFF;
    if ((*(u16 *)((s8 *)(temp_v0_237) + (4))) != 3) {
        goto block_50;
    }
    var_s1_13 = 0;
    (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x5ED))) = 5;
    var_v1_239 = 0 & 0xFF;
block_50:
    var_v0_234 = var_s1_13 & 0xFF;
    if (!((var_v1_239 != 0) & (var_s5_168 & 0xFF))) {
        goto block_54;
    }
    if ((u32) *(u32 *)0x80196A6C >= func_000bf9c8(arg0 & 0xFF, selected_slot[7])) {
        goto block_53;
    }
    var_s1_13 = 0;
    (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x5ED))) = 4;
block_53:
    var_v0_234 = var_s1_13 & 0xFF;
block_54:
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_234 == 0) {
        goto block_59;
    }
    var_v0_52 = var_s1_13 & 0xFF;
    if ((u32) ((selected_slot[7] - 0x22) & 0xFF) >= 2U) {
        goto block_59;
    }
    var_s1_13 = var_s1_13 & (0 - (func_00045df4(3) != 0)) & (0 - ((*(u8 *)((s8 *)(temp_s6_30) + (0x36))) == 0x63));
    var_v0_52 = var_s1_13 & 0xFF;
    if (var_v0_52 != 0) {
        goto block_59;
    }
    (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x5ED))) = 2;
block_58:
    var_v0_52 = var_s1_13 & 0xFF;
block_59:
    return var_v0_52;
}
