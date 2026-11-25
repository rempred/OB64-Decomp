typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
extern inline void func_002a3a00(s32 i) {
    u8 *a = (((u8 **)(D_8022A974 + 0x2B8))[i]);
    func_000016C4((*(void * *)((u8 *)(a) + (0x14))));
    func_000016C4((*(void * *)((u8 *)(a) + (0x18))));
    func_000016C4((*(void * *)((u8 *)(a) + (0x1C))));
    func_000016C4((((u8 **)(D_8022A974 + 0x2B8))[i]));
    (((u8 **)(D_8022A974 + 0x2B8))[i]) = ((void *)0);
}
void func_002a3e10(void) {
    s32 i;
    for (i = 0; i < 28; i++) {
        u8 *a = (((u8 **)(D_8022A974 + 0x2B8))[i]);
        if (a != ((void *)0)) {
            u8 *u = ((u8 **)(D_8022A974 + 0x18))[i];
            s32 k = (*(s32 *)((u8 *)(a) + (4)));
            (*(s32 *)((u8 *)(a) + (4))) = k + 1;
            (*(f32 *)((u8 *)(u) + (0x11C))) = (*(f32 * *)((u8 *)(a) + (0x14)))[k];
            (*(f32 *)((u8 *)(u) + (0x120))) = (*(f32 * *)((u8 *)(a) + (0x18)))[k];
            (*(f32 *)((u8 *)(u) + (0x124))) = (*(f32 * *)((u8 *)(a) + (0x1C)))[k];
            if ((*(s32 *)((u8 *)(a) + (4))) == (*(s32 *)((u8 *)(a) + (0)))) {
                func_002a3a00(i);
            }
        }
    }
}
