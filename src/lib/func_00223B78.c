typedef unsigned char u8;
typedef signed int s32;
void D_801D9F60(s32 a, s32 b, s32 c, s32 d);
typedef struct {
    s32 w[20];
} Blob50;
void D_801AD9D4(Blob50 *b, s32 a);
s32 D_801AE4EC(s32 a, Blob50 *b, s32 c);
s32 func_00222E50(u8 *o, s32 a, u8 b);
extern inline s32 func_0022257C(Blob50 *o, s32 a, s32 c) {
    Blob50 copy = *o;
    D_801AD9D4(&copy, a);
    return D_801AE4EC((*(s32 *)((u8 *)((*(u8 * *)((u8 *)(o) + (0x4C)))) + (0x40))), &copy, c);
}
s32 D_801D9F8C(s32, s32, void *, s32, s32);
void D_801D9F30(s32 a, s32 b, s32 c);
s32 D_801C8E9C(u8 *u);
s32 D_801C8E64(u8 *u);
s32 D_801C8E80(u8 *u);
void func_00223B78(u8 *m, s32 pos, s32 hit, u8 extra) {
    if (D_801C8E9C(m) == 0) {
        D_801D9F60(hit ? 0xD : 0x12, pos, (s32)m, 0xFF);
        pos += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), hit ? 0x12 : 0x1A, 0);
    } else {
        D_801D9F30(0x2C, pos, (s32)m);
    }
    if (extra != 0) {
        pos = func_00222E50(m, pos, extra);
    } else if (D_801C8E9C(m) == 0) {
        if (D_801C8E64(m) != 0) {
            D_801D9F8C(0x1D, pos, m, 0xFF, 0x20);
            pos += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x20, 0);
        } else if (D_801C8E80(m) != 0) {
            D_801D9F8C(0x1D, pos, m, 0xFF, 0x22);
            pos += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x22, 0);
        }
    }
    (*(s32 *)((u8 *)(m) + (0x94))) = pos;
}
s32 D_801D9F8C(s32, s32, void *, s32, s32);
s32 D_801D9F8C(s32, s32, void *, s32, s32);
