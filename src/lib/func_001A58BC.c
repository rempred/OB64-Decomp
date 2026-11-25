typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_000016C4(void *ptr);
extern u8 D_8017C584[];
s32 D_8017F36C(u16);
void *D_8017BFB0(u16, u8, void *c, s16, s16, s16, s16, s16, s16, s16, s16);
u8 *D_8017F334(u16);
void D_801807F4(u8 *w, s32 a);
void func_001A58BC(s32 a) {
    u8 *w;
    if (D_8017F36C(5) == 0) {
        w = D_8017BFB0(5, 0, D_8017C584, 0x98, 0xAA, 0xA8, 0xBA, 0x1C, 0x9E, 0x124, 0xC6);
    } else {
        w = D_8017F334(5);
        func_000016C4((*(void * *)((u8 *)(w) + (0xD0))));
    }
    D_801807F4(w, a);
}
