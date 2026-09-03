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
s32 func_000453e0(s32);
s32 func_00045df4(s16);
M2C_UNK func_00054e24();
M2C_UNK func_00055114(M2C_UNK, M2C_UNK, s8, M2C_UNK, s32, s32, s32, s32, s32, s32, s32, s32);
void *func_00055234();
s32 func_001F21A4(u8, void *, void *);
M2C_UNK func_00208DC8();
M2C_UNK func_0020BD5C(M2C_UNK);
s32 func_0020BF6C();
M2C_UNK func_002159D0(void *, void *);
M2C_UNK func_0021AE6C(M2C_UNK, M2C_UNK, void *);
M2C_UNK func_0021C3B0();
M2C_UNK func_801EFAAC();
M2C_UNK memcpy(void *, void *, M2C_UNK);
void *resource_alloc(M2C_UNK);
M2C_UNK resource_free(void *);
M2C_UNK sprintf(M2C_UNK *, M2C_UNK, s32);
M2C_UNK strcpy_0002c950(void *, M2C_UNK *);

void func_00215CF0(void) {
    M2C_UNK sp30;
    M2C_UNK var_a1_247;
    M2C_UNK var_a1_272;
    s32 temp_v0_236;
    s32 temp_v1_493;
    s32 var_a0_271;
    s32 var_a2_287;
    s32 var_a3_274;
    s32 var_s1_395;
    s32 var_s1_755;
    s8 temp_v0_734;
    s8 temp_v1_539;
    s8 var_s0_379;
    s8 var_v0_253;
    s8 var_v0_563;
    u16 temp_a0_122;
    u16 temp_v1_141;
    u16 temp_v1_596;
    u16 temp_v1_758;
    u32 temp_a0_477;
    u32 temp_v1_902;
    u8 temp_s0_172;
    u8 temp_s1_335;
    u8 temp_s1_860;
    u8 temp_v0_145;
    u8 temp_v0_248;
    u8 temp_v0_417;
    u8 temp_v1_153;
    u8 temp_v1_15;
    u8 temp_v1_435;
    u8 temp_v1_77;
    u8 var_s0_752;
    u8 var_v0_147;
    u8 var_v0_671;
    void *temp_a1_14;
    void *temp_a1_328;
    void *temp_a1_853;
    void *temp_a2_410;
    void *temp_a2_420;
    void *temp_a2_76;
    void *temp_a2_8;
    void *temp_s0_325;
    void *temp_s0_653;
    void *temp_s0_850;
    void *temp_v0_217;
    void *temp_v0_47;
    void *temp_v0_517;
    void *temp_v0_533;
    void *temp_v0_615;
    void *temp_v0_664;
    void *temp_v0_836;
    void *temp_v1_189;
    void *temp_v1_243;
    void *temp_v1_302;
    void *temp_v1_503;
    void *temp_v1_606;
    void *temp_v1_618;
    void *temp_v1_684;
    void *temp_v1_81;
    void *temp_v1_827;
    void *var_v1_251;

    temp_a2_8 = *(void **)0x801CE8BC;
    temp_a1_14 = temp_a2_8 + (*(u8 *)((s8 *)(temp_a2_8) + (0x6072)));
    temp_v1_15 = (*(u8 *)((s8 *)(temp_a1_14) + (0x606E)));
    switch (temp_v1_15) {
    case 0:
        if ((*(u16 *)0x800E8100 & 0x8010) && (*(u8 *)0x801976DC < 0x1EU)) {
            (*(u8 *)((s8 *)(temp_a1_14) + (0x606E))) = 1U;
            (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x608B))) = 0U;
            goto block_10;
        }
        if (!(*(u16 *)0x800E8100 & 0x2020)) {
            *(void **)0x801CE8C4 = 1;
            return;
        }
        temp_v0_47 = *(void **)0x801CE8BC;
        (*(s8 *)((s8 *)((temp_v0_47 + (*(u8 *)((s8 *)(temp_v0_47) + (0x6072))))) + (0x606E))) = 1;
        (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x608B))) = 1U;
    default:
