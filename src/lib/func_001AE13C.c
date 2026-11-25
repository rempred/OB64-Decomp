typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void D_8017C4B4(u32);
s32 func_000238B0(signed char *buf, const signed char *fmt, ...);
void D_80179034(signed char *s, s32 x, s32 y);
extern u8 g_func_001957D0_source_records[][25];
extern u8 D_80195560_copy[][0x34];
typedef struct {
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 rest[0x12];
} Squad1A9;
extern u8 D_8021E383;
extern u8 D_8021E384;
extern u8 D_8021E385;
extern signed char *D_801ED430;
extern signed char *D_801ED434;
extern signed char *D_801ED438;
void bzero(void *p, s32 n);
void func_001AE13C(u8 *o, s32 k) {
    signed char buf[0x80];
    s16 *e = (s16 *)(k * 2 + (s32)o);
    if (e[0xC] != 0) {
        s32 x = (*(s32 *)((u8 *)(o) + (0x2C)));
        s32 y = (*(s32 *)((u8 *)(o) + (0x30)));
        Gfx *g = gTitleCardDisplayListCursor;
        g->w0 = 0xE7000000;
        g->w1 = 0;
        gTitleCardDisplayListCursor = g + 1;
        D_8017C4B4(e[0xC]);
        bzero(buf, 0x20);
        if (D_8021E383 != 0) {
            u8 *m = ((Squad1A9 *)g_func_001957D0_source_records)[D_8021E384].members;
            func_000238B0(buf, D_801ED430, &D_80195560_copy[m[D_8021E385]]);
            D_80179034(buf, x + 4, y + 2);
            D_80179034(D_801ED434, x + 4, y + 0x12);
        } else {
            D_80179034(D_801ED438, x + 5, y + 2);
        }
    }
}
