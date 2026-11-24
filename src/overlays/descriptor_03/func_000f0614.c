typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct Tree0E {
    struct Tree0E *left;
    struct Tree0E *right;
} Tree0E;
typedef struct {
    u8 unk000[0x5C];
    f32 fov;
    u8 unk060[0x10];
    f32 eye[3];
    f32 at[3];
    f32 up[3];
    u8 unk094[0x70];
    s32 w104;
    u8 unk108[4];
    f32 f10C;
    u8 unk110[0xC];
    void *sky;
    void *tex120;
    u8 unk124[0x2A];
    u8 r;
    u8 g;
    u8 b;
    u8 unk151[0xB];
    f32 f15C;
} Scene0E;
extern Gfx *gTitleCardDisplayListCursor;
extern Scene0E *D_801ABA58;
typedef struct {
    void *p0;
    void *p1;
    u8 (*mtx)[0x40];
} FbSet0E;
extern FbSet0E *D_800E9BE0;
typedef struct {
    Tree0E link;
    f32 dist;
    s32 c;
    u16 key;
    u16 m;
    u16 frame;
} DrawNode0E;
extern u16 gCardMatrixCount;
void guMtxF2L(void *mf, void *m);
void func_000f0614(DrawNode0E *n, u16 k) {
    if (n != ((void *)0)) {
        gTitleCardDisplayListCursor->w0 = 0xE7000000;
        gTitleCardDisplayListCursor->w1 = 0;
        gTitleCardDisplayListCursor++;
        if (k != n->key) {
            if (k < n->key) {
                func_000f0614((DrawNode0E *)n->link.left, k);
            } else {
                func_000f0614((DrawNode0E *)n->link.right, k);
            }
        } else {
            func_000f0614((DrawNode0E *)n->link.left, k);
            if (n->frame == 0) {
                guMtxF2L((*(u8 * *)((u8 *)(D_801ABA58) + (0xC0))) + (n->m << 6), D_800E9BE0->mtx[gCardMatrixCount]);
                gTitleCardDisplayListCursor->w0 = 0xDA380003;
                gTitleCardDisplayListCursor++->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount++] - 0x80000000;
            } else {
                gTitleCardDisplayListCursor->w0 = 0xDA380003;
                gTitleCardDisplayListCursor->w1 = (u32)D_800E9BE0->mtx[(*(u16 * *)((u8 *)(D_801ABA58) + (0x124)))[n->m]] - 0x80000000;
                gTitleCardDisplayListCursor++;
            }
            gTitleCardDisplayListCursor->w0 = 0xDE000000;
            gTitleCardDisplayListCursor->w1 = n->c;
            gTitleCardDisplayListCursor++;
            func_000f0614((DrawNode0E *)n->link.right, k);
        }
    }
}
extern u16 gCardMatrixCount;
