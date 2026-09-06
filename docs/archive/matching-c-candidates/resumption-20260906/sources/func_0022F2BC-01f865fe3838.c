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
s32 func_0020C120(void *);
s32 func_0020C2C0(void *);
s32 func_0020C32C(void *);
void *func_0020C478(s32);
s32 func_00214BDC(void *);
M2C_UNK func_0021D200(M2C_UNK, s32, void *);
s32 func_0022B1F4(void *, s32 *);
s32 func_0022BFF8(void *, s32 *);
s32 func_0022C78C(void *, s32 *);
s32 func_0022D14C(void *, s32 *);
s32 func_0022EC08(void *, s32 *);
s32 func_0022EDD4(void *, s32 *);
M2C_UNK func_0022EF50(void *);

s32 func_0022F2BC(void *arg0, s32 *arg1) {
    s32 temp_a0_126;
    s32 temp_a0_38;
    s32 temp_a0_80;
    s32 temp_v1_51;
    s32 scanResult;
    u32 loaded;
    s32 temp_v1_70;
    s32 var_s1_110;
    s32 var_v0_177;
    s32 var_v1_125;
    s32 var_v1_37;
    register u32 var_a1_136;
    register u32 var_a1_49;
    u8 temp_v1_170;
    void *temp_a1_69;
    void *temp_v0_112;
    void *temp_v1_24;

    if (arg0 != 0) {
        (*(s32 *)((s8 *)(arg0) + (0x8C))) = 0;
        (*(s32 *)((s8 *)(arg0) + (0x88))) = 0;
        (*(s32 *)((s8 *)(arg0) + (0x84))) = 0;
        if ((*(s32 *)((s8 *)(arg0) + (0x6C))) < (*(s32 *)((s8 *)(arg0) + (0x70)))) {
            temp_v1_24 = *(void **)0x801CE8C0;
            (*(u8 *)((s8 *)(temp_v1_24) + (0x818))) = (u8) ((*(u8 *)((s8 *)(temp_v1_24) + (0x818))) + 1);
            if ((func_0020C2C0(arg0) != 0) || (func_0020C32C(arg0) != 0)) {
                var_v1_37 = (*(s32 *)((s8 *)(arg0) + (0x94)));
                temp_a0_38 = *arg1;
                if (var_v1_37 < temp_a0_38) {
                    var_v1_37 = temp_a0_38;
                }
                loaded = *(u32 *)0x801CE8C0;
                (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_37;
                loaded = *(u32 *)(loaded + 0x828);
                var_a1_49 = loaded;
                goto block_20;
            }
            temp_v1_51 = (*(s32 *)((s8 *)(arg0) + (0x40)));
            if (temp_v1_51 & 8) {
                return func_0022EC08(arg0, arg1);
            }
            if (temp_v1_51 & 4) {
                return func_0022EDD4(arg0, arg1);
            }
            temp_a1_69 = *(void **)0x801CE8C0;
            temp_v1_70 = (*(s32 *)((s8 *)(arg0) + (0x6C)));
            if ((temp_v1_70 != (*(s32 *)((s8 *)(temp_a1_69) + (0)))) || ((*(s32 *)((s8 *)(arg0) + (0x70))) < temp_v1_70)) {
                var_v1_37 = (*(s32 *)((s8 *)(arg0) + (0x94)));
                temp_a0_80 = *arg1;
                if (var_v1_37 < temp_a0_80) {
                    var_v1_37 = temp_a0_80;
                }
                (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_37;
                var_a1_49 = (*(u32 *)((s8 *)(temp_a1_69) + (0x828)));
block_20:
                if (var_a1_49 < (u32) var_v1_37) {
                    var_a1_49 = (u32) var_v1_37;
                }
                (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_49;
                func_0021D200(0x1C, (s32) var_a1_49, arg0);
                (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
                *arg1 = (*(s32 *)((s8 *)(arg0) + (0x94)));
                return 0;
            }
            var_s1_110 = 0;
            if (func_00214BDC(arg0) != 0) {
                do {
                    temp_v0_112 = func_0020C478(var_s1_110);
                    scanResult = func_0020C2C0(temp_v0_112);
                    var_s1_110 += 1;
                    if (scanResult == 0) {
                        (*(s32 *)((s8 *)(temp_v0_112) + (0x6C))) = (s32) (*(s32 *)((s8 *)(temp_v0_112) + (0x70)));
                    }
                } while (var_s1_110 < 0x14);
                var_v1_125 = (*(s32 *)((s8 *)(arg0) + (0x94)));
                temp_a0_126 = *arg1;
                if (var_v1_125 < temp_a0_126) {
                    var_v1_125 = temp_a0_126;
                }
                loaded = *(u32 *)0x801CE8C0;
                (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_125;
                loaded = *(u32 *)(loaded + 0x828);
                var_a1_136 = loaded;
                if (var_a1_136 < (u32) var_v1_125) {
                    var_a1_136 = (u32) var_v1_125;
                }
                (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_136;
                func_0021D200(0x1C, (s32) var_a1_136, arg0);
                (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
                *arg1 = (*(s32 *)((s8 *)(arg0) + (0x94)));
                (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x6088))) = 1;
                return 1;
            }
            if ((*(s32 *)((s8 *)(arg0) + (0x4C))) == 0xA4) {
                *(u8 *)0x801CE8F8 = *(u8 *)0x801CE8F8 + 1;
            }
            func_0022EF50(arg0);
            temp_v1_170 = (*(u8 *)((s8 *)(arg0) + (0x78)));
            if (temp_v1_170 == 0) {
                if (func_0020C120(arg0) != 0) {
                    var_v0_177 = func_0022C78C(arg0, arg1);
                } else {
                    var_v0_177 = func_0022B1F4(arg0, arg1);
                }
            } else if (temp_v1_170 == 1) {
                var_v0_177 = func_0022BFF8(arg0, arg1);
            } else {
                var_v0_177 = func_0022D14C(arg0, arg1);
            }
            if (var_v0_177 == 0) {
                (*(s32 *)((s8 *)(arg0) + (0x68))) = -1;
                goto block_49;
            }

            return var_v0_177;
        }
    }
block_49:
    var_v0_177 = 0;
    return var_v0_177;
}
