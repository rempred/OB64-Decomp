typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s32 x0;
    s32 y0;
    s32 x1;
    s32 y1;
} Rect23;
u32 D_801BE978(s32 siz, u16 w, u16 h);
void func_00241494(u8 *dst, s32 x, s32 y, u8 *src, Rect23 r);
s32 D_801BEF14(void *img, void *pal, u8 fmt, u8 siz, s32 w, s32 h, s32 x, s32 y, s32 c);
s32 D_801BF59C(void *img, void *pal, u8 fmt, u8 siz, s32 w, s32 h, s32 x, s32 y);
u32 D_801BE978(s32 siz, u16 w, u16 h);
s32 D_801BEF14(void *img, void *pal, u8 fmt, u8 siz, s32 w, s32 h, s32 x, s32 y, s32 c);
s32 D_801BF59C(void *img, void *pal, u8 fmt, u8 siz, s32 w, s32 h, s32 x, s32 y);
void func_00241494(u8 *dst, s32 dx, s32 dy, u8 *src, Rect23 r) {
    u8 *sImg = src + 8;
    u8 *sPal = sImg + D_801BE978(src[3], (*(u16 *)((u8 *)(src) + (4))), (*(u16 *)((u8 *)(src) + (6))));
    u8 *dImg = dst + 8;
    u8 *dPal = dImg + D_801BE978(dst[3], (*(u16 *)((u8 *)(dst) + (4))), (*(u16 *)((u8 *)(dst) + (6))));
    s32 i, j;
    for (j = 0; j < r.y1 - r.y0; j++) {
        for (i = 0; i < r.x1 - r.x0; i++) {
            D_801BEF14(dImg, dPal, dst[2], dst[3], (*(u16 *)((u8 *)(dst) + (4))), (*(u16 *)((u8 *)(dst) + (6))), dx + i, dy + j,
                          D_801BF59C(sImg, sPal, src[2], src[3], (*(u16 *)((u8 *)(src) + (4))), (*(u16 *)((u8 *)(src) + (6))),
                                        r.x0 + i, r.y0 + j));
        }
    }
}
