typedef unsigned char u8;
typedef signed int s32;
extern u8 D_800E7A90[];
extern u8 D_8018F520;
extern u8 D_8018F521;
s32 D_80186210(s32 flag);
void func_0013BC5C(void) {
    u8 *cells = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x33]];
    u8 *tiles = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x32]];
    s32 y;
    s32 x;
    if (D_80186210(0xB)) {
        {
            u8 *f = &D_8018F520;
            *f &= 0xDF;
        }
        cells[0x5DA] = 1;
        for (y = 0x5D; y < 0x60; y++) {
            for (x = 0x6B; x < 0x6D; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F520;
        *f |= 0x20;
    }
    if (D_80186210(0xC)) {
        {
            u8 *f = &D_8018F520;
            *f &= 0x7F;
        }
        cells[0x5E5] = 1;
        for (y = 0x5D; y < 0x60; y++) {
            for (x = 0x93; x < 0x95; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F520;
        *f |= 0x80;
    }
    if (D_80186210(0xD)) {
        {
            u8 *f = &D_8018F521;
            *f &= 0xFD;
        }
        cells[0xC1F] = 1;
        cells[0xC20] = 1;
        for (y = 0xC3; y < 0xC5; y++) {
            for (x = 0x7E; x < 0x82; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F521;
        *f |= 2;
    }
}
