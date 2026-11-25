typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    signed char *name;
    u8 size;
    u8 gender;
    u8 leadership;
    u16 hpBase;
    u8 hpGrowth;
    u16 strBase;
    u8 strGrowth;
    u16 vitBase;
    u8 vitGrowth;
    u16 intBase;
    u8 intGrowth;
    u16 menBase;
    u8 menGrowth;
    u16 agiBase;
    u8 agiGrowth;
    u16 dexBase;
    u8 dexGrowth;
    u8 luck;
    u8 alignment;
    u8 resist[7];
    u8 movement;
    u16 defaultItems[4];
    u8 lockedSlots;
    u8 attacks[3][2];
    u8 physAttack;
    u8 magicAttack;
    u8 physDefense;
    u8 magicDefense;
    u8 promotions[4];
    u8 baseClass;
    u8 element;
    u8 squadSlots;
} ClassData;
extern ClassData g_func_0019554C_class_records[];
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
void D_80179034(signed char *s, s32 x, s32 y);
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
void func_00087200(void *a, s32 y, s32 k);
void func_000873a0(s32 x, s32 y, s32 x1, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0008b5e4(s32 x, s32 y, u8 k);
void func_000a02f8(s32 unused, WinG87 *w, u8 k) {
    s16 alpha = w->alpha[k];
    s32 x;
    s32 y;
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
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFC119623); _g->w1 = (0xFF2FFFFF); };
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x300, ((Res87 *)D_80196AF8)->img + 0x27E8, 0x10, 8, 4);
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xED000000); _g->words.w1 = (0x4FC3BC); };
    { GfxU87 *_g = (GfxU87 *)(gTitleCardDisplayListCursor++); _g->words.w0 = (0xE7000000); _g->words.w1 = (0); };
    func_0008b5e4(x + 0xB, w->h + 1, 1);
    func_000873a0(x + 0x10, w->h, w->w, 0x56);
    func_00087b30((*(u8 * *)((u8 *)(D_80196AF8) + (0x64))), (*(u8 * *)((u8 *)(D_80196AF8) + (0x64))) + 0x2E0, 0x30, 0x20, 2);
    func_00087200((void *)(x + 4), y - 6, 0x22);
    func_00087200((void *)(x + 0x18), y + 0x14, 0x28);
    func_00087200((void *)(x + 0x32), y + 0x14, 0x29);
    func_00087200((void *)(x + 0x48), y + 0x14, 0x2A);
    D_80179034(g_func_0019554C_class_records[(*(u16 *)((u8 *)(D_80196AF8) + (0x5E8)))].name, x + 4, y + 4);
}
