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
s32 func_0020C104(void *);
s32 func_0020C32C(void *);
s32 func_0020D444(s32, s32);
M2C_UNK func_0021D230(M2C_UNK, s32, void *, s32);
M2C_UNK func_0021D2C0(M2C_UNK, s32, void *, M2C_UNK, s32, s32, s32);
s32 func_0022257C(void *, s32, s32 *);
M2C_UNK func_0022A280(void *, s32, u8);
M2C_UNK func_0022A414(void *);
M2C_UNK func_0022A964(void *, s32, s32, s32, s32);

void func_0022ADFC(void *arg0, s32 arg1, s32 arg2, s32 arg3, s32 arg4, u8 arg5, s32 arg6, s32 arg7) {
    M2C_UNK var_a0_40;
    s32 temp_s1_103;
    s32 temp_s4_89;
    s32 temp_v0_88;
    s32 temp_v1_131;
    s32 bit;
    s32 var_s3_36;
    u16 temp_a0_79;
    u16 temp_v1_147;
    u32 var_a0_117;
    void *var_v1_118;

    if (func_0020C32C(arg0) == 0) {
        var_s3_36 = func_0022257C((u8 *)*(void **)arg0 + 0x44, ((0 - (arg6 == 0)) & 0x19) | 0x11, 0) + arg1;
        if (arg6 != 0) {
            if (arg7 == 0) {
                var_a0_40 = 0xC;
                goto block_8;
            }
            goto block_6;
        }
        var_a0_40 = 0x10;
        goto block_8;
    }
    var_s3_36 = 6;
    if (arg7 != 0) {
block_6:
        func_0021D2C0(0x32, arg2, arg0, 0xFF, arg3 >> 8, arg3 & 0xFF, arg4);
        func_0022A414(arg0);
    } else {
        var_a0_40 = 0xC;
block_8:
        func_0021D2C0(var_a0_40, arg2, arg0, 0xFF, arg3 >> 8, arg3 & 0xFF, arg4);
    }
    if (func_0020C104(arg0) != 0) {
        temp_a0_79 = (*(u16 *)((s8 *)(arg0) + (0x20)));
        if (arg3 >= (s32) temp_a0_79) {
            goto block_26;
        }
        temp_s4_89 = func_0020D444(temp_a0_79 - arg3, (*(u16 *)((s8 *)(arg0) + (0x22))));
        temp_v0_88 = func_0020D444((*(u16 *)((s8 *)(arg0) + (0x20))), (*(u16 *)((s8 *)(arg0) + (0x22))));
        (*(u16 *)((s8 *)(arg0) + (0x20))) = (u16) ((*(u16 *)((s8 *)(arg0) + (0x20))) - arg3);
        if (temp_v0_88 != temp_s4_89) {
            temp_s1_103 = ((1 << temp_v0_88) - 1) ^ ((1 << temp_s4_89) - 1);
            func_0021D230(0x13, arg2 + var_s3_36, arg0, temp_s1_103);
            var_s3_36 += func_0022257C((u8 *)*(void **)arg0 + 0x44, 0x1D, 0);
            func_0021D230(0x15, arg2 + var_s3_36, arg0, temp_s1_103);
            var_a0_117 = 0;
            var_v1_118 = arg0;
            do {
                bit = (temp_s1_103 >> var_a0_117) & 1;
                var_a0_117 += 1;
                if (bit) {
                    (*(s32 *)((s8 *)(var_v1_118) + (0))) = 0;
                    (*(s32 *)((s8 *)(var_v1_118) + (0xC))) = 0;
                }
                var_v1_118 += 4;
            } while (var_a0_117 < 3U);
            temp_v1_131 = arg2 + var_s3_36;
            if ((*(s32 *)((s8 *)(arg0) + (0x94))) < temp_v1_131) {
                (*(s32 *)((s8 *)(arg0) + (0x94))) = temp_v1_131;
            }
        }
        if (temp_s4_89 != 0) {
            func_0022A964(arg0, arg2 + var_s3_36, arg6, arg4 & 0xFF, (s32) arg5);
        }
    } else {
        temp_v1_147 = (*(u16 *)((s8 *)(arg0) + (0x20)));
        if (arg3 < (s32) temp_v1_147) {
            (*(u16 *)((s8 *)(arg0) + (0x20))) = (u16) (temp_v1_147 - arg3);
            func_0022A964(arg0, arg2 + var_s3_36, arg6, arg4 & 0xFF, (s32) arg5);
            return;
        }
block_26:
        func_0022A280(arg0, arg2 + var_s3_36, arg5);
    }
}
