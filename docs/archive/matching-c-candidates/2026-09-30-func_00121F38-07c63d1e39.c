typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef double f64;
#define M2C_FIELD(base,type,offset) (*(type)((s8 *)(base)+(offset)))
extern f32 D_801F0D98;
extern f32 D_801F0DA0;
extern f32 D_801F0D9C;
extern f32 D_801F0DA4;
extern u8 D_800E7AB9;
extern f64 D_801EE610;
extern f64 D_801EE618;
extern f64 D_801EE620;
extern f64 D_801EE628;
extern f64 D_801EE630;
extern u8 D_801971F1[];

f32 func_000F315C(u8, f32, f32);                    /* extern */
f32 func_000F3428(u8, f32, f32);                    /* extern */
void func_001072B8(void *);                      /* extern */
void func_0012EA80(s32, f32 *);                  /* extern */

void func_00121F38(void *arg0, void *arg1) {
    f32 points[9];
    f32 *temp_a1;
    f32 *temp_v1_2;
    f32 temp_f2;
    f32 temp_f2_10;
    f32 temp_f2_11;
    f32 temp_f2_12;
    f32 temp_f2_13;
    f32 temp_f2_14;
    f32 temp_f2_15;
    f32 temp_f2_16;
    f32 temp_f2_17;
    f32 temp_f2_18;
    f32 temp_f2_19;
    f32 temp_f2_20;
    f32 temp_f2_21;
    f32 temp_f2_22;
    f32 temp_f2_23;
    f32 temp_f2_24;
    f32 temp_f2_25;
    f32 temp_f2_26;
    f32 temp_f2_27;
    f32 temp_f2_28;
    f32 temp_f2_29;
    f32 temp_f2_2;
    f32 temp_f2_30;
    f32 temp_f2_31;
    f32 temp_f2_32;
    f32 temp_f2_33;
    f32 temp_f2_34;
    f32 temp_f2_35;
    f32 temp_f2_36;
    f32 temp_f2_3;
    f32 temp_f2_4;
    f32 temp_f2_5;
    f32 temp_f2_6;
    f32 temp_f2_7;
    f32 temp_f2_8;
    f32 temp_f2_9;
    f32 temp_f4;
    f32 temp_f4_2;
    f32 temp_f4_3;
    f32 temp_f4_4;
    f32 temp_f4_5;
    f32 temp_f4_6;
    f32 temp_f4_7;
    f32 temp_f6;
    f32 temp_f6_2;
    f32 temp_f6_3;
    f32 temp_f8;
    f32 var_f0;
    f32 var_f0_2;
    f32 var_f0_3;
    f32 var_f20;
    f32 var_f22;
    f32 var_f24;
    f32 var_f26;
    s32 temp_v0_3;
    s32 var_s0;
    u8 temp_a0;
    u8 temp_a0_2;
    u8 temp_a0_4;
    u8 temp_v0;
    u8 temp_v0_2;
    u8 temp_v1;
    u8 temp_v1_5;
    void *temp_a0_3;
    void *temp_a0_5;
    void *temp_a1_2;
    void *temp_v1_3;
    void *temp_v1_4;

    temp_v1 = M2C_FIELD(arg1, u8 *, 1);
    switch (temp_v1) {                              /* switch 1; irregular */
    case 0:                                         /* switch 1 */
        M2C_FIELD(arg0, u8 *, 0x91) = (u8) M2C_FIELD(arg1, u8 *, 2);
        temp_v0 = M2C_FIELD(arg1, u8 *, 3);
        M2C_FIELD(arg0, u8 *, 0x92) = temp_v0;
        if ((temp_v0 & 0xFF) == 2) {
            M2C_FIELD(arg0, u8 *, 0x92) = 0U;
            M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) | 0x800000);
            return;
        }
        return;
    case 1:                                         /* switch 1 */
        temp_a0 = M2C_FIELD(arg1, u8 *, 4);
        var_s0 = 0;
        if (temp_a0 != 0) {
            var_s0 = 1;
            if (M2C_FIELD(arg1, u8 *, 5) != 0) {
                temp_f4 = D_801F0D98;
                temp_f8 = temp_f4 + (((D_801F0DA0 - temp_f4) * (f32) temp_a0) / 256.0f);
                temp_f4_2 = D_801F0D9C;
                points[0] = temp_f8;
                temp_f4_3 = temp_f4_2 + (((D_801F0DA4 - temp_f4_2) * (f32) M2C_FIELD(arg1, u8 *, 5)) / 256.0f);
                points[2] = temp_f4_3;
                if (M2C_FIELD(arg0, s32 *, 0x70) == 1) {
                    M2C_FIELD(&points[0], f32 *, 4) = func_000F3428(D_800E7AB9, temp_f8, temp_f4_3);
                } else {
                    M2C_FIELD(&points[0], f32 *, 4) = func_000F315C(D_800E7AB9, temp_f8, temp_f4_3);
                }
            } else {
                func_0012EA80(temp_a0 - 1, &points[0]);
            }
            temp_v1_2 = &(&points[0])[0 * 2];
            if (M2C_FIELD(arg0, f32 *, 8) == M2C_FIELD(temp_v1_2, f32 *, 0)) {
                temp_f6 = M2C_FIELD(temp_v1_2, f32 *, 8);
                if (M2C_FIELD(arg0, f32 *, 0x10) == temp_f6) {
                    if (((f64) temp_f6 + D_801EE610) < (f64) D_801F0DA4) {
                        var_f0 = temp_f6 + 0.0001f;
                    } else {
                        var_f0 = temp_f6 - 0.0001f;
                    }
                    M2C_FIELD(temp_v1_2, f32 *, 8) = var_f0;
                }
            }
            temp_a0_2 = M2C_FIELD(arg1, u8 *, 6);
            if (temp_a0_2 != 0) {
                var_s0++;
                if (M2C_FIELD(arg1, u8 *, 7) != 0) {
                    temp_f4_4 = D_801F0D98;
                    temp_v1_3 = &points[3];
                    M2C_FIELD(temp_v1_3, f32 *, 0) = (f32) (temp_f4_4 + (((D_801F0DA0 - temp_f4_4) * (f32) temp_a0_2) / 256.0f));
                    temp_f4_5 = D_801F0D9C;
                    M2C_FIELD(temp_v1_3, f32 *, 8) = (f32) (temp_f4_5 + (((D_801F0DA4 - temp_f4_5) * (f32) M2C_FIELD(arg1, u8 *, 7)) / 256.0f));
                    if (M2C_FIELD(arg0, s32 *, 0x70) == 1) {
                        M2C_FIELD(temp_v1_3, f32 *, 4) = func_000F3428(D_800E7AB9, points[3], points[5]);
                    } else {
                        M2C_FIELD(temp_v1_3, f32 *, 4) = func_000F315C(D_800E7AB9, points[3], points[5]);
                    }
                } else {
                    func_0012EA80(temp_a0_2 - 1, &points[3]);
                }
                if (var_s0 == 1) {
                    if ((M2C_FIELD(arg0, f32 *, 8) == points[0]) && (M2C_FIELD(arg0, f32 *, 0x10) == points[2])) {
                        if (((f64) points[2] + D_801EE618) < (f64) D_801F0DA4) {
                            points[2] += 0.0001f;
                        } else {
                            points[2] -= 0.0001f;
                        }
                    }
                } else {
                    temp_a1 = &(&points[0])[0 * 2];
                    temp_a0_3 = &points[3];
                    if (M2C_FIELD(temp_a1, f32 *, 0) == M2C_FIELD(temp_a0_3, f32 *, 0)) {
                        temp_f6_2 = M2C_FIELD(temp_a0_3, f32 *, 8);
                        if (M2C_FIELD(temp_a1, f32 *, 8) == temp_f6_2) {
                            if (((f64) temp_f6_2 + D_801EE620) < (f64) D_801F0DA4) {
                                var_f0_2 = temp_f6_2 + 0.0001f;
                            } else {
                                var_f0_2 = temp_f6_2 - 0.0001f;
                            }
                            M2C_FIELD(temp_a0_3, f32 *, 8) = var_f0_2;
                        }
                    }
                }
                temp_a0_4 = M2C_FIELD(arg1, u8 *, 8);
                if (temp_a0_4 != 0) {
                    var_s0++;
                    if (M2C_FIELD(arg1, u8 *, 9) != 0) {
                        temp_f4_6 = D_801F0D98;
                        temp_v1_4 = &points[6];
                        M2C_FIELD(temp_v1_4, f32 *, 0) = (f32) (temp_f4_6 + (((D_801F0DA0 - temp_f4_6) * (f32) temp_a0_4) / 256.0f));
                        temp_f4_7 = D_801F0D9C;
                        M2C_FIELD(temp_v1_4, f32 *, 8) = (f32) (temp_f4_7 + (((D_801F0DA4 - temp_f4_7) * (f32) M2C_FIELD(arg1, u8 *, 9)) / 256.0f));
                        if (M2C_FIELD(arg0, s32 *, 0x70) == 1) {
                            M2C_FIELD(temp_v1_4, f32 *, 4) = func_000F3428(D_800E7AB9, points[6], points[8]);
                        } else {
                            M2C_FIELD(temp_v1_4, f32 *, 4) = func_000F315C(D_800E7AB9, points[6], points[8]);
                        }
                    } else {
                        func_0012EA80(temp_a0_4 - 1, &points[6]);
                    }
                    if (var_s0 == 1) {
                        if ((M2C_FIELD(arg0, f32 *, 8) == points[0]) && (M2C_FIELD(arg0, f32 *, 0x10) == points[2])) {
                            if (((f64) points[2] + D_801EE628) < (f64) D_801F0DA4) {
                                points[2] += 0.0001f;
                            } else {
                                points[2] -= 0.0001f;
                            }
                        }
                    } else {
                        temp_a1_2 = &points[3];
                        temp_a0_5 = &points[6];
                        if (M2C_FIELD(temp_a1_2, f32 *, 0) == M2C_FIELD(temp_a0_5, f32 *, 0)) {
                            temp_f6_3 = M2C_FIELD(temp_a0_5, f32 *, 8);
                            if (M2C_FIELD(temp_a1_2, f32 *, 8) == temp_f6_3) {
                                if (((f64) temp_f6_3 + D_801EE630) < (f64) D_801F0DA4) {
                                    var_f0_3 = temp_f6_3 + 0.0001f;
                                } else {
                                    var_f0_3 = temp_f6_3 - 0.0001f;
                                }
                                M2C_FIELD(temp_a0_5, f32 *, 8) = var_f0_3;
                            }
                        }
                    }
                }
            }
        }
        temp_v1_5 = M2C_FIELD(arg1, u8 *, 2);
        switch (temp_v1_5) {                        /* switch 2; irregular */
        case 0:                                     /* switch 2 */
            if (var_s0 != 2) {
                if (var_s0 >= 3) {
                    if (var_s0 != 3) {
                        M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                    } else {
                        func_001072B8(arg0);
                        M2C_FIELD(arg0, s32 *, 0x84) = -1;
                        M2C_FIELD(arg0, s32 *, 0x80) = -1;
                        M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                        M2C_FIELD(arg0, s32 *, 0x88) = 0;
                        M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                        M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                        M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                        M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                        M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                        temp_f2 = D_801F0D9C;
                        temp_f2_2 = D_801F0D98;
                        M2C_FIELD(arg0, f32 *, 0x34) = points[3];
                        M2C_FIELD(arg0, f32 *, 0x38) = points[4];
                        M2C_FIELD(arg0, f32 *, 0x3C) = points[5];
                        M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) (((points[2] - temp_f2) * 64.0f) / (D_801F0DA4 - temp_f2)) << 6) + (s32) (((points[0] - temp_f2_2) * 64.0f) / (D_801F0DA0 - temp_f2_2)));
                        temp_f2_3 = D_801F0D9C;
                        temp_f2_4 = D_801F0D98;
                        M2C_FIELD(arg0, f32 *, 0x40) = points[6];
                        M2C_FIELD(arg0, f32 *, 0x44) = points[7];
                        M2C_FIELD(arg0, f32 *, 0x48) = points[8];
                        M2C_FIELD(arg0, s32 *, 0x5C) = (s32) (((s32) (((points[5] - temp_f2_3) * 64.0f) / (D_801F0DA4 - temp_f2_3)) << 6) + (s32) (((points[3] - temp_f2_4) * 64.0f) / (D_801F0DA0 - temp_f2_4)));
                        temp_f2_5 = D_801F0D9C;
                        temp_f2_6 = D_801F0D98;
                        M2C_FIELD(arg0, u8 *, 0x20) = 3U;
                        M2C_FIELD(arg0, s32 *, 0x24) = 1;
                        M2C_FIELD(arg0, s32 *, 0x60) = (s32) (((s32) (((points[8] - temp_f2_5) * 64.0f) / (D_801F0DA4 - temp_f2_5)) << 6) + (s32) (((points[6] - temp_f2_6) * 64.0f) / (D_801F0DA0 - temp_f2_6)));
                        M2C_FIELD(arg0, s32 *, 0) &= ~4;
                        M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                        M2C_FIELD(arg0, s32 *, 0) |= 2;
                        M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                    }
                } else if (var_s0 != 1) {
                    M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                } else {
                    func_001072B8(arg0);
                    M2C_FIELD(arg0, s32 *, 0x84) = -1;
                    M2C_FIELD(arg0, s32 *, 0x80) = -1;
                    M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                    M2C_FIELD(arg0, s32 *, 0x88) = 0;
                    M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                    M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                    M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                    M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                    M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                    temp_f2_7 = D_801F0D9C;
                    var_f20 = ((points[2] - temp_f2_7) * 64.0f) / (D_801F0DA4 - temp_f2_7);
                    temp_f2_8 = D_801F0D98;
                    var_f22 = ((points[0] - temp_f2_8) * 64.0f) / (D_801F0DA0 - temp_f2_8);
                    M2C_FIELD(arg0, u8 *, 0x20) = 1U;
                    M2C_FIELD(arg0, s32 *, 0x24) = 1;
                    M2C_FIELD(arg0, s32 *, 0) &= ~4;
                    M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                    M2C_FIELD(arg0, s32 *, 0) |= 2;
                    M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
block_95:
                    M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) var_f20 << 6) + (s32) var_f22);
                }
            } else {
                func_001072B8(arg0);
                M2C_FIELD(arg0, s32 *, 0x84) = -1;
                M2C_FIELD(arg0, s32 *, 0x80) = -1;
                M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                M2C_FIELD(arg0, s32 *, 0x88) = 0;
                M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                temp_f2_9 = D_801F0D9C;
                temp_f2_10 = D_801F0D98;
                M2C_FIELD(arg0, f32 *, 0x34) = points[3];
                M2C_FIELD(arg0, f32 *, 0x38) = points[4];
                M2C_FIELD(arg0, f32 *, 0x3C) = points[5];
                M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) (((points[2] - temp_f2_9) * 64.0f) / (D_801F0DA4 - temp_f2_9)) << 6) + (s32) (((points[0] - temp_f2_10) * 64.0f) / (D_801F0DA0 - temp_f2_10)));
                temp_f2_11 = D_801F0D9C;
                var_f24 = ((points[5] - temp_f2_11) * 64.0f) / (D_801F0DA4 - temp_f2_11);
                temp_f2_12 = D_801F0D98;
                var_f26 = ((points[3] - temp_f2_12) * 64.0f) / (D_801F0DA0 - temp_f2_12);
                M2C_FIELD(arg0, u8 *, 0x20) = 2U;
                M2C_FIELD(arg0, s32 *, 0x24) = 1;
                M2C_FIELD(arg0, s32 *, 0) &= ~4;
                M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                M2C_FIELD(arg0, s32 *, 0) |= 2;
                M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
