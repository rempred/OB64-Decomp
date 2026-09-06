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
/* Local layout view only; unknown bytes carry no semantic claim. */
typedef struct {
    LocalCopy copy;
    s32 buffer[6];
    u8 unknown_68[4];
    s32 *resultTime;
    u8 unknown_70[4];
    s32 duration;
    u8 unknown_78[4];
    s32 returnDuration;
    u8 unknown_80[4];
    s32 start;
    u8 unknown_88[7];
    u8 field57;
    u8 unknown_90[7];
    u8 field5B;
    u8 unknown_98[4];
    s32 effect;
    u8 unknown_A0[4];
    s32 hit;
} LocalState;
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
s32 func_002223E0(void *, void *, s32, s32, s32, s32);
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
    LocalState state;
    s32 actionByte, eventTime, field57, field5B, tail84, tail88;
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
    s32 var_s5_11;
    s32 var_s6_306;
    s32 var_v1_160;
    s32 var_v1_31;
    s32 var_v1_341;
    s32 var_v1_345, missMask;
    s32 var_v1_468;
    u32 temp_s4_79;
    u32 loaded, earlyLoaded;
    register u32 var_a1_184;
    register u32 var_a1_42;
    void *temp_v0_144;
    void *temp_v0_225;
    void *temp_v0_61;
    void *var_a2_227;
    void *var_a2_538;
    void *var_a2_571;
    void *var_a2_95;
    var_s5_11 = 0;
    state.resultTime = arg1;
    state.effect = 0;
    state.returnDuration = 0;
    memset_00023780(state.buffer, 0x18);
    temp_v0_26 = func_00233ED4(arg0);
    (*(s32 *)((s8 *)(arg0) + (0x68))) = temp_v0_26;
    if (temp_v0_26 < 0) {
        var_v1_31 = (*(s32 *)((s8 *)(arg0) + (0x94)));
        temp_a0_32 = *state.resultTime;
        if (var_v1_31 < temp_a0_32) {
            var_v1_31 = temp_a0_32;
        }
        earlyLoaded = *(u32 *)0x801CE8C0;
        (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_31;
        earlyLoaded = *(u32 *)(earlyLoaded + 0x828);
        if (earlyLoaded < (u32)var_v1_31) var_a1_42 = var_v1_31;
        else var_a1_42 = earlyLoaded;
        (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_42;
        func_0021D200(0x1C, (s32) var_a1_42, arg0);
        (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
        *state.resultTime = (*(s32 *)((s8 *)(arg0) + (0x94)));
        return 0;
    }
    temp_v0_61 = func_0020C478(temp_v0_26);
    state.field57 = (*(u8 *)((s8 *)(temp_v0_61) + (0x57)));
    state.field5B = (*(u8 *)((s8 *)(temp_v0_61) + (0x5B)));
    temp_s0_72 = func_002361EC(arg0);
    temp_s4_79 = func_002365BC(arg0, temp_v0_61, temp_s0_72, func_002363FC(temp_v0_61));
    temp_s0_81 = rand();
    temp_s1_83 = rand();
    temp_s4_79 = (u32) ((((temp_s0_81 << 0x12) & 0x0C000000) | (temp_s1_83 << 0xF) | rand()) % 100) < temp_s4_79;
    state.copy = *(LocalCopy *)((u8 *)*(void **)(arg0) + 0x44);
    var_a3_119 = 0;
    if (temp_s4_79 == 0) {
        if (func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF) {
            var_a3_119 = 2;
        } else {
            var_a3_119 = 1;
        }
    }
    temp_v0_130 = func_00201798((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C))), (*(s32 *)((s8 *)(arg0) + (0x7C))), var_a3_119);
    func_001F0E64(&state.copy, temp_v0_130 & 0xFF);
    func_001F197C(arg0, &state.copy, state.buffer);
    if (func_0020BFE4() != 0) {
        temp_v0_144 = (*(void **)((s8 *)(arg0) + (4)));
        var_s5_11 = func_0022222C(arg0, temp_v0_61, (*(s16 *)((s8 *)(temp_v0_144) + (0x1C))), (*(s16 *)((s8 *)(temp_v0_144) + (0x20))));
    } else {
        state.buffer[0] = 0;
    }
    temp_s8_157 = var_s5_11 + state.buffer[0];
    var_s5_11 = *state.resultTime - temp_s8_157;
    var_s5_11 = var_s5_11 & ((s32) ~var_s5_11 >> 0x1F);
    var_v1_160 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    if (var_s5_11 < var_v1_160) {
        var_s5_11 = var_v1_160;
    }
    temp_a0_168 = (*(s32 *)((s8 *)(temp_v0_61) + (0x94)));
    if ((var_s5_11 + temp_s8_157) < temp_a0_168) {
        var_s5_11 = temp_a0_168 - temp_s8_157;
    }
    if (var_v1_160 < var_s5_11) {
        var_v1_160 = var_s5_11;
    }
    loaded = *(u32 *)0x801CE8C0;
    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_160;
    loaded = *(u32 *)(loaded + 0x828);
    if (loaded < (u32)var_v1_160) var_a1_184 = var_v1_160;
    else var_a1_184 = loaded;
    (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_184;
    func_0021D200(0x1C, (s32) var_a1_184, arg0);
    var_s5_11 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
    if (func_0020BFE4() != 0) {
        func_0021D25C(0x1D, var_s5_11, arg0, 1, temp_v0_130 & 0xFF);
        func_0021D25C(0x1D, var_s5_11, arg0, 2, 7);
        func_0021D28C(2, var_s5_11 + state.buffer[0], arg0, 2, (*(s32 *)((s8 *)(arg0) + (0x68))), 5);
    }
    temp_v0_225 = (*(void **)((s8 *)(arg0) + (4)));
    state.copy = *(LocalCopy *)((u8 *)*(void **)((u8 *)arg0 + 4) + 0x44);
    var_a3_242 = 0;
    if (temp_s4_79 == 0) {
        if (func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF) {
            var_a3_242 = 2;
        } else {
            var_a3_242 = 1;
        }
    }
    temp_s1_255 = var_s5_11 + temp_s8_157;
    temp_s0_257 = func_00201798((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C))), (*(s32 *)((s8 *)(arg0) + (0x7C))), var_a3_242) & 0xFF;
    func_001F0E64(&state.copy, temp_s0_257);
    state.duration = func_001F197C(arg0, &state.copy, state.buffer);
    if (func_0020BFE4() != 0) {
        if (temp_s4_79 != 0) {
            func_0021D28C(6, temp_s1_255, arg0, 2, temp_s0_257, (*(s32 *)((s8 *)(arg0) + (0x7C))));
        } else {
            func_0021D28C(7, temp_s1_255, arg0, 2, temp_s0_257, (*(s32 *)((s8 *)(arg0) + (0x7C))));
        }
    } else {
        if (temp_s4_79 != 0) {
            func_0021D28C(6, temp_s1_255, arg0, 0, 0, (*(s32 *)((s8 *)(arg0) + (0x7C))));
        } else {
            func_0021D28C(7, temp_s1_255, arg0, 0, 0, (*(s32 *)((s8 *)(arg0) + (0x7C))));
        }
        state.buffer[0] = 0xF;
        state.duration = 0x14;
    }
    temp_s7_304 = func_000454e0(func_0020C448(arg0) & 0xFFFF);
    state.start = temp_s1_255;
    var_s6_306 = temp_s1_255 + state.duration;
    temp_s1_309 = (temp_s1_255 + state.buffer[0]) - 5;
    if (temp_s4_79 != 0) {
        temp_s0_313 = temp_s7_304 & 0xFF;
        func_0021D230(0x3E, var_s5_11, arg0, temp_s0_313);
        if (func_0020BFE4() != 0) {
            func_0021D2C0(0x17, temp_s1_309, 0, 0x5D, temp_s0_313, func_0020D72C(arg0), (*(s32 *)((s8 *)(arg0) + (0x68))));
        }
        if (temp_s1_309 < state.start) {
            state.start = temp_s1_309;
        }
        if (func_0020BFE4() != 0) {
            var_v1_341 = 0x19;
        } else {
            var_v1_341 = 5;
        }
        var_v1_345 = var_v1_341 + temp_s1_309;
        goto block_68;
    }
    if (func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF) {
        if (func_0020BFF8(temp_v0_61) != 0) {
            var_s0_356 = 0x60;
        } else {
            var_s0_356 = 0x5F;
        }
        if (func_0020BFE4() != 0) {
            func_0021D2C0(0x17, temp_s1_309, 0, var_s0_356, temp_s7_304 & 0xFF, func_0020D72C(arg0), (*(s32 *)((s8 *)(arg0) + (0x68))));
        }
        if (temp_s1_309 < state.start) {
            state.start = temp_s1_309;
        }
        missMask = 0xF;
        if (func_0020BFE4() == 0) missMask = 0;
        missMask |= 5;
        var_v1_345 = temp_s1_309 + missMask;
block_68:
        if (var_s6_306 < var_v1_345) {
            var_s6_306 = var_v1_345;
        }
    }
    if (temp_s4_79 != 0) {
        state.hit = func_00237810(arg0, temp_v0_61);
        temp_s4_79 = func_00237750(arg0, temp_v0_61, 0, 0, 0);
        if (state.hit != 0) {
            if (func_0020BFE4() != 0) {
                func_0021D200(0x33, (var_s5_11 + temp_s8_157 + state.buffer[0]) - 0xA, temp_v0_61);
            }
            func_0021D25C(0x34, var_s5_11 + temp_s8_157 + state.buffer[0], temp_v0_61, 0xFF, temp_s7_304 & 0xFF);
            temp_s4_79 *= 2;
        }
        temp_v0_439 = func_00045480(func_0020C448(arg0) & 0xFFFF);
        if ((temp_s7_304 & 0xFF) == 2) {
            var_a1_441 = 2;
        } else {
            var_a1_441 = 0 - ((temp_v0_439 & 0xFF) != 8);
        }
        if (var_a1_441 != -1) {
            state.effect = func_00237AF8(temp_v0_61, var_a1_441);
        }
        var_s0_456 = 0;
        if (state.effect == 0) {
            var_s0_456 = func_00237890(arg0, temp_v0_61);
        }
        actionByte = temp_s7_304 & 0xFF;
        if (state.hit != 0) {
            var_v1_468 = func_0022A4E0(temp_v0_61);
        } else {
            var_v1_468 = 0;
        }
        temp_s0_479 = var_s5_11 + temp_s8_157;
        func_0022ADFC(temp_v0_61, 0, temp_s0_479 + state.buffer[0], temp_s4_79, actionByte, var_s0_456 & 0xFF, 1, var_v1_468);
        if ((func_0020C2C0(temp_v0_61) != 0) && (func_0020C014(arg0) != 0) && (func_0020C104(arg0) == 0)) {
            temp_v0_497 = func_00233210(arg0, temp_v0_61);
            if (temp_v0_497 != 0) {
                eventTime = temp_s0_479 + state.duration;
                (*(u8 *)((s8 *)(arg0) + (0x34))) = (u8) ((*(u8 *)((s8 *)(arg0) + (0x34))) + temp_v0_497);
                func_0021D230(0x3F, eventTime, arg0, temp_v0_497);
            }
        }
        if ((state.effect != 0) && (func_0020C2C0(temp_v0_61) == 0) && (func_0020C32C(temp_v0_61) == 0)) {
            func_0023431C(temp_v0_61, var_s5_11 + temp_s8_157 + state.duration, state.effect);
            goto block_106;
        }
    } else {
        temp_s0_532 = func_00201584((*(s32 *)((s8 *)(temp_v0_61) + (0x48))), (*(s32 *)((s8 *)(temp_v0_61) + (0x4C)))) & 0xFF;
        temp_s1_537 = var_s5_11 + temp_s8_157 + state.buffer[0];
        state.copy = *(LocalCopy *)((u8 *)*(void **)(temp_v0_61) + 0x44);
        func_001F0E64(&state.copy, ((0 - (temp_s0_532 == 0)) & 0x17) | 0x15);
        temp_s4_79 = func_001F197C(temp_v0_61, &state.copy, 0);
        func_0021D230(0xE, temp_s1_537, temp_v0_61, 0xFF);
        temp_s1_569 = temp_s1_537 + temp_s4_79;
        state.copy = *(LocalCopy *)((u8 *)*(void **)(temp_v0_61) + 0x44);
        var_a1_586 = 0x18;
        if (temp_s0_532 != 0) {
            var_a1_586 = 0x16;
        }
        func_001F0E64(&state.copy, var_a1_586);
        temp_s0_600 = func_001F197C(temp_v0_61, &state.copy, 0);
        func_0021D230(0xF, temp_s1_569, temp_v0_61, 0xFF);
        temp_v1_603 = temp_s1_569 + (temp_s4_79 + temp_s0_600);
        if ((*(s32 *)((s8 *)(temp_v0_61) + (0x94))) < temp_v1_603) {
            (*(s32 *)((s8 *)(temp_v0_61) + (0x94))) = temp_v1_603;
        }
block_106:
        temp_v1_609 = (*(s32 *)((s8 *)(temp_v0_61) + (0x94)));
        if (var_s6_306 < temp_v1_609) {
            var_s6_306 = temp_v1_609;
        }
    }
    temp_s0_616 = var_s5_11 + temp_s8_157;
    temp_s1_618 = temp_s0_616 + state.duration;
    if (func_0020BFE4() != 0) {
        field57 = state.field57;
        field5B = state.field5B;
        state.returnDuration = func_002223E0(arg0, temp_v0_61, field57, field5B, (s32) (*(s16 *)((s8 *)((*(void **)((s8 *)(arg0) + (4)))) + (0x1C))), (s32) (*(s16 *)((s8 *)((*(void **)((s8 *)(arg0) + (4)))) + (0x20))));
        func_0021D25C(8, temp_s1_618, arg0, 2, 0xB);
    }
    func_0021D25C(9, temp_s1_618 + state.returnDuration, arg0, 2, 0xC);
    (*(s32 *)((s8 *)(arg0) + (0x84))) = temp_s8_157;
    temp_v1_652 = var_s6_306 - state.start;
    (*(s32 *)((s8 *)(arg0) + (0x88))) = temp_v1_652;
    temp_v0_657 = (state.duration + state.returnDuration) - temp_v1_652;
    (*(s32 *)((s8 *)(arg0) + (0x8C))) = temp_v0_657;
    if (temp_v0_657 < 0) {
        (*(s32 *)((s8 *)(arg0) + (0x8C))) = 0;
    }
    tail84 = (*(s32 *)((s8 *)(arg0) + (0x84)));
    tail88 = (*(s32 *)((s8 *)(arg0) + (0x88)));
    (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) (temp_s0_616 + state.duration + state.returnDuration);
    *state.resultTime = var_s5_11 + tail84 + tail88;
    return 1;
}
