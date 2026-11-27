typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    s32 cur;
    s32 end;
    u16 x8;
    u16 xA;
    u16 xC;
    u16 xE;
    u16 x10;
    u16 x12;
    u8 dir;
} Ctr248;
u16 func_0024879C(Ctr248 *c) {
    if (c == ((void *)0)) {
        return 0;
    }
    if (c->dir == 0) {
        if (c->cur > c->end) {
            return 0;
        }
        return c->end - c->cur;
    }
    return c->cur;
}
