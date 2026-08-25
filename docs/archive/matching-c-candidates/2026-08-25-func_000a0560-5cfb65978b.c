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
s32 func_00043ad8();
M2C_UNK func_0004ef34();
M2C_UNK func_00087200();
M2C_UNK func_00087b30();
M2C_UNK func_000885a8();
M2C_UNK func_00088b10();
M2C_UNK func_0008b234();
M2C_UNK func_0008d66c();
M2C_UNK func_0008ecd0();
M2C_UNK func_0008f0d8();

void func_000a0560(s32 arg0, u8 *arg1, s32 arg2) {
    s16 temp_a3_30;
    s32 temp_a3_497;
    s32 temp_s0_207;
    s32 temp_s0_444;
    s32 temp_s0_542;
    s32 temp_s1_438;
    s32 temp_s3_31;
    s32 temp_s5_32;
    s32 temp_v1_356;
    s32 var_a0_127;
    s32 var_a1_128;
    s32 var_a2_130;
    s32 var_v0_156;
    s32 var_v0_189;
    s32 var_v0_333;
    s32 var_v1_64;
    u16 temp_v1_144;
    u16 var_a0_106;
    u16 var_a1_102;
    u16 var_t1_105;
    u32 var_v1_108;
    u8 temp_a0_373;
    u8 temp_s2_422;
    u8 var_a0_151;
    u8 var_a0_330;
    u8 var_s2_146;
    u8 var_t0_104;
    u8 var_v1_154;
    u8 *temp_a0_139;
    u8 *temp_a1_37;
    u8 *temp_a3_327;
    u8 *temp_a3_348;
    u8 *temp_a3_82;
    u8 *temp_s4_355;
    u8 *temp_v0_202;
    u8 *temp_v0_292;
    u8 *temp_v0_318;
    u8 *temp_v0_418;
    u8 *temp_v0_441;
    u8 *temp_v0_528;
    u8 *temp_v1_290;
    u8 *temp_v1_80;

    temp_a3_30 = (*(s16 *)((s8 *)(((((s32) arg2 & 0xFF) * 2) + arg1)) + (0xE0)));
    temp_s3_31 = (*(s32 *)((s8 *)(arg1) + (0xC)));
    temp_s5_32 = (*(s32 *)((s8 *)(arg1) + (0x10)));
    if (temp_a3_30 == 0) {
        goto block_44;
    }
    temp_a1_37 = *(u8 **)0x800E9BA0;
    *(u8 **)0x800E9BA0 = (void *) (temp_a1_37 + 8);
    (*(s32 *)((s8 *)(temp_a1_37) + (0))) = 0xFA000000;
    (*(s32 *)((s8 *)(temp_a1_37) + (4))) = (s32) (temp_a3_30 | ~0xFF);
    *(u8 **)0x800E9BA0 = (void *) (temp_a1_37 + 0x10);
    *(u8 **)0x800E9BA0 = (void *) (temp_a1_37 + 0x18);
    (*(s32 *)((s8 *)(temp_a1_37) + (8))) = 0xE3000C00;
    (*(s32 *)((s8 *)(temp_a1_37) + (0xC))) = 0;
    (*(s32 *)((s8 *)(temp_a1_37) + (0x10))) = 0xE3001201;
    (*(s32 *)((s8 *)(temp_a1_37) + (0x14))) = 0;
    if (temp_a3_30 != 0xFF) {
        goto block_3;
    }
    var_v1_64 = 0x0F0A7008;
    goto block_4;
block_3:
    var_v1_64 = 0x504240;
block_4:
    *(u8 **)0x800E9BA0 = (void *) (temp_a1_37 + 0x20);
    (*(s32 *)((s8 *)(temp_a1_37) + (0x18))) = 0xE200001C;
    (*(s32 *)((s8 *)(temp_a1_37) + (0x1C))) = var_v1_64;
    temp_v1_80 = *(u8 **)0x800E9BA0;
    temp_a3_82 = *(u8 **)0x80196AF8;
    (*(s32 *)((s8 *)(temp_v1_80) + (0))) = 0xFC119623;
    (*(s32 *)((s8 *)(temp_v1_80) + (4))) = 0xFF2FFFFF;
    *(u8 **)0x800E9BA0 = (void *) (temp_v1_80 + 8);
    if ((*(u16 *)((s8 *)(arg1) + (0xEE))) == 1) {
        goto block_6;
    }
    if (!(((u16) (*(u16 *)((s8 *)(arg1) + (0xE8))) >> 1) & 1 & ((s32) arg2 & 0xFF))) {
        goto block_7;
    }
block_6:
    var_a1_102 = (*(u16 *)((s8 *)(temp_a3_82) + (0x13C)));
    var_t0_104 = (u8) (*(u16 *)((s8 *)(temp_a3_82) + (0x140)));
    var_t1_105 = (*(u16 *)((s8 *)(temp_a3_82) + (0x1A2)));
    var_a0_106 = (*(u16 *)((s8 *)(temp_a3_82) + (0x1A0)));
    var_v1_108 = (*(u16 *)((s8 *)(temp_a3_82) + (0x13E))) & 0xFFFF;
    goto block_8;
block_7:
    var_a1_102 = (*(u16 *)((s8 *)(temp_a3_82) + (0x13A)));
    var_t0_104 = (*(u8 *)((s8 *)(temp_a3_82) + (0x14D)));
    var_t1_105 = (*(u16 *)((s8 *)(temp_a3_82) + (0x19A)));
    var_a0_106 = (*(u16 *)((s8 *)(temp_a3_82) + (0x198)));
    var_v1_108 = (*(u16 *)((s8 *)(temp_a3_82) + (0x182))) & 0xFFFF;
block_8:
    if (var_v1_108 >= 7U) {
        goto block_44;
    }
    switch (var_v1_108) {                                                           
case 0:
    var_a0_127 = 0x801EEE74;
    var_a1_128 = temp_s3_31 + 4;
    var_a2_130 = temp_s5_32 + 4;
    goto block_43;
case 1:
    var_a0_127 = 0x801EEEC0;
    var_a1_128 = temp_s3_31 + 4;
    var_a2_130 = temp_s5_32 + 4;
    goto block_43;
case 6:
    temp_a0_139 = *(u8 **)0x80196AF8;
    if (!((*(u16 *)((s8 *)(temp_a0_139) + (0xA4))) & 4)) {
        goto block_19;
    }
    temp_v1_144 = (*(u16 *)((s8 *)(temp_a3_82) + (0x134)));
    var_s2_146 = 0xFF;
    if (temp_v1_144 == 3) {
        goto block_16;
    }
    if (temp_v1_144 == 4) {
        goto block_17;
    }
    var_a0_151 = 0xFF & 0xFF;
    goto block_21;
block_16:
    var_v1_154 = (*(u8 *)((s8 *)((temp_a0_139 + var_a1_102)) + (0x1A92)));
    var_v0_156 = var_v1_154 * 8;
    goto block_18;
block_17:
    var_v1_154 = *(u8 *)(temp_a0_139 + (*(u8 *)(temp_a0_139 + var_a1_102 + 0x1AB0) * 0xE) + *(u16 *)(temp_a0_139 + 0x198) + 0x10D6);
    var_v0_156 = var_v1_154 * 8;
    if (var_v1_154 >= 0x80U) {
        goto block_20;
    }
block_18:
    var_a0_151 = *(u8 *)(temp_a0_139 + ((((var_v0_156 - var_v1_154) * 4) - var_v1_154) * 2) + *(u16 *)(temp_a0_139 + 0x19A) + 0x1180);
    goto block_21;
case 2:
block_19:
    var_s2_146 = (*(u8 *)((s8 *)((*(u8 **)0x80196AF8 + var_a1_102)) + (0x1A2E)));
block_20:
    var_a0_151 = var_s2_146 & 0xFF;
block_21:
    var_v0_189 = (s32) arg2 & 0xFF;
    if (var_a0_151 != 0) {
        goto block_37;
    }
    func_0004ef34(*(s32 *)0x801EE4EC, temp_s3_31 + 0x36, temp_s5_32 + 0x13, temp_a3_82);
    temp_v0_202 = *(u8 **)0x800E9BA0;
    temp_s0_207 = temp_s5_32 + 4;
    (*(s32 *)((s8 *)(temp_v0_202) + (0))) = 0xDE000000;
    (*(s32 *)((s8 *)(temp_v0_202) + (4))) = 0x060047A0;
    (*(s32 *)((s8 *)(temp_v0_202) + (8))) = 0xFD500000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x10))) = 0xF5500000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x14))) = 0x07000000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x18))) = 0xE6000000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x20))) = 0xF3000000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x1C))) = 0;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x24))) = 0x073FF200;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x28))) = 0xE7000000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x2C))) = 0;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x30))) = 0xF5400800;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x34))) = 0;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x38))) = 0xF2000000;
    (*(s32 *)((s8 *)(temp_v0_202) + (0x3C))) = 0xFC0FC;
    (*(s32 *)((s8 *)(temp_v0_202) + (0xC))) = (s32) ((*(s32 *)((s8 *)(*(u8 **)0x80196AF8) + (4))) + 0x948);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 8);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x10);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x18);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x20);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x28);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x30);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x38);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_202 + 0x40);
    func_000885a8(temp_s3_31 + 8, temp_s0_207, *(u8 *)0x80190F81, 3);
    func_00087200(temp_s3_31 + 0x20, temp_s0_207, 7);
    func_000885a8(temp_s3_31 + 0x2A, temp_s0_207, *(u8 *)0x80190F80, 3);
    func_000885a8(temp_s3_31 + 0xB2, temp_s0_207, 1U, 1);
    func_0008d66c(func_00043ad8(1, 1) & 0xFF, temp_s3_31 + 0xED, temp_s5_32 + 0x14);
    temp_v1_290 = *(u8 **)0x800E9BA0;
    temp_v0_292 = *(u8 **)0x80196AF8;
    (*(s32 *)((s8 *)(temp_v1_290) + (0))) = 0xE7000000;
    (*(s32 *)((s8 *)(temp_v1_290) + (4))) = 0;
    (*(s32 *)((s8 *)(temp_v1_290) + (8))) = 0xD7000002;
    (*(s32 *)((s8 *)(temp_v1_290) + (0xC))) = 0x80008000;
    *(u8 **)0x800E9BA0 = (void *) (temp_v1_290 + 8);
    *(u8 **)0x800E9BA0 = (void *) (temp_v1_290 + 0x10);
    func_00087b30((*(s32 *)((s8 *)(temp_v0_292) + (8))) + 0x2E0, (*(s32 *)((s8 *)(temp_v0_292) + (4))) + 0x27A8, 0x10, 8, 2);
    func_00087200(temp_s3_31 + 0xA8, temp_s5_32 + 3, 0x4D);
    temp_v0_318 = *(u8 **)0x800E9BA0;
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_318 + 8);
    (*(s32 *)((s8 *)(temp_v0_318) + (0))) = 0xE7000000;
    (*(s32 *)((s8 *)(temp_v0_318) + (4))) = 0;
    return;
