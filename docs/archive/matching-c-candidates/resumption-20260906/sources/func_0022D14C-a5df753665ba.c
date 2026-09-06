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
typedef union { u8 bytes[128]; u16 halves[64]; s32 words[32]; } LocalPacket;
s32 func_00043ad8(u8, u8);
s32 func_00044130(u8, u8, s32);
s32 func_0020144C(u8);
s32 func_002014C4(u8);
u8 func_00201798(s32, s32, s32, M2C_UNK);
s32 func_0020BF50(M2C_UNK);
s32 func_0020BFE4();
s32 func_0020C014(void *);
s32 func_0020C104(void *);
s32 func_0020C1B4(void *);
s32 func_0020C24C(void *);
s32 func_0020C2C0(void *);
s32 func_0020C2F4(void *);
s32 func_0020C310(void *);
s32 func_0020C32C(void *);
s32 func_0020C3B4(void *);
void *func_0020C478(s32);
s32 func_0020D434(s32);
s32 func_0020D4C8(void *, u32);
s32 func_0020D6F8(void *, void *);
s32 func_0020D72C(void *);
void *func_0020D770(s32, s32);
void func_0021D200(M2C_UNK, s32, void *);
void func_0021D230(M2C_UNK, s32, void *, s32);
void func_0021D25C(M2C_UNK, s32, void *, M2C_UNK, s32);
void func_0021D28C(M2C_UNK, s32, void *, M2C_UNK, s32, s32);
void func_0021D2C0(M2C_UNK, s32, void *, s32, s32, s32, s32);
void func_0021D334(M2C_UNK, s32, void *, M2C_UNK, s32, s32, s32, s32, s32);
void func_0021D7CC(void *);
s32 func_00222190(void *, s32, s32, s32, s32);
s32 func_00222344(void *, s32, s32, s32, s32);
s16 func_002224F4();
s32 func_0022257C(s32, u8, s32 *);
M2C_UNK func_0022A7B8(void *, M2C_UNK, s32, u32, s32, s32);
M2C_UNK func_0022B06C(void *, u8 *);
u32 func_00233210(void *, void *);
u8 func_00233568(void *);
M2C_UNK func_0023422C(void *, s32);
s32 func_002363FC(void *);
u32 func_002365BC(void *, void *, u16, s32);
s32 func_00237750(void *, void *, M2C_UNK, u32, s32);
s8 func_002379AC(u8, void *);
s32 func_00237AF8(void *, s32);
M2C_UNK func_00237D5C(s32, s32 *, s32 *);
M2C_UNK func_00238D94(void *, u8, void *);
M2C_UNK func_00239338(void *, void *, M2C_UNK, M2C_UNK);
M2C_UNK memset_00023780(s32 *, M2C_UNK);
u32 rand(void);
s32 func_0022D14C(void *arg0, s32 *arg1) {
    LocalPacket packet;
    s32 buffer[6];
    void *excluded[6];
    struct { s32 x0, y0, x1, y1; u8 value; } coords;
    s32 pair[2];
    s32 ids[12];
    s32 effects[12];
    s32 emitCode;
    s32 emitExtra;
    s32 *sp15C;
    s32 sp164;
    s32 sp16C;
    s32 sp174;
    s32 sp17C;
    s32 sp184;
    s32 sp18C;
    s32 sp194;
    s32 sp19C;
    s32 sp1A4;
    s32 sp1AC;
    u8 sp1B7;
    u32 sp1BC;
    u8 sp1C7;
    s32 sp1CC;
    u8 sp1D7;
    s32 sp1DC;
    s32 sp1E4;
    M2C_UNK *sp1EC;
    s32 sp1F4;
    s32 *sp1FC;
    u8 *sp234;
    void **sp23C;
    M2C_UNK var_a0_316;
    M2C_UNK var_a3_1183;
    s16 temp_v0_1467;
    s32 *temp_s1_706;
    s32 *temp_v0_1684;
    s32 *temp_v0_997;
    s32 *var_a0_1664;
    s32 *var_a0_733;
    s32 *var_a1_735;
    s32 *var_s0_427;
    s32 *var_s1_97;
    void **var_s2_1801;
    void **var_s2_653;
    s32 *var_s4_100;
    u8 *var_s7_99;
    s32 *var_v1_1666;
    s32 *var_v1_999;
    s32 temp_a0_172;
    s32 temp_a0_350;
    s32 temp_a0_413;
    s32 temp_a0_429;
    s32 temp_a0_616;
    u32 temp_a1_915;
    s32 temp_a2_513;
    s32 temp_s0_1586;
    s32 temp_s0_1700;
    u32 temp_s0_1806;
    s32 temp_s0_523;
    u32 temp_s0_658;
    u32 temp_s0_777;
    u32 temp_s0_787;
    u32 temp_s0_866;
    u32 temp_s1_1808;
    s32 temp_s1_1826;
    u32 temp_s1_660;
    u32 temp_s1_779;
    u32 temp_s1_868;
    u32 temp_s1_911;
    u32 temp_s4_913;
    s32 temp_s7_700;
    s32 temp_v0_1085;
    s32 temp_v0_1409;
    s32 temp_v0_1568;
    s32 temp_v0_1607;
    s32 temp_v0_1776;
    s32 temp_v0_1779;
    s32 temp_v0_300;
    s32 temp_v0_307;
    s32 temp_v0_319;
    s32 temp_v0_374;
    s32 temp_v1_1544;
    s32 temp_v1_1746;
    s32 temp_v1_1762;
    s32 temp_v1_1834;
    s32 temp_v1_299;
    s32 temp_v1_306;
    s32 temp_v1_321;
    s32 temp_v1_415;
    s32 temp_v1_418;
    s32 temp_v1_444;
    s32 temp_v1_674;
    s32 temp_v1_974;
    s32 var_a0_990;
    s32 var_a1_1205;
    s32 var_a1_536;
    s32 var_a1_676;
    s32 var_a1_992;
    s32 var_a2_1641;
    s32 var_a3_540;
    s32 var_s0_308;
    s32 var_s0_965;
    s32 var_s1_1474;
    s32 var_s1_222;
    s32 var_s1_301;
    s32 var_s5_1662;
    s32 var_s5_1797;
    s32 var_s5_426;
    s32 var_s5_646;
    s32 var_s5_693;
    s32 var_s5_92;
    s32 var_t2_721;
    s32 var_v0_323;
    s32 var_v1_171;
    s32 var_v1_457;
    s8 var_s1_844;
    s8 var_s2_802;
    u16 *var_a2_730;
    u16 *var_t1_724;
    u16 temp_v0_747;
    u32 temp_hi_788;
    u32 temp_s8_775;
    u32 temp_v0_804;
    u32 var_a1_182;
    u32 var_a1_468;
    u32 var_s0_909;
    u8 *var_a1_1663;
    u8 *var_a3_728;
    u8 *var_s2_96;
    u8 *var_s8_98;
    u8 *var_t0_726;
    u8 temp_s0_234;
    u8 temp_s0_504;
    u32 temp_v0_1142;
    u8 temp_v0_233;
    s32 temp_v0_44;
    u8 var_a3_492;
    void *temp_a0_223;
    void *temp_a2_668;
    void *temp_s0_635;
    void *temp_s2_769;
    void *temp_v0_104;
    void *temp_v0_1476;
    void *temp_v0_611;
    void *temp_v1_1782;
    void *var_a2_537;
    void *var_s3_51;
    void *var_v0_433;
    void *var_v1_734;
    sp15C = arg1;
    sp17C = 0;
    sp19C = 0;
    sp1A4 = 0;
    sp1B7 = 0;
    sp1BC = 0;
    memset_00023780(&buffer[0], 0x18);
    sp1CC = 0;
    sp1D7 = 0;
    sp164 = func_0020144C((*(u8 *)((s8 *)(arg0) + (0x7F)))) & 0xFF;
    func_00238D94(&packet, (*(u8 *)((s8 *)(arg0) + (0x7F))), arg0);
    sp194 = 0;
    sp18C = 0;
    temp_v0_44 = (*(u8 *)((s8 *)((((*(s32 *)((s8 *)(arg0) + (0x7C))) * 0x10) + 0x80190000)) + (-0x557F)));
    sp184 = 0;
    sp1AC = 0;
    sp1C7 = temp_v0_44;
    var_s3_51 = 0;
    if ((u32) (temp_v0_44 - 9) < 6U) {
        switch (sp1C7) {
        case 10:
            sp1C7 = 2;
            break;
        case 11:
            sp1C7 = 3;
            break;
        case 12:
            sp1C7 = 4;
            break;
        case 9:
        case 13:
            sp1C7 = 1;
            break;
        default:
            sp1C7 = 2;
            break;
        }
    } else if (sp1C7 == 8) {
        sp1C7 = func_00233568(arg0);
    }
    if ((*(s32 *)((s8 *)(arg0) + (0x7C))) == 0x29) {
        var_s5_92 = 0;
        sp1DC = 0;
        sp1CC = 0;
        if (packet.words[3] > 0) {
            var_s2_96 = &packet.bytes[86];
            var_s1_97 = packet.words;
            var_s8_98 = var_s2_96;
            var_s7_99 = (u8 *)var_s1_97;
            var_s4_100 = var_s1_97;
            sp234 = (u8 *)var_s1_97;
            sp23C = excluded;
            do {
                temp_v0_104 = func_0020C478((*(s32 *)((s8 *)(var_s1_97) + (0x10))));
                if ((func_0020C32C(temp_v0_104) != 0) || (func_0020C2F4(temp_v0_104) != 0) || (func_0020C310(temp_v0_104) != 0) || ((func_00043ad8((*(u8 *)((s8 *)(temp_v0_104) + (0x4B))), (*(u8 *)((s8 *)(temp_v0_104) + (0x4F)))) & 0xFF) != 1)) {
                    (*(s32 *)((s8 *)(var_s4_100) + (0x10))) = (s32) (*(s32 *)((s8 *)(var_s1_97) + (0x10)));
                    sp1DC += 1;
                    (*(u16 *)((s8 *)(var_s7_99) + (0x38))) = (u16) (*(u16 *)((s8 *)(sp234) + (0x38)));
                    var_s4_100++;
                    var_s7_99 += 2;
                    *var_s8_98 = *var_s2_96;
                    var_s8_98 += 1;
                } else {
                    *sp23C = temp_v0_104;
                    sp23C++;
                    sp1CC += 1;
                }
                var_s2_96 += 1;
                var_s1_97++;
                var_s5_92 += 1;
                sp234 += 2;
            } while (var_s5_92 < packet.words[3]);
        }
        packet.words[3] = sp1DC;
    }
    if (packet.words[3] == 0) {
        if ((*(s32 *)((s8 *)(arg0) + (0x7C))) != 0x29) {
            var_v1_171 = (*(s32 *)((s8 *)(arg0) + (0x94)));
            temp_a0_172 = *sp15C;
            if (var_v1_171 < temp_a0_172) {
                var_v1_171 = temp_a0_172;
            }
            (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_171;
            var_a1_182 = (*(u32 *)((s8 *)(*(void **)0x801CE8C0) + (0x828)));
            if (var_a1_182 < (u32) var_v1_171) {
                var_a1_182 = (u32) var_v1_171;
            }
            (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_182;
            func_0021D200(0x1C, (s32) var_a1_182, arg0);
            (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
            *sp15C = (*(s32 *)((s8 *)(arg0) + (0x94)));
            return 0;
        }
        goto block_32;
    }
block_32:
    func_00239338(&packet, arg0, 0, 0);
    if (func_0020BFE4() != 0) {
        if ((u32) ((*(u8 *)((s8 *)(arg0) + (0x78))) - 4) < 2U) {
            buffer[0] = 0;
            sp1B7 = 0;
            sp17C = 0;
            if (**(u8 **)0x801D073C != 0) {
                var_s1_222 = 0;
                do {
                    temp_a0_223 = var_s1_222 + *(void **)0x801D073C;
                    if (((*(u8 *)((s8 *)(temp_a0_223) + (0))) == (*(s32 *)((s8 *)(arg0) + (0x7C)))) && ((*(u8 *)((s8 *)(temp_a0_223) + (1))) == (*(s32 *)((s8 *)(arg0) + (0x4C))))) {
                        temp_v0_233 = (*(u8 *)((s8 *)(temp_a0_223) + (2)));
                        temp_s0_234 = temp_v0_233 & 0x3F;
                        sp1B7 = temp_s0_234;
                        if ((temp_v0_233 & 0x80) && (func_0020D6F8(arg0, func_0020C478(packet.words[4])) == 0)) {
                            sp1B7 = temp_s0_234 + 1;
                        }
                        if (((*(u8 *)((s8 *)((var_s1_222 + *(void **)0x801D073C)) + (2))) & 0x40) && (func_0020D6F8(arg0, func_0020C478(packet.words[4])) != 0)) {
                            sp1B7 += 1;
                        }
                        sp17C = func_0022257C((*(s32 *)((s8 *)(arg0) + (0))) + 0x44, sp1B7, 0);
                        buffer[0] = (s32) (*(u8 *)((s8 *)((var_s1_222 + *(void **)0x801D073C)) + (3)));
                    }
                    var_s1_222 += 4;
                } while (*((u8 *)*(void **)0x801D073C + var_s1_222) != 0);
            }
        }
        if ((*(u8 *)((s8 *)(arg0) + (0x78))) == 5) {
            if (func_0020C24C(arg0) == 0) {
                var_s3_51 = func_0020C478(packet.words[4]);
                temp_v1_299 = (*(s32 *)((s8 *)(var_s3_51) + (0x5C)));
                temp_v0_300 = (*(s32 *)((s8 *)(arg0) + (0x5C)));
                var_s1_301 = temp_v1_299 - temp_v0_300;
                if (var_s1_301 <= 0) {
                    var_s1_301 = temp_v0_300 - temp_v1_299;
                }
                temp_v1_306 = (*(s32 *)((s8 *)(var_s3_51) + (0x64)));
                temp_v0_307 = (*(s32 *)((s8 *)(arg0) + (0x64)));
                var_s0_308 = temp_v1_306 - temp_v0_307;
                if (var_s0_308 <= 0) {
                    var_s0_308 = temp_v0_307 - temp_v1_306;
                }
                var_a0_316 = 3;
                if (func_0020C014(arg0) != 0) {
                    var_a0_316 = 5;
                }
                temp_v0_319 = func_0020BF50(var_a0_316);
                temp_v1_321 = (*(s32 *)((s8 *)(arg0) + (0x5C)));
                sp19C = temp_v0_319;
                var_v0_323 = temp_v0_319 - temp_v1_321;
                if (var_v0_323 <= 0) {
                    var_v0_323 = temp_v1_321 - sp19C;
                }
                sp1A4 = (s32) (var_s0_308 * var_v0_323) / var_s1_301;
                temp_a0_350 = (*(s32 *)((s8 *)(arg0) + (0x64)));
                if ((*(s32 *)((s8 *)(var_s3_51) + (0x54))) < (*(s32 *)((s8 *)(arg0) + (0x54)))) {
                    sp1A4 = temp_a0_350 - sp1A4;
                } else {
                    sp1A4 += temp_a0_350;
                }
                sp184 = func_00222190(arg0, (*(s32 *)((s8 *)(arg0) + (0x5C))), (*(s32 *)((s8 *)(arg0) + (0x64))), sp19C, sp1A4);
                temp_v0_374 = func_0022257C((*(s32 *)((s8 *)(arg0) + (0))) + 0x44, 6U, 0);
                sp18C = temp_v0_374;
                sp184 += temp_v0_374;
            } else {
                goto block_65;
            }
        } else {
block_65:
            if ((*(u8 *)((s8 *)(arg0) + (0x78))) == 3) {
                sp1B7 = func_00201798((*(s32 *)((s8 *)(arg0) + (0x48))), (*(s32 *)((s8 *)(arg0) + (0x4C))), func_00044130((*(u8 *)((s8 *)(arg0) + (0x4B))), (*(u8 *)((s8 *)(arg0) + (0x4F))), func_0020D434((*(s32 *)((s8 *)(arg0) + (0x58)))) & 0xFF) & 0xFF, 0);
                sp17C = func_0022257C((*(s32 *)((s8 *)(arg0) + (0))) + 0x44, sp1B7, &buffer[0]);
            }
        }
    } else {
        buffer[0] = 5;
        sp184 = 0;
    }
    temp_a0_413 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    temp_v1_415 = *sp15C - (buffer[0] + sp184);
    temp_v1_418 = temp_v1_415 & ((s32) ~temp_v1_415 >> 0x1F);
    sp16C = temp_v1_418;
    if (temp_v1_418 < temp_a0_413) {
        sp16C = temp_a0_413;
    }
    var_s5_426 = 0;
    if (packet.words[3] > 0) {
        var_s0_427 = packet.words;
        do {
            temp_a0_429 = (*(s32 *)((s8 *)(var_s0_427) + (0x10)));
            if (temp_a0_429 < 0x14) {
                var_v0_433 = func_0020C478(temp_a0_429);
            } else {
                func_00237D5C(temp_a0_429, &coords.x0, &coords.y0);
                var_v0_433 = func_0020D770(coords.x0, coords.y0);
            }
            temp_v1_444 = (*(s32 *)((s8 *)(var_v0_433) + (0x94)));
            if (sp16C < temp_v1_444) {
                sp16C = temp_v1_444;
            }
            var_s5_426 += 1;
            var_s0_427++;
        } while (var_s5_426 < packet.words[3]);
    }
    var_v1_457 = (*(s32 *)((s8 *)(arg0) + (0x94)));
    if (var_v1_457 < sp16C) {
        var_v1_457 = sp16C;
    }
    (*(s32 *)((s8 *)(arg0) + (0x94))) = var_v1_457;
    var_a1_468 = (*(u32 *)((s8 *)(*(void **)0x801CE8C0) + (0x828)));
    if (var_a1_468 < (u32) var_v1_457) {
        var_a1_468 = (u32) var_v1_457;
    }
    (*(s32 *)((s8 *)(arg0) + (0x94))) = (s32) var_a1_468;
    func_0021D200(0x1C, (s32) var_a1_468, arg0);
    sp16C = (*(s32 *)((s8 *)(arg0) + (0x94)));
    sp174 = sp16C;
    (*(s32 *)((s8 *)(arg0) + (0x6C))) = (s32) ((*(s32 *)((s8 *)(arg0) + (0x6C))) + 1);
    if ((*(s32 *)((s8 *)(arg0) + (0x4C))) == 0xA4) {
        var_a3_492 = 8;
    } else {
        var_a3_492 = sp1C7;
    }
    func_0021D230(0x3E, sp16C, arg0, var_a3_492);
    if (func_0020BFE4() != 0) {
        temp_s0_504 = (*(u8 *)((s8 *)(arg0) + (0x78)));
        if (temp_s0_504 == 5) {
            temp_a2_513 = func_0020D434((*(s32 *)((s8 *)(arg0) + (0x58)))) & 0xFF;
            sp174 = sp16C + sp184;
            temp_s0_523 = func_00044130((*(u8 *)((s8 *)(arg0) + (0x4B))), (*(u8 *)((s8 *)(arg0) + (0x4F))), temp_a2_513);
            func_0021D28C(4, sp16C, arg0, 0xFF, packet.words[4], (s32) temp_s0_504);
            func_0021D25C(5, sp174 - sp18C, arg0, 0xFF, 6);
            emitCode = temp_s0_523 & 0xFF;
            emitExtra = sp1B7;
            var_a1_536 = sp174;
            var_a2_537 = arg0;
            var_a3_540 = 0xFF;
            goto block_97;
        }
        emitCode = func_00044130((*(u8 *)((s8 *)(arg0) + (0x4B))), (*(u8 *)((s8 *)(arg0) + (0x4F))), func_0020D434((*(s32 *)((s8 *)(arg0) + (0x58)))) & 0xFF) & 0xFF;
        emitExtra = sp1B7;
        func_0021D2C0(0xB, sp16C, arg0, 0xFF, emitCode, sp164, emitExtra);
        if ((*(s32 *)((s8 *)(arg0) + (0x48))) == 0x87) {
            var_a1_536 = sp16C;
            var_a2_537 = arg0 + 0xF8;
            var_a3_540 = 0xFF;
            goto block_96;
        }
    } else {
        emitCode = func_00044130((*(u8 *)((s8 *)(arg0) + (0x4B))), (*(u8 *)((s8 *)(arg0) + (0x4F))), func_0020D434((*(s32 *)((s8 *)(arg0) + (0x58)))) & 0xFF) & 0xFF;
        emitExtra = 0;
        func_0021D2C0(0xB, sp16C, arg0, 0, emitCode, sp164, 0);
        if ((*(s32 *)((s8 *)(arg0) + (0x48))) == 0x87) {
            var_a1_536 = sp16C;
            var_a2_537 = arg0 + 0xF8;
            var_a3_540 = 0;
block_96:
block_97:
            func_0021D2C0(0xB, var_a1_536, var_a2_537, var_a3_540, emitCode, sp164, emitExtra);
        }
    }
    temp_v0_611 = *(void **)0x801CE8C0;
    (*(u8 *)((s8 *)(temp_v0_611) + (0x823))) = (u8) ((*(u8 *)((s8 *)(temp_v0_611) + (0x823))) + 1);
    temp_a0_616 = (*(s32 *)((s8 *)(arg0) + (0x68)));
    sp16C += 1;
    if (temp_a0_616 >= 0x2F) {
        sp1D7 = 1;
    } else if (temp_a0_616 >= 0x14) {
        func_00237D5C(temp_a0_616, &coords.x1, &coords.y1);
        temp_s0_635 = func_0020D770(coords.x1, coords.y1);
        if (func_0020C478(packet.words[4]) != temp_s0_635) {
            sp1D7 = 1;
        }
    }
    if (func_0020BFE4() != 0) {
        var_s5_646 = 0;
        if (sp1CC > 0) {
            var_s2_653 = excluded;
            do {
                temp_s0_658 = rand();
                temp_s1_660 = rand();
                temp_a2_668 = *var_s2_653;
                temp_v1_674 = (*(s32 *)((s8 *)(temp_a2_668) + (0x94)));
                var_a1_676 = sp16C + sp184 + buffer[0] + ((((temp_s0_658 << 0x12) & 0x0C000000) | (temp_s1_660 << 0xF) | rand()) % 3);
                if (var_a1_676 < temp_v1_674) {
                    var_a1_676 = temp_v1_674;
                }
                func_0021D230(0x2E, var_a1_676, temp_a2_668, 0xFFU);
                var_s5_646 += 1;
                var_s2_653++;
            } while (var_s5_646 < sp1CC);
        }
    }
    var_s5_693 = 0;
    if (packet.words[3] > 0) {
        sp1FC = packet.words;
        sp1EC = &packet.words[5];
        temp_s7_700 = sp16C + sp184;
        sp1F4 = (s32) sp1C7;
        do {
            temp_s1_706 = &sp1FC[var_s5_693];
            sp1E4 = 0;
            var_s3_51 = func_0020C478((*(s32 *)((s8 *)(temp_s1_706) + (0x10))));
            if (var_s3_51 != 0) {
                if (func_0020C2C0(var_s3_51) != 0) {
                    var_t2_721 = var_s5_693;
                    if (var_s5_693 < (packet.words[3] - 1)) {
                        var_t1_724 = &packet.halves[49 + var_s5_693];
                        var_t0_726 = &(&packet.bytes[86])[var_s5_693];
                        var_a3_728 = var_s5_693 + &packet.bytes[87];
                        var_a2_730 = &packet.halves[29 + var_s5_693];
                        var_a0_733 = temp_s1_706;
                        var_v1_734 = (var_s5_693 * 2) + (u8 *)sp1FC;
                        var_a1_735 = (s32 *)((var_s5_693 * 4) + (u8 *)sp1EC);
                        do {
                            (*(s32 *)((s8 *)(var_a0_733) + (0x10))) = (s32) *var_a1_735;
                            var_a1_735++;
                            var_t2_721 += 1;
                            (*(u16 *)((s8 *)(var_v1_734) + (0x38))) = (u16) *var_a2_730;
                            var_a2_730++;
                            var_a0_733++;
                            *var_t0_726 = *var_a3_728;
                            temp_v0_747 = *var_t1_724;
                            var_a3_728 += 1;
                            var_t1_724++;
                            (*(u16 *)((s8 *)(var_v1_734) + (0x60))) = temp_v0_747;
                            var_t0_726 += 1;
                            var_v1_734 += 2;
                        } while (var_t2_721 < (packet.words[3] - 1));
                    }
                    var_s5_693 -= 1;
                    packet.words[3] -= 1;
                } else {
                    temp_s2_769 = (var_s5_693 * 2) + (u8 *)sp1FC;
                    temp_s8_775 = func_002365BC(arg0, var_s3_51, (*(u16 *)((s8 *)(temp_s2_769) + (0x38))), func_002363FC(var_s3_51));
                    temp_s0_777 = rand();
                    temp_s1_779 = rand();
                    temp_s0_787 = ((temp_s0_777 << 0x12) & 0x0C000000) | (temp_s1_779 << 0xF) | rand();
                    sp1BC = (u32) (*(s16 *)((s8 *)(temp_s2_769) + (0x60)));
                    var_s2_802 = (temp_s0_787 % 100U) < temp_s8_775;
                    if (packet.bytes[2] == 4) {
                        temp_v0_804 = (u16) (*(u16 *)((s8 *)(var_s3_51) + (0x20))) >> 1;
                        sp1BC = temp_v0_804;
                        if (temp_v0_804 == 0) {
                            sp1BC = 1;
                        }
                        if ((s32) sp1BC >= 0x2710) {
                            sp1BC = 0x270F;
                        }
                    }
                    if (packet.bytes[3] == 9) {
                        sp1BC &= 0 - (func_0020C1B4(var_s3_51) == 0);
                    } else if (packet.bytes[3] == 3) {
                        var_s2_802 = func_0020C3B4(var_s3_51) == 0;
                    }
                    if (var_s2_802 != 0) {
                        var_s2_802 = func_002379AC(packet.bytes[1], var_s3_51);
                    }
                    var_s1_844 = 0;
                    coords.value = 0;
                    if (packet.bytes[4] == 8) {
                        coords.value = packet.bytes[5];
                        switch (packet.bytes[7]) {
                        case 4:
                            if (var_s2_802 != 0) {
                                temp_s0_866 = rand();
                                temp_s1_868 = rand();
                                var_s1_844 = (u32) ((((temp_s0_866 << 0x12) & 0x0C000000) | (temp_s1_868 << 0xF) | rand()) % 100) < (u32) ((s32) temp_s8_775 / 2);
                            }
                            break;
                        case 5:
                            var_s1_844 = var_s2_802;
                            break;
                        case 6:
                            if ((var_s2_802 != 0) && ((s32) sp1BC >= (s32) (*(u16 *)((s8 *)(var_s3_51) + (0x20))))) {
                            case 2:
                                var_s1_844 = 1;
                            }
                            break;
                        case 11:
                            if (var_s2_802 != 0) {
                                var_s0_909 = temp_s8_775;
                                temp_s1_911 = rand();
                                temp_s4_913 = rand();
                                temp_a1_915 = rand();
                                if ((s32) var_s0_909 < 0) {
                                    var_s0_909 += 3;
                                }
                                var_s1_844 = (u32) ((((temp_s1_911 << 0x12) & 0x0C000000) | (temp_s4_913 << 0xF) | temp_a1_915) % 100) < (u32) ((s32) var_s0_909 >> 2);
                            }
                            break;
                        }
                        if (var_s1_844 != 0) {
                            var_s1_844 = func_002379AC(coords.value, var_s3_51);
                        }
                    }
                    *(&packet.bytes[116] + var_s5_693) = var_s1_844;
                    do {
                    if (packet.bytes[1] == 1) {
                        if (var_s2_802 != 0) {
                            func_0022A7B8(var_s3_51, 0, temp_s7_700 + buffer[0], sp1BC, sp1F4, 0);
                            var_s0_965 = -1;
                            temp_v1_974 = (*(u8 *)((s8 *)((((func_002014C4((u8)sp164) & 0xFF) * 0x10) + 0x80190000)) + (-0x557F))) & 0xFF;
                            if (coords.value == 3) {
                                var_s0_965 = 0;
                            } else {
                                switch (temp_v1_974) {
                                case 10:
                                    var_s0_965 = 1;
                                    break;
                                case 2:
                                    var_s0_965 = 2;
                                    break;
                                }
                            }
                            var_a0_990 = var_s5_693;
                            if (var_s0_965 != -1) {
                                var_a1_992 = 0;
                                if (var_s5_693 < packet.words[3]) {
                                    temp_v0_997 = &packet.words[var_s5_693];
                                    var_v1_999 = temp_v0_997;
                                    do {
                                        var_a0_990 += 1;
                                        var_a1_992 += (*(s32 *)((s8 *)(temp_v0_997) + (0x10))) == (*(s32 *)((s8 *)(var_v1_999) + (0x10)));
                                        var_v1_999++;
                                    } while (var_a0_990 < packet.words[3]);
                                }
                                if ((var_a1_992 ^ 1) == 0) {
                                    sp1E4 = func_00237AF8(var_s3_51, var_s0_965);
                                }
                            }
                            if ((sp1E4 != 0) && (func_0020C2C0(var_s3_51) == 0) && (func_0020C32C(var_s3_51) == 0)) {
                                func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 0xD, (s32) sp1BC >> 8, (s32) ((u8)sp1BC), sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), (s32) ((u8)sp1E4));
                                func_0023422C(var_s3_51, sp1E4);
                            } else {
                                if (var_s1_844 != 0) {
                                    func_0022B06C(var_s3_51, &coords.value);
                                }
                                func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 0, (s32)sp1BC >> 8, ((u8)sp1BC), sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), var_s1_844 ? coords.value : 0);
                            }
                        } else {
                            temp_v0_1085 = (s32) sp1BC / 2;
                            sp1BC = temp_v0_1085;
                            if (temp_v0_1085 <= 0) {
                                sp1BC = 1;
                            }
                            if ((s32) sp1BC >= 0x2710) {
                                sp1BC = 0x270F;
                            }
                            func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 1, (s32) sp1BC >> 8, (s32) ((u8)sp1BC), sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), 0);
                            func_0022A7B8(var_s3_51, 0, temp_s7_700 + buffer[0], sp1BC, sp1F4, 0);
                        }
                        (*(s32 *)((s8 *)(var_s3_51) + (0x94))) = (s32) (temp_s7_700 + buffer[0]);
                        if ((func_0020C2C0(var_s3_51) != 0) && (func_0020C014(arg0) != 0) && (func_0020C104(arg0) == 0)) {
                            temp_v0_1142 = func_00233210(arg0, var_s3_51);
                            if (temp_v0_1142 != 0) {
                                (*(u8 *)((s8 *)(arg0) + (0x34))) = (u8) ((*(u8 *)((s8 *)(arg0) + (0x34))) + temp_v0_1142);
                                func_0021D230(0x3F, sp174, arg0, temp_v0_1142);
                            }
                        }
                        break;
                    } else if (packet.bytes[1] == 2) {
                        (*(u16 *)((s8 *)(var_s3_51) + (0x20))) = (u16) ((*(u16 *)((s8 *)(var_s3_51) + (0x20))) + func_0020D4C8(var_s3_51, sp1BC));
                        func_0022B06C(var_s3_51, &coords.value);
                        func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 2, (s32)sp1BC >> 8, ((u8)sp1BC), sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), coords.value);
                        (*(s32 *)((s8 *)(var_s3_51) + (0x94))) = (s32) (temp_s7_700 + buffer[0]);
                        break;
                    } else if (packet.bytes[1] == 8) {
                        if (var_s2_802 != 0) {
                            (*(s32 *)((s8 *)(var_s3_51) + (0x40))) = (s32) ((*(s32 *)((s8 *)(var_s3_51) + (0x40))) | 8);
                            if (var_s1_844 != 0) {
                                func_0022B06C(var_s3_51, &coords.value);
                            }
                            var_a1_1205 = temp_s7_700 + buffer[0];
                            var_a3_1183 = 3;
                        } else if ((func_0020C32C(var_s3_51) != 0) || (func_0020C2F4(var_s3_51) != 0) || (func_0020C310(var_s3_51) != 0)) {
                            var_a3_1183 = 0xF;
                            var_a1_1205 = temp_s7_700 + buffer[0];
                        } else {
                            var_a3_1183 = 6;
                            var_a1_1205 = temp_s7_700 + buffer[0];
                        }
                        func_0021D334(0x1F, var_a1_1205, var_s3_51, var_a3_1183, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), var_a3_1183 == 0xF ? 0xD : (var_a3_1183 == 6 ? 0 : (var_s1_844 ? coords.value : 0)));
                        (*(s32 *)((s8 *)var_s3_51 + 0x94)) = temp_s7_700 + buffer[0];
                        break;
                    } else if (packet.bytes[1] == 10) {
                        if (var_s2_802 != 0) {
                            (*(s32 *)((s8 *)(var_s3_51) + (0x40))) = (s32) ((*(s32 *)((s8 *)(var_s3_51) + (0x40))) | 0x10);
                            func_0021D7CC(var_s3_51);
                            if (var_s1_844 != 0) {
                                func_0022B06C(var_s3_51, &coords.value);
                            }
                            var_a1_1205 = temp_s7_700 + buffer[0];
                            var_a3_1183 = 7;
                        } else if ((func_0020C32C(var_s3_51) != 0) || (func_0020C2F4(var_s3_51) != 0) || (func_0020C310(var_s3_51) != 0)) {
                            var_a3_1183 = 0xF;
                            var_a1_1205 = temp_s7_700 + buffer[0];
                        } else {
                            var_a3_1183 = 6;
                            var_a1_1205 = temp_s7_700 + buffer[0];
                        }
                        func_0021D334(0x1F, var_a1_1205, var_s3_51, var_a3_1183, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), var_a3_1183 == 0xF ? 0xD : (var_a3_1183 == 6 ? 0 : (var_s1_844 ? coords.value : 0)));
                        (*(s32 *)((s8 *)var_s3_51 + 0x94)) = temp_s7_700 + buffer[0];
                        break;
                    } else if (packet.bytes[1] == 4) {
                        if (var_s2_802 != 0) {
                            (*(s32 *)((s8 *)(var_s3_51) + (0x40))) = (s32) ((*(s32 *)((s8 *)(var_s3_51) + (0x40))) | 4);
                            if (var_s1_844 != 0) {
                                func_0022B06C(var_s3_51, &coords.value);
                            }
                            var_a1_1205 = temp_s7_700 + buffer[0];
                            var_a3_1183 = 4;
                        } else if ((func_0020C32C(var_s3_51) != 0) || (func_0020C2F4(var_s3_51) != 0) || (func_0020C310(var_s3_51) != 0)) {
                            var_a3_1183 = 0xF;
                            var_a1_1205 = temp_s7_700 + buffer[0];
                        } else {
block_249:
                            func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 6, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), coords.value);
                            (*(s32 *)((s8 *)var_s3_51 + 0x94)) = temp_s7_700 + buffer[0];
                            break;
                        }
                        func_0021D334(0x1F, var_a1_1205, var_s3_51, var_a3_1183, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), var_a3_1183 == 0xF ? 0xD : (var_a3_1183 == 6 ? 0 : (var_s1_844 ? coords.value : 0)));
                        (*(s32 *)((s8 *)var_s3_51 + 0x94)) = temp_s7_700 + buffer[0];
                        break;
                    } else if (packet.bytes[1] == 3) {
                        if (var_s2_802 != 0) {
                            temp_v0_1409 = func_00237AF8(var_s3_51, 0);
                            sp1E4 = temp_v0_1409;
                            if (temp_v0_1409 != 0) {
                                func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 0xE, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), (s32) ((u8)sp1E4));
                                func_0023422C(var_s3_51, sp1E4);
                            } else {
                                (*(s32 *)((s8 *)(var_s3_51) + (0x40))) = (s32) ((*(s32 *)((s8 *)(var_s3_51) + (0x40))) | 2);
                                if (var_s1_844 != 0) {
                                    func_0022B06C(var_s3_51, &coords.value);
                                }
                                func_0021D334(0x1F, temp_s7_700 + buffer[0], var_s3_51, 0xB, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), var_s1_844 ? coords.value : 0);
                            }
                            (*(s32 *)((s8 *)(var_s3_51) + (0x94))) = (s32) (temp_s7_700 + buffer[0]);
                            temp_v0_1467 = func_002224F4();
                            (*(s16 *)((s8 *)(*(void **)0x801CE8BC) + (0x606A))) = temp_v0_1467;
                            var_s1_1474 = 0;
                            if (temp_v0_1467 & 0xFFFF) {
loop_241:
                                temp_v0_1476 = func_0020C478(var_s1_1474);
                                var_s1_1474 += 1;
                                if (func_0020C2C0(temp_v0_1476) == 0) {
                                    (*(s32 *)((s8 *)(temp_v0_1476) + (0x6C))) = (s32) (*(s32 *)((s8 *)(temp_v0_1476) + (0x70)));
                                }
                                if (var_s1_1474 < 0x14) {
                                    goto loop_241;
                                }
                            }
                        } else {
                            if ((func_0020C32C(var_s3_51) != 0) || (func_0020C2F4(var_s3_51) != 0) || (func_0020C310(var_s3_51) != 0)) {
                                var_a3_1183 = 0xF;
                                var_a1_1205 = temp_s7_700 + buffer[0];
                            } else {
                                goto block_249;
                            }
                            func_0021D334(0x1F, var_a1_1205, var_s3_51, var_a3_1183, 0, 0, sp1F4, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), var_a3_1183 == 0xF ? 0xD : (var_a3_1183 == 6 ? 0 : (var_s1_844 ? coords.value : 0)));
                        (*(s32 *)((s8 *)var_s3_51 + 0x94)) = temp_s7_700 + buffer[0];
                        break;
                        }
                        break;
                                        }
                    } while (0);
                    temp_v1_1544 = (*(s32 *)((s8 *)(var_s3_51) + (0x94)));
                    if (sp1AC < temp_v1_1544) {
                        sp1AC = temp_v1_1544;
                    }
                }
            }
            var_s5_693 += 1;
        } while (var_s5_693 < packet.words[3]);
    }
    if (packet.bytes[4] == 0xB) {
        if (packet.bytes[5] == 1) {
            temp_v0_1568 = func_00237750(arg0, var_s3_51, 1, sp1BC, 0);
            sp1BC = temp_v0_1568;
            temp_s0_1586 = sp16C + sp184;
            func_0021D334(0x1F, temp_s0_1586 + buffer[0], arg0, 0, temp_v0_1568 >> 8, (s32) ((u8)sp1BC), (s32) sp1C7, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), 0);
            func_0022A7B8(arg0, 0, temp_s0_1586 + buffer[0], (u32) sp1BC, (s32) sp1C7, 0);
        } else if (packet.bytes[5] == 2) {
            temp_v0_1607 = func_00237750(arg0, var_s3_51, 1, (u32) sp1BC, 0);
            sp1BC = temp_v0_1607;
            func_0021D334(0x1F, sp16C + sp184 + buffer[0], arg0, 2, temp_v0_1607 >> 8, (s32) ((u8)sp1BC), (s32) sp1C7, (s32) (*(u8 *)((s8 *)(*(void **)0x801CE8C0) + (0x823))), 0);
            (*(u16 *)((s8 *)(arg0) + (0x20))) = (u16) ((*(u16 *)((s8 *)(arg0) + (0x20))) + func_0020D4C8(arg0, (u32) sp1BC));
        }
    }
    var_a2_1641 = 0;
    pair[0] = func_0020D72C(arg0);
    sp16C -= 1;
    if (((u32) (packet.bytes[8] - 8) >= 2U) && ((packet.bytes[8] & 0xFF) != 0xA) && (sp1D7 != 0)) {
        var_a2_1641 = 1;
        effects[0] = 0;
        ids[0] = (*(s32 *)((s8 *)(arg0) + (0x68)));
    }
    for (var_s5_1662 = 0; var_s5_1662 < packet.words[3]; var_s5_1662++) {
        ids[var_a2_1641 + var_s5_1662] = packet.words[4 + var_s5_1662];
        effects[var_a2_1641 + var_s5_1662] = packet.bytes[116 + var_s5_1662];
        var_a2_1641++;
    }
    effects[var_a2_1641] = -1;
    ids[var_a2_1641] = -1;
    pair[1] = -1;
    temp_s0_1700 = sp16C + sp184;
    func_0021D2C0(0x16, temp_s0_1700 + buffer[0], 0, sp164, (s32) &pair[0], (s32) &ids[0], (s32)&effects[0]);
    if ((func_0020BFE4() != 0) && ((*(u8 *)((s8 *)(arg0) + (0x78))) == 5) && (func_0020C24C(arg0) == 0)) {
        sp194 = func_00222344(arg0, sp19C, sp1A4, (*(s32 *)((s8 *)(arg0) + (0x5C))), (*(s32 *)((s8 *)(arg0) + (0x64))));
        func_0021D28C(0xA, temp_s0_1700 + sp17C, arg0, 0xFF, 0xB, sp194);
        sp194 += func_0022257C((*(s32 *)((s8 *)(arg0) + (0))) + 0x44, 0xCU, 0);
    }
    temp_v1_1746 = sp16C + sp184 + buffer[0];
    if (sp1AC < temp_v1_1746) {
        sp1AC = temp_v1_1746;
    }
    (*(s32 *)((s8 *)(arg0) + (0x84))) = (s32) (sp184 + buffer[0]);
    temp_v1_1762 = ((sp1AC - sp16C) - sp184) - buffer[0];
    if (sp17C < temp_v1_1762) {
        (*(s32 *)((s8 *)(arg0) + (0x88))) = temp_v1_1762;
    } else {
        (*(s32 *)((s8 *)(arg0) + (0x88))) = sp17C;
    }
    (*(s32 *)((s8 *)(arg0) + (0x8C))) = sp194;
    temp_v0_1776 = sp16C + sp184 + buffer[0] + (*(s32 *)((s8 *)(arg0) + (0x88)));
    (*(s32 *)((s8 *)(arg0) + (0x94))) = temp_v0_1776;
    temp_v0_1779 = temp_v0_1776 + 0x200;
    *sp15C = temp_v0_1779;
    temp_v1_1782 = *(void **)0x801CE8C0;
    (*(u32 *)((s8 *)(temp_v1_1782) + (0x828))) = (u32) temp_v0_1779;
    func_0021D230(0x20, *sp15C, 0, (*(u8 *)((s8 *)(temp_v1_1782) + (0x823))));
    sp16C = *sp15C;
    if (func_0020BFE4() != 0) {
        var_s5_1797 = 0;
        if (sp1CC > 0) {
            var_s2_1801 = excluded;
            do {
                temp_s0_1806 = rand();
                temp_s1_1808 = rand();
                temp_s1_1826 = *sp15C + ((((temp_s0_1806 << 0x12) & 0x0C000000) | (temp_s1_1808 << 0xF) | rand()) % 6);
                func_0021D230(0x2F, temp_s1_1826, *var_s2_1801, 0xFFU);
                (*(s32 *)((u8 *)*var_s2_1801 + 0x94)) = temp_s1_1826 + 0xA;
                temp_v1_1834 = (*(s32 *)((u8 *)*var_s2_1801 + 0x94));
                if (sp16C < temp_v1_1834) {
                    sp16C = temp_v1_1834;
                }
                var_s5_1797 += 1;
                var_s2_1801++;
            } while (var_s5_1797 < sp1CC);
        }
    }
    *sp15C = sp16C;
    return 1;
}
