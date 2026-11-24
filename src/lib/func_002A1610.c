typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
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
void func_002A1610(s32 i, f32 unused1, f32 v, f32 unused3) {
    s16 k;
    s32 end;
    s16 start;
    if (i == -1) {
        start = 0;
        end = 28;
    } else {
        start = i;
        end = i;
        end++;
    }
    for (k = start; k < (s16)end; k++) {
        if (D_8022A974->units[k] != ((void *)0)) {
            D_8022A974->units[k]->f12C = v;
        }
    }
}
