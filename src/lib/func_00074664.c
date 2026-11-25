typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8019780C;
void func_0001aaa0(void);
void func_0001aac0(void);
void func_0001afd0(void *p, s32 k);
void func_0001b240(void *a, void *b);
void func_0001b2e0(void *p, void *a, void *b);
s32 func_00074664(s32 k) {
    s32 r = 0;
    s32 o;
    s32 v;
    (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = 0;
    func_0001aaa0();
    func_0001afd0(D_8019780C + 0x254, 0);
    v = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)));
    if (v != 0) {
        (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = v;
        r = v == 10;
    } else {
        o = k * 32 + 0x54;
        func_0001b240(D_8019780C + o + 8, D_8019780C + o + 4);
        func_0001b2e0(D_8019780C + 0x254, D_8019780C + o + 0xE, D_8019780C + o + 0xA);
        if ((*(s32 *)((u8 *)(D_8019780C) + (0x25C))) != 0) {
            (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)));
        }
        func_0001aac0();
    }
    return r;
}
