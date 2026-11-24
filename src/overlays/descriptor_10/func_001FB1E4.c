typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 *spr;
    u8 unk04[0x2C];
    u8 *spr2;
    u8 unk34[0x2C];
    u8 *units;
    u32 nUnits;
    u8 *objs;
    void *buf6C;
    u32 nObjs;
    s32 unk74;
    void *buf78;
    void *buf7C;
    void *buf80;
    u8 unk84[0x1C];
} State1F8;
extern State1F8 D_801D0770;
typedef struct SprPart1F8 {
    s16 x;
    s16 y;
    u16 w;
    u16 h;
    u8 unk8[4];
    struct SprPart1F8 *next;
} SprPart1F8;
extern inline void Spr1F8_PartsBox(s32 *r) {
    u8 *s = (D_801D0770.spr);
    SprPart1F8 *p;
    s32 i;
    r[0] = 9999;
    r[1] = 9999;
    r[2] = -9999;
    r[3] = -9999;
    p = (SprPart1F8 *)(s + 8);
    for (i = 0; i < s[3]; i++) {
        if (p->x < r[0]) {
            r[0] = p->x;
        }
        if (r[2] < p->x + p->w) {
            r[2] = p->x + p->w;
        }
        if (p->y < r[1]) {
            r[1] = p->y;
        }
        if (r[3] < p->y + p->h) {
            r[3] = p->y + p->h;
        }
        p = p->next;
    }
}
void func_001FB1E4(s32 *r) {
    u8 *s = (D_801D0770.spr);
    if (s == ((void *)0)) {
        r[0] = 0;
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
    } else if ((D_801D0770.spr)[0] == '6' && (D_801D0770.spr)[1] == '4') {
        r[0] = -(*(u16 *)((u8 *)(s) + (4))) / 2;
        r[2] = (*(u16 *)((u8 *)(s) + (4))) >> 1;
        r[1] = -(*(u16 *)((u8 *)(s) + (6))) / 2;
        r[3] = (*(u16 *)((u8 *)(s) + (6))) >> 1;
    } else {
        Spr1F8_PartsBox(r);
    }
}
