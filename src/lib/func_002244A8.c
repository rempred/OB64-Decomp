typedef unsigned char u8;
typedef signed int s32;
typedef struct {
    u8 unk00[0x40];
    s32 flags;
    u8 unk44[0x50];
    s32 w94;
} Msg21;
void D_801D9F60(s32 a, s32 b, s32 c, s32 d);
typedef struct {
    s32 w[20];
} Blob50;
void D_801AD9D4(Blob50 *b, s32 a);
s32 D_801AE4EC(s32 a, Blob50 *b, s32 c);
extern inline s32 func_0022257C(Blob50 *o, s32 a, s32 c) {
    Blob50 copy = *o;
    D_801AD9D4(&copy, a);
    return D_801AE4EC((*(s32 *)((u8 *)((*(u8 * *)((u8 *)(o) + (0x4C)))) + (0x40))), &copy, c);
}
s32 D_801D9F8C(s32, s32, void *, s32, s32);
s32 D_801C8E9C(u8 *u);
s32 D_801D9F8C(s32, s32, void *, s32, s32);
extern u8 *D_801CE8BC;
s32 D_801D9F8C(s32, s32, void *, s32, s32);
extern u8 *D_801CE8BC;
void D_801D9FF0(s32 a, s32 b, u8 *c, s32 d, s32 e, s32 f, s32 g);
void func_002244A8(u8 *m, s32 a, s32 pos, s32 c, s32 e) {
    u8 *busy[6];
    s32 n;
    s32 i;
    u8 *u;
    u8 *base;
    s32 line;
    if (D_801C8E9C(m) == 0) {
        n = 0;
        ((Msg21 *)m)->w94 = pos;
        for (i = 0; i < 20; i++) {
            u = D_801CE8BC + 0x1C4 + i * 0xF8;
            if ((*(s32 *)((u8 *)(u) + (0x40))) & 0x2000) {
                busy[n++] = u;
            }
        }
        for (i = 0; i < n; i++) {
            s32 t = ((Msg21 *)busy[i])->w94;
            if (((Msg21 *)m)->w94 < t) {
                ((Msg21 *)m)->w94 = t;
            }
        }
        if (pos < ((Msg21 *)m)->w94) {
            pos = ((Msg21 *)m)->w94;
        }
        D_801D9FF0(0xC, pos, m, 0xFF, 0xFF, 0xFF, c);
        line = pos + (func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x11, 0) + a);
        D_801D9F60(0xD, line, (s32)m, 0xFF);
        line += func_0022257C((Blob50 *)((*(u8 * *)((u8 *)(m) + (0))) + 0x44), 0x12, 0);
        base = D_801CE8BC;
        for (i = 0; i < 20; i++) {
            u = base + 0x1C4 + i * 0xF8;
            if ((*(s32 *)((u8 *)(u) + (0x48))) == 0 && (*(s32 *)((u8 *)(u) + (0x4C))) == 0) {
                (*(s32 *)((u8 *)(u) + (0x4C))) = 1;
                break;
            }
        }
        D_801D9F8C(0x39, line, m, e, i);
        D_801D9F60(0x3A, line + 0x23, (s32)m, i);
        ((Msg21 *)m)->w94 = line + 0x23;
        return;
    }
    D_801D9FF0(0xC, pos, m, 0xFF, 0xFF, 0xFF, c);
}
