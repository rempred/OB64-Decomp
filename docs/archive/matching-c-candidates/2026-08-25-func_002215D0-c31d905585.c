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
enum { NULL = 0 };
typedef s32 M2C_UNK;
typedef s8 M2C_UNK8;
typedef s16 M2C_UNK16;
typedef s32 M2C_UNK32;
typedef s64 M2C_UNK64;
M2C_UNK func_001AD9D4(void *, M2C_UNK);                         
f32 func_001BC35C(s16, s16, u32, void **);                      
s32 func_001C8B54();                                            
s32 func_001C8B84(void **);                                     
s32 func_001C8E9C(void **);                                     
void **func_001C8FE8(s32);                                      
M2C_UNK func_001C9234(void *, M2C_UNK *, s32 *);                
M2C_UNK func_001CBF44();                                        
M2C_UNK func_001DB6CC(void *, s32);                             
M2C_UNK func_001DB8EC();                                        
s32 func_001DE10C();                                            
extern volatile s32 D_801CE8C8;

void func_002215D0(void) {
    M2C_UNK spScratch[8];
    s16 temp_s0_215;
    s16 temp_s0_225;
    s16 temp_s0_407;
    s16 temp_s0_417;
    s16 temp_v0_455;
    s16 temp_v0_458;
    s16 temp_v0_663;
    s16 temp_v0_764;
    s16 temp_v0_851;
    s16 temp_v1_256;
    s16 temp_v1_325;
    s16 temp_v1_668;
    s16 temp_v1_705;
    s16 temp_v1_711;
    s16 temp_v1_769;
    s16 temp_v1_856;
    s16 var_v0_219;
    s16 var_v0_411;
    s16 var_v0_461;
    s16 var_v0_670;
    s16 var_v0_713;
    s16 var_v0_771;
    s16 var_v0_858;
    s32 temp_v0_104;
    s32 temp_v1_149;
    s32 temp_v1_211;
    s32 temp_v1_403;
    s32 temp_v1_501;
    s32 var_s0_142;
    s32 var_s0_245;
    register s32 state_one;
    register s32 mode_three;
    register s32 reset_handler;
    s32 max_compare_705;
    s32 max_value_705;
    s32 quarter_value_705;
    s32 max_value_751;
    s32 quarter_value_751;
    s32 var_v0_548;
    u16 temp_v0_257;
    u16 temp_v0_302;
    u16 temp_v0_306;
    u16 temp_v0_326;
    u16 temp_v0_371;
    u16 temp_v0_375;
    u32 var_a2_249;
    u32 var_a2_295;
    u32 var_a2_364;
    u32 var_s2_116;
    u32 var_s2_143;
    u32 var_s2_166;
    u32 var_s2_199;
    u32 var_s2_391;
    u32 var_s2_437;
    u32 var_s2_481;
    u32 var_s2_521;
    u32 var_s2_569;
    u32 var_s2_605;
    u32 var_s2_751;
    u32 var_s2_818;
    u32 var_s2_840;
    u8 temp_v0_813;
    s32 var_s6_93;
    void **temp_t0_651;
    void **temp_v0_99;
    void **var_a1_144;
    void **var_a1_296;
    void **var_a1_365;
    void **var_a1_572;
    void **var_a2_438;
    void **var_a3_250;
    void **var_a3_319;
    void **var_a3_754;
    void **var_a3_841;
    void **var_s0_168;
    void **var_s0_608;
    void **var_s0_819;
    void **var_s1_482;
    void **var_s4_200;
    void **var_s4_392;
    void **var_s4_522;
    void **var_v1_117;
    void *temp_a0_146;
    void *temp_a0_176;
    void *temp_a0_298;
    void *temp_a0_305;
    void *temp_a0_321;
    void *temp_a0_367;
    void *temp_a0_374;
    void *temp_a0_445;
    void *temp_a0_579;
    void *temp_a0_615;
    void *temp_a0_826;
    void *temp_a1_252;
    void *temp_a1_448;
    void *temp_a1_662;
    void *temp_a1_704;
    void *temp_a1_761;
    void *temp_a1_848;
    void *temp_a2_664;
    void *temp_a2_706;
    void *temp_a2_765;
    void *temp_a2_852;
    void *temp_a3_648;
    void *temp_s0_489;
    void *temp_s0_529;
    void *temp_s1_532;
    void *temp_v0_119;
    void *temp_v0_207;
    void *temp_v0_399;
    s32 temp_v0_592;
    s32 temp_v0_628;
    void *temp_v0_652;
    void *temp_v0_694;
    void *temp_v0_740;
    void *temp_v0_796;
    void *temp_v0_882;
    void *temp_v1_307;
    void *temp_v1_376;
    void *temp_v1_590;
    void *temp_v1_626;
    void *temp_v1_677;
    void *temp_v1_683;
    void *temp_v1_720;
    void *temp_v1_726;
    void *temp_v1_778;
    void *temp_v1_784;
    void *temp_v1_865;
    void *temp_v1_871;

    if (*(s32 *)0x801CE8C4 != 0) {
        func_001DB8EC();
        D_801CE8C8 = D_801CE8C8 + 1;
    }
    var_s6_93 = 0;
    state_one = 1;
    mode_three = 3;
    reset_handler = 0x801B3CB8;
    do {
        temp_v0_99 = func_001C8FE8(var_s6_93);
        if (temp_v0_99 != NULL) {
            temp_v0_104 = (*(s32 *)((s8 *)(temp_v0_99) + (0x74)));
            switch (temp_v0_104) {
            case 0x6:
                var_s2_116 = 0;
                var_v1_117 = temp_v0_99;
                do {
                    temp_v0_119 = *var_v1_117;
                    if ((temp_v0_119 != NULL) && ((*(s16 *)((s8 *)(temp_v0_119) + (0x48))) < 5)) {
                        (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                    }
                    var_s2_116 += 1;
                    var_v1_117 += 1;
                } while (var_s2_116 < 3U);
                var_s6_93 += 1;
                break;
            case 0x2:
            case 0x8:
            case 0x21:
                if (func_001DE10C(temp_v0_99) != 0) {
                    (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                    goto block_199;
                }
                var_s6_93 += 1;
                break;
            case 0xA:
                var_s0_142 = 0;
                var_s2_143 = 0;
                var_a1_144 = temp_v0_99;
                do {
                    temp_a0_146 = *var_a1_144;
                    if (temp_a0_146 != NULL) {
                        temp_v1_149 = (*(s32 *)((s8 *)(temp_a0_146) + (0x94)));
                        (*(s32 *)((s8 *)(temp_a0_146) + (0x94))) = (s32) (temp_v1_149 - 1);
                        if (temp_v1_149 == 0) {
                            var_s0_142 = 1;
                        }
                    }
                    var_s2_143 += 1;
                    var_a1_144 += 1;
                } while (var_s2_143 < 3U);
                if ((func_001DE10C(temp_v0_99, var_a1_144) != 0) || (var_s0_142 != 0)) {
                    var_s2_166 = 0;
                    var_s0_168 = temp_v0_99;
                    do {
                        if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_166) & 1) {
                            temp_a0_176 = (*(void **)((s8 *)(var_s0_168) + (0)));
                            if (temp_a0_176 != NULL) {
                                func_001AD9D4(temp_a0_176 + 0x44, 0xC);
                                func_001DB6CC((*(void **)((s8 *)(var_s0_168) + (0))), (*(s32 *)((s8 *)(var_s0_168) + (0xC))));
                            }
                        }
                        var_s2_166 += 1;
                        var_s0_168 += 1;
                    } while (var_s2_166 < 3U);
                    (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                }
                goto block_199;
            case 0xC:
                if (func_001C8E9C(temp_v0_99) != 0) {
                    var_s2_199 = 0;
                    var_s4_200 = temp_v0_99;
                    do {
                        if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_199) & 1) {
                            temp_v0_207 = *var_s4_200;
                            if (temp_v0_207 != NULL) {
                                temp_v1_211 = (*(s32 *)((s8 *)(temp_v0_207) + (0x94)));
                                if (temp_v1_211 < 3) {
                                    temp_s0_215 = (*(s16 *)((s8 *)(temp_v0_207) + (0x1C)));
                                    var_v0_219 = temp_s0_215 + 2;
                                    if (func_001C8B84(temp_v0_99) == 0) {
                                        var_v0_219 = temp_s0_215 - 2;
                                    }
                                    goto block_39;
                                }
                                if (temp_v1_211 < 6) {
                                    temp_s0_225 = (*(s16 *)((s8 *)(temp_v0_207) + (0x1C)));
                                    var_v0_219 = temp_s0_225 - 2;
                                    if (func_001C8B84(temp_v0_99) == 0) {
                                        var_v0_219 = temp_s0_225 + 2;
                                    }
block_39:
                                    (*(s16 *)((s8 *)(temp_v0_207) + (0x1C))) = var_v0_219;
                                }
                                (*(s32 *)((s8 *)(temp_v0_207) + (0x94))) = (s32) ((*(s32 *)((s8 *)(temp_v0_207) + (0x94))) + 1);
                            }
                        }
                        var_s2_199 += 1;
                        var_s4_200 += 1;
                    } while (var_s2_199 < 3U);
                    var_s6_93 += 1;
                } else {
                    goto block_199;
                }
                break;
            case 0x32:
                var_s0_245 = 0;
                var_a2_249 = 0;
                if (func_001C8B84(temp_v0_99) != 0) {
                    var_a3_250 = temp_v0_99;
                    do {
                        temp_a1_252 = (*(void **)((s8 *)(var_a3_250) + (0)));
                        if (temp_a1_252 != NULL) {
                            temp_v1_256 = (*(s16 *)((s8 *)(temp_a1_252) + (0x28)));
                            temp_v0_257 = (*(u16 *)((s8 *)(temp_a1_252) + (0x1C))) + 8;
                            (*(u16 *)((s8 *)(temp_a1_252) + (0x1C))) = temp_v0_257;
                            if (((s16) temp_v0_257 - temp_v1_256) >= 0x26) {
                                (*(u16 *)((s8 *)(temp_a1_252) + (0x1C))) = (u16) (temp_v1_256 + 0x26);
                                var_s0_245 = 1;
                            }
                            (*(s32 *)((s8 *)(temp_a1_252) + (4))) = (s32) ((s16) (*(u16 *)((s8 *)(temp_a1_252) + (0x1C))) * 0x1E);
                            *(u16 *)((s8 *)*(void **)((s8 *)var_a3_250 + 0xC) + 0x1C) = *(u16 *)((s8 *)temp_a1_252 + 0x1C);
                        }
                        var_a2_249 += 1;
                        var_a3_250 += 1;
                    } while (var_a2_249 < 3U);
                    if (var_s0_245 != 0) {
                        (*(s32 *)((s8 *)(temp_v0_99) + (0x5C))) = (s32) ((*(s32 *)((s8 *)(temp_v0_99) + (0x5C))) + 0x26);
                        (*(s32 *)((s8 *)(temp_v0_99) + (0x58))) = (s32) ((*(s32 *)((s8 *)(temp_v0_99) + (0x58))) + 1);
                        (*(s32 *)((s8 *)(temp_v0_99) + (0x60))) = (s32) func_001BC35C((*(s16 *)((s8 *)(temp_v0_99) + (0x5E))), (*(s16 *)((s8 *)(temp_v0_99) + (0x66))), var_a2_249, var_a3_250);
                        var_a2_295 = 0;
                        var_a1_296 = temp_v0_99;
                        do {
                            temp_a0_298 = (*(void **)((s8 *)(var_a1_296) + (0)));
                            var_a2_295 += 1;
                            if (temp_a0_298 != NULL) {
                                temp_v0_302 = (*(u16 *)((s8 *)(temp_a0_298) + (0x1C)));
                                *(u16 *)((s8 *)*(void **)((s8 *)var_a1_296 + 0xC) + 0x28) = temp_v0_302;
                                (*(u16 *)((s8 *)(temp_a0_298) + (0x28))) = temp_v0_302;
                                temp_a0_305 = (*(void **)((s8 *)(var_a1_296) + (0xC)));
                                temp_v0_306 = (*(u16 *)((s8 *)(temp_v0_99) + (0x62)));
                                temp_v1_307 = (*(void **)((s8 *)(var_a1_296) + (0)));
                                (*(u16 *)((s8 *)(temp_a0_305) + (0x1E))) = temp_v0_306;
                                (*(u16 *)((s8 *)(temp_v1_307) + (0x1E))) = temp_v0_306;
                                (*(u16 *)((s8 *)(temp_a0_305) + (0x2A))) = temp_v0_306;
                                (*(u16 *)((s8 *)(temp_v1_307) + (0x2A))) = temp_v0_306;
                            }
                            var_a1_296 += 1;
                        } while (var_a2_295 < 3U);
                        goto block_67;
                    }
                    goto block_199;
                }
                var_a3_319 = temp_v0_99;
                do {
                    temp_a0_321 = (*(void **)((s8 *)(var_a3_319) + (0)));
                    if (temp_a0_321 != NULL) {
                        temp_v1_325 = (*(s16 *)((s8 *)(temp_a0_321) + (0x28)));
                        temp_v0_326 = (*(u16 *)((s8 *)(temp_a0_321) + (0x1C))) - 8;
                        (*(u16 *)((s8 *)(temp_a0_321) + (0x1C))) = temp_v0_326;
                        if ((temp_v1_325 - (s16) temp_v0_326) >= 0x26) {
                            (*(u16 *)((s8 *)(temp_a0_321) + (0x1C))) = (u16) (temp_v1_325 - 0x26);
                            var_s0_245 = 1;
                        }
                        (*(s32 *)((s8 *)(temp_a0_321) + (4))) = (s32) ((s16) (*(u16 *)((s8 *)(temp_a0_321) + (0x1C))) * 0x1E);
                        *(u16 *)((s8 *)*(void **)((s8 *)var_a3_319 + 0xC) + 0x1C) = *(u16 *)((s8 *)temp_a0_321 + 0x1C);
                    }
                    var_a2_249 += 1;
                    var_a3_319 += 1;
                } while (var_a2_249 < 3U);
                if (var_s0_245 != 0) {
                    (*(s32 *)((s8 *)(temp_v0_99) + (0x5C))) = (s32) ((*(s32 *)((s8 *)(temp_v0_99) + (0x5C))) - 0x26);
                    (*(s32 *)((s8 *)(temp_v0_99) + (0x58))) = (s32) ((*(s32 *)((s8 *)(temp_v0_99) + (0x58))) - 1);
                    (*(s32 *)((s8 *)(temp_v0_99) + (0x60))) = (s32) func_001BC35C((*(s16 *)((s8 *)(temp_v0_99) + (0x5E))), (*(s16 *)((s8 *)(temp_v0_99) + (0x66))), var_a2_249, var_a3_319);
                    var_a2_364 = 0;
                    var_a1_365 = temp_v0_99;
                    do {
                        temp_a0_367 = (*(void **)((s8 *)(var_a1_365) + (0)));
                        var_a2_364 += 1;
                        if (temp_a0_367 != NULL) {
                            temp_v0_371 = (*(u16 *)((s8 *)(temp_a0_367) + (0x1C)));
                            *(u16 *)((s8 *)*(void **)((s8 *)var_a1_365 + 0xC) + 0x28) = temp_v0_371;
                            (*(u16 *)((s8 *)(temp_a0_367) + (0x28))) = temp_v0_371;
                            temp_a0_374 = (*(void **)((s8 *)(var_a1_365) + (0xC)));
                            temp_v0_375 = (*(u16 *)((s8 *)(temp_v0_99) + (0x62)));
                            temp_v1_376 = (*(void **)((s8 *)(var_a1_365) + (0)));
                            (*(u16 *)((s8 *)(temp_a0_374) + (0x1E))) = temp_v0_375;
                            (*(u16 *)((s8 *)(temp_v1_376) + (0x1E))) = temp_v0_375;
                            (*(u16 *)((s8 *)(temp_a0_374) + (0x2A))) = temp_v0_375;
                            (*(u16 *)((s8 *)(temp_v1_376) + (0x2A))) = temp_v0_375;
                        }
                        var_a1_365 += 1;
                    } while (var_a2_364 < 3U);
block_67:
                    if (var_s0_245 != 0) {
                        (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                        goto block_199;
                    }
                    var_s6_93 += 1;
                } else {
                    goto block_199;
                }
                break;
            case 0x2D:
                var_s2_391 = 0;
                var_s4_392 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_391) & 1) {
                        temp_v0_399 = *var_s4_392;
                        if (temp_v0_399 != NULL) {
                            temp_v1_403 = (*(s32 *)((s8 *)(temp_v0_399) + (0x94)));
                            if (temp_v1_403 < 3) {
                                temp_s0_407 = (*(s16 *)((s8 *)(temp_v0_399) + (0x1C)));
                                var_v0_411 = temp_s0_407 + 2;
                                if (func_001C8B84(temp_v0_99) == 0) {
                                    var_v0_411 = temp_s0_407 - 2;
                                }
                                goto block_80;
                            }
                            if (temp_v1_403 < 6) {
                                temp_s0_417 = (*(s16 *)((s8 *)(temp_v0_399) + (0x1C)));
                                var_v0_411 = temp_s0_417 - 2;
                                if (func_001C8B84(temp_v0_99) == 0) {
                                    var_v0_411 = temp_s0_417 + 2;
                                }
block_80:
                                (*(s16 *)((s8 *)(temp_v0_399) + (0x1C))) = var_v0_411;
                            }
                            (*(s32 *)((s8 *)(temp_v0_399) + (0x94))) = (s32) ((*(s32 *)((s8 *)(temp_v0_399) + (0x94))) + 1);
                        }
                    }
                    var_s2_391 += 1;
                    var_s4_392 += 1;
                } while (var_s2_391 < 3U);
                var_s6_93 += 1;
                break;
            case 0x13:
                var_s2_437 = 0;
                var_a2_438 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_437) & 1) {
                        temp_a0_445 = (*(void **)((s8 *)(var_a2_438) + (0)));
                        if (temp_a0_445 != NULL) {
                            temp_a1_448 = (*(void **)((s8 *)(var_a2_438) + (0xC)));
                            if ((temp_a0_445 != NULL) & (temp_a1_448 != NULL)) {
                                temp_v0_455 = (*(s16 *)((s8 *)(temp_a0_445) + (0x34)));
                                if (temp_v0_455 != 0) {
                                    temp_v0_458 = temp_v0_455 - (*(s32 *)((s8 *)(temp_a0_445) + (0x94)));
                                    (*(s16 *)((s8 *)(temp_a0_445) + (0x34))) = temp_v0_458;
                                    var_v0_461 = temp_v0_458;
                                    if (var_v0_461 < 0) {
                                        var_v0_461 += 3;
                                    }
                                    (*(s16 *)((s8 *)(temp_a1_448) + (0x34))) = (s16) (var_v0_461 >> 2);
                                    if ((*(s16 *)((s8 *)(temp_a0_445) + (0x34))) < 0) {
                                        (*(s16 *)((s8 *)(temp_a1_448) + (0x34))) = 0;
                                        (*(s16 *)((s8 *)(temp_a0_445) + (0x34))) = 0;
                                    }
                                }
                            }
                        }
                    }
                    var_s2_437 += 1;
                    var_a2_438 += 1;
                } while (var_s2_437 < 3U);
                var_s6_93 += 1;
                break;
            case 0x23:
                var_s2_481 = 0;
                var_s1_482 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_481) & 1) {
                        temp_s0_489 = *var_s1_482;
                        if (temp_s0_489 != NULL) {
                            func_001C9234(temp_s0_489 + 0x44, &spScratch[0], &spScratch[1]);
                            if ((*(s16 *)((s8 *)(temp_s0_489) + (0x4E))) == spScratch[1]) {
                                temp_v1_501 = (*(s32 *)((s8 *)(temp_s0_489) + (0x94))) + 0xC;
                                if (temp_v1_501 >= 0x100) {
                                    (*(s32 *)((s8 *)(temp_s0_489) + (0x94))) = 0;
                                    (*(s32 *)((s8 *)(temp_s0_489) + (0))) = reset_handler;
                                    (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                                    (*(s16 *)((s8 *)(temp_s0_489) + (0x4C))) = 0;
                                } else {
                                    (*(s32 *)((s8 *)(temp_s0_489) + (0x94))) = temp_v1_501;
                                    (*(s16 *)((s8 *)(temp_s0_489) + (0x4C))) = mode_three;
                                }
                            }
                        }
                    }
                    var_s2_481 += 1;
                    var_s1_482 += 1;
                } while (var_s2_481 < 3U);
                var_s6_93 += 1;
                break;
            case 0x24:
                var_s2_521 = 0;
                var_s4_522 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_521) & 1) {
                        temp_s0_529 = *var_s4_522;
                        if (temp_s0_529 != NULL) {
                            temp_s1_532 = temp_s0_529 + 0x44;
                            func_001C9234(temp_s1_532, &spScratch[2], &spScratch[3]);
                            if (((*(s32 *)((s8 *)(temp_s0_529) + (0x94))) + 0xC) >= 0x100) {
                                (*(s32 *)((s8 *)(temp_s0_529) + (0x94))) = 0;
                                (*(s32 *)((s8 *)(temp_s0_529) + (0))) = reset_handler;
                                (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                                (*(s16 *)((s8 *)(temp_s0_529) + (0x4C))) = 0;
                            } else {
                                if (func_001C8B54() != 0) {
                                    var_v0_548 = (*(s32 *)((s8 *)(temp_s0_529) + (0x94))) + 0xC;
                                } else {
                                    var_v0_548 = (*(s32 *)((s8 *)(temp_s0_529) + (0x94))) + 0x40;
                                }
                                (*(s32 *)((s8 *)(temp_s0_529) + (0x94))) = var_v0_548;
                                (*(s16 *)((s8 *)(temp_s1_532) + (8))) = mode_three;
                            }
                        }
                    }
                    var_s2_521 += 1;
                    var_s4_522 += 1;
                } while (var_s2_521 < 3U);
                var_s6_93 += 1;
                break;
            case 0x2E:
                var_s2_569 = 0;
                var_a1_572 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_569) & 1) {
                        temp_a0_579 = *var_a1_572;
                        if (temp_a0_579 != NULL) {
                            *(u16 *)((s8 *)temp_a0_579 + 0x1E) += (s8)*(u8 *)(0x801E5E0F + *(s32 *)((s8 *)temp_a0_579 + 0x94));
                            temp_v1_590 = *var_a1_572;
                            temp_v0_592 = *(s32 *)((s8 *)temp_v1_590 + 0x94) - 1;
                            *(s32 *)((s8 *)temp_v1_590 + 0x94) = temp_v0_592;
                            if (temp_v0_592 == 0) {
                                (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                            }
                        }
                    }
                    var_s2_569 += 1;
                    var_a1_572 += 1;
                } while (var_s2_569 < 3U);
                var_s6_93 += 1;
                break;
            case 0x2F:
                var_s2_605 = 0;
                var_s0_608 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_605) & 1) {
                        temp_a0_615 = *var_s0_608;
                        if (temp_a0_615 != NULL) {
                            *(u16 *)((s8 *)temp_a0_615 + 0x1E) -= (s8)*(u8 *)(0x801E5E0F + *(s32 *)((s8 *)temp_a0_615 + 0x94));
                            temp_v1_626 = *var_s0_608;
                            temp_v0_628 = *(s32 *)((s8 *)temp_v1_626 + 0x94) - 1;
                            *(s32 *)((s8 *)temp_v1_626 + 0x94) = temp_v0_628;
                            if (temp_v0_628 == 0) {
                                (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                                func_001AD9D4(*var_s0_608 + 0x44, 0);
                            }
                        }
                    }
                    var_s2_605 += 1;
                    var_s0_608 += 1;
                } while (var_s2_605 < 3U);
                var_s6_93 += 1;
                break;
            case 0x39:
                temp_a3_648 = (*(void **)((s8 *)(temp_v0_99) + (0)));
                temp_t0_651 = func_001C8FE8((*(u8 *)((s8 *)(temp_v0_99) + (0xA6))));
                if ((*(u8 *)((s8 *)(temp_a3_648) + (0x37))) != 0) {
                    temp_v0_652 = (*(void **)((s8 *)(temp_t0_651) + (0)));
                    (*(M2C_UNK *)((s8 *)(temp_v0_652) + (0x36))) = ((*(M2C_UNK *)((s8 *)(temp_a3_648) + (0x36))));
                    (*(M2C_UNK *)((s8 *)(temp_v0_652) + (0x3A))) = ((*(M2C_UNK *)((s8 *)(temp_a3_648) + (0x3A))));
                }
                temp_a1_662 = (*(void **)((s8 *)(temp_v0_99) + (0)));
                temp_v0_663 = (*(s16 *)((s8 *)(temp_a1_662) + (0x34)));
                temp_a2_664 = (*(void **)((s8 *)(temp_v0_99) + (0xC)));
                if (temp_v0_663 != 0) {
                    temp_v1_668 = temp_v0_663 - (*(s32 *)((s8 *)(temp_a1_662) + (0x94)));
                    var_v0_670 = temp_v1_668;
                    (*(s16 *)((s8 *)(temp_a1_662) + (0x34))) = temp_v1_668;
                    if (var_v0_670 < 0) {
                        var_v0_670 += 3;
                    }
                    (*(s16 *)((s8 *)(temp_a2_664) + (0x34))) = (s16) (var_v0_670 >> 2);
                    temp_v1_677 = (*(void **)((s8 *)(temp_v0_99) + (0x18)));
                    if (temp_v1_677 != NULL) {
                        (*(u16 *)((s8 *)(temp_v1_677) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_662) + (0x34)));
                    }
                    temp_v1_683 = (*(void **)((s8 *)(temp_v0_99) + (0x1C)));
                    if (temp_v1_683 != NULL) {
                        (*(u16 *)((s8 *)(temp_v1_683) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_662) + (0x34)));
                    }
                    if ((*(s16 *)((s8 *)(temp_a1_662) + (0x34))) < 0) {
                        (*(s16 *)((s8 *)(temp_a2_664) + (0x34))) = 0;
                        (*(s16 *)((s8 *)(temp_a1_662) + (0x34))) = 0;
                        temp_v0_694 = (*(void **)((s8 *)(temp_v0_99) + (0x18)));
                        if (temp_v0_694 != NULL) {
                            (*(u16 *)((s8 *)(temp_v0_694) + (0x34))) = 0U;
                        }
                        if ((*(void **)((s8 *)(temp_v0_99) + (0x1C))) != NULL) {
                            *(u16 *)((s8 *)*(void **)((s8 *)temp_v0_99 + 0x18) + 0x34) = 0;
                        }
                    }
                }
                temp_a1_704 = (*(void **)((s8 *)(temp_t0_651) + (0)));
                temp_v1_705 = (*(s16 *)((s8 *)(temp_a1_704) + (0x34)));
                temp_a2_706 = (*(void **)((s8 *)(temp_t0_651) + (0xC)));
                max_compare_705 = 0xFF;
                if (temp_v1_705 != max_compare_705) {
                    temp_v1_711 = temp_v1_705 + (*(s32 *)((s8 *)(temp_a1_704) + (0x94)));
                    var_v0_713 = temp_v1_711;
                    (*(s16 *)((s8 *)(temp_a1_704) + (0x34))) = temp_v1_711;
                    if (var_v0_713 < 0) {
                        var_v0_713 += 3;
                    }
                    (*(s16 *)((s8 *)(temp_a2_706) + (0x34))) = (s16) (var_v0_713 >> 2);
                    temp_v1_720 = (*(void **)((s8 *)(temp_t0_651) + (0x18)));
                    if (temp_v1_720 != NULL) {
                        (*(u16 *)((s8 *)(temp_v1_720) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_704) + (0x34)));
                    }
                    temp_v1_726 = (*(void **)((s8 *)(temp_t0_651) + (0x1C)));
                    if (temp_v1_726 != NULL) {
                        (*(u16 *)((s8 *)(temp_v1_726) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_704) + (0x34)));
                    }
                    if ((*(s16 *)((s8 *)(temp_a1_704) + (0x34))) >= 0x100) {
                        max_value_705 = 0xFF;
                        quarter_value_705 = 0x3F;
                        (*(s16 *)((s8 *)(temp_a1_704) + (0x34))) = max_value_705;
                        (*(s16 *)((s8 *)(temp_a2_706) + (0x34))) = quarter_value_705;
                        temp_v0_740 = (*(void **)((s8 *)(temp_t0_651) + (0x18)));
                        if (temp_v0_740 != NULL) {
                            (*(u16 *)((s8 *)(temp_v0_740) + (0x34))) = max_value_705;
                        }
                        if ((*(void **)((s8 *)(temp_t0_651) + (0x1C))) != NULL) {
                            *(u16 *)((s8 *)*(void **)((s8 *)temp_t0_651 + 0x18) + 0x34) = max_value_705;
                        }
                    }
                }
                goto block_199;
            case 0x3B:
                var_s2_751 = 0;
                max_value_751 = 0xFF;
                quarter_value_751 = 0x3F;
                var_a3_754 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_751) & 1) {
                        temp_a1_761 = (*(void **)((s8 *)(var_a3_754) + (0)));
                        if (temp_a1_761 != NULL) {
                            temp_v0_764 = (*(s16 *)((s8 *)(temp_a1_761) + (0x34)));
                            temp_a2_765 = (*(void **)((s8 *)(var_a3_754) + (0xC)));
                            if (temp_v0_764 != max_value_751) {
                                temp_v1_769 = temp_v0_764 + (*(s32 *)((s8 *)(temp_a1_761) + (0x94)));
                                var_v0_771 = temp_v1_769;
                                (*(s16 *)((s8 *)(temp_a1_761) + (0x34))) = temp_v1_769;
                                if (var_v0_771 < 0) {
                                    var_v0_771 += 3;
                                }
                                (*(s16 *)((s8 *)(temp_a2_765) + (0x34))) = (s16) (var_v0_771 >> 2);
                                temp_v1_778 = (*(void **)((s8 *)(temp_v0_99) + (0x18)));
                                if (temp_v1_778 != NULL) {
                                    (*(u16 *)((s8 *)(temp_v1_778) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_761) + (0x34)));
                                }
                                temp_v1_784 = (*(void **)((s8 *)(temp_v0_99) + (0x1C)));
                                if (temp_v1_784 != NULL) {
                                    (*(u16 *)((s8 *)(temp_v1_784) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_761) + (0x34)));
                                }
                                if ((*(s16 *)((s8 *)(temp_a1_761) + (0x34))) >= 0x100) {
                                    (*(s16 *)((s8 *)(temp_a1_761) + (0x34))) = max_value_751;
                                    (*(s16 *)((s8 *)(temp_a2_765) + (0x34))) = quarter_value_751;
                                    temp_v0_796 = (*(void **)((s8 *)(temp_v0_99) + (0x18)));
                                    if (temp_v0_796 != NULL) {
                                        (*(u16 *)((s8 *)(temp_v0_796) + (0x34))) = max_value_751;
                                    }
                                    if ((*(void **)((s8 *)(temp_v0_99) + (0x1C))) != NULL) {
                                        *(u16 *)((s8 *)*(void **)((s8 *)temp_v0_99 + 0x18) + 0x34) = max_value_751;
                                    }
                                }
                            }
                        }
                    }
                    var_s2_751 += 1;
                    var_a3_754 += 1;
                } while (var_s2_751 < 3U);
                temp_v0_813 = (*(u8 *)((s8 *)(temp_v0_99) + (0xA6))) + 1;
                (*(u8 *)((s8 *)(temp_v0_99) + (0xA6))) = temp_v0_813;
                if ((temp_v0_813 & 0xFF) == 0x23) {
                    var_s2_818 = 0;
                    var_s0_819 = temp_v0_99;
                    do {
                        if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_818) & 1) {
                            temp_a0_826 = *var_s0_819;
                            if (temp_a0_826 != NULL) {
                                func_001AD9D4(temp_a0_826 + 0x44, 0x28);
                            }
                        }
                        var_s2_818 += 1;
                        var_s0_819 += 1;
                    } while (var_s2_818 < 3U);
                    (*(s32 *)((s8 *)(temp_v0_99) + (0x74))) = state_one;
                }
                goto block_199;
            case 0x3C:
                var_s2_840 = 0;
                var_a3_841 = temp_v0_99;
                do {
                    if (((s32) (*(u8 *)((s8 *)(temp_v0_99) + (0xA5))) >> var_s2_840) & 1) {
                        temp_a1_848 = (*(void **)((s8 *)(var_a3_841) + (0)));
                        if (temp_a1_848 != NULL) {
                            temp_v0_851 = (*(s16 *)((s8 *)(temp_a1_848) + (0x34)));
                            temp_a2_852 = (*(void **)((s8 *)(var_a3_841) + (0xC)));
                            if (temp_v0_851 != 0) {
                                temp_v1_856 = temp_v0_851 - (*(s32 *)((s8 *)(temp_a1_848) + (0x94)));
                                var_v0_858 = temp_v1_856;
                                (*(s16 *)((s8 *)(temp_a1_848) + (0x34))) = temp_v1_856;
                                if (var_v0_858 < 0) {
                                    var_v0_858 += 3;
                                }
                                (*(s16 *)((s8 *)(temp_a2_852) + (0x34))) = (s16) (var_v0_858 >> 2);
                                temp_v1_865 = (*(void **)((s8 *)(temp_v0_99) + (0x18)));
                                if (temp_v1_865 != NULL) {
                                    (*(u16 *)((s8 *)(temp_v1_865) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_848) + (0x34)));
                                }
                                temp_v1_871 = (*(void **)((s8 *)(temp_v0_99) + (0x1C)));
                                if (temp_v1_871 != NULL) {
                                    (*(u16 *)((s8 *)(temp_v1_871) + (0x34))) = (u16) (*(s16 *)((s8 *)(temp_a1_848) + (0x34)));
                                }
                                if ((*(s16 *)((s8 *)(temp_a1_848) + (0x34))) < 0) {
                                    (*(s16 *)((s8 *)(temp_a2_852) + (0x34))) = 0;
                                    (*(s16 *)((s8 *)(temp_a1_848) + (0x34))) = 0;
                                    temp_v0_882 = (*(void **)((s8 *)(temp_v0_99) + (0x18)));
                                    if (temp_v0_882 != NULL) {
                                        (*(u16 *)((s8 *)(temp_v0_882) + (0x34))) = 0U;
                                    }
                                    if ((*(void **)((s8 *)(temp_v0_99) + (0x1C))) != NULL) {
                                        *(u16 *)((s8 *)*(void **)((s8 *)temp_v0_99 + 0x18) + 0x34) = 0;
                                    }
                                }
                            }
                        }
                    }
                    var_s2_840 += 1;
                    var_a3_841 += 1;
                } while (var_s2_840 < 3U);
                func_001DE10C(temp_v0_99);
                goto block_199;
            case 0x1:
            case 0x3:
            case 0x4:
            case 0x5:
            case 0x7:
            case 0x9:
            case 0xB:
            case 0xD:
            case 0xE:
            case 0xF:
            case 0x10:
            case 0x11:
            case 0x12:
            case 0x14:
            case 0x15:
            case 0x16:
            case 0x17:
            case 0x18:
            case 0x19:
            case 0x1A:
            case 0x1B:
            case 0x1C:
            case 0x1D:
            case 0x1E:
            case 0x1F:
            case 0x20:
            case 0x22:
            case 0x25:
            case 0x26:
            case 0x27:
            case 0x28:
            case 0x29:
            case 0x2A:
            case 0x2B:
            case 0x2C:
            case 0x30:
            case 0x31:
            case 0x33:
            case 0x34:
            case 0x35:
            case 0x36:
            case 0x37:
            case 0x38:
            case 0x3A:
            default:
                goto block_199;
            }
        } else {
block_199:
            var_s6_93 += 1;
        }
    } while ((s32) var_s6_93 < 0x14);
    func_001CBF44();
}

