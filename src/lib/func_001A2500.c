typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 D_801971F2[];
u16 D_8020153C(s32 a, u8 c);
s32 func_001A2500(u8 u) {
    s32 sum = 0;
    s32 i;
    u8 *r = D_801971F2 + u * 25;
    for (i = 0; i < 5; i++) {
        if (r[i] != 0) {
            sum += D_8020153C(0, r[i]);
        }
    }
    return sum;
}