block_97:
                M2C_FIELD(arg0, s32 *, 0x5C) = (s32) (((s32) var_f24 << 6) + (s32) var_f26);
            }
block_99:
            temp_v0_2 = M2C_FIELD(arg1, u8 *, 3);
            M2C_FIELD(arg0, u8 *, 0x92) = temp_v0_2;
            if ((temp_v0_2 & 0xFF) == 2) {
                M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) | 0x800000);
            }
            break;
        case 1:                                     /* switch 2 */
            if (var_s0 != 2) {
                if (var_s0 >= 3) {
                    if (var_s0 != 3) {
                        M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                    } else {
                        func_001072B8(arg0);
                        M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                        M2C_FIELD(arg0, s32 *, 0x84) = -1;
                        M2C_FIELD(arg0, s32 *, 0x80) = -1;
                        M2C_FIELD(arg0, s32 *, 0x88) = 0;
                        M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                        M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                        M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                        M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                        M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                        temp_f2_13 = D_801F0D9C;
                        temp_f2_14 = D_801F0D98;
                        M2C_FIELD(arg0, f32 *, 0x34) = points[3];
                        M2C_FIELD(arg0, f32 *, 0x38) = points[4];
                        M2C_FIELD(arg0, f32 *, 0x3C) = points[5];
                        M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) (((points[2] - temp_f2_13) * 64.0f) / (D_801F0DA4 - temp_f2_13)) << 6) + (s32) (((points[0] - temp_f2_14) * 64.0f) / (D_801F0DA0 - temp_f2_14)));
                        temp_f2_15 = D_801F0D9C;
                        temp_f2_16 = D_801F0D98;
                        M2C_FIELD(arg0, f32 *, 0x40) = points[6];
                        M2C_FIELD(arg0, f32 *, 0x44) = points[7];
                        M2C_FIELD(arg0, f32 *, 0x48) = points[8];
                        M2C_FIELD(arg0, s32 *, 0x5C) = (s32) (((s32) (((points[5] - temp_f2_15) * 64.0f) / (D_801F0DA4 - temp_f2_15)) << 6) + (s32) (((points[3] - temp_f2_16) * 64.0f) / (D_801F0DA0 - temp_f2_16)));
                        temp_f2_17 = D_801F0D9C;
                        temp_f2_18 = D_801F0D98;
                        M2C_FIELD(arg0, u8 *, 0x20) = 3U;
                        M2C_FIELD(arg0, s32 *, 0x24) = 1;
                        M2C_FIELD(arg0, s32 *, 0x60) = (s32) (((s32) (((points[8] - temp_f2_17) * 64.0f) / (D_801F0DA4 - temp_f2_17)) << 6) + (s32) (((points[6] - temp_f2_18) * 64.0f) / (D_801F0DA0 - temp_f2_18)));
                        M2C_FIELD(arg0, s32 *, 0) &= ~4;
                        M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                        M2C_FIELD(arg0, s32 *, 0) |= 2;
                        M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                        M2C_FIELD(arg0, u8 *, 0x91) = 1U;
                        M2C_FIELD(arg0, s32 *, 0x84) = -1;
                    }
                } else if (var_s0 != 1) {
                    M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                } else {
                    func_001072B8(arg0);
                    M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                    M2C_FIELD(arg0, s32 *, 0x84) = -1;
                    M2C_FIELD(arg0, s32 *, 0x80) = -1;
                    M2C_FIELD(arg0, s32 *, 0x88) = 0;
                    M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                    M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                    M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                    M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                    M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                    temp_f2_19 = D_801F0D9C;
                    var_f20 = ((points[2] - temp_f2_19) * 64.0f) / (D_801F0DA4 - temp_f2_19);
                    temp_f2_20 = D_801F0D98;
                    var_f22 = ((points[0] - temp_f2_20) * 64.0f) / (D_801F0DA0 - temp_f2_20);
                    M2C_FIELD(arg0, u8 *, 0x20) = 1U;
                    M2C_FIELD(arg0, u8 *, 0x91) = 1U;
                    M2C_FIELD(arg0, s32 *, 0x24) = 1;
                    M2C_FIELD(arg0, s32 *, 0x84) = -1;
                    M2C_FIELD(arg0, s32 *, 0) &= ~4;
                    M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                    M2C_FIELD(arg0, s32 *, 0) |= 2;
                    M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                    goto block_95;
                }
            } else {
                func_001072B8(arg0);
                M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                M2C_FIELD(arg0, s32 *, 0x84) = -1;
                M2C_FIELD(arg0, s32 *, 0x80) = -1;
                M2C_FIELD(arg0, s32 *, 0x88) = 0;
                M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                temp_f2_21 = D_801F0D9C;
                temp_f2_22 = D_801F0D98;
                M2C_FIELD(arg0, f32 *, 0x34) = points[3];
                M2C_FIELD(arg0, f32 *, 0x38) = points[4];
                M2C_FIELD(arg0, f32 *, 0x3C) = points[5];
                M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) (((points[2] - temp_f2_21) * 64.0f) / (D_801F0DA4 - temp_f2_21)) << 6) + (s32) (((points[0] - temp_f2_22) * 64.0f) / (D_801F0DA0 - temp_f2_22)));
                temp_f2_23 = D_801F0D9C;
                var_f24 = ((points[5] - temp_f2_23) * 64.0f) / (D_801F0DA4 - temp_f2_23);
                temp_f2_24 = D_801F0D98;
                var_f26 = ((points[3] - temp_f2_24) * 64.0f) / (D_801F0DA0 - temp_f2_24);
                M2C_FIELD(arg0, u8 *, 0x20) = 2U;
                M2C_FIELD(arg0, s32 *, 0) &= ~4;
                M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                M2C_FIELD(arg0, s32 *, 0) |= 2;
                M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                M2C_FIELD(arg0, s32 *, 0x24) = 1;
                M2C_FIELD(arg0, u8 *, 0x91) = 1U;
                M2C_FIELD(arg0, s32 *, 0x84) = -1;
                goto block_97;
            }
            goto block_99;
        case 2:                                     /* switch 2 */
            if (var_s0 != temp_v1_5) {
                if (var_s0 >= 3) {
                    if (var_s0 != 3) {
                        M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                    } else {
                        func_001072B8(arg0);
                        M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                        M2C_FIELD(arg0, s32 *, 0x84) = -1;
                        M2C_FIELD(arg0, s32 *, 0x80) = -1;
                        M2C_FIELD(arg0, s32 *, 0x88) = 0;
                        M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                        M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                        M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                        M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                        M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                        temp_f2_25 = D_801F0D9C;
                        temp_f2_26 = D_801F0D98;
                        M2C_FIELD(arg0, f32 *, 0x34) = points[3];
                        M2C_FIELD(arg0, f32 *, 0x38) = points[4];
                        M2C_FIELD(arg0, f32 *, 0x3C) = points[5];
                        M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) (((points[2] - temp_f2_25) * 64.0f) / (D_801F0DA4 - temp_f2_25)) << 6) + (s32) (((points[0] - temp_f2_26) * 64.0f) / (D_801F0DA0 - temp_f2_26)));
                        temp_f2_27 = D_801F0D9C;
                        temp_f2_28 = D_801F0D98;
                        M2C_FIELD(arg0, f32 *, 0x40) = points[6];
                        M2C_FIELD(arg0, f32 *, 0x44) = points[7];
                        M2C_FIELD(arg0, f32 *, 0x48) = points[8];
                        M2C_FIELD(arg0, s32 *, 0x5C) = (s32) (((s32) (((points[5] - temp_f2_27) * 64.0f) / (D_801F0DA4 - temp_f2_27)) << 6) + (s32) (((points[3] - temp_f2_28) * 64.0f) / (D_801F0DA0 - temp_f2_28)));
                        temp_f2_29 = D_801F0D9C;
                        temp_f2_30 = D_801F0D98;
                        M2C_FIELD(arg0, u8 *, 0x20) = 3U;
                        M2C_FIELD(arg0, s32 *, 0x24) = 1;
                        M2C_FIELD(arg0, s32 *, 0x60) = (s32) (((s32) (((points[8] - temp_f2_29) * 64.0f) / (D_801F0DA4 - temp_f2_29)) << 6) + (s32) (((points[6] - temp_f2_30) * 64.0f) / (D_801F0DA0 - temp_f2_30)));
                        M2C_FIELD(arg0, s32 *, 0) &= ~4;
                        M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                        M2C_FIELD(arg0, s32 *, 0) |= 2;
                        M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                        M2C_FIELD(arg0, u8 *, 0x91) = 2U;
                        M2C_FIELD(arg0, s32 *, 0x84) = -1;
                        M2C_FIELD(arg0, s32 *, 0x88) = 0x5A;
                    }
                } else if (var_s0 != 1) {
                    M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                } else {
                    func_001072B8(arg0);
                    M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                    M2C_FIELD(arg0, s32 *, 0x84) = -1;
                    M2C_FIELD(arg0, s32 *, 0x80) = -1;
                    M2C_FIELD(arg0, s32 *, 0x88) = 0;
                    M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                    M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                    M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                    M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                    M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                    temp_f2_31 = D_801F0D9C;
                    var_f20 = ((points[2] - temp_f2_31) * 64.0f) / (D_801F0DA4 - temp_f2_31);
                    temp_f2_32 = D_801F0D98;
                    var_f22 = ((points[0] - temp_f2_32) * 64.0f) / (D_801F0DA0 - temp_f2_32);
                    M2C_FIELD(arg0, u8 *, 0x20) = 1U;
                    M2C_FIELD(arg0, u8 *, 0x91) = 2U;
                    M2C_FIELD(arg0, s32 *, 0x88) = 0x5A;
                    M2C_FIELD(arg0, s32 *, 0x24) = 1;
                    M2C_FIELD(arg0, s32 *, 0x84) = -1;
                    M2C_FIELD(arg0, s32 *, 0) &= ~4;
                    M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                    M2C_FIELD(arg0, s32 *, 0) |= 2;
                    M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                    goto block_95;
                }
            } else {
                func_001072B8(arg0);
                M2C_FIELD(arg0, u8 *, 0x91) = 0U;
                M2C_FIELD(arg0, s32 *, 0x84) = -1;
                M2C_FIELD(arg0, s32 *, 0x80) = -1;
                M2C_FIELD(arg0, s32 *, 0x88) = 0;
                M2C_FIELD(arg0, u8 *, 0x92) = 0U;
                M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~2);
                M2C_FIELD(arg0, f32 *, 0x28) = points[0];
                M2C_FIELD(arg0, f32 *, 0x2C) = points[1];
                M2C_FIELD(arg0, f32 *, 0x30) = points[2];
                temp_f2_33 = D_801F0D9C;
                temp_f2_34 = D_801F0D98;
                M2C_FIELD(arg0, f32 *, 0x34) = points[3];
                M2C_FIELD(arg0, f32 *, 0x38) = points[4];
                M2C_FIELD(arg0, f32 *, 0x3C) = points[5];
                M2C_FIELD(arg0, s32 *, 0x58) = (s32) (((s32) (((points[2] - temp_f2_33) * 64.0f) / (D_801F0DA4 - temp_f2_33)) << 6) + (s32) (((points[0] - temp_f2_34) * 64.0f) / (D_801F0DA0 - temp_f2_34)));
                temp_f2_35 = D_801F0D9C;
                var_f24 = ((points[5] - temp_f2_35) * 64.0f) / (D_801F0DA4 - temp_f2_35);
                temp_f2_36 = D_801F0D98;
                var_f26 = ((points[3] - temp_f2_36) * 64.0f) / (D_801F0DA0 - temp_f2_36);
                M2C_FIELD(arg0, s32 *, 0) &= ~4;
                M2C_FIELD(arg0, s32 *, 0) &= ~0x200;
                M2C_FIELD(arg0, s32 *, 0) |= 2;
                M2C_FIELD(arg0, s32 *, 0) &= 0xFF7FFFFF;
                M2C_FIELD(arg0, u8 *, 0x20) = 2U;
                M2C_FIELD(arg0, s32 *, 0x24) = 1;
                M2C_FIELD(arg0, u8 *, 0x91) = 2U;
                M2C_FIELD(arg0, s32 *, 0x84) = -1;
                M2C_FIELD(arg0, s32 *, 0x88) = 0x5A;
                goto block_97;
            }
            goto block_99;
        }
        if (M2C_FIELD(arg0, s32 *, 0) & 0x800000) {
            M2C_FIELD(arg0, f32 *, 0x4C) = (f32) M2C_FIELD((arg0 + ((M2C_FIELD(arg0, u8 *, 0x20) - 1) * 0xC)), f32 *, 0x28);
            M2C_FIELD(arg0, f32 *, 0x50) = (f32) M2C_FIELD((arg0 + ((M2C_FIELD(arg0, u8 *, 0x20) - 1) * 0xC)), f32 *, 0x2C);
            M2C_FIELD(arg0, f32 *, 0x54) = (f32) M2C_FIELD((arg0 + ((M2C_FIELD(arg0, u8 *, 0x20) - 1) * 0xC)), f32 *, 0x30);
            M2C_FIELD(arg0, s32 *, 0x64) = (s32) M2C_FIELD((arg0 + (M2C_FIELD(arg0, u8 *, 0x20) * 4)), s32 *, 0x54);
            return;
        }
        break;
    case 2:                                         /* switch 1 */
        M2C_FIELD(arg0, s32 *, 0) = (s32) (M2C_FIELD(arg0, s32 *, 0) & ~1);
        temp_v0_3 = M2C_FIELD(arg0, u8 *, 4) * 0x19;
        D_801971F1[temp_v0_3] = (s8) (D_801971F1[temp_v0_3] & 0xFB);
        break;
    }
}
