typedef unsigned char u8;
typedef signed int s32;
signed char *func_0002C950(signed char *dst, signed char *src);
s32 strlen(signed char *s);
void func_0007828c(u8 *s, u8 *tmp) {
    s32 n;
    s32 i;
    s32 len;
    func_0002C950((signed char *)tmp, (signed char *)s);
    n = strlen((signed char *)s);
    len = 0;
    for (i = 0; i < n; i++) {
        if (tmp[i] == '@') {
            s[len] = '{';
            s[len + 1] = 'T';
            s[len + 2] = '0';
            s[len + 3] = '9';
            s[len + 4] = '}';
            len += 5;
        } else {
            s[len] = tmp[i];
            len++;
        }
    }
    s[len] = '\0';
}
