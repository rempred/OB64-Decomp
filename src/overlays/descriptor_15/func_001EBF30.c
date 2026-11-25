typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *D_8009DD38(u32 handle);
void bzero(void *p, s32 n);
void *func_00001330(s32 size);
extern u16 D_801BA6C0;
extern u8 *D_801B989C;
void func_001E9138(void);
void func_00003564(s32 a, s32 b, s32 c, s32 d, s32 e, s32 f, s32 g);
void func_001EAE50(void);
void func_001EAE50(void);
void func_001EBF30(void) {
    u8 *p;
    func_001E9138();
    func_00003564(0, 1, 1, 0x200, 1, 0x800, 0x2000);
    D_801B989C = func_00001330(0x150);
    bzero(D_801B989C, 0x150);
    p = D_801B989C;
    (*(void * *)((u8 *)(p) + (8))) = D_8009DD38(0x1DD375A);
    func_001EAE50();
    D_801BA6C0 = (D_801BA6C0 ^ D_801BA6C0) | 1;
}
