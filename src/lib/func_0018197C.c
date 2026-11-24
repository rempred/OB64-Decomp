typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    s32 data[0x16];
} Camera;
extern Camera *D_8018F58C;
void func_0018197C(void);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx181;
typedef struct {
    void *p0;
    void *p1;
    u8 (*mtx)[0x40];
} FbSet181;
extern Gfx181 *gTitleCardDisplayListCursor;
extern FbSet181 *D_800E9BE0;
extern u16 gCardMatrixCount;
extern u16 D_800C4C24;
extern u16 D_800E7A0E;
extern u8 D_8021ABC0[];
void func_000225d0(void *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
void func_000210c0(void *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
void func_0018197C(void) {
    (((f32 *)D_8018F58C->data)[5]) = 160.0f;
    (((f32 *)D_8018F58C->data)[6]) = 120.0f;
    (((f32 *)D_8018F58C->data)[7]) = 60.0f;
    (((f32 *)D_8018F58C->data)[8]) = 160.0f;
    (((f32 *)D_8018F58C->data)[9]) = 120.0f;
    (((f32 *)D_8018F58C->data)[10]) = 0.0f;
    (((f32 *)D_8018F58C->data)[11]) = 0.0f;
    (((f32 *)D_8018F58C->data)[12]) = 1.0f;
    (((f32 *)D_8018F58C->data)[13]) = 0.0f;
    D_800E7A0E = gCardMatrixCount;
    func_000225d0(D_800E9BE0->mtx[gCardMatrixCount], -160.0f, 160.0f, -120.0f, 120.0f, 1.0f, 2000.0f, 1.0f);
    {
        Gfx181 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380007;
        _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount] - 0x80000000;
    }
    D_800C4C24 = ++gCardMatrixCount;
    func_000210c0(D_800E9BE0->mtx[D_800C4C24], (((f32 *)D_8018F58C->data)[5]), (((f32 *)D_8018F58C->data)[6]), (((f32 *)D_8018F58C->data)[7]), (((f32 *)D_8018F58C->data)[8]), (((f32 *)D_8018F58C->data)[9]), (((f32 *)D_8018F58C->data)[10]), (((f32 *)D_8018F58C->data)[11]), (((f32 *)D_8018F58C->data)[12]),
             (((f32 *)D_8018F58C->data)[13]));
    {
        Gfx181 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380005;
        _g->w1 = (u32)D_800E9BE0->mtx[gCardMatrixCount++] - 0x80000000;
    }
    {
        Gfx181 *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDE000000;
        _g->w1 = (u32)D_8021ABC0;
    }
}
