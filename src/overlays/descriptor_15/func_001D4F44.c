unsigned int D_8009DAF4(unsigned int);
void *D_8009DBB8(void *buffer, unsigned int key);
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void * func_00001330(unsigned int);
void *func_000016C4(void *ptr);
extern u8 *D_801B81B0;
void func_001D4F44(void);
void bzero(void *p, s32 n);
typedef struct {
    u8 pad0[4];
    u16 w;
    u16 h;
} Img1D4;
void * func_001CED40(int, int);
void func_001D4F44(void) {
    u32 *dir;
    u32 c;
    {
        u32 *d = D_8009DBB8(((void *)0), 0x322952);
        (*(void * *)((u8 *)(D_801B81B0) + (0x82C))) = D_8009DBB8(((void *)0), d[0x54 / 4]);
        func_000016C4(d);
    }
    (*(void * *)((u8 *)(D_801B81B0) + (0x814))) = func_00001330(0x38);
    bzero((*(void * *)((u8 *)(D_801B81B0) + (0x814))), 0x38);
    dir = func_00001330(D_8009DAF4(0x322952));
    D_8009DBB8(dir, 0x322952);
    c = dir[0x34 / 4];
    func_000016C4(dir);
    dir = func_00001330(D_8009DAF4(c));
    D_8009DBB8(dir, c);
    (*(void * *)((u8 *)(D_801B81B0) + (0x818))) = dir;
    (*(void * *)((u8 *)(D_801B81B0) + (0x81C))) = func_001CED40(0x1BA6410, 0x74);
    (*(void * *)((u8 *)(D_801B81B0) + (0x820))) = func_001CED40(0x1BA6410, 0xFF);
    (*(void * *)((u8 *)(D_801B81B0) + (0x824))) = func_001CED40(0x1C2F008, 2);
    (*(void * *)((u8 *)(D_801B81B0) + (0x828))) = func_001CED40(0x1C2F008, 0x2A);
}
