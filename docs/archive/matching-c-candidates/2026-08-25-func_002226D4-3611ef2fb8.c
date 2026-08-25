typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef s32 M2C_UNK;

extern s32 func_00093540();
extern void *func_001C8FE8();
extern s32 func_001D8E70();
extern u32 func_001D96A0();
extern s32 func_001D9860();
extern s32 func_001E0244();
extern s32 func_001E05A4();
extern s32 func_001E063C();
extern s32 func_001E06A8();
extern s32 func_001E0708();
extern s32 func_001E0768();
extern s32 func_001E1014();
extern s32 func_001E104C();
extern s32 func_001E107C();
extern s32 func_001E11D8();
extern s32 func_001E145C();

void func_002226D4(s16 arg0, M2C_UNK arg1) {
    s32 sp18[14];
    u8 *var_a2_334;
    u8 *var_a3_140;
    s32 temp_a1_340;
    s32 temp_t0_191;
    u32 temp_v0_416;
    u32 var_a0_369;
    u32 var_a0_397;
    u32 var_a0_56;
    u32 var_s0_376;
    u32 var_s0_62;
    u8 temp_a0_189;
    u8 temp_v0_385;
    u8 temp_v1_71;
    void *temp_a0_105;
    void *temp_a1_115;
    void *temp_a1_31;
    void *temp_a1_50;
    void *temp_a1_68;
    void *temp_a2_70;
    void *temp_v0_108;
    void *temp_v0_124;
    void *temp_v0_87;
    void *temp_v1_160;
    void *temp_v1_173;
    void *temp_v1_358;
    void *temp_v1_382;
    void *var_a1_363;
    void *var_a2_141;
    void *var_a3_333;
    void *var_v0_372;
    void *var_v0_58;

    temp_a1_31 = *(void **)0x801CE8C0;
    if (temp_a1_31 == (void *)0) {
        goto block_59;
    }
    if (arg0 != 0xFF) {
        goto block_21;
    }
    if ((*(u8 *)((u8 *)(temp_a1_31) + (0x820))) != 0x79) {
        goto block_21;
    }
    func_001D9860((*(s32 *)((u8 *)(temp_a1_31) + (8))), temp_a1_31, arg0);
    temp_a1_50 = *(void **)0x801CE8C0;
    if ((*(u8 *)((u8 *)(temp_a1_50) + (0x824))) != 0) {
        goto block_59;
    }
    var_a0_56 = 0;
    if ((*(u32 *)((u8 *)(temp_a1_50) + (0x814))) == 0) {
        goto block_59;
    }
    var_v0_58 = temp_a1_50;
loop_6:
    var_s0_62 = var_a0_56;
    if ((*(u8 *)((u8 *)(var_v0_58) + (0x10))) != 0x1E) {
        goto block_19;
    }
loop_8:
    temp_a1_68 = *(void **)0x801CE8C0;
    var_a0_56 = func_001D96A0(var_a0_56, *(void **)0x801CE8C0);
    temp_a2_70 = temp_a1_68 + var_a0_56;
    temp_v1_71 = (*(u8 *)((u8 *)(temp_a2_70) + (0x10)));
    if (temp_v1_71 == 0x1E) {
        goto loop_8;
    }
    if (temp_v1_71 != 0x20) {
        goto block_19;
    }
    if ((*(u8 *)((u8 *)(temp_a2_70) + (0x13))) != (*(u8 *)((u8 *)(temp_a1_68) + (0x823)))) {
        goto block_19;
    }
    if ((*(u8 *)((u8 *)((temp_a1_68 + var_s0_62)) + (0x10))) != 0x1E) {
        goto block_17;
    }
loop_13:
    temp_v0_87 = *(void **)0x801CE8C0 + var_s0_62;
    if (var_s0_62 != (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (0x810)))) {
        goto block_15;
    }
    (*(s8 *)((u8 *)(temp_v0_87) + (0x12))) = (s8) (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (4)));
    goto block_16;
block_15:
    (*(s8 *)((u8 *)(temp_v0_87) + (0x12))) = 0;
block_16:
    var_s0_62 = func_001D96A0(var_s0_62, *(void **)0x801CE8C0);
    if ((*(u8 *)((u8 *)((*(void **)0x801CE8C0 + var_s0_62)) + (0x10))) == 0x1E) {
        goto loop_13;
    }
block_17:
    temp_a0_105 = *(void **)0x801CE8C0;
    temp_v0_108 = temp_a0_105 + var_s0_62;
    if (var_s0_62 == (*(s32 *)((u8 *)(temp_a0_105) + (0x810)))) {
        goto block_42;
    }
    (*(s8 *)((u8 *)(temp_v0_108) + (0x12))) = 0;
    return;
block_19:
    temp_a1_115 = *(void **)0x801CE8C0;
    var_a0_56 = func_001D96A0(var_a0_56, *(void **)0x801CE8C0);
    var_v0_58 = temp_a1_115 + var_a0_56;
    if (var_a0_56 < (u32) (*(u32 *)((u8 *)(temp_a1_115) + (0x814)))) {
        goto loop_6;
    }
    return;