block_10:
        func_002159D0(temp_a1_14, temp_a2_8);
        return;
    case 2:
        if (*(s32 *)0x801CE8C4 == 0) {
            func_0021AE6C(0x3F800000, 0, temp_a2_8);
            (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x608C))) = 0;
            temp_a2_76 = *(void **)0x801CE8BC;
            temp_v1_77 = (*(u8 *)((s8 *)(temp_a2_76) + (0x608B)));
            if (temp_v1_77 == 0) {
                temp_v1_81 = temp_a2_76 + (*(u8 *)((s8 *)(temp_a2_76) + (0x6072)));
                (*(u8 *)((s8 *)(temp_v1_81) + (0x606E))) = (u8) ((*(u8 *)((s8 *)(temp_v1_81) + (0x606E))) + 1);
            } else if (temp_v1_77 == 1) {
                (*(s8 *)((s8 *)((temp_a2_76 + (*(u8 *)((s8 *)(temp_a2_76) + (0x6072))))) + (0x606E))) = 0xB;
                func_00055114(0x20003, 0xA, *(u8 *)0x800E9C12 == 0, -2, 0x78, 0x75, 0xC8, 0x87, 0x50, 0x6B, 0xF0, 0x91);
            }
block_123:
            func_0021C3B0();
            return;
        }
        return;
    case 3:
        temp_a0_122 = *(u16 *)0x800E8100;
        if (temp_a0_122 & 0x4000) {
            (*(u8 *)((s8 *)(temp_a1_14) + (0x606E))) = 0U;
            (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) = 0U;
            *(void **)0x801CE8C4 = 1;
            func_00208DC8(0x800EB1F0, 1, temp_a2_8);
block_122:
            temp_s0_850 = resource_alloc(0x6094);
            temp_a1_853 = temp_s0_850;
            (*(s32 *)((s8 *)(*(void **)0x801CE8C0) + (0x814))) = 0;
            memcpy(*(void **)0x801CE8BC, temp_a1_853, 0x6094);
            temp_s1_860 = (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x82E)));
            func_801EFAAC();
            (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x82E))) = temp_s1_860;
            memcpy(temp_s0_850 + 0x1C4, *(void **)0x801CE8BC + 0x1C4, 0x1360);
            memcpy(temp_s0_850 + 0x1524, *(void **)0x801CE8BC + 0x1524, 0x3C00);
            memcpy(temp_s0_850 + 0x5124, *(void **)0x801CE8BC + 0x5124, 0x19C);
            memcpy(temp_s0_850 + 0x52C0, *(void **)0x801CE8BC + 0x52C0, 0x400);
            (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x56C0))) = (s32) (*(s32 *)((s8 *)(temp_s0_850) + (0x56C0)));
            resource_free(temp_s0_850);
            goto block_123;
        }
        temp_v1_141 = *(u16 *)0x800E8700;
        if (temp_v1_141 & 0x200) {
            temp_v0_145 = (*(u8 *)((s8 *)(temp_a2_8) + (0x6073)));
            var_v0_147 = temp_v0_145 - 1;
            if (temp_v0_145 == 0) {
                var_v0_147 = 2;
            }
            goto block_25;
        }
        if (temp_v1_141 & 0x100) {
            temp_v1_153 = (*(u8 *)((s8 *)(temp_a2_8) + (0x6073)));
            var_v0_147 = temp_v1_153 + 1;
            if (temp_v1_153 < 2U) {
block_25:
                (*(u8 *)((s8 *)(temp_a2_8) + (0x6073))) = var_v0_147;
            } else {
                (*(u8 *)((s8 *)(temp_a2_8) + (0x6073))) = 0U;
            }
            func_00208DC8(0x800EB1F0, 2, temp_a2_8);
            return;
        }
        if (!(temp_a0_122 & 0x8000)) {
            if ((temp_a0_122 & 0x1000) && (func_00055234(0x10B, temp_a1_14, temp_a2_8) == 0)) {
                temp_v1_435 = (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6073)));
                if ((temp_v1_435 != 0) || (func_0020BF6C() == 0)) {
                    var_a0_271 = ((*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6073))) + 0x32) | 0x31000;
                } else {
                    var_a0_271 = 0x31035;
                }
                var_a1_272 = 0xB;
                var_a2_287 = (temp_v1_435 * 0x12) + 0x85;
                var_a3_274 = 0x6D;
                goto block_93;
            }
        } else {
            temp_s0_172 = (*(u8 *)((s8 *)(temp_a2_8) + (0x6073)));
            if (temp_s0_172 == 0) {
                if (func_0020BF6C(temp_a0_122, temp_a1_14, temp_a2_8) != 0) {
                    (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x606E))) = 0;
                    (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) = 0U;
                    func_00208DC8(0x800EB1F0, 0);
                    temp_v1_189 = *(void **)0x801CE8BC;
                    (0);
                    (*(u32 *)((s8 *)(temp_v1_189) + (0x1B0))) = (u32) ((*(u32 *)((s8 *)(temp_v1_189) + (0x1B0))) - 1);
                    if ((0)) {
                        (*(f32 *)((s8 *)(temp_v1_189) + (0x1AC))) = 0.0f;
                    }
                    func_0020BD5C(6);
                    return;
                }
                if ((*(u32 *)((s8 *)(*(void **)0x801CE8BC) + (0x1B0))) != 0) {
                    if (func_00055234(0xA, 0) == 0) {
                        temp_v0_217 = *(void **)0x801CE8BC;
                        temp_v0_236 = (*(u8 *)((s8 *)(temp_v0_217) + (0x6073))) * 0x12;
                        func_00055114(0x20000, 0xA, (*(s8 *)((s8 *)(temp_v0_217) + (0x1C3))), -2, temp_v0_236 + 0x85, 0x6D, temp_v0_236 + 0x97, 0x83, 0x72, 0x55, 0xCE, 0x9B);
                        temp_v1_243 = *(void **)0x801CE8BC;
                        var_a1_247 = 0;
                        temp_v0_248 = (*(u8 *)((s8 *)(temp_v1_243) + (0x6072))) + 1;
                        (*(u8 *)((s8 *)(temp_v1_243) + (0x6072))) = temp_v0_248;
                        var_v1_251 = temp_v1_243 + (temp_v0_248 & 0xFF);
                        var_v0_253 = 4;
                        goto block_95;
                    }
                } else {
                    goto block_48;
                }
            } else if (temp_s0_172 == 1) {
                if ((u32) (*(u32 *)((s8 *)(temp_a2_8) + (0x1B0))) >= 2U) {
                    if (*(u8 *)0x801936E0 != 0) {
                        if (func_00055234(0x10B, 0, temp_a2_8) == 0) {
                            var_a0_271 = 0x31033;
                            var_a1_272 = 0xB;
                            var_a3_274 = 0x6D;
                            var_a2_287 = ((*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6073))) * 0x12) + 0x85;
block_93:
                            func_00054e24(var_a0_271, var_a1_272, var_a2_287, var_a3_274);
                            var_v0_671 = (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072)));
                            var_a1_247 = 0;
