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
M2C_UNK func_0020019C();
M2C_UNK func_0020BD5C(M2C_UNK, u8);
s32 func_0020BFE4();
s32 func_0020C32C(s32);
s32 func_0020C788();
s32 func_0020C810();
M2C_UNK func_002159D0(void *);
M2C_UNK func_0021C3B0();
M2C_UNK func_801EFAAC();
M2C_UNK memcpy(void *, void *, M2C_UNK);
void *resource_alloc(M2C_UNK, M2C_UNK, s32);
M2C_UNK resource_free(void *);

void func_00217BA8(void) {
    s32 temp_s2_120;
    s32 temp_v0_41;
    s32 temp_v0_55;
    s32 temp_v1_71;
    s32 var_a2_84;
    u16 temp_v0_107;
    u16 temp_v0_94;
    u8 temp_a1_185;
    u8 temp_s1_138;
    u8 temp_v0_223;
    u8 temp_v0_251;
    void *temp_a0_178;
    void *temp_a0_88;
    void *temp_a1_131;
    void *temp_s0_128;
    void *temp_v1_211;
    void *temp_v1_248;
    void *temp_v1_50;
    void *temp_v1_64;
    void *temp_v1_8;
    void *var_a0_222;

    temp_v1_8 = *(void **)0x801CE8BC;
    if ((*(s32 *)((s8 *)(temp_v1_8) + (0x6048))) == 0) {
        *(u16 *)0x801D0758 = 0x143;
        *(s16 *)0x801D075A = 0x10;
        *(u16 *)0x801D075C = -0x83U;
        *(s16 *)0x801D075E = 0x98;
        *(s16 *)0x801D0760 = 0;
        *(u8 *)0x801CEAAB = 0;
        *(s8 *)0x801CEAAE = 0;
        *(s8 *)0x801CEAAD = 0;
        *(s8 *)0x801CEAAC = 0;
        (*(u8 *)((s8 *)(temp_v1_8) + (0x6089))) = 0U;
        (*(u8 *)((s8 *)(*(void **)0x801CE8BC) + (0x608A))) = 0U;
        temp_v0_41 = func_0020C810();
        if ((temp_v0_41 != 0) && (func_0020C32C(temp_v0_41) != 0)) {
            temp_v1_50 = *(void **)0x801CE8BC;
            (*(u8 *)((s8 *)(temp_v1_50) + (0x6089))) = (u8) ((*(u8 *)((s8 *)(temp_v1_50) + (0x6089))) | 4);
        }
        temp_v0_55 = func_0020C788();
        if ((temp_v0_55 != 0) && (func_0020C32C(temp_v0_55) != 0)) {
            temp_v1_64 = *(void **)0x801CE8BC;
            (*(u8 *)((s8 *)(temp_v1_64) + (0x608A))) = (u8) ((*(u8 *)((s8 *)(temp_v1_64) + (0x608A))) | 4);
        }
    }
    temp_v1_71 = (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x6048)));
    if (temp_v1_71 < 0x10) {
        *(void **)0x801CEAAB = (u8) (temp_v1_71 * 0xC);
        goto block_23;
    }
    var_a2_84 = 0x1E;
    if (func_0020BFE4() != 0) {
        var_a2_84 = 0x3C;
    }
    temp_a0_88 = *(void **)0x801CE8BC;
    temp_v0_94 = (*(void **)0x801D0758 + 0xE) - (*(s32 *)((s8 *)(temp_a0_88) + (0x6048)));
    *(void **)0x801D0758 = temp_v0_94;
    if ((s16) temp_v0_94 < 0xAA) {
        *(void **)0x801D0758 = 0xAAU;
    }
    temp_v0_107 = *(void **)0x801D075C - 0xE + (*(s32 *)((s8 *)(temp_a0_88) + (0x6048)));
    *(void **)0x801D075C = temp_v0_107;
    if ((s16) temp_v0_107 >= 0x17) {
        *(void **)0x801D075C = 0x16U;
    }
    temp_s2_120 = var_a2_84 + 0x10;
    (*(s32 *)((s8 *)(temp_a0_88) + (0x604C))) = (s32) ((*(s32 *)((s8 *)(temp_a0_88) + (0x604C))) | 1);
    if ((*(s32 *)((s8 *)(temp_a0_88) + (0x6048))) == temp_s2_120) {
        temp_s0_128 = resource_alloc(0x6094, 0x801D0758, var_a2_84);
        temp_a1_131 = temp_s0_128;
        (*(s32 *)((s8 *)(*(void **)0x801CE8C0) + (0x814))) = 0;
        memcpy(*(void **)0x801CE8BC, temp_a1_131, 0x6094);
        temp_s1_138 = (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x82E)));
        func_801EFAAC();
        (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x82E))) = temp_s1_138;
        memcpy(temp_s0_128 + 0x1C4, *(void **)0x801CE8BC + 0x1C4, 0x1360);
        memcpy(temp_s0_128 + 0x1524, *(void **)0x801CE8BC + 0x1524, 0x3C00);
        memcpy(temp_s0_128 + 0x5124, *(void **)0x801CE8BC + 0x5124, 0x19C);
        memcpy(temp_s0_128 + 0x52C0, *(void **)0x801CE8BC + 0x52C0, 0x400);
        (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x56C0))) = (s32) (*(s32 *)((s8 *)(temp_s0_128) + (0x56C0)));
        resource_free(temp_s0_128);
        func_0021C3B0();
        func_0020019C();
    }
    temp_a0_178 = *(void **)0x801CE8BC;
    if (temp_s2_120 < (*(s32 *)((s8 *)(temp_a0_178) + (0x6048)))) {
        temp_a1_185 = *(void **)0x801CEAAB;
        (*(s32 *)((s8 *)(temp_a0_178) + (0x604C))) = (s32) ((*(s32 *)((s8 *)(temp_a0_178) + (0x604C))) & ~1);
        *(void **)0x801D0760 = 1;
        if (temp_a1_185 < 5U) {
            *(void **)0x801CEAAB = 0U;
        } else {
            *(void **)0x801CEAAB = (u8) (temp_a1_185 - 5);
        }
        if (*(void **)0x801CEAAB == 0) {
            func_0020BD5C(1, temp_a1_185);
            return;
        }
        goto block_23;
    }
