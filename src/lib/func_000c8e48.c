typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u16 D_800E8700;
void func_000c54c0(s32 k);
typedef struct {
    s16 pos;
    u16 top;
    u16 vis;
    u16 max;
} CursorC7;
void func_000c54c0(s32 se);
s32 func_000c8e48(CursorC7 *c) {
    u16 b = D_800E8700;
    u16 old = c->pos;
    if (b & 8) {
        s16 v;
        if (old != 0) {
            v = old - 1;
        } else {
            v = 0;
        }
        c->pos = v;
    } else if (b & 4) {
        s16 t = (s16)old < c->max;
        c->pos = t + old;
    }
    if (c->pos < c->top && c->pos >= 0) {
        c->top = c->pos;
    } else if (c->pos >= c->top + c->vis) {
        c->top++;
    }
    if (c->pos != (s16)old) {
        func_000c54c0(2);
    }
    return 0;
}
