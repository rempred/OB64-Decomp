typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk00[0x60];
    u16 flags;
    u8 unk62[4];
    s16 id;
} Ent23;
typedef struct {
    Ent23 ent[4];
    u8 unk1A0[0x1D0];
    s16 x0;
    s16 x1;
    s16 y0;
    s16 y1;
    u8 unk378[0x2D8];
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
void func_00240D20(void);
extern Gfx D_801F0380[];
s32 D_801C8C74(u8 *u);
s32 D_801C8C90(u8 *u);
void func_00240964(s32 spr, s16 x, s16 y);
void func_00240D20(void) {
    Ctx23 *c = D_801EFE48;
    u8 **target;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_801F0380); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((*(u8 *)((u8 *)(c) + (0x653)))) & ((0x01 << (8)) - 1)) << (0)))); };
    target = &(*(u8 * *)((u8 *)(c) + (0x5D4)));
    if (D_801C8C74((*(u8 * *)((u8 *)(c) + (0x5D4))))) {
        func_00240964((*(s32 *)((u8 *)(c) + (0x5D8))), (*(s16 *)((u8 *)(c) + (0x5EC))) - 10, (*(s16 *)((u8 *)(c) + (0x5EE))) - 5);
        func_00240964((*(s32 *)((u8 *)(c) + (0x5D8))), (*(s16 *)((u8 *)(c) + (0x5EC))) + 10, (*(s16 *)((u8 *)(c) + (0x5EE))));
        func_00240964((*(s32 *)((u8 *)(c) + (0x5D8))), (*(s16 *)((u8 *)(c) + (0x5EC))) - 3, (*(s16 *)((u8 *)(c) + (0x5EE))) + 5);
    } else {
        func_00240964((*(s32 *)((u8 *)(c) + (0x5D8))), (*(s16 *)((u8 *)(c) + (0x5EC))), (*(s16 *)((u8 *)(c) + (0x5EE))));
    }
    if (D_801C8C90(*target)) {
        func_00240964((*(s32 *)((u8 *)(D_801EFE48) + (0x5F4))), (*(s16 *)((u8 *)(D_801EFE48) + (0x608))),
                                 (*(s16 *)((u8 *)(D_801EFE48) + (0x60A))));
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (20) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)(0); };
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
