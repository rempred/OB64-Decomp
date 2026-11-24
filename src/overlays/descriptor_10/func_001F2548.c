typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk0[4];
    s16 flag;
} Opt1F;
extern u8 D_800EB1F0[];
extern Opt1F D_801CE900[];
extern u8 D_801939CC;
void func_00208DC8(void *ch, s32 id);
s32 D_8016FEF4(s32 flag);
extern inline Opt1F *func_001F21A4(s32 i) {
    if (D_8016FEF4(D_801CE900[i].flag) && ((D_801939CC >> i) & 1)) {
        return &D_801CE900[i];
    }
    return ((void *)0);
}
extern inline s32 func_001F2214(void) {
    s32 n = 0;
    u32 i;
    for (i = 0; i < 6; i++) {
        n += func_001F21A4(i) != ((void *)0);
    }
    return n;
}
extern u16 D_800E8700;
void func_001F2548(u8 *o) {
    s32 n = func_001F2214();
    if (D_800E8700 & 0x800) {
        if ((s8)o[0x22] > 0) {
            o[0x22]--;
            func_00208DC8(D_800EB1F0, 2);
        }
    }
    if (D_800E8700 & 0x400) {
        if ((s8)o[0x22] + 1 < n) {
            o[0x22]++;
            func_00208DC8(D_800EB1F0, 2);
        }
    }
}
