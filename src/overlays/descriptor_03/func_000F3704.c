typedef unsigned short u16;
typedef signed int s32;
s32 func_000F3704(u16 *grid, s32 x, s32 row);
inline s32 func_000F3704(u16 *grid, s32 x, s32 row) {
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
