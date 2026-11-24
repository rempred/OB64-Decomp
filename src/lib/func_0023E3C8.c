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
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_801969B0;
extern Gfx D_801F0090[];
void guMtxF2L(void *mf, void *m);
extern void func_0023E06C(s32, u8 *);
s32 func_0023E3C8(u8 *o) {
    Ent23 *e = (Ent23 *)o;
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDE000000;
        _g->w1 = (u32)D_801F0090;
    }
    guMtxF2L(e->mf, D_801969B0);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380000;
        _g->w1 = (u32)D_801969B0;
    }
    func_0023E06C(e->id, (s32)e->img);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xD8380002;
        _g->w1 = 0x40;
    }
    D_801969B0 += 0x40;
    return 0;
}
s32 func_0023E3C8(u8 *o);
