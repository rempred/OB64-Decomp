typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A970;
extern u8 *D_8022A974;
extern u8 D_8022A997;
void memcpy_aligned(void *dst, void *src, s32 n);
void func_002B461C(void) {
    u8 tmp[0x58];
    s32 save;
    u8 i;
    u8 *d;
    for (i = 0; i < 28; i++) {
        u8 *o = (*(u8 * *)((u8 *)(D_8022A974 + i * 4) + (0x18)));
        if (o != ((void *)0) && o[0x13E] >= D_8022A970[0x838]) {
            o[0x13E]--;
        }
    }
    for (i = 0; i < 30; i++) {
        u8 *o = (*(u8 * *)((u8 *)(D_8022A974 + i * 4) + (0x1AC0)));
        if (o != ((void *)0) && D_8022A970[0x838] < o[0x4A]) {
            o[0x4A]--;
        }
    }
    save = ((s32 *)(D_8022A974 + 0x1C04))[D_8022A970[0x838]];
    memcpy_aligned(tmp, ((void **)(D_8022A974 + 0x1C54))[D_8022A970[0x838]], 0x58);
    for (i = D_8022A970[0x838]; i < D_8022A997 - 1; i++) {
        ((s32 *)(D_8022A974 + 0x1C04))[i] = ((s32 *)(D_8022A974 + 0x1C04))[i + 1];
        memcpy_aligned(((void **)(D_8022A974 + 0x1C54))[i], ((void **)(D_8022A974 + 0x1C54))[i + 1], 0x58);
    }
    d = D_8022A974 + D_8022A997 * 4;
    (*(s32 *)((u8 *)(d) + (0x1C00))) = save;
    memcpy_aligned((*(void * *)((u8 *)(d) + (0x1C50))), tmp, 0x58);
    D_8022A970[0x839] = D_8022A970[0x838];
    D_8022A970[0x838] = D_8022A997 - 1;
}