block_23:
    temp_v1_211 = *(void **)0x801CE8BC;
    if ((*(s32 *)((s8 *)(temp_v1_211) + (0x6048))) >= 0x10) {
        if (*(u16 *)0x800E8100 & 0x8010) {
            var_a0_222 = temp_v1_211 + (*(u8 *)((s8 *)(temp_v1_211) + (0x6072)));
            temp_v0_223 = (*(u8 *)((s8 *)(var_a0_222) + (0x606E)));
            if (((temp_v0_223 != 2) & (temp_v0_223 != 9)) && ((u8) *(u8 *)0x801976DC < 0x1EU)) {
                (*(u8 *)((s8 *)(var_a0_222) + (0x606E))) = 1U;
                (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x608B))) = 0;
                goto block_31;
            }
        }
        if (*(u16 *)0x800E8100 & 0x2020) {
            temp_v1_248 = *(void **)0x801CE8BC;
            var_a0_222 = temp_v1_248 + (*(u8 *)((s8 *)(temp_v1_248) + (0x6072)));
            temp_v0_251 = (*(u8 *)((s8 *)(var_a0_222) + (0x606E)));
            if ((temp_v0_251 != 2) & (temp_v0_251 != 9)) {
                (*(u8 *)((s8 *)(var_a0_222) + (0x606E))) = 1U;
                (*(s8 *)((s8 *)(*(void **)0x801CE8BC) + (0x608B))) = 1;
block_31:
                func_002159D0(var_a0_222);
            }
        }
    }
    (*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x6048))) = (s32) ((*(s32 *)((s8 *)(*(void **)0x801CE8BC) + (0x6048))) + 1);
}
