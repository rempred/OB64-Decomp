typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_8017C4B4(u32);
void D_801793AC(s32 a, s32 x, s32 y);
void D_8017CBE8(u8 *o, u8 *p);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_002935F8(s16 x, s16 y, u8 a);
void func_0029739C(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        u8 *w = (*(u8 * *)((u8 *)(o) + (0xD0)));
        s32 i;
        D_8017C4B4(e[0xC]);
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFA000000;
            _g->w1 = ((u8 *)e)[0x19] | 0xC8C8C800;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFC11FE23;
            _g->w1 = 0xFFFFF3F9;
        }
        for (i = 0; i < w[0x5F4]; i++) {
            s32 j = w[0x5F1] + i;
            if (j < w[0x5F5]) {
                s32 dy = i * w[0x5F6];
                dy += 2;
                D_801793AC(((s32 *)((*(u8 * *)((u8 *)(o) + (0xD0))) + 0x530))[j], x + 0x2B, y + dy);
            }
        }
        func_002935F8(x, y, o[k * 2 + 0x19]);
        D_8017CBE8(o, w);
    }
}
