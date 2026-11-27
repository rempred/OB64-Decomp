typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *func_000016C4(void *ptr);
void bzero(void *p, s32 n);
extern u8 *D_801CE8BC;
extern f32 D_801CE8EC;
extern f32 D_801CE8F0;
extern f32 D_801CE8F4;
extern f32 D_801F0540;
extern f32 D_801F0544;
extern f32 D_801F0548;
u8 *D_801C8FE8(u32 i);
void D_801BE894(void);
void D_801ADB00(u8 *a);
void D_801ADBC0(void *actor);
void D_8020B098(void);
void D_801B0020(void);
void D_801C1D98(void);
void D_801C1A9C(void);
void D_801C234C(void);
void func_0023B498(void);
void func_0024128C(void);
void func_002426F0(void) {
    s32 i;
    if (D_801CE8BC == ((void *)0)) {
        return;
    }
    D_801CE8EC = D_801F0540;
    D_801CE8F0 = D_801F0544;
    D_801CE8F4 = D_801F0548;
    D_801BE894();
    for (i = 0; i < 3; i++) {
        u8 **e = (u8 **)D_801C8FE8(i);
        u32 j;
        if (e == ((void *)0)) {
            continue;
        }
        for (j = 0; j < 3; j++) {
            if (e[j] == ((void *)0)) {
                continue;
            }
            D_801ADB00(e[j]);
            D_801ADBC0(e[j + 3]);
            if ((*(void * *)((u8 *)(e[j]) + (0xBC))) != ((void *)0)) {
                func_000016C4((*(void * *)((u8 *)(e[j]) + (0xBC))));
                (*(void * *)((u8 *)(e[j]) + (0xBC))) = ((void *)0);
            }
            (*(s32 *)((u8 *)(e[j + 3]) + (0x18))) = 0;
            (*(s32 *)((u8 *)(e[j]) + (0x18))) = 0;
            e[j + 3] = ((void *)0);
            e[j] = ((void *)0);
        }
        bzero(e, 0xF8);
    }
    D_8020B098();
    D_801B0020();
    D_801C1D98();
    D_801C1A9C();
    D_801C234C();
    func_0023B498();
    func_0024128C();
    func_000016C4(D_801CE8BC);
    D_801CE8BC = ((void *)0);
}
