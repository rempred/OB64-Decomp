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
s32 func_0020C2C0(void *);
s32 func_0020C2F4(void *);
s32 func_0020C310(void *);
s32 func_0020C32C(void *);
s32 func_0020C348(void *);
void *func_0020C478(s32);
M2C_UNK func_0021D200(M2C_UNK, s32, void *);
M2C_UNK func_0021D230(M2C_UNK, s32, void *, M2C_UNK);
M2C_UNK func_0021D25C(M2C_UNK, s32, void *, M2C_UNK, s32);
M2C_UNK func_0021D28C(M2C_UNK, s32, void *, M2C_UNK, s32, s32);
s32 func_002224F4(void);
s32 func_0022257C(void *, s32, s32 *);
s32 func_00239AA4(void *, u16);
s32 func_0002CBCC();

void func_0022A964(void *arg0, s32 arg1, s32 arg2, s32 arg3, u8 arg4) {
    M2C_UNK var_a0_25;
    u32 temp_s0_65;
    u32 temp_s1_67;
    s32 temp_v0_188;
    s32 scanResult;
    s32 var_a1_281;
    s32 var_s1_154;
    s32 var_s4_13;
    s32 var_v0_48;
    s32 temp_v0_147;
    u8 temp_s2_61;
    void *temp_v0_156;

    var_s4_13 = arg1;
    if (func_0020C32C(arg0) != 0) {
        func_0021D200(0x2C, var_s4_13, arg0);
    } else {
        var_a0_25 = 0x12;
        if (arg2 != 0) {
            var_a0_25 = 0xD;
        }
        func_0021D230(var_a0_25, var_s4_13, arg0, 0xFF);
        var_s4_13 += func_0022257C((u8 *)*(void **)arg0 + 0x44, ((0 - (arg2 == 0)) & 0x1A) | 0x12, 0);
    }
    var_v0_48 = arg4 & 0xE;
    if (arg2 != 0) {
        var_v0_48 = arg4 & 0xE;
        if (func_0020C310(arg0) != 0) {
            var_v0_48 = arg4 & 0xE;
            if (func_0020C2F4(arg0) == 0) {
                var_v0_48 = arg4 & 0xE;
                if (func_0020C32C(arg0) == 0) {
                    temp_s2_61 = (*(u8 *)((s8 *)(arg0) + (0x30)));
                    temp_s0_65 = func_0002CBCC();
                    temp_s1_67 = func_0002CBCC();
                    var_v0_48 = arg4 & 0xE;
                    if (temp_s2_61 >= (u32) ((((temp_s0_65 << 0x12) & 0x0C000000) | (temp_s1_67 << 0xF) | func_0002CBCC()) % 100)) {
                        func_0021D230(0x26, var_s4_13, arg0, 0xFF);
                        (*(s32 *)((s8 *)(arg0) + (0x40))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x40))) & ~4);
                        var_s4_13 += func_0022257C((u8 *)*(void **)arg0 + 0x44, 0x23, 0);
                        if (func_0020C348(arg0) != 0) {
                            func_0021D230(0x27, var_s4_13, arg0, 0xFF);
                        }
                        var_v0_48 = arg4 & 0xE;
                    }
                }
            }
        }
    }
    if (var_v0_48 != 0) {
        if (arg4 & 8) {
            if (func_0020C32C(arg0) == 0) {
                func_0021D230(0x23, var_s4_13, arg0, 0xFF);
                var_s4_13 = var_s4_13 + func_0022257C((u8 *)*(void **)arg0 + 0x44, 0x26, 0) + 0x16;
                func_0021D200(0x2C, var_s4_13, arg0);
                (*(s32 *)((s8 *)(arg0) + (0x40))) = (s32) (((*(s32 *)((s8 *)(arg0) + (0x40))) & ~0x1C) | 2);
                if ((*(s32 *)((s8 *)(arg0) + (0x94))) < var_s4_13) {
                    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_s4_13;
                }
                temp_v0_147 = func_002224F4();
                (*(u16 *)((s8 *)(*(void **)0x801CE8BC) + (0x606A))) = temp_v0_147;
                var_s1_154 = 0;
                if (temp_v0_147 & 0xFFFF) {
                    do {
                        temp_v0_156 = func_0020C478(var_s1_154);
                        scanResult = func_0020C2C0(temp_v0_156);
                        var_s1_154 += 1;
                        if (scanResult == 0) {
                            (*(s32 *)((s8 *)(temp_v0_156) + (0x6C))) = (s32) (*(s32 *)((s8 *)(temp_v0_156) + (0x70)));
                        }
                    } while (var_s1_154 < 0x14);
                    if (func_00239AA4(arg0, (*(u16 *)((s8 *)(*(void **)0x801CE8BC) + (0x606A)))) != 0) {
                        func_0021D25C(0x1D, var_s4_13, arg0, 0xFF, 0x24);
                        temp_v0_188 = var_s4_13 + func_0022257C((u8 *)*(void **)arg0 + 0x44, 0x24, 0);
                        if ((*(s32 *)((s8 *)(arg0) + (0x94))) < temp_v0_188) {
                            (*(s32 *)((s8 *)(arg0) + (0x94))) = temp_v0_188;
                        }
                    }
                }
            } else {
                goto block_40;
            }
        } else if (arg4 & 4) {
            if ((func_0020C32C(arg0) == 0) && (func_0020C2F4(arg0) == 0)) {
                func_0021D28C(0x1A, var_s4_13, arg0, 0xFF, var_s4_13 + 0x64, arg3 & 0xFF);
                var_s4_13 = var_s4_13 + func_0022257C((u8 *)*(void **)arg0 + 0x44, 0x20, 0);
                (*(s32 *)((s8 *)(arg0) + (0x40))) = (s32) (((*(s32 *)((s8 *)(arg0) + (0x40))) & ~0x14) | 8);
                if ((*(s32 *)((s8 *)(arg0) + (0x94))) < var_s4_13) {
                    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_s4_13;
                }
            } else {
                goto block_40;
            }
        } else if ((arg4 & 2) && (func_0020C32C(arg0) == 0) && (func_0020C2F4(arg0) == 0) && (func_0020C310(arg0) == 0)) {
            func_0021D230(0x25, var_s4_13, arg0, 0xFF);
            var_s4_13 = var_s4_13 + func_0022257C((u8 *)*(void **)arg0 + 0x44, 0x22, 0);
            (*(s32 *)((s8 *)(arg0) + (0x40))) = (s32) (((*(s32 *)((s8 *)(arg0) + (0x40))) & ~0x10) | 4);
            if ((*(s32 *)((s8 *)(arg0) + (0x94))) < var_s4_13) {
                (*(s32 *)((s8 *)(arg0) + (0x94))) = var_s4_13;
            }
        } else {
            goto block_40;
        }
    } else {
block_40:
        if (func_0020C32C(arg0) == 0) {
            if (func_0020C2F4(arg0) != 0) {
                func_0021D25C(0x1D, var_s4_13, arg0, 0xFF, 0x20);
                var_a1_281 = 0x20;
                goto block_45;
            }
            if (func_0020C310(arg0) != 0) {
                func_0021D25C(0x1D, var_s4_13, arg0, 0xFF, 0x22);
                var_a1_281 = 0x22;
block_45:
                var_s4_13 += func_0022257C((u8 *)*(void **)arg0 + 0x44, var_a1_281, 0);
            }
        }
        if ((*(s32 *)((s8 *)(arg0) + (0x94))) < var_s4_13) {
            (*(s32 *)((s8 *)(arg0) + (0x94))) = var_s4_13;
        }
    }
}
