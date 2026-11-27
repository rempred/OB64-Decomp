typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8022A970;
extern u8 *D_8022A974;
extern u8 D_8022A997;
void memcpy_aligned(void *dst, void *src, s32 n);
void func_002B47D0(void) {
    u8 tmp[0x58];
    s32 save;
    u8 i;
    u8 *d;
    D_8022A970[0x838] = D_8022A970[0x839];
    d = D_8022A974 + D_8022A997 * 4;
    save = (*(s32 *)((u8 *)(d) + (0x1C00)));
    memcpy_aligned(tmp, (*(void * *)((u8 *)(d) + (0x1C50))), 0x58);
    for (i = D_8022A997 - 2; i >= D_8022A970[0x838]; i--) {
        d = D_8022A974 + i * 4;
        (*(s32 *)((u8 *)(d) + (0x1C08))) = (*(s32 *)((u8 *)(d) + (0x1C04)));
        memcpy_aligned((*(void * *)((u8 *)(d) + (0x1C58))), (*(void * *)((u8 *)(d) + (0x1C54))), 0x58);
    }
    memcpy_aligned((*(void * *)((u8 *)(D_8022A974 + D_8022A970[0x838] * 4) + (0x1C54))), tmp, 0x58);
    (*(s32 *)((u8 *)(D_8022A974 + D_8022A970[0x838] * 4) + (0x1C04))) = save;
}
