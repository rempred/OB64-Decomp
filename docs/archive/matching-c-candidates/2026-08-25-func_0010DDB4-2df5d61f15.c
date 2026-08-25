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
s32 func_00022e60();                                            
M2C_UNK func_0002de50(M2C_UNK, M2C_UNK, s32);                   
M2C_UNK func_0005c090(M2C_UNK, M2C_UNK);                        
M2C_UNK func_000ec838(M2C_UNK, s32, M2C_UNK, M2C_UNK, s32, s32, s32, s32, s32);             
M2C_UNK func_000f6b10(void *, f32 *, f32 *, f32 *);                 
M2C_UNK func_0010746C(void *, M2C_UNK);                         
M2C_UNK func_00109C04();                                        
M2C_UNK func_00109C3C(void *);                                  
M2C_UNK func_00118500(void *, void *);                          
M2C_UNK func_0011BB4C();                                        
M2C_UNK func_00129948(void *);                                  
s32 func_0012DA10(void *);                                      
s32 func_0012DA9C(void *);                                      
s32 func_0012E7E8(void *);                                      
s32 func_0012E968(void *);                                      
M2C_UNK func_0012EA80(M2C_UNK, f32 *, s32);                     
M2C_UNK func_0012F140(void *);                                  
s8 func_0012F530(void *);                                       
M2C_UNK func_0012F8C0(void *);                                  
s32 func_0012FBB8(s32, s32);                                    
M2C_UNK func_00130E60(u16, M2C_UNK);                            
M2C_UNK func_00131050();                                        
M2C_UNK func_0013109C(u16);                                     
M2C_UNK func_00132B80(u16);                                     
M2C_UNK func_00147BDC(s32 *);                                   
M2C_UNK func_0015DF10(M2C_UNK);                                 
M2C_UNK func_800EA604(M2C_UNK, M2C_UNK, M2C_UNK);               
s32 func_801DCF90(void *);                                      
s32 func_801DD2B0(void *);                                      
M2C_UNK memset_00023780(M2C_UNK, s32);                          
M2C_UNK os_inval_dcache(M2C_UNK, s32);                          
M2C_UNK os_inval_icache(M2C_UNK, s32);                          

