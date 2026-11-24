typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
s32 strlen(const signed char *s);
u16 D_801794C8(signed char *s);
s32 func_002962D8(s32 n, signed char *str, signed char *p) {
    u8 saved = *p;
    s32 w;
    s32 len;
    *p = 0;
    len = strlen(str);
    w = 0;
    if (len != 0) {
        w = D_801794C8(str);
    }
    *p = saved;
    if (len != 0) {
        return n * 11 < w;
    }
    return 0;
}
