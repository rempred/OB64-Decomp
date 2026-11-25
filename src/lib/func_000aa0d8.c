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
extern Gfx D_06005950[];
extern u16 D_801EE378[];
void func_00087200(void *a, s32 y, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_00088024(u8 k);
void func_000aa0d8(s32 i) {
    struct Mk87 *e = &((Main87 *)D_80196AF8)->mk[i];
    s32 x;
    s32 y;
    func_00088024(3);
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDE000000); _g->w1 = ((u32)D_06005950); };
    if (e->kind == 9) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (0xFFFFFFA6); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0x504240); };
    }
    x = e->x;
    y = e->y;
    func_00087200((void *)x, y, 0x45);
    if (e->kind == 9) {
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (0); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFA000000); _g->w1 = (0xFFFFFFFF); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE200001C); _g->w1 = (0xF0A7008); };
    }
    if (e->kind != 0) {
        s32 k = e->kind - 1;
        func_00087b30(((Res87 *)D_80196AF8)->pal + D_801EE378[k],
                                 ((Res87 *)D_80196AF8)->img + (k * 0x58 + 0x630), 0x10, 0x10, 2);
        func_00087200((void *)(x + 8), y - 8, 0x3F);
    }
    if (e->shown) {
        func_00087b30(((Res87 *)D_80196AF8)->pal + D_801EE378[3],
                                 ((Res87 *)D_80196AF8)->img + 0x738, 0x10, 0x10, 2);
        func_00087200((void *)x, y, 0x3F);
    }
}