s32 func_0010DDB4(void *arg0) {
    f32 sp28;
    f32 sp2C;
    f32 sp30;
    f32 sp38;
    f32 sp3C;
    M2C_UNK var_a0_2230;
    f32 temp_f10_92;
    f32 temp_f2_683;
    f32 temp_f2_765;
    f32 temp_f4_73;
    f32 temp_f4_771;
    f32 temp_f6_693;
    f32 var_f12_0;
    f32 var_f2_152;
    f32 var_f2_195;
    f32 var_f2_238;
    f32 var_f2_275;
    f32 var_f2_321;
    f32 var_f2_367;
    s32 **var_s1_641;
    s32 *temp_s0_643;
    s32 *temp_v1_1672;
    s32 temp_a1_2359;
    s32 temp_a2_661;
    s32 temp_v0_1157;
    s32 temp_v0_738;
    s32 temp_v0_997;
    s32 temp_v1_1299;
    s32 temp_v1_1563;
    s32 temp_v1_1641;
    s32 temp_v1_500;
    s32 temp_v1_644;
    s32 temp_v1_744;
    s32 temp_v1_921;
    s32 temp_v1_985;
    s32 var_a0_1167;
    s32 var_a0_1661;
    s32 var_a0_615;
    s32 var_s1_1349;
    s32 var_s2_638;
    s32 var_s5_11;
    s32 var_v0_418;
    s32 var_v0_862;
    s32 var_v1_2224;
    s32 var_v1_23;
    s32 var_v1_864;
    s8 var_v0_1810;
    s8 var_v0_1818;
    s8 var_v0_468;
    u16 var_v0_1362;
    u16 var_v0_1604;
    u16 var_v0_1730;
    u16 var_v0_1977;
    u16 var_v0_930;
    u32 temp_v1_420;
    u8 *var_s1_745;
    u8 temp_a0_2354;
    u8 temp_a1_571;
    u8 temp_v0_1667;
    u8 temp_v1_1164;
    u8 temp_v1_752;
    u8 var_a1_2356;
    u8 var_s1_1877;
    u8 var_v0_477;
    u8 var_v0_619;
    u8 var_v1_548;
    void *temp_a1_1660;
    void *temp_s0_1093;
    void *temp_s0_1161;
    void *temp_s0_1317;
    void *temp_s0_1435;
    void *temp_s0_1831;
    void *temp_s0_1932;
    void *temp_s0_1956;
    void *temp_s0_2164;
    void *temp_s0_2283;
    void *temp_s0_552;
    void *temp_s0_904;
    void *temp_s1_1287;
    void *temp_s2_734;
    void *temp_v0_411;
    void *var_a0_1646;
    void *var_a0_821;
    void *var_s0_665;
    void *var_s0_858;
    void *var_s0_871;
    void *var_v0_1665;

    var_s5_11 = 0;
    var_v1_23 = 0;
    if (*(f32 *)0x801F0ADC != 0.0f) {
        goto block_7;
    }
    if (*(f32 *)0x801F0AE0 != 0.0f) {
        goto block_7;
    }
    if (*(f32 *)0x801F0AE4 != 0.0f) {
        goto block_7;
    }
    if (*(f32 *)0x801F3664 != *(f32 *)0x801F0AE8) {
        goto block_7;
    }
    if (*(f32 *)0x801F3668 != *(f32 *)0x801F0AEC) {
        goto block_7;
    }
    if (*(f32 *)0x801F366C != *(f32 *)0x801F0AF0) {
        goto block_7;
    }
    var_s5_11 = 1;
    *(f32 *)0x801F3664 = *(f32 *)0x801F0AE8;
    *(f32 *)0x801F3668 = *(f32 *)0x801F0AEC;
    *(f32 *)0x801F366C = *(f32 *)0x801F0AF0;
block_7:
    if (var_s5_11 != 0) {
        goto block_56;
    }
    temp_f4_73 = *(f32 *)((s8 *)arg0 + 0x20);
    temp_f10_92 = *(f32 *)((s8 *)arg0 + 0x24) - *(f32 *)((s8 *)arg0 + 0x18);
    *(f32 *)((s8 *)arg0 + 0x20) = temp_f4_73 + *(f32 *)0x801F0ADC;
    *(f32 *)((s8 *)arg0 + 0x24) += *(f32 *)0x801F0AE0;
    var_f12_0 = *(f32 *)((s8 *)arg0 + 0x28) - *(f32 *)((s8 *)arg0 + 0x1C);
    *(f32 *)((s8 *)arg0 + 0x28) += *(f32 *)0x801F0AE4;
    if (*(f32 *)0x801F0D8C != 0.0f) {
        goto block_12;
    }
    if (*(f32 *)0x801F3604 != 0.0f) {
        goto block_12;
    }
    if (*(f32 *)0x801F0B80 != 0.0f) {
        goto block_12;
    }
    *(f32 *)0x801F3664 = *(f32 *)0x801F0AE8;
    *(f32 *)0x801F3668 = *(f32 *)0x801F0AEC;
    *(f32 *)0x801F366C = *(f32 *)0x801F0AF0;
    var_v1_23 = 3;
    goto block_33;
block_12:
    *(f32 *)0x801F3664 += *(f32 *)0x801F0D8C;
    if (*(f32 *)0x801F0D8C != 0.0f) {
        goto block_14;
    }
    var_v1_23 = 1;
    *(f32 *)0x801F0D8C = 0.0f;
    *(f32 *)0x801F3664 = *(f32 *)0x801F0AE8;
    goto block_19;
block_14:
    if (*(f32 *)0x801F0D8C > 0.0f) {
        if (*(f32 *)0x801F3664 < *(f32 *)0x801F0AE8) {
            goto block_19;
        }
    } else if (*(f32 *)0x801F3664 >= *(f32 *)0x801F0AE8) {
        goto block_19;
    }
    var_v1_23 = 1;
    *(f32 *)0x801F3664 = *(f32 *)0x801F0AE8;
    *(f32 *)0x801F0D8C = 0.0f;
block_19:
    *(f32 *)0x801F3668 += *(f32 *)0x801F3604;
    if (*(f32 *)0x801F3604 != 0.0f) {
        goto block_21;
    }
    var_v1_23 += 1;
    *(f32 *)0x801F3604 = 0.0f;
    *(f32 *)0x801F3668 = *(f32 *)0x801F0AEC;
    goto block_26;
block_21:
    if (*(f32 *)0x801F3604 > 0.0f) {
        if (*(f32 *)0x801F3668 < *(f32 *)0x801F0AEC) {
            goto block_26;
        }
    } else if (*(f32 *)0x801F3668 >= *(f32 *)0x801F0AEC) {
        goto block_26;
    }
    var_v1_23 += 1;
    *(f32 *)0x801F3668 = *(f32 *)0x801F0AEC;
    *(f32 *)0x801F3604 = 0.0f;
block_26:
    *(f32 *)0x801F366C += *(f32 *)0x801F0B80;
    if (*(f32 *)0x801F0B80 != 0.0f) {
        goto block_28;
    }
    var_v1_23 += 1;
    *(f32 *)0x801F0B80 = 0.0f;
    *(f32 *)0x801F366C = *(f32 *)0x801F0AF0;
    goto block_33;
block_28:
    if (*(f32 *)0x801F0B80 > 0.0f) {
        if (*(f32 *)0x801F366C < *(f32 *)0x801F0AF0) {
            goto block_33;
        }
    } else if (*(f32 *)0x801F366C >= *(f32 *)0x801F0AF0) {
        goto block_33;
    }
    var_v1_23 += 1;
    *(f32 *)0x801F366C = *(f32 *)0x801F0AF0;
    *(f32 *)0x801F0B80 = 0.0f;
block_33:
    if (*(f32 *)0x801F0ADC != 0.0f) {
        goto block_35;
    }
    var_v1_23 += 1;
    (*(f32 *)((s8 *)(arg0) + (0x20))) = (f32) *(f32 *)0x801F0AD0;
    goto block_40;
block_35:
    if (*(f32 *)0x801F0ADC > 0.0f) {
        if (*(f32 *)((s8 *)arg0 + 0x20) < *(f32 *)0x801F0AD0) {
            goto block_40;
        }
    } else {
        if (*(f32 *)0x801F0ADC >= 0.0f) {
            goto block_40;
        }
        if (*(f32 *)((s8 *)arg0 + 0x20) > *(f32 *)0x801F0AD0) {
            goto block_40;
        }
    }
    (*(f32 *)((s8 *)(arg0) + (0x20))) = *(f32 *)0x801F0AD0;
    var_v1_23 += 1;
block_40:
    if (*(f32 *)0x801F0AE0 != 0.0f) {
        goto block_42;
    }
    var_v1_23 += 1;
    (*(f32 *)((s8 *)(arg0) + (0x24))) = (f32) *(f32 *)0x801F0AD4;
    goto block_47;
block_42:
    if (*(f32 *)0x801F0AE0 > 0.0f) {
        if (*(f32 *)((s8 *)arg0 + 0x24) < *(f32 *)0x801F0AD4) {
            goto block_47;
        }
    } else {
        if (*(f32 *)0x801F0AE0 >= 0.0f) {
            goto block_47;
        }
        if (*(f32 *)((s8 *)arg0 + 0x24) > *(f32 *)0x801F0AD4) {
            goto block_47;
        }
    }
    (*(f32 *)((s8 *)(arg0) + (0x24))) = *(f32 *)0x801F0AD4;
    var_v1_23 += 1;
block_47:
    if (*(f32 *)0x801F0AE4 != 0.0f) {
        goto block_49;
    }
    var_v1_23 += 1;
    (*(f32 *)((s8 *)(arg0) + (0x28))) = (f32) *(f32 *)0x801F0AD8;
    goto block_54;
block_49:
    if (*(f32 *)0x801F0AE4 > 0.0f) {
        if (*(f32 *)((s8 *)arg0 + 0x28) < *(f32 *)0x801F0AD8) {
            goto block_54;
        }
    } else {
        if (*(f32 *)0x801F0AE4 >= 0.0f) {
            goto block_54;
        }
        if (*(f32 *)((s8 *)arg0 + 0x28) > *(f32 *)0x801F0AD8) {
            goto block_54;
        }
    }
    (*(f32 *)((s8 *)(arg0) + (0x28))) = *(f32 *)0x801F0AD8;
    var_v1_23 += 1;
block_54:
    (*(f32 *)((s8 *)(arg0) + (0x14))) = (f32) ((*(f32 *)((s8 *)(arg0) + (0x20))) - (temp_f4_73 - (*(f32 *)((s8 *)(arg0) + (0x14)))));
    (*(f32 *)((s8 *)(arg0) + (0x18))) = (f32) ((*(f32 *)((s8 *)(arg0) + (0x24))) - temp_f10_92);
    (*(f32 *)((s8 *)(arg0) + (0x1C))) = (f32) ((*(f32 *)((s8 *)(arg0) + (0x28))) - var_f12_0);
    if (var_v1_23 != 6) {
        goto block_56;
    }
    var_s5_11 = 1;
block_56:
    func_000f6b10(arg0, (f32 *)0x801F3664, &sp38, &sp3C);
    temp_v0_411 = *(void **)0x801AB850;
    (*(f32 *)((s8 *)(temp_v0_411) + (8))) = sp38;
    (*(f32 *)((s8 *)(temp_v0_411) + (0xC))) = sp3C;
    var_v0_418 = var_s5_11;
    if (var_s5_11 != 1) {
        goto block_228;
    }
    temp_v1_420 = *(u32 *)0x801F0CA4;
    *(s32 *)0x801F3610 = 0;
    *(s8 *)0x801F3600 = 0;
    if (temp_v1_420 >= 0x34U) {
        goto block_227;
    }
    switch (temp_v1_420) {
case 0x0:
case 0x2F:
    func_00109C04();
    *(s32 *)0x801F0DE0 = 4;
    *(s8 *)0x801F0FE1 = func_0012F530((*(void **)((s8 *)(((*(s32 *)0x801F3658 * 4) + 0x801F0000)) + (0xCB0))));
    *(s8 *)0x801F0FDF = 1;
    if (*(void **)0x801F0CA4 != 0) {
        goto block_61;
    }
    *(s8 *)0x801F0FE0 = 0;
    goto block_64;
block_61:
    var_v0_468 = 2;
    if (*(*(s32 **)((s8 *)((*(s32 *)0x801F3658 * 4)) + (0x801F0CB0))) & 0x40) {
        goto block_63;
    }
    var_v0_468 = 3;
block_63:
    *(void **)0x801F0FE0 = var_v0_468;
block_64:
    var_v0_477 = *(u8 *)0x801F365D | 1;
    goto block_212;
case 0x1:
    *(void **)0x801F0DE0 = 4;
    *(void **)0x801F0FE1 = func_0012F530((*(void **)((s8 *)(((*(s32 *)0x801F3658 * 4) + 0x801F0000)) + (0xCB0))));
    *(void **)0x801F0FDF = 0;
    *(void **)0x801F0FE0 = 0;
    goto block_117;
case 0x2:
    temp_v1_500 = *(s32 *)0x801F3A30;
    if (temp_v1_500 < 0x64) {
        goto block_70;
    }
    (*(s32 *)((s8 *)((void *)0x801F0BA8) + (0))) = (s32) (temp_v1_500 - 0x64);
    os_inval_icache(0x80214F80, 0x80219010 - 0x80214F80);
    os_inval_dcache(0x80219010, 0x8021AFB0 - 0x80219010);
    func_0002de50(0x171EA0, 0x80214F80, 0x177ED0 - 0x171EA0);
    if (0x8021AFB0 == 0x8021AFF0) {
        goto block_69;
    }
    memset_00023780(0x8021AFB0, 0x8021AFF0 - 0x8021AFB0);
block_69:
    func_0013109C((*(u16 *)((s8 *)((void *)0x801F0BA8) + (2))));
    *(s32 *)0x801F0DF0 = 0;
    *(void **)0x801F0DE0 = 0xA;
    var_v1_548 = *(u8 *)0x801F365D | 1;
    goto block_118;
block_70:
    temp_s0_552 = (*(void **)((s8 *)(((temp_v1_500 * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F3658 = temp_v1_500;
    *(void **)0x801F0DE0 = 4;
    *(void **)0x801F0FE1 = func_0012F530(temp_s0_552);
    *(void **)0x801F0FE0 = 0;
    *(void **)0x801F0FDF = 0;
    *(s32 *)0x801F0DEC = 0;
    *(void **)0x801F0DF0 = 0;
    temp_a1_571 = (*(u8 *)((s8 *)(temp_s0_552) + (4)));
    if (temp_a1_571 < 0x1EU) {
        goto block_74;
    }
    os_inval_icache(0x80214F80, 0x8021B470 - 0x80214F80);
    os_inval_dcache(0x8021B470, 0x8021B520 - 0x8021B470);
    func_0002de50(0x188B60, 0x80214F80, 0x18F100 - 0x188B60);
    if (0x8021B520 == 0x8021B5F0) {
        goto block_73;
    }
    memset_00023780(0x8021B520, 0x8021B5F0 - 0x8021B520);
block_73:
    func_00131050();
    *(void **)0x801F0DE0 = 0x14;
    goto block_211;
block_74:
    var_a0_615 = 0;
    if (((*(s32 *)((s8 *)(temp_s0_552) + (0))) & 0xC0) != 0x40) {
        goto block_76;
    }
    var_v0_619 = *(u8 *)0x801F365D & 0xFE;
    goto block_224;
block_76:
loop_77:
    if ((*(s8 *)((s8 *)((var_a0_615 + 0x801F0000)) + (0x1039))) == temp_a1_571) {
        goto block_79;
    }
    var_a0_615 += 1;
    if (var_a0_615 < 8) {
        goto loop_77;
    }
block_79:
    var_v0_418 = var_s5_11;
    if (var_a0_615 == 8) {
        goto block_228;
    }
    goto block_115;
case 0x15:
    var_s2_638 = 0;
    var_s1_641 = (s32 **)0x801F0CB0;
loop_82:
    temp_s0_643 = *var_s1_641;
    temp_v1_644 = *temp_s0_643;
    if (temp_v1_644 & 0x10) {
        goto block_84;
    }
    *temp_s0_643 = temp_v1_644 & ~1;
    func_00147BDC(temp_s0_643);
block_84:
    var_s2_638 += 1;
    var_s1_641 += 4;
    if (var_s2_638 < 0x32) {
        goto loop_82;
    }
    func_0015DF10(0x17C);
    temp_a2_661 = (*(s32 *)((s8 *)((void *)0x801F0E00) + (0)));
    var_s0_665 = (*(void **)((s8 *)(((temp_a2_661 * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F3658 = temp_a2_661;
    (*(s32 *)((s8 *)(var_s0_665) + (0))) = (s32) ((*(s32 *)((s8 *)(var_s0_665) + (0))) | 0x80000);
    func_0012EA80(-1, &sp28, temp_a2_661);
    (*(f32 *)((s8 *)(var_s0_665) + (8))) = sp28;
    (*(f32 *)((s8 *)(var_s0_665) + (0xC))) = sp2C;
    (*(f32 *)((s8 *)(var_s0_665) + (0x10))) = sp30;
    temp_f2_683 = *(f32 *)0x801F0D9C;
    temp_f6_693 = *(f32 *)0x801F0D98;
    (*(s8 *)((s8 *)(var_s0_665) + (0x20))) = 0;
    (*(f32 *)((s8 *)(var_s0_665) + (0x18))) = 0.75f;
    (*(f32 *)((s8 *)(var_s0_665) + (0x1C))) = 0.75f;
    (*(s32 *)((s8 *)(var_s0_665) + (0))) = (s32) (((*(s32 *)((s8 *)(var_s0_665) + (0))) & ~4 & ~0x200) | 0x21);
    (*(s32 *)((s8 *)(var_s0_665) + (0x14))) = (s32) (((s32) (((sp30 - temp_f2_683) * 64.0f) / (*(f32 *)0x801F0DA4 - temp_f2_683)) << 6) + (s32) (((sp28 - temp_f6_693) * 64.0f) / (*(f32 *)0x801F0DA0 - temp_f6_693)));
    func_00129948(var_s0_665);
    if (!((*(s32 *)((s8 *)(var_s0_665) + (0))) & 0x40)) {
        goto block_90;
    }
    temp_s2_734 = (void *)0x801F0E00 - 0x64;
    temp_v0_738 = func_0012E968(var_s0_665) * 0xB;
    temp_v1_744 = temp_v0_738 + 0x801969BA;
    var_s1_745 = temp_v1_744 + 1;
    (*(s8 *)((s8 *)((temp_v0_738 + 0x80190000)) + (0x69B9))) = (s8) ((*(u8 *)((s8 *)((temp_v0_738 + 0x80190000)) + (0x69B9))) | 4);
loop_87:
    temp_v1_752 = *var_s1_745;
    if (temp_v1_752 == 0xFF) {
        goto block_89;
    }
    var_s0_665 = (*(void **)((s8 *)((temp_v1_752 * 4)) + (0x801F0CB0)));
    (*(f32 *)((s8 *)(var_s0_665) + (8))) = sp28;
    (*(f32 *)((s8 *)(var_s0_665) + (0xC))) = sp2C;
    (*(f32 *)((s8 *)(var_s0_665) + (0x10))) = sp30;
    temp_f2_765 = (*(f32 *)((s8 *)((void *)0x801F0E00) + (-0x64)));
    temp_f4_771 = (*(f32 *)((s8 *)(temp_s2_734) + (-4)));
    (*(s8 *)((s8 *)(var_s0_665) + (0x20))) = 0;
    (*(f32 *)((s8 *)(var_s0_665) + (0x18))) = 0.75f;
    (*(f32 *)((s8 *)(var_s0_665) + (0x1C))) = 0.75f;
    (*(s32 *)((s8 *)(var_s0_665) + (0))) = (s32) (((*(s32 *)((s8 *)(var_s0_665) + (0))) & ~4 & ~0x200) | 0x21);
    (*(s32 *)((s8 *)(var_s0_665) + (0x14))) = (s32) (((s32) (((sp30 - temp_f2_765) * 64.0f) / ((*(f32 *)((s8 *)(temp_s2_734) + (8))) - temp_f2_765)) << 6) + (s32) (((sp28 - temp_f4_771) * 64.0f) / ((*(f32 *)((s8 *)(temp_s2_734) + (4))) - temp_f4_771)));
    func_00129948(var_s0_665);
block_89:
    var_s1_745 += 1;
    if ((s32) var_s1_745 < (temp_v1_744 + 5)) {
        goto loop_87;
    }
block_90:
    (*(s32 *)((s8 *)(var_s0_665) + (0))) = (s32) ((*(s32 *)((s8 *)(var_s0_665) + (0))) | 0x800000);
    (*(f32 *)((s8 *)(var_s0_665) + (0x4C))) = (f32) (*(f32 *)((s8 *)(var_s0_665) + (8)));
    (*(f32 *)((s8 *)(var_s0_665) + (0x50))) = (f32) (*(f32 *)((s8 *)(var_s0_665) + (0xC)));
    (*(f32 *)((s8 *)(var_s0_665) + (0x54))) = (f32) (*(f32 *)((s8 *)(var_s0_665) + (0x10)));
    (*(s32 *)((s8 *)(var_s0_665) + (0x64))) = (s32) (*(s32 *)((s8 *)(var_s0_665) + (0x14)));
    if ((*(s32 *)((s8 *)(var_s0_665) + (0))) & 0x40) {
        goto block_92;
    }
    var_a0_821 = var_s0_665;
    goto block_93;
block_92:
    var_a0_821 = (*(void **)((s8 *)((((*(u8 *)((s8 *)(((func_0012E968(var_s0_665) * 0xB) + 0x80190000)) + (0x69BA))) * 4) + 0x801F0000)) + (0xCB0)));
block_93:
    func_00109C3C(var_a0_821);
    *(void **)0x801F0DE0 = 4;
    *(void **)0x801F0FE1 = func_0012F530(var_s0_665);
    *(void **)0x801F0FE0 = 0;
    *(void **)0x801F0FDF = 0;
    return var_s5_11;
case 0xB:
    var_s0_858 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(u16 *)0x801F36D0 = 0x74;
    var_v0_862 = (*(s32 *)((s8 *)(var_s0_858) + (0x78)));
    var_v1_864 = -2;
    goto block_103;
case 0x2B:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(s32 *)0x801F0DFC = 0;
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & 0xFFDFFFFF);
    *(s32 *)0x8018F500 = func_0012E7E8(var_s0_871);
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F36D0 = 0x16EU;
    *(s8 *)0x801F3680 = 0xE;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
    goto block_199;
case 0x11:
    temp_s0_904 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(temp_s0_904) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_904) + (0x78))) & ~0x40);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(temp_s0_904);
    temp_v1_921 = *(s32 *)0x801F0E04 * 0x24;
    *(s32 *)0x8018F504 = temp_v1_921 + 0x801951B0;
    var_v0_930 = 0x10;
    if ((*(u16 *)((s8 *)((temp_v1_921 + 0x80190000)) + (0x51CC))) & 4) {
        goto block_98;
    }
    var_v0_930 = 0x29;
block_98:
    *(void **)0x801F36D0 = var_v0_930;
    if (func_0012FBB8((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))), *(void **)0x801F0E04) == 0) {
        goto block_100;
    }
    *(void **)0x801F36D0 = 0x29U;
block_100:
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(temp_s0_904)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)((((*(u8 *)((s8 *)(temp_s0_904) + (4))) * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    *(void **)0x801F0DE0 = 0x2D;
    temp_v1_985 = *(s32 *)0x801F0E04 * 0x24;
    (*(s16 *)((s8 *)((temp_v1_985 + 0x80190000)) + (0x51CC))) = (s16) ((*(u16 *)((s8 *)((temp_v1_985 + 0x80190000)) + (0x51CC))) & 0xFFFB);
    temp_v0_997 = *(s32 *)0x801F0E04 * 0x24;
    *(void **)0x801F3680 = -1;
    (*(s16 *)((s8 *)((temp_v0_997 + 0x80190000)) + (0x51CC))) = (s16) ((*(u16 *)((s8 *)((temp_v0_997 + 0x80190000)) + (0x51CC))) | 2);
    return var_s5_11;
case 0xC:
    var_s0_858 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F36D0 = 0x42U;
    var_v0_862 = (*(s32 *)((s8 *)(var_s0_858) + (0x78)));
    var_v1_864 = -3;
    goto block_103;
case 0x12:
    var_s0_858 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F36D0 = 0x5BU;
    var_v0_862 = (*(s32 *)((s8 *)(var_s0_858) + (0x78)));
    var_v1_864 = -0x81;
block_103:
    (*(s32 *)((s8 *)(var_s0_858) + (0x78))) = (s32) (var_v0_862 & var_v1_864);
    *(void **)0x8018F500 = func_0012E7E8(var_s0_858);
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(var_s0_858)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)((((*(u8 *)((s8 *)(var_s0_858) + (4))) * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F3680 = -1;
    *(void **)0x801F0DFC = 0;
    return var_s5_11;
case 0x13:
    *(void **)0x801F0DE0 = 9;
    temp_s0_1093 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F3680 = -1;
    *(void **)0x801F36D0 = 7U;
    *(s8 *)0x801F3674 = 2;
    (*(s32 *)((s8 *)(temp_s0_1093) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_1093) + (0x78))) & ~0x100);
    (*(s32 *)((s8 *)(temp_s0_1093) + (0))) = (s32) ((*(s32 *)((s8 *)(temp_s0_1093) + (0))) | 0x400000);
    *(void **)0x801F0DFC = 0;
    return var_s5_11;
case 0x16:
    os_inval_icache(0x80214F80, 0x80219010 - 0x80214F80);
    os_inval_dcache(0x80219010, 0x8021AFB0 - 0x80219010);
    func_0002de50(0x171EA0, 0x80214F80, 0x177ED0 - 0x171EA0);
    if (0x8021AFB0 == 0x8021AFF0) {
        goto block_107;
    }
    memset_00023780(0x8021AFB0, 0x8021AFF0 - 0x8021AFB0);
block_107:
    func_0013109C(*(u16 *)0x801F0E02);
    *(void **)0x801F0DE0 = 0xA;
    var_v0_477 = *(u8 *)0x801F365D | 1;
    goto block_212;
case 0x17:
    temp_v0_1157 = (*(s32 *)((s8 *)((void *)0x801F0E00) + (0)));
    temp_s0_1161 = (*(void **)((s8 *)(((temp_v0_1157 * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F3658 = temp_v0_1157;
    temp_v1_1164 = (*(u8 *)((s8 *)(temp_s0_1161) + (4)));
    var_a0_1167 = 0;
    if (temp_v1_1164 < 0x1EU) {
        goto loop_112;
    }
    os_inval_icache(0x80214F80, 0x8021B470 - 0x80214F80);
    os_inval_dcache(0x8021B470, 0x8021B520 - 0x8021B470);
    func_0002de50(0x188B60, 0x80214F80, 0x18F100 - 0x188B60);
    if (0x8021B520 == 0x8021B5F0) {
        goto block_111;
    }
    memset_00023780(0x8021B520, 0x8021B5F0 - 0x8021B520);
block_111:
    *(void **)0x801F0DE0 = 0x14;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
    return var_s5_11;
loop_112:
    if ((*(s8 *)((s8 *)((var_a0_1167 + 0x801F0000)) + (0x1039))) == temp_v1_1164) {
        goto block_114;
    }
    var_a0_1167 += 1;
    if (var_a0_1167 < 8) {
        goto loop_112;
    }
block_114:
    if (var_a0_1167 == 8) {
        goto block_116;
    }
block_115:
    *(void **)0x801F0DE0 = 9;
    *(void **)0x801F3680 = -1;
    *(void **)0x801F36D0 = 0x76U;
    *(void **)0x801F3674 = 1;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
    func_0015DF10(9);
    return var_s5_11;
block_116:
    *(void **)0x801F0DE0 = 4;
    *(void **)0x801F0FE1 = func_0012F530(temp_s0_1161);
    *(void **)0x801F0FE0 = 0;
    *(void **)0x801F0FDF = 0;
block_117:
    *(void **)0x801F0DEC = 0;
    *(void **)0x801F0DF0 = 0;
    var_v1_548 = *(u8 *)0x801F365D | 1;
block_118:
    *(void **)0x801F365D = var_v1_548;
    return var_s5_11;
case 0x18:
    func_0015DF10(2);
    func_0011BB4C();
    return var_s5_11;
case 0x19:
    *(void **)0x801F0DE0 = 1;
    var_v0_619 = *(u8 *)0x801F365D & 0xFE;
    goto block_224;
case 0xF:
    temp_s1_1287 = (*(void **)((s8 *)(((*(s32 *)0x801F0E04 * 4) + 0x801F0000)) + (0xCB0)));
    if (!((*(s32 *)((s8 *)(temp_s1_1287) + (0))) & 0x20000)) {
        goto block_123;
    }
    (*(s8 *)((s8 *)(temp_s1_1287) + (0xB8))) = 0x30;
    (*(s8 *)((s8 *)(temp_s1_1287) + (0xB9))) = 2;
block_123:
    temp_v1_1299 = (*(s32 *)((s8 *)(temp_s1_1287) + (0)));
    if (!(temp_v1_1299 & 0x1000)) {
        goto block_125;
    }
    (*(s32 *)((s8 *)(temp_s1_1287) + (0))) = (s32) (temp_v1_1299 & ~0x1000);
    (*(s32 *)((s8 *)(temp_s1_1287) + (0xAC))) = 0;
    (*(s32 *)((s8 *)(temp_s1_1287) + (0xB0))) = 0;
    (*(s8 *)((s8 *)(temp_s1_1287) + (0xB4))) = 0;
block_125:
    (*(s32 *)((s8 *)(temp_s1_1287) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s1_1287) + (0x78))) & ~0x10);
    temp_s0_1317 = (*(void **)((s8 *)(((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4)) + (0x801F0CB0)));
    *(void **)0x8018F500 = func_0012E7E8(temp_s0_1317);
    if (func_801DD2B0(temp_s0_1317) != 0) {
        goto block_128;
    }
    if (func_0012DA10(temp_s0_1317) == 0) {
        goto block_128;
    }
    if (func_0012DA9C(temp_s0_1317) == 0) {
        goto block_129;
    }
block_128:
    *(void **)0x801F36D0 = 5U;
    goto block_137;
block_129:
    func_00118500(temp_s0_1317, temp_s1_1287);
    (0);
    var_s1_1349 = 0;
    if ((0)) {
        goto block_132;
    }
    (0);
    if ((0)) {
        goto block_132;
    }
    var_s1_1349 = 2;
block_132:
    var_v0_1362 = 0x21D;
    if ((*(s32 *)((s8 *)(temp_s0_1317) + (0))) & 0x20000) {
        goto block_136;
    }
    var_v0_1362 = 0x236;
    if (var_s1_1349 != 0) {
        goto block_136;
    }
    var_v0_1362 = 0x204;
    if ((func_00022e60() % 100) < 0x15) {
        goto block_136;
    }
    var_v0_1362 = 0x1EB;
block_136:
    *(void **)0x801F36D0 = var_v0_1362;
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(temp_s0_1317)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)((((*(u8 *)((s8 *)(temp_s0_1317) + (4))) * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    *(s8 *)0x8018F53C = 1;
case 0x2E:
block_137:
    *(void **)0x801F0DE0 = 0x11;
    temp_s0_1435 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F3680 = -1;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
    if (*(void **)0x801F0CA4 != 0x2E) {
        goto block_143;
    }
    *(void **)0x8018F500 = func_0012E7E8(temp_s0_1435);
    *(void **)0x8018F504 = (s32) (*(s32 *)((s8 *)((((*(s32 *)0x801F0E04 - 0x100) * 0x48) + 0x80180000)) + (0x7C14)));
    if (*(u8 *)0x800E9C16 != 2) {
        goto block_142;
    }
    if (func_0012DA10(temp_s0_1435) == 0) {
        goto block_142;
    }
    if (func_0012DA9C(temp_s0_1435) != 0) {
        goto block_142;
    }
    *(void **)0x801F36D0 = 0x1B9U;
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(temp_s0_1435)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)((((*(u8 *)((s8 *)(temp_s0_1435) + (4))) * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    goto block_146;
block_142:
    *(void **)0x801F36D0 = 0x32U;
    goto block_146;
block_143:
    if (func_801DD2B0(temp_s0_1435) != 0) {
        goto block_146;
    }
    if (func_0012DA10(temp_s0_1435) == 0) {
        goto block_146;
    }
    func_0012DA9C(temp_s0_1435);
block_146:
    os_inval_icache(0x80214F80, 0x802178B0 - 0x80214F80);
    os_inval_dcache(0x802178B0, 0x8021E120 - 0x802178B0);
    func_0002de50(0x17F9C0, 0x80214F80, 0x188B60 - 0x17F9C0);
    if (0x8021E120 == 0x8021E130) {
        goto block_148;
    }
    memset_00023780(0x8021E120, 0x8021E130 - 0x8021E120);
block_148:
    if (!((*(s32 *)((s8 *)(temp_s0_1435) + (0))) & 0x20000)) {
        goto block_150;
    }
    (*(s8 *)((s8 *)(temp_s0_1435) + (0xB8))) = 0x30;
    (*(s8 *)((s8 *)(temp_s0_1435) + (0xB9))) = 2;
block_150:
    temp_v1_1563 = (*(s32 *)((s8 *)(temp_s0_1435) + (0)));
    if (!(temp_v1_1563 & 0x1000)) {
        goto block_152;
    }
    (*(s32 *)((s8 *)(temp_s0_1435) + (0))) = (s32) (temp_v1_1563 & ~0x1000);
    (*(s32 *)((s8 *)(temp_s0_1435) + (0xAC))) = 0;
    (*(s32 *)((s8 *)(temp_s0_1435) + (0xB0))) = 0;
    (*(s8 *)((s8 *)(temp_s0_1435) + (0xB4))) = 0;
block_152:
    (*(s32 *)((s8 *)(temp_s0_1435) + (0x7C))) = -1;
    (*(s32 *)((s8 *)(temp_s0_1435) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_1435) + (0x78))) & ~0x10);
    *(void **)0x801F0DFC = 0;
    return var_s5_11;
case 0x1A:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & ~0x400);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(var_s0_871);
    *(void **)0x801F0DE0 = 0x2D;
    var_v0_1604 = 0x8D;
    goto block_197;
case 0x1B:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & ~0x800);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(var_s0_871);
    *(void **)0x801F0DE0 = 0x2D;
    var_v0_1604 = 0xA6;
    goto block_197;
case 0x1E:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & ~0x2000);
    *(void **)0x801F0DFC = 0;
    func_00131050();
    temp_v1_1641 = (*(s32 *)((s8 *)(var_s0_871) + (0)));
    var_a0_1646 = var_s0_871;
    if (temp_v1_1641 & 0x40) {
        goto block_157;
    }
    (*(s32 *)((s8 *)(var_s0_871) + (0))) = (s32) (temp_v1_1641 | 0x20000);
    goto block_162;
block_157:
    temp_a1_1660 = (func_0012E968(var_s0_871) * 0xB) + 0x801969B8;
    var_a0_1661 = 0;
    var_v0_1665 = temp_a1_1660;
loop_158:
    temp_v0_1667 = (*(u8 *)((s8 *)(var_v0_1665) + (2)));
    var_a0_1661 += 1;
    if (temp_v0_1667 == 0xFF) {
        goto block_160;
    }
    temp_v1_1672 = (*(s32 **)((s8 *)((temp_v0_1667 * 4)) + (0x801F0CB0)));
    *temp_v1_1672 |= 0x20000;
block_160:
    var_v0_1665 = temp_a1_1660 + var_a0_1661;
    if (var_a0_1661 < 5) {
        goto loop_158;
    }
    var_a0_1646 = (*(void **)((s8 *)((((*(u8 *)((s8 *)(temp_a1_1660) + (2))) * 4) + 0x801F0000)) + (0xCB0)));
block_162:
    *(void **)0x8018F500 = func_0012E7E8(var_a0_1646);
    if (func_0012DA10(var_s0_871) == 0) {
        goto block_167;
    }
    if (func_0012DA9C(var_s0_871) != 0) {
        goto block_167;
    }
    if (!((*(s32 *)((s8 *)(var_s0_871) + (0))) & 0x40)) {
        goto block_166;
    }
    var_s0_871 = (*(void **)((s8 *)((((*(u8 *)((s8 *)(((func_0012E968(var_s0_871) * 0xB) + 0x80190000)) + (0x69BA))) * 4) + 0x801F0000)) + (0xCB0)));
block_166:
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F3680 = -1;
    *(void **)0x801F36D0 = 0xBFU;
    goto block_199;
block_167:
    *(void **)0x801F0DE0 = 9;
    var_v0_1730 = 0x11;
    goto block_192;
case 0x1F:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & ~0x4000);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8((*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0))));
    func_00131050();
    (*(s32 *)((s8 *)(var_s0_871) + (0))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0))) & 0xFFFDFFFF);
    if (func_0012DA10(var_s0_871) == 0) {
        goto block_171;
    }
    if (func_0012DA9C(var_s0_871) != 0) {
        goto block_171;
    }
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F3680 = -1;
    *(void **)0x801F36D0 = 0xD8U;
    goto block_199;
block_171:
    *(void **)0x801F0DE0 = 9;
    var_v0_1730 = 0x12;
    goto block_192;
case 0x21:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(var_s0_871);
    *(void **)0x801F3658 = (s32) (*(s32 *)((s8 *)((void *)0x801F0E00) + (0)));
    if (func_0012DA10(var_s0_871) != 0) {
        goto block_174;
    }
    goto block_176;
block_174:
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F36D0 = 0x10AU;
    var_v0_1810 = 5;
    goto block_198;
block_176:
    *(void **)0x801F0DE0 = 9;
    *(void **)0x801F36D0 = 0x1AU;
    var_v0_1818 = 5;
    goto block_193;
case 0x20:
    *(void **)0x801F0DE0 = 0x15;
    return var_s5_11;
case 0x22:
    temp_s0_1831 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(temp_s0_1831) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_1831) + (0x78))) & 0xFFFF7FFF);
    *(void **)0x801F0DFC = 0;
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F3680 = -1;
    if (!((*(s32 *)((s8 *)(temp_s0_1831) + (0))) & 0x80)) {
        goto block_180;
    }
    *(void **)0x801F36D0 = 0xF1U;
    *(void **)0x8018F500 = func_0012E7E8((*(void **)((s8 *)(((*(u8 *)((s8 *)(((func_0012E968(temp_s0_1831) * 0xB) + 0x80190000)) + (0x69BA))) * 4)) + (0x801F0CB0))));
    var_s1_1877 = (*(u8 *)((s8 *)(((func_0012E968(temp_s0_1831) * 0xB) + 0x80190000)) + (0x69BA)));
    goto block_181;
