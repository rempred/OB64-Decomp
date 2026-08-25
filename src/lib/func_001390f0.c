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
M2C_UNK func_0002de50(void *, void *, s32);
M2C_UNK func_0005c090(M2C_UNK, M2C_UNK);
s32 func_0005c110(M2C_UNK);
f32 func_000F315C(u8, f32, f32);
M2C_UNK func_001072B8(s32);
M2C_UNK func_0010D484(f32, f32, f32, s32, s32);
M2C_UNK func_00121DA8(void *);
M2C_UNK func_00127154(M2C_UNK, M2C_UNK, M2C_UNK);
s32 func_00127BFC();
u8 func_00127C50();
M2C_UNK func_0012EA80(s32, f32 *);
s32 func_00130C2C();
M2C_UNK func_00130E60(u16, M2C_UNK);
s32 func_00139C10();
s32 func_00139C88();
s32 func_00139CE8();
s32 func_00139D74();
M2C_UNK func_00139DC0(u32, f32 *, u16 *, s8 *);
M2C_UNK func_800EA6B0(void *, M2C_UNK, M2C_UNK, M2C_UNK);
M2C_UNK func_800EA6C8(void *);
M2C_UNK func_802173B0(M2C_UNK);
M2C_UNK memset_00023780(void *, s32);
M2C_UNK os_inval_dcache(void *, s32);
M2C_UNK os_inval_icache(void *, s32);
extern u8 overlay_a_rom_start[];
extern u8 overlay_a_rom_end[];
extern u8 overlay_a_text_start[];
extern u8 overlay_a_data_start[];
extern u8 overlay_a_bss_start[];
extern u8 overlay_a_bss_end[];
extern u8 overlay_a_icache_text_start[];
extern u8 overlay_a_icache_data_start[];
extern u8 overlay_a_dcache_data_start[];
extern u8 overlay_a_dcache_bss_start[];
extern u8 overlay_a_dma_rom_start[];
extern u8 overlay_a_dma_rom_end[];
extern u8 overlay_a_dma_text_start[];
extern u8 overlay_b_rom_start[];
extern u8 overlay_b_rom_end[];
extern u8 overlay_b_text_start[];
extern u8 overlay_b_data_start[];
extern u8 overlay_b_bss_start[];
extern u8 overlay_b_bss_end[];
extern u8 overlay_b_icache_text_start[];
extern u8 overlay_b_icache_data_start[];
extern u8 overlay_b_dcache_data_start[];
extern u8 overlay_b_dcache_bss_start[];
extern u8 overlay_b_dma_rom_start[];
extern u8 overlay_b_dma_rom_end[];
extern u8 overlay_b_dma_text_start[];
extern u8 overlay_c_rom_start[];
extern u8 overlay_c_rom_end[];
extern u8 overlay_c_text_start[];
extern u8 overlay_c_data_start[];
extern u8 overlay_c_bss_start[];
extern u8 overlay_c_bss_end[];
extern u8 overlay_c_icache_text_start[];
extern u8 overlay_c_icache_data_start[];
extern u8 overlay_c_dcache_data_start[];
extern u8 overlay_c_dcache_bss_start[];
extern u8 overlay_c_dma_rom_start[];
extern u8 overlay_c_dma_rom_end[];
extern u8 overlay_c_dma_text_start[];
extern void *scenario_state_slot;
extern u8 D_800EB0DC[];
extern u8 D_8018F481;
extern volatile s32 D_8018F58C;
extern u8 D_80190F80[];
extern u32 D_80196A6C;
extern f32 D_801F0D80;
extern u8 D_801F0DE0[];
extern s32 D_801F0DE8;
extern u8 D_801F365D;
extern f32 D_801F369C;

