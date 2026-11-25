typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
void func_00246270(u8 *img, s32 a, s32 b, s32 w, s32 h, f32 x, f32 y);
typedef struct {
    s32 f0;
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    s32 rest[5];
} Part244;
s32 D_801C2178(void *set, void *, s32 i, Part244 *p);
u8 *D_801C33F8(void *set, Part244 *p, void *pal, s32 k);
u32 D_801BE9A8(s32 siz, u32 w);
void func_0024660C(u8 *img, u8 *pal, s32 a, s32 b, s32 w, s32 h, f32 x, f32 y);
void func_00247154(u8 *a, s16 ox, s16 oy) {
    s32 i = 0;
    for (;; i++) {
        Part244 p;
        u8 *img;
        u8 *img2;
        s32 sz;
        if ((a + i)[0x16] == 0) {
            continue;
        }
        if (!D_801C2178((*(void * *)((u8 *)(a) + (0))), (*(s16 *)((u8 *)(a) + (0xE))), i, &p)) {
            return;
        }
        img = D_801C33F8((*(void * *)((u8 *)(a) + (0))), &p, (*(void * *)((u8 *)(a) + (4))), 0);
        img2 = img;
        sz = D_801BE9A8(img[3], (*(u16 *)((u8 *)(img) + (4))));
        if ((*(u16 *)((u8 *)(img) + (2))) == 2) {
            u8 *pal = img + (sz * (*(u16 *)((u8 *)(img) + (6))) + 8);
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFC2197FF); _g->w1 = (0xFFFFFE38); };
            func_0024660C(img, pal, 0, 0, p.w, p.h, ox + p.x, oy + p.y);
        } else {
            { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xFC1197FF); _g->w1 = (0xFFFFFE38); };
            func_00246270(img2, 0, 0, p.w, p.h, ox + p.x, oy + p.y);
        }
    }
}
