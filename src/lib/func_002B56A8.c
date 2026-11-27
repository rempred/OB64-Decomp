typedef unsigned char u8;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 *D_8022A974;
void func_00019e10(void);
void func_002B56A8(s32 k, s32 keep);
void func_002B56A8(s32 k, s32 keep) {
    s32 i;
    s32 end;
    u8 *o;
    if (k == -1) {
        k = 0;
        end = 20;
    } else {
        end = k + 1;
    }
    for (i = k; i < end; i++) {
        o = ((u8 **)(D_8022A974 + 0x19F4))[i];
        if (o != ((void *)0)) {
            if (keep == 1) {
                o[0x86] = 1;
            } else {
                func_00019e10();
                func_000016C4((*(void * *)((u8 *)(o) + (0))));
                func_000016C4((*(void * *)((u8 *)(o) + (4))));
                func_000016C4((*(void * *)((u8 *)(o) + (8))));
                func_000016C4(o);
                ((u8 **)(D_8022A974 + 0x19F4))[i] = ((void *)0);
            }
        }
    }
}
