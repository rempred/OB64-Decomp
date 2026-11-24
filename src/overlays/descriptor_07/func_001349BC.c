typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801ED4A4[];
extern signed char *D_801ED494[];
extern u8 D_8019EE40[];
extern u16 *D_800C4C4C;
typedef struct {
    s32 id;
    s32 unk04;
    s32 lines;
    s32 x2;
    s32 y2;
    s32 w2;
    s32 h2;
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    u8 *win;
    u8 *win2;
    u8 *text;
    s32 a;
    s32 b;
    s32 c;
    signed char *opt0;
    signed char *opt1;
    s32 lenA;
    s32 lenB;
    s32 lenC;
    s32 len0;
    s32 len1;
    u8 sel;
    u8 d;
} Dialog134;
extern Dialog134 D_801ED540;
extern s32 D_801F0B40;
extern u16 *D_801F0CA0;
extern u16 *D_800C4BDC;
void func_0013511C(Dialog134 *d);
void func_00134CD4(u8 *o, s32 i);
u8 *D_8017BFB0(s32 kind, s32 b, void (*fn)(), s16 x, s16 y, s16 w, s16 h, s16 x2, s16 y2, s16 w2, s16 h2);
void D_8017C384(u8 *w);
void D_8020CDA0(s32 se);
s32 func_00135670(s32 a);
void func_001354FC(Dialog134 *d, s32 *r);
void func_00134FA8(u8 *o, s32 i);
s32 func_001349BC(s32 id, s32 a, s32 b, s32 c, s32 sel, s32 d, s32 x2) {
    s32 r[8];
    if (D_801ED540.id == -1) {
        s32 k;
        D_801ED540.d = d;
        D_801ED540.id = id;
        D_801ED540.a = a;
        D_801ED540.b = b;
        D_801ED540.c = c;
        k = func_00135670(id);
        D_801ED540.opt0 = D_801ED494[D_801ED4A4[k + 1]];
        D_801ED540.opt1 = D_801ED494[D_801ED4A4[k + 2]];
        D_801F0B40 = 0;
        D_801ED540.sel = sel != 0;
        D_801ED540.x2 = x2;
        func_0013511C(&D_801ED540);
        func_001354FC(&D_801ED540, r);
        D_801ED540.win = D_8017BFB0(4, 0, func_00134CD4, D_801ED540.x,
                                                  D_801ED540.y, D_801ED540.w,
                                                  D_801ED540.h, D_801ED540.x2,
                                                  D_801ED540.y2, D_801ED540.w2,
                                                  D_801ED540.h2);
        D_801ED540.win2 = D_8017BFB0(4, 0, func_00134FA8, r[0], r[1], r[2], r[3], r[4],
                                                   r[5], r[6], r[7]);
        return 2;
    }
    if ((*(u16 *)((u8 *)(D_801ED540.win) + (0x26))) == 0 && (*(u16 *)((u8 *)(D_801ED540.win2) + (0x26))) == 0) {
        if ((*D_800C4BDC & D_801F0CA0[0]) || (*D_800C4BDC & D_801F0CA0[1])) {
            D_8017C384(D_801ED540.win);
            D_8017C384(D_801ED540.win2);
            D_801ED540.id = -1;
            if (*D_800C4BDC & D_801F0CA0[0]) {
                s32 se;
                if (D_801ED540.sel == 0) {
                    D_8019EE40[0] = 0;
                    se = 6;
                } else {
                    D_8019EE40[0] = 1;
                    se = 1;
                }
                D_8020CDA0(se);
                return 1;
            }
            D_8020CDA0(1);
            return 3;
        } else {
            u16 pad = *D_800C4C4C;
            if (pad & 0x800) {
                if (D_801ED540.sel != 0) {
                    D_801ED540.sel = 0;
                    D_8020CDA0(2);
                }
            } else if (pad & 0x400) {
                if (D_801ED540.sel != 1) {
                    D_801ED540.sel = 1;
                    D_8020CDA0(2);
                }
            }
        }
    }
    return 2;
}
void func_00134CD4(u8 *o, s32 i);
void func_00134FA8(u8 *o, s32 i);
void func_0013511C(Dialog134 *d);
s32 func_00135670(s32 a);
