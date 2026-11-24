typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
typedef struct {
    u16 sec0;
    u16 unk02;
    u16 sec1;
    u8 unk06[0x10];
    u16 size;
} TblHdr;
extern TblHdr *D_8021C9E8;
extern inline void FreeTable1B7(u8 *t) {
    u32 i;
    u32 j;
    if (t != ((void *)0)) {
        for (i = 0; i < (*(u32 *)((u8 *)(t) + (0x108))); i++) {
            for (j = 0; j < (*(u32 *)((u8 *)(t + i * 0x2C) + (0x110))); j++) {
                func_000016C4((*(void * *)((u8 *)(t + i * 0x2C + j * 4) + (0x134))));
            }
        }
        func_000016C4(t);
    }
}
void func_001B9120(u8 **s) {
    FreeTable1B7(s[0]);
    FreeTable1B7(s[1]);
    func_000016C4(s);
    func_000016C4(D_8021C9E8);
    D_8021C9E8 = ((void *)0);
}
