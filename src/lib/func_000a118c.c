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
extern u8 *D_80196AF8;
typedef struct {
    u8 pad0[4];
    u8 *img;
    u8 *pal;
} Res87;
void func_000885a8(s32 x, s32 y, s32 v, s32 w);
void D_80179034(signed char *s, s32 x, s32 y);
extern u8 D_060047A0[];
typedef union {
    struct {
        u32 w0;
        u32 w1;
    } words;
    long long force_align[1];
} GfxU87;
typedef struct {
    u8 pad0[0xC];
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    u8 pad1C[0xE0 - 0x1C];
    s16 alpha[1];
} WinG87;
typedef struct {
    u8 pad0[4];
    struct Ent87 {
        s16 x;
        s16 y;
        u8 f;
        u8 pad[5];
    } e[8];
    s32 n;
    s32 id;
} Slot87;
typedef struct {
    u8 pad0[0x1C];
    u8 *p1C;
    u8 pad20[0x2C - 0x20];
    u8 *p2C;
    u8 *p30;
    void *p34[2];
    u8 *p3C;
    void *p40[2];
    u8 pad48[8];
    u8 *p50;
    u8 *p54;
    u8 *p58;
    u8 pad5C[0x64 - 0x5C];
    u8 *p64;
    u8 pad68[0x78 - 0x68];
    s32 cur78;
    u8 pad7C[0x18C - 0x7C];
    u16 sq18C;
    u16 row18E;
    u8 pad190[0x198 - 0x190];
    u16 col198;
    u8 pad19A[0x19E - 0x19A];
    u16 col19E;
    u8 pad1A0[0x5E8 - 0x1A0];
    u16 cls5E8;
    u8 pad5EA[0x10A4 - 0x5EA];
    struct Mk87 {
        u8 pad0[4];
        u8 shown;
        u8 kind;
        u8 pad6[2];
        s32 x;
        s32 y;
    } mk[3];
    struct Row87 {
        u8 h[2];
        u8 sq[5];
        u8 entry;
        u8 pad8[2];
        u8 item;
        u8 padB[3];
    } rows[10];
    u8 pad1160[0x117C - 0x1160];
    struct Sq87 {
        u8 num;
        u8 flags;
        u8 row;
        u8 lead;
        u8 mem[0x1D - 4];
        u8 item;
        u8 name;
        u8 pad1F;
        u8 cnt;
        u8 pad21;
        u16 icon[10];
    } sq[1];
    u8 pad11B2[0x1AB8 - 0x11B2];
    Slot87 slot[2];
    u8 pad1B70[0x1BD0 - 0x1B70];
    s32 slotSel;
    s32 mode1BD4;
    u8 sel;
    u8 pad1BD9[0x1BF6 - 0x1BD9];
    u16 v1BF6;
    u8 pad1BF8[2];
    u16 v1BFA;
} Main87;
extern u8 D_80193BC0_copy[];
void func_0008acf0(s32 x, s32 y, s32 alpha, s32 f);
u16 func_000bd0d8(u16 m);
void func_00087200(void *a, s32 y, s32 k);
void func_000885a8(s32 x, s32 y, s32 v, s32 w);
void func_0008d66c(u8 k, s32 x, s32 y);
void func_0008d8ec(s32 x, s32 y, u16 k, s32 sel);
void func_000a118c(s32 unused, WinG87 *w, u8 k) {
    s16 alpha = w->alpha[k];
    s32 x;
    s32 y;
    s32 sq;
    if (alpha == 0) {
        return;
    }
    x = w->x;
    y = w->y;
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (alpha | 0xFFFFFF00); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000C00); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001201); _g->w1 = (0); };
    if (alpha == 0xFF) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0xF0A7008); };
    } else {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504240); };
    }
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xFC119623); _g->words.w1 = (0xFF2FFFFF); };
    {
        Main87 *r = (Main87 *)(D_80196AF8 + ((Main87 *)D_80196AF8)->row18E * 14);
        sq = r->rows[0].sq[((Main87 *)D_80196AF8)->col198];
    }
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xDE000000); _g->words.w1 = ((u32)D_060047A0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xFD500000); _g->words.w1 = ((u32)(((Res87 *)D_80196AF8)->img + 0x948)); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF5500000); _g->words.w1 = (0x7000000); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE6000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF3000000); _g->words.w1 = (0x73FF200); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF5400800); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xF2000000); _g->words.w1 = (0xFC0FC); };
    if (sq == 0xFF) {
        func_0008acf0(x, y + 4, w->alpha[k], 0);
        func_0008d8ec(x + 0x6E, y + 4, ((Main87 *)D_80196AF8)->rows[((Main87 *)D_80196AF8)->row18E].entry, ((Main87 *)D_80196AF8)->col198);
        return;
    }
    func_00087200((void *)(x + 4), y + 4, 4);
    func_00087200((void *)(x + 0x17), y + 4, 0);
    func_000885a8(x + 0x2C, y + 4, ((Main87 *)D_80196AF8)->sq[sq].num, 2);
    func_0008d66c(((Main87 *)D_80196AF8)->rows[((Main87 *)D_80196AF8)->row18E].item, x + 0x5C, y + 0x20);
    if (((Main87 *)D_80196AF8)->sq[sq].row != 0xFF) {
        u16 r = func_000bd0d8(sq);
        func_0008d8ec(x + 0x6E, y + 4, ((Main87 *)D_80196AF8)->rows[((Main87 *)D_80196AF8)->sq[sq].row].entry, r);
    }
    D_80179034((signed char *)&D_80193BC0_copy[((Main87 *)D_80196AF8)->sq[sq].mem[((Main87 *)D_80196AF8)->sq[sq].lead] * 56], x + 4, y + 0xC);
}
