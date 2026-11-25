typedef unsigned char u8;
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
    u8 v[8][5];
} Mark87;
extern Mark87 D_801EF900;
void func_00087200(void *a, s32 y, s32 k);
void func_00087b30(void *pal, void *img, u16 w, u16 h, u16 mode);
void func_0008d8ec(s32 x, s32 y, u16 k, s32 sel) {
    Mark87 tbl = D_801EF900;
    s32 row;
    s32 ovr;
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xD7000002); _g->w1 = (0x80008000); };
    row = 0;
    if (k != 0) {
        row = k - 1;
    }
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x360, ((Res87 *)D_80196AF8)->img + 0x1248 + row * 0x80, 0x10, 0x10, 2);
    func_00087200((void *)x, y, 0x21);
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x1A0, ((Res87 *)D_80196AF8)->img + 0x1648, 0x10, 4, 2);
    ovr = 0;
    if ((*(u16 *)((u8 *)(D_80196AF8) + (0x1A8))) != 0 && D_80196AF8[0x9A] == 1) {
        ovr = 1;
        sel = (*(u16 *)((u8 *)(D_80196AF8) + (0x1A8))) - 1;
    }
    func_00087b30(((Res87 *)D_80196AF8)->pal + 0x1A0, ((Res87 *)D_80196AF8)->img + 0x1648, 0x10, 4, 2);
    ovr &= -(((*(u16 *)((u8 *)(D_80196AF8) + (0x12C))) & 8) == 0);
    if ((ovr == 0) & ((u16)sel < 5)) {
        s32 v = tbl.v[row][(u16)sel];
        func_00087200((void *)(x + (v >> 4) * 3), y + (v & 0xF), 0x3B);
    }
}
