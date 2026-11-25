typedef unsigned char u8;
typedef signed int s32;
extern u8 D_800E7A90[];
extern u8 D_8018F520;
extern u8 D_8018F521;
s32 D_80186210(s32 flag);
extern u8 D_8018F522;
void func_0013B888(void) {
    u8 *cells = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x33]];
    u8 *tiles = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x32]];
    s32 y;
    s32 x;
    if (D_80186210(0x4)) {
        {
            u8 *f = &D_8018F520;
            *f &= 0xDF;
        }
        cells[0x3A0] = 3;
        for (y = 0x37; y < 0x39; y++) {
            for (x = 0x81; x < 0x85; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F520;
        *f |= 0x20;
    }
    if (D_80186210(0x5)) {
        {
            u8 *f = &D_8018F520;
            *f &= 0x7F;
        }
        cells[0x60F] = 3;
        for (y = 0x61; y < 0x64; y++) {
            for (x = 0x3C; x < 0x3F; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F520;
        *f |= 0x80;
    }
    if (D_80186210(0x7)) {
        {
            u8 *f = &D_8018F521;
            *f &= 0xFD;
        }
        cells[0x631] = 3;
        for (y = 0x60; y < 0x63; y++) {
            for (x = 0xC5; x < 0xC8; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F521;
        *f |= 2;
    }
    if (D_80186210(0x6)) {
        {
            u8 *f = &D_8018F521;
            *f &= 0xF7;
        }
        cells[0xAA0] = 3;
        for (y = 0xAA; y < 0xAC; y++) {
            for (x = 0x81; x < 0x84; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F521;
        *f |= 8;
    }
    if (D_80186210(0x8)) {
        {
            u8 *f = &D_8018F521;
            *f &= 0xDF;
        }
        cells[0x847] = 3;
        for (y = 0x83; y < 0x86; y++) {
            for (x = 0x1C; x < 0x1F; x++) {
                tiles[(y << 8) + x] = 1;
            }
        }
    } else {
        u8 *f = &D_8018F521;
        *f |= 0x20;
    }
    if (D_80186210(0xA)) {
        {
            u8 *f = &D_8018F521;
            *f &= 0x7F;
        }
        cells[0x83A] = 3;
        for (y = 0x80; y < 0x83; y++) {
            for (x = 0xEA; x < 0xED; x++) {
                tiles[(y << 8) + x] = 3;
            }
        }
    } else {
        u8 *f = &D_8018F521;
        *f |= 0x80;
    }
    if (D_80186210(0x9)) {
        {
            u8 *f = &D_8018F522;
            *f &= 0xFD;
        }
        cells[0xE60] = 3;
        for (y = 0xE5; y < 0xE7; y++) {
            for (x = 0x82; x < 0x84; x++) {
                tiles[(y << 8) + x] = 1;
            }
        }
    } else {
        u8 *f = &D_8018F522;
        *f |= 2;
    }
}
