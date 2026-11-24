typedef unsigned char u8;
typedef signed int s32;
extern u8 D_8023E0DC[];
void func_00295D70(s32 n, signed char *out) {
    signed char buf[20];
    u8 *d = D_8023E0DC;
    s32 i;
    s32 q;
    for (i = 0; i < 20; i++) {
        if (n == 0) {
            out[i] = 0;
            break;
        }
        q = n % 10;
        n /= 10;
        buf[i] = d[q];
    }
    for (n = 0; n < i; n++) {
        *out++ = buf[i - n - 1];
    }
}