block_94:
                            temp_v0_734 = var_v0_671 + 1;
                            (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) = temp_v0_734;
                            var_v1_251 = *(void **)0x801CE8BC + (temp_v0_734 & 0xFF);
                            var_v0_253 = 5;
block_95:
                            (*(s8 *)((s8 *)(var_v1_251) + (0x606E))) = var_v0_253;
                            func_00208DC8(0x800EB1F0, var_a1_247);
                            return;
                        }
                    } else {
                        (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x606E))) = 0;
                        (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) = 0U;
                        func_00208DC8(0x800EB1F0, 0, temp_a2_8);
                        temp_v1_302 = *(void **)0x801CE8BC;
                        (0);
                        (*(u32 *)((s8 *)(temp_v1_302) + (0x1B0))) = (u32) ((*(u32 *)((s8 *)(temp_v1_302) + (0x1B0))) - 2);
                        if ((0)) {
                            (*(f32 *)((s8 *)(temp_v1_302) + (0x1AC))) = 0.0f;
                        }
                        (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6087))) = 1;
                        *(void **)0x801CE8C4 = (s32) temp_s0_172;
                        temp_s0_325 = resource_alloc(0x6094);
                        temp_a1_328 = temp_s0_325;
                        (*(s32 *)((s8 *)(*(void **)0x801CE8C0) + (0x814))) = 0;
                        memcpy(*(void **)0x801CE8BC, temp_a1_328, 0x6094);
                        temp_s1_335 = (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x82E)));
                        func_801EFAAC();
                        (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x82E))) = temp_s1_335;
                        memcpy(temp_s0_325 + 0x1C4, *(void **)0x801CE8BC + 0x1C4, 0x1360);
                        memcpy(temp_s0_325 + 0x1524, *(void **)0x801CE8BC + 0x1524, 0x3C00);
                        memcpy(temp_s0_325 + 0x5124, *(void **)0x801CE8BC + 0x5124, 0x19C);
                        memcpy(temp_s0_325 + 0x52C0, *(void **)0x801CE8BC + 0x52C0, 0x400);
                        (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x56C0))) = (s32) (*(s32 *)((s8 *)(temp_s0_325) + (0x56C0)));
                        resource_free(temp_s0_325);
                        func_0021C3B0();
                        func_0020BD5C(1);
                        return;
                    }
                } else {
                    goto block_48;
                }
            } else {
                var_s0_379 = 0;
                if ((u32) (*(u32 *)((s8 *)(temp_a2_8) + (0x1B0))) < 3U) {
block_48:
                    func_00208DC8(0x800EB1F0, 7);
                    return;
                }
                var_s1_395 = 0;
                (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) = 0;
loop_51:
                if (func_00045df4((*(s16 *)((s8 *)((var_s1_395 + 0x801D0000)) + (-0x16FC)))) == 0) {
                    var_s0_379 += 1;
                    var_s1_395 += 6;
                    if (var_s0_379 < 6) {
                        goto loop_51;
                    }
                } else {
                    (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) = var_s0_379;
                }
                temp_a2_410 = *(void **)0x801CE8BC;
                (*(s32 *)((s8 *)(temp_a2_410) + (0x57D8))) = 0xFF;
                temp_v0_417 = (*(u8 *)((s8 *)(temp_a2_410) + (0x6072))) + 1;
                (*(u8 *)((s8 *)(temp_a2_410) + (0x6072))) = temp_v0_417;
                temp_a2_420 = temp_a2_410 + (temp_v0_417 & 0xFF);
                (*(s8 *)((s8 *)(temp_a2_420) + (0x606E))) = 7;
                func_00208DC8(0x800EB1F0, 0, temp_a2_420);
                return;
            }
        }
        break;
    case 4:
        temp_a0_477 = (*(u32 *)((s8 *)(*(void **)0x8018FDC0) + (0xD4)));
        if (temp_a0_477 == -2U) {
            (*(u8 *)((s8 *)(temp_a1_14) + (0x606E))) = 6U;
            return;
        }
        if (temp_a0_477 < 4U) {
            (*(u32 *)((s8 *)(temp_a2_8) + (0x1C0))) = temp_a0_477;
            temp_v1_493 = *(u8 *)0x801976DC * 0x19;
            if ((*(u8 *)((s8 *)((temp_v1_493 + 0x80190000)) + (0x7207))) != temp_a0_477) {
                (*(s8 *)((s8 *)((temp_v1_493 + 0x80190000)) + (0x7207))) = (s8) temp_a0_477;
                temp_v1_503 = *(void **)0x801CE8BC;
                (0);
                (*(u32 *)((s8 *)(temp_v1_503) + (0x1B0))) = (u32) ((*(u32 *)((s8 *)(temp_v1_503) + (0x1B0))) - 1);
                if ((0)) {
                    (*(f32 *)((s8 *)(temp_v1_503) + (0x1AC))) = 0.0f;
                }
            }
            temp_v0_517 = *(void **)0x801CE8BC;
            (*(s8 *)((s8 *)((temp_v0_517 + (*(u8 *)((s8 *)(temp_v0_517) + (0x6072))))) + (0x606E))) = 0xA;
            return;
        }
        if ((*(u16 *)0x800E8100 & 0x1000) && (func_00055234(0x10C, temp_a1_14, temp_a2_8) == 0)) {
            temp_v0_533 = func_00055234(0x100A);
            if (temp_v0_533 != 0) {
                var_a1_272 = 0xC;
                temp_v1_539 = (*(s8 *)((s8 *)(temp_v0_533) + (0x22)));
                var_a2_287 = 0x78;
                var_a0_271 = (temp_v1_539 + 0xF) | 0x32000;
                var_a3_274 = (temp_v1_539 * 0x14) + 0x5F;
                goto block_93;
            }
            var_v0_563 = (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) - 1;
block_89:
            (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) = var_v0_563;
            return;
        }
        break;
    case 5:
        if ((func_00055234(0x10C, temp_a1_14, temp_a2_8) == 0) && (func_00055234(0x10B) == 0)) {
            var_v0_563 = (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) - 1;
            goto block_89;
        }
        break;
    case 6:
        if (func_00055234(0x100A, temp_a1_14, temp_a2_8) == 0) {
            var_v0_563 = (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) - 1;
            goto block_89;
        }
        break;
    case 7:
        temp_v1_596 = *(void **)0x800E8100;
        if (temp_v1_596 & 0x8000) {
            if (func_001F21A4((u8) (*(s8 *)((s8 *)(temp_a2_8) + (0x57DC))), temp_a1_14, temp_a2_8) != 0) {
                temp_v1_606 = *(void **)0x801CE8BC;
                (*(s32 *)((s8 *)(temp_v1_606) + (0x57D8))) = 0;
                (*(s16 *)((s8 *)(temp_v1_606) + (0x6076))) = (s16) ((u8) (*(s8 *)((s8 *)(temp_v1_606) + (0x57DC))) | 0x8000);
                func_00208DC8(0x800EB1F0, 0);
                temp_v0_615 = *(void **)0x801CE8BC;
                (*(u8 *)((s8 *)(temp_v0_615) + (0x6072))) = 0U;
                temp_v1_618 = *(void **)0x801CE8BC;
                (*(u32 *)((s8 *)(temp_v0_615) + (0x1B0))) = 0U;
                (*(f32 *)((s8 *)(temp_v0_615) + (0x1AC))) = 0.0f;
                (*(s8 *)((s8 *)((temp_v1_618 + (*(u8 *)((s8 *)(temp_v1_618) + (0x6072))))) + (0x606E))) = 0;
block_121:
                *(void **)0x801CE8C4 = 1;
                goto block_122;
            }
            if (func_00055234(0x10B, 0) == 0) {
                func_00054e24(0x46077, 0xB, 0x96, 0x28, 0xAA, 0x3C, 0x1E, 0x1E, 0x122, 0x46);
                temp_s0_653 = func_00055234(0x10B);
                sprintf(&sp30, 0x801E6694, func_000453e0((u8) (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) + 0x27));
                strcpy_0002c950((*(void **)((s8 *)(temp_s0_653) + (0xD0))), &sp30);
                temp_v0_664 = (*(void **)((s8 *)(temp_s0_653) + (0xD0)));
                (*(void **)((s8 *)(temp_v0_664) + (0x530))) = temp_v0_664;
                (*(s8 *)((s8 *)((*(void **)((s8 *)(temp_s0_653) + (0xD0)))) + (0x5F5))) = 1;
                var_v0_671 = (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072)));
                var_a1_247 = 9;
                goto block_94;
            }
        } else {
            if (temp_v1_596 & 0x4000) {
                (*(s32 *)((s8 *)(temp_a2_8) + (0x57D8))) = 0;
                func_00208DC8(0x800EB1F0, 1, temp_a2_8);
                temp_v1_684 = *(void **)0x801CE8BC;
                (*(s16 *)((s8 *)(temp_v1_684) + (0x6076))) = 0;
                var_v0_563 = (*(u8 *)((s8 *)(temp_v1_684) + (0x6072))) - 1;
                goto block_89;
            }
            if (temp_v1_596 & 0x1000) {
                if (func_00055234(0x10C, (void *)1, temp_a2_8) == 0) {
                    var_a1_272 = 0xC;
                    var_a2_287 = 0x96;
                    var_a3_274 = 0x28;
                    var_a0_271 = (*(u8 *)((s8 *)((((u8) (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) * 6) + 0x801D0000)) + (-0x16FE))) | 0x3F000;
                    goto block_93;
                }
            } else if (*(u16 *)0x800E8700 & 0xC00) {
                var_s0_752 = (u8) (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC)));
                var_s1_755 = var_s0_752 * 6;
