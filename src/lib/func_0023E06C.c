typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    s32 (*draw)(u8 *o);
    s32 sx;
    s32 sy;
    s32 sz;
    u8 unk10[8];
    void *img;
    u8 unk1C[4];
    f32 mf[4][4];
    u16 flags;
    s16 unk62;
    s16 unk64;
    s16 id;
} Ent23;
typedef struct {
    Ent23 ent[4];
    u8 *logo;
    u8 unk1A4[0x98];
    u16 unk23C;
    u8 unk23E[0x10E];
    u8 *backdrop;
    u8 unk350[0x10];
    s32 backdropSize;
    u8 unk364[8];
    u8 unk36C[4];
    s16 x0;
    s16 x1;
    s16 y0;
    s16 y1;
    u8 unk378[0x24C];
    u8 *img5C4;
    u8 *img5C8;
    u8 unk5CC[0x40];
    u8 *img60C;
    s16 unk610;
    s16 unk612;
    u8 unk614[0x3C];
    u16 flags;
    s16 h652;
    u8 unk654[2];
    s16 fade;
} Ctx23;
extern Ctx23 *D_801EFE48;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_0023E06C(s32 id, u8 *img);
typedef struct {
    s16 x;
    s16 y;
    s16 z;
    u16 flag;
    s16 s;
    s16 t;
    s8 nx;
    s8 ny;
    s8 nz;
    u8 a;
} Vtx23;
extern Vtx23 *D_80197178;
void func_0023DCC0(s32 id);
void func_0023DCC0(s32 id);
void D_801BA0DC(void *timg, s32 a, s32 b, s32 fmt, s32 siz, s32 stride, s32 height, s32 uls, s32 ult,
s32 lrs, s32 lrt, s32 c, s32 d, s32 e, s32 f, s32 g, s32 h, s32 i);
void func_0023E06C(s32 id, u8 *img) {
    if (D_801EFE48->flags & 1) {
        Vtx23 *v = D_80197178;
        s32 h;
        s32 w;
        s32 i;
        s32 s;
        bzero(v, 0x400);
        h = (*(u16 *)((u8 *)(img) + (6)));
        w = (*(u16 *)((u8 *)(img) + (4)));
        D_80197178[0].z = -h / 2;
        D_80197178[1].z = (u32)h / 2;
        for (i = 2; i < 64; i += 2) {
            D_80197178[i].z = (u32)h / 2;
            D_80197178[i + 1].z = -h / 2;
        }
        func_0023DCC0(id);
        for (i = 0, s = 4; i < 64; i++) {
            if (i == 0 || i == 1) {
                D_80197178[i].s = 0;
                if (i & 1) {
                    D_80197178[i].t = h << 6;
                } else {
                    D_80197178[i].t = 0;
                }
            } else {
                D_80197178[i].s = s << 6;
                if (!(i & 1)) {
                    D_80197178[i].t = h << 6;
                } else {
                    D_80197178[i].t = 0;
                }
                if (i & 1) {
                    s += 4;
                }
            }
            D_80197178[i].flag = 0;
            D_80197178[i].nx = 0;
            D_80197178[i].ny = 0;
            D_80197178[i].nz = 0;
            D_80197178[i].a = 0xFF;
        }
        D_80197178 += 64;
        D_801BA0DC(img + 8, 0, 0, 0, 2, w, h, 0, 0, 4, h - 1, 0, 0, 0, 0, 0, 0, 0);
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0x01) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((4)) & ((0x01 << (8)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((0) + (4)) & ((0x01 << (7)) - 1)) << (1))); _g->w1 = (unsigned int)(v); };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0x06) & ((0x01 << (8)) - 1)) << (24))) | (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (0)))); };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        s = 4;
        for (i = 2; i < 62; i += 2) {
            D_801BA0DC(img + 8, 0, 0, 0, 2, w, h, s, 0, s + 4, h - 1, 0, 0, 0, 0, 0, 0, 0);
            s += 4;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0x01) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((4)) & ((0x01 << (8)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((0) + (4)) & ((0x01 << (7)) - 1)) << (1))); _g->w1 = (unsigned int)(&v[i]); };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0x06) & ((0x01 << (8)) - 1)) << (24))) | (((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((0) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)((1) * 2) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((2) * 2) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((3) * 2) & ((0x01 << (8)) - 1)) << (0)))); };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        }
    }
}