block_180:
    *(void **)0x801F36D0 = 0x155U;
    *(void **)0x8018F500 = func_0012E7E8(temp_s0_1831);
    var_s1_1877 = (*(u8 *)((s8 *)(temp_s0_1831) + (4)));
block_181:
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(temp_s0_1831)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)(((var_s1_1877 * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    func_0012F140(temp_s0_1831);
    return var_s5_11;
case 0x23:
    temp_s0_1932 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F3658 = -1;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D & 0xFE);
    (*(s32 *)((s8 *)(temp_s0_1932) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_1932) + (0x78))) & 0xFFFDFFFF);
    *(void **)0x801F0DFC = 0;
    *(void **)0x801F0DE0 = 0;
    var_s5_11 = 0x23;
    goto block_226;
case 0x25:
    temp_s0_1956 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(temp_s0_1956) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_1956) + (0x78))) & 0xFFFBFFFF);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(temp_s0_1956);
    *(void **)0x801F0DE0 = 0x2D;
    *(void **)0x801F3680 = -1;
    var_v0_1977 = 0x187;
    if (func_0012DA9C(temp_s0_1956) != 0) {
        goto block_185;
    }
    var_v0_1977 = 0x123;
block_185:
    *(void **)0x801F36D0 = var_v0_1977;
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(temp_s0_1956)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)((((*(u8 *)((s8 *)(temp_s0_1956) + (4))) * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    func_0012F8C0(temp_s0_1956);
    return var_s5_11;
case 0x26:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & 0xFFF7FFFF);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(var_s0_871);
    if (func_0012DA10(var_s0_871) == 0) {
        goto block_191;
    }
    if (func_0012DA9C(var_s0_871) == 0) {
        goto block_189;
    }
    goto block_191;
block_189:
    *(void **)0x801F0DE0 = 0x2D;
    var_v0_1604 = 0x13C;
    goto block_197;
block_191:
    *(void **)0x801F0DE0 = 9;
    var_v0_1730 = 0x21;
block_192:
    *(void **)0x801F36D0 = var_v0_1730;
    var_v0_1818 = -1;
block_193:
    *(void **)0x801F3680 = var_v0_1818;
    *(void **)0x801F3674 = 2;
    return var_s5_11;
case 0x32:
    var_s0_871 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    (*(s32 *)((s8 *)(var_s0_871) + (0x78))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0x78))) & 0xFDFFFFFF);
    *(void **)0x801F0DFC = 0;
    *(void **)0x8018F500 = func_0012E7E8(var_s0_871);
    if (func_0012DA10(var_s0_871) == 0) {
        goto block_200;
    }
    if (func_0012DA9C(var_s0_871) != 0) {
        goto block_200;
    }
    *(void **)0x801F0DE0 = 0x2D;
    var_v0_1604 = 0x24F;
