void bzero(void *memory, unsigned int bytes);
typedef unsigned char u8;
typedef signed int s32;
extern u8 D_80197710[];
extern u8 D_80193BD1[][0x38];
void func_000bae38(void) {
    u8 seen[100];
    s32 i;
    s32 n;
    bzero(seen, 100);
    n = 1;
    for (i = 1; i < 100; i++) {
        s32 c = D_80197710[i];
        if ((c == 0) & (i != 0)) {
            continue;
        }
        if (c != 0xFF) {
            if (D_80193BD1[c][0] >= 2) {
                if (++seen[c] == 1) {
                    D_80197710[n] = c;
                    n++;
                }
                continue;
            }
        }
        D_80197710[n] = 0xFF;
    }
    {
        u8 *s = seen;
        for (i = 0; i < 100; i++) {
            if (D_80193BD1[i][0] != 0 && *s == 0) {
                D_80197710[n] = i;
                n++;
                (*s)++;
            }
            s++;
        }
    }
    for (n = 1, i = 1; i < 100; i++) {
        u8 c = D_80197710[i];
        if (c != 0) {
            D_80197710[n] = c;
            n++;
        }
    }
    if (n < 100) {
        D_80197710[n] = 0xFF;
    }
}
