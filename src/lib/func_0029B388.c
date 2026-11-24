typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_00001330(s32 size);
typedef struct {
    void *data;
    s16 h4;
} Grid29;
typedef struct {
    u8 from[3];
    u8 to[3];
    s16 h6;
    s16 h8;
    s16 hA;
} Pair29;
typedef struct {
    u8 unk0000[0x168];
    void *p168[0x38];
    Pair29 *p248[0x5BF];
    void *p1944[0x1C];
    u8 unk19B4[0x94];
    Grid29 *grid;
    u8 unk1A4C[0x168];
    void *p1BB4[20];
} Battle29;
extern Battle29 *D_8022A974;
void func_0029B388(s32 a, s32 b);
typedef struct {
    s16 x[4];
    s16 y[4];
} Quad29;
typedef struct {
    u16 h[8];
} Vtx29;
void func_0029D468(Vtx29 *p, s16 a, s16 b, s32 c);
void func_0029B388(s32 a, s32 b) {
    Vtx29 *v;
    s32 i;
    s32 j;
    Quad29 p;
    Quad29 first;
    Quad29 c;
    v = func_00001330(0x3A0);
    D_8022A974->grid->data = v;
    c.x[0] = -a;
    c.x[1] = -a;
    c.x[2] = a;
    c.x[3] = a;
    c.y[0] = b;
    c.y[1] = -b;
    c.y[2] = -b;
    c.y[3] = b;
    for (i = 0; i < 4; i++) {
        p.x[1] = 0x140;
        p.y[1] = 0xD8;
        switch (i) {
            case 0:
                p.x[1] = -0x140;
                break;
            case 1:
                p.x[1] = -0x140;
                p.y[1] = -0xD8;
                break;
            case 2:
                p.y[1] = -0xD8;
                break;
        }
        p.x[1] /= 2;
        p.y[1] /= 2;
        for (j = 0; j < 1; j++) {
            p.x[0] = c.x[i] + 10;
            p.y[0] = c.y[i] + 10;
            p.x[0] /= 2;
            p.y[0] /= 2;
            func_0029D468(v++, p.x[0], p.y[0], 10);
            func_0029D468(v++, p.x[1], p.y[1], 200);
            if (j == 0 && i == 0) {
                first.x[0] = p.x[0];
                first.x[1] = p.x[1];
                first.y[0] = p.y[0];
                first.y[1] = p.y[1];
            }
        }
    }
    func_0029D468(v++, first.x[0], first.y[0], 10);
    func_0029D468(v++, first.x[1], first.y[1], 200);
}
