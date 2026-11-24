typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
void *func_00001330(s32 size);
void bzero(void *p, s32 n);
typedef struct {
    u8 unk00[0x18];
    s16 alpha;
    u8 unk1A[0x16];
    s32 x;
    s32 y;
    s32 w;
    u8 unk3C[0x94];
    u8 *text;
} Win28;
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
u8 *func_00296C50(Win28 *w, s32 a, u8 b) {
    u8 *t;
    w->text = t = func_00001330(0x604);
    bzero(t, 0x604);
    t = w->text;
    *(s32 *)(t + 0x600) = a;
    t[0x5F3] = 0x3F;
    t[0x5F6] = 0xF;
    t[0x5F0] = 0;
    t[0x5FE] = 2;
    bzero(t, 0x500);
    t[0x5F4] = b;
    t[0x5F5] = b;
    return t;
}
