typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct {
    u8 b[0xE];
} Group87;
extern u8 D_80193AB0[];
void func_000bb0cc(void) {
    u8 seen[10];
    s32 i;
    s32 n;
    bzero(seen, 10);
    n = 0;
    for (i = 0; i < 10; i++) {
        s32 g = D_80193AB0[i];
        if (g != 0xFF) {
            u8 *gr = D_80196AF8 + 0x10D4;
            if (((Group87 *)gr)[g].b[8] != 0) {
                if (++seen[g] == 1) {
                    D_80193AB0[n] = g;
                    n++;
                }
                continue;
            }
        }
        D_80193AB0[n] = 0xFF;
    }
    for (i = 0; i < 10; i++) {
        u8 *gr = D_80196AF8 + 0x10D4;
        if (((Group87 *)gr)[i].b[8] != 0 && seen[i] == 0) {
            D_80193AB0[n] = i;
            n++;
            seen[i]++;
        }
    }
    if (n < 6) {
        D_80193AB0[n] = 0xFF;
    }
}
