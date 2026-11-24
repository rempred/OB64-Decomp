typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
extern u8 *D_8023DE30;
void func_0028DC98(s16 a, s16 b);
void func_0028DC98(s16 x, s16 y) {
    u8 x0 = 0;
    u8 y0 = 0;
    u8 i;
    s32 inside;
    if (x >= 2) {
        x0 = x - 2;
    }
    if (y >= 2) {
        y0 = y - 2;
    }
    for (i = 0; i < 10; i++) {
        u8 *r = (*(u8 ** *)((u8 *)(D_8023DE30) + (0x168 + i * 4)));
        if (r == ((void *)0)) {
            break;
        }
        inside = r[2] >= x0;
        if (r[3] < y0) {
            inside = 0;
        }
        if (x0 + 12 < r[0]) {
            inside = 0;
        }
        if (y0 + 8 < r[1]) {
            inside = 0;
        }
        if (!inside) {
            r[4] = 0xFF;
            r[6] = 0xFF;
            r[5] = 0xFF;
            r[7] = 0xFF;
        } else {
            r[4] = r[0];
            r[6] = r[2];
            r[5] = r[1];
            r[7] = r[3];
            if (r[0] < x0) {
                r[4] = x0;
            }
            if (r[1] < y0) {
                r[5] = y0;
            }
            if (x0 + 12 < r[2]) {
                r[6] = x0 + 12;
            }
            if (y0 + 8 < r[3]) {
                r[7] = y0 + 8;
            }
        }
    }
}
