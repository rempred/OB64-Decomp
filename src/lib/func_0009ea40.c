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
void func_00087dec(void *pal, void *img, u16 w, u16 h);
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
void func_00087200(void *a, s32 y, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_00087dec(void *pal, void *img, u16 w, u16 h);
void func_0009ea40(s32 unused, WinG87 *w, u8 k) {
    s16 alpha = w->alpha[k];
    s32 x = w->x;
    s32 y = w->y;
    Slot87 *sl;
    if (alpha == 0) {
        return;
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (alpha | 0xFFFFFF00); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3000C00); _g->w1 = (0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001201); _g->w1 = (0); };
    if (alpha == 0xFF) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0xF0A7008); };
    } else {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504240); };
    }
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xFC119623); _g->words.w1 = (0xFF2FFFFF); };
    sl = &((Main87 *)D_80196AF8)->slot[((Main87 *)D_80196AF8)->slotSel];
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xED000000); _g->words.w1 = (0x4FC3BC); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE3001001); _g->words.w1 = (0x8000); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x5A0, ((Res87 *)D_80196AF8)->img + 0x4778, 0x20, 0x1B, 2);
    func_00087200((void *)x, y, 0x77);
    func_00087200((void *)(x + 0x56), y, 0x78);
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x5A0, ((Res87 *)D_80196AF8)->img + 0x4928, 0x10, 0x1B, 0xC);
    func_00087200((void *)(x + 0x1A), y, 0x79);
    func_00087b30(((Main87 *)D_80196AF8)->p3C, ((Main87 *)D_80196AF8)->p54 + sl->e[((Main87 *)D_80196AF8)->cur78].f * 0x1A0, 0x40, 0xD, 2);
    func_00087200((void *)(x + 0x18), y + 6, 0x58);
    func_00087dec(((Main87 *)D_80196AF8)->p30, ((Main87 *)D_80196AF8)->p50 + (sl->e[((Main87 *)D_80196AF8)->cur78].f << 8), 0x10, 0x10);
    func_00087200((void *)(x + 5), y + 5, 0x1B);
}
