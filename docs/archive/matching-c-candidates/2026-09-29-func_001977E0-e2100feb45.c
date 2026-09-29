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
M2C_UNK func_0003fb94(M2C_UNK, M2C_UNK);                        
s32 func_000453e0(u16);                                         
s32 func_000454b0(u16);                                         
s32 func_0005148c(s32);                                         
void *func_00051eb0(M2C_UNK, M2C_UNK, M2C_UNK, M2C_UNK, s32, s32, s32, s32, s32, s32, s32);             
M2C_UNK func_0005219c(void *, M2C_UNK, s16, M2C_UNK, s32);             
M2C_UNK func_00052284(void *);                                  
s32 func_00134830(u8, s32, M2C_UNK, M2C_UNK, s32, s32);             
s32 func_001349BC(u8, s32, s32, M2C_UNK, s32, s32, s32);             
s32 func_0014F300(u8);                                          
M2C_UNK func_0015DF10();                         
M2C_UNK func_0015EF40(void *);                                  
M2C_UNK func_0019ADF0(void *, s32, M2C_UNK);                    
s32 func_0019B1B0(s32, u16);                                    
u8 func_0019B26C(u16, M2C_UNK);                                 
M2C_UNK func_0019B4C4(u16, u8, s32);                            
M2C_UNK func_0019B63C(u16, s32);                                
M2C_UNK func_0019B710(M2C_UNK, u8);                             
M2C_UNK func_0019B800(s32);                                     
M2C_UNK func_0019BAB4();                              
M2C_UNK func_0019BAE4(s32, M2C_UNK);                            
M2C_UNK func_0019BB34(s8);                                      
M2C_UNK func_0019BCA0();                                        
u32 func_0019BD14(u8, u16 *);                                   
u8 func_801DCF90(s32);                                          
s32 func_802189BC(u8);                                          
M2C_UNK memset_00023780(M2C_UNK, M2C_UNK);                      
u16 *resource_alloc(s32);                                       
M2C_UNK resource_free(u16 *);                                   

