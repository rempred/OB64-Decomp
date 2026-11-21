typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern void *D_8021B588[2];
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct Win18C {
    u8 unk00[0x18];
    s16 fade[2];
    u8 unk1C[0x10];
    s32 x;
    s32 y;
    u8 unk34[0x48];
    s32 rect[4];
} Win18C;
typedef struct {
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 pos[5];
    u8 harmony;
    u8 items[10];
    u8 strategy;
    u8 legion;
} SquadRec18C;
void func_0018D164(Win18C *w, s32 page);
extern s32 D_8021B5B0;
extern Gfx *gTitleCardDisplayListCursor;
extern s8 D_8018F480;
extern u8 *D_801F0B90;
extern u8 *D_801F0BCC;
extern u8 *D_801F36C0;
extern Gfx D_801EB1D0[];
extern u8 D_80210217[][5];
extern u8 D_80193BC0_copy[][0x38];
extern u8 D_801969B8[][11];
extern SquadRec18C g_func_001957D0_source_records[];
extern u8 D_8021B59E;
extern s32 D_8021B5A8;
extern s32 D_8021B5AC;
extern s32 D_8021B5B4;
extern s16 D_8021B5E6;
extern s16 D_8021B5EC;
void D_8017C4B4(s16 a);
void D_802027DC(void);
void D_80200DD0(s32 x, s32 y, s32 icon);
void D_802001A8(s32 x, s32 y, u16 n, s32 digits);
void D_80200A38(s32 x, s32 y);
void D_8020078C(u8 n, s32 x, s32 y);
void D_80200F70(void *pal, void *img, u16 w, u16 h, u16 mode);
void D_801D66D0(u8 *dst, u8 *legion, u8 formation);
void *D_8016B070(u8 strategy);
void D_80179034(void *s, s32 x, s32 y);
void D_802012D8(void *pal);
void D_80201384(s32 a, s32 b, s32 c, s32 d);
void func_0018D164(Win18C *w, s32 page) {
    s32 x;
    s32 y;
    s32 sq;
    s32 i;
    u8 slots[5];
    s32 p;
    s32 col;
    s32 row;
    if (w->fade[page] == 0) {
        return;
    }
    x = w->x;
    y = w->y;
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    D_8017C4B4(w->fade[page]);
    if (w == D_8021B588[0]) {
        sq = D_8021B5AC;
    } else {
        sq = D_8021B5B0;
    }
    D_802027DC();
    if (sq != 0xFF) {
        D_80200DD0(x + 4, y + 4, 4);
        D_80200DD0(x + 0x17, y + 4, 0);
        D_802001A8(x + 0x28, y + 4, g_func_001957D0_source_records[sq].unk0, 2);
        D_80200A38(x + 6, y + 0x20);
        if (D_8021B59E == 0 && w == D_8021B588[0]) {
            D_8018F480 = 1;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (14) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)((0 << 14)); };
            { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(D_801F0BCC); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xF3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((((((24) * (9) + 0) >> 0) - 1) < (2047) ? ((((24) * (9) + 0) >> 0) - 1) : (2047)))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((1 << 11) + ((1) > (((24) * (2) / 8)) ? (1) : (((24) * (2) / 8))) - 1) / ((1) > (((24) * (2) / 8)) ? (1) : (((24) * (2) / 8))))) & ((0x01 << (12)) - 1)) << (0)))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((((24) * 2) + 7) >> 3) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((24) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(((9) - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((x + 19) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((y + 28) << 2) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((x + 9) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((y + 19) << 2) & ((0x01 << (12)) - 1)) << (0)))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(8 << 5) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(1 << 10) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(1 << 10) & ((0x01 << (16)) - 1)) << (0))))); }; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
            D_8018F480 = 2;
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (14) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)((2 << 14)); };
        }
        if (w == D_8021B588[0]) {
            D_8020078C(D_801969B8[D_8021B5B4][9] - 1, x + 0x58, y + 4);
            D_80200F70(D_801F36C0 + 0x360, D_801F0B90 + ((D_801969B8[D_8021B5B4][8] << 7) + 0x11C8), 16, 16, 2);
            D_80200DD0(x + 0x44, y + 2, 0x21);
            D_80200F70(D_801F36C0 + 0x1A0, D_801F0B90 + 0x1648, 16, 4, 2);
            D_801D66D0(slots, D_801969B8[D_8021B5B4], D_801969B8[D_8021B5B4][8]);
            for (i = 0; i < 5; i++) {
                if (slots[i] == sq) {
                    break;
                }
            }
            p = D_80210217[D_801969B8[D_8021B5B4][8]][i];
            col = (p >> 4) * 3 + 0x44;
            row = (p & 0xF) + 2;
            D_80200DD0(x + col, y + row, 0x36);
        } else {
            D_8020078C(g_func_001957D0_source_records[sq].legion - 1, x + 0x58, y + 4);
        }
        D_80179034(D_8016B070(g_func_001957D0_source_records[sq].strategy), x + 0x1C, y + 0x20);
        D_80179034(D_80193BC0_copy[g_func_001957D0_source_records[sq].members[0]], x + 0x1C, y + 0x10);
    } else {
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (14) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)((2 << 14)); };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xE3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(32 - (12) - (2)) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((2) - 1) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (unsigned int)(0x2000); };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xD7) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (11))) | ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (8))) | ((unsigned int)(((unsigned int)((1)) & ((0x01 << (7)) - 1)) << (1)))); _g->w1 = (((unsigned int)(((unsigned int)((0x8000)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((0x8000)) & ((0x01 << (16)) - 1)) << (0)))); };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xFA) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (8)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(0xFF) & ((0x01 << (8)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(w->fade[page] > 0x50 ? 0x50 : w->fade[page]) & ((0x01 << (8)) - 1)) << (0)))); };
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xE200001C;
            _g->w1 = 0x00504240;
        }
        {
            Gfx *_g = gTitleCardDisplayListCursor++;
            _g->w0 = 0xFC119623;
            _g->w1 = 0xFF2FFFFF;
        }
        D_802012D8(D_801F36C0 + 0x2C0);
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        { { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xFD) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)((1) - 1) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = (unsigned int)(D_801F0B90 + 0x20E8); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(1) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(1) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE6) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = (((unsigned int)(((unsigned int)(0xF3) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0)))); _g->w1 = (((unsigned int)(((unsigned int)(7) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((((((96) * (36) + 3) >> 2) - 1) < (2047) ? ((((96) * (36) + 3) >> 2) - 1) : (2047)))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((1 << 11) + ((1) > (((96) / 16)) ? (1) : (((96) / 16))) - 1) / ((1) > (((96) / 16)) ? (1) : (((96) / 16))))) & ((0x01 << (12)) - 1)) << (0)))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF5) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(2) & ((0x01 << (3)) - 1)) << (21))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (2)) - 1)) << (19))) | ((unsigned int)(((unsigned int)(((((96) >> 1) + 7) >> 3)) & ((0x01 << (9)) - 1)) << (9))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (9)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (20))) | ((unsigned int)(((unsigned int)(1) & ((0x01 << (2)) - 1)) << (18))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (14))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (10))) | ((unsigned int)(((unsigned int)(1) & ((0x01 << (2)) - 1)) << (8))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (4))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (4)) - 1)) << (0))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xF2) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(0) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)(0) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)(((96) - 1) << 2) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)(((36) - 1) << 2) & ((0x01 << (12)) - 1)) << (0))); } };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE4) & ((0x01 << (8)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)((x + 0x90) << 2)) > (0) ? ((s16)((x + 0x90) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)((y + 0x36) << 2)) > (0) ? ((s16)((y + 0x36) << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); _g->w1 = ((unsigned int)(((unsigned int)((0)) & ((0x01 << (3)) - 1)) << (24))) | ((unsigned int)(((unsigned int)((((s16)(x << 2)) > (0) ? ((s16)(x << 2)) : (0))) & ((0x01 << (12)) - 1)) << (12))) | ((unsigned int)(((unsigned int)((((s16)(y << 2)) > (0) ? ((s16)(y << 2)) : (0))) & ((0x01 << (12)) - 1)) << (0))); { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xE1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)(((0) - (((s16)(x << 2) < 0) ? (((s16)(0x300) < 0) ? ((((((s16)(x << 2) * (s16)(0x300)) >> 7)) > (0) ? ((((s16)(x << 2) * (s16)(0x300)) >> 7)) : (0))) : ((((((s16)(x << 2) * (s16)(0x300)) >> 7)) < (0) ? ((((s16)(x << 2) * (s16)(0x300)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)(((0) - (((y << 2) < 0) ? (((s16)(0x300) < 0) ? ((((((s16)(y << 2) * (s16)(0x300)) >> 7)) > (0) ? ((((s16)(y << 2) * (s16)(0x300)) >> 7)) : (0))) : ((((((s16)(y << 2) * (s16)(0x300)) >> 7)) < (0) ? ((((s16)(y << 2) * (s16)(0x300)) >> 7)) : (0)))) : 0))) & ((0x01 << (16)) - 1)) << (0))))); }; { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)((0xF1)) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)((((unsigned int)(((unsigned int)((0x300)) & ((0x01 << (16)) - 1)) << (16))) | ((unsigned int)(((unsigned int)((0x300)) & ((0x01 << (16)) - 1)) << (0))))); }; };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
        { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    }
    gTitleCardDisplayListCursor->w0 = 0xDE000000;
    gTitleCardDisplayListCursor->w1 = (u32)D_801EB1D0;
    gTitleCardDisplayListCursor++;
    if (w == D_8021B588[1] && D_8021B5A8 != -1 && D_8021B59E != 0) {
        if (D_8021B5E6 == D_8021B5EC) {
            D_80201384(w->rect[0] - 0x20, w->rect[1], w->rect[2], w->rect[3]);
            D_80200DD0(x - 0x15, y + 0x10, 0x25);
        } else if (D_8021B5AC == 0xFF) {
            D_80201384(w->rect[0] - 0x20, w->rect[1], w->rect[2], w->rect[3]);
            D_80200DD0(x - 0x15, y + 0x10, 0x24);
        } else {
            D_80201384(w->rect[0] - 0x20, w->rect[1], w->rect[2], w->rect[3]);
            D_80200DD0(x - 0x15, y + 0x19, 0x24);
            D_80200DD0(x - 0x15, y + 7, 0x25);
        }
    }
}
void func_0018D164(Win18C *w, s32 page);
void func_0018D164(Win18C *w, s32 page);
void func_0018D164(Win18C *w, s32 page);
