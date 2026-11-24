typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void *func_00001330(s32 size);
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
void func_0029BA80(s32 i, s32 r, s32 g, s32 b, s32 a0, s32 a1, s32 a2, s32 dur, s32 time) {
    s16 j;
    s16 end;
    u8 *rec;
    j = 0;
    end = 0x1C;
    if (i != -1) {
        j = i;
        end = i + 1;
    }
    for (; j < end; j++) {
        if ((*(u8 * *)((u8 *)(D_8022A974) + (0x248 + j * 4))) != ((void *)0)) {
            func_000016C4((*(u8 * *)((u8 *)(D_8022A974) + (0x248 + j * 4))));
        }
        if (i != -1 || (*(u8 * *)((u8 *)(D_8022A974) + (0x18 + j * 4))) != ((void *)0)) {
            rec = func_00001330(0xC);
            (*(u8 * *)((u8 *)(D_8022A974) + (0x248 + j * 4))) = rec;
            rec[0] = r;
            rec[1] = g;
            rec[2] = b;
            rec[3] = a0;
            rec[4] = a1;
            rec[5] = a2;
            (*(u16 *)((u8 *)(rec) + (8))) = dur;
            (*(s16 *)((u8 *)(rec) + (0xA))) = 0;
            (*(s16 *)((u8 *)(rec) + (6))) = time;
        }
    }
}
