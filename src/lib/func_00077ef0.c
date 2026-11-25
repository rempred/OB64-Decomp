typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_8019780C;
void D_8017C4B4(u32);
void D_80179034(signed char *s, s32 x, s32 y);
void func_0007819c(u8 *s, s32 b, u8 cycle);
typedef struct {
    signed char *s[4];
} Help712;
extern Help712 D_801A1ACC[];
void func_00077ef0(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        s32 m;
        s32 t;
        s32 big = 100;
        D_8017C4B4(e[0xC]);
        t = (*(s32 *)((u8 *)(D_8019780C) + (0x3C)));
        m = 0;
        if (t != big) {
            m = t == 0x74;
        }
        D_80179034(D_801A1ACC[m].s[0], x + 4, y + 1);
        D_80179034(D_801A1ACC[m].s[1], x + 8, y + 0x10);
        D_80179034(D_801A1ACC[m].s[2], x + 8, y + 0x1F);
        if (D_801A1ACC[m].s[3] != ((void *)0)) {
            D_80179034(D_801A1ACC[m].s[3], x + 8, y + 0x2E);
        }
        t = (*(s32 *)((u8 *)(D_8019780C) + (0x3C)));
        if (t == big) {
            goto draw;
        }
        if (t == 0x74) {
        draw:
            {
                s32 row = (*(s32 *)((u8 *)(D_8019780C) + (0x4C))) * 15 + 0x12;
                func_0007819c((u8 *)(x + 4), y + row, ((*(u32 *)((u8 *)(D_8019780C) + (0))) & 0xFFFF0001) == 0x20001);
            }
        }
    }
}
void func_0007819c(u8 *s, s32 b, u8 cycle);