block_197:
    *(void **)0x801F36D0 = var_v0_1604;
    var_v0_1810 = -1;
block_198:
    *(void **)0x801F3680 = var_v0_1810;
block_199:
    func_00131050();
    func_000ec838(0, (*(u16 *)0x801F36D0 + func_801DCF90(var_s0_871)) & 0xFFFF, 0xA0, 0x78, 0xA0, 0x32, (s32) (*(u8 *)((s8 *)((((*(u8 *)((s8 *)((((*(u8 *)((s8 *)(var_s0_871) + (4))) * 0x19) + 0x80190000)) + (0x71F2))) * 0x38) + 0x80190000)) + (0x3BD1))), 0, 0);
    return var_s5_11;
block_200:
    *(void **)0x801F0DE0 = 9;
    *(void **)0x801F36D0 = 0x79U;
    *(void **)0x801F3680 = -1;
    *(void **)0x801F3674 = 2;
    (*(s32 *)((s8 *)(var_s0_871) + (0))) = (s32) ((*(s32 *)((s8 *)(var_s0_871) + (0))) | 0x02000000);
    goto block_227;
case 0x27:
    func_0015DF10(0x17C);
    temp_s0_2164 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D & 0xFE);
    (*(s32 *)((s8 *)(temp_s0_2164) + (0x78))) = (s32) ((*(s32 *)((s8 *)(temp_s0_2164) + (0x78))) & 0xFFEFFFFF);
    *(void **)0x801F0DFC = 0;
    *(void **)0x801F0DE0 = 0;
    func_0010746C(temp_s0_2164, 0xFFEFFFFF);
    (*(s32 *)((s8 *)(temp_s0_2164) + (0))) = (s32) ((*(s32 *)((s8 *)(temp_s0_2164) + (0))) & ~0x20);
    goto block_227;
