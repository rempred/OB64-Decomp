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
void func_0023F804(void);
#include "game/image_1f_view.h"
extern Gfx D_801F0250[];
void func_0023F804(void) {
    u8 *e;
    s32 i;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_801F0250); };
    i = 0;
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xFA000000;
        e = (u8 *)&D_801EFE48->img60C;
        _g->w1 = (*(u8 *)((u8 *)(D_801EFE48) + (0x653)));
    }
    do {
        D_801B594C((Size1F *)(*(u8 * *)((u8 *)(e) + (0))), 0, 0, (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(e) + (0)))) + (4))), 16, (*(s16 *)((u8 *)(e) + (4))), i * 16);
        i++;
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    } while (i < 8);
    D_801B594C((Size1F *)(*(u8 * *)((u8 *)(e) + (0))), 0, 0, (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(e) + (0)))) + (4))), (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(e) + (0)))) + (6))),
                  (*(s16 *)((u8 *)(e) + (4))), i * 16);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
