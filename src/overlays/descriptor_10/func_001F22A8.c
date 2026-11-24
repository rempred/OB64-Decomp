typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk0[4];
    s16 flag;
} Opt1F;
extern Opt1F D_801CE900[];
extern u8 D_801939CC;
void bzero(void *p, s32 n);
s32 D_8016FEF4(s32 flag);
void D_8017C4B4(s16 a);
void D_80179034(s32 a, s32 x, s32 y);
extern inline Opt1F *func_001F21A4(s32 i) {
    if (D_8016FEF4(D_801CE900[i].flag) && ((D_801939CC >> i) & 1)) {
        return &D_801CE900[i];
    }
    return ((void *)0);
}
s32 D_8016E440(u8 id);
void D_8017CBE8(u8 *w, void *unit);
void D_801818A0(s32 x, s32 y);
typedef struct {
    u8 unk000[0x600];
    u32 status;
} LabelUnit1F;
void func_001F22A8(u8 *o, s32 sel) {
    LabelUnit1F unit;
    u32 i;
    s32 x;
    s32 y;
    Opt1F *opt;
    D_8017C4B4(((s16 *)(o + 0x18))[sel]);
    x = (*(s32 *)((u8 *)(o) + (0x2C))) + 0x16;
    y = (*(s32 *)((u8 *)(o) + (0x30))) + 5;
    for (i = 0; i < 6; i++) {
        opt = func_001F21A4(i);
        if (opt != ((void *)0)) {
            D_80179034(D_8016E440(D_801CE900[i].unk0[2]), x, y);
            y += 0xE;
        }
    }
    D_801818A0((*(s32 *)((u8 *)(o) + (0x2C))), (s8)o[0x22] * 0xE + (*(s32 *)((u8 *)(o) + (0x30))) + 8);
    bzero(&unit, sizeof(unit));
    unit.status = 0x20000;
    D_8017CBE8(o, &unit);
}
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