case 0x28:
    *(void **)0x801F0DE0 = 0x1A;
    return var_s5_11;
case 0x29:
    os_inval_icache(0x80214F80, 0x802167E0 - 0x80214F80);
    os_inval_dcache(0x802167E0, 0x80216F70 - 0x802167E0);
    func_0002de50(0x1A2C20, 0x80214F80, 0x1A4C10 - 0x1A2C20);
    if (0x80216F70 == 0x80216F90) {
        goto block_205;
    }
    memset_00023780(0x80216F70, 0x80216F90 - 0x80216F70);
block_205:
    var_v1_2224 = 0x1C;
    goto block_210;
case 0x2A:
    var_a0_2230 = 0xF;
    if (*(u8 *)0x8018F481 != 0xD) {
        goto block_208;
    }
    var_a0_2230 = 0xE;
block_208:
    func_0005c090(var_a0_2230, 1);
    *(s8 *)0x8018F56C = 1;
    *(s8 *)0x8018F56D = 1;
    *(s32 *)0x8018F568 = 0;
    *(void **)0x801F0DE0 = 0x1D;
    *(u8 *)0x8018F520 |= 6;
    func_800EA604(0x800EB240, 0x28A, 0x8018F520);
    return var_s5_11;
case 0x2C:
    var_v1_2224 = 0x1F;
