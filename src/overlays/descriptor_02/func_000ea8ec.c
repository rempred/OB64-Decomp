typedef unsigned char u8;
typedef signed int s32;
s32 func_000ea8ec(u8 *s) {
    return (s[0] - '0') * 100 + (s[1] - '0') * 10 + (s[2] - '0');
}