block_21:
    temp_v0_124 = func_001C8FE8(arg0, temp_a1_31, arg0);
    if (temp_v0_124 != (void *)0) {
        goto block_24;
    }
    func_00093540(0x801E6F00);
loop_23:
    if (0 != 1) {
        goto loop_23;
    }
block_24:
    var_a3_140 = (u8 *) sp18;
    if ((*(u8 *)((u8 *)(temp_v0_124) + (0xD0))) == 0) {
        goto block_59;
    }
    var_a2_141 = temp_v0_124 + 0x20;
loop_26:
    (*(s32 *)((u8 *)(var_a3_140) + (0))) = (s32) (*(s32 *)((u8 *)(var_a2_141) + (0)));
    (*(s32 *)((u8 *)(var_a3_140) + (4))) = (s32) (*(s32 *)((u8 *)(var_a2_141) + (4)));
    (*(s32 *)((u8 *)(var_a3_140) + (8))) = (s32) (*(s32 *)((u8 *)(var_a2_141) + (8)));
    (*(s32 *)((u8 *)(var_a3_140) + (0xC))) = (s32) (*(s32 *)((u8 *)(var_a2_141) + (0xC)));
    var_a2_141 += 0x10;
    var_a3_140 += 0x10;
    if (var_a2_141 != (temp_v0_124 + 0x40)) {
        goto loop_26;
    }
    (*(s32 *)((u8 *)(var_a3_140) + (0))) = (s32) (*(s32 *)((u8 *)(var_a2_141) + (0)));
    (*(s32 *)((u8 *)(var_a3_140) + (4))) = (s32) (*(s32 *)((u8 *)(var_a2_141) + (4)));
    temp_v1_160 = *(void **)0x801CE8C0;
    (*(u8 *)((u8 *)(temp_v1_160) + (0x818))) = (u8) (*(u8 *)((u8 *)(temp_v1_160) + (0x819)));
    if ((*(u8 *)((u8 *)(temp_v0_124) + (0xD1))) == 0) {
        goto block_29;
    }
    temp_v1_173 = *(void **)0x801CE8C0 + ((*(s32 *)((u8 *)((temp_v0_124 + ((*(u8 *)((u8 *)(temp_v0_124) + (0xD0))) * 4))) + (0xAC))) + 0x10);
    (*(u8 *)((u8 *)(temp_v0_124) + (0xA5))) = (u8) (*(u8 *)((u8 *)(temp_v1_173) + (4)));
    (*(u8 *)((u8 *)(temp_v0_124) + (0xA6))) = (u8) (*(u8 *)((u8 *)(temp_v1_173) + (5)));
    (*(u8 *)((u8 *)(temp_v0_124) + (0xA7))) = (u8) (*(u8 *)((u8 *)(temp_v1_173) + (6)));
    (*(u8 *)((u8 *)(temp_v0_124) + (0xA8))) = (u8) (*(u8 *)((u8 *)(temp_v1_173) + (7)));
    (*(u8 *)((u8 *)(temp_v0_124) + (0xA9))) = (u8) (*(u8 *)((u8 *)(temp_v1_173) + (8)));
    (*(u8 *)((u8 *)(temp_v0_124) + (0xAA))) = (u8) (*(u8 *)((u8 *)(temp_v1_173) + (9)));
block_29:
    temp_a0_189 = (*(u8 *)((u8 *)(temp_v0_124) + (0xA5)));
    temp_t0_191 = ((*(u8 *)((u8 *)(temp_v0_124) + (0xA6))) << 8) + (*(u8 *)((u8 *)(temp_v0_124) + (0xA7)));
    if (temp_a0_189 >= 0x10U) {
        goto block_44;
    }
    switch (temp_a0_189) {
case 0:
    func_001E1014(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), temp_t0_191, (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xA8))), (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xAA))));
    goto block_44;
case 1:
    func_001E104C(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), temp_t0_191, (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xA8))));
    goto block_44;
case 2:
    func_001E05A4(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), temp_t0_191, (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xAA))));
    goto block_44;
case 3:
    func_001E063C(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), (*(u8 *)((u8 *)(temp_v0_124) + (0xA8))));
    goto block_44;
case 4:
    func_001E06A8(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), var_a3_140);
    goto block_44;
case 6:
    func_001E0768(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), (*(u8 *)((u8 *)(temp_v0_124) + (0xA6))));
    goto block_44;
case 7:
    func_001E0708(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), var_a3_140);
    goto block_44;
case 11:
    func_001E0244(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), (*(u8 *)((u8 *)(temp_v0_124) + (0xA7))));
    goto block_44;
case 13:
    func_001E107C(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), temp_t0_191, (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xA8))), (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xAA))));
    goto block_41;
