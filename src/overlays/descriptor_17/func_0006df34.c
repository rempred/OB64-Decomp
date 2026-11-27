typedef unsigned char u8;
typedef signed int s32;
extern s32 D_80196A6C;
extern signed char D_80196A58[];
extern signed char D_8019C510[];
extern u8 D_80196AE9;
signed char *func_0002C950(signed char *dst, signed char *src);
void func_0006d3d0(void);
void func_0006df34(void) {
    func_0006d3d0();
    func_0002C950(D_80196A58, D_8019C510);
    D_80196A6C = 1000;
    D_80196AE9 = 0;
}