loop_98:
                temp_v1_758 = *(u16 *)0x800E8700;
                if (!(temp_v1_758 & 0x800)) {
                    if (temp_v1_758 & 0x400) {
                        var_s1_755 += 6;
                        if ((s32) var_s0_752 < 5) {
                            var_s0_752 += 1;
                        } else {
                            var_s1_755 = 0;
                            var_s0_752 = 0;
                        }
                    }
                } else {
                    var_s1_755 -= 6;
                    if (var_s0_752 != 0) {
                        var_s0_752 -= 1;
                    } else {
                        var_s1_755 = 0x1E;
                        var_s0_752 = 5;
                    }
                }
                if ((func_00045df4((*(s16 *)((s8 *)((var_s1_755 + 0x801D0000)) + (-0x16FC)))) == 0) && ((u8) (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) != var_s0_752)) {
                    goto loop_98;
                }
                if ((u8) (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) != var_s0_752) {
                    func_00208DC8(0x800EB1F0, 2);
                    (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x57DC))) = (s8) var_s0_752;
                    return;
                }
            }
        }
        break;
    case 10:
        if (func_00055234(0x100A, temp_a1_14, temp_a2_8) != 0) {
            return;
        }
block_120:
        (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6072))) = 0U;
        temp_v0_836 = *(void **)0x801CE8BC;
        (*(s8 *)((s8 *)((temp_v0_836 + (*(u8 *)((s8 *)(temp_v0_836) + (0x6072))))) + (0x606E))) = 0;
        goto block_121;
    case 11:
        if (func_00055234(0x100A, temp_a1_14, temp_a2_8) == 0) {
            temp_v1_827 = *(void **)0x801CE8BC;
            (*(u8 *)((s8 *)(temp_v1_827) + (0x6072))) = (u8) ((*(u8 *)((s8 *)(temp_v1_827) + (0x6072))) - 1);
            goto block_120;
        }
        temp_v1_902 = (*(u32 *)((s8 *)(*(void **)0x8018FDC0) + (0xD4)));
        if (temp_v1_902 < 2U) {
            *(u8 *)0x800E9C12 = (u8) (temp_v1_902 == 0);
        }
        break;
    }
}
