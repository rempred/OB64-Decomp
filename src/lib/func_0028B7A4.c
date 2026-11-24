typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
extern Gfx *gTitleCardDisplayListCursor;
extern u8 *D_8023DE30;
typedef struct {
    u8 b[0x40];
} Mtx28;
extern u32 D_801969B0;
void func_0028B7A4(void);
void guTranslate(Mtx28 *m, f32 x, f32 y, f32 z);
void func_000225d0(void *, float, float, float, float, float, float, float);
void func_0028ED60();
void func_0028C2A0(s32 a);
void func_0028D0F0(void);
void func_0028F18C(void);
void func_0028B7A4(void) {
    { Gfx *_g = (Gfx *)(gTitleCardDisplayListCursor++); _g->w0 = ((unsigned int)(((unsigned int)(0xE7) & ((0x01 << (8)) - 1)) << (24))); _g->w1 = 0; };
    func_000225d0((Mtx28 *)D_801969B0, -160.0f, 160.0f, -120.0f, 120.0f, -1000.0f, 2000.0f, 1.0f);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380007;
        _g->w1 = (D_801969B0 += 0x40) - 0x40;
    }
    guTranslate((Mtx28 *)D_801969B0, 0.0f, 0.0f, 0.0f);
    {
        Gfx *_g = gTitleCardDisplayListCursor++;
        _g->w0 = 0xDA380003;
        _g->w1 = (D_801969B0 += 0x40) - 0x40;
    }
    if (D_8023DE30[0x238] == 0) {
        func_0028ED60();
        func_0028C2A0(0);
        func_0028D0F0();
        func_0028F18C();
    }
}
