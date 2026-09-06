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
s32 func_00045480(u16);
s32 func_000454e0(u16);
s32 func_00201584(s32, s32);
s32 func_00201798(s32, s32, s32, M2C_UNK);
s32 func_0020BFE4(void);
s32 func_0020BFF8(void *);
s32 func_0020C014(void *);
s32 func_0020C104(void *);
s32 func_0020C2C0(void *);
s32 func_0020C32C(void *);
u16 func_0020C448(void *);
void *func_0020C478(s32);
s32 func_0020D72C(void *);
void func_0021D200(M2C_UNK, s32, void *);
void func_0021D230(M2C_UNK, s32, void *, s32);
void func_0021D25C(M2C_UNK, s32, void *, M2C_UNK, s32);
void func_0021D28C(M2C_UNK, s32, void *, M2C_UNK, s32, s32);
void func_0021D2C0(M2C_UNK, s32, M2C_UNK, M2C_UNK, s32, s32, s32);
s32 func_0022257C(void *, s32, s32 *);
s32 func_0022A4E0(void *);
void func_0022ADFC(void *, M2C_UNK, s32, s32, s32, s32, s32, s32);
s32 func_00233210(void *, void *);
s32 func_00233F38(void *);
M2C_UNK func_0023431C(void *, s32, s32);
s32 func_002361EC(void *);
s32 func_002363FC(void *);
u32 func_002365BC(void *, void *, s32, s32);
s32 func_00237750(void *, void *, M2C_UNK, M2C_UNK, s32);
s32 func_00237810(void *, void *);
s32 func_00237890(void *, void *);
s32 func_00237AF8(void *, s32);
M2C_UNK memset_00023780(s32 *, M2C_UNK);
s32 rand();
s32 func_0022BFF8(void *arg0, s32 *arg1) {
    s32 buffer[6];
    s32 *sp3C;
    s32 sp44;
    s32 sp4C;
    s32 sp54;
    u16 sp5E;
    s32 sp64;
    s32 tailEnd, tailPre, tailFirst, tailDuration, tailLast, result;
    u8 *bridgeData;
    s32 actionByte;
    u32 loaded;
    u32 earlyLoaded;
    M2C_UNK var_s1_462;
    s32 temp_a0_31;
    s32 temp_a0_497;
    s32 temp_s0_148;
    u32 temp_s0_157;
    s32 temp_s0_222;
    s32 temp_s0_346;
    s32 temp_s0_469;
    u32 temp_s1_159;
    s32 temp_s5_68;
    s32 streamCode;
    s32 temp_v0_247;
    s32 temp_v0_25;
    s32 temp_v0_372;
    s32 temp_v0_418;
    s32 temp_v1_101;
    s32 temp_v1_246;
    s32 temp_v1_402;
    s32 temp_v1_417;
    s32 temp_v1_81;
    s32 temp_v1_91;
    s32 var_a1_295;
    s32 var_a1_486;
    s32 var_s0_416;
    s32 var_s1_245;
    s32 var_s4_85;
    s32 var_s7_115;
    s32 var_s8_11;
    s32 var_v1_120;
    s32 var_v1_285;
    s32 var_v1_30;
    s32 var_v1_321;
    u32 temp_s6_155;
    register u32 var_a1_130;
    register u32 var_a1_41;
    void *temp_s3_67;
    var_s8_11 = 0;
    sp3C = arg1;
    sp64 = 0;
    memset_00023780(buffer, 0x18);
    temp_v0_25 = func_00233F38(arg0);
    (*(s32 *)((s8 *)(arg0) + (0x68))) = temp_v0_25;
    if (temp_v0_25 < 0) {
        var_v1_30 = (*(s32 *)((s8 *)(arg0) + (0x94)));
        temp_a0_31 = *sp3C;
        if (var_v1_30 < temp_a0_31) {
            var_v1_30 = temp_a0_31;
        }
        earlyLoaded = *(u32 *)0x801CE8C0;
        (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_30;
        earlyLoaded = *(u32 *)(earlyLoaded + 0x828);
        if (earlyLoaded < (u32)var_v1_30) var_a1_41 = var_v1_30;
        else var_a1_41 = earlyLoaded;
        (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_41;
        func_0021D200(0x1C, (s32) var_a1_41, arg0);
        (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
        *sp3C = (*(s32 *)((s8 *)(arg0) + (0x94)));
        return 0;
    }
    temp_s3_67 = func_0020C478(temp_v0_25);
    streamCode = func_00201798((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C))), (*(s32 *)((s8 *)(arg0) + (0x7C))), 0) & 0xFF;
    sp54 = func_0022257C((u8 *)*(void **)arg0 + 0x44, streamCode, buffer);
    if (func_0020BFE4() != 0) {
        temp_v1_81 = (*(s32 *)((s8 *)(arg0) + (0x94)));
        var_s4_85 = *sp3C - buffer[0];
        var_s4_85 = var_s4_85 & ((s32) ~var_s4_85 >> 0x1F);
        if (var_s4_85 < temp_v1_81) {
            var_s4_85 = temp_v1_81;
        }
        temp_v1_91 = (*(s32 *)((s8 *)(temp_s3_67) + (0x94)));
        if ((var_s4_85 + buffer[0]) < temp_v1_91) {
            var_s4_85 = temp_v1_91 - buffer[0];
        }
    } else {
        var_s4_85 = *sp3C;
        temp_v1_101 = (*(s32 *)((s8 *)(arg0) + (0x94)));
        var_s4_85 = var_s4_85 & ((s32) ~var_s4_85 >> 0x1F);
        if (var_s4_85 < temp_v1_101) {
            var_s4_85 = temp_v1_101;
        }
    }
    sp5E = func_0020C448(arg0);
    var_s7_115 = 0;
    if (sp5E != 0) {
        var_s7_115 = func_000454e0(sp5E);
    }
    var_v1_120 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    if (var_v1_120 < var_s4_85) {
        var_v1_120 = var_s4_85;
    }
    loaded = *(u32 *)0x801CE8C0;
    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_120;
    loaded = *(u32 *)(loaded + 0x828);
    if (loaded < (u32)var_v1_120) var_a1_130 = var_v1_120;
    else var_a1_130 = loaded;
    (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_130;
    func_0021D200(0x1C, (s32) var_a1_130, arg0);
    var_s4_85 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
    temp_s0_148 = func_002361EC(arg0);
    temp_s6_155 = func_002365BC(arg0, temp_s3_67, temp_s0_148, func_002363FC(temp_s3_67));
    temp_s0_157 = rand();
    temp_s1_159 = rand();
    temp_s6_155 = (u32) ((((temp_s0_157 << 0x12) & 0x0C000000) | (temp_s1_159 << 0xF) | rand()) % 100) < temp_s6_155;
    func_0021D230(0x3E, var_s4_85, arg0, var_s7_115 & 0xFF);
    if (func_0020BFE4() != 0) {
        func_0021D28C(6, var_s4_85, arg0, 0xFF, streamCode, (*(s32 *)((s8 *)(arg0) + (0x7C))));
    } else {
        func_0021D28C(6, var_s4_85, arg0, 0, 0, (*(s32 *)((s8 *)(arg0) + (0x7C))));
        sp54 = 0xF;
        buffer[0] = 0xA;
    }
    sp4C = var_s4_85 + sp54;
    sp44 = var_s4_85 + buffer[0];
    if (func_0020BFE4() != 0) {
        temp_s0_222 = func_0020D72C(arg0);
        func_0021D2C0(0x17, var_s4_85 + buffer[0], 0, 0x5E, var_s7_115 & 0xFF, temp_s0_222, func_0020D72C(temp_s3_67));
    }
    temp_s5_68 = func_00237750(arg0, temp_s3_67, 0, 0, 0);
    if (temp_s6_155 != 0) {
        if (func_0020BFE4() != 0) {
            temp_v1_246 = (*(s32 *)((s8 *)(arg0) + (0x58)));
            temp_v0_247 = (*(s32 *)((s8 *)(temp_s3_67) + (0x58)));
            var_s1_245 = temp_v1_246 - temp_v0_247;
            if (var_s1_245 <= 0) {
                var_s1_245 = temp_v0_247 - temp_v1_246;
            }
        } else { var_s1_245 = 0; }
        temp_s6_155 = func_00237810(arg0, temp_s3_67);
        if (temp_s6_155 != 0) {
            if (func_0020BFE4() != 0) {
                func_0021D200(0x33, (var_s4_85 + buffer[0] + var_s1_245) - 0xA, temp_s3_67);
            }
            func_0021D25C(0x34, var_s4_85 + buffer[0] + var_s1_245, temp_s3_67, 0xFF, var_s7_115 & 0xFF);
            temp_s5_68 *= 2;
        }
        if (sp5E != 0) {
            var_s8_11 = func_00045480(sp5E);
        }
        var_v1_285 = var_s7_115 & 0xFF;
        if (var_v1_285 == 2) {
            var_a1_295 = 2;
        } else {
            var_a1_295 = 0 - ((var_s8_11 & 0xFF) != 8);
        }
        if (var_a1_295 != -1) {
            sp64 = func_00237AF8(temp_s3_67, var_a1_295);
        }
        var_s8_11 = 0;
        if (sp64 == 0) {
            var_s8_11 = func_00237890(arg0, temp_s3_67);
        }
        actionByte = var_s7_115 & 0xFF;
        if (temp_s6_155 != 0) {
            var_v1_321 = func_0022A4E0(temp_s3_67);
        } else {
            var_v1_321 = 0;
        }
        func_0022ADFC(temp_s3_67, 0, var_s4_85 + buffer[0] + var_s1_245, temp_s5_68, actionByte, var_s8_11 & 0xFF, 1, var_v1_321);
        if (func_0020BFE4() != 0) {
            temp_s0_346 = func_0020D72C(arg0);
            func_0021D2C0(0x17, (var_s4_85 + buffer[0] + var_s1_245) - 3, 0, 0x5D, var_s7_115 & 0xFF, temp_s0_346, func_0020D72C(temp_s3_67));
        }
        if ((func_0020C2C0(temp_s3_67) != 0) && (func_0020C014(arg0) != 0) && (func_0020C104(arg0) == 0)) {
            temp_v0_372 = func_00233210(arg0, temp_s3_67);
            if (temp_v0_372 != 0) {
                (*(u8 *)((s8 *)(arg0) + (0x34))) = (u8) ((*(u8 *)((s8 *)(arg0) + (0x34))) + temp_v0_372);
                func_0021D230(0x3F, var_s4_85 + buffer[0] + var_s1_245, arg0, temp_v0_372);
            }
        }
        if ((sp64 != 0) && (func_0020C2C0(temp_s3_67) == 0) && (func_0020C32C(temp_s3_67) == 0)) {
            func_0023431C(temp_s3_67, var_s4_85 + buffer[0] + var_s1_245, sp64);
            temp_v1_402 = (*(s32 *)((s8 *)(temp_s3_67) + (0x94)));
            if (sp4C < temp_v1_402) {
                sp4C = temp_v1_402;
                goto block_90;
            }
        } else {
            goto block_90;
        }
    } else {
        var_s8_11 = func_00201584((*(s32 *)((s8 *)(temp_s3_67) + (0x48))), (*(s32 *)((s8 *)(temp_s3_67) + (0x4C)))) & 0xFF;
        if (func_0020BFE4() != 0) {
            temp_v1_417 = (*(s32 *)((s8 *)(arg0) + (0x58)));
            temp_v0_418 = (*(s32 *)((s8 *)(temp_s3_67) + (0x58)));
            var_s0_416 = temp_v1_417 - temp_v0_418;
            if (var_s0_416 <= 0) {
                var_s0_416 = temp_v0_418 - temp_v1_417;
            }
        } else { var_s0_416 = 4; }
        var_s0_416 = var_s0_416 - ((func_00201584((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C)))) & 0xFF) ? 4 : 3);
        temp_s6_155 = var_s4_85 + buffer[0] + var_s0_416;
        func_0021D230(0xE, temp_s6_155, temp_s3_67, 0xFF);
        temp_s5_68 = func_0022257C((u8 *)*(void **)temp_s3_67 + 0x44, ((0 - (var_s8_11 == 0)) & 0x17) | 0x15, 0);
        if ((func_00201584((*(s32 *)((s8 *)(temp_s3_67) + (0x48))), (*(s32 *)((s8 *)(temp_s3_67) + (0x4C)))) & 0xFF) && (func_0020BFE4() != 0)) {
            if (func_0020BFF8(temp_s3_67) != 0) {
                var_s1_462 = 0x60;
            } else { var_s1_462 = 0x5F; }
            temp_s0_469 = func_0020D72C(arg0);
            func_0021D2C0(0x17, temp_s6_155, 0, var_s1_462, var_s7_115 & 0xFF, temp_s0_469, func_0020D72C(temp_s3_67));
        }
        func_0021D230(0xF, temp_s6_155 + temp_s5_68, temp_s3_67, 0xFF);
        bridgeData = (u8 *)*(void **)temp_s3_67 + 0x44;
        var_a1_486 = 0x18;
        if (var_s8_11 != 0) {
            var_a1_486 = 0x16;
        }
        temp_s5_68 += func_0022257C(bridgeData, var_a1_486, 0);
        (*(s32 *)((s8 *)(temp_s3_67) + (0x94))) = temp_s6_155 + temp_s5_68;
block_90:
        temp_a0_497 = (*(s32 *)((s8 *)(temp_s3_67) + (0x94)));
        if (sp4C < temp_a0_497) {
            sp4C = temp_a0_497;
        }
    }
    tailEnd = sp4C - sp44;
    tailPre = buffer[0];
    (*(s32 *)((s8 *)(arg0) + (0x88))) = tailEnd;
    tailDuration = (*(volatile s32 *)((s8 *)(arg0) + (0x88)));
    (*(s32 *)((s8 *)(arg0) + (0x84))) = tailPre;
    tailFirst = (*(volatile s32 *)((s8 *)(arg0) + (0x84)));
    tailLast = (*(volatile s32 *)((s8 *)(arg0) + (0x88)));
    result = 1;
    (*(s32 *)((s8 *)(arg0) + (0x8C))) = 0;
    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_s4_85 + tailDuration;
    *sp3C = var_s4_85 + tailFirst + tailLast;
    return result;
}
