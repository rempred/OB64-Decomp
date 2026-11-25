typedef unsigned char u8;
typedef signed int s32;
void *func_00001330(s32 size);
extern u8 *D_801B81B0;
extern u8 D_801B8368[];
extern u8 D_801B8370[];
extern u8 D_801B8378[];
extern u8 D_801B8380[];
extern s32 D_801BA6EC;
extern s32 D_801BA6F0;
extern u8 D_801BA6E1;
void func_001D5AA8(void *a, void *b, void *c, void *d, void *e, s32 f);
void func_001CF960(void);
void func_001D140C(void);
void func_001D7514(void);
void func_001D4F44(void);
void func_00003564(s32 a, s32 b, s32 c, s32 d, s32 e, s32 f, s32 g);
void bzero(void *p, s32 n);
void func_001D4F44(void);
extern inline void func_001D7210(void) {
    func_001D5AA8(D_801B8368, D_801B8368, D_801B8370, D_801B8378,
                             D_801B8380, 2);
}
void func_001D7F0C(void) {
    func_001CF960();
    D_801B81B0 = func_00001330(0x834);
    bzero(D_801B81B0, 0x834);
    func_001D140C();
    func_001D7210();
    func_001D7514();
    func_001D4F44();
    D_801BA6EC = 0;
    D_801BA6F0 = 0;
    D_801BA6E1 = 0;
    func_00003564(0, 1, 1, 0x80, 1, 0x40, 0x4E8);
}
