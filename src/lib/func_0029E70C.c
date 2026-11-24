typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
typedef struct {
    u8 unk000[0xE8];
    s32 wE8;
    s32 wEC;
    s32 wF0;
    s32 wF4;
    s32 wF8;
    u8 unk0FC[0x20];
    f32 f11C;
    f32 f120;
    f32 f124;
    s32 w128;
    f32 f12C;
    f32 f130;
    s16 h134;
    s16 h136;
    u8 unk138[2];
    s16 h13A;
    u8 unk13C;
    u8 b13D;
    u8 unk13E[7];
    u8 b145;
    u8 b146;
    u8 b147;
    u8 unk148;
    u8 b149;
} BUnit;
s32 func_002a3198(s32 a, s32 b, s32 c, s32 d, u8 *r, u8 *g, u8 *bl);
u8 D_801C1AA4(s32 a, s32 b, u8 c, s16 d, s16 e, s32 f, u8 *r, u8 *g, u8 *bl);
s32 func_0029E70C(BUnit *u) {
    u8 c[3];
    u8 r;
    u->wF4 = 0;
    while (1) {
        u->wF0++;
        if (u->b13D == 0) {
            r = func_002a3198(u->wE8, u->h134, u->wF0, u->b146, &c[0], &c[1], &c[2]);
        } else {
            r = D_801C1AA4(u->wE8, u->wEC, u->b146, u->h13A, u->h134, u->wF0, &c[0], &c[1], &c[2]);
        }
        if (r == 4) {
            u->wF0 -= 2;
            break;
        }
    }
    return 4;
}
