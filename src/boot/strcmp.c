typedef unsigned char u8;
typedef signed int s32;
s32 strcmp(const u8 *a, const u8 *b);
s32 strcmp(const u8 *a, const u8 *b) {
    u8 c1 = *a++;
    u8 c2 = *b++;
    if (c1 != c2) {
        return c1 - c2;
    }
    if (c1 == 0) {
        return 0;
    }
    return strcmp(a, b);
}
