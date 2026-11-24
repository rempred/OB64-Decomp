typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A974;
extern u8 *D_801CE8BC;
void func_002AC948(u8 slot, s32 cell) {
    s32 i;
    s32 k;
    u8 *d;
    u8 *a;
    u8 *b;
    u8 *u;
    s32 row;
    row = cell / 3;
    for (i = 0; i < 20; i++) {
        u = D_801CE8BC + 0x1C4 + i * 0xF8;
        if ((*(s32 *)((u8 *)(u) + (0x48))) != 0 && (*(s32 *)((u8 *)(u) + (0x58))) == row && (*(s32 *)((u8 *)(u) + (0x54))) == cell - (*(s32 *)((u8 *)(u) + (0x58))) * 3) {
            break;
        }
    }
    if (i < 20) {
        d = D_8022A974;
        for (k = 0; k < 28; k++) {
            if ((*(u8 * *)((u8 *)(d + k * 4) + (0x18))) != ((void *)0) && (*(u8 * *)((u8 *)(d + k * 4) + (0x18)))[0x147] == i) {
                b = (*(u8 * *)((u8 *)(d + (u8)k * 4) + (0x18)));
                a = (*(u8 * *)((u8 *)(d + slot * 4) + (0x18)));
                (*(u8 * *)((u8 *)(d + (u8)k * 4) + (0x18))) = a;
                (*(u8 * *)((u8 *)(d + slot * 4) + (0x18))) = b;
                if (b != ((void *)0)) {
                    (*(s32 *)((u8 *)(b) + (0xE4))) = slot;
                }
                if (a != ((void *)0)) {
                    (*(s32 *)((u8 *)(a) + (0xE4))) = (u8)k;
                }
                return;
            }
        }
    }
}
