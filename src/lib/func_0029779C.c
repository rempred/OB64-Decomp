typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
void D_8017C4B4(u32);
void D_801793AC(s32 a, s32 x, s32 y);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_002935F8(s16 x, s16 y, u8 a);
u8 D_8016CD30(void);
void func_0029779C(u8 *o, s32 k) {
    s16 *e = (s16 *)(k * 2 + (s32)o);
    s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
    s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
    if (e[0xC] != 0) {
        u8 *w = (*(u8 * *)((u8 *)(o) + (0xD0)));
        s32 i;
        D_8017C4B4(e[0xC]);
        if (D_8016CD30() == 1) {
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
        }
        for (i = 0; i < w[0x5F5]; i++) {
            s32 id = ((s32 *)((*(u8 * *)((u8 *)(o) + (0xD0))) + 0x530))[w[0x5F1] + i];
            s32 dy = i * 17 + 8;
            if (i < 3) {
                do {
                    D_801793AC(id, x + 0x36, y + dy);
                } while (0);
            } else if (i < 7) {
                D_801793AC(id, x + 2, y + dy);
            }
        }
    } else {
        D_8017C4B4(0);
    }
    func_002935F8(x + 10, y + 8, 0xFF);
}
