typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern signed char *D_801ED428;
extern signed char *D_801ED42C;
extern u16 D_801F0B50;
void D_8017C4B4(u32);
signed char *D_8016F5B0(u16);
signed char *D_8016F4E0(u16);
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void D_80179034(signed char *s, s32 x, s32 y);
void func_001AF754(u8 *o, s32 k);
void bzero(void *p, s32 n);
void func_001AF754(u8 *o, s32 k) {
    signed char buf[0x80];
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        Gfx *g = gTitleCardDisplayListCursor;
        u16 id;
        signed char *s;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        gTitleCardDisplayListCursor = g + 1;
        D_8017C4B4(e[0xC]);
        bzero(buf, 0x20);
        id = D_801F0B50;
        if (id != 0) {
            signed char *name;
            if (id & 0x8000) {
                name = D_8016F5B0(id & 0x7FFF);
            } else {
                name = D_8016F4E0(id);
            }
            func_000238B0(buf, D_801ED428, name);
            s = buf;
        } else {
            s = D_801ED42C;
        }
        D_80179034(s, x + 5, y + 2);
    }
}
