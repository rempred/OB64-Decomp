#include "common/reflect_light.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    f32 fovy;
    f32 aspect;
    f32 near;
    f32 far;
    f32 scale;
    f32 eye[3];
    f32 at[3];
    f32 up[3];
    f32 light1[3];
    f32 light2[3];
    s32 texWidth;
    s32 texHeight;
} Camera;
typedef struct {
    ReflectLight (*lookat)[2];
    Hilite *hilite;
    u8 (*mtx)[0x40];
} FbSet87;
extern FbSet87 *D_800E9BE0;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u16 gCardMatrixCount;
void func_000228d0(void *m, u16 *perspNorm, f32 fovy, f32 aspect, f32 near, f32 far, f32 scale);
void func_000210c0(void *m, f32 xEye, f32 yEye, f32 zEye, f32 xAt, f32 yAt, f32 zAt, f32 xUp, f32 yUp, f32 zUp);
extern u16 D_800E7A0E;
extern u16 D_800C4C24;
extern u16 D_800C4C48;
void boot_display_list_transform_record_emit(Camera *cam) {
    u16 perspNorm;
    D_800E7A0E = gCardMatrixCount;
    func_000228d0(D_800E9BE0->mtx[gCardMatrixCount], &perspNorm, cam->fovy, cam->aspect, cam->near, cam->far,
                  cam->scale);
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDB0E0000); _g->w1 = (perspNorm); };
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDA380007); _g->w1 = (((u32)(D_800E9BE0->mtx[gCardMatrixCount++]) - 0x80000000)); };
    if (cam->light1[0] == 0.0f && cam->light1[1] == 0.0f && cam->light1[2] == 0.0f) {
        D_800C4C24 = gCardMatrixCount;
        func_000210c0(D_800E9BE0->mtx[D_800C4C24], cam->eye[0], cam->eye[1], cam->eye[2], cam->at[0], cam->at[1],
                 cam->at[2], cam->up[0], cam->up[1], cam->up[2]);
    } else {
        D_800C4C24 = gCardMatrixCount;
        func_00021dd4(D_800E9BE0->mtx[D_800C4C24], D_800E9BE0->lookat[D_800C4C48],
                       &D_800E9BE0->hilite[D_800C4C48], cam->eye[0], cam->eye[1], cam->eye[2], cam->at[0],
                       cam->at[1], cam->at[2], cam->up[0], cam->up[1], cam->up[2], cam->light1[0],
                       cam->light1[1], cam->light1[2], cam->light2[0], cam->light2[1], cam->light2[2],
                       cam->texWidth, cam->texHeight);
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDC08000A); _g->w1 = ((u32)D_800E9BE0->lookat[D_800C4C48]); };
        { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDC08030A); _g->w1 = ((u32)D_800E9BE0->lookat[D_800C4C48++] + 0x10); };
    }
    { Gfx *_g = gTitleCardDisplayListCursor++; _g->w0 = (0xDA380005); _g->w1 = (((u32)(D_800E9BE0->mtx[gCardMatrixCount++]) - 0x80000000)); };
}
extern u16 D_800C4C24;
extern u16 D_800E7A0E;
