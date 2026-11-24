void bzero(void *p, int n);
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(unsigned int);
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
void func_0029E7E0(u8 *e);
s32 func_002A13EC(s32 a, s32 b, s32 c, s32 d);
void *func_0002CD70(void *p, s32 c, u32 n);
void func_0029F5E8();
s32 func_0029A7C4(u8 i, s32 kind, s32 sub, s32 mode, s32 x, s32 y, s32 layer, s32 time, s32 flags) {
    u8 *e;
    if ((*(u8 * *)((u8 *)(D_8022A974) + (0x1AC0 + i * 4))) != ((void *)0)) {
        func_000016C4((*(u8 * *)((u8 *)(D_8022A974) + (0x1AC0 + i * 4))));
    }
    e = func_00001330(0x50);
    (*(u8 * *)((u8 *)(D_8022A974) + (0x1AC0 + i * 4))) = e;
    e[0x4A] = layer;
    (*(s32 *)((u8 *)(e) + (0x2C))) = i;
    if (kind != -1) {
        (*(s32 *)((u8 *)(e) + (0x30))) = kind;
    }
    if (sub != -1) {
        (*(s16 *)((u8 *)(e) + (0x44))) = sub;
    }
    (*(s16 *)((u8 *)(e) + (0x42))) = func_002A13EC((*(s32 *)((u8 *)(e) + (0x30))), (*(s16 *)((u8 *)(e) + (0x44))), mode, 0);
    (*(s32 *)((u8 *)(e) + (0x34))) = -1;
    (*(s32 *)((u8 *)(e) + (0x38))) = 0;
    (*(s32 *)((u8 *)(e) + (0x3C))) = 0;
    if (x != -1 || y != -1) {
        (*(s32 *)((u8 *)(e) + (0x24))) = x;
        (*(s32 *)((u8 *)(e) + (0x28))) = -y;
    }
    (*(void * *)((u8 *)(e) + (0x20))) = func_0029F5E8;
    e[0x4B] = mode;
    (*(s16 *)((u8 *)(e) + (0x46))) = 0;
    (*(s16 *)((u8 *)(e) + (0x40))) = 180;
    (*(u16 *)((u8 *)(e) + (0x48))) = time;
    e[0x4C] = flags;
    func_0002CD70(e, 0xFF, 0x10);
    bzero(e + 0x10, 0x10);
    func_0029E7E0(e);
    return 0;
}
