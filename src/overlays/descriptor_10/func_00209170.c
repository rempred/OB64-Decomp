void bzero(void *memory, unsigned int bytes);
typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void * func_00001330(unsigned int);
void *D_8009DD38(u32 handle);
extern u8 *D_801CFA70;
void func_00209170(void) {
    if (D_801CFA70 == ((void *)0)) {
        D_801CFA70 = func_00001330(0x24C);
        bzero(D_801CFA70, 0x24C);
        (*(void * *)((u8 *)(D_801CFA70) + (0x240))) = D_8009DD38(0x1DF9F8C);
        (*(void * *)((u8 *)(D_801CFA70) + (0x244))) = D_8009DD38(0x1DB3672);
        (*(void * *)((u8 *)(D_801CFA70) + (0x248))) = D_8009DD38(0x1DC3064);
    }
}
