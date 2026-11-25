typedef unsigned char u8;
typedef signed int s32;
extern u8 D_800E7A90[];
s32 D_80186210(s32 flag);
void func_0013BE34(void) {
    u8 *cells = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x33]];
    u8 *tiles = (u8 *)((s32 *)D_800E7A90)[D_800E7A90[0x32]];
    s32 y;
    s32 x;
    if (D_80186210(0x11)) {
        for (y = 0xC4; y < 0xF5; y++) {
            for (x = 0x41; x < 0x7A; x++) {
                u8 *p = &tiles[(y << 8) + x];
                switch (*p) {
                    case 0x20:
                        *p = 1;
                        break;
                    case 0x21:
                        *p = 2;
                        break;
                    case 0x22:
                        *p = 3;
                        break;
                    case 0x23:
                        *p = 0xF;
                        break;
                }
            }
        }
        for (y = 0x31; y < 0x3D; y++) {
            for (x = 0x11; x < 0x1E; x++) {
                u8 *p = &cells[(y << 6) + x];
                switch (*p) {
                    case 0x20:
                        *p = 1;
                        break;
                    case 0x21:
                        *p = 2;
                        break;
                    case 0x22:
                        *p = 3;
                        break;
                    case 0x23:
                        *p = 0xF;
                        break;
                }
            }
        }
    } else {
        for (y = 0xC4; y < 0xF5; y++) {
            for (x = 0x41; x < 0x7A; x++) {
                u8 *p = &tiles[(y << 8) + x];
                switch (*p) {
                    case 0x20:
                    case 0x21:
                    case 0x22:
                    case 0x23:
                        *p = 0;
                        break;
                }
            }
        }
        for (y = 0x31; y < 0x3D; y++) {
            for (x = 0x11; x < 0x1E; x++) {
                u8 *p = &cells[(y << 6) + x];
                switch (*p) {
                    case 0x20:
                    case 0x21:
                    case 0x22:
                    case 0x23:
                        *p = 0;
                        break;
                }
            }
        }
    }
}
