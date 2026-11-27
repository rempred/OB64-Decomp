typedef unsigned char u8;
typedef signed int s32;
typedef struct {
    u8 v[17];
} Order1B2;
extern Order1B2 D_8021C928;
extern u8 D_8021C594[17][16];
void func_001B45CC(u8 *src) {
    Order1B2 t = D_8021C928;
    s32 i;
    for (i = 0; i < 17; i++) {
        D_8021C594[i][0] = src[t.v[i] * 4 + 0];
        D_8021C594[i][1] = src[t.v[i] * 4 + 1];
        D_8021C594[i][2] = src[t.v[i] * 4 + 2];
        D_8021C594[i][3] = src[t.v[i] * 4 + 3];
    }
}
