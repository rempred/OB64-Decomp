typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[0x10];
    s32 w10;
    u8 unk14[4];
    s16 fade;
    u8 unk1A[0xC];
    u16 h26;
    s16 step;
    u8 unk2A[2];
    s32 from[4];
    s32 cur[4];
    s32 to[4];
} Win514;
void func_0005214c(Win514 *w, s32 a, s16 x0, s16 y0, s16 x1, s16 y1) {
    w->w10 = a;
    w->cur[0] = x0;
    w->cur[1] = y0;
    w->step = 3;
    w->h26 = 0x8000;
    w->cur[2] = x1;
    w->cur[3] = y1;
}
