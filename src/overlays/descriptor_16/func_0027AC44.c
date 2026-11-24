typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
s32 D_801AD9D4(void *, s32);
s32 D_801C8E30(u8 **u);
u8 **D_801C8FE8(s32 i);
void func_0027AC44(void) {
    s32 i;
    u32 k;
    u8 **u;
    for (i = 0; i < 20; i++) {
        u = D_801C8FE8(i);
        if (u == ((void *)0)) {
            continue;
        }
        if (i == 0) {
            for (k = 0; k < 3; k++) {
                if (u[k] != ((void *)0)) {
                    D_801AD9D4(u[k] + 0x44, 0);
                }
            }
        } else if ((*(s32 *)((u8 *)(u) + (0x40))) & 2) {
            for (k = 0; k < 3; k++) {
                if (u[k] != ((void *)0)) {
                    D_801AD9D4(u[k] + 0x44, 0x26);
                }
            }
        } else if ((*(u16 *)((u8 *)(u) + (0x20))) == 0) {
            for (k = 0; k < 3; k++) {
                if (u[k] != ((void *)0)) {
                    D_801AD9D4(u[k] + 0x44, 0x20);
                    (*(s16 *)((u8 *)(u[k]) + (0x34))) = 0;
                }
                if (u[k + 3] != ((void *)0)) {
                    (*(s16 *)((u8 *)(u[k + 3]) + (0x34))) = 0;
                }
            }
        } else if (D_801C8E30(u) == 0) {
            for (k = 0; k < 3; k++) {
                if (u[k] != ((void *)0)) {
                    D_801AD9D4(u[k] + 0x44, 8);
                    if (i == 1) {
                        (*(u16 *)((u8 *)(u[k]) + (0x1C))) -= 50;
                    }
                }
                if (u[k + 3] != ((void *)0)) {
                    if (i == 1) {
                        (*(u16 *)((u8 *)(u[k + 3]) + (0x1C))) -= 50;
                    }
                }
            }
        }
    }
}