case 3:
    temp_a3_327 = *(u8 **)0x80196AF8;
    var_a0_330 = (*(u8 *)((s8 *)((temp_a3_327 + var_a1_102)) + (0x1A92)));
    var_v0_333 = (s32) arg2 & 0xFF;
    if ((var_t0_104 & 0xFFFF) != 1) {
        goto block_39;
    }
    if ((s32) var_t1_105 >= 0x80) {
        goto block_44;
    }
    var_a0_151 = (*(u8 *)((s8 *)((temp_a3_327 + (var_a0_330 * 0x36) + var_t1_105)) + (0x1180)));
    var_v0_189 = (s32) arg2 & 0xFF;
    goto block_37;
case 4:
    temp_a3_348 = *(u8 **)0x80196AF8;
    temp_s4_355 = temp_a3_348 + (((*(u8 *)((s8 *)((temp_a3_348 + var_a1_102)) + (0x1AB0))) * 0xE) + 0x10D4);
    temp_v1_356 = var_t0_104 & 0xFFFF;
    if (temp_v1_356 == 1) {
        goto block_34;
    }
    if (temp_v1_356 < 2) {
        goto block_29;
    }
    goto block_32;
block_29:
    if (temp_v1_356 == 0) {
        goto block_40;
    }
    return;
