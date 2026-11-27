typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F0E00;
extern s32 D_801F0DE0;
extern s32 D_801F3658;
extern s8 D_801F3680;
extern s16 D_801F36D0;
extern u8 D_801F3674;
extern u32 *D_801F0CB0[];
extern u8 D_801969BA[];
extern s32 D_801F0E04;
s32 func_0012E968(void *);
s32 func_0012E950(s32);
void D_8020CDA0(s32 k);
void func_0010BFDC(void) {
    u32 *u = D_801F0CB0[D_801F3658];
    s32 k = func_0012E968(u);
    s32 cur;
    if (!(*u & 0x80)) {
        cur = func_0012E950(D_801969BA[k * 11]);
        u = D_801F0CB0[cur];
    } else {
        cur = D_801F3658;
    }
    if (!(*u & 0x4000)) {
        D_801F0DE0 = 0x10;
        D_801F0E00 = cur;
        D_801F0E04 = k;
    } else {
        D_801F0DE0 = 9;
        D_801F3680 = 0xC;
        D_801F36D0 = 0xE;
        D_8020CDA0(9);
        D_801F3674 = 1;
    }
}
