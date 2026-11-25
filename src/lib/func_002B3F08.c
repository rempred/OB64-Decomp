typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A970;
extern u8 *D_8022A974;
extern u8 D_8022A997;
void memcpy_aligned(void *dst, void *src, s32 n);
void func_002B3F08(void) {
    u8 i;
    (*(s32 *)((u8 *)(D_8022A974) + (0x1C08))) = (*(s32 *)((u8 *)(D_8022A970) + (0x4C)));
    for (i = 0; i < 20; i++) {
        u8 *d = D_8022A974;
        ((s32 *)(d + 0x1C04))[i] = ((s32 *)(D_8022A970 + 0x58))[i];
        memcpy_aligned(((u8 **)(d + 0x1C54))[i], D_8022A970 + 0xB8 + i * 0x58, 0x58);
    }
    if ((*(u8 * *)((u8 *)(D_8022A974) + (0x1A44))) != ((void *)0)) {
        (*(u8 * *)((u8 *)(D_8022A974) + (0x1A44)))[0x15] = D_8022A997 - 2;
    }
    func_000016C4((*(void * *)((u8 *)(D_8022A970) + (0x54))));
    (*(void * *)((u8 *)(D_8022A970) + (0x54))) = ((void *)0);
}
