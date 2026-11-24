typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 v[8];
} Vtx1F8;
extern Vtx1F8 *D_80197178;
extern void *gTitleCardDisplayListCursor;
typedef struct {
    u8 *img;
} ImgRef1F8;
typedef struct {
    u16 magic;
} ImgHdr1F8;
void func_001F91E8(ImgRef1F8 *pp);
void func_001F962C(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_001F9E00(void *a, void *b, u8 *img, u8 c, s32 d, s32 e);
void func_001FA240(void *a, void *b, u8 *img);
void func_001FA240(void *a, void *b, u8 *img);
inline void func_001FAD18(ImgRef1F8 *pp) {
    u8 *img = pp->img;
    s32 pad[2];
    if (((ImgHdr1F8 *)img)->magic == 0x4235) {
        u8 *dst = (u8 *)&D_80197178;
        void *gp = &gTitleCardDisplayListCursor;
        if (img[2] == 1) {
            func_001FA240(dst, gp, img);
        } else if (img[2] == 3) {
            func_001F9E00(dst, gp, img, 0, 0, 0);
        } else {
            func_001F962C(dst, gp, img, 0, 0, 0);
        }
    } else {
        func_001F91E8(pp);
    }
}