block_32:
    if (temp_v1_356 == 2) {
        goto block_38;
    }
    return;
block_34:
    temp_a0_373 = (*(u8 *)((s8 *)((temp_s4_355 + var_a0_106)) + (2)));
    if (temp_a0_373 == 0xFF) {
        goto block_36;
    }
    var_a0_151 = (*(u8 *)((s8 *)((temp_a3_348 + (temp_a0_373 * 0x36) + var_t1_105)) + (0x1180)));
    var_v0_189 = (s32) arg2 & 0xFF;
    goto block_37;
block_36:
    var_a0_151 = 0xFF;
    var_v0_189 = (s32) arg2 & 0xFF;
block_37:
    func_0008f0d8(var_a0_151, temp_s3_31, temp_s5_32, (*(s16 *)((s8 *)(((var_v0_189 * 2) + arg1)) + (0xE0))));
    return;
block_38:
    var_a0_330 = (*(u8 *)((s8 *)((temp_s4_355 + var_a0_106)) + (2)));
    var_v0_333 = (s32) arg2 & 0xFF;
block_39:
    func_0008ecd0(var_a0_330, temp_s3_31, temp_s5_32, (*(s16 *)((s8 *)(((var_v0_333 * 2) + arg1)) + (0xE0))));
    return;
block_40:
    temp_v0_418 = temp_a3_348 + ((*(u8 *)((s8 *)(temp_s4_355) + (2))) * 0x36);
    temp_s2_422 = *(u8 *)(temp_v0_418 + *(u8 *)(temp_v0_418 + 0x117F) + 0x1180);
    if (!((*(u8 *)((s8 *)(temp_s4_355) + (1))) & 0x10)) {
        goto block_42;
    }
    func_0008b234(temp_s3_31 + 0x38, temp_s5_32 + 0xC, (*(s16 *)((s8 *)(((((s32) arg2 & 0xFF) * 2) + arg1)) + (0xE0))), temp_a3_348);
