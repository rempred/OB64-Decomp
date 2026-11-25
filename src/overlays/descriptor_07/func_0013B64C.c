typedef unsigned char u8;
typedef signed int s32;
extern u8 D_800E7A90[];
extern u8 D_8018F520;
extern u8 D_8018F521;
s32 D_80186210(s32 flag);
void func_0013B64C(void) {
    u8 *cells = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x33]];
    u8 *tiles = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x32]];
    s32 y;
    s32 x;
    if (D_80186210(1)) {
        {
            u8 *f = &D_8018F520;
            *f &= 0xDF;
        }
        for (y = 0xE; y < 0xF; y++) {
            for (x = 0x1F; x < 0x21; x++) {
                cells[(y << 6) + x] = 1;
            }
        }
        for (y = 0x3B; y < 0x3D; y++) {
            for (x = 0x7D; x < 0x82; x++) {
                tiles[(y << 8) + x] = 1;
            }
        }
    } else {
        u8 *f = &D_8018F520;
        *f |= 0x20;
    }
    if (D_80186210(2)) {
        {
            u8 *f = &D_8018F520;
            *f &= 0x7F;
        }
        cells[0xA8F] = 1;
        for (y = 0xA9; y < 0xAB; y++) {
            for (x = 0x3B; x < 0x3F; x++) {
                tiles[(y << 8) + x] = 1;
            }
        }
    } else {
        u8 *f = &D_8018F520;
        *f |= 0x80;
    }
    if (D_80186210(3)) {
        {
            u8 *f = &D_8018F521;
            *f &= 0xFD;
        }
        for (y = 0x2A; y < 0x2B; y++) {
            for (x = 0x30; x < 0x31; x++) {
                cells[(y << 6) + x] = 1;
            }
        }
        for (y = 0xA9; y < 0xAB; y++) {
            for (x = 0xC0; x < 0xC4; x++) {
                tiles[(y << 8) + x] = 1;
            }
        }
    } else {
        u8 *f = &D_8018F521;
        *f |= 2;
    }
}
