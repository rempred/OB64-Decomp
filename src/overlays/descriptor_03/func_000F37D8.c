typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
s32 func_000F3704(u16 *grid, s32 x, s32 row);
extern inline s32 func_000F3704(u16 *grid, s32 x, s32 row) {
    u16 *p = &grid[14] + grid[14 + row];
    u16 w;
    u16 j;
    u16 i;
    if (x < 0 || x >= grid[0] || row < 0 || row >= grid[1]) {
        return 0;
    }
    i = 0;
    j = 0;
    while (1) {
        w = p[j++];
        if ((w >> 8) != 0xFF) {
            if (i++ < x) {
                continue;
            }
            return w;
        } else {
            i += w & 0xFF;
            if (i - 1 >= x) {
                return p[j];
            }
            j++;
        }
    }
}
typedef struct {
    u16 *grids[10];
    u8 pad28[4];
    u8 grid;
    u8 pad2D[0xA8 - 0x2D];
} SceneGrids;
extern SceneGrids D_800E8328[];
s32 func_000F37D8(s32 slot, s32 x, s32 z, s32 *h) {
    u16 *g = D_800E8328[slot].grids[D_800E8328[slot].grid];
    s32 m;
    s32 r;
    m = h[0] = func_000F3704(g, x, z);
    r = 0;
    h[1] = func_000F3704(g, x + 1, z);
    if (m < h[1]) {
        r = 1;
        m = h[1];
    }
    h[2] = func_000F3704(g, x, z + 1);
    if (m < h[2]) {
        r = 2;
        m = h[2];
    }
    z++;
    x++;
    h[3] = func_000F3704(g, x, z);
    if (m < h[3]) {
        r = 3;
    }
    return r;
}
