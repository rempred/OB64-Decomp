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
M2C_UNK func_0002de50(M2C_UNK, M2C_UNK, s32);                   
M2C_UNK func_0005c090(M2C_UNK, M2C_UNK);                        
s32 func_0005c110(M2C_UNK);                                     
f32 func_000F315C(u8, f32, f32);                                
M2C_UNK func_001072B8(s32);                                     
M2C_UNK func_0010D484(f32, f32, f32, s32, s32);                 
M2C_UNK func_00121DA8(void *);                                  
M2C_UNK func_00127154(M2C_UNK, u8, M2C_UNK);                    
s32 func_00127BFC();                                            
u8 func_00127C50();                                             
M2C_UNK func_0012EA80(s32, f32 *);                              
s32 func_00130C2C();                                            
M2C_UNK func_00130E60(u16, M2C_UNK, u16);                       
s32 func_00139C10();                                            
s32 func_00139C88();                                            
s32 func_00139CE8();                                            
s32 func_00139D74();                                            
M2C_UNK func_00139DC0(u32, f32 *, u16 *, s8 *);                 
M2C_UNK func_800EA6B0(void *, M2C_UNK, M2C_UNK, M2C_UNK);             
M2C_UNK func_800EA6C8(void *);                                  
M2C_UNK func_802173B0(M2C_UNK);                                 
M2C_UNK memset_00023780(M2C_UNK, s32);                          
M2C_UNK os_inval_dcache(M2C_UNK, s32);                          
M2C_UNK os_inval_icache(M2C_UNK, s32);                          
extern u8 overlay_a_text_start[];
extern u8 overlay_a_data_start[];
extern u8 overlay_a_bss_start[];
extern u8 overlay_a_bss_end[];
extern u8 overlay_b_text_start[];
extern u8 overlay_b_data_start[];
extern u8 overlay_b_bss_start[];
extern u8 overlay_b_bss_end[];
extern u8 overlay_c_text_start[];
extern u8 overlay_c_data_start[];
extern u8 overlay_c_bss_start[];
extern u8 overlay_c_bss_end[];
extern void *scenario_state_slot;

