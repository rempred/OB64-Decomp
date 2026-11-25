typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
inline void func_002a3a00(s32 i) {
    u8 *a = (((u8 **)(D_8022A974 + 0x2B8))[i]);
    func_000016C4((*(void * *)((u8 *)(a) + (0x14))));
    func_000016C4((*(void * *)((u8 *)(a) + (0x18))));
    func_000016C4((*(void * *)((u8 *)(a) + (0x1C))));
    func_000016C4((((u8 **)(D_8022A974 + 0x2B8))[i]));
    (((u8 **)(D_8022A974 + 0x2B8))[i]) = ((void *)0);
}
