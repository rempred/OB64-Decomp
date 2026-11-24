typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
void *memcpy_00023884(void *dst, const void *src, u32 n);
void *memcpy_00023884(void *dst, const void *src, u32 n);
inline void func_0020FDC0(u8 *base, s32 size, s32 n, s32 (*cmp)(void *, void *)) {
    void *tmp = func_00001330(size);
    s32 i;
    s32 j;
    u8 *src;
    for (i = 1; i < n; i++) {
        src = base;
        src += i * size;
        memcpy_00023884(tmp, src, size);
        for (j = i - 1; j >= 0 && cmp(tmp, base + j * size) < 0; j--) {
            memcpy_00023884(base + (j + 1) * size, base + j * size, size);
        }
        memcpy_00023884(base + (j + 1) * size, tmp, size);
    }
    func_000016C4(tmp);
}
