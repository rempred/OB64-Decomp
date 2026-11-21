typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u32 w0;
    u32 w1;
} Gfx;
typedef struct {
    u8 unk00[0x18];
    s32 *w18;
    s16 h1C;
    s16 h1E;
    u8 *w20;
    u8 *w24;
    s16 h28;
} Obj27;
extern Gfx *gTitleCardDisplayListCursor;
extern Obj27 *D_8022CB20;
void func_0027F0EC(Obj27 *o);
void func_0027EEE0(Obj27 *o);
void func_0027F234(Obj27 *o);
void func_0027F3EC(Obj27 *o);
void func_00280460(void) {
    Gfx *g = gTitleCardDisplayListCursor;
    Obj27 *o = D_8022CB20;
    u8 *q;
    g->w0 = 0xFA000000;
    q = *(u8 **)o;
    gTitleCardDisplayListCursor = g + 1;
    g->w1 = q[0x19] | 0xFFFFFF00;
    func_0027F0EC(o);
    func_0027EEE0(D_8022CB20);
    func_0027F234(D_8022CB20);
    func_0027F3EC(D_8022CB20);
}
