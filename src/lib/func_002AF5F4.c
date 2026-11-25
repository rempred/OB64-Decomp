typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_8022A974;
void func_002AF5F4(void) {
    f32 *c = (*(f32 * *)((u8 *)(D_8022A974) + (0x19B4)));
    s32 i;
    if (c != ((void *)0)) {
        for (i = 0; i < 28; i++) {
            if (((u8 **)(D_8022A974 + 0x18))[i] != ((void *)0)) {
                u8 *u = ((u8 **)(D_8022A974 + 0x18))[i];
                f32 a;
                f32 b;
                if (c[1] == 0.0f) {
                    a = c[0];
                    b = (*(f32 *)((u8 *)(u) + (0x11C)));
                } else if (c[0] == 0.0f) {
                    a = c[1];
                    b = (*(f32 *)((u8 *)(u) + (0x124)));
                } else {
                    a = c[0] * (*(f32 *)((u8 *)(u) + (0x11C))) + c[1];
                    b = (*(f32 *)((u8 *)(u) + (0x124)));
                }
                if (a < b) {
                    u[0x13E] = ((u8 *)c)[8];
                } else {
                    u[0x13E] = ((u8 *)c)[9];
                }
            }
        }
    }
}
