typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void *func_0000978C();
typedef struct {
    u16 flags;
    u8 unk02[0x22];
} Rec24;
extern Rec24 D_801951CC[];
void func_000f5bc4(s32 i) {
    u8 *tex;
    s32 id;
    s32 f = D_801951CC[i - 1].flags & 6;
    id = 0xAC;
    if (f == 2) {
        id = 0xAA;
    } else {
        id -= f == 4;
    }
    tex = func_0000978C(0x0203C53E, id, -0xA);
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE3001001); _g->w1 = (u32)(0x8000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFD500000); _g->w1 = (u32)(tex); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5500000); _g->w1 = (u32)(0x07090230); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF3000000); _g->w1 = (u32)(0x0703F800); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5480200); _g->w1 = (u32)(0x00090230); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF2000000); _g->w1 = (u32)(0x0001C03C); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFD100000); _g->w1 = (u32)(tex + 0x80); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE8000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF5000100); _g->w1 = (u32)(0x07000000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE6000000); _g->w1 = (u32)(0); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xF0000000); _g->w1 = (u32)(0x073FC000); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xE7000000); _g->w1 = (u32)(0); };
}
