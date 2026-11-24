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
extern Gfx D_801F01D0[];
void D_801B5CAC(s32 a, s32 b, s32 c);
void func_0023ED48(void);
void func_0023F238(void);
void func_0023F778(void) {
    Ctx23 *s = D_801EFE48;
    if (s->flags & 4) {
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xDE000000;
            _g->w1 = (u32)D_801F01D0;
        }
        D_801B5CAC(((struct { u8 pad[0x36C]; s32 v; } *)s)->v, s->x0, s->x1);
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE7000000;
            _g->w1 = 0;
        }
        func_0023ED48();
        func_0023F238();
    }
}
