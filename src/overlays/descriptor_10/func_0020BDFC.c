typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x36];
    u16 items[4];
    u8 unk3E[2];
    u32 flags;
    u8 unk44[4];
    s32 unk48;
    s32 cls;
    u8 unk50[4];
    s32 unk54;
    s32 unk58;
    u8 unk5C[0x14];
    s32 actsMax;
} BattleUnit;
typedef struct {
    s32 (*f0)(void);
    void (*f1)(void);
    void (*f2)(void);
    void (*f3)(s16);
    void (*f4)(s16);
    s32 (*f5)(BattleUnit *u);
} BattleCallbacks;
extern BattleCallbacks *D_801D0810;
u8 func_0020D434(s32 idx);
u8 D_8016E230(u8 a, u8 cls, u8 c);
u8 D_8016E458(u8 a);
u8 D_8016E470(u8 a, u16 i0, u16 i1, u16 i2, u16 i3);
void D_8016E50C(u8 *a, u8 b, u8 cls, u8 c, u8 d, u16 i0, u16 i1, u16 i2, u16 i3);
u8 D_8016F5E0(u16 id);
s32 func_0020BDFC(BattleUnit *u) {
    u8 a;
    u8 k;
    u8 t;
    if (D_801D0810->f5 != ((void *)0)) {
        return D_801D0810->f5(u);
    }
    if (u->unk48 == 0x101) {
        return u->unk00[0x33];
    }
    a = D_8016E230(u->unk48, u->cls, func_0020D434(u->unk58));
    k = D_8016E458(a);
    if ((u8)(k - 3) < 2 || k == 5) {
        if ((u8)(a - 0x31) < 2) {
            return u->unk00[0x33];
        }
        if (a == 0x91) {
            t = D_8016F5E0(func_0020C448(u));
            if (t >= 15) {
                return u->unk00[0x33];
            }
            return t;
        }
        D_8016E50C(&a, u->unk48, u->cls, a, u->unk00[0x33], u->items[0], u->items[1], u->items[2], u->items[3]);
    }
    return D_8016E470(a, u->items[0], u->items[1], u->items[2], u->items[3]);
}
u16 func_0020C448(BattleUnit *u);
u8 func_0020D434(s32 idx);
