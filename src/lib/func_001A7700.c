typedef unsigned char u8;
typedef signed int s32;
extern s32 D_80219664;
extern u8 D_80219670[];
extern u8 D_80219670[5];
extern u8 D_80219619[5];
void func_001A7700(void) {
    s32 n;
    s32 i;
    bzero(D_80219619, 5);
    D_80219619[0] = 1;
    n = D_80219664;
    if (n < 3 && D_80219670[n + 2] != 0xFF) {
        D_80219619[1 + n % 2] = 1;
        D_80219619[3 + D_80219664 % 2] = 1;
    }
    for (i = 1; i < 5; i++) {
        u8 v = D_80219670[i];
        if (v != 0xFF) {
            D_80219619[i] = 0;
        } else if (D_80219664 % 2 == i % 2 || (i >= 3 && D_80219670[i - 2] == v)) {
            D_80219619[i] = 1;
        }
    }
    D_80219619[D_80219664] = 1;
}
