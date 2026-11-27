typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
void bzero(void *p, s32 n);
u8 func_000da69c(void);
u8 func_000da69c(void) {
    u8 used[6];
    s32 i;
    bzero(used, 6);
    for (i = 0; i < 10; i++) {
        u8 *sq = D_80196AF8 + 0x10D4 + i * 0xE;
        if (sq[8] != 0 && sq[0] != 0) {
            used[sq[0] - 1] = 1;
        }
    }
    for (i = 0; i < 6; i++) {
        if (used[i] == 0) {
            break;
        }
    }
    return i + 1;
}
