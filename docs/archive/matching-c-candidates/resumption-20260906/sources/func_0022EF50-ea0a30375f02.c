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
u8 func_00044130(u8, u8, s32);
s32 func_00044358(s32);
s8 func_0004440c(u8 *, u8, u8, s32, s32, s32, s32, s32, s32);
s32 func_000454e0(s32);
s32 func_0020144C(u8);
s32 func_0020C448(void *);
s32 func_0020C478(s32);
s32 func_0020D434(s32);
s32 func_00233F94(void *);
s32 func_00237750(void *, s32, M2C_UNK, M2C_UNK, s32);
void func_0022EF50(void *arg0) {
    u8 sp28;
    s32 temp_a0_118;
    s32 temp_a3_164;
    s32 temp_s2_70;
    s32 temp_s3_105;
    s32 temp_s4_87;
    s32 temp_s5_96;
    s32 temp_v0_107;
    s32 var_v1_131;
    s32 var_v1_144;
    s32 var_v1_30;
    s32 var_a0_27;
    s8 var_v0_205;
    u32 temp_v1_172;
    u8 temp_v0_21;
    u8 temp_v0_43;
    u8 var_v0_146;
    u8 var_v0_175;
    temp_v0_21 = func_00044130((*(u8 *)((s8 *)(arg0) + (0x4B))), (*(u8 *)((s8 *)(arg0) + (0x4F))), func_0020D434((*(s32 *)((s8 *)(arg0) + (0x58)))) & 0xFF);
    sp28 = temp_v0_21;
    var_a0_27 = func_00044358(temp_v0_21 & 0xFF);
    if ((*(s32 *)((s8 *)(arg0) + (0x4C))) == 0xA4) {
        temp_v0_43 = func_00044130((*(u8 *)((s8 *)(arg0) + (0x4B))), 0xA4U, (*(u8 *)0x801CE8F8 % 3) & 0xFF);
        sp28 = temp_v0_43;
        var_a0_27 = func_00044358(temp_v0_43 & 0xFF);
    }
    var_v1_30 = var_a0_27 - 3;
    if ((((u32) (var_v1_30 & 0xFF) < 2U) | ((var_a0_27 & 0xFF) == 5)) == 0) {
        goto unchanged;
    }
    temp_a3_164 = sp28;
    if ((u32) (temp_a3_164 - 0x31) < 2U) {
        (*(s8 *)((s8 *)(arg0) + (0x78))) = 3;
        temp_s2_70 = func_0020C478(func_00233F94(arg0));
        sp28 = 0x39;
        if (temp_s2_70 != 0) {
            (*(s32 *)((s8 *)(arg0) + (0x7C))) = 0x39;
            temp_s4_87 = func_00237750(arg0, temp_s2_70, 0, 0, 2);
            (*(s32 *)((s8 *)(arg0) + (0x7C))) = 0x41;
            temp_s5_96 = func_00237750(arg0, temp_s2_70, 0, 0, 2);
            (*(s32 *)((s8 *)(arg0) + (0x7C))) = 0x49;
            temp_s3_105 = func_00237750(arg0, temp_s2_70, 0, 0, 2);
            (*(s32 *)((s8 *)(arg0) + (0x7C))) = 0x51;
            temp_v0_107 = func_00237750(arg0, temp_s2_70, 0, 0, 2);
            (*(s32 *)((s8 *)(arg0) + (0x7C))) = 0x5D;
            temp_a0_118 = func_00237750(arg0, temp_s2_70, 0, 0, 2);
            if ((temp_s4_87 >= temp_s5_96) & (temp_s4_87 >= temp_s3_105)) {
                if ((temp_s4_87 >= temp_v0_107) & (temp_s4_87 >= temp_a0_118)) {
                    sp28 = 0x39;
                    goto selected;
                }
            }
            if ((temp_s5_96 >= temp_s3_105) & (temp_s5_96 >= temp_v0_107)) {
                if (temp_s5_96 >= temp_a0_118) {
                    var_v0_146 = 0x41;
                    goto chosen;
                }
            }
            if ((temp_s3_105 >= temp_v0_107) & (temp_s3_105 >= temp_a0_118)) {
                var_v0_146 = 0x49;
            } else if (temp_v0_107 >= temp_a0_118) {
                var_v0_146 = 0x51;
            } else {
                var_v0_146 = 0x5D;
            }
chosen:
            sp28 = var_v0_146;
        }
    } else {
        temp_a3_164 &= 0xFF;
        if (temp_a3_164 == 0x91) {
            temp_v1_172 = func_000454e0(func_0020C448(arg0) & 0xFFFF) & 0xFF;
            switch (temp_v1_172) {
            case 1:
                var_v0_175 = 0x93;
                break;
            case 2:
                var_v0_175 = 0x94;
                break;
            case 3:
                var_v0_175 = 0x95;
                break;
            case 4:
                var_v0_175 = 0x96;
                break;
            case 5:
                var_v0_175 = 0x97;
                break;
            case 6:
                var_v0_175 = 0x98;
                break;
            default:
            case 0:
                var_v0_175 = 0x92;
                break;
            }
            sp28 = var_v0_175;
            var_v0_205 = 4;
        } else {
            var_v0_205 = func_0004440c(&sp28, (*(u8 *)((s8 *)(arg0) + (0x4B))), (*(u8 *)((s8 *)(arg0) + (0x4F))), temp_a3_164, (s32) (*(u8 *)((s8 *)(arg0) + (0x33))), (s32) (*(u16 *)((s8 *)(arg0) + (0x36))), (s32) (*(u16 *)((s8 *)(arg0) + (0x38))), (s32) (*(u16 *)((s8 *)(arg0) + (0x3A))), (s32) (*(u16 *)((s8 *)(arg0) + (0x3C))));
        }
        (*(s8 *)((s8 *)(arg0) + (0x78))) = var_v0_205;
    }
selected:
    (*(s32 *)((s8 *)(arg0) + (0x7C))) = (s32) sp28;
    (*(s32 *)((s8 *)(arg0) + (0x80))) = (s32) (func_0020144C(*(volatile u8 *)&sp28) & 0xFF);
    return;
unchanged:
        (*(s8 *)((s8 *)(arg0) + (0x78))) = var_a0_27;
        var_v1_30 = sp28;
        (*(s32 *)((s8 *)(arg0) + (0x80))) = -1;
        (*(s32 *)((s8 *)(arg0) + (0x7C))) = var_v1_30;
    return;
}