block_210:
    *(void **)0x801F0DE0 = var_v1_2224;
    *(s32 *)0x801F0DE8 = -1;
block_211:
    var_v0_477 = *(u8 *)0x801F365D | 1;
block_212:
    *(void **)0x801F365D = var_v0_477;
    return var_s5_11;
case 0x2D:
    temp_s0_2283 = (*(void **)((s8 *)((((*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) * 4) + 0x801F0000)) + (0xCB0)));
    *(void **)0x801F0DE0 = 0x1E;
    *(void **)0x801F0DE8 = -1;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 1);
    *(void **)0x801F0DFC = 0;
    if (*(void **)0x800E9C16 != 2) {
        goto block_218;
    }
    if (func_0012DA10(temp_s0_2283) == 0) {
        goto block_218;
    }
    if (func_801DD2B0(temp_s0_2283) != 0) {
        goto block_218;
    }
    if (func_0012DA9C(temp_s0_2283) != 0) {
        goto block_218;
    }
    (*(s32 *)((s8 *)((void *)0x801F0E00) + (0))) = (s32) (*(u8 *)((s8 *)(temp_s0_2283) + (4)));
    *(void **)0x8018F500 = func_0012E7E8(temp_s0_2283);
    *(void **)0x801F36D0 = 0x1A0U;
    *(u8 *)0x801F365D = (u8) (*(u8 *)0x801F365D | 4);
    *(u16 *)0x801F36A2 = (*(u16 *)((s8 *)(((*(s32 *)0x801F0E04 * 2) + 0x801F0DE0)) + (0x204)));
    goto block_219;
