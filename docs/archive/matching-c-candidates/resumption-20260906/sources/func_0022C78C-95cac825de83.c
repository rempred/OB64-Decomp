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
typedef struct { u32 words[20]; } LocalCopy;
s32 func_00045480(s32);
s32 func_000454e0(s32);
void func_001F0E64(LocalCopy *, s32);
s32 func_001F197C(void *, LocalCopy *, s32 *);
s32 func_00201584(s32, s32);
s32 func_00201798(s32, s32, s32, M2C_UNK);
s32 func_0020BFE4(void);
s32 func_0020BFF8(void *);
s32 func_0020C014(void *);
s32 func_0020C104(void *);
s32 func_0020C2C0(void *);
s32 func_0020C32C(void *);
s32 func_0020C448(void *);
void *func_0020C478(s32);
s32 func_0020D72C(void *);
void func_0021D200(M2C_UNK, s32, void *);
void func_0021D230(M2C_UNK, s32, void *, s32);
void func_0021D25C(M2C_UNK, s32, void *, M2C_UNK, s32);
void func_0021D28C(M2C_UNK, s32, void *, M2C_UNK, s32, s32);
void func_0021D2C0(M2C_UNK, s32, M2C_UNK, M2C_UNK, s32, s32, s32);
s32 func_0022222C(void *, void *, s16, s16);
s32 func_002223E0(void *, void *, u8, u8, s32, s32);
s32 func_0022A4E0(void *);
void func_0022ADFC(void *, M2C_UNK, s32, s32, s32, s32, s32, s32);
s32 func_00233210(void *, void *);
s32 func_00233ED4(void *);
void func_0023431C(void *, s32, s32);
s32 func_002361EC(void *);
s32 func_002363FC(void *);
u32 func_002365BC(void *, void *, s32, s32);
s32 func_00237750(void *, void *, M2C_UNK, M2C_UNK, s32);
s32 func_00237810(void *, void *);
s32 func_00237890(void *, void *);
s32 func_00237AF8(void *, s32);
void memset_00023780(s32 *, M2C_UNK);
s32 rand();
s32 func_0022C78C(void *arg0, s32 *arg1) {
    LocalCopy copy;
    s32 buffer[6];
    s32 *sp8C;
    s32 sp94;
    s32 sp9C;
    s32 spA4;
    u8 spAF;
    u8 spB7;
    s32 spBC;
    s32 spC4;
    M2C_UNK *var_a3_226;
    M2C_UNK *var_a3_533;
    M2C_UNK *var_a3_570;
    M2C_UNK *var_a3_94;
    M2C_UNK var_a0_269;
    M2C_UNK var_a0_283;
    M2C_UNK var_a3_119;
    M2C_UNK var_a3_242;
    M2C_UNK var_s0_356;
    s32 temp_a0_168;
    s32 temp_a0_32;
    s32 temp_s0_257;
    s32 temp_s0_313;
    s32 temp_s0_479;
    s32 temp_s0_532;
    s32 temp_s0_600;
    s32 temp_s0_616;
    s32 temp_s0_72;
    u32 temp_s0_81;
    s32 temp_s1_255;
    s32 temp_s1_309;
    s32 temp_s1_537;
    s32 temp_s1_569;
    s32 temp_s1_618;
    u32 temp_s1_83;
    s32 temp_s4_105;
    s32 temp_s4_562;
    s32 temp_s5_158;
    s32 temp_s5_195;
    s32 temp_s7_304;
    s32 temp_s8_157;
    s32 temp_v0_130;
    s32 temp_v0_26;
    s32 temp_v0_439;
    s32 temp_v0_497;
    s32 temp_v0_568;
    s32 temp_v0_657;
    s32 temp_v0_93;
    s32 temp_v1_535;
    s32 temp_v1_603;
    s32 temp_v1_609;
    s32 temp_v1_652;
    s32 var_a1_441;
    s32 var_a1_586;
    s32 var_s0_456;
    s32 var_s4_408;
    s32 var_s5_11;
    s32 var_s5_162;
    s32 var_s6_306;
    s32 var_v1_160;
    s32 var_v1_31;
    s32 var_v1_341;
    s32 var_v1_345;
    s32 var_v1_468;
    u32 temp_s4_79;
    u32 var_a1_184;
    u32 var_a1_42;
    void *temp_v0_144;
    void *temp_v0_225;
    void *temp_v0_61;
    void *var_a2_227;
    void *var_a2_538;
    void *var_a2_571;
    void *var_a2_95;
    var_s5_11 = 0;
    sp8C = arg1;
    spBC = 0;
    sp9C = 0;
    memset_00023780(buffer, 0x18);
    temp_v0_26 = func_00233ED4(arg0);
    (*(s32 *)((s8 *)(arg0) + (0x68))) = temp_v0_26;
    if (temp_v0_26 < 0) {
        var_v1_31 = (*(s32 *)((s8 *)(arg0) + (0x94)));
        temp_a0_32 = *sp8C;
        if (var_v1_31 < temp_a0_32) {
            var_v1_31 = temp_a0_32;
        }
        (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_31;
        var_a1_42 = (*(u32 *)((s8 *)(*(void **)0x801CE8C0) + (0x828)));
        if (var_a1_42 < (u32) var_v1_31) {
            var_a1_42 = (u32) var_v1_31;
        }
        (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_42;
        func_0021D200(0x1C, (s32) var_a1_42, arg0);
        (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
        *sp8C = (*(s32 *)((s8 *)(arg0) + (0x94)));
        return 0;
    }
    temp_v0_61 = func_0020C478(temp_v0_26);
    spAF = (*(u8 *)((s8 *)(temp_v0_61) + (0x57)));
    spB7 = (*(u8 *)((s8 *)(temp_v0_61) + (0x5B)));
    temp_s0_72 = func_002361EC(arg0);
    temp_s4_79 = func_002365BC(arg0, temp_v0_61, temp_s0_72, func_002363FC(temp_v0_61));
    temp_s0_81 = rand();
    temp_s1_83 = rand();
    temp_s4_105 = (u32) ((((temp_s0_81 << 0x12) & 0x0C000000) | (temp_s1_83 << 0xF) | rand()) % 100) < temp_s4_79;
    copy = *(LocalCopy *)((u8 *)*(void **)(arg0) + 0x44);
    var_a3_119 = 0;
    if (temp_s4_105 == 0) {
        var_a3_119 = 1;
        if (func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF) {
            var_a3_119 = 2;
        }
    }
    temp_v0_130 = func_00201798((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C))), (*(s32 *)((s8 *)(arg0) + (0x7C))), var_a3_119);
    func_001F0E64(&copy, temp_v0_130 & 0xFF);
    func_001F197C(arg0, &copy, buffer);
    if (func_0020BFE4() != 0) {
        temp_v0_144 = (*(void **)((s8 *)(arg0) + (4)));
        var_s5_11 = func_0022222C(arg0, temp_v0_61, (*(s16 *)((s8 *)(temp_v0_144) + (0x1C))), (*(s16 *)((s8 *)(temp_v0_144) + (0x20))));
    } else {
        buffer[0] = 0;
    }
    temp_s8_157 = var_s5_11 + buffer[0];
    temp_s5_158 = *sp8C - temp_s8_157;
    var_v1_160 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    var_s5_162 = temp_s5_158 & ((s32) ~temp_s5_158 >> 0x1F);
    if (var_s5_162 < var_v1_160) {
        var_s5_162 = var_v1_160;
    }
    temp_a0_168 = (*(s32 *)((s8 *)(temp_v0_61) + (0x94)));
    if ((var_s5_162 + temp_s8_157) < temp_a0_168) {
        var_s5_162 = temp_a0_168 - temp_s8_157;
    }
    if (var_v1_160 < var_s5_162) {
        var_v1_160 = var_s5_162;
    }
    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_160;
    var_a1_184 = (*(u32 *)((s8 *)(*(void **)0x801CE8C0) + (0x828)));
    if (var_a1_184 < (u32) var_v1_160) {
        var_a1_184 = (u32) var_v1_160;
    }
    (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_184;
    func_0021D200(0x1C, (s32) var_a1_184, arg0);
    temp_s5_195 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
    if (func_0020BFE4() != 0) {
        func_0021D25C(0x1D, temp_s5_195, arg0, 1, temp_v0_130 & 0xFF);
        func_0021D25C(0x1D, temp_s5_195, arg0, 2, 7);
        func_0021D28C(2, temp_s5_195 + buffer[0], arg0, 2, (*(s32 *)((s8 *)(arg0) + (0x68))), 5);
    }
    temp_v0_225 = (*(void **)((s8 *)(arg0) + (4)));
    copy = *(LocalCopy *)((u8 *)*(void **)((u8 *)arg0 + 4) + 0x44);
    var_a3_242 = 0;
    if (temp_s4_105 == 0) {
        var_a3_242 = 1;
        if (func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF) {
            var_a3_242 = 2;
        }
    }
    temp_s1_255 = temp_s5_195 + temp_s8_157;
    temp_s0_257 = func_00201798((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C))), (*(s32 *)((s8 *)(arg0) + (0x7C))), var_a3_242) & 0xFF;
    func_001F0E64(&copy, temp_s0_257);
    sp94 = func_001F197C(arg0, &copy, buffer);
    if (func_0020BFE4() != 0) {
        var_a0_269 = 7;
        if (temp_s4_105 != 0) {
            var_a0_269 = 6;
        }
        func_0021D28C(var_a0_269, temp_s1_255, arg0, 2, temp_s0_257, (*(s32 *)((s8 *)(arg0) + (0x7C))));
    } else {
        var_a0_283 = 7;
        if (temp_s4_105 != 0) {
            var_a0_283 = 6;
        }
        func_0021D28C(var_a0_283, temp_s1_255, arg0, 0, 0, (*(s32 *)((s8 *)(arg0) + (0x7C))));
        sp94 = 0x14;
        buffer[0] = 0xF;
    }
    temp_s7_304 = func_000454e0(func_0020C448(arg0) & 0xFFFF);
    spA4 = temp_s1_255;
    var_s6_306 = temp_s1_255 + sp94;
    temp_s1_309 = (temp_s1_255 + buffer[0]) - 5;
    if (temp_s4_105 != 0) {
        temp_s0_313 = temp_s7_304 & 0xFF;
        func_0021D230(0x3E, temp_s5_195, arg0, temp_s0_313);
        if (func_0020BFE4() != 0) {
            func_0021D2C0(0x17, temp_s1_309, 0, 0x5D, temp_s0_313, func_0020D72C(arg0), (*(s32 *)((s8 *)(arg0) + (0x68))));
        }
        if (temp_s1_309 < spA4) {
            spA4 = temp_s1_309;
        }
        var_v1_341 = 5;
        if (func_0020BFE4() != 0) {
            var_v1_341 = 0x19;
        }
        var_v1_345 = var_v1_341 + temp_s1_309;
        goto block_68;
    }
    if (func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF) {
        var_s0_356 = 0x5F;
        if (func_0020BFF8(temp_v0_61) != 0) {
            var_s0_356 = 0x60;
        }
        if (func_0020BFE4() != 0) {
            func_0021D2C0(0x17, temp_s1_309, 0, var_s0_356, temp_s7_304 & 0xFF, func_0020D72C(arg0), (*(s32 *)((s8 *)(arg0) + (0x68))));
        }
        if (temp_s1_309 < spA4) {
            spA4 = temp_s1_309;
        }
        var_v1_345 = temp_s1_309 + (((0 - (func_0020BFE4() != 0)) & 0xF) | 5);
block_68:
        if (var_s6_306 < var_v1_345) {
            var_s6_306 = var_v1_345;
        }
    }
    if (temp_s4_105 != 0) {
        spC4 = func_00237810(arg0, temp_v0_61);
        var_s4_408 = func_00237750(arg0, temp_v0_61, 0, 0, 0);
        if (spC4 != 0) {
            if (func_0020BFE4() != 0) {
                func_0021D200(0x33, (temp_s5_195 + temp_s8_157 + buffer[0]) - 0xA, temp_v0_61);
            }
            var_s4_408 *= 2;
            func_0021D25C(0x34, temp_s5_195 + temp_s8_157 + buffer[0], temp_v0_61, 0xFF, temp_s7_304 & 0xFF);
        }
        temp_v0_439 = func_00045480(func_0020C448(arg0) & 0xFFFF) & 0xFF;
        if ((temp_s7_304 & 0xFF) == 2) {
            var_a1_441 = 2;
        } else {
            var_a1_441 = 0 - (temp_v0_439 != 8);
        }
        if (var_a1_441 != -1) {
            spBC = func_00237AF8(temp_v0_61, var_a1_441);
        }
        var_s0_456 = 0;
        if (spBC == 0) {
            var_s0_456 = func_00237890(arg0, temp_v0_61);
        }
        if (spC4 != 0) {
            var_v1_468 = func_0022A4E0(temp_v0_61);
        } else {
            var_v1_468 = 0;
        }
        temp_s0_479 = temp_s5_195 + temp_s8_157;
        func_0022ADFC(temp_v0_61, 0, temp_s0_479 + buffer[0], var_s4_408, temp_s7_304 & 0xFF, var_s0_456 & 0xFF, 1, var_v1_468);
        if ((func_0020C2C0(temp_v0_61) != 0) && (func_0020C014(arg0) != 0) && (func_0020C104(arg0) == 0)) {
            temp_v0_497 = func_00233210(arg0, temp_v0_61);
            if (temp_v0_497 != 0) {
                (*(u8 *)((s8 *)(arg0) + (0x34))) = (u8) ((*(u8 *)((s8 *)(arg0) + (0x34))) + temp_v0_497);
                func_0021D230(0x3F, temp_s0_479 + sp94, arg0, temp_v0_497);
            }
        }
        if ((spBC != 0) && (func_0020C2C0(temp_v0_61) == 0) && (func_0020C32C(temp_v0_61) == 0)) {
            func_0023431C(temp_v0_61, temp_s5_195 + temp_s8_157 + sp94, spBC);
            goto block_106;
        }
    } else {
        temp_s0_532 = func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF;
        temp_s1_537 = temp_s5_195 + temp_s8_157 + buffer[0];
        copy = *(LocalCopy *)((u8 *)*(void **)(temp_v0_61) + 0x44);
        func_001F0E64(&copy, ((0 - (temp_s0_532 == 0)) & 0x17) | 0x15);
        temp_s4_562 = func_001F197C(temp_v0_61, &copy, 0);
        func_0021D230(0xE, temp_s1_537, temp_v0_61, 0xFF);
        temp_s1_569 = temp_s1_537 + temp_s4_562;
        copy = *(LocalCopy *)((u8 *)*(void **)(temp_v0_61) + 0x44);
        var_a1_586 = 0x18;
        if (temp_s0_532 != 0) {
            var_a1_586 = 0x16;
        }
        func_001F0E64(&copy, var_a1_586);
        temp_s0_600 = func_001F197C(temp_v0_61, &copy, 0);
        func_0021D230(0xF, temp_s1_569, temp_v0_61, 0xFF);
        temp_v1_603 = temp_s1_569 + (temp_s4_562 + temp_s0_600);
        if ((*(s32 *)((s8 *)(temp_v0_61) + (0x94))) < temp_v1_603) {
            (*(s32 *)((s8 *)(temp_v0_61) + (0x94))) = temp_v1_603;
        }
block_106:
        temp_v1_609 = (*(s32 *)((s8 *)(temp_v0_61) + (0x94)));
        if (var_s6_306 < temp_v1_609) {
            var_s6_306 = temp_v1_609;
        }
    }
    temp_s0_616 = temp_s5_195 + temp_s8_157;
    temp_s1_618 = temp_s0_616 + sp94;
    if (func_0020BFE4() != 0) {
        sp9C = func_002223E0(arg0, temp_v0_61, spAF, spB7, (s32) (*(s16 *)((s8 *)((*(void **)((s8 *)(arg0) + (4)))) + (0x1C))), (s32) (*(s16 *)((s8 *)((*(void **)((s8 *)(arg0) + (4)))) + (0x20))));
        func_0021D25C(8, temp_s1_618, arg0, 2, 0xB);
    }
    func_0021D25C(9, temp_s1_618 + sp9C, arg0, 2, 0xC);
    (*(s32 *)((s8 *)(arg0) + (0x84))) = temp_s8_157;
    temp_v1_652 = var_s6_306 - spA4;
    (*(s32 *)((s8 *)(arg0) + (0x88))) = temp_v1_652;
    temp_v0_657 = (sp94 + sp9C) - temp_v1_652;
    (*(s32 *)((s8 *)(arg0) + (0x8C))) = temp_v0_657;
    if (temp_v0_657 < 0) {
        (*(s32 *)((s8 *)(arg0) + (0x8C))) = 0;
    }
    (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) (temp_s0_616 + sp94 + sp9C);
    *sp8C = temp_s5_195 + (*(s32 *)((s8 *)(arg0) + (0x84))) + (*(s32 *)((s8 *)(arg0) + (0x88)));
    return 1;
}
