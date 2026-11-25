typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
void *func_00001330(s32 size);
extern u8 *D_8022A974;
extern u8 D_8018FC19;
void guMtxIdent(u8 *e);
void func_002AF78C(void) {
    u8 *b;
    s16 i;
    if (D_8018FC19 == 0) {
        f32 one = 1.0f;
        u8 *buf;
        b = func_00001330(0x6E0);
        (*(u8 * *)((u8 *)(D_8022A974) + (0x1C54))) = b;
        buf = b;
        bzero(buf, 0x6E0);
        for (i = 0; i < 20; i++) {
            u8 *s = D_8022A974;
            u8 *e;
            ((u8 **)(s + 0x1C54))[i] = e = buf + i * 0x58;
            (*(f32 *)((u8 *)(e) + (0x54))) = one;
            guMtxIdent(((u8 **)(D_8022A974 + 0x1C54))[i]);
        }
    }
}
