typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void func_000c54c0(s32 k);
s32 func_000b246c(void);
typedef struct {
    u16 min;
    u16 max;
    u16 pos;
    u16 speed;
} Spin5FC;
typedef struct {
    s32 step[6];
} Steps5FC;
extern Steps5FC D_801EFF6C;
void func_000c54c0(s32 se);
void func_000c905c(Spin5FC *c) {
    Steps5FC t = D_801EFF6C;
    s32 step = t.step[c->speed];
    s32 d = func_000b246c();
    s32 old = c->pos;
    s32 v = old;
    switch (d) {
        case 1:
            v = old - step;
            break;
        case 0:
            v = old + step;
            break;
        case 2:
            if (c->max >= (u32)t.step[c->speed + 1]) {
                c->speed++;
            }
            break;
        case 3:
            c->speed = (c->speed != 0) ? c->speed - 1 : 0;
            break;
    }
    if (c->max < v) {
        c->pos = c->max;
    } else if (v < c->min) {
        c->pos = c->min;
    } else {
        c->pos = v;
    }
    if (old != c->pos) {
        func_000c54c0(2);
    }
}
