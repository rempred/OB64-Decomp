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
s32 func_000431a8(u8, u8);                                      
s32 func_00043dc4(u8, u8);                                      
s32 func_000be964(s32, u8, u32);                                
s32 func_000bedb8(s32, s32);                                    

s32 func_000c01dc(s32 arg0, s32 arg1, s32 arg2) {
    s32 (**var_s0_295)(u8, u8);
    s32 temp_a0_497;
    s32 temp_a0_559;
    s32 temp_a0_61;
    s32 temp_s3_29;
    s32 temp_v0_278;
    s32 temp_v0_370;
    s32 temp_v1_132;
    s32 var_a0_441;
    s32 var_a1_389;
    s32 var_a2_394;
    s32 var_a2_435;
    s32 var_s1_292;
    s32 var_s2_291;
    s32 var_s3_293;
    s32 var_s4_31;
    s32 var_s4_64;
    s32 var_t2_420;
    s32 var_v0_146;
    s32 var_v0_201;
    s32 var_v0_234;
    s32 var_v0_320;
    s32 var_v0_352;
    s32 var_v0_380;
    s32 var_v0_383;
    s32 var_v0_490;
    s32 var_v0_59;
    s32 var_v0_88;
    s32 var_v1_400;
    s32 var_v1_432;
    u16 temp_v1_575;
    u16 temp_v1_593;
    u32 temp_a0_153;
    u32 temp_a0_214;
    u32 temp_a0_417;
    u32 temp_a3_25;
    u32 temp_v0_115;
    u32 temp_v0_265;
    u32 temp_v0_521;
    u32 temp_v0_94;
    u32 temp_v1_179;
    u32 var_v0_388;
    u32 var_v0_502;
    u32 var_v0_93;
    u8 *temp_s2_44;
    u8 temp_a0_131;
    u8 temp_a0_280;
    u8 temp_v0_135;
    u8 temp_v0_77;
    u8 temp_v1_226;
    u8 temp_v1_562;
    u8 temp_v1_74;
    u8 var_a0_80;
    u8 var_a1_279;
    u8 var_a1_60;
    u8 var_v1_138;
    u8 var_v1_500;
    u8 *temp_a0_396;
    u8 *temp_a1_422;
    u8 *temp_a1_437;
    u8 *temp_s5_52;
    u8 *var_v0_401;
    u8 *var_v0_442;

    temp_a3_25 = (s32) arg0 & 0xFF;
    temp_s3_29 = (s32) arg0 & (0 - (temp_a3_25 < 0x64U));
    var_s4_31 = -1;
    temp_s2_44 = *(u8 **)0x80196AF8 + ((temp_a3_25 * 2) + 0x1872);
    temp_s5_52 = (u8 *)(((temp_s3_29 & 0xFF) * 0x38) + 0x80193BC0);
    if (!((s32) arg1 & 0x80)) {
        goto block_2;
    }
    var_s4_31 = (0 - (temp_a3_25 != 0xFF)) | 8;
block_2:
    var_v0_59 = var_s4_31;
    if (var_s4_31 >= 0) {
        goto block_152;
    }
    var_a1_60 = (*(u8 *)((s8 *)(temp_s5_52) + (0x11)));
    temp_a0_61 = var_a1_60 & 0xFF;
    var_s4_64 = var_s4_31 & (0 - (temp_a0_61 != 0));
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    temp_v1_74 = var_a1_60;
    if (!(((u32) arg1 >> 8) & 1 & ((arg2 & 0xFF) == 9))) {
        goto block_20;
    }
    temp_v0_77 = (*(u8 *)((s8 *)((temp_a0_61 + 0x801F0000)) + (-0xC48)));
    var_a1_60 = (*(u8 *)((s8 *)(temp_s5_52) + (0x12)));
    if (temp_v0_77 == 0) {
        goto block_7;
    }
    var_a0_80 = temp_v0_77;
    goto block_9;
block_7:
    var_a0_80 = (*(u8 *)((s8 *)(((temp_a0_61 * 0x48) + 0x80180000)) + (0x7C59)));
    var_v0_88 = temp_v1_74 < 0x51U;
    goto block_10;
block_9:
    var_v0_88 = temp_v1_74 < 0x51U;
block_10:
    var_v0_93 = var_a1_60 - 0x24;
    if (var_v0_88 != 0) {
        goto block_14;
    }
    temp_v0_94 = var_a0_80 & 0xFF;
    if (temp_v0_94 == 0) {
        goto block_13;
    }
    var_v0_93 = var_a1_60 - 0x24;
    if (!((temp_v0_94 != 0) & (temp_v0_94 >= 0x2AU))) {
        goto block_14;
    }
block_13:
    var_s4_64 = 9;
    goto block_20;
block_14:
    if (var_v0_93 < 3U) {
        goto block_19;
    }
    if ((u32) (var_a1_60 - 0x2A) < 7U) {
        goto block_19;
    }
    temp_v0_115 = var_a0_80 & 0xFF;
    if (var_a1_60 < 0x2AU) {
        goto block_20;
    }
    if (temp_v0_115 == 0) {
        goto block_19;
    }
    if (!((temp_v0_115 != 0) & (temp_v0_115 >= 0x2AU))) {
        goto block_20;
    }
block_19:
    var_s4_64 = 0xA;
block_20:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    if (!((s32) arg1 & 4)) {
        goto block_31;
    }
    temp_a0_131 = (*(u8 *)((s8 *)(temp_s5_52) + (0x11)));
    temp_v1_132 = temp_a0_131 & 0xFF;
    temp_v0_135 = (*(u8 *)((s8 *)((temp_v1_132 + 0x801F0000)) + (-0xC48)));
    var_a1_60 = (*(u8 *)((s8 *)(temp_s5_52) + (0x12)));
    if (temp_v0_135 == 0) {
        goto block_24;
    }
    var_v1_138 = temp_v0_135;
    goto block_26;
block_24:
    var_v1_138 = (*(u8 *)((s8 *)(((temp_v1_132 * 0x48) + 0x80180000)) + (0x7C59)));
    var_v0_146 = temp_a0_131 < 0x51U;
    goto block_27;
block_26:
    var_v0_146 = temp_a0_131 < 0x51U;
block_27:
    if (var_v0_146 != 0) {
        goto block_31;
    }
    temp_a0_153 = var_v1_138 & 0xFF;
    if ((((u32) (var_a1_60 - 0x24) < 3U) | (temp_a0_153 == 0)) != 0) {
        goto block_30;
    }
    if (!((temp_a0_153 != 0) & (temp_a0_153 >= 0x2AU))) {
        goto block_31;
    }
block_30:
    var_s4_64 = 3;
block_31:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    if (!((s32) arg1 & 1)) {
        goto block_35;
    }
    if (!(*temp_s2_44 & 0x10)) {
        goto block_35;
    }
    var_s4_64 = 1;
block_35:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    temp_v1_179 = (s32) arg0 & 0xFF;
    if (!((s32) arg1 & 2)) {
        goto block_46;
    }
    if (temp_v1_179 < 0x64U) {
        goto block_40;
    }
    if (!((*(u8 *)((s8 *)((temp_v1_179 + 0x80190000)) + (0x1010))) & 4)) {
        goto block_46;
    }
    var_s4_64 = 2;
    goto block_46;
block_40:
    if ((*(u8 *)((s8 *)(temp_s5_52) + (0x11))) == 0) {
        goto block_43;
    }
    if ((*(u8 *)((s8 *)(temp_s5_52) + (0x33))) & 4) {
        goto block_43;
    }
    var_v0_201 = 1 & 0xFF;
    if ((*(u16 *)((s8 *)(temp_s5_52) + (0x18))) != 0) {
        goto block_44;
    }
block_43:
    var_v0_201 = 0 & 0xFF;
block_44:
    if (var_v0_201 != 0) {
        goto block_46;
    }
    var_s4_64 = 2;
block_46:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    temp_a0_214 = (s32) arg0 & 0xFF;
    if (!((s32) arg1 & 8)) {
        goto block_55;
    }
    var_a1_60 = 0;
    if (((temp_a0_214 >= 0x64U) | (temp_a0_214 == 0)) != 0) {
        goto block_52;
    }
    temp_v1_226 = (*(u8 *)((s8 *)(((temp_a0_214 * 0x38) + 0x80190000)) + (0x3BD1)));
    if ((u32) (temp_v1_226 - 0x51) < 3U) {
        goto block_51;
    }
    var_v0_234 = 0 & 0xFF;
    if ((temp_v1_226 & 0xFF) != 0xA3) {
        goto block_53;
    }
block_51:
    var_a1_60 = 1;
block_52:
    var_v0_234 = var_a1_60 & 0xFF;
block_53:
    if (var_v0_234 == 0) {
        goto block_55;
    }
    var_s4_64 = 4;
block_55:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    if (!((s32) arg1 & 0x10)) {
        goto block_59;
    }
    if (!(func_000be964((s32) arg0 & 0xFF, var_a1_60, temp_a3_25) & 0xFF)) {
        goto block_59;
    }
    var_s4_64 = 5;
block_59:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    if (!((s32) arg1 & 0x20)) {
        goto block_63;
    }
    if ((s32) arg0 & 0xFF) {
        goto block_63;
    }
    var_s4_64 = 6;
block_63:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    temp_v0_265 = (s32) arg0 & 0xFF;
    if (!((s32) arg1 & 0x40)) {
        goto block_67;
    }
    if (!((temp_v0_265 != 0xFF) & (temp_v0_265 >= 0x64U))) {
        goto block_67;
    }
    var_s4_64 = 7;
block_67:
    var_v0_59 = var_s4_64;
    if (var_s4_64 >= 0) {
        goto block_152;
    }
    temp_v0_278 = arg2 & 0xFF;
    if (!((s32) arg1 & 0x100)) {
        goto block_151;
    }
    var_a1_279 = (*(u8 *)((s8 *)(temp_s5_52) + (0x12)));
    temp_a0_280 = (*(u8 *)((s8 *)(temp_s5_52) + (0x11)));
    if ((u32) (temp_v0_278 - 1) >= 0xAU) {
        goto block_151;
    }
    switch (temp_v0_278) {
case 1:
    var_s2_291 = 1;
    var_s1_292 = 0;
    var_s3_293 = 0;
    var_s0_295 = (s32 (**)(u8, u8))0x801EF288;
loop_72:
    if (!((*var_s0_295)((*(u8 *)((s8 *)(temp_s5_52) + (0x11))), (*(u8 *)((s8 *)(temp_s5_52) + (0x12)))) & 0xFFFF)) {
        goto block_75;
    }
    if (func_000431a8((*(u8 *)((s8 *)(temp_s5_52) + (0x11))), (*(u8 *)((s8 *)(temp_s5_52) + (0x12)))) & 0xFF & var_s2_291) {
        goto block_75;
    }
    var_s3_293 += 1;
block_75:
    var_s0_295 += 1;
    var_s1_292 += 1;
    var_s2_291 *= 2;
    if (var_s1_292 < 4) {
        goto loop_72;
    }
    var_v0_320 = var_s3_293 & 0xFF;
    goto block_149;
case 2:
    var_v0_59 = var_s4_64;
    if ((u8) (*(u8 *)((s8 *)(temp_s5_52) + (0x11))) < 0x51U) {
        goto block_152;
    }
    var_s4_64 = 9;
    goto block_151;
case 3:
    if (!(func_00043dc4(temp_a0_280, var_a1_279) & 0xFF)) {
        goto block_150;
    }
    if (*temp_s2_44 & 0xA) {
        goto block_150;
    }
    var_v0_59 = var_s4_64;
    if ((u32) ((s32) arg0 & 0xFF) >= 0x64U) {
        goto block_152;
    }
    if ((*(u8 *)((s8 *)(temp_s5_52) + (0x11))) == 0) {
        goto block_85;
    }
    if ((*(u8 *)((s8 *)(temp_s5_52) + (0x33))) & 4) {
        goto block_85;
    }
    var_v0_352 = 1 & 0xFF;
    if ((*(u16 *)((s8 *)(temp_s5_52) + (0x18))) != 0) {
        goto block_86;
    }
block_85:
    var_v0_352 = 0 & 0xFF;
block_86:
    var_v0_59 = var_s4_64;
    if (var_v0_352 != 0) {
        goto block_152;
    }
    var_s4_64 = 0xA;
    goto block_151;
case 4:
    var_v0_59 = var_s4_64;
    if (!(*temp_s2_44 & 0xA)) {
        goto block_152;
    }
    var_s4_64 = 9;
    goto block_151;
case 5:
    temp_v0_370 = func_00043dc4(temp_a0_280, var_a1_279);
    if (temp_v0_370 & 0xFF) {
        goto block_94;
    }
    var_s4_64 = 9;
    goto block_151;
block_92:
    var_v0_380 = var_a1_389;
    goto block_102;
block_93:
    var_v0_383 = var_v1_432;
    goto block_111;
block_94:
    var_v0_388 = (s32) arg0 & 0xFF;
    if ((*temp_s2_44 & 0x30) != 0x30) {
        goto block_118;
    }
    var_a1_389 = 0;
    var_a2_394 = 0x117C;
loop_96:
    temp_a0_396 = *(u8 **)0x80196AF8 + var_a2_394;
    if ((*(u8 *)((s8 *)(temp_a0_396) + (3))) == 0xFF) {
        goto block_100;
    }
    var_v1_400 = 0;
    var_v0_401 = temp_a0_396;
loop_98:
    var_v1_400 += 1;
    if ((*(u8 *)((s8 *)(var_v0_401) + (4))) == ((s32) arg0 & 0xFF)) {
        goto block_92;
    }
    var_v0_401 = temp_a0_396 + var_v1_400;
    if (var_v1_400 < 9) {
        goto loop_98;
    }
block_100:
    var_a1_389 += 1;
    var_a2_394 += 0x36;
    if (var_a1_389 < 0x1E) {
        goto loop_96;
    }
    var_v0_380 = 0xFF;
block_102:
    temp_a0_417 = var_v0_380 & 0xFF;
    var_t2_420 = 0;
    if (temp_a0_417 >= 0x80U) {
        goto block_113;
    }
    temp_a1_422 = *(u8 **)0x80196AF8;
    var_v1_432 = 0;
    if (!((*(u8 *)((s8 *)((temp_a1_422 + (temp_a0_417 * 0x36))) + (0x117D))) & 8)) {
        goto block_113;
    }
    var_a2_435 = 0x10D4;
loop_105:
    temp_a1_437 = temp_a1_422 + var_a2_435;
    if ((*(u8 *)((s8 *)(temp_a1_437) + (8))) == 0) {
        goto block_109;
    }
    var_a0_441 = 0;
    var_v0_442 = temp_a1_437;
loop_107:
    var_a0_441 += 1;
    if ((*(u8 *)((s8 *)(var_v0_442) + (2))) == temp_a0_417) {
        goto block_93;
    }
    var_v0_442 = temp_a1_437 + var_a0_441;
    if (var_a0_441 < 5) {
        goto loop_107;
    }
block_109:
    var_v1_432 += 1;
    var_a2_435 += 0xE;
    if (var_v1_432 < 0xA) {
        goto loop_105;
    }
    var_v0_383 = 0xFF;
block_111:
    if ((*(u8 *)((s8 *)((*(u8 **)0x80196AF8 + ((var_v0_383 & 0xFF) * 0xE))) + (0x10D6))) != (var_v0_380 & 0xFF)) {
        goto block_113;
    }
    var_t2_420 = 1;
block_113:
    if (!(var_t2_420 & 0xFF)) {
        goto block_117;
    }
    if ((temp_v0_370 & 0xFF) == 2) {
        goto block_116;
    }
    var_s4_64 = 0xA;
    goto block_151;
block_116:
block_117:
    var_v0_388 = (s32) arg0 & 0xFF;
block_118:
    var_v0_59 = var_s4_64;
    if (var_v0_388 >= 0x64U) {
        goto block_152;
    }
    if ((*(u8 *)((s8 *)(temp_s5_52) + (0x11))) == 0) {
        goto block_122;
    }
    if ((*(u8 *)((s8 *)(temp_s5_52) + (0x33))) & 4) {
        goto block_122;
    }
    var_v0_490 = 1 & 0xFF;
    if ((*(u16 *)((s8 *)(temp_s5_52) + (0x18))) != 0) {
        goto block_143;
    }
block_122:
    var_v0_490 = 0 & 0xFF;
    goto block_143;
case 6:
    temp_a0_497 = temp_a0_280 & 0xFF;
    var_v1_500 = (*(u8 *)((s8 *)((temp_a0_497 + 0x801F0000)) + (-0xC48)));
    var_v0_502 = var_a1_279 - 0x24;
    if (var_v1_500 != 0) {
        goto block_125;
    }
    var_v1_500 = (*(u8 *)((s8 *)(((temp_a0_497 * 0x48) + 0x80180000)) + (0x7C59)));
    var_v0_502 = var_a1_279 - 0x24;
block_125:
    if (var_v0_502 < 3U) {
        goto block_150;
    }
    if ((u32) (var_a1_279 - 0x2A) < 7U) {
        goto block_150;
    }
    var_v0_59 = var_s4_64;
    if (var_a1_279 < 0x2AU) {
        goto block_152;
    }
    temp_v0_521 = var_v1_500 & 0xFF;
    if (temp_v0_521 == 0) {
        goto block_150;
    }
    var_v0_59 = var_s4_64;
    if (!((temp_v0_521 != 0) & (temp_v0_521 >= 0x2AU))) {
        goto block_152;
    }
    var_s4_64 = 9;
    goto block_151;
case 7:
    var_v0_59 = var_s4_64;
    if (((*(u16 *)((s8 *)(temp_s5_52) + (0x30))) | ((*(u16 *)((s8 *)(temp_s5_52) + (0x2E))) | ((*(u16 *)((s8 *)(temp_s5_52) + (0x2A))) | (*(u16 *)((s8 *)(temp_s5_52) + (0x2C)))))) != 0) {
        goto block_152;
    }
    var_s4_64 = 9;
    goto block_151;
case 8:
    if ((s32) arg0 & 0xFF) {
        goto block_135;
    }
    if (*(u8 *)0x80190F81 == 0) {
        goto block_150;
    }
block_135:
    var_v0_59 = var_s4_64;
    if (!(*temp_s2_44 & 0xA)) {
        goto block_152;
    }
    var_s4_64 = 0xA;
    goto block_151;
case 9:
    temp_a0_559 = temp_a0_280 & 0xFF;
    temp_v1_562 = (*(u8 *)((s8 *)((temp_a0_559 + 0x801F0000)) + (-0xC48)));
    if (temp_v1_562 == 0) {
        goto block_140;
    }
    if ((*(u8 *)((s8 *)(((temp_a0_559 * 0x48) + 0x80180000)) + (0x7C59))) != var_a1_279) {
        goto block_140;
    }
    var_a1_279 = temp_v1_562;
block_140:
    temp_v1_575 = (*(u16 *)((s8 *)(*(u8 **)0x80196AF8) + (0x5E8)));
    if (var_a1_279 != temp_v1_575) {
        goto block_142;
    }
    var_s4_64 = 0xC;
    goto block_151;
block_142:
    var_v0_490 = func_000bedb8(temp_s3_29 & 0xFF, temp_v1_575 & 0xFF) & 0xFF;
block_143:
    if (var_v0_490 != 0) {
        goto block_145;
    }
    var_s4_64 = 0xB;
    goto block_151;
block_145:
    return var_s4_64;
case 10:
    temp_v1_593 = (*(u16 *)((s8 *)(*(u8 **)0x80196AF8) + (0x5E8)));
    if (var_a1_279 == temp_v1_593) {
        goto block_151;
    }
    var_v0_320 = func_000bedb8(temp_s3_29 & 0xFF, temp_v1_593 & 0xFF) & 0xFF;
block_149:
    var_v0_59 = var_s4_64;
    if (var_v0_320 != 0) {
        goto block_152;
    }
block_150:
    var_s4_64 = 9;
block_151:
    var_v0_59 = var_s4_64;
block_152:
    return var_v0_59;
    }
}
