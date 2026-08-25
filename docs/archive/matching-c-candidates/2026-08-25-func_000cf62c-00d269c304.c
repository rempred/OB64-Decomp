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
f32 func_00020bf0(f32);                                         
s32 func_00043d1c(u8, u8);                                      
f32 sinf(f32);                                                  

void func_000cf62c(s32 arg0) {
    s32 sp10[13];
    f32 temp_f20_632;
    f32 temp_f20_80;
    f32 temp_f2_126;
    f32 temp_f30_67;
    f32 var_f22_120;
    f32 var_f24_121;
    s32 *temp_v0_771;
    s32 *temp_v0_777;
    s32 *temp_v1_627;
    s32 *var_a2_741;
    s32 temp_a0_140;
    s32 temp_a0_161;
    s32 temp_a0_191;
    s32 temp_a0_220;
    s32 temp_a0_241;
    s32 temp_a0_271;
    s32 temp_a0_300;
    s32 temp_a0_321;
    s32 temp_a0_351;
    s32 temp_a0_380;
    s32 temp_a0_401;
    s32 temp_a0_431;
    s32 temp_a0_460;
    s32 temp_a0_481;
    s32 temp_a0_511;
    s32 temp_a0_540;
    s32 temp_a0_561;
    s32 temp_a0_591;
    s32 temp_s5_34;
    s32 temp_v1_783;
    s32 var_a0_766;
    s32 var_a1_122;
    s32 var_a1_170;
    s32 var_a1_250;
    s32 var_a1_330;
    s32 var_a1_410;
    s32 var_a1_490;
    s32 var_a1_570;
    s32 var_a3_129;
    s32 var_s4_733;
    s32 var_s6_38;
    s32 var_t0_116;
    s32 var_v0_182;
    s32 var_v0_262;
    s32 var_v0_342;
    s32 var_v0_422;
    s32 var_v0_502;
    s32 var_v0_582;
    s32 var_v1_138;
    s32 var_v1_159;
    s32 var_v1_176;
    s32 var_v1_189;
    s32 var_v1_218;
    s32 var_v1_239;
    s32 var_v1_256;
    s32 var_v1_269;
    s32 var_v1_298;
    s32 var_v1_319;
    s32 var_v1_336;
    s32 var_v1_349;
    s32 var_v1_378;
    s32 var_v1_399;
    s32 var_v1_416;
    s32 var_v1_429;
    s32 var_v1_458;
    s32 var_v1_479;
    s32 var_v1_496;
    s32 var_v1_509;
    s32 var_v1_538;
    s32 var_v1_559;
    s32 var_v1_576;
    s32 var_v1_589;
    s8 var_s1_29;
    u32 temp_a0_32;
    u32 var_s4_31;
    u8 temp_v0_704;
    u8 temp_v1_153;
    u8 temp_v1_207;
    u8 temp_v1_233;
    u8 temp_v1_287;
    u8 temp_v1_313;
    u8 temp_v1_367;
    u8 temp_v1_393;
    u8 temp_v1_447;
    u8 temp_v1_473;
    u8 temp_v1_527;
    u8 temp_v1_553;
    u8 temp_v1_607;
    u8 temp_v1_714;
    void *temp_a0_623;
    void *temp_s0_631;
    void *temp_s0_649;
    void *temp_s0_665;
    void *temp_s0_680;
    void *temp_s0_79;
    void *temp_s0_97;
    void *temp_s2_56;
    void *temp_s3_50;
    void *temp_t0_737;
    void *temp_v0_27;
    void *temp_v1_699;

    temp_v0_27 = *(void **)0x80196AF8;
    var_s1_29 = 0;
    var_s4_31 = 0;
    temp_a0_32 = arg0 & 0xFF;
    temp_s5_34 = temp_a0_32 < 0x51U;
    var_s6_38 = 0;
    temp_s3_50 = (*(s32 *)((s8 *)(temp_v0_27) + (0x80))) + (temp_a0_32 * 8);
    temp_s2_56 = ((*(u8 *)((s8 *)(temp_v0_27) + (0x18B))) * 0x38) + 0x80193BC0;
loop_1:
    temp_f30_67 = ((f32) var_s4_31 * 60.0f) + 90.0f;
    temp_s0_79 = var_s6_38 + (*(s32 *)((s8 *)(*(void **)0x80196AF8) + (0x1ED0)));
    temp_f20_80 = (f32) ((f64) (temp_f30_67 / 180.0f) * *(f64 *)0x801F0530);
    (*(s16 *)((s8 *)(temp_s0_79) + (0x10))) = (s16) (s32) (100.0f - (func_00020bf0(temp_f20_80) * 24.0f));
    temp_s0_97 = var_s6_38 + (*(s32 *)((s8 *)(*(void **)0x80196AF8) + (0x1ED0)));
    (*(s16 *)((s8 *)(temp_s0_97) + (0x12))) = (s16) (s32) ((sinf(temp_f20_80) * 24.0f) + 69.0f);
    if ((func_00043d1c((*(u8 *)((s8 *)(temp_s2_56) + (0x11))), (*(u8 *)((s8 *)(temp_s2_56) + (0x12)))) & 0xFF) != 2) {
        goto block_3;
    }
    var_t0_116 = 0x87;
    goto block_4;
block_3:
    var_t0_116 = 0xB9;
block_4:
    var_f22_120 = 24.0f;
    var_f24_121 = 24.0f;
    var_a1_122 = 0x64;
    temp_f2_126 = (f32) (var_t0_116 - 0);
    var_a3_129 = 0x64;
    if (var_s4_31 >= 6U) {
        goto block_172;
    }
    switch (var_s4_31) {
case 0:
    var_v1_138 = (*(u16 *)((s8 *)(temp_s2_56) + (0x1C))) - 0;
    temp_a0_140 = var_t0_116 - 0;
    if (var_v1_138 >= 0) {
        goto block_8;
    }
    var_v1_138 = 0;
    goto block_10;
block_8:
    if (temp_a0_140 >= var_v1_138) {
        goto block_10;
    }
    var_v1_138 = temp_a0_140;
block_10:
    var_a3_129 = var_v1_138;
    temp_v1_153 = (*(u8 *)((s8 *)(temp_s3_50) + (0)));
    var_f24_121 = ((f32) var_a3_129 / temp_f2_126) * 24.0f;
    if (!((temp_v1_153 != 0xFF) & temp_s5_34)) {
        goto block_16;
    }
    var_v1_159 = temp_v1_153 - 0;
    temp_a0_161 = var_t0_116 - 0;
    if (var_v1_159 >= 0) {
        goto block_13;
    }
    var_v1_159 = 0;
    goto block_15;
block_13:
    if (temp_a0_161 >= var_v1_159) {
        goto block_15;
    }
    var_v1_159 = temp_a0_161;
block_15:
    var_a1_170 = var_v1_159;
    goto block_17;
block_16:
    var_a1_170 = var_a3_129;
block_17:
    var_v1_176 = var_a3_129;
    if (var_a1_170 < var_a3_129) {
        goto block_19;
    }
    var_v1_176 = var_a1_170;
block_19:
    var_a1_122 = var_v1_176;
    var_v0_182 = var_a1_122 - var_a3_129;
    if (var_a3_129 >= var_a1_122) {
        goto block_28;
    }
    if (var_v0_182 >= 0) {
        goto block_22;
    }
    var_v0_182 = 0 - var_v0_182;
block_22:
    if (var_v0_182 >= 0x10) {
        goto block_28;
    }
    var_v1_189 = (var_a1_122 + 0x10) - 0;
    temp_a0_191 = var_t0_116 - 0;
    if (var_v1_189 >= 0) {
        goto block_25;
    }
    var_v1_189 = 0;
    goto block_27;
block_25:
    if (temp_a0_191 >= var_v1_189) {
        goto block_27;
    }
    var_v1_189 = temp_a0_191;
block_27:
    var_a1_122 = var_v1_189;
block_28:
    var_f22_120 = ((f32) var_a1_122 / temp_f2_126) * 24.5f;
    if (temp_s5_34 == 0) {
        goto block_172;
    }
    temp_v1_207 = (*(u8 *)((s8 *)(temp_s3_50) + (0)));
    if (temp_v1_207 == 0xFF) {
        goto block_172;
    }
    if ((u16) (*(u16 *)((s8 *)(temp_s2_56) + (0x1C))) >= temp_v1_207) {
        goto block_32;
    }
    var_s1_29 |= 1;
    goto block_172;
block_32:
    goto block_172;
case 1:
    var_v1_218 = (*(u16 *)((s8 *)(temp_s2_56) + (0x1E))) - 0;
    temp_a0_220 = var_t0_116 - 0;
    if (var_v1_218 >= 0) {
        goto block_36;
    }
    var_v1_218 = 0;
    goto block_38;
block_36:
    if (temp_a0_220 >= var_v1_218) {
        goto block_38;
    }
    var_v1_218 = temp_a0_220;
block_38:
    var_a3_129 = var_v1_218;
    temp_v1_233 = (*(u8 *)((s8 *)(temp_s3_50) + (1)));
    var_f24_121 = ((f32) var_a3_129 / temp_f2_126) * 24.0f;
    if (!((temp_v1_233 != 0xFF) & temp_s5_34)) {
        goto block_44;
    }
    var_v1_239 = temp_v1_233 - 0;
    temp_a0_241 = var_t0_116 - 0;
    if (var_v1_239 >= 0) {
        goto block_41;
    }
    var_v1_239 = 0;
    goto block_43;
block_41:
    if (temp_a0_241 >= var_v1_239) {
        goto block_43;
    }
    var_v1_239 = temp_a0_241;
block_43:
    var_a1_250 = var_v1_239;
    goto block_45;
block_44:
    var_a1_250 = var_a3_129;
block_45:
    var_v1_256 = var_a3_129;
    if (var_a1_250 < var_a3_129) {
        goto block_47;
    }
    var_v1_256 = var_a1_250;
block_47:
    var_a1_122 = var_v1_256;
    var_v0_262 = var_a1_122 - var_a3_129;
    if (var_a3_129 >= var_a1_122) {
        goto block_56;
    }
    if (var_v0_262 >= 0) {
        goto block_50;
    }
    var_v0_262 = 0 - var_v0_262;
block_50:
    if (var_v0_262 >= 0x10) {
        goto block_56;
    }
    var_v1_269 = (var_a1_122 + 0x10) - 0;
    temp_a0_271 = var_t0_116 - 0;
    if (var_v1_269 >= 0) {
        goto block_53;
    }
    var_v1_269 = 0;
    goto block_55;
block_53:
    if (temp_a0_271 >= var_v1_269) {
        goto block_55;
    }
    var_v1_269 = temp_a0_271;
block_55:
    var_a1_122 = var_v1_269;
block_56:
    var_f22_120 = ((f32) var_a1_122 / temp_f2_126) * 24.5f;
    if (temp_s5_34 == 0) {
        goto block_172;
    }
    temp_v1_287 = (*(u8 *)((s8 *)(temp_s3_50) + (1)));
    if (temp_v1_287 == 0xFF) {
        goto block_172;
    }
    if ((u16) (*(u16 *)((s8 *)(temp_s2_56) + (0x1E))) >= temp_v1_287) {
        goto block_60;
    }
    var_s1_29 |= 2;
    goto block_172;
block_60:
    goto block_172;
case 2:
    var_v1_298 = (*(u16 *)((s8 *)(temp_s2_56) + (0x20))) - 0;
    temp_a0_300 = var_t0_116 - 0;
    if (var_v1_298 >= 0) {
        goto block_64;
    }
    var_v1_298 = 0;
    goto block_66;
block_64:
    if (temp_a0_300 >= var_v1_298) {
        goto block_66;
    }
    var_v1_298 = temp_a0_300;
block_66:
    var_a3_129 = var_v1_298;
    temp_v1_313 = (*(u8 *)((s8 *)(temp_s3_50) + (2)));
    var_f24_121 = ((f32) var_a3_129 / temp_f2_126) * 24.0f;
    if (!((temp_v1_313 != 0xFF) & temp_s5_34)) {
        goto block_72;
    }
    var_v1_319 = temp_v1_313 - 0;
    temp_a0_321 = var_t0_116 - 0;
    if (var_v1_319 >= 0) {
        goto block_69;
    }
    var_v1_319 = 0;
    goto block_71;
block_69:
    if (temp_a0_321 >= var_v1_319) {
        goto block_71;
    }
    var_v1_319 = temp_a0_321;
block_71:
    var_a1_330 = var_v1_319;
    goto block_73;
block_72:
    var_a1_330 = var_a3_129;
block_73:
    var_v1_336 = var_a3_129;
    if (var_a1_330 < var_a3_129) {
        goto block_75;
    }
    var_v1_336 = var_a1_330;
block_75:
    var_a1_122 = var_v1_336;
    var_v0_342 = var_a1_122 - var_a3_129;
    if (var_a3_129 >= var_a1_122) {
        goto block_84;
    }
    if (var_v0_342 >= 0) {
        goto block_78;
    }
    var_v0_342 = 0 - var_v0_342;
block_78:
    if (var_v0_342 >= 0x10) {
        goto block_84;
    }
    var_v1_349 = (var_a1_122 + 0x10) - 0;
    temp_a0_351 = var_t0_116 - 0;
    if (var_v1_349 >= 0) {
        goto block_81;
    }
    var_v1_349 = 0;
    goto block_83;
block_81:
    if (temp_a0_351 >= var_v1_349) {
        goto block_83;
    }
    var_v1_349 = temp_a0_351;
block_83:
    var_a1_122 = var_v1_349;
block_84:
    var_f22_120 = ((f32) var_a1_122 / temp_f2_126) * 24.5f;
    if (temp_s5_34 == 0) {
        goto block_172;
    }
    temp_v1_367 = (*(u8 *)((s8 *)(temp_s3_50) + (2)));
    if (temp_v1_367 == 0xFF) {
        goto block_172;
    }
    if ((u16) (*(u16 *)((s8 *)(temp_s2_56) + (0x20))) >= temp_v1_367) {
        goto block_88;
    }
    var_s1_29 |= 4;
    goto block_172;
block_88:
    goto block_172;
case 3:
    var_v1_378 = (*(u16 *)((s8 *)(temp_s2_56) + (0x22))) - 0;
    temp_a0_380 = var_t0_116 - 0;
    if (var_v1_378 >= 0) {
        goto block_92;
    }
    var_v1_378 = 0;
    goto block_94;
block_92:
    if (temp_a0_380 >= var_v1_378) {
        goto block_94;
    }
    var_v1_378 = temp_a0_380;
block_94:
    var_a3_129 = var_v1_378;
    temp_v1_393 = (*(u8 *)((s8 *)(temp_s3_50) + (3)));
    var_f24_121 = ((f32) var_a3_129 / temp_f2_126) * 24.0f;
    if (!((temp_v1_393 != 0xFF) & temp_s5_34)) {
        goto block_100;
    }
    var_v1_399 = temp_v1_393 - 0;
    temp_a0_401 = var_t0_116 - 0;
    if (var_v1_399 >= 0) {
        goto block_97;
    }
    var_v1_399 = 0;
    goto block_99;
block_97:
    if (temp_a0_401 >= var_v1_399) {
        goto block_99;
    }
    var_v1_399 = temp_a0_401;
block_99:
    var_a1_410 = var_v1_399;
    goto block_101;
block_100:
    var_a1_410 = var_a3_129;
block_101:
    var_v1_416 = var_a3_129;
    if (var_a1_410 < var_a3_129) {
        goto block_103;
    }
    var_v1_416 = var_a1_410;
block_103:
    var_a1_122 = var_v1_416;
    var_v0_422 = var_a1_122 - var_a3_129;
    if (var_a3_129 >= var_a1_122) {
        goto block_112;
    }
    if (var_v0_422 >= 0) {
        goto block_106;
    }
    var_v0_422 = 0 - var_v0_422;
block_106:
    if (var_v0_422 >= 0x10) {
        goto block_112;
    }
    var_v1_429 = (var_a1_122 + 0x10) - 0;
    temp_a0_431 = var_t0_116 - 0;
    if (var_v1_429 >= 0) {
        goto block_109;
    }
    var_v1_429 = 0;
    goto block_111;
block_109:
    if (temp_a0_431 >= var_v1_429) {
        goto block_111;
    }
    var_v1_429 = temp_a0_431;
block_111:
    var_a1_122 = var_v1_429;
block_112:
    var_f22_120 = ((f32) var_a1_122 / temp_f2_126) * 24.5f;
    if (temp_s5_34 == 0) {
        goto block_172;
    }
    temp_v1_447 = (*(u8 *)((s8 *)(temp_s3_50) + (3)));
    if (temp_v1_447 == 0xFF) {
        goto block_172;
    }
    if ((u16) (*(u16 *)((s8 *)(temp_s2_56) + (0x22))) >= temp_v1_447) {
        goto block_116;
    }
    var_s1_29 |= 8;
    goto block_172;
block_116:
    goto block_172;
case 4:
    var_v1_458 = (*(u16 *)((s8 *)(temp_s2_56) + (0x24))) - 0;
    temp_a0_460 = var_t0_116 - 0;
    if (var_v1_458 >= 0) {
        goto block_120;
    }
    var_v1_458 = 0;
    goto block_122;
block_120:
    if (temp_a0_460 >= var_v1_458) {
        goto block_122;
    }
    var_v1_458 = temp_a0_460;
block_122:
    var_a3_129 = var_v1_458;
    temp_v1_473 = (*(u8 *)((s8 *)(temp_s3_50) + (4)));
    var_f24_121 = ((f32) var_a3_129 / temp_f2_126) * 24.0f;
    if (!((temp_v1_473 != 0xFF) & temp_s5_34)) {
        goto block_128;
    }
    var_v1_479 = temp_v1_473 - 0;
    temp_a0_481 = var_t0_116 - 0;
    if (var_v1_479 >= 0) {
        goto block_125;
    }
    var_v1_479 = 0;
    goto block_127;
block_125:
    if (temp_a0_481 >= var_v1_479) {
        goto block_127;
    }
    var_v1_479 = temp_a0_481;
block_127:
    var_a1_490 = var_v1_479;
    goto block_129;
block_128:
    var_a1_490 = var_a3_129;
block_129:
    var_v1_496 = var_a3_129;
    if (var_a1_490 < var_a3_129) {
        goto block_131;
    }
    var_v1_496 = var_a1_490;
block_131:
    var_a1_122 = var_v1_496;
    var_v0_502 = var_a1_122 - var_a3_129;
    if (var_a3_129 >= var_a1_122) {
        goto block_140;
    }
    if (var_v0_502 >= 0) {
        goto block_134;
    }
    var_v0_502 = 0 - var_v0_502;
block_134:
    if (var_v0_502 >= 0x10) {
        goto block_140;
    }
    var_v1_509 = (var_a1_122 + 0x10) - 0;
    temp_a0_511 = var_t0_116 - 0;
    if (var_v1_509 >= 0) {
        goto block_137;
    }
    var_v1_509 = 0;
    goto block_139;
block_137:
    if (temp_a0_511 >= var_v1_509) {
        goto block_139;
    }
    var_v1_509 = temp_a0_511;
block_139:
    var_a1_122 = var_v1_509;
block_140:
    var_f22_120 = ((f32) var_a1_122 / temp_f2_126) * 24.5f;
    if (temp_s5_34 == 0) {
        goto block_172;
    }
    temp_v1_527 = (*(u8 *)((s8 *)(temp_s3_50) + (4)));
    if (temp_v1_527 == 0xFF) {
        goto block_172;
    }
    if ((u16) (*(u16 *)((s8 *)(temp_s2_56) + (0x24))) >= temp_v1_527) {
        goto block_144;
    }
    var_s1_29 |= 0x10;
    goto block_172;
block_144:
    goto block_172;
case 5:
    var_v1_538 = (*(u16 *)((s8 *)(temp_s2_56) + (0x26))) - 0;
    temp_a0_540 = var_t0_116 - 0;
    if (var_v1_538 >= 0) {
        goto block_148;
    }
    var_v1_538 = 0;
    goto block_150;
block_148:
    if (temp_a0_540 >= var_v1_538) {
        goto block_150;
    }
    var_v1_538 = temp_a0_540;
block_150:
    var_a3_129 = var_v1_538;
    temp_v1_553 = (*(u8 *)((s8 *)(temp_s3_50) + (5)));
    var_f24_121 = ((f32) var_a3_129 / temp_f2_126) * 24.0f;
    if (!((temp_v1_553 != 0xFF) & temp_s5_34)) {
        goto block_156;
    }
    var_v1_559 = temp_v1_553 - 0;
    temp_a0_561 = var_t0_116 - 0;
    if (var_v1_559 >= 0) {
        goto block_153;
    }
    var_v1_559 = 0;
    goto block_155;
block_153:
    if (temp_a0_561 >= var_v1_559) {
        goto block_155;
    }
    var_v1_559 = temp_a0_561;
block_155:
    var_a1_570 = var_v1_559;
    goto block_157;
block_156:
    var_a1_570 = var_a3_129;
block_157:
    var_v1_576 = var_a3_129;
    if (var_a1_570 < var_a3_129) {
        goto block_159;
    }
    var_v1_576 = var_a1_570;
block_159:
    var_a1_122 = var_v1_576;
    var_v0_582 = var_a1_122 - var_a3_129;
    if (var_a3_129 >= var_a1_122) {
        goto block_168;
    }
    if (var_v0_582 >= 0) {
        goto block_162;
    }
    var_v0_582 = 0 - var_v0_582;
block_162:
    if (var_v0_582 >= 0x10) {
        goto block_168;
    }
    var_v1_589 = (var_a1_122 + 0x10) - 0;
    temp_a0_591 = var_t0_116 - 0;
    if (var_v1_589 >= 0) {
        goto block_165;
    }
    var_v1_589 = 0;
    goto block_167;
block_165:
    if (temp_a0_591 >= var_v1_589) {
        goto block_167;
    }
    var_v1_589 = temp_a0_591;
block_167:
    var_a1_122 = var_v1_589;
block_168:
    var_f22_120 = ((f32) var_a1_122 / temp_f2_126) * 24.5f;
    if (temp_s5_34 == 0) {
        goto block_172;
    }
    temp_v1_607 = (*(u8 *)((s8 *)(temp_s3_50) + (5)));
    if (temp_v1_607 == 0xFF) {
        goto block_172;
    }
    if ((u16) (*(u16 *)((s8 *)(temp_s2_56) + (0x26))) >= temp_v1_607) {
        goto block_172;
    }
    var_s1_29 |= 0x20;
    }
block_172:
    temp_a0_623 = *(void **)0x80196AF8;
    temp_v1_627 = &(&sp10[0])[var_s4_31];
    (*(s32 *)((s8 *)(temp_v1_627) + (0))) = var_a3_129;
    (*(s32 *)((s8 *)(temp_v1_627) + (0x18))) = var_a1_122;
    temp_s0_631 = var_s6_38 + (*(s32 *)((s8 *)(temp_a0_623) + (0x1ED0)));
    temp_f20_632 = (f32) ((f64) (temp_f30_67 / 180.0f) * *(f64 *)0x801F0550);
    (*(s16 *)((s8 *)(temp_s0_631) + (0x80))) = (s16) (s32) (100.0f - (func_00020bf0(temp_f20_632) * var_f24_121));
    temp_s0_649 = var_s6_38 + (*(s32 *)((s8 *)(*(void **)0x80196AF8) + (0x1ED0)));
    (*(s16 *)((s8 *)(temp_s0_649) + (0x82))) = (s16) (s32) ((sinf(temp_f20_632) * var_f24_121) + 69.0f);
    temp_s0_665 = var_s6_38 + (*(s32 *)((s8 *)(*(void **)0x80196AF8) + (0x1ED0)));
    (*(s16 *)((s8 *)(temp_s0_665) + (0xF0))) = (s16) (s32) (100.0f - (func_00020bf0(temp_f20_632) * var_f22_120));
    temp_s0_680 = var_s6_38 + (*(s32 *)((s8 *)(*(void **)0x80196AF8) + (0x1ED0)));
    (*(s16 *)((s8 *)(temp_s0_680) + (0xF2))) = (s16) (s32) ((sinf(temp_f20_632) * var_f22_120) + 69.0f);
    (*(u8 *)((s8 *)(*(void **)0x80196AF8) + (0x7D))) = 0U;
    (*(u8 *)((s8 *)(*(void **)0x80196AF8) + (0x7E))) = 0x64U;
    temp_v1_699 = *(void **)0x80196AF8;
    if ((u16) (*(u16 *)((s8 *)(temp_v1_699) + (0x5E8))) >= 0x51U) {
        goto block_179;
    }
    temp_v0_704 = (*(u8 *)((s8 *)(temp_s3_50) + (6)));
    if (temp_v0_704 == 0xFF) {
        goto block_176;
    }
    (*(u8 *)((s8 *)(temp_v1_699) + (0x7D))) = temp_v0_704;
    if ((u8) (*(u8 *)((s8 *)(temp_s2_56) + (0x1B))) >= (u8) (*(u8 *)((s8 *)(temp_s3_50) + (6)))) {
        goto block_176;
    }
    var_s1_29 |= 0x40;
block_176:
    temp_v1_714 = (*(u8 *)((s8 *)(temp_s3_50) + (7)));
    if (temp_v1_714 == 0xFF) {
        goto block_179;
    }
    (*(u8 *)((s8 *)(*(void **)0x80196AF8) + (0x7E))) = temp_v1_714;
    if ((u8) (*(u8 *)((s8 *)(temp_s3_50) + (7))) >= (u8) (*(u8 *)((s8 *)(temp_s2_56) + (0x1B)))) {
        goto block_179;
    }
    var_s1_29 |= 0x40;
block_179:
    var_s4_31 += 1;
    (*(s8 *)((s8 *)(*(void **)0x80196AF8) + (0x7C))) = var_s1_29;
    var_s6_38 += 0x10;
    if ((s32) var_s4_31 < 6) {
        goto loop_1;
    }
    var_s4_733 = 0;
    temp_t0_737 = *(void **)0x80196AF8;
    var_a2_741 = &sp10[0];
loop_181:
    if ((*(s32 *)((s8 *)(var_a2_741) + (0))) != (*(s32 *)((s8 *)(var_a2_741) + (0x18)))) {
        goto block_188;
    }
    if (var_s4_733 == 0) {
        goto block_184;
    }
    var_a0_766 = (var_s4_733 - 1) % 6;
    goto block_185;
block_184:
    var_a0_766 = 5;
block_185:
    temp_v0_771 = &(&sp10[0])[(var_s4_733 + 1) % 6];
    if ((*(s32 *)((s8 *)(temp_v0_771) + (0))) != (*(s32 *)((s8 *)(temp_v0_771) + (0x18)))) {
        goto block_188;
    }
    temp_v0_777 = &(&sp10[0])[var_a0_766];
    if ((*(s32 *)((s8 *)(temp_v0_777) + (0))) != (*(s32 *)((s8 *)(temp_v0_777) + (0x18)))) {
        goto block_188;
    }
    temp_v1_783 = var_s4_733 * 0x10;
    (*(s16 *)((s8 *)((temp_v1_783 + (*(s32 *)((s8 *)(temp_t0_737) + (0x1ED0))))) + (0xF0))) = 0x64;
    (*(s16 *)((s8 *)((temp_v1_783 + (*(s32 *)((s8 *)(temp_t0_737) + (0x1ED0))))) + (0xF2))) = 0x45;
block_188:
    var_s4_733 += 1;
    var_a2_741 += 4;
    if (var_s4_733 < 6) {
        goto loop_181;
    }
    return;
}
