typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
void *func_000016C4(void *ptr);
typedef struct {
    u8 unk000[0xE8];
    s32 wE8;
    s32 wEC;
    s32 wF0;
    s32 wF4;
    s32 wF8;
    u8 unk0FC[0x20];
    f32 f11C;
    f32 f120;
    f32 f124;
    s32 w128;
    f32 f12C;
    f32 f130;
    s16 h134;
    s16 h136;
    u8 unk138[2];
    s16 h13A;
    u8 unk13C;
    u8 b13D;
    u8 unk13E[7];
    u8 b145;
    u8 b146;
    u8 b147;
    u8 unk148;
    u8 b149;
} BUnit;
typedef struct {
    f32 f0;
    u8 unk4[4];
    f32 f8;
    s16 hC;
    u8 bE;
} BObj;
typedef struct {
    u8 unk00[0x18];
    BUnit *units[0x38];
    BObj *objs[1];
} Battle;
extern Battle *D_8022A974;
void bzero(void *p, s32 n);
void D_8019F3CC(void);
void func_0029D8BC(void) {
    u8 i;
    for (i = 0; i < 0x1C; i++) {
        func_000016C4(D_8022A974->units[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0xF8)))[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0x168)))[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0x248)))[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0x2B8)))[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0x1A50)))[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0x1D8)))[i]);
        func_000016C4(((void **)((u8 *)(D_8022A974) + (0x88)))[i]);
    }
    bzero(((void **)((u8 *)(D_8022A974) + (0x18))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0xF8))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0x168))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0x248))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0x1D8))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0x2B8))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0x1A50))), 0x70);
    bzero(((void **)((u8 *)(D_8022A974) + (0x88))), 0x70);
    D_8019F3CC();
}
void func_0029D8BC(void);
