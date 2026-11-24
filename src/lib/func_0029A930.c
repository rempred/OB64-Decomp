typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
typedef struct {
    void *data;
    s16 h4;
} Grid29;
typedef struct {
    u8 from[3];
    u8 to[3];
    s16 h6;
    s16 h8;
    s16 hA;
} Pair29;
typedef struct {
    u8 unk0000[0x168];
    void *p168[0x38];
    Pair29 *p248[0x5BF];
    void *p1944[0x1C];
    u8 unk19B4[0x94];
    Grid29 *grid;
    u8 unk1A4C[0x168];
    void *p1BB4[20];
} Battle29;
extern Battle29 *D_8022A974;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx29;
extern Gfx29 *gTitleCardDisplayListCursor;
typedef struct { s32 m[16]; } Mtx29;
extern Mtx29 *D_801969B0;
extern u8 D_8022A9F0[];
extern u8 D_8022AAE0[];
void guRotate(void *m, f32 a, f32 x, f32 y, f32 z);
void guScale(void *m, f32 x, f32 y, f32 z);
void guTranslate(void *m, f32 x, f32 y, f32 z);
typedef struct {
    u8 unk0[0x20];
    void (*draw)(void *, s32, s32);
    s32 x;
    s32 y;
    u8 unk2C[0x14];
    s16 angle;
    s16 unk42;
    u16 kind;
    s16 unk46;
    s16 scale;
    u8 layer;
} Fx29;
void func_0029A930(s16 layer, u8 front) {
    s32 i;
    {
        Gfx29 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_8022A9F0;
    }
    for (i = 0; i < 30; i++) {
        Fx29 *e = (*(Fx29 * *)((u8 *)(D_8022A974) + (0x1AC0 + i * 4)));
        if (e == ((void *)0) || e->layer != layer) {
            continue;
        }
        if (e->kind == 800 || e->kind == 801) {
            if (front == 0) {
                continue;
            }
        } else if (front != 0) {
            continue;
        }
        gTitleCardDisplayListCursor->w0 = 0xDE000000;
        gTitleCardDisplayListCursor->w1 = (u32)D_8022AAE0;
        gTitleCardDisplayListCursor++;
        gTitleCardDisplayListCursor->w0 = 0xFB000000;
        gTitleCardDisplayListCursor->w1 = 1;
        gTitleCardDisplayListCursor++;
        gTitleCardDisplayListCursor->w0 = 0xD7000002;
        gTitleCardDisplayListCursor->w1 = 0x80008000;
        gTitleCardDisplayListCursor++;
        guTranslate(D_801969B0, e->x, e->y, 0.0f);
        gTitleCardDisplayListCursor->w0 = 0xDA380000;
        gTitleCardDisplayListCursor->w1 = (u32)D_801969B0;
        gTitleCardDisplayListCursor++;
        D_801969B0++;
        if (e->angle != 180) {
            guRotate(D_801969B0, e->angle + 180, 0.0f, 0.0f, 1.0f);
            {
                Gfx29 *g = gTitleCardDisplayListCursor++;
                g->w0 = 0xDA380001;
                g->w1 = (u32)D_801969B0++;
            }
        }
        if (e->scale != 100) {
            f32 s = e->scale / 100.0f;
            guScale(D_801969B0, s, s, s);
            {
                Gfx29 *g = gTitleCardDisplayListCursor++;
                g->w0 = 0xDA380001;
                g->w1 = (u32)D_801969B0++;
            }
        }
        e->draw(e, 0xFF, (u8)layer);
        {
            Gfx29 *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xE7000000;
            g->w1 = 0;
        }
        {
            Gfx29 *g = gTitleCardDisplayListCursor++;
            g->w0 = 0xD8380002;
            g->w1 = 0x40;
        }
    }
    {
        Gfx29 *g = gTitleCardDisplayListCursor++;
        g->w0 = 0xDE000000;
        g->w1 = (u32)D_8022A9F0;
    }
}
