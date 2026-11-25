typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
inline void func_002B68B4(s32 s) {
    s32 i;
    s32 end;
    if (s == -1) {
        s = 0;
        end = 20;
    } else {
        end = s + 1;
    }
    for (i = s; i < end; i++) {
        u8 *e = ((u8 **)(D_8022A974 + 0x1B38))[i];
        if (e != ((void *)0)) {
            func_000016C4((*(void * *)((u8 *)(e) + (0x68))));
            func_000016C4((*(void * *)((u8 *)(e) + (0x6C))));
            func_000016C4(e);
            ((u8 **)(D_8022A974 + 0x1B38))[i] = ((void *)0);
        }
    }
}