block_218:
    func_00132B80((*(u16 *)((s8 *)(((*(s32 *)0x801F0E04 * 2) + 0x801F0000)) + (0xFE4))));
block_219:
    func_00130E60((*(u16 *)((s8 *)(((*(s32 *)0x801F0E04 * 2) + 0x801F0000)) + (0xFE4))), 0);
    temp_a0_2354 = (*(u8 *)((s8 *)((*(void **)0x801F0E04 + 0x801F0000)) + (0x1024)));
    var_a1_2356 = temp_a0_2354;
    if ((s32) temp_a0_2354 >= 0) {
        goto block_221;
    }
    var_a1_2356 = temp_a0_2354 + 7;
block_221:
    temp_a1_2359 = (s32) var_a1_2356 >> 3;
    (*(s8 *)((s8 *)((temp_a1_2359 + 0x80190000)) + (0x6A38))) = (s8) ((*(u8 *)((s8 *)((temp_a1_2359 + 0x80190000)) + (0x6A38))) | (1 << (temp_a0_2354 - (temp_a1_2359 * 8))));
    return var_s5_11;
case 0x30:
    *(void **)0x801F0DE0 = 0x2C;
    *(void **)0x801F3658 = -1;
    *(void **)0x801F0DE8 = 0;
    *(void **)0x801F0DFC = 0;
    var_v0_619 = *(u8 *)0x801F365D & 0xFE;
    goto block_224;
case 0x31:
    *(void **)0x801F0DE0 = 0;
    *(void **)0x801F0DE8 = 0;
    var_v0_619 = *(u8 *)0x801F365D & 0xFE;
block_224:
    *(void **)0x801F365D = var_v0_619;
    return var_s5_11;
case 0x33:
    *(void **)0x801F0DE0 = 0x31;
block_226:
    *(void **)0x801F0DE8 = 0;
case 0x3:
case 0x4:
case 0x5:
case 0x6:
case 0x7:
case 0x8:
case 0x9:
case 0xA:
case 0xD:
case 0xE:
case 0x10:
case 0x14:
case 0x1C:
case 0x1D:
case 0x24:
    }
block_227:
    var_v0_418 = var_s5_11;
block_228:
    return var_v0_418;
}
