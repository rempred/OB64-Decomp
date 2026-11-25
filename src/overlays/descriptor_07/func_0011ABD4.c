typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern struct {
    u8 pad[0x32];
    u8 b32;
} D_800E7A90;
extern u16 D_801F36D8[][32];
s32 func_0011ABD4(u8 *u, s32 cell) {
    s32 n = 0;
    s32 sy = 0;
    s32 sx = 0;
    s32 found = 0;
    s32 bx = cell % 64 * 4;
    s32 by = cell / 64 * 4;
    u16 best = 0xFFFF;
    u8 *map = (u8 *)((s32 *)&D_800E7A90)[D_800E7A90.b32];
    s32 res = by * 256 + bx;
    u16 *cost = D_801F36D8[(*(s32 *)((u8 *)(u) + (0x70)))];
    s32 x;
    s32 y;
    for (x = 0; x < 4; x++) {
        for (y = 0; y < 4; y++) {
            s32 off = ((by + y) << 8) + (bx + x);
            u16 c = cost[map[off]];
            if (c < best) {
                n = 0;
                sy = 0;
                sx = 0;
                best = c;
                res = off;
                found = 1;
            } else if (c == best) {
                n++;
                sx += x;
                sy += y;
                found = 1;
            }
        }
    }
    if (!found) {
        res = ((by << 8) | 0x101) + bx;
    } else if (n != 0) {
        res = ((by + sy / (n + 1)) << 8) + (bx + sx / (n + 1));
    }
    return res;
}
