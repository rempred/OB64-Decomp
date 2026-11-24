typedef unsigned char u8;
typedef unsigned int u32;
typedef float f32;
extern void *gTitleCardDisplayListCursor;
typedef struct {
    u8 m[0x40];
} Mtx1F8;
extern Mtx1F8 *D_801969B0;
void func_000225d0(void *m, f32 l, f32 r, f32 b, f32 t, f32 n, f32 f, f32 scale);
void guTranslate(void *m, f32 x, f32 y, f32 z);
void guScale(void *m, f32 x, f32 y, f32 z);
void func_00023018(void *m, f32 r, f32 p, f32 y);
typedef struct {
    u32 w0;
    u32 w1;
} Gfx1F8;
extern inline void Mtx1F8_Push(u32 w0) {
    Gfx1F8 *g = gTitleCardDisplayListCursor;
    gTitleCardDisplayListCursor = g + 1;
    g->w0 = w0;
    g->w1 = (u32)D_801969B0++;
}
void func_001FC3BC(u8 *o) {
    Gfx1F8 *g;
    g = gTitleCardDisplayListCursor;
    gTitleCardDisplayListCursor = g + 1;
    g->w0 = 0xE7000000;
    g->w1 = 0;
    func_000225d0(D_801969B0, -160.0f, 160.0f, -120.0f, 120.0f, 1.0f, 2000.0f, 1.0f);
    guTranslate(D_801969B0 + 1, (*(f32 *)((u8 *)(o) + (4))), (*(f32 *)((u8 *)(o) + (8))), (*(f32 *)((u8 *)(o) + (0xC))));
    guScale(D_801969B0 + 2, (*(f32 *)((u8 *)(o) + (0x1C))), (*(f32 *)((u8 *)(o) + (0x20))), (*(f32 *)((u8 *)(o) + (0x24))));
    func_00023018(D_801969B0 + 3, (*(f32 *)((u8 *)(o) + (0x10))), (*(f32 *)((u8 *)(o) + (0x14))), (*(f32 *)((u8 *)(o) + (0x18))));
    Mtx1F8_Push(0xDA380007);
    Mtx1F8_Push(0xDA380003);
    Mtx1F8_Push(0xDA380001);
    Mtx1F8_Push(0xDA380001);
}
