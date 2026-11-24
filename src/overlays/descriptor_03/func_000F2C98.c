typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
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
extern u16 gCardMatrixCount;
void guMtxF2L(void *mf, void *m);
void bcopy(const void *src, void *dst, s32 n);
typedef struct {
    s32 m[16];
} MtxE;
extern u16 gCardMatrixCount;
void guMtxIdent(MtxE *m);
extern u16 D_801AC34A[];
extern u16 D_801AC356[];
extern f32 D_801AC1E0[2][5][3];
extern f32 D_801AC258[5][3];
extern f32 D_801AC294[5][3];
extern f32 D_801AC2D0[5][3];
extern f32 D_801AC30C[5][3];
extern u8 D_801AC104[];
extern u8 D_801AC1A0[];
extern Gfx D_801AC138[];
void func_000F2FE4(s32 lo, s32 hi, s32 x, f32 *from, f32 *to, u8 *out);
void func_000F2C98(s32 t) {
    s32 i;
    s32 j;
    for (i = 0; i < 4; i++) {
        if (t < D_801AC34A[i]) {
            break;
        }
    }
    j = i;
    if (i < 4) {
        j++;
    }
    func_000F2FE4(D_801AC34A[i - 1], D_801AC34A[j - 1], t,
                             D_801AC1E0[0][i], D_801AC1E0[0][j], D_801AC104);
    bcopy(D_801AC104, D_801AC104 + 0x10, 3);
    func_000F2FE4(D_801AC34A[i - 1], D_801AC34A[j - 1], t,
                             D_801AC1E0[1][i], D_801AC1E0[1][j], D_801AC104 + 0x20);
    bcopy(D_801AC104 + 0x20, D_801AC104 + 0x30, 3);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    guMtxF2L(D_801AC1A0, D_800E9BE0->mtx[gCardMatrixCount]);
    guMtxIdent((MtxE *)D_800E9BE0->mtx[gCardMatrixCount]);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380003;
        _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount++] - 0x80000000;
    }
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xDE) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = (unsigned int)(D_801AC138); };
    for (i = 0; i < 4; i++) {
        if (t < D_801AC356[i]) {
            break;
        }
    }
    j = i;
    if (i < 4) {
        j++;
    }
    func_000F2FE4(D_801AC356[i - 1], D_801AC356[j - 1], t,
                             D_801AC258[i], D_801AC258[j], D_801ABA58->unk124 + 0x24);
    func_000F2FE4(D_801AC356[i - 1], D_801AC356[j - 1], t,
                             D_801AC294[i], D_801AC294[j], D_801ABA58->unk124 + 0x27);
    func_000F2FE4(D_801AC356[i - 1], D_801AC356[j - 1], t,
                             D_801AC2D0[i], D_801AC2D0[j], D_801ABA58->unk124 + 0x20);
    func_000F2FE4(D_801AC356[i - 1], D_801AC356[j - 1], t,
                             D_801AC30C[i], D_801AC30C[j], &D_801ABA58->r);
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
}
void func_000F2FE4(s32 lo, s32 hi, s32 x, f32 *from, f32 *to, u8 *out);
