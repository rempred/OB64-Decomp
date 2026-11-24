typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
void func_00294E04(void *p);
extern u16 D_80196A28;
extern u8 D_80196A2A;
extern u8 D_80196A2B;
extern signed char *D_8023E0B0[10];
extern signed char *D_8023E0D8;
void strcat_0002ca20(void *dst, void *src);
void func_0002C950(signed char *dst, signed char *src);
void func_00294E04(void *p) {
    s32 h;
    s32 m;
    s32 s;
    if (D_80196A28 >= 100) {
        h = 99;
        m = 59;
        s = 59;
    } else {
        h = D_80196A28;
        m = D_80196A2A;
        s = D_80196A2B;
    }
    *(u8 *)p = 0;
    func_0002C950(p, D_8023E0B0[h / 10]);
    strcat_0002ca20(p, D_8023E0B0[h % 10]);
    strcat_0002ca20(p, D_8023E0D8);
    strcat_0002ca20(p, D_8023E0B0[m / 10]);
    strcat_0002ca20(p, D_8023E0B0[m % 10]);
    strcat_0002ca20(p, D_8023E0D8);
    strcat_0002ca20(p, D_8023E0B0[s / 10]);
    strcat_0002ca20(p, D_8023E0B0[s % 10]);
}
