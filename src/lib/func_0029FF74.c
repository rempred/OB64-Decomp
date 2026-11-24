typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef float f32;
void *D_8009DBB8(void *dst, u32 handle);
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
extern u8 *D_801CE8BC;
extern u8 *D_801CE8BC;
s32 func_0029FF74(s32 k) {
    BUnit *u = D_8022A974->units[k];
    s32 v;
    if (u == ((void *)0)) {
        return -1;
    }
    if ((*(u8 *)((u8 *)(u) + (0x147))) == 0xFF) {
        u16 r = 0;
        u16 *t = D_8009DBB8(((void *)0), 0x01A8E7AE);
        s16 i = 0;
        if (t[0] != 0xFFFF) {
            s32 n = u->wE8 - 1;
            while (1) {
                if (n == i) {
                    r = t[t[n] + u->b146];
                    break;
                }
                i++;
                if (t[i] == 0xFFFF) {
                    break;
                }
            }
        }
        func_000016C4(t);
        return (s16)r;
    }
    if ((v = (*(s32 *)((u8 *)(D_801CE8BC + (*(u8 *)((u8 *)(u) + (0x147))) * 0xF8) + (0x20C)))) == 0) {
        return -1;
    }
    return (s16)v;
}
