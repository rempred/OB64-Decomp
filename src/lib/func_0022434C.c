typedef unsigned char u8;
typedef signed int s32;
typedef struct {
    u8 unk00[0x40];
    s32 flags;
    u8 unk44[0x50];
    s32 w94;
} Msg21;
void D_801D9F60(s32 a, s32 b, s32 c, s32 d);
void func_00224004(u8 *m, s32 a, s32 pos, s32 c, s32 d, u8 f, s32 g, s32 h, s32 k);
void D_801D9F8C(s32 a, s32 b, s32 c, s32 d, s32 e);
void func_00224004(u8 *m, s32 a, s32 pos, s32 c, s32 d, u8 f, s32 g, s32 h, s32 k);
extern u8 *D_801CE8BC;
void func_0022434C(u8 *m, s32 a, s32 pos, s32 c, s32 d, s32 e) {
    u8 *busy[6];
    s32 n = 0;
    s32 i;
    u8 *u;
    s32 line;
    u8 *base;
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
    func_00224004(m, a, pos, c, d, 0, 1, 0, 0);
    line = ((Msg21 *)m)->w94;
    i = 0;
    base = D_801CE8BC;
    for (; i < 20; i++) {
        u = base + 0x1C4 + i * 0xF8;
        if ((*(s32 *)((u8 *)(u) + (0x48))) == 0 && (*(s32 *)((u8 *)(u) + (0x4C))) == 0) {
            (*(s32 *)((u8 *)(u) + (0x4C))) = 1;
            break;
        }
    }
    D_801D9F8C(0x39, line, (s32)m, e, i);
    D_801D9F60(0x3A, line + 0x23, (s32)m, i);
    ((Msg21 *)m)->w94 = line + 0x23;
}