asm(
    "# Hybrid scope for func_001390F0: four fragments emit seven of 712 retail instructions.\n"
    "# They reproduce two delay-slot control-flow choices and one byte-load allocation KMC cannot emit from tested C.\n"
    "# All calls, loops, arithmetic, state changes, float stores, and return paths remain C.\n"
    "# Fixed-register locals and empty constraints are HYBRID_C but emit no instructions.\n"
    "# FP bindings preserve the retail scene-coordinate registers; integer bindings preserve long-lived retail registers.\n"
);
s32 func_001390F0(void) {
    struct {
        f32 sp18[3];
        u8 gap[4];
        f32 sp28[3];
        u8 trailing[12];
    } stack;
    register f32 denominator asm("$f10");
    register f32 var_f0_149 asm("$f0");
    register f32 var_f20_negative asm("$f22");
    register f32 var_f22_positive asm("$f20");
    register f32 var_f2_146 asm("$f2");
    register f32 var_f4_140 asm("$f4");
    register f32 x_base asm("$f8");
    register f32 y_base asm("$f6");
    f32 zero_float;
    register s32 temp_a1_609 asm("$5");
    s32 temp_v0_541;
    s32 temp_v1_268;
    s32 temp_v1_548;
    register s32 var_a0_477 asm("$4");
    register u32 s0_value asm("$16");
    s32 var_v0_333;
    s32 var_v0_336;
    s32 eligibility;
    register s32 signed_invalid asm("$9");
    register s8 *var_a3_248 asm("$7");
    register s32 temp_v0_250 asm("$2");
    register u16 *var_a2_247 asm("$6");
    register s32 temp_a0_266 asm("$4");
    u16 temp_v1_588;
    u32 temp_v0_695;
    u32 var_s1_236;
    u32 *money;
    register u8 *reward_pair asm("$6");
    register u8 *var_t0_245 asm("$8");
    register s32 temp_a0_611 asm("$4");
    register u8 temp_a0_718 asm("$4");
    u8 temp_a1_716;
    u8 temp_v0_302;
    u32 event_dispatch_index;
    s32 temp_v0_83;
    u8 temp_v1_28;
    u8 temp_v1_402;
    u8 temp_v1_508;
    u8 state_flags;
    register u8 var_v0_728 asm("$2");
    void *temp_a0_43;
    void *event_owner;
    s32 *var_s2_early_base;
    register u8 *state_base asm("$3");
    register u16 invalid_timer asm("$10");

    if (*(s32 *)0x801F3610 == 0) {
        goto block_2;
    }
    if (*(s32 *)0x801F0DE0 != 0) {
        goto block_64;
    }
block_2:
    __asm__ volatile (
        "# No instruction: keeping the complete local object live preserves the 96-byte frame.\n"
        : : "m"(stack));
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
    s0_value = (u32)&scenario_state_slot;
    temp_a0_43 = *(void **)s0_value;
    (*(s8 *)((s8 *)(temp_a0_43) + (0xBA))) = 1;
    func_00121DA8(temp_a0_43);
    os_inval_icache(overlay_a_icache_text_start, overlay_a_icache_data_start - overlay_a_icache_text_start);
    os_inval_dcache(overlay_a_dcache_data_start, overlay_a_dcache_bss_start - overlay_a_dcache_data_start);
    func_0002de50(overlay_a_dma_rom_start, overlay_a_dma_text_start, overlay_a_dma_rom_end - overlay_a_dma_rom_start);
    if (overlay_a_bss_start == overlay_a_bss_end) {
        goto block_8;
    }
    memset_00023780(overlay_a_bss_start, overlay_a_bss_end - overlay_a_bss_start);
block_8:
    func_802173B0(0);
    if (!(*(u16 *)0x801952C8 & 2)) {
        return 1;
    }
    temp_v0_83 = *(u8 *)0x801952C1;
    __asm__ volatile (
        "# Emits beql count,$zero,epilogue and addiu $v0,$zero,1.\n"
        "# A zero count returns 1 through the likely delay slot; the following C test is the loop precheck.\n"
        ".set noreorder\n"
        "beql %0,$zero,.Lfunc_001390F0_epilogue\n"
        "addiu $2,$zero,1\n"
        ".set reorder"
        :
        : "r"(temp_v0_83));
    var_s1_236 = 0;
    if (temp_v0_83 == 0) {
        goto block_128;
    }
    var_s2_early_base = (s32 *)((s8 *)s0_value - 0x78);
    do {
        {
            u8 *member = (u8 *)*(s32 *)0x801952C4 + var_s1_236;

            __asm__ volatile (
                "# Emits one lbu directly into $s0; the signed validity test remains C.\n"
                "lbu %0,0(%1)"
                : "=r"(s0_value) : "r"(member) : "memory");
        }
        if ((s32) s0_value >= 0) {
            func_001072B8(var_s2_early_base[s0_value]);
            func_00127154(0x1E, s0_value, 0);
        }
        var_s1_236 += 1;
    } while ((s32) var_s1_236 < (s32) *(u8 *)0x801952C1);
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
    var_f4_140 = *(f32 *)0x801F0DA0;
    x_base = *(f32 *)0x801F0D98;
    var_f4_140 -= x_base;
    var_f4_140 *= 217.0f;
    denominator = 256.0f;
    var_f4_140 /= denominator;
    __asm__ volatile (
        "# No instruction: keeps this C division inside its scene branch.\n"
        : : "f"(var_f4_140));
    y_base = *(f32 *)0x801F0D9C;
    var_f2_146 = 153.0f;
    var_f0_149 = *(f32 *)0x801F0DA4 - y_base;
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
    var_f4_140 = *(f32 *)0x801F0DA0;
    x_base = *(f32 *)0x801F0D98;
    var_f4_140 -= x_base;
    var_f4_140 *= 145.0f;
    denominator = 256.0f;
    var_f4_140 /= denominator;
    __asm__ volatile (
        "# No instruction: keeps the C division before the scene-branch join.\n"
        : : "f"(var_f4_140));
    y_base = *(f32 *)0x801F0D9C;
    var_f0_149 = *(f32 *)0x801F0DA4 - y_base;
    __asm__ volatile (
        "# No instruction: keeps the C subtraction before the scene-branch join.\n"
        : : "f"(var_f0_149));
    var_f2_146 = 32.0f;
block_29:
    var_f0_149 *= var_f2_146;
    var_f0_149 /= denominator;
    x_base += var_f4_140;
    y_base += var_f0_149;
    stack.sp18[0] = x_base;
    stack.sp18[2] = y_base;
    stack.sp18[1] = func_000F315C(*(u8 *)0x800E7AB9, x_base, y_base);
    func_0010D484(stack.sp18[0], stack.sp18[1], stack.sp18[2], D_8018F58C, 0x2A);
    D_801F365D = (u8)(D_801F365D | 1);
    return 1;
block_30:
    if (*(void **)0x801F3610 != 0) {
        goto block_64;
    }
    state_base = D_801F0DE0;
    if (*(s32 *)state_base != 0) {
        goto block_64;
    }
    if (*(void **)0x801F0DFC != 0) {
        goto block_64;
    }
    var_s1_236 = 0;
    signed_invalid = -1;
    invalid_timer = 0xFFFF;
    var_f20_negative = -0.8f;
    var_f22_positive = 0.8f;
    var_t0_245 = state_base + 0x272;
    s0_value = (u32)(state_base + 0x262);
    var_a2_247 = (u16 *)s0_value;
    var_a3_248 = (s8 *)(state_base + 0x259);
loop_34:
    temp_v0_250 = *var_a3_248;
    if (temp_v0_250 == signed_invalid) {
        goto block_63;
    }
    temp_a0_266 = *(s32 *)(0x801F0CB0 + (temp_v0_250 * 4));
    state_base = *(u8 **)0x801F361C;
    temp_v0_250 = *(u8 *)(state_base + *(s32 *)((s8 *)temp_a0_266 + 0x14));
    temp_a0_266 = *var_t0_245;
    __asm__ volatile (
        "# Emits bnel $a0,$v0,cleanup with sb $t1,0($a3) in its likely delay slot.\n"
        "# A mismatched event byte marks the selector -1 before C performs timer cleanup.\n"
        ".set noreorder\n"
        ".set nomacro\n"
        "bnel $4,$2,%0\n"
        "sb $9,0($7)\n"
        ".set macro\n"
        ".set reorder"
        :
        : "X"(&&block_62), "r"(temp_a0_266), "r"(temp_v0_250),
          "r"(signed_invalid), "r"(var_a3_248)
        : "memory");
block_37:
    temp_a0_266 = *var_a2_247;
    temp_v1_268 = (*(u8 *)0x800E9C13 + 1) * 2;
    *var_a2_247 = ((s32) temp_a0_266 < temp_v1_268)
        ? 0
        : (temp_v0_250 = temp_a0_266 - temp_v1_268);
block_40:
block_42:
    if (*var_a2_247 != 0) {
        goto block_63;
    }
    zero_float = 0.0f;
    D_801F369C = zero_float;
    D_801F0D80 = zero_float;
    *var_a3_248 = signed_invalid;
    *var_a2_247 = invalid_timer;
    *var_t0_245 = 0;
    func_00139DC0(var_s1_236, stack.sp28, var_a2_247, var_a3_248);
    func_0010D484(stack.sp28[0], stack.sp28[1], stack.sp28[2], D_8018F58C, 0x2C);
    event_owner = *(void **)0x801AB850;
    (*(u32 *)((s8 *)s0_value + (-0x23E))) = var_s1_236;
    (*(s8 *)((s8 *)event_owner + 4)) = 0;
    __asm__ volatile (
        "# No instruction: anchors the C labels addressed by the retail table at 0x801F0308.\n"
        :
        : "X"(&&dispatch_event_27), "X"(&&dispatch_event_group),
          "X"(&&dispatch_event_33), "X"(&&block_128));
    temp_v0_302 = *(u8 *)0x8018F481;
    event_dispatch_index = temp_v0_302 - 0x27;
    if (event_dispatch_index >= 0x17U) {
        goto block_128;
    }
    goto *((void **)0x801F0308)[event_dispatch_index];
dispatch_event_27:
    *(s32 *)0x801F0E00 = var_s1_236 + 1;
    goto block_61;
dispatch_event_group:
    __asm__ volatile (
        "# No instruction: anchors the seven C labels addressed by the retail table at 0x801F0368.\n"
        :
        : "X"(&&dispatch_index_0), "X"(&&dispatch_index_1),
          "X"(&&dispatch_index_2), "X"(&&dispatch_index_3),
          "X"(&&dispatch_index_4), "X"(&&dispatch_index_5),
          "X"(&&dispatch_index_6));
    if (var_s1_236 >= 7U) {
        goto block_128;
    }
    goto *((void **)0x801F0368)[var_s1_236];
dispatch_index_0:
    *(void **)0x801F0E00 = 4;
    goto block_61;
dispatch_index_1:
    temp_v0_250 = 5;
    goto block_53;
dispatch_index_2:
    temp_v0_250 = 7;
    goto block_55;
dispatch_index_3:
    *(void **)0x801F0E00 = 6;
    goto block_61;
dispatch_index_4:
    temp_v0_250 = 8;
block_53:
    *(void **)0x801F0E00 = temp_v0_250;
    *(f32 *)0x801F0D80 = var_f20_negative;
    return 1;
dispatch_index_5:
    temp_v0_250 = 0xA;
block_55:
    *(void **)0x801F0E00 = temp_v0_250;
    *(f32 *)0x801F0D80 = var_f22_positive;
    return 1;
dispatch_index_6:
    *(void **)0x801F0E00 = 9;
    goto block_61;
dispatch_event_33:
    *(void **)0x801F0E00 = (s32) (var_s1_236 + 0xB);
    temp_v0_250 = 1;
    if (var_s1_236 != 0) {
        goto block_59;
    }
    *(f32 *)0x801F0D80 = -0.5f;
    return temp_v0_250;
block_59:
    __asm__ volatile (
        "# Emits bne event_index,$v0,zero_value_path with redundant addiu $v0,$zero,1 in its delay slot.\n"
        "# The +0.5 and zero stores and both returns remain C; only this branch schedule is asm.\n"
        ".set noreorder\n"
        ".set nomacro\n"
        "bne %2,$2,%3\n"
        "addiu $2,$zero,1\n"
        ".set macro\n"
        ".set reorder"
        : "=r"(temp_v0_250)
        : "0"(temp_v0_250), "r"(var_s1_236), "X"(&&block_61));
    *(f32 *)0x801F0D80 = 0.5f;
    return temp_v0_250;
block_61:
    *(f32 *)0x801F0D80 = 0.0f;
    return 1;
block_62:
    *var_a2_247 = invalid_timer;
    *var_t0_245 = 0;
block_63:
    var_t0_245 += 1;
    var_a2_247 += 1;
    var_s1_236 += 1;
    var_a3_248 += 1;
    if ((s32) var_s1_236 < 8) {
        goto loop_34;
    }
block_64:
    temp_v1_402 = *(u8 *)0x801F1037;
    s0_value = 0;
    if (temp_v1_402 == 1) {
        goto block_67;
    }
    if (temp_v1_402 != 2) {
        goto block_75;
    }
    s0_value = (0 - (func_00139D74() == 0)) & 3;
block_67:
    if (func_00139C88() != 0) {
        goto block_69;
    }
    s0_value = 2;
    goto block_71;
block_69:
block_71:
    if (func_00139CE8() != 0) {
        goto block_73;
    }
    s0_value = 1;
    goto block_75;
block_73:
block_75:
    if (s0_value == 0) {
        goto block_88;
    }
    if (s0_value != 1) {
        goto block_80;
    }
    os_inval_icache(overlay_b_icache_text_start, overlay_b_icache_data_start - overlay_b_icache_text_start);
    os_inval_dcache(overlay_b_dcache_data_start, overlay_b_dcache_bss_start - overlay_b_dcache_data_start);
    func_0002de50(overlay_b_dma_rom_start, overlay_b_dma_text_start, overlay_b_dma_rom_end - overlay_b_dma_rom_start);
    if (overlay_b_bss_start == overlay_b_bss_end) {
        goto block_79;
    }
    memset_00023780(overlay_b_bss_start, overlay_b_bss_end - overlay_b_bss_start);
block_79:
    *(void **)0x801F0DE0 = 0x1C;
    *(s32 *)0x801F0DE8 = -1;
    D_801F365D = (u8)(D_801F365D | 1);
    goto block_87;
block_80:
    if (s0_value == 2) {
        goto block_82;
    }
    goto block_84;
block_82:
    var_a0_477 = -1;
    goto block_86;
block_84:
    if (s0_value != 3) {
        goto block_87;
    }
    var_a0_477 = func_00130C2C();
block_86:
    func_0012EA80(var_a0_477, stack.sp18);
    func_0010D484(stack.sp18[0], stack.sp18[1], stack.sp18[2], D_8018F58C, 0x29);
block_87:
    func_0005c090(0x21, 1);
    D_801F365D = (u8)(D_801F365D & 0xFD);
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
    s0_value = func_00139C10();
    goto block_96;
block_92:
    if (*(u8 *)0x801F0FDE != 0) {
        goto block_94;
    }
    s0_value = 1;
    goto block_96;
block_94:
block_96:
    if (func_0005c110(0x11) != 0) {
        return 0;
    }
    eligibility = (*(u8 *)0x8018F481 != 0x3F) & (s0_value != 0);
    if (eligibility == 0) {
        goto block_return_zero;
    }
    func_0005c090(0x21, 1);
    temp_v0_541 = func_00130C2C();
    if (temp_v0_541 == -1) {
        goto block_100;
    }
    temp_v1_548 = temp_v0_541 * 0x24;
    (*(s16 *)((s8 *)((temp_v1_548 + 0x80190000)) + (0x51CC))) = (s16) (((*(u16 *)((s8 *)((temp_v1_548 + 0x80190000)) + (0x51CC))) & 0xFFFB) | 2);
block_100:
    os_inval_icache(overlay_c_icache_text_start, overlay_c_icache_data_start - overlay_c_icache_text_start);
    os_inval_dcache(overlay_c_dcache_data_start, overlay_c_dcache_bss_start - overlay_c_dcache_data_start);
    func_0002de50(overlay_c_dma_rom_start, overlay_c_dma_text_start, overlay_c_dma_rom_end - overlay_c_dma_rom_start);
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
    {
    register s32 temp_a2_617 asm("$6");
    register s32 temp_v0_621 asm("$2");
    register s32 temp_v1_623 asm("$3");
    register s32 var_v0_635 asm("$2");
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
    temp_v1_623 = temp_v0_621 * temp_a1_609;
    var_v0_635 = temp_v1_623 / 25;
    goto block_111;
block_108:
    temp_v1_623 *= temp_a1_609;
    var_v0_635 = temp_v1_623 / 25;
    goto block_111;
block_109:
    temp_v1_623 = temp_a0_611 - 0x32;
    if (temp_v1_623 <= 0) {
        goto block_112;
    }
    temp_v1_623 *= temp_a1_609;
    var_v0_635 = temp_v1_623 / 50;
block_111:
    *(s32 *)0x8021C744 = var_v0_635 + temp_a2_617;
    goto block_113;
block_112:
    __asm__ volatile (
        "# No instruction: invalidating $v1 forces the retail /50 magic-constant reload.\n"
        : : : "$3");
    *(s32 *)0x8021C744 = (((0x32 - temp_a0_611) * temp_a1_609) / 50) + temp_a2_617;
block_113:
    ;
    }
    if (*(u8 *)0x8018F481 == 0x36) {
        goto block_119;
    }
    money = &D_80196A6C;
    temp_v0_695 = *money + *(s32 *)0x8021C744;
    *money = temp_v0_695;
    if (temp_v0_695 > 0x98967FU) {
        *money = 0x98967F;
    }
block_116:
block_118:
    func_00130E60(*(u16 *)0x8021C740, 0);
block_119:
    *(u16 *)0x801936B8 = 0;
    var_a3_248 = (s8 *)0xC8;
    if (*(u8 *)0x8018F481 == 0x36) {
        goto block_124;
    }
    reward_pair = D_80190F80;
    temp_a1_716 = reward_pair[0];
    temp_a0_718 = *(u8 *)0x8021C748;
    if (((s32)var_a3_248 - temp_a1_716) >= (s32) temp_a0_718) {
        goto block_122;
    }
    var_v0_728 = D_80190F80[1];
    reward_pair[0] = 0xC8;
    var_v0_728 += (s32)var_a3_248 - temp_a1_716;
    goto block_123;
block_122:
    var_v0_728 = D_80190F80[1];
    reward_pair[0] = temp_a1_716 + temp_a0_718;
    __asm__ volatile (
        "# No instruction: preserves the loaded reward byte as the first add operand.\n"
        : "=r"(var_v0_728)
        : "0"(var_v0_728));
    var_v0_728 += temp_a0_718;
block_123:
    D_80190F80[1] = var_v0_728;
block_124:
    state_flags = D_801F365D;
    __asm__ volatile (
        "# No instruction: fixes the flag load before the following independent stores.\n"
        : : "r"(state_flags) : "memory");
    s0_value = (u32)D_800EB0DC;
    temp_a0_266 = *(s32 *)s0_value;
    *(s32 *)D_801F0DE0 = 0x1B;
    D_801F0DE8 = -1;
    __asm__ volatile (
        "# No instruction: preserves the retail ordering of the two state stores.\n"
        : : : "memory");
    temp_v0_250 = 0xB;
    __asm__ volatile (
        "# No instruction: keeps the C constant in $v0 across the flag update.\n"
        : : "r"(temp_v0_250));
    D_801F365D = (u8)(state_flags | 1);
    if (temp_a0_266 == temp_v0_250) {
        goto block_126;
    }
    func_800EA6B0((u8 *)s0_value - 0x2C, 0xA, 0xA, (s32)var_a3_248);
block_126:
    if (D_8018F481 != 0x36) {
        temp_v0_250 = 1;
        goto block_final_return;
    }
    func_800EA6C8((u8 *)s0_value - 0x2C);
    goto block_128;
block_128:
    __asm__ volatile (
        "# No instruction: keeps the retail default-dispatch return as a distinct late block.\n");
    return 1;
block_return_zero:
    temp_v0_250 = 0;
block_final_return:
    __asm__ volatile (
        "# Emits only a local label, not an instruction; it is the early beql return target.\n"
        ".Lfunc_001390F0_epilogue:"
        :
        : "r"(temp_v0_250));
    return temp_v0_250;
}
