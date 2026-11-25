typedef unsigned char u8;
typedef signed int s32;
extern u8 D_80187C59[];
extern u8 D_80187C1A[];
s32 func_001A8C70(u8 a, u8 b) {
    if (D_80187C59[a * 72] != b) {
        return D_80187C1A[b * 72] == 2;
    }
    return D_80187C1A[a * 72] == 2;
}
