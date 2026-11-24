typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *func_000016C4(void *ptr);
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
typedef struct {
    s16 v[12];
} Steps29A;
extern Steps29A D_80239198;
s32 func_002A08C0(s32 i, s32 a, s32 b, s32 c, f32 x, f32 y, f32 z, s32 d, s32 e);
void func_0029C790(void) {
    Steps29A tab = D_80239198;
    u32 i;
    s16 *o;
    s16 v;
    for (i = 0; i < 28; i++) {
        o = (*(s16 * *)((u8 *)(D_8022A974) + (0x168 + i * 4)));
        if (o == ((void *)0)) {
            continue;
        }
        if (o[3] == 0) {
            o[1]--;
            o[3] = o[2];
            o[0] = v = o[0] + o[4];
            if (v < 0) {
                o[0] = v + 12;
            } else if (v >= 12) {
                o[0] = v - 12;
            }
            func_002A08C0(i, -1, -1, tab.v[o[0]], -1.0f, -1.0f, -1.0f, -1, 1);
            if (o[1] == 0) {
                func_000016C4(o);
                o = ((void *)0);
                (*(s32 *)((u8 *)(D_8022A974) + (0x168 + i * 4))) = 0;
            }
        }
        if (o != ((void *)0)) {
            o[3]--;
        }
    }
}