block_42:
    temp_s1_438 = temp_s3_31 + 4;
    temp_v0_441 = *(u8 **)0x800E9BA0;
    temp_s0_444 = temp_s5_32 + 4;
    (*(s32 *)((s8 *)(temp_v0_441) + (0))) = 0xDE000000;
    (*(s32 *)((s8 *)(temp_v0_441) + (4))) = 0x060047A0;
    (*(s32 *)((s8 *)(temp_v0_441) + (8))) = 0xFD500000;
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 8);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x10);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x18);
    (*(s32 *)((s8 *)(temp_v0_441) + (0x10))) = 0xF5500000;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x14))) = 0x07000000;
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x20);
    (*(s32 *)((s8 *)(temp_v0_441) + (0x18))) = 0xE6000000;
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x28);
    (*(s32 *)((s8 *)(temp_v0_441) + (0x20))) = 0xF3000000;
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x30);
    (*(s32 *)((s8 *)(temp_v0_441) + (0x28))) = 0xE7000000;
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x38);
    *(u8 **)0x800E9BA0 = (void *) (temp_v0_441 + 0x40);
    (*(s32 *)((s8 *)(temp_v0_441) + (0x1C))) = 0;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x24))) = 0x073FF200;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x2C))) = 0;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x30))) = 0xF5400800;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x34))) = 0;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x38))) = 0xF2000000;
    (*(s32 *)((s8 *)(temp_v0_441) + (0x3C))) = 0xFC0FC;
    temp_a3_497 = (*(s32 *)((s8 *)(*(u8 **)0x80196AF8) + (4))) + 0x948;
    (*(s32 *)((s8 *)(temp_v0_441) + (0xC))) = temp_a3_497;
    func_00087200(temp_s1_438, temp_s0_444, 8, temp_a3_497);
    func_00087200(temp_s3_31 + 0x22, temp_s0_444, 0);
    func_000885a8(temp_s3_31 + 0x34, temp_s0_444, (*(u8 *)((s8 *)(temp_s4_355) + (0))) & 0x7F, 1);
    func_00087200(temp_s3_31 + 0x5A, temp_s5_32 + 3, 6);
    func_00088b10(temp_s3_31 + 0x7C, temp_s0_444, (*(u8 *)((s8 *)(temp_s4_355) + (0xB))), 2);
    func_00087200(temp_s3_31 + 6, temp_s5_32 + 0x12, 5);
    func_0008d66c((*(u8 *)((s8 *)(temp_s4_355) + (0xA))), temp_s3_31 + 0x6F, temp_s5_32 + 0x1E);
    temp_v0_528 = *(u8 **)0x80196AF8;
    func_00087b30((*(s32 *)((s8 *)(temp_v0_528) + (8))) + 0x360, (*(s32 *)((s8 *)(temp_v0_528) + (4))) + (((*(u8 *)((s8 *)(temp_s4_355) + (7))) << 7) + 0x11C8), 0x10, 0x10, 2);
    temp_s0_542 = temp_s5_32 + 0x1C;
    func_00087200(temp_s1_438, temp_s0_542, 0x21);
    func_0004ef34((temp_s2_422 * 0x38) + 0x80193BC0, temp_s3_31 + 0x2C, temp_s5_32 + 0xD);
    var_a0_127 = *(s32 *)((*(u8 *)(temp_s4_355 + 7) * 4) + 0x801EE4C4);
    var_a1_128 = temp_s3_31 + 0x16;
    var_a2_130 = temp_s0_542;
block_43:
    func_0004ef34(var_a0_127, var_a1_128, var_a2_130);
block_44:
    return;
    }
}
