typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_8022A974;
typedef struct {
    u8 unk0[0xF];
    u8 flag;
} Rec2B5;
extern u8 *D_8022A970;
extern u8 D_8022A996;
extern u8 D_8022A9F0[];
extern u8 D_801969B0[];
typedef struct {
    u8 pad[0x818];
    f32 a;
    f32 b;
} Cam2B5;
void func_002B8394(u8 *o, Gfx **g, void *m, u8 k, f32 a, f32 b);
extern inline s32 func_002B5230(u8 *o, s32 k) {
    Rec2B5 *e = ((Rec2B5 **)o)[k];
    u8 n = o[0x86];
    Rec2B5 *end;
    if (n != 0) {
        end = e + (s32)((*(u32 *)((u8 *)(o) + (0xC))) >> 4) / 30 * n;
    loop:
        if (e < end) {
            (e++)->flag = 0;
            (e++)->flag = 0;
            goto loop;
        }
    }
    return 0;
}
void func_002B555C(void) {
    s32 i;
    for (i = 0; i < 20; i++) {
        u8 *o = (*(u8 * *)((u8 *)(D_8022A974 + i * 4) + (0x19F4)));
        if (o != ((void *)0)) {
            Gfx *g = gTitleCardDisplayListCursor;
            g->w0 = 0xDE000000;
            g->w1 = (u32)D_8022A9F0;
            gTitleCardDisplayListCursor = g + 1;
            func_002B8394(o, &gTitleCardDisplayListCursor, D_801969B0, D_8022A996, ((Cam2B5 *)D_8022A970)->a,
                                     ((Cam2B5 *)D_8022A970)->b);
            { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_8022A9F0); };
            func_002B5230(o, D_8022A996);
        }
    }
}