case 14:
    func_001E11D8(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), (*(u8 *)((u8 *)(temp_v0_124) + (0xA7))), (s32) (*(u8 *)((u8 *)(temp_v0_124) + (0xAA))));
block_41:
    sp18[8] |= 0x2000;
    goto block_44;
block_42:
    (*(s8 *)((u8 *)(temp_v0_108) + (0x12))) = (s8) (*(s32 *)((u8 *)(temp_a0_105) + (4)));
    return;
case 15:
    func_001E145C(temp_v0_124, arg1, (*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))), (*(u8 *)((u8 *)(temp_v0_124) + (0xAA))), temp_t0_191);
    }
block_44:
    func_001D9860((*(s32 *)((u8 *)(*(void **)0x801CE8C0) + (8))));
    var_a3_333 = temp_v0_124 + 0x20;
    var_a2_334 = (u8 *) sp18;
loop_45:
    temp_a1_340 = (*(s32 *)((u8 *)(var_a2_334) + (0xC)));
    (*(s32 *)((u8 *)(var_a3_333) + (0))) = (s32) (*(s32 *)((u8 *)(var_a2_334) + (0)));
    (*(s32 *)((u8 *)(var_a3_333) + (4))) = (s32) (*(s32 *)((u8 *)(var_a2_334) + (4)));
    (*(s32 *)((u8 *)(var_a3_333) + (8))) = (s32) (*(s32 *)((u8 *)(var_a2_334) + (8)));
    (*(s32 *)((u8 *)(var_a3_333) + (0xC))) = temp_a1_340;
    var_a2_334 += 0x10;
    var_a3_333 += 0x10;
    if (var_a2_334 != (u8 *) &sp18[8]) {
        goto loop_45;
    }
    (*(s32 *)((u8 *)(var_a3_333) + (0))) = (s32) (*(s32 *)((u8 *)(var_a2_334) + (0)));
    (*(s32 *)((u8 *)(var_a3_333) + (4))) = (s32) (*(s32 *)((u8 *)(var_a2_334) + (4)));
    func_001D8E70(temp_v0_124, temp_a1_340, var_a2_334, var_a3_333);
    (*(u8 *)((u8 *)(temp_v0_124) + (0xD0))) = (u8) ((*(u8 *)((u8 *)(temp_v0_124) + (0xD0))) - 1);
    temp_v1_358 = *(void **)0x801CE8C0;
    (*(u8 *)((u8 *)(temp_v1_358) + (0x824))) = (u8) ((*(u8 *)((u8 *)(temp_v1_358) + (0x824))) - 1);
    var_a1_363 = *(void **)0x801CE8C0;
    if ((*(u8 *)((u8 *)(var_a1_363) + (0x824))) != 0) {
        goto block_59;
    }
    var_a0_369 = 0;
    if ((*(u32 *)((u8 *)(var_a1_363) + (0x814))) == 0) {
        goto block_59;
    }
    var_v0_372 = var_a1_363;
loop_49:
    var_s0_376 = var_a0_369;
    if ((*(u8 *)((u8 *)(var_v0_372) + (0x10))) != 0x1E) {
        goto block_58;
    }
loop_51:
    temp_v1_382 = *(void **)0x801CE8C0;
    var_a0_369 = func_001D96A0(var_a0_369, var_a1_363);
    var_a1_363 = temp_v1_382 + var_a0_369;
    temp_v0_385 = (*(u8 *)((u8 *)(var_a1_363) + (0x10)));
    if (temp_v0_385 == 0x1E) {
        goto loop_51;
    }
    if (temp_v0_385 != 0x20) {
        goto block_58;
    }
    if ((*(u8 *)((u8 *)(var_a1_363) + (0x13))) != (*(u8 *)((u8 *)(temp_v1_382) + (0x823)))) {
        goto block_58;
    }
    if ((*(u8 *)((u8 *)((temp_v1_382 + var_s0_376)) + (0x10))) != 0x1E) {
        goto block_57;
    }
    var_a0_397 = var_s0_376;
loop_56:
    (*(s8 *)((u8 *)((*(void **)0x801CE8C0 + var_a0_397)) + (0x12))) = 0;
    var_s0_376 = func_001D96A0(var_a0_397);
    var_a0_397 = var_s0_376;
    if ((*(u8 *)((u8 *)((*(void **)0x801CE8C0 + var_s0_376)) + (0x10))) == 0x1E) {
        goto loop_56;
    }
block_57:
    (*(s8 *)((u8 *)((*(void **)0x801CE8C0 + var_s0_376)) + (0x12))) = 0;
    return;
block_58:
    temp_v0_416 = func_001D96A0(var_a0_369, var_a1_363);
    var_a1_363 = *(void **)0x801CE8C0;
    var_a0_369 = temp_v0_416;
    var_v0_372 = var_a1_363 + var_a0_369;
    if (var_a0_369 < (u32) (*(u32 *)((u8 *)(var_a1_363) + (0x814)))) {
        goto loop_49;
    }
block_59:
    return;
}
