typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void func_000016C4(void *p);
void *D_8009DBB8(void *dst, s32 id);
void func_000493d4(s16 *grp, s16 *pos, u8 id) {
    u16 *t;
    u16 *ids;
    s16 g = 0;
    s16 n = 0;
    u16 i;
    u16 j;
    t = D_8009DBB8(((void *)0), 0x01A8E7AE);
    ids = t + t[0];
    for (i = 0; ids[i] != 0xFFFF; i++) {
        if (id == ids[i]) {
            for (j = 0; t[j] != 0xFFFF; j++) {
                if (i < t[j] - t[0]) {
                    break;
                }
            }
            g = j - 1;
            n = i - t[j];
            break;
        }
    }
    func_000016C4(t);
    *grp = g;
    *pos = n;
}
