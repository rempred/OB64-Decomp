typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 D_80187020;
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
void func_00052284(Win514 *w) {
    s32 cx;
    s32 cy;
    s32 c;
    s32 d0;
    s32 d1;
    s32 lo;
    s32 hi;
    cx = D_80187020 ? 320 : 160;
    cy = D_80187020 ? 240 : 120;
    if (w->from[0] == w->to[0] && w->from[1] == w->to[1] && w->from[2] == w->to[2] && w->from[3] == w->to[3]) {
        c = cx;
        lo = w->from[0];
        hi = w->from[2];
        d0 = lo - c;
        if (d0 < 0) {
            d0 = -d0;
        }
        d1 = hi - c;
        if (d1 < 0) {
            d1 = -d1;
        }
        if (d1 < d0) {
            w->cur[0] = w->from[0];
            w->cur[2] = w->from[0] + 8;
        } else {
            w->cur[0] = w->from[2] - 8;
            w->cur[2] = w->from[2];
        }
        c = cy;
        lo = w->from[1];
        hi = w->from[3];
        d0 = lo - c;
        if (d0 < 0) {
            d0 = -d0;
        }
        d1 = hi - c;
        if (d1 < 0) {
            d1 = -d1;
        }
        if (d1 < d0) {
            w->cur[1] = w->from[1];
            w->cur[3] = w->from[1] + 8;
        } else {
            w->cur[1] = w->from[3] - 8;
            w->cur[3] = w->from[3];
        }
    } else {
        w->cur[0] = w->to[0];
        w->cur[1] = w->to[1];
        w->cur[2] = w->to[2];
        w->cur[3] = w->to[3];
    }
    w->step = 2;
    w->h26 = 0x8000;
}
