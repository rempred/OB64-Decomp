typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
typedef struct BattleUnit {
    struct BattleObj *obj;
    u8 unk04[0x1C];
    u16 hp;
    u16 maxHp;
    u16 str;
    u16 vit;
    u16 agi;
    u16 unk2A;
    u16 intel;
    u16 dex;
    u8 unk30;
    u8 unk31[2];
    u8 unk33;
    u8 unk34[2];
    u16 items[4];
    u8 unk3E;
    u8 unk3F;
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    s32 unk50;
    s32 lane;
    s32 unk58;
    u8 unk5C[0xC];
    s32 target;
    s32 actsUsed;
    s32 actsMax;
    u8 unk74[4];
    u8 actionKind;
    u8 unk79[3];
    s32 attack;
    s32 unk80;
    u8 unk84[0x10];
    s32 unk94;
    u8 unk98[0x60];
} BattleUnit;
s32 func_0002CBCC(void);
s32 D_801C8C3C(BattleUnit *u);
s32 D_801C8E30(BattleUnit *u);
s32 func_002337E4(BattleUnit **out, s32 start, s32 lane);
BattleUnit *D_801CA2E0(s32 lane, s32 row);
s32 func_002337E4(BattleUnit **out, s32 start, s32 lane) {
    BattleUnit **p;
    BattleUnit *c;
    BattleUnit *r;
    BattleUnit *l;
    s32 n;
    s32 row;
    s32 far;
    n = 0;
    l = ((void *)0);
    r = ((void *)0);
    c = ((void *)0);
    row = start;
    p = out;
    for (;;) {
        if (c == ((void *)0)) {
            c = D_801CA2E0(lane, row);
            if (D_801C8E30(c) || D_801C8C3C(c)) {
                c = ((void *)0);
            }
            if (c != ((void *)0)) {
                *p++ = c;
                n++;
            }
        }
        if (r == ((void *)0) && l == ((void *)0)) {
            r = D_801CA2E0(lane + 1, row);
            l = D_801CA2E0(lane - 1, row);
            if (D_801C8E30(r) || D_801C8C3C(r)) {
                r = ((void *)0);
            }
            if (D_801C8E30(l) || D_801C8C3C(l)) {
                l = ((void *)0);
            }
            if (r != ((void *)0) && l != ((void *)0)) {
                if (func_0002CBCC() & 1) {
                    *p++ = r;
                    *p++ = l;
                } else {
                    *p++ = l;
                    *p++ = r;
                }
                n += 2;
            } else if (r != ((void *)0)) {
                *p++ = r;
                n++;
            } else if (l != ((void *)0)) {
                *p++ = l;
                n++;
            }
        } else if (r == ((void *)0)) {
            r = D_801CA2E0(lane + 1, row);
            if (D_801C8E30(r) || D_801C8C3C(r)) {
                r = ((void *)0);
            }
            if (r != ((void *)0)) {
                *p++ = r;
                n++;
            }
        } else if (l == ((void *)0)) {
            l = D_801CA2E0(lane - 1, row);
            if (D_801C8E30(l) || D_801C8C3C(l)) {
                l = ((void *)0);
            }
            if (l != ((void *)0)) {
                *p++ = l;
                n++;
            }
        }
        if (c != ((void *)0) && r != ((void *)0) && l != ((void *)0)) {
            break;
        }
        if (start == 0) {
            if (++row >= 3) {
                break;
            }
        } else if (start == 2) {
            if (--row < 0) {
                break;
            }
        } else if (start == 6) {
            if (++row >= 9) {
                break;
            }
        } else if (--row < 6) {
            break;
        }
    }
    if (n == 0 && lane != 1) {
        far = lane == 0 ? 2 : 0;
        row = start;
        for (;;) {
            c = D_801CA2E0(far, row);
            if (D_801C8E30(c) || D_801C8C3C(c)) {
                c = ((void *)0);
            }
            if (c != ((void *)0)) {
                out[n] = c;
                n++;
                break;
            }
            if (start == 0) {
                if (++row >= 3) {
                    break;
                }
            } else if (start == 2) {
                if (--row < 0) {
                    break;
                }
            } else if (start == 6) {
                if (++row >= 9) {
                    break;
                }
            } else if (--row < 6) {
                break;
            }
        }
    }
    return n;
}