u8 func_001977E0(void) {
    M2C_UNK var_a0_479;
    M2C_UNK var_a1_424;
    s32 *var_s1_69;
    s32 *var_s2_68;
    s32 temp_f2_1188;
    s32 temp_f2_1216;
    s32 temp_s0_1053;
    s32 temp_v0_295;
    s32 temp_v0_308;
    s32 temp_v0_79;
    s32 temp_v1_340;
    s32 temp_v1_417;
    s32 temp_v1_448;
    s32 temp_v1_789;
    s32 temp_v1_816;
    s32 var_a0_1057;
    s32 var_a0_155;
    s32 var_a0_820;
    s32 var_s0_109;
    s32 var_s0_67;
    s32 var_s0_689;
    s32 var_s1_1052;
    s32 var_s1_293;
    s32 var_s2_303;
    s32 var_s3_65;
    s32 var_v0_1173;
    s32 var_v0_635;
    s32 var_v1_1191;
    s8 *var_v1_111;
    s8 var_a0_108;
    u16 *temp_a1_377;
    u16 *temp_a1_437;
    u16 *temp_s5_50;
    u16 *temp_v0_96;
    u16 *var_v1_150;
    u16 *var_v1_63;
    u16 temp_a0_379;
    u16 temp_a0_396;
    u16 temp_a0_623;
    u16 temp_a0_955;
    u16 temp_a1_71;
    u16 temp_v1_520;
    u16 var_a0_430;
    u32 var_a1_686;
    u32 var_v0_454;
    u8 *temp_v1_1068;
    u8 *var_v1_830;
    u8 temp_a0_405;
    u8 temp_a0_435;
    u8 temp_a0_573;
    u8 temp_a0_909;
    u8 temp_a1_1170;
    u8 temp_s0_399;
    u8 temp_s3_298;
    u8 temp_s4_301;
    u8 temp_v0_292;
    u8 temp_v1_1005;
    u8 temp_v1_1036;
    u8 temp_v1_27;
    u8 temp_v1_370;
    u8 temp_v1_911;
    u8 var_a1_1006;
    u8 var_v0_1196;
    u8 var_v0_306;
    u8 var_v0_373;
    u8 var_v0_489;
    u8 var_v0_517;
    u8 var_v0_525;
    u8 var_v0_867;
    void *temp_a0_1124;
    void *temp_a0_1130;
    void *temp_v0_239;
    void *temp_v0_375;
    void *temp_v1_395;
    void *temp_v1_622;
    void *temp_v1_954;

    temp_v1_27 = *(u8 *)0x80219D24;
    switch (temp_v1_27) {
    case 0:
        temp_s5_50 = *(u16 **)0x80219F20;
        memset_00023780(0x8021A010, 0xC8);
        memset_00023780(0x8021A0D8, 0x3C);
        memset_00023780(0x8021A114, 6);
        var_v1_63 = *(void **)0x80219F20;
        var_s3_65 = 0;
        var_s0_67 = 0;
        if ((*(u16 *)((s8 *)(var_v1_63) + (0))) != 0) {
            var_s2_68 = (s32 *)0x8021A0D8;
            var_s1_69 = (s32 *)0x8021A010;
            do {
                temp_a1_71 = *var_v1_63;
                if (temp_a1_71 & 0x8000) {
                    *var_s1_69 = temp_a1_71 & 0x7FFF;
                    temp_v0_79 = func_0019B1B0(*var_v1_63 & 0x7FFF, temp_a1_71) & 0xFF;
                    var_s1_69 += 1;
                    (*(s8 *)((s8 *)((temp_v0_79 + 0x80220000)) + (-0x5EEC))) = (s8) ((*(u8 *)((s8 *)((temp_v0_79 + 0x80220000)) + (-0x5EEC))) + 1);
                    var_s0_67 += 1;
                } else {
                    *var_s2_68 = (s32) temp_a1_71;
                    var_s2_68 += 1;
                    var_s3_65 += 1;
                }
                temp_v0_96 = *(void **)0x80219F20;
                var_v1_63 = temp_v0_96 + 1;
                *(void **)0x80219F20 = var_v1_63;
            } while ((*(u16 *)((s8 *)(temp_v0_96) + (2))) != 0);
        }
        resource_free(temp_s5_50);
        func_0019B800(var_s0_67);
        var_a0_108 = 0;
        var_s0_109 = 0;
        var_v1_111 = (s8 *)0x8021A11A;
        do {
            if ((*(u8 *)((s8 *)((var_a0_108 + 0x80220000)) + (-0x5EEC))) != 0) {
                *var_v1_111 = var_a0_108;
                var_v1_111 += 1;
                var_s0_109 += 1;
            }
            var_a0_108 += 1;
        } while (var_a0_108 < 6);
        if (*(s32 *)0x8021A0D8 != 0) {
            (*(s8 *)((s8 *)((var_s0_109 + 0x80220000)) + (-0x5EE6))) = 6;
            var_s0_109 += 1;
        }
        *(u8 *)0x8021A122 = var_s0_109 - 1;
        *(u8 *)0x8021A121 = 0;
        func_0019BB34(var_a0_108);
        var_v1_150 = resource_alloc((*(u8 *)0x8021A122 + 1) * 0xA);
        *(u16 **)0x80219F40 = var_v1_150;
        var_a0_155 = 0;
        if (0 == 0) {
            do {
                if (var_a0_155 == *(u8 *)0x8021A122) {
                    (*(s16 *)((s8 *)(var_v1_150) + (6))) = (s16) (var_s3_65 - 1);
                } else {
                    (*(s16 *)((s8 *)(var_v1_150) + (6))) = (s16) ((*(u8 *)((s8 *)(((*(s8 *)((s8 *)((var_a0_155 + 0x80220000)) + (-0x5EE6))) + 0x80220000)) + (-0x5EEC))) - 1);
                }
                (*(s16 *)((s8 *)(var_v1_150) + (8))) = 0xFF;
                (*(s16 *)((s8 *)(var_v1_150) + (2))) = 0;
                (*(u16 *)((s8 *)(var_v1_150) + (0))) = 0;
                (*(s16 *)((s8 *)(var_v1_150) + (4))) = 4;
                var_a0_155 += 1;
                var_v1_150 += 5;
            } while ((s32) *(u8 *)0x8021A122 >= var_a0_155);
        }
        (*(void **)((s8 *)((void *)0x80219F28) + (0))) = func_00051eb0(0x400, 0, 0x80216164, 0x18, 0x16, 0x20, 0x1E, 0x18, 0x16, 0xB2, 0x6F);
        *(void **)0x80219F2C = func_00051eb0(0, 0, 0x80216C54, 0x120, 0x18, 0x128, 0x20, 0xBC, 0x18, 0x128, 0xAE);
        temp_v0_239 = func_00051eb0(0x100, 0, 0x8021794C, 0x9C, 0xD6, 0xA4, 0xDE, 0x18, 0xB6, 0x128, 0xDE);
        *(void **)0x80219F30 = temp_v0_239;
        func_0019ADF0(temp_v0_239, *(s32 *)0x8021A010, 0);
        *(void **)0x80219F34 = func_00051eb0(0, 0, 0x80217A34, 0x18, 0x77, 0x20, 0x7F, 0x18, 0x77, 0xB2, 0xAD);
        *(void **)0x80219F38 = 0;
        *(s32 *)0x80219F3C = 0;
        *(u8 *)0x8021A123 = 1;
        *(u8 *)0x80219F04 = 0;
        *(u8 *)0x80219F00 = 0;
        *(u8 *)0x80219D24 = 1U;
        break;
    case 1:
        if ((u8) *(u8 *)0x80219F00 >= 9U) {
            var_s1_293 = 0;
            temp_v0_292 = func_801DCF90((*(s32 *)((s8 *)(((*(s32 *)0x801F3658 * 4) + 0x801F0000)) + (0xCB0))));
            temp_v0_295 = temp_v0_292 * 2;
            temp_s3_298 = (*(u8 *)((s8 *)((temp_v0_295 + 0x80220000)) + (-0x63D7)));
            temp_s4_301 = (*(u8 *)((s8 *)((temp_v0_295 + 0x80220000)) + (-0x63D8)));
            var_s2_303 = 0;
            if (temp_s3_298 != 0) {
                var_v0_306 = temp_s4_301;
                do {
                    temp_v0_308 = var_v0_306 * 4;
                    if (var_s2_303 < func_0005148c((*(s32 *)((s8 *)(temp_v0_308) + (0x80219C5C))))) {
                        var_s2_303 = func_0005148c((*(s32 *)((s8 *)(temp_v0_308) + (0x80219C5C))));
                    }
                    var_s1_293 += 1;
                    var_v0_306 = temp_s4_301 + var_s1_293;
                } while (var_s1_293 < (s32) temp_s3_298);
            }
            temp_v1_340 = (s32) (var_s2_303 + 0x37) / 2;
            *(void **)0x80219F38 = func_00051eb0(0x100, 0, 0x802182E4, 0x9C, 0x74, 0xA4, 0x7C, (s32) (s16) (0xA0 - temp_v1_340), 0x5A, (s32) (s16) (temp_v1_340 + 0xA0), 0x96);
            (*(u8 *)((s8 *)(*(void **)0x80219F38) + (0x22))) = temp_v0_292;
            *(u8 *)0x80219F00 = 0U;
            *(u8 *)0x80219D24 = 2U;
        }
block_135:
        var_v0_373 = *(u8 *)0x80219F00 + 1;
block_136:
        *(u8 *)0x80219F00 = var_v0_373;
        break;
    case 2:
        temp_v1_370 = *(u8 *)0x80219F00;
        var_v0_373 = temp_v1_370 + 1;
        if (temp_v1_370 >= 9U) {
            temp_v0_375 = *(void **)0x801F0CA0;
            temp_a1_377 = *(u16 **)0x800C4BDC;
            temp_a0_379 = (*(u16 *)((s8 *)(temp_v0_375) + (2)));
            if (*temp_a1_377 & ((*(u16 *)((s8 *)(temp_v0_375) + (0))) | temp_a0_379)) {
                func_0019BAB4(temp_a0_379, temp_a1_377);
                func_0015DF10(6);
block_117:
                *(u8 *)0x80219D24 = 3U;
            }
        } else {
            goto block_136;
        }
        break;
    case 3:
        temp_v1_395 = *(void **)0x801F0CA0;
        temp_a0_396 = **(u16 **)0x800C4BDC;
        temp_s0_399 = *(u8 *)0x8021A121;
        if ((*(u16 *)((s8 *)(temp_v1_395) + (0))) & temp_a0_396) {
            temp_a0_405 = temp_s0_399 & 0xFF;
            if (temp_a0_405 == *(u8 *)0x8021A122) {
                temp_v1_417 = (*(s32 *)((s8 *)(((*((temp_a0_405 * 0xA) + *(u8 **)0x80219F40) * 4) + 0x80220000)) + (-0x5F28)));
                var_a1_424 = 0;
                *(s32 *)0x80219F08 = temp_v1_417;
                *(u32 *)0x80219F0C = (u32) (*(u16 *)((s8 *)(((temp_v1_417 * 0xC) + 0x80190000)) + (-0x192E)));
                var_a0_430 = temp_v1_417 & 0xFFFF;
            } else {
                temp_a0_435 = *(u8 *)0x8021A121;
                temp_a1_437 = *(u8 **)0x80219F40;
                temp_v1_448 = (*(s32 *)((s8 *)((((*((temp_a0_435 * 0xA) + temp_a1_437) + (func_802189BC(temp_a0_405) & 0xFF)) * 4) + 0x80220000)) + (-0x5FF0)));
                *(u8 *)0x80219F08 = temp_v1_448;
                if (temp_v1_448 == 0xFA) {
                    var_v0_454 = func_0019BD14(temp_a0_435, temp_a1_437);
                } else {
                    var_v0_454 = (u32) (*(u16 *)((s8 *)(((temp_v1_448 << 5) + 0x80190000)) + (-0x3BEC)));
                }
                *(u8 *)0x80219F0C = var_v0_454;
                var_a0_430 = *(u16 *)0x80219F0A;
                var_a1_424 = 1;
            }
            *(u8 *)0x80219F02 = func_0019B26C(var_a0_430, var_a1_424);
            var_a0_479 = 9;
            if ((u32) *(u32 *)0x80196A6C < (u32) *(u8 *)0x80219F0C) {
                *(u8 *)0x80219F05 = 0x4D;
                *(u8 *)0x80219F06 = 1;
                *(s32 *)0x80219F10 = 0;
                var_v0_489 = 0xA;
                goto block_108;
            }
            if (*(void **)0x80219F02 != 0) {
                *(u8 *)0x80219D24 = 4U;
                func_0015DF10(6);
            } else {
                var_a0_479 = 9;
                *(u8 *)0x80219F05 = 0x4EU;
                *(u8 *)0x80219F06 = 1U;
                *(void **)0x80219F10 = 0;
                var_v0_489 = 0xA;
block_108:
                *(u8 *)0x80219D24 = var_v0_489;
                func_0015DF10(var_a0_479);
            }
        } else {
            var_v0_517 = 0xE;
            if (!((*(u16 *)((s8 *)(temp_v1_395) + (2))) & temp_a0_396)) {
                temp_v1_520 = **(u16 **)0x800C4C4C;
                if (!(temp_v1_520 & 0x200)) {
                    if (temp_v1_520 & 0x100) {
                        var_v0_525 = temp_s0_399 + 1;
                        if (temp_s0_399 >= (u8) *(u8 *)0x8021A122) {
                            var_v0_525 = 0;
                        }
                        goto block_55;
                    }
                    func_0015EF40(*(u8 **)0x80219F40 + (temp_s0_399 * 0xA));
                } else {
                    var_v0_525 = temp_s0_399 - 1;
                    if (temp_s0_399 == 0) {
                        var_v0_525 = *(u8 *)0x8021A122;
                    }
block_55:
                    *(u8 *)0x8021A121 = var_v0_525;
                }
                if ((**(u32 **)0x800C4C4C & 0xC0F) || (*(u8 *)0x8021A121 != temp_s0_399)) {
                    if (*(u8 *)0x8021A121 != temp_s0_399) {
                        func_0015DF10(2);
                    }
                    resource_free((*(u16 **)((s8 *)(*(void **)0x80219F30) + (0xD0))));
                    temp_a0_573 = *(u8 *)0x8021A121;
                    if (temp_a0_573 == *(u8 *)0x8021A122) {
                        func_0019ADF0(*(void **)0x80219F30, (*(s32 *)((s8 *)(((*((temp_a0_573 * 0xA) + *(u8 **)0x80219F40) * 4) + 0x80220000)) + (-0x5F28))), 3);
                    } else {
                        func_0019ADF0(*(void **)0x80219F30, (*(s32 *)((s8 *)((((*((*(u8 *)0x8021A121 * 0xA) + *(u8 **)0x80219F40) + (func_802189BC(temp_a0_573) & 0xFF)) * 4) + 0x80220000)) + (-0x5FF0))), 0);
                    }
                }
            } else {
block_93:
                *(u8 *)0x80219D24 = var_v0_517;
                func_0015DF10(1);
            }
        }
        break;
    case 4:
        temp_v1_622 = *(void **)0x801F0CA0;
        temp_a0_623 = **(u16 **)0x800C4BDC;
        if ((*(u16 *)((s8 *)(temp_v1_622) + (0))) & temp_a0_623) {
            if (*(u8 *)0x8021A121 == *(u8 *)0x8021A122) {
                var_v0_635 = func_000453e0(*(u16 *)0x80219F0A);
            } else {
                var_v0_635 = func_000454b0(*(u16 *)0x80219F0A);
            }
            *(void **)0x80219F10 = var_v0_635;
            func_0019BAE4(*(u8 *)0x8021A123 & 0x7F, 0x80219F18);
            var_a0_479 = 6;
            *(u8 *)0x80219F05 = 0x56U;
            *(s32 *)0x80219F14 = 0x80219F18;
            var_v0_489 = 7;
            goto block_108;
        }
        if ((*(u16 *)((s8 *)(temp_v1_622) + (2))) & temp_a0_623) {
            *(u8 *)0x80219D24 = 3U;
            *(u8 *)0x8021A123 = 1U;
            func_0015DF10(1);
        } else {
            func_0019B710(0x8021A123, *(void **)0x80219F02);
        }
        break;
    case 5:
        var_a1_686 = *(u8 *)0x8021A123 & 0x7F;
        var_s0_689 = var_a1_686 - 1;
        if (var_a1_686 >= 0xBU) {
            var_s0_689 = var_a1_686 - 0xA;
            var_a1_686 = 0x80196A6C;
            *(u32 *)0x80196A6C = (u32) (*(u32 *)0x80196A6C - (*(u8 *)0x80219F0C * 0xA));
        } else {
            *(void **)0x80196A6C = (u32) (*(void **)0x80196A6C - *(u8 *)0x80219F0C);
        }
        func_0015DF10(0x12, (void *) var_a1_686);
        if (!(var_s0_689 & 0xFF)) {
            func_0019B4C4(*(u16 *)0x80219F0A, *(u8 *)0x80219F01, *(u8 *)0x8021A121 != *(u8 *)0x8021A122);
            *(u8 *)0x8021A123 = 1U;
            goto block_117;
        }
        *(u8 *)0x8021A123 = (u8) (var_s0_689 + (*(u8 *)0x8021A123 & 0x80));
        break;
    case 6:
        if ((u8) *(u8 *)0x80219F00 >= 9U) {
            *(void **)0x80219F10 = (s32) (((*(u8 *)((s8 *)(((*(s32 *)0x801F3658 * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80193BC0);
            *(void **)0x80219F14 = func_000453e0(*(u16 *)0x80219F0A);
            *(u8 *)0x80219F05 = 0x55U;
            *(u8 *)0x80219D24 = 8U;
        }
        goto block_135;
    case 7:
    case 8:
        temp_v1_789 = func_001349BC(*(u8 *)0x80219F05, *(void **)0x80219F10, *(void **)0x80219F14, 0, 0, 2, 0x64) & 0xFF;
        if (temp_v1_789 == 1) {
            if (*(u8 *)0x80219D24 == 7) {
                var_v0_517 = 4;
                if (*(u8 *)0x8019EE40 == 0) {
                    *(u8 *)0x80219F01 = (u8) (*(u8 *)0x8021A123 & 0x7F);
                    if (*(u8 *)0x8021A121 == *(u8 *)0x8021A122) {
                        temp_v1_816 = func_0014F300(*(u8 *)0x801F365B) & 0xFF;
                        *(u8 *)0x80219F03 = 0;
                        var_a0_820 = 0;
                        if (temp_v1_816 > 0) {
                            var_v1_830 = (*(s32 *)0x801F3658 * 0x19) + 0x801971FD;
                            do {
                                var_a0_820 += 1;
                                if (*var_v1_830 == 0) {
                                    *(void **)0x80219F03 = (u8) (*(void **)0x80219F03 + 1);
                                }
                                var_v1_830 += 1;
                            } while (var_a0_820 < temp_v1_816);
                        }
                        var_a0_479 = 6;
                        if (*(void **)0x80219F03 != 0) {
                            *(u8 *)0x80219F04 = 2U;
                            var_v0_489 = 6;
block_107:
                            *(u8 *)0x80219F00 = 0U;
                            goto block_108;
                        }
                        *(u8 *)0x80219F05 = 0x4FU;
                        *(u8 *)0x80219F06 = 2U;
                        *(void **)0x80219F10 = 0;
                        var_v0_867 = 0xB;
                        goto block_104;
                    }
                    *(u8 *)0x80219D24 = 5U;
                    func_0003fb94(0x800EB1F0, 0x2C7);
                } else {
                    goto block_93;
                }
            } else {
                if (*(void **)0x8019EE40 == 0) {
                    temp_a0_909 = *(void **)0x80219F03;
                    temp_v1_911 = *(u8 *)0x8021A123;
                    *(void **)0x80219F38 = func_00051eb0(0, 0, 0x802181A4, 0x9C, 0x74, 0xA4, 0x7C, 0x64, 0x6C, 0xDC, 0x84);
                    if (temp_v1_911 < temp_a0_909) {
                        (*(u8 *)((s8 *)(*(void **)0x80219F38) + (0x22))) = temp_v1_911;
                    } else {
                        (*(u8 *)((s8 *)(*(void **)0x80219F38) + (0x22))) = temp_a0_909;
                    }
                    var_a0_479 = 6;
                    *(u8 *)0x8021A124 = 1;
                    var_v0_489 = 9;
                    goto block_108;
                }
                *(u8 *)0x80219F04 = 1U;
                *(u8 *)0x80219F00 = 0U;
                var_v0_867 = 0xD;
block_104:
                *(u8 *)0x80219D24 = var_v0_867;
                func_0003fb94(0x800EB1F0, 0x2C7);
            }
        } else {
            var_a0_479 = 1;
            if (temp_v1_789 == 3) {
                *(u8 *)0x80219F04 = 1U;
                var_v0_489 = 4;
                goto block_108;
            }
        }
        break;
    case 9:
        temp_v1_954 = *(void **)0x801F0CA0;
        temp_a0_955 = **(u16 **)0x800C4BDC;
        if ((*(u16 *)((s8 *)(temp_v1_954) + (0))) & temp_a0_955) {
            func_0019BAB4(temp_a0_955);
            *(void **)0x80219F10 = func_000453e0(*(u16 *)0x80219F0A);
            *(u8 *)0x80219F05 = 0x58U;
            *(u8 *)0x80219F06 = 2U;
            var_v0_867 = 0xC;
            goto block_104;
        }
        if ((*(u16 *)((s8 *)(temp_v1_954) + (2))) & temp_a0_955) {
            func_0019BAB4(temp_a0_955);
            var_a0_479 = 1;
            var_v0_489 = 6;
            goto block_107;
        }
        temp_v1_1005 = *(u8 *)0x8021A123;
        var_a1_1006 = *(void **)0x80219F03;
        if (temp_v1_1005 < var_a1_1006) {
            var_a1_1006 = temp_v1_1005;
        }
        func_0019B710(0x8021A124, var_a1_1006);
        break;
    case 10:
    case 11:
    case 12:
        if (func_00134830(*(u8 *)0x80219F05, *(void **)0x80219F10, 0, 0, (s32) *(u8 *)0x80219F06, 0x70) != 2) {
            func_0015DF10(6);
            temp_v1_1036 = *(u8 *)0x80219D24;
            if (temp_v1_1036 == 0xA) {
                goto block_117;
            }
            if (temp_v1_1036 != 0xB) {
                var_s1_1052 = *(u8 *)0x8021A124 & 0x7F;
                temp_s0_1053 = var_s1_1052 & 0xFF;
                func_0019B63C(*(u16 *)0x80219F0A, temp_s0_1053);
                var_a0_1057 = 0;
                if (temp_s0_1053 != 0) {
                    do {
                        temp_v1_1068 = (*(s32 *)0x801F3658 * 0x19) + 0x801971FD + var_a0_1057;
                        var_a0_1057 += 1;
                        if (*temp_v1_1068 == 0) {
                            var_s1_1052 -= 1;
                            *temp_v1_1068 = (u8) *(u8 *)0x80219F08;
                        }
                    } while ((var_a0_1057 < 0xA) & (var_s1_1052 & 0xFF));
                }
                *(u8 *)0x80219F04 = 1U;
            }
            *(u8 *)0x80219D24 = 5U;
        }
        break;
    case 13:
        if ((u8) *(u8 *)0x80219F00 >= 9U) {
            *(void **)0x80219F10 = func_000453e0(*(u16 *)0x80219F0A);
            *(u8 *)0x80219F05 = 0x57U;
            *(u8 *)0x80219F06 = 2U;
            *(u8 *)0x80219D24 = 0xBU;
        }
        goto block_135;
    case 14:
        func_00052284((*(void **)((s8 *)((void *)0x80219F28) + (0))));
        func_00052284((*(void **)((s8 *)((void *)0x80219F28) + (4))));
        func_00052284((*(void **)((s8 *)((void *)0x80219F28) + (8))));
        func_00052284((*(void **)((s8 *)((void *)0x80219F28) + (0xC))));
        temp_a0_1124 = (*(void **)((s8 *)((void *)0x80219F28) + (0x10)));
        if (temp_a0_1124 != 0) {
            func_00052284(temp_a0_1124);
        }
        temp_a0_1130 = (*(void **)((s8 *)((void *)0x80219F28) + (0x14)));
        if (temp_a0_1130 != 0) {
            func_00052284(temp_a0_1130);
        }
        (*(void **)((s8 *)((void *)0x80219F28) + (0))) = 0;
        (*(void **)((s8 *)((void *)0x80219F28) + (4))) = 0;
        (*(void **)((s8 *)((void *)0x80219F28) + (8))) = 0;
        (*(void **)((s8 *)((void *)0x80219F28) + (0xC))) = 0;
        (*(void **)((s8 *)((void *)0x80219F28) + (0x10))) = 0;
        (*(void **)((s8 *)((void *)0x80219F28) + (0x14))) = 0;
        *(u8 *)0x80219D24 = 0xFU;
        *(u8 *)0x80219F00 = 0U;
        break;
    case 15:
        if ((u8) *(u8 *)0x80219F00 >= 0xBU) {
            func_0019BCA0();
            resource_free(*(u8 **)0x80219F40);
            *(u8 *)0x80219D24 = 0U;
        }
        goto block_135;
    }
    temp_a1_1170 = *(u8 *)0x80219F04;
    var_v0_1173 = temp_a1_1170 & 2;
    if (temp_a1_1170 & 1) {
        var_v0_1173 = temp_a1_1170 & 2;
        if (*(void **)0x80219F30 != 0) {
            temp_f2_1188 = (s32) ((f64) (*(s16 *)((s8 *)(*(void **)0x80219F30) + (0x32))) - *(f64 *)0x80219DA0);
            var_v1_1191 = temp_f2_1188;
            var_v0_1196 = temp_a1_1170 & 0xFE;
            if ((s16) temp_f2_1188 < 0xB6) {
                var_v1_1191 = 0xB6;
                goto block_145;
            }
            goto block_146;
        }
    }
    if ((var_v0_1173 != 0) && (*(void **)0x80219F30 != 0)) {
        temp_f2_1216 = (s32) ((f64) (*(s16 *)((s8 *)(*(void **)0x80219F30) + (0x32))) + *(f64 *)0x80219DA8);
        var_v1_1191 = temp_f2_1216;
        var_v0_1196 = temp_a1_1170 & 0xFD;
        if ((s16) temp_f2_1216 >= 0x100) {
            var_v1_1191 = 0xFF;
block_145:
            *(u8 *)0x80219F04 = var_v0_1196;
        }
block_146:
        func_0005219c(*(void **)0x80219F30, 0x18, (s16) var_v1_1191, 0x128, (s32) (s16) (var_v1_1191 + 0x28));
    }
    return *(u8 *)0x80219D24;
}
