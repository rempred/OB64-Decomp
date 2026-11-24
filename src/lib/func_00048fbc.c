typedef unsigned char u8;
typedef signed int s32;
extern struct { u8 v; u8 pad[55]; } D_80193BD1[];
extern struct { u8 v; u8 pad[55]; } D_80193BD2[];
u8 func_00045e5c(u8 a, u8 b);
extern inline s32 func_000484c0(u8 c) {
    s32 r = 0;
    if ((u8)(c - 0x2D) < 2 || c == 0x2F || (u8)(c - 0x24) < 2 || c == 0x30) {
        r = 1;
    }
    return r;
}
extern u8 D_80193BC0[][0x38];
void func_00048b44(u8 *c);
void func_00048fbc(u8 v, u8 cls, u8 base) {
    u8 i;
    for (i = 1; i < 100; i++) {
        if (func_000484c0(D_80193BD2[i].v) == 0) {
            if (func_00045e5c(D_80193BD1[i].v, v) == 1) {
                D_80193BD2[i].v = cls;
                D_80193BD1[i].v = base;
                func_00048b44(D_80193BC0[i]);
            }
        }
    }
}
