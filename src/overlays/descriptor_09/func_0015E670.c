typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern signed char D_80214A58[];
extern signed char D_80214A5C[];
extern s32 D_80214F4C;
void D_8017C4B4(u32);
void D_80179034(signed char *s, s32 x, s32 y);
void D_801818A0(s32 x, s32 y);
void func_0015E670(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        u8 b = o[0x22];
        Gfx *g = gTitleCardDisplayListCursor;
        s32 dy;
        s32 c;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        gTitleCardDisplayListCursor = g + 1;
        dy = (b & 1) * 14 + 4;
        D_8017C4B4(e[0xC]);
        D_80179034(D_80214A58, x + 0x15, y + 2);
        D_80179034(D_80214A5C, x + 0x15, y + 0xE);
        {
            s32 d = D_80214F4C;
            if (d < 4) {
                c = d;
            } else {
                c = 7 - d;
            }
        }
        D_801818A0(x + c - 2, y + dy);
    }
}
