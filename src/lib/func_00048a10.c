typedef unsigned char u8;
typedef signed int s32;
void func_00048a10(u8 a, u8 b);
extern u8 D_80196A86[];
void func_00048a10(u8 n, u8 v) {
    s32 i = n - 1;
    s32 sh;
    u8 old = D_80196A86[i / 4];
    sh = (i & 3) * 2;
    old &= ~(3 << sh);
    D_80196A86[i / 4] = old | (v << sh);
}
