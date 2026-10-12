typedef unsigned char u8;
typedef signed char s8;
typedef unsigned short u16;
typedef signed short s16;
typedef unsigned int u32;
typedef int s32;

extern u8 D_8018F481;
extern u8 D_801951B0[];
extern u8 D_801E7E13[], D_801E7E14[];
extern void *D_801F0CB0[];
extern s32 func_0005c110(s32);
extern s32 func_00045df4(s16);
extern void func_801B2B78(void *);
/* The address is shared by separately loaded images. Keep this call neutral. */
extern void func_80214F80(u16, s32, s8, u8);

void func_0013109C(u16 site)
{
    s8 out0;
    u8 out1;
    u8 scenario;
    s32 selection;
    s32 index;
    void **units;
    u16 flags;

    scenario = D_8018F481;
    if (((scenario == 0x2D) & (site == 7)) ||
        ((scenario == 0x2E) & (site == 7))) {
        selection = 4;
    } else if (((scenario == 0x32) & (site == 6)) ||
               ((scenario == 0x14) & (site == 11)) ||
               ((scenario == 0x15) & (site == 11))) {
        selection = 5;
    } else if (((scenario == 0x25) & (site == 6)) ||
               ((scenario == 0x26) & (site == 6))) {
        selection = 6;
    } else {
        flags = *(u16 *)(D_801951B0 + site * 36 + 28);
        if (flags & 0x800) {
            selection = 10;
        } else if (flags & 0x400) {
            selection = 9;
        } else if (flags & 0x20) {
            selection = 0;
        } else {
            flags = *(u16 *)(D_801951B0 + site * 36 + 28);
            if (flags & 0x40) {
                selection = 1;
            } else {
                selection = (flags & 0x80) ? 3 : 2;
            }
        }
    }

    scenario = D_8018F481;
    if (scenario == 0x27) {
        if (site == 0) {
            selection = 6;
        } else if (site == 1) {
            selection = 7;
        } else {
            selection = 8;
        }
    } else if ((u32)(scenario - 0x2F) < 2 ||
               (u32)(scenario - 0x3C) < 2) {
        if (site == 0) {
            selection = 4;
        } else if (site == 5) {
            selection = 8;
        } else {
            selection = 7;
        }
    } else if (scenario == 0x33) {
        if (site == 0) {
            selection = 5;
        } else if (site == 3) {
            selection = 8;
        } else {
            selection = 7;
        }
    }

    flags = *(u16 *)(D_801951B0 + site * 36 + 28);
    if (flags & 2) {
        out0 = D_801E7E13[D_8018F481 * 12];
        if (func_0005c110(0x11)) {
            if (func_00045df4(0x6B)) {
                out0 = 1;
            } else {
                out0 = 4;
            }
        }
        out1 = 1;
    } else if (flags & 4) {
        out0 = D_801E7E14[D_8018F481 * 12];
        out1 = 2;
    } else {
        out0 = -1;
        out1 = 0;
    }

    index = 0;
    units = D_801F0CB0;
    do {
        void *unit = *units++;

        index++;
        func_801B2B78(unit);
    } while (index < 50);
    func_80214F80(site, selection, out0, out1);
}
