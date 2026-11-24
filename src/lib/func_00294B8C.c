typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void bzero(void *p, s32 n);
typedef struct {
    u8 unk0[4];
    u8 **ptrs;
} PtrTbl28;
void bzero(void *p, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
void bzero(void *p, s32 n);
void func_00294B8C(u8 *o, u16 idx, PtrTbl28 *t) {
    u8 *src = t->ptrs[idx];
    s16 n = o[0x5F4];
    s32 i;
    bzero(o, 0x500);
    memcpy_aligned(o, src, 0x500);
    for (i = 0; i < n; i++) {
        *(u8 **)(o + 0x530 + i * 4) = o + (t->ptrs[idx + i] - t->ptrs[idx]);
    }
}