s32 func_001390F0(void) {
    f32 sp18[3];
    f32 sp28[3];
    f32 temp_f6_198;
    f32 temp_f8_197;
    f32 var_f0_149;
    f32 var_f20_negative;
    f32 var_f22_positive;
    f32 var_f2_146;
    f32 var_f4_140;
    s32 temp_a1_609;
    s32 temp_v0_541;
    s32 temp_v0_621;
    s32 temp_v1_268;
    s32 temp_v1_548;
    s32 temp_v1_623;
    s32 temp_v1_650;
    s32 var_a0_477;
    s32 var_s0_405;
    s32 var_s1_87;
    s32 var_v0_333;
    s32 var_v0_336;
    s32 var_v0_635;
    s32 var_v0_81;
    s32 var_v1_630;
    s8 *var_a3_248;
    s8 temp_v0_250;
    u16 *temp_s0_246;
    u16 *var_a2_247;
    u16 temp_a0_266;
    u16 temp_a2_617;
    u16 temp_v1_588;
    u32 temp_v0_695;
    u32 var_s1_236;
    u8 *var_t0_245;
    u8 temp_a0_611;
    u8 temp_a0_718;
    u8 temp_a1_716;
    s8 temp_s0_93;
    u8 temp_v0_302;
    u8 temp_v0_83;
    u8 temp_v1_28;
    u8 temp_v1_402;
    u8 temp_v1_508;
    u8 var_v0_728;
    void *temp_a0_43;
    void **state_slot;
    s32 *var_s2_early_base;

    if (*(s32 *)0x801F3610 == 0) {
        goto block_2;
    }
    if (*(s32 *)0x801F0DE0 != 0) {
        goto block_64;
    }
block_2:
    if (*(u8 *)0x801F365D & 2) {
        goto block_64;
    }
    temp_v1_28 = *(u8 *)0x8018F481;
    if (temp_v1_28 != 2) {
        goto block_18;
    }
    if (func_0005c110(0) == 0) {
        goto block_30;
    }
    if (((*(s32 *)scenario_state_slot) & 0x11) != 0x10) {
        goto block_30;
    }
    state_slot = &scenario_state_slot;
    temp_a0_43 = *state_slot;
    (*(s8 *)((s8 *)(temp_a0_43) + (0xBA))) = 1;
    func_00121DA8(temp_a0_43);
    os_inval_icache(0x80214F80, 0x80219010 - 0x80214F80);
    os_inval_dcache(0x80219010, 0x8021AFB0 - 0x80219010);
    func_0002de50(0x171EA0, 0x80214F80, 0x177ED0 - 0x171EA0);
    if (overlay_a_bss_start == overlay_a_bss_end) {
        goto block_8;
    }
    memset_00023780(overlay_a_bss_start, overlay_a_bss_end - overlay_a_bss_start);
block_8:
    func_802173B0(0);
    var_v0_81 = 1;
    if (!(*(u16 *)0x801952C8 & 2)) {
        goto block_130;
    }
    temp_v0_83 = *(u8 *)0x801952C1;
    if (temp_v0_83 != 0) {
        goto block_11;
    }
    return 1;
block_11:
    var_s1_87 = 0;
    var_s2_early_base = (s32 *)((s8 *)state_slot - 0x78);
    if (temp_v0_83 == 0) {
        goto block_128;
    }
loop_14:
    temp_s0_93 = *((s8 *)*(s32 *)0x801952C4 + var_s1_87);
    if ((s32) temp_s0_93 < 0) {
        goto block_16;
    }
    func_001072B8(var_s2_early_base[temp_s0_93]);
    func_00127154(0x1E, temp_s0_93, 0);
block_16:
    var_s1_87 += 1;
    if (var_s1_87 < (s32) *(u8 *)0x801952C1) {
        goto loop_14;
    }
    return 1;
block_18:
    if (temp_v1_28 != 0xD) {
        goto block_23;
    }
    if (func_0005c110(0x11) != 0) {
        goto block_23;
    }
    if (func_0005c110(0xE) != 0) {
        goto block_30;
    }
    if (!(*(u16 *)0x801F0EBA & 8)) {
        goto block_30;
    }
    var_f4_140 = ((*(f32 *)0x801F0DA0 - *(f32 *)0x801F0D98) * 217.0f) / 256.0f;
    var_f2_146 = 153.0f;
    var_f0_149 = *(f32 *)0x801F0DA4 - *(f32 *)0x801F0D9C;
    goto block_29;
block_23:
    if (*(u8 *)0x8018F481 != 0x11) {
        goto block_30;
    }
    if (func_0005c110(0x11) != 0) {
        goto block_30;
    }
    if (func_0005c110(0xF) != 0) {
        goto block_30;
    }
    if (!(*(u16 *)0x801951CC & 2)) {
        goto block_30;
    }
    if (*(s32 *)0x801F0DFC != 0) {
        goto block_30;
    }
    var_f4_140 = ((*(f32 *)0x801F0DA0 - *(f32 *)0x801F0D98) * 145.0f) / 256.0f;
    var_f0_149 = *(f32 *)0x801F0DA4 - *(f32 *)0x801F0D9C;
    var_f2_146 = 32.0f;
block_29:
    temp_f8_197 = *(f32 *)0x801F0D98 + var_f4_140;
    temp_f6_198 = *(f32 *)0x801F0D9C + ((var_f0_149 * var_f2_146) / 256.0f);
    sp18[0] = temp_f8_197;
    sp18[2] = temp_f6_198;
    sp18[1] = func_000F315C(*(u8 *)0x800E7AB9, temp_f8_197, temp_f6_198);
    func_0010D484(sp18[0], sp18[1], sp18[2], *(s32 *)0x8018F58C, 0x2A);
    *(u8 *)0x801F365D = (u8)(*(u8 *)0x801F365D | 1);
    return 1;
block_30:
    if (*(void **)0x801F3610 != 0) {
        goto block_64;
    }
    if (*(void **)0x801F0DE0 != 0) {
        goto block_64;
    }
    if (*(void **)0x801F0DFC != 0) {
        goto block_64;
    }
    var_f20_negative = -0.8f;
    var_f22_positive = 0.8f;
    var_s1_236 = 0;
    var_t0_245 = (u8 *)0x801F0DE0 + 0x272;
    temp_s0_246 = (u16 *)((s8 *)0x801F0DE0 + 0x262);
    var_a2_247 = temp_s0_246;
    var_a3_248 = (s8 *)0x801F0DE0 + 0x259;
loop_34:
    temp_v0_250 = *var_a3_248;
    if (temp_v0_250 == -1) {
        goto block_63;
    }
    if (*var_t0_245 == *(u8 *)(*(s32 *)0x801F361C +
                               *(s32 *)((s8 *)*(void **)(0x801F0CB0 + (temp_v0_250 * 4)) + 0x14))) {
        goto block_37;
    }
    *var_a3_248 = -1;
    goto block_62;
block_37:
    temp_a0_266 = *var_a2_247;
    temp_v1_268 = (*(u8 *)0x800E9C13 + 1) * 2;
    if ((s32) temp_a0_266 >= temp_v1_268) {
        goto block_40;
    }
    *var_a2_247 = 0;
    goto block_42;
block_40:
    *var_a2_247 = temp_a0_266 - temp_v1_268;
block_42:
    if (*var_a2_247 != 0) {
        goto block_63;
    }
    *(f32 *)0x801F369C = 0.0f;
    *(M2C_UNK32 *)0x801F0D80 = 0;
    *var_a3_248 = -1;
    *var_a2_247 = 0xFFFF;
    *var_t0_245 = 0;
    func_00139DC0(var_s1_236, sp28, var_a2_247, var_a3_248);
    func_0010D484(sp28[0], sp28[1], sp28[2], *(s32 *)0x8018F58C, 0x2C);
    (*(u32 *)((s8 *)(temp_s0_246) + (-0x23E))) = var_s1_236;
    (*(s8 *)((s8 *)(*(void **)0x801AB850) + (4))) = 0;
    temp_v0_302 = *(u8 *)0x8018F481;
    if ((u32) (temp_v0_302 - 0x27) >= 0x17U) {
        goto block_128;
    }
    switch (temp_v0_302) {
case 0x27:                                                        
    *(s32 *)0x801F0E00 = var_s1_236 + 1;
    goto block_61;
case 0x2F:                                                        
case 0x30:                                                        
case 0x3C:                                                        
case 0x3D:                                                        
    if (var_s1_236 >= 7U) {
        goto block_128;
    }
    switch (var_s1_236) {
case 0:                                                           
    *(void **)0x801F0E00 = 4;
    goto block_61;
case 1:                                                           
    var_v0_333 = 5;
    goto block_53;
case 2:                                                           
    var_v0_336 = 7;
    goto block_55;
case 3:                                                           
    *(void **)0x801F0E00 = 6;
    goto block_61;
case 4:                                                           
    var_v0_333 = 8;
block_53:
    *(void **)0x801F0E00 = var_v0_333;
    *(f32 *)0x801F0D80 = var_f20_negative;
    return 1;
case 5:                                                           
    var_v0_336 = 0xA;
block_55:
    *(void **)0x801F0E00 = var_v0_336;
    *(f32 *)0x801F0D80 = var_f22_positive;
    return 1;
case 6:                                                           
    *(void **)0x801F0E00 = 9;
    goto block_61;
    }
case 0x33:                                                        
    *(void **)0x801F0E00 = (s32) (var_s1_236 + 0xB);
    if (var_s1_236 != 0) {
        goto block_59;
    }
    *(f32 *)0x801F0D80 = -0.5f;
    return 1;
block_59:
    if (var_s1_236 != 1) {
        goto block_61;
    }
    *(f32 *)0x801F0D80 = 0.5f;
    return 1;
block_61:
    *(f32 *)0x801F0D80 = 0.0f;
    return 1;
block_62:
    *var_a2_247 = 0xFFFF;
    *var_t0_245 = 0;
block_63:
    var_t0_245 += 1;
    var_a2_247 += 2;
    var_s1_236 += 1;
    var_a3_248 += 1;
    if ((s32) var_s1_236 < 8) {
        goto loop_34;
    }
block_64:
    temp_v1_402 = *(u8 *)0x801F1037;
    var_s0_405 = 0;
    if (temp_v1_402 == 1) {
        goto block_67;
    }
    if (temp_v1_402 != 2) {
        goto block_75;
    }
    var_s0_405 = (0 - (func_00139D74() == 0)) & 3;
block_67:
    if (func_00139C88() != 0) {
        goto block_69;
    }
    var_s0_405 = 2;
    goto block_71;
block_69:
block_71:
    if (func_00139CE8() != 0) {
        goto block_73;
    }
    var_s0_405 = 1;
    goto block_75;
block_73:
block_75:
    if (var_s0_405 == 0) {
        goto block_88;
    }
    if (var_s0_405 != 1) {
        goto block_80;
    }
    os_inval_icache(0x80214F80, 0x802167E0 - 0x80214F80);
    os_inval_dcache(0x802167E0, 0x80216F70 - 0x802167E0);
    func_0002de50(0x1A2C20, 0x80214F80, 0x1A4C10 - 0x1A2C20);
    if (overlay_b_bss_start == overlay_b_bss_end) {
        goto block_79;
    }
    memset_00023780(overlay_b_bss_start, overlay_b_bss_end - overlay_b_bss_start);
block_79:
    *(void **)0x801F0DE0 = 0x1C;
    *(s32 *)0x801F0DE8 = -1;
    *(u8 *)0x801F365D = (u8)(*(u8 *)0x801F365D | 1);
    goto block_87;
block_80:
    if (var_s0_405 == 2) {
        goto block_82;
    }
    goto block_84;
block_82:
    var_a0_477 = -1;
    goto block_86;
block_84:
    if (var_s0_405 != 3) {
        goto block_87;
    }
    var_a0_477 = func_00130C2C(0x21);
block_86:
    func_0012EA80(var_a0_477, sp18);
    func_0010D484(sp18[0], sp18[1], sp18[2], *(s32 *)0x8018F58C, 0x29);
block_87:
    func_0005c090(0x21, 1);
    *(u8 *)0x801F365D = (u8)(*(u8 *)0x801F365D & 0xFD);
    return 1;
block_88:
    temp_v1_508 = *(u8 *)0x801F1036;
    if (temp_v1_508 == 1) {
        goto block_91;
    }
    if (temp_v1_508 == 2) {
        goto block_92;
    }
    goto block_96;
block_91:
    var_s0_405 = func_00139C10();
    goto block_96;
block_92:
    if (*(u8 *)0x801F0FDE != 0) {
        goto block_94;
    }
    var_s0_405 = 1;
    goto block_96;
block_94:
block_96:
    var_v0_81 = 0;
    if (func_0005c110(0x11) != 0) {
        goto block_130;
    }
    if (!((*(u8 *)0x8018F481 != 0x3F) & (var_s0_405 != 0))) {
        goto block_129;
    }
    func_0005c090(0x21, 1);
    temp_v0_541 = func_00130C2C();
    if (temp_v0_541 == -1) {
        goto block_100;
    }
    temp_v1_548 = temp_v0_541 * 0x24;
    (*(s16 *)((s8 *)((temp_v1_548 + 0x80190000)) + (0x51CC))) = (s16) (((*(u16 *)((s8 *)((temp_v1_548 + 0x80190000)) + (0x51CC))) & 0xFFFB) | 2);
block_100:
    os_inval_icache(0x80214F80, 0x8021C230 - 0x80214F80);
    os_inval_dcache(0x8021C230, 0x8021C960 - 0x8021C230);
    func_0002de50(0x1B2670, 0x80214F80, 0x1BA050 - 0x1B2670);
    if (overlay_c_bss_start == overlay_c_bss_end) {
        goto block_102;
    }
    memset_00023780(overlay_c_bss_start, overlay_c_bss_end - overlay_c_bss_start);
block_102:
    temp_v1_588 = *(u16 *)0x801936B8;
    *(s8 *)0x8021C74C = 1;
    if (temp_v1_588 == 0) {
        goto block_104;
    }
    *(u16 *)0x8021C740 = temp_v1_588;
    goto block_105;
block_104:
    *(u16 *)0x8021C740 = *(u16 *)0x801936BA;
block_105:
    *(u8 *)0x8021C748 = func_00127C50();
    temp_a1_609 = func_00127BFC();
    temp_a0_611 = *(u8 *)0x801936A9;
    temp_a2_617 = *(u16 *)(0x801E7E1A + (*(u8 *)0x8018F481 * 0xC));
    if ((s32) temp_a0_611 >= 0x32) {
        goto block_109;
    }
    temp_v0_621 = 0x32 - temp_a0_611;
    temp_v1_623 = temp_a0_611 - 0x32;
    if (temp_v0_621 <= 0) {
        goto block_108;
    }
    var_v1_630 = (s32) (temp_v0_621 * temp_a1_609) >> 0x1F;
    var_v0_635 = (temp_v0_621 * temp_a1_609) / 25;
    goto block_111;
block_108:
    var_v1_630 = (s32) (temp_v1_623 * temp_a1_609) >> 0x1F;
    var_v0_635 = (temp_v1_623 * temp_a1_609) / 25;
    goto block_111;
block_109:
    temp_v1_650 = temp_a0_611 - 0x32;
    if (temp_v1_650 <= 0) {
        goto block_112;
    }
    var_v1_630 = (s32) (temp_v1_650 * temp_a1_609) >> 0x1F;
    var_v0_635 = (temp_v1_650 * temp_a1_609) / 50;
block_111:
    *(s32 *)0x8021C744 = (var_v0_635 - var_v1_630) + temp_a2_617;
    goto block_113;
block_112:
    *(s32 *)0x8021C744 = (((0x32 - temp_a0_611) * temp_a1_609) / 50) + temp_a2_617;
block_113:
    if (*(u8 *)0x8018F481 == 0x36) {
        goto block_119;
    }
    temp_v0_695 = *(u32 *)0x80196A6C + *(s32 *)0x8021C744;
    *(u32 *)0x80196A6C = temp_v0_695;
    if (temp_v0_695 <= 0x98967FU) {
        goto block_116;
    }
    *(u32 *)0x80196A6C = 0x98967F;
    goto block_118;
block_116:
block_118:
    func_00130E60(*(u16 *)0x8021C740, 0, temp_a2_617);
block_119:
    *(u16 *)0x801936B8 = 0;
    if (*(u8 *)0x8018F481 == 0x36) {
        goto block_124;
    }
    temp_a1_716 = *(u8 *)0x80190F80;
    temp_a0_718 = *(u8 *)0x8021C748;
    if ((0xC8 - temp_a1_716) >= (s32) temp_a0_718) {
        goto block_122;
    }
    *(u8 *)0x80190F80 = 0xC8;
    var_v0_728 = *(u8 *)0x80190F81 + (0xC8 - temp_a1_716);
    goto block_123;
block_122:
    *(u8 *)0x80190F80 = temp_a1_716 + temp_a0_718;
    var_v0_728 = *(u8 *)0x80190F81 + temp_a0_718;
block_123:
    *(u8 *)0x80190F81 = var_v0_728;
block_124:
    *(void **)0x801F0DE0 = 0x1B;
    *(void **)0x801F0DE8 = -1;
    *(u8 *)0x801F365D = (u8)(*(u8 *)0x801F365D | 1);
    if (*(s32 *)0x800EB0DC == 0xB) {
        goto block_126;
    }
    func_800EA6B0((s32 *)0x800EB0DC - 0x2C, 0xA, 0xA, 0xC8);
block_126:
    var_v0_81 = 1;
    if (*(void **)0x8018F481 != 0x36) {
        goto block_130;
    }
    func_800EA6C8((s32 *)0x800EB0DC - 0x2C);
case 0x28:                                                        
case 0x29:                                                        
case 0x2A:                                                        
case 0x2B:                                                        
case 0x2C:                                                        
case 0x2D:                                                        
case 0x2E:                                                        
case 0x31:                                                        
case 0x32:                                                        
case 0x34:                                                        
case 0x35:                                                        
case 0x36:                                                        
case 0x37:                                                        
case 0x38:                                                        
case 0x39:                                                        
case 0x3A:                                                        
case 0x3B:                                                        
    }
block_128:
    return 1;
block_129:
    var_v0_81 = 0;
block_130:
    return var_v0_81;
}
